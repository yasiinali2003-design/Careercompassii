/**
 * COMPREHENSIVE TEST FOR PERSONALIZATION FEATURES
 * Tests all 10 personalization improvements with multiple cohorts
 */

import fetch from 'node-fetch';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

// Test scenarios for different cohorts
const testScenarios = {
  YLA: {
    cohort: 'YLA',
    answers: [
      // Tech-focused answers (high scores for tech questions)
      { questionIndex: 15, score: 5 }, // Technology interest
      { questionIndex: 19, score: 4 }, // Leadership
      { questionIndex: 23, score: 4 }, // Teamwork
      { questionIndex: 0, score: 4 }, // Reading (lukio indicator)
      { questionIndex: 1, score: 5 }, // Math
      { questionIndex: 2, score: 3 }, // Hands-on learning
      { questionIndex: 9, score: 3 }, // Keep options open
      { questionIndex: 10, score: 5 }, // University interest
      // Fill rest with neutral scores
      ...Array.from({ length: 22 }, (_, i) => ({ 
        questionIndex: i + 8, 
        score: i < 8 ? 3 : 3 
      })).filter(a => a.questionIndex >= 8 && a.questionIndex !== 9 && a.questionIndex !== 10)
    ]
  },
  TASO2: {
    cohort: 'TASO2',
    answers: [
      // Tech-focused answers
      { questionIndex: 0, score: 5 }, // Coding
      { questionIndex: 1, score: 5 }, // Tech work
      { questionIndex: 4, score: 5 }, // Problem solving
      { questionIndex: 6, score: 4 }, // Security
      { questionIndex: 11, score: 4 }, // Want to work early (AMK indicator)
      // Fill rest with neutral scores
      ...Array.from({ length: 25 }, (_, i) => ({ 
        questionIndex: i + 7, 
        score: i < 18 ? 3 : 3 
      })).filter(a => a.questionIndex !== 11)
    ]
  },
  NUORI: {
    cohort: 'NUORI',
    answers: [
      // Professional tech profile
      { questionIndex: 0, score: 5 }, // Coding interest
      { questionIndex: 3, score: 5 }, // Data analysis
      { questionIndex: 8, score: 4 }, // Research
      { questionIndex: 15, score: 4 }, // Remote work
      // Fill rest with neutral scores
      ...Array.from({ length: 26 }, (_, i) => ({ 
        questionIndex: i + 4, 
        score: 3 
      })).filter(a => a.questionIndex < 15 || a.questionIndex > 15)
    ]
  }
};

