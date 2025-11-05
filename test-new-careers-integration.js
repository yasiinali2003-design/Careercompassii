#!/usr/bin/env node

/**
 * Comprehensive test suite for newly added careers
 * Tests integration with scoring engine, API endpoints, and data integrity
 */

const fs = require('fs');
const path = require('path');

// Test configuration
const TEST_CONFIG = {
  baseUrl: process.env.TEST_URL || 'http://localhost:3000',
  testRuns: 5,
  delayBetweenRuns: 1000, // ms
};

// New careers to verify
const NEW_CAREERS = [
  'puheterapeutti',
  'audiologi',
  'oppilashuoltotyöntekijä',
  'suuhygienisti',
  'kotipalvelutyöntekijä',
  'full-stack-kehittäjä',
  'sosiaalisen-median-asiantuntija',
  'urheiluvalmentaja',
  'lämpötekniikka-asentaja',
  'ilmastoneuvonantaja',
  'aikuiskouluttaja',
  'myyntityöntekijä',
  'reseptionisti',
  'verkkosivustonhallintaja',
  'vaihtoehtoinen-energia-insinööri',
  'rakennustyönjohtaja',
  'aineenopettaja',
  'livestream-tuottaja',
  'hieroja',
  'ääniteknikko',
];

// Test results
const results = {
  dataIntegrity: { passed: 0, failed: 0, errors: [] },
  careerAccess: { passed: 0, failed: 0, errors: [] },
  apiTests: { passed: 0, failed: 0, errors: [] },
  scoringTests: { passed: 0, failed: 0, errors: [] },
};

console.log('═══════════════════════════════════════════════════════════');
console.log('  🧪 COMPREHENSIVE INTEGRATION TEST SUITE');
console.log('═══════════════════════════════════════════════════════════');
console.log('');

// Test 1: Data Integrity
console.log('📋 Test 1: Data Integrity');
console.log('─'.repeat(60));

try {
  const careersFile = path.join(__dirname, 'data', 'careers-fi.ts');
  const content = fs.readFileSync(careersFile, 'utf8');
  
  // Count total careers
  const idMatches = [...content.matchAll(/id:\s*"([^"]+)"/g)];
  const allIds = idMatches.map(m => m[1]);
  
  console.log(`   Total careers found: ${allIds.length}`);
  
  // Check for duplicates
  const normalizedIds = {};
  const duplicates = [];
  allIds.forEach((id) => {
    const normalized = id.toLowerCase().replace(/[-\s]/g, '');
    if (normalizedIds[normalized]) {
      duplicates.push({ id, original: normalizedIds[normalized] });
    } else {
      normalizedIds[normalized] = id;
    }
  });
  
  if (duplicates.length > 0) {
    results.dataIntegrity.failed++;
    results.dataIntegrity.errors.push(`Found ${duplicates.length} duplicate IDs`);
    console.log(`   ❌ Duplicates found: ${duplicates.length}`);
    duplicates.forEach(d => console.log(`      ${d.id} vs ${d.original}`));
  } else {
    results.dataIntegrity.passed++;
    console.log(`   ✅ No duplicates found`);
  }
  
  // Verify all new careers exist
  const missing = [];
  NEW_CAREERS.forEach(id => {
    if (!allIds.includes(id)) {
      missing.push(id);
    }
  });
  
  if (missing.length > 0) {
    results.dataIntegrity.failed++;
    results.dataIntegrity.errors.push(`Missing careers: ${missing.join(', ')}`);
    console.log(`   ❌ Missing careers: ${missing.length}`);
    missing.forEach(id => console.log(`      ${id}`));
  } else {
    results.dataIntegrity.passed++;
    console.log(`   ✅ All ${NEW_CAREERS.length} new careers found`);
  }
  
  // Check for required fields
  const requiredFields = ['id', 'category', 'title_fi', 'title_en', 'short_description', 
    'main_tasks', 'impact', 'education_paths', 'salary_eur_month', 'job_outlook'];
  
  let missingFields = 0;
  NEW_CAREERS.forEach(careerId => {
    const careerMatch = content.match(new RegExp(`id:\\s*"${careerId}"[\\s\\S]*?},`, 'g'));
    if (careerMatch) {
      requiredFields.forEach(field => {
        if (!careerMatch[0].includes(`${field}:`)) {
          missingFields++;
        }
      });
    }
  });
  
  if (missingFields > 0) {
    results.dataIntegrity.failed++;
    results.dataIntegrity.errors.push(`Missing required fields: ${missingFields}`);
    console.log(`   ⚠️  Missing required fields: ${missingFields}`);
  } else {
    results.dataIntegrity.passed++;
    console.log(`   ✅ All required fields present`);
  }
  
  // Check source year
  const yearMatches = [...content.matchAll(/year:\s*(\d+)/g)];
  const non2024Years = yearMatches.filter(m => parseInt(m[1]) !== 2024);
  
  if (non2024Years.length > 0) {
    results.dataIntegrity.failed++;
    results.dataIntegrity.errors.push(`Found ${non2024Years.length} sources with non-2024 year`);
    console.log(`   ⚠️  Found ${non2024Years.length} sources with non-2024 year`);
  } else {
    results.dataIntegrity.passed++;
    console.log(`   ✅ All sources use year 2024`);
  }
  
} catch (error) {
  results.dataIntegrity.failed++;
  results.dataIntegrity.errors.push(error.message);
  console.log(`   ❌ Error: ${error.message}`);
}

