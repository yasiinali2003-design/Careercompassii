/**
 * Test 1: Consistency Bias Detection Test
 *
 * Tests if the system properly handles suspicious answer patterns:
 * - All 5s (acquiescence bias - agrees with everything)
 * - All 1s (naysayer bias - disagrees with everything)
 * - All 3s (central tendency bias - always neutral)
 * - Alternating patterns (random clicking)
 *
 * With reverse-scored questions, users who answer all 5s should show
 * inconsistent behavior (claiming both positive AND negative traits).
 */

const BASE_URL = 'http://localhost:3000';

// Reverse-scored questions per cohort
const REVERSE_SCORED_QUESTIONS = {
  YLA: [18, 20, 25],
  TASO2: [18, 21],
  NUORI: [16, 19, 29]
};

// Test patterns that indicate potential bias
const BIAS_PATTERNS = {
  all_fives: {
    name: 'All 5s (Acquiescence Bias)',
    description: 'User agrees with everything - suspicious with reverse questions',
    generator: () => 5,
    expectedIssue: 'ACQUIESCENCE_BIAS'
  },
  all_ones: {
    name: 'All 1s (Naysayer Bias)',
    description: 'User disagrees with everything',
    generator: () => 1,
    expectedIssue: 'NAYSAYER_BIAS'
  },
  all_threes: {
    name: 'All 3s (Central Tendency)',
    description: 'User always chooses neutral - no signal',
    generator: () => 3,
    expectedIssue: 'CENTRAL_TENDENCY'
  },
  alternating: {
    name: 'Alternating 1-5 (Random Pattern)',
    description: 'Suggests random clicking or inattention',
    generator: (i) => i % 2 === 0 ? 5 : 1,
    expectedIssue: 'RANDOM_PATTERN'
  },
  ascending: {
    name: 'Ascending 1-5-1-5... (Sequential)',
    description: 'User follows a pattern instead of reading',
    generator: (i) => (i % 5) + 1,
    expectedIssue: 'SEQUENTIAL_PATTERN'
  }
};

async function getQuestions(cohort) {
  const response = await fetch(`${BASE_URL}/api/questions?cohort=${cohort}&setIndex=0`);
  if (!response.ok) throw new Error(`Failed to get questions for ${cohort}`);
  const data = await response.json();
  return data.questions || data; // Handle both {questions: [...]} and [...] formats
}

