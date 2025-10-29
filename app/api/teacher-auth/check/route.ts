import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Teacher Auth Check API
 * Checks if user is authenticated
 */

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('teacher_auth_token');

    return NextResponse.json({
      authenticated: token?.value === 'authenticated',
    });
  } catch (error) {
    console.error('[Teacher Auth] Check error:', error);
    return NextResponse.json(
      { authenticated: false },
      { status: 500 }
    );
  }
}

