import { NextRequest, NextResponse } from 'next/server';
import { generateSessionToken, sanitizeInput } from '@/lib/security';
import { createLogger } from '@/lib/logger';

const log = createLogger('Admin Auth');

// Rate limiting for admin auth
const failedAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 3;
const LOCKOUT_TIME = 30 * 60 * 1000; // 30 minutes for admin

function checkRateLimit(ip: string): { allowed: boolean; remainingAttempts: number } {
  const now = Date.now();
  const record = failedAttempts.get(ip);

  if (!record) {
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  if (now - record.lastAttempt > LOCKOUT_TIME) {
    failedAttempts.delete(ip);
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  if (record.count >= MAX_ATTEMPTS) {
    return { allowed: false, remainingAttempts: 0 };
  }

  return { allowed: true, remainingAttempts: MAX_ATTEMPTS - record.count };
}

function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const record = failedAttempts.get(ip);

  if (!record) {
    failedAttempts.set(ip, { count: 1, lastAttempt: now });
  } else {
    record.count++;
    record.lastAttempt = now;
  }
}

function clearFailedAttempts(ip: string): void {
  failedAttempts.delete(ip);
}

/**
 * Timing-safe string comparison
 */
function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Still do a comparison to maintain constant time
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ (b.charCodeAt(i % b.length) || 0);
    }
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Admin authentication endpoint
 * Protected by rate limiting and timing-safe comparison
 */
export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // Check rate limit
    const { allowed, remainingAttempts } = checkRateLimit(ip);
    if (!allowed) {
      log.warn('Rate limit exceeded');
      return NextResponse.json(
        { success: false, error: 'Liian monta yritystä. Yritä uudelleen 30 minuutin kuluttua.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { password } = body;

    const expectedPassword = process.env.ADMIN_PASSWORD;

    if (!expectedPassword) {
      log.error('ADMIN_PASSWORD environment variable not set');
      return NextResponse.json(
        { success: false, error: 'Palvelimen asetusvirhe' },
        { status: 500 }
      );
    }

    const sanitizedPassword = sanitizeInput(password || '');

    // Use timing-safe comparison
    if (timingSafeCompare(sanitizedPassword, expectedPassword)) {
      clearFailedAttempts(ip);

      // Generate secure session tokens
      const adminToken = generateSessionToken();
      const teacherToken = generateSessionToken();

      const response = NextResponse.json({ success: true });

      // Set admin auth cookie with secure token
      response.cookies.set('admin_auth', adminToken, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 4, // 4 hours (reduced from 8)
        path: '/',
      });

      // Also set teacher auth cookies for compatibility
      const adminTeacherId = process.env.ADMIN_TEACHER_ID || '';
      if (adminTeacherId) {
        response.cookies.set('teacher_auth_token', teacherToken, {
          httpOnly: true,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 4,
          path: '/',
        });
        response.cookies.set('teacher_id', adminTeacherId, {
          httpOnly: true,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 4,
          path: '/',
        });
      }

      return response;
    }

    // Record failed attempt
    recordFailedAttempt(ip);
    log.warn('Failed login attempt');

    return NextResponse.json(
      {
        success: false,
        error: 'Virheellinen salasana',
        remainingAttempts: remainingAttempts - 1
      },
      { status: 401 }
    );
  } catch (error) {
    log.error('Error:', error);
    return NextResponse.json(
      { success: false, error: 'Virheellinen pyyntö' },
      { status: 400 }
    );
  }
}

export const dynamic = 'force-dynamic';
