/**
 * GET /api/score/[resultId]
 * Retrieve stored test results by ID
 *
 * This ensures users always see the EXACT same results when revisiting
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resultId: string }> }
) {
  try {
    const { resultId } = await params;

    if (!resultId) {
      return NextResponse.json(
        { success: false, error: 'Tuloksen tunniste puuttuu' },
        { status: 400 }
      );
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(resultId)) {
      return NextResponse.json(
        { success: false, error: 'Virheellinen tunnisteen muoto' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: 'Tietokanta ei ole määritetty' },
        { status: 503 }
      );
    }

    // Fetch the result from database
    // First try with full_results, then fallback to without it if column doesn't exist
    let data: any = null;
    let error: any = null;

    // Try fetching with full_results first
    const fullResult = await supabaseAdmin
      .from('test_results')
      .select('id, cohort, full_results, dimension_scores, top_careers, education_path_primary, education_path_scores, created_at')
      .eq('id', resultId)
      .single();

    if (fullResult.error?.code === '42703' && fullResult.error?.message?.includes('full_results')) {
      // Column doesn't exist, retry without it
      console.log('[API] full_results column not found, fetching without it');
      const partialResult = await supabaseAdmin
        .from('test_results')
        .select('id, cohort, dimension_scores, top_careers, education_path_primary, education_path_scores, created_at')
        .eq('id', resultId)
        .single();
      data = partialResult.data;
      error = partialResult.error;
    } else {
      data = fullResult.data;
      error = fullResult.error;
    }

    if (error) {
      console.error('[API] Error fetching result:', error);
      return NextResponse.json(
        { success: false, error: 'Tulosta ei löydy' },
        { status: 404 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Tulosta ei löydy' },
        { status: 404 }
      );
    }

    // If we have full_results stored, return it directly (exact same results)
    if (data.full_results) {
      console.log('[API] Returning full stored results for ID:', resultId);
      return NextResponse.json({
        success: true,
        resultId: data.id,
        createdAt: data.created_at,
        ...data.full_results
      });
    }

    // Fallback: reconstruct from partial data (for older results without full_results)
    console.log('[API] Reconstructing results from partial data for ID:', resultId);
    const reconstructedResults = {
      success: true,
      resultId: data.id,
      createdAt: data.created_at,
      cohort: data.cohort,
      userProfile: {
        cohort: data.cohort,
        dimensionScores: data.dimension_scores || {
          interests: 0,
          values: 0,
          workstyle: 0,
          context: 0
        },
        topStrengths: [],
        personalizedAnalysis: undefined
      },
      topCareers: (data.top_careers || []).map((c: any) => ({
        slug: c.slug,
        title: c.title,
        category: '',
        overallScore: c.score || 0,
        dimensionScores: { interests: 0, values: 0, workstyle: 0, context: 0 },
        reasons: [],
        confidence: 'medium' as const
      })),
      educationPath: data.education_path_primary ? {
        primary: data.education_path_primary,
        scores: data.education_path_scores || {},
        reasoning: '',
        confidence: 'medium' as const
      } : null,
      cohortCopy: {
        title: '',
        subtitle: '',
        ctaText: '',
        shareText: ''
      }
    };

    return NextResponse.json(reconstructedResults);

  } catch (error) {
    console.error('[API] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Sisäinen palvelinvirhe' },
      { status: 500 }
    );
  }
}
