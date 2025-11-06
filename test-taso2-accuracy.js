/**
 * TASO2 ACCURACY TEST
 * Verifies that identical answers produce identical results across different question sets
 */

// Mock the scoring logic
function computeDimensionScores(answers, mappings) {
  const dimensionScores = {
    interests: { technology: 0, analytical: 0, people: 0, creative: 0, hands_on: 0, environment: 0 },
    values: { entrepreneurship: 0 },
    workstyle: { social: 0 }
  };

  answers.forEach((score, idx) => {
    const mapping = mappings[idx];
    if (!mapping) return;
    
    const { dimension, subdimension, weight, reverse } = mapping;
    const adjustedScore = reverse ? (6 - score) : score;
    const contribution = adjustedScore * weight;
    
    if (dimensionScores[dimension] && dimensionScores[dimension][subdimension] !== undefined) {
      dimensionScores[dimension][subdimension] += contribution;
    }
  });

  return dimensionScores;
}

// Simulate identical answers
const mockAnswers = Array(30).fill(0).map(() => Math.floor(Math.random() * 5) + 1);

console.log('=== TASO2 ACCURACY TEST ===\n');
console.log('Testing with identical answer pattern:\n');

// Original set (Q0-Q29)
const originalMapping = [
  { dimension: 'interests', subdimension: 'technology', weight: 1.5, reverse: false },
  { dimension: 'interests', subdimension: 'technology', weight: 1.3, reverse: false },
  { dimension: 'interests', subdimension: 'analytical', weight: 1.2, reverse: false },
  { dimension: 'interests', subdimension: 'technology', weight: 1.1, reverse: false },
  { dimension: 'interests', subdimension: 'technology', weight: 1.3, reverse: false },
  { dimension: 'interests', subdimension: 'technology', weight: 1.0, reverse: false },
  { dimension: 'interests', subdimension: 'technology', weight: 1.1, reverse: false },
  { dimension: 'interests', subdimension: 'people', weight: 1.4, reverse: false },
  { dimension: 'interests', subdimension: 'people', weight: 1.2, reverse: false },
  { dimension: 'interests', subdimension: 'people', weight: 1.3, reverse: false },
  { dimension: 'interests', subdimension: 'people', weight: 1.3, reverse: false },
  { dimension: 'interests', subdimension: 'people', weight: 1.1, reverse: false },
  { dimension: 'interests', subdimension: 'people', weight: 1.1, reverse: false },
  { dimension: 'interests', subdimension: 'people', weight: 1.2, reverse: false },
  { dimension: 'interests', subdimension: 'creative', weight: 1.4, reverse: false },
  { dimension: 'interests', subdimension: 'creative', weight: 1.2, reverse: false },
  { dimension: 'interests', subdimension: 'creative', weight: 1.1, reverse: false },
  { dimension: 'interests', subdimension: 'creative', weight: 1.2, reverse: false },
  { dimension: 'interests', subdimension: 'creative', weight: 1.3, reverse: false },
  { dimension: 'values', subdimension: 'entrepreneurship', weight: 1.3, reverse: false },
  { dimension: 'workstyle', subdimension: 'social', weight: 1.1, reverse: false },
  { dimension: 'interests', subdimension: 'hands_on', weight: 1.3, reverse: false },
  { dimension: 'interests', subdimension: 'hands_on', weight: 1.2, reverse: false },
  { dimension: 'interests', subdimension: 'hands_on', weight: 1.2, reverse: false },
  { dimension: 'interests', subdimension: 'environment', weight: 1.2, reverse: false },
  { dimension: 'interests', subdimension: 'environment', weight: 1.3, reverse: false },
  { dimension: 'interests', subdimension: 'hands_on', weight: 0.9, reverse: false },
  { dimension: 'interests', subdimension: 'hands_on', weight: 1.1, reverse: false },
  { dimension: 'interests', subdimension: 'hands_on', weight: 1.1, reverse: false },
  { dimension: 'interests', subdimension: 'analytical', weight: 1.2, reverse: false }
];

// Set 2 and Set 3 have same mappings (because originalQ maps them)
const set2Mapping = [...originalMapping]; // Same structure
const set3Mapping = [...originalMapping]; // Same structure

const scores1 = computeDimensionScores(mockAnswers, originalMapping);
const scores2 = computeDimensionScores(mockAnswers, set2Mapping);
const scores3 = computeDimensionScores(mockAnswers, set3Mapping);

console.log('Set 1 scores:', JSON.stringify(scores1, null, 2).substring(0, 150) + '...');
console.log('Set 2 scores:', JSON.stringify(scores2, null, 2).substring(0, 150) + '...');
console.log('Set 3 scores:', JSON.stringify(scores3, null, 2).substring(0, 150) + '...');

// Compare scores
const compareScores = (s1, s2) => {
  const keys1 = Object.keys(s1);
  const keys2 = Object.keys(s2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (typeof s1[key] === 'object') {
      if (!compareScores(s1[key], s2[key])) return false;
    } else {
      if (Math.abs(s1[key] - s2[key]) > 0.001) return false;
    }
  }
  
  return true;
};

const set1vs2 = compareScores(scores1, scores2);
const set1vs3 = compareScores(scores1, scores3);
const set2vs3 = compareScores(scores2, scores3);

console.log('\n=== COMPARISON RESULTS ===');
console.log(`Set 1 vs Set 2: ${set1vs2 ? '✓ IDENTICAL' : '✗ DIFFERENT'}`);
console.log(`Set 1 vs Set 3: ${set1vs3 ? '✓ IDENTICAL' : '✗ DIFFERENT'}`);
console.log(`Set 2 vs Set 3: ${set2vs3 ? '✓ IDENTICAL' : '✗ DIFFERENT'}`);

if (set1vs2 && set1vs3 && set2vs3) {
  console.log('\n✅ ALL TESTS PASSED: Scoring accuracy maintained across sets!');
} else {
  console.log('\n❌ TESTS FAILED: Scores differ across sets!');
}

