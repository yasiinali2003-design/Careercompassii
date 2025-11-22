# Step 2: Question Mapping Investigation - FINDINGS

**Date:** 2025-11-22
**Status:** ✅ ROOT CAUSE IDENTIFIED

---

## Summary

**CRITICAL DISCOVERY:** TASO2 Q3 uses an invalid `'sports'` subdimension that doesn't exist in the scoring system, causing all TASO2 profiles to incorrectly show "Urheilu" (sports) as a top strength.

---

## Valid Subdimensions (from scoringEngine.ts)

Based on analysis of [scoringEngine.ts:1070-1219], the scoring system recognizes these subdimensions:

### Interests Dimension:
- `technology` - Tech/digital interests (innovoija category)
- `health` - Healthcare interests (auttaja category)
- `people` - People/social interests (auttaja category)
- `education` - Teaching/education interests (auttaja category)
- `creative` - Creative/artistic interests (luova category)
- `arts_culture` - Arts/culture interests (luova category)
- `writing` - Writing interests (luova category)
- `leadership` - Leadership interests (johtaja category)
- `innovation` - Innovation interests (innovoija/visionaari categories)
- `analytical` - Analytical/data interests (jarjestaja category)
- `hands_on` - Hands-on/practical interests (rakentaja category)
- `environment` - Environmental interests (ympariston-puolustaja category)
- `nature` - Nature interests (ympariston-puolustaja category)

### Values Dimension:
- `impact` - Making a difference (auttaja category)
- `social_impact` - Social impact motivation (auttaja category)
- `career_clarity` - Career clarity (visionaari category - heavily weighted in old system)
- `global` - Global vision (visionaari/johtaja categories)
- `advancement` - Career advancement (johtaja/visionaari categories)
- `entrepreneurship` - Entrepreneurship (johtaja/visionaari categories)
- `growth` - Personal/professional growth (visionaari category)
- `stability` - Stability preference (jarjestaja category)

### Workstyle Dimension:
- `teaching` - Teaching style (auttaja category)
- `motivation` - Motivation/inspiring others (auttaja category)
- `planning` - Planning/strategic thinking (visionaari/johtaja categories)
- `leadership` - Leadership style (johtaja category)
- `problem_solving` - Problem-solving approach (innovoija category)
- `organization` - Organizational style (jarjestaja category)
- `structure` - Structured approach (jarjestaja category)
- `precision` - Precision/attention to detail (jarjestaja/rakentaja categories)
- `performance` - Performance focus (rakentaja category)
- `flexibility` - Flexibility/adaptability (visionaari category - NUORI)

### Context Dimension:
- `outdoor` - Outdoor work context (ympariston-puolustaja category)
- `work_environment` - Mobile/field work (ympariston-puolustaja category)

---

## Invalid Subdimensions Found

### TASO2 Q3 (Line 962):
```typescript
{
  q: 3,
  text: "Haluaisitko työskennellä urheilun tai liikunnan parissa?",
  dimension: 'interests',
  subdimension: 'sports',  // ❌ INVALID - doesn't exist in scoring system!
  weight: 1.2,
  reverse: false,
  notes: "Sports/fitness careers (replaces tech duplicate)"
}
```

**Impact:**
- **Every TASO2 user who answers this question positively** gets "Urheilu" (sports) as a top strength
- This subdimension **contributes ZERO to category scoring** (ignored by scoringEngine.ts)
- Explains why test results show: "Top Strengths: Urheilu, Sosiaalisuus, Terveysala"
- Contributes to TASO2 0% success rate

---

## Recommended Fix

**Replace invalid 'sports' subdimension with valid alternative:**

### Option 1: Map to 'hands_on' (rakentaja category)
**Rationale:** Sports/fitness careers often involve physical/hands-on work

```typescript
{
  q: 3,
  text: "Haluaisitko työskennellä urheilun tai liikunnan parissa?",
  dimension: 'interests',
  subdimension: 'hands_on',  // ✅ VALID
  weight: 1.2,
  reverse: false,
  notes: "Sports/fitness careers - physical/hands-on work (was: sports)"
}
```

### Option 2: Map to 'health' (auttaja category)
**Rationale:** Sports/fitness careers often focus on health/wellness

```typescript
{
  q: 3,
  text: "Haluaisitko työskennellä urheilun tai liikunnan parissa?",
  dimension: 'interests',
  subdimension: 'health',  // ✅ VALID
  weight: 1.0,  // Lower weight to avoid overwhelming healthcare signal
  reverse: false,
  notes: "Sports/fitness careers - health/wellness focus (was: sports)"
}
```

### Option 3: Map to 'people' (auttaja category)
**Rationale:** Sports/fitness careers often involve coaching/helping people

```typescript
{
  q: 3,
  text: "Haluaisitko työskennellä urheilun tai liikunnan parissa?",
  dimension: 'interests',
  subdimension: 'people',  // ✅ VALID
  weight: 1.0,
  reverse: false,
  notes: "Sports/fitness careers - coaching/helping people (was: sports)"
}
```

**RECOMMENDED:** Option 1 (`hands_on`) - Most accurate for sports/fitness careers which are physical/practical in nature.

---

## NUORI Investigation Status

**NUORI_MAPPINGS location:** Line 1838
**NUORI_MAPPINGS_SET2 location:** Line 2121
**NUORI_MAPPINGS_SET3 location:** Line 2434

**Search result:** NO invalid 'sports' subdimensions found in NUORI mappings

**Next:** Need to investigate why NUORI has 0% success rate despite valid subdimensions. Possible issues:
1. Question text may not match user intent
2. Subdimension choices may be wrong for NUORI cohort
3. Weight distribution may be incorrect

---

## Files to Modify

1. **`lib/scoring/dimensions.ts`** (line 962) - Fix TASO2 Q3 subdimension

---

## Next Steps

1. ✅ Identified invalid 'sports' subdimension in TASO2 Q3
2. ⏳ Fix TASO2 Q3 mapping (change 'sports' → 'hands_on')
3. ⏳ Investigate NUORI question mappings more deeply (may need different analysis)
4. ⏳ Re-run test suite to validate TASO2 improvements

---

**Last Updated:** 2025-11-22
**Status:** Ready to fix TASO2 Q3
**Critical Finding:** Invalid 'sports' subdimension causing TASO2 failures
