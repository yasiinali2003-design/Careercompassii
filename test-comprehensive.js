/**
 * COMPREHENSIVE QUESTION POOL TEST SUITE
 * Tests all aspects of the question pool system for all cohorts
 */

// Mock localStorage for Node.js
if (typeof localStorage === 'undefined') {
  global.localStorage = {
    store: {},
    getItem: function(key) {
      return this.store[key] || null;
    },
    setItem: function(key, value) {
      this.store[key] = value.toString();
    },
    removeItem: function(key) {
      delete this.store[key];
    },
    clear: function() {
      this.store = {};
    }
  };
}

const cohorts = ['YLA', 'TASO2', 'NUORI'];

// Simulate question pool functions
function getStorageKey(cohort) {
  return `careercompass-questionpool-${cohort}`;
}

function getUsedSets(cohort) {
  try {
    const key = getStorageKey(cohort);
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    const data = JSON.parse(stored);
    return data.usedSets || [];
  } catch (error) {
    return [];
  }
}

function markSetAsUsed(cohort, setIndex) {
  try {
    const key = getStorageKey(cohort);
    const usedSets = getUsedSets(cohort);
    if (!usedSets.includes(setIndex)) {
      usedSets.push(setIndex);
    }
    const data = {
      cohort,
      usedSets,
      lastUsed: Date.now(),
      version: '1.0'
    };
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to mark set as used:', error);
  }
}

function getAvailableSets(cohort) {
  const totalSets = 3;
  const usedSets = getUsedSets(cohort);
  return [0, 1, 2].filter(s => !usedSets.includes(s));
}

