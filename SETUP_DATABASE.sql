-- ========================================
-- CareerCompassi Complete Database Setup
-- Run this entire script in Supabase SQL Editor
-- ========================================

-- ========================================
-- 1. TEACHERS TABLE (CRITICAL - Login won't work without this!)
-- ========================================

CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  name TEXT,
  school_name TEXT,
  access_code TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_teachers_access_code ON teachers(access_code) WHERE is_active = true;

ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- Drop policy if exists, then recreate
DROP POLICY IF EXISTS "Service role full access on teachers" ON teachers;
CREATE POLICY "Service role full access on teachers"
  ON teachers
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION generate_teacher_code()
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    new_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 8));
    SELECT EXISTS(SELECT 1 FROM teachers WHERE access_code = new_code) INTO exists_check;
    EXIT WHEN NOT exists_check;
  END LOOP;
  RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 2. TEACHER DASHBOARD TABLES
-- ========================================

-- Create classes table (alter existing if needed)
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id TEXT NOT NULL, -- TEXT to match UUID stored as string
  class_token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- If table exists with UUID type, alter it
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'classes' 
    AND column_name = 'teacher_id' 
    AND data_type = 'uuid'
  ) THEN
    ALTER TABLE classes ALTER COLUMN teacher_id TYPE TEXT USING teacher_id::TEXT;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS pins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  pin TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  pin TEXT NOT NULL REFERENCES pins(pin) ON DELETE CASCADE,
  result_payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classes_token ON classes(class_token);
CREATE INDEX IF NOT EXISTS idx_pins_class_id ON pins(class_id);
CREATE INDEX IF NOT EXISTS idx_pins_pin ON pins(pin);
CREATE INDEX IF NOT EXISTS idx_results_class_id ON results(class_id);
CREATE INDEX IF NOT EXISTS idx_results_pin ON results(pin);

ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pins ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- RLS Policies for classes
DROP POLICY IF EXISTS "Teachers manage own classes" ON classes;
CREATE POLICY "Teachers manage own classes"
  ON classes
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- RLS Policies for pins
DROP POLICY IF EXISTS "Class owners manage pins" ON pins;
CREATE POLICY "Class owners manage pins"
  ON pins
  FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Students can insert pins during test" ON pins;
CREATE POLICY "Students can insert pins during test"
  ON pins
  FOR INSERT
  WITH CHECK (true);

-- RLS Policies for results
DROP POLICY IF EXISTS "Class owners view results" ON results;
CREATE POLICY "Class owners view results"
  ON results
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Students can submit results" ON results;
CREATE POLICY "Students can submit results"
  ON results
  FOR INSERT
  WITH CHECK (true);

-- RPC Functions
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

CREATE OR REPLACE FUNCTION get_class_results_owner(p_class_id UUID, p_teacher_id TEXT)
RETURNS TABLE(pin TEXT, result_payload JSONB, created_at TIMESTAMPTZ)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT r.pin, r.result_payload, r.created_at
  FROM results r
  JOIN classes c ON c.id = r.class_id
  WHERE c.id = p_class_id::UUID
    AND c.teacher_id = p_teacher_id
  ORDER BY r.created_at DESC;
$$;

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

GRANT EXECUTE ON FUNCTION get_class_results_by_token(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION get_class_by_token(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION validate_pin(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION get_class_results_owner(UUID, TEXT) TO authenticated;
GRANT INSERT ON results TO service_role;

-- ========================================
-- 3. RATE LIMITING TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS rate_limits (
  id BIGSERIAL PRIMARY KEY,
  hashed_ip TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_hashed_ip_created_at 
ON rate_limits (hashed_ip, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_rate_limits_created_at 
ON rate_limits (created_at);

ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

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

-- ========================================
-- ✅ SETUP COMPLETE!
-- ========================================

-- Verify tables were created:
SELECT 
  'teachers' as table_name, 
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'teachers') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 'classes', CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'classes') THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 'pins', CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'pins') THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 'results', CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'results') THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 'rate_limits', CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'rate_limits') THEN '✅ EXISTS' ELSE '❌ MISSING' END;

