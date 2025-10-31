import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Teacher Auth Check API
 * Checks if user is authenticated
 */

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic';

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

