/**
 * Test Study Programs Database
 * Tests filtering, matching, and data structure
 */

// Mock study programs data
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
    id: 'sairaanhoitaja-amk-helsinki',
    name: 'Sairaanhoitaja',
    institution: 'Metropolia Ammattikorkeakoulu',
    institutionType: 'amk',
    field: 'terveys',
    minPoints: 35.0,
    maxPoints: 65.0,
    relatedCareers: ['sairaanhoitaja', 'terveydenhoitaja']
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

console.log('=== STUDY PROGRAMS DATABASE TESTS ===\n');

// Test 1: Filter by points - high points
console.log('Test 1: Filter by points (high points: 100)');
const programs1 = getProgramsByPoints(100, 'yliopisto');
console.log('Found programs:', programs1.length);
console.log('Programs:', programs1.map(p => p.name));
console.log('Expected: Tietojenkäsittelytiede (minPoints 95)');
console.log('Result:', programs1.length >= 1 && programs1[0].name === 'Tietojenkäsittelytiede' ? '✓ PASS' : '✗ FAIL');
console.log('');

// Test 2: Filter by points - low points
console.log('Test 2: Filter by points (low points: 40)');
const programs2 = getProgramsByPoints(40, 'amk');
console.log('Found programs:', programs2.length);
console.log('Programs:', programs2.map(p => p.name));
console.log('Expected: Sairaanhoitaja (minPoints 35)');
console.log('Result:', programs2.length >= 1 && programs2.some(p => p.name === 'Sairaanhoitaja') ? '✓ PASS' : '✗ FAIL');
console.log('');

// Test 3: Filter by type
console.log('Test 3: Filter by institution type');
const yliopistoPrograms = getProgramsByPoints(100);
const yliopistoOnly = yliopistoPrograms.filter(p => p.institutionType === 'yliopisto');
const amkOnly = yliopistoPrograms.filter(p => p.institutionType === 'amk');
console.log('Yliopisto programs:', yliopistoOnly.length);
console.log('AMK programs:', amkOnly.length);
console.log('Result:', yliopistoOnly.length > 0 && amkOnly.length === 0 ? '✓ PASS' : '✗ FAIL');
console.log('');

// Test 4: Match programs to careers
console.log('Test 4: Match programs to careers');
const allPrograms = getProgramsByPoints(100);
const matched = matchProgramsToCareers(allPrograms, ['ohjelmistokehittaja', 'tietoturva-asiantuntija']);
console.log('Career slugs:', ['ohjelmistokehittaja', 'tietoturva-asiantuntija']);
console.log('Matched programs:', matched.map(p => p.name));
console.log('Expected: Tietojenkäsittelytiede first (matches 2 careers)');
console.log('Result:', matched.length > 0 && matched[0].name === 'Tietojenkäsittelytiede' ? '✓ PASS' : '✗ FAIL');
console.log('');

// Test 5: No matches
console.log('Test 5: No career matches');
const noMatch = matchProgramsToCareers(allPrograms, ['nonexistent-career']);
console.log('Programs:', noMatch.map(p => p.name));
console.log('Result: Programs still returned (fallback to points filter)', noMatch.length > 0 ? '✓ PASS' : '✗ FAIL');
console.log('');

console.log('=== DATABASE TESTS COMPLETE ===');

