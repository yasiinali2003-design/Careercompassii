#!/usr/bin/env node

/**
 * Test script for Parent Report PDF Generation
 * Runs multiple test scenarios via API endpoint
 */

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const TEST_CASES = ['full', 'ammattikoulu', 'minimal', 'no-education', 'kansanopisto'];

async function runTest(testCase) {
  try {
    const response = await fetch(`${BASE_URL}/api/test-parent-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ testCase }),
    });

    const data = await response.json();
    
    if (data.success) {
      return {
        success: true,
        testCase,
        blobSize: data.blobSize,
        message: data.message,
      };
    } else {
      return {
        success: false,
        testCase,
        error: data.error,
      };
    }
  } catch (error) {
    return {
      success: false,
      testCase,
      error: error.message,
    };
  }
}

async function runAllTests() {
  console.log('🧪 Starting Parent Report PDF Generation Tests\n');
  console.log(`Testing ${TEST_CASES.length} scenarios...\n`);
  console.log(`Base URL: ${BASE_URL}\n`);

  const results = [];
  
  // Run each test case
  for (let i = 0; i < TEST_CASES.length; i++) {
    const testCase = TEST_CASES[i];
    console.log(`[${i + 1}/${TEST_CASES.length}] Testing: ${testCase}`);
    
    const result = await runTest(testCase);
    results.push(result);
    
    if (result.success) {
      console.log(`  ✅ PASSED - ${result.message}`);
    } else {
      console.log(`  ❌ FAILED - ${result.error}`);
    }
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Summary
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`\n\n📊 Test Results:`);
  console.log(`   ✅ Passed: ${passed}/${TEST_CASES.length}`);
  console.log(`   ❌ Failed: ${failed}/${TEST_CASES.length}`);
  
  if (failed === 0) {
    console.log(`\n🎉 All tests passed!`);
    
    // Show blob sizes
    console.log(`\n📄 Generated PDF Sizes:`);
    results.forEach(r => {
      if (r.success) {
        console.log(`   ${r.testCase}: ${r.blobSize} bytes`);
      }
    });
  } else {
    console.log(`\n⚠️  Some tests failed. Please review the errors above.`);
  }
  
  return failed === 0;
}

// Run tests
runAllTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

