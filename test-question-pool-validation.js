/**
 * Test 3: Question Pool Validation Test
 *
 * Validates that:
 * 1. Each cohort has exactly 30 questions
 * 2. No duplicate questions within a cohort
 * 3. Questions are appropriate for the age group
 * 4. All questions have required fields (text, dimension, subdimension)
 * 5. TASO2 sub-cohorts (LUKIO/AMIS) work correctly if implemented
 * 6. Questions are in Finnish and grammatically correct
 */

const BASE_URL = 'http://localhost:3000';

const COHORTS = ['YLA', 'TASO2', 'NUORI'];
const EXPECTED_QUESTION_COUNT = 30;

// Age-appropriate language indicators
const YLA_INDICATORS = ['sinua', 'kivaa', 'tykkäätkö', 'kaverit'];
const TASO2_INDICATORS = ['työskennellä', 'ala', 'ammatti'];
const NUORI_INDICATORS = ['ura', 'palkka', 'johtaminen', 'strategia'];

async function getQuestions(cohort, subCohort = null) {
  let url = `${BASE_URL}/api/questions?cohort=${cohort}&setIndex=0`;
  if (subCohort) {
    url += `&subCohort=${subCohort}`;
  }
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to get questions for ${cohort}${subCohort ? '/' + subCohort : ''}`);
  const data = await response.json();
  return data.questions || data;
}

function checkDuplicates(questions) {
  const texts = questions.map(q => q.text.toLowerCase().trim());
  const duplicates = [];

  for (let i = 0; i < texts.length; i++) {
    for (let j = i + 1; j < texts.length; j++) {
      // Check for exact duplicates
      if (texts[i] === texts[j]) {
        duplicates.push({
          type: 'exact',
          q1: i,
          q2: j,
          text: questions[i].text
        });
      }
      // Check for very similar questions (>80% overlap)
      else if (calculateSimilarity(texts[i], texts[j]) > 0.8) {
        duplicates.push({
          type: 'similar',
          q1: i,
          q2: j,
          text1: questions[i].text,
          text2: questions[j].text,
          similarity: calculateSimilarity(texts[i], texts[j])
        });
      }
    }
  }
  return duplicates;
}

function calculateSimilarity(str1, str2) {
  const words1 = str1.split(/\s+/);
  const words2 = str2.split(/\s+/);
  const set1 = new Set(words1);
  const set2 = new Set(words2);

  const intersection = [...set1].filter(x => set2.has(x));
  const union = new Set([...set1, ...set2]);

  return intersection.length / union.size;
}

function validateQuestionStructure(questions) {
  const issues = [];

  questions.forEach((q, i) => {
    if (!q.text || q.text.trim() === '') {
      issues.push(`Q${i}: Missing or empty text`);
    }
    if (q.text && q.text.length < 10) {
      issues.push(`Q${i}: Text too short (${q.text.length} chars)`);
    }
    if (q.text && q.text.length > 200) {
      issues.push(`Q${i}: Text too long (${q.text.length} chars)`);
    }
    if (q.text && !q.text.endsWith('?')) {
      issues.push(`Q${i}: Question doesn't end with "?" - "${q.text}"`);
    }
  });

  return issues;
}

function checkAgeAppropriateLanguage(questions, cohort) {
  const texts = questions.map(q => q.text.toLowerCase()).join(' ');
  const results = { appropriate: [], missing: [] };

  let indicators;
  switch (cohort) {
    case 'YLA':
      indicators = YLA_INDICATORS;
      break;
    case 'TASO2':
      indicators = TASO2_INDICATORS;
      break;
    case 'NUORI':
      indicators = NUORI_INDICATORS;
      break;
    default:
      indicators = [];
  }

  indicators.forEach(word => {
    if (texts.includes(word)) {
      results.appropriate.push(word);
    } else {
      results.missing.push(word);
    }
  });

  return results;
}

