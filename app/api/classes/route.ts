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

    // Convert teacher name to UUID (deterministic)
    function generateUUIDFromString(str: string): string {
      const hexValues = '0123456789abcdef';
      let hex = '';
      for (let i = 0; i < 32; i++) {
        const char = str.charCodeAt(i % str.length);
        hex += hexValues[char % 16];
      }
      return `${hex.slice(0,8)}-${hex.slice(8,12)}-4${hex.slice(13,16)}-8${hex.slice(17,20)}-${hex.slice(20,32)}`;
    }

    const validUUID = generateUUIDFromString(teacherId);

    // Generate unique class token
    const classToken = generateClassToken();

    // Check if Supabase is configured
    if (!supabaseAdmin) {
      console.warn('[API/Classes] Supabase not configured - returning mock response for localhost');
      return NextResponse.json({
        success: true,
        classId: 'mock-class-' + Date.now(),
        classToken: 'MOCK' + Date.now(),
        createdAt: new Date().toISOString()
      });
    }

    // Try to insert class into database
    try {
      const { data, error } = await supabaseAdmin
        .from('classes')
        .insert({
          teacher_id: validUUID,
          class_token: classToken
        })
        .select('id, class_token, created_at')
        .single();

      if (error) {
        console.error('[API/Classes] Supabase error:', error);
        console.error('[API/Classes] Error code:', error.code);
        console.error('[API/Classes] Error message:', error.message);
        console.error('[API/Classes] Error details:', error.details);
        
        // Check if it's a table missing error
        if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Database tables not created yet',
              hint: 'Run the SQL file in Supabase: supabase-teacher-dashboard-fixed.sql',
              details: error.message
            },
            { status: 500 }
          );
        }

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
    } catch (err) {
      console.error('[API/Classes] Unexpected error:', err);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database connection failed',
          details: err instanceof Error ? err.message : String(err)
        },
        { status: 500 }
      );
    }

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

