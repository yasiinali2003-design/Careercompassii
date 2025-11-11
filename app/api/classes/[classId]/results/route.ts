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

    // Verify teacher authentication and ownership
    const teacherId = request.cookies.get('teacher_id')?.value;
    
    if (!teacherId) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (!supabaseAdmin) {
      console.warn('[API/Results] Supabase not configured - using local mock store');
      const fs = require('fs');
      const path = require('path');
      const mockPath = path.join(process.cwd(), 'mock-db.json');
      let store: any = { classes: [], pins: {}, results: [] };
      try {
        if (fs.existsSync(mockPath)) {
          store = JSON.parse(fs.readFileSync(mockPath, 'utf8')) || store;
        }
      } catch (error) {
        console.warn('[API/Results] Failed to read mock-db.json:', error);
      }

      const cls = (store.classes || []).find((c: any) => String(c.id) === String(classId));
      if (!cls) {
        return NextResponse.json(
          { success: false, error: 'Class not found' },
          { status: 404 }
        );
      }

      if (cls.teacher_id && cls.teacher_id !== teacherId) {
        return NextResponse.json(
          { success: false, error: 'Class not found or access denied' },
          { status: 403 }
        );
      }

      const results = (store.results || [])
        .filter((r: any) => String(r.class_id) === String(classId))
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      return NextResponse.json({
        success: true,
        results
      });
    }

    console.log(`[API/Results] Fetching for classId: ${classId} (type: ${typeof classId}, length: ${classId?.length})`);
    
    // First, check if class exists AND belongs to this teacher
    const { data: classData, error: classError } = await supabaseAdmin
      .from('classes')
      .select('id, teacher_id, class_token, created_at')
      .eq('id', classId)
      .eq('teacher_id', teacherId)
      .single();
    
    if (classError || !classData) {
      console.error('[API/Results] Class not found or access denied:', classError?.message);
      return NextResponse.json(
        { success: false, error: 'Class not found or access denied' },
        { status: 403 }
      );
    }
    
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
    
    // Determine retention window (default 3 years; Premium 5 years if teacher flagged)
    let retentionYears = 3;
    try {
      const { data: t, error: tErr } = await supabaseAdmin
        .from('teachers')
        .select('id, package')
        .eq('id', teacherId)
        .single();
      if (!tErr && t?.package && String(t.package).toLowerCase() === 'premium') {
        retentionYears = 5;
      }
    } catch {}

    const since = new Date();
    since.setFullYear(since.getFullYear() - retentionYears);

    // Query results within retention window
    let { data, error } = await supabaseAdmin
      .from('results')
      .select('*')
      .eq('class_id', classId)
      .gte('created_at', since.toISOString())
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
        const filtered = allData.filter((r: any) => String(r.class_id) === String(classId) && new Date(r.created_at) >= since);
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
        { success: false, error: 'Tulosten haku epäonnistui' },
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
      { success: false, error: 'Sisäinen palvelinvirhe' },
      { status: 500 }
    );
  }
}