function checkFinnishGrammar(questions) {
  const issues = [];

  questions.forEach((q, i) => {
    const text = q.text;

    // Check for common Finnish grammar issues
    // 1. Comma before "joka" or "jossa" (relative clauses)
    if (/\w\s+(joka|jossa|jonka|jolle)\s/i.test(text)) {
      if (!/,\s+(joka|jossa|jonka|jolle)\s/i.test(text)) {
        issues.push(`Q${i}: Missing comma before relative clause - "${text}"`);
      }
    }

    // 2. Check for proper question structure in Finnish
    if (!/^(onko|ovatko|oletko|haluaisitko|haluatko|tykkäätkö|pidätkö|kiinnostaako|nautitko|viihdytkö|sopiiko|pystytkö|uskaltaisitko|stressaannutko|turhauttavatko|ärsyttääkö|väsyttääkö|stressaako|aloitatko|keksitkö)/i.test(text)) {
      // This is OK - not all questions need to start with these words
    }

    // 3. Check for mixed Finnish/English
    const englishWords = ['the', 'and', 'or', 'you', 'with', 'for', 'your'];
    englishWords.forEach(eng => {
      if (new RegExp(`\\b${eng}\\b`, 'i').test(text)) {
        issues.push(`Q${i}: Contains English word "${eng}" - "${text}"`);
      }
    });
  });

  return issues;
}

