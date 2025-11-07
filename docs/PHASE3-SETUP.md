# Phase 3: Full Database + API Integration - Setup Guide

## Overview

Phase 3 migrates the Todistuspistelaskuri from static data to a Supabase database with API endpoints, enabling:
- Scalable database (800+ programs)
- Real-time data updates
- Better performance with indexing
- Admin interface for managing programs
- Annual data updates

## Prerequisites

1. Supabase project set up
2. Environment variables configured:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

## Step 1: Create Database Table

Run the migration SQL in your Supabase SQL Editor:

```bash
# Option 1: Via Supabase Dashboard
# 1. Go to SQL Editor
# 2. Copy contents of migrations/create-study-programs-table.sql
# 3. Run the SQL

# Option 2: Via CLI (if you have Supabase CLI)
supabase db push
```

The migration creates:
- `study_programs` table with proper schema
- Indexes for performance (institution_type, field, points, related_careers)
- Row Level Security policies
- Auto-update trigger for `updated_at`

## Step 2: Import Initial Data

Import the ~100 programs from static data:

```bash
# Make sure environment variables are set
export NEXT_PUBLIC_SUPABASE_URL="your-url"
export SUPABASE_SERVICE_ROLE_KEY="your-service-key"

# Run import script
npx tsx scripts/import-study-programs.ts
```

Expected output:
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
```

## Step 3: Verify Import

Check in Supabase Dashboard:
1. Go to Table Editor → `study_programs`
2. Verify ~100 rows exist
3. Check sample data looks correct

Or run verification query:
```sql
SELECT COUNT(*) FROM study_programs;
SELECT id, name, institution, min_points FROM study_programs LIMIT 5;
```

## Step 4: Test API Endpoints

### Test GET endpoint:
```bash
# Basic fetch
curl "http://localhost:3000/api/study-programs?points=100&type=yliopisto"

# With filters
curl "http://localhost:3000/api/study-programs?points=100&type=yliopisto&field=teknologia&careers=ohjelmistokehittaja"

# With search
curl "http://localhost:3000/api/study-programs?search=tietotekniikka"
```

### Test POST endpoint (create/update):
```bash
curl -X POST http://localhost:3000/api/study-programs \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-program",
    "name": "Test Program",
    "institution": "Test University",
    "institutionType": "yliopisto",
    "field": "teknologia",
    "minPoints": 80.0,
    "maxPoints": 100.0,
    "relatedCareers": ["ohjelmistokehittaja"]
  }'
```

## Step 5: Verify Component Integration

1. Start dev server: `npm run dev`
2. Navigate to test results page with TASO2 data
3. Verify:
   - ✅ Calculator appears
   - ✅ Programs load from API (check Network tab)
   - ✅ Search/filter work
   - ✅ Fallback to static data if API fails

## Component Behavior

### API-First with Fallback
- **Primary**: Fetches from `/api/study-programs`
- **Fallback**: Uses static data from `lib/data/studyPrograms.ts` if API fails
- **Benefits**: Works even if database not set up, graceful degradation

### Loading States
- Shows "Ladataan koulutusohjelmia..." while fetching
- Shows error message if fetch fails
- Retry button available

## API Endpoint Reference

### GET /api/study-programs

**Query Parameters:**
- `points` (number): Filter by points range
- `type` ('yliopisto' | 'amk'): Filter by institution type
- `field` (string): Filter by field
- `careers` (string): Comma-separated career slugs
- `search` (string): Search in name/institution/description
- `limit` (number): Results per page (default: 50, max: 100)
- `offset` (number): Pagination offset (default: 0)
- `sort` ('match' | 'points-low' | 'points-high' | 'name'): Sort order

**Response:**
```json
{
  "programs": [...],
  "total": 100,
  "limit": 50,
  "offset": 0,
  "hasMore": true
}
```

### POST /api/study-programs

**Body:**
```json
{
  "id": "program-id",
  "name": "Program Name",
  "institution": "Institution Name",
  "institutionType": "yliopisto" | "amk",
  "field": "teknologia",
  "minPoints": 80.0,
  "maxPoints": 100.0,
  "relatedCareers": ["career-slug"],
  "opintopolkuUrl": "https://...",
  "description": "Program description"
}
```

## Adding More Programs

### Method 1: Via Import Script
1. Add programs to `lib/data/studyPrograms.ts`
2. Run import script: `npx tsx scripts/import-study-programs.ts`

### Method 2: Via API
```bash
curl -X POST http://localhost:3000/api/study-programs \
  -H "Content-Type: application/json" \
  -d '{...program data...}'
```

### Method 3: Via Supabase Dashboard
1. Go to Table Editor → `study_programs`
2. Click "Insert row"
3. Fill in fields
4. Save

## Annual Data Updates

When new point requirements are published (typically June-July):

1. **Update data_year column:**
   ```sql
   UPDATE study_programs SET data_year = 2026;
   ```

2. **Update point requirements:**
   - Option A: Bulk update via CSV import
   - Option B: Update via API
   - Option C: Manual update in Supabase Dashboard

3. **Add new programs:**
   - Import new programs via script or API
   - Update `data_year` to current year

## Performance Considerations

- **Indexes**: Already created for common queries
- **Pagination**: Default limit 50, max 100
- **Caching**: Consider adding Redis/Vercel KV cache for production
- **CDN**: Static program data could be cached at edge

## Troubleshooting

### API returns empty results
- Check Supabase connection
- Verify table exists and has data
- Check RLS policies allow read access
- Check browser console for errors

### Import fails
- Verify environment variables are set
- Check Supabase service role key is correct
- Verify table exists (run migration first)
- Check for duplicate IDs

### Components show static data
- API might be failing silently
- Check Network tab for failed requests
- Verify API route is accessible
- Check fallback logic in `lib/api/studyPrograms.ts`

## Next Steps (Optional)

1. **Add Admin Interface** (Phase 3.5):
   - CRUD interface for managing programs
   - Bulk import from CSV
   - Point requirement updates

2. **Add Caching**:
   - Cache API responses
   - Invalidate on updates
   - Edge caching for static data

3. **Add Analytics**:
   - Track which programs users view
   - Popular programs
   - Search queries

4. **Opintopolku Integration**:
   - Sync data from Opintopolku API
   - Automatic updates
   - Real-time point requirements

## Files Created/Modified

### New Files:
- `migrations/create-study-programs-table.sql` - Database schema
- `scripts/import-study-programs.ts` - Data import script
- `app/api/study-programs/route.ts` - API endpoints
- `lib/api/studyPrograms.ts` - API client with fallback

### Modified Files:
- `components/StudyProgramsList.tsx` - Now uses API instead of static data

## Testing Checklist

- [ ] Database table created successfully
- [ ] Data imported (100 programs)
- [ ] API GET endpoint works
- [ ] API POST endpoint works
- [ ] Components load from API
- [ ] Fallback to static data works if API fails
- [ ] Search/filter work correctly
- [ ] Pagination works
- [ ] Loading states display correctly
- [ ] Error handling works

