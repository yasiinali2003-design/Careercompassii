-- Teachers table for individual access codes
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  name TEXT,
  school_name TEXT,
  access_code TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  created_by TEXT -- Who created this teacher account
);

-- Index for fast lookups by access code
CREATE INDEX IF NOT EXISTS idx_teachers_access_code ON teachers(access_code) WHERE is_active = true;

-- Enable RLS (Row Level Security)
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything (for API access)
CREATE POLICY "Service role full access on teachers"
  ON teachers
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create function to generate unique access codes
CREATE OR REPLACE FUNCTION generate_teacher_code()
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-character alphanumeric code (uppercase)
    new_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM teachers WHERE access_code = new_code) INTO exists_check;
    
    -- If code is unique, exit loop
    EXIT WHEN NOT exists_check;
  END LOOP;
  
  RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Example: Insert a test teacher (remove in production)
-- INSERT INTO teachers (name, email, school_name, access_code)
-- VALUES ('Test Teacher', 'test@example.com', 'Test School', generate_teacher_code());

