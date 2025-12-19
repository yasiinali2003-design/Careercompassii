import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getStaticPrograms, StudyProgramsQuery } from '@/lib/api/studyPrograms';

/**
 * GET /api/study-programs
 * 
 * Fetch study programs with filtering and pagination
 * 
 * Query parameters:
 * - points: Filter by points range (user's calculated points)
 * - type: Filter by institution type ('yliopisto' | 'amk')
 * - field: Filter by field (e.g., 'teknologia', 'terveys')
 * - careers: Comma-separated career slugs to match against
 * - search: Search in name, institution, or description
 * - limit: Number of results (default: 50, max: 100)
 * - offset: Pagination offset (default: 0)
 * - sort: Sort order ('points-low' | 'points-high' | 'name' | 'match')
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const points = searchParams.get('points') ? parseFloat(searchParams.get('points')!) : null;
    const type = searchParams.get('type') as 'yliopisto' | 'amk' | null;
    const field = searchParams.get('field');
    const careers = searchParams.get('careers')?.split(',').filter(Boolean) || [];
    const search = searchParams.get('search');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const sort = searchParams.get('sort') || 'match';
    const historyParam = searchParams.get('history') === 'true';
    const includeHistory =
      historyParam && process.env.NEXT_PUBLIC_ENABLE_POINT_HISTORY === 'true';
    const includeReach = searchParams.get('includeReach') === 'true';
    const reachCountParam = searchParams.get('reachCount');
    const reachDeltaParam = searchParams.get('reachDelta');
    const queryOptions: StudyProgramsQuery = {
      points: points ?? undefined,
      type: type ?? undefined,
      field: field && field !== 'all' ? field : undefined,
      careers,
      search: search || undefined,
      limit,
      offset,
      sort: sort as StudyProgramsQuery['sort'],
      includeHistory,
      includeReachPrograms: includeReach,
      reachCount: reachCountParam ? parseInt(reachCountParam, 10) : undefined,
      reachDelta: reachDeltaParam ? parseInt(reachDeltaParam, 10) : undefined
    };

    const respondWithStatic = () => {
      const fallback = getStaticPrograms(queryOptions);
      return NextResponse.json({
        ...fallback,
        metadata: {
          ...(fallback.metadata || {}),
          source: 'static'
        }
      });
    };

    if (!supabaseAdmin) {
      // Fallback to static data if Supabase not configured
      console.warn('[API/StudyPrograms] Supabase not configured, using static data');
      return respondWithStatic();
    }

    // Build query
    let query = supabaseAdmin
      .from('study_programs')
      .select(includeHistory ? '*, point_history:study_program_point_history(*)' : '*', { count: 'exact' });

    // Filter by institution type
    if (type) {
      query = query.eq('institution_type', type);
    }

    // Filter by field
    if (field && field !== 'all') {
      query = query.eq('field', field);
    }

    // Filter by points range
    // Include programs where: userPoints >= minPoints - 30 AND userPoints <= maxPoints + 20
    // This gives a realistic range: reach programs (30 points below) to safety programs (20 points above)
    let broaderPointsFilter = false;
    if (points !== null) {
      query = query
        .lte('min_points', points + 30)
        .or(`max_points.gte.${points - 20},max_points.is.null`);
      broaderPointsFilter = true;
    }

    // Search in name, institution, or description
    if (search) {
      query = query.or(`name.ilike.%${search}%,institution.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Filter by career matches (if careers provided)
    if (careers.length > 0) {
      // Use array overlap operator (&&) to find programs with matching careers
      query = query.filter('related_careers', 'cs', `{${careers.join(',')}}`);
    }

    // Execute query
    const { data: programsData, error, count } = await query;
    let programs = programsData;
    let totalCount = count || 0;
    let careerRelaxed = false;

    if (error) {
      console.error('[API/StudyPrograms] Database error:', error);
      return NextResponse.json(
        { error: 'Koulutusohjelmien haku epäonnistui', details: error.message },
        { status: 500 }
      );
    }

    if ((!programs || programs.length === 0) && careers.length > 0) {
      let relaxedQuery = supabaseAdmin
        .from('study_programs')
        .select(includeHistory ? '*, point_history:study_program_point_history(*)' : '*', { count: 'exact' });

      if (type) relaxedQuery = relaxedQuery.eq('institution_type', type);
      if (field && field !== 'all') relaxedQuery = relaxedQuery.eq('field', field);
      if (points !== null) {
        relaxedQuery = relaxedQuery
          .lte('min_points', points + 30)
          .or(`max_points.gte.${points - 20},max_points.is.null`);
      }
      if (search) relaxedQuery = relaxedQuery.or(`name.ilike.%${search}%,institution.ilike.%${search}%,description.ilike.%${search}%`);

      const relaxed = await relaxedQuery;
      if (!relaxed.error && relaxed.data && relaxed.data.length > 0) {
        programs = relaxed.data;
        totalCount = relaxed.count || relaxed.data.length;
        careerRelaxed = true;
      }
    }

    if (!programs || programs.length === 0) {
      if (points !== null && broaderPointsFilter) {
        const fallbackQuery = supabaseAdmin
          .from('study_programs')
          .select(includeHistory ? '*, point_history:study_program_point_history(*)' : '*', { count: 'exact' })
          .lte('min_points', points + 35)
          .or(`max_points.gte.${points - 25},max_points.is.null`);

        if (type) fallbackQuery.eq('institution_type', type);
        if (field && field !== 'all') fallbackQuery.eq('field', field);
        if (search) fallbackQuery.or(`name.ilike.%${search}%,institution.ilike.%${search}%,description.ilike.%${search}%`);
        if (careers.length > 0) fallbackQuery.filter('related_careers', 'cs', `{${careers.join(',')}}`);

        const fallback = await fallbackQuery;
        if (!fallback.error && fallback.data) {
          programs = fallback.data;
          totalCount = fallback.count ?? fallback.data.length;
        }
      }

      if (!programs || programs.length === 0) {
        return respondWithStatic();
      }
    }

    // Sort programs
    let sorted = [...programs] as any[];
    
    if (sort === 'points-low') {
      sorted.sort((a, b) => a.min_points - b.min_points);
    } else if (sort === 'points-high') {
      sorted.sort((a, b) => b.min_points - a.min_points);
    } else if (sort === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name, 'fi'));
    } else if (sort === 'match' && careers.length > 0 && points !== null) {
      // Sort by match quality: career matches first, then by points proximity
      sorted.sort((a, b) => {
        const aMatches = a.related_careers.filter((c: string) => careers.includes(c)).length;
        const bMatches = b.related_careers.filter((c: string) => careers.includes(c)).length;
        
        if (bMatches !== aMatches) {
          return bMatches - aMatches;
        }
        
        // If match count is same, sort by points proximity
        const aDiff = Math.abs(points - a.min_points);
        const bDiff = Math.abs(points - b.min_points);
        return aDiff - bDiff;
      });
    }

    // Apply pagination
    const paginated = sorted.slice(offset, offset + limit);

    // Transform to API format
    const formatted = paginated.map(p => ({
      id: p.id,
      name: p.name,
      institution: p.institution,
      institutionType: p.institution_type,
      field: p.field,
      minPoints: parseFloat(p.min_points.toString()),
      maxPoints: p.max_points ? parseFloat(p.max_points.toString()) : undefined,
      relatedCareers: p.related_careers || [],
      opintopolkuUrl: p.opintopolku_url || undefined,
      description: p.description || undefined,
      pointHistory: includeHistory && p.point_history
        ? (p.point_history as any[])
            .map(entry => ({
              year: entry.data_year,
              minPoints: entry.min_points !== null ? parseFloat(entry.min_points.toString()) : null,
              medianPoints: entry.median_points !== null ? parseFloat(entry.median_points.toString()) : null,
              maxPoints: entry.max_points !== null ? parseFloat(entry.max_points.toString()) : null,
              applicantCount: entry.applicant_count ?? null,
              notes: entry.notes || undefined
            }))
            .sort((a, b) => b.year - a.year)
        : undefined
    }));

    return NextResponse.json({
      programs: formatted,
      total: totalCount || sorted.length,
      limit,
      offset,
      hasMore: (offset + limit) < (totalCount || sorted.length),
      metadata: { fallbackCount: 0, careerRelaxed }
    });

  } catch (error: any) {
    console.error('[API/StudyPrograms] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Sisäinen palvelinvirhe', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/study-programs
 * 
 * Create or update a study program (admin only)
 * Requires authentication in production
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      institution,
      institutionType,
      field,
      minPoints,
      maxPoints,
      relatedCareers,
      opintopolkuUrl,
      description
    } = body;

    // Validate required fields
    if (!id || !name || !institution || !institutionType || !field || minPoints === undefined) {
      return NextResponse.json(
        { error: 'Pakolliset kentät puuttuvat' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Tietokanta ei ole määritetty' },
        { status: 500 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('study_programs')
      .upsert({
        id,
        name,
        institution,
        institution_type: institutionType,
        field,
        min_points: minPoints,
        max_points: maxPoints || null,
        related_careers: relatedCareers || [],
        opintopolku_url: opintopolkuUrl || null,
        description: description || null,
        data_year: 2025
      } as any, {
        onConflict: 'id'
      })
      .select()
      .single();

    if (error) {
      console.error('[API/StudyPrograms] Insert error:', error);
      return NextResponse.json(
        { error: 'Koulutusohjelman tallennus epäonnistui', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      program: data
    });

  } catch (error: any) {
    console.error('[API/StudyPrograms] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Sisäinen palvelinvirhe', details: error.message },
      { status: 500 }
    );
  }
}
