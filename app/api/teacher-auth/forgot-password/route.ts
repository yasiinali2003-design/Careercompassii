/**
 * POST /api/teacher-auth/forgot-password
 * Generate password reset token and send email
 *
 * Flow:
 * 1. Teacher enters email address
 * 2. System checks if teacher exists with this email
 * 3. Generates secure reset token (48-char hex)
 * 4. Hashes token with SHA-256 before storing in DB
 * 5. Sends email with raw token (NOT the hash)
 * 6. ALWAYS returns success (prevents email enumeration)
 *
 * Security:
 * - Rate limited (3 attempts per hour per IP)
 * - Always returns success (prevents email enumeration)
 * - Reset token hashed with SHA-256 in DB
 * - Token expires in 1 hour
 * - Generic error messages
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rateLimit';
import { createLogger } from '@/lib/logger';
import { generateSecureToken, hashToken, isValidEmail } from '@/lib/security';
import { sendPasswordResetEmail } from '@/lib/email';
import { z } from 'zod';

const log = createLogger('API/Teacher-Auth/Forgot-Password');

// Validation schema
const ForgotPasswordSchema = z.object({
  email: z.string().email().max(254),
});

export async function POST(request: NextRequest) {
  try {
    // Strict rate limiting (configured in lib/rateLimit.ts)
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

    const validation = ForgotPasswordSchema.safeParse(body);

    if (!validation.success) {
      // Don't reveal validation errors - prevents enumeration
      return NextResponse.json(
        {
          success: true,
          message: 'Jos sähköpostiosoite on rekisteröity, lähetimme palautuslinkin.'
        },
        { status: 200 }
      );
    }

    const rawEmail = validation.data.email;

    // Normalize email (lowercase, trim)
    const email = rawEmail.toLowerCase().trim();

    // Validate email format
    if (!isValidEmail(email)) {
      // Don't reveal invalid email - prevents enumeration
      return NextResponse.json(
        {
          success: true,
          message: 'Jos sähköpostiosoite on rekisteröity, lähetimme palautuslinkin.'
        },
        { status: 200 }
      );
    }

    if (!supabaseAdmin) {
      // Don't reveal system errors - prevents enumeration
      log.error('Supabase not configured');
      return NextResponse.json(
        {
          success: true,
          message: 'Jos sähköpostiosoite on rekisteröity, lähetimme palautuslinkin.'
        },
        { status: 200 }
      );
    }

    // Query database - case-insensitive email lookup
    log.debug(`Looking up teacher by email: ${email}`);

    const { data: teacher, error: queryError } = await supabaseAdmin
      .from('teachers')
      .select('id, name, email, password_hash, is_active')
      .eq('is_active', true)
      .ilike('email', email)
      .maybeSingle() as {
        data: {
          id: string;
          name: string;
          email: string;
          password_hash: string | null;
          is_active: boolean;
        } | null;
        error: any;
      };

    if (queryError) {
      log.error('Database query error:', queryError);
      // Don't reveal errors - prevents enumeration
      return NextResponse.json(
        {
          success: true,
          message: 'Jos sähköpostiosoite on rekisteröity, lähetimme palautuslinkin.'
        },
        { status: 200 }
      );
    }

    if (!teacher) {
      log.debug(`No teacher found with email: ${email}`);
      // Don't reveal teacher doesn't exist - prevents enumeration
      return NextResponse.json(
        {
          success: true,
          message: 'Jos sähköpostiosoite on rekisteröity, lähetimme palautuslinkin.'
        },
        { status: 200 }
      );
    }

    // Check if password is set (teacher must have activated account first)
    if (!teacher.password_hash) {
      log.debug(`Teacher ${teacher.id} has no password set yet`);
      // Don't reveal this - prevents enumeration
      // Teacher should use first-login flow instead
      return NextResponse.json(
        {
          success: true,
          message: 'Jos sähköpostiosoite on rekisteröity, lähetimme palautuslinkin.'
        },
        { status: 200 }
      );
    }

    // Generate secure reset token (48-char hex = 24 bytes)
    const resetToken = generateSecureToken(24);
    const resetTokenHash = hashToken(resetToken);

    // Set expiry: 1 hour from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Update database with hashed token
    const { error: updateError } = await supabaseAdmin
      .from('teachers')
      // @ts-expect-error - Supabase types need regeneration after schema changes
      .update({
        reset_token_hash: resetTokenHash,
        reset_token_expires: expiresAt.toISOString()
      })
      .eq('id', teacher.id);

    if (updateError) {
      log.error('Failed to store reset token:', updateError);
      // Don't reveal errors - prevents enumeration
      return NextResponse.json(
        {
          success: true,
          message: 'Jos sähköpostiosoite on rekisteröity, lähetimme palautuslinkin.'
        },
        { status: 200 }
      );
    }

    // Send password reset email with raw token (NOT the hash)
    try {
      await sendPasswordResetEmail(teacher.email, resetToken, teacher.name);
      log.info(`Password reset email sent to ${teacher.email}`);
    } catch (emailError) {
      log.error('Failed to send reset email:', emailError);
      // Don't reveal email failure - prevents enumeration
      // User will think email was sent, but it failed
      // This is intentional to prevent enumeration
    }

    // Always return success (prevents email enumeration)
    return NextResponse.json({
      success: true,
      message: 'Jos sähköpostiosoite on rekisteröity, lähetimme palautuslinkin.'
    });

  } catch (error) {
    log.error('Unexpected error:', error);
    // Don't reveal errors - prevents enumeration
    return NextResponse.json({
      success: true,
      message: 'Jos sähköpostiosoite on rekisteröity, lähetimme palautuslinkin.'
    });
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/teacher-auth/forgot-password',
    methods: ['POST'],
    description: 'Generate password reset token and send email (prevents enumeration)'
  });
}
