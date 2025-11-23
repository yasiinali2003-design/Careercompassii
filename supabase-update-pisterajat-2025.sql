-- ============================================================================
-- UPDATE TODISTUSVALINTA PISTERAJAT TO 2025 OFFICIAL DATA
-- Source: Official Finnish university consortium publications (May-August 2025)
-- ============================================================================

-- MEDICINE PROGRAMS (August 2025 final data)
UPDATE study_programs
SET
  min_points = 188.3,
  max_points = 199.0,
  point_history = jsonb_build_array(
    jsonb_build_object('year', '2025', 'minPoints', 188.3, 'medianPoints', null, 'applicantCount', null)
  ),
  updated_at = NOW()
WHERE name ILIKE '%lääketiede%'
  AND institution ILIKE '%helsinki%'
  AND institution_type = 'yliopisto';

UPDATE study_programs
SET
  min_points = 182.3,
  max_points = 199.0,
  point_history = jsonb_build_array(
    jsonb_build_object('year', '2025', 'minPoints', 182.3, 'medianPoints', null, 'applicantCount', null)
  ),
  updated_at = NOW()
WHERE name ILIKE '%lääketiede%'
  AND institution ILIKE '%tampere%'
  AND institution_type = 'yliopisto';

UPDATE study_programs
SET
  min_points = 181.7,
  max_points = 199.0,
  point_history = jsonb_build_array(
    jsonb_build_object('year', '2025', 'minPoints', 181.7, 'medianPoints', null, 'applicantCount', null)
  ),
  updated_at = NOW()
WHERE name ILIKE '%lääketiede%'
  AND institution ILIKE '%turku%'
  AND institution_type = 'yliopisto';

-- Insert new medicine programs if they don't exist
INSERT INTO study_programs (name, institution, institution_type, field, min_points, max_points, related_careers, description, point_history)
SELECT 'Lääketiede', 'Oulun yliopisto', 'yliopisto', 'terveys', 175.4, 199.0,
  ARRAY['laakari', 'erikoislaakari']::text[],
  'Lääketieteen koulutus Oulun yliopistossa.',
  jsonb_build_array(jsonb_build_object('year', '2025', 'minPoints', 175.4, 'medianPoints', null, 'applicantCount', null))
WHERE NOT EXISTS (
  SELECT 1 FROM study_programs
  WHERE name ILIKE '%lääketiede%' AND institution ILIKE '%oulu%'
);

INSERT INTO study_programs (name, institution, institution_type, field, min_points, max_points, related_careers, description, point_history)
SELECT 'Lääketiede', 'Itä-Suomen yliopisto', 'yliopisto', 'terveys', 175.4, 199.0,
  ARRAY['laakari', 'erikoislaakari']::text[],
  'Lääketieteen koulutus Itä-Suomen yliopistossa.',
  jsonb_build_array(jsonb_build_object('year', '2025', 'minPoints', 175.4, 'medianPoints', null, 'applicantCount', null))
WHERE NOT EXISTS (
  SELECT 1 FROM study_programs
  WHERE name ILIKE '%lääketiede%' AND institution ILIKE '%itä-suomi%'
);

-- BUSINESS PROGRAMS (May 2025 data)
UPDATE study_programs
SET
  min_points = 123.8,
  max_points = 145.0,
  point_history = jsonb_build_array(
    jsonb_build_object('year', '2025', 'minPoints', 123.8, 'medianPoints', null, 'applicantCount', null)
  ),
  updated_at = NOW()
WHERE name ILIKE '%kauppatiede%'
  AND institution ILIKE '%aalto%'
  AND institution_type = 'yliopisto';

UPDATE study_programs
SET
  min_points = 116.6,
  max_points = 135.0,
  point_history = jsonb_build_array(
    jsonb_build_object('year', '2025', 'minPoints', 116.6, 'medianPoints', null, 'applicantCount', null)
  ),
  updated_at = NOW()
WHERE name ILIKE '%kauppatiede%'
  AND institution ILIKE '%tampere%'
  AND institution_type = 'yliopisto';

UPDATE study_programs
SET
  min_points = 117.9,
  max_points = 135.0,
  point_history = jsonb_build_array(
    jsonb_build_object('year', '2025', 'minPoints', 117.9, 'medianPoints', null, 'applicantCount', null)
  ),
  updated_at = NOW()
WHERE name ILIKE '%kauppatiede%'
  AND institution ILIKE '%turku%'
  AND institution_type = 'yliopisto';

UPDATE study_programs
SET
  min_points = 111.2,
  max_points = 130.0,
  point_history = jsonb_build_array(
    jsonb_build_object('year', '2025', 'minPoints', 111.2, 'medianPoints', null, 'applicantCount', null)
  ),
  updated_at = NOW()
