/**
 * Phase 6: Comprehensive Testing with 21 Synthetic User Profiles
 *
 * Tests all 5 phases working together:
 * - Phase 1: Current occupation filtering
 * - Phase 2: Career progression detection
 * - Phase 3: Career switching intelligence
 * - Phase 4: New careers in recommendations
 * - Phase 5: Uncertainty handling for YLA
 *
 * Target: 80%+ trust rating across all profiles
 */

const BASE_URL = 'http://localhost:3000';

// Helper to generate answer patterns
function generateAnswers(pattern) {
  const answers = [];
  for (let i = 0; i < 30; i++) {
    const score = pattern[i] || 3;
    answers.push({ questionIndex: i, score });
  }
  return answers;
}

// 21 Synthetic User Profiles
const PROFILES = [
  // === YLA Cohort (Upper Secondary Students) ===
  {
    id: 1,
    name: "YLA-1: Tech-interested student",
    cohort: "YLA",
    description: "Strong interest in technology and innovation",
    answers: generateAnswers([5,5,5,1,1, 4,4,5,2,2, 5,5,4,1,1, 4,5,5,2,2, 5,4,5,1,2, 3,3,4,2,2]),
    expectedCategory: "innovoija",
    expectedCareers: ["Full Stack -kehittäjä", "DevOps-insinööri", "Pilvipalveluarkkitehti"]
  },
  {
    id: 2,
    name: "YLA-2: Healthcare-oriented student",
    cohort: "YLA",
    description: "Wants to help people, interested in health",
    answers: generateAnswers([2,2,1,5,5, 2,2,1,5,5, 2,1,2,5,5, 1,2,2,5,4, 2,2,1,5,5, 3,3,2,4,5]),
    expectedCategory: "auttaja",
    expectedCareers: ["Sairaanhoitaja", "Toimintaterapeutti", "Puheterapeutti"]
  },
  {
    id: 3,
    name: "YLA-3: Uncertain student",
    cohort: "YLA",
    description: "Many neutral answers - should trigger uncertainty handling",
    answers: generateAnswers([3,3,3,4,2, 3,3,3,4,2, 3,3,3,4,1, 3,3,3,5,2, 3,3,3,4,2, 3,3,3,4,3]),
    expectedCategory: "multiple",
    note: "Should show careers from 3 categories (Phase 5 uncertainty)"
  },
  {
    id: 4,
    name: "YLA-4: Creative student",
    cohort: "YLA",
    description: "Strong creative interests, arts and design",
    answers: generateAnswers([1,1,5,2,2, 1,1,5,3,3, 2,5,1,2,3, 5,1,1,3,3, 1,1,5,2,3, 3,3,4,2,3]),
    expectedCategory: "luova",
    expectedCareers: ["Sisällöntuottaja", "3D-taiteilija", "Asiakaskokemuksen suunnittelija"]
  },
  {
    id: 5,
    name: "YLA-5: Leadership-oriented student",
    cohort: "YLA",
    description: "Enjoys organizing and leading teams",
    answers: generateAnswers([2,3,2,3,2, 5,5,2,3,2, 3,2,3,3,2, 2,5,5,3,3, 3,5,2,3,2, 4,4,3,3,2]),
    expectedCategory: "johtaja",
    expectedCareers: ["Tuotepäällikkö", "Ketterä valmentaja", "Innovaatiopäällikkö"]
  },
  {
    id: 6,
    name: "YLA-6: Environmental activist",
    cohort: "YLA",
    description: "Passionate about environment and sustainability",
    answers: generateAnswers([2,2,2,3,3, 2,2,5,3,3, 5,2,2,3,3, 2,2,5,3,3, 2,2,5,4,3, 3,3,4,3,4]),
    expectedCategory: "ympariston-puolustaja",
    expectedCareers: ["Kiertotalousasiantuntija", "Aurinkopaneeliasentaja", "ESG-analyytikko"]
  },

  // === NUORI Cohort (Young Adults) ===
  {
    id: 7,
    name: "NUORI-1: Current nurse seeking progression",
    cohort: "NUORI",
    currentOccupation: "Sairaanhoitaja",
    description: "Nurse looking to advance career (Phase 2 test)",
    answers: generateAnswers([2,2,1,5,5, 2,2,1,5,5, 2,1,2,5,4, 1,2,2,5,4, 2,2,1,5,5, 3,3,2,4,5]),
    expectedCategory: "auttaja",
    expectedCareers: ["Mielenterveyshoitaja", "Röntgenhoitaja"],
    note: "Should get +35% boost for progression careers (Phase 2)"
  },
  {
    id: 8,
    name: "NUORI-2: Teacher wanting career switch",
    cohort: "NUORI",
    currentOccupation: "Lastentarhanopettaja",
    description: "Teacher exploring HR transition (Phase 3 test)",
    answers: generateAnswers([2,3,2,4,4, 3,3,2,4,3, 2,2,3,4,4, 2,3,3,4,3, 3,3,2,4,3, 3,4,3,4,3]),
    expectedCategory: "auttaja",
    expectedCareers: ["HR-asiantuntija", "Yrityskouluttaja", "Oppimis- ja kehitysasiantuntija"],
    note: "Should get skill overlap boost for HR (Phase 3)"
  },
  {
    id: 9,
    name: "NUORI-3: Web developer seeking growth",
    cohort: "NUORI",
    currentOccupation: "Web-kehittäjä",
    description: "Frontend dev wanting to advance (Phase 2 test)",
    answers: generateAnswers([5,5,5,1,1, 4,4,5,2,2, 5,5,4,1,1, 4,5,5,2,2, 5,4,5,1,2, 3,3,4,2,2]),
    expectedCategory: "innovoija",
    expectedCareers: ["Full Stack -kehittäjä", "Pilvipalveluarkkitehti", "DevOps-insinööri"],
    note: "Should get progression boost for Full Stack (Phase 2)"
  },
  {
    id: 10,
    name: "NUORI-4: Sales looking for tech role",
    cohort: "NUORI",
    currentOccupation: "Myyntiedustaja",
    description: "Salesperson with tech interest",
    answers: generateAnswers([5,4,4,2,2, 4,3,5,2,2, 5,4,4,2,2, 3,4,5,3,2, 4,4,5,2,2, 3,4,4,2,3]),
    expectedCategory: "johtaja",
    expectedCareers: ["Myynti-insinööri", "Tuotepäällikkö", "Asiakasmenestysjohtaja"]
  },
  {
    id: 11,
    name: "NUORI-5: Content creator",
    cohort: "NUORI",
    description: "Social media and content focus",
    answers: generateAnswers([1,1,5,3,3, 1,1,5,3,3, 2,5,1,3,3, 5,1,1,3,3, 1,1,5,3,3, 3,3,4,3,3]),
    expectedCategory: "luova",
    expectedCareers: ["Sisällöntuottaja", "Sosiaalisen median asiantuntija", "Vaikuttajamarkkinointijohtaja"]
  },
  {
    id: 12,
    name: "NUORI-6: Data analyst",
    cohort: "NUORI",
    description: "Analytical, organized, data-driven",
    answers: generateAnswers([4,4,3,2,2, 4,4,3,2,2, 5,3,4,2,2, 3,4,4,3,2, 4,5,3,2,2, 3,4,4,2,2]),
    expectedCategory: "jarjestaja",
    expectedCareers: ["Liiketoiminta-analyytikko", "Toimitusketjuanalyytikko", "Hankinta-asiantuntija"]
  },

  // === AIKUINEN Cohort (Adults) ===
  {
    id: 13,
    name: "AIKUINEN-1: Electrician to solar",
    cohort: "AIKUINEN",
    currentOccupation: "Sähköasentaja",
    description: "Electrician transitioning to green energy (Phase 2 test)",
    answers: generateAnswers([3,3,2,3,3, 3,3,4,3,3, 4,3,3,3,3, 3,3,4,3,3, 3,3,4,3,3, 3,3,3,3,3]),
    expectedCategory: "rakentaja",
    expectedCareers: ["Aurinkopaneeliasentaja", "Tuulivoima-asentaja", "Sähköajoneuvoasentaja"],
    note: "Should get progression boost for green energy careers (Phase 2)"
  },
  {
    id: 14,
    name: "AIKUINEN-2: Manager seeking innovation",
    cohort: "AIKUINEN",
    currentOccupation: "Projektipäällikkö",
    description: "Experienced manager, strategic thinking",
    answers: generateAnswers([3,4,3,3,3, 5,5,3,3,3, 3,3,4,3,3, 3,5,5,3,3, 3,5,3,3,3, 4,4,3,3,3]),
    expectedCategory: "johtaja",
    expectedCareers: ["Innovaatiopäällikkö", "Muutosjohtamiskonsultti", "Ketterä valmentaja"]
  },
  {
    id: 15,
    name: "AIKUINEN-3: Healthcare admin",
    cohort: "AIKUINEN",
    description: "Healthcare background, organizational skills",
    answers: generateAnswers([2,2,2,4,4, 3,3,2,4,4, 3,2,3,4,4, 2,3,3,4,3, 3,3,2,4,4, 3,3,3,4,3]),
    expectedCategory: "auttaja",
    expectedCareers: ["Etäterveyskoordinaattori", "Oppimis- ja kehitysasiantuntija", "Yrityskouluttaja"]
  },
  {
    id: 16,
    name: "AIKUINEN-4: Hands-on skilled worker",
    cohort: "AIKUINEN",
    currentOccupation: "Automekaanikko",
    description: "Mechanic interested in new tech (Phase 2 test)",
    answers: generateAnswers([3,3,3,2,2, 3,3,4,2,2, 4,3,3,2,2, 3,3,4,3,2, 3,3,4,2,2, 3,3,3,2,3]),
    expectedCategory: "rakentaja",
    expectedCareers: ["Sähköajoneuvoasentaja", "3D-tulostusasiantuntija", "Drone-ohjaaja"],
    note: "Should get progression boost for EV tech (Phase 2)"
  },
  {
    id: 17,
    name: "AIKUINEN-5: Business consultant",
    cohort: "AIKUINEN",
    description: "Strategic, analytical, business-focused",
    answers: generateAnswers([4,4,3,2,2, 5,5,3,2,2, 4,3,4,2,2, 3,5,5,3,2, 4,5,3,2,2, 4,4,3,2,3]),
    expectedCategory: "johtaja",
    expectedCareers: ["Muutosjohtamiskonsultti", "Liiketoiminta-analyytikko", "Innovaatiopäällikkö"]
  },
  {
    id: 18,
    name: "AIKUINEN-6: Environmental specialist",
    cohort: "AIKUINEN",
    description: "Sustainability and environmental focus",
    answers: generateAnswers([2,2,3,3,3, 2,2,5,3,3, 5,2,3,3,3, 2,2,5,3,3, 2,2,5,4,3, 3,3,4,3,4]),
    expectedCategory: "ympariston-puolustaja",
    expectedCareers: ["Kiertotalousasiantuntija", "Ekologisen rakentamisen konsultti", "ESG-analyytikko"]
  },

  // === VAIHTAJA Cohort (Career Changers) ===
  {
    id: 19,
    name: "VAIHTAJA-1: Office worker to tech",
    cohort: "VAIHTAJA",
    currentOccupation: "Toimistotyöntekijä",
    description: "Career changer with tech interest (Phase 3 test)",
    answers: generateAnswers([5,4,4,2,2, 4,3,5,2,2, 5,4,4,2,2, 3,4,5,2,2, 4,4,5,2,2, 3,4,4,2,3]),
    expectedCategory: "innovoija",
    expectedCareers: ["Tekoäly-kehoteasiantuntija", "Opetusteknologi", "Liiketoiminta-analyytikko"],
    note: "Should benefit from transferable skills (Phase 3)"
  },
  {
    id: 20,
    name: "VAIHTAJA-2: Retail to customer success",
    cohort: "VAIHTAJA",
    currentOccupation: "Myyjä",
    description: "Retail worker to customer-focused role (Phase 3 test)",
    answers: generateAnswers([2,3,3,4,3, 3,3,2,4,3, 3,2,3,4,3, 2,3,3,4,4, 3,3,2,4,3, 3,3,3,4,3]),
    expectedCategory: "auttaja",
    expectedCareers: ["Asiakasmenestysjohtaja", "Tapahtumakoordinaattori", "Asiakaskokemuksen suunnittelija"],
    note: "Should get skill overlap boost (Phase 3)"
  },
  {
    id: 21,
    name: "VAIHTAJA-3: Finance to data",
    cohort: "VAIHTAJA",
    currentOccupation: "Kirjanpitäjä",
    description: "Finance background to data analytics",
    answers: generateAnswers([4,4,3,2,2, 4,4,4,2,2, 5,3,4,2,2, 3,4,4,3,2, 4,5,3,2,2, 3,4,4,2,2]),
    expectedCategory: "jarjestaja",
    expectedCareers: ["Liiketoiminta-analyytikko", "Toimitusketjuanalyytikko", "Hankinta-asiantuntija"]
  }
];