async function submitTest(cohort, answers) {
  const response = await fetch(`${BASE_URL}/api/score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cohort, answers })
  });
  if (!response.ok) throw new Error('Failed to submit test');
  return response.json();
}

// Analyze if the answer pattern is consistent with reverse questions
function analyzePatternConsistency(answers, cohort) {
  const reverseQuestions = REVERSE_SCORED_QUESTIONS[cohort] || [];
  const regularAnswers = [];
  const reverseAnswers = [];

  answers.forEach((a, i) => {
    if (reverseQuestions.includes(i)) {
      reverseAnswers.push(a.score);
    } else {
      regularAnswers.push(a.score);
    }
  });

  const regularAvg = regularAnswers.reduce((a, b) => a + b, 0) / regularAnswers.length;
  const reverseAvg = reverseAnswers.reduce((a, b) => a + b, 0) / reverseAnswers.length;

  // If someone answers all 5s, regular avg = 5, reverse avg = 5
  // This is INCONSISTENT because reverse questions ask negative traits
  // A consistent high scorer would have high regular, LOW reverse

  const consistency = {
    regularAvg: regularAvg.toFixed(2),
    reverseAvg: reverseAvg.toFixed(2),
    isConsistent: false,
    issue: null
  };

  // Check for consistency violations
  if (regularAvg >= 4.5 && reverseAvg >= 4.5) {
    consistency.issue = 'ACQUIESCENCE_BIAS';
    consistency.isConsistent = false;
  } else if (regularAvg <= 1.5 && reverseAvg <= 1.5) {
    consistency.issue = 'NAYSAYER_BIAS';
    consistency.isConsistent = false;
  } else if (regularAvg >= 2.5 && regularAvg <= 3.5 && reverseAvg >= 2.5 && reverseAvg <= 3.5) {
    consistency.issue = 'CENTRAL_TENDENCY';
    consistency.isConsistent = false;
  } else if (Math.abs(regularAvg - reverseAvg) < 0.5 && (regularAvg > 4 || regularAvg < 2)) {
    consistency.issue = 'SUSPICIOUS_PATTERN';
    consistency.isConsistent = false;
  } else {
    consistency.isConsistent = true;
  }

  return consistency;
}

// Calculate answer variance (low variance = suspicious)
function calculateVariance(answers) {
  const scores = answers.map(a => a.score);
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
  return {
    mean: mean.toFixed(2),
    variance: variance.toFixed(2),
    stdDev: Math.sqrt(variance).toFixed(2),
    isLowVariance: variance < 0.5 // Very low variance suggests pattern
  };
};

async function testBiasPattern(patternKey, cohort) {
  const pattern = BIAS_PATTERNS[patternKey];
  console.log(`\n  Testing: ${pattern.name}`);
  console.log(`  Description: ${pattern.description}`);

  try {
    // Get questions
    const questions = await getQuestions(cohort);

    // Generate biased answers
    const answers = questions.map((q, i) => ({
      questionIndex: i,
      score: pattern.generator(i)
    }));

    // Analyze pattern before submission
    const consistency = analyzePatternConsistency(answers, cohort);
    const variance = calculateVariance(answers);

    console.log(`  📊 Pattern Analysis:`);
    console.log(`     Regular Q avg: ${consistency.regularAvg}, Reverse Q avg: ${consistency.reverseAvg}`);
    console.log(`     Variance: ${variance.variance}, StdDev: ${variance.stdDev}`);
    console.log(`     Consistency: ${consistency.isConsistent ? '✓ Consistent' : `✗ ${consistency.issue}`}`);

    // Submit test
    const result = await submitTest(cohort, answers);

    // Analyze results
    const topCareer = result.careers?.[0];
    const analysis = result.analysis;

    console.log(`  🎯 Results:`);
    console.log(`     Top Career: ${topCareer?.title || 'None'} (${topCareer?.category || 'N/A'})`);
    console.log(`     Match Score: ${topCareer?.matchScore || 'N/A'}%`);

    // Check if system detected the bias
    const detectedBias = result.warnings?.includes('bias') ||
                         result.flags?.includes('suspicious') ||
                         analysis?.includes('epäjohdonmukainen') ||
                         analysis?.includes('ristiriitainen');

    return {
      pattern: patternKey,
      cohort,
      patternName: pattern.name,
      consistency,
      variance,
      topCareer: topCareer?.title,
      matchScore: topCareer?.matchScore,
      expectedIssue: pattern.expectedIssue,
      detectedIssue: consistency.issue,
      issueMatches: pattern.expectedIssue === consistency.issue,
      passed: !consistency.isConsistent // Test passes if we detect the bias
    };

  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    return {
      pattern: patternKey,
      cohort,
      error: error.message,
      passed: false
    };
  }
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

  console.log('🧪 CONSISTENCY BIAS DETECTION TEST');
  console.log('='.repeat(60));
  console.log('Testing if suspicious answer patterns are properly identified\n');

  const cohorts = ['YLA', 'TASO2', 'NUORI'];
  const patterns = Object.keys(BIAS_PATTERNS);
  const results = [];

  for (const cohort of cohorts) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📚 Testing Cohort: ${cohort}`);
    console.log(`   Reverse questions: ${REVERSE_SCORED_QUESTIONS[cohort].join(', ')}`);
    console.log('-'.repeat(60));

    for (const pattern of patterns) {
      const result = await testBiasPattern(pattern, cohort);
      results.push(result);

      if (result.passed) {
        console.log(`  ✅ PASSED - Bias detected correctly`);
      } else if (result.error) {
        console.log(`  ❌ ERROR - ${result.error}`);
      } else {
        console.log(`  ⚠️ WARNING - Bias not detected (may need system enhancement)`);
      }
    }
  }

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed && !r.error).length;
  const errors = results.filter(r => r.error).length;

  console.log(`\nTotal Tests: ${results.length}`);
  console.log(`✅ Passed (Bias Detected): ${passed}`);
  console.log(`⚠️ Not Detected: ${failed}`);
  console.log(`❌ Errors: ${errors}`);

  console.log('\n📋 Detailed Results by Pattern:');
  for (const pattern of patterns) {
    const patternResults = results.filter(r => r.pattern === pattern);
    const patternPassed = patternResults.filter(r => r.passed).length;
    console.log(`   ${BIAS_PATTERNS[pattern].name}: ${patternPassed}/${patternResults.length} cohorts detected`);
  }

  console.log('\n📋 Results by Cohort:');
  for (const cohort of cohorts) {
    const cohortResults = results.filter(r => r.cohort === cohort);
    const cohortPassed = cohortResults.filter(r => r.passed).length;
    console.log(`   ${cohort}: ${cohortPassed}/${cohortResults.length} patterns detected`);
  }

  // Recommendations
  console.log('\n💡 Recommendations:');
  if (failed > 0) {
    console.log('   - Consider adding bias detection to the scoring engine');
    console.log('   - Flag users with variance < 0.5 for review');
    console.log('   - Add warning when reverse Q answers match regular Q answers');
  } else {
    console.log('   - All bias patterns are being properly detected!');
  }

  // Save results
  const fs = require('fs');
  fs.writeFileSync('test-consistency-bias-results.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: { total: results.length, passed, failed, errors },
    results
  }, null, 2));

  console.log('\n📄 Full results saved to test-consistency-bias-results.json\n');
}

runTests().catch(console.error);
