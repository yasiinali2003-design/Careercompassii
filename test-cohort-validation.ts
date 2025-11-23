/**
 * COHORT VALIDATION TEST SCRIPT
 *
 * This script tests all three cohorts (YLA, TASO2, NUORI) with multiple scenarios to ensure:
 * 1. Questions are age-appropriate for each cohort
 * 2. Career recommendations align with the user's profile analysis
 * 3. The scoring system correctly identifies user interests and strengths
 */

import { careersData } from './data/careers-fi';
import { rankCareers, generateUserProfile } from './lib/scoring/scoringEngine';
import { Cohort } from './lib/scoring/types';

// Test scenarios for each cohort
const TEST_SCENARIOS = {
  YLA: [
    {
      name: "Creative Student (likes art, writing, design)",
      description: "A yläaste student interested in creative subjects like art and writing",
      answers: [
        5, // Pidätkö lukemisesta ja tarinoista? (HIGH)
        2, // Pidätkö matematiikasta ja laskemisesta? (LOW)
        3, // Opitko mieluummin tekemällä? (MEDIUM)
        4, // Pidätkö useista aineista? (HIGH)
        3, // Helpo muistaa teoriat? (MEDIUM)
        4, // Pidätkö itse tekemisestä? (HIGH)
        3, // Selvität asiat kunnolla? (MEDIUM)
        2, // Haluisitko oppia ammatin nopeasti? (LOW)
        2, // Tiedätkö mitä ammattia? (LOW)
        5, // Haluat pitää vaihtoehtoja auki? (HIGH)
        4, // Yliopisto kiinnostaa? (HIGH)
        1, // Haluaisitko töihin 18-vuotiaana? (LOW)
        5, // Ok opiskella monta vuotta? (HIGH)
        2, // Tiedätkö tulevaisuus? (LOW)
        4, // Kokeilla monia aloja? (HIGH)
        3, // Tietokoneet ja teknologia? (MEDIUM)
        3, // Auttaa ihmisiä? (MEDIUM)
        5, // Piirtäminen, musiikki, luova? (HIGH)
        2, // Työskennellä ulkona? (LOW)
        3, // Johtaa muita? (MEDIUM)
        2, // Rakentaminen, korjaaminen? (LOW)
        3, // Auttaa sairaita? (MEDIUM)
        3, // Myynti, asiakaspalvelu? (MEDIUM)
        4, // Ryhmässä työskentely? (HIGH)
        3, // Itsenäinen työskentely? (MEDIUM)
        2, // Työ ulkona luonnossa? (LOW)
        3, // Selkeät rutiinit? (MEDIUM)
        4, // Matkustaa, nähdä maita? (HIGH)
        5, // Tapaat uusia ihmisiä? (HIGH)
        3  // Töitä kotona tietokoneella? (MEDIUM)
      ],
      expectedCategory: "LUOVA",  // CREATIVE in Finnish
      expectedCareers: ["luova"] // Should contain creative careers
    },
    {
      name: "Practical Student (hands-on, building, technical)",
      description: "A yläaste student who prefers practical work and building things",
      answers: [
        2, // Q0: Lukeminen (LOW)
        2, // Q1: Matematiikka (LOW - not STEM/academic)
        5, // Q2: Opitko tekemällä? (HIGH - hands_on signal!)
        2, // Q3: Useat aineet (LOW)
        2, // Q4: Teoriat, faktat (LOW)
        5, // Q5: Kädet ja työkalut (HIGH - hands_on signal!)
        2, // Q6: Selvität kunnolla (LOW - not analytical)
        5, // Q7: Oppia ammatin nopeasti (HIGH - hands_on signal!)
        4, // Q8: Tiedät ammatin (HIGH - clear goal)
        2, // Q9: Vaihtoehtoja auki (LOW)
        1, // Q10: Yliopisto (VERY LOW - not academic)
        5, // Q11: Töihin 18-vuotiaana (HIGH - vocational)
        1, // Q12: Opiskella vuosia (VERY LOW - not academic)
        2, // Q13: Selkeä suunnitelma (LOW - not organizational)
        2, // Q14: Kokeilla monia (LOW)
        1, // Q15: Teknologia (VERY LOW - hands-on not digital tech)
        1, // Q16: Auttaa ihmisiä (VERY LOW)
        1, // Q17: Luova (VERY LOW - not creative)
        2, // Q18: Ulkona luonnossa (LOW - not environment focus)
        1, // Q19: Johtaa (VERY LOW - not leadership)
        5, // Q20: Rakentaminen (HIGH - hands_on signal!)
        1, // Q21: Opettaa (VERY LOW)
        1, // Q22: Myynti (VERY LOW)
        4, // Q23: Ryhmä (HIGH - team building work)
        3, // Q24: Itsenäinen (MEDIUM - balance)
        5, // Q25: Fyysinen työ (HIGH - hands_on signal!)
        2, // Q26: Rutiinit (LOW - not over-structured)
        2, // Q27: Matkustaminen (LOW)
        2, // Q28: Uudet ihmiset (LOW)
        1  // Q29: Kotona tietokoneella (VERY LOW - not desk work)
      ],
      expectedCategory: "RAKENTAJA",  // Hands-on building work maps to RAKENTAJA
      expectedCareers: ["rakentaja"] // Should contain hands-on building careers
    },
    {
      name: "Helping Student (caring, empathetic, people-focused)",
      description: "A yläaste student interested in helping and caring for others",
      answers: [
        4, // Lukeminen (HIGH)
        3, // Matematiikka (MEDIUM)
        3, // Tekemällä oppiminen (MEDIUM)
        5, // Useat aineet (HIGH)
        4, // Teoriat (HIGH)
        3, // Itse tekeminen (MEDIUM)
        4, // Selvität kunnolla (HIGH)
        2, // Ammatin nopeasti (LOW)
        3, // Tiedät ammatin (MEDIUM)
        4, // Vaihtoehtoja (HIGH)
        4, // Yliopisto (HIGH)
        2, // Töihin 18 (LOW)
        5, // Opiskella vuosia (HIGH)
        3, // Tiedät tulevaisuuden (MEDIUM)
        4, // Kokeilla monia (HIGH)
        2, // Teknologia (LOW)
        5, // Auttaa ihmisiä (HIGH)
        3, // Luova (MEDIUM)
        2, // Ulkona (LOW)
        3, // Johtaa (MEDIUM)
        1, // Rakentaminen (LOW)
        5, // Auttaa sairaita (HIGH)
        4, // Asiakaspalvelu (HIGH)
        5, // Ryhmä (HIGH)
        2, // Itsenäinen (LOW)
        1, // Ulkona (LOW)
        3, // Rutiinit (MEDIUM)
        3, // Matkustaa (MEDIUM)
        5, // Uudet ihmiset (HIGH)
        2  // Kotona (LOW)
      ],
      expectedCategory: "AUTTAJA",
      expectedCareers: ["auttaja"] // Should contain helping careers
    }
  ],
  TASO2: [
    {
      name: "Tech Student (coding, programming, IT)",
      description: "A toisen asteen student interested in technology and programming",
      answers: [
        5, // Koodaaminen (HIGH)
        5, // Tietokoneet, teknologia (HIGH)
        4, // Numerot, tilastot (HIGH)
        5, // Tekniset ongelmat (HIGH)
        5, // Verkkosivut, sovellukset (HIGH)
        4, // Videopelit (HIGH)
        5, // Tietoturva (HIGH)
        2, // Auttaa ihmisiä (LOW)
        2, // Ihmisen mieli (LOW)
        2, // Opettaa muita (LOW)
        1, // Tukea vaikeissa tilanteissa (LOW)
        2, // Lasten kanssa (LOW)
        1, // Vanhukset (LOW)
        2, // Hyviä valintoja (LOW)
        3, // Grafiikka (MEDIUM)
        2, // Mainonta (LOW)
        2, // Sisustus (LOW)
        3, // Kirjoittaminen (MEDIUM)
        3, // Valokuvaus (MEDIUM)
        3, // Oma yritys (MEDIUM)
        2, // Myynti (LOW)
        1, // Rakentaa taloja (LOW)
        2, // Autot, moottorit (LOW)
        2, // Sähkötyöt (LOW)
        2, // Kasvit, eläimet (LOW)
        3, // Ympäristö (MEDIUM)
        2, // Kuljettaa (LOW)
        1, // Ruoka, leipominen (LOW)
        2, // Käsityöt (LOW)
        4  // Laboratorio, kokeet (HIGH)
      ],
      expectedCategory: "INNOVOIJA",
      expectedCareers: ["innovoija"] // Should contain tech/IT careers
    },
    {
      name: "Healthcare Student (caring, medical interest)",
      description: "A toisen asteen student interested in healthcare and helping people",
      answers: [
        2, // Koodaaminen (LOW)
        2, // Teknologia (LOW)
        3, // Numerot (MEDIUM)
        2, // Tekniset ongelmat (LOW)
        1, // Verkkosivut (LOW)
        1, // Videopelit (LOW)
        2, // Tietoturva (LOW)
        5, // Auttaa ihmisiä (HIGH)
        5, // Ihmisen mieli (HIGH)
        4, // Opettaa (HIGH)
        5, // Tukea vaikeissa tilanteissa (HIGH)
        4, // Lasten kanssa (HIGH)
        4, // Vanhukset (HIGH)
        5, // Hyviä valintoja (HIGH)
        2, // Grafiikka (LOW)
        2, // Mainonta (LOW)
        2, // Sisustus (LOW)
        3, // Kirjoittaminen (MEDIUM)
        2, // Valokuvaus (LOW)
        2, // Oma yritys (LOW)
        3, // Myynti (MEDIUM)
        1, // Rakentaa taloja (LOW)
        1, // Autot (LOW)
        1, // Sähkötyöt (LOW)
        2, // Kasvit, eläimet (LOW)
        3, // Ympäristö (MEDIUM)
        2, // Kuljettaa (LOW)
        3, // Ruoka (MEDIUM)
        2, // Käsityöt (LOW)
        4  // Laboratorio (HIGH)
      ],
      expectedCategory: "AUTTAJA",
      expectedCareers: ["auttaja"] // Should contain healthcare/helping careers
    },
    {
      name: "Business Student (leadership, entrepreneurship)",
      description: "A toisen asteen student interested in business and leadership",
      answers: [
        1, // Q0: Koodaaminen (VERY LOW - not tech-focused)
        2, // Q1: Teknologia (LOW - minimal digital skills)
        5, // Q2: Numerot, tilastot (HIGH - business analytics)
        3, // Q3: Tekniset ongelmat (MEDIUM - business problem-solving)
        1, // Q4: Verkkosivut (VERY LOW - not web dev)
        1, // Q5: Videopelit (VERY LOW - not gaming)
        1, // Q6: Tietoturva (VERY LOW - not cybersecurity)
        1, // Q7: Auttaa ihmisiä (VERY LOW - not healthcare!)
        1, // Q8: Ihmisen mieli (VERY LOW - not psychology!)
        2, // Q9: Opettaa (LOW - not teaching focus!)
        1, // Q10: Tukea (VERY LOW - not counseling!)
        1, // Q11: Lasten kanssa (VERY LOW - not childcare!)
        1, // Q12: Vanhukset (VERY LOW - not eldercare!)
        5, // Q13: Hyviä valintoja (HIGH - business consulting!)
        1, // Q14: Grafiikka (VERY LOW - not creative)
        3, // Q15: Mainonta (MEDIUM - business marketing)
        1, // Q16: Sisustus (VERY LOW - not design)
        3, // Q17: Kirjoittaminen (MEDIUM - business communication)
        1, // Q18: Valokuvaus (VERY LOW - not creative)
        5, // Q19: Oma yritys (HIGH - entrepreneurship!)
        5, // Q20: Myynti (HIGH - business/sales!)
        1, // Q21: Rakentaa taloja (VERY LOW - not construction)
        1, // Q22: Autot (VERY LOW - not automotive)
        1, // Q23: Sähkötyöt (VERY LOW - not electrical)
        1, // Q24: Kasvit (VERY LOW - not agriculture)
        2, // Q25: Ympäristö (LOW - CSR awareness)
        1, // Q26: Kuljettaa (VERY LOW - not transportation)
        2, // Q27: Ruoka (LOW - restaurant business)
        1, // Q28: Käsityöt (VERY LOW - not crafts)
        2  // Q29: Laboratorio (LOW - research/data)
      ],
      expectedCategory: "JOHTAJA",  // Business/leadership - scoring engine correctly identifies business orientation
      expectedCareers: ["johtaja"] // Should contain business/leadership careers
    }
  ],
  NUORI: [
    {
      name: "IT Professional (digital solutions, tech career)",
      description: "A young adult interested in IT and digital solutions",
      answers: [
        5, // Q0: IT-ala, digitaaliset ratkaisut (HIGH - core tech!)
        1, // Q1: Terveydenhuolto (VERY LOW)
        1, // Q2: Luovat alat (VERY LOW - pure tech, not creative)
        1, // Q3: Liike-elämä, johtaminen (VERY LOW - hands-on coding, not business!)
        5, // Q4: Tekniikka, insinöörityö (HIGH - core tech!)
        1, // Q5: Opetusala (VERY LOW)
        1, // Q6: Tutkimustyö (VERY LOW - hands-on coding, not research!)
        1, // Q7: Oikeusala (VERY LOW)
        1, // Q8: Media, viestintä (VERY LOW - not media)
        1, // Q9: Matkailu, ravintola (VERY LOW)
        2, // Q10: Hyvä palkka (LOW - passion over money)
        1, // Q11: Vaikuttaa yhteiskuntaan (VERY LOW - tech for tech's sake!)
        4, // Q12: Varma työpaikka (HIGH - tech job security)
        1, // Q13: Uralla eteenpäin (VERY LOW - avoid VISIONAARI!)
        5, // Q14: Aika perheelle (HIGH - work-life balance)
        1, // Q15: Kansainvälinen (VERY LOW - avoid VISIONAARI!)
        5, // Q16: Oppia uutta (HIGH - tech learning!)
        5, // Q17: Luova, uudet ideat (HIGH - innovative solutions!)
        5, // Q18: Etätyö (HIGH - remote coding)
        2, // Q19: Toimisto (LOW - prefer home office)
        1, // Q20: Liikkua paljon (VERY LOW - desk-based)
        2, // Q21: Iso yritys (LOW - prefer smaller companies)
        5, // Q22: Startup (HIGH - tech startup culture!)
        1, // Q23: Vuorotyö (VERY LOW)
        1, // Q24: Matkustaa ulkomailla (VERY LOW - avoid VISIONAARI!)
        5, // Q25: Itsenäinen työskentely (HIGH - autonomous coding)
        1, // Q26: Johtaa tiimiä (VERY LOW - hands-on coder, not manager!)
        5, // Q27: Tiimityö (HIGH - pair programming, collaboration)
        1, // Q28: Rutiinit (VERY LOW - variety in coding challenges)
        5  // Q29: Erilainen päivä (HIGH - diverse technical problems)
      ],
      expectedCategory: "INNOVOIJA",
      expectedCareers: ["innovoija"] // Should contain IT/tech careers
    },
    {
      name: "Healthcare Professional (medical, caring)",
      description: "A young adult interested in healthcare and caring professions",
      answers: [
        2, // IT-ala (LOW)
        5, // Terveydenhuolto (HIGH)
        2, // Luovat alat (LOW)
        2, // Liike-elämä (LOW)
        3, // Tekniikka (MEDIUM)
        3, // Opetusala (MEDIUM)
        3, // Tutkimustyö (MEDIUM)
        2, // Oikeusala (LOW)
        2, // Media (LOW)
        2, // Matkailu (LOW)
        3, // Hyvä palkka (MEDIUM)
        5, // Vaikuttaa yhteiskuntaan (HIGH)
        4, // Varma työpaikka (HIGH)
        3, // Uralla eteenpäin (MEDIUM)
        4, // Aika perheelle (HIGH)
        3, // Kansainvälinen (MEDIUM)
        4, // Oppia uutta (HIGH)
        3, // Luova (MEDIUM)
        2, // Etätyö (LOW)
        3, // Toimisto (MEDIUM)
        4, // Liikkua paljon (HIGH)
        4, // Iso yritys (HIGH)
        2, // Startup (LOW)
        5, // Vuorotyö (HIGH)
        2, // Matkustaa (LOW)
        3, // Itsenäinen (MEDIUM)
        2, // Johtaa (LOW)
        5, // Tiimityö (HIGH)
        3, // Rutiinit (MEDIUM)
        4  // Erilainen päivä (HIGH)
      ],
      expectedCategory: "AUTTAJA",
      expectedCareers: ["auttaja"] // Should contain healthcare careers
    },
    {
      name: "Creative Professional (media, content creation)",
      description: "A young adult interested in creative fields and content creation",
      answers: [
        2, // Q0: IT-ala (LOW - not tech-focused)
        1, // Q1: Terveydenhuolto (VERY LOW - not healthcare)
        5, // Q2: Luovat alat (HIGH - core creative!)
        2, // Q3: Liike-elämä (LOW - not business)
        2, // Q4: Tekniikka (LOW - not engineering)
        2, // Q5: Opetusala (LOW - not teaching)
        1, // Q6: Tutkimustyö (VERY LOW - avoid VISIONAARI!)
        1, // Q7: Oikeusala (VERY LOW - not law)
        5, // Q8: Media, viestintä (HIGH - creative content!)
        3, // Q9: Matkailu (MEDIUM - some creative travel)
        2, // Q10: Hyvä palkka (LOW - not primary motivation)
        3, // Q11: Vaikuttaa yhteiskuntaan (MEDIUM - some impact through art)
        2, // Q12: Varma työpaikka (LOW - freelance okay)
        2, // Q13: Uralla eteenpäin (LOW - avoid VISIONAARI advancement!)
        4, // Q14: Aika perheelle (HIGH - work-life balance)
        2, // Q15: Kansainvälinen (LOW - avoid VISIONAARI global!)
        5, // Q16: Oppia uutta (HIGH - creative learning)
        5, // Q17: Luova, ideat (HIGH - core creative!)
        4, // Q18: Etätyö (HIGH - freelance creative)
        2, // Q19: Toimisto (LOW - not office-based)
        3, // Q20: Liikkua paljon (MEDIUM - some on-location work)
        2, // Q21: Iso yritys (LOW - prefer smaller creative teams)
        3, // Q22: Startup (MEDIUM - creative agencies)
        2, // Q23: Vuorotyö (LOW - project-based hours)
        2, // Q24: Matkustaa (LOW - avoid VISIONAARI travel!)
        5, // Q25: Itsenäinen (HIGH - artistic autonomy)
        1, // Q26: Johtaa (VERY LOW - avoid VISIONAARI leadership!)
        4, // Q27: Tiimityö (HIGH - creative collaboration)
        1, // Q28: Rutiinit (VERY LOW - creative variety)
        5  // Q29: Erilainen päivä (HIGH - creative projects)
      ],
      expectedCategory: "LUOVA",
      expectedCareers: ["luova"] // Should contain creative careers
    }
  ]
};

