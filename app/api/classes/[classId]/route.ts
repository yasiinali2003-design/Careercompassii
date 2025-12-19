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
        { success: false, error: 'Luokan tunniste puuttuu' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      console.warn('[API/GetClass] Supabase not configured - using local mock store');
      const fs = require('fs');
      const path = require('path');
      const mockPath = path.join(process.cwd(), 'mock-db.json');
      let store: any = { classes: [], pins: {}, results: [] };
      try {
        if (fs.existsSync(mockPath)) {
          store = JSON.parse(fs.readFileSync(mockPath, 'utf8')) || store;
        }
      } catch (error) {
        console.warn('[API/GetClass] Failed to read mock-db.json:', error);
      }

      const cls = (store.classes || []).find((c: any) => String(c.id) === String(classId));

      if (!cls) {
        return NextResponse.json(
          { success: false, error: 'Luokkaa ei löydy' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        class: {
          id: cls.id,
          classToken: cls.class_token,
          teacherId: cls.teacher_id || 'mock-teacher',
          createdAt: cls.created_at || new Date().toISOString()
        }
      });
    }

    // Fetch class from database
    const { data, error } = await supabaseAdmin
      .from('classes')
      .select('id, class_token, teacher_id, created_at')
      .eq('id', classId)
      .single() as { data: { id: string; class_token: string; teacher_id: string; created_at: string } | null; error: any };

    if (error || !data) {
      console.error('[API/GetClass] Error:', error);
      return NextResponse.json(
        { success: false, error: 'Luokkaa ei löydy' },
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
      { success: false, error: 'Sisäinen palvelinvirhe' },
      { status: 500 }
    );
  }
}

