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
    
    let isValid = false;
    
    // Try RPC function first
    const { data: pinData, error: pinError } = await supabaseAdmin
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
        .single();
      
      if (classData) {
        // Check if PIN exists for this class
        const { data: pinExists } = await supabaseAdmin
          .from('pins')
          .select('id')
          .eq('pin', pin)
          .eq('class_id', classData.id)
          .limit(1);
        
        isValid = (pinExists && pinExists.length > 0);
        console.log(`[API/ValidatePIN] Fallback validation result: ${isValid}`);
      } else {
        console.log('[API/ValidatePIN] Class not found');
      }
    } else if (pinData && pinData.length > 0) {
      isValid = Boolean(pinData[0]?.is_valid);
      console.log(`[API/ValidatePIN] RPC validation result: ${isValid}`);
    }

    return NextResponse.json({
      success: true,
      isValid
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
