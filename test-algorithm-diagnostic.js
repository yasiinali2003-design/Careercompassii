/**
 * PHASE 7: Algorithm Diagnostic Tool
 *
 * This script tests a single user profile and shows DETAILED reasoning
 * for each career recommendation to identify algorithm calibration issues.
 */

const API_URL = 'http://localhost:3000/api/score';

// Helper function to generate answer pattern
function generateAnswers(scores) {
  return scores.map((score, index) => ({ questionIndex: index, score }));
}

// Test Profile: Tech-interested YLA student
// Based on actual YLA question structure:
// Q0-7: Learning preferences (analytical/hands-on)
// Q8-14: Future mindset
// Q15-22: Interest areas (Q15=tech, Q16=health, Q17=creative, Q18=environment, Q19=leadership, Q20=building)
// Q23-29: Values and work preferences
const TEST_PROFILE = {
  id: "diagnostic-tech-student",
  name: "Tech-Interested YLA Student",
  cohort: "YLA",
  description: "Strong technology interest (Q15), weak health/people (Q16), neutral creative",
  answers: generateAnswers([
    // Q0-7: Learning preferences - moderate analytical (lukio-oriented but not extreme)
    3, 4, 3, 3, 3, 2, 3, 2,  // Moderate reading/math, some hands-on
    // Q8-14: Future mindset - some career clarity
    4, 3, 3, 3, 4, 3, 3,      // Some idea of future, moderate entrepreneurship
    // Q15-22: Interest areas - THIS IS CRITICAL
    5,  // Q15: Technology - STRONGLY INTERESTED ✅
    1,  // Q16: Health/caring - NOT INTERESTED ❌
    2,  // Q17: Creative - LOW INTEREST
    2,  // Q18: Environment - LOW INTEREST
    3,  // Q19: Leadership - NEUTRAL
    3,  // Q20: Building/fixing - NEUTRAL
    4,  // Q21: Unknown (need to check)
    4,  // Q22: Unknown (need to check)
    // Q23-29: Values/work preferences
    3, 3, 3, 3, 4, 3, 3       // Moderate values
  ]),
  expectedCategory: "innovoija",
  expectedCareers: [
    "Full Stack -kehittäjä",
    "DevOps-insinööri",
    "Pilvipalveluarkkitehti",
    "Koneoppimisasiantuntija",
    "Mobiilisovelluskehittäjä"
  ]
};

