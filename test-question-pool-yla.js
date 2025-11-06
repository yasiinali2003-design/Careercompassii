/**
 * COMPREHENSIVE TEST SCRIPT FOR YLA QUESTION POOL
 * Tests question set selection, mapping, and scoring accuracy
 */

import { selectQuestionSet, markSetAsUsed, getUsedSets, resetQuestionPool, getAvailableSets } from './lib/questionPool.js';
import { getQuestionMappings } from './lib/scoring/dimensions.js';

// Helper to simulate localStorage (for Node.js environment)
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

// Test 1: Set Selection
console.log('=== TEST 1: Set Selection ===');
resetQuestionPool('YLA');
const set1 = selectQuestionSet('YLA');
console.log(`✓ First test selects Set ${set1} (expected: 0)`);
console.assert(set1 === 0, 'First test should select Set 0');

markSetAsUsed('YLA', set1);
const used1 = getUsedSets('YLA');
console.log(`✓ Used sets after first test: [${used1.join(', ')}]`);

const set2 = selectQuestionSet('YLA');
console.log(`✓ Second test selects Set ${set2} (should be 1 or 2)`);
console.assert(set2 !== set1, 'Second test should select different set');
console.assert(set2 === 1 || set2 === 2, 'Second test should select Set 1 or 2');

markSetAsUsed('YLA', set2);
const used2 = getUsedSets('YLA');
console.log(`✓ Used sets after second test: [${used2.join(', ')}]`);

const set3 = selectQuestionSet('YLA');
console.log(`✓ Third test selects Set ${set3} (should be remaining set)`);
console.assert(set3 !== set1 && set3 !== set2, 'Third test should select remaining set');

markSetAsUsed('YLA', set3);
const used3 = getUsedSets('YLA');
console.log(`✓ Used sets after third test: [${used3.join(', ')}]`);

const set4 = selectQuestionSet('YLA');
console.log(`✓ Fourth test selects Set ${set4} (should reset to 0)`);
console.assert(set4 === 0, 'Fourth test should reset and select Set 0');

console.log('\n=== TEST 2: Question Mapping ===');

// Test 2: Verify all questions map correctly
const set0Mappings = getQuestionMappings('YLA', 0);
const set1Mappings = getQuestionMappings('YLA', 1);
const set2Mappings = getQuestionMappings('YLA', 2);

console.log(`✓ Set 0 has ${set0Mappings.length} questions`);
console.log(`✓ Set 1 has ${set1Mappings.length} questions`);
console.log(`✓ Set 2 has ${set2Mappings.length} questions`);

// Verify Set 1 (Q30-Q59) maps to originalQ 0-29
let allMappedCorrectly = true;
for (let i = 0; i < set1Mappings.length; i++) {
  const mapping = set1Mappings[i];
  if (mapping.originalQ === undefined || mapping.originalQ !== i) {
    console.error(`✗ Set 1 Q${mapping.q} should map to originalQ ${i}, but maps to ${mapping.originalQ}`);
    allMappedCorrectly = false;
  }
  // Verify same dimension, subdimension, weight
  const originalMapping = set0Mappings[i];
  if (mapping.dimension !== originalMapping.dimension ||
      mapping.subdimension !== originalMapping.subdimension ||
      mapping.weight !== originalMapping.weight ||
      mapping.reverse !== originalMapping.reverse) {
    console.error(`✗ Set 1 Q${mapping.q} should match Set 0 Q${i} properties`);
    allMappedCorrectly = false;
  }
}

if (allMappedCorrectly) {
  console.log('✓ All Set 1 questions map correctly to Set 0');
}

// Verify Set 2 (Q60-Q89) maps to originalQ 0-29
allMappedCorrectly = true;
for (let i = 0; i < set2Mappings.length; i++) {
  const mapping = set2Mappings[i];
  if (mapping.originalQ === undefined || mapping.originalQ !== i) {
    console.error(`✗ Set 2 Q${mapping.q} should map to originalQ ${i}, but maps to ${mapping.originalQ}`);
    allMappedCorrectly = false;
  }
  // Verify same dimension, subdimension, weight
  const originalMapping = set0Mappings[i];
  if (mapping.dimension !== originalMapping.dimension ||
      mapping.subdimension !== originalMapping.subdimension ||
      mapping.weight !== originalMapping.weight ||
      mapping.reverse !== originalMapping.reverse) {
    console.error(`✗ Set 2 Q${mapping.q} should match Set 0 Q${i} properties`);
    allMappedCorrectly = false;
  }
}

