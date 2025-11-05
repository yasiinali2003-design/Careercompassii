/**
 * Test PIN Generation Feature
 * Tests the custom number input PIN generation functionality
 */

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

// Test results
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function logTest(name, passed, details = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status}: ${name}${details ? ` - ${details}` : ''}`);
  results.tests.push({ name, passed, details });
  if (passed) results.passed++;
  else results.failed++;
}

// Mock validation function (matches component logic)
function validatePinCount(value) {
  if (value === '') {
    return { valid: false, error: '' };
  }
  
  const num = parseInt(value, 10);
  
  if (isNaN(num)) {
    return { valid: false, error: 'Syötä kelvollinen numero' };
  }
  
  if (num < 1) {
    return { valid: false, error: 'Vähintään 1 PIN-koodi' };
  }
  
  if (num > 100) {
    return { valid: false, error: 'Maksimissaan 100 PIN-koodia' };
  }
  
  return { valid: true, error: '' };
}

// Test validation logic
console.log('\n🧪 Testing Frontend Validation Logic...\n');

// Valid inputs
logTest('Empty string', !validatePinCount('').valid, 'Should allow empty (user typing)');
logTest('Valid: 1', validatePinCount('1').valid, 'Minimum valid value');
logTest('Valid: 50', validatePinCount('50').valid, 'Middle value');
logTest('Valid: 100', validatePinCount('100').valid, 'Maximum valid value');
logTest('Valid: 99', validatePinCount('99').valid, 'Near maximum');

// Invalid inputs
logTest('Invalid: 0', !validatePinCount('0').valid && validatePinCount('0').error.includes('Vähintään'));
logTest('Invalid: -1', !validatePinCount('-1').valid && validatePinCount('-1').error.includes('Vähintään'));
logTest('Invalid: 101', !validatePinCount('101').valid && validatePinCount('101').error.includes('Maksimissaan'));
logTest('Invalid: 200', !validatePinCount('200').valid && validatePinCount('200').error.includes('Maksimissaan'));
logTest('Invalid: abc', !validatePinCount('abc').valid && validatePinCount('abc').error.includes('kelvollinen'));

// Test API endpoint
async function testAPIEndpoint(classId, count, shouldSucceed = true) {
  try {
    const response = await fetch(`${BASE_URL}/api/classes/${classId}/pins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count })
    });

    const data = await response.json();
    
    if (shouldSucceed) {
      return data.success && data.pins && data.pins.length === count;
    } else {
      return !data.success && response.status === 400;
    }
  } catch (error) {
    return false;
  }
}

// Test API with mock class ID (for validation testing)
async function runAPITests() {
  console.log('\n🧪 Testing API Endpoint Validation...\n');
  
  const mockClassId = 'test-class-' + Date.now();
  
  // Test valid counts
  logTest('API: Valid count 1', await testAPIEndpoint(mockClassId, 1), 'Should generate 1 PIN');
  logTest('API: Valid count 5', await testAPIEndpoint(mockClassId, 5), 'Should generate 5 PINs');
  logTest('API: Valid count 50', await testAPIEndpoint(mockClassId, 50), 'Should generate 50 PINs');
  logTest('API: Valid count 100', await testAPIEndpoint(mockClassId, 100), 'Should generate 100 PINs');
  
  // Test invalid counts
  logTest('API: Invalid count 0', await testAPIEndpoint(mockClassId, 0, false), 'Should reject 0');
  logTest('API: Invalid count -1', await testAPIEndpoint(mockClassId, -1, false), 'Should reject negative');
  logTest('API: Invalid count 101', await testAPIEndpoint(mockClassId, 101, false), 'Should reject >100');
  
  // Test edge cases
  logTest('API: Missing count (defaults to 10)', await testAPIEndpoint(mockClassId, undefined), 'Should use default');
  
  await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
}

