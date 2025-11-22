# Step 2: NUORI Broken Mappings - CRITICAL FINDINGS

**Date:** 2025-11-22
**Status:** ✅ ROOT CAUSE IDENTIFIED - READY TO FIX

---

## Executive Summary

**CATASTROPHIC DISCOVERY:** NUORI cohort has **8 invalid subdimensions** out of 30 questions (27%), meaning **27% of user answers contribute ZERO to category scoring**. This completely explains the 0% NUORI success rate.

---

## Invalid Subdimensions Found

### 1. Q3 (Line 1871): 'business' → FIX: 'leadership'
```typescript
// CURRENT (BROKEN):
{
  q: 3,
  text: "Haluaisitko työskennellä liike-elämässä ja johtamisessa?",  // Business/management
  dimension: 'interests',
  subdimension: 'business',  // ❌ INVALID
  weight: 1.3
}

// FIX:
{
  q: 3,
  text: "Haluaisitko työskennellä liike-elämässä ja johtamisessa?",
  dimension: 'interests',
  subdimension: 'leadership',  // ✅ VALID - maps to johtaja category
  weight: 1.3,
  notes: "Business/management - leadership interest (was: business)"
}
```

### 2. Q10 (Line 1936): 'financial' → FIX: 'advancement'
```typescript
// CURRENT (BROKEN):
{
  q: 10,
  text: "Onko sinulle erittäin tärkeää ansaita hyvä palkka (yli 4000€/kk)?",  // High salary priority
  dimension: 'values',
  subdimension: 'financial',  // ❌ INVALID
  weight: 1.2
}

// FIX:
{
  q: 10,
  text: "Onko sinulle erittäin tärkeää ansaita hyvä palkka (yli 4000€/kk)?",
  dimension: 'values',
  subdimension: 'advancement',  // ✅ VALID - high salary correlates with career advancement
  weight: 1.0,  // Reduced from 1.2 to avoid overwhelming
  notes: "High salary priority - advancement value (was: financial)"
}
```

### 3. Q14 (Line 1972): 'work_life_balance' → FIX: 'stability'
```typescript
// CURRENT (BROKEN):
{
  q: 14,
  text: "Onko sinulle tärkeää, että sinulla on aikaa perheelle ja harrastuksille?",  // Work-life balance
  dimension: 'values',
  subdimension: 'work_life_balance',  // ❌ INVALID
  weight: 1.2
}

// FIX:
{
  q: 14,
  text: "Onko sinulle tärkeää, että sinulla on aikaa perheelle ja harrastuksille?",
  dimension: 'values',
  subdimension: 'stability',  // ✅ VALID - WLB correlates with stability/predictability
  weight: 1.0,  // Reduced from 1.2
  notes: "Work-life balance priority - stability value (was: work_life_balance)"
}
```

### 4. Q21 (Line 2037): 'company_size' → FIX: 'stability'
```typescript
// CURRENT (BROKEN):
{
  q: 21,
  text: "Onko sinulle tärkeää työskennellä isossa, tunnetussa yrityksessä?",  // Large company preference
  dimension: 'values',
  subdimension: 'company_size',  // ❌ INVALID
  weight: 0.9
}

// FIX:
{
  q: 21,
  text: "Onko sinulle tärkeää työskennellä isossa, tunnetussa yrityksessä?",
  dimension: 'values',
  subdimension: 'stability',  // ✅ VALID - large companies = stability
  weight: 0.9,
  notes: "Large company preference - stability value (was: company_size)"
}
```

### 5. Q22 (Line 2046): 'company_size' → FIX: 'entrepreneurship'
```typescript
// CURRENT (BROKEN):
{
  q: 22,
  text: "Kiinnostaako sinua työskennellä pienessä startup-yrityksessä?",  // Startup preference
  dimension: 'values',
  subdimension: 'company_size',  // ❌ INVALID
  weight: 0.9,
  reverse: true
}

// FIX:
{
  q: 22,
  text: "Kiinnostaako sinua työskennellä pienessä startup-yrityksessä?",
  dimension: 'values',
  subdimension: 'entrepreneurship',  // ✅ VALID - startups = entrepreneurial spirit
  weight: 0.9,
  reverse: false,  // Changed: positive entrepreneurship signal
  notes: "Startup preference - entrepreneurship value (was: company_size)"
}
```

