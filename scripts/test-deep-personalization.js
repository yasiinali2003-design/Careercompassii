/**
 * TEST: Deep Personalization Quality
 *
 * Tests that the new deep personalization system generates truly unique
 * and answer-aware analysis for different profiles.
 */

const http = require('http');

// Test profiles with distinct answer patterns
const TEST_PROFILES = [
  {
    name: "Tech Enthusiast (Strong preferences)",
    description: "All 5s on tech, all 1s on sports",
    cohort: "YLA",
    answers: [
      5, // Q0: technology = VERY HIGH
      5, // Q1: problem solving = VERY HIGH
      3, // Q2: creative
      3, // Q3: hands_on
      3, // Q4: nature
      3, // Q5: health
      3, // Q6: business
      3, // Q7: writing
      1, // Q8: sports = VERY LOW
      3, // Q9: teaching
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3
    ]
  },
  {
    name: "Creative Writer (Mixed preferences)",
    description: "High creativity and writing, low tech",
    cohort: "YLA",
    answers: [
      1, // Q0: technology = VERY LOW
      3, // Q1: problem solving
      5, // Q2: creative = VERY HIGH
      3, // Q3: hands_on
      3, // Q4: nature
      3, // Q5: health
      3, // Q6: business
      5, // Q7: writing = VERY HIGH
      3, // Q8: sports
      4, // Q9: teaching
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3
    ]
  },
  {
    name: "Sports Coach (High sports + people)",
    description: "Strong sports and teaching, moderate health",
    cohort: "YLA",
    answers: [
      3, // Q0: technology
      3, // Q1: problem solving
      3, // Q2: creative
      3, // Q3: hands_on
      3, // Q4: nature
      4, // Q5: health
      3, // Q6: business
      3, // Q7: writing
      5, // Q8: sports = VERY HIGH
      5, // Q9: teaching = VERY HIGH
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3
    ]
  },
  {
    name: "Neutral Explorer (All 3s)",
    description: "No strong preferences - testing fallback",
    cohort: "YLA",
    answers: [
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3
    ]
  },
  {
    name: "Multi-talent (Tech + Creative)",
    description: "Testing rare combo detection",
    cohort: "YLA",
    answers: [
      5, // Q0: technology = VERY HIGH
      5, // Q1: analytical = VERY HIGH
      5, // Q2: creative = VERY HIGH (rare combo!)
      3, // Q3: hands_on
      3, // Q4: nature
      3, // Q5: health
      3, // Q6: business
      3, // Q7: writing
      3, // Q8: sports
      3, // Q9: teaching
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3
    ]
  },
  {
    name: "NUORI Career Changer - Coach",
    description: "Adult interested in teaching/coaching",
    cohort: "NUORI",
    answers: [
      3, // Q0: tech
      4, // Q1: healthcare
      3, // Q2: finance
      2, // Q3: creative - LOW
      3, // Q4: engineering
      5, // Q5: teaching/valmennus = VERY HIGH
      3, // Q6: HR
      3, // Q7: legal
      3, // Q8: sales
      3, // Q9: research
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3
    ]
  }
];

async function callScoreAPI(cohort, answers, subCohort = null) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      cohort,
      subCohort,
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
  console.log('DEEP PERSONALIZATION QUALITY TEST');
  console.log('Testing that each profile gets unique, answer-aware analysis');
  console.log('='.repeat(80));

  const analyses = [];

  for (const profile of TEST_PROFILES) {
    console.log(`\n${'─'.repeat(70)}`);
    console.log(`▶ ${profile.name}`);
    console.log(`  ${profile.description}`);
    console.log(`  Cohort: ${profile.cohort}`);

    try {
      const response = await callScoreAPI(profile.cohort, profile.answers);

      if (!response.success) {
        console.log(`  ❌ API Error: ${response.error}`);
        continue;
      }

      const { userProfile, topCareers } = response;
      const personalizedAnalysis = userProfile?.personalizedAnalysis;
      const topStrengths = userProfile?.topStrengths;

      console.log(`\n  📊 Top Strengths: ${topStrengths?.slice(0, 3).join(', ') || 'N/A'}`);
      console.log(`  🎯 Top Career: ${topCareers?.[0]?.title || 'N/A'}`);

      console.log(`\n  📝 PERSONALIZED ANALYSIS:`);
      console.log('  ' + '─'.repeat(60));

      // Print each paragraph separately for readability
      const paragraphs = (personalizedAnalysis || '').split('\n\n');
      paragraphs.forEach((p, i) => {
        console.log(`  [${i + 1}] ${p.slice(0, 200)}${p.length > 200 ? '...' : ''}`);
        console.log('');
      });

      // Check for personalization indicators
      const hasSpecificAnswer = personalizedAnalysis?.includes('vastauksistasi') ||
                                personalizedAnalysis?.includes('vastauksesi') ||
                                personalizedAnalysis?.includes('Vastauksistasi');
      const hasPatternDetection = personalizedAnalysis?.includes('yhdistelmä') ||
                                  personalizedAnalysis?.includes('harvinainen') ||
                                  personalizedAnalysis?.includes('yhdistät');
      const hasStrengthContext = personalizedAnalysis?.includes('Vahvuutesi') ||
                                 personalizedAnalysis?.includes('korostuvat');

      console.log(`  ✓ References specific answers: ${hasSpecificAnswer ? 'YES' : 'NO'}`);
      console.log(`  ✓ Pattern detection: ${hasPatternDetection ? 'YES' : 'NO'}`);
      console.log(`  ✓ Strength context: ${hasStrengthContext ? 'YES' : 'NO'}`);

      analyses.push({
        name: profile.name,
        analysis: personalizedAnalysis,
        length: personalizedAnalysis?.length || 0
      });

    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
  }

  // Check for uniqueness
  console.log(`\n${'='.repeat(80)}`);
  console.log('UNIQUENESS ANALYSIS');
  console.log('='.repeat(80));

  // Compare first 50 chars of each analysis
  const openings = analyses.map(a => a.analysis?.slice(0, 100) || '');
  const uniqueOpenings = new Set(openings);

  console.log(`\nTotal profiles tested: ${analyses.length}`);
  console.log(`Unique openings: ${uniqueOpenings.size}`);
  console.log(`Uniqueness rate: ${((uniqueOpenings.size / analyses.length) * 100).toFixed(1)}%`);

  if (uniqueOpenings.size === analyses.length) {
    console.log('\n✅ EXCELLENT: All profiles received unique personalized analysis!');
  } else if (uniqueOpenings.size >= analyses.length * 0.8) {
    console.log('\n✓ GOOD: Most profiles received unique personalized analysis.');
  } else {
    console.log('\n⚠️ WARNING: Some profiles may have similar analysis - consider improving personalization.');
  }

  // Show analysis lengths
  console.log('\n📏 Analysis lengths:');
  analyses.forEach(a => {
    console.log(`   ${a.name}: ${a.length} chars`);
  });
}

runTests().catch(console.error);
