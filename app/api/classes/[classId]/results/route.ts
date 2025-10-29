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
    const { classId: rawClassId } = params;
    const classId = rawClassId?.trim(); // Trim whitespace

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
    console.log(`[API/Results] Fetching for classId: ${classId} (type: ${typeof classId}, length: ${classId?.length})`);
    
    // First, check if class exists
    const { data: classData } = await supabaseAdmin
      .from('classes')
      .select('id, class_token, created_at')
      .eq('id', classId)
      .single();
    
    console.log(`[API/Results] Class lookup:`, { found: !!classData, classId });
    
    // Also try to see what's in the database
    const { data: allResults, error: allResultsError } = await supabaseAdmin
      .from('results')
      .select('id, class_id, pin, created_at')
      .limit(10)
      .order('created_at', { ascending: false });
    
    console.log(`[API/Results] All results in DB (first 10):`, {
      count: allResults?.length || 0,
      error: allResultsError?.message,
      sample: allResults?.slice(0, 3).map((r: any) => ({ 
        id: r.id?.substring(0, 8) + '...', 
        class_id: String(r.class_id)?.substring(0, 8) + '...', 
        pin: r.pin,
        created: r.created_at 
      }))
    });
    
    // Try query with UUID cast to handle both string and UUID types
    let { data, error } = await supabaseAdmin
      .from('results')
      .select('*')  // Select all columns to debug
      .eq('class_id', classId) // Supabase should handle UUID comparison automatically
      .order('created_at', { ascending: false });
    
    // If that fails, try fetching all and filtering (fallback debug method)
    if ((!data || data.length === 0) && !error) {
      console.log(`[API/Results] Query with .eq() returned 0 results. Trying fallback: fetch all then filter...`);
      const { data: allData, error: allError } = await supabaseAdmin
        .from('results')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (allData) {
        // Filter in JavaScript
        const filtered = allData.filter((r: any) => String(r.class_id) === String(classId));
        console.log(`[API/Results] Fallback: Found ${filtered.length} results after JavaScript filter (from ${allData.length} total)`);
        
        if (filtered.length > 0) {
          data = filtered;
          error = null;
        }
      }
    }
    
    console.log(`[API/Results] Query result:`, { 
      dataCount: data?.length, 
      error: error?.message,
      queryClassId: String(classId),
      sampleClassIds: data?.slice(0, 2).map((r: any) => ({ stored: r.class_id, type: typeof r.class_id }))
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

