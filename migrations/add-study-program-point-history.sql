-- Create history table for study program point thresholds

CREATE TABLE IF NOT EXISTS study_program_point_history (
  program_id TEXT NOT NULL REFERENCES study_programs(id) ON DELETE CASCADE,
  data_year INTEGER NOT NULL,
  min_points NUMERIC(5,1),
  median_points NUMERIC(5,1),
  max_points NUMERIC(5,1),
  applicant_count INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (program_id, data_year)
);

CREATE INDEX IF NOT EXISTS idx_point_history_year ON study_program_point_history(data_year);

CREATE OR REPLACE FUNCTION update_study_program_point_history_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_study_program_point_history_updated_at
  BEFORE UPDATE ON study_program_point_history
  FOR EACH ROW
  EXECUTE FUNCTION update_study_program_point_history_updated_at();

COMMENT ON TABLE study_program_point_history IS 'Historical todistusvalinta point data per study program (min/median/max).';
COMMENT ON COLUMN study_program_point_history.program_id IS 'References study_programs.id';
COMMENT ON COLUMN study_program_point_history.data_year IS 'Admission cycle year (e.g. 2024, 2025).';
COMMENT ON COLUMN study_program_point_history.min_points IS 'Lowest accepted point total for the year.';
COMMENT ON COLUMN study_program_point_history.median_points IS 'Median accepted point total (if available).';
COMMENT ON COLUMN study_program_point_history.max_points IS 'Highest accepted point total.';
COMMENT ON COLUMN study_program_point_history.applicant_count IS 'Number of applicants in the certificate track.';


