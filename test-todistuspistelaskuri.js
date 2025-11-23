/**
 * COMPREHENSIVE TODISTUSPISTELASKURI REAL USER TEST
 * Tests the grade calculator end-to-end as a real user would
 */

const API_BASE = 'http://localhost:3000';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bold: '\x1b[1m'
};

function log(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  const prefix = {
    success: `${colors.green}✓${colors.reset}`,
    error: `${colors.red}✗${colors.reset}`,
    warning: `${colors.yellow}⚠${colors.reset}`,
    info: `${colors.blue}ℹ${colors.reset}`,
    test: `${colors.cyan}→${colors.reset}`
  }[type] || '•';

  console.log(`[${timestamp}] ${prefix} ${message}`);
}

function section(title) {
  console.log(`\n${colors.bold}${colors.magenta}${'='.repeat(80)}${colors.reset}`);
  console.log(`${colors.bold}${colors.magenta}${title}${colors.reset}`);
  console.log(`${colors.bold}${colors.magenta}${'='.repeat(80)}${colors.reset}\n`);
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================================================
// TEST SCENARIOS
// ============================================================================

const testScenarios = [
  {
    name: 'High-achieving student (aiming for medicine)',
    description: 'Student with excellent grades in all subjects',
    grades: {
      'äidinkieli': { grade: 'L', variantKey: 'pitka' },
      'matematiikka': { grade: 'L', variantKey: 'pitka' },
      'englanti': { grade: 'E', variantKey: 'pitka' },
      'toinen-kotimainen': { grade: 'M', variantKey: 'pitka' },
      'reaali-1': { grade: 'L', subjectId: 'fysiikka' },
      'reaali-2': { grade: 'E', subjectId: 'kemia' }
    },
    expectedMinPoints: 180,
    expectedScheme: 'yliopisto',
    shouldSeePrograms: ['lääketiede', 'oikeustiede'],
    careerAlignment: 'auttaja'
  },
  {
    name: 'Tech-focused student (moderate grades)',
    description: 'Student strong in math and physics, aiming for CS',
    grades: {
      'äidinkieli': { grade: 'M', variantKey: 'pitka' },
      'matematiikka': { grade: 'E', variantKey: 'pitka' },
      'englanti': { grade: 'L', variantKey: 'pitka' },
      'reaali-1': { grade: 'E', subjectId: 'fysiikka' },
      'reaali-2': { grade: 'M', subjectId: 'kemia' }
    },
    expectedMinPoints: 90,
    expectedMaxPoints: 130,
    expectedScheme: 'yliopisto',
    shouldSeePrograms: ['tietojenkäsittelytiede', 'tietotekniikka'],
    careerAlignment: 'innovoija'
  },
  {
    name: 'AMK-bound student',
    description: 'Practical student with decent grades',
    grades: {
      'äidinkieli': { grade: 'C', variantKey: 'pitka' },
      'matematiikka': { grade: 'M', variantKey: 'pitka' },
      'englanti': { grade: 'B', variantKey: 'pitka' },
      'reaali-1': { grade: 'C', subjectId: 'yhteiskuntaoppi' }
    },
    expectedMinPoints: 40,
    expectedMaxPoints: 80,
    expectedScheme: 'amk',
    shouldSeePrograms: ['liiketalous', 'tietotekniikka'],
    careerAlignment: 'jarjestaja'
  },
  {
    name: 'Minimum viable student',
    description: 'Student with only required subjects at passing level',
    grades: {
      'äidinkieli': { grade: 'I', variantKey: 'pitka' },
      'matematiikka': { grade: 'A', variantKey: 'pitka' },
      'englanti': { grade: 'B', variantKey: 'pitka' }
    },
    expectedMinPoints: 20,
    expectedMaxPoints: 60,
    expectedScheme: 'amk',
    shouldSeePrograms: ['amk'],
    careerAlignment: null
  }
];

// ============================================================================
// TEST 1: PAGE ACCESSIBILITY
// ============================================================================

async function testPageAccessibility() {
  section('TEST 1: Page Accessibility');

  try {
    log('Testing if todistuspistelaskuri page is accessible...', 'test');

    const response = await fetch(`${API_BASE}/todistuspistelaskuri`);

    if (!response.ok) {
      log(`Page returned status ${response.status}`, 'error');
      return false;
    }

    const html = await response.text();

    // Check for key elements
    const checks = [
      { name: 'Page title exists', test: html.includes('<title>') },
      { name: 'Calculator component present', test: html.includes('todistuspiste') || html.includes('calculator') },
      { name: 'No critical errors', test: !html.includes('Error') && !html.includes('undefined is not') }
    ];

    let allPassed = true;
    checks.forEach(check => {
      if (check.test) {
        log(`✓ ${check.name}`, 'success');
      } else {
        log(`✗ ${check.name}`, 'error');
        allPassed = false;
      }
    });

    return allPassed;
  } catch (error) {
    log(`Page accessibility test failed: ${error.message}`, 'error');
    return false;
  }
}

// ============================================================================
// TEST 2: CALCULATION LOGIC
// ============================================================================

async function testCalculationLogic() {
  section('TEST 2: Calculation Logic Tests');

  const results = [];

  for (const scenario of testScenarios) {
    log(`\nTesting scenario: ${scenario.name}`, 'test');
    log(`Description: ${scenario.description}`, 'info');

    try {
      // Import the calculation function
      const { calculateTodistuspisteetForAllSchemes } = await import('./lib/todistuspiste/index.ts');

      const inputs = scenario.grades;
      const results_calc = calculateTodistuspisteetForAllSchemes(inputs);

      log(`  Yliopisto points: ${results_calc.yliopisto.totalPoints.toFixed(2)}`, 'info');
      log(`  AMK points: ${results_calc.amk.totalPoints.toFixed(2)}`, 'info');

      const scheme = scenario.expectedScheme;
      const points = results_calc[scheme].totalPoints;

      // Validate points are in expected range
      if (scenario.expectedMinPoints && points < scenario.expectedMinPoints) {
        log(`  Points too low! Expected min ${scenario.expectedMinPoints}, got ${points.toFixed(2)}`, 'error');
        results.push({ scenario: scenario.name, passed: false, reason: 'Points below minimum' });
        continue;
      }

      if (scenario.expectedMaxPoints && points > scenario.expectedMaxPoints) {
        log(`  Points too high! Expected max ${scenario.expectedMaxPoints}, got ${points.toFixed(2)}`, 'warning');
      }

      // Check that calculation returned valid data
      if (!results_calc[scheme].breakdown || results_calc[scheme].breakdown.length === 0) {
        log(`  No breakdown data returned`, 'error');
        results.push({ scenario: scenario.name, passed: false, reason: 'Missing breakdown' });
        continue;
      }

      log(`  ✓ Calculation successful`, 'success');
      log(`  ✓ Breakdown contains ${results_calc[scheme].breakdown.length} subjects`, 'success');

      results.push({ scenario: scenario.name, passed: true, points, scheme });

    } catch (error) {
      log(`  Calculation failed: ${error.message}`, 'error');
      results.push({ scenario: scenario.name, passed: false, reason: error.message });
    }
  }

  return results;
}

// ============================================================================
// TEST 3: PROGRAM RECOMMENDATIONS
// ============================================================================

async function testProgramRecommendations() {
  section('TEST 3: Program Recommendations');

  try {
    log('Testing if program recommendations work...', 'test');

    // Test with high points (medicine range)
    log('\nTest case 1: High points (185) - should recommend medicine programs', 'test');
    const highPointsResponse = await fetch(
      `${API_BASE}/api/study-programs?points=185&type=yliopisto&limit=10`
    );

    if (!highPointsResponse.ok) {
      log(`API returned status ${highPointsResponse.status}`, 'error');
      return false;
    }

    const highPointsData = await highPointsResponse.json();

    if (!highPointsData.programs || highPointsData.programs.length === 0) {
      log('No programs returned for high points', 'error');
      return false;
    }

    log(`  Found ${highPointsData.programs.length} programs`, 'success');

    // Check if medicine programs are included
    const medicinePrograms = highPointsData.programs.filter(p =>
      p.name.toLowerCase().includes('lääke') || p.field === 'terveys'
    );

    if (medicinePrograms.length > 0) {
      log(`  ✓ Found ${medicinePrograms.length} health/medicine programs`, 'success');
      medicinePrograms.slice(0, 3).forEach(p => {
        log(`    - ${p.name} (${p.institution}): ${p.minPoints} pts`, 'info');
      });
    } else {
      log(`  No medicine programs found (might be filtered out)`, 'warning');
    }

    // Test with moderate points (CS range)
    log('\nTest case 2: Moderate points (100) - should recommend CS/tech programs', 'test');
    const modPointsResponse = await fetch(
      `${API_BASE}/api/study-programs?points=100&type=yliopisto&field=teknologia&limit=10`
    );

    const modPointsData = await modPointsResponse.json();

    if (modPointsData.programs && modPointsData.programs.length > 0) {
      log(`  Found ${modPointsData.programs.length} tech programs`, 'success');
      modPointsData.programs.slice(0, 3).forEach(p => {
        log(`    - ${p.name} (${p.institution}): ${p.minPoints} pts`, 'info');
      });
    } else {
      log('  No tech programs found', 'warning');
    }

    // Test with low points (AMK range)
    log('\nTest case 3: Low points (50) - should recommend AMK programs', 'test');
    const lowPointsResponse = await fetch(
      `${API_BASE}/api/study-programs?points=50&type=amk&limit=10`
    );

    const lowPointsData = await lowPointsResponse.json();

    if (lowPointsData.programs && lowPointsData.programs.length > 0) {
      log(`  Found ${lowPointsData.programs.length} AMK programs`, 'success');
      lowPointsData.programs.slice(0, 3).forEach(p => {
        log(`    - ${p.name} (${p.institution}): ${p.minPoints} pts`, 'info');
      });
    } else {
      log('  No AMK programs found', 'warning');
    }

    return true;
  } catch (error) {
    log(`Program recommendations test failed: ${error.message}`, 'error');
    return false;
  }
}

// ============================================================================
// TEST 4: CAREER INTEGRATION
// ============================================================================

async function testCareerIntegration() {
  section('TEST 4: Career Test Integration');

  try {
    log('Testing career test result integration...', 'test');

    // Simulate loading career test results from localStorage
    const mockCareerResults = {
      topCareers: [
        { title: 'Ohjelmistokehittäjä', category: 'innovoija', matchScore: 85 },
        { title: 'Tietoturva-asiantuntija', category: 'innovoija', matchScore: 78 }
      ]
    };

    log('Simulated career results:', 'info');
    log(`  Top career: ${mockCareerResults.topCareers[0].title}`, 'info');
    log(`  Category: ${mockCareerResults.topCareers[0].category}`, 'info');

    // Test with career filter
    const response = await fetch(
      `${API_BASE}/api/study-programs?points=100&type=yliopisto&careers=ohjelmistokehittaja,tietoturva-asiantuntija&limit=10`
    );

    if (!response.ok) {
      log(`API returned status ${response.status}`, 'error');
      return false;
    }

    const data = await response.json();

    if (data.programs && data.programs.length > 0) {
      log(`✓ Found ${data.programs.length} career-aligned programs`, 'success');

      // Check if programs have career matches
      const programsWithMatches = data.programs.filter(p =>
        p.relatedCareers && p.relatedCareers.length > 0
      );

      log(`  ${programsWithMatches.length} programs have career alignments`, 'info');

      return true;
    } else {
      log('No career-aligned programs found', 'warning');
      return false;
    }
  } catch (error) {
    log(`Career integration test failed: ${error.message}`, 'error');
    return false;
  }
}

// ============================================================================
// TEST 5: NARRATIVE GENERATION
// ============================================================================

async function testNarrativeGeneration() {
  section('TEST 5: Narrative Generation');

  try {
    const { buildSummaryNarrative, buildActionableNextSteps } = await import('./lib/todistuspiste/narratives.ts');

    // Test with high-achieving student
    const inputs = {
      'äidinkieli': { grade: 'L', variantKey: 'pitka' },
      'matematiikka': { grade: 'L', variantKey: 'pitka' },
      'englanti': { grade: 'E', variantKey: 'pitka' }
    };

    const context = {
      totalPoints: 185,
      bonusPoints: 0,
      strengths: ['Analyyttinen ajattelu', 'Ongelmanratkaisu', 'Empatia'],
      topCareers: [{ title: 'Lääkäri', category: 'auttaja' }],
      category: 'auttaja'
    };

    log('Generating narrative for high-achieving student...', 'test');
    const summary = buildSummaryNarrative(inputs, context);

    if (!summary || summary.length === 0) {
      log('No summary generated', 'error');
      return false;
    }

    log('✓ Summary generated successfully', 'success');
    log(`  Length: ${summary.length} characters`, 'info');
    log(`  Preview: ${summary.substring(0, 100)}...`, 'info');

    // Check if summary mentions career
    if (summary.includes('Lääkäri') || summary.includes('auttaja')) {
      log('✓ Summary includes career information', 'success');
    } else {
      log('Summary does not mention career (might be expected)', 'warning');
    }

    // Test next steps
    log('\nGenerating actionable next steps...', 'test');
    const steps = buildActionableNextSteps(185, 'yliopisto', context);

    if (!steps || steps.length === 0) {
      log('No next steps generated', 'error');
      return false;
    }

    log(`✓ Generated ${steps.length} actionable steps`, 'success');
    steps.slice(0, 3).forEach((step, i) => {
      log(`  ${i + 1}. ${step.substring(0, 80)}...`, 'info');
    });

    return true;
  } catch (error) {
    log(`Narrative generation test failed: ${error.message}`, 'error');
    return false;
  }
}

// ============================================================================
// TEST 6: 2025 PISTERAJAT ACCURACY
// ============================================================================

async function testPisterajatAccuracy() {
  section('TEST 6: 2025 Pisterajat Accuracy');

  try {
    log('Verifying 2025 pisterajat updates...', 'test');

    const response = await fetch(`${API_BASE}/api/study-programs?type=yliopisto&limit=100`);
    const data = await response.json();

    if (!data.programs) {
      log('No programs returned', 'error');
      return false;
    }

    log(`Checking ${data.programs.length} programs...`, 'info');

    // Check specific programs we updated
    const expectedUpdates = [
      { name: 'Lääketiede', institution: 'Helsinki', expectedMin: 188.3 },
      { name: 'Kauppatiede', institution: 'Aalto', expectedMin: 123.8 },
      { name: 'Oikeustiede', institution: 'Helsinki', expectedMin: 134.2 }
    ];

    let correctCount = 0;

    for (const expected of expectedUpdates) {
      const program = data.programs.find(p =>
        p.name.includes(expected.name) &&
        p.institution.includes(expected.institution)
      );

      if (program) {
        if (program.minPoints === expected.expectedMin) {
          log(`✓ ${expected.name} (${expected.institution}): ${program.minPoints} pts - CORRECT`, 'success');
          correctCount++;
        } else {
          log(`✗ ${expected.name} (${expected.institution}): Expected ${expected.expectedMin}, got ${program.minPoints}`, 'error');
        }

        // Check if pointHistory exists
        if (program.pointHistory && program.pointHistory.length > 0) {
          log(`  ✓ Has point history (${program.pointHistory[0].year})`, 'success');
        } else {
          log(`  ✗ Missing point history`, 'warning');
        }
      } else {
        log(`✗ ${expected.name} (${expected.institution}): NOT FOUND`, 'error');
      }
    }

    log(`\n${correctCount}/${expectedUpdates.length} programs have correct 2025 pisterajat`, correctCount === expectedUpdates.length ? 'success' : 'warning');

    return correctCount === expectedUpdates.length;
  } catch (error) {
    log(`Pisterajat accuracy test failed: ${error.message}`, 'error');
    return false;
  }
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

async function runAllTests() {
  console.log(`\n${colors.bold}${colors.cyan}╔${'═'.repeat(78)}╗${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}║${' '.repeat(20)}TODISTUSPISTELASKURI REAL USER TEST${' '.repeat(21)}║${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}╚${'═'.repeat(78)}╝${colors.reset}\n`);

  const results = {
    pageAccessibility: false,
    calculationLogic: [],
    programRecommendations: false,
    careerIntegration: false,
    narrativeGeneration: false,
    pisterajatAccuracy: false
  };

  // Run all tests
  results.pageAccessibility = await testPageAccessibility();
  await sleep(500);

  results.calculationLogic = await testCalculationLogic();
  await sleep(500);

  results.programRecommendations = await testProgramRecommendations();
  await sleep(500);

  results.careerIntegration = await testCareerIntegration();
  await sleep(500);

  results.narrativeGeneration = await testNarrativeGeneration();
  await sleep(500);

  results.pisterajatAccuracy = await testPisterajatAccuracy();

  // Final summary
  section('FINAL TEST SUMMARY');

  const tests = [
    { name: 'Page Accessibility', result: results.pageAccessibility },
    { name: 'Calculation Logic', result: results.calculationLogic.length > 0 && results.calculationLogic.every(r => r.passed) },
    { name: 'Program Recommendations', result: results.programRecommendations },
    { name: 'Career Integration', result: results.careerIntegration },
    { name: 'Narrative Generation', result: results.narrativeGeneration },
    { name: '2025 Pisterajat Accuracy', result: results.pisterajatAccuracy }
  ];

  let passedCount = 0;
  tests.forEach(test => {
    if (test.result) {
      log(`✓ ${test.name}`, 'success');
      passedCount++;
    } else {
      log(`✗ ${test.name}`, 'error');
    }
  });

  console.log(`\n${colors.bold}Final Score: ${passedCount}/${tests.length} tests passed${colors.reset}`);

  if (passedCount === tests.length) {
    console.log(`${colors.green}${colors.bold}🎉 ALL TESTS PASSED!${colors.reset}\n`);
  } else {
    console.log(`${colors.yellow}${colors.bold}⚠️  SOME TESTS FAILED - Review issues above${colors.reset}\n`);
  }

  return results;
}

// Run tests
runAllTests().catch(error => {
  console.error(`${colors.red}Test suite crashed: ${error.message}${colors.reset}`);
  console.error(error.stack);
  process.exit(1);
});
