#!/usr/bin/env node

/**
 * Test New Careers on Production
 * Tests the 75 new modern/progressive careers on live production site
 */

const https = require('https');

// UPDATE THIS with your actual production URL
const PRODUCTION_URL = process.argv[2] || 'https://careercompassii.vercel.app';

console.log(`\n🌐 Testing against PRODUCTION: ${PRODUCTION_URL}\n`);
console.log('⚠️  NOTE: Make sure you provide the correct production URL:');
console.log('   node test-production-careers.js https://your-app.vercel.app\n');

// Test cases targeting different new career types
const testCases = [
  {
    name: "Tech Startup Enthusiast",
    cohort: "NUORI",
    description: "Should match: Product Manager, Growth Hacker, DevOps Engineer, etc.",
    expectedCareers: ["Product Manager", "Growth Hacker", "UX Researcher", "Data Analyst", "DevOps"],
    answers: [
      5, 3, 3, 5, 4, 2, 4, 2, 3, 4,
      5, 4, 3, 5, 4, 3, 4, 5, 3, 5,
      3, 5, 4, 3, 4, 4, 4, 4, 5, 4
    ].map((score, i) => ({ questionIndex: i, score }))
  },
  {
    name: "Creative Content Creator",
    cohort: "NUORI",
    description: "Should match: Content Creator, Social Media Manager, Video Editor, etc.",
    expectedCareers: ["Content Creator", "Social Media Manager", "Video Editor", "Podcast Producer", "Brand Designer"],
    answers: [
      3, 3, 5, 3, 3, 2, 3, 3, 5, 3,
      3, 4, 3, 3, 5, 4, 4, 5, 3, 3,
      3, 4, 5, 3, 4, 3, 3, 4, 5, 5
    ].map((score, i) => ({ questionIndex: i, score }))
  },
  {
    name: "Social Impact Activist",
    cohort: "NUORI",
    description: "Should match: Diversity & Inclusion, Social Justice, Community Organizer",
    expectedCareers: ["Diversity", "Social Justice", "Community Organizer", "Gender Equality"],
    answers: [
      2, 5, 4, 2, 3, 5, 3, 5, 4, 2,
      5, 5, 5, 3, 4, 3, 2, 3, 3, 2,
      3, 2, 3, 5, 3, 3, 4, 5, 3, 3
    ].map((score, i) => ({ questionIndex: i, score }))
  }
];

// Make HTTPS request
function makeRequest(url, cohort, answers) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      cohort: cohort,
      answers: answers
    });

    const urlObj = new URL(url + '/api/score');

    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
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
  console.log('🧪 Testing 75 New Helsinki Careers on PRODUCTION\n');
  console.log('Testing against: ' + PRODUCTION_URL);
  console.log('='.repeat(80) + '\n');

  let totalTests = 0;
  let successfulMatches = 0;
  let failedMatches = 0;
  const detailedResults = [];

  for (let i = 0; i < testCases.length; i++) {
    const test = testCases[i];
    totalTests++;

    console.log(`\n${i + 1}/${testCases.length}: ${test.name}`);
    console.log(`Description: ${test.description}`);
    console.log('-'.repeat(80));

    try {
      const response = await makeRequest(PRODUCTION_URL, test.cohort, test.answers);

      if (response.statusCode !== 200 || !response.data.success) {
        console.log(`    ❌ Request failed (Status: ${response.statusCode})`);
        failedMatches++;
        continue;
      }

      const result = response.data;

      if (!result.topCareers || result.topCareers.length === 0) {
        console.log(`    ⚠️  No careers returned`);
        failedMatches++;
        continue;
      }

      // Check if any expected careers appear in top 10
      const topCareerTitles = result.topCareers.slice(0, 10).map(c => c.title);
      const matchedExpected = test.expectedCareers.filter(expected =>
        topCareerTitles.some(title => title.includes(expected) || expected.includes(title))
      );

      console.log(`    ✅ Got ${result.topCareers.length} career matches`);
      console.log(`    📊 Top 10 careers:`);
      result.topCareers.slice(0, 10).forEach((career, idx) => {
        const matchPercent = career.overallScore || (career.matchScore * 100);
        const isExpected = test.expectedCareers.some(e =>
          career.title.includes(e) || e.includes(career.title)
        );
        const marker = isExpected ? '🎯' : '  ';
        console.log(`       ${marker} ${idx + 1}. ${career.title} (${matchPercent}%)`);
      });

      console.log(`\n    🎯 Expected careers found: ${matchedExpected.length}/${test.expectedCareers.length}`);
      if (matchedExpected.length > 0) {
        matchedExpected.forEach(career => console.log(`       ✓ ${career}`));
        successfulMatches++;
      } else {
        console.log(`       ⚠️  None of the expected new careers appeared in top 10`);
        failedMatches++;
      }

      detailedResults.push({
        name: test.name,
        success: matchedExpected.length > 0,
        matchedCount: matchedExpected.length,
        expectedCount: test.expectedCareers.length,
        topCareers: topCareerTitles.slice(0, 5)
      });

    } catch (error) {
      console.log(`    ❌ Test failed: ${error.message}`);
      failedMatches++;
    }

    await delay(500); // Longer delay for production
  }

  // Summary
  console.log('\n\n' + '='.repeat(80));
  console.log('📊 PRODUCTION TEST SUMMARY:');
  console.log('='.repeat(80));
  console.log(`   Production URL: ${PRODUCTION_URL}`);
  console.log(`   Total test profiles: ${totalTests}`);
  console.log(`   ✅ Successful matches: ${successfulMatches} (${((successfulMatches / totalTests) * 100).toFixed(1)}%)`);
  console.log(`   ❌ Failed matches: ${failedMatches} (${((failedMatches / totalTests) * 100).toFixed(1)}%)`);
  console.log('');

  // Detailed breakdown
  console.log('📋 DETAILED RESULTS:\n');
  detailedResults.forEach((result, idx) => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.name}`);
    console.log(`   Matched: ${result.matchedCount}/${result.expectedCount} expected careers`);
    console.log(`   Top 5: ${result.topCareers.join(', ')}`);
    console.log('');
  });

  console.log('='.repeat(80));

  if (successfulMatches >= totalTests * 0.75) {
    console.log('✅ NEW CAREERS ARE WORKING WELL IN PRODUCTION! (>75% success rate)');
  } else if (successfulMatches >= totalTests * 0.5) {
    console.log('⚠️  NEW CAREERS NEED SOME TUNING (50-75% success rate)');
  } else {
    console.log('❌ NEW CAREERS NEED SIGNIFICANT IMPROVEMENTS (<50% success rate)');
  }
  console.log('='.repeat(80) + '\n');
}

// Run the tests
console.log('⏳ Starting production tests in 2 seconds...\n');
setTimeout(() => {
  runTests().catch(err => {
    console.error('\n💥 Fatal error:', err.message);
    console.error('\n⚠️  Make sure:');
    console.error('   1. The production URL is correct');
    console.error('   2. The site is deployed and accessible');
    console.error('   3. The /api/score endpoint is working\n');
    process.exit(1);
  });
}, 2000);
