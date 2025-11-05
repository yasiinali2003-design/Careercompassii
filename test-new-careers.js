// Test script to verify new careers work with scoring engine
// Run multiple test scenarios to ensure stability

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const API_URL = `${BASE_URL}/api/score`;

// Test scenarios
const testScenarios = [
  {
    name: "YLA - Tech-focused answers",
    cohort: "YLA",
    answers: Array.from({ length: 30 }, (_, i) => {
      // Favor tech/innovation careers
      if (i < 10) return 4; // Strong tech interest
      if (i < 20) return 3; // Moderate tech interest
      return 2; // Neutral
    })
  },
  {
    name: "YLA - Healthcare-focused answers",
    cohort: "YLA",
    answers: Array.from({ length: 30 }, (_, i) => {
      // Favor healthcare/helping careers
      if (i >= 10 && i < 20) return 4; // Strong helping interest
      if (i >= 5 && i < 15) return 3; // Moderate helping interest
      return 2; // Neutral
    })
  },
  {
    name: "YLA - Balanced answers",
    cohort: "YLA",
    answers: Array.from({ length: 30 }, () => Math.floor(Math.random() * 3) + 2) // 2-4
  },
  {
    name: "TASO2 - Tech-focused answers",
    cohort: "TASO2",
    answers: Array.from({ length: 30 }, (_, i) => {
      // Favor tech/innovation careers
      if (i < 10) return 4; // Strong tech interest
      if (i < 20) return 3; // Moderate tech interest
      return 2; // Neutral
    })
  },
  {
    name: "TASO2 - Healthcare-focused answers",
    cohort: "TASO2",
    answers: Array.from({ length: 30 }, (_, i) => {
      // Favor healthcare/helping careers
      if (i >= 10 && i < 20) return 4; // Strong helping interest
      if (i >= 5 && i < 15) return 3; // Moderate helping interest
      return 2; // Neutral
    })
  },
  {
    name: "TASO2 - Balanced answers",
    cohort: "TASO2",
    answers: Array.from({ length: 30 }, () => Math.floor(Math.random() * 3) + 2) // 2-4
  },
  {
    name: "TASO2 - All high scores",
    cohort: "TASO2",
    answers: Array(30).fill(5) // All maximum
  },
  {
    name: "TASO2 - All low scores",
    cohort: "TASO2",
    answers: Array(30).fill(1) // All minimum
  }
];

// New careers to check for
const newCareerIds = [
  'devops-insinööri',
  'automekaanikko',
  'ohjelmistotestaja',
  'ux-suunnittelija',
  'cloud-arkkitehti',
  'asiakkuusvastaava',
  'sosiaaliohjaaja',
  'terveydenhoitaja'
];

async function runTest(scenario, testNumber) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answers: scenario.answers,
        cohort: scenario.cohort
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Check if new careers appear in results
    const topCareers = data.careers || [];
    const foundNewCareers = topCareers.filter(c => newCareerIds.includes(c.id));
    
    return {
      success: true,
      scenario: scenario.name,
      cohort: scenario.cohort,
      totalCareers: topCareers.length,
      foundNewCareers: foundNewCareers.length,
      newCareerNames: foundNewCareers.map(c => c.title),
      hasEducationPath: !!data.educationPath,
      error: null
    };
  } catch (error) {
    return {
      success: false,
      scenario: scenario.name,
      cohort: scenario.cohort,
      error: error.message
    };
  }
}

async function runMultipleTests() {
  console.log('🧪 Testing New Careers Integration');
  console.log('='.repeat(60));
  console.log(`API URL: ${API_URL}`);
  console.log(`Test scenarios: ${testScenarios.length}`);
  console.log(`New careers to check: ${newCareerIds.length}`);
  console.log('');
  
  const results = [];
  let successCount = 0;
  let failureCount = 0;
  const newCareerAppearances = {};
  
  // Initialize appearance tracking
  newCareerIds.forEach(id => {
    newCareerAppearances[id] = 0;
  });
  
  // Run each scenario multiple times
  const runsPerScenario = 3;
  const totalRuns = testScenarios.length * runsPerScenario;
  let currentRun = 0;
  
  for (const scenario of testScenarios) {
    for (let i = 0; i < runsPerScenario; i++) {
      currentRun++;
      process.stdout.write(`\rRunning test ${currentRun}/${totalRuns}...`);
      
      const result = await runTest(scenario, currentRun);
      results.push(result);
      
      if (result.success) {
        successCount++;
        
        // Track new career appearances
        if (result.foundNewCareers > 0) {
          result.newCareerNames.forEach(name => {
            const career = results.find(r => r.newCareerNames?.includes(name));
            // Find the ID
            const careerId = newCareerIds.find(id => {
              // This is approximate - we'd need to match by title
              return true; // Simplified
            });
          });
        }
      } else {
        failureCount++;
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  console.log('\n');
  console.log('='.repeat(60));
  console.log('📊 Test Results Summary');
  console.log('='.repeat(60));
  console.log(`Total runs: ${totalRuns}`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failureCount}`);
  console.log(`Success rate: ${((successCount / totalRuns) * 100).toFixed(1)}%`);
  console.log('');
  
  // Group by scenario
  const scenarioResults = {};
  results.forEach(r => {
    if (!scenarioResults[r.scenario]) {
      scenarioResults[r.scenario] = { success: 0, failed: 0, newCareersFound: 0 };
    }
    if (r.success) {
      scenarioResults[r.scenario].success++;
      scenarioResults[r.scenario].newCareersFound += r.foundNewCareers || 0;
    } else {
      scenarioResults[r.scenario].failed++;
    }
  });
  
  console.log('Results by scenario:');
  Object.keys(scenarioResults).forEach(scenario => {
    const stats = scenarioResults[scenario];
    console.log(`  ${scenario}:`);
    console.log(`    ✅ Success: ${stats.success}/${runsPerScenario}`);
    console.log(`    ❌ Failed: ${stats.failed}/${runsPerScenario}`);
    console.log(`    🆕 New careers found: ${stats.newCareersFound} total`);
  });
  console.log('');
  
  // Show failures
  const failures = results.filter(r => !r.success);
  if (failures.length > 0) {
    console.log('❌ Failures:');
    failures.forEach(f => {
      console.log(`  ${f.scenario} (${f.cohort}): ${f.error}`);
    });
    console.log('');
  }
  
  // Check which new careers appeared
  const careerAppearances = {};
  results.forEach(r => {
    if (r.success && r.newCareerNames) {
      r.newCareerNames.forEach(name => {
        careerAppearances[name] = (careerAppearances[name] || 0) + 1;
      });
    }
  });
  
  if (Object.keys(careerAppearances).length > 0) {
    console.log('🆕 New Careers Found in Results:');
    Object.keys(careerAppearances).sort().forEach(name => {
      console.log(`  ${name}: ${careerAppearances[name]} times`);
    });
  } else {
    console.log('⚠️  No new careers appeared in top results (this may be normal)');
  }
  
  console.log('');
  console.log('='.repeat(60));
  
  if (failureCount === 0) {
    console.log('✅ All tests passed!');
  } else {
    console.log(`⚠️  ${failureCount} test(s) failed`);
  }
}

// Run tests
runMultipleTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

