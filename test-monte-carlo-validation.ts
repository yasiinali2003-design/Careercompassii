/**
 * Monte Carlo Validation for Urakompassi Scoring Algorithm
 *
 * This test generates thousands of random profiles to:
 * 1. Ensure no "dead zones" where no career matches
 * 2. Check category distribution is reasonable
 * 3. Verify education paths don't flip unexpectedly at boundaries
 * 4. Detect any crashes or undefined behavior
 * 5. Test consistency (same input = same output)
 */

import { calculateCategoryAffinities, calculateProfileConfidence, detectHybridPaths } from './lib/scoring/categoryAffinities';
import { calculateEducationPath } from './lib/scoring/educationPath';
import type { Cohort, DetailedDimensionScores, TestAnswer } from './lib/scoring/types';

// ========== CONFIGURATION ==========
const NUM_RANDOM_PROFILES = 1000;
const NUM_BOUNDARY_TESTS = 200;
const COHORTS: Cohort[] = ['YLA', 'TASO2', 'NUORI'];
const SUB_COHORTS = ['LUKIO', 'AMIS'];

// All subdimensions used in the system (COMPLETE LIST)
const SUBDIMENSIONS = [
  // Interests (14)
  'technology', 'people', 'creative', 'analytical', 'hands_on', 'business',
  'environment', 'health', 'education', 'innovation', 'arts_culture', 'sports',
  'nature', 'writing',
  // Values (11)
  'growth', 'impact', 'global', 'career_clarity', 'financial', 'entrepreneurship',
  'social_impact', 'stability', 'advancement', 'work_life_balance', 'company_size',
  // Workstyle (15)
  'teamwork', 'independence', 'leadership', 'organization', 'planning',
  'problem_solving', 'precision', 'performance', 'teaching', 'motivation',
  'autonomy', 'social', 'structure', 'flexibility', 'variety',
  // Context (3)
  'outdoor', 'international', 'work_environment'
];

// ========== HELPER FUNCTIONS (from test-20-real-profiles.ts) ==========

function createDetailedScores(profile: Record<string, number>): DetailedDimensionScores {
  return {
    interests: {
      technology: profile.technology || 0.5,
      people: profile.people || 0.5,
      creative: profile.creative || 0.5,
      analytical: profile.analytical || 0.5,
      hands_on: profile.hands_on || 0.5,
      business: profile.business || 0.5,
      environment: profile.environment || 0.5,
      health: profile.health || 0.5,
      education: profile.education || 0.5,
      innovation: profile.innovation || 0.5,
      arts_culture: profile.arts_culture || 0.5,
      sports: profile.sports || 0.5,
      nature: profile.nature || 0.5,
      writing: profile.writing || 0.5
    },
    values: {
      growth: profile.growth || 0.5,
      impact: profile.impact || 0.5,
      global: profile.global || 0.5,
      career_clarity: profile.career_clarity || 0.5,
      financial: profile.financial || 0.5,
      entrepreneurship: profile.entrepreneurship || 0.5,
      social_impact: profile.social_impact || 0.5,
      stability: profile.stability || 0.5,
      advancement: profile.advancement || 0.5,
      work_life_balance: profile.work_life_balance || 0.5,
      company_size: profile.company_size || 0.5
    },
    workstyle: {
      teamwork: profile.teamwork || 0.5,
      independence: profile.independence || 0.5,
      leadership: profile.leadership || 0.5,
      organization: profile.organization || 0.5,
      planning: profile.planning || 0.5,
      problem_solving: profile.problem_solving || 0.5,
      precision: profile.precision || 0.5,
      performance: profile.performance || 0.5,
      teaching: profile.teaching || 0.5,
      motivation: profile.motivation || 0.5,
      autonomy: profile.autonomy || 0.5,
      social: profile.social || 0.5,
      structure: profile.structure || 0.5,
      flexibility: profile.flexibility || 0.5,
      variety: profile.variety || 0.5
    },
    context: {
      outdoor: profile.outdoor || 0.5,
      international: profile.international || 0.5,
      work_environment: profile.work_environment || 0.5
    }
  };
}

// Convert 1-5 scores to 0-1 normalized scores
function normalizeProfile(profile: Record<string, number>): Record<string, number> {
  const normalized: Record<string, number> = {};
  for (const [key, value] of Object.entries(profile)) {
    normalized[key] = (value - 1) / 4; // 1→0, 3→0.5, 5→1
  }
  return normalized;
}

