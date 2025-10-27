/**
 * Verify Teacher Dashboard Schema
 * This script checks that all tables, policies, and functions were created correctly
 */

// Instructions for user to run in Supabase SQL Editor:

const verificationQueries = `
-- VERIFY TABLES EXIST
SELECT 
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('classes', 'pins', 'results')
ORDER BY table_name;

-- VERIFY INDEXES EXIST
SELECT 
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('classes', 'pins', 'results')
ORDER BY tablename, indexname;

-- VERIFY RLS IS ENABLED
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('classes', 'pins', 'results')
ORDER BY tablename;

-- VERIFY FUNCTIONS EXIST
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
    'get_class_results_by_token',
    'get_class_results_owner',
    'get_class_by_token',
    'validate_pin'
  )
ORDER BY routine_name;

-- VERIFY POLICIES EXIST
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles
FROM pg_policies
WHERE tablename IN ('classes', 'pins', 'results')
ORDER BY tablename, policyname;
`;

console.log('Copy and run this in Supabase SQL Editor to verify setup:');
console.log(verificationQueries);

