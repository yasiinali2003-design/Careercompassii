/**
 * Standalone replica of the todistuspiste calculation logic.
 * Keeps this regression test independent of the TypeScript build.
 */

const WEIGHTS = {
  motherTongue: { L: 46, E: 41, M: 34, C: 26, B: 18, A: 10 },
  mathLong: { L: 46, E: 43, M: 40, C: 35, B: 27, A: 19 },
  mathShort: { L: 40, E: 35, M: 27, C: 19, B: 13, A: 6 },
  languageLong: { L: 46, E: 41, M: 34, C: 26, B: 18, A: 10 },
  languageMedium: { L: 38, E: 34, M: 26, C: 18, B: 12, A: 5 },
  languageShort: { L: 30, E: 27, M: 21, C: 15, B: 9, A: 3 },
  reaali: { L: 30, E: 27, M: 21, C: 15, B: 9, A: 3 }
};

const SUBJECT_DEFINITIONS = [
  {
    key: 'äidinkieli',
    schemeGroup: { yliopisto: 'motherTongue', amk: 'motherTongue' },
    gradeWeights: WEIGHTS.motherTongue,
    amkGradeWeights: WEIGHTS.motherTongue,
    coefficient: 1,
    required: true
  },
  {
    key: 'matematiikka',
    required: true,
    variants: [
      {
        key: 'pitka',
        coefficient: 1.5,
        gradeWeights: WEIGHTS.mathLong,
        amkGradeWeights: WEIGHTS.mathLong,
        schemeGroup: { yliopisto: 'mathematics', amk: 'mathematics' }
      },
      {
        key: 'lyhyt',
        coefficient: 1.0,
        gradeWeights: WEIGHTS.mathShort,
        amkGradeWeights: WEIGHTS.mathShort,
        schemeGroup: { yliopisto: 'mathematics', amk: 'mathematics' }
      }
    ],
    defaultVariantKey: 'pitka'
  },
  {
    key: 'englanti',
    required: true,
    variants: [
      {
        key: 'a',
        coefficient: 1.15,
        gradeWeights: WEIGHTS.languageLong,
        amkGradeWeights: WEIGHTS.languageLong,
        schemeGroup: { yliopisto: 'primaryLanguage', amk: 'primaryLanguage' }
      },
      {
        key: 'b',
        coefficient: 1.0,
        gradeWeights: WEIGHTS.languageMedium,
        amkGradeWeights: WEIGHTS.languageMedium,
        schemeGroup: { yliopisto: 'primaryLanguage', amk: 'primaryLanguage' }
      }
    ],
    defaultVariantKey: 'a'
  },
  {
    key: 'toinen-kotimainen',
    required: false,
    variants: [
      {
        key: 'a',
        coefficient: 1.1,
        gradeWeights: WEIGHTS.languageLong,
        amkGradeWeights: WEIGHTS.languageLong,
        schemeGroup: { yliopisto: 'primaryLanguage', amk: 'primaryLanguage' }
      },
      {
        key: 'b',
        coefficient: 1.0,
        gradeWeights: WEIGHTS.languageMedium,
        amkGradeWeights: WEIGHTS.languageMedium,
        schemeGroup: { yliopisto: 'primaryLanguage', amk: 'primaryLanguage' }
      }
    ],
    defaultVariantKey: 'b'
  },
  {
    key: 'reaaliaineet',
    required: false,
    gradeWeights: WEIGHTS.reaali,
    amkGradeWeights: WEIGHTS.reaali,
    schemeGroup: { yliopisto: 'extra', amk: 'extra' }
  },
  {
    key: 'reaali-2',
    required: false,
    gradeWeights: WEIGHTS.reaali,
    amkGradeWeights: WEIGHTS.reaali,
    schemeGroup: { yliopisto: 'extra', amk: 'extra' }
  },
  {
    key: 'reaali-3',
    required: false,
    gradeWeights: WEIGHTS.reaali,
    amkGradeWeights: WEIGHTS.reaali,
    schemeGroup: { yliopisto: 'extra', amk: 'extra' }
  },
  {
    key: 'muu-kieli',
    required: false,
    variants: [
      {
        key: 'a',
        coefficient: 1.05,
        gradeWeights: WEIGHTS.reaali,
        amkGradeWeights: WEIGHTS.reaali,
        schemeGroup: { yliopisto: 'extra', amk: 'extra' }
      },
      {
        key: 'b',
        coefficient: 1.0,
        gradeWeights: WEIGHTS.reaali,
        amkGradeWeights: WEIGHTS.reaali,
        schemeGroup: { yliopisto: 'extra', amk: 'extra' }
      }
    ],
    defaultVariantKey: 'b'
  }
];

