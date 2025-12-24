/**
 * LOAD TESTING SCRIPT
 *
 * Simulates concurrent users hitting the API to test performance under load.
 * Tests the scenario of a classroom (30 students) submitting tests simultaneously.
 *
 * Usage: node scripts/load-test.js [url] [concurrent-users]
 * Example: node scripts/load-test.js https://urakompassi.fi 30
 */

const BASE_URL = process.argv[2] || 'http://localhost:3000';
const CONCURRENT_USERS = parseInt(process.argv[3]) || 30;
const COHORTS = ['YLA', 'TASO2', 'NUORI'];

console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    LOAD TESTING SCRIPT                        ║
╠══════════════════════════════════════════════════════════════╣
║  Target: ${BASE_URL.padEnd(50)}║
║  Concurrent Users: ${String(CONCURRENT_USERS).padEnd(42)}║
╚══════════════════════════════════════════════════════════════╝
`);

// Generate random answers for a test
function generateAnswers(count = 30) {
  return Array.from({ length: count }, (_, i) => ({
    questionIndex: i,
    score: Math.floor(Math.random() * 5) + 1
  }));
}

// Simulate a single user journey
async function simulateUser(userId) {
  const cohort = COHORTS[Math.floor(Math.random() * COHORTS.length)];
  const startTime = Date.now();
  const results = {
    userId,
    cohort,
    steps: [],
    success: true,
    totalTime: 0
  };

  try {
    // Step 1: Fetch questions
    const questionsStart = Date.now();
    const questionsRes = await fetch(`${BASE_URL}/api/questions?cohort=${cohort}&setIndex=0`);
    results.steps.push({
      name: 'Fetch Questions',
      status: questionsRes.status,
      time: Date.now() - questionsStart,
      success: questionsRes.ok
    });

    if (!questionsRes.ok) {
      results.success = false;
      results.totalTime = Date.now() - startTime;
      return results;
    }

    const questionsData = await questionsRes.json();
    const questions = questionsData.questions || questionsData;

    // Step 2: Submit answers
    const answers = generateAnswers(questions.length);
    const submitStart = Date.now();
    const submitRes = await fetch(`${BASE_URL}/api/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cohort, answers })
    });

    results.steps.push({
      name: 'Submit Test',
      status: submitRes.status,
      time: Date.now() - submitStart,
      success: submitRes.ok
    });

    if (!submitRes.ok) {
      results.success = false;
    }

    results.totalTime = Date.now() - startTime;
    return results;

  } catch (error) {
    results.success = false;
    results.error = error.message;
    results.totalTime = Date.now() - startTime;
    return results;
  }
}

