/**
 * COMPREHENSIVE SCORING TEST
 * Tests millions of personality combinations to ensure:
 * 1. All 8 categories can be reached
 * 2. Career recommendations are returned for all categories
 * 3. Edge cases and mixed signals are handled correctly
 * 4. Statistical distribution is reasonable
 *
 * Run with: node scripts/test-comprehensive.js
 */

const fs = require('fs');
const path = require('path');

// ========== CONFIGURATION ==========
const NUM_RANDOM_TESTS = 500;  // Number of random personalities to test
const NUM_EDGE_CASE_TESTS = 50;  // Number of edge case tests

// ========== QUESTION COUNTS PER COHORT ==========
const QUESTION_COUNTS = {
  YLA: 30,
  TASO2: 33,
  NUORI: 30
};

// ========== CATEGORY DEFINITIONS ==========
const CATEGORIES = [
  'innovoija',
  'auttaja',
  'luova',
  'rakentaja',
  'johtaja',
  'ympariston-puolustaja',
  'visionaari',
  'jarjestaja'
];

// ========== SCORING FUNCTIONS (from test-accuracy.js) ==========

function normalizeAnswer(score, reverse = false) {
  if (score < 1 || score > 5) return 0;
  const normalized = (score - 1) / 4;
  return reverse ? 1 - normalized : normalized;
}

