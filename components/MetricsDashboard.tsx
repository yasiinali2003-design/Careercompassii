/**
 * Release A Week 3 Day 1: Core Metrics Dashboard Component
 *
 * Displays the 3 core metrics for teachers/admins:
 * 1. Career Click Rate
 * 2. Teacher Feedback Average
 * 3. None Relevant Rate
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { MetricsSummary } from '@/lib/metrics/types';

interface MetricsDashboardProps {
  startDate?: string;
  endDate?: string;
  cohort?: string;
  subCohort?: string;
}

export function MetricsDashboard({
  startDate,
  endDate,
  cohort,
  subCohort
}: MetricsDashboardProps) {
  const [metrics, setMetrics] = useState<MetricsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (startDate) params.set('start_date', startDate);
      if (endDate) params.set('end_date', endDate);
      if (cohort) params.set('cohort', cohort);
      if (subCohort) params.set('sub_cohort', subCohort);

      const response = await fetch(`/api/metrics?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }

      const data = await response.json();
      setMetrics(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, cohort, subCohort]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardHeader>
              <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Error Loading Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error || 'No data available'}</p>
          <button
            onClick={fetchMetrics}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </CardContent>
      </Card>
    );
  }

  const { careerClickRate, teacherFeedback, noneRelevantRate, time_period } = metrics;

  // Determine status colors based on thresholds
  const getClickRateStatus = (rate: number) => {
    if (rate >= 60) return { color: 'text-green-600', bg: 'bg-green-50', label: 'Excellent' };
    if (rate >= 50) return { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Good' };
    if (rate >= 40) return { color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Fair' };
    return { color: 'text-red-600', bg: 'bg-red-50', label: 'Needs Improvement' };
  };

  const getFeedbackStatus = (rating: number) => {
    if (rating >= 4.0) return { color: 'text-green-600', bg: 'bg-green-50', label: 'Excellent' };
    if (rating >= 3.5) return { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Good' };
    if (rating >= 3.0) return { color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Fair' };
    return { color: 'text-red-600', bg: 'bg-red-50', label: 'Needs Improvement' };
  };

  const getNoneRelevantStatus = (rate: number) => {
    if (rate <= 15) return { color: 'text-green-600', bg: 'bg-green-50', label: 'Excellent' };
    if (rate <= 20) return { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Good' };
    if (rate <= 30) return { color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Fair' };
    return { color: 'text-red-600', bg: 'bg-red-50', label: 'Needs Improvement' };
  };

  const clickRateStatus = getClickRateStatus(careerClickRate.click_rate);
  const feedbackStatus = getFeedbackStatus(teacherFeedback.average_rating);
  const noneRelevantStatus = getNoneRelevantStatus(noneRelevantRate.none_relevant_rate);

  return (
    <div>
      <div className="mb-4 text-sm text-gray-600">
        Showing metrics from {time_period.start_date} to {time_period.end_date}
        {cohort && ` for cohort: ${cohort}`}
        {subCohort && ` (${subCohort})`}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Core Metric 1: Career Click Rate */}
        <Card className={clickRateStatus.bg}>
          <CardHeader>
            <CardTitle className="text-lg">Career Click Rate</CardTitle>
            <CardDescription>
              % of users who click ≥1 career
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-4xl font-bold ${clickRateStatus.color}`}>
              {careerClickRate.click_rate}%
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {careerClickRate.sessions_with_clicks} / {careerClickRate.total_sessions} sessions
            </div>
            <div className={`mt-2 text-sm font-semibold ${clickRateStatus.color}`}>
              {clickRateStatus.label}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Target: ≥60% (Good: ≥50%)
            </div>
          </CardContent>
        </Card>

        {/* Core Metric 2: Teacher Feedback */}
        <Card className={feedbackStatus.bg}>
          <CardHeader>
            <CardTitle className="text-lg">Teacher Feedback</CardTitle>
            <CardDescription>
              Average rating (1-5 scale)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-4xl font-bold ${feedbackStatus.color}`}>
              {teacherFeedback.average_rating > 0 ? teacherFeedback.average_rating.toFixed(2) : '—'}
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {teacherFeedback.total_ratings} rating{teacherFeedback.total_ratings !== 1 ? 's' : ''}
            </div>
            <div className={`mt-2 text-sm font-semibold ${feedbackStatus.color}`}>
              {teacherFeedback.total_ratings > 0 ? feedbackStatus.label : 'No data yet'}
            </div>

            {/* Rating Distribution */}
            {teacherFeedback.total_ratings > 0 && (
              <div className="mt-3 space-y-1">
                {[5, 4, 3, 2, 1].map(rating => {
                  const count = teacherFeedback.rating_distribution[rating] || 0;
                  const percentage = teacherFeedback.total_ratings > 0
                    ? (count / teacherFeedback.total_ratings) * 100
                    : 0;

                  return (
                    <div key={rating} className="flex items-center gap-2 text-xs">
                      <span className="w-8">{rating}★</span>
                      <div className="flex-1 bg-gray-200 rounded h-2">
                        <div
                          className="bg-blue-600 h-2 rounded"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-8 text-gray-600">{count}</span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-2 text-xs text-gray-500">
              Target: ≥4.0 (Good: ≥3.5)
            </div>
          </CardContent>
        </Card>

        {/* Core Metric 3: None Relevant Rate */}
        <Card className={noneRelevantStatus.bg}>
          <CardHeader>
            <CardTitle className="text-lg">None Relevant Rate</CardTitle>
            <CardDescription>
              % who clicked &quot;Ei mikään näistä sovi&quot;
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-4xl font-bold ${noneRelevantStatus.color}`}>
              {noneRelevantRate.none_relevant_rate}%
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {noneRelevantRate.none_relevant_count} / {noneRelevantRate.total_sessions} sessions
            </div>
            <div className={`mt-2 text-sm font-semibold ${noneRelevantStatus.color}`}>
              {noneRelevantStatus.label}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Target: ≤15% (Good: ≤20%)
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Insights */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-lg">Summary Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {careerClickRate.click_rate >= 60 && (
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>
                  <strong>Excellent engagement!</strong> {careerClickRate.click_rate}% of students clicked on careers,
                  exceeding the 60% target.
                </span>
              </div>
            )}
            {careerClickRate.click_rate < 50 && (
              <div className="flex items-start gap-2">
                <span className="text-red-600">!</span>
                <span>
                  <strong>Low engagement.</strong> Only {careerClickRate.click_rate}% of students clicked on careers.
                  Consider reviewing recommendation relevance.
                </span>
              </div>
            )}

            {teacherFeedback.total_ratings > 0 && teacherFeedback.average_rating >= 4.0 && (
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>
                  <strong>Teachers are satisfied!</strong> Average rating of {teacherFeedback.average_rating.toFixed(2)}/5.0
                  from {teacherFeedback.total_ratings} teacher{teacherFeedback.total_ratings > 1 ? 's' : ''}.
                </span>
              </div>
            )}
            {teacherFeedback.total_ratings > 0 && teacherFeedback.average_rating < 3.5 && (
              <div className="flex items-start gap-2">
                <span className="text-red-600">!</span>
                <span>
                  <strong>Teachers report quality issues.</strong> Average rating only {teacherFeedback.average_rating.toFixed(2)}/5.0.
                  Review teacher feedback comments.
                </span>
              </div>
            )}

            {noneRelevantRate.none_relevant_rate <= 15 && (
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>
                  <strong>High relevance!</strong> Only {noneRelevantRate.none_relevant_rate}% of students said
                  recommendations didn&apos;t fit.
                </span>
              </div>
            )}
            {noneRelevantRate.none_relevant_rate > 20 && (
              <div className="flex items-start gap-2">
                <span className="text-red-600">!</span>
                <span>
                  <strong>Relevance issue.</strong> {noneRelevantRate.none_relevant_rate}% of students said recommendations
                  didn&apos;t fit. Consider improving filtering logic.
                </span>
              </div>
            )}

            {careerClickRate.total_sessions === 0 && (
              <div className="flex items-start gap-2">
                <span className="text-gray-600">ℹ</span>
                <span>
                  No sessions recorded yet. Metrics will appear after students complete tests.
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