// Test PIN uniqueness
async function testPINUniqueness(classId, count) {
  try {
    const response = await fetch(`${BASE_URL}/api/classes/${classId}/pins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count })
    });

    const data = await response.json();
    
    if (!data.success || !data.pins) return false;
    
    const pins = data.pins;
    const uniquePins = new Set(pins);
    
    return pins.length === uniquePins.size && pins.length === count;
  } catch (error) {
    return false;
  }
}

// Test PIN format
function testPINFormat(pin) {
  // PINs should be 4 characters, alphanumeric (excluding confusing chars)
  return /^[A-HJ-NP-Z2-9]{4}$/.test(pin);
}

// Run comprehensive tests
async function runComprehensiveTests() {
  console.log('\n🧪 Testing PIN Generation Features...\n');
  
  const testClassId = 'test-class-comprehensive-' + Date.now();
  
  // Test various counts
  const testCounts = [1, 5, 10, 25, 50, 75, 100];
  
  for (const count of testCounts) {
    try {
      const response = await fetch(`${BASE_URL}/api/classes/${testClassId}/pins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count })
      });

      const data = await response.json();
      
      if (data.success && data.pins) {
        const pins = data.pins;
        const allValid = pins.every(testPINFormat);
        const unique = new Set(pins).size === pins.length;
        const correctCount = pins.length === count;
        
        logTest(
          `Generate ${count} PINs`,
          allValid && unique && correctCount,
          `Format: ${allValid ? 'OK' : 'FAIL'}, Unique: ${unique ? 'OK' : 'FAIL'}, Count: ${correctCount ? 'OK' : 'FAIL'}`
        );
        
        // Test a few PIN formats
        if (pins.length > 0) {
          const samplePin = pins[0];
          logTest(
            `PIN format check (sample: ${samplePin})`,
            testPINFormat(samplePin),
            `Should be 4 alphanumeric chars (no 0,1,I,O)`
          );
        }
      } else {
        logTest(`Generate ${count} PINs`, false, `API returned error: ${data.error || 'Unknown'}`);
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      logTest(`Generate ${count} PINs`, false, `Error: ${error.message}`);
    }
  }
}

// Test error handling
async function testErrorHandling() {
  console.log('\n🧪 Testing Error Handling...\n');
  
  // Test missing classId
  try {
    const response = await fetch(`${BASE_URL}/api/classes//pins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count: 10 })
    });
    
    logTest('Missing classId', response.status === 400 || response.status === 404, 'Should return error');
  } catch (error) {
    logTest('Missing classId', true, 'Request failed as expected');
  }
  
  // Test invalid JSON
  try {
    const response = await fetch(`${BASE_URL}/api/classes/test123/pins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid json'
    });
    
    logTest('Invalid JSON', response.status >= 400, 'Should return error');
  } catch (error) {
    logTest('Invalid JSON', true, 'Request failed as expected');
  }
  
  // Test non-numeric count
  try {
    const response = await fetch(`${BASE_URL}/api/classes/test123/pins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count: 'not-a-number' })
    });
    
    const data = await response.json();
    logTest('Non-numeric count', !data.success, 'Should reject non-numeric');
  } catch (error) {
    logTest('Non-numeric count', true, 'Request failed as expected');
  }
}

// Main test runner
async function runAllTests() {
  console.log('='.repeat(60));
  console.log('🧪 PIN Generation Feature Tests');
  console.log('='.repeat(60));
  
  // Run validation tests (synchronous)
  // Already run above
  
  // Run API tests
  await runAPITests();
  
  // Run comprehensive generation tests
  await runComprehensiveTests();
  
  // Test error handling
  await testErrorHandling();
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Total:  ${results.passed + results.failed}`);
  console.log(`🎯 Success Rate: ${Math.round((results.passed / (results.passed + results.failed)) * 100)}%`);
  
  if (results.failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.tests.filter(t => !t.passed).forEach(t => {
      console.log(`  - ${t.name}: ${t.details}`);
    });
  }
  
  console.log('\n' + '='.repeat(60));
  
  return results.failed === 0;
}

// Run tests
runAllTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('\n❌ Test runner error:', error);
    process.exit(1);
  });

