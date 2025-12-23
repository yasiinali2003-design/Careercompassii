/**
 * Test 12: Personalized Analysis Quality Test
 *
 * Validates the quality of personalized analysis text:
 * 1. Analysis is generated for all cohorts
 * 2. Analysis is appropriately long (not too short/long)
 * 3. Analysis is in Finnish
 * 4. Analysis references user's strengths
 * 5. Analysis differs between different profiles
 * 6. Analysis avoids generic templates
 * 7. Analysis is appropriate for cohort age group
 * 8. Strengths list is meaningful
 *
 * Ensures the personalized feedback is high quality.
 */

const BASE_URL = 'http://localhost:3000';

const COHORTS = ['YLA', 'TASO2', 'NUORI'];

// Minimum/maximum expected lengths
const ANALYSIS_LENGTH = {
  min: 200,
  max: 3000,
  ideal: { min: 400, max: 1500 }
};

// Words that indicate generic templates (should be rare)
const GENERIC_INDICATORS = [
  'lorem ipsum',
  'placeholder',
  '[NAME]',
  '[CAREER]',
  'TODO',
  'FIXME'
];

// Finnish words that should appear in quality analysis
const QUALITY_INDICATORS = {
  personalWords: ['sinun', 'sinulle', 'sinulla', 'sinä', 'sinulla on'],
  strengthWords: ['vahvuus', 'vahvuutesi', 'osaat', 'pystyt', 'taito'],
  futureWords: ['tulevaisuus', 'mahdollisuus', 'potentiaali', 'kehittyä'],
  encouragingWords: ['erinomainen', 'hieno', 'loistava', 'hyvä', 'arvokas']
};

// Age-appropriate vocabulary
const AGE_VOCABULARY = {
  YLA: ['yläkoulu', 'koulu', 'harrastus', 'kaveri', 'opiskelu'],
  TASO2: ['ammatti', 'työ', 'ala', 'koulutus', 'opinnot'],
  NUORI: ['ura', 'työelämä', 'ammatti', 'kokemus', 'kehittyminen']
};

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

// Test 1: Analysis exists and has proper length
function testAnalysisLength(analysis, cohort) {
  console.log('\n  📏 Checking analysis length...');

  const length = analysis?.length || 0;

  console.log(`     Length: ${length} characters`);

  const issues = [];

  if (length < ANALYSIS_LENGTH.min) {
    issues.push(`Too short (${length} < ${ANALYSIS_LENGTH.min})`);
  }

  if (length > ANALYSIS_LENGTH.max) {
    issues.push(`Too long (${length} > ${ANALYSIS_LENGTH.max})`);
  }

  const isIdeal = length >= ANALYSIS_LENGTH.ideal.min && length <= ANALYSIS_LENGTH.ideal.max;

  if (isIdeal) {
    console.log(`     ✓ Ideal length range`);
  } else if (issues.length === 0) {
    console.log(`     ⚠️ Acceptable but not ideal length`);
  } else {
    console.log(`     ✗ Length issues: ${issues.join(', ')}`);
  }

  return {
    passed: issues.length === 0,
    length,
    isIdeal,
    issues
  };
}

// Test 2: Analysis is in Finnish
function testFinnishLanguage(analysis) {
  console.log('\n  🇫🇮 Checking Finnish language...');

  const text = analysis.toLowerCase();

  // Check for Finnish characters
  const hasFinnishChars = /[äöå]/.test(text);

  // Check for common Finnish word endings
  const finnishEndings = /(?:ssa|ssä|sta|stä|lle|lta|ltä|lla|llä|seen|aan|ään|ksi|nen|inen)/;
  const hasFinnishEndings = finnishEndings.test(text);

  // Check for English words that shouldn't appear
  const englishWords = ['the ', ' and ', ' or ', ' you ', ' your ', ' with '];
  const hasEnglish = englishWords.some(w => text.includes(w));

  console.log(`     Finnish characters: ${hasFinnishChars ? '✓' : '✗'}`);
  console.log(`     Finnish word patterns: ${hasFinnishEndings ? '✓' : '✗'}`);
  console.log(`     No English text: ${!hasEnglish ? '✓' : '✗'}`);

  const passed = hasFinnishChars && hasFinnishEndings && !hasEnglish;

  return {
    passed,
    hasFinnishChars,
    hasFinnishEndings,
    hasEnglish
  };
}

