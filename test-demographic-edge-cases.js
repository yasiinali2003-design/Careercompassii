/**
 * Test 5: Demographic Edge Cases Test
 *
 * Tests how the system handles edge cases related to cohort selection:
 * 1. Invalid cohort values
 * 2. Mixed case cohort names
 * 3. Empty or null cohorts
 * 4. Cross-cohort answer validation (wrong answer count)
 * 5. Out-of-range scores
 * 6. Missing required fields
 * 7. Duplicate answer indices
 * 8. Negative scores or indices
 *
 * Validates that the API handles edge cases gracefully without crashing.
 */

const BASE_URL = 'http://localhost:3000';

// Test cases for demographic/input validation
const TEST_CASES = {
  // Cohort-related edge cases
  invalid_cohort: {
    name: 'Invalid Cohort Name',
    description: 'Tests response to non-existent cohort',
    request: { cohort: 'INVALID', answers: generateAnswers(30) },
    expectError: true
  },
  lowercase_cohort: {
    name: 'Lowercase Cohort',
    description: 'Tests if lowercase cohort names work',
    request: { cohort: 'yla', answers: generateAnswers(30) },
    expectError: null // Could work or fail depending on implementation
  },
  mixed_case_cohort: {
    name: 'Mixed Case Cohort',
    description: 'Tests if mixed case cohort names work',
    request: { cohort: 'Yla', answers: generateAnswers(30) },
    expectError: null
  },
  empty_cohort: {
    name: 'Empty Cohort',
    description: 'Tests response to empty cohort string',
    request: { cohort: '', answers: generateAnswers(30) },
    expectError: true
  },
  null_cohort: {
    name: 'Null Cohort',
    description: 'Tests response to null cohort',
    request: { cohort: null, answers: generateAnswers(30) },
    expectError: true
  },

  // Answer count edge cases
  too_few_answers: {
    name: 'Too Few Answers',
    description: 'Tests response when only 10 answers provided',
    request: { cohort: 'YLA', answers: generateAnswers(10) },
    expectError: null // System might accept partial or reject
  },
  too_many_answers: {
    name: 'Too Many Answers',
    description: 'Tests response when 50 answers provided',
    request: { cohort: 'YLA', answers: generateAnswers(50) },
    expectError: null
  },
  zero_answers: {
    name: 'Zero Answers',
    description: 'Tests response to empty answer array',
    request: { cohort: 'YLA', answers: [] },
    expectError: true
  },
  null_answers: {
    name: 'Null Answers',
    description: 'Tests response to null answers',
    request: { cohort: 'YLA', answers: null },
    expectError: true
  },

  // Score validation edge cases
  out_of_range_high: {
    name: 'Out of Range Scores (High)',
    description: 'Tests response when scores are > 5',
    request: { cohort: 'YLA', answers: generateAnswersWithScore(30, 10) },
    expectError: null
  },
  out_of_range_low: {
    name: 'Out of Range Scores (Low)',
    description: 'Tests response when scores are < 1',
    request: { cohort: 'YLA', answers: generateAnswersWithScore(30, 0) },
    expectError: null
  },
  negative_scores: {
    name: 'Negative Scores',
    description: 'Tests response to negative score values',
    request: { cohort: 'YLA', answers: generateAnswersWithScore(30, -5) },
    expectError: null
  },
  decimal_scores: {
    name: 'Decimal Scores',
    description: 'Tests response to decimal score values',
    request: { cohort: 'YLA', answers: generateAnswersWithScore(30, 3.5) },
    expectError: null
  },
  string_scores: {
    name: 'String Scores',
    description: 'Tests response when scores are strings',
    request: { cohort: 'YLA', answers: generateStringScores(30) },
    expectError: null
  },

  // Index validation edge cases
  duplicate_indices: {
    name: 'Duplicate Answer Indices',
    description: 'Tests response when same index appears twice',
    request: { cohort: 'YLA', answers: generateDuplicateIndices(30) },
    expectError: null
  },
  negative_indices: {
    name: 'Negative Indices',
    description: 'Tests response to negative index values',
    request: { cohort: 'YLA', answers: generateNegativeIndices(30) },
    expectError: null
  },
  skipped_indices: {
    name: 'Skipped Indices',
    description: 'Tests response when indices skip numbers',
    request: { cohort: 'YLA', answers: generateSkippedIndices() },
    expectError: null
  },

  // Missing fields edge cases
  missing_score: {
    name: 'Missing Score Field',
    description: 'Tests response when answers lack score field',
    request: { cohort: 'YLA', answers: generateMissingField(30, 'score') },
    expectError: null
  },
  missing_index: {
    name: 'Missing Index Field',
    description: 'Tests response when answers lack questionIndex field',
    request: { cohort: 'YLA', answers: generateMissingField(30, 'questionIndex') },
    expectError: null
  },

  // Request format edge cases
  empty_request: {
    name: 'Empty Request Body',
    description: 'Tests response to empty JSON object',
    request: {},
    expectError: true
  },
  no_body: {
    name: 'No Request Body',
    description: 'Tests response when no body is sent',
    request: null,
    expectError: true
  }
};

