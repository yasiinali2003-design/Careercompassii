/**
 * GET /api/classes/[classId]
 * Get class details by ID
 * 
 * Response: { success: boolean, class: { id, classToken, teacherId, createdAt } }
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

interface RouteParams {
  params: {
    classId: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { classId } = params;

    if (!classId) {
      return NextResponse.json(
        { success: false, error: 'Missing classId' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      console.warn('[API/GetClass] Supabase not configured - returning mock response');
      return NextResponse.json({
        success: true,
        class: {
          id: classId,
          classToken: 'MOCK' + classId.substring(0, 8),
          teacherId: 'mock-teacher',
          createdAt: new Date().toISOString()
        }
      });
    }

    // Fetch class from database
    const { data, error } = await supabaseAdmin
      .from('classes')
      .select('id, class_token, teacher_id, created_at')
      .eq('id', classId)
      .single();

    if (error) {
      console.error('[API/GetClass] Error:', error);
      return NextResponse.json(
        { success: false, error: 'Class not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      class: {
        id: data.id,
        classToken: data.class_token,
        teacherId: data.teacher_id,
        createdAt: data.created_at
      }
    });

  } catch (error) {
    console.error('[API/GetClass] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

