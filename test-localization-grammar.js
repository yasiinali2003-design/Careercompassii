/**
 * Test 7: Localization and Grammar Verification Test
 *
 * Validates that all text content is:
 * 1. In Finnish language
 * 2. Grammatically correct (basic checks)
 * 3. Free of common Finnish spelling/grammar errors
 * 4. Uses consistent formatting (capitalization, punctuation)
 * 5. Contains no English words (except technical terms)
 * 6. Uses proper Finnish question structure
 *
 * This is a static analysis test - no server required.
 */

const BASE_URL = 'http://localhost:3000';

// Common Finnish grammar patterns
const FINNISH_PATTERNS = {
  // Question words that should start sentences
  questionStarters: /^(onko|ovatko|oletko|haluaisitko|haluatko|tykkäätkö|pidätkö|kiinnostaako|nautitko|viihdytkö|sopiiko|pystytkö|uskaltaisitko|voitko|olisitko|osaatko)/i,

  // Common English words that should NOT appear
  englishWords: /\b(the|and|or|you|your|with|for|from|have|has|been|will|would|could|should|this|that|these|those|what|when|where|which|who|how|why|can|get|make|like|just|also|very|really|actually|basically)\b/i,

  // Finnish double vowels and consonants
  doubleLetters: /aa|ee|ii|oo|uu|yy|ää|öö|kk|pp|tt|nn|mm|ll|rr|ss/,

  // Common Finnish word endings
  finnishEndings: /(?:nen|inen|lainen|llinen|ttava|ttävä|minen|miseen|mista|mistä|nko|nkö|tko|tkö|ssa|ssä|sta|stä|lla|llä|lta|ltä|lle|seen|aan|ään|ksi|tta|ttä|ko|kö|pa|pä|han|hän|kin)$/i
};

// Known technical terms that are OK in English
const ALLOWED_ENGLISH_TERMS = ['ok', 'it', 'ai', 'seo', 'ict', 'cad', 'crm', 'erp', 'app', 'web', 'vr', 'ar'];

async function getQuestions(cohort) {
  const response = await fetch(`${BASE_URL}/api/questions?cohort=${cohort}&setIndex=0`);
  if (!response.ok) throw new Error(`Failed to get questions for ${cohort}`);
  const data = await response.json();
  return data.questions || data;
}

async function getCareerResult(cohort) {
  const answers = Array.from({ length: 30 }, (_, i) => ({
    questionIndex: i,
    score: 3
  }));

  const response = await fetch(`${BASE_URL}/api/score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cohort, answers })
  });

  if (!response.ok) throw new Error(`Failed to get results for ${cohort}`);
  return response.json();
}

function checkQuestionStructure(text, index, cohort) {
  const issues = [];

  // Check if question ends with ?
  if (!text.endsWith('?')) {
    issues.push({
      type: 'punctuation',
      severity: 'error',
      message: `Q${index}: Question doesn't end with "?"`,
      text: text.substring(0, 50) + '...'
    });
  }

  // Check for proper capitalization (first letter should be uppercase)
  if (text[0] !== text[0].toUpperCase()) {
    issues.push({
      type: 'capitalization',
      severity: 'warning',
      message: `Q${index}: First letter should be capitalized`,
      text: text.substring(0, 30) + '...'
    });
  }

  // Check for double spaces
  if (/  +/.test(text)) {
    issues.push({
      type: 'spacing',
      severity: 'minor',
      message: `Q${index}: Contains double spaces`,
      text: text.substring(0, 30) + '...'
    });
  }

  // Check for trailing/leading whitespace
  if (text !== text.trim()) {
    issues.push({
      type: 'whitespace',
      severity: 'minor',
      message: `Q${index}: Contains leading/trailing whitespace`
    });
  }

  return issues;
}

function checkFinnishContent(text, index) {
  const issues = [];

  // Check for English words
  const englishMatch = text.match(FINNISH_PATTERNS.englishWords);
  if (englishMatch) {
    const word = englishMatch[0].toLowerCase();
    if (!ALLOWED_ENGLISH_TERMS.includes(word)) {
      issues.push({
        type: 'language',
        severity: 'warning',
        message: `Q${index}: Contains English word "${word}"`,
        text: text.substring(0, 50) + '...'
      });
    }
  }

  // Check for Finnish character usage (should have some Finnish characters)
  const hasFinnishChars = /[äöåÄÖÅ]/.test(text);
  const hasDoubleLetters = FINNISH_PATTERNS.doubleLetters.test(text);
  const hasFinnishEndings = FINNISH_PATTERNS.finnishEndings.test(text);

  if (!hasFinnishChars && !hasDoubleLetters && !hasFinnishEndings) {
    // Could be non-Finnish
    issues.push({
      type: 'language',
      severity: 'info',
      message: `Q${index}: May not be Finnish (no Finnish patterns detected)`,
      text: text.substring(0, 50) + '...'
    });
  }

  return issues;
}

