/**
 * API Endpoint for School-Wide Analytics
 * GET /api/admin/school-analytics
 * 
 * Query params:
 * - teacherId: optional, filter by specific teacher
 * - teacherIds: optional, comma-separated list of teacher IDs
 * - since: optional, filter results since this date (ISO string)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { calculateSchoolAnalytics, ClassWithResults } from '@/lib/schoolAnalytics';

export async function GET(request: NextRequest) {
  try {
    // Check admin auth (similar to other admin endpoints)
    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || '';
    const authHeader = request.headers.get('authorization') || '';
    const expected = adminPass ? 'Basic ' + Buffer.from(`${adminUser}:${adminPass}`).toString('base64') : '';
    const hasValidBasicAuth = adminPass && expected && authHeader === expected;
    const adminCookie = request.cookies.get('admin_auth');
    const hasAdminCookie = adminCookie?.value === 'yes';
    const isDevMode = process.env.NODE_ENV === 'development';

    // Allow access if:
    // 1. Development mode OR
    // 2. No password configured OR
    // 3. Valid Basic Auth OR
    // 4. Admin cookie exists
    if (!isDevMode && adminPass && !hasValidBasicAuth && !hasAdminCookie) {
      return NextResponse.json(
        { success: false, error: 'Ei käyttöoikeutta' },
        { status: 401 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: 'Tietokantaa ei ole määritelty' },
        { status: 500 }
      );
    }

    const { searchParams } = request.nextUrl;
    const teacherId = searchParams.get('teacherId');
    const teacherIdsParam = searchParams.get('teacherIds');
    const since = searchParams.get('since');

    // Build query for classes
    let classesQuery = supabaseAdmin.from('classes').select('id, teacher_id, created_at');
    
    if (teacherId) {
      classesQuery = classesQuery.eq('teacher_id', teacherId);
    } else if (teacherIdsParam) {
      const teacherIds = teacherIdsParam.split(',').map(id => id.trim()).filter(Boolean);
      if (teacherIds.length > 0) {
        classesQuery = classesQuery.in('teacher_id', teacherIds);
      }
    }

    const { data: classes, error: classesError } = await classesQuery;

    if (classesError) {
      console.error('[School Analytics] Error fetching classes:', classesError);
      return NextResponse.json(
        { success: false, error: 'Luokkien haku epäonnistui' },
        { status: 500 }
      );
    }

    if (!classes || classes.length === 0) {
      return NextResponse.json({
        success: true,
        analytics: {
          totalTests: 0,
          totalClasses: 0,
          topCareers: [],
          educationPathDistribution: { lukio: 0, ammattikoulu: 0, kansanopisto: 0 },
          dimensionAverages: { interests: 0, values: 0, workstyle: 0, context: 0 },
          cohortDistribution: {},
          trends: { byMonth: [], byYear: [] },
          insights: [],
        },
      });
    }

    const classIds = classes.map((c: any) => c.id);

    // Fetch all results for these classes
    let resultsQuery = supabaseAdmin
      .from('results')
      .select('*')
      .in('class_id', classIds);

    if (since) {
      resultsQuery = resultsQuery.gte('created_at', new Date(since).toISOString());
    }

    const { data: allResults, error: resultsError } = await resultsQuery;

    if (resultsError) {
      console.error('[School Analytics] Error fetching results:', resultsError);
      return NextResponse.json(
        { success: false, error: 'Tulosten haku epäonnistui' },
        { status: 500 }
      );
    }

    // Group results by class
    const classesWithResults: ClassWithResults[] = classes.map((classData: any) => {
      const classResults = (allResults || []).filter(
        (r: any) => r.class_id === classData.id
      );
      return {
        classId: classData.id,
        createdAt: classData.created_at,
        teacherId: classData.teacher_id,
        results: classResults,
      };
    });

    // Calculate school-wide analytics
    const analytics = calculateSchoolAnalytics(classesWithResults);

    return NextResponse.json({
      success: true,
      analytics,
    });
  } catch (error: any) {
    console.error('[School Analytics] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Sisäinen palvelinvirhe' },
      { status: 500 }
    );
  }
}

