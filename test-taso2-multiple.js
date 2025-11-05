const fetch = require('node-fetch');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

function generateCompleteTASO2Answers() {
  const answers = [];
  for (let i = 0; i < 30; i++) {
    answers.push({
      questionIndex: i,
      score: Math.floor(Math.random() * 5) + 1
    });
  }
  return answers;
}

async function testRun(runNumber) {
  await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
  
  const answers = generateCompleteTASO2Answers();
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

    const data = await response.json();
    
    if (data.success && data.educationPath) {
      const ep = data.educationPath;
      return {
        run: runNumber,
        path: ep.primary,
        confidence: ep.confidence,
        reasoningLength: ep.reasoning.length,
        scores: ep.scores
      };
    }
    return { run: runNumber, error: 'No education path' };
  } catch (error) {
    return { run: runNumber, error: error.message };
  }
}

async function runMultipleTests() {
  console.log('🧪 Running 20 TASO2 Education Path Tests\n');
  
  const results = [];
  for (let i = 1; i <= 20; i++) {
    const result = await testRun(i);
    results.push(result);
    if (result.error) {
      console.log(`Run ${i}: ❌ ${result.error}`);
    } else {
      console.log(`Run ${i}: ✅ ${result.path} (${result.confidence}, ${result.reasoningLength} chars)`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Summary:\n');
  
  const successful = results.filter(r => !r.error);
  console.log(`✅ Successful: ${successful.length}/20`);
  console.log(`❌ Failed: ${results.filter(r => r.error).length}/20`);
  
  const pathCounts = {};
  const confidenceCounts = {};
  successful.forEach(r => {
    pathCounts[r.path] = (pathCounts[r.path] || 0) + 1;
    confidenceCounts[r.confidence] = (confidenceCounts[r.confidence] || 0) + 1;
  });
  
  console.log('\n📈 Path Distribution:');
  Object.entries(pathCounts).forEach(([path, count]) => {
    console.log(`   ${path}: ${count} (${((count/successful.length)*100).toFixed(1)}%)`);
  });
  
  console.log('\n📊 Confidence Distribution:');
  Object.entries(confidenceCounts).forEach(([conf, count]) => {
    console.log(`   ${conf}: ${count} (${((count/successful.length)*100).toFixed(1)}%)`);
  });
  
  const avgReasoningLength = successful.reduce((sum, r) => sum + r.reasoningLength, 0) / successful.length;
  console.log(`\n📝 Average Reasoning Length: ${Math.round(avgReasoningLength)} characters`);
  
  if (successful.length === 20) {
    console.log('\n🎉 All tests passed!');
  }
}

runMultipleTests().catch(console.error);

