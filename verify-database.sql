-- Database Verification Script for CareerCompassi
-- Run this in Supabase SQL Editor to check if all tables exist

-- Check if rate_limits table exists
SELECT 
  CASE 
    WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'rate_limits')
    THEN '✅ rate_limits table EXISTS'
    ELSE '❌ rate_limits table MISSING - Run supabase-rate-limits-table.sql'
  END as rate_limits_status;

-- Check if teachers table exists
SELECT 
  CASE 
    WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'teachers')
    THEN '✅ teachers table EXISTS'
    ELSE '❌ teachers table MISSING - Run supabase-teachers-table.sql'
  END as teachers_status;

-- Check if classes table exists
SELECT 
  CASE 
    WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'classes')
    THEN '✅ classes table EXISTS'
    ELSE '❌ classes table MISSING - Run supabase-teacher-dashboard.sql'
  END as classes_status;

-- Check if pins table exists
SELECT 
  CASE 
    WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'pins')
    THEN '✅ pins table EXISTS'
    ELSE '❌ pins table MISSING - Run supabase-teacher-dashboard.sql'
  END as pins_status;

-- Check if results table exists
SELECT 
  CASE 
    WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'results')
    THEN '✅ results table EXISTS'
    ELSE '❌ results table MISSING - Run supabase-teacher-dashboard.sql'
  END as results_status;

-- Count records in each table (if they exist)
SELECT 'teachers' as table_name, COUNT(*) as record_count FROM teachers
UNION ALL
SELECT 'classes', COUNT(*) FROM classes
UNION ALL
SELECT 'pins', COUNT(*) FROM pins
UNION ALL
SELECT 'results', COUNT(*) FROM results
UNION ALL
SELECT 'rate_limits', COUNT(*) FROM rate_limits;

-- Check RPC functions exist
SELECT 
  routine_name,
  CASE 
    WHEN routine_name IN ('generate_teacher_code', 'get_class_results_by_token', 'get_class_by_token', 'validate_pin', 'get_class_results_owner')
    THEN '✅ EXISTS'
    ELSE '⚠️  UNKNOWN'
  END as status
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('generate_teacher_code', 'get_class_results_by_token', 'get_class_by_token', 'validate_pin', 'get_class_results_owner')
ORDER BY routine_name;




