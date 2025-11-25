# SCORING ALGORITHM PHASE 9 - STATUS REPORT

**Date:** January 25, 2025
**Goal:** Achieve 100% test accuracy (10/10 correct category matches)
**Current Status:** 40% accuracy (4/10 correct)

---

## Problem Summary

Despite multiple iterations (Phase 7 → Phase 9), the scoring algorithm exhibits a **"whack-a-mole" problem**:

1. **Start**: 80% auttaja dominance
2. **Add penalties to auttaja**: 70% luova dominance
3. **Add penalties to luova**: 70% auttaja dominance (back to start)

This cycle repeats because **penalties alone cannot fix the root imbalance**.

---

## Root Cause Analysis

### Issue 1: Opaque Test Profile Conversion

Test profiles use synthetic answers that are converted to subdimensions through `createAnswers()`, but the conversion is producing unexpected values:

**Example: Tech Innovator - Sara**
- Answer: `people interaction: 2` (LOW)
- Calculated subdimension: `people: 0.5` (NEUTRAL)
- Answer: `leadership: ???` (not in answers)
- Calculated subdimension: `leadership: 1.0` (VERY HIGH!)

This creates confusion where Sara (a tech worker) has very high leadership, causing johtaja to compete with innovoija.

### Issue 2: Multiple Categories with Strong Claims

Sara's subdimensions:
- `technology: 0.83` → innovoija claims this (0.83 × 3.0 = 2.49 points)
- `leadership: 1.0` → johtaja claims this (1.0 × 3.0 = 3.0 points)
- `creative: 0.66` → luova claims this (0.66 × 3.0 = 1.98 points)
- `health: 0.5` → auttaja claims this (0.5 × 0.6 = 0.3 points)

**Result**: All categories score 1.5-2.5 points, making it hard to differentiate.

### Issue 3: Penalty Effectiveness

Adding mutual penalties creates circular dependencies:
- innovoija penalizes leadership → loses to johtaja
- johtaja penalizes technology → loses to innovoija
- Both lose points → auttaja or luova wins by default

---

## Attempted Solutions

### Attempt 1: Threshold-Based Scoring (>0.6)
**Result:** Whack-a-mole - fixing one category breaks another

### Attempt 2: Increase Primary Multipliers (4.0×)
**Result:** Categories with secondary high values dominate (johtaja: 60%, rakentaja: 30%)

### Attempt 3: Balanced 3.0× with Mutual Penalties
**Result:** 70% auttaja dominance - penalties too strong

### Attempt 4: Conditional Penalties (if tech < 0.7, penalize leadership)
**Result:** Current state - 70% auttaja dominance

---

## Current Test Results (Phase 9)

```
Total Tests: 10
Correct: 4/10 (40%)
Categories Used: 3/8

Distribution:
  auttaja: 70% (7/10) ❌
  ympariston-puolustaja: 20% (2/10)
  johtaja: 10% (1/10)

Failed Matches:
  ✓ Tech Innovator → innovoija (got auttaja) ❌
  ✓ Caring Nurse → auttaja ✅
  ✓ Construction Engineer → rakentaja (got auttaja) ❌
  ✓ Environmental Activist → ympariston-puolustaja ✅
  ✓ Business Leader → johtaja (got auttaja) ❌
  ✓ Creative Designer → luova (got johtaja) ❌
  ✓ Strategic Visionary → visionaari (got ympariston-puolustaja) ❌
  ✓ Project Coordinator → jarjestaja (got auttaja) ❌
  ✓ Balanced Professional → auttaja ✅
  ✓ Artistic Teacher → luova/auttaja ✅
```

---

## Recommended Solutions

### Option 1: Fix Test Profiles (Quick Fix)
Create test profiles that directly set subdimensions instead of using `createAnswers()`:

```typescript
const sara: PersonalityProfile = {
  name: "Tech Innovator - Sara",
  expectedCategory: "innovoija",
  subdimensions: {
    interests: {
      technology: 0.9,  // VERY HIGH
      innovation: 0.8,
      people: 0.2,      // LOW
      health: 0.1,      // VERY LOW
      creative: 0.5,    // MODERATE
      leadership: 0.3   // LOW
    },
    // ... other dimensions
  }
};
```

**Pros:** Immediate, transparent, easy to debug
**Cons:** Doesn't test the actual quiz answer→subdimension conversion

---

### Option 2: Implement Score Normalization (Recommended)
Add a normalization layer to ensure all categories compete fairly:

```typescript
// After calculating all category scores
const scores = Object.values(categoryScores);
const mean = scores.reduce((a, b) => a + b) / scores.length;
const stdDev = Math.sqrt(
  scores.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / scores.length
);

// Normalize to z-scores (standard deviations from mean)
for (const cat in categoryScores) {
  categoryScores[cat] = (categoryScores[cat] - mean) / (stdDev || 1);
}

// Now all categories have equal competitive strength
// Highest z-score wins
```

**How it works:**
- Categories with `score > mean` get positive z-scores
- Categories with `score < mean` get negative z-scores
- The category furthest above the mean wins

**Example:**
```
Before normalization:
  auttaja: 2.5
  innovoija: 2.3
  luova: 1.8
  others: 0.5-1.0

After normalization (mean=1.5, stdDev=0.7):
  auttaja: +1.43 (2.5 - 1.5) / 0.7
  innovoija: +1.14 (2.3 - 1.5) / 0.7
  luova: +0.43 (1.8 - 1.5) / 0.7
```

**Pros:**
- Eliminates accumulation bias
- All categories compete on equal footing
- Self-adjusting - no manual multiplier tuning needed

**Cons:**
- Makes relative scoring less interpretable
- Requires testing to ensure it doesn't break edge cases

---

### Option 3: Separate Subdimension Calculation (Long-term Fix)
Refactor the subdimension calculation to be more transparent and testable:

1. Create explicit mappings: Answer #X → Subdimension Y with weight Z
2. Make the conversion deterministic and debuggable
3. Add validation to ensure subdimensions match expectations

**Pros:** Fixes root cause
**Cons:** Requires significant refactoring

---

## Next Steps

**Immediate (Recommended):**
1. Implement Option 2 (Score Normalization)
2. Re-test with 10 profiles
3. Verify 80%+ accuracy

**Short-term:**
1. Create manual test profiles (Option 1) for validation
2. Document subdimension→category relationships
3. Add unit tests for each category's scoring logic

**Long-term:**
1. Refactor subdimension calculation (Option 3)
2. Add comprehensive logging to debug scoring decisions
3. Create a scoring algorithm documentation

---

## Implementation: Score Normalization

Add this at line ~1240 (after all categoryScores are calculated, before finding the dominant category):

```typescript
// PHASE 9 FIX: Normalize scores to ensure fair competition
const scores = Object.values(categoryScores);
const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
const stdDev = Math.sqrt(variance);

// Normalize to z-scores (prevent division by zero)
if (stdDev > 0.01) {
  for (const cat in categoryScores) {
    categoryScores[cat] = (categoryScores[cat] - mean) / stdDev;
  }
}

// Now find dominant category with normalized scores
```

---

Last Updated: January 25, 2025
