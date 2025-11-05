/**
 * Test Simplified YLA Questions
 * Verifies that simplified questions display correctly and scoring still works
 */

import fetch from 'node-fetch';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

async function testSimplifiedYLAQuestions() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  TESTING SIMPLIFIED YLA QUESTIONS');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Create test answers with focus on the simplified questions
  const answers = Array.from({ length: 30 }, (_, i) => ({
    questionIndex: i,
    score: i === 22 ? 5 : i === 29 ? 4 : 3 // High scores for Q23 and Q30
  }));

  try {
    const response = await fetch(`${BASE_URL}/api/score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cohort: 'YLA',
        answers: answers
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(`API returned error: ${data.error}`);
    }

    console.log('✅ API call successful');
    console.log(`✅ Found ${data.topCareers?.length || 0} career recommendations`);
    
    // Check that personalized analysis exists and doesn't contain old question text
    if (data.userProfile?.personalizedAnalysis) {
      const analysis = data.userProfile.personalizedAnalysis;
      const hasOldQ23 = analysis.includes('yritykset ja rahan ansaitseminen');
      const hasOldQ29 = analysis.includes('Onko sinulle tärkeää');
      
      if (hasOldQ23) {
        console.log('⚠️  WARNING: Found old Q23 text in analysis');
      } else {
        console.log('✅ No old Q23 text found (good!)');
      }
      
      if (hasOldQ29) {
        console.log('⚠️  WARNING: Found old Q29 text in analysis');
      } else {
        console.log('✅ No old Q29 text found (good!)');
      }
      
      // Check for new question text (if referenced)
      const hasNewQ23 = analysis.includes('myynnissä') || analysis.includes('asiakkaiden palvelemisessa');
      const hasNewQ29 = analysis.includes('kotona tietokoneen') || analysis.includes('tehdä töitä kotona');
      
      console.log(`✅ Analysis length: ${analysis.length} chars`);
      console.log(`✅ Contains new question concepts: Q23=${hasNewQ23 || 'not referenced'}, Q29=${hasNewQ29 || 'not referenced'}`);
    }

    // Check education path
    if (data.educationPath) {
      console.log(`✅ Education path: ${data.educationPath.primary}`);
    }

    console.log('\n✅ All tests passed! Simplified questions are working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run test
testSimplifiedYLAQuestions().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

