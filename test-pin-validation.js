/**
 * Test PIN Generation - Component Validation Logic
 * Tests the frontend validation logic without requiring API calls
 */

console.log('='.repeat(60));
console.log('🧪 PIN Generation - Component Validation Tests');
console.log('='.repeat(60));
console.log('');

// Mock validation function (matches component logic exactly)
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

// Mock input handler (matches component logic)
function handlePinCountChange(value) {
  // Only allow numeric input
  if (value === '' || /^\d+$/.test(value)) {
    return { value, error: validatePinCount(value).error };
  }
  return { value: '', error: 'Syötä kelvollinen numero' };
}

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

// Test 1: Empty input handling
console.log('📋 Test Group 1: Empty Input Handling');
logTest('Empty string', !validatePinCount('').valid && validatePinCount('').error === '', 'Should allow empty (user typing)');
logTest('handlePinCountChange("")', handlePinCountChange('').value === '' && handlePinCountChange('').error === '', 'Should allow empty input');
console.log('');

// Test 2: Valid inputs
console.log('📋 Test Group 2: Valid Inputs');
logTest('Valid: 1', validatePinCount('1').valid, 'Minimum valid value');
logTest('Valid: 2', validatePinCount('2').valid, 'Small valid value');
logTest('Valid: 10', validatePinCount('10').valid, 'Previously fixed option');
logTest('Valid: 25', validatePinCount('25').valid, 'Previously fixed option');
logTest('Valid: 50', validatePinCount('50').valid, 'Middle value');
logTest('Valid: 99', validatePinCount('99').valid, 'Near maximum');
logTest('Valid: 100', validatePinCount('100').valid, 'Maximum valid value');
console.log('');

// Test 3: Invalid - too low
console.log('📋 Test Group 3: Invalid Inputs - Too Low');
logTest('Invalid: 0', !validatePinCount('0').valid && validatePinCount('0').error.includes('Vähintään'), 'Should reject 0');
logTest('Invalid: -1', !validatePinCount('-1').valid && validatePinCount('-1').error.includes('Vähintään'), 'Should reject negative');
logTest('Invalid: -10', !validatePinCount('-10').valid && validatePinCount('-10').error.includes('Vähintään'), 'Should reject large negative');
console.log('');

// Test 4: Invalid - too high
console.log('📋 Test Group 4: Invalid Inputs - Too High');
logTest('Invalid: 101', !validatePinCount('101').valid && validatePinCount('101').error.includes('Maksimissaan'), 'Should reject 101');
logTest('Invalid: 200', !validatePinCount('200').valid && validatePinCount('200').error.includes('Maksimissaan'), 'Should reject 200');
logTest('Invalid: 1000', !validatePinCount('1000').valid && validatePinCount('1000').error.includes('Maksimissaan'), 'Should reject 1000');
console.log('');

// Test 5: Invalid - non-numeric
console.log('📋 Test Group 5: Invalid Inputs - Non-Numeric');
logTest('Invalid: "abc"', !validatePinCount('abc').valid && validatePinCount('abc').error.includes('kelvollinen'), 'Should reject letters');
logTest('Invalid: "12abc"', !validatePinCount('12abc').valid && validatePinCount('12abc').error.includes('kelvollinen'), 'Should reject mixed');
logTest('Invalid: "abc12"', !validatePinCount('abc12').valid && validatePinCount('abc12').error.includes('kelvollinen'), 'Should reject mixed');
logTest('Invalid: "12.5"', !validatePinCount('12.5').valid && validatePinCount('12.5').error.includes('kelvollinen'), 'Should reject decimals');
logTest('Invalid: " "', !validatePinCount(' ').valid && validatePinCount(' ').error.includes('kelvollinen'), 'Should reject spaces');
console.log('');

