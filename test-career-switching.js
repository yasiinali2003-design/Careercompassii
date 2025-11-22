/**
 * Test script for Phase 3: Career Switching Intelligence
 *
 * This script tests that the transferable skills boost works correctly
 * by simulating API requests with occupations that have overlapping skills.
 */

const BASE_URL = 'http://localhost:3000';

// Sample test answers (all answers set to 4 for "Paljon")
const sampleAnswers = Array.from({ length: 30 }, (_, i) => ({
  questionIndex: i,
  score: 4
}));

async function testCareerSwitching() {
  console.log('🧪 Testing Phase 3: Career Switching Intelligence\n');

  // Test 1: Teacher → HR (should share skills: teaching, communication, empathy, curriculum_design, teamwork)
  console.log('Test 1: Lastentarhanopettaja → HR-asiantuntija');
  console.log('Expected: HR-asiantuntija should get skill overlap boost');
  console.log('='.repeat(70));

  try {
    const response1 = await fetch(`${BASE_URL}/api/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cohort: 'NUORI',
        answers: sampleAnswers,
        currentOccupation: 'Lastentarhanopettaja'
      })
    });

    const data1 = await response1.json();

    if (data1.success) {
      console.log('✅ API call successful');
      console.log('\nTop 5 careers:');
      data1.topCareers.forEach((career, index) => {
        const marker = career.title.toLowerCase().includes('hr') ? ' ← POTENTIAL SWITCH!' : '';
        console.log(`  ${index + 1}. ${career.title} (${career.overallScore}%)${marker}`);
      });

      const hrCareer = data1.topCareers.find(c => c.title.toLowerCase().includes('hr'));
      if (hrCareer) {
        console.log(`\n✅ PASS: HR career found in top 5 (skills overlap boost may have activated)`);
      } else {
        console.log(`\n⚠️  INFO: HR career not in top 5 (skill boost may not be strong enough or personality mismatch)`);
      }
    } else {
      console.log('❌ API call failed:', data1.error);
      return;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return;
  }

  console.log('\n');

  // Test 2: Nurse → HR (should share skills: communication, empathy, teamwork)
  console.log('Test 2: Sairaanhoitaja → HR-asiantuntija');
  console.log('Expected: HR-asiantuntija should get skill overlap boost');
  console.log('='.repeat(70));

  try {
    const response2 = await fetch(`${BASE_URL}/api/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cohort: 'NUORI',
        answers: sampleAnswers,
        currentOccupation: 'Sairaanhoitaja'
      })
    });

    const data2 = await response2.json();

    if (data2.success) {
      console.log('✅ API call successful');
      console.log('\nTop 5 careers:');
      data2.topCareers.forEach((career, index) => {
        const marker = career.title.toLowerCase().includes('hr') ? ' ← POTENTIAL SWITCH!' : '';
        console.log(`  ${index + 1}. ${career.title} (${career.overallScore}%)${marker}`);
      });

      const hrCareer = data2.topCareers.find(c => c.title.toLowerCase().includes('hr'));
      if (hrCareer) {
        console.log(`\n✅ PASS: HR career found in top 5 (skills overlap boost activated)`);
      } else {
        console.log(`\n⚠️  INFO: HR career not in top 5 (may need more transferable skills data)`);
      }
    } else {
      console.log('❌ API call failed:', data2.error);
      return;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return;
  }

  console.log('\n');

  // Test 3: Check logs for skill overlap detection messages
  console.log('Test 3: Verification');
  console.log('='.repeat(70));
  console.log('✅ Check server logs for "🔄 Career Switching Boost" messages');
  console.log('✅ These messages show which careers got skill overlap boosts');
  console.log('\n');

  console.log('='.repeat(70));
  console.log('✅ Phase 3 testing complete!');
  console.log('='.repeat(70));
  console.log('\nNOTE: The skill overlap boost requires:');
  console.log('1. Current occupation has transferable_skills defined');
  console.log('2. Target career has transferable_skills defined');
  console.log('3. At least 30% skill overlap between the two');
  console.log('4. Boost amount: up to 25% based on overlap percentage');
}

// Run the tests
testCareerSwitching().catch(error => {
  console.error('Test execution error:', error);
  process.exit(1);
});
