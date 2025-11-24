-- Create category_analytics table to track category distribution over time
-- This helps monitor if the category expansion solved the 77% "auttaja" problem

CREATE TABLE IF NOT EXISTS category_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort TEXT NOT NULL,
  dominant_category TEXT NOT NULL,
  category_scores JSONB NOT NULL,
  recommended_careers TEXT[] NOT NULL,
  user_subdimensions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for fast analytics queries
CREATE INDEX IF NOT EXISTS idx_category_analytics_dominant ON category_analytics(dominant_category);
CREATE INDEX IF NOT EXISTS idx_category_analytics_cohort ON category_analytics(cohort);
CREATE INDEX IF NOT EXISTS idx_category_analytics_created_at ON category_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_category_analytics_cohort_category ON category_analytics(cohort, dominant_category);

-- Enable Row Level Security
ALTER TABLE category_analytics ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert analytics (no login required)
CREATE POLICY "Allow anonymous analytics insertion"
ON category_analytics
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow authenticated users to view all analytics
CREATE POLICY "Allow authenticated users to view analytics"
ON category_analytics
FOR SELECT
TO authenticated
USING (true);

-- Create a materialized view for faster analytics queries
CREATE MATERIALIZED VIEW IF NOT EXISTS category_distribution_summary AS
SELECT
  dominant_category,
  cohort,
  COUNT(*) as match_count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage,
  DATE_TRUNC('day', created_at) as date
FROM category_analytics
GROUP BY dominant_category, cohort, DATE_TRUNC('day', created_at);

-- Create index on materialized view
CREATE INDEX IF NOT EXISTS idx_category_distribution_summary_date ON category_distribution_summary(date DESC);
CREATE INDEX IF NOT EXISTS idx_category_distribution_summary_category ON category_distribution_summary(dominant_category);

-- Function to refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_category_distribution_summary()
RETURNS trigger AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY category_distribution_summary;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to refresh materialized view after inserts (with debouncing)
-- Note: In production, you might want to refresh this on a schedule instead
-- CREATE TRIGGER refresh_category_summary_trigger
-- AFTER INSERT ON category_analytics
-- FOR EACH STATEMENT
-- EXECUTE FUNCTION refresh_category_distribution_summary();

-- Add comments for documentation
COMMENT ON TABLE category_analytics IS 'Tracks which categories users are matched to, helping monitor category distribution balance';
COMMENT ON COLUMN category_analytics.dominant_category IS 'The category with the highest score for this user';
COMMENT ON COLUMN category_analytics.category_scores IS 'JSON object with scores for all 8 categories';
COMMENT ON COLUMN category_analytics.user_subdimensions IS 'User subdimension scores that influenced category selection';
COMMENT ON MATERIALIZED VIEW category_distribution_summary IS 'Aggregated category distribution statistics for fast analytics';
