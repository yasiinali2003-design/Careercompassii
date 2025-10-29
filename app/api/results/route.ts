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
    personalizedAnalysis: z.string().nullable().optional(),
    timeSpentSeconds: z.number().nullable().optional(),
    educationPath: z.any().nullable().optional()
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
      console.error('[API/Results] Validation failed:', JSON.stringify(validation.error.issues, null, 2));
      console.error('[API/Results] Request body:', JSON.stringify(body, null, 2));
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid request data',
          details: validation.error.issues.map(issue => ({
            path: issue.path.join('.'),
            message: issue.message,
            code: issue.code
          }))
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
    console.log(`[API/Results] Validating PIN: ${pin} for class token: ${classToken}`);
    let isValid = false;
    let classId = null;

    // Try RPC function first
    const { data: pinData, error: pinError } = await supabaseAdmin
      .rpc('validate_pin', {
        p_pin: pin,
        p_class_token: classToken
      });

    console.log(`[API/Results] RPC Response:`, { pinData, pinError: pinError?.message });

    // If RPC fails, use fallback direct query
    if (pinError) {
      console.log('[API/Results] RPC function failed or not found, using fallback');
      
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
        classId = String(classData.id); // Ensure string type for consistency
        console.log(`[API/Results] Fallback validation: isValid=${isValid}, classId=${classId} (type: ${typeof classId})`);
      } else {
        console.log('[API/Results] Class not found');
      }
    } else if (pinData && pinData.length > 0) {
      isValid = Boolean(pinData[0]?.is_valid);
      classId = String(pinData[0]?.class_id || ''); // Ensure string type
      console.log(`[API/Results] RPC validation: isValid=${isValid}, classId=${classId} (type: ${typeof classId})`);
    }

    if (!isValid || !classId) {
      return NextResponse.json(
        { success: false, error: 'PIN does not exist for this class' },
        { status: 400 }
      );
    }

    // Store result (no names, no PII)
    // Ensure classId is a valid UUID string (not just any string)
    const classIdUUID = classId; // Supabase Postgres should handle string UUID conversion
    console.log(`[API/Results] About to insert result for PIN: ${pin}, classId: ${classIdUUID} (type: ${typeof classIdUUID}, length: ${classIdUUID?.length})`);
    
    // First, verify class exists
    const { data: classCheck } = await supabaseAdmin
      .from('classes')
      .select('id')
      .eq('id', classIdUUID)
      .single();
    
    if (!classCheck) {
      console.error(`[API/Results] Class ID ${classIdUUID} does not exist in database!`);
      return NextResponse.json(
        { success: false, error: 'Class not found' },
        { status: 400 }
      );
    }
    
    console.log(`[API/Results] Class verified, inserting result...`);
    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('results')
      .insert({
        class_id: classIdUUID,
        pin,
        result_payload: resultPayload
      })
      .select('id, class_id, pin, created_at');

    if (insertError) {
      console.error('[API/Results] Error storing result:', insertError);
      console.error('[API/Results] Error details:', JSON.stringify(insertError, null, 2));
      return NextResponse.json(
        { success: false, error: 'Failed to store result', details: insertError.message },
        { status: 500 }
      );
    }

    console.log(`[API/Results] Stored result for PIN: ${pin} (class: ${classId})`);
    if (insertData && insertData.length > 0) {
      console.log(`[API/Results] Insert successful. ID: ${insertData[0].id}, class_id: ${insertData[0].class_id}, pin: ${insertData[0].pin}`);
    } else {
      console.log(`[API/Results] Insert returned no data!`);
    }

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

