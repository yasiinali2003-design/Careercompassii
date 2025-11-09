-- Check Teachers Table Status
-- Run this in Supabase SQL Editor to debug

-- 1. Check if table exists and has data
SELECT 
  'Table exists' as check_type,
  CASE WHEN EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'teachers'
  ) THEN '✅ YES' ELSE '❌ NO' END as status
UNION ALL
SELECT 
  'Has teachers',
  CASE WHEN EXISTS (SELECT 1 FROM teachers LIMIT 1) THEN '✅ YES' ELSE '❌ NO' END
UNION ALL
SELECT 
  'Count of teachers',
  COUNT(*)::TEXT FROM teachers;

-- 2. List all teachers (last 10)
SELECT 
  id,
  name,
  access_code,
  is_active,
  created_at
FROM teachers
ORDER BY created_at DESC
LIMIT 10;

-- 3. Check if generate_teacher_code() function exists
SELECT 
  'Function exists' as check_type,
  CASE WHEN EXISTS (
    SELECT FROM information_schema.routines 
    WHERE routine_schema = 'public' 
    AND routine_name = 'generate_teacher_code'
  ) THEN '✅ YES' ELSE '❌ NO' END as status;

-- 4. Test function (if it exists)
SELECT generate_teacher_code() as test_code;





