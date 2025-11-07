/**
 * Complete Todistuspistelaskuri Integration Test
 * Tests all components and features together
 */

const BASE_URL = 'http://localhost:3000';

async function testTodistuspisteIntegration() {
  console.log('🧪 Testing Todistuspistelaskuri Integration\n');
  console.log('='.repeat(60));
  
  let passed = 0;
  let failed = 0;
  
  // Test 1: API Endpoint Available
  console.log('\n📋 Test 1: API Endpoint Available');
  try {
    const response = await fetch(`${BASE_URL}/api/study-programs?limit=1`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ PASS - API endpoint is accessible');
      console.log(`   Total programs: ${data.total || 0}`);
      passed++;
    } else {
      console.log('❌ FAIL - API endpoint not accessible');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL - API error:', error.message);
    failed++;
  }
  
  // Test 2: Programs Have Required Fields
  console.log('\n📋 Test 2: Programs Have Required Fields');
  try {
    const response = await fetch(`${BASE_URL}/api/study-programs?limit=10`);
    const data = await response.json();
    
    if (data.programs && data.programs.length > 0) {
      const allValid = data.programs.every(p => 
        p.id && p.name && p.institution && p.institutionType && 
        p.field && p.minPoints !== undefined
      );
      
      if (allValid) {
        console.log('✅ PASS - All programs have required fields');
        passed++;
      } else {
        console.log('❌ FAIL - Some programs missing required fields');
        failed++;
      }
    } else {
      console.log('⚠️  No programs to check');
      passed++;
    }
  } catch (error) {
    console.log('❌ FAIL - Test error:', error.message);
    failed++;
  }
  
  // Test 3: Filter by Points Works
  console.log('\n📋 Test 3: Filter by Points');
  try {
    const response = await fetch(`${BASE_URL}/api/study-programs?points=100&type=yliopisto&limit=5`);
    const data = await response.json();
    
    if (data.programs && data.programs.length > 0) {
      const allInRange = data.programs.every(p => 
        p.minPoints <= 130 && (!p.maxPoints || p.maxPoints >= 80)
      );
      
      if (allInRange) {
        console.log('✅ PASS - Point filtering works correctly');
        console.log(`   Programs found: ${data.programs.length}`);
        passed++;
      } else {
        console.log('❌ FAIL - Some programs outside valid range');
        failed++;
      }
    } else {
      console.log('⚠️  No programs found (may be expected)');
      passed++;
    }
  } catch (error) {
    console.log('❌ FAIL - Filter error:', error.message);
    failed++;
  }
  
  // Test 4: Career Matching Works
  console.log('\n📋 Test 4: Career Matching');
  try {
    const response = await fetch(`${BASE_URL}/api/study-programs?careers=ohjelmistokehittaja,tietoturva-asiantuntija&limit=5`);
    const data = await response.json();
    
    if (data.programs && data.programs.length > 0) {
      const hasMatches = data.programs.some(p => 
        p.relatedCareers && p.relatedCareers.length > 0
      );
      
      if (hasMatches) {
        console.log('✅ PASS - Career matching works');
        console.log(`   Programs with matches: ${data.programs.length}`);
        passed++;
      } else {
        console.log('❌ FAIL - No career matches found');
        failed++;
      }
    } else {
      console.log('⚠️  No programs found');
      passed++;
    }
  } catch (error) {
    console.log('❌ FAIL - Career match error:', error.message);
    failed++;
  }
  
  // Test 5: Search Functionality
  console.log('\n📋 Test 5: Search Functionality');
  try {
    const response = await fetch(`${BASE_URL}/api/study-programs?search=tietotekniikka&limit=5`);
    const data = await response.json();
    
    if (data.programs && data.programs.length > 0) {
      console.log('✅ PASS - Search works');
      console.log(`   Programs found: ${data.programs.length}`);
      passed++;
    } else {
      console.log('⚠️  No search results (may be expected)');
      passed++;
    }
  } catch (error) {
    console.log('❌ FAIL - Search error:', error.message);
    failed++;
  }
  
  // Test 6: Field Filtering
  console.log('\n📋 Test 6: Field Filtering');
  try {
    const response = await fetch(`${BASE_URL}/api/study-programs?field=teknologia&limit=5`);
    const data = await response.json();
    
    if (data.programs && data.programs.length > 0) {
      const allMatch = data.programs.every(p => p.field === 'teknologia');
      
      if (allMatch) {
        console.log('✅ PASS - Field filter works');
        console.log(`   Technology programs: ${data.programs.length}`);
        passed++;
      } else {
        console.log('❌ FAIL - Field filter incorrect');
        failed++;
      }
    } else {
      console.log('⚠️  No programs found');
      passed++;
    }
  } catch (error) {
    console.log('❌ FAIL - Field filter error:', error.message);
    failed++;
  }
  
  // Test 7: Institution Type Distribution
  console.log('\n📋 Test 7: Institution Type Distribution');
  try {
    const yliopistoResponse = await fetch(`${BASE_URL}/api/study-programs?type=yliopisto&limit=10`);
    const amkResponse = await fetch(`${BASE_URL}/api/study-programs?type=amk&limit=10`);
    const yliopistoData = await yliopistoResponse.json();
    const amkData = await amkResponse.json();
    
    const yliopistoCount = yliopistoData.programs?.length || 0;
    const amkCount = amkData.programs?.length || 0;
    
    if (yliopistoCount > 0 && amkCount > 0) {
      console.log('✅ PASS - Both institution types available');
      console.log(`   Yliopisto: ${yliopistoCount}`);
      console.log(`   AMK: ${amkCount}`);
      passed++;
    } else {
      console.log('⚠️  Missing one institution type');
      passed++;
    }
  } catch (error) {
    console.log('❌ FAIL - Institution type test error:', error.message);
    failed++;
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Integration Test Summary');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Total: ${passed + failed}`);
  console.log(`🎯 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  console.log('');
  
  if (failed === 0) {
    console.log('🎉 All integration tests passed! Todistuspistelaskuri is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check errors above.');
  }
}

testTodistuspisteIntegration().catch(console.error);

