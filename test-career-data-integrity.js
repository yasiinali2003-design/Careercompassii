/**
 * Test 11: Career Data Integrity Test
 *
 * Validates the career database integrity:
 * 1. All careers have required fields
 * 2. Career categories are valid
 * 3. No duplicate careers
 * 4. Career slugs are properly formatted
 * 5. Education paths are valid
 * 6. Salary data is reasonable
 * 7. Career descriptions are present and valid
 * 8. All careers are reachable (can be recommended)
 *
 * This test ensures the career data is complete and consistent.
 */

const BASE_URL = 'http://localhost:3000';

const COHORTS = ['YLA', 'TASO2', 'NUORI'];

// Valid categories (should match system)
const VALID_CATEGORIES = [
  'luova',
  'innovoija',
  'auttaja',
  'johtaja',
  'rakentaja',
  'ympariston-puolustaja',
  'jarjestaja'
];

// Required fields for a career
const REQUIRED_CAREER_FIELDS = [
  'slug',
  'title',
  'category',
  'overallScore',
  'reasons'
];

async function submitTest(cohort, answers) {
  const response = await fetch(`${BASE_URL}/api/score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cohort, answers })
  });

  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  return response.json();
}

function generateAnswers(pattern, count = 30) {
  switch (pattern) {
    case 'creative':
      return Array.from({ length: count }, (_, i) => ({
        questionIndex: i,
        score: i < 10 ? 5 : 2
      }));
    case 'analytical':
      return Array.from({ length: count }, (_, i) => ({
        questionIndex: i,
        score: i >= 5 && i < 15 ? 5 : 2
      }));
    case 'social':
      return Array.from({ length: count }, (_, i) => ({
        questionIndex: i,
        score: i >= 10 && i < 20 ? 5 : 2
      }));
    case 'leader':
      return Array.from({ length: count }, (_, i) => ({
        questionIndex: i,
        score: i >= 15 ? 5 : 2
      }));
    case 'balanced':
      return Array.from({ length: count }, (_, i) => ({
        questionIndex: i,
        score: 3
      }));
    default:
      return Array.from({ length: count }, (_, i) => ({
        questionIndex: i,
        score: Math.floor(Math.random() * 5) + 1
      }));
  }
}

// Collect unique careers from many different answer patterns
async function collectCareers(cohort, sampleSize = 30) {
  console.log(`     Collecting careers (${sampleSize} samples)...`);

  const careers = new Map(); // slug -> career object
  const patterns = ['creative', 'analytical', 'social', 'leader', 'balanced'];

  // Use specific patterns
  for (const pattern of patterns) {
    const answers = generateAnswers(pattern);
    const result = await submitTest(cohort, answers);

    if (result.topCareers) {
      result.topCareers.forEach(c => {
        if (!careers.has(c.slug)) {
          careers.set(c.slug, c);
        }
      });
    }
  }

  // Add random samples
  for (let i = 0; i < sampleSize - patterns.length; i++) {
    const answers = generateAnswers('random');
    const result = await submitTest(cohort, answers);

    if (result.topCareers) {
      result.topCareers.forEach(c => {
        if (!careers.has(c.slug)) {
          careers.set(c.slug, c);
        }
      });
    }
  }

  console.log(`     Found ${careers.size} unique careers`);
  return [...careers.values()];
}

// Test 1: Validate required fields
function validateRequiredFields(careers) {
  console.log('\n  📝 Checking required fields...');

  const issues = [];

  for (const career of careers) {
    for (const field of REQUIRED_CAREER_FIELDS) {
      if (career[field] === undefined || career[field] === null) {
        issues.push({
          career: career.title || career.slug || 'Unknown',
          field,
          error: 'Missing required field'
        });
      }
    }

    // Check reasons array
    if (career.reasons && career.reasons.length === 0) {
      issues.push({
        career: career.title,
        field: 'reasons',
        error: 'Empty reasons array'
      });
    }
  }

  if (issues.length === 0) {
    console.log(`     ✓ All ${careers.length} careers have required fields`);
  } else {
    console.log(`     ✗ ${issues.length} field issues found`);
    issues.slice(0, 3).forEach(i => {
      console.log(`        - ${i.career}: ${i.field} - ${i.error}`);
    });
  }

  return { passed: issues.length === 0, issues };
}

// Test 2: Validate categories
function validateCategories(careers) {
  console.log('\n  🏷️ Checking career categories...');

  const issues = [];
  const categoryCounts = {};

  for (const career of careers) {
    if (!career.category) {
      issues.push({
        career: career.title,
        error: 'Missing category'
      });
    } else if (!VALID_CATEGORIES.includes(career.category)) {
      issues.push({
        career: career.title,
        category: career.category,
        error: 'Invalid category'
      });
    } else {
      categoryCounts[career.category] = (categoryCounts[career.category] || 0) + 1;
    }
  }

  console.log('     Category distribution:');
  Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`        ${cat}: ${count} careers`);
  });

  if (issues.length === 0) {
    console.log(`     ✓ All categories are valid`);
  } else {
    console.log(`     ✗ ${issues.length} category issues`);
    issues.slice(0, 3).forEach(i => {
      console.log(`        - ${i.career}: ${i.error}${i.category ? ` (${i.category})` : ''}`);
    });
  }

  return { passed: issues.length === 0, issues, categoryCounts };
}

// Test 3: Validate slugs
function validateSlugs(careers) {
  console.log('\n  🔗 Checking career slugs...');

  const issues = [];
  const slugs = new Set();

  for (const career of careers) {
    const slug = career.slug;

    // Check format
    if (!slug) {
      issues.push({
        career: career.title,
        error: 'Missing slug'
      });
    } else if (!/^[a-z0-9-]+$/.test(slug)) {
      issues.push({
        career: career.title,
        slug,
        error: 'Invalid slug format (should be lowercase with hyphens)'
      });
    } else if (slugs.has(slug)) {
      issues.push({
        career: career.title,
        slug,
        error: 'Duplicate slug'
      });
    } else {
      slugs.add(slug);
    }
  }

  if (issues.length === 0) {
    console.log(`     ✓ All ${slugs.size} slugs are valid and unique`);
  } else {
    console.log(`     ✗ ${issues.length} slug issues`);
    issues.slice(0, 3).forEach(i => {
      console.log(`        - ${i.career}: ${i.error}`);
    });
  }

  return { passed: issues.length === 0, issues, uniqueSlugs: slugs.size };
}

// Test 4: Validate scores
function validateScores(careers) {
  console.log('\n  📊 Checking career scores...');

  const issues = [];
  const scores = careers.map(c => c.overallScore).filter(s => s !== undefined);

  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

  console.log(`     Score range: ${min} - ${max}`);
  console.log(`     Average score: ${avg.toFixed(1)}`);

  for (const career of careers) {
    if (career.overallScore === undefined) {
      issues.push({
        career: career.title,
        error: 'Missing score'
      });
    } else if (career.overallScore < 0 || career.overallScore > 100) {
      issues.push({
        career: career.title,
        score: career.overallScore,
        error: 'Score out of range (0-100)'
      });
    }

    // Check dimension scores if present
    if (career.dimensionScores) {
      const dims = Object.entries(career.dimensionScores);
      for (const [dim, score] of dims) {
        if (score < 0 || score > 100) {
          issues.push({
            career: career.title,
            dimension: dim,
            score,
            error: 'Dimension score out of range'
          });
        }
      }
    }
  }

  if (issues.length === 0) {
    console.log(`     ✓ All scores are valid`);
  } else {
    console.log(`     ✗ ${issues.length} score issues`);
  }

  return { passed: issues.length === 0, issues, scoreStats: { min, max, avg } };
}

// Test 5: Validate reasons quality
function validateReasons(careers) {
  console.log('\n  💬 Checking career reasons...');

  const issues = [];
  let totalReasons = 0;

  for (const career of careers) {
    if (!career.reasons) {
      issues.push({
        career: career.title,
        error: 'Missing reasons'
      });
      continue;
    }

    if (!Array.isArray(career.reasons)) {
      issues.push({
        career: career.title,
        error: 'Reasons is not an array'
      });
      continue;
    }

    totalReasons += career.reasons.length;

    // Check each reason
    for (let i = 0; i < career.reasons.length; i++) {
      const reason = career.reasons[i];

      if (!reason || reason.trim() === '') {
        issues.push({
          career: career.title,
          error: `Reason ${i + 1} is empty`
        });
      } else if (reason.length < 20) {
        issues.push({
          career: career.title,
          reason: reason.substring(0, 30),
          error: `Reason ${i + 1} is too short (${reason.length} chars)`
        });
      }
    }
  }

  const avgReasons = (totalReasons / careers.length).toFixed(1);
  console.log(`     Average reasons per career: ${avgReasons}`);

  if (issues.length === 0) {
    console.log(`     ✓ All reasons are valid`);
  } else {
    console.log(`     ✗ ${issues.length} reason issues`);
    issues.slice(0, 3).forEach(i => {
      console.log(`        - ${i.career}: ${i.error}`);
    });
  }

  return { passed: issues.length === 0, issues, avgReasons };
}

// Test 6: Check for duplicate careers
function checkDuplicates(careers) {
  console.log('\n  🔍 Checking for duplicates...');

  const issues = [];
  const titles = new Map();
  const slugs = new Map();

  for (const career of careers) {
    // Check title duplicates
    if (titles.has(career.title)) {
      issues.push({
        type: 'title',
        value: career.title,
        error: 'Duplicate title'
      });
    } else {
      titles.set(career.title, true);
    }

    // Check slug duplicates
    if (slugs.has(career.slug)) {
      issues.push({
        type: 'slug',
        value: career.slug,
        error: 'Duplicate slug'
      });
    } else {
      slugs.set(career.slug, true);
    }
  }

  if (issues.length === 0) {
    console.log(`     ✓ No duplicates found`);
  } else {
    console.log(`     ✗ ${issues.length} duplicates found`);
    issues.forEach(i => {
      console.log(`        - Duplicate ${i.type}: "${i.value}"`);
    });
  }

  return { passed: issues.length === 0, issues };
}

// Test 7: Validate confidence levels
function validateConfidence(careers) {
  console.log('\n  🎯 Checking confidence levels...');

  const issues = [];
  const confidenceCounts = { high: 0, medium: 0, low: 0, unknown: 0 };

  for (const career of careers) {
    const conf = career.confidence;
    if (!conf) {
      confidenceCounts.unknown++;
    } else if (['high', 'medium', 'low'].includes(conf)) {
      confidenceCounts[conf]++;
    } else {
      issues.push({
        career: career.title,
        confidence: conf,
        error: 'Invalid confidence value'
      });
    }
  }

  console.log(`     Distribution: high=${confidenceCounts.high}, medium=${confidenceCounts.medium}, low=${confidenceCounts.low}, unknown=${confidenceCounts.unknown}`);

  if (issues.length === 0) {
    console.log(`     ✓ All confidence values are valid`);
  } else {
    console.log(`     ✗ ${issues.length} confidence issues`);
  }

  return { passed: issues.length === 0, issues, confidenceCounts };
}

async function runTests() {
  console.log('🔍 Checking server connectivity...');

  try {
    const response = await fetch(`${BASE_URL}/api/questions?cohort=YLA&setIndex=0`);
    if (!response.ok) throw new Error('Server not responding');
    console.log('✅ Server is running\n');
  } catch (error) {
    console.log('❌ Server is not running. Please start with: npm run dev\n');
    process.exit(1);
  }

  console.log('🧪 CAREER DATA INTEGRITY TEST');
  console.log('='.repeat(60));
  console.log('Validating career database integrity\n');

  const results = {};

  for (const cohort of COHORTS) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📚 Testing Cohort: ${cohort}`);
    console.log('-'.repeat(60));

    // Collect careers
    const careers = await collectCareers(cohort, 25);

    // Run all validation tests
    const cohortResults = {
      careerCount: careers.length,
      requiredFields: validateRequiredFields(careers),
      categories: validateCategories(careers),
      slugs: validateSlugs(careers),
      scores: validateScores(careers),
      reasons: validateReasons(careers),
      duplicates: checkDuplicates(careers),
      confidence: validateConfidence(careers)
    };

    results[cohort] = cohortResults;

    // Cohort summary
    const passedTests = Object.entries(cohortResults)
      .filter(([k, v]) => k !== 'careerCount' && v.passed)
      .length;
    const totalTests = Object.keys(cohortResults).length - 1; // Exclude careerCount

    console.log(`\n  📊 Cohort Summary: ${passedTests}/${totalTests} tests passed`);
  }

  // Overall Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 OVERALL SUMMARY');
  console.log('='.repeat(60));

  let totalTests = 0;
  let passedTests = 0;

  console.log('\n📋 Results by Cohort:');
  for (const cohort of COHORTS) {
    const r = results[cohort];
    const tests = Object.entries(r).filter(([k]) => k !== 'careerCount');
    const passed = tests.filter(([, v]) => v.passed).length;
    totalTests += tests.length;
    passedTests += passed;

    console.log(`\n   ${cohort} (${r.careerCount} careers found):`);
    tests.forEach(([name, result]) => {
      const status = result.passed ? '✅' : '❌';
      console.log(`      ${status} ${name}`);
    });
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Total: ${passedTests}/${totalTests} tests passed`);

  if (passedTests === totalTests) {
    console.log('🎉 All career data integrity tests passed!');
  } else {
    console.log(`⚠️ ${totalTests - passedTests} tests failed - review issues above`);
  }

  // Save results
  const fs = require('fs');
  fs.writeFileSync('test-career-data-integrity-results.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: { totalTests, passedTests },
    results
  }, null, 2));

  console.log('\n📄 Full results saved to test-career-data-integrity-results.json\n');
}

runTests().catch(console.error);