### 6. Q25 (Line 2075): 'autonomy' → FIX: 'flexibility'
```typescript
// CURRENT (BROKEN):
{
  q: 25,
  text: "Pidätkö siitä, että saat tehdä työsi itsenäisesti ilman jatkuvaa ohjausta?",  // Autonomy preference
  dimension: 'workstyle',
  subdimension: 'autonomy',  // ❌ INVALID
  weight: 1.1
}

// FIX:
{
  q: 25,
  text: "Pidätkö siitä, että saat tehdä työsi itsenäisesti ilman jatkuvaa ohjausta?",
  dimension: 'workstyle',
  subdimension: 'flexibility',  // ✅ VALID - autonomy = flexible work approach
  weight: 1.0,  // Reduced from 1.1
  notes: "Autonomy preference - flexibility workstyle (was: autonomy)"
}
```

### 7. Q27 (Line 2093): 'teamwork' → FIX: 'motivation'
```typescript
// CURRENT (BROKEN):
{
  q: 27,
  text: "Pidätkö tiimityöskentelystä ja yhteistyöstä kollegoiden kanssa?",  // Team collaboration
  dimension: 'workstyle',
  subdimension: 'teamwork',  // ❌ INVALID
  weight: 1.1
}

// FIX:
{
  q: 27,
  text: "Pidätkö tiimityöskentelystä ja yhteistyöstä kollegoiden kanssa?",
  dimension: 'workstyle',
  subdimension: 'motivation',  // ✅ VALID - teamwork involves motivating others
  weight: 0.9,  // Reduced from 1.1
  notes: "Team collaboration - motivation workstyle (was: teamwork)"
}
```

### 8. Q29 (Line 2111): 'variety' → FIX: 'flexibility'
```typescript
// CURRENT (BROKEN):
{
  q: 29,
  text: "Pidätkö työstä, jossa jokainen päivä on erilainen ja yllättävä?",  // Variety/novelty
  dimension: 'workstyle',
  subdimension: 'variety',  // ❌ INVALID
  weight: 1.0
}

// FIX:
{
  q: 29,
  text: "Pidätkö työstä, jossa jokainen päivä on erilainen ja yllättävä?",
  dimension: 'workstyle',
  subdimension: 'flexibility',  // ✅ VALID - variety = flexible/adaptable approach
  weight: 1.0,
  notes: "Variety/novelty preference - flexibility workstyle (was: variety)"
}
```

---

## Impact Analysis

**Before Fix:**
- 8/30 questions (27%) contribute ZERO to scoring
- NUORI users' answers are largely ignored
- Category detection completely broken
- Test success rate: 0%

**After Fix:**
- All 30 questions will contribute to scoring
- NUORI profiles will have meaningful category detection
- Expected test success rate: 60-80%

---

## Summary of Fixes

| Question | Line | Old Subdimension | New Subdimension | Dimension | Maps To Category |
|----------|------|------------------|------------------|-----------|------------------|
| Q3 | 1871 | business | leadership | interests | johtaja |
| Q10 | 1936 | financial | advancement | values | johtaja/visionaari |
| Q14 | 1972 | work_life_balance | stability | values | jarjestaja |
| Q21 | 2037 | company_size | stability | values | jarjestaja |
| Q22 | 2046 | company_size | entrepreneurship | values | johtaja/visionaari |
| Q25 | 2075 | autonomy | flexibility | workstyle | visionaari (NUORI) |
| Q27 | 2093 | teamwork | motivation | workstyle | auttaja |
| Q29 | 2111 | variety | flexibility | workstyle | visionaari (NUORI) |

---

## Next Steps

1. ✅ Identified all 8 invalid subdimensions
2. ⏳ Apply fixes to dimensions.ts
3. ⏳ Re-run test suite to validate NUORI improvements
4. ⏳ Check NUORI_MAPPINGS_SET2 and NUORI_MAPPINGS_SET3 for same issues (they mirror SET1)

---

**Last Updated:** 2025-11-22
**Status:** Ready to apply fixes
**Critical Finding:** 27% of NUORI questions had invalid subdimensions