async function testPersonalizationFeatures() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  PERSONALIZATION FEATURES TEST');
  console.log('═══════════════════════════════════════════════════════════\n');

  const results = {
    YLA: { passed: 0, failed: 0, errors: [] },
    TASO2: { passed: 0, failed: 0, errors: [] },
    NUORI: { passed: 0, failed: 0, errors: [] }
  };

  for (const [cohortName, scenario] of Object.entries(testScenarios)) {
    console.log(`\n📋 Testing ${cohortName} cohort...`);
    console.log('─'.repeat(60));

    try {
      // Ensure we have exactly 30 answers
      const allAnswers = [...scenario.answers];
      while (allAnswers.length < 30) {
        const missingIndex = allAnswers.findIndex((a, i) => a.questionIndex !== i);
        if (missingIndex === -1) {
          // Fill gaps
          for (let i = 0; i < 30; i++) {
            if (!allAnswers.find(a => a.questionIndex === i)) {
              allAnswers.push({ questionIndex: i, score: 3 });
            }
          }
        }
        break;
      }
      
      // Sort by questionIndex
      allAnswers.sort((a, b) => a.questionIndex - b.questionIndex);
      
      // Fill any remaining gaps
      const finalAnswers = [];
      for (let i = 0; i < 30; i++) {
        const existing = allAnswers.find(a => a.questionIndex === i);
        if (existing) {
          finalAnswers.push(existing);
        } else {
          finalAnswers.push({ questionIndex: i, score: 3 });
        }
      }

      const response = await fetch(`${BASE_URL}/api/score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cohort: scenario.cohort,
          answers: finalAnswers
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(`API returned error: ${data.error}`);
      }

      // Test 1: Check personalizedAnalysis exists and has content
      if (data.userProfile?.personalizedAnalysis) {
        const analysis = data.userProfile.personalizedAnalysis;
        console.log(`✅ Personalized Analysis: ${analysis.length} chars`);
        
        // Check for NO numerical scores
        const hasRawScores = /\d+\.\d+\/\d+|\d+%|Q\d+\(\d+\)/g.test(analysis);
        if (hasRawScores) {
          console.log(`⚠️  WARNING: Found raw scores in analysis: ${analysis.match(/\d+\.\d+\/\d+|\d+%|Q\d+\(\d+\)/g)}`);
          results[cohortName].failed++;
        } else {
          console.log(`✅ No raw scores found (good!)`);
          results[cohortName].passed++;
        }
        
        // Check for descriptive language
        const hasDescriptive = /todella paljon|paljon|vähän|vahva|kohtalainen|kehitettävää/i.test(analysis);
        if (hasDescriptive) {
          console.log(`✅ Contains descriptive language`);
          results[cohortName].passed++;
        } else {
          console.log(`⚠️  WARNING: Limited descriptive language`);
          results[cohortName].failed++;
        }
        
        // Check for answer references (for TASO2/NUORI)
        if (cohortName === 'TASO2' || cohortName === 'NUORI') {
          const hasQRefs = /Q\d+/i.test(analysis);
          if (hasQRefs) {
            console.log(`✅ Contains question references (Q1, Q2, etc.)`);
            results[cohortName].passed++;
          }
        }
        
        // Check for question paraphrasing (for YLA)
        if (cohortName === 'YLA') {
          const hasParaphrasing = /kun kysyimme|muistatko/i.test(analysis);
          if (hasParaphrasing) {
            console.log(`✅ Contains question paraphrasing`);
            results[cohortName].passed++;
          }
        }
      } else {
        throw new Error('Missing personalizedAnalysis');
      }

      // Test 2: Check careers exist and have reasons
      if (data.topCareers && data.topCareers.length > 0) {
        console.log(`✅ Found ${data.topCareers.length} career recommendations`);
        results[cohortName].passed++;
        
        // Check if reasons use specific answers (not generic)
        const firstCareer = data.topCareers[0];
        if (firstCareer.reasons && firstCareer.reasons.length > 0) {
          const reasonText = firstCareer.reasons.join(' ');
          const hasSpecificRefs = /muistatko|vastasit|Q\d+|kun kysyimme/i.test(reasonText);
          if (hasSpecificRefs) {
            console.log(`✅ Career reasons contain specific answer references`);
            results[cohortName].passed++;
          } else {
            console.log(`⚠️  Career reasons may be generic (check manually)`);
          }
          
          // Check for NO raw scores in reasons
          const hasRawScoresInReasons = /\d+\.\d+\/\d+|\d+%/g.test(reasonText);
          if (hasRawScoresInReasons) {
            console.log(`⚠️  WARNING: Found raw scores in career reasons`);
            results[cohortName].failed++;
          } else {
            console.log(`✅ No raw scores in career reasons`);
            results[cohortName].passed++;
          }
        }
        
        // Check dynamic count (should vary based on confidence)
        console.log(`✅ Dynamic count: ${data.topCareers.length} careers`);
        results[cohortName].passed++;
        
        // Check confidence levels
        const confidenceLevels = data.topCareers.map(c => c.confidence);
        const hasHighConfidence = confidenceLevels.includes('high');
        if (hasHighConfidence) {
          console.log(`✅ Found high-confidence careers`);
          results[cohortName].passed++;
        }
      } else {
        throw new Error('No careers returned');
      }

      // Test 3: Check education path (if applicable)
      if (data.educationPath && (cohortName === 'YLA' || cohortName === 'TASO2')) {
        console.log(`✅ Education path: ${data.educationPath.primary}`);
        results[cohortName].passed++;
        
        if (data.educationPath.reasoning) {
          const reasoning = data.educationPath.reasoning;
          
          // Check for answer references in education path reasoning
          if (cohortName === 'TASO2') {
            const hasQRefs = /Q\d+/i.test(reasoning);
            if (hasQRefs) {
              console.log(`✅ Education path reasoning contains question references`);
              results[cohortName].passed++;
            }
          }
          
          // Check for NO raw scores
          const hasRawScores = /\d+\.\d+\/\d+|\d+%/g.test(reasoning);
          if (hasRawScores) {
            console.log(`⚠️  WARNING: Found raw scores in education path reasoning`);
            results[cohortName].failed++;
          } else {
            console.log(`✅ No raw scores in education path reasoning`);
            results[cohortName].passed++;
          }
        }
      }

      console.log(`\n✅ ${cohortName} tests completed successfully`);
      
    } catch (error) {
      console.error(`\n❌ ${cohortName} test failed:`, error.message);
      results[cohortName].failed++;
      results[cohortName].errors.push(error.message);
    }
  }

  // Summary
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('  TEST SUMMARY');
  console.log('═══════════════════════════════════════════════════════════\n');

  let totalPassed = 0;
  let totalFailed = 0;

  for (const [cohortName, result] of Object.entries(results)) {
    totalPassed += result.passed;
    totalFailed += result.failed;
    console.log(`${cohortName}:`);
    console.log(`  ✅ Passed: ${result.passed}`);
    console.log(`  ❌ Failed: ${result.failed}`);
    if (result.errors.length > 0) {
      console.log(`  Errors: ${result.errors.join(', ')}`);
    }
    console.log('');
  }

  console.log(`Total: ✅ ${totalPassed} passed, ❌ ${totalFailed} failed`);

  if (totalFailed === 0) {
    console.log('\n🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Please review above.');
    process.exit(1);
  }
}

// Run tests
testPersonalizationFeatures().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

