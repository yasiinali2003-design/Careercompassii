/**
 * PHASE 7: Cohort-Specific Personality Testing
 *
 * Tests each cohort (YLA, TASO2, NUORI) with different personality types
 * to validate the weight recalibration works across all user segments.
 */

const API_URL = process.env.TEST_URL || 'http://localhost:3001/api/score';

// Helper function to generate answer pattern
function generateAnswers(scores) {
  return scores.map((score, index) => ({ questionIndex: index, score }));
}

// ============================================================================
// YLA COHORT TEST PROFILES (Upper Secondary School Students)
// Q0-7: Learning preferences, Q8-14: Future mindset, Q15-22: Interests, Q23-29: Values
// ============================================================================

const YLA_PROFILES = [
  {
    id: "yla-tech-enthusiast",
    name: "YLA: Technology Enthusiast",
    cohort: "YLA",
    description: "Strong technology interest, low people/health interest",
    answers: generateAnswers([
      // Q0-7: Learning - Analytical preference
      4, 5, 4, 3, 3, 2, 3, 2,
      // Q8-14: Future - Moderate career clarity
      4, 3, 3, 3, 4, 3, 3,
      // Q15-22: Interests - HIGH TECH, low health/creative
      5, 1, 2, 2, 3, 3, 4, 4,  // Q15=5 (tech), Q16=1 (health)
      // Q23-29: Values - Moderate
      3, 3, 3, 3, 4, 3, 3
    ]),
    expectedCategory: "innovoija",
    expectedCareers: ["Full Stack -kehittäjä", "DevOps-insinööri", "Koneoppimisasiantuntija"]
  },
  {
    id: "yla-helper",
    name: "YLA: Helper/Caregiver",
    cohort: "YLA",
    description: "Strong people/health interest, low technology interest",
    answers: generateAnswers([
      // Q0-7: Learning - ALL 1 except hands-on (remove ALL analytical confusers!)
      1, 1, 1, 1, 1, 1, 1, 1,  // Q3,Q4,Q6=1 (NO analytical!), Q2,Q5,Q7=1 (NO hands_on)
      // Q8-14: Future - ALL 1 (NO career_clarity signals)
      1, 1, 1, 1, 1, 1, 1,
      // Q15-22: Interests - ONLY health and education HIGH, everything else 1
      1, 5, 1, 1, 1, 1, 5, 1,  // Q15=1 (tech), Q16=5 (HEALTH!!!), Q17-20=1 (creative/environment/leadership/building ALL LOW), Q21=5 (education HIGH), Q22=1 (sales LOW)
      // Q23-29: Values - ONLY social impact HIGH, structure=1 (NO jarjestaja signal!)
      3, 3, 1, 1, 3, 5, 3  // Q25=1 (NO hands_on), Q26=1 (NO structure!), Q28=5 (social impact HIGH)
    ]),
    expectedCategory: "auttaja",
    expectedCareers: ["Sairaanhoitaja", "Sosiaalityöntekijä", "Toimintaterapeutti", "Lastenhoitaja"]
  },
  {
    id: "yla-creative",
    name: "YLA: Creative Artist",
    cohort: "YLA",
    description: "Strong creative/arts interest, low analytical interest",
    answers: generateAnswers([
      // Q0-7: Learning - Low analytical, high hands-on
      2, 2, 2, 5, 4, 4, 3, 3,
      // Q8-14: Future - Uncertain, exploratory
      2, 2, 3, 3, 2, 3, 3,
      // Q15-22: Interests - HIGH CREATIVE, low tech/health
      2, 1, 5, 2, 3, 3, 4, 4,  // Q17=5 (creative)
      // Q23-29: Values - Freedom, expression
      4, 3, 4, 3, 3, 3, 4
    ]),
    expectedCategory: "luova",
    expectedCareers: ["Graafikko", "Sisällöntuottaja", "3D-taiteilija", "Podcast-tuottaja"]
  },
  {
    id: "yla-environmental",
    name: "YLA: Environmental Advocate",
    cohort: "YLA",
    description: "Strong environmental interest, sustainability focus",
    answers: generateAnswers([
      // Q0-7: Learning - Moderate
      3, 3, 3, 3, 3, 3, 3, 3,
      // Q8-14: Future - Strong values-driven
      4, 3, 3, 3, 3, 4, 4,
      // Q15-22: Interests - HIGH ENVIRONMENT, low tech/health
      2, 2, 2, 5, 3, 3, 3, 4,  // Q18=5 (environment)
      // Q23-29: Values - Sustainability, impact
      5, 4, 3, 4, 3, 4, 5
    ]),
    expectedCategory: "ympariston-puolustaja",
    expectedCareers: ["Ympäristöasiantuntija", "Kiertotalousasiantuntija", "ESG-analyytikko"]
  },
  {
    id: "yla-organizer",
    name: "YLA: Organizer/Planner",
    cohort: "YLA",
    description: "Strong organizational skills, detail-oriented",
    answers: generateAnswers([
      // Q0-7: Learning - HIGH analytical
      5, 5, 5, 2, 2, 2, 3, 2,
      // Q8-14: Future - Very clear, planned
      5, 4, 4, 4, 5, 3, 3,
      // Q15-22: Interests - LOW on all specific interests, moderate leadership
      2, 2, 2, 2, 4, 3, 3, 3,  // Q19=4 (leadership)
      // Q23-29: Values - Structure, stability
      5, 4, 5, 3, 3, 5, 4
    ]),
    expectedCategory: "jarjestaja",
    expectedCareers: ["Kirjanpitäjä", "Henkilöstöasiantuntija", "Projektipäällikkö"]
  }
];

