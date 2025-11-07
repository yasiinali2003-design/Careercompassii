/**
 * TEST: Todistuspiste Calculation Logic (TASO2 configuration)
 * Mirrors the behaviour of lib/todistuspiste.ts with weighted subjects.
 */

const SUBJECT_DEFINITIONS = [
  { key: 'äidinkieli', label: 'Äidinkieli', required: true, coefficient: 1 },
  {
    key: 'matematiikka',
    label: 'Matematiikka',
    required: true,
    variants: [
      { key: 'pitka', label: 'Pitkä', coefficient: 1.5 },
      { key: 'lyhyt', label: 'Lyhyt', coefficient: 1.0 }
    ],
    defaultVariantKey: 'pitka'
  },
  {
    key: 'englanti',
    label: 'Englanti',
    required: true,
    variants: [
      { key: 'a', label: 'A-kieli', coefficient: 1.15 },
      { key: 'b', label: 'B-kieli', coefficient: 1.0 }
    ],
    defaultVariantKey: 'a'
  },
  {
    key: 'toinen-kotimainen',
    label: 'Toinen kotimainen',
    required: false,
    variants: [
      { key: 'a', label: 'A-kieli', coefficient: 1.1 },
      { key: 'b', label: 'B-kieli', coefficient: 1.0 }
    ],
    defaultVariantKey: 'b'
  },
  { key: 'reaaliaineet', label: 'Reaaliaine', required: false, coefficient: 1 },
  { key: 'reaali-2', label: 'Reaaliaine 2', required: false, coefficient: 1 },
  { key: 'reaali-3', label: 'Reaaliaine 3', required: false, coefficient: 1 },
  {
    key: 'muu-kieli',
    label: 'Muu vieras kieli',
    required: false,
    variants: [
      { key: 'a', label: 'A-kieli', coefficient: 1.05 },
      { key: 'b', label: 'B-kieli', coefficient: 1.0 }
    ],
    defaultVariantKey: 'b'
  }
];

function getGradePoints(grade) {
  const gradeMap = {
    L: 7,
    E: 6,
    M: 5,
    C: 4,
    B: 3,
    A: 2,
    I: 0,
    l: 7,
    e: 6,
    m: 5,
    c: 4,
    b: 3,
    a: 2,
    i: 0
  };
  return gradeMap[grade] ?? 0;
}

function resolveVariant(subject, input) {
  if (!subject.variants || subject.variants.length === 0) return undefined;
  if (input.variantKey) {
    const chosen = subject.variants.find(v => v.key === input.variantKey);
    if (chosen) return chosen;
  }
  if (subject.defaultVariantKey) {
    const defaultVariant = subject.variants.find(v => v.key === subject.defaultVariantKey);
    if (defaultVariant) return defaultVariant;
  }
  return subject.variants[0];
}

function getCoefficient(subject, variant) {
  if (variant) return variant.coefficient;
  if (subject.coefficient) return subject.coefficient;
  return 1;
}

function calculateBonusPoints(inputs) {
  const motherTongue = inputs['äidinkieli'];
  const mathematics = inputs['matematiikka'];
  const hasMotherTongueBonus = motherTongue?.grade && motherTongue.grade.toUpperCase() === 'L';
  const hasMathematicsBonus = mathematics?.grade && mathematics.grade.toUpperCase() === 'L';
  return hasMotherTongueBonus || hasMathematicsBonus ? 2 : 0;
}

function calculateTodistuspisteet(inputs) {
  const subjectPoints = {};
  let totalPoints = 0;

  SUBJECT_DEFINITIONS.forEach(subject => {
    const input = inputs[subject.key];
    if (!input || !input.grade) return;

    const variant = resolveVariant(subject, input);
    const coefficient = getCoefficient(subject, variant);
    const weighted = getGradePoints(input.grade) * coefficient;
    subjectPoints[subject.key] = weighted;
    totalPoints += weighted;
  });

  const bonusPoints = calculateBonusPoints(inputs);
  totalPoints += bonusPoints;

  return {
    totalPoints,
    subjectPoints,
    bonusPoints
  };
}

