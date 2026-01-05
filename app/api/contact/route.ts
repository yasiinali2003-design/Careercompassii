import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { hashIpAddress, isValidEmail, sanitizeInput } from '@/lib/security';
import { createLogger } from '@/lib/logger';

const log = createLogger('Contact');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, organization, organizationType, message } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Täytä kaikki pakolliset kentät' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email).toLowerCase();
    const sanitizedOrg = organization ? sanitizeInput(organization) : null;
    const sanitizedMessage = sanitizeInput(message);

    // Validate required fields after sanitization
    if (!sanitizedName || !sanitizedEmail || !sanitizedMessage) {
      return NextResponse.json(
        { success: false, error: 'Täytä kaikki pakolliset kentät' },
        { status: 400 }
      );
    }

    // Email validation using RFC 5322 pattern
    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json(
        { success: false, error: 'Virheellinen sähköpostiosoite' },
        { status: 400 }
      );
    }

    // Message length validation
    if (sanitizedMessage.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Viesti on liian lyhyt' },
        { status: 400 }
      );
    }

    if (sanitizedMessage.length > 5000) {
      return NextResponse.json(
        { success: false, error: 'Viesti on liian pitkä (max 5000 merkkiä)' },
        { status: 400 }
      );
    }

    // Honeypot check (if website field is filled, it's likely a bot)
    if (body.website) {
      // Silently reject but return success to not tip off bots
      return NextResponse.json({ success: true });
    }

    if (!supabaseAdmin) {
      log.error('Supabase not configured');
      return NextResponse.json(
        { success: false, error: 'Palveluvirhe. Yritä myöhemmin uudelleen.' },
        { status: 500 }
      );
    }

    // Hash IP address for GDPR compliance
    const rawIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                  request.headers.get('x-real-ip') ||
                  'unknown';
    const hashedIp = await hashIpAddress(rawIp);

    // Save to Supabase
    const { error } = await (supabaseAdmin as unknown as { from: (table: string) => { insert: (data: Record<string, unknown>) => Promise<{ error: unknown }> } })
      .from('contact_submissions')
      .insert({
        name: sanitizedName,
        email: sanitizedEmail,
        organization: sanitizedOrg,
        organization_type: organizationType || null,
        message: sanitizedMessage,
        submitted_at: new Date().toISOString(),
        ip_hash: hashedIp, // Store hash instead of plain IP
        user_agent: request.headers.get('user-agent')?.substring(0, 500) || null,
      });

    if (error) {
      log.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Viestin lähetys epäonnistui. Yritä myöhemmin uudelleen.' },
        { status: 500 }
      );
    }

    log.info('Contact form submitted successfully');
    return NextResponse.json({
      success: true,
      message: 'Kiitos yhteydenotostasi! Palaamme asiaan mahdollisimman pian.'
    });

  } catch (error) {
    log.error('Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Sisäinen virhe' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
