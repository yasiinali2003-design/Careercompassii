import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

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

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Virheellinen sähköpostiosoite' },
        { status: 400 }
      );
    }

    // Honeypot check (if website field is filled, it's likely a bot)
    if (body.website) {
      // Silently reject but return success to not tip off bots
      return NextResponse.json({ success: true });
    }

    if (!supabaseAdmin) {
      console.error('[Contact] Supabase not configured');
      return NextResponse.json(
        { success: false, error: 'Palveluvirhe. Yritä myöhemmin uudelleen.' },
        { status: 500 }
      );
    }

    // Save to Supabase (table not in generated types yet)
    const { error } = await (supabaseAdmin as unknown as { from: (table: string) => { insert: (data: Record<string, unknown>) => Promise<{ error: unknown }> } })
      .from('contact_submissions')
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        organization: organization?.trim() || null,
        organization_type: organizationType || null,
        message: message.trim(),
        submitted_at: new Date().toISOString(),
        ip_address: request.headers.get('x-forwarded-for')?.split(',')[0] ||
                    request.headers.get('x-real-ip') ||
                    'unknown',
        user_agent: request.headers.get('user-agent') || null,
      });

    if (error) {
      console.error('[Contact] Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Viestin lähetys epäonnistui. Yritä myöhemmin uudelleen.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Kiitos yhteydenotostasi! Palaamme asiaan mahdollisimman pian.'
    });

  } catch (error) {
    console.error('[Contact] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Sisäinen virhe' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
