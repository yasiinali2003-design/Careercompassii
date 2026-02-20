-- Complete Supabase Setup for CareerCompassi
-- Run this in Supabase SQL Editor to create all required tables and functions

-- ============================================
-- 1. TEACHERS TABLE
-- ============================================
DROP TABLE IF EXISTS teachers CASCADE;

CREATE TABLE teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  school_name TEXT,
  access_code TEXT UNIQUE NOT NULL,
  package TEXT DEFAULT 'standard' CHECK (package IN ('standard', 'premium')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX idx_teachers_access_code ON teachers(access_code);
CREATE INDEX idx_teachers_is_active ON teachers(is_active);

-- ============================================
-- 2. CLASSES TABLE
-- ============================================
DROP TABLE IF EXISTS classes CASCADE;

CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  class_token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX idx_classes_class_token ON classes(class_token);

-- ============================================
-- 3. PINS TABLE
-- ============================================
DROP TABLE IF EXISTS pins CASCADE;

CREATE TABLE pins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  pin TEXT NOT NULL,
  student_name TEXT,
  is_used BOOLEAN DEFAULT false,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(class_id, pin)
);

-- Indexes
CREATE INDEX idx_pins_class_id ON pins(class_id);
CREATE INDEX idx_pins_pin ON pins(pin);
CREATE INDEX idx_pins_is_used ON pins(is_used);

-- ============================================
-- 4. RESULTS TABLE
-- ============================================
DROP TABLE IF EXISTS results CASCADE;

CREATE TABLE results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  pin_code TEXT,
  result_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_results_class_id ON results(class_id);
CREATE INDEX idx_results_created_at ON results(created_at DESC);

-- ============================================
-- 5. STUDY_PROGRAMS TABLE
-- ============================================
DROP TABLE IF EXISTS study_programs CASCADE;

CREATE TABLE study_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_name TEXT NOT NULL,
  institution TEXT,
  program_type TEXT CHECK (program_type IN ('AMK', 'Yliopisto', 'Ammattikoulu', 'Lukio')),
  field TEXT,
  related_careers TEXT[],
  opintopolku_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_study_programs_field ON study_programs(field);
CREATE INDEX idx_study_programs_program_type ON study_programs(program_type);

-- ============================================
-- 6. GENERATE_TEACHER_CODE FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION generate_teacher_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code TEXT := '';
  i INT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    code := '';
    FOR i IN 1..8 LOOP
      code := code || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;

    SELECT EXISTS(SELECT 1 FROM teachers WHERE access_code = code) INTO code_exists;

    IF NOT code_exists THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$;

-- ============================================
-- 7. ROW LEVEL SECURITY (RLS) - OPTIONAL
-- ============================================
-- For now, we'll use service role (supabaseAdmin) in API routes
-- So RLS can be disabled. Uncomment below to enable RLS with policies:

-- ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE pins ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE results ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE study_programs ENABLE ROW LEVEL SECURITY;

-- Example policy for teachers (admin access only):
-- CREATE POLICY "Allow service role full access to teachers"
--   ON teachers
--   FOR ALL
--   TO service_role
--   USING (true);

-- ============================================
-- 8. VERIFICATION QUERIES
-- ============================================
-- Run these after creating tables to verify:

-- Check if all tables exist:
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public'
-- AND table_name IN ('teachers', 'classes', 'pins', 'results', 'study_programs');

-- Test generate_teacher_code function:
-- SELECT generate_teacher_code();

-- ============================================
-- SETUP COMPLETE
-- ============================================
-- Tables created:
--   ✓ teachers
--   ✓ classes
--   ✓ pins
--   ✓ results
--   ✓ study_programs
-- Functions created:
--   ✓ generate_teacher_code()
