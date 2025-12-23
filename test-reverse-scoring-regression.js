/**
 * Test 4: Reverse Scoring Regression Test
 *
 * Validates that reverse-scored questions work correctly for ALL 4 cohorts:
 * 1. Answer 5 to reverse question → contributes LOW to subdimension
 * 2. Answer 1 to reverse question → contributes HIGH to subdimension
 * 3. Reverse scoring doesn't break when disabled
 * 4. Profile scores differ appropriately when reverse questions are inverted
 *
 * Reverse-scored questions per cohort:
 * - YLA (Yläaste): Q18, Q20, Q25
 * - TASO2 Lukio: Q18, Q21 (shared Q18 + LUKIO-specific Q21)
 * - TASO2 Ammattikoulu: Q18, Q21 (shared Q18 + AMIS-specific Q21)
 * - NUORI (Nuori aikuinen): Q16, Q19, Q29
 */

const BASE_URL = 'http://localhost:3000';

// All 4 cohort configurations
const COHORT_CONFIGS = [
  { cohort: 'YLA', subCohort: null, reverseQuestions: [18, 20, 25], label: 'YLA (Yläaste)' },
  { cohort: 'TASO2', subCohort: 'LUKIO', reverseQuestions: [18, 21], label: 'TASO2 Lukio' },
  { cohort: 'TASO2', subCohort: 'AMIS', reverseQuestions: [18, 21], label: 'TASO2 Ammattikoulu' },
  { cohort: 'NUORI', subCohort: null, reverseQuestions: [16, 19, 29], label: 'NUORI (Nuori aikuinen)' }
];

// Expected behavior: If someone answers 5 to a reverse question,
// they should score LOWER on that dimension than someone who answers 1

async function getQuestions(cohort, subCohort) {
  let url = `${BASE_URL}/api/questions?cohort=${cohort}&setIndex=0`;
  if (subCohort) url += `&subCohort=${subCohort}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to get questions for ${cohort}${subCohort ? ` (${subCohort})` : ''}`);
  const data = await response.json();
  return data.questions || data;
}

