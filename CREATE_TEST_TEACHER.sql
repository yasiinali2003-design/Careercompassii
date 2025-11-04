-- Create a test teacher manually
-- Run this in Supabase SQL Editor

-- First, delete any existing test teacher with this code
DELETE FROM teachers WHERE access_code = 'TEST1234';

-- Create a test teacher
INSERT INTO teachers (name, email, school_name, access_code, is_active)
VALUES ('Test Teacher', 'test@example.com', 'Test School', 'TEST1234', true)
RETURNING id, name, access_code, is_active;

-- Verify it was created
SELECT id, name, access_code, is_active, created_at 
FROM teachers 
WHERE access_code = 'TEST1234';




