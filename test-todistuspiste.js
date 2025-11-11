/**
 * Legacy smoke test runner for todistuspistelaskuri
 * Delegates to the shared calculation helper to ensure parity with the UI.
 */

const { calculateTodistuspisteetWithOptions } = require('./test-todistuspiste-calculation.js');

function logResult(name, result, expected) {
  const pass = Math.round(result) === Math.round(expected);
  console.log(`${name}: ${result.toFixed(0)} p (expected ${expected}) ${pass ? '✓ PASS' : '✗ FAIL'}`);
}

console.log('=== TODISTUSPISTE CALCULATION SMOKE TESTS ===\n');

// Test 1: Basic yliopisto calculation
const case1 = calculateTodistuspisteetWithOptions(
  {
    'äidinkieli': { grade: 'L' },
    'matematiikka': { grade: 'E', variantKey: 'pitka' },
    'englanti': { grade: 'M', variantKey: 'a' },
    'reaaliaineet': { grade: 'C' }
  },
  { scheme: 'yliopisto' }
);
logResult('Test 1 (peruspisteet)', case1.totalPoints, 46 + 43 + 34 + 15);

// Test 2: Maximum points (all L)
const case2 = calculateTodistuspisteetWithOptions(
  {
    'äidinkieli': { grade: 'L' },
    'matematiikka': { grade: 'L', variantKey: 'pitka' },
    'englanti': { grade: 'L', variantKey: 'a' },
    'reaaliaineet': { grade: 'L' },
    'reaali-2': { grade: 'L' },
    'muu-kieli': { grade: 'L', variantKey: 'a' }
  },
  { scheme: 'yliopisto' }
);
logResult('Test 2 (maksimi)', case2.totalPoints, 198);

// Test 3: Average grades (C)
const case3 = calculateTodistuspisteetWithOptions(
  {
    'äidinkieli': { grade: 'C' },
    'matematiikka': { grade: 'C', variantKey: 'lyhyt' },
    'englanti': { grade: 'C', variantKey: 'b' },
    'reaaliaineet': { grade: 'C' }
  },
  { scheme: 'amk' }
);
logResult('Test 3 (keskiarvo C)', case3.totalPoints, 26 + 19 + 18 + 15);

// Test 4: Invalid/empty grades
const case4 = calculateTodistuspisteetWithOptions(
  {
    'äidinkieli': { grade: '' },
    'matematiikka': { grade: 'x', variantKey: 'pitka' },
    'englanti': { grade: 'B', variantKey: 'a' }
  },
  { scheme: 'amk' }
);
logResult('Test 4 (virheelliset arvot)', case4.totalPoints, 18);

// Test 5: AMK vs. Yliopisto parity
const sharedInputs = {
  'äidinkieli': { grade: 'E' },
  'matematiikka': { grade: 'M', variantKey: 'pitka' },
  'englanti': { grade: 'E', variantKey: 'a' },
  'toinen-kotimainen': { grade: 'C', variantKey: 'b' },
  'reaaliaineet': { grade: 'M' }
};
const amk = calculateTodistuspisteetWithOptions(sharedInputs, { scheme: 'amk' });
const yliopisto = calculateTodistuspisteetWithOptions(sharedInputs, { scheme: 'yliopisto' });
console.log(
  `Test 5 (skaalapariteetti): AMK ${amk.totalPoints.toFixed(0)} p vs. YO ${yliopisto.totalPoints.toFixed(0)} p ${
    Math.round(amk.totalPoints) === Math.round(yliopisto.totalPoints) ? '✓ PASS' : '✗ FAIL'
  }`
);

console.log('\n=== TESTS COMPLETE ===');