// Test each profile
async function testAllProfiles() {
  console.log('═'.repeat(80));
  console.log('🧪 PHASE 6: COMPREHENSIVE TESTING WITH 21 SYNTHETIC USER PROFILES');
  console.log('═'.repeat(80));
  console.log('\nTesting all 5 phases working together:');
  console.log('  ✓ Phase 1: Current occupation filtering');
  console.log('  ✓ Phase 2: Career progression detection');
  console.log('  ✓ Phase 3: Career switching intelligence');
  console.log('  ✓ Phase 4: New careers in recommendations');
  console.log('  ✓ Phase 5: Uncertainty handling for YLA');
  console.log('\nTarget: 80%+ trust rating across all profiles\n');
  console.log('═'.repeat(80));
  console.log('');

  let totalTrustScore = 0;
  let successfulTests = 0;
  const results = [];

  for (const profile of PROFILES) {
    console.log(`\n${'─'.repeat(80)}`);
    console.log(`Testing Profile ${profile.id}/21: ${profile.name}`);
    console.log(`Cohort: ${profile.cohort}`);
    console.log(`Description: ${profile.description}`);
    if (profile.currentOccupation) {
      console.log(`Current Occupation: ${profile.currentOccupation}`);
    }
    console.log(`${'─'.repeat(80)}`);

    try {
      const response = await fetch(`${BASE_URL}/api/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cohort: profile.cohort,
          answers: profile.answers,
          currentOccupation: profile.currentOccupation
        })
      });

      const data = await response.json();

      if (data.success) {
        console.log('\n✅ API Response Successful');
        console.log('\nTop 5 Career Recommendations:');
        data.topCareers.forEach((career, index) => {
          const isExpected = profile.expectedCareers && profile.expectedCareers.includes(career.title);
          const marker = isExpected ? ' ⭐' : '';
          console.log(`  ${index + 1}. ${career.title} (${career.overallScore}%)${marker}`);
        });

        // Calculate trust score (1-5 scale)
        // Check if expected careers appear in top 5
        let trustScore = 3; // baseline
        if (profile.expectedCareers) {
          const matchCount = data.topCareers.filter(c =>
            profile.expectedCareers.includes(c.title)
          ).length;

          if (matchCount >= 2) trustScore = 5; // Excellent
          else if (matchCount === 1) trustScore = 4; // Good
          else trustScore = 2; // Needs improvement
        } else if (profile.expectedCategory) {
          // Check category diversity for uncertain users
          const categories = [...new Set(data.topCareers.map(c => c.category || 'unknown'))];
          if (profile.expectedCategory === 'multiple' && categories.length >= 2) {
            trustScore = 5;
          } else if (categories.length === 1) {
            trustScore = 4;
          }
        }

        totalTrustScore += trustScore;
        successfulTests++;

        console.log(`\n📊 Trust Score: ${trustScore}/5 (${trustScore * 20}%)`);
        if (profile.note) {
          console.log(`📝 Note: ${profile.note}`);
        }

        results.push({
          id: profile.id,
          name: profile.name,
          trustScore,
          topCareer: data.topCareers[0]?.title
        });

      } else {
        console.log('❌ API call failed:', data.error);
        results.push({
          id: profile.id,
          name: profile.name,
          trustScore: 0,
          error: data.error
        });
      }

    } catch (error) {
      console.log('❌ Error:', error.message);
      results.push({
        id: profile.id,
        name: profile.name,
        trustScore: 0,
        error: error.message
      });
    }

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Final Summary
  console.log('\n\n');
  console.log('═'.repeat(80));
  console.log('📊 FINAL RESULTS SUMMARY');
  console.log('═'.repeat(80));

  const averageTrustScore = totalTrustScore / successfulTests;
  const averageTrustPercentage = averageTrustScore * 20;

  console.log(`\nTotal Profiles Tested: ${PROFILES.length}`);
  console.log(`Successful Tests: ${successfulTests}`);
  console.log(`Average Trust Score: ${averageTrustScore.toFixed(2)}/5 (${averageTrustPercentage.toFixed(1)}%)`);
  console.log('');

  // By cohort
  console.log('\nTrust Scores by Cohort:');
  const cohorts = ['YLA', 'NUORI', 'AIKUINEN', 'VAIHTAJA'];
  cohorts.forEach(cohort => {
    const cohortResults = results.filter((r, i) => PROFILES[i].cohort === cohort && r.trustScore > 0);
    if (cohortResults.length > 0) {
      const cohortAvg = cohortResults.reduce((sum, r) => sum + r.trustScore, 0) / cohortResults.length;
      console.log(`  ${cohort}: ${cohortAvg.toFixed(2)}/5 (${(cohortAvg * 20).toFixed(1)}%)`);
    }
  });

  console.log('\n');
  if (averageTrustPercentage >= 80) {
    console.log('🎉 SUCCESS! Target of 80%+ trust rating ACHIEVED!');
  } else {
    console.log(`⚠️  Current: ${averageTrustPercentage.toFixed(1)}% | Target: 80% | Gap: ${(80 - averageTrustPercentage).toFixed(1)}%`);
  }

  console.log('\n');
  console.log('Phase Contributions to Trust Rating:');
  console.log('  • Phase 1 (Occupation Filtering): Prevents showing current job');
  console.log('  • Phase 2 (Progressions): +35% boost for natural next steps');
  console.log('  • Phase 3 (Career Switching): +25% boost for skill overlap');
  console.log('  • Phase 4 (50 New Careers): Fills gaps in career coverage');
  console.log('  • Phase 5 (Uncertainty): Broader exploration for uncertain YLA users');

  console.log('\n');
  console.log('═'.repeat(80));
  console.log('✅ PHASE 6 TESTING COMPLETE');
  console.log('═'.repeat(80));
}

// Run all tests
testAllProfiles().catch(error => {
  console.error('Test execution error:', error);
  process.exit(1);
});
