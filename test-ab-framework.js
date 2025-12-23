/**
 * Test 9: A/B Testing Framework
 *
 * Provides infrastructure for comparing different configurations:
 * 1. Question set variations (A vs B)
 * 2. Scoring algorithm variations
 * 3. Recommendation count variations
 * 4. Statistical significance testing
 * 5. Effect size calculation
 *
 * This framework simulates A/B tests to validate that changes
 * in the system produce measurable, statistically significant differences.
 */

const BASE_URL = 'http://localhost:3000';

// A/B Test configurations
const AB_TESTS = {
  cohort_comparison: {
    name: 'Cohort Career Comparison',
    description: 'Compare career recommendations between cohorts',
    variantA: { cohort: 'YLA' },
    variantB: { cohort: 'NUORI' },
    metric: 'career_diversity'
  },
  answer_impact: {
    name: 'Answer Pattern Impact',
    description: 'Compare outcomes of high vs low answer patterns',
    variantA: { pattern: 'high' },
    variantB: { pattern: 'low' },
    metric: 'match_score'
  },
  creative_vs_analytical: {
    name: 'Creative vs Analytical Profile',
    description: 'Compare career categories for different profiles',
    variantA: { profile: 'creative' },
    variantB: { profile: 'analytical' },
    metric: 'category_distribution'
  }
};