// Helper functions to generate test data
function generateAnswers(count, baseScore = 3) {
  return Array.from({ length: count }, (_, i) => ({
    questionIndex: i,
    score: baseScore
  }));
}

function generateAnswersWithScore(count, score) {
  return Array.from({ length: count }, (_, i) => ({
    questionIndex: i,
    score: score
  }));
}

function generateStringScores(count) {
  return Array.from({ length: count }, (_, i) => ({
    questionIndex: i,
    score: "3"
  }));
}

function generateDuplicateIndices(count) {
  const answers = generateAnswers(count);
  // Make first and last have same index
  answers[count - 1].questionIndex = 0;
  return answers;
}

function generateNegativeIndices(count) {
  return Array.from({ length: count }, (_, i) => ({
    questionIndex: i - 5, // Will have negative indices for first 5
    score: 3
  }));
}

function generateSkippedIndices() {
  // Only return indices 0, 2, 4, 6, etc.
  return Array.from({ length: 15 }, (_, i) => ({
    questionIndex: i * 2,
    score: 3
  }));
}

function generateMissingField(count, field) {
  return Array.from({ length: count }, (_, i) => {
    const answer = { questionIndex: i, score: 3 };
    delete answer[field];
    return answer;
  });
}

async function submitTest(requestBody) {
  try {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };

    if (requestBody !== null) {
      options.body = JSON.stringify(requestBody);
    }

    const response = await fetch(`${BASE_URL}/api/score`, options);
    const data = await response.json().catch(() => null);

    return {
      status: response.status,
      ok: response.ok,
      data,
      error: !response.ok ? (data?.error || data?.message || `HTTP ${response.status}`) : null
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message,
      networkError: true
    };
  }
}

