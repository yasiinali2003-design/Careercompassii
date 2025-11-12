#!/usr/bin/env node

/**
 * Comprehensive Cohort Testing Script
 * Tests all 3 cohorts (YLA, TASO2, NUORI) with different answer patterns
 * Makes actual HTTP requests to the local dev server
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Test cases for each cohort
const testCases = {
  YLA: [
    {
      name: "Tech-interested student (Q0 tech high)",
      answers: Array.from({ length: 30 }, (_, i) => ({
        questionIndex: i,
        score: i === 0 ? 5 : i === 6 ? 5 : i === 10 ? 4 : i === 15 ? 5 : i === 20 ? 3 : 3
      })),
      expectedTopics: ["technology", "analytical"]
    },
    {
      name: "People-oriented student (Q4 helping high)",
      answers: Array.from({ length: 30 }, (_, i) => ({
        questionIndex: i,
        score: i === 4 ? 5 : i === 10 ? 5 : i === 16 ? 5 : i === 21 ? 5 : i === 26 ? 4 : 3
      })),
      expectedTopics: ["people", "care"]
    },
    {
      name: "Hands-on/practical student (Q5 manual work high)",
      answers: Array.from({ length: 30 }, (_, i) => ({
        questionIndex: i,
        score: i === 5 ? 5 : i === 17 ? 5 : i === 22 ? 5 : i === 25 ? 5 : i === 27 ? 4 : 3
      })),
      expectedTopics: ["hands_on", "practical"]
    },
    {
      name: "Creative student (Q7 creative high)",
      answers: Array.from({ length: 30 }, (_, i) => ({
        questionIndex: i,
        score: i === 7 ? 5 : i === 12 ? 5 : i === 19 ? 5 : i === 23 ? 4 : i === 28 ? 4 : 3
      })),
      expectedTopics: ["creative", "artistic"]
    },
    {
      name: "Balanced/all 3s",
      answers: Array.from({ length: 30 }, (_, i) => ({
        questionIndex: i,
        score: 3
      })),
      expectedTopics: ["varied"]
    }
  ],
  TASO2: [
    {
      name: "Tech student (Q0, Q4, Q6 coding/web/cybersecurity)",
      answers: Array.from({ length: 30 }, (_, i) => ({
        questionIndex: i,
        score: i === 0 ? 5 : i === 4 ? 5 : i === 6 ? 5 : i === 2 ? 4 : 3
      })),
      expectedTopics: ["technology", "engineering"]
    },
    {
      name: "Leadership student (Q1 leadership, Q3 business)",
      answers: Array.from({ length: 30 }, (_, i) => ({
        questionIndex: i,
        score: i === 1 ? 5 : i === 3 ? 5 : i === 19 ? 5 : i === 20 ? 4 : 3
      })),
      expectedTopics: ["leadership", "business"]
    },
    {
      name: "Sports/Active student (Q3 sports high)",
      answers: Array.from({ length: 30 }, (_, i) => ({
        questionIndex: i,
        score: i === 3 ? 5 : i === 20 ? 4 : i === 21 ? 5 : i === 26 ? 4 : 3
      })),
      expectedTopics: ["sports", "active"]
    },
    {
      name: "Healthcare/helping student (Q7, Q10 helping)",
      answers: Array.from({ length: 30 }, (_, i) => ({
        questionIndex: i,
        score: i === 7 ? 5 : i === 8 ? 4 : i === 10 ? 5 : i === 11 ? 4 : 3
      })),
      expectedTopics: ["people", "healthcare"]
    },
    {
      name: "Legal/Security student (Q5 legal)",
      answers: Array.from({ length: 30 }, (_, i) => ({
        questionIndex: i,
        score: i === 5 ? 5 : i === 2 ? 4 : i === 29 ? 4 : 3
      })),
      expectedTopics: ["legal", "analytical"]
    }
  ],
  NUORI: [
    {
      name: "Business/High-salary focused (Q3, Q10)",
      answers: Array.from({ length: 30 }, (_, i) => ({
        questionIndex: i,
        score: i === 3 ? 5 : i === 10 ? 5 : i === 13 ? 5 : i === 26 ? 5 : 3
      })),
      expectedTopics: ["business", "financial"]
    },
    {
      name: "Work-life balance focused (Q14 balance)",
      answers: Array.from({ length: 30 }, (_, i) => ({
        questionIndex: i,
        score: i === 14 ? 5 : i === 12 ? 5 : i === 18 ? 5 : i === 23 ? 2 : 3
      })),
      expectedTopics: ["balance", "stability"]
    },
    {
      name: "Creative/Media professional (Q2, Q8)",
      answers: Array.from({ length: 30 }, (_, i) => ({
        questionIndex: i,
        score: i === 2 ? 5 : i === 8 ? 5 : i === 17 ? 5 : i === 16 ? 4 : 3
      })),
      expectedTopics: ["creative", "media"]
    },
    {
      name: "International/Travel focused (Q15, Q24)",
      answers: Array.from({ length: 30 }, (_, i) => ({
        questionIndex: i,
        score: i === 15 ? 5 : i === 24 ? 5 : i === 20 ? 4 : i === 27 ? 3 : 3
      })),
      expectedTopics: ["global", "travel"]
    },
    {
      name: "Leadership/Management focused (Q26 leadership)",
      answers: Array.from({ length: 30 }, (_, i) => ({
        questionIndex: i,
        score: i === 26 ? 5 : i === 3 ? 5 : i === 13 ? 4 : i === 25 ? 4 : 3
      })),
      expectedTopics: ["leadership", "management"]
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
  console.log('🧪 CareerCompassi Cohort Testing Suite\n');
  console.log('Testing against: ' + BASE_URL);
  console.log('=' .repeat(70) + '\n');

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

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
          if (response.data.error) {
            console.log(`    Error: ${response.data.error}`);
          }
          failedTests++;
          continue;
        }

        const result = response.data;

        if (!result.success) {
          console.log(`    ❌ API returned success: false`);
          console.log(`    Error: ${result.error || 'Unknown error'}`);
          failedTests++;
          continue;
        }

        // Display results
        console.log(`    ✅ Test completed successfully`);

        if (result.careers && result.careers.length > 0) {
          console.log(`    📊 Top 3 careers (out of ${result.careers.length}):`);
          result.careers.slice(0, 3).forEach((career, idx) => {
            const matchPercent = (career.matchScore * 100).toFixed(1);
            console.log(`       ${idx + 1}. ${career.title_fi || career.title} (${matchPercent}%)`);
          });
        } else {
          console.log(`    ⚠️  No careers returned`);
        }

        // Check quality score
        if (result.profile?.qualityScore !== undefined) {
          const quality = result.profile.qualityScore >= 0.7 ? '✅' :
                         result.profile.qualityScore >= 0.5 ? '⚠️' :
                         '❌';
          console.log(`    📈 Quality: ${(result.profile.qualityScore * 100).toFixed(1)}% ${quality}`);
        }

        // Check dimensions
        if (result.profile?.dimensionScores) {
          const dims = result.profile.dimensionScores;
          console.log(`    🎨 Dimensions: Interest=${dims.interests?.toFixed(2)} Work=${dims.workstyle?.toFixed(2)} Values=${dims.values?.toFixed(2)}`);
        }

        // Check education path
        if (result.educationPath) {
          console.log(`    🎓 Education: ${result.educationPath.recommended || 'N/A'}`);
        }

        passedTests++;

      } catch (error) {
        console.log(`    ❌ Test failed: ${error.message}`);
        failedTests++;
      }

      // Small delay between requests
      await delay(100);
    }
  }

  // Summary
  console.log('\n\n' + '='.repeat(70));
  console.log('📊 Test Summary:');
  console.log(`   Total: ${totalTests}`);
  console.log(`   ✅ Passed: ${passedTests}`);
  console.log(`   ❌ Failed: ${failedTests}`);
  console.log(`   Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  console.log('='.repeat(70) + '\n');

  if (failedTests === 0) {
    console.log('🎉 All tests passed! The system is working correctly.\n');
  } else {
    console.log('⚠️  Some tests failed. Please check the errors above.\n');
    process.exit(1);
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