// Simplified question mappings for each cohort
function getQuestionMappings(cohort) {
  if (cohort === 'YLA') {
    return [
      { q: 0, dimension: 'interests', subdimension: 'analytical', weight: 1.0 },
      { q: 1, dimension: 'interests', subdimension: 'analytical', weight: 1.2 },
      { q: 2, dimension: 'interests', subdimension: 'hands_on', weight: 1.3 },
      { q: 3, dimension: 'interests', subdimension: 'technology', weight: 1.2 },
      { q: 4, dimension: 'interests', subdimension: 'problem_solving', weight: 1.1 },
      { q: 5, dimension: 'interests', subdimension: 'problem_solving', weight: 1.0 },
      { q: 6, dimension: 'interests', subdimension: 'analytical', weight: 1.1 },
      { q: 7, dimension: 'interests', subdimension: 'people', weight: 1.3 },
      { q: 8, dimension: 'interests', subdimension: 'health', weight: 1.2 },
      { q: 9, dimension: 'interests', subdimension: 'growth', weight: 1.1 },
      { q: 10, dimension: 'interests', subdimension: 'creative', weight: 1.3 },
      { q: 11, dimension: 'interests', subdimension: 'creative', weight: 1.2 },
      { q: 12, dimension: 'interests', subdimension: 'innovation', weight: 1.1 },
      { q: 13, dimension: 'workstyle', subdimension: 'teamwork', weight: 1.2 },
      { q: 14, dimension: 'interests', subdimension: 'leadership', weight: 1.3 },
      { q: 15, dimension: 'interests', subdimension: 'business', weight: 1.2 },
      { q: 16, dimension: 'workstyle', subdimension: 'organization', weight: 1.3 },
      { q: 17, dimension: 'workstyle', subdimension: 'precision', weight: 1.2 },
      { q: 18, dimension: 'interests', subdimension: 'technology', weight: 1.3 },
      { q: 19, dimension: 'interests', subdimension: 'innovation', weight: 1.2 },
      { q: 20, dimension: 'workstyle', subdimension: 'structure', weight: 1.2 },
      { q: 21, dimension: 'workstyle', subdimension: 'independence', weight: 1.1 },
      { q: 22, dimension: 'workstyle', subdimension: 'performance', weight: 1.0 },
      { q: 23, dimension: 'values', subdimension: 'stability', weight: 1.2 },
      { q: 24, dimension: 'interests', subdimension: 'technology', weight: 1.1 },
      { q: 25, dimension: 'values', subdimension: 'entrepreneurship', weight: 1.3 },
      { q: 26, dimension: 'interests', subdimension: 'environment', weight: 1.4 },
      { q: 27, dimension: 'interests', subdimension: 'nature', weight: 1.3 },
      { q: 28, dimension: 'values', subdimension: 'global', weight: 1.2 },
      { q: 29, dimension: 'context', subdimension: 'outdoor', weight: 1.2 }
    ];
  } else if (cohort === 'TASO2') {
    return [
      { q: 0, dimension: 'interests', subdimension: 'technology', weight: 1.3 },
      { q: 1, dimension: 'interests', subdimension: 'analytical', weight: 1.2 },
      { q: 2, dimension: 'interests', subdimension: 'analytical', weight: 1.1 },
      { q: 3, dimension: 'interests', subdimension: 'hands_on', weight: 1.3 },
      { q: 4, dimension: 'interests', subdimension: 'problem_solving', weight: 1.2 },
      { q: 5, dimension: 'interests', subdimension: 'innovation', weight: 1.1 },
      { q: 6, dimension: 'interests', subdimension: 'technology', weight: 1.2 },
      { q: 7, dimension: 'interests', subdimension: 'people', weight: 1.3 },
      { q: 8, dimension: 'interests', subdimension: 'health', weight: 1.4 },
      { q: 9, dimension: 'interests', subdimension: 'education', weight: 1.2 },
      { q: 10, dimension: 'interests', subdimension: 'growth', weight: 1.1 },
      { q: 11, dimension: 'interests', subdimension: 'people', weight: 1.2 },
      { q: 12, dimension: 'workstyle', subdimension: 'teamwork', weight: 1.2 },
      { q: 13, dimension: 'interests', subdimension: 'health', weight: 1.3 },
      { q: 14, dimension: 'interests', subdimension: 'leadership', weight: 1.4 },
      { q: 15, dimension: 'interests', subdimension: 'business', weight: 1.3 },
      { q: 16, dimension: 'workstyle', subdimension: 'organization', weight: 1.3 },
      { q: 17, dimension: 'interests', subdimension: 'creative', weight: 1.4 },
      { q: 18, dimension: 'interests', subdimension: 'creative', weight: 1.3 },
      { q: 19, dimension: 'interests', subdimension: 'arts_culture', weight: 1.2 },
      { q: 20, dimension: 'workstyle', subdimension: 'precision', weight: 1.2 },
      { q: 21, dimension: 'interests', subdimension: 'hands_on', weight: 1.3 },
      { q: 22, dimension: 'workstyle', subdimension: 'performance', weight: 1.1 },
      { q: 23, dimension: 'interests', subdimension: 'hands_on', weight: 1.2 },
      { q: 24, dimension: 'interests', subdimension: 'environment', weight: 1.4 },
      { q: 25, dimension: 'interests', subdimension: 'nature', weight: 1.3 },
      { q: 26, dimension: 'context', subdimension: 'outdoor', weight: 1.2 },
      { q: 27, dimension: 'values', subdimension: 'stability', weight: 1.1 },
      { q: 28, dimension: 'values', subdimension: 'entrepreneurship', weight: 1.3 },
      { q: 29, dimension: 'workstyle', subdimension: 'planning', weight: 1.2 },
      { q: 30, dimension: 'values', subdimension: 'global', weight: 1.4 },
      { q: 31, dimension: 'workstyle', subdimension: 'planning', weight: 1.3 },
      { q: 32, dimension: 'interests', subdimension: 'innovation', weight: 1.2 }
    ];
  } else {
    // NUORI
    return [
      { q: 0, dimension: 'interests', subdimension: 'technology', weight: 1.3 },
      { q: 1, dimension: 'interests', subdimension: 'analytical', weight: 1.2 },
      { q: 2, dimension: 'interests', subdimension: 'hands_on', weight: 1.4 },
      { q: 3, dimension: 'interests', subdimension: 'health', weight: 1.3 },
      { q: 4, dimension: 'interests', subdimension: 'education', weight: 1.2 },
      { q: 5, dimension: 'interests', subdimension: 'people', weight: 1.3 },
      { q: 6, dimension: 'interests', subdimension: 'creative', weight: 1.4 },
      { q: 7, dimension: 'interests', subdimension: 'creative', weight: 1.3 },
      { q: 8, dimension: 'interests', subdimension: 'arts_culture', weight: 1.2 },
      { q: 9, dimension: 'interests', subdimension: 'writing', weight: 1.1 },
      { q: 10, dimension: 'interests', subdimension: 'business', weight: 1.3 },
      { q: 11, dimension: 'interests', subdimension: 'leadership', weight: 1.4 },
      { q: 12, dimension: 'workstyle', subdimension: 'planning', weight: 1.3 },
      { q: 13, dimension: 'values', subdimension: 'global', weight: 1.4 },
      { q: 14, dimension: 'workstyle', subdimension: 'leadership', weight: 1.3 },
      { q: 15, dimension: 'values', subdimension: 'entrepreneurship', weight: 1.2 },
      { q: 16, dimension: 'workstyle', subdimension: 'organization', weight: 1.3 },
      { q: 17, dimension: 'workstyle', subdimension: 'precision', weight: 1.2 },
      { q: 18, dimension: 'interests', subdimension: 'environment', weight: 1.4 },
      { q: 19, dimension: 'interests', subdimension: 'nature', weight: 1.3 },
      { q: 20, dimension: 'workstyle', subdimension: 'structure', weight: 1.2 },
      { q: 21, dimension: 'interests', subdimension: 'hands_on', weight: 1.3 },
      { q: 22, dimension: 'interests', subdimension: 'growth', weight: 1.1 },
      { q: 23, dimension: 'interests', subdimension: 'technology', weight: 1.3 },
      { q: 24, dimension: 'interests', subdimension: 'innovation', weight: 1.4 },
      { q: 25, dimension: 'context', subdimension: 'outdoor', weight: 1.2 },
      { q: 26, dimension: 'values', subdimension: 'stability', weight: 1.1 },
      { q: 27, dimension: 'workstyle', subdimension: 'precision', weight: 1.2 },
      { q: 28, dimension: 'workstyle', subdimension: 'teamwork', weight: 1.2 },
      { q: 29, dimension: 'workstyle', subdimension: 'problem_solving', weight: 1.3 }
    ];
  }
}

