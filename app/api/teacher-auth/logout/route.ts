import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Teacher Logout API
 * Clears authentication cookie
 */

export async function POST() {
  try {
    const cookieStore = await cookies();
    // Best-effort delete by name, then explicitly expire path-scoped cookies
    cookieStore.delete('teacher_auth_token');
    cookieStore.delete('teacher_id');

    // Expire /teacher scoped cookies
    cookieStore.set('teacher_auth_token', '', { path: '/teacher', maxAge: 0 });
    cookieStore.set('teacher_id', '', { path: '/teacher', maxAge: 0 });

    // Expire /api scoped cookies
    cookieStore.set('teacher_auth_token', '', { path: '/api', maxAge: 0 });
    cookieStore.set('teacher_id', '', { path: '/api', maxAge: 0 });

    // Expire site-wide cookies
    cookieStore.set('teacher_auth_token', '', { path: '/', maxAge: 0 });
    cookieStore.set('teacher_id', '', { path: '/', maxAge: 0 });

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

