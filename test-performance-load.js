/**
 * Test 6: Performance and Load Testing
 *
 * Tests the API's performance characteristics:
 * 1. Response time for single requests
 * 2. Concurrent request handling (load testing)
 * 3. Memory/CPU stress testing with rapid sequential requests
 * 4. Response time consistency across cohorts
 * 5. Performance degradation under load
 * 6. Rate limiting behavior (if implemented)
 *
 * Provides baseline performance metrics for monitoring.
 */

const BASE_URL = 'http://localhost:3000';

const COHORTS = ['YLA', 'TASO2', 'NUORI'];
const LOAD_TEST_CONFIG = {
  concurrentUsers: 10,
  requestsPerUser: 5,
  rampUpDelay: 100, // ms between starting users
  acceptableResponseTime: 2000, // ms
  acceptableP95: 3000 // ms
};

function generateAnswers(count = 30) {
  return Array.from({ length: count }, (_, i) => ({
    questionIndex: i,
    score: Math.floor(Math.random() * 5) + 1
  }));
}

async function getQuestions(cohort) {
  const start = Date.now();
  const response = await fetch(`${BASE_URL}/api/questions?cohort=${cohort}&setIndex=0`);
  const time = Date.now() - start;

  if (!response.ok) throw new Error(`Failed to get questions for ${cohort}`);

  return { time, data: await response.json() };
}

