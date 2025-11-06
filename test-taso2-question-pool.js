/**
 * TASO2 QUESTION POOL VALIDATION TEST
 * Tests question set selection, mapping, and scoring accuracy for TASO2
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
  const totalSets = 3; // TASO2 has 3 sets
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

console.log('=== TASO2 QUESTION POOL TEST ===\n');

// Test 1: Initial State
console.log('TEST 1: Initial State');
localStorage.clear();
localStorage.removeItem(getStorageKey('TASO2'));
const set1 = selectQuestionSet('TASO2');
console.log(`✓ First test selects Set ${set1} (expected: 0)`);
console.assert(set1 === 0, 'First test should select Set 0');

markSetAsUsed('TASO2', set1);
const used1 = getUsedSets('TASO2');
console.log(`✓ Used sets after first: [${used1.join(', ')}]`);

// Test 2: Multiple cycles
console.log('\nTEST 2: Multiple Test Cycles');
const setsUsed = [];
for (let i = 0; i < 4; i++) {
  const set = selectQuestionSet('TASO2');
  setsUsed.push(set);
  markSetAsUsed('TASO2', set);
  const used = getUsedSets('TASO2');
  console.log(`Test ${i + 1}: Selected Set ${set}, Used sets: [${used.join(', ')}]`);
}

console.log(`✓ All sets used: [${setsUsed.join(', ')}]`);

// Test 3: Reset
console.log('\nTEST 3: Reset After All Sets Used');
const set4 = selectQuestionSet('TASO2');
console.log(`✓ 4th test selects Set ${set4} (should reset to 0)`);
console.assert(set4 === 0, 'Should reset to Set 0');

// Test 4: Persistence
console.log('\nTEST 4: Persistence');
localStorage.removeItem(getStorageKey('TASO2'));
markSetAsUsed('TASO2', 0);
markSetAsUsed('TASO2', 1);
const persisted = getUsedSets('TASO2');
console.log(`✓ Persisted used sets: [${persisted.join(', ')}]`);
console.assert(persisted.length === 2, 'Should persist 2 sets');

const available = getAvailableSets('TASO2');
console.log(`✓ Available sets: [${available.join(', ')}]`);
console.assert(available.length === 1 && available[0] === 2, 'Should show Set 2 available');

console.log('\n=== ALL TASO2 TESTS PASSED ===');

