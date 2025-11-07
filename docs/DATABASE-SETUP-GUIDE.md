# Database Setup Guide - Todistuspistelaskuri

## Quick Start

Follow these steps to set up the database for the Todistuspistelaskuri feature.

## Prerequisites

1. Supabase project created
2. Environment variables configured:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

## Step 1: Run Database Migration

### Option A: Via Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy Migration SQL**
   - Open `migrations/create-study-programs-table.sql`
   - Copy the entire contents

4. **Run Migration**
   - Paste the SQL into the SQL Editor
   - Click "Run" (or press Cmd/Ctrl + Enter)
   - Wait for success message

5. **Verify Table Created**
   - Go to "Table Editor" in left sidebar
   - Look for `study_programs` table
   - Verify columns match the schema

### Option B: Via Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db push
```

## Step 2: Import Initial Data

### Check Environment Variables

```bash
# Verify environment variables are set
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY
```

### Run Import Script

```bash
cd /Users/yasiinali/careercompassi

# Set environment variables if not already set
export NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Run import script
npx tsx scripts/import-study-programs.ts
```

### Expected Output

```
🚀 Starting study programs import...

📊 Total programs to import: 100

📦 Importing batch 1/1 (100 programs)...
✅ Batch 1 imported successfully

📊 Import Summary:
   ✅ Successfully imported: 100
   ❌ Errors: 0
   📈 Total: 100

🎉 All programs imported successfully!

🔍 Verifying imported data...

📊 Programs in database: 100
📊 Expected: 100
✅ Count matches!
```

## Step 3: Verify Import

### Via Supabase Dashboard

1. Go to "Table Editor" → `study_programs`
2. Verify ~100 rows exist
3. Check sample data:
   - Click on a few rows to verify data looks correct
   - Check that `min_points` and `max_points` are populated
   - Verify `related_careers` array is populated

### Via SQL Query

```sql
-- Count total programs
SELECT COUNT(*) FROM study_programs;

-- View sample programs
SELECT id, name, institution, min_points, max_points, field 
FROM study_programs 
LIMIT 10;

-- Check programs by field
SELECT field, COUNT(*) 
FROM study_programs 
GROUP BY field 
ORDER BY COUNT(*) DESC;

-- Check programs by institution type
SELECT institution_type, COUNT(*) 
FROM study_programs 
GROUP BY institution_type;
```

## Step 4: Test API Endpoint

### Test GET Endpoint

```bash
# Basic fetch
curl "http://localhost:3000/api/study-programs?limit=5"

# With filters
curl "http://localhost:3000/api/study-programs?points=100&type=yliopisto&field=teknologia"

# With search
curl "http://localhost:3000/api/study-programs?search=tietotekniikka"
```

### Expected Response

```json
{
  "programs": [
    {
      "id": "tietotekniikka-helsinki",
      "name": "Tietotekniikka",
      "institution": "Helsingin yliopisto",
      "institutionType": "yliopisto",
      "field": "teknologia",
      "minPoints": 95.0,
      "maxPoints": 120.0,
      "relatedCareers": ["ohjelmistokehittaja", "tietoturva-asiantuntija"],
      "opintopolkuUrl": "https://opintopolku.fi/...",
      "description": "..."
    }
  ],
  "total": 100,
  "limit": 5,
  "offset": 0,
  "hasMore": true
}
```

## Troubleshooting

### Migration Fails

**Error: "relation already exists"**
- Table already exists, skip migration or drop table first:
  ```sql
  DROP TABLE IF EXISTS study_programs CASCADE;
  ```

**Error: "permission denied"**
- Check you're using the correct Supabase project
- Verify you have admin access

### Import Fails

**Error: "Missing Supabase environment variables"**
- Set environment variables:
  ```bash
  export NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
  export SUPABASE_SERVICE_ROLE_KEY="eyJhbGc..."
  ```

**Error: "Failed to connect to database"**
- Check Supabase URL is correct
- Verify service role key is valid
- Check network connection

**Error: "Duplicate key value violates unique constraint"**
- Programs already imported
- This is OK - script uses upsert, so it will update existing records
- Check if data is already in database

### API Returns Empty Results

**Check:**
1. Database has data (run `SELECT COUNT(*) FROM study_programs;`)
2. API endpoint is accessible
3. Check browser console for errors
4. Verify RLS policies allow read access

## Verification Checklist

- [ ] Migration SQL executed successfully
- [ ] `study_programs` table exists
- [ ] Table has correct columns and indexes
- [ ] Import script ran successfully
- [ ] ~100 programs in database
- [ ] Sample data looks correct
- [ ] API endpoint returns programs
- [ ] Components load programs from API

## Next Steps

After database setup:

1. **Test in Browser**
   - Navigate to test results page
   - Enter grades and calculate points
   - Verify programs load from database

2. **Monitor Performance**
   - Check API response times
   - Monitor database query performance
   - Adjust indexes if needed

3. **Add More Programs** (Optional)
   - Use import script to add more programs
   - Or add via Supabase Dashboard
   - Or use API POST endpoint

## Annual Updates

When new point requirements are published (typically June-July):

1. **Update Data Year**
   ```sql
   UPDATE study_programs SET data_year = 2026;
   ```

2. **Update Point Requirements**
   - Option A: Bulk update via CSV import
   - Option B: Update via Supabase Dashboard
   - Option C: Use API POST endpoint

3. **Re-run Import Script**
   - Script uses upsert, so it will update existing records
   - Or manually update point requirements

## Support

If you encounter issues:
1. Check Supabase logs in Dashboard
2. Check browser console for errors
3. Verify environment variables
4. Check network requests in browser DevTools

