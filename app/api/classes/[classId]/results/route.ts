/**
 * GET /api/classes/[classId]/results
 * Get test results for a class (teacher only)
 * 
 * Response: { results: Array<{ pin, resultPayload, createdAt }> }
 * 
 * NOTE: Teacher must provide name mapping client-side
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

interface RouteParams {
  params: {
    classId: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { classId } = params;

    if (!classId) {
      return NextResponse.json(
        { success: false, error: 'Missing classId' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      );
    }

    // For now, return all results for the class
    // TODO: Add teacher authentication to verify ownership
    const { data, error } = await supabaseAdmin
      .from('results')
      .select('pin, result_payload, created_at')
      .eq('class_id', classId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[API/Results] Error fetching results:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch results' },
        { status: 500 }
      );
    }

    console.log(`[API/Results] Fetched ${data?.length || 0} results for class ${classId}`);

    return NextResponse.json({
      success: true,
      results: data || []
    });

  } catch (error) {
    console.error('[API/Results] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

