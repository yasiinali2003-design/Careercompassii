# Critical Fixes Needed Based on Comprehensive Testing

## Test Results: 58.3% Success Rate (7/12 passed)

### ✅ What's Working
- Category detection: Mostly accurate (YLA 80%, NUORI 100%)
- Personal analysis: ✅ Working correctly
- Career reasoning: ✅ Working correctly
- Top strengths: ✅ Working correctly
- Most YLA profiles: ✅ Working correctly
- NUORI cohort: ✅ Perfect (100%)

### ❌ Critical Issues Found

---

## Issue 1: Healthcare vs Environment Confusion (HIGH PRIORITY)

**Affected Tests**: 
- Caring Kristiina (YLA) ❌
- Healthcare Student (TASO2 LUKIO) ❌

**Problem**: 
- Profile has health=1.0 AND environment=1.0 (both maximum)
- Category correctly detected as `auttaja` (76%)
- BUT top careers are environment careers (biologi, ympäristöinsinööri) instead of healthcare

**Root Cause** (Line 6796-6797):
```typescript
const healthcareDominant = (healthScoreYP >= 0.6 && healthScoreYP > combinedNatureScore + 0.1) ||
                           (healthScoreYP >= 0.5 && peopleScoreYP >= 0.5 && combinedNatureScore < 0.7);
```

**Problem**: When health=1.0 and environment=1.0:
- `healthScoreYP > combinedNatureScore + 0.1` → `1.0 > 1.0 + 0.1` → **FALSE**
- Second condition: `healthScoreYP >= 0.5 && peopleScoreYP >= 0.5 && combinedNatureScore < 0.7` → `1.0 >= 0.5 && 1.0 >= 0.5 && 1.0 < 0.7` → **FALSE**

**Fix Needed**:
```typescript
// When health + people are BOTH high, prioritize healthcare over environment
const isHealthcareProfile = healthScoreYP >= 0.5 && peopleScoreYP >= 0.5;
const healthcareDominant = isHealthcareProfile && 
                           (healthScoreYP > combinedNatureScore + 0.05 || // Reduced threshold
                            (healthScoreYP >= 0.6 && combinedNatureScore < 0.8)); // More lenient
```

**Also Need**: Boost healthcare careers when health+people combo exists

---

## Issue 2: Beauty Profile Getting Johtaja Careers (HIGH PRIORITY)

**Affected Test**: 
- Beauty Student (TASO2 LUKIO) ❌

**Problem**:
- Expected: luova careers (parturi-kampaaja, graafinen-suunnittelija)
- Got: johtaja careers (henkilöstöpäällikkö, markkinointipäällikkö)
- Category detected as luova (75%) BUT rankCareers shows johtaja (60%) as dominant

**Root Cause**:
- Profile has creative=5, people=4, health=1 (LOW health - correct)
- BUT also has leadership=1, business=2 which are triggering johtaja
- Beauty signal detection exists but isn't strong enough

**Current Beauty Detection** (Line 6470-6500):
- Detects beauty signal but penalty for johtaja careers isn't strong enough

**Fix Needed**:
1. Strengthen beauty signal detection for creative + people + LOW health pattern
2. Add STRONGER penalty for johtaja careers when beauty signal detected
3. Ensure beauty careers get massive boost when beauty signal detected

---

## Issue 3: Trade Student Getting Luova Careers (HIGH PRIORITY)

**Affected Test**: 
- Trade Student (TASO2 AMIS) ❌

**Problem**:
- Expected: rakentaja careers (sähköasentaja, putkiasentaja, kirvesmies)
- Got: luova careers (kirjailija, äänisuunnittelija)
- Category detected as rakentaja (48%) BUT rankCareers shows luova (54%) as dominant

**Root Cause**:
- Profile has hands_on=5 BUT normalized score is only 0.38
- Also has creative=1, writing=1, arts_culture=1 which are triggering luova
- Hands-on signal isn't strong enough to override creative signals

**Fix Needed**:
1. Strengthen rakentaja detection for high hands_on profiles
2. Add penalty for luova careers when hands_on is very high
3. Ensure AMIS sub-cohort properly emphasizes hands_on careers

---

## Issue 4: Hospitality Student Getting Wrong Category (HIGH PRIORITY)

**Affected Test**: 
- Hospitality Student (TASO2 AMIS) ❌

**Problem**:
- Expected: rakentaja category (restaurant careers)
- Got: auttaja category
- Expected careers: ravintolatyontekija, hotellityontekija
- Got: biologi, ympäristöinsinööri (completely wrong)

**Root Cause**:
- Profile has hands_on=4, creative=4, people=5, health=1 (LOW health)
- Restaurant signal detection exists (line 6710) but isn't working
- Category detection is wrong (auttaja instead of rakentaja)

**Current Restaurant Detection** (Line 6710):
```typescript
const isRestaurantSignal = handsOnScore >= 0.5 && creativeScoreRak >= 0.5 && peopleScoreRak >= 0.5 && !isArtsFocusedRak;
```

**Fix Needed**:
1. Ensure restaurant signal properly boosts restaurant careers
2. Fix category detection for restaurant-focused profiles
3. Ensure ravintolatyontekija appears in top results

---

## Issue 5: Test Profile Generation Issue

**Problem**: 
- The test is generating answers from personality traits, but the mapping might not be perfect
- Some traits might not be mapping to the right questions
- This could cause incorrect scores

**Fix Needed**: 
- Review how test profiles map to actual question answers
- Ensure all key traits are properly represented in answers

---

## Summary of Required Fixes

### Priority 1: Healthcare vs Environment
- **File**: `lib/scoring/scoringEngine.ts`
- **Line**: 6790-6801
- **Fix**: Improve healthcare dominance detection when health+people combo exists

### Priority 2: Beauty Signal Detection
- **File**: `lib/scoring/scoringEngine.ts`
- **Line**: 6470-6500, 6826-6835
- **Fix**: Strengthen beauty detection and johtaja penalty

### Priority 3: Hands-On Career Matching
- **File**: `lib/scoring/scoringEngine.ts`
- **Line**: 6620-6630
- **Fix**: Strengthen rakentaja detection for high hands_on

### Priority 4: Restaurant Career Matching
- **File**: `lib/scoring/scoringEngine.ts`
- **Line**: 6707-6727
- **Fix**: Ensure restaurant signal properly boosts restaurant careers

---

**Status**: ⚠️ **5 CRITICAL ISSUES IDENTIFIED** - Needs immediate fixes
