/**
 * TEST: Study Programs Filtering and Matching
 * Tests the study programs database and filtering logic
 */

// Mock study programs data (simplified)
const studyPrograms = [
  {
    id: 'tietojenkäsittelytiede-helsinki',
    name: 'Tietojenkäsittelytiede',
    institution: 'Helsingin yliopisto',
    institutionType: 'yliopisto',
    field: 'teknologia',
    minPoints: 95.0,
    maxPoints: 120.0,
    relatedCareers: ['ohjelmistokehittaja', 'tietoturva-asiantuntija', 'tekoalyasiantuntija']
  },
  {
    id: 'lääketiede-helsinki',
    name: 'Lääketiede',
    institution: 'Helsingin yliopisto',
    institutionType: 'yliopisto',
    field: 'terveys',
    minPoints: 188.3,
    maxPoints: 200.0,
    relatedCareers: ['laakari', 'erikoislaakari']
  },
  {
    id: 'tietotekniikka-amk-helsinki',
    name: 'Tietotekniikka',
    institution: 'Metropolia Ammattikorkeakoulu',
    institutionType: 'amk',
    field: 'teknologia',
    minPoints: 45.0,
    maxPoints: 75.0,
    relatedCareers: ['ohjelmistokehittaja', 'verkkosuunnittelija']
  },
  {
    id: 'sairaanhoitaja-amk-helsinki',
    name: 'Sairaanhoitaja',
    institution: 'Metropolia Ammattikorkeakoulu',
    institutionType: 'amk',
    field: 'terveys',
    minPoints: 35.0,
    maxPoints: 65.0,
    relatedCareers: ['sairaanhoitaja', 'terveydenhoitaja']
  }
];

function getProgramsByPoints(points, type) {
  let filtered = studyPrograms;
  
  if (type) {
    filtered = filtered.filter(p => p.institutionType === type);
  }
  
  return filtered.filter(program => {
    const minPoints = program.minPoints;
    const maxPoints = program.maxPoints || minPoints + 50;
    return points >= minPoints - 30 && points <= maxPoints + 20;
  });
}

function matchProgramsToCareers(programs, careerSlugs) {
  const scored = programs.map(program => {
    const matchCount = program.relatedCareers.filter(slug => 
      careerSlugs.includes(slug)
    ).length;
    
    return {
      program,
      score: matchCount,
      matchRatio: matchCount / program.relatedCareers.length
    };
  });
  
  scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return b.matchRatio - a.matchRatio;
  });
  
  return scored.map(item => item.program);
}

function getReachPrograms(points, type, count = 3, delta = 15) {
  let filtered = studyPrograms;

  if (type) {
    filtered = filtered.filter(p => p.institutionType === type);
  }

  return filtered
    .filter(program => program.minPoints > points && program.minPoints <= points + delta)
    .sort((a, b) => a.minPoints - b.minPoints)
    .slice(0, count)
    .map(program => ({ ...program, reach: true }));
}

function getPointRangeCategory(userPoints, minPoints, maxPoints) {
  const max = maxPoints || minPoints + 50;
  
  if (userPoints >= max) {
    return 'excellent';
  } else if (userPoints >= minPoints) {
    return 'good';
  } else if (userPoints >= minPoints - 10) {
    return 'realistic';
  } else if (userPoints >= minPoints - 30) {
    return 'reach';
  } else {
    return 'low';
  }
}

// Test Cases
console.log('🧪 Testing Study Programs Filtering and Matching\n');

// Test 1: Filter by points (high points)
console.log('Test 1: Filter by points (high points - 100)');
const test1 = getProgramsByPoints(100, 'yliopisto');
console.log('User points: 100, Type: yliopisto');
console.log('Expected: Tietojenkäsittelytiede (95-120 range)');
console.log('Result:', test1.map(p => p.name));
console.log('✅ PASS' + (test1.length > 0 && test1[0].name === 'Tietojenkäsittelytiede' ? '' : ' ❌ FAIL'));
console.log('');

// Test 2: Filter by points (low points)
console.log('Test 2: Filter by points (low points - 50)');
const test2 = getProgramsByPoints(50, 'amk');
console.log('User points: 50, Type: amk');
console.log('Expected: Tietotekniikka AMK (45-75 range), Sairaanhoitaja AMK (35-65 range)');
console.log('Result:', test2.map(p => p.name));
console.log('✅ PASS' + (test2.length >= 2 ? '' : ' ❌ FAIL'));
console.log('');

// Test 3: Filter by points (very high points)
console.log('Test 3: Filter by points (very high points - 190)');
const test3 = getProgramsByPoints(190, 'yliopisto');
console.log('User points: 190, Type: yliopisto');
console.log('Expected: Lääketiede (188.3-200 range)');
console.log('Result:', test3.map(p => p.name));
console.log('✅ PASS' + (test3.length > 0 && test3.some(p => p.name === 'Lääketiede') ? '' : ' ❌ FAIL'));
console.log('');

// Test 4: Match programs to careers
console.log('Test 4: Match programs to careers');
const careerSlugs = ['ohjelmistokehittaja', 'tietoturva-asiantuntija'];
const test4 = matchProgramsToCareers(studyPrograms, careerSlugs);
console.log('Career slugs:', careerSlugs);
console.log('Expected: Tietojenkäsittelytiede first (matches 2 careers)');
console.log('Result:', test4.map(p => `${p.name} (${p.relatedCareers.filter(c => careerSlugs.includes(c)).length} matches)`));
console.log('✅ PASS' + (test4[0].name === 'Tietojenkäsittelytiede' ? '' : ' ❌ FAIL'));
console.log('');

// Test 5: Point range categories
console.log('Test 5: Point range categories');
const test5a = getPointRangeCategory(200, 188.3, 200.0);
const test5b = getPointRangeCategory(190, 188.3, 200.0);
const test5c = getPointRangeCategory(180, 188.3, 200.0);
const test5d = getPointRangeCategory(160, 188.3, 200.0);
console.log('200 points vs 188.3-200:', test5a, '(expected: excellent)');
console.log('190 points vs 188.3-200:', test5b, '(expected: good)');
console.log('180 points vs 188.3-200:', test5c, '(expected: realistic)');
console.log('160 points vs 188.3-200:', test5d, '(expected: reach)');
console.log('✅ PASS' + (test5a === 'excellent' && test5b === 'good' && test5c === 'realistic' && test5d === 'reach' ? '' : ' ❌ FAIL'));
console.log('');

// Test 6: No matches
console.log('Test 6: No matches');
const test6 = getProgramsByPoints(10, 'yliopisto');
console.log('User points: 10, Type: yliopisto');
console.log('Expected: No programs (too low)');
console.log('Result:', test6.length, 'programs');
console.log('✅ PASS' + (test6.length === 0 ? '' : ' ❌ FAIL'));
console.log('');

// Test 7: Reach fallback suggestions
console.log('Test 7: Reach fallback suggestions');
const test7 = getReachPrograms(60, 'yliopisto', 2, 150);
console.log('User points: 60, Type: yliopisto');
console.log('Reach suggestions:', test7.map(p => `${p.name} (min ${p.minPoints})`));
console.log('✅ PASS' + (test7.length > 0 ? '' : ' ❌ FAIL'));
console.log('');

console.log('✅ All program filtering tests completed!');