console.log('');

// Test 2: Career Access via Scoring Engine
console.log('📋 Test 2: Career Access via Scoring Engine');
console.log('─'.repeat(60));

try {
  // Try to import the careers data (simulate loading)
  const careersFile = path.join(__dirname, 'data', 'careers-fi.ts');
  const content = fs.readFileSync(careersFile, 'utf8');
  
  // Extract career data using regex
  const careerRegex = /id:\s*"([^"]+)"[\s\S]*?category:\s*"([^"]+)"[\s\S]*?title_fi:\s*"([^"]+)"/g;
  const careers = [];
  let match;
  
  while ((match = careerRegex.exec(content)) !== null) {
    careers.push({
      id: match[1],
      category: match[2],
      title_fi: match[3],
    });
  }
  
  console.log(`   Total careers loaded: ${careers.length}`);
  
  // Check if new careers are accessible
  const accessible = [];
  const notAccessible = [];
  
  NEW_CAREERS.forEach(id => {
    const career = careers.find(c => c.id === id);
    if (career) {
      accessible.push({ id, category: career.category, title: career.title_fi });
    } else {
      notAccessible.push(id);
    }
  });
  
  if (notAccessible.length > 0) {
    results.careerAccess.failed++;
    results.careerAccess.errors.push(`Cannot access: ${notAccessible.join(', ')}`);
    console.log(`   ❌ Cannot access ${notAccessible.length} careers:`);
    notAccessible.forEach(id => console.log(`      ${id}`));
  } else {
    results.careerAccess.passed++;
    console.log(`   ✅ All ${NEW_CAREERS.length} new careers accessible`);
  }
  
  // Verify categories
  const categoryCounts = {};
  accessible.forEach(c => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });
  
  console.log(`   📊 Category distribution:`);
  Object.keys(categoryCounts).sort().forEach(cat => {
    console.log(`      ${cat}: ${categoryCounts[cat]}`);
  });
  
} catch (error) {
  results.careerAccess.failed++;
  results.careerAccess.errors.push(error.message);
  console.log(`   ❌ Error: ${error.message}`);
}

console.log('');

// Test 3: API Endpoint Tests
console.log('📋 Test 3: API Endpoint Tests');
console.log('─'.repeat(60));

async function testAPI() {
  try {
    // Generate test answers (random for YLA cohort)
    const generateAnswers = () => {
      const answers = [];
      for (let i = 0; i < 30; i++) {
        answers.push(Math.floor(Math.random() * 5) + 1);
      }
      return answers;
    };
    
    // Test API endpoint
    const testPayload = {
      cohort: 'YLA',
      answers: generateAnswers(),
    };
    
    console.log(`   Testing API endpoint: ${TEST_CONFIG.baseUrl}/api/score`);
    
    const response = await fetch(`${TEST_CONFIG.baseUrl}/api/score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload),
    });
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // Check if result has careers
    if (!result.careers || !Array.isArray(result.careers)) {
      throw new Error('API response missing careers array');
    }
    
    console.log(`   ✅ API responded successfully`);
    console.log(`   📊 Received ${result.careers.length} career recommendations`);
    
    // Check if any new careers appear in results
    const resultCareerIds = result.careers.map(c => c.id || c.title_fi?.toLowerCase().replace(/\s+/g, '-'));
    const foundNewCareers = NEW_CAREERS.filter(id => resultCareerIds.includes(id));
    
    if (foundNewCareers.length > 0) {
      results.apiTests.passed++;
      console.log(`   ✅ Found ${foundNewCareers.length} new careers in results:`);
      foundNewCareers.slice(0, 5).forEach(id => console.log(`      ${id}`));
    } else {
      results.apiTests.failed++;
      results.apiTests.errors.push('No new careers found in API results');
      console.log(`   ⚠️  No new careers found in first API test (may be normal)`);
    }
    
    // Run multiple tests
    console.log(`   🔄 Running ${TEST_CONFIG.testRuns} additional tests...`);
    let totalFound = 0;
    
    for (let i = 0; i < TEST_CONFIG.testRuns; i++) {
      await new Promise(resolve => setTimeout(resolve, TEST_CONFIG.delayBetweenRuns));
      
      const testPayload2 = {
        cohort: 'YLA',
        answers: generateAnswers(),
      };
      
      const response2 = await fetch(`${TEST_CONFIG.baseUrl}/api/score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testPayload2),
      });
      
      if (response2.ok) {
        const result2 = await response2.json();
        if (result2.careers) {
          const resultCareerIds2 = result2.careers.map(c => c.id || c.title_fi?.toLowerCase().replace(/\s+/g, '-'));
          const found2 = NEW_CAREERS.filter(id => resultCareerIds2.includes(id));
          totalFound += found2.length;
        }
      }
    }
    
    console.log(`   📊 Average new careers per test: ${(totalFound / TEST_CONFIG.testRuns).toFixed(1)}`);
    
    if (totalFound > 0) {
      results.apiTests.passed++;
      console.log(`   ✅ New careers appearing in API results`);
    } else {
      results.apiTests.failed++;
      results.apiTests.errors.push('New careers not appearing in multiple API tests');
      console.log(`   ⚠️  New careers not appearing (may need specific answer patterns)`);
    }
    
  } catch (error) {
    results.apiTests.failed++;
    results.apiTests.errors.push(error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log(`   ⚠️  Server not running at ${TEST_CONFIG.baseUrl}`);
      console.log(`   💡 Start server with: npm run dev`);
    } else {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }
}