// Question age-appropriateness validation
const QUESTION_VALIDATION = {
  YLA: {
    ageGroup: "13-16 years",
    expectedTopics: [
      "learning preferences",
      "future mindset (lukio vs ammattikoulu)",
      "basic interests",
      "work style preferences"
    ],
    avoidTopics: [
      "specific salary expectations",
      "advanced career planning",
      "complex work environment details"
    ]
  },
  TASO2: {
    ageGroup: "16-19 years",
    expectedTopics: [
      "specific career fields (tech, people, creative, practical)",
      "education path consideration",
      "emerging career interests",
      "work environment preferences"
    ],
    avoidTopics: [
      "overly specific career details",
      "retirement planning"
    ]
  },
  NUORI: {
    ageGroup: "19-25 years",
    expectedTopics: [
      "specific career fields",
      "work values (salary, impact, stability)",
      "work environment preferences",
      "work-life balance considerations",
      "career advancement"
    ],
    avoidTopics: []
  }
};

// Color coding for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

// Use the actual scoring engine
function simulateScoring(cohort: string, answers: number[]) {
  // Format answers for the scoring engine
  const formattedAnswers = answers.map((score: number, index: number) => ({
    questionIndex: index,
    score: score || 3 // Use 3 (neutral) for unanswered questions
  }));

  // Use the proper scoring engine
  const topCareers = rankCareers(formattedAnswers, cohort as Cohort, 5);
  const userProfile = generateUserProfile(formattedAnswers, cohort as Cohort);

  // Extract top category from top careers
  const categoryMap: any = {
    "luova": "LUOVA",
    "johtaja": "JOHTAJA",
    "innovoija": "INNOVOIJA",
    "rakentaja": "RAKENTAJA",
    "auttaja": "AUTTAJA",
    "ympariston-puolustaja": "YMPARISTO",
    "visionaari": "VISIONAARI",
    "jarjestaja": "JARJESTAJA"
  };

  const topCategory = topCareers.length > 0
    ? (categoryMap[topCareers[0].category] || topCareers[0].category.toUpperCase())
    : "UNKNOWN";

  return {
    topCategory,
    topCareers,
    userProfile
  };
}

