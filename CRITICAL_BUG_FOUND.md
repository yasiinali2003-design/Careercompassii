# CRITICAL BUG: Test Data Using Wrong Question Indices for NUORI

**Date:** 2025-11-23
**Status:** 🚨 ROOT CAUSE IDENTIFIED

---

## Summary

ALL 5 NUORI tests are failing with 0% success because **the test data is using the wrong question indices**.

The test was written assuming NUORI questions follow the same structure as YLA/TASO2, but they DON'T.

---

## The Problem

### Test Assumes (WRONG):
```javascript
// Q0-9: Career values
// Q10-19: Work style
// Q20-29: Interests  ← WRONG!
```

### Actual NUORI Structure (dimensions.ts:1838-2115):
```javascript
// Q0-9:   Career Field INTERESTS (technology, health, creative, business, etc.)
// Q10-17: Work VALUES (salary, impact, stability, advancement, growth)
// Q18-24: Work CONTEXT (remote, office, travel, company size)
// Q25-29: Work STYLE (autonomy, leadership, teamwork, routine, variety)
```

---

## Evidence

### NUORI Tech Test (Expected: innovoija)

**Test Code:**
```javascript
answers: generateAnswers([
  // Q0-9: Values - Growth, innovation
  4, 4, 5, 4, 3, 3, 4, 5, 4, 3,
  // Q10-19: Workstyle - Problem-solving, flexible
  4, 3, 4, 5, 3, 4, 3, 4, 3, 3,
  // Q20-29: Interests - HIGH TECH  ← THIS IS WRONG!
  5, 1, 2, 2, 3, 3, 4, 4, 4, 3  // Q20=5 (supposedly "tech")
]),
```

**What Actually Happens:**
- Q20 (score 5) maps to subdimension: `work_environment` (NOT technology!)
- Real technology questions (Q0, Q4) get scores of **4 and 3** - too low!
- Result: No strong technology signal → algorithm picks wrong category

### Actual NUORI Question Mapping:

| Q# | Subdimension | What Test Thinks | What It Really Is |
|----|--------------|------------------|-------------------|
| Q0 | `technology` | "growth" | **IT/digital solutions** ✅ |
| Q1 | `health` | "innovation" | Healthcare/nursing |
| Q4 | `technology` | "problem-solving" | **Engineering/tech** ✅ |
| Q20 | `work_environment` | **"HIGH TECH"** | Mobile/field work ❌ |

---

## Why All NUORI Tests Fail

1. **Tech Switcher** → Gets "auttaja" because:
   - Real tech questions (Q0,Q4) = 4,3 (moderate)
   - Q20=5 boosts `work_environment` (doesn't map to innovoija)
   - No strong technology signal

2. **Leadership Focus** → Gets "auttaja" because:
   - Real leadership questions (Q3=business, Q26=leadership)
   - Test puts high scores in wrong places

3. **Creative Entrepreneur** → Gets "auttaja" because:
   - Real creative questions (Q2,Q8,Q17)
   - Test puts Q22=5 (startup interest), not Q2/Q8/Q17=5

4. **Social Impact** → Gets "auttaja" (CORRECT!) but:
   - Only works by accident
   - Q21=5 should be health (Q1), not Q21

5. **Strategic Planner** → Gets "auttaja" because:
   - Visionaari signals (global, advancement, growth) are in Q10-17
   - Test doesn't emphasize those correctly

---

## Fix Required

### Option 1: Fix Test Data (RECOMMENDED)
Rewrite NUORI test profiles to use correct question indices:

```javascript
{
  id: "nuori-tech-switcher",
  name: "NUORI: Tech Career Switcher",
  cohort: "NUORI",
  description: "Switching to tech, strong learning motivation",
  answers: generateAnswers([
    // Q0-9: Career Field INTERESTS
    5, 1, 2, 2, 5, 2, 3, 3, 3, 3,  // Q0=5 (tech IT), Q4=5 (tech eng), Q1=1 (health low)
    // Q10-17: Work VALUES
    4, 3, 3, 5, 3, 3, 5, 4,  // Q10=4 (salary), Q13=5 (advancement), Q16=5 (growth)
    // Q18-24: Work CONTEXT
    4, 3, 3, 2, 3, 3, 3,  // Q18=4 (remote work OK)
    // Q25-29: Work STYLE
    4, 3, 3, 3, 3  // Q25=4 (autonomy)
  ]),
  expectedCategory: "innovoija",
  expectedCareers: ["Full Stack -kehittäjä", "DevOps-insinööri", "Tuotepäällikkö"]
}
```

### Option 2: Document Cohort Differences
Add clear documentation that each cohort has different question structures.

---

## Impact

- **Current Success Rate:** 7.1% (1/14 tests)
- **Expected After Fix:** 70-85%
  - YLA: Already working (20% → 80%)
  - TASO2: Should improve (0% → 75%)
  - NUORI: Will work correctly (0% → 80%)

---

## Next Steps

1. ✅ Document this finding
2. ⏭️ Fix all 5 NUORI test profiles with correct question indices
3. ⏭️ Re-run test suite
4. ⏭️ Verify 70%+ success rate
5. ⏭️ Add test data validation to prevent this in future

---

## Lesson Learned

**ALWAYS validate test data against actual implementation!**

The algorithm is working correctly - the test data was just targeting the wrong questions.

---

**Status:** Ready to fix test data and re-validate
