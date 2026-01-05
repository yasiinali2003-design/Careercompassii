import { NextRequest, NextResponse } from 'next/server';
import { resolveSitePasswords } from '@/lib/siteAuth';
import { generateSessionToken, sanitizeInput } from '@/lib/security';
import { createLogger } from '@/lib/logger';

const log = createLogger('SiteAuth');

const COOKIE_NAME = 'site_auth';

// Rate limiting: track failed attempts per IP
const failedAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip: string): { allowed: boolean; remainingAttempts: number } {
  const now = Date.now();
  const record = failedAttempts.get(ip);

  if (!record) {
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  // Reset if lockout period has passed
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

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // Check rate limit
    const { allowed, remainingAttempts } = checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Liian monta yritystä. Yritä uudelleen 15 minuutin kuluttua.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Pääsykoodi vaaditaan' },
        { status: 400 }
      );
    }

    const normalized = sanitizeInput(typeof password === 'string' ? password : '');

    if (!normalized) {
      return NextResponse.json(
        { success: false, error: 'Pääsykoodi vaaditaan' },
        { status: 400 }
      );
    }

    const allowedPasswords = resolveSitePasswords();

    // Use timing-safe comparison by always checking all passwords
    let isValid = false;
    for (const allowedPassword of allowedPasswords) {
      // Constant-time comparison simulation
      if (normalized.length === allowedPassword.length) {
        let match = true;
        for (let i = 0; i < normalized.length; i++) {
          if (normalized[i] !== allowedPassword[i]) {
            match = false;
          }
        }
        if (match) {
          isValid = true;
        }
      }
    }

    if (isValid) {
      // Clear failed attempts on successful login
      clearFailedAttempts(ip);

      // Generate secure session token
      const sessionToken = generateSessionToken();

      // Set authentication cookie with secure token
      const response = NextResponse.json({ success: true });

      response.cookies.set(COOKIE_NAME, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days (reduced from 30)
        path: '/',
      });

      return response;
    } else {
      // Record failed attempt
      recordFailedAttempt(ip);

      // Generic error message (don't reveal if password exists)
      return NextResponse.json(
        {
          success: false,
          error: 'Väärä pääsykoodi',
          remainingAttempts: remainingAttempts - 1
        },
        { status: 401 }
      );
    }
  } catch (error) {
    log.error('Site auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Sisäinen virhe' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