// Test 6: Input handler filtering
console.log('📋 Test Group 6: Input Handler Filtering');
logTest('handlePinCountChange("1")', handlePinCountChange('1').value === '1' && handlePinCountChange('1').error === '', 'Should allow "1"');
logTest('handlePinCountChange("50")', handlePinCountChange('50').value === '50' && handlePinCountChange('50').error === '', 'Should allow "50"');
logTest('handlePinCountChange("abc")', handlePinCountChange('abc').value === '', 'Should filter out "abc"');
logTest('handlePinCountChange("12abc")', handlePinCountChange('12abc').value === '', 'Should filter out "12abc"');
logTest('handlePinCountChange("abc12")', handlePinCountChange('abc12').value === '', 'Should filter out "abc12"');
console.log('');

// Test 7: Edge cases
console.log('📋 Test Group 7: Edge Cases');
logTest('Very long number: "999999"', !validatePinCount('999999').valid && validatePinCount('999999').error.includes('Maksimissaan'), 'Should reject very long numbers');
logTest('Leading zeros: "01"', validatePinCount('01').valid, 'Should accept "01" as 1 (parseInt handles this)');
logTest('Leading zeros: "001"', validatePinCount('001').valid, 'Should accept "001" as 1');
logTest('Just boundary: "1"', validatePinCount('1').valid, 'Lower boundary');
logTest('Just boundary: "100"', validatePinCount('100').valid, 'Upper boundary');
console.log('');

// Test 8: Button state logic
console.log('📋 Test Group 8: Button State Logic');
function shouldDisableButton(pinCount, pinCountError, loading) {
  return loading || !pinCount || !!pinCountError;
}

logTest('Button disabled: empty', shouldDisableButton('', '', false), 'Should disable when empty');
logTest('Button disabled: error', shouldDisableButton('101', 'Maksimissaan 100 PIN-koodia', false), 'Should disable when error');
logTest('Button disabled: loading', shouldDisableButton('50', '', true), 'Should disable when loading');
logTest('Button enabled: valid', !shouldDisableButton('50', '', false), 'Should enable when valid');
logTest('Button enabled: valid (1)', !shouldDisableButton('1', '', false), 'Should enable when valid (1)');
logTest('Button enabled: valid (100)', !shouldDisableButton('100', '', false), 'Should enable when valid (100)');
console.log('');

// Test 9: Generate handler logic
console.log('📋 Test Group 9: Generate Handler Logic');
function canGenerate(pinCount, pinCountError) {
  if (!pinCount || !validatePinCount(pinCount).valid) {
    return false;
  }
  return true;
}

logTest('Can generate: 1', canGenerate('1', ''), 'Should allow generating 1');
logTest('Can generate: 50', canGenerate('50', ''), 'Should allow generating 50');
logTest('Can generate: 100', canGenerate('100', ''), 'Should allow generating 100');
logTest('Cannot generate: empty', !canGenerate('', ''), 'Should not allow empty');
logTest('Cannot generate: 0', !canGenerate('0', 'Vähintään 1 PIN-koodi'), 'Should not allow 0');
logTest('Cannot generate: 101', !canGenerate('101', 'Maksimissaan 100 PIN-koodia'), 'Should not allow 101');
console.log('');

// Summary
console.log('='.repeat(60));
console.log('📊 Test Summary');
console.log('='.repeat(60));
console.log(`✅ Passed: ${results.passed}`);
console.log(`❌ Failed: ${results.failed}`);
console.log(`📈 Total:  ${results.passed + results.failed}`);
console.log(`🎯 Success Rate: ${Math.round((results.passed / (results.passed + results.failed)) * 100)}%`);
console.log('');

if (results.failed > 0) {
  console.log('❌ Failed Tests:');
  results.tests.filter(t => !t.passed).forEach(t => {
    console.log(`  - ${t.name}: ${t.details || 'No details'}`);
  });
  console.log('');
}

console.log('='.repeat(60));
console.log('');

// Exit with appropriate code
process.exit(results.failed === 0 ? 0 : 1);