const SCHEME_SETTINGS = {
  yliopisto: { maxSubjects: 5 },
  amk: { maxSubjects: 5 }
};

const SCHEME_GROUP_LIMITS = {
  yliopisto: { motherTongue: 1, mathematics: 1, primaryLanguage: 1, extra: 2 },
  amk: { motherTongue: 1, mathematics: 1, primaryLanguage: 1, extra: 2 }
};

function getGradePoints(grade) {
  const map = { L: 7, E: 6, M: 5, C: 4, B: 3, A: 2, I: 0 };
  return map[grade.toUpperCase()] ?? 0;
}

function resolveVariant(subject, input) {
  if (!subject.variants || subject.variants.length === 0) return undefined;
  if (input.variantKey) {
    const selected = subject.variants.find(v => v.key === input.variantKey);
    if (selected) return selected;
  }
  if (subject.defaultVariantKey) {
    return subject.variants.find(v => v.key === subject.defaultVariantKey) || subject.variants[0];
  }
  return subject.variants[0];
}

function getSchemeGroup(subject, variant, scheme) {
  if (variant?.schemeGroup?.[scheme]) return variant.schemeGroup[scheme];
  if (subject.schemeGroup?.[scheme]) return subject.schemeGroup[scheme];
  return undefined;
}

function getGradeWeight(weights, grade) {
  if (!weights) return null;
  const value = weights[grade.toUpperCase()];
  return typeof value === 'number' ? value : null;
}

function getGradeWeightForScheme(subject, variant, scheme, grade) {
  if (scheme === 'amk') {
    const variantWeight = getGradeWeight(variant?.amkGradeWeights, grade);
    if (variantWeight !== null) return variantWeight;
    const subjectWeight = getGradeWeight(subject.amkGradeWeights, grade);
    if (subjectWeight !== null) return subjectWeight;
  }

  const variantWeight = getGradeWeight(variant?.gradeWeights, grade);
  if (variantWeight !== null) return variantWeight;
  const subjectWeight = getGradeWeight(subject.gradeWeights, grade);
  if (subjectWeight !== null) return subjectWeight;
  return null;
}

function getCoefficient(subject, variant, scheme) {
  if (scheme === 'amk') {
    if (variant?.amkCoefficient !== undefined) return variant.amkCoefficient;
    if (subject.amkCoefficient !== undefined) return subject.amkCoefficient;
  }
  if (variant?.coefficient !== undefined) return variant.coefficient;
  if (subject.coefficient !== undefined) return subject.coefficient;
  return 1;
}

function calculateTodistuspisteet(inputs, options = {}) {
  return calculateTodistuspisteetWithOptions(inputs, options);
}

function calculateTodistuspisteetWithOptions(inputs, { scheme = 'yliopisto' } = {}) {
  const subjectPoints = {};
  const weightedEntries = [];

  SUBJECT_DEFINITIONS.forEach(subject => {
    const input = inputs[subject.key];
    if (!input?.grade) return;

    const variant = resolveVariant(subject, input);
    const gradeSymbol = input.grade.toUpperCase();
    let weighted = getGradeWeightForScheme(subject, variant, scheme, gradeSymbol);

    if (weighted === null) {
      weighted = getGradePoints(gradeSymbol) * getCoefficient(subject, variant, scheme);
    }

    subjectPoints[subject.key] = weighted;
    weightedEntries.push({
      key: subject.key,
      points: weighted,
      group: getSchemeGroup(subject, variant, scheme)
    });
  });

  const schemeSettings = SCHEME_SETTINGS[scheme];
  let countedEntries = weightedEntries;

  if (schemeSettings?.maxSubjects) {
    const sorted = weightedEntries.slice().sort((a, b) => b.points - a.points);
    const limits = SCHEME_GROUP_LIMITS[scheme] || {};
    const usage = {};
    const selected = [];

    for (const entry of sorted) {
      if (selected.length >= schemeSettings.maxSubjects) break;
      const groupKey = entry.group || 'general';
      const limit = limits[groupKey];
      if (limit !== undefined && (usage[groupKey] || 0) >= limit) continue;
      selected.push(entry);
      usage[groupKey] = (usage[groupKey] || 0) + 1;
    }

    countedEntries = selected;
  }

  const totalPoints = countedEntries.reduce((sum, entry) => sum + entry.points, 0);
  const countedSubjects = countedEntries.map(entry => entry.key);

  return {
    totalPoints,
    subjectPoints,
    bonusPoints: 0,
    scheme,
    countedSubjects
  };
}

