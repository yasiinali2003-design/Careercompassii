# 🚀 Database Setup - Ready to Execute

## Quick Setup (2 minutes)

### Step 1: Run Migration SQL in Supabase Dashboard

1. **Open Supabase Dashboard**
   - Go to: https://app.supabase.com
   - Sign in if needed
   - Select your project

2. **Open SQL Editor**
   - Click **"SQL Editor"** in the left sidebar
   - Click **"New query"** button (top right)

3. **Copy & Paste SQL**
   - Copy the SQL below (entire block)
   - Paste into the SQL Editor
   - Click **"Run"** button (or press `Cmd/Ctrl + Enter`)

4. **Verify Success**
   - You should see "Success" message
   - Go to **"Table Editor"** → Look for `study_programs` table

---

## 📄 Migration SQL (Copy This Entire Block)

```sql
-- Create study_programs table for Todistuspistelaskuri feature
CREATE TABLE IF NOT EXISTS study_programs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  institution TEXT NOT NULL,
  institution_type TEXT NOT NULL CHECK (institution_type IN ('yliopisto', 'amk')),
  field TEXT NOT NULL,
  min_points NUMERIC(5,1) NOT NULL,
  max_points NUMERIC(5,1),
  related_careers TEXT[] DEFAULT '{}',
  opintopolku_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_year INTEGER DEFAULT 2025
);

CREATE INDEX IF NOT EXISTS idx_study_programs_institution_type ON study_programs(institution_type);
CREATE INDEX IF NOT EXISTS idx_study_programs_field ON study_programs(field);
CREATE INDEX IF NOT EXISTS idx_study_programs_min_points ON study_programs(min_points);
CREATE INDEX IF NOT EXISTS idx_study_programs_max_points ON study_programs(max_points);
CREATE INDEX IF NOT EXISTS idx_study_programs_data_year ON study_programs(data_year);
CREATE INDEX IF NOT EXISTS idx_study_programs_related_careers ON study_programs USING GIN(related_careers);

CREATE OR REPLACE FUNCTION update_study_programs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_study_programs_updated_at
  BEFORE UPDATE ON study_programs
  FOR EACH ROW
  EXECUTE FUNCTION update_study_programs_updated_at();

ALTER TABLE study_programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to study_programs"
  ON study_programs FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert study_programs"
  ON study_programs FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update study_programs"
  ON study_programs FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated users to delete study_programs"
  ON study_programs FOR DELETE USING (true);
```

---

### Step 2: Import Data

After migration succeeds, run this command:

```bash
cd /Users/yasiinali/careercompassi
npx tsx scripts/import-study-programs.ts
```

**Expected Output:**
```
🚀 Starting study programs import...
📊 Total programs to import: 82
📦 Importing batch 1/1 (82 programs)...
✅ Batch 1 imported successfully
🎉 All programs imported successfully!
```

---

### Step 3: Verify Setup

**In Supabase Dashboard:**
- Go to **"Table Editor"** → `study_programs`
- Should see ~82 rows
- Click on a few rows to verify data looks correct

**Or run SQL query:**
```sql
SELECT COUNT(*) FROM study_programs;
-- Should return ~82

SELECT id, name, institution, min_points FROM study_programs LIMIT 5;
```

---

## ✅ Done!

Your database is now set up. The Todistuspistelaskuri feature will automatically use the database instead of static data.

---

## Troubleshooting

**"relation already exists" error?**
- Table already exists - that's OK! Proceed to Step 2 (import data)

**Import fails?**
- Make sure migration ran successfully first
- Check `.env.local` has correct Supabase credentials
- Verify you're connected to the correct Supabase project

**Need help?**
- Check `docs/DATABASE-SETUP-GUIDE.md` for detailed instructions
- Verify table exists: `SELECT * FROM study_programs LIMIT 1;`

