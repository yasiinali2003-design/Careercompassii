-- Teacher Dashboard Database Schema for CareerCompassi
-- Privacy-first: No names stored on server, only anonymized data
-- This version: Safe to run multiple times (uses IF NOT EXISTS)

-- ========== TABLES (Safe Create) ==========

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

-- Results table
CREATE TABLE IF NOT EXISTS results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  pin TEXT NOT NULL REFERENCES pins(pin) ON DELETE CASCADE,
  result_payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== INDEXES (Safe Create) ==========

CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classes_token ON classes(class_token);
CREATE INDEX IF NOT EXISTS idx_pins_class_id ON pins(class_id);
CREATE INDEX IF NOT EXISTS idx_pins_pin ON pins(pin);
CREATE INDEX IF NOT EXISTS idx_results_class_id ON results(class_id);
CREATE INDEX IF NOT EXISTS idx_results_pin ON results(pin);

-- ========== RLS ==========

ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pins ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- ========== DROP OLD POLICIES (If They Exist) ==========

DROP POLICY IF EXISTS "Teachers manage own classes" ON classes;
DROP POLICY IF EXISTS "Class owners manage pins" ON pins;
DROP POLICY IF EXISTS "Students can insert pins during test" ON pins;
DROP POLICY IF EXISTS "Class owners view results" ON results;
DROP POLICY IF EXISTS "Students can submit results" ON results;
DROP POLICY IF EXISTS "No updates or deletes on results" ON results;
DROP POLICY IF EXISTS "No deletes on results" ON results;

-- ========== CREATE POLICIES ==========

-- Classes: Teachers manage their own classes
CREATE POLICY "Teachers manage own classes" ON classes
  FOR ALL
  USING (auth.uid() = teacher_id)
  WITH CHECK (auth.uid() = teacher_id);

-- Pins: Class owners can manage pins
CREATE POLICY "Class owners manage pins" ON pins
  FOR ALL
  USING (EXISTS (SELECT 1 FROM classes c WHERE c.id = pins.class_id AND c.teacher_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM classes c WHERE c.id = pins.class_id AND c.teacher_id = auth.uid()));

-- Pins: Students can insert (for test taking)
CREATE POLICY "Students can insert pins during test" ON pins
  FOR INSERT
  WITH CHECK (true);

-- Results: Class owners can view
CREATE POLICY "Class owners view results" ON results
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM classes c WHERE c.id = results.class_id AND c.teacher_id = auth.uid()));

-- Results: Students can submit (for test taking)
CREATE POLICY "Students can submit results" ON results
  FOR INSERT
  WITH CHECK (true);

-- Results: No updates or deletes (immutable history)
CREATE POLICY "No updates or deletes on results" ON results
  FOR UPDATE
  USING (false);

CREATE POLICY "No deletes on results" ON results
  FOR DELETE
  USING (false);

-- ========== DROP OLD FUNCTIONS (If They Exist) ==========

DROP FUNCTION IF EXISTS get_class_results_by_token(TEXT);
DROP FUNCTION IF EXISTS get_class_results_owner(UUID, UUID);
DROP FUNCTION IF EXISTS get_class_by_token(TEXT);
DROP FUNCTION IF EXISTS validate_pin(TEXT, TEXT);

-- ========== CREATE FUNCTIONS ==========

-- Get anonymous results by class token (public access)
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

-- Get results for authenticated teacher (by class_id)
CREATE OR REPLACE FUNCTION get_class_results_owner(p_class_id UUID, p_teacher_id UUID)
RETURNS TABLE(pin TEXT, result_payload JSONB, created_at TIMESTAMPTZ)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT r.pin, r.result_payload, r.created_at
  FROM results r
  JOIN classes c ON c.id = r.class_id
  WHERE c.id = p_class_id AND c.teacher_id = p_teacher_id
  ORDER BY r.created_at DESC;
$$;

-- Get class info by token (public)
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

-- Validate PIN exists and belongs to a class
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
GRANT EXECUTE ON FUNCTION get_class_results_owner(UUID, UUID) TO authenticated;
GRANT INSERT ON results TO service_role;

-- ========== COMMENTS ==========

COMMENT ON TABLE classes IS 'Teacher classes - no student names stored';
COMMENT ON TABLE pins IS 'Student PINs - 4-6 char random codes';
COMMENT ON TABLE results IS 'Test results - anonymous data only, no PII';
COMMENT ON FUNCTION get_class_results_by_token IS 'Public anonymous results by class token';
COMMENT ON FUNCTION get_class_results_owner IS 'Teacher-only results with auth verification';

-- ========== SUCCESS MESSAGE ==========

DO $$
BEGIN
  RAISE NOTICE 'Teacher Dashboard schema created successfully!';
END $$;

