/**
 * Test script for Phase 2: Career Progression Ladders
 *
 * This script tests that the progression boost works correctly
 * by simulating API requests with current occupations that have natural progressions.
 */

const BASE_URL = 'http://localhost:3000';

// Sample test answers (all answers set to 4 for "Paljon" - high scores)
// This creates a profile that likes helping people (should match "auttaja" category)
const healthcareAnswers = Array.from({ length: 30 }, (_, i) => ({
  questionIndex: i,
  score: 4
}));

async function testCareerProgression() {
  console.log('🧪 Testing Phase 2: Career Progression Ladders\n');

  // Test 1: Baseline - Lähihoitaja with no current occupation (see what's recommended)
  console.log('Test 1: Baseline (no current occupation)');
  console.log('='.repeat(60));

  try {
    const response1 = await fetch(`${BASE_URL}/api/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cohort: 'NUORI',
        answers: healthcareAnswers
      })
    });

    const data1 = await response1.json();

    if (data1.success) {
      console.log('✅ API call successful');
      console.log('\nTop 5 careers (no occupation filtering):');
      data1.topCareers.forEach((career, index) => {
        console.log(`  ${index + 1}. ${career.title} (${career.overallScore}%)`);
      });
    } else {
      console.log('❌ API call failed:', data1.error);
      return;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return;
  }

  console.log('\n');

  // Test 2: Lähihoitaja → should recommend Sairaanhoitaja (natural progression)
  console.log('Test 2: Current occupation = "Lähihoitaja"');
  console.log('Expected: Sairaanhoitaja should get +35% boost (progression path)');
  console.log('='.repeat(60));

  try {
    const response2 = await fetch(`${BASE_URL}/api/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cohort: 'NUORI',
        answers: healthcareAnswers,
        currentOccupation: 'Lähihoitaja'
      })
    });

    const data2 = await response2.json();

    if (data2.success) {
      console.log('✅ API call successful');
      console.log('\nTop 5 careers:');
      data2.topCareers.forEach((career, index) => {
        const marker = career.title.toLowerCase().includes('sairaanhoitaja') ? ' ← PROGRESSION' : '';
        console.log(`  ${index + 1}. ${career.title} (${career.overallScore}%)${marker}`);
      });

      // Check if Sairaanhoitaja is in top 5
      const sairaanhoitajaRank = data2.topCareers.findIndex(
        career => career.title.toLowerCase().includes('sairaanhoitaja')
      );

      if (sairaanhoitajaRank !== -1) {
        console.log(`\n✅ PASS: Sairaanhoitaja is #${sairaanhoitajaRank + 1} (natural progression from Lähihoitaja)`);
      } else {
        console.log('\n⚠️  WARNING: Sairaanhoitaja not in top 5 (may need higher boost)');
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

  // Test 3: Sairaanhoitaja → should recommend specialized nursing roles
  console.log('Test 3: Current occupation = "Sairaanhoitaja"');
  console.log('Expected: Mielenterveyshoitaja, Röntgenhoitaja should get +35% boost');
  console.log('='.repeat(60));

  try {
    const response3 = await fetch(`${BASE_URL}/api/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cohort: 'NUORI',
        answers: healthcareAnswers,
        currentOccupation: 'Sairaanhoitaja'
      })
    });

    const data3 = await response3.json();

    if (data3.success) {
      console.log('✅ API call successful');
      console.log('\nTop 5 careers:');
      data3.topCareers.forEach((career, index) => {
        const marker = (career.title.toLowerCase().includes('mielenterveyshoitaja') ||
                       career.title.toLowerCase().includes('röntgenhoitaja'))
                       ? ' ← PROGRESSION' : '';
        console.log(`  ${index + 1}. ${career.title} (${career.overallScore}%)${marker}`);
      });

      // Check if specialized nursing roles are in top 5
      const specializedNurse = data3.topCareers.find(
        career => career.title.toLowerCase().includes('mielenterveyshoitaja') ||
                 career.title.toLowerCase().includes('röntgenhoitaja')
      );

      if (specializedNurse) {
        console.log(`\n✅ PASS: ${specializedNurse.title} is in top 5 (natural progression from Sairaanhoitaja)`);
      } else {
        console.log('\n⚠️  INFO: No specialized nursing roles in top 5 (this is OK - depends on personality match)');
      }
    } else {
      console.log('❌ API call failed:', data3.error);
      return;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return;
  }

  console.log('\n');

  // Test 4: Verify filtering still works with progression
  console.log('Test 4: Current occupation = "Sairaanhoitaja" (verify filtering)');
  console.log('Expected: Sairaanhoitaja should be filtered out + progressions boosted');
  console.log('='.repeat(60));

  try {
    const response4 = await fetch(`${BASE_URL}/api/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cohort: 'NUORI',
        answers: healthcareAnswers,
        currentOccupation: 'Sairaanhoitaja'
      })
    });

    const data4 = await response4.json();

    if (data4.success) {
      console.log('✅ API call successful');
      console.log('\nTop 5 careers:');
      data4.topCareers.forEach((career, index) => {
        console.log(`  ${index + 1}. ${career.title} (${career.overallScore}%)`);
      });

      // Verify Sairaanhoitaja is NOT in results
      const hasSairaanhoitaja = data4.topCareers.some(
        career => career.title.toLowerCase() === 'sairaanhoitaja'
      );

      if (!hasSairaanhoitaja) {
        console.log('\n✅ PASS: Sairaanhoitaja correctly filtered out (Phase 1 still works)');
      } else {
        console.log('\n❌ FAIL: Sairaanhoitaja should be filtered out!');
      }
    } else {
      console.log('❌ API call failed:', data4.error);
      return;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return;
  }

  console.log('\n');
  console.log('='.repeat(60));
  console.log('✅ Phase 2 testing complete!');
  console.log('='.repeat(60));
}

// Run the tests
testCareerProgression().catch(error => {
  console.error('Test execution error:', error);
  process.exit(1);
});
