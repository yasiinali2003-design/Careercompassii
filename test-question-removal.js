/**
 * Test script to verify question texts are removed from personal analysis
 * Tests all 3 cohorts (YLA, TASO2, NUORI) with 10 different personality profiles each
 */

const { generatePersonalizedProfile } = require('./lib/scoring/personalizedAnalysis');
const { mapStrengthsToAnswers } = require('./lib/scoring/strengthMapping');
const { explainConfidence } = require('./lib/scoring/confidenceExplanations');

// Problematic patterns to check for
const QUESTION_PATTERNS = [
  /Väsyttääkö/i,
  /Haluaisitko.*\?/i,
  /Nauttiko/i,
  /Muistatko.*kun kysyimme/i,
  /kun kysyimme,/i,
  /\(Q\d+/i, // Question number references like (Q1, Q5)
  /—/, // Em dashes
];

// Test personality profiles for each cohort
const YLA_PROFILES = [
  // Profile 1: Tech enthusiast
  { name: 'YLA Tech Enthusiast', answers: Array(30).fill(0).map((_, i) => ({ questionIndex: i, score: i < 7 ? 5 : 3 })) },

  // Profile 2: People person
  { name: 'YLA People Person', answers: Array(30).fill(0).map((_, i) => ({ questionIndex: i, score: i >= 9 && i <= 15 ? 5 : 2 })) },

  // Profile 3: Creative type
  { name: 'YLA Creative', answers: Array(30).fill(0).map((_, i) => ({ questionIndex: i, score: i === 2 || i === 27 ? 5 : 3 })) },

  // Profile 4: Sports/Health focused
  { name: 'YLA Sports/Health', answers: Array(30).fill(0).map((_, i) => ({ questionIndex: i, score: i === 5 || i === 8 ? 5 : 3 })) },

  // Profile 5: Balanced profile
  { name: 'YLA Balanced', answers: Array(30).fill(0).map((_, i) => ({ questionIndex: i, score: 3 })) },

  // Profile 6: Extreme yes/no
  { name: 'YLA Extreme', answers: Array(30).fill(0).map((_, i) => ({ questionIndex: i, score: i % 2 === 0 ? 5 : 1 })) },

  // Profile 7: Nature lover
  { name: 'YLA Nature', answers: Array(30).fill(0).map((_, i) => ({ questionIndex: i, score: i === 4 || i === 17 || i === 29 ? 5 : 2 })) },

  // Profile 8: Leader type
  { name: 'YLA Leader', answers: Array(30).fill(0).map((_, i) => ({ questionIndex: i, score: i === 6 || i === 13 ? 5 : 3 })) },

  // Profile 9: Independent worker
  { name: 'YLA Independent', answers: Array(30).fill(0).map((_, i) => ({ questionIndex: i, score: i === 18 || i === 26 ? 5 : 3 })) },

  // Profile 10: Explorer (neutral)
  { name: 'YLA Explorer', answers: Array(30).fill(0).map((_, i) => ({ questionIndex: i, score: i % 3 === 0 ? 4 : 3 })) },
];

const TASO2_PROFILES = [
  // Profile 1: Tech-focused
  { name: 'TASO2 Tech', answers: Array(30).fill(0).map((_, i) => ({ questionIndex: i, score: i === 0 ? 5 : 3 })) },

  // Profile 2: Healthcare
  { name: 'TASO2 Healthcare', answers: Array(30).fill(0).map((_, i) => ({ questionIndex: i, score: i === 3 || i === 5 ? 5 : 3 })) },

  // Profile 3: Business
  { name: 'TASO2 Business', answers: Array(30).fill(0).map((_, i) => ({ questionIndex: i, score: i === 6 ? 5 : 3 })) },

  // Profile 4: Creative designer
  { name: 'TASO2 Creative', answers: Array(30).fill(0).map((_, i) => ({ questionIndex: i, score: i === 2 ? 5 : 3 })) },

  // Profile 5: Analytical thinker
  { name: 'TASO2 Analytical', answers: Array(30).fill(0).map((_, i) => ({ questionIndex: i, score: i === 1 ? 5 : 3 })) },

  // Profile 6: Hands-on practical
  { name: 'TASO2 Practical', answers: Array(30).fill(0).map((_, i) => ({ questionIndex: i, score: i === 4 ? 5 : 3 })) },

  // Profile 7: Research-oriented
  { name: 'TASO2 Research', answers: Array(30).fill(0).map((_, i) => ({ questionIndex: i, score: i === 8 ? 5 : 3 })) },

  // Profile 8: Teacher/Coach
  { name: 'TASO2 Teacher', answers: Array(30).fill(0).map((_, i) => ({ questionIndex: i, score: i === 9 ? 5 : 3 })) },

  // Profile 9: Leadership focus
  { name: 'TASO2 Leader', answers: Array(30).fill(0).map((_, i) => ({ questionIndex: i, score: i === 7 ? 5 : 3 })) },

  // Profile 10: Balanced generalist
  { name: 'TASO2 Balanced', answers: Array(30).fill(0).map((_, i) => ({ questionIndex: i, score: 3 })) },
];

const NUORI_PROFILES = [
  // Profile 1: Tech career
  { name: 'NUORI Tech', answers: Array(30).fill(0).map((_, i) => ({ questionIndex: i, score: i === 0 ? 5 : 3 })) },

  // Profile 2: Healthcare professional
  { name: 'NUORI Healthcare', answers: Array(30).fill(0).map((_, i) => ({ questionIndex: i, score: i === 1 ? 5 : 3 })) },

  // Profile 3: Finance
  { name: 'NUORI Finance', answers: Array(30).fill(0).map((_, i) => ({ questionIndex: i, score: i === 2 ? 5 : 3 })) },

  // Profile 4: Creative professional
  { name: 'NUORI Creative', answers: Array(30).fill(0).map((_, i) => ({ questionIndex: i, score: i === 3 ? 5 : 3 })) },

  // Profile 5: Engineering
  { name: 'NUORI Engineering', answers: Array(30).fill(0).map((_, i) => ({ questionIndex: i, score: i === 4 ? 5 : 3 })) },

  // Profile 6: Education sector
  { name: 'NUORI Education', answers: Array(30).fill(0).map((_, i) => ({ questionIndex: i, score: i === 5 ? 5 : 3 })) },

  // Profile 7: HR professional
  { name: 'NUORI HR', answers: Array(30).fill(0).map((_, i) => ({ questionIndex: i, score: i === 6 ? 5 : 3 })) },

  // Profile 8: Legal field
  { name: 'NUORI Legal', answers: Array(30).fill(0).map((_, i) => ({ questionIndex: i, score: i === 7 ? 5 : 3 })) },

  // Profile 9: Sales
  { name: 'NUORI Sales', answers: Array(30).fill(0).map((_, i) => ({ questionIndex: i, score: i === 8 ? 5 : 3 })) },

  // Profile 10: Researcher
  { name: 'NUORI Research', answers: Array(30).fill(0).map((_, i) => ({ questionIndex: i, score: i === 9 ? 5 : 3 })) },
];

// Test runner
async function runTests() {
  console.log('='.repeat(80));
  console.log('COMPREHENSIVE TEST: Question Text Removal Verification');
  console.log('Testing all 3 cohorts with 10 different personality profiles each (30 tests total)');
  console.log('='.repeat(80));
  console.log();

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  const failures = [];

  // Test YLA cohort
  console.log('📚 TESTING YLA COHORT (Middle School)');
  console.log('-'.repeat(80));

  for (const profile of YLA_PROFILES) {
    totalTests++;
    const result = await testProfile('YLA', profile);
    if (result.passed) {
      passedTests++;
      console.log(`✅ ${profile.name}: PASSED`);
    } else {
      failedTests++;
      console.log(`❌ ${profile.name}: FAILED`);
      failures.push({ cohort: 'YLA', profile: profile.name, issues: result.issues });
    }
  }
  console.log();

  // Test TASO2 cohort
  console.log('🎓 TESTING TASO2 COHORT (High School/Vocational)');
  console.log('-'.repeat(80));

  for (const profile of TASO2_PROFILES) {
    totalTests++;
    const result = await testProfile('TASO2', profile);
    if (result.passed) {
      passedTests++;
      console.log(`✅ ${profile.name}: PASSED`);
    } else {
      failedTests++;
      console.log(`❌ ${profile.name}: FAILED`);
      failures.push({ cohort: 'TASO2', profile: profile.name, issues: result.issues });
    }
  }
  console.log();

  // Test NUORI cohort
  console.log('💼 TESTING NUORI COHORT (Young Professionals)');
  console.log('-'.repeat(80));

  for (const profile of NUORI_PROFILES) {
    totalTests++;
    const result = await testProfile('NUORI', profile);
    if (result.passed) {
      passedTests++;
      console.log(`✅ ${profile.name}: PASSED`);
    } else {
      failedTests++;
      console.log(`❌ ${profile.name}: FAILED`);
      failures.push({ cohort: 'NUORI', profile: profile.name, issues: result.issues });
    }
  }
  console.log();

  // Summary
  console.log('='.repeat(80));
  console.log('TEST SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total Tests: ${totalTests}`);
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  console.log();

  if (failures.length > 0) {
    console.log('='.repeat(80));
    console.log('FAILURE DETAILS');
    console.log('='.repeat(80));
    failures.forEach(failure => {
      console.log(`\n❌ ${failure.cohort} - ${failure.profile}:`);
      failure.issues.forEach(issue => {
        console.log(`   Pattern matched: ${issue.pattern}`);
        console.log(`   In text: "${issue.text.substring(0, 100)}..."`);
      });
    });
  } else {
    console.log('🎉 ALL TESTS PASSED! No question texts found in personal analysis.');
  }

  return { totalTests, passedTests, failedTests, failures };
}

// Test a single profile
async function testProfile(cohort, profile) {
  try {
    // Generate full personalized profile
    const result = generatePersonalizedProfile(profile.answers, cohort);

    const issues = [];

    // Check all text fields for problematic patterns
    const textsToCheck = [
      result.summary,
      result.strengthsAnalysis,
      result.description,
      ...result.careerHighlights.map(h => h.insight),
      ...result.careerHighlights.map(h => h.whyGoodMatch),
    ];

    // Also check strength mappings if available
    if (result.strengthAnswerMappings) {
      result.strengthAnswerMappings.forEach(mapping => {
        textsToCheck.push(mapping.explanation);
      });
    }

    // Check each text for problematic patterns
    for (const text of textsToCheck) {
      if (!text) continue;

      for (const pattern of QUESTION_PATTERNS) {
        if (pattern.test(text)) {
          issues.push({
            pattern: pattern.toString(),
            text: text
          });
        }
      }
    }

    return {
      passed: issues.length === 0,
      issues
    };
  } catch (error) {
    console.error(`Error testing ${cohort} - ${profile.name}:`, error.message);
    return {
      passed: false,
      issues: [{ pattern: 'ERROR', text: error.message }]
    };
  }
}

// Run the tests
runTests().then(results => {
  if (results.failedTests === 0) {
    console.log('\n✅ SUCCESS: All question text removal tests passed!');
    process.exit(0);
  } else {
    console.log('\n❌ FAILURE: Some tests failed. Review the details above.');
    process.exit(1);
  }
}).catch(error => {
  console.error('Test execution error:', error);
  process.exit(1);
});
