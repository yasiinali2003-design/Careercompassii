/**
 * DEBUG: Sports Career Penalty Analysis
 *
 * Tests why sports careers (Valmentaja) appear for non-sports profiles
 */

const http = require('http');

// Test a PURE TECH profile - no sports interest whatsoever
// YLA questions mapping:
// Q0 = technology, Q5 = health, Q7 = writing, Q8 = sports, Q9 = arts_culture
const TEST_PROFILES = [
  {
    name: "Pure Tech - All 3s except tech=5",
    description: "Neutral on everything EXCEPT technology",
    answers: [
      5, // Q0: technology = HIGH (0.5->1.0)
      3, // Q1: neutral
      3, // Q2: neutral
      3, // Q3: neutral
      3, // Q4: neutral
      3, // Q5: health = neutral (0.5)
      3, // Q6: neutral
      3, // Q7: writing = neutral (0.5)
      3, // Q8: sports = neutral (0.5)
      3, // Q9: arts_culture = neutral (0.5)
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3
    ],
  },
  {
    name: "Pure Tech - Sports=1 (very low)",
    description: "Tech=5, Sports=1 (explicitly not interested)",
    answers: [
      5, // Q0: technology = HIGH
      3, 3, 3, 3,
      3, // Q5: health = neutral
      3,
      3, // Q7: writing = neutral
      1, // Q8: sports = VERY LOW (0.0)
      3, // Q9: arts_culture = neutral
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3
    ],
  },
  {
    name: "Pure Creative - Sports=1",
    description: "Writing=5, Creative=5, Sports=1",
    answers: [
      3, // Q0: technology = neutral
      3, 3, 3, 3,
      3, // Q5: health = neutral
      3,
      5, // Q7: writing = HIGH
      1, // Q8: sports = VERY LOW
      5, // Q9: arts_culture = HIGH
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3
    ],
  }
];

async function callScoreAPI(answers) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      cohort: 'YLA',
      subCohort: null,
      answers: answers.map((score, index) => ({
        questionIndex: index,
        score
      }))
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/score',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('='.repeat(80));
  console.log('DEBUG: Sports Career Penalty Analysis');
  console.log('Testing why Valmentaja appears for non-sports profiles');
  console.log('='.repeat(80));

  for (const profile of TEST_PROFILES) {
    console.log(`\n${'─'.repeat(70)}`);
    console.log(`▶ ${profile.name}`);
    console.log(`  ${profile.description}`);

    try {
      const response = await callScoreAPI(profile.answers);

      if (!response.success) {
        console.log(`  ❌ API Error: ${response.error}`);
        continue;
      }

      // Debug: Print full response structure
      console.log('\n  📦 Response keys:', Object.keys(response));

      const { topCareers, detailedScores } = response;

      // Print detailed scores structure
      console.log('  📊 detailedScores keys:', detailedScores ? Object.keys(detailedScores) : 'undefined');
      if (detailedScores?.interests) {
        console.log('  📊 interests keys:', Object.keys(detailedScores.interests));
      }

      // Print key subdimension scores - handle nested structure
      const interests = detailedScores?.interests || {};
      console.log(`\n  📊 Key Interest Scores (raw):`);
      console.log(`     technology: ${JSON.stringify(interests.technology)}`);
      console.log(`     health:     ${JSON.stringify(interests.health)}`);
      console.log(`     sports:     ${JSON.stringify(interests.sports)}`);
      console.log(`     writing:    ${JSON.stringify(interests.writing)}`);
      console.log(`     creative:   ${JSON.stringify(interests.creative)}`);

      // Check top 5 careers
      const top5 = (topCareers || []).slice(0, 5);
      console.log(`\n  🎯 Top 5 Careers:`);

      if (!top5 || top5.length === 0) {
        console.log('     No careers returned!');
        continue;
      }

      let hasSportsCareer = false;
      top5.forEach((career, i) => {
        const titleLower = career.title.toLowerCase();
        const isSports = titleLower.includes('valmentaja') ||
                        titleLower.includes('urheil') ||
                        titleLower.includes('liikunta') ||
                        titleLower.includes('fysioterapeutti') ||
                        titleLower.includes('personal trainer');

        if (isSports) hasSportsCareer = true;

        const marker = isSports ? '⚠️ SPORTS' : '✓';
        const score = typeof career.score === 'number' ? career.score.toFixed(1) : career.score;
        console.log(`     ${i+1}. ${career.title} (score: ${score}) ${marker}`);
      });

      if (hasSportsCareer) {
        console.log(`\n  ❌ PROBLEM: Sports career in top 5 for non-sports profile!`);
      } else {
        console.log(`\n  ✅ GOOD: No sports careers in top 5`);
      }

    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
      console.log(`     Stack: ${error.stack}`);
    }
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log('ANALYSIS COMPLETE');
  console.log('='.repeat(80));
}

runTests().catch(console.error);
