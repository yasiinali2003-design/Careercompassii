#!/usr/bin/env node

/**
 * Quick Education Focus Test
 * Tests NUORI Q5 (education question) with high score
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Test case: Strong education focus (NUORI Q5 = 5/5)
const educationTest = {
  name: "Strong Education Focus",
  cohort: "NUORI",
  // Q5 (education) = 5/5, others moderate
  answers: [
    3, 3, 3, 3, 3, 5, 3, 3, 3, 3,  // 0-9: Q5=5 (education)
    3, 3, 3, 3, 3, 3, 3, 3, 3, 3,  // 10-19
    3, 3, 3, 3, 3, 3, 3, 5, 3, 3   // 20-29: Q27=5 (teamwork for teachers)
  ].map((score, i) => ({ questionIndex: i, score }))
};

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

async function runTest() {
  console.log('🧪 Education Focus Test\n');
  console.log('Testing NUORI cohort with education focus (Q5 = 5/5)');
  console.log('=' .repeat(70) + '\n');

  try {
    const response = await makeRequest(educationTest.cohort, educationTest.answers);

    if (response.statusCode !== 200) {
      console.log(`❌ Request failed with status ${response.statusCode}`);
      return;
    }

    const result = response.data;

    if (!result.success) {
      console.log(`❌ API returned success: false`);
      console.log(`Error: ${result.error || 'Unknown error'}`);
      return;
    }

    console.log(`✅ Test completed successfully\n`);

    if (result.topCareers && result.topCareers.length > 0) {
      console.log(`📊 Got ${result.topCareers.length} career matches!\n`);
      console.log(`🎓 Top 10 careers (should include teachers):`);
      result.topCareers.slice(0, 10).forEach((career, idx) => {
        const matchPercent = career.overallScore || (career.matchScore * 100);
        const isTeacher = career.title.toLowerCase().includes('opettaja') ||
                          career.title.toLowerCase().includes('pedagogi') ||
                          career.title.toLowerCase().includes('koulutus');
        const marker = isTeacher ? '✅ TEACHER' : '';
        console.log(`   ${(idx + 1).toString().padStart(2)}. ${career.title.padEnd(40)} ${matchPercent}% ${marker}`);
      });

      // Count teachers in top 10
      const teachersInTop10 = result.topCareers.slice(0, 10).filter(c =>
        c.title.toLowerCase().includes('opettaja') ||
        c.title.toLowerCase().includes('pedagogi') ||
        c.title.toLowerCase().includes('koulutus')
      ).length;

      console.log(`\n📈 Analysis:`);
      console.log(`   Teachers in top 10: ${teachersInTop10}/10`);
      console.log(`   Expected: At least 3-5 teacher careers`);

      if (teachersInTop10 >= 3) {
        console.log(`   ✅ SUCCESS: Education matching is working!`);
      } else {
        console.log(`   ⚠️  WARNING: Not enough teacher careers (only ${teachersInTop10})`);
      }
    } else {
      console.log(`⚠️  No careers returned`);
    }

    // Show education subdimension score
    if (result.userProfile?.detailedScores?.interests?.education) {
      const eduScore = result.userProfile.detailedScores.interests.education;
      console.log(`\n🎨 User education subdimension score: ${eduScore.toFixed(2)}`);
    }

  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  }

  console.log('\n' + '='.repeat(70));
}

console.log('⏳ Starting test in 2 seconds...\n');
setTimeout(() => {
  runTest().catch(err => {
    console.error('\n💥 Fatal error:', err.message);
    console.error('\n⚠️  Make sure the dev server is running: npm run dev\n');
    process.exit(1);
  });
}, 2000);
