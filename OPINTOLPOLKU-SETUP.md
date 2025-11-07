# Opintopolku Integration - Quick Setup Guide

## ✅ What's Been Created

1. **API Client** (`lib/opintopolku/api.ts`)
   - Fetches study programs from Opintopolku
   - Fetches admission points
   - Handles rate limiting

2. **Data Transformer** (`lib/opintopolku/transformer.ts`)
   - Converts Opintopolku format to our schema
   - Maps fields and institution types
   - Matches careers to programs

3. **Import Script** (`scripts/import-from-opintopolku.ts`)
   - Main script to fetch and import programs
   - Supports dry-run, limits, offsets
   - Batch processing with error handling

## 🚀 Quick Start

### 1. Test with Dry Run

```bash
npx tsx scripts/import-from-opintopolku.ts --dry-run --limit=100
```

This will:
- Fetch 100 programs from Opintopolku
- Transform them
- Show what would be imported
- **NOT** actually import to database

### 2. Import First Batch

```bash
npx tsx scripts/import-from-opintopolku.ts --limit=100
```

### 3. Continue Importing

```bash
npx tsx scripts/import-from-opintopolku.ts --limit=500 --offset=100 --skip-existing
```

### 4. Import All Programs

```bash
npx tsx scripts/import-from-opintopolku.ts --limit=2000 --skip-existing
```

## ⚠️ Important Notes

### API Endpoints May Need Updates

The Opintopolku API endpoints in `lib/opintopolku/api.ts` are **placeholders**. You may need to:

1. **Check Opintopolku API documentation** for actual endpoints
2. **Update endpoints** if they've changed
3. **Add authentication** if required
4. **Adjust response parsing** if format differs

### Current Endpoints (Placeholders)

- Study Programs: `https://opintopolku.fi/api/koulutus/v1/koulutukset`
- Admission Points: `https://opintopolku.fi/api/hakemus/v1/hakukohteet`

### If API Doesn't Work

If the Opintopolku API is not accessible or has changed:

1. **Check Opintopolku website** for API documentation
2. **Use manual CSV import** instead (to be created)
3. **Contact Opintopolku** for API access

## 📊 Expected Results

After successful import:
- **800+ programs** in database
- Programs matched to careers
- Both yliopisto and AMK programs
- Admission points included

## 🔍 Verification

Check imported data:

```bash
# Check total count
curl "http://localhost:3000/api/study-programs?limit=1" | jq '.total'

# Check sample programs
curl "http://localhost:3000/api/study-programs?limit=5" | jq '.programs[] | {name, institution, minPoints}'
```

Or check in Supabase Dashboard:
- Table: `study_programs`
- Should see 800+ rows

## 📝 Next Steps

1. **Test API endpoints** - Verify Opintopolku API is accessible
2. **Update endpoints if needed** - Adjust in `lib/opintopolku/api.ts`
3. **Run dry-run** - Test transformation logic
4. **Import gradually** - Start with 100, then expand
5. **Monitor errors** - Check for data quality issues

## 🆘 Troubleshooting

See `docs/OPINTOLPOLKU-INTEGRATION.md` for detailed troubleshooting guide.