function round(value) {
  return Math.round(value * 100) / 100;
}

// Test Cases
console.log('🧪 Testing Todistuspiste Calculation Logic (weighted)\n');

// Test 1: Weighted combination + bonus from äidinkieli
console.log('Test 1: Weighted combination + bonus');
const test1 = {
  'äidinkieli': { grade: 'L' },
  'matematiikka': { grade: 'E', variantKey: 'pitka' },
  'englanti': { grade: 'M', variantKey: 'a' },
  'reaaliaineet': { grade: 'C' }
};
const result1 = calculateTodistuspisteet(test1);
const expected1 = round(7 + 6 * 1.5 + 5 * 1.15 + 4 * 1 + 2);
console.log('Result:', round(result1.totalPoints), 'Expected:', expected1);
console.log('✅ PASS' + (round(result1.totalPoints) === expected1 ? '' : ' ❌ FAIL'));
console.log('');

// Test 2: Bonus triggered by matematiikka L (äidinkieli ei L)
console.log('Test 2: Bonus from mathematics');
const test2 = {
  'äidinkieli': { grade: 'E' },
  'matematiikka': { grade: 'L', variantKey: 'pitka' },
  'englanti': { grade: 'M', variantKey: 'a' }
};
const result2 = calculateTodistuspisteet(test2);
const expected2 = round(6 + 7 * 1.5 + 5 * 1.15 + 2);
console.log('Result:', round(result2.totalPoints), 'Expected:', expected2);
console.log('✅ PASS' + (round(result2.totalPoints) === expected2 ? '' : ' ❌ FAIL'));
console.log('');

// Test 3: Variant impact (A-kieli vs B-kieli)
console.log('Test 3: Variant coefficients');
const variantA = calculateTodistuspisteet({ 'englanti': { grade: 'M', variantKey: 'a' } });
const variantB = calculateTodistuspisteet({ 'englanti': { grade: 'M', variantKey: 'b' } });
console.log('A-kieli points:', round(variantA.subjectPoints['englanti'] || 0));
console.log('B-kieli points:', round(variantB.subjectPoints['englanti'] || 0));
console.log('✅ PASS' + ((variantA.subjectPoints['englanti'] || 0) > (variantB.subjectPoints['englanti'] || 0) ? '' : ' ❌ FAIL'));
console.log('');

// Test 4: No bonus when ei L arvostelua
console.log('Test 4: No bonus without L grades');
const test4 = {
  'äidinkieli': { grade: 'C' },
  'matematiikka': { grade: 'C', variantKey: 'lyhyt' },
  'englanti': { grade: 'C', variantKey: 'b' }
};
const result4 = calculateTodistuspisteet(test4);
const expected4 = round(4 * 1 + 4 * 1 + 4 * 1);
console.log('Result:', round(result4.totalPoints), 'Expected:', expected4);
console.log('✅ PASS' + (round(result4.totalPoints) === expected4 ? '' : ' ❌ FAIL'));
console.log('');

// Test 5: Invalid grades default to 0
console.log('Test 5: Invalid grade handling');
const test5 = {
  'äidinkieli': { grade: 'X' },
  'matematiikka': { grade: 'C', variantKey: 'lyhyt' }
};
const result5 = calculateTodistuspisteet(test5);
console.log('Result:', round(result5.totalPoints), 'Expected:', round(4));
console.log('✅ PASS' + (round(result5.totalPoints) === round(4) ? '' : ' ❌ FAIL'));
console.log('');

// Test 6: Clearing subject (no grades) -> 0
console.log('Test 6: Empty inputs');
const result6 = calculateTodistuspisteet({});
console.log('Result:', round(result6.totalPoints), 'Expected:', 0);
console.log('✅ PASS' + (round(result6.totalPoints) === 0 ? '' : ' ❌ FAIL'));
console.log('');

console.log('✅ All calculation tests completed!');

