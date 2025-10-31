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
import fs from 'fs';
import path from 'path';

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

    // Generate unique class token
    const classToken = generateClassToken();

    // Check if Supabase is configured
    if (!supabaseAdmin) {
      console.warn('[API/Classes] Supabase not configured - using local mock store');
      const mockPath = path.join(process.cwd(), 'mock-db.json');
      let store: any = { classes: [], pins: {}, results: [] };
      try {
        if (fs.existsSync(mockPath)) {
          store = JSON.parse(fs.readFileSync(mockPath, 'utf8')) || store;
        }
      } catch {}
      const classId = 'mock-class-' + Date.now();
      const createdAt = new Date().toISOString();
      store.classes.push({ id: classId, class_token: classToken, created_at: createdAt, teacher_id: teacherId });
      try { fs.writeFileSync(mockPath, JSON.stringify(store, null, 2)); } catch {}
      return NextResponse.json({ success: true, classId, classToken, createdAt });
    }

    // Try to insert class into database
    try {
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

/**
 * GET /api/classes
 * Get all classes for the authenticated teacher
 * 
 * Response: { classes: Array<{ id, class_token, created_at, updated_at }> }
 */
export async function GET(request: NextRequest) {
  try {
    // Get teacher ID from cookie
    const teacherId = request.cookies.get('teacher_id')?.value;

    if (!teacherId) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (!supabaseAdmin) {
      console.warn('[API/Classes] Supabase not configured - reading local mock store');
      const mockPath = path.join(process.cwd(), 'mock-db.json');
      try {
        if (fs.existsSync(mockPath)) {
          const store = JSON.parse(fs.readFileSync(mockPath, 'utf8'));
          const classes = (store.classes || []).filter((c: any) => c.teacher_id === teacherId);
          return NextResponse.json({ success: true, classes });
        }
      } catch {}
      return NextResponse.json({ success: true, classes: [] });
    }

    // Fetch all classes for this teacher
    const { data, error } = await supabaseAdmin
      .from('classes')
      .select('id, class_token, created_at, updated_at')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[API/Classes] Error fetching classes:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch classes' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      classes: data || []
    });

  } catch (error) {
    console.error('[API/Classes] GET unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