// Create test answers from profile scores
function createAnswers(
  cohort: Cohort,
  profile: Record<string, number>,
  _subCohort?: string
): TestAnswer[] {
  const answers: TestAnswer[] = [];
  const questionCount = cohort === 'YLA' ? 15 : 30;

  // Map questions to subdimensions based on cohort
  const ylaMapping: Record<number, string[]> = {
    0: ['technology', 'problem_solving'],
    1: ['creative', 'arts_culture'],
    2: ['people', 'social'],
    3: ['hands_on', 'outdoor'],
    4: ['health', 'people'],
    5: ['analytical', 'problem_solving'],
    6: ['nature', 'environment'],
    7: ['leadership', 'entrepreneurship'],
    8: ['sports', 'hands_on'],
    9: ['teaching', 'growth'],
    10: ['writing', 'creative'],
    11: ['stability', 'planning'],
    12: ['innovation', 'technology'],
    13: ['social_impact', 'people'],
    14: ['business', 'leadership']
  };

  const taso2Mapping: Record<number, string[]> = {
    0: ['technology', 'innovation'],
    1: ['health', 'people'],
    2: ['creative', 'arts_culture'],
    3: ['business', 'leadership'],
    4: ['environment', 'nature'],
    5: ['teaching', 'growth'],
    6: ['hands_on', 'outdoor'],
    7: ['analytical', 'problem_solving'],
    8: ['writing', 'creative'],
    9: ['sports', 'health'],
    10: ['social_impact', 'people'],
    11: ['entrepreneurship', 'business'],
    12: ['stability', 'planning'],
    13: ['innovation', 'technology'],
    14: ['people', 'teamwork'],
    15: ['leadership', 'organization'],
    16: ['independence', 'autonomy'],
    17: ['advancement', 'growth'],
    18: ['global', 'international'],
    19: ['precision', 'analytical'],
    20: ['flexibility', 'variety'],
    21: ['structure', 'organization'],
    22: ['performance', 'motivation'],
    23: ['financial', 'business'],
    24: ['work_life_balance', 'stability'],
    25: ['company_size', 'teamwork'],
    26: ['impact', 'social_impact'],
    27: ['career_clarity', 'planning'],
    28: ['motivation', 'growth'],
    29: ['variety', 'flexibility']
  };

  const nuoriMapping = taso2Mapping;

  const mapping = cohort === 'YLA' ? ylaMapping : (cohort === 'TASO2' ? taso2Mapping : nuoriMapping);

  for (let i = 0; i < questionCount; i++) {
    const dims = mapping[i] || ['analytical'];
    const avgScore = dims.reduce((sum, dim) => sum + (profile[dim] || 3), 0) / dims.length;
    const score = Math.round(avgScore);

    answers.push({
      questionIndex: i,
      score: Math.max(1, Math.min(5, score))
    });
  }

  return answers;
}

// Helper to calculate numeric confidence score from ProfileConfidence
function getConfidenceScore(confidence: { overall: 'high' | 'medium' | 'low'; strongSignals: number; answerVariance: number }): number {
  const baseScore = confidence.overall === 'high' ? 80 : confidence.overall === 'medium' ? 50 : 30;
  const signalBonus = Math.min(20, confidence.strongSignals * 2);
  const varianceBonus = confidence.answerVariance * 10;
  return Math.min(100, baseScore + signalBonus + varianceBonus);
}

// ========== UTILITY FUNCTIONS ==========

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomProfile(): Record<string, number> {
  const profile: Record<string, number> = {};

  // Random number of subdimensions to include (8-18)
  const numDimensions = randomInt(8, 18);
  const shuffled = [...SUBDIMENSIONS].sort(() => Math.random() - 0.5);

  for (let i = 0; i < numDimensions; i++) {
    profile[shuffled[i]] = randomInt(1, 5); // 1-5 scale
  }

  return profile;
}

function generateBiasedProfile(bias: 'high' | 'low' | 'mixed' | 'flat'): Record<string, number> {
  const profile: Record<string, number> = {};

  for (const dim of SUBDIMENSIONS) {
    if (Math.random() > 0.2) { // 80% chance to include each dimension
      switch (bias) {
        case 'high':
          profile[dim] = randomInt(4, 5);
          break;
        case 'low':
          profile[dim] = randomInt(1, 2);
          break;
        case 'mixed':
          profile[dim] = Math.random() > 0.5 ? 5 : 1;
          break;
        case 'flat':
          profile[dim] = 3;
          break;
      }
    }
  }

  return profile;
}

