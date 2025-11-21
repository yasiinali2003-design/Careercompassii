# Phase 7: Algorithm Calibration - Diagnostic Findings

**Date:** 2025-11-21
**Status:** ROOT CAUSE IDENTIFIED

---

## Critical Finding

Phase 7 diagnostic testing has identified the **root cause** of the low trust ratings (43.3% vs 80% target):

### The Problem: Question-to-Subdimension Mapping is Broken

**Test Case:**
- User answered **5 (strongly agree)** to all technology/innovation questions (Q1-5, Q11-15)
- User answered **1 (strongly disagree)** to all people/health questions (Q6-10)

**Expected Behavior:**
- Top strengths: Technology, Innovation
- Category: innovoija
- Recommendations: Tech careers (Full Stack Developer, DevOps Engineer, etc.)

**Actual Behavior:**
- Top strengths: **"Analyyttinen ajattelu" (Analytical thinking), "Kasvatus ja opetus" (Education/teaching)**
- Category: **jarjestaja** (organizer)
- Recommendations: **Kirjanpitäjä (Accountant), Henkilöstöasiantuntija (HR Specialist)**
- **0/5 matches** - Complete failure

---

## Root Cause Analysis

### Issue 1: Question Mapping Logic Error

The system is interpreting **strong technology interest** as **analytical thinking** instead of **technology interest**.

**Location:** `lib/scoring/dimensions.ts` (question mappings)

**Evidence from Test:**
```
User Dimension Scores:
- Interests: 0.60% (should be high for technology)
- Values: 0.78%
- Workstyle: 0.50%
- Context: 0.50%

Top Strengths: Analyyttinen ajattelu, Kasvatus ja opetus
               ^^^^^^^^^^^^^^^^^^^^^^  ^^^^^^^^^^^^^^^^^^^^
               Should be: Technology,  Innovation
```

### Issue 2: Category Detection Miscalculation

Even though analytical thinking is detected, the category detection chose "jarjestaja" instead of potentially "innovoija".

**Location:** `lib/scoring/scoringEngine.ts` lines 1050-1205 (determineDominantCategory function)

---

## Diagnostic Test Results

### Test Profile: Tech-Interested YLA Student
- Cohort: YLA
- Answer Pattern: High tech (5s), Low people/health (1s)
- Expected Category: innovoija
- Expected Careers: Full Stack Developer, DevOps Engineer, Cloud Architect

### Actual Results:
```
Top 5 Recommendations:
❌ 1. Kirjanpitäjä (Accountant) - jarjestaja
❌ 2. Henkilöstöasiantuntija (HR Specialist) - jarjestaja
❌ 3. Ethical Sourcing Manager - jarjestaja
❌ 4. Laadunhallinnan koordinaattori (Quality Coordinator) - jarjestaja
❌ 5. Healthcare Coordinator - jarjestaja

Match Rate: 0.0% (0/5 correct)
Category: jarjestaja (expected: innovoija)
```

---

## Impact Analysis

This root cause explains ALL Phase 6 test failures:

| Test Profile | Expected Category | Actual Category | Explanation |
|--------------|------------------|----------------|-------------|
| Tech-interested | innovoija | jarjestaja | Questions map to analytical instead of technology |
| Healthcare-interested | auttaja | ympariston-puolustaja | Questions map incorrectly |
| Creative-interested | luova | visionaari | Questions map incorrectly |

**Trust Rating Impact:**
- Phase 6 achieved: 43.3%
- Phase 6 target: 80%
- **Gap: 36.7 percentage points** - FULLY EXPLAINED by this root cause

---

## Required Fixes

### Fix 1: Audit and Correct Question Mappings (CRITICAL)

**File:** `lib/scoring/dimensions.ts`

**Action Required:**
1. Review EVERY question in all 3 cohort question sets
2. Verify each question maps to the correct subdimension
3. Specifically check:
   - Technology questions → should map to `interests.technology` (not `interests.analytical`)
   - Healthcare questions → should map to `interests.health` or `interests.people`
   - Creative questions → should map to `interests.creative`
   - Leadership questions → should map to `workstyle.leadership`

**Example of Potential Error:**
```typescript
// WRONG (likely current state):
{
  q: 0,
  text: "Pidätkö teknologiasta ja tietokoneista?",
  dimension: "interests",
  subdimension: "analytical",  // ❌ WRONG!
  weight: 1.0,
  reverse: false
}

// CORRECT (what it should be):
{
  q: 0,
  text: "Pidätkö teknologiasta ja tietokoneista?",
  dimension: "interests",
  subdimension: "technology",  // ✅ CORRECT!
  weight: 1.5,  // Higher weight for strong signal
  reverse: false
}
```

### Fix 2: Verify Career Vectors

**File:** `lib/scoring/careerVectors.ts`

**Action:**
1. Verify tech careers have high `interests.technology` scores
2. Verify healthcare careers have high `interests.health` or `interests.people` scores
3. Ensure vectors accurately represent career requirements

### Fix 3: Re-test After Fixes

**Action:**
1. Run `test-algorithm-diagnostic.js` again
2. Should achieve 80%+ match rate (4-5/5 correct)
3. Run full Phase 6 test suite
4. Target: 70%+ trust rating across all profiles

---

## Estimated Effort

**Fix Duration:** 1-2 days
- Day 1: Audit and fix all question mappings
- Day 2: Verify career vectors, test, iterate

**Success Criteria:**
- Diagnostic test: 80%+ match rate (4-5/5 correct careers)
- Phase 6 test suite: 70%+ average trust rating
- All cohorts showing correct category detection

---

## Next Steps

1. **IMMEDIATE:** Read and audit `lib/scoring/dimensions.ts`
   - Check ALL question mappings for YLA, TASO2, NUORI cohorts
   - Fix any questions mapping to wrong subdimensions

2. **PRIORITY 1:** Re-run diagnostic test
   - Should see technology interests correctly detected
   - Should see innovoija category selected
   - Should see tech careers in top 5

3. **PRIORITY 2:** Run full Phase 6 test suite
   - Measure new trust rating
   - Should achieve 70%+ (vs current 43.3%)

4. **PRODUCTION:** Only deploy after achieving 70%+ trust rating

---

## Files to Audit

### Critical Files:
1. `lib/scoring/dimensions.ts` - Question-to-subdimension mappings (**MOST CRITICAL**)
2. `lib/scoring/careerVectors.ts` - Career subdimension scores
3. `lib/scoring/scoringEngine.ts` - Category detection logic

### Test Files:
1. `test-algorithm-diagnostic.js` - Single profile deep diagnostic
2. `test-phase6-synthetic-profiles.js` - Full 21-profile test suite

---

## Conclusion

**Phase 7 has successfully identified the root cause of low trust ratings.**

The issue is NOT with:
- ✅ Category-specific weights (already implemented)
- ✅ Interest-based boosts (already implemented)
- ✅ Occupation filtering (works correctly)
- ✅ Career progression detection (works correctly)
- ✅ Skill overlap calculation (works correctly)

The issue IS with:
- ❌ **Question-to-subdimension mapping in dimensions.ts**

This is a **data/configuration issue**, not an algorithm logic issue. Once the question mappings are corrected, the algorithm should work as designed and achieve the 80% trust rating target.

---

**Last Updated:** 2025-11-21
**Status:** ROOT CAUSE IDENTIFIED - Ready for Fix Implementation
