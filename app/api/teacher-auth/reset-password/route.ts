/**
 * POST /api/teacher-auth/reset-password
 * Reset password using reset token from email
 *
 * Flow:
 * 1. Teacher submits reset token + new password
 * 2. System validates token (hash comparison, not expired)
 * 3. Validates password strength (min 10 chars)
 * 4. Hashes new password with Argon2id
 * 5. Updates password, clears reset token
 * 6. Resets failed login attempts and lockout
 * 7. Sends confirmation email
 * 8. Returns success + redirect to login
 *
 * Security:
 * - Reset token hashed before comparison (timing-safe via SQL)
 * - Password hashed with Argon2id
 * - Reset token cleared after use (one-time use)
 * - Failed login attempts reset
 * - Account lockout cleared
 * - Confirmation email sent
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rateLimit';
import { createLogger } from '@/lib/logger';
import {
  hashPassword,
  hashToken,
  validatePasswordStrength
} from '@/lib/security';
import { sendPasswordChangedEmail } from '@/lib/email';
import { z } from 'zod';

const log = createLogger('API/Teacher-Auth/Reset-Password');

// Validation schema
const ResetPasswordSchema = z.object({
  token: z.string().length(48), // 48-char hex token
  password: z.string().min(10).max(128),
  confirmPassword: z.string().min(10).max(128),
});

export async function POST(request: NextRequest) {
  try {
    // Check rate limit (5 attempts per 15 min per token - prevents brute force)
    const rateLimitCheck = await checkRateLimit(request, {
      maxRequests: 5,
      windowMs: 15 * 60 * 1000,
    });

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

    const validation = ResetPasswordSchema.safeParse(body);

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

    const { token, password, confirmPassword } = validation.data;

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

    // Hash the submitted reset token for comparison
    const resetTokenHash = hashToken(token);

    // Validate token exists and not expired
    log.debug('Looking up reset token');

    const { data: teacher, error: queryError } = await supabaseAdmin
      .from('teachers')
      .select('id, email, name, reset_token_hash, reset_token_expires')
      .eq('reset_token_hash', resetTokenHash)
      .eq('is_active', true)
      .maybeSingle() as {
        data: {
          id: string;
          email: string;
          name: string;
          reset_token_hash: string | null;
          reset_token_expires: string | null;
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
      log.debug('Reset token not found or teacher inactive');
      return NextResponse.json(
        { success: false, error: 'Reset-linkki on vanhentunut tai virheellinen' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (teacher.reset_token_expires) {
      const expiresAt = new Date(teacher.reset_token_expires);
      if (expiresAt < new Date()) {
        log.debug(`Reset token expired for teacher ${teacher.id}`);
        return NextResponse.json(
          { success: false, error: 'Reset-linkki on vanhentunut. Pyydä uusi linkki.' },
          { status: 400 }
        );
      }
    }

    // Hash new password with Argon2id
    log.debug(`Hashing new password for teacher ${teacher.id}`);
    const passwordHash = await hashPassword(password);

    // Update database: set new password, clear reset token, reset lockout
    const now = new Date().toISOString();
    const { error: updateError } = await supabaseAdmin
      .from('teachers')
      .update({
        password_hash: passwordHash,
        password_updated_at: now,
        reset_token_hash: null,
        reset_token_expires: null,
        failed_login_attempts: 0,
        locked_until: null
      })
      .eq('id', teacher.id);

    if (updateError) {
      log.error('Failed to update password:', updateError);
      return NextResponse.json(
        { success: false, error: 'Salasanan päivitys epäonnistui' },
        { status: 500 }
      );
    }

    log.info(`Password reset successfully for teacher ${teacher.id} (${teacher.email})`);

    // Send confirmation email (non-blocking)
    sendPasswordChangedEmail(teacher.email, teacher.name).catch(err => {
      log.error('Failed to send password changed email:', err);
      // Don't fail the request if email fails
    });

    // Return success
    return NextResponse.json({
      success: true,
      message: 'Salasana vaihdettu onnistuneesti!',
      redirectTo: '/teacher/login'
    });

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
    endpoint: '/api/teacher-auth/reset-password',
    methods: ['POST'],
    description: 'Reset password using reset token from email'
  });
}