// Statistical helper functions
function mean(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function variance(arr) {
  const m = mean(arr);
  return arr.reduce((sum, x) => sum + Math.pow(x - m, 2), 0) / arr.length;
}

function stdDev(arr) {
  return Math.sqrt(variance(arr));
}

// Two-sample t-test (Welch's t-test)
function tTest(groupA, groupB) {
  const n1 = groupA.length;
  const n2 = groupB.length;
  const m1 = mean(groupA);
  const m2 = mean(groupB);
  const v1 = variance(groupA);
  const v2 = variance(groupB);

  // Pooled variance estimate
  const se = Math.sqrt(v1 / n1 + v2 / n2);
  if (se === 0) return { t: 0, p: 1, significant: false };

  const t = (m1 - m2) / se;

  // Degrees of freedom (Welch-Satterthwaite)
  const df = Math.pow(v1 / n1 + v2 / n2, 2) /
    (Math.pow(v1 / n1, 2) / (n1 - 1) + Math.pow(v2 / n2, 2) / (n2 - 1));

  // Approximate p-value using normal distribution for large samples
  const p = 2 * (1 - normalCDF(Math.abs(t)));

  return {
    t: t.toFixed(3),
    df: Math.round(df),
    p: p.toFixed(4),
    significant: p < 0.05
  };
}

// Cohen's d effect size
function cohensD(groupA, groupB) {
  const m1 = mean(groupA);
  const m2 = mean(groupB);
  const pooledStd = Math.sqrt((variance(groupA) + variance(groupB)) / 2);

  if (pooledStd === 0) return 0;

  const d = (m1 - m2) / pooledStd;

  let interpretation;
  const absD = Math.abs(d);
  if (absD < 0.2) interpretation = 'negligible';
  else if (absD < 0.5) interpretation = 'small';
  else if (absD < 0.8) interpretation = 'medium';
  else interpretation = 'large';

  return { d: d.toFixed(3), interpretation };
}

// Normal CDF approximation
function normalCDF(x) {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return 0.5 * (1.0 + sign * y);
}

// Chi-square test for categorical data
function chiSquareTest(observed, expected) {
  let chiSq = 0;
  for (let i = 0; i < observed.length; i++) {
    if (expected[i] > 0) {
      chiSq += Math.pow(observed[i] - expected[i], 2) / expected[i];
    }
  }

  const df = observed.length - 1;
  // Approximate p-value (simplified)
  const p = 1 - chiSquareCDF(chiSq, df);

  return { chiSq: chiSq.toFixed(3), df, p: p.toFixed(4), significant: p < 0.05 };
}

// Chi-square CDF approximation
function chiSquareCDF(x, k) {
  if (x <= 0) return 0;
  // Simple approximation using normal distribution for k > 30
  if (k > 30) {
    const z = Math.pow(x / k, 1 / 3) - (1 - 2 / (9 * k));
    return normalCDF(z / Math.sqrt(2 / (9 * k)));
  }
  // For smaller k, use simple approximation
  return 1 - Math.exp(-x / 2);
}

async function submitTest(cohort, answers) {
  const response = await fetch(`${BASE_URL}/api/score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cohort, answers })
  });

  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  return response.json();
}

function generateAnswers(pattern, count = 30) {
  switch (pattern) {
    case 'high':
      return Array.from({ length: count }, (_, i) => ({ questionIndex: i, score: 5 }));
    case 'low':
      return Array.from({ length: count }, (_, i) => ({ questionIndex: i, score: 1 }));
    case 'creative':
      return Array.from({ length: count }, (_, i) => ({
        questionIndex: i,
        score: i < 15 ? 5 : 2
      }));
    case 'analytical':
      return Array.from({ length: count }, (_, i) => ({
        questionIndex: i,
        score: i >= 10 && i < 20 ? 5 : 2
      }));
    default:
      return Array.from({ length: count }, (_, i) => ({
        questionIndex: i,
        score: Math.floor(Math.random() * 5) + 1
      }));
  }
}

// Run A/B test: Cohort comparison
async function runCohortComparisonTest(sampleSize = 20) {
  console.log('\n📊 A/B Test: Cohort Career Comparison');
  console.log('-'.repeat(50));
  console.log(`  Sample size: ${sampleSize} per variant`);

  const resultsA = [];
  const resultsB = [];

  // Variant A: YLA
  console.log('  Running Variant A (YLA)...');
  for (let i = 0; i < sampleSize; i++) {
    const answers = generateAnswers('random');
    const result = await submitTest('YLA', answers);
    const uniqueCategories = new Set(result.topCareers?.map(c => c.category) || []).size;
    const avgScore = mean(result.topCareers?.map(c => c.overallScore) || [0]);
    resultsA.push({ uniqueCategories, avgScore });
  }

  // Variant B: NUORI
  console.log('  Running Variant B (NUORI)...');
  for (let i = 0; i < sampleSize; i++) {
    const answers = generateAnswers('random');
    const result = await submitTest('NUORI', answers);
    const uniqueCategories = new Set(result.topCareers?.map(c => c.category) || []).size;
    const avgScore = mean(result.topCareers?.map(c => c.overallScore) || [0]);
    resultsB.push({ uniqueCategories, avgScore });
  }

  // Analyze: Category diversity
  const diversityA = resultsA.map(r => r.uniqueCategories);
  const diversityB = resultsB.map(r => r.uniqueCategories);

  console.log('\n  📈 Category Diversity Analysis:');
  console.log(`     Variant A (YLA): mean=${mean(diversityA).toFixed(2)}, std=${stdDev(diversityA).toFixed(2)}`);
  console.log(`     Variant B (NUORI): mean=${mean(diversityB).toFixed(2)}, std=${stdDev(diversityB).toFixed(2)}`);

  const tResult = tTest(diversityA, diversityB);
  const effectSize = cohensD(diversityA, diversityB);

  console.log(`\n  📉 Statistical Analysis:`);
  console.log(`     t-statistic: ${tResult.t}`);
  console.log(`     p-value: ${tResult.p}`);
  console.log(`     Significant (p < 0.05): ${tResult.significant ? 'Yes ✓' : 'No'}`);
  console.log(`     Effect size (Cohen's d): ${effectSize.d} (${effectSize.interpretation})`);

  return {
    test: 'cohort_comparison',
    variantA: { name: 'YLA', n: sampleSize, mean: mean(diversityA), std: stdDev(diversityA) },
    variantB: { name: 'NUORI', n: sampleSize, mean: mean(diversityB), std: stdDev(diversityB) },
    tTest: tResult,
    effectSize
  };
}

// Run A/B test: Answer pattern impact
async function runAnswerImpactTest(sampleSize = 15) {
  console.log('\n📊 A/B Test: Answer Pattern Impact on Match Scores');
  console.log('-'.repeat(50));
  console.log(`  Sample size: ${sampleSize} per variant`);

  const scoresA = [];
  const scoresB = [];

  // Variant A: High answers
  console.log('  Running Variant A (All high scores)...');
  for (let i = 0; i < sampleSize; i++) {
    const answers = generateAnswers('high');
    const result = await submitTest('YLA', answers);
    const topScore = result.topCareers?.[0]?.overallScore || 0;
    scoresA.push(topScore);
  }

  // Variant B: Low answers
  console.log('  Running Variant B (All low scores)...');
  for (let i = 0; i < sampleSize; i++) {
    const answers = generateAnswers('low');
    const result = await submitTest('YLA', answers);
    const topScore = result.topCareers?.[0]?.overallScore || 0;
    scoresB.push(topScore);
  }

  console.log('\n  📈 Match Score Analysis:');
  console.log(`     Variant A (High): mean=${mean(scoresA).toFixed(2)}, std=${stdDev(scoresA).toFixed(2)}`);
  console.log(`     Variant B (Low): mean=${mean(scoresB).toFixed(2)}, std=${stdDev(scoresB).toFixed(2)}`);

  const tResult = tTest(scoresA, scoresB);
  const effectSize = cohensD(scoresA, scoresB);

  console.log(`\n  📉 Statistical Analysis:`);
  console.log(`     t-statistic: ${tResult.t}`);
  console.log(`     p-value: ${tResult.p}`);
  console.log(`     Significant: ${tResult.significant ? 'Yes ✓' : 'No'}`);
  console.log(`     Effect size: ${effectSize.d} (${effectSize.interpretation})`);

  return {
    test: 'answer_impact',
    variantA: { name: 'High', n: sampleSize, mean: mean(scoresA), std: stdDev(scoresA) },
    variantB: { name: 'Low', n: sampleSize, mean: mean(scoresB), std: stdDev(scoresB) },
    tTest: tResult,
    effectSize
  };
}

// Run A/B test: Profile category distribution
async function runProfileCategoryTest(sampleSize = 15) {
  console.log('\n📊 A/B Test: Profile Impact on Career Categories');
  console.log('-'.repeat(50));
  console.log(`  Sample size: ${sampleSize} per variant`);

  const categoriesA = {};
  const categoriesB = {};

  // Variant A: Creative profile
  console.log('  Running Variant A (Creative profile)...');
  for (let i = 0; i < sampleSize; i++) {
    const answers = generateAnswers('creative');
    const result = await submitTest('YLA', answers);
    result.topCareers?.forEach(c => {
      categoriesA[c.category] = (categoriesA[c.category] || 0) + 1;
    });
  }

  // Variant B: Analytical profile
  console.log('  Running Variant B (Analytical profile)...');
  for (let i = 0; i < sampleSize; i++) {
    const answers = generateAnswers('analytical');
    const result = await submitTest('YLA', answers);
    result.topCareers?.forEach(c => {
      categoriesB[c.category] = (categoriesB[c.category] || 0) + 1;
    });
  }

  console.log('\n  📈 Category Distribution:');
  console.log('     Variant A (Creative):');
  Object.entries(categoriesA).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`        ${cat}: ${count}`);
  });

  console.log('     Variant B (Analytical):');
  Object.entries(categoriesB).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`        ${cat}: ${count}`);
  });

  // Check if top category differs
  const topCatA = Object.entries(categoriesA).sort((a, b) => b[1] - a[1])[0]?.[0];
  const topCatB = Object.entries(categoriesB).sort((a, b) => b[1] - a[1])[0]?.[0];

  console.log(`\n  📉 Comparison:`);
  console.log(`     Top category A: ${topCatA}`);
  console.log(`     Top category B: ${topCatB}`);
  console.log(`     Categories differ: ${topCatA !== topCatB ? 'Yes ✓' : 'No'}`);

  return {
    test: 'profile_category',
    variantA: { name: 'Creative', categories: categoriesA, topCategory: topCatA },
    variantB: { name: 'Analytical', categories: categoriesB, topCategory: topCatB },
    differ: topCatA !== topCatB
  };
}

