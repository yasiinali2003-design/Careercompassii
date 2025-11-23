/**
 * COMPREHENSIVE END-TO-END USER FLOW TESTING
 * Tests entire CareerCompassi application from student perspective
 */

const API_URL = 'http://localhost:3000';

// Test different personality types for each cohort
const TEST_PROFILES = {
  YLA: [
    {
      name: "Academic High Achiever",
      description: "Loves reading, math, science - Lukio bound",
      answers: [5,5,2,5,5,1,5,1,2,5,5,5,5,5,5,1,1,2,1,2,1,3,1,3,4,2,4,1,3,2]
    },
    {
      name: "Practical Builder",
      description: "Hands-on learner, wants quick career - Ammattikoulu bound",
      answers: [2,3,5,2,3,5,2,5,5,2,2,5,3,2,1,2,5,1,5,1,2,1,5,4,5,5,3,5,3,4]
    },
    {
      name: "Creative Artist",
      description: "Loves arts, music, creative expression",
      answers: [3,2,4,2,3,4,2,3,3,2,3,3,3,3,1,2,5,1,2,3,4,3,4,5,3,2,5,2,5,5]
    },
    {
      name: "Helper/Caregiver",
      description: "Wants to help people, healthcare interested",
      // Realistic pattern: moderate learning preferences, strong health/education interest, values teamwork & social impact
      answers: [3,3,4,2,2,4,2,4,4,3,2,4,3,3,2,2,5,2,2,2,2,4,2,4,3,2,3,3,5,3]
      // Q0-7: Learning (moderate, hands-on), Q8-14: Future (some clarity), Q15-22: Interests (tech LOW, health HIGH, education high), Q23-29: Values (teamwork, social impact)
    },
    {
      name: "Uncertain Explorer",
      description: "Not sure yet, many neutral answers",
      answers: [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]
    }
  ],
  TASO2: [
    {
      name: "Tech Engineer",
      description: "Coding, technology, building apps",
      answers: [5,2,4,2,5,2,2,1,2,2,2,2,2,3,3,2,2,2,2,2,2,3,4,3,3,3,3,3,3,3]
    },
    {
      name: "Healthcare Professional",
      description: "Nursing, helping people, medical field",
      answers: [1,2,3,2,1,2,2,5,4,4,4,4,4,3,3,2,2,2,2,2,3,2,2,3,3,3,3,3,3,3]
    },
    {
      name: "Craftsperson",
      description: "Construction, automotive, physical work",
      answers: [1,2,3,5,1,2,2,1,2,2,2,2,2,3,3,2,2,2,2,2,2,5,5,3,3,1,5,5,3,4]
    },
    {
      name: "Business Leader",
      description: "Sales, management, entrepreneurship",
      // Q0-6: Tech/leadership/analytical, Q1=5 leadership!, Q7-13: people/health (low), Q14-20: creative (low except Q19 entrepreneurship, Q20 sales)
      answers: [2,5,3,2,2,2,2,2,2,2,2,2,2,2,2,3,2,2,5,5,3,2,2,5,3,3,3,3,4,3]
      // Q1=5 (leadership), Q19=5 (entrepreneurship), Q20=5 (sales), Q23=5 (teamwork), Q28=4 (impact)
    }
  ],
  NUORI: [
    {
      name: "Tech Career Switcher",
      description: "Wants to learn coding, remote work",
      answers: [5,1,3,3,5,2,3,3,3,3,5,3,3,5,3,3,5,3,4,3,3,2,3,3,3,4,3,3,3,3]
    },
    {
      name: "Social Impact Worker",
      description: "Healthcare, education, helping communities",
      answers: [2,5,3,2,2,4,3,2,3,3,3,5,4,2,5,3,3,3,3,4,4,3,2,3,3,3,5,3,3,3]
    },
    {
      name: "Creative Entrepreneur",
      description: "Freelancer, content creator, startup",
      answers: [3,1,5,3,2,2,2,3,5,3,3,3,2,3,3,3,3,5,5,3,3,1,5,4,3,5,2,2,1,5]
    },
    {
      name: "Strategic Planner",
      description: "Consulting, analytics, business strategy",
      answers: [3,2,3,4,3,2,5,4,3,2,5,3,3,5,2,5,5,3,4,5,5,2,5,2,5,4,4,3,2,4]
    }
  ]
};

