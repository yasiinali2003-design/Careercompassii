-- Release A Week 3 Day 1: Core Metrics Tracking Table
-- Tracks 3 simple metrics to evaluate recommendation quality:
-- 1. careerClickRate: % of users who click ≥1 recommended career
-- 2. teacherFeedback: 1-5 rating after OPO session
-- 3. noneRelevantRate: % of sessions where student says "none fit"

CREATE TABLE IF NOT EXISTS core_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'career_click',
    'none_relevant',
    'teacher_feedback',
    'session_start',
    'session_complete'
  )),
  event_data JSONB NOT NULL,
  cohort TEXT NOT NULL,
  sub_cohort TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for fast analytics queries
CREATE INDEX IF NOT EXISTS idx_core_metrics_session ON core_metrics(session_id);
CREATE INDEX IF NOT EXISTS idx_core_metrics_event_type ON core_metrics(event_type);
CREATE INDEX IF NOT EXISTS idx_core_metrics_cohort ON core_metrics(cohort);
CREATE INDEX IF NOT EXISTS idx_core_metrics_created_at ON core_metrics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_core_metrics_cohort_event ON core_metrics(cohort, event_type);

-- Enable Row Level Security
ALTER TABLE core_metrics ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert metrics (no login required)
CREATE POLICY "Allow anonymous metrics insertion"
ON core_metrics
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow authenticated users (teachers, admins) to view all metrics
CREATE POLICY "Allow authenticated users to view metrics"
ON core_metrics
FOR SELECT
TO authenticated
USING (true);

-- ========== MATERIALIZED VIEWS FOR FAST ANALYTICS ==========

-- View 1: Career Click Rate (Core Metric 1)
CREATE MATERIALIZED VIEW IF NOT EXISTS career_click_rate AS
SELECT
  cohort,
  sub_cohort,
  DATE_TRUNC('day', created_at) as date,
  COUNT(DISTINCT CASE WHEN event_type = 'session_start' THEN session_id END) as total_sessions,
  COUNT(DISTINCT CASE WHEN event_type = 'career_click' THEN session_id END) as sessions_with_clicks,
  ROUND(
    100.0 * COUNT(DISTINCT CASE WHEN event_type = 'career_click' THEN session_id END) /
    NULLIF(COUNT(DISTINCT CASE WHEN event_type = 'session_start' THEN session_id END), 0),
    2
  ) as click_rate_percentage
FROM core_metrics
WHERE event_type IN ('session_start', 'career_click')
GROUP BY cohort, sub_cohort, DATE_TRUNC('day', created_at);

-- View 2: Teacher Feedback (Core Metric 2)
CREATE MATERIALIZED VIEW IF NOT EXISTS teacher_feedback_summary AS
SELECT
  cohort,
  sub_cohort,
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as total_ratings,
  ROUND(AVG((event_data->>'rating')::numeric), 2) as average_rating,
  COUNT(CASE WHEN (event_data->>'rating')::int = 1 THEN 1 END) as rating_1_count,
  COUNT(CASE WHEN (event_data->>'rating')::int = 2 THEN 1 END) as rating_2_count,
  COUNT(CASE WHEN (event_data->>'rating')::int = 3 THEN 1 END) as rating_3_count,
  COUNT(CASE WHEN (event_data->>'rating')::int = 4 THEN 1 END) as rating_4_count,
  COUNT(CASE WHEN (event_data->>'rating')::int = 5 THEN 1 END) as rating_5_count
FROM core_metrics
WHERE event_type = 'teacher_feedback'
GROUP BY cohort, sub_cohort, DATE_TRUNC('day', created_at);

-- View 3: None Relevant Rate (Core Metric 3)
CREATE MATERIALIZED VIEW IF NOT EXISTS none_relevant_rate AS
SELECT
  cohort,
  sub_cohort,
  DATE_TRUNC('day', created_at) as date,
  COUNT(DISTINCT CASE WHEN event_type = 'session_start' THEN session_id END) as total_sessions,
  COUNT(DISTINCT CASE WHEN event_type = 'none_relevant' THEN session_id END) as none_relevant_count,
  ROUND(
    100.0 * COUNT(DISTINCT CASE WHEN event_type = 'none_relevant' THEN session_id END) /
    NULLIF(COUNT(DISTINCT CASE WHEN event_type = 'session_start' THEN session_id END), 0),
    2
  ) as none_relevant_percentage