WHERE name ILIKE '%kauppatiede%'
  AND institution ILIKE '%jyväskylä%'
  AND institution_type = 'yliopisto';

-- Insert new business programs
INSERT INTO study_programs (name, institution, institution_type, field, min_points, max_points, related_careers, description, point_history)
SELECT 'Kauppatiede', 'Hanken, Helsinki', 'yliopisto', 'kauppa', 113.3, 132.0,
  ARRAY['liiketalousjohtaja', 'markkinointipaallikko', 'yritysneuvoja']::text[],
  'Kauppatieteellinen koulutus Hanken-kauppakorkeakoulussa Helsingissä.',
  jsonb_build_array(jsonb_build_object('year', '2025', 'minPoints', 113.3, 'medianPoints', null, 'applicantCount', null))
WHERE NOT EXISTS (
  SELECT 1 FROM study_programs
  WHERE name ILIKE '%kauppatiede%' AND institution ILIKE '%hanken%'
);

INSERT INTO study_programs (name, institution, institution_type, field, min_points, max_points, related_careers, description, point_history)
SELECT 'Kauppatiede', 'LUT-yliopisto', 'yliopisto', 'kauppa', 106.5, 125.0,
  ARRAY['liiketalousjohtaja', 'markkinointipaallikko', 'yritysneuvoja']::text[],
  'Kauppatieteellinen koulutus LUT-yliopistossa.',
  jsonb_build_array(jsonb_build_object('year', '2025', 'minPoints', 106.5, 'medianPoints', null, 'applicantCount', null))
WHERE NOT EXISTS (
  SELECT 1 FROM study_programs
  WHERE name ILIKE '%kauppatiede%' AND institution ILIKE '%lut%'
);

-- LAW PROGRAMS (May 2025 data)
UPDATE study_programs
SET
  min_points = 134.2,
  max_points = 150.0,
  point_history = jsonb_build_array(
    jsonb_build_object('year', '2025', 'minPoints', 134.2, 'medianPoints', null, 'applicantCount', null)
  ),
  updated_at = NOW()
WHERE name ILIKE '%oikeustiede%'
  AND institution ILIKE '%helsinki%'
  AND institution_type = 'yliopisto';

UPDATE study_programs
SET
  min_points = 132.1,
  max_points = 148.0,
  point_history = jsonb_build_array(
    jsonb_build_object('year', '2025', 'minPoints', 132.1, 'medianPoints', null, 'applicantCount', null)
  ),
  updated_at = NOW()
WHERE name ILIKE '%oikeustiede%'
  AND institution ILIKE '%turku%'
  AND institution_type = 'yliopisto';

-- Insert new law programs
INSERT INTO study_programs (name, institution, institution_type, field, min_points, max_points, related_careers, description, point_history)
SELECT 'Oikeustiede', 'Itä-Suomen yliopisto', 'yliopisto', 'oikeus', 127.8, 145.0,
  ARRAY['asianajaja', 'oikeusneuvos']::text[],
  'Oikeustieteen koulutus Itä-Suomen yliopistossa.',
  jsonb_build_array(jsonb_build_object('year', '2025', 'minPoints', 127.8, 'medianPoints', null, 'applicantCount', null))
WHERE NOT EXISTS (
  SELECT 1 FROM study_programs
  WHERE name ILIKE '%oikeustiede%' AND institution ILIKE '%itä-suomi%'
);

INSERT INTO study_programs (name, institution, institution_type, field, min_points, max_points, related_careers, description, point_history)
SELECT 'Oikeustiede', 'Lapin yliopisto', 'yliopisto', 'oikeus', 122.9, 142.0,
  ARRAY['asianajaja', 'oikeusneuvos']::text[],
  'Oikeustieteen koulutus Lapin yliopistossa.',
  jsonb_build_array(jsonb_build_object('year', '2025', 'minPoints', 122.9, 'medianPoints', null, 'applicantCount', null))
WHERE NOT EXISTS (
  SELECT 1 FROM study_programs
  WHERE name ILIKE '%oikeustiede%' AND institution ILIKE '%lappi%'
);

-- Verification query
SELECT
  name,
  institution,
  min_points,
  max_points,
  point_history->0->>'year' as latest_year,
  point_history->0->>'minPoints' as history_min_points
FROM study_programs
WHERE (name ILIKE '%lääketiede%' OR name ILIKE '%kauppatiede%' OR name ILIKE '%oikeustiede%')
  AND institution_type = 'yliopisto'
ORDER BY field, min_points DESC;
