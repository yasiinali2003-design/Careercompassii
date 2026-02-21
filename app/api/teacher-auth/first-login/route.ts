/**
 * POST /api/teacher-auth/first-login
 * Validate access code and issue temp token for password setup
 *
 * Flow:
 * 1. Teacher enters access code
 * 2. System validates code and ensures password not already set
 * 3. Generates temp token for password setup (15 min expiry)
 * 4. Returns temp token + teacher info
 *
 * Security:
 * - Temp token is hashed with SHA-256 before storing in DB
 * - Raw token sent to frontend once (never stored in plaintext)
 * - Token expires in 15 minutes
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rateLimit';
import { createLogger } from '@/lib/logger';
import { generateSecureToken, hashToken } from '@/lib/security';
import { z } from 'zod';

const log = createLogger('API/Teacher-Auth/First-Login');

// Validation schema
const FirstLoginSchema = z.object({
  accessCode: z.string().min(4).max(12),
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

    const validation = FirstLoginSchema.safeParse(body);

    if (!validation.success) {
      log.warn('Validation failed:', validation.error.issues);
      return NextResponse.json(
        {
          success: false,
          error: 'Virheellinen pyyntödata'
        },
        { status: 400 }
      );
    }

    const rawAccessCode = validation.data.accessCode;

    // Normalize access code (uppercase, trim)
    const normalizedAccessCode = rawAccessCode.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

    if (!normalizedAccessCode || normalizedAccessCode.length < 4) {
      return NextResponse.json(
        { success: false, error: 'Virheellinen pääsykoodi' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: 'Tietokanta ei ole käytettävissä' },
        { status: 500 }
      );
    }

    // Query database - use UPPER() for case-insensitive comparison
    log.debug(`Looking up access code: ${normalizedAccessCode}`);

    const { data: teacher, error: queryError } = await supabaseAdmin
      .from('teachers')
      .select('id, name, email, password_hash, is_active')
      .eq('is_active', true)
      .ilike('access_code', normalizedAccessCode)
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
      return NextResponse.json(
        { success: false, error: 'Tietokannan kyselyvirhe' },
        { status: 500 }
      );
    }

    if (!teacher) {
      log.debug('Access code not found or inactive');
      return NextResponse.json(
        { success: false, error: 'Virheellinen pääsykoodi' },
        { status: 400 }
      );
    }

    // Check if password already set
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

    // Generate secure temp token (48-char hex = 24 bytes)
    const tempToken = generateSecureToken(24); // Returns 48-char hex string
    const tempTokenHash = hashToken(tempToken);

    // Set expiry: 15 minutes from now
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // Update database with hashed token
    const { error: updateError } = await supabaseAdmin
      .from('teachers')
      // @ts-expect-error - Supabase types need regeneration after schema changes
      .update({
        temp_token_hash: tempTokenHash,
        temp_token_expires: expiresAt.toISOString()
      })
      .eq('id', teacher.id);

    if (updateError) {
      log.error('Failed to store temp token:', updateError);
      return NextResponse.json(
        { success: false, error: 'Tokenin tallentaminen epäonnistui' },
        { status: 500 }
      );
    }

    log.info(`Temp token generated for teacher ${teacher.id} (${teacher.email})`);

    // Return raw token (NOT the hash) + teacher info
    return NextResponse.json({
      success: true,
      requirePasswordSetup: true,
      tempToken: tempToken, // Raw token sent once
      teacher: {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email
      }
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
    endpoint: '/api/teacher-auth/first-login',
    methods: ['POST'],
    description: 'Validate access code and issue temp token for password setup'
  });
}
