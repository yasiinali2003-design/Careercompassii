/**
 * School Teachers Management API
 * Invite, remove, and manage teachers in a school
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: {
    schoolId: string;
  };
}

/**
 * GET /api/schools/[schoolId]/teachers
 * Get all teachers in a school
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const teacherId = request.cookies.get('teacher_id')?.value;
    const { schoolId } = params;

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

    // Verify teacher belongs to this school
    const { data: membership } = await supabaseAdmin
      .from('school_teachers')
      .select('role')
      .eq('school_id', schoolId)
      .eq('teacher_id', teacherId)
      .single();

    if (!membership) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    // Get all teachers
    const { data: teachers, error } = await supabaseAdmin
      .from('school_teachers')
      .select('id, teacher_id, role, joined_at, invited_by')
      .eq('school_id', schoolId)
      .order('joined_at', { ascending: true });

    if (error) {
      console.error('[API/Schools/Teachers] Error fetching teachers:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch teachers' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      teachers: teachers || [],
      currentRole: membership.role
    });

  } catch (error) {
    console.error('[API/Schools/Teachers] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/schools/[schoolId]/teachers
 * Invite a new teacher to the school
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const teacherId = request.cookies.get('teacher_id')?.value;
    const { schoolId } = params;

    if (!teacherId) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { newTeacherId, role = 'teacher' } = body;

    if (!newTeacherId || typeof newTeacherId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Teacher ID is required' },
        { status: 400 }
      );
    }

    if (!['admin', 'teacher', 'viewer'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Verify inviter is an admin
    const { data: inviter } = await supabaseAdmin
      .from('school_teachers')
      .select('role')
      .eq('school_id', schoolId)
      .eq('teacher_id', teacherId)
      .single();

    if (!inviter || inviter.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Only admins can invite teachers' },
        { status: 403 }
      );
    }

    // Check if school can add more teachers
    const { data: canAdd } = await supabaseAdmin
      .rpc('can_add_teacher', { p_school_id: schoolId });

    if (!canAdd) {
      return NextResponse.json(
        { success: false, error: 'School has reached maximum teacher limit' },
        { status: 400 }
      );
    }

    // Add teacher
    const { data: newMember, error } = await supabaseAdmin
      .from('school_teachers')
      .insert({
        school_id: schoolId,
        teacher_id: newTeacherId,
        role,
        invited_by: teacherId
      })
      .select('id, teacher_id, role, joined_at')
      .single();

    if (error) {
      console.error('[API/Schools/Teachers] Error adding teacher:', error);

      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json(
          { success: false, error: 'Teacher already belongs to this school' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Failed to add teacher' },
        { status: 500 }
      );
    }

    console.log(`[API/Schools/Teachers] Added teacher ${newTeacherId} to school ${schoolId}`);

    return NextResponse.json({
      success: true,
      teacher: newMember
    });

  } catch (error) {
    console.error('[API/Schools/Teachers] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/schools/[schoolId]/teachers/[teacherIdToRemove]
 * Remove a teacher from the school
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const teacherId = request.cookies.get('teacher_id')?.value;
    const { schoolId } = params;

    // Get teacherIdToRemove from query params
    const { searchParams } = new URL(request.url);
    const teacherIdToRemove = searchParams.get('teacherId');

    if (!teacherId) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (!teacherIdToRemove) {
      return NextResponse.json(
        { success: false, error: 'Teacher ID to remove is required' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Verify remover is an admin
    const { data: remover } = await supabaseAdmin
      .from('school_teachers')
      .select('role')
      .eq('school_id', schoolId)
      .eq('teacher_id', teacherId)
      .single();

    if (!remover || remover.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Only admins can remove teachers' },
        { status: 403 }
      );
    }

    // Prevent removing the last admin
    const { data: admins } = await supabaseAdmin
      .from('school_teachers')
      .select('id')
      .eq('school_id', schoolId)
      .eq('role', 'admin');

    const { data: targetMember } = await supabaseAdmin
      .from('school_teachers')
      .select('role')
      .eq('school_id', schoolId)
      .eq('teacher_id', teacherIdToRemove)
      .single();

    if (targetMember?.role === 'admin' && admins && admins.length <= 1) {
      return NextResponse.json(
        { success: false, error: 'Cannot remove the last admin' },
        { status: 400 }
      );
    }

    // Remove teacher
    const { error } = await supabaseAdmin
      .from('school_teachers')
      .delete()
      .eq('school_id', schoolId)
      .eq('teacher_id', teacherIdToRemove);

    if (error) {
      console.error('[API/Schools/Teachers] Error removing teacher:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to remove teacher' },
        { status: 500 }
      );
    }

    console.log(`[API/Schools/Teachers] Removed teacher ${teacherIdToRemove} from school ${schoolId}`);

    return NextResponse.json({
      success: true,
      message: 'Teacher removed successfully'
    });

  } catch (error) {
    console.error('[API/Schools/Teachers] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