// Run load test with specified concurrency
async function runLoadTest() {
  console.log('🚀 Starting load test...\n');

  // Warm up - single request first
  console.log('  Warming up server...');
  try {
    await fetch(`${BASE_URL}/api/questions?cohort=YLA&setIndex=0`);
    console.log('  ✓ Server is responding\n');
  } catch (error) {
    console.log('  ✗ Server not responding:', error.message);
    console.log('  Make sure the server is running.\n');
    process.exit(1);
  }

  // Run concurrent users
  console.log(`  Launching ${CONCURRENT_USERS} concurrent users...\n`);

  const testStart = Date.now();
  const userPromises = [];

  for (let i = 0; i < CONCURRENT_USERS; i++) {
    userPromises.push(simulateUser(i + 1));
  }

  const results = await Promise.all(userPromises);
  const testDuration = Date.now() - testStart;

  // Analyze results
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  // Calculate step statistics
  const stepStats = {};
  results.forEach(r => {
    r.steps.forEach(step => {
      if (!stepStats[step.name]) {
        stepStats[step.name] = { times: [], successes: 0, failures: 0 };
      }
      stepStats[step.name].times.push(step.time);
      if (step.success) {
        stepStats[step.name].successes++;
      } else {
        stepStats[step.name].failures++;
      }
    });
  });

  // Print results
  console.log('═'.repeat(60));
  console.log('📊 LOAD TEST RESULTS');
  console.log('═'.repeat(60));

  console.log(`\n  Total Duration: ${testDuration}ms`);
  console.log(`  Concurrent Users: ${CONCURRENT_USERS}`);
  console.log(`  Successful: ${successful.length} (${(successful.length / CONCURRENT_USERS * 100).toFixed(0)}%)`);
  console.log(`  Failed: ${failed.length} (${(failed.length / CONCURRENT_USERS * 100).toFixed(0)}%)`);

  console.log('\n  Response Times:');
  const totalTimes = results.map(r => r.totalTime);
  console.log(`    Min: ${Math.min(...totalTimes)}ms`);
  console.log(`    Max: ${Math.max(...totalTimes)}ms`);
  console.log(`    Avg: ${Math.round(totalTimes.reduce((a, b) => a + b, 0) / totalTimes.length)}ms`);
  console.log(`    P95: ${percentile(totalTimes, 95)}ms`);
  console.log(`    P99: ${percentile(totalTimes, 99)}ms`);

  console.log('\n  Step Breakdown:');
  Object.entries(stepStats).forEach(([name, stats]) => {
    const avgTime = Math.round(stats.times.reduce((a, b) => a + b, 0) / stats.times.length);
    const successRate = (stats.successes / (stats.successes + stats.failures) * 100).toFixed(0);
    console.log(`    ${name}:`);
    console.log(`      Success Rate: ${successRate}%`);
    console.log(`      Avg Time: ${avgTime}ms`);
    console.log(`      Max Time: ${Math.max(...stats.times)}ms`);
  });

  // Cohort distribution
  console.log('\n  Cohort Distribution:');
  const cohortCounts = {};
  results.forEach(r => {
    cohortCounts[r.cohort] = (cohortCounts[r.cohort] || 0) + 1;
  });
  Object.entries(cohortCounts).forEach(([cohort, count]) => {
    console.log(`    ${cohort}: ${count} users`);
  });

  // Errors
  if (failed.length > 0) {
    console.log('\n  ⚠️ Errors:');
    failed.forEach(r => {
      console.log(`    User ${r.userId}: ${r.error || 'API error'}`);
      r.steps.filter(s => !s.success).forEach(s => {
        console.log(`      - ${s.name}: HTTP ${s.status}`);
      });
    });
  }

  // Verdict
  console.log('\n' + '═'.repeat(60));
  if (successful.length === CONCURRENT_USERS) {
    const avgTime = Math.round(totalTimes.reduce((a, b) => a + b, 0) / totalTimes.length);
    if (avgTime < 1000) {
      console.log('✅ PASSED - All users completed successfully with good response times');
    } else if (avgTime < 3000) {
      console.log('⚠️ WARNING - All users completed but response times are slow');
    } else {
      console.log('⚠️ WARNING - Response times are very slow, consider optimization');
    }
  } else {
    console.log('❌ FAILED - Some users experienced errors');
  }
  console.log('═'.repeat(60) + '\n');

  // Throughput
  const requestsPerSecond = (CONCURRENT_USERS * 2) / (testDuration / 1000);
  console.log(`  Throughput: ${requestsPerSecond.toFixed(1)} requests/second\n`);

  // Save results
  const fs = require('fs');
  const reportPath = `load-test-results-${Date.now()}.json`;
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    config: { baseUrl: BASE_URL, concurrentUsers: CONCURRENT_USERS },
    summary: {
      duration: testDuration,
      successful: successful.length,
      failed: failed.length,
      avgResponseTime: Math.round(totalTimes.reduce((a, b) => a + b, 0) / totalTimes.length),
      p95ResponseTime: percentile(totalTimes, 95),
      requestsPerSecond
    },
    results
  }, null, 2));

  console.log(`📄 Full report saved to ${reportPath}\n`);
}

// Calculate percentile
function percentile(arr, p) {
  const sorted = [...arr].sort((a, b) => a - b);
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

// Run the test
runLoadTest().catch(console.error);
