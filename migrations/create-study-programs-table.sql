-- Create study_programs table for Todistuspistelaskuri feature
-- Phase 3: Full Database + API Integration

-- Drop table if exists (for development/testing)
-- DROP TABLE IF EXISTS study_programs CASCADE;

-- Create study_programs table
CREATE TABLE IF NOT EXISTS study_programs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  institution TEXT NOT NULL,
  institution_type TEXT NOT NULL CHECK (institution_type IN ('yliopisto', 'amk')),
  field TEXT NOT NULL,
  min_points NUMERIC(5,1) NOT NULL,
  max_points NUMERIC(5,1),
  related_careers TEXT[] DEFAULT '{}',
  opintopolku_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_year INTEGER DEFAULT 2025
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_study_programs_institution_type ON study_programs(institution_type);
CREATE INDEX IF NOT EXISTS idx_study_programs_field ON study_programs(field);
CREATE INDEX IF NOT EXISTS idx_study_programs_min_points ON study_programs(min_points);
CREATE INDEX IF NOT EXISTS idx_study_programs_max_points ON study_programs(max_points);
CREATE INDEX IF NOT EXISTS idx_study_programs_data_year ON study_programs(data_year);

-- Create GIN index for array searches (related_careers)
CREATE INDEX IF NOT EXISTS idx_study_programs_related_careers ON study_programs USING GIN(related_careers);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_study_programs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_study_programs_updated_at
  BEFORE UPDATE ON study_programs
  FOR EACH ROW
  EXECUTE FUNCTION update_study_programs_updated_at();

-- Enable Row Level Security
ALTER TABLE study_programs ENABLE ROW LEVEL SECURITY;

-- Create policy: Allow public read access (all users can view programs)
CREATE POLICY "Allow public read access to study_programs"
  ON study_programs
  FOR SELECT
  USING (true);

-- Create policy: Only authenticated admins can insert/update/delete
-- (We'll add admin check later if needed)
CREATE POLICY "Allow authenticated users to insert study_programs"
  ON study_programs
  FOR INSERT
  WITH CHECK (true); -- For now, allow inserts (we'll restrict later)

CREATE POLICY "Allow authenticated users to update study_programs"
  ON study_programs
  FOR UPDATE
  USING (true); -- For now, allow updates (we'll restrict later)

CREATE POLICY "Allow authenticated users to delete study_programs"
  ON study_programs
  FOR DELETE
  USING (true); -- For now, allow deletes (we'll restrict later)

-- Add comment to table
COMMENT ON TABLE study_programs IS 'Study programs database for Todistuspistelaskuri feature. Contains university and AMK programs with admission point requirements.';

-- Add comments to columns
COMMENT ON COLUMN study_programs.id IS 'Unique identifier (e.g., tietotekniikka-helsinki)';
COMMENT ON COLUMN study_programs.name IS 'Program name (e.g., Tietotekniikka)';
COMMENT ON COLUMN study_programs.institution IS 'Institution name (e.g., Helsingin yliopisto)';
COMMENT ON COLUMN study_programs.institution_type IS 'Type: yliopisto or amk';
COMMENT ON COLUMN study_programs.field IS 'Field category (e.g., teknologia, terveys, kauppa)';
COMMENT ON COLUMN study_programs.min_points IS 'Minimum todistuspisteet required (2025 data)';
COMMENT ON COLUMN study_programs.max_points IS 'Maximum/estimated todistuspisteet (optional)';
COMMENT ON COLUMN study_programs.related_careers IS 'Array of career slugs that match this program';
COMMENT ON COLUMN study_programs.opintopolku_url IS 'Link to Opintopolku page';
COMMENT ON COLUMN study_programs.description IS 'Program description';
COMMENT ON COLUMN study_programs.data_year IS 'Year of point requirement data (e.g., 2025)';