async function runTests() {
  console.log('🔍 Checking server connectivity...');

  try {
    const response = await fetch(`${BASE_URL}/api/questions?cohort=YLA&setIndex=0`);
    if (!response.ok) throw new Error('Server not responding');
    console.log('✅ Server is running\n');
  } catch (error) {
    console.log('❌ Server is not running. Please start with: npm run dev\n');
    process.exit(1);
  }

  console.log('🧪 A/B TESTING FRAMEWORK');
  console.log('='.repeat(60));
  console.log('Running statistical comparison tests\n');

  const results = [];

  // Run all A/B tests
  results.push(await runCohortComparisonTest(15));
  results.push(await runAnswerImpactTest(10));
  results.push(await runProfileCategoryTest(10));

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 A/B TEST SUMMARY');
  console.log('='.repeat(60));

  console.log('\n📋 Test Results:');
  for (const result of results) {
    const significant = result.tTest?.significant || result.differ;
    console.log(`\n   ${result.test}:`);
    console.log(`      Significant difference: ${significant ? '✅ Yes' : '❌ No'}`);
    if (result.effectSize) {
      console.log(`      Effect size: ${result.effectSize.d} (${result.effectSize.interpretation})`);
    }
  }

  // Framework validation
  const significantTests = results.filter(r => r.tTest?.significant || r.differ).length;

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Tests with significant differences: ${significantTests}/${results.length}`);

  if (significantTests >= 2) {
    console.log('✅ A/B testing framework is working correctly');
    console.log('   Different inputs produce statistically different outputs');
  } else {
    console.log('⚠️ May need larger sample sizes for statistical power');
  }

  // Save results
  const fs = require('fs');
  fs.writeFileSync('test-ab-framework-results.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: { significantTests, totalTests: results.length },
    results
  }, null, 2));

  console.log('\n📄 Full results saved to test-ab-framework-results.json\n');
}

runTests().catch(console.error);
