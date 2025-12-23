/**
 * Test 2: Edge Case Answer Patterns Test
 *
 * Tests unusual but valid answer patterns:
 * - Random answers (distracted user simulation)
 * - Extreme contrast (strong opinions in different areas)
 * - Bell curve (mostly neutral with some variance)
 * - Interests-only focus (high on interests, low elsewhere)
 * - Values-only focus (high on values, neutral elsewhere)
 * - Split personality (first half 5s, second half 1s)
 *
 * Validates that the system handles edge cases gracefully without crashing.
 */

const BASE_URL = 'http://localhost:3000';

// Edge case patterns
const EDGE_PATTERNS = {
  random: {
    name: 'Random Answers',
    description: 'Simulates distracted or rushed user',
    generator: () => Math.floor(Math.random() * 5) + 1
  },
  extreme_contrast: {
    name: 'Extreme Contrast',
    description: 'Q0-14 all 5s, Q15-29 all 1s',
    generator: (i) => i < 15 ? 5 : 1
  },
  bell_curve: {
    name: 'Bell Curve Distribution',
    description: 'Mostly 3s with natural variance',
    generator: (i) => {
      const r = Math.random();
      if (r < 0.1) return 1;
      if (r < 0.25) return 2;
      if (r < 0.75) return 3;
      if (r < 0.9) return 4;
      return 5;
    }
  },
  interests_focus: {
    name: 'Interests-Only Focus',
    description: 'High on Q0-14 (interests), neutral elsewhere',
    generator: (i) => i < 15 ? 5 : 3
  },
  values_focus: {
    name: 'Values-Only Focus',
    description: 'Neutral on interests/workstyle, high on Q23-29 (values)',
    generator: (i) => i >= 23 ? 5 : 3
  },
  split_personality: {
    name: 'Split Personality',
    description: 'First 10 questions 5s, rest 1s',
    generator: (i) => i < 10 ? 5 : 1
  },
  inverted_u: {
    name: 'Inverted U Pattern',
    description: 'Low at start, high in middle, low at end',
    generator: (i) => {
      if (i < 10) return 2;
      if (i < 20) return 5;
      return 2;
    }
  },
  sawtooth: {
    name: 'Sawtooth Pattern',
    description: '5,4,3,2,1 repeating',
    generator: (i) => 5 - (i % 5)
  }
};

async function getQuestions(cohort) {
  const response = await fetch(`${BASE_URL}/api/questions?cohort=${cohort}&setIndex=0`);
  if (!response.ok) throw new Error(`Failed to get questions for ${cohort}`);
  const data = await response.json();
  return data.questions || data;
}