// Test 3: Analysis contains personalization
function testPersonalization(analysis) {
  console.log('\n  👤 Checking personalization...');

  const text = analysis.toLowerCase();
  const found = {};

  for (const [category, words] of Object.entries(QUALITY_INDICATORS)) {
    found[category] = words.filter(w => text.includes(w));
  }

  console.log(`     Personal references: ${found.personalWords.length > 0 ? '✓' : '✗'} (${found.personalWords.join(', ') || 'none'})`);
  console.log(`     Strength mentions: ${found.strengthWords.length > 0 ? '✓' : '✗'} (${found.strengthWords.join(', ') || 'none'})`);
  console.log(`     Future orientation: ${found.futureWords.length > 0 ? '✓' : '✗'} (${found.futureWords.join(', ') || 'none'})`);
  console.log(`     Encouragement: ${found.encouragingWords.length > 0 ? '✓' : '✗'} (${found.encouragingWords.join(', ') || 'none'})`);

  const passed = found.personalWords.length > 0 && found.strengthWords.length > 0;

  return {
    passed,
    found,
    personalizationScore: Object.values(found).flat().length
  };
}

// Test 4: Analysis avoids generic templates
function testNotGeneric(analysis) {
  console.log('\n  🎯 Checking for generic content...');

  const text = analysis.toLowerCase();

  const foundGeneric = GENERIC_INDICATORS.filter(g => text.includes(g.toLowerCase()));

  if (foundGeneric.length === 0) {
    console.log(`     ✓ No generic template markers found`);
  } else {
    console.log(`     ✗ Found generic markers: ${foundGeneric.join(', ')}`);
  }

  return {
    passed: foundGeneric.length === 0,
    foundGeneric
  };
}

// Test 5: Analysis differs between profiles
async function testAnalysisDiversity(cohort) {
  console.log('\n  🔄 Checking analysis diversity...');

  const patterns = ['creative', 'analytical', 'social', 'balanced'];
  const analyses = [];

  for (const pattern of patterns) {
    const answers = generateAnswers(pattern);
    const result = await submitTest(cohort, answers);
    analyses.push({
      pattern,
      analysis: result.userProfile?.personalizedAnalysis || ''
    });
  }

  // Check how different the analyses are
  const uniqueAnalyses = new Set(analyses.map(a => a.analysis)).size;

  // Simple similarity check - count shared sentences
  const similarities = [];
  for (let i = 0; i < analyses.length; i++) {
    for (let j = i + 1; j < analyses.length; j++) {
      const sentences1 = analyses[i].analysis.split(/[.!?]/).filter(s => s.trim().length > 10);
      const sentences2 = analyses[j].analysis.split(/[.!?]/).filter(s => s.trim().length > 10);

      let shared = 0;
      for (const s1 of sentences1) {
        if (sentences2.some(s2 => s2.trim() === s1.trim())) {
          shared++;
        }
      }

      const similarity = sentences1.length > 0 ? shared / sentences1.length : 0;
      similarities.push({
        pair: `${analyses[i].pattern} vs ${analyses[j].pattern}`,
        similarity: (similarity * 100).toFixed(0) + '%'
      });
    }
  }

  console.log(`     Unique analyses: ${uniqueAnalyses}/${patterns.length}`);

  // Show sentence overlap
  const avgSimilarity = similarities.reduce((sum, s) => sum + parseFloat(s.similarity), 0) / similarities.length;
  console.log(`     Average sentence overlap: ${avgSimilarity.toFixed(0)}%`);

  const passed = uniqueAnalyses >= 3 || avgSimilarity < 50;

  if (passed) {
    console.log(`     ✓ Analyses show meaningful variation`);
  } else {
    console.log(`     ⚠️ Analyses may be too similar`);
  }

  return {
    passed,
    uniqueAnalyses,
    avgSimilarity,
    similarities
  };
}

