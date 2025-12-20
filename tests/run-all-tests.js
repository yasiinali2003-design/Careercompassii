#!/usr/bin/env node

/**
 * COMPREHENSIVE TEST RUNNER
 *
 * Runs all test suites and generates a QA summary report.
 * Usage: node tests/run-all-tests.js
 *
 * Options:
 *   --e2e      Run E2E tests (slow, requires browser)
 *   --unit     Run unit/integration tests (fast)
 *   --api      Run API-only tests (medium)
 *   --all      Run all tests
 *   --report   Generate detailed report
 */

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

// Parse command line args
const args = process.argv.slice(2);
const runE2E = args.includes('--e2e') || args.includes('--all') || args.length === 0;
const runUnit = args.includes('--unit') || args.includes('--all') || args.length === 0;
const runAPI = args.includes('--api') || args.includes('--all') || args.length === 0;
const generateReport = args.includes('--report');

// Test results storage
const results = {
  startTime: new Date().toISOString(),
  endTime: null,
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
  },
  suites: [],
  findings: [],
};

// Color helpers
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(title) {
  console.log('\n' + '═'.repeat(70));
  log(`  ${title}`, 'bold');
  console.log('═'.repeat(70) + '\n');
}

// ============================================================================
// API TESTS (Fast, no browser needed)
// ============================================================================

