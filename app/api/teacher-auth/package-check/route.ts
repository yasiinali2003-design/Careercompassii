import { NextRequest, NextResponse } from 'next/server';
import { isPremiumTeacher } from '@/lib/teacherPackage';

/**
 * GET /api/teacher-auth/package-check
 * Check if authenticated teacher has Premium access
 */
export async function GET(request: NextRequest) {
  try {
    const teacherId = request.cookies.get('teacher_id')?.value;

    if (!teacherId) {
      return NextResponse.json(
        { success: false, hasPremium: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const hasPremium = await isPremiumTeacher(teacherId);

    return NextResponse.json({
      success: true,
      hasPremium,
      package: hasPremium ? 'premium' : 'standard'
    });

  } catch (error) {
    console.error('[Package Check] Error:', error);
    return NextResponse.json(
      { success: false, hasPremium: false, error: 'Internal error' },
      { status: 500 }
    );
  }
}

