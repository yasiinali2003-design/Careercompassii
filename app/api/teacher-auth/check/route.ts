import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { validateSessionToken } from '@/lib/security';

/**
 * Teacher Auth Check API
 * Checks if user is authenticated with proper token validation
 */

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic';

// Maximum session age for teacher tokens (24 hours)
const MAX_SESSION_AGE_MS = 24 * 60 * 60 * 1000;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('teacher_auth_token');
    const teacherId = cookieStore.get('teacher_id');

    // No token present
    if (!token?.value) {
      return NextResponse.json({ authenticated: false });
    }

    // Validate the token format and expiry
    // Token format: timestamp.random (hex encoded)
    const isValidToken = validateSessionToken(token.value, MAX_SESSION_AGE_MS);

    // Also check for legacy 'authenticated' token for backwards compatibility
    // This will be deprecated in future versions
    const isLegacyToken = token.value === 'authenticated';

    // Must have both valid token and teacher ID
    const isAuthenticated = (isValidToken || isLegacyToken) && !!teacherId?.value;

    return NextResponse.json({
      authenticated: isAuthenticated,
      // Include teacher ID only if authenticated (for client use)
      ...(isAuthenticated && teacherId?.value ? { teacherId: teacherId.value } : {}),
    });
  } catch (error) {
    // Log error without exposing details
    if (process.env.NODE_ENV === 'development') {
      console.error('[Teacher Auth] Check error:', error);
    }
    return NextResponse.json(
      { authenticated: false },
      { status: 500 }
    );
  }
}

