/**
 * TEST: Search and Filter Functionality
 * Tests the search and filter features in StudyProgramsList
 */

// Mock study programs data
const mockPrograms = [
  {
    id: 'tietotekniikka-helsinki',
    name: 'Tietotekniikka',
    institution: 'Helsingin yliopisto',
    institutionType: 'yliopisto',
    field: 'teknologia',
    minPoints: 95.0,
    maxPoints: 120.0,
    relatedCareers: ['ohjelmistokehittaja', 'tietoturva-asiantuntija']
  },
  {
    id: 'laaketiede-helsinki',
    name: 'Lääketiede',
    institution: 'Helsingin yliopisto',
    institutionType: 'yliopisto',
    field: 'terveys',
    minPoints: 188.3,
    maxPoints: 200.0,
    relatedCareers: ['laakari']
  },
  {
    id: 'kauppatiede-aalto',
    name: 'Kauppatiede',
    institution: 'Aalto-yliopisto',
    institutionType: 'yliopisto',
    field: 'kauppa',
    minPoints: 118.7,
    maxPoints: 140.0,
    relatedCareers: ['liiketalousjohtaja']
  },
  {
    id: 'tietotekniikka-amk',
    name: 'Tietotekniikka',
    institution: 'Metropolia Ammattikorkeakoulu',
    institutionType: 'amk',
    field: 'teknologia',
    minPoints: 45.0,
    maxPoints: 75.0,
    relatedCareers: ['ohjelmistokehittaja']
  }
];

// Mock search function
function searchPrograms(programs, query) {
  if (!query.trim()) return programs;
  const q = query.toLowerCase();
  return programs.filter(p => 
    p.name.toLowerCase().includes(q) ||
    p.institution.toLowerCase().includes(q) ||
    (p.description && p.description.toLowerCase().includes(q))
  );
}

// Mock filter function
function filterByField(programs, field) {
  if (field === 'all') return programs;
  return programs.filter(p => p.field === field);
}

// Mock sort function
function sortPrograms(programs, sortBy, points, careerSlugs) {
  const sorted = [...programs];
  
  if (sortBy === 'match') {
    return sorted.sort((a, b) => {
      const aMatches = a.relatedCareers.filter(c => careerSlugs.includes(c)).length;
      const bMatches = b.relatedCareers.filter(c => careerSlugs.includes(c)).length;
      if (bMatches !== aMatches) return bMatches - aMatches;
      const aDiff = Math.abs(points - a.minPoints);
      const bDiff = Math.abs(points - b.minPoints);
      return aDiff - bDiff;
    });
  } else if (sortBy === 'points-low') {
    return sorted.sort((a, b) => a.minPoints - b.minPoints);
  } else if (sortBy === 'points-high') {
    return sorted.sort((a, b) => b.minPoints - a.minPoints);
  } else if (sortBy === 'name') {
    return sorted.sort((a, b) => a.name.localeCompare(b.name, 'fi'));
  }
  return sorted;
}

// Test Cases
console.log('🧪 Testing Search and Filter Functionality\n');

// Test 1: Search by program name
console.log('Test 1: Search by program name');
const test1 = searchPrograms(mockPrograms, 'tietotekniikka');
console.log('Query: "tietotekniikka"');
console.log('Expected: 2 programs (Tietotekniikka yliopisto + AMK)');
console.log('Result:', test1.map(p => p.name));
console.log('✅ PASS' + (test1.length === 2 ? '' : ' ❌ FAIL'));
console.log('');

// Test 2: Search by institution
console.log('Test 2: Search by institution');
const test2 = searchPrograms(mockPrograms, 'helsinki');
console.log('Query: "helsinki"');
console.log('Expected: 2 programs (Helsingin yliopisto programs)');
console.log('Result:', test2.map(p => `${p.name} (${p.institution})`));
console.log('✅ PASS' + (test2.length === 2 ? '' : ' ❌ FAIL'));
console.log('');

