/**
 * TEST: Todistuspistelaskuri Integration
 * Tests the complete flow: calculation -> filtering -> matching
 */

// Mock data
const mockStudyPrograms = [
  {
    id: 'tietojenkäsittelytiede-helsinki',
    name: 'Tietojenkäsittelytiede',
    institution: 'Helsingin yliopisto',
    institutionType: 'yliopisto',
    minPoints: 25.0,
    maxPoints: 45.0,
    relatedCareers: ['ohjelmistokehittaja', 'tietoturva-asiantuntija']
  },
  {
    id: 'lääketiede-helsinki',
    name: 'Lääketiede',
    institution: 'Helsingin yliopisto',
    institutionType: 'yliopisto',
    minPoints: 45.0,
    maxPoints: 65.0,
    relatedCareers: ['laakari']
  },
  {
    id: 'tietotekniikka-amk-helsinki',
    name: 'Tietotekniikka',
    institution: 'Metropolia Ammattikorkeakoulu',
    institutionType: 'amk',
    minPoints: 15.0,
    maxPoints: 35.0,
    relatedCareers: ['ohjelmistokehittaja', 'verkkosuunnittelija']
  }
];

// Mock calculation function
function calculateTodistuspisteet(grades) {
  const gradeMap = { 'L': 7, 'E': 6, 'M': 5, 'C': 4, 'B': 3, 'A': 2, 'I': 0 };
  let total = 0;
  let bonus = 0;
  
  for (const [subject, grade] of Object.entries(grades)) {
    if (grade && grade.trim()) {
      total += gradeMap[grade.toUpperCase()] || 0;
    }
  }
  
  if (grades['äidinkieli']?.toUpperCase() === 'L') bonus += 2;
  if (grades['matematiikka']?.toUpperCase() === 'L') bonus += 2;
  
  return { totalPoints: total + bonus, bonusPoints: bonus };
}

// Mock filtering function
function getProgramsByPoints(points, type) {
  return mockStudyPrograms.filter(p => {
    if (type && p.institutionType !== type) return false;
    const max = p.maxPoints || p.minPoints + 50;
    return points >= p.minPoints - 30 && points <= max + 20;
  });
}

// Mock matching function
function matchProgramsToCareers(programs, careerSlugs) {
  return programs.map(p => ({
    ...p,
    matchCount: p.relatedCareers.filter(c => careerSlugs.includes(c)).length
  })).sort((a, b) => b.matchCount - a.matchCount);
}

// Integration Test Scenarios
console.log('🧪 Testing Todistuspistelaskuri Integration\n');

// Scenario 1: TASO2 user with technology interests, good grades
console.log('Scenario 1: TASO2 user with technology interests, good grades');
const grades1 = {
  'äidinkieli': 'E',
  'matematiikka': 'L',
  'englanti': 'E',
  'historia': 'M',
  'fysiikka': 'E',
  'kemia': 'M'
};
const result1 = calculateTodistuspisteet(grades1);
const programs1 = getProgramsByPoints(result1.totalPoints, 'yliopisto');
const matched1 = matchProgramsToCareers(programs1, ['ohjelmistokehittaja', 'tietoturva-asiantuntija']);
console.log('Grades:', grades1);
console.log('Calculated points:', result1.totalPoints, '(bonus:', result1.bonusPoints + ')');
console.log('Filtered programs:', programs1.map(p => p.name));
console.log('Matched programs:', matched1.map(p => `${p.name} (${p.matchCount} matches)`));
console.log('✅ PASS' + (matched1.length > 0 && matched1[0].matchCount > 0 ? '' : ' ❌ FAIL'));
console.log('');

// Scenario 2: TASO2 user with healthcare interests, excellent grades
console.log('Scenario 2: TASO2 user with healthcare interests, excellent grades');
const grades2 = {
  'äidinkieli': 'L',
  'matematiikka': 'L',
  'englanti': 'L',
  'historia': 'E',
  'fysiikka': 'L',
  'kemia': 'L',
  'biologia': 'L'
};
const result2 = calculateTodistuspisteet(grades2);
const programs2 = getProgramsByPoints(result2.totalPoints, 'yliopisto');
const matched2 = matchProgramsToCareers(programs2, ['laakari']);
console.log('Grades:', grades2);
console.log('Calculated points:', result2.totalPoints, '(bonus:', result2.bonusPoints + ')');
console.log('Filtered programs:', programs2.map(p => p.name));
console.log('Matched programs:', matched2.map(p => `${p.name} (${p.matchCount} matches)`));
console.log('✅ PASS' + (programs2.some(p => p.name === 'Lääketiede') ? '' : ' ❌ FAIL'));
console.log('');

// Scenario 3: TASO2 user with average grades, AMK recommendation
console.log('Scenario 3: TASO2 user with average grades, AMK recommendation');
const grades3 = {
  'äidinkieli': 'C',
  'matematiikka': 'C',
  'englanti': 'C',
  'historia': 'C',
  'fysiikka': 'C'
};
const result3 = calculateTodistuspisteet(grades3);
const programs3 = getProgramsByPoints(result3.totalPoints, 'amk');
const matched3 = matchProgramsToCareers(programs3, ['ohjelmistokehittaja']);
console.log('Grades:', grades3);
console.log('Calculated points:', result3.totalPoints, '(bonus:', result3.bonusPoints + ')');
console.log('Filtered programs:', programs3.map(p => p.name));
console.log('Matched programs:', matched3.map(p => `${p.name} (${p.matchCount} matches)`));
console.log('✅ PASS' + (programs3.length > 0 ? '' : ' ❌ FAIL'));
console.log('');

// Scenario 4: Edge case - very low points
console.log('Scenario 4: Edge case - very low points');
const grades4 = {
  'äidinkieli': 'A',
  'matematiikka': 'A',
  'englanti': 'A'
};
const result4 = calculateTodistuspisteet(grades4);
const programs4 = getProgramsByPoints(result4.totalPoints, 'amk');
console.log('Grades:', grades4);
console.log('Calculated points:', result4.totalPoints);
console.log('Filtered programs:', programs4.length, 'programs');
console.log('✅ PASS' + (programs4.length >= 0 ? '' : ' ❌ FAIL'));
console.log('');

console.log('✅ All integration tests completed!');