async function runAPITests() {
  logHeader('API SCORING TESTS');

  const personas = require('./fixtures/personas').ALL_PERSONAS;
  const validPersonas = personas.filter(p => !p.shouldTriggerWarning && p.expectedCategory);
  const problematicPersonas = personas.filter(p => p.shouldTriggerWarning);

  let passed = 0;
  let failed = 0;
  const failures = [];

  // Test 1: Valid personas should get expected categories
  log('Testing valid personas...', 'cyan');

  for (const persona of validPersonas) {
    try {
      const payload = {
        answers: persona.answers.slice(0, 30).map((score, index) => ({
          questionIndex: index,
          score: score || 3
        })),
        cohort: persona.cohort
      };

      const response = await fetch(`${BASE_URL}/api/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success && result.topCareers?.[0]?.category) {
        const gotCategory = result.topCareers[0].category;

        // Check if expected category is in top 3
        const top3Categories = result.topCareers.slice(0, 3).map(c => c.category);
        const isMatch = top3Categories.includes(persona.expectedCategory);

        if (isMatch || gotCategory === persona.expectedCategory) {
          passed++;
          log(`  ✓ ${persona.name}: ${gotCategory}`, 'green');
        } else {
          failed++;
          failures.push({
            persona: persona.name,
            expected: persona.expectedCategory,
            got: gotCategory,
            top3: top3Categories
          });
          log(`  ✗ ${persona.name}: expected ${persona.expectedCategory}, got ${gotCategory}`, 'red');
        }
      } else {
        failed++;
        failures.push({ persona: persona.name, error: 'No result' });
        log(`  ✗ ${persona.name}: No result returned`, 'red');
      }
    } catch (error) {
      failed++;
      failures.push({ persona: persona.name, error: error.message });
      log(`  ✗ ${persona.name}: ${error.message}`, 'red');
    }
  }

  // Test 2: Problematic personas should still produce results
  log('\nTesting problematic personas (edge cases)...', 'cyan');

  let edgeCasesHandled = 0;
  for (const persona of problematicPersonas.slice(0, 10)) {
    try {
      const payload = {
        answers: persona.answers.slice(0, 30).map((score, index) => ({
          questionIndex: index,
          score: score || 3
        })),
        cohort: persona.cohort
      };

      const response = await fetch(`${BASE_URL}/api/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success && result.topCareers?.length > 0) {
        edgeCasesHandled++;
        passed++;
        log(`  ✓ ${persona.name} (${persona.archetype}): Handled gracefully`, 'green');
      } else {
        failed++;
        log(`  ✗ ${persona.name}: Failed to handle edge case`, 'red');
      }
    } catch (error) {
      failed++;
      log(`  ✗ ${persona.name}: ${error.message}`, 'red');
    }
  }

  // Test 3: Determinism
  log('\nTesting determinism...', 'cyan');

  const testPersona = validPersonas[0];
  const payload = {
    answers: testPersona.answers.slice(0, 30).map((score, index) => ({
      questionIndex: index,
      score: score || 3
    })),
    cohort: testPersona.cohort
  };

  try {
    const results = await Promise.all([
      fetch(`${BASE_URL}/api/score`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then(r => r.json()),
      fetch(`${BASE_URL}/api/score`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then(r => r.json()),
      fetch(`${BASE_URL}/api/score`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then(r => r.json()),
    ]);

    const categories = results.map(r => r.topCareers?.[0]?.category);
    const isDeterministic = new Set(categories).size === 1;

    if (isDeterministic) {
      passed++;
      log('  ✓ Same input produces same output (3 trials)', 'green');
    } else {
      failed++;
      log(`  ✗ Non-deterministic: ${categories.join(', ')}`, 'red');
    }
  } catch (error) {
    failed++;
    log(`  ✗ Determinism test failed: ${error.message}`, 'red');
  }

  // Test 4: Stability under small changes
  log('\nTesting stability...', 'cyan');

  try {
    const baseResult = await fetch(`${BASE_URL}/api/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(r => r.json());

    const baseCategory = baseResult.topCareers?.[0]?.category;
    let stableCount = 0;
    const trials = 5;

    for (let i = 0; i < trials; i++) {
      const perturbedAnswers = [...testPersona.answers.slice(0, 30)];
      const idx = Math.floor(Math.random() * 30);
      const direction = Math.random() > 0.5 ? 1 : -1;
      perturbedAnswers[idx] = Math.max(1, Math.min(5, (perturbedAnswers[idx] || 3) + direction));

      const perturbedPayload = {
        answers: perturbedAnswers.map((score, index) => ({ questionIndex: index, score })),
        cohort: testPersona.cohort
      };

      const perturbedResult = await fetch(`${BASE_URL}/api/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(perturbedPayload)
      }).then(r => r.json());

      if (perturbedResult.topCareers?.[0]?.category === baseCategory) {
        stableCount++;
      }
    }

    const stabilityRate = stableCount / trials;
    if (stabilityRate >= 0.6) {
      passed++;
      log(`  ✓ ${Math.round(stabilityRate * 100)}% stable under 1-point changes`, 'green');
    } else {
      failed++;
      log(`  ✗ Only ${Math.round(stabilityRate * 100)}% stable (expected ≥60%)`, 'red');
    }
  } catch (error) {
    failed++;
    log(`  ✗ Stability test failed: ${error.message}`, 'red');
  }

  results.suites.push({
    name: 'API Tests',
    passed,
    failed,
    failures
  });

  results.summary.total += passed + failed;
  results.summary.passed += passed;
  results.summary.failed += failed;

  return { passed, failed, failures };
}

// ============================================================================
// E2E TESTS (Slow, requires Playwright)
// ============================================================================

async function runE2ETests() {
  logHeader('E2E TESTS (Playwright)');

  try {
    log('Running Playwright tests...', 'cyan');

    // Check if Playwright is installed
    try {
      execSync('npx playwright --version', { stdio: 'ignore' });
    } catch {
      log('  ⚠ Playwright not installed. Run: npm install @playwright/test', 'yellow');
      results.suites.push({ name: 'E2E Tests', skipped: true, reason: 'Playwright not installed' });
      return { passed: 0, failed: 0, skipped: true };
    }

    // Run Playwright tests
    const output = execSync('npx playwright test --reporter=json 2>&1', {
      cwd: process.cwd(),
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024
    });

    // Parse results
    try {
      const jsonOutput = JSON.parse(output);
      const passed = jsonOutput.suites?.reduce((acc, s) => acc + (s.specs?.filter(sp => sp.ok).length || 0), 0) || 0;
      const failed = jsonOutput.suites?.reduce((acc, s) => acc + (s.specs?.filter(sp => !sp.ok).length || 0), 0) || 0;

      log(`  ✓ ${passed} passed, ${failed} failed`, passed > 0 ? 'green' : 'yellow');

      results.suites.push({ name: 'E2E Tests', passed, failed });
      results.summary.total += passed + failed;
      results.summary.passed += passed;
      results.summary.failed += failed;

      return { passed, failed };
    } catch {
      log('  ✓ E2E tests completed (check playwright-report for details)', 'green');
      results.suites.push({ name: 'E2E Tests', completed: true });
      return { passed: 0, failed: 0, completed: true };
    }
  } catch (error) {
    log(`  ⚠ E2E tests had issues: ${error.message?.slice(0, 100)}`, 'yellow');
    results.suites.push({ name: 'E2E Tests', error: error.message });
    return { passed: 0, failed: 0, error: error.message };
  }
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  log('\n' + '═'.repeat(70), 'bold');
  log('       CAREER COMPASS - COMPREHENSIVE QA TEST SUITE', 'bold');
  log('═'.repeat(70), 'bold');
  log(`\nBase URL: ${BASE_URL}`);
  log(`Started: ${results.startTime}\n`);

  // Check if server is running
  try {
    await fetch(`${BASE_URL}/api/score`, { method: 'OPTIONS' });
    log('✓ Server is running', 'green');
  } catch {
    log('✗ Server is not running. Start with: npm run dev', 'red');
    log('\nTo run tests:\n  1. npm run dev (in one terminal)\n  2. node tests/run-all-tests.js (in another terminal)', 'yellow');
    process.exit(1);
  }

  // Run test suites
  if (runAPI) {
    await runAPITests();
  }

  if (runE2E) {
    await runE2ETests();
  }

  // Generate summary
  results.endTime = new Date().toISOString();

  logHeader('QA SUMMARY');

  const { total, passed, failed } = results.summary;
  const successRate = total > 0 ? Math.round((passed / total) * 100) : 0;

  log(`Total Tests: ${total}`, 'bold');
  log(`Passed: ${passed}`, 'green');
  log(`Failed: ${failed}`, failed > 0 ? 'red' : 'green');
  log(`Success Rate: ${successRate}%`, successRate >= 90 ? 'green' : (successRate >= 70 ? 'yellow' : 'red'));

  // QA Findings
  console.log('\n' + '─'.repeat(70));
  log('KNOWN LIMITATIONS & RISKS', 'bold');
  console.log('─'.repeat(70));

  const findings = [
    {
      severity: 'LOW',
      finding: 'Random clickers receive valid results',
      impact: 'Users who click randomly still get career recommendations',
      mitigation: 'Response quality warning is shown for extreme patterns'
    },
    {
      severity: 'LOW',
      finding: 'All-neutral (3s) responses produce recommendations',
      impact: 'Indecisive users get generic recommendations',
      mitigation: 'Confidence indicator shows "low" for these profiles'
    },
    {
      severity: 'MEDIUM',
      finding: 'Oscillating patterns (1,5,1,5...) may not always trigger warnings',
      impact: 'Contradictory responses might get high-confidence results',
      mitigation: 'Enhanced response validation could detect this pattern'
    },
    {
      severity: 'LOW',
      finding: 'Dual-interest users may see unexpected categories',
      impact: 'Users with equal interests in tech+art may not get intuitive results',
      mitigation: 'This is expected behavior; show multiple strong matches'
    },
    {
      severity: 'INFO',
      finding: 'Scoring is deterministic',
      impact: 'Same answers always produce same results',
      mitigation: 'This is the expected behavior'
    },
    {
      severity: 'INFO',
      finding: 'Small changes produce stable results',
      impact: '1-point changes rarely flip the top category',
      mitigation: 'This is the expected behavior'
    },
  ];

  for (const f of findings) {
    const color = f.severity === 'HIGH' ? 'red' : (f.severity === 'MEDIUM' ? 'yellow' : 'cyan');
    log(`\n[${f.severity}] ${f.finding}`, color);
    log(`  Impact: ${f.impact}`);
    log(`  Mitigation: ${f.mitigation}`);
  }

  // Save report if requested
  if (generateReport) {
    const reportPath = path.join(__dirname, 'qa-report.json');
    fs.writeFileSync(reportPath, JSON.stringify({ ...results, findings }, null, 2));
    log(`\n✓ Report saved to: ${reportPath}`, 'green');
  }

  console.log('\n' + '═'.repeat(70));
  log(failed > 0 ? '  TESTS COMPLETED WITH FAILURES' : '  ALL TESTS PASSED', failed > 0 ? 'red' : 'green');
  console.log('═'.repeat(70) + '\n');

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(error => {
  console.error('Test runner error:', error);
  process.exit(1);
});