async function runTestCase(key) {
  const testCase = TEST_CASES[key];
  console.log(`\n  Testing: ${testCase.name}`);
  console.log(`  Description: ${testCase.description}`);

  const result = await submitTest(testCase.request);

  console.log(`  📊 Response:`);
  console.log(`     Status: ${result.status}`);
  console.log(`     Success: ${result.ok ? '✓' : '✗'}`);

  if (result.error) {
    console.log(`     Error: ${result.error}`);
  }

  if (result.ok && result.data) {
    console.log(`     Has Careers: ${result.data.topCareers?.length > 0 ? '✓' : '✗'}`);
    if (result.data.topCareers?.[0]) {
      console.log(`     Top Career: ${result.data.topCareers[0].title}`);
    }
  }

  // Determine if test passed
  let passed;
  let verdict;

  if (testCase.expectError === true) {
    // We expect an error
    passed = !result.ok;
    verdict = passed ? 'Correctly rejected' : 'Should have rejected but accepted';
  } else if (testCase.expectError === false) {
    // We expect success
    passed = result.ok;
    verdict = passed ? 'Correctly accepted' : 'Should have accepted but rejected';
  } else {
    // Either is acceptable - just checking it doesn't crash
    passed = result.status !== 500 && !result.networkError;
    verdict = passed ? 'Handled gracefully' : 'Server error or crash';
  }

  console.log(`  ${passed ? '✅' : '❌'} ${verdict}`);

  return {
    name: testCase.name,
    key,
    description: testCase.description,
    expectError: testCase.expectError,
    status: result.status,
    ok: result.ok,
    error: result.error,
    passed,
    verdict,
    hasResult: result.ok && result.data?.topCareers?.length > 0
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

  console.log('🧪 DEMOGRAPHIC EDGE CASES TEST');
  console.log('='.repeat(60));
  console.log('Testing API validation and edge case handling\n');

  const results = [];
  const testKeys = Object.keys(TEST_CASES);

  // Group tests by category
  const categories = {
    'Cohort Validation': ['invalid_cohort', 'lowercase_cohort', 'mixed_case_cohort', 'empty_cohort', 'null_cohort'],
    'Answer Count Validation': ['too_few_answers', 'too_many_answers', 'zero_answers', 'null_answers'],
    'Score Validation': ['out_of_range_high', 'out_of_range_low', 'negative_scores', 'decimal_scores', 'string_scores'],
    'Index Validation': ['duplicate_indices', 'negative_indices', 'skipped_indices'],
    'Missing Fields': ['missing_score', 'missing_index'],
    'Request Format': ['empty_request', 'no_body']
  };

  for (const [category, keys] of Object.entries(categories)) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📂 ${category}`);
    console.log('-'.repeat(60));

    for (const key of keys) {
      const result = await runTestCase(key);
      results.push(result);
    }
  }

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const correctRejections = results.filter(r => r.passed && !r.ok).length;
  const gracefulHandles = results.filter(r => r.passed && r.ok).length;

  console.log(`\nTotal Tests: ${results.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`\nBreakdown:`);
  console.log(`   Correctly Rejected Invalid Input: ${correctRejections}`);
  console.log(`   Gracefully Handled Edge Cases: ${gracefulHandles}`);

  // By category
  console.log('\n📋 Results by Category:');
  for (const [category, keys] of Object.entries(categories)) {
    const categoryResults = results.filter(r => keys.includes(r.key));
    const categoryPassed = categoryResults.filter(r => r.passed).length;
    console.log(`   ${category}: ${categoryPassed}/${categoryResults.length}`);
  }

  // Failed tests detail
  const failedTests = results.filter(r => !r.passed);
  if (failedTests.length > 0) {
    console.log('\n⚠️ Failed Tests:');
    failedTests.forEach(t => {
      console.log(`   - ${t.name}: ${t.verdict}`);
    });
  }

  // Security observations
  console.log('\n🔐 Security Observations:');
  const serverErrors = results.filter(r => r.status === 500);
  if (serverErrors.length > 0) {
    console.log(`   ⚠️ ${serverErrors.length} tests caused server errors (500)`);
    serverErrors.forEach(t => {
      console.log(`      - ${t.name}`);
    });
  } else {
    console.log('   ✓ No server errors - API handles edge cases without crashing');
  }

  // Input validation summary
  const acceptedInvalid = results.filter(r => r.ok && r.expectError === true);
  if (acceptedInvalid.length > 0) {
    console.log(`   ⚠️ ${acceptedInvalid.length} invalid inputs were accepted:`);
    acceptedInvalid.forEach(t => {
      console.log(`      - ${t.name}`);
    });
  }

  // Save results
  const fs = require('fs');
  fs.writeFileSync('test-demographic-edge-cases-results.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: { total: results.length, passed, failed, correctRejections, gracefulHandles },
    results
  }, null, 2));

  console.log('\n📄 Full results saved to test-demographic-edge-cases-results.json\n');
}

runTests().catch(console.error);