function generateBoundaryProfile(dimension: string, value: number): Record<string, number> {
  const profile: Record<string, number> = {};

  // Add some baseline dimensions at middle score
  profile.technology = 3;
  profile.analytical = 3;
  profile.health = 3;
  profile.people = 3;
  profile.hands_on = 3;
  profile.creative = 3;

  // Set the specific dimension to the boundary value (convert 0-1 to 1-5 scale)
  profile[dimension] = Math.round(1 + value * 4);

  return profile;
}

// ========== TEST RUNNERS ==========

interface TestResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    categoryDistribution: Record<string, number>;
    pathDistribution: Record<string, number>;
    avgConfidence: number;
    minConfidence: number;
    maxConfidence: number;
    hybridPathRate: number;
    crashCount: number;
    undefinedCount: number;
  };
}

function runRandomProfileTests(): TestResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const categoryCount: Record<string, number> = {};
  const pathCount: Record<string, number> = {};
  let totalConfidence = 0;
  let minConfidence = 100;
  let maxConfidence = 0;
  let hybridCount = 0;
  let crashCount = 0;
  let undefinedCount = 0;

  console.log(`\nRunning ${NUM_RANDOM_PROFILES} random profile tests...`);

  for (let i = 0; i < NUM_RANDOM_PROFILES; i++) {
    const cohort = COHORTS[randomInt(0, COHORTS.length - 1)];
    const subCohort = cohort === 'TASO2' ? SUB_COHORTS[randomInt(0, 1)] : undefined;
    const rawProfile = generateRandomProfile();
    const normalizedProfile = normalizeProfile(rawProfile);
    const detailedScores = createDetailedScores(normalizedProfile);
    const answers = createAnswers(cohort, rawProfile, subCohort);

    try {
      // Test confidence calculation
      const confidence = calculateProfileConfidence(answers);
      const confidenceScore = getConfidenceScore(confidence);
      totalConfidence += confidenceScore;
      minConfidence = Math.min(minConfidence, confidenceScore);
      maxConfidence = Math.max(maxConfidence, confidenceScore);

      // Test category calculation
      const categories = calculateCategoryAffinities(detailedScores, confidence);

      if (!categories || categories.length === 0) {
        errors.push(`Profile ${i}: No categories returned`);
        undefinedCount++;
        continue;
      }

      const topCategory = categories[0].category;
      const topScore = categories[0].score;

      categoryCount[topCategory] = (categoryCount[topCategory] || 0) + 1;

      // Test hybrid path detection
      const hybrids = detectHybridPaths(detailedScores, categories);
      if (hybrids && hybrids.length > 0) {
        hybridCount++;
      }

      // Test education path (only for YLA and TASO2)
      if (cohort !== 'NUORI') {
        const eduPath = calculateEducationPath(answers, cohort, subCohort);

        if (!eduPath || !eduPath.primary) {
          errors.push(`Profile ${i}: No education path returned`);
          undefinedCount++;
        } else {
          pathCount[eduPath.primary] = (pathCount[eduPath.primary] || 0) + 1;
        }
      }

      // Sanity checks
      if (topScore < 0 || topScore > 100) {
        errors.push(`Profile ${i}: Invalid category score ${topScore}`);
      }

    } catch (e) {
      crashCount++;
      errors.push(`Profile ${i}: CRASH - ${(e as Error).message}`);
    }
  }

  // Check for reasonable distribution
  const totalProfiles = NUM_RANDOM_PROFILES;
  const expectedPerCategory = totalProfiles / 8; // 8 categories

  for (const [category, count] of Object.entries(categoryCount)) {
    const ratio = count / expectedPerCategory;
    if (ratio < 0.1) {
      warnings.push(`Category "${category}" is underrepresented (${count} profiles, ${(count/totalProfiles*100).toFixed(1)}%)`);
    }
    if (ratio > 3) {
      warnings.push(`Category "${category}" is overrepresented (${count} profiles, ${(count/totalProfiles*100).toFixed(1)}%)`);
    }
  }

  // Check for missing categories
  const expectedCategories = ['auttaja', 'innovoija', 'luova', 'rakentaja', 'johtaja', 'ympariston-puolustaja', 'visionaari', 'jarjestaja'];
  for (const cat of expectedCategories) {
    if (!categoryCount[cat]) {
      warnings.push(`Category "${cat}" never appeared in random tests`);
    }
  }

  return {
    passed: errors.length === 0 && crashCount === 0,
    errors,
    warnings,
    stats: {
      categoryDistribution: categoryCount,
      pathDistribution: pathCount,
      avgConfidence: totalConfidence / NUM_RANDOM_PROFILES,
      minConfidence,
      maxConfidence,
      hybridPathRate: hybridCount / NUM_RANDOM_PROFILES,
      crashCount,
      undefinedCount
    }
  };
}

