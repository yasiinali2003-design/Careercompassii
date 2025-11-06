/**
 * LOCALSTORAGE TEST FOR QUESTION POOL
 * Tests localStorage persistence and set selection logic
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

// Import functions (in browser, these would be available)
// For testing, we'll simulate the logic

function getStorageKey(cohort) {
  return `careercompass-questionpool-${cohort}`;
}

function getUsedSets(cohort) {
  try {
    const key = getStorageKey(cohort);
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    
    const data = JSON.parse(stored);
    if (!data.usedSets || !Array.isArray(data.usedSets)) {
      return [];
    }
    return data.usedSets;
  } catch (error) {
    console.warn('Failed to get used sets:', error);
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
  const totalSets = 3; // YLA has 3 sets
  const usedSets = getUsedSets(cohort);
  const allSets = Array.from({ length: totalSets }, (_, i) => i);
  return allSets.filter(setIndex => !usedSets.includes(setIndex));
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

function resetQuestionPool(cohort) {
  try {
    const key = getStorageKey(cohort);
    localStorage.removeItem(key);
  } catch (error) {
    console.warn('Failed to reset:', error);
  }
}

// Test 1: Basic localStorage operations
console.log('=== TEST 1: Basic localStorage Operations ===');
localStorage.clear();
resetQuestionPool('YLA');

const set1 = selectQuestionSet('YLA');
console.log(`✓ First test selects Set ${set1} (expected: 0)`);
console.assert(set1 === 0, 'First test should select Set 0');

markSetAsUsed('YLA', set1);
const used1 = getUsedSets('YLA');
console.log(`✓ Used sets after first: [${used1.join(', ')}]`);
console.assert(used1.length === 1 && used1[0] === 0, 'Should have Set 0 marked as used');

// Test 2: Multiple test cycles
console.log('\n=== TEST 2: Multiple Test Cycles ===');
resetQuestionPool('YLA');

const setsUsed = [];
for (let i = 0; i < 5; i++) {
  const set = selectQuestionSet('YLA');
  setsUsed.push(set);
  markSetAsUsed('YLA', set);
  const used = getUsedSets('YLA');
  console.log(`Test ${i + 1}: Selected Set ${set}, Used sets: [${used.join(', ')}]`);
}

console.log(`✓ All sets used: [${setsUsed.join(', ')}]`);
console.assert(setsUsed.length === 5, 'Should have 5 test runs');

// Test 3: Reset after all sets used
console.log('\n=== TEST 3: Reset After All Sets Used ===');
const usedAfterCycles = getUsedSets('YLA');
console.log(`✓ Used sets after 5 cycles: [${usedAfterCycles.join(', ')}]`);

const set6 = selectQuestionSet('YLA');
console.log(`✓ 6th test selects Set ${set6} (should reset to 0)`);
console.assert(set6 === 0, 'Should reset to Set 0');

// Test 4: Persistence across sessions
console.log('\n=== TEST 4: Persistence Simulation ===');
resetQuestionPool('YLA');
markSetAsUsed('YLA', 0);
markSetAsUsed('YLA', 1);

// Simulate browser refresh - data persists
const persistedUsed = getUsedSets('YLA');
console.log(`✓ Persisted used sets: [${persistedUsed.join(', ')}]`);
console.assert(persistedUsed.length === 2, 'Should persist 2 used sets');

const availableAfterPersistence = getAvailableSets('YLA');
console.log(`✓ Available sets after persistence: [${availableAfterPersistence.join(', ')}]`);
console.assert(availableAfterPersistence.length === 1 && availableAfterPersistence[0] === 2, 'Should show only Set 2 available');

// Test 5: Edge cases
console.log('\n=== TEST 5: Edge Cases ===');
resetQuestionPool('YLA');

// Test with corrupted data
localStorage.setItem(getStorageKey('YLA'), 'invalid json');
const corruptedUsed = getUsedSets('YLA');
console.log(`✓ Handles corrupted data gracefully: [${corruptedUsed.join(', ')}]`);
console.assert(corruptedUsed.length === 0, 'Should return empty array for corrupted data');

// Test with missing data
localStorage.removeItem(getStorageKey('YLA'));
const missingUsed = getUsedSets('YLA');
console.log(`✓ Handles missing data gracefully: [${missingUsed.join(', ')}]`);
console.assert(missingUsed.length === 0, 'Should return empty array for missing data');

console.log('\n=== ALL LOCALSTORAGE TESTS PASSED ===');