// Test 6: Age-appropriate vocabulary
function testAgeAppropriate(analysis, cohort) {
  console.log('\n  🎂 Checking age-appropriate language...');

  const text = analysis.toLowerCase();
  const expectedWords = AGE_VOCABULARY[cohort] || [];

  const foundWords = expectedWords.filter(w => text.includes(w));
  const percentage = (foundWords.length / expectedWords.length * 100).toFixed(0);

  console.log(`     Age-appropriate terms found: ${foundWords.length}/${expectedWords.length} (${percentage}%)`);

  if (foundWords.length > 0) {
    console.log(`     Found: ${foundWords.join(', ')}`);
  }

  const passed = foundWords.length > 0;

  return {
    passed,
    foundWords,
    percentage
  };
}

// Test 7: Strengths quality
function testStrengthsQuality(strengths) {
  console.log('\n  💪 Checking strengths quality...');

  const issues = [];

  if (!strengths || !Array.isArray(strengths)) {
    console.log(`     ✗ Strengths missing or invalid`);
    return { passed: false, issues: ['Missing strengths'] };
  }

  if (strengths.length < 3) {
    issues.push(`Too few strengths (${strengths.length})`);
  }

  // Check each strength
  for (let i = 0; i < strengths.length; i++) {
    const s = strengths[i];
    if (!s || s.trim().length < 5) {
      issues.push(`Strength ${i + 1} too short`);
    }
    if (s && s.length > 100) {
      issues.push(`Strength ${i + 1} too long`);
    }
  }

  // Check for duplicates
  const uniqueStrengths = new Set(strengths.map(s => s?.toLowerCase().trim()));
  if (uniqueStrengths.size < strengths.length) {
    issues.push('Contains duplicate strengths');
  }

  console.log(`     Strengths count: ${strengths.length}`);
  console.log(`     Unique: ${uniqueStrengths.size}`);
  console.log(`     Sample: "${strengths[0]?.substring(0, 50)}..."`);

  if (issues.length === 0) {
    console.log(`     ✓ Strengths quality is good`);
  } else {
    console.log(`     ⚠️ Issues: ${issues.join(', ')}`);
  }

  return {
    passed: issues.length === 0,
    count: strengths.length,
    unique: uniqueStrengths.size,
    issues
  };
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

  console.log('🧪 PERSONALIZED ANALYSIS QUALITY TEST');
  console.log('='.repeat(60));
  console.log('Validating personalized analysis and feedback quality\n');

  const results = {};

  for (const cohort of COHORTS) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📚 Testing Cohort: ${cohort}`);
    console.log('-'.repeat(60));

    // Get a sample analysis
    const answers = generateAnswers('random');
    const result = await submitTest(cohort, answers);

    const analysis = result.userProfile?.personalizedAnalysis || '';
    const strengths = result.userProfile?.topStrengths || [];

    console.log(`  Sample analysis preview:`);
    console.log(`     "${analysis.substring(0, 100)}..."`);

    // Run all tests
    const cohortResults = {
      length: testAnalysisLength(analysis, cohort),
      finnish: testFinnishLanguage(analysis),
      personalization: testPersonalization(analysis),
      notGeneric: testNotGeneric(analysis),
      diversity: await testAnalysisDiversity(cohort),
      ageAppropriate: testAgeAppropriate(analysis, cohort),
      strengthsQuality: testStrengthsQuality(strengths)
    };

    results[cohort] = cohortResults;

    // Cohort summary
    const passedTests = Object.values(cohortResults).filter(t => t.passed).length;
    const totalTests = Object.keys(cohortResults).length;

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
    const tests = Object.entries(results[cohort]);
    const passed = tests.filter(([, v]) => v.passed).length;
    totalTests += tests.length;
    passedTests += passed;

    console.log(`\n   ${cohort}:`);
    tests.forEach(([name, result]) => {
      const status = result.passed ? '✅' : '❌';
      console.log(`      ${status} ${name}`);
    });
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Total: ${passedTests}/${totalTests} tests passed`);

  if (passedTests === totalTests) {
    console.log('🎉 All analysis quality tests passed!');
  } else if (passedTests >= totalTests * 0.8) {
    console.log('✅ Analysis quality is good with minor issues');
  } else {
    console.log(`⚠️ ${totalTests - passedTests} tests need attention`);
  }

  // Save results
  const fs = require('fs');
  fs.writeFileSync('test-analysis-quality-results.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: { totalTests, passedTests },
    results
  }, null, 2));

  console.log('\n📄 Full results saved to test-analysis-quality-results.json\n');
}

runTests().catch(console.error);