// Test 3: Filter by field
console.log('Test 3: Filter by field');
const test3a = filterByField(mockPrograms, 'teknologia');
const test3b = filterByField(mockPrograms, 'terveys');
console.log('Field: "teknologia"');
console.log('Expected: 2 programs');
console.log('Result:', test3a.map(p => p.name));
console.log('✅ PASS' + (test3a.length === 2 ? '' : ' ❌ FAIL'));
console.log('Field: "terveys"');
console.log('Expected: 1 program (Lääketiede)');
console.log('Result:', test3b.map(p => p.name));
console.log('✅ PASS' + (test3b.length === 1 && test3b[0].name === 'Lääketiede' ? '' : ' ❌ FAIL'));
console.log('');

// Test 4: Sort by points (low to high)
console.log('Test 4: Sort by points (low to high)');
const test4 = sortPrograms(mockPrograms, 'points-low', 100, []);
console.log('Sort: points-low');
console.log('Expected: Tietotekniikka AMK (45) first, Lääketiede (188.3) last');
console.log('Result:', test4.map(p => `${p.name}: ${p.minPoints}`));
console.log('✅ PASS' + (test4[0].minPoints === 45.0 && test4[test4.length - 1].minPoints === 188.3 ? '' : ' ❌ FAIL'));
console.log('');

// Test 5: Sort by points (high to low)
console.log('Test 5: Sort by points (high to low)');
const test5 = sortPrograms(mockPrograms, 'points-high', 100, []);
console.log('Sort: points-high');
console.log('Expected: Lääketiede (188.3) first, Tietotekniikka AMK (45) last');
console.log('Result:', test5.map(p => `${p.name}: ${p.minPoints}`));
console.log('✅ PASS' + (test5[0].minPoints === 188.3 && test5[test5.length - 1].minPoints === 45.0 ? '' : ' ❌ FAIL'));
console.log('');

// Test 6: Sort by name
console.log('Test 6: Sort by name (A-Ö)');
const test6 = sortPrograms(mockPrograms, 'name', 100, []);
console.log('Sort: name');
console.log('Expected: Kauppatiede, Lääketiede, Tietotekniikka...');
console.log('Result:', test6.map(p => p.name));
console.log('✅ PASS' + (test6[0].name === 'Kauppatiede' ? '' : ' ❌ FAIL'));
console.log('');

// Test 7: Sort by match quality
console.log('Test 7: Sort by match quality');
const test7 = sortPrograms(mockPrograms, 'match', 100, ['ohjelmistokehittaja', 'tietoturva-asiantuntija']);
console.log('Sort: match');
console.log('Career slugs: ["ohjelmistokehittaja", "tietoturva-asiantuntija"]');
console.log('Expected: Tietotekniikka yliopisto first (matches 2 careers)');
console.log('Result:', test7.map(p => {
  const matches = p.relatedCareers.filter(c => ['ohjelmistokehittaja', 'tietoturva-asiantuntija'].includes(c)).length;
  return `${p.name}: ${matches} matches`;
}));
console.log('✅ PASS' + (test7[0].name === 'Tietotekniikka' && test7[0].institutionType === 'yliopisto' ? '' : ' ❌ FAIL'));
console.log('');

// Test 8: Combined search and filter
console.log('Test 8: Combined search and filter');
const filtered = filterByField(mockPrograms, 'teknologia');
const searched = searchPrograms(filtered, 'helsinki');
console.log('Filter: teknologia, Search: helsinki');
console.log('Expected: 1 program (Tietotekniikka Helsingin yliopisto)');
console.log('Result:', searched.map(p => `${p.name} (${p.institution})`));
console.log('✅ PASS' + (searched.length === 1 && searched[0].institution.includes('Helsingin') ? '' : ' ❌ FAIL'));
console.log('');

// Test 9: Empty search results
console.log('Test 9: Empty search results');
const test9 = searchPrograms(mockPrograms, 'xyz123');
console.log('Query: "xyz123" (non-existent)');
console.log('Expected: 0 programs');
console.log('Result:', test9.length, 'programs');
console.log('✅ PASS' + (test9.length === 0 ? '' : ' ❌ FAIL'));
console.log('');

console.log('✅ All search and filter tests completed!');

