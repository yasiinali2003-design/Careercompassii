# Manual Review & Correction Plan - Release A Week 1 Day 2

## Current Status
✅ **Day 1 Complete**: Added `careerLevel` + `education_tags` types to data/careers-fi.ts
✅ **Day 2 Complete**: Auto-tagging script generated 617 suggestions
✅ **Quality Review Complete**: Identified ~100+ issues across 6 categories

## Your Task Now: Manual Corrections

### Step 1: Open the Suggestions File
```bash
# Open this file for editing:
careercompassi/scripts/career-metadata-suggestions.json
```

### Step 2: Make Corrections Using DETAILED_FIX_GUIDE.md

**Reference file**: `scripts/DETAILED_FIX_GUIDE.md`

#### Priority 1: Critical Fixes (20 issues - MUST FIX before applying)

**A. Wrong Levels (4 careers)**
Search for each career ID in the JSON file and update:

1. `lennonjohtaja`: Change `"suggestedLevel": "senior"` → `"mid"`
2. `ekonomisti`: Change `"suggestedLevel": "entry"` → `"mid"`
3. `opinto-ohjaaja`: Change `"suggestedLevel": "entry"` → `"mid"`
4. `kouluttaja`: Change `"suggestedLevel": "entry"` → `"mid"`

**B. Education Tag Mismatches (8 careers)**
Update these careers' education fields:

1. `quantum-computing-engineer`: `ANY_SECONDARY` → `["UNI"]`
2. `neurotech-insinoori`: `ANY_SECONDARY` → `["UNI", "AMK"]`
3. `regulatory-affairs-specialist`: `ANY_SECONDARY` → `["UNI"]`
4. `records-manager`: `["AMK"]` → `["UNI", "AMK"]`
5. `barista`: `["AMIS"]` → `["ANY_SECONDARY", "AMIS"]` (optional)
6. `hammashoitaja`: Keep `["AMIS"]` (already correct)
7. `game-engine-developer`: `ANY_SECONDARY` → `["UNI", "AMK"]`
8. `3d-tulostus-insinoori`: `ANY_SECONDARY` → `["UNI", "AMK"]`

**C. Title/ID Typos (8+ issues)**
Fix these in the JSON file:

1. `3d-tulostus-insinoori`: Fix title "3D-tulostusingsinööri" → "3D-tulostusinsinööri"
2. `game-engine-developer`: Fix title "Pelimoottori kehittäjä" → "Pelimoottorin kehittäjä"
3. `typo graphinen-suunnittelija`: Fix ID → "typografinen-suunnittelija"

#### Priority 2: Optional Enhancements (79+ issues - Can do AFTER applying)

**D. Wrong Categories (2 careers)**
1. `nuorisotyon-ohjaaja`: `"category": "johtaja"` → `"auttaja"`
2. `viestintakoordinaattori`: `"category": "johtaja"` → `"jarjestaja"`

**E. entry_roles/career_progression Typos (7+ issues)**
Fix spacing/typos in these fields (see DETAILED_FIX_GUIDE.md Category 4.2)

**F. Generic Placeholders (70+ careers)**
Replace "Junior-tason työt" with real titles (see DETAILED_FIX_GUIDE.md Category 5)
*Note: This can be done post-deployment*

#### Priority 3: Low Confidence Reviews (152 careers)

**Skip these for now** - they're marked "low confidence" but the defaults are safe.
Review later based on pilot feedback from teachers.

### Step 3: Save Your Changes

After making corrections, save the file:
```
careercompassi/scripts/career-metadata-suggestions.json
```

### Step 4: Apply Metadata to careers-fi.ts

Once you've finished corrections, run:

```bash
cd careercompassi
npx tsx scripts/apply-career-metadata.ts
```

**What this does**:
1. Creates backup: `data/careers-fi.ts.backup-[timestamp]`
2. Reads your corrected suggestions file
3. Updates all 617 careers in `data/careers-fi.ts`
4. Adds `careerLevel` and `education_tags` fields
5. Verifies all careers have metadata

**Expected output**:
```
✅ Loaded 617 suggestions from scripts/career-metadata-suggestions.json
✅ Backup created: data/careers-fi.ts.backup-1234567890
✅ Successfully updated careers-fi.ts

📊 Summary:
   Careers updated: 617
   Careers not found: 0
   Total suggestions: 617

🔍 Verifying update...
   Careers with careerLevel: 617
   Careers with education_tags: 617

✅ Verification passed! All careers have metadata
```

### Step 5: Verify TypeScript Compiles

```bash
npm run type-check
```