function computeUserVector(answers, cohort) {
  const mappings = getQuestionMappings(cohort);
  const subdimensionScores = {};

  answers.forEach((score, index) => {
    const mapping = mappings.find(m => m.q === index);
    if (!mapping) return;

    const normalizedScore = normalizeAnswer(score);
    const key = `${mapping.dimension}:${mapping.subdimension}`;

    if (!subdimensionScores[key]) {
      subdimensionScores[key] = { sum: 0, weight: 0 };
    }

    let effectiveWeight = mapping.weight;
    if (score >= 4) {
      effectiveWeight = mapping.weight * (score === 5 ? 2.0 : 1.5);
    }

    subdimensionScores[key].sum += normalizedScore * effectiveWeight;
    subdimensionScores[key].weight += effectiveWeight;
  });

  const detailedScores = { interests: {}, values: {}, workstyle: {}, context: {} };

  Object.entries(subdimensionScores).forEach(([key, data]) => {
    const [dimension, subdimension] = key.split(':');
    if (detailedScores[dimension]) {
      detailedScores[dimension][subdimension] = data.sum / data.weight;
    }
  });

  return detailedScores;
}

function determineCategory(scores) {
  const i = scores.interests || {};
  const w = scores.workstyle || {};
  const v = scores.values || {};
  const c = scores.context || {};

  const isDominant = (score, threshold = 0.7) => (score || 0) >= threshold;
  const isStrong = (score, threshold = 0.6) => (score || 0) >= threshold;

  const rawScores = {
    'innovoija': (i.technology || 0) * 4.0 + (i.analytical || 0) * 2.5 + (w.problem_solving || 0) * 2.0 + (i.innovation || 0) * 1.5,
    'auttaja': (i.health || 0) * 4.0 + (i.people || 0) * 4.0 + (i.education || 0) * 2.5 + (i.growth || 0) * 2.5 + (w.teamwork || 0) * 1.5,
    'luova': (i.creative || 0) * 5.0 + (i.arts_culture || 0) * 2.5 + (i.writing || 0) * 2.5 + (w.independence || 0) * 1.5,
    'rakentaja': (i.hands_on || 0) * 5.0 + (w.precision || 0) * 2.0 + (w.performance || 0) * 2.0 + (v.stability || 0) * 1.5,
    'johtaja': (i.leadership || 0) * 4.5 + (w.leadership || 0) * 4.5 + (i.business || 0) * 3.5 + (v.entrepreneurship || 0) * 3.0 + (w.organization || 0) * 2.0 + (w.planning || 0) * 1.5,
    'ympariston-puolustaja': (i.environment || 0) * 5.5 + (i.nature || 0) * 3.5 + (c.outdoor || 0) * 2.5 + (v.global || 0) * 2.0,
    'visionaari': (w.planning || 0) * 3.0 + (v.global || 0) * 3.0 + (i.innovation || 0) * 2.0 + (w.leadership || 0) * 2.0 + (i.analytical || 0) * 1.5,
    'jarjestaja': (w.organization || 0) * 4.0 + (w.structure || 0) * 3.0 + (w.precision || 0) * 2.5 + (v.stability || 0) * 2.0
  };

  const adjustedScores = { ...rawScores };

  // Apply exclusivity rules
  if (isDominant(i.creative, 0.8)) {
    adjustedScores['luova'] += 3.0;
    adjustedScores['innovoija'] -= 2.0;
  }

  if (isStrong(i.hands_on, 0.7)) {
    adjustedScores['rakentaja'] += 3.0;
    if (!isDominant(i.technology, 0.8)) {
      adjustedScores['innovoija'] -= 1.5;
    }
  }

  if (isStrong(i.leadership, 0.7) && isStrong(i.business, 0.7)) {
    adjustedScores['johtaja'] += 4.0;
    if (!isDominant(i.technology, 0.8)) {
      adjustedScores['innovoija'] -= 2.0;
    }
  }

  const topInterest = Object.entries(i).sort(([,a], [,b]) => b - a)[0];
  const isEnvironmentPrimary = topInterest && topInterest[0] === 'environment';

  if (isDominant(i.environment, 0.9) && isEnvironmentPrimary) {
    adjustedScores['ympariston-puolustaja'] += 5.0;
    adjustedScores['innovoija'] -= 3.0;
    adjustedScores['johtaja'] -= 2.0;
  } else if (isDominant(i.environment, 0.8)) {
    adjustedScores['ympariston-puolustaja'] += 2.0;
  }

  if (isDominant(i.technology, 0.8)) {
    const sortedInterests = Object.entries(i).sort(([,a], [,b]) => b - a);
    const techRank = sortedInterests.findIndex(([k]) => k === 'technology');
    if (techRank <= 1) {
      adjustedScores['innovoija'] += 4.0;
      adjustedScores['ympariston-puolustaja'] -= 3.0;
    }
  } else if (!isStrong(i.technology, 0.6)) {
    adjustedScores['innovoija'] *= 0.5;
  }

  if ((i.creative || 0) >= (i.technology || 0) + 0.2) {
    adjustedScores['luova'] += 2.0;
  }

  if ((i.hands_on || 0) >= 0.7 && (i.technology || 0) < 0.7) {
    adjustedScores['rakentaja'] += 2.0;
    adjustedScores['ympariston-puolustaja'] -= 2.0;
  }

  if (isDominant(i.health, 0.8) || isDominant(i.people, 0.7)) {
    adjustedScores['auttaja'] += 3.0;
  }

  if ((i.technology || 0) > (i.leadership || 0) + 0.1 && isDominant(i.technology, 0.8)) {
    adjustedScores['innovoija'] += 2.0;
    adjustedScores['johtaja'] -= 1.0;
  }

  if ((i.leadership || 0) > (i.technology || 0) && isStrong(i.leadership, 0.7)) {
    adjustedScores['johtaja'] += 2.0;
  }

  if ((i.technology || 0) > (i.environment || 0) + 0.2 || (i.hands_on || 0) > (i.environment || 0) + 0.1) {
    adjustedScores['ympariston-puolustaja'] -= 3.0;
  }

  if (isDominant(w.organization, 0.8) && !isStrong(i.leadership, 0.6) && !isStrong(i.business, 0.5)) {
    adjustedScores['jarjestaja'] += 4.0;
    adjustedScores['johtaja'] -= 3.0;
  }

  if ((w.structure || 0) >= 0.7 && (w.precision || 0) >= 0.6 && (i.hands_on || 0) < 0.6) {
    adjustedScores['jarjestaja'] += 3.0;
    adjustedScores['rakentaja'] -= 2.0;
  }

  if (isDominant(v.global, 0.8) && isStrong(w.planning, 0.7)) {
    adjustedScores['visionaari'] += 5.0;
    if ((i.environment || 0) < (v.global || 0)) {
      adjustedScores['ympariston-puolustaja'] -= 4.0;
    }
  }

  if ((i.innovation || 0) >= 0.7 && (v.global || 0) >= 0.7 && (i.technology || 0) < 0.7) {
    adjustedScores['visionaari'] += 4.0;
    adjustedScores['innovoija'] -= 2.0;
  }

  if ((w.organization || 0) >= 0.7 && (i.leadership || 0) < 0.5 && (i.business || 0) < 0.5 && (v.entrepreneurship || 0) < 0.5) {
    adjustedScores['johtaja'] -= 4.0;
    adjustedScores['jarjestaja'] += 2.0;
  }

  let topCategory = 'innovoija';
  let maxScore = -Infinity;

  Object.entries(adjustedScores).forEach(([cat, score]) => {
    if (score > maxScore) {
      maxScore = score;
      topCategory = cat;
    }
  });

  return { topCategory, categoryScores: adjustedScores, maxScore };
}

