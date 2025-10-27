-- Complete Supabase Schema for CareerCompassi
-- Run this in your Supabase SQL Editor

-- ========== TEACHER DASHBOARD TABLES ==========

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL,
  class_token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pins table
CREATE TABLE IF NOT EXISTS pins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  pin TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Results table (for teacher dashboard)
CREATE TABLE IF NOT EXISTS results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  pin TEXT NOT NULL REFERENCES pins(pin) ON DELETE CASCADE,
  result_payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Test results table (for score API - same structure as results)
CREATE TABLE IF NOT EXISTS test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort TEXT NOT NULL,
  school_code TEXT,
  education_path_primary TEXT,
  education_path_scores JSONB,
  top_careers JSONB NOT NULL,
  dimension_scores JSONB NOT NULL,
  time_spent_seconds INTEGER,
  completed BOOLEAN DEFAULT true,
  satisfaction_rating INTEGER,
  feedback_text TEXT,
  feedback_submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rate limits table
CREATE TABLE IF NOT EXISTS rate_limits (
  id BIGSERIAL PRIMARY KEY,
  hashed_ip TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ========== INDEXES ==========

CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classes_token ON classes(class_token);
CREATE INDEX IF NOT EXISTS idx_pins_class_id ON pins(class_id);
CREATE INDEX IF NOT EXISTS idx_pins_pin ON pins(pin);
CREATE INDEX IF NOT EXISTS idx_results_class_id ON results(class_id);
CREATE INDEX IF NOT EXISTS idx_results_pin ON results(pin);
CREATE INDEX IF NOT EXISTS idx_test_results_cohort ON test_results(cohort);
CREATE INDEX IF NOT EXISTS idx_test_results_created_at ON test_results(created_at);
CREATE INDEX IF NOT EXISTS idx_rate_limits_hashed_ip_created_at ON rate_limits(hashed_ip, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rate_limits_created_at ON rate_limits(created_at);

-- ========== ROW LEVEL SECURITY ==========

ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pins ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- ========== POLICIES ==========

-- Classes: Teachers manage their own classes
DROP POLICY IF EXISTS "Teachers manage own classes" ON classes;
CREATE POLICY "Teachers manage own classes" ON classes
  FOR ALL
  USING (auth.uid() = teacher_id)
  WITH CHECK (auth.uid() = teacher_id);

-- Pins: Class owners can manage pins
DROP POLICY IF EXISTS "Class owners manage pins" ON pins;
CREATE POLICY "Class owners manage pins" ON pins
  FOR ALL
  USING (EXISTS (SELECT 1 FROM classes c WHERE c.id = pins.class_id AND c.teacher_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM classes c WHERE c.id = pins.class_id AND c.teacher_id = auth.uid()));

-- Pins: Students can insert (for test taking)
DROP POLICY IF EXISTS "Students can insert pins during test" ON pins;
CREATE POLICY "Students can insert pins during test" ON pins
  FOR INSERT
  WITH CHECK (true);

-- Results: Class owners can view
DROP POLICY IF EXISTS "Class owners view results" ON results;
CREATE POLICY "Class owners view results" ON results
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM classes c WHERE c.id = results.class_id AND c.teacher_id = auth.uid()));

-- Results: Students can submit (for test taking)
DROP POLICY IF EXISTS "Students can submit results" ON results;
CREATE POLICY "Students can submit results" ON results
  FOR INSERT
  WITH CHECK (true);

-- Results: No updates or deletes (immutable history)
DROP POLICY IF EXISTS "No updates or deletes on results" ON results;
CREATE POLICY "No updates or deletes on results" ON results
  FOR UPDATE
  USING (false);

DROP POLICY IF EXISTS "No deletes on results" ON results;
CREATE POLICY "No deletes on results" ON results
  FOR DELETE
  USING (false);

-- Test results: Allow inserts from service role
DROP POLICY IF EXISTS "Allow service role insert test results" ON test_results;
CREATE POLICY "Allow service role insert test results" ON test_results
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service role select test results" ON test_results;
CREATE POLICY "Allow service role select test results" ON test_results
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow service role update test results" ON test_results;
CREATE POLICY "Allow service role update test results" ON test_results
  FOR UPDATE
  USING (true);

-- Rate limits: Allow service role access
DROP POLICY IF EXISTS "Allow service role insert" ON rate_limits;
CREATE POLICY "Allow service role insert" ON rate_limits
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service role select" ON rate_limits;
CREATE POLICY "Allow service role select" ON rate_limits
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow service role delete" ON rate_limits;
CREATE POLICY "Allow service role delete" ON rate_limits
  FOR DELETE
  USING (true);

-- ========== FUNCTIONS ==========

DROP FUNCTION IF EXISTS get_class_results_by_token(TEXT);
CREATE OR REPLACE FUNCTION get_class_results_by_token(p_token TEXT)
RETURNS TABLE(pin TEXT, result_payload JSONB, created_at TIMESTAMPTZ)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT r.pin, r.result_payload, r.created_at
  FROM results r
  JOIN classes c ON c.id = r.class_id
  WHERE c.class_token = p_token
  ORDER BY r.created_at DESC;
$$;

DROP FUNCTION IF EXISTS get_class_by_token(TEXT);
CREATE OR REPLACE FUNCTION get_class_by_token(p_token TEXT)
RETURNS TABLE(id UUID, class_token TEXT, created_at TIMESTAMPTZ, pin_count BIGINT)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    c.id,
    c.class_token,
    c.created_at,
    COUNT(DISTINCT p.id) as pin_count
  FROM classes c
  LEFT JOIN pins p ON p.class_id = c.id
  WHERE c.class_token = p_token
  GROUP BY c.id, c.class_token, c.created_at;
$$;

DROP FUNCTION IF EXISTS validate_pin(TEXT, TEXT);
CREATE OR REPLACE FUNCTION validate_pin(p_pin TEXT, p_class_token TEXT)
RETURNS TABLE(is_valid BOOLEAN, class_id UUID)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    EXISTS (
      SELECT 1 
      FROM pins p
      JOIN classes c ON c.id = p.class_id
      WHERE p.pin = p_pin AND c.class_token = p_class_token
    ) as is_valid,
    (SELECT c.id FROM classes c 
     JOIN pins p ON p.class_id = c.id 
     WHERE p.pin = p_pin AND c.class_token = p_class_token 
     LIMIT 1) as class_id;
$$;

-- ========== GRANTS ==========

GRANT EXECUTE ON FUNCTION get_class_results_by_token(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION get_class_by_token(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION validate_pin(TEXT, TEXT) TO anon;
GRANT INSERT ON results TO anon;
GRANT INSERT ON test_results TO anon;

-- ========== COMMENTS ==========

COMMENT ON TABLE classes IS 'Teacher classes - no student names stored';
COMMENT ON TABLE pins IS 'Student PINs - 4-6 char random codes';
COMMENT ON TABLE results IS 'Test results - anonymous data only, no PII';
COMMENT ON TABLE test_results IS 'Career test results with feedback';
COMMENT ON TABLE rate_limits IS 'GDPR-compliant rate limiting: stores hashed IP addresses and timestamps';

-- ========== SUCCESS MESSAGE ==========

DO $$
BEGIN
  RAISE NOTICE '✅ Complete schema created successfully! All tables ready.';
END $$;

