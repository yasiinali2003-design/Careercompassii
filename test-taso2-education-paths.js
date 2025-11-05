const fetch = require('node-fetch');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

// Generate complete TASO2 answers (all 30 questions)
function generateCompleteTASO2Answers() {
  const answers = [];
  for (let i = 0; i < 30; i++) {
    answers.push({
      questionIndex: i,
      score: Math.floor(Math.random() * 5) + 1 // 1-5
    });
  }
  return answers;
}

// Generate answers that strongly favor specific paths
function generatePathFavoredAnswers(path) {
  const answers = [];
  for (let i = 0; i < 30; i++) {
    answers.push({
      questionIndex: i,
      score: 3 // Default neutral
    });
  }
  
  // Modify answers to strongly favor specific path
  switch (path) {
    case 'yliopisto':
      // High scores on analytical/research questions
      answers[2].score = 5; // Numeroiden analysointi
      answers[8].score = 5; // Mielen ymmärtäminen
      answers[17].score = 5; // Kirjoittaminen
      answers[25].score = 5; // Ympäristön suojelu
      answers[29].score = 5; // Laboratorio/kokeet
      // Low scores on hands-on
      answers[21].score = 1; // Rakentaminen
      answers[22].score = 1; // Autot
      answers[23].score = 1; // Sähköasennukset
      break;
    case 'amk':
      // High scores on practical tech questions
      answers[0].score = 5; // Koodaaminen
      answers[1].score = 5; // Tietokoneet
      answers[3].score = 5; // Tekniset ongelmat
      answers[4].score = 5; // Nettisivut/sovellukset
      answers[6].score = 5; // Tietoturva
      answers[7].score = 5; // Auttaa ihmisiä terveydessä
      answers[11].score = 5; // Lasten/nuorten kanssa
      break;
  }
  
  return answers;
}

async function testTASO2EducationPath(testName, answers, delay = 1000) {
  // Wait to avoid rate limiting
  await new Promise(resolve => setTimeout(resolve, delay));
  
  console.log(`\n🧪 Testing: ${testName}`);
  try {
    const response = await fetch(`${BASE_URL}/api/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cohort: 'TASO2',
        answers: answers,
        originalIndices: answers.map((_, i) => i),
        shuffleKey: 'test'
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText.substring(0, 200)}`);
    }

    const data = await response.json();
    
    if (data.success && data.educationPath) {
      const ep = data.educationPath;
      const scores = ep.scores;
      const primaryScore = scores[ep.primary];
      
      console.log(`  ✅ PASSED`);
      console.log(`     Primary Path: ${ep.primary} (${Math.round(primaryScore)}%)`);
      console.log(`     Confidence: ${ep.confidence}`);
      if (ep.secondary) {
        console.log(`     Secondary Path: ${ep.secondary} (${Math.round(scores[ep.secondary])}%)`);
      }
      console.log(`     Reasoning Length: ${ep.reasoning.length} characters`);
      console.log(`     All Scores: Yliopisto ${Math.round(scores.yliopisto)}%, AMK ${Math.round(scores.amk)}%`);
      
      return { 
        passed: true, 
        path: ep.primary, 
        confidence: ep.confidence,
        scores: scores
      };
    } else {
      console.log(`  ❌ FAILED - No education path returned`);
      console.log(`     Success: ${data.success}`);
      console.log(`     Has educationPath: ${!!data.educationPath}`);
      console.log(`     Error: ${data.error || 'None'}`);
      return { passed: false, error: 'No education path' };
    }
  } catch (error) {
    console.error(`  ❌ FAILED - Error: ${error.message}`);
    return { passed: false, error: error.message };
  }
}

async function runAllTests() {
  console.log('🧪 TASO2 Education Paths Test Suite (Multiple Runs)\n');
  console.log(`Testing API endpoint: /api/score`);
  console.log(`Base URL: ${BASE_URL}\n`);
  console.log('='.repeat(70));

  const testResults = [];

  // Test path-favored scenarios
  console.log('\n📋 Path-Favored Tests:');
  testResults.push(await testTASO2EducationPath('Yliopisto-Favored', generatePathFavoredAnswers('yliopisto'), 1500));
  testResults.push(await testTASO2EducationPath('AMK-Favored', generatePathFavoredAnswers('amk'), 1500));

  // Multiple random runs
  console.log('\n📋 Random Tests (Multiple Runs):');
  for (let i = 1; i <= 10; i++) {
    const randomAnswers = generateCompleteTASO2Answers();
    testResults.push(await testTASO2EducationPath(`Random Run ${i}`, randomAnswers, 1500));
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('\n📊 Test Results Summary:\n');
  
  const passed = testResults.filter(r => r.passed).length;
  const failed = testResults.filter(r => !r.passed).length;
  
  console.log(`   ✅ Passed: ${passed}/${testResults.length}`);
  console.log(`   ❌ Failed: ${failed}/${testResults.length}`);
  
  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    testResults.forEach((result, index) => {
      if (!result.passed) {
        console.log(`   Test ${index + 1}: ${result.error || 'Unknown error'}`);
      }
    });
  }

  // Path distribution
  const pathDistribution = {};
  testResults.forEach(r => {
    if (r.passed && r.path) {
      pathDistribution[r.path] = (pathDistribution[r.path] || 0) + 1;
    }
  });
  
  console.log('\n📈 Path Distribution:');
  Object.entries(pathDistribution).forEach(([path, count]) => {
    const percentage = ((count / passed) * 100).toFixed(1);
    console.log(`   ${path}: ${count} times (${percentage}%)`);
  });

  // Confidence distribution
  const confidenceDistribution = {};
  testResults.forEach(r => {
    if (r.passed && r.confidence) {
      confidenceDistribution[r.confidence] = (confidenceDistribution[r.confidence] || 0) + 1;
    }
  });
  
  console.log('\n📊 Confidence Distribution:');
  Object.entries(confidenceDistribution).forEach(([conf, count]) => {
    const percentage = ((count / passed) * 100).toFixed(1);
    console.log(`   ${conf}: ${count} times (${percentage}%)`);
  });

  // Average scores by path
  const pathScores = { yliopisto: [], amk: [] };
  testResults.forEach(r => {
    if (r.passed && r.scores) {
      Object.keys(pathScores).forEach(path => {
        if (r.scores[path] !== undefined) {
          pathScores[path].push(r.scores[path]);
        }
      });
    }
  });

  console.log('\n📊 Average Scores by Path:');
  Object.entries(pathScores).forEach(([path, scores]) => {
    if (scores.length > 0) {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      const min = Math.min(...scores);
      const max = Math.max(...scores);
      console.log(`   ${path}: Avg ${avg.toFixed(1)}% (Range: ${min.toFixed(1)}% - ${max.toFixed(1)}%)`);
    }
  });

  if (failed > 0) {
    console.log('\n⚠️  Some tests failed. Please review the errors above.');
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed!');
    process.exit(0);
  }
}

runAllTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