function runBoundaryTests(): TestResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let crashCount = 0;

  console.log(`\nRunning ${NUM_BOUNDARY_TESTS} boundary tests...`);

  // Test decision boundaries
  const criticalDimensions = ['hands_on', 'analytical', 'health', 'technology', 'nature'];
  const boundaryValues = [0.59, 0.60, 0.61, 0.69, 0.70, 0.71, 0.79, 0.80, 0.81];

  for (const dim of criticalDimensions) {
    for (const value of boundaryValues) {
      try {
        const rawProfile = generateBoundaryProfile(dim, value);
        const normalizedProfile = normalizeProfile(rawProfile);
        const detailedScores = createDetailedScores(normalizedProfile);
        const answers = createAnswers('YLA', rawProfile);

        // Test YLA path
        const eduPath = calculateEducationPath(answers, 'YLA');
        const confidence = calculateProfileConfidence(answers);
        const categories = calculateCategoryAffinities(detailedScores, confidence);

        if (!eduPath || !eduPath.primary) {
          errors.push(`Boundary test ${dim}=${value}: No education path returned`);
        }
        if (!categories || categories.length === 0) {
          errors.push(`Boundary test ${dim}=${value}: No categories returned`);
        }

      } catch (e) {
        crashCount++;
        errors.push(`Boundary test ${dim}=${value}: CRASH - ${(e as Error).message}`);
      }
    }
  }

  // Test extreme values
  const extremeTests = [
    { name: 'All 1s (lowest)', profile: Object.fromEntries(SUBDIMENSIONS.map(d => [d, 1])) },
    { name: 'All 5s (highest)', profile: Object.fromEntries(SUBDIMENSIONS.map(d => [d, 5])) },
    { name: 'All 3s (middle)', profile: Object.fromEntries(SUBDIMENSIONS.map(d => [d, 3])) },
    { name: 'Minimal profile', profile: { technology: 3 } },
    { name: 'Single high dimension', profile: { technology: 5 } },
    { name: 'Opposing extremes', profile: { technology: 5, health: 1, analytical: 5, hands_on: 1 } },
  ];

  for (const test of extremeTests) {
    for (const cohort of COHORTS) {
      try {
        const normalizedProfile = normalizeProfile(test.profile);
        const detailedScores = createDetailedScores(normalizedProfile);
        const answers = createAnswers(cohort, test.profile);
        const confidence = calculateProfileConfidence(answers);
        const categories = calculateCategoryAffinities(detailedScores, confidence);

        if (!categories || categories.length === 0) {
          errors.push(`Extreme test "${test.name}" (${cohort}): No categories returned`);
        }

        if (cohort !== 'NUORI') {
          const eduPath = calculateEducationPath(answers, cohort);
          if (!eduPath || !eduPath.primary) {
            errors.push(`Extreme test "${test.name}" (${cohort}): No education path returned`);
          }
        }
      } catch (e) {
        crashCount++;
        errors.push(`Extreme test "${test.name}" (${cohort}): CRASH - ${(e as Error).message}`);
      }
    }
  }

  return {
    passed: errors.length === 0 && crashCount === 0,
    errors,
    warnings,
    stats: {
      categoryDistribution: {},
      pathDistribution: {},
      avgConfidence: 0,
      minConfidence: 0,
      maxConfidence: 0,
      hybridPathRate: 0,
      crashCount,
      undefinedCount: 0
    }
  };
}

