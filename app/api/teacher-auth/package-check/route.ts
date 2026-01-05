import { NextRequest, NextResponse } from 'next/server';
import { isPremiumTeacher } from '@/lib/teacherPackage';
import { createLogger } from '@/lib/logger';

const log = createLogger('Package Check');

/**
 * GET /api/teacher-auth/package-check
 * Check if authenticated teacher has Premium access
 */

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const teacherId = request.cookies.get('teacher_id')?.value;

    if (!teacherId) {
      return NextResponse.json(
        { success: false, hasPremium: false, error: 'Ei kirjautunut' },
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
    log.error('Error:', error);
    return NextResponse.json(
      { success: false, hasPremium: false, error: 'Sisäinen virhe' },
      { status: 500 }
    );
  }
}