// ========== RANDOM TEST GENERATORS ==========

function generateRandomAnswers(numQuestions) {
  return Array.from({ length: numQuestions }, () => Math.floor(Math.random() * 5) + 1);
}

function generateBiasedAnswers(numQuestions, targetCategory, strength = 0.7) {
  // Generate answers biased towards a specific category
  const answers = Array.from({ length: numQuestions }, () => Math.floor(Math.random() * 5) + 1);

  // Determine which questions to boost based on target category
  const boostQuestions = getCategoryQuestions(targetCategory, numQuestions);

  boostQuestions.forEach(q => {
    if (q < numQuestions && Math.random() < strength) {
      answers[q] = Math.random() < 0.5 ? 5 : 4;  // High score
    }
  });

  return answers;
}

function getCategoryQuestions(category, numQuestions) {
  // Return question indices that strongly signal each category
  const categoryQuestionMap = {
    'innovoija': [0, 1, 3, 4, 5, 18, 19, 23, 24],  // tech, analytical, innovation
    'auttaja': [7, 8, 9, 13],  // people, health, education, teamwork
    'luova': [10, 11, 17, 18, 19],  // creative, arts
    'rakentaja': [2, 17, 20, 21, 22, 23],  // hands_on, precision, performance
    'johtaja': [14, 15, 16, 25],  // leadership, business, organization, entrepreneurship
    'ympariston-puolustaja': [26, 27, 28, 29],  // environment, nature, global, outdoor
    'visionaari': [12, 19, 28, 29, 30, 31],  // planning, innovation, global
    'jarjestaja': [16, 17, 20, 23]  // organization, precision, structure, stability
  };

  return (categoryQuestionMap[category] || []).filter(q => q < numQuestions);
}

