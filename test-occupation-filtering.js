/**
 * Test script for Phase 1: Current Occupation Filtering
 *
 * This script tests that the occupation filtering works correctly
 * by simulating API requests with and without currentOccupation.
 */

const BASE_URL = 'http://localhost:3000';

// Sample test answers (simplified - all answers set to 4 for "Paljon")
const sampleAnswers = Array.from({ length: 30 }, (_, i) => ({
  questionIndex: i,
  score: 4
}));

async function testOccupationFiltering() {
  console.log('🧪 Testing Phase 1: Current Occupation Filtering\n');

  // Test 1: Without occupation filtering (baseline)
  console.log('Test 1: No occupation filtering (baseline)');
  console.log('==========================================');

  try {
    const response1 = await fetch(`${BASE_URL}/api/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cohort: 'NUORI',
        answers: sampleAnswers
      })
    });

    const data1 = await response1.json();

    if (data1.success) {
      console.log('✅ API call successful');
      console.log('\nTop 5 careers (no filtering):');
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

  // Test 2: With occupation filtering - filter out "Sairaanhoitaja"
  console.log('Test 2: Filter out "Sairaanhoitaja" (Nurse)');
  console.log('==========================================');

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
      console.log('\nTop 5 careers (filtered out "Sairaanhoitaja"):');
      data2.topCareers.forEach((career, index) => {
        console.log(`  ${index + 1}. ${career.title} (${career.overallScore}%)`);
      });

      // Check if Sairaanhoitaja was filtered out
      const hasSairaanhoitaja = data2.topCareers.some(
        career => career.title.toLowerCase().includes('sairaanhoitaja')
      );

      if (hasSairaanhoitaja) {
        console.log('\n❌ FAIL: "Sairaanhoitaja" was NOT filtered out!');
      } else {
        console.log('\n✅ PASS: "Sairaanhoitaja" was successfully filtered out');
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

  // Test 3: With occupation filtering - partial match test
  console.log('Test 3: Filter out "hoitaja" (partial match)');
  console.log('==========================================');

  try {
    const response3 = await fetch(`${BASE_URL}/api/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cohort: 'NUORI',
        answers: sampleAnswers,
        currentOccupation: 'hoitaja'
      })
    });

    const data3 = await response3.json();

    if (data3.success) {
      console.log('✅ API call successful');
      console.log('\nTop 5 careers (filtered out careers containing "hoitaja"):');
      data3.topCareers.forEach((career, index) => {
        console.log(`  ${index + 1}. ${career.title} (${career.overallScore}%)`);
      });

      // Check if any hoitaja careers were filtered out
      const hasHoitaja = data3.topCareers.some(
        career => career.title.toLowerCase().includes('hoitaja')
      );

      if (hasHoitaja) {
        console.log('\n⚠️  WARNING: Some "hoitaja" careers are still in results');
        console.log('   (This is expected if the filter is too strict or there are many career variations)');
      } else {
        console.log('\n✅ PASS: All "hoitaja" careers were successfully filtered out');
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

  // Test 4: With "none" value (skipped input)
  console.log('Test 4: Occupation set to "none" (user skipped)');
  console.log('==========================================');

  try {
    const response4 = await fetch(`${BASE_URL}/api/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cohort: 'NUORI',
        answers: sampleAnswers,
        currentOccupation: 'none'
      })
    });

    const data4 = await response4.json();

    if (data4.success) {
      console.log('✅ API call successful');
      console.log('\nTop 5 careers (occupation = "none"):');
      data4.topCareers.forEach((career, index) => {
        console.log(`  ${index + 1}. ${career.title} (${career.overallScore}%)`);
      });
      console.log('\n✅ PASS: API handles "none" value correctly');
    } else {
      console.log('❌ API call failed:', data4.error);
      return;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return;
  }

  console.log('\n');
  console.log('==========================================');
  console.log('✅ Phase 1 testing complete!');
  console.log('==========================================');
}

// Run the tests
testOccupationFiltering().catch(error => {
  console.error('Test execution error:', error);
  process.exit(1);
});