**If errors occur**: Check the backup file and re-run the apply script.

### Step 6: Commit Your Work

```bash
git add data/careers-fi.ts scripts/
git commit -m "Release A Week 1 Day 2: Add careerLevel + education_tags metadata

- Added 617 career metadata suggestions (auto-generated + manually reviewed)
- Applied metadata to all careers in careers-fi.ts
- Fixed 20 critical issues (levels, education tags, typos)
- Ready for cohort-based filtering implementation

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## What Happens Next (Week 1 Day 3-5)

### Day 3: Implement Cohort-Based Level Filtering
**File**: `lib/scoring/scoringEngine.ts`

Add filtering logic:
```typescript
// Filter careers by level based on cohort
if (cohort === 'YLA') {
  careers = careers.filter(c => c.careerLevel === 'entry');
}
else if (cohort === 'TASO2') {
  careers = careers.filter(c => c.careerLevel === 'entry' || c.careerLevel === 'mid');
}
// NUORI sees all levels
```

### Day 4: Remove Senior Titles from Boost Pools
**File**: `lib/scoring/scoringEngine.ts` (lines 250-380)

Remove careers with `careerLevel: 'senior'` from personality boost pools.

### Day 5: Add Diversity Rule
**File**: `lib/scoring/scoringEngine.ts` (after final ranking)

Preserve top 2 careers, apply diversity to ranks 3-10.

---

## Quick Reference: Critical Files

| File | Purpose | Status |
|------|---------|--------|
| `scripts/career-metadata-suggestions.json` | 617 suggestions (YOU EDIT THIS) | ⏳ Manual review |
| `scripts/DETAILED_FIX_GUIDE.md` | Fix instructions | ✅ Ready |
| `scripts/apply-career-metadata.ts` | Applies corrections | ✅ Ready to run |
| `data/careers-fi.ts` | Career database | ⏳ Will be updated |
| `lib/scoring/scoringEngine.ts` | Scoring logic | ⏳ Day 3-5 work |

---

## Completion Checklist

**Week 1 Day 2 - Manual Review**:
- [ ] Fixed 4 wrong levels (lennonjohtaja, ekonomisti, opinto-ohjaaja, kouluttaja)
- [ ] Fixed 8 education tag mismatches (quantum, neurotech, game-engine, etc.)
- [ ] Fixed 8+ title/ID typos (3d-tulostus, typo graphinen, etc.)
- [ ] Saved career-metadata-suggestions.json
- [ ] Ran `npx tsx scripts/apply-career-metadata.ts`
- [ ] Verified with `npm run type-check`
- [ ] Committed changes to git

**Optional (Can do later)**:
- [ ] Fixed 2 wrong categories
- [ ] Fixed entry_roles/career_progression typos
- [ ] Replaced 70+ generic placeholders

---

## Success Criteria

After completing this manual review, you should have:

✅ **617 careers with metadata**:
- 360-365 entry-level careers
- 245-250 mid-level careers
- 2-4 senior-level careers (post-corrections)

✅ **No false positives**:
- lennonjohtaja = mid (not senior)
- ekonomisti = mid (not entry)
- quantum-computing = UNI (not ANY_SECONDARY)

✅ **TypeScript compiles without errors**

✅ **Ready for Day 3**: Implement cohort-based filtering

---

## Questions During Review?

If you find careers where you're unsure about the correct level or education tags:

**Ask yourself**:
1. **Level**: Does this require 5+ years experience? (senior) / 2-4 years? (mid) / 0-2 years? (entry)
2. **Education**: What's the minimum realistic path in Finland?
   - University degree required? → `["UNI"]`
   - AMK or University both work? → `["UNI", "AMK"]`
   - Vocational training works? → `["AMIS"]` or `["AMIS", "AMK"]`
   - No clear requirement? → `["ANY_SECONDARY"]`

**When in doubt**: Use DETAILED_FIX_GUIDE.md Category 6 (Low Confidence Reviews) for pattern examples.

---

## Estimated Time

- **Priority 1 fixes (20 issues)**: ~30-45 minutes
- **Priority 2 fixes (optional)**: ~1-2 hours
- **Running apply script**: ~1 minute
- **Total (critical path)**: ~45 minutes

---

## Ready to Start?

1. Open `scripts/career-metadata-suggestions.json`
2. Open `scripts/DETAILED_FIX_GUIDE.md` side-by-side
3. Start with Priority 1 (20 critical fixes)
4. Save file when done
5. Run apply script
6. Verify and commit

**Let me know when you're ready to run the apply script!**