async function submitTest(cohort, answers) {
  const response = await fetch(`${BASE_URL}/api/score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cohort, answers })
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }
  return response.json();
}

function calculateStats(answers) {
  const scores = answers.map(a => a.score);
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;

  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  scores.forEach(s => distribution[s]++);

  return {
    mean: mean.toFixed(2),
    variance: variance.toFixed(2),
    stdDev: Math.sqrt(variance).toFixed(2),
    min: Math.min(...scores),
    max: Math.max(...scores),
    distribution
  };
}

async function testEdgePattern(patternKey, cohort) {
  const pattern = EDGE_PATTERNS[patternKey];
  console.log(`\n  Testing: ${pattern.name}`);
  console.log(`  Description: ${pattern.description}`);

  try {
    const questions = await getQuestions(cohort);

    // Generate edge case answers
    const answers = questions.map((q, i) => ({
      questionIndex: i,
      score: pattern.generator(i)
    }));

    const stats = calculateStats(answers);
    console.log(`  📊 Stats: Mean=${stats.mean}, StdDev=${stats.stdDev}, Range=[${stats.min}-${stats.max}]`);
    console.log(`     Distribution: 1s=${stats.distribution[1]}, 2s=${stats.distribution[2]}, 3s=${stats.distribution[3]}, 4s=${stats.distribution[4]}, 5s=${stats.distribution[5]}`);

    // Submit and check for errors
    const startTime = Date.now();
    const result = await submitTest(cohort, answers);
    const responseTime = Date.now() - startTime;

    // Validate response - API returns topCareers and userProfile
    const hasResult = !!result && result.success;
    const careers = result.topCareers || [];
    const hasCareers = careers.length > 0;
    const hasAnalysis = !!result.userProfile?.personalizedAnalysis;
    const topCareer = careers[0];

    console.log(`  🎯 Results (${responseTime}ms):`);
    console.log(`     Has Result: ${hasResult ? '✓' : '✗'}`);
    console.log(`     Has Careers: ${hasCareers ? '✓' : '✗'} (${careers.length} careers)`);
    console.log(`     Has Analysis: ${hasAnalysis ? '✓' : '✗'}`);

    if (topCareer) {
      console.log(`     Top Career: ${topCareer.title} (${topCareer.category})`);
      console.log(`     Match Score: ${topCareer.matchScore}%`);
    }

    // Check for reasonable results
    const isReasonable = hasCareers &&
                         careers.length >= 5 &&
                         topCareer?.matchScore > 0;

    return {
      pattern: patternKey,
      cohort,
      patternName: pattern.name,
      stats,
      responseTime,
      hasResult,
      hasCareers,
      hasAnalysis,
      careerCount: careers.length,
      topCareer: topCareer?.title,
      topCategory: topCareer?.category,
      matchScore: topCareer?.matchScore,
      isReasonable,
      passed: hasResult && hasCareers && !result.error
    };

  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    return {
      pattern: patternKey,
      cohort,
      patternName: pattern.name,
      error: error.message,
      passed: false
    };
  }
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

  console.log('🧪 EDGE CASE ANSWER PATTERNS TEST');
  console.log('='.repeat(60));
  console.log('Testing unusual but valid answer patterns\n');

  const cohorts = ['YLA', 'TASO2', 'NUORI'];
  const patterns = Object.keys(EDGE_PATTERNS);
  const results = [];

  for (const cohort of cohorts) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📚 Testing Cohort: ${cohort}`);
    console.log('-'.repeat(60));

    for (const pattern of patterns) {
      const result = await testEdgePattern(pattern, cohort);
      results.push(result);

      if (result.passed) {
        console.log(`  ✅ PASSED - System handled edge case gracefully`);
      } else if (result.error) {
        console.log(`  ❌ FAILED - ${result.error}`);
      } else {
        console.log(`  ⚠️ WARNING - Unexpected result structure`);
      }
    }
  }

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const errors = results.filter(r => r.error).length;

  console.log(`\nTotal Tests: ${results.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`   (of which ${errors} had errors)`);

  // Response time analysis
  const responseTimes = results.filter(r => r.responseTime).map(r => r.responseTime);
  if (responseTimes.length > 0) {
    const avgTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const maxTime = Math.max(...responseTimes);
    const minTime = Math.min(...responseTimes);
    console.log(`\n⏱️ Response Times:`);
    console.log(`   Average: ${avgTime.toFixed(0)}ms`);
    console.log(`   Range: ${minTime}ms - ${maxTime}ms`);
  }

  // Pattern results
  console.log('\n📋 Results by Pattern:');
  for (const pattern of patterns) {
    const patternResults = results.filter(r => r.pattern === pattern);
    const patternPassed = patternResults.filter(r => r.passed).length;
    console.log(`   ${EDGE_PATTERNS[pattern].name}: ${patternPassed}/${patternResults.length} cohorts passed`);
  }

  // Cohort results
  console.log('\n📋 Results by Cohort:');
  for (const cohort of cohorts) {
    const cohortResults = results.filter(r => r.cohort === cohort);
    const cohortPassed = cohortResults.filter(r => r.passed).length;
    console.log(`   ${cohort}: ${cohortPassed}/${cohortResults.length} patterns passed`);
  }

  // Category distribution analysis
  console.log('\n🏷️ Category Distribution for Edge Cases:');
  const categoryCount = {};
  results.filter(r => r.topCategory).forEach(r => {
    categoryCount[r.topCategory] = (categoryCount[r.topCategory] || 0) + 1;
  });
  Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} times`);
    });

  // Save results
  const fs = require('fs');
  fs.writeFileSync('test-edge-case-patterns-results.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: { total: results.length, passed, failed, errors },
    results
  }, null, 2));

  console.log('\n📄 Full results saved to test-edge-case-patterns-results.json\n');
}

runTests().catch(console.error);
