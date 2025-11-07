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

CREATE INDEX IF NOT EXISTS idx_study_programs_institution_type ON study_programs(institution_type);
CREATE INDEX IF NOT EXISTS idx_study_programs_field ON study_programs(field);
CREATE INDEX IF NOT EXISTS idx_study_programs_min_points ON study_programs(min_points);
CREATE INDEX IF NOT EXISTS idx_study_programs_max_points ON study_programs(max_points);
CREATE INDEX IF NOT EXISTS idx_study_programs_data_year ON study_programs(data_year);
CREATE INDEX IF NOT EXISTS idx_study_programs_related_careers ON study_programs USING GIN(related_careers);

CREATE OR REPLACE FUNCTION update_study_programs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_study_programs_updated_at
  BEFORE UPDATE ON study_programs
  FOR EACH ROW
  EXECUTE FUNCTION update_study_programs_updated_at();

ALTER TABLE study_programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to study_programs"
  ON study_programs
  FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to insert study_programs"
  ON study_programs
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update study_programs"
  ON study_programs
  FOR UPDATE
  USING (true);

CREATE POLICY "Allow authenticated users to delete study_programs"
  ON study_programs
  FOR DELETE
  USING (true);

