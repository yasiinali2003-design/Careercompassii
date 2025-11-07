# ✅ 250 Programs Import Complete

## Summary

Successfully imported **250 new study programs** from Opintopolku search endpoint to Supabase database.

## Results

- **Total programs in database:** 332 (82 original + 250 new)
- **Yliopisto programs:** 51
- **AMK programs:** 281
- **All programs have admission points:** ✅ (estimated based on field/institution)

## Field Distribution (Top 10)

1. **Tekniikka:** 90 programs
2. **Muu:** 81 programs
3. **Terveys:** 70 programs
4. **Teknologia:** 22 programs
5. **Kauppa:** 14 programs
6. **Media:** 11 programs
7. **Kasvatus:** 9 programs
8. **Yhteiskunta:** 6 programs
9. **Luonnontiede:** 4 programs
10. **Oikeus:** 3 programs

## Implementation Details

### What Was Done

1. **Updated Scraper** (`scripts/scrape-opintopolku.ts`)
   - Added filtering for yliopisto/AMK programs only
   - Filters by `koulutustyyppi`: `yo-kandi-ja-maisteri` and `amk-ylempi`

2. **Created Search Transformer** (`lib/opintopolku/searchTransformer.ts`)
   - Transforms Opintopolku search endpoint data to our `StudyProgram` format
   - Maps `koulutustyyppi` to institution type (yliopisto/amk)
   - Maps program names to fields (teknologia, terveys, kauppa, etc.)
   - Estimates admission points based on field and institution type
   - Matches careers to programs based on field and name

3. **Updated Import Script** (`scripts/import-from-opintopolku.ts`)
   - Uses scraper to fetch programs from search endpoint
   - Transforms and imports to Supabase database
   - Handles duplicates and errors gracefully

### Point Estimation Logic

Admission points are estimated based on:
- **Field averages** (from existing 82 programs)
- **Institution type** (yliopisto vs AMK)
- **Program name keywords** (high-demand programs get +5-10 points)
- **Popular universities** (Helsinki, Aalto, Tampere, etc. get +5 points)

**Estimated ranges:**
- Yliopisto: 70-200 points (varies by field)
- AMK: 40-75 points (varies by field)

### Data Quality

- ✅ All programs have unique IDs (based on OID)
- ✅ All programs have admission points (estimated)
- ✅ All programs have institution type (yliopisto/amk)
- ✅ All programs have field classification
- ✅ All programs have Opintopolku URLs
- ✅ Career matching implemented (based on field/name)

## Next Steps

### Option 1: Add More Yliopisto Programs
Currently we have 51 yliopisto vs 281 AMK. To get more yliopisto programs:

```bash
# Fetch only yliopisto programs
npx tsx scripts/scrape-opintopolku.ts --limit=200
# Then update import script to filter for 'yo' type only
```

### Option 2: Refine Admission Points
Points are currently estimated. To improve accuracy:
- Fetch actual admission points from Opintopolku detail pages
- Use 2025 admission statistics when available
- Update points annually after spring application period

### Option 3: Add More Programs
To expand beyond 250:

```bash
npx tsx scripts/import-from-opintopolku.ts --limit=500 --skip-existing
```

### Option 4: Add Program Descriptions
Currently descriptions are truncated to 500 chars. To add full descriptions:
- Fetch from Opintopolku detail pages
- Add to transformer

## Files Modified

1. `scripts/scrape-opintopolku.ts` - Added filtering for yliopisto/AMK
2. `lib/opintopolku/searchTransformer.ts` - New transformer for search endpoint
3. `scripts/import-from-opintopolku.ts` - Updated to use scraper

## Usage

To import more programs:

```bash
# Import 250 programs (default)
npx tsx scripts/import-from-opintopolku.ts --limit=250 --skip-existing

# Dry run (test without importing)
npx tsx scripts/import-from-opintopolku.ts --limit=250 --dry-run

# Import without skipping existing (will update duplicates)
npx tsx scripts/import-from-opintopolku.ts --limit=250
```

## Notes

- **Data Source:** Opintopolku public search endpoint (`konfo-backend/search/koulutukset`)
- **No API Key Required:** Uses public endpoint (no authentication needed)
- **Rate Limiting:** Scraper includes delays between requests to avoid rate limits
- **Point Accuracy:** Points are estimated - can be refined later with actual data
- **Yliopisto vs AMK:** Currently more AMK programs (281 vs 51) - can be balanced by fetching more yliopisto programs separately

## Success! 🎉

The database now has **332 study programs** ready for use in the Todistuspistelaskuri feature.

