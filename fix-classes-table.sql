-- Fix for classes table: Add missing updated_at column
-- Run this in Supabase SQL Editor

ALTER TABLE classes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Verify the column was added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'classes'
ORDER BY ordinal_position;