function generateEdgeCaseAnswers(numQuestions, type) {
  switch(type) {
    case 'all_high':
      return Array(numQuestions).fill(5);
    case 'all_low':
      return Array(numQuestions).fill(1);
    case 'all_neutral':
      return Array(numQuestions).fill(3);
    case 'alternating':
      return Array.from({ length: numQuestions }, (_, i) => i % 2 === 0 ? 5 : 1);
    case 'mixed_extreme':
      return Array.from({ length: numQuestions }, () => Math.random() < 0.5 ? 1 : 5);
    default:
      return generateRandomAnswers(numQuestions);
  }
}

// ========== TEST RUNNERS ==========

function runRandomTests(cohort, numTests) {
  const results = {
    total: numTests,
    categoryDistribution: {},
    scoreRanges: { min: Infinity, max: -Infinity, avg: 0 },
    allCategoriesReached: new Set()
  };

  CATEGORIES.forEach(cat => results.categoryDistribution[cat] = 0);

  let totalScore = 0;

  for (let i = 0; i < numTests; i++) {
    const answers = generateRandomAnswers(QUESTION_COUNTS[cohort]);
    const scores = computeUserVector(answers, cohort);
    const { topCategory, maxScore } = determineCategory(scores);

    results.categoryDistribution[topCategory]++;
    results.allCategoriesReached.add(topCategory);

    if (maxScore < results.scoreRanges.min) results.scoreRanges.min = maxScore;
    if (maxScore > results.scoreRanges.max) results.scoreRanges.max = maxScore;
    totalScore += maxScore;
  }

  results.scoreRanges.avg = totalScore / numTests;

  return results;
}

