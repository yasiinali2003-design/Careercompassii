# Claude Coder Quick Reference

## Important Files Structure

### Core Scoring Logic
- `lib/scoring/scoringEngine.ts` - **VERY LARGE (8,661 lines)** - Main scoring algorithm
  - Contains: `generateUserProfile()`, `rankCareers()`, `computeUserVector()`
  - **Note**: This file is excluded from Claude Coder analysis due to size

- `lib/scoring/categoryAffinities.ts` - Category affinity calculations
- `lib/scoring/dimensions.ts` - Question mappings to dimensions
- `lib/scoring/types.ts` - TypeScript type definitions

### Test Files
- `test-comprehensive-real-life-verification.ts` - Comprehensive test suite
  - Current pass rate: 66.7% (8/12 tests)
  - Tests 4 profiles: Healthcare, Beauty, Trade, Hospitality students

## Recent Changes (Latest Git Commits)

1. **Fixed TypeScript errors**: Added type assertions for `interests.leadership` property
2. **Enhanced test profile generation**: Added special handling for multi-mapping questions (Q1-Q14)
3. **Improved scoring logic**: Added penalties for healthcare profiles getting trades careers
4. **Fixed healthcare detection**: Better differentiation between healthcare and environment profiles

## Current Issues

### Remaining Test Failures (4 tests):
1. **Healthcare Student (TASO2 LUKIO)**: Getting trades careers instead of healthcare
   - Issue: Normalized scores show `people:0` even though Q1=5, Q6=5, Q14=5
   - Root cause: Other questions mapping to `people` are answered LOW, averaging down the score

2. **Beauty Student (TASO2 LUKIO)**: Getting environment careers instead of beauty
   - Issue: Normalized scores show `creative:0`, `social:0` even though Q5=5
   - Root cause: Similar to healthcare - other questions averaging down scores

3. **Trade Student (TASO2 AMIS)**: Getting creative careers instead of trades
   - Issue: `hands_on` score too low (0.26), `creative` score too high (1.0)
   - Root cause: Q2, Q3 not creating strong enough `hands_on` signals

4. **Hospitality Student (TASO2 AMIS)**: Getting construction instead of restaurant
   - Issue: Restaurant signal not detected properly
   - Root cause: Q4 (restaurant) not creating strong enough signal

## Key Functions to Modify

### In `test-comprehensive-real-life-verification.ts`:
- `generateAnswersFromTraits()` - Generates test answers from personality traits
  - Currently handles Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q9, Q12, Q13, Q14 specially
  - Need to ensure ALL questions mapping to critical dimensions are answered correctly

### In `lib/scoring/scoringEngine.ts`:
- `rankCareers()` - Ranks careers based on user profile
- `computeUserVector()` - Converts answers to normalized dimension scores
- Category-specific bonuses/penalties around lines 6600-6700

## How to Work with Large Files

Since `scoringEngine.ts` is too large for Claude Coder:
1. Read specific sections using line numbers
2. Use grep to find specific patterns
3. Modify targeted sections only
4. Test changes incrementally

## Next Steps to Reach 100% Pass Rate

1. Fix normalized score calculation - ensure Q1/Q6/Q14 create proper `people` signals
2. Fix beauty profile detection - ensure Q5 creates proper `creative` and `social` signals  
3. Fix trade profile detection - ensure Q2/Q3 create proper `hands_on` signals
4. Fix hospitality profile detection - ensure Q4 creates proper restaurant signal