async function testCohort(cohort) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📚 Testing Cohort: ${cohort}`);
  console.log('-'.repeat(60));

  const results = {
    cohort,
    passed: true,
    issues: []
  };

  try {
    const questions = await getQuestions(cohort);

    // Test 1: Question count
    console.log(`\n  📊 Question Count: ${questions.length}`);
    if (questions.length !== EXPECTED_QUESTION_COUNT) {
      results.issues.push(`Expected ${EXPECTED_QUESTION_COUNT} questions, got ${questions.length}`);
      results.passed = false;
    } else {
      console.log(`     ✓ Correct (expected ${EXPECTED_QUESTION_COUNT})`);
    }

    // Test 2: Check for duplicates
    const duplicates = checkDuplicates(questions);
    console.log(`\n  🔍 Duplicate Check:`);
    if (duplicates.length > 0) {
      console.log(`     ✗ Found ${duplicates.length} duplicate/similar questions`);
      duplicates.forEach(d => {
        if (d.type === 'exact') {
          console.log(`       - Q${d.q1} = Q${d.q2}: "${d.text}"`);
        } else {
          console.log(`       - Q${d.q1} ~ Q${d.q2} (${(d.similarity * 100).toFixed(0)}% similar)`);
        }
        results.issues.push(`Duplicate: Q${d.q1} and Q${d.q2}`);
      });
      results.passed = false;
    } else {
      console.log(`     ✓ No duplicates found`);
    }

    // Test 3: Question structure validation
    const structureIssues = validateQuestionStructure(questions);
    console.log(`\n  📝 Structure Validation:`);
    if (structureIssues.length > 0) {
      console.log(`     ✗ Found ${structureIssues.length} structure issues`);
      structureIssues.slice(0, 5).forEach(issue => {
        console.log(`       - ${issue}`);
      });
      if (structureIssues.length > 5) {
        console.log(`       ... and ${structureIssues.length - 5} more`);
      }
      results.issues.push(...structureIssues);
      results.passed = false;
    } else {
      console.log(`     ✓ All questions have valid structure`);
    }

    // Test 4: Age-appropriate language
    const ageCheck = checkAgeAppropriateLanguage(questions, cohort);
    console.log(`\n  🎯 Age-Appropriate Language:`);
    console.log(`     Found: ${ageCheck.appropriate.join(', ') || 'none'}`);
    if (ageCheck.missing.length > 0) {
      console.log(`     ⚠️ Consider adding: ${ageCheck.missing.join(', ')}`);
    } else {
      console.log(`     ✓ All expected terms present`);
    }

    // Test 5: Finnish grammar check
    const grammarIssues = checkFinnishGrammar(questions);
    console.log(`\n  🔤 Finnish Grammar:`);
    if (grammarIssues.length > 0) {
      console.log(`     ⚠️ Found ${grammarIssues.length} potential grammar issues`);
      grammarIssues.slice(0, 3).forEach(issue => {
        console.log(`       - ${issue}`);
      });
      // Grammar issues are warnings, not failures
    } else {
      console.log(`     ✓ No obvious grammar issues`);
    }

    // Display sample questions
    console.log(`\n  📋 Sample Questions:`);
    [0, 14, 29].forEach(i => {
      if (questions[i]) {
        console.log(`     Q${i}: "${questions[i].text}"`);
      }
    });

  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    results.issues.push(error.message);
    results.passed = false;
  }

  return results;
}

async function testSubCohorts() {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📚 Testing TASO2 Sub-Cohorts (LUKIO/AMIS)`);
  console.log('-'.repeat(60));

  const results = { passed: true, issues: [] };

  try {
    // Try to get questions for LUKIO and AMIS sub-cohorts
    let lukioQuestions, amisQuestions;

    try {
      lukioQuestions = await getQuestions('TASO2', 'LUKIO');
      console.log(`\n  📚 TASO2_LUKIO: ${lukioQuestions.length} questions`);
    } catch (e) {
      console.log(`\n  ⚠️ TASO2_LUKIO: Not implemented or error - ${e.message}`);
      lukioQuestions = null;
    }

    try {
      amisQuestions = await getQuestions('TASO2', 'AMIS');
      console.log(`  📚 TASO2_AMIS: ${amisQuestions.length} questions`);
    } catch (e) {
      console.log(`  ⚠️ TASO2_AMIS: Not implemented or error - ${e.message}`);
      amisQuestions = null;
    }

    if (lukioQuestions && amisQuestions) {
      // Check if they're different
      const lukioTexts = new Set(lukioQuestions.map(q => q.text));
      const amisTexts = new Set(amisQuestions.map(q => q.text));

      const overlap = [...lukioTexts].filter(t => amisTexts.has(t));
      const uniqueToLukio = [...lukioTexts].filter(t => !amisTexts.has(t));
      const uniqueToAmis = [...amisTexts].filter(t => !lukioTexts.has(t));

      console.log(`\n  🔄 Question Overlap Analysis:`);
      console.log(`     Shared questions: ${overlap.length}`);
      console.log(`     Unique to LUKIO: ${uniqueToLukio.length}`);
      console.log(`     Unique to AMIS: ${uniqueToAmis.length}`);

      if (overlap.length === lukioQuestions.length) {
        console.log(`\n  ⚠️ LUKIO and AMIS have identical questions`);
        results.issues.push('LUKIO and AMIS have identical questions');
      } else {
        console.log(`\n  ✓ LUKIO and AMIS have different question sets`);
      }
    } else {
      console.log(`\n  ℹ️ Sub-cohort feature not fully implemented`);
    }

  } catch (error) {
    console.log(`  ❌ Error testing sub-cohorts: ${error.message}`);
    results.issues.push(error.message);
  }

  return results;
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

  console.log('🧪 QUESTION POOL VALIDATION TEST');
  console.log('='.repeat(60));
  console.log('Validating question pools for all cohorts\n');

  const results = [];

  // Test each cohort
  for (const cohort of COHORTS) {
    const result = await testCohort(cohort);
    results.push(result);
  }

  // Test sub-cohorts
  const subCohortResult = await testSubCohorts();
  results.push({ cohort: 'TASO2_SUBCOHORTS', ...subCohortResult });

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const totalIssues = results.reduce((sum, r) => sum + (r.issues?.length || 0), 0);

  console.log(`\nTotal Cohorts Tested: ${results.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️ Total Issues: ${totalIssues}`);

  console.log('\n📋 Results by Cohort:');
  results.forEach(r => {
    const status = r.passed ? '✅' : '❌';
    const issueCount = r.issues?.length || 0;
    console.log(`   ${status} ${r.cohort}: ${issueCount} issues`);
  });

  // Save results
  const fs = require('fs');
  fs.writeFileSync('test-question-pool-results.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: { total: results.length, passed, failed, totalIssues },
    results
  }, null, 2));

  console.log('\n📄 Full results saved to test-question-pool-results.json\n');
}

runTests().catch(console.error);
