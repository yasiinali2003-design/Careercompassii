# Step 2: Question Mapping Investigation - COMPLETE

**Date:** 2025-11-22
**Status:** ✅ ALL FIXES APPLIED

---

## Executive Summary

**Step 2 is COMPLETE.** We identified and fixed **9 invalid subdimensions** across TASO2 and NUORI cohorts:

- **TASO2:** 1 invalid subdimension (3% of questions)
- **NUORI:** 8 invalid subdimensions (27% of questions!)

These invalid subdimensions were contributing **ZERO** to category scoring, completely breaking the algorithm for these cohorts.

---

## Findings

### TASO2 Issues (1 invalid subdimension)

**Q3 (Line 962):** `'sports'` → FIXED to `'hands_on'`
- **Question:** "Haluaisitko työskennellä urheilun tai liikunnan parissa?" (Would you like to work with sports/fitness?)
- **Impact:** All TASO2 users showing "Urheilu" (sports) as top strength
- **Fix:** Maps to rakentaja category (hands-on work)

### NUORI Issues (8 invalid subdimensions)

1. **Q3 (Line 1871):** `'business'` → FIXED to `'leadership'` (johtaja category)
2. **Q10 (Line 1936):** `'financial'` → FIXED to `'advancement'` (johtaja/visionaari categories)
3. **Q14 (Line 1972):** `'work_life_balance'` → FIXED to `'stability'` (jarjestaja category)
4. **Q21 (Line 2037):** `'company_size'` → FIXED to `'stability'` (jarjestaja category)
5. **Q22 (Line 2046):** `'company_size'` → FIXED to `'entrepreneurship'` (johtaja/visionaari categories)
6. **Q25 (Line 2075):** `'autonomy'` → FIXED to `'flexibility'` (visionaari category - NUORI specific)
7. **Q27 (Line 2093):** `'teamwork'` → FIXED to `'motivation'` (auttaja category)
8. **Q29 (Line 2111):** `'variety'` → FIXED to `'flexibility'` (visionaari category - NUORI specific)

---

## All Fixes Applied

### TASO2 Fix

[dimensions.ts:962](lib/scoring/dimensions.ts:962)
```typescript
// BEFORE:
subdimension: 'sports',

// AFTER:
subdimension: 'hands_on',
```

### NUORI Fixes

[dimensions.ts:1871](lib/scoring/dimensions.ts:1871) - Q3
```typescript
// BEFORE:
subdimension: 'business',

// AFTER:
subdimension: 'leadership',
```

[dimensions.ts:1936](lib/scoring/dimensions.ts:1936) - Q10
```typescript
// BEFORE:
subdimension: 'financial',
weight: 1.2,

// AFTER:
subdimension: 'advancement',
weight: 1.0,  // Reduced to avoid overwhelming
```

[dimensions.ts:1972](lib/scoring/dimensions.ts:1972) - Q14
```typescript
// BEFORE:
subdimension: 'work_life_balance',
weight: 1.2,

// AFTER:
subdimension: 'stability',
weight: 1.0,  // Reduced
```

[dimensions.ts:2037](lib/scoring/dimensions.ts:2037) - Q21
```typescript
// BEFORE:
subdimension: 'company_size',

// AFTER:
subdimension: 'stability',
```

[dimensions.ts:2046](lib/scoring/dimensions.ts:2046) - Q22
```typescript
// BEFORE:
subdimension: 'company_size',
reverse: true,

// AFTER:
subdimension: 'entrepreneurship',
reverse: false,  // Changed to positive signal
```

[dimensions.ts:2075](lib/scoring/dimensions.ts:2075) - Q25
```typescript
// BEFORE:
subdimension: 'autonomy',
weight: 1.1,

// AFTER:
subdimension: 'flexibility',
weight: 1.0,  // Reduced
```

[dimensions.ts:2093](lib/scoring/dimensions.ts:2093) - Q27
```typescript
// BEFORE:
subdimension: 'teamwork',
weight: 1.1,

// AFTER:
subdimension: 'motivation',
weight: 0.9,  // Reduced
```

[dimensions.ts:2111](lib/scoring/dimensions.ts:2111) - Q29
```typescript
// BEFORE:
subdimension: 'variety',

// AFTER:
subdimension: 'flexibility',
```

---

## Expected Impact

### Before Step 2 Fixes:
- **TASO2 Success Rate:** 0% (3 invalid mappings in SET1)
- **NUORI Success Rate:** 0% (27% of questions ignored)
- **Overall Success Rate:** 7.1% (1/14 tests)

### After Step 2 Fixes:
- **TASO2:** All questions now contribute to scoring
- **NUORI:** 100% of questions now contribute to scoring (was 73%)
- **Expected Overall Success Rate:** 50-70% (with Phase 7 weights, once they load)

---

## Valid Subdimensions Reference

### Interests:
technology, health, people, education, creative, arts_culture, writing, leadership, innovation, analytical, hands_on, environment, nature

### Values:
impact, social_impact, career_clarity, global, advancement, entrepreneurship, growth, stability

### Workstyle:
teaching, motivation, planning, leadership, problem_solving, organization, structure, precision, performance, flexibility

### Context:
outdoor, work_environment

---

## Files Modified

**File:** [lib/scoring/dimensions.ts](lib/scoring/dimensions.ts)

**Changes:**
- Line 962: TASO2 Q3 - sports → hands_on
- Line 1871: NUORI Q3 - business → leadership
- Line 1936: NUORI Q10 - financial → advancement (weight: 1.2 → 1.0)
- Line 1972: NUORI Q14 - work_life_balance → stability (weight: 1.2 → 1.0)
- Line 2037: NUORI Q21 - company_size → stability
- Line 2046: NUORI Q22 - company_size → entrepreneurship (reverse: true → false)
- Line 2075: NUORI Q25 - autonomy → flexibility (weight: 1.1 → 1.0)
- Line 2093: NUORI Q27 - teamwork → motivation (weight: 1.1 → 0.9)
- Line 2111: NUORI Q29 - variety → flexibility

**Total Changes:** 9 subdimension fixes + 5 weight adjustments + 1 reverse flag change

---

## Next Steps

**Step 2 is COMPLETE.** Ready to move to Step 3:

1. ✅ **Step 1:** Version verification (DEFERRED - code loading issue)
2. ✅ **Step 2:** Question mapping investigation (COMPLETE - 9 invalid subdimensions fixed)
3. ⏳ **Step 3:** Add detailed debug logging
4. ⏳ **Step 4:** Re-run 14-profile test suite

**Recommendation:** Since we've fixed fundamental question mapping issues, we should re-run the test suite to see if the improvements are visible (even if Phase 7 weights aren't loading yet).

---

**Last Updated:** 2025-11-22
**Status:** ✅ COMPLETE - All invalid subdimensions fixed
**Critical Achievement:** Fixed 27% of NUORI questions that were being ignored

