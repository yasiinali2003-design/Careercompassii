import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';
import { generateSessionToken, sanitizeInput } from '@/lib/security';

// Rate limiting for teacher auth
const failedAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

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
 * Set secure session cookies for teacher authentication
 */
async function setTeacherCookies(teacherId: string): Promise<void> {
  const cookieStore = await cookies();
  const sessionToken = generateSessionToken();

  // Session duration: 24 hours (reduced from 7 days for better security)
  const maxAge = 60 * 60 * 24;

  // Set secure session token cookie
  cookieStore.set('teacher_auth_token', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge,
    path: '/',
  });

  // Store teacher ID in a separate cookie
  cookieStore.set('teacher_id', teacherId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge,
    path: '/',
  });
}

/**
 * Teacher Login API
 * Validates teacher access code against database and sets authentication cookie
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
      return NextResponse.json(
        { success: false, error: 'Liian monta yritystä. Yritä uudelleen 15 minuutin kuluttua.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { password: rawAccessCode } = body;

    if (!rawAccessCode || typeof rawAccessCode !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Opettajakoodi vaaditaan' },
        { status: 400 }
      );
    }

    const trimmedCode = sanitizeInput(rawAccessCode);
    if (!trimmedCode) {
      return NextResponse.json(
        { success: false, error: 'Opettajakoodi vaaditaan' },
        { status: 400 }
      );
    }

    const candidateCodes = Array.from(new Set([
      trimmedCode,
      trimmedCode.toUpperCase(),
      trimmedCode.toLowerCase()
    ])).filter(Boolean);

    // Only use fallback in development, and use env variable (no hardcoded values)
    const fallbackCode = process.env.NODE_ENV === 'production'
      ? undefined
      : process.env.DEV_TEACHER_CODE;
    const teacherAccessCode = process.env.TEACHER_ACCESS_CODE ?? fallbackCode;

    // Check if Supabase is configured
    if (!supabaseAdmin) {
      console.error('[Teacher Auth] Supabase not configured');

      // Fallback to environment variable if database not available (dev only)
      if (teacherAccessCode && candidateCodes.includes(teacherAccessCode)) {
        await setTeacherCookies('mock-teacher');
        clearFailedAttempts(ip);
        return NextResponse.json({
          success: true,
          message: 'Kirjautuminen onnistui (kehitystila)',
        });
      }

      return NextResponse.json(
        { success: false, error: 'Autentikointi ei ole käytettävissä' },
        { status: 500 }
      );
    }

    const { data: teacher, error } = await supabaseAdmin
      .from('teachers')
      .select('id, name, email, school_name, access_code, is_active')
      .in('access_code', candidateCodes)
      .eq('is_active', true)
      .maybeSingle() as { data: { id: string; name: string; email: string; school_name: string; access_code: string; is_active: boolean } | null; error: any };

    if (error || !teacher) {
      // Only use fallback in development
      const fallbackMatch = process.env.NODE_ENV !== 'production' &&
                           teacherAccessCode &&
                           candidateCodes.includes(teacherAccessCode);
      if (fallbackMatch) {
        await setTeacherCookies('mock-teacher');
        clearFailedAttempts(ip);
        return NextResponse.json({
          success: true,
          message: 'Kirjautuminen onnistui (kehitystila)',
        });
      }

      recordFailedAttempt(ip);
      return NextResponse.json(
        {
          success: false,
          error: 'Opettajakoodi ei kelpaa',
          remainingAttempts: remainingAttempts - 1
        },
        { status: 401 }
      );
    }

    // Update last login timestamp (non-blocking)
    (supabaseAdmin as unknown as { from: (table: string) => { update: (data: Record<string, unknown>) => { eq: (col: string, val: string) => Promise<unknown> } } })
      .from('teachers')
      .update({ last_login: new Date().toISOString() })
      .eq('id', teacher.id)
      .then(() => {})
      .catch((err: unknown) => console.error('[Teacher Auth] Failed to update last_login:', err));

    // Set secure session cookies
    await setTeacherCookies(teacher.id);
    clearFailedAttempts(ip);

    return NextResponse.json({
      success: true,
      message: 'Kirjautuminen onnistui',
      teacher: {
        id: teacher.id,
        name: teacher.name,
        school_name: teacher.school_name,
      },
    });
  } catch (error: any) {
    console.error('[Teacher Auth] Login error:', error?.message);
    return NextResponse.json(
      {
        success: false,
        error: 'Sisäänkirjautuminen epäonnistui'
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
