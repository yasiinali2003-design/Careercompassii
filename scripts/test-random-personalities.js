#!/usr/bin/env node
/**
 * Random Personality Test
 *
 * Generates random personality profiles and tests the scoring system
 * to ensure it produces valid results across varied inputs.
 */

require('dotenv').config({ path: '.env.local' });

const BASE_URL = 'http://localhost:3000';

// ========== RANDOM PROFILE GENERATION ==========

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomAnswers(count) {
  const answers = [];
  for (let i = 0; i < count; i++) {
    // Random score 1-5, with slight bias toward middle values for realism
    const rand = Math.random();
    let score;
    if (rand < 0.15) score = 1;
    else if (rand < 0.30) score = 2;
    else if (rand < 0.70) score = 3;
    else if (rand < 0.85) score = 4;
    else score = 5;
    answers.push(score);
  }
  return answers;
}

function generateBiasedAnswers(count, bias) {
  // Generate answers with a bias toward certain traits
  const answers = [];
  const highIndices = new Set(bias.high || []);
  const lowIndices = new Set(bias.low || []);

  for (let i = 0; i < count; i++) {
    if (highIndices.has(i)) {
      answers.push(randomChoice([4, 5, 5])); // High bias
    } else if (lowIndices.has(i)) {
      answers.push(randomChoice([1, 1, 2])); // Low bias
    } else {
      answers.push(randomChoice([2, 3, 3, 3, 4])); // Neutral
    }
  }
  return answers;
}

const RANDOM_NAMES = [
  'Aada', 'Aleksi', 'Anni', 'Arttu', 'Eemeli', 'Eeva', 'Elias', 'Ella',
  'Emma', 'Emmi', 'Henrik', 'Iida', 'Ilona', 'Janne', 'Jenna', 'Jesse',
  'Joel', 'Julia', 'Juuso', 'Kalle', 'Katri', 'Laura', 'Leevi', 'Leo',
  'Liisa', 'Lotta', 'Markus', 'Matias', 'Matti', 'Mia', 'Mika', 'Mikael',
  'Nelli', 'Niina', 'Noora', 'Oliver', 'Onni', 'Oskari', 'Otto', 'Paula',
  'Pekka', 'Petteri', 'Roosa', 'Sanna', 'Sara', 'Siiri', 'Tiina', 'Tuomas',
  'Veera', 'Ville'
];

const RANDOM_DESCRIPTIONS = [
  'curious and open-minded',
  'practical and hands-on',
  'creative and artistic',
  'analytical and logical',
  'social and outgoing',
  'quiet and thoughtful',
  'ambitious and driven',
  'caring and empathetic',
  'adventurous and bold',
  'organized and methodical',
  'innovative and forward-thinking',
  'traditional and grounded',
  'tech-savvy and modern',
  'nature-loving and eco-conscious',
  'team-oriented and collaborative'
];

function generateRandomProfile(cohort) {
  const questionCounts = { YLA: 30, TASO2: 33, NUORI: 30 };
  const ageRanges = { YLA: [13, 15], TASO2: [16, 19], NUORI: [20, 35] };

  const name = randomChoice(RANDOM_NAMES);
  const age = randomInt(...ageRanges[cohort]);
  const description = randomChoice(RANDOM_DESCRIPTIONS);
  const answers = generateRandomAnswers(questionCounts[cohort]);

  return {
    name: `${name}, ${age}`,
    description,
    answers,
    cohort
  };
}

// ========== API CALLS ==========

