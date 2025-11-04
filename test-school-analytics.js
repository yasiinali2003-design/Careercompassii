#!/usr/bin/env node

/**
 * Test script for School-Wide Analytics Dashboard
 * Tests the API endpoint with multiple scenarios
 */

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || '';

// Create basic auth header only if password is configured
const authHeader = ADMIN_PASS ? 'Basic ' + Buffer.from(`${ADMIN_USER}:${ADMIN_PASS}`).toString('base64') : null;

async function testEndpoint(scenario, params = {}) {
  try {
    const queryParams = new URLSearchParams(params);
    const url = `${BASE_URL}/api/admin/school-analytics?${queryParams.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: authHeader ? {
        'Authorization': authHeader,
      } : {},
    });

    const data = await response.json();
    
    if (data.success) {
      return {
        success: true,
        scenario,
        totalTests: data.analytics?.totalTests || 0,
        totalClasses: data.analytics?.totalClasses || 0,
        topCareersCount: data.analytics?.topCareers?.length || 0,
        insightsCount: data.analytics?.insights?.length || 0,
        trendsByMonth: data.analytics?.trends?.byMonth?.length || 0,
        trendsByYear: data.analytics?.trends?.byYear?.length || 0,
      };
    } else {
      return {
        success: false,
        scenario,
        error: data.error || 'Unknown error',
      };
    }
  } catch (error) {
    return {
      success: false,
      scenario,
      error: error.message,
    };
  }
}

async function runAllTests() {
  console.log('🧪 Starting School-Wide Analytics Dashboard Tests\n');
  console.log(`Testing API endpoint: /api/admin/school-analytics\n`);

  const testScenarios = [
    { name: 'All classes (no filters)', params: {} },
    { name: 'With date filter', params: { since: '2024-01-01' } },
    { name: 'With teacherId filter (if exists)', params: { teacherId: 'test-teacher-id' } },
  ];

  const results = [];
  
  for (let i = 0; i < testScenarios.length; i++) {
    const scenario = testScenarios[i];
    console.log(`[${i + 1}/${testScenarios.length}] Testing: ${scenario.name}`);
    
    const result = await testEndpoint(scenario.name, scenario.params);
    results.push(result);
    
    if (result.success) {
      console.log(`  ✅ PASSED`);
      console.log(`     Total Tests: ${result.totalTests}`);
      console.log(`     Total Classes: ${result.totalClasses}`);
      console.log(`     Top Careers: ${result.topCareersCount}`);
      console.log(`     Insights: ${result.insightsCount}`);
      console.log(`     Monthly Trends: ${result.trendsByMonth}`);
      console.log(`     Yearly Trends: ${result.trendsByYear}`);
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
  console.log(`   ✅ Passed: ${passed}/${testScenarios.length}`);
  console.log(`   ❌ Failed: ${failed}/${testScenarios.length}`);
  
  if (failed === 0) {
    console.log(`\n🎉 All tests passed!`);
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