async function testCohort(cohort, profiles) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`TESTING ${cohort} COHORT (${profiles.length} personality types)`);
  console.log('='.repeat(80));

  const results = [];

  for (const profile of profiles) {
    console.log(`\n--- Testing: ${profile.name} ---`);
    console.log(`Description: ${profile.description}`);

    try {
      // Prepare answers in API format
      const answers = profile.answers.map((score, index) => ({
        questionIndex: index,
        score: score
      }));

      // Call scoring API
      const response = await fetch(`${API_URL}/api/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cohort, answers })
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      // Validate result structure
      const issues = [];

      if (!result.success) {
        issues.push('❌ API returned success: false');
      }

      if (!result.topCareers || result.topCareers.length === 0) {
        issues.push('❌ No careers returned');
      } else if (result.topCareers.length < 3) {
        issues.push(`⚠️ Only ${result.topCareers.length} careers returned (expected 3+)`);
      }

      if (!result.userProfile || !result.userProfile.topStrengths) {
        issues.push('❌ Missing user profile or top strengths');
      }

      if (!result.educationPath || !result.educationPath.primary) {
        issues.push('❌ Missing education path recommendation');
      }

      // Check if analysis makes sense
      const topCareer = result.topCareers?.[0];
      if (topCareer) {
        if (!topCareer.title || !topCareer.category) {
          issues.push('❌ Top career missing title or category');
        }
        if (!topCareer.reasons || topCareer.reasons.length === 0) {
          issues.push('❌ No reasons provided for top career');
        }
        if (topCareer.overallScore < 50) {
          issues.push(`⚠️ Top career has low confidence (${topCareer.overallScore})`);
        }
      }

      // Output results
      if (issues.length === 0) {
        console.log('✅ All validations passed');
      } else {
        console.log('Issues found:');
        issues.forEach(issue => console.log(`  ${issue}`));
      }

      console.log(`\nResults:`);
      console.log(`  Category: ${topCareer?.category || 'N/A'}`);
      console.log(`  Top Career: ${topCareer?.title || 'N/A'} (${topCareer?.overallScore || 0}% match)`);
      console.log(`  Education Path: ${result.educationPath?.primary || 'N/A'}`);
      console.log(`  Top Strengths: ${result.userProfile?.topStrengths?.join(', ') || 'N/A'}`);

      if (topCareer?.reasons && topCareer.reasons.length > 0) {
        console.log(`  Reason: "${topCareer.reasons[0]}"`);
      }

      results.push({
        profile: profile.name,
        success: issues.length === 0,
        issues: issues,
        category: topCareer?.category,
        topCareer: topCareer?.title,
        score: topCareer?.overallScore
      });

    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
      results.push({
        profile: profile.name,
        success: false,
        issues: [`Fatal error: ${error.message}`]
      });
    }
  }

  return results;
}

async function testCareerLibrary() {
  console.log(`\n${'='.repeat(80)}`);
  console.log('TESTING CAREER LIBRARY (URAKIRJASTO)');
  console.log('='.repeat(80));

  try {
    // Test careers API
    const response = await fetch(`${API_URL}/api/careers`);
    if (!response.ok) {
      throw new Error(`Careers API failed: ${response.status}`);
    }

    const careers = await response.json();

    console.log(`\n✅ Found ${careers.length} careers in database`);

    // Sample test a few careers
    const testIds = ['full-stack-kehittaja', 'sairaanhoitaja', 'graafinen-suunnittelija'];
    let foundCount = 0;
    let missingCount = 0;

    for (const id of testIds) {
      const career = careers.find(c => c.id === id);
      if (career) {
        foundCount++;
        console.log(`  ✅ ${career.title_fi}`);
      } else {
        missingCount++;
        console.log(`  ❌ Missing: ${id}`);
      }
    }

    return {
      success: missingCount === 0,
      totalCareers: careers.length,
      issues: missingCount > 0 ? [`Missing ${missingCount} test careers`] : []
    };

  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    return {
      success: false,
      issues: [`Fatal error: ${error.message}`]
    };
  }
}

async function runAllTests() {
  console.log('\n');
  console.log('╔' + '═'.repeat(78) + '╗');
  console.log('║' + ' CAREERCOMPASSI - COMPREHENSIVE USER FLOW TEST '.padEnd(78) + '║');
  console.log('╚' + '═'.repeat(78) + '╝');

  const allResults = {};

  // Test each cohort
  for (const cohort of ['YLA', 'TASO2', 'NUORI']) {
    allResults[cohort] = await testCohort(cohort, TEST_PROFILES[cohort]);
  }

  // Test career library
  allResults.careerLibrary = await testCareerLibrary();

  // Print summary
  console.log(`\n${'='.repeat(80)}`);
  console.log('TEST SUMMARY');
  console.log('='.repeat(80));

  let totalTests = 0;
  let totalPassed = 0;

  for (const cohort of ['YLA', 'TASO2', 'NUORI']) {
    const results = allResults[cohort];
    const passed = results.filter(r => r.success).length;
    totalTests += results.length;
    totalPassed += passed;

    console.log(`\n${cohort}:`);
    console.log(`  ${passed}/${results.length} profiles passed (${(passed/results.length*100).toFixed(1)}%)`);

    const failed = results.filter(r => !r.success);
    if (failed.length > 0) {
      console.log(`  Failed profiles:`);
      failed.forEach(f => {
        console.log(`    - ${f.profile}: ${f.issues.join(', ')}`);
      });
    }
  }

  console.log(`\nCareer Library: ${allResults.careerLibrary.success ? '✅ PASS' : '❌ FAIL'}`);
  if (allResults.careerLibrary.issues.length > 0) {
    allResults.careerLibrary.issues.forEach(i => console.log(`  ${i}`));
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log(`OVERALL: ${totalPassed}/${totalTests} tests passed (${(totalPassed/totalTests*100).toFixed(1)}%)`);
  console.log('='.repeat(80));

  // Return exit code
  process.exit(totalPassed === totalTests && allResults.careerLibrary.success ? 0 : 1);
}

runAllTests().catch(error => {
  console.error('Fatal test error:', error);
  process.exit(1);
});
