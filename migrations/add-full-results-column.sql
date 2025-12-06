-- Add full_results column to test_results table
-- This stores the complete results as JSON so they can be retrieved exactly as shown
-- Prevents results from changing when users revisit the results page

ALTER TABLE test_results
ADD COLUMN IF NOT EXISTS full_results JSONB DEFAULT NULL;

-- Add an index for faster lookups when fetching results by ID
CREATE INDEX IF NOT EXISTS idx_test_results_full_results
ON test_results USING GIN (full_results)
WHERE full_results IS NOT NULL;

COMMENT ON COLUMN test_results.full_results IS 'Complete results JSON including userProfile, topCareers with all details, educationPath, and cohortCopy. Used to retrieve exact same results on page revisit.';