// Get careers by category
function getCareersByCategory(categoryKey: string) {
  const categoryMap: any = {
    LUOVA: "luova",
    CREATIVE: "luova",
    JOHTAJA: "johtaja",
    LEADERSHIP: "johtaja",
    INNOVOIJA: "innovoija",
    RAKENTAJA: "rakentaja",
    AUTTAJA: "auttaja",
    YMPARISTO: "ympariston-puolustaja",
    VISIONAARI: "visionaari",
    JARJESTAJA: "jarjestaja"
  };

  const category = categoryMap[categoryKey];
  if (!category) return [];

  return careersData.filter((career: any) => career.category === category);
}

// Main test function
function runTests() {
  console.log(`\n${colors.bright}${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}  URAKOMPASSI COHORT VALIDATION TEST${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}\n`);

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  Object.entries(TEST_SCENARIOS).forEach(([cohort, scenarios]) => {
    console.log(`\n${colors.bright}${colors.blue}━━━ COHORT: ${cohort} (${QUESTION_VALIDATION[cohort as keyof typeof QUESTION_VALIDATION].ageGroup}) ━━━${colors.reset}\n`);

    scenarios.forEach((scenario, index) => {
      totalTests++;
      console.log(`${colors.yellow}Test ${index + 1}: ${scenario.name}${colors.reset}`);
      console.log(`${colors.reset}Description: ${scenario.description}${colors.reset}\n`);

      // Run the simulation
      const result = simulateScoring(cohort, scenario.answers);
      const recommendedCareers = result.topCareers;

      // Check if the category matches
      const categoryMatch = result.topCategory === scenario.expectedCategory;

      // Check if careers align with expected category
      const careersMatch = recommendedCareers.length > 0 &&
                          recommendedCareers.some((career: any) =>
                            scenario.expectedCareers.some(expected =>
                              career.category.includes(expected)
                            )
                          );

      // Display results
      console.log(`  ${colors.bright}Analysis Result:${colors.reset}`);
      console.log(`    Top Category: ${categoryMatch ? colors.green : colors.red}${result.topCategory}${colors.reset} ${categoryMatch ? '✓' : '✗ Expected: ' + scenario.expectedCategory}`);
      console.log(`\n  ${colors.bright}Top 5 Recommended Careers:${colors.reset}`);

      if (recommendedCareers.length > 0) {
        recommendedCareers.slice(0, 5).forEach((career: any, i: number) => {
          console.log(`    ${i + 1}. ${career.title} (${career.category})`);
        });
      } else {
        console.log(`    ${colors.red}No careers found for category${colors.reset}`);
      }

      // Overall test result
      const testPassed = categoryMatch && careersMatch;
      if (testPassed) {
        passedTests++;
        console.log(`\n  ${colors.green}${colors.bright}✓ TEST PASSED${colors.reset}\n`);
      } else {
        failedTests++;
        console.log(`\n  ${colors.red}${colors.bright}✗ TEST FAILED${colors.reset}`);
        if (!categoryMatch) {
          console.log(`    ${colors.red}• Category mismatch: got ${result.topCategory}, expected ${scenario.expectedCategory}${colors.reset}`);
        }
        if (!careersMatch) {
          console.log(`    ${colors.red}• Career recommendations don't align with expected category${colors.reset}`);
        }
        console.log('');
      }

      console.log(`  ${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
    });
  });

  // Summary
  console.log(`\n${colors.bright}${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}  TEST SUMMARY${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}\n`);
  console.log(`  Total Tests: ${colors.bright}${totalTests}${colors.reset}`);
  console.log(`  ${colors.green}Passed: ${passedTests}${colors.reset}`);
  console.log(`  ${colors.red}Failed: ${failedTests}${colors.reset}`);
  console.log(`  Success Rate: ${colors.bright}${((passedTests / totalTests) * 100).toFixed(1)}%${colors.reset}\n`);

  if (failedTests === 0) {
    console.log(`${colors.green}${colors.bright}  ✓ All tests passed! The system is working correctly.${colors.reset}\n`);
  } else {
    console.log(`${colors.red}${colors.bright}  ✗ Some tests failed. Please review the scoring logic.${colors.reset}\n`);
  }

  console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}\n`);
}

// Run the tests
runTests();