// Run API tests if fetch is available
async function runAllTests() {
  if (typeof fetch !== 'undefined') {
    await testAPI();
  } else {
    console.log(`   ⚠️  Fetch not available, skipping API tests`);
    console.log(`   💡 Install node-fetch or run tests in Node 18+`);
  }
  
  // Final Summary
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  📊 TEST RESULTS SUMMARY');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  
  const totalPassed = Object.values(results).reduce((sum, r) => sum + r.passed, 0);
  const totalFailed = Object.values(results).reduce((sum, r) => sum + r.failed, 0);
  
  Object.entries(results).forEach(([testName, result]) => {
    const status = result.failed === 0 ? '✅' : '❌';
    console.log(`${status} ${testName}:`);
    console.log(`   Passed: ${result.passed}, Failed: ${result.failed}`);
    if (result.errors.length > 0) {
      result.errors.forEach(err => console.log(`   ⚠️  ${err}`));
    }
    console.log('');
  });
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`  Overall: ${totalPassed} passed, ${totalFailed} failed`);
  console.log('═══════════════════════════════════════════════════════════');
  
  if (totalFailed === 0) {
    console.log('');
    console.log('🎉 All tests passed! New careers are successfully integrated.');
    process.exit(0);
  } else {
    console.log('');
    console.log('⚠️  Some tests failed. Please review the errors above.');
    process.exit(1);
  }
}

// Run all tests
runAllTests();

console.log('');

// Test 4: Scoring Engine Integration
console.log('📋 Test 4: Scoring Engine Integration');
console.log('─'.repeat(60));

try {
  // Check if scoring engine file exists
  const scoringEnginePath = path.join(__dirname, 'lib', 'scoring', 'scoringEngine.ts');
  
  if (fs.existsSync(scoringEnginePath)) {
    const scoringContent = fs.readFileSync(scoringEnginePath, 'utf8');
    
    // Check if scoring engine imports careers
    if (scoringContent.includes('careers-fi') || scoringContent.includes('careersData')) {
      results.scoringTests.passed++;
      console.log(`   ✅ Scoring engine imports careers data`);
    } else {
      results.scoringTests.failed++;
      results.scoringTests.errors.push('Scoring engine does not import careers');
      console.log(`   ❌ Scoring engine does not import careers`);
    }
    
    // Check for rankCareers function
    if (scoringContent.includes('rankCareers') || scoringContent.includes('rank')) {
      results.scoringTests.passed++;
      console.log(`   ✅ Scoring engine has ranking function`);
    } else {
      results.scoringTests.failed++;
      results.scoringTests.errors.push('Scoring engine missing ranking function');
      console.log(`   ❌ Scoring engine missing ranking function`);
    }
    
  } else {
    results.scoringTests.failed++;
    results.scoringTests.errors.push('Scoring engine file not found');
    console.log(`   ❌ Scoring engine file not found at ${scoringEnginePath}`);
  }
  
} catch (error) {
  results.scoringTests.failed++;
  results.scoringTests.errors.push(error.message);
  console.log(`   ❌ Error: ${error.message}`);
}