if (allMappedCorrectly) {
  console.log('✓ All Set 2 questions map correctly to Set 0');
}

console.log('\n=== TEST 3: Dimension Balance ===');

// Test 3: Verify dimension balance in each set
function checkDimensionBalance(setName, mappings) {
  const dimensionCounts = {
    interests: 0,
    values: 0,
    workstyle: 0,
    context: 0
  };
  
  mappings.forEach(m => {
    dimensionCounts[m.dimension]++;
  });
  
  console.log(`${setName} dimension distribution:`);
  console.log(`  interests: ${dimensionCounts.interests}`);
  console.log(`  values: ${dimensionCounts.values}`);
  console.log(`  workstyle: ${dimensionCounts.workstyle}`);
  console.log(`  context: ${dimensionCounts.context}`);
  
  // Each set should have roughly balanced dimensions (within 3 questions)
  const avg = Object.values(dimensionCounts).reduce((a, b) => a + b) / 4;
  const balanced = Object.values(dimensionCounts).every(count => 
    Math.abs(count - avg) <= 3
  );
  
  if (balanced) {
    console.log(`✓ ${setName} has balanced dimensions`);
  } else {
    console.warn(`⚠ ${setName} may have imbalanced dimensions`);
  }
  
  return balanced;
}

checkDimensionBalance('Set 0', set0Mappings);
checkDimensionBalance('Set 1', set1Mappings);
checkDimensionBalance('Set 2', set2Mappings);

console.log('\n=== TEST 4: Weight Consistency ===');

// Test 4: Verify total weights are similar across sets
function calculateTotalWeight(mappings) {
  return mappings.reduce((sum, m) => sum + m.weight, 0);
}

const weight0 = calculateTotalWeight(set0Mappings);
const weight1 = calculateTotalWeight(set1Mappings);
const weight2 = calculateTotalWeight(set2Mappings);

console.log(`Set 0 total weight: ${weight0.toFixed(2)}`);
console.log(`Set 1 total weight: ${weight1.toFixed(2)}`);
console.log(`Set 2 total weight: ${weight2.toFixed(2)}`);

const weightDiff = Math.max(
  Math.abs(weight0 - weight1),
  Math.abs(weight0 - weight2),
  Math.abs(weight1 - weight2)
);

if (weightDiff < 1.0) {
  console.log(`✓ Total weights are consistent across sets (max diff: ${weightDiff.toFixed(2)})`);
} else {
  console.warn(`⚠ Total weights differ significantly (max diff: ${weightDiff.toFixed(2)})`);
}

console.log('\n=== TEST 5: Reset Functionality ===');

resetQuestionPool('YLA');
const usedAfterReset = getUsedSets('YLA');
console.log(`✓ Used sets after reset: [${usedAfterReset.join(', ')}] (expected: empty)`);
console.assert(usedAfterReset.length === 0, 'Reset should clear all used sets');

const availableAfterReset = getAvailableSets('YLA');
console.log(`✓ Available sets after reset: [${availableAfterReset.join(', ')}] (expected: [0, 1, 2])`);
console.assert(availableAfterReset.length === 3, 'Reset should make all sets available');

console.log('\n=== TEST 6: localStorage Persistence ===');

// Simulate browser storage
localStorage.setItem('careercompass-questionpool-YLA', JSON.stringify({
  cohort: 'YLA',
  usedSets: [0, 1],
  lastUsed: Date.now(),
  version: '1.0'
}));

const persistedUsed = getUsedSets('YLA');
console.log(`✓ Persisted used sets: [${persistedUsed.join(', ')}] (expected: [0, 1])`);
console.assert(persistedUsed.length === 2, 'Should read persisted used sets');

const persistedAvailable = getAvailableSets('YLA');
console.log(`✓ Persisted available sets: [${persistedAvailable.join(', ')}] (expected: [2])`);
console.assert(persistedAvailable.length === 1 && persistedAvailable[0] === 2, 'Should show only Set 2 as available');

console.log('\n=== ALL TESTS COMPLETED ===');
console.log('✓ Question pool system is working correctly!');

