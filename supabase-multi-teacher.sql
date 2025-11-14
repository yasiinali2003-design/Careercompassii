-- Multi-Teacher Access Feature
-- Allows Premium schools to have 3-5 teachers collaborating on the same dashboard
-- Created: 2025-11-14

-- Step 1: Create schools table
CREATE TABLE IF NOT EXISTS public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  package TEXT NOT NULL DEFAULT 'standard',
  max_teachers INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT schools_package_check CHECK (package IN ('free', 'yläaste', 'premium'))
);

-- Step 2: Create school_teachers junction table
CREATE TABLE IF NOT EXISTS public.school_teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  teacher_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'teacher',
  invited_by TEXT,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT school_teachers_role_check CHECK (role IN ('admin', 'teacher', 'viewer')),
  CONSTRAINT school_teachers_unique UNIQUE (school_id, teacher_id)
);

-- Step 3: Add school_id to classes table (optional, for better organization)
ALTER TABLE public.classes
ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL;

-- Step 4: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_school_teachers_school_id ON public.school_teachers(school_id);
CREATE INDEX IF NOT EXISTS idx_school_teachers_teacher_id ON public.school_teachers(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classes_school_id ON public.classes(school_id);

-- Step 5: Enable Row Level Security (RLS)
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_teachers ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS policies for schools
CREATE POLICY "Teachers can view their own schools"
  ON public.schools FOR SELECT
  USING (
    id IN (
      SELECT school_id
      FROM public.school_teachers
      WHERE teacher_id = current_setting('request.jwt.claim.sub', true)
    )
  );

CREATE POLICY "Admins can update their schools"
  ON public.schools FOR UPDATE
  USING (
    id IN (
      SELECT school_id
      FROM public.school_teachers
      WHERE teacher_id = current_setting('request.jwt.claim.sub', true)
        AND role = 'admin'
    )
  );

-- Step 7: Create RLS policies for school_teachers
CREATE POLICY "Teachers can view their school members"
  ON public.school_teachers FOR SELECT
  USING (
    school_id IN (
      SELECT school_id
      FROM public.school_teachers
      WHERE teacher_id = current_setting('request.jwt.claim.sub', true)
    )
  );

CREATE POLICY "Admins can insert school members"
  ON public.school_teachers FOR INSERT
  WITH CHECK (
    school_id IN (
      SELECT school_id
      FROM public.school_teachers
      WHERE teacher_id = current_setting('request.jwt.claim.sub', true)
        AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete school members"
  ON public.school_teachers FOR DELETE
  USING (
    school_id IN (
      SELECT school_id
      FROM public.school_teachers
      WHERE teacher_id = current_setting('request.jwt.claim.sub', true)
        AND role = 'admin'
    )
  );

-- Step 8: Create helper functions
CREATE OR REPLACE FUNCTION public.get_teacher_schools(p_teacher_id TEXT)
RETURNS TABLE (
  school_id UUID,
  school_name TEXT,
  package TEXT,
  role TEXT,
  teacher_count BIGINT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id AS school_id,
    s.name AS school_name,
    s.package,
    st.role,
    COUNT(st2.id) AS teacher_count
  FROM public.schools s
  JOIN public.school_teachers st ON s.id = st.school_id
  LEFT JOIN public.school_teachers st2 ON s.id = st2.school_id
  WHERE st.teacher_id = p_teacher_id
  GROUP BY s.id, s.name, s.package, st.role;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_school_classes(p_school_id UUID)
RETURNS TABLE (
  class_id UUID,
  class_token TEXT,
  teacher_id TEXT,
  created_at TIMESTAMPTZ
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id AS class_id,
    c.class_token,
    c.teacher_id,
    c.created_at
  FROM public.classes c
  WHERE c.school_id = p_school_id
     OR c.teacher_id IN (
       SELECT st.teacher_id
       FROM public.school_teachers st
       WHERE st.school_id = p_school_id
     );
END;
$$;

CREATE OR REPLACE FUNCTION public.can_add_teacher(p_school_id UUID)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_max_teachers INTEGER;
  v_current_count INTEGER;
BEGIN
  SELECT max_teachers INTO v_max_teachers
  FROM public.schools
  WHERE id = p_school_id;

  SELECT COUNT(*) INTO v_current_count
  FROM public.school_teachers
  WHERE school_id = p_school_id;

  RETURN v_current_count < v_max_teachers;
END;
$$;

-- Step 9: Create trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER schools_updated_at
BEFORE UPDATE ON public.schools
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Step 10: Insert demo data (optional - comment out for production)
-- INSERT INTO public.schools (name, package, max_teachers) VALUES
--   ('Helsinki High School', 'premium', 5),
--   ('Tampere Lower Secondary', 'yläaste', 1);

-- Step 11: Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.schools TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.school_teachers TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_teacher_schools TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_school_classes TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_add_teacher TO authenticated;

-- Migration complete!
-- Teachers can now:
-- 1. Create or join schools
-- 2. Invite other teachers (if admin)
-- 3. View all classes from their school
-- 4. Collaborate with colleagues
