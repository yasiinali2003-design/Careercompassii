# Step 2: Ready to Implement

## What I've Prepared

✅ **Script created:** `scripts/fetch-yliopisto-only.ts`
- Fetches only yliopisto programs
- Ready to run once Step 1 is complete

## Implementation Steps

Once Step 1 tests pass, I'll:

1. **Fetch 150 yliopisto programs**
   ```bash
   npx tsx scripts/fetch-yliopisto-only.ts --limit=150
   ```

2. **Import to database**
   ```bash
   npx tsx scripts/import-from-opintopolku.ts --limit=150 --skip-existing
   ```

3. **Verify results**
   - Check new program count
   - Verify balance improved
   - Run tests

## Expected Outcome

- **Before:** 51 yliopisto, 281 AMK
- **After:** ~150 yliopisto, 281 AMK
- **Total:** ~431 programs
- **Better balance** for users

## Status

⏳ **Waiting for Step 1 to complete** (server restart + tests)

Once Step 1 passes, Step 2 will run automatically!