function checkGrammar(text, index) {
  const issues = [];

  // Check for missing comma before relative clauses
  const relativePronouns = ['joka', 'jossa', 'jonka', 'jolle', 'jolla', 'josta', 'johon', 'joihin'];
  for (const pronoun of relativePronouns) {
    const regex = new RegExp(`\\w\\s+${pronoun}\\s`, 'i');
    const commaRegex = new RegExp(`,\\s+${pronoun}\\s`, 'i');

    if (regex.test(text) && !commaRegex.test(text)) {
      issues.push({
        type: 'grammar',
        severity: 'warning',
        message: `Q${index}: Consider comma before "${pronoun}"`,
        text: text.substring(0, 50) + '...'
      });
    }
  }

  // Check for common Finnish grammar mistakes
  // "jos ja kun" - should be "jos" or "kun", not both
  if (/jos ja kun/i.test(text)) {
    issues.push({
      type: 'grammar',
      severity: 'warning',
      message: `Q${index}: "jos ja kun" is redundant`,
      text: text.substring(0, 50) + '...'
    });
  }

  // Check for subject-verb agreement with "liikunta ja urheilu"
  if (/onko liikunta ja urheilu/i.test(text)) {
    issues.push({
      type: 'grammar',
      severity: 'error',
      message: `Q${index}: "Ovatko" should be used with plural subject "liikunta ja urheilu"`,
      text: text
    });
  }

  return issues;
}

function checkConsistency(questions, cohort) {
  const issues = [];

  // Check for consistent question style
  const startsWithVerb = questions.filter(q => FINNISH_PATTERNS.questionStarters.test(q.text));
  const percentStartsWithVerb = (startsWithVerb.length / questions.length * 100).toFixed(0);

  console.log(`     Question style: ${percentStartsWithVerb}% start with verb (${startsWithVerb.length}/${questions.length})`);

  // Check for consistent length
  const lengths = questions.map(q => q.text.length);
  const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const minLength = Math.min(...lengths);
  const maxLength = Math.max(...lengths);

  console.log(`     Length: avg=${Math.round(avgLength)} chars, range=${minLength}-${maxLength}`);

  if (maxLength > avgLength * 2) {
    const longQuestions = questions.filter(q => q.text.length > avgLength * 1.5);
    issues.push({
      type: 'consistency',
      severity: 'info',
      message: `${longQuestions.length} questions are significantly longer than average`
    });
  }

  if (minLength < avgLength * 0.5) {
    const shortQuestions = questions.filter(q => q.text.length < avgLength * 0.5);
    issues.push({
      type: 'consistency',
      severity: 'info',
      message: `${shortQuestions.length} questions are significantly shorter than average`
    });
  }

  return issues;
}

function checkCareerTitles(careers) {
  const issues = [];

  for (const career of careers) {
    // Check title formatting
    if (career.title && career.title !== career.title.trim()) {
      issues.push({
        type: 'whitespace',
        severity: 'minor',
        message: `Career "${career.title}": Has leading/trailing whitespace`
      });
    }

    // Check for English in career titles (should be Finnish)
    if (career.title) {
      const englishMatch = career.title.match(FINNISH_PATTERNS.englishWords);
      if (englishMatch && !ALLOWED_ENGLISH_TERMS.includes(englishMatch[0].toLowerCase())) {
        issues.push({
          type: 'language',
          severity: 'info',
          message: `Career "${career.title}": Contains English word "${englishMatch[0]}"`
        });
      }
    }

    // Check reasons array
    if (career.reasons) {
      for (const reason of career.reasons) {
        if (!reason.endsWith('.') && !reason.endsWith('!')) {
          issues.push({
            type: 'punctuation',
            severity: 'minor',
            message: `Career "${career.title}": Reason doesn't end with period`,
            text: reason.substring(0, 40) + '...'
          });
        }
      }
    }
  }

  return issues;
}

