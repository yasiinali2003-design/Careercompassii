#!/usr/bin/env node

/**
 * Realistic Answer Testing Script
 * Tests with more realistic answer patterns (mixed scores, not just 3s)
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

// More realistic test cases with varied answers
const testCases = {
  YLA: [
    {
      name: "Strong Tech Interest",
      // Q0=tech, Q6=numbers, Q10=problem-solving, etc.
      answers: [
        5, 4, 3, 4, 3, 4, 5, 2, 3, 4,  // 0-9
        4, 3, 2, 3, 4, 5, 3, 2, 4, 3,  // 10-19
        2, 3, 4, 4, 2, 4, 3, 4, 5, 3   // 20-29
      ].map((score, i) => ({ questionIndex: i, score }))
    },
    {
      name: "Strong People/Helping Interest",
      answers: [
        2, 3, 4, 2, 5, 3, 2, 3, 4, 2,  // 0-9
        5, 4, 3, 5, 4, 3, 5, 2, 4, 3,  // 10-19
        2, 5, 3, 2, 4, 3, 5, 4, 3, 2   // 20-29
      ].map((score, i) => ({ questionIndex: i, score }))
    },
    {
      name: "Strong Hands-on/Practical",
      answers: [
        2, 3, 2, 4, 2, 5, 3, 2, 4, 3,  // 0-9
        3, 4, 2, 3, 4, 3, 2, 5, 4, 3,  // 10-19
        2, 3, 5, 4, 2, 5, 3, 5, 4, 3   // 20-29
      ].map((score, i) => ({ questionIndex: i, score }))
    }
  ],
  TASO2: [
    {
      name: "Strong Tech/IT Profile",
      answers: [
        5, 3, 4, 2, 5, 2, 5, 2, 3, 4,  // 0-9: High on Q0, Q4, Q6 (tech)
        3, 2, 3, 4, 5, 3, 2, 4, 3, 4,  // 10-19
        3, 5, 3, 2, 3, 4, 3, 2, 3, 5   // 20-29
      ].map((score, i) => ({ questionIndex: i, score }))
    },
    {
      name: "Strong Leadership Profile",
      answers: [
        3, 5, 3, 4, 3, 2, 3, 4, 3, 4,  // 0-9: High on Q1 (leadership), Q3 (business)
        4, 3, 4, 3, 5, 3, 4, 3, 4, 5,  // 10-19: High on Q14 (creative), Q19 (entrepreneurship)
        4, 3, 2, 3, 4, 4, 5, 4, 3, 3   // 20-29: High on Q26 (leadership)
      ].map((score, i) => ({ questionIndex: i, score }))
    },
    {
      name: "Strong Healthcare Profile",
      answers: [
        2, 3, 3, 2, 3, 2, 3, 5, 5, 4,  // 0-9: High on Q7, Q8 (helping, psychology)
        5, 5, 4, 4, 3, 3, 2, 3, 4, 3,  // 10-19: High on Q10, Q11, Q12 (people work)
        3, 2, 3, 4, 3, 3, 4, 5, 3, 3   // 20-29
      ].map((score, i) => ({ questionIndex: i, score }))
    },
    {
      name: "Strong Sports/Fitness Profile",
      answers: [
        2, 3, 2, 5, 2, 3, 2, 3, 4, 3,  // 0-9: High on Q3 (sports)
        4, 3, 2, 3, 3, 3, 2, 3, 4, 3,  // 10-19
        5, 4, 3, 2, 4, 5, 3, 4, 3, 4   // 20-29: High on Q20 (active)
      ].map((score, i) => ({ questionIndex: i, score }))
    }
  ],
  NUORI: [
    {
      name: "Business/High Salary Focus",
      answers: [
        4, 3, 2, 5, 4, 2, 3, 4, 3, 2,  // 0-9: High on Q3 (business), Q4 (engineering)
        5, 3, 4, 5, 2, 4, 4, 4, 2, 4,  // 10-19: High on Q10 (salary), Q13 (advancement)
        3, 5, 2, 3, 4, 4, 5, 4, 3, 3   // 20-29: High on Q21 (large company), Q26 (leadership)
      ].map((score, i) => ({ questionIndex: i, score }))
    },
    {
      name: "Creative/Media Focus",
      answers: [
        3, 2, 5, 2, 3, 2, 3, 4, 5, 4,  // 0-9: High on Q2 (creative), Q8 (media)
        3, 4, 3, 2, 5, 3, 4, 5, 3, 3,  // 10-19: High on Q14 (balance), Q17 (creativity)
        3, 2, 4, 3, 3, 3, 3, 5, 3, 5   // 20-29: High on Q27 (teamwork), Q29 (variety)
      ].map((score, i) => ({ questionIndex: i, score }))
    },
    {
      name: "Healthcare Focus",
      answers: [
        3, 5, 2, 2, 3, 5, 4, 3, 3, 2,  // 0-9: High on Q1 (healthcare), Q5 (education)
        3, 5, 4, 3, 5, 2, 4, 4, 3, 3,  // 10-19: High on Q11 (social impact), Q14 (balance)
        3, 2, 3, 4, 2, 3, 3, 5, 3, 3   // 20-29: High on Q27 (teamwork)
      ].map((score, i) => ({ questionIndex: i, score }))
    }
  ]
};

// Make HTTP POST request
function makeRequest(cohort, answers) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      cohort: cohort,
      answers: answers
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/score',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({ statusCode: res.statusCode, data: result });
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

// Delay between requests
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main test runner
async function runTests() {
  console.log('🧪 CareerCompassi Realistic Answer Testing\n');
  console.log('Testing against: ' + BASE_URL);
  console.log('=' .repeat(70) + '\n');

  let totalTests = 0;
  let testsWithResults = 0;
  let testsWithoutResults = 0;

  // Test each cohort
  for (const [cohort, tests] of Object.entries(testCases)) {
    console.log(`\n🎯 Testing ${cohort} Cohort`);
    console.log('-'.repeat(70));

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      totalTests++;

      console.log(`\n  Test ${i + 1}/${tests.length}: ${test.name}`);

      try {
        const response = await makeRequest(cohort, test.answers);

        if (response.statusCode !== 200) {
          console.log(`    ❌ Request failed with status ${response.statusCode}`);
          continue;
        }

        const result = response.data;

        if (!result.success) {
          console.log(`    ❌ API returned success: false`);
          console.log(`    Error: ${result.error || 'Unknown error'}`);
          continue;
        }

        // Display results
        console.log(`    ✅ API call successful`);

        if (result.topCareers && result.topCareers.length > 0) {
          testsWithResults++;
          console.log(`    🎉 Got ${result.topCareers.length} career matches!`);
          console.log(`    📊 Top 5 careers:`);
          result.topCareers.slice(0, 5).forEach((career, idx) => {
            const matchPercent = career.overallScore || (career.matchScore * 100);
            console.log(`       ${idx + 1}. ${career.title} (${matchPercent}%)`);
          });
        } else {
          testsWithoutResults++;
          console.log(`    ⚠️  No careers returned (empty result)`);
        }

        // Quality score
        if (result.userProfile?.qualityScore !== undefined) {
          const quality = result.userProfile.qualityScore >= 0.7 ? '✅ Good' :
                         result.userProfile.qualityScore >= 0.5 ? '⚠️ Moderate' :
                         '❌ Low';
          console.log(`    📈 Quality: ${(result.userProfile.qualityScore * 100).toFixed(1)}% ${quality}`);
        }

        // Dimensions
        if (result.userProfile?.dimensionScores) {
          const dims = result.userProfile.dimensionScores;
          console.log(`    🎨 Dimensions:`);
          console.log(`       Interests: ${dims.interests?.toFixed(2) || 'N/A'}`);
          console.log(`       Workstyle: ${dims.workstyle?.toFixed(2) || 'N/A'}`);
          console.log(`       Values: ${dims.values?.toFixed(2) || 'N/A'}`);
          console.log(`       Context: ${dims.context?.toFixed(2) || 'N/A'}`);
        }

        // Education path
        if (result.educationPath) {
          console.log(`    🎓 Education: ${result.educationPath.recommended || 'N/A'}`);
          if (result.educationPath.reasoning) {
            console.log(`       Reasoning: ${result.educationPath.reasoning.substring(0, 100)}...`);
          }
        }

        // Detailed scores
        if (result.userProfile?.detailedScores) {
          const detailed = result.userProfile.detailedScores;
          console.log(`    🔍 Top subdimensions:`);

          const allSubdims = [];
          for (const [dim, subdims] of Object.entries(detailed)) {
            for (const [subdim, score] of Object.entries(subdims)) {
              allSubdims.push({ dim, subdim, score });
            }
          }

          allSubdims
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .forEach(({ dim, subdim, score }) => {
              console.log(`       ${dim}.${subdim}: ${score.toFixed(2)}`);
            });
        }

      } catch (error) {
        console.log(`    ❌ Test failed: ${error.message}`);
      }

      // Small delay between requests
      await delay(200);
    }
  }

  // Summary
  console.log('\n\n' + '='.repeat(70));
  console.log('📊 Test Summary:');
  console.log(`   Total tests: ${totalTests}`);
  console.log(`   ✅ Tests with career results: ${testsWithResults}`);
  console.log(`   ⚠️  Tests without results: ${testsWithoutResults}`);
  console.log(`   Success Rate: ${((testsWithResults / totalTests) * 100).toFixed(1)}%`);
  console.log('='.repeat(70) + '\n');

  if (testsWithResults > 0) {
    console.log('✅ System is generating career recommendations!\n');
  } else {
    console.log('⚠️  No career recommendations generated. Check scoring logic.\n');
  }
}

// Run the tests
console.log('⏳ Starting tests in 2 seconds...\n');
setTimeout(() => {
  runTests().catch(err => {
    console.error('\n💥 Fatal error:', err.message);
    console.error('\n⚠️  Make sure the dev server is running: npm run dev\n');
    process.exit(1);
  });
}, 2000);
