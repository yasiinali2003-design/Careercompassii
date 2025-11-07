# Quick Database Setup - Todistuspistelaskuri

## ⚡ Fast Setup (5 minutes)

### Step 1: Run Migration SQL (2 minutes)

1. **Open Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project

2. **Open SQL Editor**
   - Click "SQL Editor" in left sidebar
   - Click "New query"

3. **Copy & Run Migration**
   - Copy the entire contents of `migrations/create-study-programs-table.sql`
   - Paste into SQL Editor
   - Click "Run" (or press Cmd/Ctrl + Enter)
   - Wait for "Success" message

4. **Verify Table Created**
   - Go to "Table Editor" → Look for `study_programs` table
   - Should see columns: id, name, institution, institution_type, field, min_points, etc.

### Step 2: Import Data (2 minutes)

```bash
cd /Users/yasiinali/careercompassi

# The script will read from .env.local automatically
npx tsx scripts/import-study-programs.ts
```

**Expected Output:**
```
🚀 Starting study programs import...
📊 Total programs to import: 100
📦 Importing batch 1/1 (100 programs)...
✅ Batch 1 imported successfully
🎉 All programs imported successfully!
```

### Step 3: Verify (1 minute)

**Check in Supabase Dashboard:**
- Table Editor → `study_programs` → Should see ~100 rows

**Or run SQL query:**
```sql
SELECT COUNT(*) FROM study_programs;
-- Should return ~100
```

**Test API:**
```bash
curl "http://localhost:3000/api/study-programs?limit=5"
```

## ✅ Done!

Your database is now set up with ~100 study programs. The Todistuspistelaskuri feature will now use the database instead of static data.

## Troubleshooting

**Migration fails?**
- Check you're in the correct Supabase project
- Verify you have admin access
- If table exists, it's OK - migration uses `IF NOT EXISTS`

**Import fails?**
- Check `.env.local` has correct values
- Verify Supabase URL and Service Role Key
- Check network connection

**Need help?**
- See `docs/DATABASE-SETUP-GUIDE.md` for detailed instructions
- Check Supabase logs in Dashboard

