import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Teacher Logout API
 * Clears authentication cookie
 */

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('teacher_auth_token');

    return NextResponse.json({
      success: true,
      message: 'Uloskirjautuminen onnistui',
    });
  } catch (error) {
    console.error('[Teacher Auth] Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Uloskirjautuminen epäonnistui' },
      { status: 500 }
    );
  }
}

