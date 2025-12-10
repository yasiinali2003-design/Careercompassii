import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawPin = typeof body.pin === 'string' ? body.pin : '';
    const rawClassToken = typeof body.classToken === 'string' ? body.classToken : '';

    const pin = rawPin.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    const classToken = rawClassToken.trim();

    // Validate input
    if (!pin || !classToken || pin.length < 4 || pin.length > 6) {
      return NextResponse.json(
        { success: false, error: 'Virheellinen PIN-koodi tai luokka-tunniste' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      // Local mock mode: validate using mock-db.json just like the results endpoint
      const mockPath = require('path').join(process.cwd(), 'mock-db.json');
      const fs = require('fs');
      let store: any = { classes: [], pins: {}, results: [] };
      try {
        if (fs.existsSync(mockPath)) {
          store = JSON.parse(fs.readFileSync(mockPath, 'utf8')) || store;
        }
      } catch (error) {
        console.warn('[API/ValidatePIN] Failed to read mock-db.json:', error);
      }

      const cls = (store.classes || []).find((c: any) => c.class_token === classToken);
      const classId = cls?.id;
      const classPins: string[] = (classId && store.pins?.[classId]) || [];
      const isValid = Boolean(classId && classPins.includes(pin));

      return NextResponse.json({
        success: true,
        isValid
      });
    }

    // Validate PIN exists and belongs to class
    console.log(`[API/ValidatePIN] Validating PIN: ${pin} for class: ${classToken}`);
    
    let isValid = false;
    
    // Try RPC function first
    const { data: pinData, error: pinError } = await (supabaseAdmin as any)
      .rpc('validate_pin', {
        p_pin: pin,
        p_class_token: classToken
      });

    console.log(`[API/ValidatePIN] RPC Response:`, { pinData, pinError: pinError?.message });

    // If RPC fails, use fallback direct query
    if (pinError) {
      console.log('[API/ValidatePIN] RPC function failed or not found, using fallback');

      // Get class by token
      const { data: classData } = await supabaseAdmin
        .from('classes')
        .select('id')
        .eq('class_token', classToken)
        .single() as { data: { id: string } | null; error: any };

      if (classData) {
        // Check if PIN exists for this class
        const { data: pinExists } = await supabaseAdmin
          .from('pins')
          .select('id')
          .eq('pin', pin)
          .eq('class_id', classData.id)
          .limit(1) as { data: any[] | null; error: any };

        isValid = Boolean(pinExists && pinExists.length > 0);
        console.log(`[API/ValidatePIN] Fallback validation result: ${isValid}`);
      } else {
        console.log('[API/ValidatePIN] Class not found');
      }
    } else if (pinData && (pinData as any[]).length > 0) {
      isValid = Boolean((pinData as any[])[0]?.is_valid);
      console.log(`[API/ValidatePIN] RPC validation result: ${isValid}`);
    }

    return NextResponse.json({
      success: true,
      isValid
    });

  } catch (error) {
    console.error('[API/ValidatePIN] Unexpected error:', error);
    return NextResponse.json(
      { success: false, isValid: false, error: 'Sisäinen palvelinvirhe' },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/validate-pin',
    method: 'POST'
  });
}
