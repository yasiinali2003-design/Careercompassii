/**
 * TEST: API Endpoints
 * Tests the /api/study-programs endpoint
 */

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 Testing Study Programs API Endpoints\n');

  // Test 1: Basic GET request
  console.log('Test 1: Basic GET request');
  try {
    const response = await fetch(`${BASE_URL}/api/study-programs?limit=5`);
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Programs returned:', data.programs?.length || 0);
    console.log('Total:', data.total || 0);
    console.log('✅ PASS' + (data.programs && data.programs.length > 0 ? '' : ' ❌ FAIL'));
  } catch (error) {
    console.log('❌ FAIL:', error.message);
  }
  console.log('');

  // Test 2: Filter by points
  console.log('Test 2: Filter by points');
  try {
    const response = await fetch(`${BASE_URL}/api/study-programs?points=100&type=yliopisto&limit=10`);
    const data = await response.json();
    console.log('Query: points=100, type=yliopisto');
    console.log('Programs returned:', data.programs?.length || 0);
    if (data.programs && data.programs.length > 0) {
      console.log('Sample:', data.programs[0].name);
    }
    console.log('✅ PASS' + (data.programs && data.programs.length > 0 ? '' : ' ❌ FAIL'));
  } catch (error) {
    console.log('❌ FAIL:', error.message);
  }
  console.log('');

  // Test 3: Filter by careers
  console.log('Test 3: Filter by careers');
  try {
    const response = await fetch(`${BASE_URL}/api/study-programs?careers=ohjelmistokehittaja,tietoturva-asiantuntija&limit=10`);
    const data = await response.json();
    console.log('Query: careers=ohjelmistokehittaja,tietoturva-asiantuntija');
    console.log('Programs returned:', data.programs?.length || 0);
    if (data.programs && data.programs.length > 0) {
      console.log('Sample:', data.programs[0].name, '- Matches:', data.programs[0].relatedCareers?.length || 0);
    }
    console.log('✅ PASS' + (data.programs && data.programs.length > 0 ? '' : ' ❌ FAIL'));
  } catch (error) {
    console.log('❌ FAIL:', error.message);
  }
  console.log('');

  // Test 4: Search functionality
  console.log('Test 4: Search functionality');
  try {
    const response = await fetch(`${BASE_URL}/api/study-programs?search=tietotekniikka&limit=10`);
    const data = await response.json();
    console.log('Query: search=tietotekniikka');
    console.log('Programs returned:', data.programs?.length || 0);
    if (data.programs && data.programs.length > 0) {
      console.log('Sample:', data.programs[0].name);
    }
    console.log('✅ PASS' + (data.programs && data.programs.length > 0 ? '' : ' ❌ FAIL'));
  } catch (error) {
    console.log('❌ FAIL:', error.message);
  }
  console.log('');

  // Test 5: Filter by field
  console.log('Test 5: Filter by field');
  try {
    const response = await fetch(`${BASE_URL}/api/study-programs?field=teknologia&limit=10`);
    const data = await response.json();
    console.log('Query: field=teknologia');
    console.log('Programs returned:', data.programs?.length || 0);
    if (data.programs && data.programs.length > 0) {
      console.log('Sample:', data.programs[0].name, '- Field:', data.programs[0].field);
    }
    console.log('✅ PASS' + (data.programs && data.programs.length > 0 ? '' : ' ❌ FAIL'));
  } catch (error) {
    console.log('❌ FAIL:', error.message);
  }
  console.log('');

  // Test 6: Sort options
  console.log('Test 6: Sort by points (low to high)');
  try {
    const response = await fetch(`${BASE_URL}/api/study-programs?sort=points-low&limit=5`);
    const data = await response.json();
    console.log('Query: sort=points-low');
    if (data.programs && data.programs.length > 0) {
      console.log('First program:', data.programs[0].name, '- Points:', data.programs[0].minPoints);
      console.log('Last program:', data.programs[data.programs.length - 1].name, '- Points:', data.programs[data.programs.length - 1].minPoints);
      const sorted = data.programs.every((p, i) => i === 0 || p.minPoints >= data.programs[i - 1].minPoints);
      console.log('✅ PASS' + (sorted ? '' : ' ❌ FAIL - Not sorted correctly'));
    } else {
      console.log('❌ FAIL - No programs returned');
    }
  } catch (error) {
    console.log('❌ FAIL:', error.message);
  }
  console.log('');

  // Test 7: Pagination
  console.log('Test 7: Pagination');
  try {
    const response1 = await fetch(`${BASE_URL}/api/study-programs?limit=5&offset=0`);
    const response2 = await fetch(`${BASE_URL}/api/study-programs?limit=5&offset=5`);
    const data1 = await response1.json();
    const data2 = await response2.json();
    console.log('Page 1:', data1.programs?.length || 0, 'programs');
    console.log('Page 2:', data2.programs?.length || 0, 'programs');
    const different = !data1.programs?.[0]?.id || data1.programs[0].id !== data2.programs?.[0]?.id;
    console.log('✅ PASS' + (different ? '' : ' ❌ FAIL - Pages are the same'));
  } catch (error) {
    console.log('❌ FAIL:', error.message);
  }
  console.log('');

  // Test 8: Combined filters
  console.log('Test 8: Combined filters');
  try {
    const response = await fetch(`${BASE_URL}/api/study-programs?points=100&type=yliopisto&field=teknologia&careers=ohjelmistokehittaja&limit=10`);
    const data = await response.json();
    console.log('Query: points=100, type=yliopisto, field=teknologia, careers=ohjelmistokehittaja');
    console.log('Programs returned:', data.programs?.length || 0);
    if (data.programs && data.programs.length > 0) {
      console.log('Sample:', data.programs[0].name);
    }
    console.log('✅ PASS' + (data.programs && data.programs.length > 0 ? '' : ' ❌ FAIL'));
  } catch (error) {
    console.log('❌ FAIL:', error.message);
  }
  console.log('');

  console.log('✅ All API tests completed!');
  console.log('\nNote: If tests fail, the API may be using static data fallback (which is expected if database not set up).');
}

// Run tests
testAPI().catch(console.error);