function runConsistencyTests(): TestResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let crashCount = 0;

  console.log(`\nRunning consistency tests (100 profiles x 5 runs each)...`);

  // Generate 100 profiles and run each 5 times
  for (let i = 0; i < 100; i++) {
    const rawProfile = generateRandomProfile();
    const cohort = COHORTS[randomInt(0, COHORTS.length - 1)];
    const subCohort = cohort === 'TASO2' ? SUB_COHORTS[randomInt(0, 1)] : undefined;

    const results: { categories: string[], path: string, confidence: number }[] = [];

    for (let j = 0; j < 5; j++) {
      try {
        const normalizedProfile = normalizeProfile(rawProfile);
        const detailedScores = createDetailedScores(normalizedProfile);
        const answers = createAnswers(cohort, rawProfile, subCohort);

        const confidence = calculateProfileConfidence(answers);
        const categories = calculateCategoryAffinities(detailedScores, confidence);
        const eduPath = cohort !== 'NUORI'
          ? calculateEducationPath(answers, cohort, subCohort)
          : { primary: 'N/A' };

        results.push({
          categories: categories.slice(0, 3).map(c => c.category),
          path: eduPath?.primary || 'N/A',
          confidence: getConfidenceScore(confidence)
        });
      } catch (e) {
        crashCount++;
        errors.push(`Consistency test ${i}.${j}: CRASH - ${(e as Error).message}`);
      }
    }

    // Check all results are identical
    if (results.length > 1) {
      const first = JSON.stringify(results[0]);
      for (let j = 1; j < results.length; j++) {
        if (JSON.stringify(results[j]) !== first) {
          errors.push(`Consistency test ${i}: Results differ between runs`);
          break;
        }
      }
    }
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
    stats: {
      categoryDistribution: {},
      pathDistribution: {},
      avgConfidence: 0,
      minConfidence: 0,
      maxConfidence: 0,
      hybridPathRate: 0,
      crashCount,
      undefinedCount: 0
    }
  };
}

function runBiasTests(): TestResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const biasTypes: ('high' | 'low' | 'mixed' | 'flat')[] = ['high', 'low', 'mixed', 'flat'];

  console.log(`\nRunning bias pattern tests...`);

  for (const bias of biasTypes) {
    const categoryCount: Record<string, number> = {};
    const pathCount: Record<string, number> = {};
    let totalConfidence = 0;

    for (let i = 0; i < 100; i++) {
      const rawProfile = generateBiasedProfile(bias);
      const cohort: Cohort = 'YLA';

      try {
        const normalizedProfile = normalizeProfile(rawProfile);
        const detailedScores = createDetailedScores(normalizedProfile);
        const answers = createAnswers(cohort, rawProfile);

        const confidence = calculateProfileConfidence(answers);
        const categories = calculateCategoryAffinities(detailedScores, confidence);
        const eduPath = calculateEducationPath(answers, cohort);

        if (categories[0]) {
          categoryCount[categories[0].category] = (categoryCount[categories[0].category] || 0) + 1;
        }
        if (eduPath) {
          pathCount[eduPath.primary] = (pathCount[eduPath.primary] || 0) + 1;
        }
        totalConfidence += getConfidenceScore(confidence);
      } catch (e) {
        errors.push(`Bias test (${bias}): CRASH - ${(e as Error).message}`);
      }
    }

    // Check expected patterns
    const avgConfidence = totalConfidence / 100;

    if (bias === 'flat' && avgConfidence > 70) {
      warnings.push(`Flat profiles have unexpectedly high confidence (${avgConfidence.toFixed(1)}%)`);
    }
    if (bias === 'high' && avgConfidence < 30) {
      warnings.push(`High-scoring profiles have unexpectedly low confidence (${avgConfidence.toFixed(1)}%)`);
    }

    const topCategories = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k, v]) => `${k}:${v}`)
      .join(', ');

    console.log(`  ${bias.toUpperCase().padEnd(6)} bias: avg confidence ${avgConfidence.toFixed(1)}%, top categories: ${topCategories}`);
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
    stats: {
      categoryDistribution: {},
      pathDistribution: {},
      avgConfidence: 0,
      minConfidence: 0,
      maxConfidence: 0,
      hybridPathRate: 0,
      crashCount: 0,
      undefinedCount: 0
    }
  };
}

// ========== MAIN ==========

console.log('╔════════════════════════════════════════════════════════════════════════╗');
console.log('║     MONTE CARLO VALIDATION - URAKOMPASSI SCORING ALGORITHM            ║');
console.log('╚════════════════════════════════════════════════════════════════════════╝');

const startTime = Date.now();

// Run all test suites
const randomResult = runRandomProfileTests();
const boundaryResult = runBoundaryTests();
const consistencyResult = runConsistencyTests();
const biasResult = runBiasTests();

const endTime = Date.now();

// ========== SUMMARY ==========