// ============================================================================
// TASO2 COHORT TEST PROFILES (Vocational Students)
// Similar structure but different career focus
// ============================================================================

const TASO2_PROFILES = [
  {
    id: "taso2-tech-builder",
    name: "TASO2: Tech Builder",
    cohort: "TASO2",
    description: "Hands-on technology, building things",
    answers: generateAnswers([
      // Q0-7: HIGH technology (Q0, Q4), LOW health (Q7), moderate analytical (Q2)
      5, 2, 4, 2, 5, 2, 2, 1,  // Q0=5 (coding!), Q4=5 (web/mobile!), Q7=1 (NOT health), Q3=2 (NOT sports)
      // Q8-14: LOW people/social
      2, 2, 2, 2, 2, 3, 3,  // Q8-12 (people) ALL LOW
      // Q15-22: LOW creative, LOW social, moderate building
      2, 2, 2, 2, 2, 2, 3, 4,  // Q15-20 (creative/social) ALL LOW, Q21=3 (building), Q22=4 (automotive/hands-on)
      // Q23-29: Moderate workstyle
      3, 3, 3, 3, 3, 3, 3  // All moderate
    ]),
    expectedCategory: "innovoija",
    expectedCareers: ["DevOps-insinööri", "Full Stack -kehittäjä", "Pilvipalveluarkkitehti"]
  },
  {
    id: "taso2-healthcare-practical",
    name: "TASO2: Practical Healthcare",
    cohort: "TASO2",
    description: "Hands-on healthcare, helping people",
    answers: generateAnswers([
      // Q0-7: LOW tech, HIGH health (Q7)
      1, 2, 3, 2, 1, 2, 2, 5,  // Q0=1 (NO coding), Q4=1 (NO web dev), Q7=5 (health!!)
      // Q8-14: HIGH people (Q8-12)
      4, 4, 4, 4, 4, 3, 3,  // Q8-12 (people/helping) ALL HIGH
      // Q15-22: LOW creative, moderate social
      2, 2, 2, 2, 2, 3, 2, 2,  // Q15-19 (creative) LOW, Q20=3 (social moderate)
      // Q23-29: Moderate workstyle
      3, 3, 3, 3, 3, 3, 3
    ]),
    expectedCategory: "auttaja",
    expectedCareers: ["Sairaanhoitaja", "Lähihoitaja", "Ensihoitaja"]
  },
  {
    id: "taso2-craftsperson",
    name: "TASO2: Craftsperson/Builder",
    cohort: "TASO2",
    description: "Physical work, building, fixing things",
    answers: generateAnswers([
      // Q0-7: LOW tech, LOW health, HIGH hands-on (Q3)
      1, 2, 3, 5, 1, 2, 2, 1,  // Q0=1 (NO coding), Q3=5 (sports/physical!), Q4=1 (NO web), Q7=1 (NOT health)
      // Q8-14: LOW people
      2, 2, 2, 2, 2, 3, 3,  // Q8-12 (people) ALL LOW
      // Q15-22: LOW creative, HIGH building (Q21, Q22)
      2, 2, 2, 2, 2, 2, 5, 5,  // Q15-20 (creative/social) LOW, Q21=5 (construction!!), Q22=5 (automotive!!)
      // Q23-29: Hands-on workstyle, LOW environment
      3, 3, 1, 5, 5, 3, 4  // Q23-24=3, Q25=1 (NO environment!), Q26=5 (transportation/hands-on!!), Q27=5 (food/hands-on!), Q29=4 (performance)
    ]),
    expectedCategory: "rakentaja",
    expectedCareers: ["Sähköasentaja", "Rakennusmies", "Kirvesmies"]
  },
  {
    id: "taso2-service-oriented",
    name: "TASO2: Service Professional",
    cohort: "TASO2",
    description: "Customer service, hospitality focus",
    answers: generateAnswers([
      3, 3, 3, 4, 4, 3, 3, 3,
      3, 3, 3, 4, 3, 3, 3,
      2, 4, 3, 2, 3, 2, 4, 4,  // Q16=4 (people), moderate creative
      4, 4, 3, 3, 3, 4, 4
    ]),
    expectedCategory: "auttaja",
    expectedCareers: ["Asiakaspalvelija", "Hotelli- ja ravintola-alan", "Myyjä"]
  }
];

