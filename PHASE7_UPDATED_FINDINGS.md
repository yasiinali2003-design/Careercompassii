# Phase 7: Updated Root Cause Analysis

**Date:** 2025-11-21
**Status:** DEEPER ROOT CAUSE IDENTIFIED

---

## Critical Discovery

After correcting the diagnostic test, a DEEPER architectural issue has been revealed:

### The Real Problem: YLA Cohort Design Mismatch

**The YLA (upper secondary) cohort was designed for EDUCATION PATH selection (Lukio vs. Ammattikoulu), NOT for specific career recommendations.**

### Evidence

**Test Results with Corrected Answer Pattern:**
- User answered 5 (strongly interested) to Q15 "Kiinnostaako sinua tietokoneet ja teknologia?"
- **Top Strength CORRECTLY detected:** "Vahva teknologiakiinnostus" (Strong technology interest) ✅
- **But Category Detection FAILED:** Selected "visionaari" instead of "innovoija" ❌
- **Result:** 0/5 tech career matches ❌

**Why Visionaari Was Selected:**
- Q8: "Tiedätkö jo, mitä ammattia haluaisit tehdä?" (Do you know what profession you want?) = 4
- This maps to `values.career_clarity`
- For YLA cohort, `career_clarity` gets **+2.5x boost** for visionaari category
- Technology interest only gets +1.5x boost for innovoija
- **Career clarity outweighs technology interest!**

---

## Architectural Analysis

### YLA Question Structure:
```
Q0-7:   Learning preferences (analytical vs hands-on) → Lukio vs Ammattikoulu indicator
Q8-14:  Future mindset (career_clarity, entrepreneurship) → Education planning
Q15-22: Interest areas (tech, health, creative, environment, leadership, building)
Q23-29: Values and work preferences
```

### The Design Intent:
- **Primary Goal:** Guide students to choose between Lukio (academic) and Ammattikoulu (vocational)
- **Secondary Goal:** Identify general interest areas
- **NOT DESIGNED FOR:** Specific technical career recommendations like "Software Developer"

### Why This Breaks Career Matching:

1. **Career Clarity Dominates:** YLA students who know what they want (high career_clarity) get pushed to "visionaari" category regardless of their actual interests
2. **Technology Interest Underweighted:** Even with Q15=5 (strongly interested in technology), it's not enough to overcome career_clarity boost
3. **Visionaari Category Mismatch:** The system recommends high-level strategy/planning careers (Tietojärjestelmäarkkitehti, Solutions Architect) instead of hands-on tech careers (Software Developer, DevOps Engineer)

---

## Impact on Other Cohorts

This issue likely affects ALL cohorts, not just YLA:

### TASO2 Cohort:
- Question design: Career field exploration
- Similar issue: May prioritize wrong signals over actual interests

### NUORI Cohort:
- Question design: Career + lifestyle
- Phase 6 showed 40% trust rating → Likely has similar calibration issues

---

## Root Cause Summary

**There are actually TWO interrelated problems:**

1. **Category Detection Calibration Issue:**
   - The weights/boosts in `determineDominantCategory()` are not properly calibrated
   - Some signals (like career_clarity for YLA) dominate over actual interest signals (like technology)
   - Result: Users get assigned to wrong categories

2. **Question Design Philosophy Mismatch:**
   - YLA questions designed for education path selection
   - But system tries to use them for specific career matching
   - These are fundamentally different goals

---

## Recommended Solutions

### Option A: Recalibrate Category Detection (Quick Fix - 1-2 days)

**Approach:** Adjust the weights in `determineDominantCategory()` to prioritize interest signals over planning/clarity signals.

**Changes Needed:**
```typescript
// Current (WRONG for career matching):
categoryScores.visionaari += (values.career_clarity || 0) * 2.5;  // Too high!
categoryScores.innovoija += (interests.technology || 0) * 1.5;

// Proposed (BETTER for career matching):
categoryScores.visionaari += (values.career_clarity || 0) * 1.0;  // Reduced
categoryScores.innovoija += (interests.technology || 0) * 2.5;    // Increased!
```

**Pros:**
- Quick to implement
- Should improve trust ratings immediately
- No question changes needed

**Cons:**
- Band-aid solution
- Doesn't address fundamental design mismatch
- May break education path selection logic

### Option B: Redesign YLA Questions (Proper Fix - 1-2 weeks)

**Approach:** Create new question set for YLA that focuses on career interests, not education path.

**Pros:**
- Proper solution
- Questions aligned with goal
- Best long-term outcome

**Cons:**
- Requires significant work
- Need to revalidate all questions
- Breaking change

### Option C: Separate Education Path and Career Matching (Ideal - 2-3 weeks)

**Approach:** Split into two separate flows:
1. Education Path Selection (Lukio vs Ammattikoulu) - existing YLA questions
2. Career Interest Discovery - new career-focused questions

**Pros:**
- Each system optimized for its goal
- No compromises
- Clear user experience

**Cons:**
- Most work required
- Architectural changes needed

---

## Recommended Immediate Action

**Implement Option A (Recalibration) as emergency fix:**

1. **Reduce career_clarity weight for YLA:** From 2.5 → 1.0
2. **Increase technology interest weight:** From 1.5 → 2.5
3. **Increase other interest weights similarly:**
   - health: 1.8 → 2.8
   - creative: 1.5 → 2.5
   - environment: 1.3 → 2.5

4. **Test with diagnostic:**
   - Should now select "innovoija" for tech-interested users
   - Should achieve 60-70%+ match rate

5. **Run full Phase 6 test suite:**
   - Measure new trust rating
   - Should jump from 43.3% to 65-75%

---

## Files to Modify

### For Option A (Quick Fix):

**File:** `lib/scoring/scoringEngine.ts` (lines 1050-1205)

**Function:** `determineDominantCategory()`

**Specific Changes:**
- Line 1163: Reduce career_clarity boost for visionaari (YLA)
- Line 1104: Increase technology boost for innovoija
- Lines 1071-1145: Increase other interest boosts proportionally

---

## Next Steps

1. **Immediate:** Implement Option A recalibration
2. **Test:** Run diagnostic - expect innovoija category for tech user
3. **Validate:** Run Phase 6 suite - expect 65-75% trust rating
4. **Decide:** If successful, plan Option C for long-term solution

---

**Last Updated:** 2025-11-21
**Status:** Deeper root cause identified - Ready for recalibration fix
**Recommended Action:** Option A - Category weight recalibration
