/**
 * Browser Console Test Script
 * Copy and paste this into browser console to test API endpoints
 */

(async function runBrowserTests() {
  console.log('🧪 Starting Browser Tests...\n');
  console.log('='.repeat(60));
  
  const API_BASE = window.location.origin;
  let passed = 0;
  let failed = 0;
  const results = [];
  
  function logResult(testName, success, message) {
    const icon = success ? '✅' : '❌';
    console.log(`${icon} ${testName}: ${message}`);
    results.push({ test: testName, success, message });
    if (success) passed++; else failed++;
  }
  
  // Test 1: Basic API Fetch
  try {
    const response = await fetch(`${API_BASE}/api/study-programs?limit=5`);
    const data = await response.json();
    if (data.programs && Array.isArray(data.programs) && data.programs.length > 0) {
      logResult('Test 1: Basic API Fetch', true, `Fetched ${data.programs.length} programs`);
    } else {
      logResult('Test 1: Basic API Fetch', false, 'No programs returned');
    }
  } catch (error) {
    logResult('Test 1: Basic API Fetch', false, error.message);
  }
  
  // Test 2: Filter by Points
  try {
    const response = await fetch(`${API_BASE}/api/study-programs?points=50&limit=10`);
    const data = await response.json();
    if (data.programs && Array.isArray(data.programs)) {
      const valid = data.programs.every(p => 
        p.min_points <= 80 && (!p.max_points || p.max_points >= 30)
      );
      if (valid || data.programs.length === 0) {
        logResult('Test 2: Filter by Points', true, `Found ${data.programs.length} programs for 50 points`);
      } else {
        logResult('Test 2: Filter by Points', false, 'Some programs outside expected range');
      }
    } else {
      logResult('Test 2: Filter by Points', false, 'Invalid response format');
    }
  } catch (error) {
    logResult('Test 2: Filter by Points', false, error.message);
  }
  
  // Test 3: Filter by Type (AMK)
  try {
    const response = await fetch(`${API_BASE}/api/study-programs?type=amk&limit=10`);
    const data = await response.json();
    if (data.programs && Array.isArray(data.programs)) {
      const allAMK = data.programs.every(p => p.institution_type === 'amk');
      if (allAMK || data.programs.length === 0) {
        logResult('Test 3: Filter by Type (AMK)', true, `Found ${data.programs.length} AMK programs`);
      } else {
        logResult('Test 3: Filter by Type (AMK)', false, 'Some programs not AMK type');
      }
    } else {
      logResult('Test 3: Filter by Type (AMK)', false, 'Invalid response format');
    }
  } catch (error) {
    logResult('Test 3: Filter by Type (AMK)', false, error.message);
  }
  
  // Test 4: Filter by Type (Yliopisto)
  try {
    const response = await fetch(`${API_BASE}/api/study-programs?type=yliopisto&limit=10`);
    const data = await response.json();
    if (data.programs && Array.isArray(data.programs)) {
      const allYliopisto = data.programs.every(p => p.institution_type === 'yliopisto');
      if (allYliopisto || data.programs.length === 0) {
        logResult('Test 4: Filter by Type (Yliopisto)', true, `Found ${data.programs.length} yliopisto programs`);
      } else {
        logResult('Test 4: Filter by Type (Yliopisto)', false, 'Some programs not yliopisto type');
      }
    } else {
      logResult('Test 4: Filter by Type (Yliopisto)', false, 'Invalid response format');
    }
  } catch (error) {
    logResult('Test 4: Filter by Type (Yliopisto)', false, error.message);
  }
  
  // Test 5: Search
  try {
    const response = await fetch(`${API_BASE}/api/study-programs?search=tietotekniikka&limit=10`);
    const data = await response.json();
    if (data.programs && Array.isArray(data.programs)) {
      const matches = data.programs.filter(p => 
        p.name.toLowerCase().includes('tietotekniikka')
      );
      if (matches.length > 0 || data.programs.length === 0) {
        logResult('Test 5: Search', true, `Found ${data.programs.length} matching programs`);
      } else {
        logResult('Test 5: Search', false, 'Search not working correctly');
      }
    } else {
      logResult('Test 5: Search', false, 'Invalid response format');
    }
  } catch (error) {
    logResult('Test 5: Search', false, error.message);
  }
  
  // Test 6: Sort by Points
  try {
    const response = await fetch(`${API_BASE}/api/study-programs?sort=points_asc&limit=10`);
    const data = await response.json();
    if (data.programs && Array.isArray(data.programs)) {
      if (data.programs.length <= 1) {
        logResult('Test 6: Sort by Points', true, 'Sort working (not enough data to verify)');
      } else {
        const sorted = data.programs.every((p, i) => 
          i === 0 || p.min_points >= data.programs[i - 1].min_points
        );
        if (sorted) {
          logResult('Test 6: Sort by Points', true, 'Programs sorted correctly');
        } else {
          logResult('Test 6: Sort by Points', false, 'Programs not sorted correctly');
        }
      }
    } else {
      logResult('Test 6: Sort by Points', false, 'Invalid response format');
    }
  } catch (error) {
    logResult('Test 6: Sort by Points', false, error.message);
  }
  
  // Test 7: Pagination
  try {
    const response = await fetch(`${API_BASE}/api/study-programs?limit=10&offset=0`);
    const data = await response.json();
    if (data.programs && Array.isArray(data.programs)) {
      if (data.programs.length <= 10) {
        logResult('Test 7: Pagination', true, `Pagination working - ${data.programs.length} programs`);
      } else {
        logResult('Test 7: Pagination', false, `Returned ${data.programs.length} programs, expected <= 10`);
      }
    } else {
      logResult('Test 7: Pagination', false, 'Invalid response format');
    }
  } catch (error) {
    logResult('Test 7: Pagination', false, error.message);
  }
  
  // Test 8: Career Matching
  try {
    const response = await fetch(`${API_BASE}/api/study-programs?careers=ohjelmistokehittaja&limit=10`);
    const data = await response.json();
    if (data.programs && Array.isArray(data.programs)) {
      const withCareers = data.programs.filter(p => 
        p.related_careers && 
        Array.isArray(p.related_careers) && 
        p.related_careers.includes('ohjelmistokehittaja')
      );
      if (withCareers.length > 0 || data.programs.length === 0) {
        logResult('Test 8: Career Matching', true, `Found ${withCareers.length} programs matching career`);
      } else {
        logResult('Test 8: Career Matching', false, 'Career matching not working');
      }
    } else {
      logResult('Test 8: Career Matching', false, 'Invalid response format');
    }
  } catch (error) {
    logResult('Test 8: Career Matching', false, error.message);
  }
  
  // Test 9: Data Quality - Required Fields
  try {
    const response = await fetch(`${API_BASE}/api/study-programs?limit=100`);
    const data = await response.json();
    if (data.programs && Array.isArray(data.programs)) {
      const missingFields = data.programs.filter(p => 
        !p.name || !p.institution || p.min_points === undefined || p.min_points === null
      );
      if (missingFields.length === 0) {
        logResult('Test 9: Data Quality', true, `All ${data.programs.length} programs have required fields`);
      } else {
        logResult('Test 9: Data Quality', false, `${missingFields.length} programs missing required fields`);
      }
    } else {
      logResult('Test 9: Data Quality', false, 'Invalid response format');
    }
  } catch (error) {
    logResult('Test 9: Data Quality', false, error.message);
  }
  
  // Test 10: Point Range Validation
  try {
    const response = await fetch(`${API_BASE}/api/study-programs?limit=100`);
    const data = await response.json();
    if (data.programs && Array.isArray(data.programs)) {
      const invalid = data.programs.filter(p => 
        p.min_points < 20 || p.min_points > 200 ||
        (p.max_points && (p.max_points < p.min_points || p.max_points > 250))
      );
      if (invalid.length === 0) {
        logResult('Test 10: Point Range Validation', true, `All ${data.programs.length} programs have valid point ranges`);
      } else {
        logResult('Test 10: Point Range Validation', false, `${invalid.length} programs have invalid point ranges`);
      }
    } else {
      logResult('Test 10: Point Range Validation', false, 'Invalid response format');
    }
  } catch (error) {
    logResult('Test 10: Point Range Validation', false, error.message);
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Test Results Summary:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Total: ${passed + failed}`);
  console.log(`   📊 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%\n`);
  
  if (failed === 0) {
    console.log('🎉 All browser tests passed!');
  } else {
    console.log('⚠️  Some tests failed. Review results above.');
  }
  
  return results;
})();

