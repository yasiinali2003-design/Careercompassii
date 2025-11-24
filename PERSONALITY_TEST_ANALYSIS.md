# Personality Variation Test Analysis

## Test Summary
- **Total Tests**: 21
- **Passed**: 0
- **Failed**: 21
- **Success Rate**: 0.0%

## Key Findings

### 1. Social Dimension Not Captured
**Issue**: Social scores are showing as `0.000` even when high social interaction is expected.

**Examples**:
- Extrovert tests expect `social: high` but get `0.000`
- Balanced tests expect `social: medium` but get `0.000`

**Root Cause**: The `social` dimension is mapped to `context.social` or `workstyle.social`, but the test answer builders may not be targeting the correct questions for each cohort.

**Questions to Check**:
- YLA: Q28 maps to `workstyle.social`
- TASO2: Need to verify which question maps to social
- NUORI: Need to verify which question maps to social

### 2. Category Mismatches

#### Introvert Tests
- **Expected**: `jarjestaja` (YLA) or `innovoija` (TASO2/NUORI)
- **Got**: `visionaari`
- **Reason**: Introvert answers may be triggering `career_clarity` or `planning` signals that push toward `visionaari` category

#### Creative Artist Tests
- **Expected**: `luova`
- **Got**: `auttaja` (TASO2) or `visionaari` (NUORI)
- **Reason**: Creative answers may be triggering `people` or `career_clarity` signals

#### Hands-On Maker Tests
- **Expected**: `rakentaja`
- **Got**: `visionaari` (YLA) or `johtaja` (TASO2)
- **Reason**: Hands-on answers may be triggering other signals

#### Leader Tests
- **Expected**: `johtaja`
- **Got**: `auttaja`
- **Reason**: Leadership answers combined with high people scores push toward `auttaja` category

#### Balanced Tests
- **Expected**: `jarjestaja`
- **Got**: `auttaja`
- **Reason**: Medium scores across all dimensions default to `auttaja` instead of `jarjestaja`

### 3. Personality Trait Mismatches

Even when categories match, personality traits don't always align:

**Examples**:
- **Analytical Thinker - TASO2**: Category matches (`innovoija`) but:
  - Expected `analytical: high`, got `0.372` (too low)
  - Expected `creative: low`, got `0.605` (too high)
  
- **Extrovert - YLA**: Category matches (`auttaja`) but:
  - Expected `social: high`, got `0.000` (not captured)
  - Expected `people: high`, got `0.000` (not captured)

## Recommendations

### 1. Fix Social Dimension Mapping
- Verify which questions map to `social` dimension for each cohort
- Update test answer builders to correctly target social questions
- Ensure `context.social` or `workstyle.social` is being calculated correctly

### 2. Refine Category Detection
- Review `determineDominantCategory` logic to better differentiate:
  - `visionaari` vs `jarjestaja` vs `innovoija` (for introverts/analytical)
  - `luova` vs `auttaja` vs `visionaari` (for creatives)
  - `rakentaja` vs `visionaari` vs `johtaja` (for hands-on)
  - `johtaja` vs `auttaja` (for leaders)
  - Default category for balanced personalities

### 3. Improve Test Answer Builders
- Verify question indices for each cohort match `dimensions.ts` mappings
- Ensure answers correctly represent personality types:
  - Introvert: Low social/people, high analytical/tech
  - Extrovert: High social/people, low analytical/tech
  - Creative: High creative, low analytical/tech
  - Hands-on: High hands-on, low analytical/creative
  - Leader: High leadership/people, medium analytical/creative

### 4. Adjust Scoring Weights
- Consider adjusting category weights to better differentiate similar categories
- Add penalties for conflicting traits (e.g., penalize `visionaari` for high `hands_on`)

## Next Steps

1. **Fix social dimension mapping** - Highest priority
2. **Review and fix test answer builders** - Ensure correct question indices
3. **Refine category detection logic** - Better differentiation between categories
4. **Re-run tests** - Verify improvements
5. **Iterate** - Continue refining until all tests pass

## Test Results by Category

### ✅ Category Matches (but trait mismatches)
- Extrovert - YLA: `auttaja` ✓
- Extrovert - TASO2: `auttaja` ✓
- Extrovert - NUORI: `auttaja` ✓
- Analytical Thinker - YLA: `jarjestaja` ✓
- Analytical Thinker - TASO2: `innovoija` ✓
- Creative Artist - YLA: `luova` ✓

### ❌ Category Mismatches
- Introvert (all cohorts): Expected `jarjestaja`/`innovoija`, got `visionaari`
- Creative Artist - TASO2: Expected `luova`, got `auttaja`
- Creative Artist - NUORI: Expected `luova`, got `visionaari`
- Hands-On Maker (all cohorts): Expected `rakentaja`, got `visionaari`/`johtaja`
- Leader (all cohorts): Expected `johtaja`, got `auttaja`
- Balanced (all cohorts): Expected `jarjestaja`, got `auttaja`

## Detailed Test Results

See `test-personality-variations.ts` output for full details of each test case.


