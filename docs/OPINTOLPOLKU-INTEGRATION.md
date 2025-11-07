# Opintopolku API Integration

## Overview

This integration allows automatic fetching and importing of study programs from Opintopolku (Finland's national study program database) into your Supabase database.

## Features

- ✅ Automatic fetching from Opintopolku API
- ✅ Data transformation to match our schema
- ✅ Career-program matching
- ✅ Admission points integration
- ✅ Rate limiting and error handling
- ✅ Dry-run mode for testing
- ✅ Skip existing programs option

## Setup

### Prerequisites

1. Supabase database set up (see `docs/DATABASE-SETUP-GUIDE.md`)
2. Environment variables configured in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

### Installation

No additional packages needed - uses built-in `fetch` API.

## Usage

### Basic Import

```bash
npx tsx scripts/import-from-opintopolku.ts
```

This will:
- Fetch up to 1000 programs from Opintopolku
- Transform and import them to Supabase
- Match careers to programs automatically

### Options

**Limit number of programs:**
```bash
npx tsx scripts/import-from-opintopolku.ts --limit=500
```

**Start from offset:**
```bash
npx tsx scripts/import-from-opintopolku.ts --offset=1000 --limit=500
```

**Dry run (test without importing):**
```bash
npx tsx scripts/import-from-opintopolku.ts --dry-run
```

**Skip existing programs:**
```bash
npx tsx scripts/import-from-opintopolku.ts --skip-existing
```

**Combine options:**
```bash
npx tsx scripts/import-from-opintopolku.ts --limit=2000 --skip-existing --dry-run
```

## How It Works

### 1. API Fetching (`lib/opintopolku/api.ts`)

- Fetches study programs from Opintopolku API
- Fetches admission points separately
- Handles rate limiting (1 second delay between batches)
- Error handling and retry logic

### 2. Data Transformation (`lib/opintopolku/transformer.ts`)

- Maps Opintopolku fields to our schema:
  - Institution type (yliopisto/amk)
  - Field categories (teknologia, terveys, etc.)
  - Admission points (min/max)
- Generates unique IDs
- Matches careers to programs based on:
  - Field matching
  - Program name keywords
  - Career categories

### 3. Import Process (`scripts/import-from-opintopolku.ts`)

- Fetches programs from Opintopolku
- Fetches admission points
- Transforms data
- Imports to Supabase in batches (100 programs per batch)
- Verifies import

## API Endpoints

The integration uses these Opintopolku API endpoints:

- **Study Programs:** `https://opintopolku.fi/api/koulutus/v1/koulutukset`
- **Admission Points:** `https://opintopolku.fi/api/hakemus/v1/hakukohteet`

**Note:** These endpoints are placeholders. The actual Opintopolku API structure may differ. You may need to:

1. Check Opintopolku API documentation
2. Update endpoints in `lib/opintopolku/api.ts`
3. Adjust data transformation logic

## Troubleshooting

### API Not Available

If you see "Opintopolku API may not be available":

1. **Check API endpoints:** Opintopolku API structure may have changed
2. **Verify network:** Ensure you can access opintopolku.fi
3. **Check authentication:** Some APIs require authentication
4. **Use CSV import:** Fall back to manual CSV import if API unavailable

### No Programs Fetched

If `opPrograms.length === 0`:

1. **Check API response:** The API structure may have changed
2. **Verify parameters:** Limit/offset may be incorrect
3. **Check API documentation:** Endpoint may require different parameters

### Transformation Failures

If many programs are skipped during transformation:

1. **Missing admission points:** Programs without points are skipped
2. **Invalid data:** Check Opintopolku data quality
3. **Mapping issues:** Field/institution type mapping may need adjustment

### Rate Limiting

The script includes rate limiting (1 second delay between batches). If you encounter rate limits:

1. Increase delay in `lib/opintopolku/api.ts`
2. Reduce batch size
3. Run import in smaller chunks

## Alternative: CSV Import

If Opintopolku API is not available, you can:

1. Export data from Opintopolku manually
2. Convert to CSV format
3. Use CSV import script (to be created)

## Data Quality

### What Gets Imported

- Programs with valid admission points
- Both yliopisto and AMK programs
- Programs matched to careers

### What Gets Skipped

- Programs without admission points
- Duplicate programs (if `--skip-existing` used)
- Invalid or incomplete data

## Field Mapping

The transformer maps Opintopolku fields to our categories:

- **teknologia:** Computer science, IT, software
- **terveys:** Medicine, nursing, health
- **kauppa:** Business, economics, commerce
- **tekniikka:** Engineering, technical
- **kasvatus:** Education, teaching
- **oikeus:** Law, legal studies
- **psykologia:** Psychology
- **yhteiskunta:** Social sciences, social work
- **media:** Media, journalism, communication
- **luonnontiede:** Natural sciences, biology, chemistry, physics

## Career Matching

Programs are automatically matched to careers based on:

1. **Field matching:** Careers in same field as program
2. **Keyword matching:** Program names containing career keywords
3. **Category mapping:** Predefined mappings (e.g., "Tietotekniikka" → "ohjelmistokehittaja")

## Next Steps

1. **Test with dry-run:** `--dry-run` to see what would be imported
2. **Start small:** Import 100-200 programs first
3. **Verify data:** Check imported programs in Supabase
4. **Expand gradually:** Increase limit as needed
5. **Monitor:** Check for errors and data quality

## Example Workflow

```bash
# 1. Test with dry-run
npx tsx scripts/import-from-opintopolku.ts --limit=100 --dry-run

# 2. Import first batch
npx tsx scripts/import-from-opintopolku.ts --limit=100

# 3. Verify in Supabase dashboard

# 4. Continue importing
npx tsx scripts/import-from-opintopolku.ts --limit=500 --offset=100 --skip-existing

# 5. Import remaining
npx tsx scripts/import-from-opintopolku.ts --limit=1000 --offset=600 --skip-existing
```

## Status

✅ **Infrastructure Complete**
- API client created
- Transformer implemented
- Import script ready
- Error handling added
- Rate limiting implemented

⚠️ **API Endpoints May Need Updates**
- Opintopolku API structure may differ
- Endpoints may require authentication
- Response format may vary

## Support

If you encounter issues:

1. Check Opintopolku API documentation
2. Verify API endpoints are correct
3. Test with `--dry-run` first
4. Check Supabase logs for errors
5. Consider manual CSV import as alternative

