-- Create career_feedback table to track user satisfaction and recommendation quality
-- This helps monitor the impact of category expansion on user experience

CREATE TABLE IF NOT EXISTS career_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort TEXT NOT NULL,
  dominant_category TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  recommended_careers TEXT[] NOT NULL,
  category_distribution JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for analytics queries
CREATE INDEX IF NOT EXISTS idx_career_feedback_category ON career_feedback(dominant_category);
CREATE INDEX IF NOT EXISTS idx_career_feedback_cohort ON career_feedback(cohort);
CREATE INDEX IF NOT EXISTS idx_career_feedback_rating ON career_feedback(rating);
CREATE INDEX IF NOT EXISTS idx_career_feedback_created_at ON career_feedback(created_at DESC);

-- Enable Row Level Security
ALTER TABLE career_feedback ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert feedback (no login required)
CREATE POLICY "Allow anonymous feedback insertion"
ON career_feedback
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow authenticated users to view all feedback (for analytics)
CREATE POLICY "Allow authenticated users to view feedback"
ON career_feedback
FOR SELECT
TO authenticated
USING (true);

-- Add comment for documentation
COMMENT ON TABLE career_feedback IS 'Stores user feedback on career recommendations to track quality and category distribution after expansion';
COMMENT ON COLUMN career_feedback.dominant_category IS 'The category that had the highest score for this user';
COMMENT ON COLUMN career_feedback.rating IS 'User rating from 1-5 (1=not helpful, 5=very helpful)';
COMMENT ON COLUMN career_feedback.category_distribution IS 'JSON object showing how many careers from each category were recommended';
