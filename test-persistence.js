/**
 * Test that results persist correctly when users return to the page
 * Verifies: careers, education paths, and cohort are identical on reload
 */

async function testResultsPersistence() {
  console.log('='.repeat(80));
  console.log('RESULTS PERSISTENCE TEST');
  console.log('Verifying that users see the EXACT same results when they return');
  console.log('='.repeat(80));

  const baseUrl = 'http://localhost:3000';

  const profiles = [
    {
      name: 'Tech Enthusiast (YLA)',
      cohort: 'YLA',
      subCohort: null,
      answers: Array.from({length: 30}, (_, i) => ({
        questionIndex: i,
        score: [0, 6, 7, 9, 10, 16, 17, 19, 20, 26, 27, 29].includes(i) ? 5 : 1
      }))
    },
    {
      name: 'Healthcare Worker (NUORI)',
      cohort: 'NUORI',
      subCohort: null,
      answers: Array.from({length: 30}, (_, i) => ({
        questionIndex: i,
        score: [1, 3, 11, 13, 21, 23].includes(i) ? 5 : 2
      }))
    },
    {
      name: 'Business Leader (TASO2 LUKIO)',
      cohort: 'TASO2',
      subCohort: 'LUKIO',
      answers: Array.from({length: 30}, (_, i) => ({
        questionIndex: i,
        score: [4, 14, 24].includes(i) ? 5 : 2
      }))
    },
    {
      name: 'Hands-on Worker (TASO2 AMIS)',
      cohort: 'TASO2',
      subCohort: 'AMIS',
      answers: Array.from({length: 30}, (_, i) => ({
        questionIndex: i,
        score: [6, 16, 26].includes(i) ? 5 : 2
      }))
    }
  ];

  let passCount = 0;
  let failCount = 0;

  for (const profile of profiles) {
    console.log('\n' + '-'.repeat(60));
    console.log(`Testing: ${profile.name}`);
    console.log('-'.repeat(60));

    // Step 1: Submit test and get results
    const payload = { cohort: profile.cohort, answers: profile.answers };
    if (profile.subCohort) {
      payload.subCohort = profile.subCohort;
    }
    const response = await fetch(`${baseUrl}/api/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const original = await response.json();
    if (!original.success) {
      console.log(`❌ Scoring failed: ${original.error}`);
      failCount++;
      continue;
    }

    const resultId = original.resultId;
    console.log(`✅ Test completed`);
    console.log(`   Result ID: ${resultId}`);
    console.log(`   Top career: ${original.topCareers[0]?.title}`);
    console.log(`   Education path: ${original.educationPath?.primary}`);
    console.log(`   Shareable URL: /test/results?id=${resultId}`);

    // Wait for database write
    await new Promise(r => setTimeout(r, 500));

    // Step 2: Simulate user returning later by fetching with resultId
    console.log('\n   Simulating user returning to results page...');

    const fetchResponse = await fetch(`${baseUrl}/api/score/${resultId}`);
    const fetched = await fetchResponse.json();

    if (!fetched.success) {
      console.log(`❌ Failed to retrieve results: ${fetched.error}`);
      failCount++;
      continue;
    }

    // Step 3: Compare all important fields
    const originalCareers = original.topCareers.map(c => `${c.title}:${c.overallScore}`).join(',');
    const fetchedCareers = fetched.topCareers.map(c => `${c.title}:${c.overallScore}`).join(',');

    const careersMatch = originalCareers === fetchedCareers;
    const educationMatch = original.educationPath?.primary === fetched.educationPath?.primary;
    const cohortMatch = original.cohort === fetched.cohort;

    console.log('   Comparison results:');
    console.log(`     Top 5 careers: ${careersMatch ? '✅ IDENTICAL' : '❌ DIFFER'}`);
    console.log(`     Education path: ${educationMatch ? '✅ IDENTICAL' : '❌ DIFFER'}`);
    console.log(`     Cohort: ${cohortMatch ? '✅ IDENTICAL' : '❌ DIFFER'}`);

    // Step 4: Fetch again to ensure consistency
    const thirdFetch = await fetch(`${baseUrl}/api/score/${resultId}`);
    const thirdResult = await thirdFetch.json();
    const thirdCareers = thirdResult.topCareers.map(c => `${c.title}:${c.overallScore}`).join(',');
    const consistentFetches = originalCareers === thirdCareers;

    console.log(`     Multiple fetches: ${consistentFetches ? '✅ CONSISTENT' : '❌ INCONSISTENT'}`);

    if (careersMatch && educationMatch && cohortMatch && consistentFetches) {
      console.log('\n   ✅ PASS: Results persist correctly');
      passCount++;
    } else {
      console.log('\n   ❌ FAIL: Results differ on reload');
      if (!careersMatch) {
        console.log('   Original careers:', original.topCareers.slice(0, 3).map(c => c.title));
        console.log('   Fetched careers:', fetched.topCareers.slice(0, 3).map(c => c.title));
      }
      failCount++;
    }
  }

  // Final summary
  console.log('\n' + '='.repeat(80));
  console.log('TEST SUMMARY');
  console.log('='.repeat(80));
  console.log(`✅ Passed: ${passCount}/${profiles.length}`);
  console.log(`❌ Failed: ${failCount}/${profiles.length}`);

  if (failCount === 0) {
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('\nResults persistence is working correctly:');
    console.log('  • Test results are saved to database with unique ID');
    console.log('  • Results page URL includes ID: /test/results?id=<uuid>');
    console.log('  • Users can bookmark, share, or return later');
    console.log('  • Careers, education paths, and analysis are preserved');
  } else {
    console.log('\n⚠️  SOME TESTS FAILED - Check the output above');
    process.exit(1);
  }
}

testResultsPersistence().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
