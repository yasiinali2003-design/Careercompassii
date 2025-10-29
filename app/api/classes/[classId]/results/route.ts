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
      console.warn('[API/Results] Supabase not configured - returning mock response');
      return NextResponse.json({
        success: true,
        results: []
      });
    }

    // For now, return all results for the class
    // TODO: Add teacher authentication to verify ownership
    console.log(`[API/Results] Fetching for classId: ${classId} (type: ${typeof classId})`);
    
    // Also try to see what's in the database
    const { data: allResults } = await supabaseAdmin
      .from('results')
      .select('id, class_id, pin, created_at')
      .limit(5);
    console.log(`[API/Results] Sample results in DB (first 5):`, allResults?.map(r => ({ id: r.id, class_id: r.class_id, pin: r.pin })));
    
    const { data, error } = await supabaseAdmin
      .from('results')
      .select('*')  // Select all columns to debug
      .eq('class_id', String(classId)) // Ensure string comparison
      .order('created_at', { ascending: false });
    
    console.log(`[API/Results] Query result:`, { 
      dataCount: data?.length, 
      error: error?.message,
      queryClassId: String(classId),
      sampleClassIds: data?.slice(0, 2).map(r => ({ stored: r.class_id, type: typeof r.class_id }))
    });

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

