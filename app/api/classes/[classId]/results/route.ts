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
import { createLogger } from '@/lib/logger';

const log = createLogger('API/Results');

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
        { success: false, error: 'Luokan tunniste puuttuu' },
        { status: 400 }
      );
    }

    // Verify teacher authentication and ownership
    const teacherId = request.cookies.get('teacher_id')?.value;
    
    if (!teacherId) {
      return NextResponse.json(
        { success: false, error: 'Ei kirjautunut' },
        { status: 401 }
      );
    }

    if (!supabaseAdmin) {
      log.warn('Supabase not configured - using local mock store');
      const fs = require('fs');
      const path = require('path');
      const mockPath = path.join(process.cwd(), 'mock-db.json');
      let store: any = { classes: [], pins: {}, results: [] };
      try {
        if (fs.existsSync(mockPath)) {
          store = JSON.parse(fs.readFileSync(mockPath, 'utf8')) || store;
        }
      } catch (error) {
        log.warn('Failed to read mock-db.json:', error);
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

    log.debug(`Fetching for classId: ${classId}, teacherId: ${teacherId}`);

    // First, check if class exists AND belongs to this teacher
    const { data: classData, error: classError } = await supabaseAdmin
      .from('classes')
      .select('id, teacher_id, class_token, created_at')
      .eq('id', classId)
      .maybeSingle() as { data: { id: string; teacher_id: string | null; class_token: string; created_at: string } | null; error: any };

    if (classError) {
      log.error('Class query error:', classError?.message);
      return NextResponse.json(
        { success: false, error: 'Database error' },
        { status: 500 }
      );
    }

    if (!classData) {
      log.debug('Class not found:', classId);
      return NextResponse.json(
        { success: false, error: 'Class not found' },
        { status: 404 }
      );
    }

    // Check ownership - allow if teacher_id matches OR if teacher_id is null (legacy classes)
    if (classData.teacher_id && classData.teacher_id !== teacherId) {
      log.warn('Access denied - teacher mismatch');
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    log.debug('Class lookup successful:', classId);
    
    // Determine retention window (default 3 years; Premium 5 years if teacher flagged)
    let retentionYears = 3;
    try {
      const { data: t, error: tErr } = await supabaseAdmin
        .from('teachers')
        .select('id, package')
        .eq('id', teacherId)
        .single() as { data: { id: string; package?: string } | null; error: any };
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
      log.debug('Query returned 0 results, trying fallback filter');
      const { data: allData } = await supabaseAdmin
        .from('results')
        .select('*')
        .order('created_at', { ascending: false });

      if (allData) {
        // Filter in JavaScript
        const filtered = allData.filter((r: any) => String(r.class_id) === String(classId) && new Date(r.created_at) >= since);
        log.debug(`Fallback found ${filtered.length} results`);

        if (filtered.length > 0) {
          data = filtered;
          error = null;
        }
      }
    }

    if (error) {
      log.error('Error fetching results:', error);
      return NextResponse.json(
        { success: false, error: 'Tulosten haku epäonnistui' },
        { status: 500 }
      );
    }

    log.debug(`Fetched ${data?.length || 0} results for class ${classId}`);

    return NextResponse.json({
      success: true,
      results: data || []
    });

  } catch (error) {
    log.error('Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Sisäinen palvelinvirhe' },
      { status: 500 }
    );
  }
}