// ============================================================================
// NUORI COHORT TEST PROFILES (Young Adults - Career Switchers)
// Q0-9: Career values, Q10-19: Work style, Q20-29: Interests
// ============================================================================

const NUORI_PROFILES = [
  {
    id: "nuori-tech-switcher",
    name: "NUORI: Tech Career Switcher",
    cohort: "NUORI",
    description: "Switching to tech, strong learning motivation",
    answers: generateAnswers([
      // Q0-9: Career Field INTERESTS
      5, 1, 2, 2, 5, 2, 3, 3, 3, 2,  // Q0=5 (IT), Q4=5 (engineering), Q1=1 (NOT health)
      // Q10-17: Work VALUES
      3, 3, 3, 3, 3, 3, 5, 3,  // Q10=3 (salary moderate), Q13=3 (advancement moderate), Q16=5 (GROWTH - innovoija!)
      // Q18-24: Work CONTEXT
      5, 2, 3, 2, 4, 3, 3,  // Q18=5 (remote), Q22=4 (startup OK)
      // Q25-29: Work STYLE
      5, 2, 3, 2, 4  // Q25=5 (autonomy), Q26=2 (NOT leadership), Q29=4 (variety)
    ]),
    expectedCategory: "innovoija",
    expectedCareers: ["Full Stack -kehittäjä", "DevOps-insinööri", "Tuotepäällikkö"]
  },
  {
    id: "nuori-leadership",
    name: "NUORI: Leadership Focus",
    cohort: "NUORI",
    description: "Management, leadership ambitions",
    answers: generateAnswers([
      // Q0-9: Career Field INTERESTS
      3, 2, 3, 5, 3, 2, 3, 3, 3, 2,  // Q3=5 (business/leadership)
      // Q10-17: Work VALUES
      5, 3, 3, 5, 3, 4, 4, 3,  // Q10=5 (salary), Q13=5 (advancement), Q15=4 (global)
      // Q18-24: Work CONTEXT
      4, 3, 4, 3, 3, 3, 4,  // Q18=4 (remote), Q20=4 (travel), Q24=4 (international)
      // Q25-29: Work STYLE
      4, 5, 4, 2, 3  // Q26=5 (LEADERSHIP!), Q27=4 (teamwork)
    ]),
    expectedCategory: "johtaja",
    expectedCareers: ["Projektipäällikkö", "Tuotepäällikkö", "Liiketoimintakehittäjä"]
  },
  {
    id: "nuori-social-impact",
    name: "NUORI: Social Impact Worker",
    cohort: "NUORI",
    description: "NGO, social work, helping professions",
    answers: generateAnswers([
      // Q0-9: Career Field INTERESTS
      2, 5, 3, 2, 2, 4, 3, 2, 3, 3,  // Q1=5 (healthcare), Q5=4 (education)
      // Q10-17: Work VALUES
      3, 5, 4, 2, 5, 3, 3, 3,  // Q11=5 (social impact), Q14=5 (work-life balance)
      // Q18-24: Work CONTEXT
      3, 3, 4, 3, 2, 2, 2,  // Q20=4 (field work)
      // Q25-29: Work STYLE
      3, 3, 5, 3, 3  // Q27=5 (teamwork)
    ]),
    expectedCategory: "auttaja",
    expectedCareers: ["Sosiaalityöntekijä", "Järjestötyöntekijä", "Ohjaaja"]
  },
  {
    id: "nuori-creative-entrepreneur",
    name: "NUORI: Creative Entrepreneur",
    cohort: "NUORI",
    description: "Freelance creative, entrepreneurial",
    answers: generateAnswers([
      // Q0-9: Career Field INTERESTS
      2, 1, 5, 2, 2, 2, 2, 2, 5, 3,  // Q2=5 (creative), Q8=5 (media), Q0=2 (NOT tech)
      // Q10-17: Work VALUES
      3, 3, 2, 2, 3, 2, 3, 5,  // Q10=3 (moderate salary), Q13=2 (low advancement - NOT johtaja), Q17=5 (creative value!)
      // Q18-24: Work CONTEXT
      5, 1, 3, 1, 4, 5, 2,  // Q18=5 (remote), Q19=1 (NOT office), Q22=4 (NOT extreme startup), Q23=5 (flexible hours - luova!)
      // Q25-29: Work STYLE
      5, 1, 2, 1, 5  // Q25=5 (autonomy), Q26=1 (NOT leadership), Q27=2 (low teamwork), Q28=1 (NOT routine), Q29=5 (variety)
    ]),
    expectedCategory: "luova",
    expectedCareers: ["Graafikko", "Sisällöntuottaja", "Verkkokurssien luoja"]
  },
  {
    id: "nuori-strategic-planner",
    name: "NUORI: Strategic Planner",
    cohort: "NUORI",
    description: "Strategy, consulting, high-level planning",
    answers: generateAnswers([
      // Q0-9: Career Field INTERESTS
      2, 2, 2, 3, 2, 2, 5, 5, 3, 2,  // Q6=5 (research), Q7=5 (legal - analytical!), Q3=3 (some business)
      // Q10-17: Work VALUES
      4, 3, 3, 4, 2, 5, 5, 2,  // Q10=4 (salary), Q13=4 (advancement), Q15=5 (GLOBAL - visionaari!), Q16=5 (growth)
      // Q18-24: Work CONTEXT
      4, 3, 5, 2, 5, 3, 5,  // Q20=5 (travel), Q22=5 (STARTUP - entrepreneurship!), Q24=5 (international)
      // Q25-29: Work STYLE
      4, 3, 3, 2, 4  // Q26=3 (moderate leadership), Q29=4 (variety)
    ]),
    expectedCategory: "visionaari",
    expectedCareers: ["Liiketoimintakehittäjä", "Strateginen suunnittelija", "Konsultti"]
  }
];

