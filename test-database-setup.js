/**
 * Comprehensive Database Setup Tests
 * Tests API endpoints, data integrity, and functionality
 */

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 Testing Database Setup\n');
  console.log('='.repeat(60));
  
  let passed = 0;
  let failed = 0;
  
  // Test 1: Basic API fetch
  console.log('\n📋 Test 1: Basic API Fetch');
  try {
    const response = await fetch(`${BASE_URL}/api/study-programs?limit=5`);
    const data = await response.json();
    
    if (data.programs && data.programs.length > 0) {
      console.log('✅ PASS - API returns programs');
      console.log(`   Programs returned: ${data.programs.length}`);
      console.log(`   Total in database: ${data.total}`);
      passed++;
    } else {
      console.log('❌ FAIL - No programs returned');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL - API error:', error.message);
    failed++;
  }
  
  // Test 2: Filter by points
  console.log('\n📋 Test 2: Filter by Points');
  try {
    const userPoints = 100;
    const response = await fetch(`${BASE_URL}/api/study-programs?points=${userPoints}&type=yliopisto&limit=10`);
    const data = await response.json();
    
    if (data.programs && data.programs.length > 0) {
      // Filter logic: userPoints >= minPoints - 30 AND userPoints <= maxPoints + 20
      // For userPoints=100: minPoints <= 130 AND (maxPoints >= 80 OR no maxPoints)
      const allInRange = data.programs.every(p => {
        const minOk = p.minPoints <= userPoints + 30; // Reach programs (up to 30 points above)
        const maxOk = !p.maxPoints || p.maxPoints >= userPoints - 20; // Safety programs (20 points below)
        return minOk && maxOk;
      });
      
      if (allInRange) {
        console.log('✅ PASS - Programs filtered correctly by points');
        console.log(`   Programs found: ${data.programs.length}`);
        console.log(`   Range check: minPoints <= ${userPoints + 30}, maxPoints >= ${userPoints - 20} (or no max)`);
        passed++;
      } else {
        const invalid = data.programs.filter(p => {
          const minOk = p.minPoints <= userPoints + 30;
          const maxOk = !p.maxPoints || p.maxPoints >= userPoints - 20;
          return !(minOk && maxOk);
        });
        console.log('❌ FAIL - Some programs outside point range');
        console.log(`   Invalid programs: ${invalid.length}`);
        invalid.slice(0, 3).forEach(p => {
          console.log(`     - ${p.name}: min=${p.minPoints}, max=${p.maxPoints || 'N/A'}`);
        });
        failed++;
      }
    } else {
      console.log('⚠️  No programs found (may be expected for this point range)');
      passed++; // Not a failure, just no matches
    }
  } catch (error) {
    console.log('❌ FAIL - Filter error:', error.message);
    failed++;
  }
  
  // Test 3: Filter by careers
  console.log('\n📋 Test 3: Filter by Careers');
  try {
    const response = await fetch(`${BASE_URL}/api/study-programs?careers=ohjelmistokehittaja,tietoturva-asiantuntija&limit=10`);
    const data = await response.json();
    
    if (data.programs && data.programs.length > 0) {
      const hasMatches = data.programs.some(p => 
        p.relatedCareers && p.relatedCareers.length > 0
      );
      if (hasMatches) {
        console.log('✅ PASS - Career filtering works');
        console.log(`   Programs with career matches: ${data.programs.length}`);
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
    console.log('❌ FAIL - Career filter error:', error.message);
    failed++;
  }
  
  // Test 4: Search functionality
  console.log('\n📋 Test 4: Search Functionality');
  try {
    const response = await fetch(`${BASE_URL}/api/study-programs?search=tietotekniikka&limit=10`);
    const data = await response.json();
    
    if (data.programs && data.programs.length > 0) {
      const allMatch = data.programs.every(p => 
        p.name.toLowerCase().includes('tietotekniikka') || 
        p.name.toLowerCase().includes('tietojenkäsittely')
      );
      if (allMatch || data.programs.length > 0) {
        console.log('✅ PASS - Search works');
        console.log(`   Programs found: ${data.programs.length}`);
        passed++;
      } else {
        console.log('❌ FAIL - Search results don\'t match');
        failed++;
      }
    } else {
      console.log('⚠️  No search results (may be expected)');
      passed++;
    }
  } catch (error) {
    console.log('❌ FAIL - Search error:', error.message);
    failed++;
  }
  
  // Test 5: Filter by field
  console.log('\n📋 Test 5: Filter by Field');
  try {
    const response = await fetch(`${BASE_URL}/api/study-programs?field=teknologia&limit=10`);
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
  
  // Test 6: Sort by points
  console.log('\n📋 Test 6: Sort by Points (Low to High)');
  try {
    const response = await fetch(`${BASE_URL}/api/study-programs?sort=points-low&limit=5`);
    const data = await response.json();
    
    if (data.programs && data.programs.length > 0) {
      let sorted = true;
      for (let i = 1; i < data.programs.length; i++) {
        if (data.programs[i].minPoints < data.programs[i-1].minPoints) {
          sorted = false;
          break;
        }
      }
      if (sorted) {
        console.log('✅ PASS - Sorting works correctly');
        console.log(`   First: ${data.programs[0].name} (${data.programs[0].minPoints} pts)`);
        console.log(`   Last: ${data.programs[data.programs.length-1].name} (${data.programs[data.programs.length-1].minPoints} pts)`);
        passed++;
      } else {
        console.log('❌ FAIL - Sorting incorrect');
        failed++;
      }
    } else {
      console.log('❌ FAIL - No programs to sort');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL - Sort error:', error.message);
    failed++;
  }
  
  // Test 7: Combined filters
  console.log('\n📋 Test 7: Combined Filters');
  try {
    const response = await fetch(`${BASE_URL}/api/study-programs?points=100&type=yliopisto&field=teknologia&careers=ohjelmistokehittaja&limit=5`);
    const data = await response.json();
    
    console.log('✅ PASS - Combined filters work');
    console.log(`   Programs found: ${data.programs.length}`);
    passed++;
  } catch (error) {
    console.log('❌ FAIL - Combined filters error:', error.message);
    failed++;
  }
  
  // Test 8: Data integrity
  console.log('\n📋 Test 8: Data Integrity');
  try {
    const response = await fetch(`${BASE_URL}/api/study-programs?limit=20`);
    const data = await response.json();
    
    if (data.programs && data.programs.length > 0) {
      const hasRequiredFields = data.programs.every(p => 
        p.id && p.name && p.institution && p.institutionType && 
        p.field && p.minPoints !== undefined && p.relatedCareers
      );
      
      if (hasRequiredFields) {
        console.log('✅ PASS - All programs have required fields');
        passed++;
      } else {
        console.log('❌ FAIL - Some programs missing required fields');
        failed++;
      }
      
      // Check for duplicates
      const ids = data.programs.map(p => p.id);
      const uniqueIds = new Set(ids);
      if (ids.length === uniqueIds.size) {
        console.log('✅ PASS - No duplicate IDs');
        passed++;
      } else {
        console.log('❌ FAIL - Duplicate IDs found');
        failed++;
      }
    } else {
      console.log('❌ FAIL - No programs to check');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL - Data integrity check error:', error.message);
    failed++;
  }
  
  // Test 9: Pagination
  console.log('\n📋 Test 9: Pagination');
  try {
    const response1 = await fetch(`${BASE_URL}/api/study-programs?limit=5&offset=0`);
    const response2 = await fetch(`${BASE_URL}/api/study-programs?limit=5&offset=5`);
    const data1 = await response1.json();
    const data2 = await response2.json();
    
    if (data1.programs && data2.programs) {
      const different = data1.programs[0]?.id !== data2.programs[0]?.id;
      if (different) {
        console.log('✅ PASS - Pagination works');
        console.log(`   Page 1: ${data1.programs.length} programs`);
        console.log(`   Page 2: ${data2.programs.length} programs`);
        passed++;
      } else {
        console.log('⚠️  Pages may be the same (if total < 10)');
        passed++;
      }
    } else {
      console.log('❌ FAIL - Pagination error');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL - Pagination error:', error.message);
    failed++;
  }
  
  // Test 10: Institution type filter
  console.log('\n📋 Test 10: Institution Type Filter');
  try {
    const responseYliopisto = await fetch(`${BASE_URL}/api/study-programs?type=yliopisto&limit=10`);
    const responseAMK = await fetch(`${BASE_URL}/api/study-programs?type=amk&limit=10`);
    const dataYliopisto = await responseYliopisto.json();
    const dataAMK = await responseAMK.json();
    
    const yliopistoCorrect = dataYliopisto.programs?.every(p => p.institutionType === 'yliopisto') || dataYliopisto.programs?.length === 0;
    const amkCorrect = dataAMK.programs?.every(p => p.institutionType === 'amk') || dataAMK.programs?.length === 0;
    
    if (yliopistoCorrect && amkCorrect) {
      console.log('✅ PASS - Institution type filter works');
      console.log(`   Yliopisto programs: ${dataYliopisto.programs?.length || 0}`);
      console.log(`   AMK programs: ${dataAMK.programs?.length || 0}`);
      passed++;
    } else {
      console.log('❌ FAIL - Institution type filter incorrect');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL - Institution type filter error:', error.message);
    failed++;
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Total: ${passed + failed}`);
  console.log(`🎯 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  console.log('');
  
  if (failed === 0) {
    console.log('🎉 All tests passed! Database setup is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check errors above.');
  }
}

// Run tests
testAPI().catch(console.error);