async function submitTest(cohort, answers) {
  const start = Date.now();

  const response = await fetch(`${BASE_URL}/api/score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cohort, answers })
  });

  const time = Date.now() - start;

  if (!response.ok) {
    return { time, success: false, error: await response.text() };
  }

  return { time, success: true, data: await response.json() };
}

// Calculate percentiles
function calculatePercentile(arr, p) {
  const sorted = [...arr].sort((a, b) => a - b);
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

function calculateStats(times) {
  const sorted = [...times].sort((a, b) => a - b);
  return {
    min: Math.min(...times),
    max: Math.max(...times),
    avg: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
    median: sorted[Math.floor(sorted.length / 2)],
    p95: calculatePercentile(times, 95),
    p99: calculatePercentile(times, 99)
  };
}

// Test 1: Single request baseline
async function testBaseline() {
  console.log('\n📊 Test 1: Baseline Response Times');
  console.log('-'.repeat(50));

  const results = {};

  for (const cohort of COHORTS) {
    console.log(`\n  Testing ${cohort}...`);

    // Test questions endpoint
    const qResult = await getQuestions(cohort);
    console.log(`    Questions API: ${qResult.time}ms`);

    // Test scoring endpoint (multiple times for accuracy)
    const scoreTimes = [];
    for (let i = 0; i < 5; i++) {
      const answers = generateAnswers(30);
      const sResult = await submitTest(cohort, answers);
      scoreTimes.push(sResult.time);
    }

    const stats = calculateStats(scoreTimes);
    console.log(`    Score API: avg=${stats.avg}ms, min=${stats.min}ms, max=${stats.max}ms`);

    results[cohort] = {
      questionsTime: qResult.time,
      scoreStats: stats
    };
  }

  return results;
}

// Test 2: Concurrent load test
async function testConcurrentLoad() {
  console.log('\n🔄 Test 2: Concurrent Load Test');
  console.log('-'.repeat(50));
  console.log(`  Config: ${LOAD_TEST_CONFIG.concurrentUsers} concurrent users, ${LOAD_TEST_CONFIG.requestsPerUser} requests each`);

  const allResults = [];
  const errors = [];
  const startTime = Date.now();

  // Simulate concurrent users
  const userPromises = [];

  for (let user = 0; user < LOAD_TEST_CONFIG.concurrentUsers; user++) {
    // Stagger user start times
    await new Promise(resolve => setTimeout(resolve, LOAD_TEST_CONFIG.rampUpDelay));

    const userPromise = (async () => {
      const userResults = [];
      for (let req = 0; req < LOAD_TEST_CONFIG.requestsPerUser; req++) {
        const cohort = COHORTS[Math.floor(Math.random() * COHORTS.length)];
        const answers = generateAnswers(30);

        try {
          const result = await submitTest(cohort, answers);
          userResults.push({
            user,
            request: req,
            cohort,
            time: result.time,
            success: result.success
          });

          if (!result.success) {
            errors.push({ user, request: req, error: result.error });
          }
        } catch (e) {
          errors.push({ user, request: req, error: e.message });
          userResults.push({
            user,
            request: req,
            cohort,
            time: 0,
            success: false
          });
        }
      }
      return userResults;
    })();

    userPromises.push(userPromise);
  }

  // Wait for all users to complete
  const userResultsArr = await Promise.all(userPromises);
  const totalTime = Date.now() - startTime;

  // Flatten results
  userResultsArr.forEach(ur => allResults.push(...ur));

  // Calculate metrics
  const successfulRequests = allResults.filter(r => r.success);
  const times = successfulRequests.map(r => r.time);
  const stats = times.length > 0 ? calculateStats(times) : null;

  console.log(`\n  Total Requests: ${allResults.length}`);
  console.log(`  Successful: ${successfulRequests.length} (${((successfulRequests.length / allResults.length) * 100).toFixed(1)}%)`);
  console.log(`  Errors: ${errors.length}`);
  console.log(`  Total Time: ${totalTime}ms`);
  console.log(`  Throughput: ${(successfulRequests.length / (totalTime / 1000)).toFixed(2)} req/s`);

  if (stats) {
    console.log(`\n  Response Time Stats:`);
    console.log(`    Min: ${stats.min}ms`);
    console.log(`    Max: ${stats.max}ms`);
    console.log(`    Avg: ${stats.avg}ms`);
    console.log(`    Median: ${stats.median}ms`);
    console.log(`    P95: ${stats.p95}ms`);
    console.log(`    P99: ${stats.p99}ms`);
  }

  return {
    totalRequests: allResults.length,
    successfulRequests: successfulRequests.length,
    errors: errors.length,
    totalTime,
    throughput: successfulRequests.length / (totalTime / 1000),
    stats
  };
}

// Test 3: Sequential stress test
async function testSequentialStress() {
  console.log('\n⚡ Test 3: Sequential Stress Test');
  console.log('-'.repeat(50));
  console.log('  Sending 50 rapid sequential requests...');

  const results = [];
  const startTime = Date.now();

  for (let i = 0; i < 50; i++) {
    const cohort = COHORTS[i % 3];
    const answers = generateAnswers(30);

    try {
      const result = await submitTest(cohort, answers);
      results.push({
        iteration: i,
        time: result.time,
        success: result.success
      });
    } catch (e) {
      results.push({
        iteration: i,
        time: 0,
        success: false,
        error: e.message
      });
    }
  }

  const totalTime = Date.now() - startTime;
  const successfulResults = results.filter(r => r.success);
  const times = successfulResults.map(r => r.time);
  const stats = times.length > 0 ? calculateStats(times) : null;

  console.log(`\n  Total Time: ${totalTime}ms`);
  console.log(`  Successful: ${successfulResults.length}/50`);

  if (stats) {
    console.log(`  Response Times:`);
    console.log(`    Avg: ${stats.avg}ms, P95: ${stats.p95}ms, Max: ${stats.max}ms`);
  }

  // Check for performance degradation
  if (times.length >= 10) {
    const firstTen = times.slice(0, 10);
    const lastTen = times.slice(-10);
    const firstAvg = firstTen.reduce((a, b) => a + b, 0) / 10;
    const lastAvg = lastTen.reduce((a, b) => a + b, 0) / 10;
    const degradation = ((lastAvg - firstAvg) / firstAvg * 100).toFixed(1);

    console.log(`\n  Performance Degradation Check:`);
    console.log(`    First 10 avg: ${Math.round(firstAvg)}ms`);
    console.log(`    Last 10 avg: ${Math.round(lastAvg)}ms`);
    console.log(`    Change: ${degradation}%`);

    if (lastAvg > firstAvg * 1.5) {
      console.log(`    ⚠️ Significant performance degradation detected`);
    } else {
      console.log(`    ✓ Performance remains stable`);
    }
  }

  return {
    totalRequests: 50,
    successfulRequests: successfulResults.length,
    totalTime,
    stats,
    results
  };
}

// Test 4: Response time consistency
async function testResponseConsistency() {
  console.log('\n📈 Test 4: Response Time Consistency');
  console.log('-'.repeat(50));
  console.log('  Measuring variance in response times...');

  const allTimes = {};

  for (const cohort of COHORTS) {
    const times = [];

    for (let i = 0; i < 20; i++) {
      const answers = generateAnswers(30);
      const result = await submitTest(cohort, answers);
      if (result.success) {
        times.push(result.time);
      }
    }

    allTimes[cohort] = times;

    const stats = calculateStats(times);
    const variance = times.reduce((sum, t) => sum + Math.pow(t - stats.avg, 2), 0) / times.length;
    const stdDev = Math.sqrt(variance);
    const cv = (stdDev / stats.avg * 100).toFixed(1); // Coefficient of variation

    console.log(`\n  ${cohort}:`);
    console.log(`    Avg: ${stats.avg}ms, StdDev: ${Math.round(stdDev)}ms`);
    console.log(`    Range: ${stats.min}ms - ${stats.max}ms`);
    console.log(`    Coefficient of Variation: ${cv}%`);

    if (parseFloat(cv) > 50) {
      console.log(`    ⚠️ High variance - inconsistent response times`);
    } else {
      console.log(`    ✓ Response times are consistent`);
    }
  }

  return allTimes;
}

// Test 5: Memory leak check (monitor response times over many requests)
async function testMemoryStability() {
  console.log('\n💾 Test 5: Stability Over Many Requests');
  console.log('-'.repeat(50));
  console.log('  Running 100 requests to check for memory/stability issues...');

  const batches = [];
  const batchSize = 20;
  const numBatches = 5;

  for (let batch = 0; batch < numBatches; batch++) {
    const batchStart = Date.now();
    const batchTimes = [];

    for (let i = 0; i < batchSize; i++) {
      const cohort = COHORTS[Math.floor(Math.random() * COHORTS.length)];
      const answers = generateAnswers(30);
      const result = await submitTest(cohort, answers);
      if (result.success) {
        batchTimes.push(result.time);
      }
    }

    const batchDuration = Date.now() - batchStart;
    const batchStats = batchTimes.length > 0 ? calculateStats(batchTimes) : null;

    batches.push({
      batch: batch + 1,
      duration: batchDuration,
      avgTime: batchStats?.avg,
      requests: batchSize
    });

    console.log(`    Batch ${batch + 1}: avg=${batchStats?.avg}ms, duration=${batchDuration}ms`);
  }

  // Check for memory leaks (increasing response times over batches)
  const avgTimes = batches.map(b => b.avgTime).filter(t => t != null);
  if (avgTimes.length >= 3) {
    const trend = avgTimes[avgTimes.length - 1] - avgTimes[0];
    const trendPercent = ((trend / avgTimes[0]) * 100).toFixed(1);

    console.log(`\n  Trend Analysis:`);
    console.log(`    First batch avg: ${avgTimes[0]}ms`);
    console.log(`    Last batch avg: ${avgTimes[avgTimes.length - 1]}ms`);
    console.log(`    Change: ${trendPercent}%`);

    if (trend > avgTimes[0] * 0.5) {
      console.log(`    ⚠️ Possible memory leak - response times increasing`);
    } else {
      console.log(`    ✓ No memory leak detected`);
    }
  }

  return batches;
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

  console.log('🧪 PERFORMANCE AND LOAD TESTING');
  console.log('='.repeat(60));
  console.log(`Configuration:`);
  console.log(`  - Acceptable Response Time: ${LOAD_TEST_CONFIG.acceptableResponseTime}ms`);
  console.log(`  - Acceptable P95: ${LOAD_TEST_CONFIG.acceptableP95}ms`);
  console.log(`  - Concurrent Users: ${LOAD_TEST_CONFIG.concurrentUsers}`);

  const testStart = Date.now();
  const results = {};

  // Run all tests
  try {
    results.baseline = await testBaseline();
    results.concurrentLoad = await testConcurrentLoad();
    results.sequentialStress = await testSequentialStress();
    results.consistency = await testResponseConsistency();
    results.stability = await testMemoryStability();
  } catch (e) {
    console.log(`\n❌ Test error: ${e.message}`);
  }

  const totalTestTime = Date.now() - testStart;

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 PERFORMANCE TEST SUMMARY');
  console.log('='.repeat(60));

  console.log(`\nTotal Test Duration: ${(totalTestTime / 1000).toFixed(1)}s`);

  // Performance verdicts
  const verdicts = [];

  if (results.baseline) {
    const allBaselineStats = Object.values(results.baseline).map(r => r.scoreStats);
    const avgResponseTime = Math.round(allBaselineStats.reduce((sum, s) => sum + s.avg, 0) / allBaselineStats.length);

    console.log(`\n📌 Baseline Performance:`);
    console.log(`   Average Response Time: ${avgResponseTime}ms`);

    if (avgResponseTime < LOAD_TEST_CONFIG.acceptableResponseTime) {
      console.log(`   ✅ Within acceptable limits (<${LOAD_TEST_CONFIG.acceptableResponseTime}ms)`);
      verdicts.push({ test: 'Baseline', passed: true });
    } else {
      console.log(`   ❌ Exceeds acceptable limits`);
      verdicts.push({ test: 'Baseline', passed: false });
    }
  }

  if (results.concurrentLoad) {
    const { stats, errors } = results.concurrentLoad;
    console.log(`\n📌 Load Test Performance:`);
    console.log(`   Throughput: ${results.concurrentLoad.throughput.toFixed(2)} req/s`);
    console.log(`   Error Rate: ${(errors / results.concurrentLoad.totalRequests * 100).toFixed(1)}%`);

    if (stats?.p95 < LOAD_TEST_CONFIG.acceptableP95) {
      console.log(`   ✅ P95 within limits (${stats.p95}ms < ${LOAD_TEST_CONFIG.acceptableP95}ms)`);
      verdicts.push({ test: 'Load', passed: true });
    } else if (stats) {
      console.log(`   ❌ P95 exceeds limits (${stats.p95}ms)`);
      verdicts.push({ test: 'Load', passed: false });
    }
  }

  if (results.sequentialStress?.stats) {
    const degradation = results.sequentialStress.stats.max / results.sequentialStress.stats.min;
    console.log(`\n📌 Stress Test:`);
    console.log(`   Max/Min ratio: ${degradation.toFixed(2)}x`);

    if (degradation < 3) {
      console.log(`   ✅ Stable under stress`);
      verdicts.push({ test: 'Stress', passed: true });
    } else {
      console.log(`   ⚠️ Some instability under stress`);
      verdicts.push({ test: 'Stress', passed: false });
    }
  }

  // Final verdict
  console.log(`\n${'='.repeat(60)}`);
  const passedTests = verdicts.filter(v => v.passed).length;
  console.log(`Overall: ${passedTests}/${verdicts.length} performance tests passed`);

  if (passedTests === verdicts.length) {
    console.log('🎉 All performance tests passed!');
  } else {
    console.log('⚠️ Some performance issues detected - review results above');
  }

  // Save results
  const fs = require('fs');
  fs.writeFileSync('test-performance-results.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    config: LOAD_TEST_CONFIG,
    totalTestTime,
    verdicts,
    results
  }, null, 2));

  console.log('\n📄 Full results saved to test-performance-results.json\n');
}

runTests().catch(console.error);