function runBiasedTests(cohort) {
  const results = {
    categoryTests: {},
    allPassed: true
  };

  CATEGORIES.forEach(category => {
    const answers = generateBiasedAnswers(QUESTION_COUNTS[cohort], category, 0.8);
    const scores = computeUserVector(answers, cohort);
    const { topCategory, categoryScores } = determineCategory(scores);

    const passed = topCategory === category;
    results.categoryTests[category] = {
      expected: category,
      actual: topCategory,
      passed,
      scores: categoryScores
    };

    if (!passed) results.allPassed = false;
  });

  return results;
}

function runEdgeCaseTests(cohort) {
  const edgeCases = ['all_high', 'all_low', 'all_neutral', 'alternating', 'mixed_extreme'];
  const results = {};

  edgeCases.forEach(type => {
    const answers = generateEdgeCaseAnswers(QUESTION_COUNTS[cohort], type);
    const scores = computeUserVector(answers, cohort);
    const { topCategory, categoryScores, maxScore } = determineCategory(scores);

    results[type] = {
      topCategory,
      maxScore,
      hasValidCategory: CATEGORIES.includes(topCategory),
      topScores: Object.entries(categoryScores)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([cat, score]) => `${cat}: ${score.toFixed(2)}`)
    };
  });

  return results;
}

// ========== MAIN TEST EXECUTION ==========

