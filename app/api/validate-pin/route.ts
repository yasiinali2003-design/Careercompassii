import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pin, classToken } = body;

    // Validate input
    if (!pin || !classToken) {
      return NextResponse.json(
        { success: false, error: 'Missing PIN or class token' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Validate PIN exists and belongs to class
    console.log(`[API/ValidatePIN] Validating PIN: ${pin} for class: ${classToken}`);
    const { data: pinData, error: pinError } = await supabaseAdmin
      .rpc('validate_pin', {
        p_pin: pin,
        p_class_token: classToken
      });

    console.log(`[API/ValidatePIN] RPC Response:`, { pinData, pinError: pinError?.message });

    if (pinError) {
      console.error('[API/ValidatePIN] RPC Error:', pinError);
      return NextResponse.json(
        { success: false, isValid: false, error: 'PIN validation failed - database error' },
        { status: 200 }
      );
    }

    if (!pinData || pinData.length === 0) {
      console.log('[API/ValidatePIN] No data returned from RPC');
      return NextResponse.json(
        { success: false, isValid: false, error: 'PIN validation failed - no data' },
        { status: 200 }
      );
    }

    const isValid = pinData[0]?.is_valid;
    console.log(`[API/ValidatePIN] PIN is valid: ${isValid}`);

    return NextResponse.json({
      success: true,
      isValid: Boolean(isValid)
    });

  } catch (error) {
    console.error('[API/ValidatePIN] Unexpected error:', error);
    return NextResponse.json(
      { success: false, isValid: false, error: 'Internal server error' },
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