async function runDiagnostic() {
  console.log('════════════════════════════════════════════════════════════════');
  console.log('🔍 PHASE 7: ALGORITHM DIAGNOSTIC TEST');
  console.log('════════════════════════════════════════════════════════════════\n');

  console.log(`Testing Profile: ${TEST_PROFILE.name}`);
  console.log(`Cohort: ${TEST_PROFILE.cohort}`);
  console.log(`Description: ${TEST_PROFILE.description}`);
  console.log(`Expected Category: ${TEST_PROFILE.expectedCategory}`);
  console.log(`Expected Careers: ${TEST_PROFILE.expectedCareers.join(', ')}\n`);

  console.log('────────────────────────────────────────────────────────────────\n');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answers: TEST_PROFILE.answers,
        cohort: TEST_PROFILE.cohort
      })
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const data = await response.json();

    console.log('✅ API Response Successful\n');

    // Display user scores
    console.log('📊 USER DIMENSION SCORES:');
    console.log('─'.repeat(60));
    console.log(`Interests: ${data.userProfile.dimensionScores.interests}%`);
    console.log(`Values: ${data.userProfile.dimensionScores.values}%`);
    console.log(`Workstyle: ${data.userProfile.dimensionScores.workstyle}%`);
    console.log(`Context: ${data.userProfile.dimensionScores.context}%`);
    console.log(`\nTop Strengths: ${data.userProfile.topStrengths.join(', ')}\n`);

    console.log('─'.repeat(60));
    console.log('🎯 TOP 5 CAREER RECOMMENDATIONS:\n');

    data.topCareers.forEach((career, index) => {
      const isExpected = TEST_PROFILE.expectedCareers.includes(career.title);
      const marker = isExpected ? '✅' : '❌';

      console.log(`${marker} ${index + 1}. ${career.title} (${career.score}%)`);
      console.log(`   Category: ${career.category}`);
      console.log(`   Dimension Scores:`);
      console.log(`     - Interests: ${career.dimensionScores.interests}%`);
      console.log(`     - Values: ${career.dimensionScores.values}%`);
      console.log(`     - Workstyle: ${career.dimensionScores.workstyle}%`);
      console.log(`     - Context: ${career.dimensionScores.context}%`);
      console.log(`   Match Quality: ${isExpected ? 'GOOD MATCH ✅' : 'MISMATCH ❌'}\n`);
    });

    console.log('─'.repeat(60));
    console.log('📈 MATCH ANALYSIS:\n');

    const matchCount = data.topCareers.filter(c =>
      TEST_PROFILE.expectedCareers.includes(c.title)
    ).length;

    const categories = {};
    data.topCareers.forEach(c => {
      categories[c.category] = (categories[c.category] || 0) + 1;
    });

    console.log(`Matches Found: ${matchCount}/${TEST_PROFILE.expectedCareers.length}`);
    console.log(`Match Rate: ${(matchCount / TEST_PROFILE.expectedCareers.length * 100).toFixed(1)}%\n`);

    console.log(`Categories in Top 5:`);
    Object.entries(categories).forEach(([cat, count]) => {
      const marker = cat === TEST_PROFILE.expectedCategory ? '✅' : '⚠️';
      console.log(`  ${marker} ${cat}: ${count} career(s)`);
    });

    console.log('\n─'.repeat(60));
    console.log('🔬 DIAGNOSTIC FINDINGS:\n');

    if (matchCount === 0) {
      console.log('❌ CRITICAL ISSUE: No expected careers in top 5');
      console.log('   → Algorithm is NOT matching user interests to correct careers');
      console.log('   → Need to check:');
      console.log('     1. Question-to-subdimension mapping');
      console.log('     2. Career vector accuracy for tech careers');
      console.log('     3. Category detection logic');
      console.log('     4. Subdimension weights for innovoija category');
    } else if (matchCount < 3) {
      console.log('⚠️  PARTIAL ISSUE: Some matches found but not majority');
      console.log(`   → Only ${matchCount}/5 recommendations match expected careers`);
      console.log('   → Algorithm partially working but needs calibration');
    } else {
      console.log('✅ GOOD: Majority of recommendations match expected careers');
      console.log(`   → ${matchCount}/5 recommendations are correct`);
      console.log('   → Algorithm is working reasonably well');
    }

    // Check if dominant category matches
    const dominantCategoryInResults = Object.entries(categories)
      .sort(([, a], [, b]) => b - a)[0][0];

    if (dominantCategoryInResults !== TEST_PROFILE.expectedCategory) {
      console.log(`\n❌ CATEGORY MISMATCH:`);
      console.log(`   Expected: ${TEST_PROFILE.expectedCategory}`);
      console.log(`   Got: ${dominantCategoryInResults}`);
      console.log(`   → determineDominantCategory() may be miscalculating`);
    } else {
      console.log(`\n✅ CATEGORY MATCH: ${dominantCategoryInResults}`);
    }

    console.log('\n════════════════════════════════════════════════════════════════');
    console.log('✅ DIAGNOSTIC TEST COMPLETE');
    console.log('════════════════════════════════════════════════════════════════\n');

    // Return diagnostic results
    return {
      matchCount,
      matchRate: (matchCount / TEST_PROFILE.expectedCareers.length * 100).toFixed(1),
      categoryMatch: dominantCategoryInResults === TEST_PROFILE.expectedCategory,
      topCareers: data.topCareers.map(c => c.title),
      dimensionScores: data.userProfile.dimensionScores
    };

  } catch (error) {
    console.error('❌ Error running diagnostic:', error.message);
    throw error;
  }
}

// Run the diagnostic
runDiagnostic().then(results => {
  process.exit(results.matchCount >= 3 ? 0 : 1);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
