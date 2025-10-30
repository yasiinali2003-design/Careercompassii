-- Quick Fix: Create Test Teacher and Verify Setup
-- Run this in Supabase SQL Editor

-- 1. Verify teachers table exists and is accessible
SELECT 'Teachers table' as check_item, 
  CASE WHEN EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'teachers'
  ) THEN '✅ EXISTS' ELSE '❌ MISSING' END as status;

-- 2. Check RPC function exists
SELECT 'generate_teacher_code() function' as check_item,
  CASE WHEN EXISTS (
    SELECT FROM information_schema.routines 
    WHERE routine_schema = 'public' 
    AND routine_name = 'generate_teacher_code'
  ) THEN '✅ EXISTS' ELSE '❌ MISSING' END as status;

-- 3. Create test teacher manually (skip RPC)
DELETE FROM teachers WHERE access_code = 'QUICK123';

INSERT INTO teachers (name, email, school_name, access_code, is_active, created_by)
VALUES ('Quick Test Teacher', 'quick@test.com', 'Quick Test School', 'QUICK123', true, 'manual')
ON CONFLICT (access_code) DO UPDATE SET is_active = true
RETURNING id, name, access_code, is_active;

-- 4. Verify it was created
SELECT 'Test teacher created' as check_item,
  CASE WHEN EXISTS (
    SELECT 1 FROM teachers WHERE access_code = 'QUICK123'
  ) THEN '✅ YES - Use code: QUICK123' ELSE '❌ NO' END as status;