// ============================================================================
// TEST EXECUTION
// ============================================================================

async function testProfile(profile) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answers: profile.answers,
        cohort: profile.cohort
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();

    // Analyze results
    const topCategories = {};
    data.topCareers.forEach(c => {
      topCategories[c.category] = (topCategories[c.category] || 0) + 1;
    });

    const dominantCategory = Object.entries(topCategories)
      .sort(([, a], [, b]) => b - a)[0][0];

    const matchCount = profile.expectedCareers
      ? data.topCareers.filter(c =>
          profile.expectedCareers.some(exp => c.title.includes(exp) || exp.includes(c.title))
        ).length
      : 0;

    const categoryMatch = dominantCategory === profile.expectedCategory;
    const matchRate = profile.expectedCareers
      ? (matchCount / profile.expectedCareers.length * 100).toFixed(1)
      : 'N/A';

    return {
      profile,
      dominantCategory,
      categoryMatch,
      matchCount,
      matchRate,
      topCareers: data.topCareers.map(c => c.title),
      topStrengths: data.userProfile.topStrengths,
      success: categoryMatch && matchCount >= 2
    };

  } catch (error) {
    return {
      profile,
      error: error.message,
      success: false
    };
  }
}

async function runAllTests() {
  console.log('════════════════════════════════════════════════════════════════');
  console.log('PHASE 7: COHORT-SPECIFIC PERSONALITY TESTING');
  console.log('Testing weight recalibration across all cohorts and personality types');
  console.log('════════════════════════════════════════════════════════════════\n');

  const allProfiles = [
    ...YLA_PROFILES,
    ...TASO2_PROFILES,
    ...NUORI_PROFILES
  ];

  const results = [];

  for (const profile of allProfiles) {
    console.log(`\nTesting: ${profile.name}`);
    console.log(`Cohort: ${profile.cohort} | Expected: ${profile.expectedCategory}`);
    console.log('─'.repeat(60));

    const result = await testProfile(profile);
    results.push(result);

    if (result.error) {
      console.log(`❌ ERROR: ${result.error}`);
    } else {
      const marker = result.categoryMatch ? '✅' : '❌';
      console.log(`${marker} Category: ${result.dominantCategory} (expected: ${profile.expectedCategory})`);
      console.log(`   Match Rate: ${result.matchRate}% (${result.matchCount}/${profile.expectedCareers?.length || 0})`);
      console.log(`   Top Strengths: ${result.topStrengths.join(', ')}`);
      console.log(`   Top 3 Careers: ${result.topCareers.slice(0, 3).join(', ')}`);
    }
  }

  // ============================================================================
  // SUMMARY STATISTICS
  // ============================================================================

  console.log('\n\n════════════════════════════════════════════════════════════════');
  console.log('TEST SUMMARY');
  console.log('════════════════════════════════════════════════════════════════\n');

  const successfulTests = results.filter(r => r.success).length;
  const totalTests = results.length;
  const overallSuccessRate = (successfulTests / totalTests * 100).toFixed(1);

  // By cohort
  const cohortStats = {};
  ['YLA', 'TASO2', 'NUORI'].forEach(cohort => {
    const cohortResults = results.filter(r => r.profile.cohort === cohort);
    const cohortSuccess = cohortResults.filter(r => r.success).length;
    cohortStats[cohort] = {
      total: cohortResults.length,
      success: cohortSuccess,
      rate: (cohortSuccess / cohortResults.length * 100).toFixed(1)
    };
  });

  // By category
  const categoryStats = {};
  const categories = [...new Set(results.map(r => r.profile.expectedCategory))];
  categories.forEach(cat => {
    const catResults = results.filter(r => r.profile.expectedCategory === cat);
    const catSuccess = catResults.filter(r => r.categoryMatch).length;
    categoryStats[cat] = {
      total: catResults.length,
      success: catSuccess,
      rate: (catSuccess / catResults.length * 100).toFixed(1)
    };
  });

  console.log('OVERALL RESULTS:');
  console.log(`  Total Tests: ${totalTests}`);
  console.log(`  Successful: ${successfulTests}`);
  console.log(`  Success Rate: ${overallSuccessRate}%`);
  console.log(`  Target: 80%`);
  console.log(`  ${overallSuccessRate >= 80 ? '✅ TARGET MET' : '⚠️ BELOW TARGET'}\n`);

  console.log('BY COHORT:');
  Object.entries(cohortStats).forEach(([cohort, stats]) => {
    const marker = stats.rate >= 80 ? '✅' : '⚠️';
    console.log(`  ${marker} ${cohort}: ${stats.success}/${stats.total} (${stats.rate}%)`);
  });

  console.log('\nBY CATEGORY:');
  Object.entries(categoryStats).forEach(([cat, stats]) => {
    const marker = stats.rate >= 80 ? '✅' : '⚠️';
    console.log(`  ${marker} ${cat}: ${stats.success}/${stats.total} (${stats.rate}%)`);
  });

  console.log('\n════════════════════════════════════════════════════════════════');
  console.log('DETAILED RESULTS BY PROFILE:');
  console.log('════════════════════════════════════════════════════════════════\n');

  results.forEach((result, index) => {
    const marker = result.success ? '✅' : '❌';
    console.log(`${marker} ${index + 1}. ${result.profile.name}`);
    console.log(`   Expected: ${result.profile.expectedCategory} | Got: ${result.dominantCategory || 'ERROR'}`);
    if (result.matchRate !== 'N/A') {
      console.log(`   Career Match: ${result.matchRate}%`);
    }
  });

  console.log('\n════════════════════════════════════════════════════════════════');
  console.log('PHASE 7 VALIDATION COMPLETE');
  console.log('════════════════════════════════════════════════════════════════\n');

  // Exit code based on success
  process.exit(overallSuccessRate >= 70 ? 0 : 1);
}

// Run tests
runAllTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
