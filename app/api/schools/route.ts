/**
 * School Management API
 * Handles multi-teacher access for Premium schools
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

/**
 * GET /api/schools
 * Get all schools for the authenticated teacher
 */
export async function GET(request: NextRequest) {
  try {
    const teacherId = request.cookies.get('teacher_id')?.value;

    if (!teacherId) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Get schools using helper function
    const { data, error } = await (supabaseAdmin as any)
      .rpc('get_teacher_schools', { p_teacher_id: teacherId });

    if (error) {
      console.error('[API/Schools] Error fetching schools:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch schools' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      schools: data || []
    });

  } catch (error) {
    console.error('[API/Schools] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/schools
 * Create a new school
 */
export async function POST(request: NextRequest) {
  try {
    const teacherId = request.cookies.get('teacher_id')?.value;

    if (!teacherId) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, package: pkg = 'yläaste' } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { success: false, error: 'School name is required' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Determine max_teachers based on package
    const maxTeachers = pkg === 'premium' ? 5 : 1;

    // Create school
    const { data: school, error: schoolError } = await supabaseAdmin
      .from('schools')
      .insert({
        name,
        package: pkg,
        max_teachers: maxTeachers
      } as any)
      .select('id, name, package, max_teachers, created_at')
      .single();

    if (schoolError || !school) {
      console.error('[API/Schools] Error creating school:', schoolError);
      return NextResponse.json(
        { success: false, error: 'Failed to create school' },
        { status: 500 }
      );
    }

    // Add creator as admin
    const schoolData = school as { id: string; name: string; package: string; max_teachers: number; created_at: string };
    const { error: memberError } = await supabaseAdmin
      .from('school_teachers')
      .insert({
        school_id: schoolData.id,
        teacher_id: teacherId,
        role: 'admin'
      } as any);

    if (memberError) {
      console.error('[API/Schools] Error adding admin:', memberError);
      // Rollback: delete school
      await supabaseAdmin.from('schools').delete().eq('id', schoolData.id)
      return NextResponse.json(
        { success: false, error: 'Failed to add admin to school' },
        { status: 500 }
      );
    }

    console.log(`[API/Schools] Created school: ${schoolData.id} by ${teacherId}`);

    return NextResponse.json({
      success: true,
      school
    });

  } catch (error) {
    console.error('[API/Schools] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
