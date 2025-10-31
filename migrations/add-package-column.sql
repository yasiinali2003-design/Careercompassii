-- Migration: Add package column to teachers table
-- Run this in Supabase SQL Editor if you have existing teachers without the package column

-- Add package column if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'teachers' AND column_name = 'package'
  ) THEN
    ALTER TABLE teachers 
    ADD COLUMN package TEXT DEFAULT 'standard' 
    CHECK (package IN ('premium', 'standard'));
    
    -- Update existing teachers to 'standard' if they don't have a package
    UPDATE teachers SET package = 'standard' WHERE package IS NULL;
  END IF;
END $$;