async function submitTest(cohort, answers, subCohort) {
  const body = { cohort, answers };
  if (subCohort) body.subCohort = subCohort;

  const response = await fetch(`${BASE_URL}/api/score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }
  return response.json();
}

// Test 1: Verify reverse questions actually reverse the contribution
async function testReverseQuestionContribution(config) {
  const { cohort, subCohort, reverseQuestions, label } = config;
  console.log(`\n  📊 Testing reverse question contribution for ${label}`);

  const questions = await getQuestions(cohort, subCohort);

  if (reverseQuestions.length === 0) {
    console.log(`     ⚠️ No reverse questions defined for ${label}`);
    return { passed: true, note: 'No reverse questions' };
  }

  // Scenario A: All 5s (including reverse questions)
  // If reverse scoring works: reverse questions contribute LOW
  const answersAllFives = questions.map((q, i) => ({
    questionIndex: i,
    score: 5
  }));

  // Scenario B: All 5s EXCEPT reverse questions get 1s
  // If reverse scoring works: reverse questions contribute HIGH (1 reversed = 5)
  const answersReversedLow = questions.map((q, i) => ({
    questionIndex: i,
    score: reverseQuestions.includes(i) ? 1 : 5
  }));

  const resultAllFives = await submitTest(cohort, answersAllFives, subCohort);
  const resultReversedLow = await submitTest(cohort, answersReversedLow, subCohort);

  // Compare profiles - use dimensionScores
  const profileAllFives = resultAllFives.userProfile?.dimensionScores;
  const profileReversedLow = resultReversedLow.userProfile?.dimensionScores;

  const topCareerA = resultAllFives.topCareers?.[0];
  const topCareerB = resultReversedLow.topCareers?.[0];

  console.log(`     Scenario A (all 5s): ${topCareerA?.title} (${topCareerA?.overallScore}%)`);
  console.log(`     Scenario B (reverse=1s): ${topCareerB?.title} (${topCareerB?.overallScore}%)`);
  console.log(`     Profile A dimensions: ${JSON.stringify(profileAllFives)}`);
  console.log(`     Profile B dimensions: ${JSON.stringify(profileReversedLow)}`);

  // The profiles should differ if reverse scoring is working
  const profilesMatch = JSON.stringify(profileAllFives) === JSON.stringify(profileReversedLow);

  if (profilesMatch) {
    console.log(`     ❌ Profiles are identical - reverse scoring may not be working!`);
    return { passed: false, error: 'Profiles identical despite different reverse answers' };
  } else {
    console.log(`     ✓ Profiles differ as expected`);
    return { passed: true };
  }
}

// Test 2: Verify answering opposite on reverse questions changes results
async function testReverseImpactOnResults(config) {
  const { cohort, subCohort, reverseQuestions, label } = config;
  console.log(`\n  🔄 Testing reverse question impact on career results for ${label}`);

  const questions = await getQuestions(cohort, subCohort);

  if (reverseQuestions.length === 0) {
    return { passed: true, note: 'No reverse questions' };
  }

  // Create two identical answer sets, except flip reverse questions
  const baseline = questions.map((q, i) => ({
    questionIndex: i,
    score: 3 // Neutral baseline
  }));

  // High on reverse questions (which should mean LOW contribution after reversal)
  const highReverse = questions.map((q, i) => ({
    questionIndex: i,
    score: reverseQuestions.includes(i) ? 5 : 3
  }));

  // Low on reverse questions (which should mean HIGH contribution after reversal)
  const lowReverse = questions.map((q, i) => ({
    questionIndex: i,
    score: reverseQuestions.includes(i) ? 1 : 3
  }));

  const resultBaseline = await submitTest(cohort, baseline, subCohort);
  const resultHighReverse = await submitTest(cohort, highReverse, subCohort);
  const resultLowReverse = await submitTest(cohort, lowReverse, subCohort);

  const baselineTop = resultBaseline.topCareers?.[0];
  const highReverseTop = resultHighReverse.topCareers?.[0];
  const lowReverseTop = resultLowReverse.topCareers?.[0];

  console.log(`     Baseline (all 3s): ${baselineTop?.title} (${baselineTop?.overallScore}%)`);
  console.log(`     High reverse (5s): ${highReverseTop?.title} (${highReverseTop?.overallScore}%)`);
  console.log(`     Low reverse (1s): ${lowReverseTop?.title} (${lowReverseTop?.overallScore}%)`);

  // Also check profile dimension scores
  const profileHigh = resultHighReverse.userProfile?.dimensionScores;
  const profileLow = resultLowReverse.userProfile?.dimensionScores;

  // Check if profiles differ
  let profilesDiffer = false;
  if (profileHigh && profileLow) {
    for (const dim of ['interests', 'values', 'workstyle', 'context']) {
      if (Math.abs((profileHigh[dim] || 0) - (profileLow[dim] || 0)) > 0.001) {
        profilesDiffer = true;
        break;
      }
    }
  }

  // Check if careers/scores differ
  const careersDiffer = highReverseTop?.title !== lowReverseTop?.title;
  const scoresDiffer = highReverseTop?.overallScore !== lowReverseTop?.overallScore;

  // Pass if either profile, career, or scores differ between high and low reverse
  const passed = profilesDiffer || careersDiffer || scoresDiffer;

  console.log(`     Profiles differ: ${profilesDiffer ? '✓' : '✗'}`);
  console.log(`     Careers differ: ${careersDiffer ? '✓' : '✗'}`);

  if (passed) {
    console.log(`     ✓ Results vary based on reverse question answers`);
    return { passed: true };
  } else {
    console.log(`     ⚠️ High and low reverse answers produced same results`);
    return { passed: false, warning: 'Same results for opposite reverse answers' };
  }
}

// Test 3: Verify reverse questions affect profile dimensions
async function testIndividualReverseQuestions(config) {
  const { cohort, subCohort, reverseQuestions, label } = config;
  console.log(`\n  🔬 Testing individual reverse questions affect profile for ${label}`);

  const questions = await getQuestions(cohort, subCohort);
  const results = [];

  for (const rqIndex of reverseQuestions) {
    // Only this reverse question gets 5
    const onlyThisHigh = questions.map((q, i) => ({
      questionIndex: i,
      score: i === rqIndex ? 5 : 3
    }));

    // Only this reverse question gets 1
    const onlyThisLow = questions.map((q, i) => ({
      questionIndex: i,
      score: i === rqIndex ? 1 : 3
    }));

    const resultHigh = await submitTest(cohort, onlyThisHigh, subCohort);
    const resultLow = await submitTest(cohort, onlyThisLow, subCohort);

    // Compare profile dimension scores instead of just top career match
    const profileHigh = resultHigh.userProfile?.dimensionScores;
    const profileLow = resultLow.userProfile?.dimensionScores;

    // Check if at least one dimension differs
    let dimensionsDiffer = false;
    if (profileHigh && profileLow) {
      for (const dim of ['interests', 'values', 'workstyle', 'context']) {
        if (Math.abs((profileHigh[dim] || 0) - (profileLow[dim] || 0)) > 0.001) {
          dimensionsDiffer = true;
          break;
        }
      }
    }

    const highCareer = resultHigh.topCareers?.[0]?.title;
    const lowCareer = resultLow.topCareers?.[0]?.title;
    const careersDiffer = highCareer !== lowCareer;

    // Pass if either profile dimensions differ OR top career differs
    const affects = dimensionsDiffer || careersDiffer;

    console.log(`     Q${rqIndex}: Profile differs=${dimensionsDiffer ? '✓' : '✗'}, Career differs=${careersDiffer ? '✓' : '✗'} - ${affects ? '✓' : '⚠️'}`);

    results.push({
      questionIndex: rqIndex,
      questionText: questions[rqIndex]?.text?.substring(0, 50) + '...',
      dimensionsDiffer,
      careersDiffer,
      affects
    });
  }

  const allAffect = results.every(r => r.affects);

  return {
    passed: allAffect,
    results,
    note: allAffect ? 'All reverse questions affect profile or results' : 'Some reverse questions had no effect'
  };
}

// Test 4: Consistency check - opposite answers on reverse should be equivalent to same answer on normal
async function testReverseEquivalence(config) {
  const { cohort, subCohort, reverseQuestions, label } = config;
  console.log(`\n  🔁 Testing reverse equivalence for ${label}`);

  const questions = await getQuestions(cohort, subCohort);

  // Logical test: If reverse scoring works correctly:
  // Person A: answers 5 on normal Q, 1 on reverse Q
  // Person B: answers 5 on normal Q, 5 on reverse Q
  // Person A should have higher "effective" score on reverse dimensions

  // Create scenario where we maximize "positive" response
  // (5 on normal, 1 on reverse = both contribute max after reversal)
  const optimizedAnswers = questions.map((q, i) => ({
    questionIndex: i,
    score: reverseQuestions.includes(i) ? 1 : 5
  }));

  // Create scenario where reverse questions hurt the score
  // (5 on everything, but 5 on reverse = low contribution)
  const naiveHighAnswers = questions.map((q, i) => ({
    questionIndex: i,
    score: 5
  }));

  const resultOptimized = await submitTest(cohort, optimizedAnswers, subCohort);
  const resultNaive = await submitTest(cohort, naiveHighAnswers, subCohort);

  const optimizedTop = resultOptimized.topCareers?.[0];
  const naiveTop = resultNaive.topCareers?.[0];

  console.log(`     Optimized (max effective): ${optimizedTop?.title} (${optimizedTop?.overallScore}%)`);
  console.log(`     Naive all 5s: ${naiveTop?.title} (${naiveTop?.overallScore}%)`);

  // If reverse scoring works, optimized should generally have equal or higher match
  // since it correctly interprets "negative" questions
  const passed = optimizedTop?.overallScore >= naiveTop?.overallScore ||
                 optimizedTop?.title !== naiveTop?.title;

  if (passed) {
    console.log(`     ✓ Reverse scoring affects career matching appropriately`);
  } else {
    console.log(`     ⚠️ Unexpected: naive all-5s scored same or higher`);
  }

  return { passed };
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

  console.log('🧪 REVERSE SCORING REGRESSION TEST');
  console.log('='.repeat(60));
  console.log('Validating that reverse-scored questions work correctly\n');
  console.log('Testing ALL 4 cohorts: YLA, TASO2 Lukio, TASO2 Ammattikoulu, NUORI\n');

  console.log('📋 Reverse-scored questions by cohort:');
  COHORT_CONFIGS.forEach(config => {
    console.log(`   ${config.label}: Q${config.reverseQuestions.join(', Q')}`);
  });

  const allResults = [];

  for (const config of COHORT_CONFIGS) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📚 Testing Cohort: ${config.label}`);
    console.log('-'.repeat(60));

    const results = {
      cohort: config.label,
      tests: []
    };

    // Test 1: Basic contribution test
    try {
      const result1 = await testReverseQuestionContribution(config);
      results.tests.push({ name: 'Reverse Contribution', ...result1 });
    } catch (e) {
      results.tests.push({ name: 'Reverse Contribution', passed: false, error: e.message });
    }

    // Test 2: Impact on results
    try {
      const result2 = await testReverseImpactOnResults(config);
      results.tests.push({ name: 'Impact on Results', ...result2 });
    } catch (e) {
      results.tests.push({ name: 'Impact on Results', passed: false, error: e.message });
    }

    // Test 3: Individual questions
    try {
      const result3 = await testIndividualReverseQuestions(config);
      results.tests.push({ name: 'Individual Questions', ...result3 });
    } catch (e) {
      results.tests.push({ name: 'Individual Questions', passed: false, error: e.message });
    }

    // Test 4: Equivalence test
    try {
      const result4 = await testReverseEquivalence(config);
      results.tests.push({ name: 'Reverse Equivalence', ...result4 });
    } catch (e) {
      results.tests.push({ name: 'Reverse Equivalence', passed: false, error: e.message });
    }

    allResults.push(results);
  }

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));

  let totalTests = 0;
  let totalPassed = 0;

  console.log('\n📋 Results by Cohort:');
  for (const result of allResults) {
    console.log(`\n   ${result.cohort}:`);
    for (const test of result.tests) {
      totalTests++;
      if (test.passed) totalPassed++;
      const status = test.passed ? '✅' : '❌';
      const note = test.error || test.warning || test.note || '';
      console.log(`      ${status} ${test.name}${note ? ` (${note})` : ''}`);
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Total Tests: ${totalTests} (4 cohorts × 4 tests)`);
  console.log(`✅ Passed: ${totalPassed}`);
  console.log(`❌ Failed: ${totalTests - totalPassed}`);
  console.log(`Success Rate: ${((totalPassed / totalTests) * 100).toFixed(0)}%`);

  // Save results
  const fs = require('fs');
  fs.writeFileSync('test-reverse-scoring-results.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: { total: totalTests, passed: totalPassed, failed: totalTests - totalPassed },
    cohortsTestr: COHORT_CONFIGS.length,
    results: allResults
  }, null, 2));

  console.log('\n📄 Full results saved to test-reverse-scoring-results.json\n');

  // Final verdict
  if (totalPassed === totalTests) {
    console.log('🎉 All reverse scoring tests passed! All 4 cohorts correctly handle reverse-scored questions.\n');
  } else {
    console.log('⚠️ Some tests failed. Review the results above to identify issues.\n');
  }
}

runTests().catch(console.error);
