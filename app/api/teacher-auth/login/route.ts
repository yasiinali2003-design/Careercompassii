/**
 * POST /api/teacher-auth/login
 * Teacher login with email + password
 *
 * Flow:
 * 1. Teacher enters email + password
 * 2. System validates credentials
 * 3. Checks account lockout status
 * 4. Verifies password with Argon2id
 * 5. Updates last_login timestamp
 * 6. Creates session (24h expiry)
 * 7. Returns success + teacher info
 *
 * Security:
 * - CSRF token validation
 * - Two-layer rate limiting (per IP + per account)
 * - Account lockout after 5 failed attempts (15 min)
 * - Generic error messages (prevents enumeration)
 * - Argon2id password verification (timing-safe)
 * - Failed attempts counter in database
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rateLimit';
import { createLogger } from '@/lib/logger';
import {
  generateSessionToken,
  verifyPassword,
  isValidEmail
} from '@/lib/security';
import { requireCsrf } from '@/lib/csrf';
import { z } from 'zod';

const log = createLogger('API/Teacher-Auth/Login');

// Validation schema
const LoginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(128),
});

/**
 * Set secure session cookies for teacher authentication
 */
async function setTeacherCookies(teacherId: string): Promise<void> {
  const cookieStore = await cookies();
  const sessionToken = generateSessionToken();

  // Session duration: 24 hours
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
 * Teacher Login API (Email + Password)
 * Validates teacher email and password against database
 */
export async function POST(request: NextRequest) {
  try {
    // Validate CSRF token
    const csrfCheck = requireCsrf(request);
    if (!csrfCheck.valid) {
      return NextResponse.json(
        { success: false, error: 'Virheellinen istunto. Päivitä sivu ja yritä uudelleen.' },
        { status: 403 }
      );
    }

    // Check rate limit (5 attempts per 15 min per IP)
    const rateLimitCheck = await checkRateLimit(request, {
      maxRequests: 5,
      windowMs: 15 * 60 * 1000,
    });

    if (rateLimitCheck) {
      return NextResponse.json(
        {
          success: false,
          error: 'Liian monta kirjautumisyritystä. Yritä uudelleen myöhemmin.',
          code: 'RATE_LIMIT_EXCEEDED'
        },
        {
          status: 429,
          headers: rateLimitCheck.headers || {}
        }
      );
    }

    // Parse and validate request
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Virheellinen JSON-muoto pyynnössä'
        },
        { status: 400 }
      );
    }

    const validation = LoginSchema.safeParse(body);

    if (!validation.success) {
      // Don't reveal validation errors - generic message
      return NextResponse.json(
        { success: false, error: 'Virheelliset kirjautumistiedot' },
        { status: 400 }
      );
    }

    const { email: rawEmail, password } = validation.data;

    // Normalize email (lowercase, trim)
    const email = rawEmail.toLowerCase().trim();

    // Validate email format
    if (!isValidEmail(email)) {
      // Generic error - don't reveal invalid email
      return NextResponse.json(
        { success: false, error: 'Virheelliset kirjautumistiedot' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: 'Tietokanta ei ole käytettävissä' },
        { status: 500 }
      );
    }

    // Query database - case-insensitive email lookup
    log.debug(`Login attempt for email: ${email}`);

    const { data: teacher, error: queryError } = await supabaseAdmin
      .from('teachers')
      .select('id, name, email, password_hash, package, is_active, failed_login_attempts, locked_until')
      .eq('is_active', true)
      .ilike('email', email)
      .maybeSingle() as {
        data: {
          id: string;
          name: string;
          email: string;
          password_hash: string | null;
          package: string;
          is_active: boolean;
          failed_login_attempts: number;
          locked_until: string | null;
        } | null;
        error: any;
      };

    if (queryError) {
      log.error('Database query error:', queryError);
      // Generic error - don't reveal database issues
      return NextResponse.json(
        { success: false, error: 'Virheelliset kirjautumistiedot' },
        { status: 500 }
      );
    }

    if (!teacher) {
      log.debug(`No teacher found with email: ${email}`);
      // Generic error - don't reveal account doesn't exist
      return NextResponse.json(
        { success: false, error: 'Virheelliset kirjautumistiedot' },
        { status: 401 }
      );
    }

    // Check if account is locked
    if (teacher.locked_until) {
      const lockedUntil = new Date(teacher.locked_until);
      const now = new Date();

      if (lockedUntil > now) {
        log.debug(`Account ${teacher.id} is locked until ${lockedUntil}`);
        // Generic error - don't reveal account is locked
        return NextResponse.json(
          { success: false, error: 'Liian monta kirjautumisyritystä. Yritä uudelleen myöhemmin.' },
          { status: 429 }
        );
      } else {
        // Lock expired - reset in database
        log.debug(`Lock expired for account ${teacher.id}, resetting`);
        await supabaseAdmin
          .from('teachers')
          .update({
            locked_until: null,
            failed_login_attempts: 0
          })
          .eq('id', teacher.id);
      }
    }

    // Check if password is set (teacher must activate account first)
    if (!teacher.password_hash) {
      log.debug(`Teacher ${teacher.id} has no password set yet`);
      return NextResponse.json(
        {
          success: false,
          error: 'Aktivoi tili ensin pääsykoodilla',
          code: 'PASSWORD_NOT_SET',
          requirePasswordSetup: true
        },
        { status: 400 }
      );
    }

    // Verify password with Argon2id (timing-safe)
    log.debug(`Verifying password for teacher ${teacher.id}`);
    const passwordValid = await verifyPassword(teacher.password_hash, password);

    if (!passwordValid) {
      log.debug(`Invalid password for teacher ${teacher.id}`);

      // Increment failed login attempts
      const newFailedAttempts = (teacher.failed_login_attempts || 0) + 1;
      const updateData: Record<string, any> = {
        failed_login_attempts: newFailedAttempts
      };

      // Lock account after 5 failed attempts
      if (newFailedAttempts >= 5) {
        const lockedUntil = new Date();
        lockedUntil.setMinutes(lockedUntil.getMinutes() + 15);
        updateData.locked_until = lockedUntil.toISOString();
        log.info(`Locking account ${teacher.id} until ${lockedUntil}`);
      }

      await supabaseAdmin
        .from('teachers')
        .update(updateData)
        .eq('id', teacher.id);

      // Generic error - don't reveal wrong password
      return NextResponse.json(
        { success: false, error: 'Virheelliset kirjautumistiedot' },
        { status: 401 }
      );
    }

    // SUCCESS - Reset failed attempts, update last_login
    log.info(`Successful login for teacher ${teacher.id} (${teacher.email})`);

    const now = new Date().toISOString();
    await supabaseAdmin
      .from('teachers')
      .update({
        failed_login_attempts: 0,
        locked_until: null,
        last_login: now
      })
      .eq('id', teacher.id);

    // Set secure session cookies
    await setTeacherCookies(teacher.id);

    return NextResponse.json({
      success: true,
      message: 'Kirjautuminen onnistui',
      teacher: {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        package: teacher.package
      }
    });

  } catch (error: any) {
    log.error('Unexpected error:', error?.message);
    return NextResponse.json(
      {
        success: false,
        error: 'Sisäinen palvelinvirhe'
      },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/teacher-auth/login',
    methods: ['POST'],
    description: 'Teacher login with email + password'
  });
}

export const dynamic = 'force-dynamic';