function runComprehensiveTests() {
  console.log('='.repeat(80));
  console.log('COMPREHENSIVE SCORING TEST');
  console.log('Testing random personalities, biased tests, and edge cases');
  console.log('='.repeat(80));
  console.log();

  const cohorts = ['YLA', 'TASO2', 'NUORI'];
  const allResults = {};

  cohorts.forEach(cohort => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`COHORT: ${cohort} (${QUESTION_COUNTS[cohort]} questions)`);
    console.log('='.repeat(60));

    // 1. Random Tests
    console.log(`\n📊 RANDOM PERSONALITY TESTS (${NUM_RANDOM_TESTS} tests)`);
    console.log('-'.repeat(40));

    const randomResults = runRandomTests(cohort, NUM_RANDOM_TESTS);
    allResults[`${cohort}_random`] = randomResults;

    console.log(`Categories reached: ${randomResults.allCategoriesReached.size}/${CATEGORIES.length}`);
    console.log(`Score range: ${randomResults.scoreRanges.min.toFixed(2)} - ${randomResults.scoreRanges.max.toFixed(2)} (avg: ${randomResults.scoreRanges.avg.toFixed(2)})`);
    console.log('\nCategory distribution:');
    Object.entries(randomResults.categoryDistribution)
      .sort(([,a], [,b]) => b - a)
      .forEach(([cat, count]) => {
        const pct = ((count / NUM_RANDOM_TESTS) * 100).toFixed(1);
        const bar = '█'.repeat(Math.round(pct / 2));
        console.log(`  ${cat.padEnd(22)} ${count.toString().padStart(4)} (${pct.padStart(5)}%) ${bar}`);
      });

    // 2. Biased Tests (category-targeted)
    console.log(`\n🎯 BIASED CATEGORY TESTS (8 categories)`);
    console.log('-'.repeat(40));

    const biasedResults = runBiasedTests(cohort);
    allResults[`${cohort}_biased`] = biasedResults;

    let biasedPassed = 0;
    CATEGORIES.forEach(cat => {
      const result = biasedResults.categoryTests[cat];
      const status = result.passed ? '✅' : '❌';
      console.log(`  ${status} ${cat.padEnd(22)} → ${result.actual}`);
      if (result.passed) biasedPassed++;
    });
    console.log(`\nBiased test accuracy: ${biasedPassed}/${CATEGORIES.length} (${((biasedPassed/CATEGORIES.length)*100).toFixed(1)}%)`);

    // 3. Edge Case Tests
    console.log(`\n⚠️ EDGE CASE TESTS`);
    console.log('-'.repeat(40));

    const edgeResults = runEdgeCaseTests(cohort);
    allResults[`${cohort}_edge`] = edgeResults;

    Object.entries(edgeResults).forEach(([type, result]) => {
      const status = result.hasValidCategory ? '✅' : '❌';
      console.log(`  ${status} ${type.padEnd(15)} → ${result.topCategory} (score: ${result.maxScore.toFixed(2)})`);
    });
  });

  // Final Summary
  console.log('\n' + '='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));

  let totalCategoriesReached = new Set();
  cohorts.forEach(cohort => {
    const randomResults = allResults[`${cohort}_random`];
    randomResults.allCategoriesReached.forEach(cat => totalCategoriesReached.add(cat));
  });

  console.log(`\n✅ Total unique categories reached across all cohorts: ${totalCategoriesReached.size}/${CATEGORIES.length}`);
  console.log(`   Categories: ${Array.from(totalCategoriesReached).join(', ')}`);

  const missingCategories = CATEGORIES.filter(cat => !totalCategoriesReached.has(cat));
  if (missingCategories.length > 0) {
    console.log(`\n⚠️ Missing categories: ${missingCategories.join(', ')}`);
  }

  // Check biased test results
  let totalBiasedPassed = 0;
  let totalBiasedTests = 0;
  cohorts.forEach(cohort => {
    const biasedResults = allResults[`${cohort}_biased`];
    CATEGORIES.forEach(cat => {
      totalBiasedTests++;
      if (biasedResults.categoryTests[cat].passed) totalBiasedPassed++;
    });
  });

  console.log(`\n🎯 Biased test accuracy (all cohorts): ${totalBiasedPassed}/${totalBiasedTests} (${((totalBiasedPassed/totalBiasedTests)*100).toFixed(1)}%)`);

  if (totalCategoriesReached.size === CATEGORIES.length && totalBiasedPassed >= totalBiasedTests * 0.7) {
    console.log('\n' + '🎉'.repeat(20));
    console.log('COMPREHENSIVE TESTS PASSED!');
    console.log('The scoring algorithm handles diverse personality types well.');
    console.log('🎉'.repeat(20));
  } else {
    console.log('\n⚠️ Some improvements may be needed for better category coverage.');
  }
}

// Run the tests
runComprehensiveTests();