FROM core_metrics
WHERE event_type IN ('session_start', 'none_relevant')
GROUP BY cohort, sub_cohort, DATE_TRUNC('day', created_at);

-- Create indexes on materialized views for fast queries
CREATE INDEX IF NOT EXISTS idx_career_click_rate_date ON career_click_rate(date DESC);
CREATE INDEX IF NOT EXISTS idx_career_click_rate_cohort ON career_click_rate(cohort);

CREATE INDEX IF NOT EXISTS idx_teacher_feedback_date ON teacher_feedback_summary(date DESC);
CREATE INDEX IF NOT EXISTS idx_teacher_feedback_cohort ON teacher_feedback_summary(cohort);

CREATE INDEX IF NOT EXISTS idx_none_relevant_rate_date ON none_relevant_rate(date DESC);
CREATE INDEX IF NOT EXISTS idx_none_relevant_rate_cohort ON none_relevant_rate(cohort);

-- ========== REFRESH FUNCTIONS ==========

-- Function to refresh all metric views (call this periodically or on-demand)
CREATE OR REPLACE FUNCTION refresh_core_metrics_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY career_click_rate;
  REFRESH MATERIALIZED VIEW CONCURRENTLY teacher_feedback_summary;
  REFRESH MATERIALIZED VIEW CONCURRENTLY none_relevant_rate;
END;
$$ LANGUAGE plpgsql;

-- ========== HELPER FUNCTIONS FOR QUICK QUERIES ==========

-- Get current week summary (all 3 metrics)
CREATE OR REPLACE FUNCTION get_current_week_metrics()
RETURNS TABLE (
  metric_name TEXT,
  metric_value NUMERIC,
  total_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  -- Career Click Rate
  SELECT
    'career_click_rate' as metric_name,
    COALESCE(ROUND(
      100.0 * SUM(sessions_with_clicks) / NULLIF(SUM(total_sessions), 0),
      2
    ), 0) as metric_value,
    SUM(total_sessions)::integer as total_count
  FROM career_click_rate
  WHERE date >= DATE_TRUNC('week', NOW())

  UNION ALL

  -- Teacher Feedback Average
  SELECT
    'teacher_feedback_avg' as metric_name,
    COALESCE(ROUND(AVG(average_rating), 2), 0) as metric_value,
    SUM(total_ratings)::integer as total_count
  FROM teacher_feedback_summary
  WHERE date >= DATE_TRUNC('week', NOW())

  UNION ALL

  -- None Relevant Rate
  SELECT
    'none_relevant_rate' as metric_name,
    COALESCE(ROUND(
      100.0 * SUM(none_relevant_count) / NULLIF(SUM(total_sessions), 0),
      2
    ), 0) as metric_value,
    SUM(total_sessions)::integer as total_count
  FROM none_relevant_rate
  WHERE date >= DATE_TRUNC('week', NOW());
END;
$$ LANGUAGE plpgsql;

-- ========== DOCUMENTATION ==========

COMMENT ON TABLE core_metrics IS 'Release A Week 3: Tracks 3 core metrics to evaluate recommendation quality';
COMMENT ON COLUMN core_metrics.session_id IS 'Unique session identifier (generated client-side)';
COMMENT ON COLUMN core_metrics.event_type IS 'Type of metric event: career_click, none_relevant, teacher_feedback, session_start, session_complete';
COMMENT ON COLUMN core_metrics.event_data IS 'JSON object with event-specific data (career details, rating, etc.)';
COMMENT ON COLUMN core_metrics.cohort IS 'User cohort: YLA, TASO2, NUORI';
COMMENT ON COLUMN core_metrics.sub_cohort IS 'Sub-cohort if applicable: LUKIO, AMIS';

COMMENT ON MATERIALIZED VIEW career_click_rate IS 'Core Metric 1: % of users who click ≥1 recommended career';
COMMENT ON MATERIALIZED VIEW teacher_feedback_summary IS 'Core Metric 2: Teacher ratings (1-5) after OPO sessions';
COMMENT ON MATERIALIZED VIEW none_relevant_rate IS 'Core Metric 3: % of sessions where student says "none fit"';

COMMENT ON FUNCTION refresh_core_metrics_views() IS 'Refresh all materialized views for core metrics analytics';
COMMENT ON FUNCTION get_current_week_metrics() IS 'Get current week summary of all 3 core metrics';