async function callScoringAPI(cohort, answers) {
  const testAnswers = answers.map((score, index) => ({
    questionIndex: index,
    score
  }));

  try {
    const response = await fetch(`${BASE_URL}/api/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cohort,
        answers: testAnswers,
        schoolCode: 'TEST-RANDOM'
      })
    });

    if (!response.ok) {
      const text = await response.text();
      return { error: `HTTP ${response.status}: ${text}` };
    }

    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
}

// ========== VALIDATION ==========

function validateResult(result, profile) {
  const issues = [];
  const warnings = [];

  // Check for API errors
  if (result.error) {
    issues.push(`API Error: ${result.error}`);
    return { valid: false, issues, warnings };
  }

  // Check careers exist and have valid structure
  const careers = result.topCareers || [];
  if (careers.length === 0) {
    issues.push('No careers returned');
  } else if (careers.length < 3) {
    warnings.push(`Only ${careers.length} careers returned (expected 3-5)`);
  }

  // Check career structure
  careers.forEach((career, idx) => {
    if (!career.title) issues.push(`Career ${idx} missing title`);
    if (!career.slug) issues.push(`Career ${idx} missing slug`);
    // API uses overallScore not score
    const score = career.overallScore ?? career.score;
    if (typeof score !== 'number') issues.push(`Career ${idx} missing score`);
    if (score < 0 || score > 100) warnings.push(`Career ${idx} has unusual score: ${score}`);
    if (!career.category) warnings.push(`Career ${idx} missing category`);
  });

  // Check user profile exists
  const userProfile = result.userProfile;
  if (!userProfile) {
    issues.push('Missing user profile');
  } else {
    // Check dimension scores
    const dims = userProfile.dimensionScores;
    if (!dims) {
      issues.push('Missing dimension scores');
    } else {
      ['interests', 'values', 'workstyle', 'context'].forEach(dim => {
        if (typeof dims[dim] !== 'number') {
          issues.push(`Missing ${dim} dimension`);
        } else if (dims[dim] < 0 || dims[dim] > 100) {
          warnings.push(`${dim} dimension has unusual value: ${dims[dim]}`);
        }
      });
    }

    // Check top strengths
    if (!userProfile.topStrengths || userProfile.topStrengths.length === 0) {
      warnings.push('No top strengths identified');
    }
  }

  // Check personalized analysis (nested under userProfile in API response)
  const analysis = result.personalizedAnalysis || userProfile?.personalizedAnalysis;
  if (!analysis) {
    issues.push('Missing personalized analysis');
  } else if (analysis.length < 50) {
    warnings.push('Personalized analysis seems too short');
  }

  // Check education path for YLA
  if (profile.cohort === 'YLA') {
    const eduPath = result.educationPath;
    if (!eduPath) {
      warnings.push('Missing education path for YLA');
    } else {
      if (!eduPath.primary || !['lukio', 'ammattikoulu', 'kansanopisto'].includes(eduPath.primary)) {
        issues.push(`Invalid education path: ${eduPath.primary}`);
      }
    }
  }

  return {
    valid: issues.length === 0,
    issues,
    warnings
  };
}

// ========== MAIN TEST RUNNER ==========

async function runRandomTests(testsPerCohort = 5) {
  console.log('='.repeat(80));
  console.log('RANDOM PERSONALITY TEST');
  console.log('Testing scoring system with randomly generated profiles');
  console.log('='.repeat(80));
  console.log();

  const results = {
    total: 0,
    passed: 0,
    warnings: 0,
    failed: 0,
    details: []
  };

  const cohorts = ['YLA', 'TASO2', 'NUORI'];

  for (const cohort of cohorts) {
    console.log('='.repeat(60));
    console.log(`COHORT: ${cohort}`);
    console.log('='.repeat(60));
    console.log();

    for (let i = 0; i < testsPerCohort; i++) {
      const profile = generateRandomProfile(cohort);
      results.total++;

      console.log(`  Test ${i + 1}: ${profile.name}`);
      console.log(`  Description: ${profile.description}`);

      const apiResult = await callScoringAPI(cohort, profile.answers);
      const validation = validateResult(apiResult, profile);

      const detail = {
        profile,
        result: apiResult,
        validation
      };

      if (validation.valid && validation.warnings.length === 0) {
        results.passed++;
        const topCareer = apiResult.topCareers?.[0];
        const topScore = topCareer?.overallScore ?? topCareer?.score ?? 0;
        console.log(`  Category: ${topCareer?.category || 'N/A'}`);
        console.log(`  Top Career: ${topCareer?.title || 'N/A'} (${topScore}%)`);
        if (cohort === 'YLA') {
          console.log(`  Education Path: ${apiResult.educationPath?.primary || 'N/A'}`);
        }
        console.log(`  Status: PASS`);
      } else if (validation.valid) {
        results.warnings++;
        console.log(`  Category: ${apiResult.topCareers?.[0]?.category || 'N/A'}`);
        console.log(`  Top Career: ${apiResult.topCareers?.[0]?.title || 'N/A'}`);
        console.log(`  Status: WARN`);
        validation.warnings.forEach(w => console.log(`    - ${w}`));
      } else {
        results.failed++;
        console.log(`  Status: FAIL`);
        validation.issues.forEach(issue => console.log(`    - ${issue}`));
      }

      results.details.push(detail);
      console.log();
    }
  }

  // Summary
  console.log('='.repeat(80));
  console.log('RANDOM TEST SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total Tests: ${results.total}`);
  console.log(`  Passed: ${results.passed} (${((results.passed / results.total) * 100).toFixed(1)}%)`);
  console.log(`  Warnings: ${results.warnings} (${((results.warnings / results.total) * 100).toFixed(1)}%)`);
  console.log(`  Failed: ${results.failed} (${((results.failed / results.total) * 100).toFixed(1)}%)`);
  console.log();

  // Category distribution
  const categoryDist = {};
  results.details.forEach(d => {
    const cat = d.result.topCareers?.[0]?.category || 'unknown';
    categoryDist[cat] = (categoryDist[cat] || 0) + 1;
  });

  console.log('Category Distribution:');
  Object.entries(categoryDist)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      const pct = ((count / results.total) * 100).toFixed(1);
      console.log(`  ${cat}: ${count} (${pct}%)`);
    });

  // Education path distribution (YLA only)
  const eduDist = {};
  results.details
    .filter(d => d.profile.cohort === 'YLA')
    .forEach(d => {
      const path = d.result.educationPath?.primary || 'unknown';
      eduDist[path] = (eduDist[path] || 0) + 1;
    });

  if (Object.keys(eduDist).length > 0) {
    console.log();
    console.log('Education Path Distribution (YLA):');
    Object.entries(eduDist)
      .sort((a, b) => b[1] - a[1])
      .forEach(([path, count]) => {
        const pct = ((count / testsPerCohort) * 100).toFixed(1);
        console.log(`  ${path}: ${count} (${pct}%)`);
      });
  }

  console.log();
  if (results.failed === 0) {
    console.log('✓ ALL RANDOM TESTS PASSED');
  } else {
    console.log(`✗ ${results.failed} TESTS FAILED`);
  }

  return results;
}

// Run with 10 tests per cohort (30 total)
runRandomTests(10).catch(console.error);
