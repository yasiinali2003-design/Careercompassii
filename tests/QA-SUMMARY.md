# QA Test Suite Summary

## Overview

This comprehensive QA test suite validates the Career Compass scoring system across all 3 cohorts (YLA, TASO2, NUORI) using 45 realistic personas representing diverse user archetypes.

## Test Commands

```bash
# Run all tests (server must be running at localhost:3000)
npm run test:qa

# Run API-only tests (fast)
npm run test:qa:api

# Run full test suite with report generation
npm run test:qa:full

# Run Playwright E2E tests
npm run test:e2e
```

## Test Structure

```
tests/
├── fixtures/
│   ├── personas.js         # 45 realistic test personas
│   └── personas.ts         # TypeScript version for Playwright
├── e2e/
│   └── career-test.spec.ts # Playwright E2E tests
├── unit/
│   ├── scoring-stability.test.ts  # Unit tests for determinism
│   └── property-tests.test.ts     # Property-based tests
├── run-all-tests.js        # Main test runner
└── QA-SUMMARY.md           # This file
```

## Personas (45 total)

### YLA (13-16 year olds) - 15 personas
| ID | Name | Archetype | Expected Category | Warning? |
|----|------|-----------|-------------------|----------|
| yla-tech-enthusiast | Matti (14v) | confident | innovoija | No |
| yla-animal-lover | Sara (15v) | confident | auttaja | No |
| yla-artist | Ella (13v) | confident | luova | No |
| yla-mechanic | Juha (16v) | confident | rakentaja | No |
| yla-class-president | Liisa (15v) | confident | johtaja | No |
| yla-organized-student | Anna (14v) | consistent | jarjestaja | No |
| yla-eco-warrior | Mikko (15v) | consistent | ympariston-puolustaja | No |
| yla-world-traveler | Veera (16v) | consistent | visionaari | No |
| yla-confused-interests | Jenna (14v) | contradictory | (any) | Yes |
| yla-mood-swings | Antti (15v) | contradictory | (any) | Yes |
| yla-speedrunner | Pekka (13v) | random | (any) | Yes |
| yla-all-fives | Tiina (14v) | extreme | (any) | Yes |
| yla-all-ones | Ville (15v) | extreme | (any) | Yes |
| yla-mostly-neutral | Noora (16v) | confused | (any) | Yes |
| yla-dual-interest | Lauri (14v) | contradictory | (any) | No |

### TASO2 (16-19 year olds) - 15 personas
Similar distribution with vocational focus.

### NUORI (18-25 year olds) - 15 personas
Similar distribution with career development focus.

## Test Categories

### 1. API Scoring Tests
- **Valid personas**: Tests that expected categories are returned
- **Problematic personas**: Tests that edge cases are handled gracefully
- **Determinism**: Same input produces same output
- **Stability**: Small changes don't cause extreme result flips

### 2. E2E Tests (Playwright)
- Full user flow from test entry to results
- Cohort selection
- Question answering
- Results page rendering
- Career recommendation visibility

### 3. Property-Based Tests
- Determinism: `f(x) = f(x)` for all valid inputs
- Bounded output: Category is always one of 8 valid values
- Robustness: System handles 100 random inputs without crashing
- Local stability: Small perturbations produce bounded changes
- Coverage: All 8 categories are reachable

## Known Findings

### Verified Working
- [x] Scoring is deterministic
- [x] All 8 categories are reachable
- [x] Extreme patterns (all 1s, all 5s) produce valid results
- [x] Edge cases don't crash the system
- [x] API responds within 2 seconds

### Potential Issues

| Severity | Finding | Impact | Mitigation |
|----------|---------|--------|------------|
| LOW | Random clickers get valid results | Users clicking randomly receive career recommendations | Response quality warning shown for extreme patterns |
| LOW | All-neutral (3s) produces recommendations | Indecisive users get generic recommendations | Confidence indicator shows "low" |
| MEDIUM | Oscillating patterns may not trigger warnings | Contradictory responses might get high-confidence results | Enhanced response validation recommended |
| LOW | Dual-interest users may see unexpected categories | Users with equal interests in multiple areas may not get intuitive results | Show multiple strong matches |

## Calibration Notes

The test personas are designed based on the question-to-subdimension mappings in `lib/scoring/dimensions.ts`. If the scoring system changes, the persona answers may need recalibration.

To recalibrate:
1. Review the current question mappings
2. Update persona answers to match expected behaviors
3. Run tests and verify improvements

## Running Tests

1. Start the development server:
   ```bash
   npm run dev
   ```

2. In another terminal, run tests:
   ```bash
   npm run test:qa
   ```

3. For E2E tests with browser:
   ```bash
   npm run test:e2e:ui
   ```

## CI Integration

Add to your CI pipeline:
```yaml
- name: Run QA Tests
  run: |
    npm run dev &
    sleep 10
    npm run test:qa
```