console.log('\n╔════════════════════════════════════════════════════════════════════════╗');
console.log('║                           RESULTS SUMMARY                              ║');
console.log('╚════════════════════════════════════════════════════════════════════════╝');

console.log('\n📊 RANDOM PROFILE TESTS:');
console.log(`   Status: ${randomResult.passed ? '✓ PASSED' : '✗ FAILED'}`);
console.log(`   Crashes: ${randomResult.stats.crashCount}`);
console.log(`   Undefined results: ${randomResult.stats.undefinedCount}`);
console.log(`   Confidence range: ${randomResult.stats.minConfidence.toFixed(1)}% - ${randomResult.stats.maxConfidence.toFixed(1)}%`);
console.log(`   Average confidence: ${randomResult.stats.avgConfidence.toFixed(1)}%`);
console.log(`   Hybrid path rate: ${(randomResult.stats.hybridPathRate * 100).toFixed(1)}%`);
console.log('\n   Category distribution:');
for (const [cat, count] of Object.entries(randomResult.stats.categoryDistribution).sort((a, b) => b[1] - a[1])) {
  const pct = (count / NUM_RANDOM_PROFILES * 100).toFixed(1);
  const bar = '█'.repeat(Math.round(count / NUM_RANDOM_PROFILES * 40));
  console.log(`     ${cat.padEnd(22)} ${count.toString().padStart(4)} (${pct.padStart(5)}%) ${bar}`);
}
console.log('\n   Education path distribution:');
for (const [path, count] of Object.entries(randomResult.stats.pathDistribution).sort((a, b) => b[1] - a[1])) {
  const pct = (count / NUM_RANDOM_PROFILES * 100).toFixed(1);
  console.log(`     ${path.padEnd(15)} ${count.toString().padStart(4)} (${pct.padStart(5)}%)`);
}

if (randomResult.warnings.length > 0) {
  console.log('\n   ⚠️  Warnings:');
  randomResult.warnings.forEach(w => console.log(`     - ${w}`));
}
if (randomResult.errors.length > 0) {
  console.log('\n   ❌ Errors (first 10):');
  randomResult.errors.slice(0, 10).forEach(e => console.log(`     - ${e}`));
}

console.log('\n📊 BOUNDARY TESTS:');
console.log(`   Status: ${boundaryResult.passed ? '✓ PASSED' : '✗ FAILED'}`);
console.log(`   Crashes: ${boundaryResult.stats.crashCount}`);
if (boundaryResult.errors.length > 0) {
  console.log('\n   ❌ Errors (first 10):');
  boundaryResult.errors.slice(0, 10).forEach(e => console.log(`     - ${e}`));
}

console.log('\n📊 CONSISTENCY TESTS:');
console.log(`   Status: ${consistencyResult.passed ? '✓ PASSED' : '✗ FAILED'}`);
if (consistencyResult.errors.length > 0) {
  console.log('\n   ❌ Errors:');
  consistencyResult.errors.slice(0, 5).forEach(e => console.log(`     - ${e}`));
}

console.log('\n📊 BIAS PATTERN TESTS:');
console.log(`   Status: ${biasResult.passed ? '✓ PASSED' : '✗ FAILED'}`);
if (biasResult.warnings.length > 0) {
  console.log('\n   ⚠️  Warnings:');
  biasResult.warnings.forEach(w => console.log(`     - ${w}`));
}

// Final verdict
const allPassed = randomResult.passed && boundaryResult.passed && consistencyResult.passed && biasResult.passed;
const totalErrors = randomResult.errors.length + boundaryResult.errors.length + consistencyResult.errors.length + biasResult.errors.length;
const totalWarnings = randomResult.warnings.length + boundaryResult.warnings.length + consistencyResult.warnings.length + biasResult.warnings.length;

console.log('\n════════════════════════════════════════════════════════════════════════');
console.log(`⏱️  Total time: ${((endTime - startTime) / 1000).toFixed(2)}s`);
console.log(`📈 Total profiles tested: ${NUM_RANDOM_PROFILES + NUM_BOUNDARY_TESTS + 900}`);
console.log(`❌ Total errors: ${totalErrors}`);
console.log(`⚠️  Total warnings: ${totalWarnings}`);
console.log('════════════════════════════════════════════════════════════════════════');

if (allPassed) {
  console.log('\n✅ ALL MONTE CARLO TESTS PASSED - Algorithm is robust!\n');
} else {
  console.log('\n❌ SOME TESTS FAILED - Review errors above\n');
}