function calculateTodistuspisteetForAllSchemes(grades) {
  return {
    yliopisto: calculateTodistuspisteetWithOptions(grades, { scheme: 'yliopisto' }),
    amk: calculateTodistuspisteetWithOptions(grades, { scheme: 'amk' })
  };
}

function round(value) {
  return Math.round(value * 100) / 100;
}

function runTodistuspisteCalculationTests() {
  console.log('🧪 Testing Todistuspiste Calculation Logic (replicated tables)\n');

  const test1Inputs = {
    'äidinkieli': { grade: 'L' },
    'matematiikka': { grade: 'E', variantKey: 'pitka' },
    'englanti': { grade: 'M', variantKey: 'a' },
    'reaaliaineet': { grade: 'C' }
  };
  const result1 = calculateTodistuspisteet(test1Inputs);
  console.log('Test 1:', round(result1.totalPoints), 'Expected:', 46 + 43 + 34 + 15);
  console.log(round(result1.totalPoints) === 138 ? '✅ PASS' : '❌ FAIL');
  console.log('');

  const maxInputs = {
    'äidinkieli': { grade: 'L' },
    'matematiikka': { grade: 'L', variantKey: 'pitka' },
    'englanti': { grade: 'L', variantKey: 'a' },
    'reaaliaineet': { grade: 'L' },
    'reaali-2': { grade: 'L' },
    'muu-kieli': { grade: 'L', variantKey: 'a' }
  };
  const maxResult = calculateTodistuspisteet(maxInputs);
  console.log('Test 2:', round(maxResult.totalPoints), 'Expected:', 198);
  console.log(round(maxResult.totalPoints) === 198 ? '✅ PASS' : '❌ FAIL');
  console.log('');

  const amkInputs = {
    'äidinkieli': { grade: 'C' },
    'matematiikka': { grade: 'C', variantKey: 'lyhyt' },
    'englanti': { grade: 'C', variantKey: 'b' },
    'reaaliaineet': { grade: 'C' }
  };
  const amkResult = calculateTodistuspisteet(amkInputs, { scheme: 'amk' });
  console.log('Test 3:', round(amkResult.totalPoints), 'Expected:', 26 + 19 + 18 + 15);
  console.log(round(amkResult.totalPoints) === 78 ? '✅ PASS' : '❌ FAIL');
  console.log('');

  const invalidResult = calculateTodistuspisteet({
    'äidinkieli': { grade: 'X' },
    'matematiikka': { grade: 'C', variantKey: 'lyhyt' }
  });
  console.log('Test 4:', round(invalidResult.totalPoints), 'Expected:', 19);
  console.log(round(invalidResult.totalPoints) === 19 ? '✅ PASS' : '❌ FAIL');
  console.log('');

  const sharedInputs = {
    'äidinkieli': { grade: 'E' },
    'matematiikka': { grade: 'M', variantKey: 'pitka' },
    'englanti': { grade: 'E', variantKey: 'a' },
    'toinen-kotimainen': { grade: 'C', variantKey: 'b' },
    'reaaliaineet': { grade: 'M' }
  };
  const bothSchemes = calculateTodistuspisteetForAllSchemes(sharedInputs);
  const parity = round(bothSchemes.amk.totalPoints) === round(bothSchemes.yliopisto.totalPoints);
  console.log('Test 5 (scheme parity):', round(bothSchemes.amk.totalPoints), '/', round(bothSchemes.yliopisto.totalPoints), parity ? '✅ PASS' : '❌ FAIL');
  console.log('');

  console.log('✅ All calculation tests completed!');
}

if (require.main === module) {
  runTodistuspisteCalculationTests();
}

module.exports = {
  calculateTodistuspisteetWithOptions,
  runTodistuspisteCalculationTests
};
