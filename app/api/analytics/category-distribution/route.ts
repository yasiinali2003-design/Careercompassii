/**
 * CATEGORY DISTRIBUTION ANALYTICS API
 * Tracks which categories are being matched to users
 * Helps identify if the category expansion solved the 77% "auttaja" problem
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      cohort,
      dominant_category,
      category_scores,
      recommended_careers,
      user_subdimensions
    } = body;

    // Validate required fields
    if (!cohort || !dominant_category || !recommended_careers) {
      return NextResponse.json(
        { error: 'Pakolliset kentät puuttuvat' },
        { status: 400 }
      );
    }

    // Check if supabase client is available
    if (!supabase) {
      return NextResponse.json(
        { error: 'Tietokanta ei ole määritetty' },
        { status: 500 }
      );
    }

    // Store analytics data
    const { error } = await supabase.from('category_analytics').insert({
      cohort,
      dominant_category,
      category_scores,
      recommended_careers,
      user_subdimensions,
      created_at: new Date().toISOString()
    } as any);

    if (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error storing analytics:', error);
      }
      return NextResponse.json(
        { error: 'Analytiikan tallennus epäonnistui' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Sisäinen palvelinvirhe' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30', 10);
    const cohort = searchParams.get('cohort');

    // Check if supabase client is available
    if (!supabase) {
      return NextResponse.json(
        { error: 'Tietokanta ei ole määritetty' },
        { status: 500 }
      );
    }

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let query = supabase
      .from('category_analytics')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (cohort) {
      query = query.eq('cohort', cohort);
    }

    const { data, error } = await query;

    if (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching analytics:', error);
      }
      return NextResponse.json(
        { error: 'Analytiikan haku epäonnistui' },
        { status: 500 }
      );
    }

    // Calculate aggregated metrics
    const totalMatches = data?.length || 0;
    const categoryDistribution: Record<string, number> = {};
    const cohortBreakdown: Record<string, number> = {};

    data?.forEach((row: { dominant_category: string; cohort: string }) => {
      // Count dominant categories
      categoryDistribution[row.dominant_category] =
        (categoryDistribution[row.dominant_category] || 0) + 1;

      // Count cohorts
      cohortBreakdown[row.cohort] =
        (cohortBreakdown[row.cohort] || 0) + 1;
    });

    // Convert to percentages
    const categoryPercentages: Record<string, number> = {};
    Object.entries(categoryDistribution).forEach(([category, count]) => {
      categoryPercentages[category] = totalMatches > 0
        ? Math.round((count / totalMatches) * 100)
        : 0;
    });

    return NextResponse.json({
      totalMatches,
      categoryDistribution: categoryPercentages,
      cohortBreakdown,
      dateRange: {
        from: startDate.toISOString(),
        to: new Date().toISOString()
      },
      // Historical comparison
      auttajaPercentage: categoryPercentages['auttaja'] || 0,
      isBalanced: calculateBalanceScore(categoryPercentages)
    });
  } catch {
    return NextResponse.json(
      { error: 'Sisäinen palvelinvirhe' },
      { status: 500 }
    );
  }
}

/**
 * Calculates a balance score (0-100)
 * 100 = perfectly balanced (12.5% each category)
 * 0 = extremely imbalanced
 */
function calculateBalanceScore(distribution: Record<string, number>): number {
  const expectedPercentage = 100 / 8;  // 12.5% per category
  const categories = Object.values(distribution);

  if (categories.length === 0) return 0;

  // Calculate average deviation from expected
  const avgDeviation = categories.reduce((sum, percentage) => {
    return sum + Math.abs(percentage - expectedPercentage);
  }, 0) / categories.length;

  // Convert to score (0-100)
  // Lower deviation = higher score
  const maxDeviation = 100 - expectedPercentage;  // Max possible deviation
  const score = Math.max(0, 100 - (avgDeviation / maxDeviation) * 100);

  return Math.round(score);
}
