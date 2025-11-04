# Database Migration: Add Package Column

## Quick Migration

Run this SQL in your **Supabase SQL Editor**:

```sql
-- Add package column to teachers table
ALTER TABLE teachers 
ADD COLUMN IF NOT EXISTS package TEXT DEFAULT 'standard' 
CHECK (package IN ('premium', 'standard'));

-- Set default for existing rows
UPDATE teachers SET package = 'standard' WHERE package IS NULL;
```

## Steps

1. Go to https://app.supabase.com
2. Select your project
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New query"**
5. Paste the SQL above
6. Click **"Run"** (or press `Ctrl+Enter` / `Cmd+Enter`)

## Verification

After running, verify with:

```sql
SELECT name, package FROM teachers LIMIT 5;
```

You should see your teachers with `package = 'standard'` (or `'premium'` if already set).

## Automated Script

Run `node run-migration.js` to check status and get instructions.



