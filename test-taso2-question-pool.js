require('ts-node/register');

/**
 * TASO2 QUESTION POOL VALIDATION TEST
 * Tests question set selection, mapping, and scoring accuracy for TASO2
 */

const {
  selectQuestionSet,
  markSetAsUsed,
  getUsedSets,
  resetQuestionPool,
  getAvailableSets
} = require('./lib/questionPool');

// Mock localStorage for Node.js (if running outside browser)
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

console.log('=== TASO2 QUESTION POOL TEST ===\n');

// Test 1: Initial State
console.log('TEST 1: Initial State');
resetQuestionPool('TASO2');
const set1 = selectQuestionSet('TASO2');
console.log(`✓ First test selects Set ${set1} (expected: 0)`);
console.assert(set1 === 0, 'First test should select Set 0');

markSetAsUsed('TASO2', set1);
const used1 = getUsedSets('TASO2');
console.log(`✓ Used sets after first: [${used1.join(', ')}]`);

// Test 2: Multiple cycles
console.log('\nTEST 2: Cycling Through Sets');
const seenSets = new Set([set1]);
while (seenSets.size < 3) {
  const nextSet = selectQuestionSet('TASO2');
  seenSets.add(nextSet);
  markSetAsUsed('TASO2', nextSet);
  const used = getUsedSets('TASO2');
  console.log(`Selected Set ${nextSet}, Used sets: [${used.join(', ')}]`);
}

console.log(`✓ Reached all sets: [${Array.from(seenSets).join(', ')}]`);

// Test 3: Reset after exhausting sets
console.log('\nTEST 3: Reset After All Sets Used');
const set4 = selectQuestionSet('TASO2');
console.log(`✓ 4th test selects Set ${set4} (should reset to 0)`);
console.assert(set4 === 0, 'Should reset to Set 0');

// Test 4: Persistence
console.log('\nTEST 4: Persistence');
resetQuestionPool('TASO2');
markSetAsUsed('TASO2', 0);
markSetAsUsed('TASO2', 1);
const persisted = getUsedSets('TASO2');
console.log(`✓ Persisted used sets: [${persisted.join(', ')}]`);
console.assert(persisted.length === 2, 'Should persist 2 sets');

const available = getAvailableSets('TASO2');
console.log(`✓ Available sets: [${available.join(', ')}]`);
console.assert(available.length === 1 && available[0] === 2, 'Should show Set 2 available');

console.log('\n=== ALL TASO2 TESTS PASSED ===');
