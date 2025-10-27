/**
 * POST /api/classes
 * Create a new teacher class
 * 
 * Request: { teacherId: string }
 * Response: { classId: string, classToken: string, createdAt: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateClassToken } from '@/lib/teacherCrypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { teacherId } = body;

    // Validate input
    if (!teacherId || typeof teacherId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid teacherId' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      console.error('[API/Classes] Supabase not configured - check environment variables');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database not configured. Check environment variables: SUPABASE_SERVICE_ROLE_KEY' 
        },
        { status: 500 }
      );
    }

    // Generate unique class token
    const classToken = generateClassToken();

    // Insert class into database
    const { data, error } = await supabaseAdmin
      .from('classes')
      .insert({
        teacher_id: teacherId,
        class_token: classToken
      })
      .select('id, class_token, created_at')
      .single();

    if (error) {
      console.error('[API/Classes] Supabase error:', error);
      console.error('[API/Classes] Error code:', error.code);
      console.error('[API/Classes] Error message:', error.message);
      console.error('[API/Classes] Error details:', error.details);
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to create class',
          details: error.message,
          hint: 'Check Vercel logs for more details'
        },
        { status: 500 }
      );
    }

    console.log('[API/Classes] Created class:', data.id);

    return NextResponse.json({
      success: true,
      classId: data.id,
      classToken: data.class_token,
      createdAt: data.created_at
    });

  } catch (error) {
    console.error('[API/Classes] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/classes',
    methods: ['POST'],
    description: 'Create teacher classes'
  });
}

