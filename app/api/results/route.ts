/**
 * POST /api/results
 * Submit test results (student with PIN)
 * 
 * Request: { pin: string, classToken: string, resultPayload: object }
 * Response: { success: boolean }
 * 
 * IMPORTANT: No names, no PII stored on server
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rateLimit';
import { z } from 'zod';

// Validation schema
const SubmitResultSchema = z.object({
  pin: z.string().min(4).max(6),
  classToken: z.string(),
  resultPayload: z.object({
    cohort: z.enum(['YLA', 'TASO2', 'NUORI']),
    topCareers: z.array(z.object({
      slug: z.string(),
      title: z.string(),
      score: z.number()
    })),
    dimensionScores: z.object({
      interests: z.number(),
      values: z.number(),
      workstyle: z.number(),
      context: z.number()
    }),
    personalizedAnalysis: z.string().optional(),
    timeSpentSeconds: z.number().optional(),
    educationPath: z.any().optional()
  })
});

export async function POST(request: NextRequest) {
  try {
    // Check rate limit first
    const rateLimitCheck = await checkRateLimit(request);
    if (rateLimitCheck) {
      return NextResponse.json(
        { 
          success: false, 
          error: rateLimitCheck.message || 'Too many requests',
          code: 'RATE_LIMIT_EXCEEDED'
        },
        { 
          status: 429,
          headers: rateLimitCheck.headers || {}
        }
      );
    }

    // Parse and validate request
    const body = await request.json();
    const validation = SubmitResultSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid request data',
          details: validation.error.issues
        },
        { status: 400 }
      );
    }

    const { pin, classToken, resultPayload } = validation.data;

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Validate PIN exists and belongs to class
    const { data: pinData, error: pinError } = await supabaseAdmin
      .rpc('validate_pin', {
        p_pin: pin,
        p_class_token: classToken
      });

    if (pinError || !pinData || pinData.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid PIN or class token' },
        { status: 400 }
      );
    }

    const isValid = pinData[0]?.is_valid;
    const classId = pinData[0]?.class_id;

    if (!isValid || !classId) {
      return NextResponse.json(
        { success: false, error: 'PIN does not exist for this class' },
        { status: 400 }
      );
    }

    // Store result (no names, no PII)
    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('results')
      .insert({
        class_id: classId,
        pin,
        result_payload: resultPayload
      })
      .select();

    if (insertError) {
      console.error('[API/Results] Error storing result:', insertError);
      return NextResponse.json(
        { success: false, error: 'Failed to store result' },
        { status: 500 }
      );
    }

    console.log(`[API/Results] Stored result for PIN: ${pin} (class: ${classId})`);
    console.log(`[API/Results] Insert returned:`, insertData);

    return NextResponse.json({
      success: true,
      message: 'Result submitted successfully'
    });

  } catch (error) {
    console.error('[API/Results] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/results',
    methods: ['POST'],
    description: 'Submit test results (anonymous)'
  });
}

