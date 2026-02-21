/**
 * POST /api/teacher-auth/set-password
 * Set initial password using temp token from first-login
 *
 * Flow:
 * 1. Teacher submits temp token + new password
 * 2. System validates token (hash comparison, not expired)
 * 3. Validates password strength (min 10 chars)
 * 4. Hashes password with Argon2id
 * 5. Stores password hash, clears temp token
 * 6. Creates full session (24h expiry)
 * 7. Returns success + redirects to dashboard
 *
 * Security:
 * - Temp token is hashed before comparison (timing-safe via SQL)
 * - Password hashed with Argon2id (OWASP recommended)
 * - Temp token cleared after use (one-time use)
 * - Session token generated for automatic login
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rateLimit';
import { createLogger } from '@/lib/logger';
import {
  hashPassword,
  hashToken,
  validatePasswordStrength,
  generateSessionToken
} from '@/lib/security';
import { z } from 'zod';

const log = createLogger('API/Teacher-Auth/Set-Password');

// Validation schema
const SetPasswordSchema = z.object({
  tempToken: z.string().length(48), // 48-char hex token
  password: z.string().min(10).max(128),
  confirmPassword: z.string().min(10).max(128),
});

export async function POST(request: NextRequest) {
  try {
    // Check rate limit (configured in lib/rateLimit.ts)
    const rateLimitCheck = await checkRateLimit(request);

    if (rateLimitCheck) {
      return NextResponse.json(
        {
          success: false,
          error: 'Liian monta yritystä. Yritä uudelleen myöhemmin.',
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

    const validation = SetPasswordSchema.safeParse(body);

    if (!validation.success) {
      log.warn('Validation failed:', validation.error.issues);
      return NextResponse.json(
        {
          success: false,
          error: 'Virheellinen pyyntödata',
          details: validation.error.issues.map(issue => ({
            path: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      );
    }

    const { tempToken, password, confirmPassword } = validation.data;

    // Verify passwords match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Salasanat eivät täsmää' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: passwordValidation.message
        },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: 'Tietokanta ei ole käytettävissä' },
        { status: 500 }
      );
    }

    // Hash the submitted temp token for comparison
    const tempTokenHash = hashToken(tempToken);

    // Validate token exists and not expired
    log.debug('Looking up temp token');

    const { data: teacher, error: queryError } = await supabaseAdmin
      .from('teachers')
      .select('id, email, name, password_hash, temp_token_hash, temp_token_expires')
      .eq('temp_token_hash', tempTokenHash)
      .eq('is_active', true)
      .maybeSingle() as {
        data: {
          id: string;
          email: string;
          name: string;
          password_hash: string | null;
          temp_token_hash: string | null;
          temp_token_expires: string | null;
        } | null;
        error: any;
      };

    if (queryError) {
      log.error('Database query error:', queryError);
      return NextResponse.json(
        { success: false, error: 'Tietokannan kyselyvirhe' },
        { status: 500 }
      );
    }

    if (!teacher) {
      log.debug('Token not found or teacher inactive');
      return NextResponse.json(
        { success: false, error: 'Aktivointilinkki on vanhentunut tai virheellinen' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (teacher.temp_token_expires) {
      const expiresAt = new Date(teacher.temp_token_expires);
      if (expiresAt < new Date()) {
        log.debug(`Token expired for teacher ${teacher.id}`);
        return NextResponse.json(
          { success: false, error: 'Aktivointilinkki on vanhentunut. Pyydä uusi pääsykoodi.' },
          { status: 400 }
        );
      }
    }

    // Check if password already set (double activation attempt)
    if (teacher.password_hash) {
      log.debug(`Teacher ${teacher.id} already has password set`);
      return NextResponse.json(
        {
          success: false,
          error: 'Tili on jo aktivoitu. Kirjaudu sähköpostilla ja salasanalla.',
          code: 'ALREADY_ACTIVATED'
        },
        { status: 400 }
      );
    }

    // Hash password with Argon2id
    log.debug(`Hashing password for teacher ${teacher.id}`);
    const passwordHash = await hashPassword(password);

    // Update database: set password, clear temp token
    const now = new Date().toISOString();
    const { error: updateError } = await supabaseAdmin
      .from('teachers')
      // @ts-expect-error - Supabase types need regeneration after schema changes
      .update({
        password_hash: passwordHash,
        password_set_at: now,
        password_updated_at: now,
        temp_token_hash: null,
        temp_token_expires: null,
        last_login: now
      })
      .eq('id', teacher.id);

    if (updateError) {
      log.error('Failed to update password:', updateError);
      return NextResponse.json(
        { success: false, error: 'Salasanan tallentaminen epäonnistui' },
        { status: 500 }
      );
    }

    log.info(`Password set successfully for teacher ${teacher.id} (${teacher.email})`);

    // Create session token for automatic login
    const sessionToken = generateSessionToken();

    // Set secure cookies
    const response = NextResponse.json({
      success: true,
      message: 'Salasana asetettu onnistuneesti!',
      redirectTo: '/teacher/dashboard',
      teacher: {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email
      }
    });

    // Set HTTP-only cookies for session
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    };

    response.cookies.set('teacher_auth_token', sessionToken, cookieOptions);
    response.cookies.set('teacher_id', teacher.id, cookieOptions);

    return response;

  } catch (error) {
    log.error('Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Sisäinen palvelinvirhe' },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/teacher-auth/set-password',
    methods: ['POST'],
    description: 'Set initial password using temp token'
  });
}