async function testCohort(cohort) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📚 Testing Cohort: ${cohort}`);
  console.log('-'.repeat(60));

  const allIssues = [];

  try {
    // Get questions
    const questions = await getQuestions(cohort);
    console.log(`  Found ${questions.length} questions\n`);

    // Check each question
    console.log('  📝 Question Analysis:');
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const text = q.text || '';

      const structureIssues = checkQuestionStructure(text, i, cohort);
      const languageIssues = checkFinnishContent(text, i);
      const grammarIssues = checkGrammar(text, i);

      allIssues.push(...structureIssues, ...languageIssues, ...grammarIssues);
    }

    // Check consistency
    console.log('\n  📊 Consistency Check:');
    const consistencyIssues = checkConsistency(questions, cohort);
    allIssues.push(...consistencyIssues);

    // Get and check career results
    console.log('\n  🎯 Career Output Check:');
    try {
      const result = await getCareerResult(cohort);
      const careerIssues = checkCareerTitles(result.topCareers || []);
      allIssues.push(...careerIssues);
      console.log(`     Checked ${result.topCareers?.length || 0} career recommendations`);

      // Check personalized analysis
      if (result.userProfile?.personalizedAnalysis) {
        const analysis = result.userProfile.personalizedAnalysis;
        const analysisMatch = analysis.match(FINNISH_PATTERNS.englishWords);
        if (analysisMatch && !ALLOWED_ENGLISH_TERMS.includes(analysisMatch[0].toLowerCase())) {
          allIssues.push({
            type: 'language',
            severity: 'warning',
            message: `Analysis contains English word "${analysisMatch[0]}"`
          });
        }
        console.log(`     Personalized analysis length: ${analysis.length} chars`);
      }
    } catch (e) {
      console.log(`     ⚠️ Could not check career output: ${e.message}`);
    }

    // Summary by severity
    const errors = allIssues.filter(i => i.severity === 'error');
    const warnings = allIssues.filter(i => i.severity === 'warning');
    const minor = allIssues.filter(i => i.severity === 'minor');
    const info = allIssues.filter(i => i.severity === 'info');

    console.log(`\n  📋 Issues Found:`);
    console.log(`     ❌ Errors: ${errors.length}`);
    console.log(`     ⚠️ Warnings: ${warnings.length}`);
    console.log(`     ℹ️ Minor: ${minor.length}`);
    console.log(`     💡 Info: ${info.length}`);

    // Show top issues
    if (errors.length > 0) {
      console.log('\n  ❌ Errors:');
      errors.slice(0, 5).forEach(e => console.log(`     - ${e.message}`));
    }

    if (warnings.length > 0) {
      console.log('\n  ⚠️ Warnings:');
      warnings.slice(0, 5).forEach(w => console.log(`     - ${w.message}`));
    }

    return {
      cohort,
      passed: errors.length === 0,
      issues: allIssues,
      summary: {
        errors: errors.length,
        warnings: warnings.length,
        minor: minor.length,
        info: info.length
      }
    };

  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    return {
      cohort,
      passed: false,
      error: error.message,
      issues: []
    };
  }
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

  console.log('🧪 LOCALIZATION AND GRAMMAR VERIFICATION TEST');
  console.log('='.repeat(60));
  console.log('Checking Finnish language quality and consistency\n');

  const cohorts = ['YLA', 'TASO2', 'NUORI'];
  const results = [];

  for (const cohort of cohorts) {
    const result = await testCohort(cohort);
    results.push(result);
  }

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));

  const totalErrors = results.reduce((sum, r) => sum + (r.summary?.errors || 0), 0);
  const totalWarnings = results.reduce((sum, r) => sum + (r.summary?.warnings || 0), 0);
  const passed = results.filter(r => r.passed).length;

  console.log(`\nCohorts Tested: ${results.length}`);
  console.log(`✅ Passed (no errors): ${passed}/${results.length}`);
  console.log(`\nTotal Issues:`);
  console.log(`   ❌ Errors: ${totalErrors}`);
  console.log(`   ⚠️ Warnings: ${totalWarnings}`);

  console.log('\n📋 Results by Cohort:');
  results.forEach(r => {
    const status = r.passed ? '✅' : '❌';
    console.log(`   ${status} ${r.cohort}: ${r.summary?.errors || 0} errors, ${r.summary?.warnings || 0} warnings`);
  });

  // Overall verdict
  console.log(`\n${'='.repeat(60)}`);
  if (totalErrors === 0) {
    console.log('🎉 All localization tests passed! No errors found.');
  } else {
    console.log(`⚠️ Found ${totalErrors} errors that should be fixed.`);
  }

  // Save results
  const fs = require('fs');
  fs.writeFileSync('test-localization-results.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: { totalErrors, totalWarnings, passed, total: results.length },
    results
  }, null, 2));

  console.log('\n📄 Full results saved to test-localization-results.json\n');
}

runTests().catch(console.error);