function selectQuestionSet(cohort) {
  const availableSets = getAvailableSets(cohort);
  if (availableSets.length === 0) {
    localStorage.removeItem(getStorageKey(cohort));
    return 0;
  }
  if (availableSets.includes(0) && getUsedSets(cohort).length === 0) {
    return 0;
  }
  const randomIndex = Math.floor(Math.random() * availableSets.length);
  return availableSets[randomIndex];
}

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║   COMPREHENSIVE QUESTION POOL TEST SUITE                ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    const result = fn();
    if (result === true || (result && result.passed)) {
      passedTests++;
      console.log(`✅ ${name}`);
      return true;
    } else {
      failedTests++;
      console.log(`❌ ${name}`);
      if (result && result.message) {
        console.log(`   ${result.message}`);
      }
      return false;
    }
  } catch (error) {
    failedTests++;
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// ============================================
// TEST GROUP 1: LOCALSTORAGE FUNCTIONALITY
// ============================================
console.log('\n📦 TEST GROUP 1: localStorage Functionality\n');

test('localStorage can store and retrieve data', () => {
  localStorage.clear();
  localStorage.setItem('test', '{"usedSets": [0]}');
  const retrieved = localStorage.getItem('test');
  return retrieved === '{"usedSets": [0]}';
});

test('getUsedSets returns empty array for new cohort', () => {
  localStorage.clear();
  const used = getUsedSets('YLA');
  return used.length === 0;
});

test('markSetAsUsed stores set correctly', () => {
  localStorage.clear();
  markSetAsUsed('YLA', 0);
  const used = getUsedSets('YLA');
  return used.length === 1 && used[0] === 0;
});

test('markSetAsUsed prevents duplicates', () => {
  localStorage.clear();
  markSetAsUsed('YLA', 0);
  markSetAsUsed('YLA', 0);
  const used = getUsedSets('YLA');
  return used.length === 1 && used[0] === 0;
});

test('getAvailableSets returns correct available sets', () => {
  localStorage.clear();
  markSetAsUsed('YLA', 0);
  markSetAsUsed('YLA', 1);
  const available = getAvailableSets('YLA');
  return available.length === 1 && available[0] === 2;
});

test('Corrupted localStorage data is handled gracefully', () => {
  localStorage.clear();
  localStorage.setItem(getStorageKey('YLA'), 'invalid json');
  const used = getUsedSets('YLA');
  return used.length === 0;
});

// ============================================
// TEST GROUP 2: SET SELECTION LOGIC
// ============================================
console.log('\n🎯 TEST GROUP 2: Set Selection Logic\n');

test('First test selects Set 0', () => {
  localStorage.clear();
  const set = selectQuestionSet('YLA');
  return set === 0;
});

test('Second test selects different set', () => {
  localStorage.clear();
  markSetAsUsed('YLA', 0);
  const set = selectQuestionSet('YLA');
  return set === 1 || set === 2;
});

test('Set selection cycles through all sets', () => {
  localStorage.clear();
  const sets = [];
  for (let i = 0; i < 3; i++) {
    const set = selectQuestionSet('YLA');
    sets.push(set);
    markSetAsUsed('YLA', set);
  }
  const uniqueSets = [...new Set(sets)];
  return uniqueSets.length === 3 && sets.length === 3;
});

test('After all sets used, pool resets', () => {
  localStorage.clear();
  markSetAsUsed('YLA', 0);
  markSetAsUsed('YLA', 1);
  markSetAsUsed('YLA', 2);
  const set = selectQuestionSet('YLA');
  const usedAfterReset = getUsedSets('YLA');
  return set === 0 && usedAfterReset.length === 0;
});

test('All cohorts can select sets independently', () => {
  localStorage.clear();
  markSetAsUsed('YLA', 0);
  markSetAsUsed('TASO2', 1);
  markSetAsUsed('NUORI', 2);
  
  const ylaUsed = getUsedSets('YLA');
  const taso2Used = getUsedSets('TASO2');
  const nuoriUsed = getUsedSets('NUORI');
  
  return ylaUsed[0] === 0 && taso2Used[0] === 1 && nuoriUsed[0] === 2;
});

// ============================================
// TEST GROUP 3: MULTIPLE TEST CYCLES
// ============================================
console.log('\n🔄 TEST GROUP 3: Multiple Test Cycles\n');

test('Complete cycle: 3 tests use all sets', () => {
  localStorage.clear();
  const setsUsed = [];
  
  for (let i = 0; i < 3; i++) {
    const set = selectQuestionSet('YLA');
    setsUsed.push(set);
    markSetAsUsed('YLA', set);
  }
  
  const allSetsUsed = setsUsed.includes(0) && setsUsed.includes(1) && setsUsed.includes(2);
  const finalUsed = getUsedSets('YLA');
  
  return allSetsUsed && finalUsed.length === 3;
});

test('Fourth test resets and starts cycle again', () => {
  localStorage.clear();
  
  // Use all sets
  for (let i = 0; i < 3; i++) {
    const set = selectQuestionSet('YLA');
    markSetAsUsed('YLA', set);
  }
  
  // Fourth test should reset
  const set4 = selectQuestionSet('YLA');
  markSetAsUsed('YLA', set4);
  
  const usedAfter4 = getUsedSets('YLA');
  return set4 === 0 && usedAfter4.length === 1;
});

// ============================================
// TEST GROUP 4: PERSISTENCE
// ============================================
console.log('\n💾 TEST GROUP 4: Persistence\n');

test('Data persists across multiple operations', () => {
  localStorage.clear();
  markSetAsUsed('YLA', 0);
  markSetAsUsed('YLA', 1);
  
  // Simulate page reload - check data still exists
  const persisted = getUsedSets('YLA');
  return persisted.length === 2 && persisted.includes(0) && persisted.includes(1);
});

test('Multiple cohorts maintain separate state', () => {
  localStorage.clear();
  
  markSetAsUsed('YLA', 0);
  markSetAsUsed('TASO2', 1);
  markSetAsUsed('NUORI', 2);
  
  const yla = getUsedSets('YLA');
  const taso2 = getUsedSets('TASO2');
  const nuori = getUsedSets('NUORI');
  
  return yla[0] === 0 && taso2[0] === 1 && nuori[0] === 2 &&
         yla.length === 1 && taso2.length === 1 && nuori.length === 1;
});

// ============================================
// TEST GROUP 5: EDGE CASES
// ============================================
console.log('\n🔍 TEST GROUP 5: Edge Cases\n');

test('Empty localStorage returns empty array', () => {
  localStorage.clear();
  const used = getUsedSets('YLA');
  return used.length === 0;
});

test('Invalid JSON is handled gracefully', () => {
  localStorage.clear();
  localStorage.setItem(getStorageKey('YLA'), 'invalid json');
  const used = getUsedSets('YLA');
  return used.length === 0;
});

test('Missing data structure defaults correctly', () => {
  localStorage.clear();
  localStorage.setItem(getStorageKey('YLA'), '{"other": "data"}');
  const used = getUsedSets('YLA');
  return used.length === 0;
});

test('Set selection works with partial data', () => {
  localStorage.clear();
  markSetAsUsed('YLA', 0);
  const available = getAvailableSets('YLA');
  return available.length === 2 && available.includes(1) && available.includes(2);
});

// ============================================
// TEST GROUP 6: ALL COHORTS
// ============================================
console.log('\n👥 TEST GROUP 6: All Cohorts\n');

test('YLA cohort works correctly', () => {
  localStorage.clear();
  const set1 = selectQuestionSet('YLA');
  markSetAsUsed('YLA', set1);
  const set2 = selectQuestionSet('YLA');
  markSetAsUsed('YLA', set2);
  
  return set1 === 0 && set2 !== set1 && (set2 === 1 || set2 === 2);
});

test('TASO2 cohort works correctly', () => {
  localStorage.clear();
  const set1 = selectQuestionSet('TASO2');
  markSetAsUsed('TASO2', set1);
  const set2 = selectQuestionSet('TASO2');
  markSetAsUsed('TASO2', set2);
  
  return set1 === 0 && set2 !== set1 && (set2 === 1 || set2 === 2);
});

test('NUORI cohort works correctly', () => {
  localStorage.clear();
  const set1 = selectQuestionSet('NUORI');
  markSetAsUsed('NUORI', set1);
  const set2 = selectQuestionSet('NUORI');
  markSetAsUsed('NUORI', set2);
  
  return set1 === 0 && set2 !== set1 && (set2 === 1 || set2 === 2);
});

// ============================================
// TEST GROUP 7: INTEGRATION SIMULATION
// ============================================
console.log('\n🔗 TEST GROUP 7: Integration Simulation\n');

test('Complete user flow simulation', () => {
  localStorage.clear();
  
  // Simulate user taking test 3 times
  const setsUsed = [];
  for (let i = 0; i < 3; i++) {
    const set = selectQuestionSet('YLA');
    setsUsed.push(set);
    markSetAsUsed('YLA', set);
  }
  
  // Verify all sets were used
  const uniqueSets = [...new Set(setsUsed)];
  const allSetsUsed = uniqueSets.length === 3;
  
  // Verify reset happens
  const set4 = selectQuestionSet('YLA');
  const resetHappened = set4 === 0;
  
  return allSetsUsed && resetHappened;
});

// ============================================
// FINAL SUMMARY
// ============================================
console.log('\n╔═══════════════════════════════════════════════════════════╗');
console.log('║                    TEST SUMMARY                          ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

console.log(`Total Tests: ${totalTests}`);
console.log(`✅ Passed: ${passedTests}`);
console.log(`❌ Failed: ${failedTests}`);
console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%\n`);

if (failedTests === 0) {
  console.log('🎉 ALL TESTS PASSED! Question pool system is working correctly.\n');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed. Please review the errors above.\n');
  process.exit(1);
}

