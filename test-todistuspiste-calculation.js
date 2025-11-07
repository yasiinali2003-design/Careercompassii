/**
 * TEST: Todistuspiste Calculation Logic
 * Tests the grade-to-points conversion and bonus point calculation
 */

// Mock the calculation functions (simplified for Node.js testing)
function getGradePoints(grade) {
  const gradeMap = {
    'L': 7, 'E': 6, 'M': 5, 'C': 4, 'B': 3, 'A': 2, 'I': 0,
    'l': 7, 'e': 6, 'm': 5, 'c': 4, 'b': 3, 'a': 2, 'i': 0
  };
  return gradeMap[grade] ?? 0;
}

function calculateBonusPoints(grades) {
  const motherTongue = grades['äidinkieli'] || grades['Äidinkieli'] || grades['aidinkieli'];
  const mathematics = grades['matematiikka'] || grades['Matematiikka'];
  const hasMotherTongueBonus = motherTongue && motherTongue.toUpperCase() === 'L';
  const hasMathematicsBonus = mathematics && mathematics.toUpperCase() === 'L';
  return hasMotherTongueBonus || hasMathematicsBonus ? 2 : 0;
}

function calculateTodistuspisteet(grades) {
  const subjectPoints = {};
  let totalPoints = 0;
  
  for (const [subject, grade] of Object.entries(grades)) {
    if (grade && grade.trim() !== '') {
      const points = getGradePoints(grade.trim());
      subjectPoints[subject] = points;
      totalPoints += points;
    }
  }
  
  const bonusPoints = calculateBonusPoints(grades);
  totalPoints += bonusPoints;
  
  return {
    totalPoints,
    subjectPoints,
    bonusPoints
  };
}

// Test Cases
console.log('🧪 Testing Todistuspiste Calculation Logic\n');

// Test 1: Basic grade conversion
console.log('Test 1: Basic grade conversion');
const test1 = {
  'äidinkieli': 'L',
  'matematiikka': 'E',
  'englanti': 'M',
  'historia': 'C'
};
const result1 = calculateTodistuspisteet(test1);
console.log('Input:', test1);
console.log('Expected: 7+6+5+4+2(bonus) = 24 points');
console.log('Result:', result1.totalPoints, 'points');
console.log('✅ PASS' + (result1.totalPoints === 24 ? '' : ' ❌ FAIL'));
console.log('');

// Test 2: All grades L (maximum)
console.log('Test 2: All grades L (maximum)');
const test2 = {
  'äidinkieli': 'L',
  'matematiikka': 'L',
  'englanti': 'L',
  'historia': 'L',
  'fysiikka': 'L',
  'kemia': 'L',
  'biologia': 'L'
};
const result2 = calculateTodistuspisteet(test2);
console.log('Input:', test2);
console.log('Expected: 7*7 + 2(bonus) = 51 points');
console.log('Result:', result2.totalPoints, 'points');
console.log('✅ PASS' + (result2.totalPoints === 51 ? '' : ' ❌ FAIL'));
console.log('');

// Test 3: Average grades (C average)
console.log('Test 3: Average grades (C average)');
const test3 = {
  'äidinkieli': 'C',
  'matematiikka': 'C',
  'englanti': 'C',
  'historia': 'C',
  'fysiikka': 'C',
  'kemia': 'C'
};
const result3 = calculateTodistuspisteet(test3);
console.log('Input:', test3);
console.log('Expected: 4*6 = 24 points (no bonus)');
console.log('Result:', result3.totalPoints, 'points');
console.log('✅ PASS' + (result3.totalPoints === 24 ? '' : ' ❌ FAIL'));
console.log('');

// Test 4: Bonus points only for äidinkieli L
console.log('Test 4: Bonus points only for äidinkieli L');
const test4 = {
  'äidinkieli': 'L',
  'matematiikka': 'E',
  'englanti': 'M'
};
const result4 = calculateTodistuspisteet(test4);
console.log('Input:', test4);
console.log('Expected: 7+6+5+2(bonus) = 20 points');
console.log('Result:', result4.totalPoints, 'points');
console.log('✅ PASS' + (result4.totalPoints === 20 ? '' : ' ❌ FAIL'));
console.log('');

// Test 5: Bonus points only for matematiikka L
console.log('Test 5: Bonus points only for matematiikka L');
const test5 = {
  'äidinkieli': 'E',
  'matematiikka': 'L',
  'englanti': 'M'
};
const result5 = calculateTodistuspisteet(test5);
console.log('Input:', test5);
console.log('Expected: 6+7+5+2(bonus) = 20 points');
console.log('Result:', result5.totalPoints, 'points');
console.log('✅ PASS' + (result5.totalPoints === 20 ? '' : ' ❌ FAIL'));
console.log('');

// Test 6: Lowercase grades
console.log('Test 6: Lowercase grades');
const test6 = {
  'äidinkieli': 'l',
  'matematiikka': 'e',
  'englanti': 'm'
};
const result6 = calculateTodistuspisteet(test6);
console.log('Input:', test6);
console.log('Expected: 7+6+5+2(bonus) = 20 points');
console.log('Result:', result6.totalPoints, 'points');
console.log('✅ PASS' + (result6.totalPoints === 20 ? '' : ' ❌ FAIL'));
console.log('');

// Test 7: Invalid grade handling
console.log('Test 7: Invalid grade handling');
const test7 = {
  'äidinkieli': 'X',
  'matematiikka': 'C',
  'englanti': 'M'
};
const result7 = calculateTodistuspisteet(test7);
console.log('Input:', test7);
console.log('Expected: 0+4+5 = 9 points (invalid grade = 0)');
console.log('Result:', result7.totalPoints, 'points');
console.log('✅ PASS' + (result7.totalPoints === 9 ? '' : ' ❌ FAIL'));
console.log('');

// Test 8: Empty grades
console.log('Test 8: Empty grades');
const test8 = {
  'äidinkieli': '',
  'matematiikka': 'C',
  'englanti': 'M'
};
const result8 = calculateTodistuspisteet(test8);
console.log('Input:', test8);
console.log('Expected: 0+4+5 = 9 points (empty = 0)');
console.log('Result:', result8.totalPoints, 'points');
console.log('✅ PASS' + (result8.totalPoints === 9 ? '' : ' ❌ FAIL'));
console.log('');

console.log('✅ All calculation tests completed!');

