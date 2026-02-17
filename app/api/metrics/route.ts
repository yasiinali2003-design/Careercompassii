/**
 * Release A Week 3 Day 1: Core Metrics API Endpoint
 *
 * POST /api/metrics - Track metric events
 * GET /api/metrics - Get metrics summary (authenticated only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { MetricsEvent, MetricsQuery, MetricsSummary } from '@/lib/metrics/types';

/**
 * POST /api/metrics
 * Track a metric event (career click, none relevant, teacher feedback, etc.)
 */
export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!supabaseAdmin) {
      console.error('[metrics] Supabase not configured');
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const body: MetricsEvent = await request.json();

    // Validate required fields
    if (!body.session_id || !body.event_type || !body.event_data || !body.cohort) {
      return NextResponse.json(
        { error: 'Missing required fields: session_id, event_type, event_data, cohort' },
        { status: 400 }
      );
    }

    // Validate event_type
    const validEventTypes = [
      'career_click',
      'none_relevant',
      'teacher_feedback',
      'session_start',
      'session_complete'
    ];
    if (!validEventTypes.includes(body.event_type)) {
      return NextResponse.json(
        { error: `Invalid event_type. Must be one of: ${validEventTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Insert metric event into database (core_metrics table types not yet generated)
    const { data, error } = await (supabaseAdmin as any)
      .from('core_metrics')
      .insert({
        session_id: body.session_id,
        event_type: body.event_type,
        event_data: body.event_data as any,
        cohort: body.cohort,
        sub_cohort: body.sub_cohort || null
      })
      .select()
      .single();

    if (error) {
      console.error('[metrics] Error inserting metric:', error);
      return NextResponse.json(
        { error: 'Failed to track metric', details: error.message },
        { status: 500 }
      );
    }

    console.log(`[metrics] Tracked ${body.event_type} for session ${body.session_id} (cohort: ${body.cohort})`);

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('[metrics] Error in POST /api/metrics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/metrics?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD&cohort=YLA
 * Get metrics summary (authenticated users only)
 */
export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!supabaseAdmin) {
      console.error('[metrics] Supabase not configured');
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query: MetricsQuery = {
      start_date: searchParams.get('start_date') || undefined,
      end_date: searchParams.get('end_date') || undefined,
      cohort: searchParams.get('cohort') || undefined,
      sub_cohort: searchParams.get('sub_cohort') || undefined,
      event_type: searchParams.get('event_type') as any || undefined
    };

    // Set default date range to last 7 days if not specified
    const endDate = query.end_date || new Date().toISOString().split('T')[0];
    const startDate = query.start_date || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Build query for core_metrics table
    let metricsQuery = supabaseAdmin
      .from('core_metrics')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate + 'T23:59:59');

    if (query.cohort) {
      metricsQuery = metricsQuery.eq('cohort', query.cohort);
    }
    if (query.sub_cohort) {
      metricsQuery = metricsQuery.eq('sub_cohort', query.sub_cohort);
    }
    if (query.event_type) {
      metricsQuery = metricsQuery.eq('event_type', query.event_type);
    }

    const { data: events, error } = await metricsQuery;

    if (error) {
      console.error('[metrics] Error fetching metrics:', error);
      return NextResponse.json(
        { error: 'Failed to fetch metrics', details: error.message },
        { status: 500 }
      );
    }

    // Calculate summary metrics
    const summary = calculateMetricsSummary(events || [], startDate, endDate);

    return NextResponse.json({
      success: true,
      summary,
      raw_events: events
    });

  } catch (error) {
    console.error('[metrics] Error in GET /api/metrics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Helper function to calculate metrics summary from raw events
 */
function calculateMetricsSummary(
  events: any[],
  startDate: string,
  endDate: string
): MetricsSummary {
  // Get unique sessions that started
  const sessionStarts = new Set(
    events.filter(e => e.event_type === 'session_start').map(e => e.session_id)
  );
  const totalSessions = sessionStarts.size;

  // Core Metric 1: Career Click Rate
  const sessionsWithClicks = new Set(
    events.filter(e => e.event_type === 'career_click').map(e => e.session_id)
  );
  const careerClickRate = totalSessions > 0
    ? Math.round((sessionsWithClicks.size / totalSessions) * 100 * 100) / 100
    : 0;

  // Core Metric 2: Teacher Feedback
  const teacherFeedbackEvents = events.filter(e => e.event_type === 'teacher_feedback');
  const ratings = teacherFeedbackEvents.map(e => e.event_data.rating);
  const averageRating = ratings.length > 0
    ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 100) / 100
    : 0;

  const ratingDistribution: { [key: number]: number } = {};
  for (let i = 1; i <= 5; i++) {
    ratingDistribution[i] = ratings.filter(r => r === i).length;
  }

  // Core Metric 3: None Relevant Rate
  const noneRelevantSessions = new Set(
    events.filter(e => e.event_type === 'none_relevant').map(e => e.session_id)
  );
  const noneRelevantRate = totalSessions > 0
    ? Math.round((noneRelevantSessions.size / totalSessions) * 100 * 100) / 100
    : 0;

  return {
    careerClickRate: {
      total_sessions: totalSessions,
      sessions_with_clicks: sessionsWithClicks.size,
      click_rate: careerClickRate
    },
    teacherFeedback: {
      total_ratings: teacherFeedbackEvents.length,
      average_rating: averageRating,
      rating_distribution: ratingDistribution
    },
    noneRelevantRate: {
      total_sessions: totalSessions,
      none_relevant_count: noneRelevantSessions.size,
      none_relevant_rate: noneRelevantRate
    },
    time_period: {
      start_date: startDate,
      end_date: endDate
    }
  };
}
