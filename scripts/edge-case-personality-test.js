/**
 * EDGE CASE PERSONALITY TEST SUITE
 * Tests unusual personality combinations and boundary cases
 * to verify the scoring system handles all types correctly
 */

const http = require('http');

const API_BASE = 'http://localhost:3000';

// ========== EDGE CASE PERSONAS ==========

const EDGE_CASE_PERSONAS = [
  // ===== YLA Edge Cases =====

  // Mixed personality - all middle answers (neutral on everything)
  {
    name: "Monilahjakkuus Maija",
    description: "Hyvä kaikessa - vastaa kaikkeen keskimmäisellä arvolla. Vaikea päättää.",
    cohort: "YLA",
    answers: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    expected: {
      category: "any", // Should handle gracefully - any valid category is OK
      educationPath: "lukio", // Default for balanced profile
      careerKeywords: [], // Any careers are acceptable
      analysisKeywords: []
    }
  },

  // Extreme introvert - strong tech preference, avoids people
  {
    name: "Introvertti Iida",
    description: "Viihtyy yksin, välttelee sosiaalisia tilanteita, rakastaa lukemista ja tutkimista.",
    cohort: "YLA",
    answers: [5, 5, 1, 1, 1, 1, 5, 5, 1, 1, 1, 5, 1, 1, 1, 1, 5, 1, 1, 5, 1, 1, 5, 1, 5, 1, 5, 5, 1, 1],
    expected: {
      category: "innovoija",
      educationPath: "lukio",
      careerKeywords: ["kehittäjä", "analyytikko", "tutkija", "insinööri", "data"],
      analysisKeywords: ["itsenäinen", "analyyttinen", "teknologia"]
    }
  },

  // Extreme extrovert - loves people, hates solitary work
  {
    name: "Ekstrovertti Eemeli",
    description: "Energinen, sosiaalinen, haluaa aina olla ihmisten kanssa.",
    cohort: "YLA",
    answers: [1, 1, 5, 1, 5, 5, 1, 1, 5, 5, 5, 1, 5, 5, 5, 5, 1, 5, 5, 1, 5, 5, 1, 5, 1, 5, 1, 1, 5, 5],
    expected: {
      category: "auttaja",
      educationPath: "lukio",
      careerKeywords: ["opettaja", "valmentaja", "ohjaaja", "hoitaja", "myynti"],
      analysisKeywords: ["ihmisläheinen", "sosiaalinen"]
    }
  },

  // All 1s - dislikes everything (extreme negative case)
  {
    name: "Nihilisti Niilo",
    description: "Ei kiinnosta mikään, vastaa kaikkeen 'ei kiinnosta'.",
    cohort: "YLA",
    answers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    expected: {
      category: "any", // Should still produce valid results
      educationPath: "any", // Could be either
      careerKeywords: [], // Any careers are acceptable
      analysisKeywords: []
    }
  },

  // All 5s - loves everything (extreme positive case)
  {
    name: "Innostunut Ilona",
    description: "Kiinnostaa kaikki, vastaa kaikkeen 'erittäin kiinnostunut'.",
    cohort: "YLA",
    answers: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    expected: {
      category: "any", // Should handle gracefully
      educationPath: "lukio", // High engagement = academic interest
      careerKeywords: [],
      analysisKeywords: []
    }
  },

  // Technology + Nature combo (unusual combination)
  {
    name: "Teknoluonto Timo",
    description: "Rakastaa koodausta JA luontoa. Haaveilee ympäristöteknologiasta.",
    cohort: "YLA",
    answers: [5, 5, 2, 5, 5, 1, 5, 2, 2, 2, 2, 5, 2, 1, 2, 2, 5, 5, 5, 5, 2, 2, 5, 2, 5, 2, 5, 5, 5, 5],
    expected: {
      category: "innovoija", // Tech should be primary
      alternativeCategory: "ympariston-puolustaja",
      educationPath: "lukio",
      careerKeywords: ["insinööri", "kehittäjä", "ympäristö", "biologi"],
      analysisKeywords: ["teknologia", "luonto", "ympäristö"]
    }
  },

  // Art + Business combo (creative entrepreneur)
  {
    name: "Luova Yrittäjä Lotta",
    description: "Taiteellinen mutta haluaa myös johtaa ja perustaa yrityksen.",
    cohort: "YLA",
    answers: [2, 2, 5, 2, 2, 5, 2, 2, 5, 5, 5, 2, 5, 5, 5, 5, 2, 2, 2, 2, 5, 5, 2, 5, 2, 5, 2, 2, 5, 5],
    expected: {
      category: "luova",
      alternativeCategory: "johtaja",
      educationPath: "lukio",
      careerKeywords: ["suunnittelija", "yrittäjä", "luova", "media"],
      analysisKeywords: ["luova", "yrittäjyys", "johtaminen"]
    }
  },

  // ===== TASO2-LUKIO Edge Cases =====

  // Science + Teaching combo
  {
    name: "Tiedeneuvoja Tuomas",
    description: "Rakastaa tiedettä mutta haluaa myös opettaa ja selittää asioita muille.",
    cohort: "TASO2",
    subCohort: "LUKIO",
    answers: [5, 5, 5, 5, 3, 2, 3, 5, 5, 5, 4, 4, 3, 4, 2, 2, 2, 3, 2, 3, 1, 1, 2, 3, 2, 2, 3, 3, 2, 2, 4, 4],
    expected: {
      category: "auttaja",
      alternativeCategory: "innovoija",
      educationPath: "yliopisto",
      careerKeywords: ["opettaja", "tutkija", "analyytikko", "luennoitsija"],
      analysisKeywords: ["tiede", "opetus", "tutkimus"]
    }
  },

  // Pure theoretical mind
  {
    name: "Teoreetikko Tanja",
    description: "Rakastaa ajattelua ja teoriaa, välttelee käytännön työtä.",
    cohort: "TASO2",
    subCohort: "LUKIO",
    answers: [5, 5, 5, 1, 1, 1, 1, 5, 5, 5, 3, 3, 3, 3, 2, 2, 3, 4, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5],
    expected: {
      category: "visionaari",
      alternativeCategory: "innovoija",
      educationPath: "yliopisto",
      careerKeywords: ["analyytikko", "tutkija", "konsultti", "strategi"],
      analysisKeywords: ["analyyttinen", "strateginen", "teoreettinen"]
    }
  },

  // Healthcare + Tech fusion
  {
    name: "Terveysteknologi Terhi",
    description: "Haluaa auttaa ihmisiä teknologian avulla. Kiinnostaa terveysteknologia.",
    cohort: "TASO2",
    subCohort: "LUKIO",
    answers: [5, 5, 4, 4, 5, 5, 3, 5, 4, 4, 4, 4, 4, 4, 2, 2, 2, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 4],
    expected: {
      category: "auttaja",
      alternativeCategory: "innovoija",
      educationPath: "yliopisto",
      careerKeywords: ["hoitaja", "kehittäjä", "insinööri", "fysioterapeutti"],
      analysisKeywords: ["terveys", "teknologia", "auttaminen"]
    }
  },

  // ===== TASO2-AMIS Edge Cases =====

  // Digital trades person (traditional + modern)
  {
    name: "Digikirvesmies Kalle",
    description: "Rakentaja joka kiinnostuu myös 3D-mallinnuksesta ja BIM-teknologiasta.",
    cohort: "TASO2",
    subCohort: "AMIS",
    answers: [4, 4, 3, 4, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 3, 3, 2, 5, 5, 5, 4, 3, 4, 4, 5, 5, 4, 3, 3],
    expected: {
      category: "rakentaja",
      alternativeCategory: "innovoija",
      educationPath: "amk",
      careerKeywords: ["rakentaja", "mestari", "insinööri", "asentaja", "kirvesmies"],
      analysisKeywords: ["käytännön", "tekninen", "rakentaminen"]
    }
  },

  // Service + Leadership (aspiring restaurant owner)
  {
    name: "Ravintolajohtaja Riku",
    description: "Kokki joka haluaa johtaa omaa ravintolaa tulevaisuudessa.",
    cohort: "TASO2",
    subCohort: "AMIS",
    answers: [2, 2, 2, 2, 2, 5, 5, 4, 3, 3, 3, 3, 3, 5, 3, 5, 3, 3, 4, 5, 4, 4, 3, 3, 4, 4, 5, 5, 4, 3, 4, 4],
    expected: {
      category: "rakentaja",
      alternativeCategory: "johtaja",
      educationPath: "amk",
      careerKeywords: ["ravintola", "kokki", "yrittäjä", "esimies"],
      analysisKeywords: ["ravintola", "johtaminen", "palvelu"]
    }
  },

  // ===== NUORI Edge Cases =====

  // Career changer (IT to care)
  {
    name: "Alanvaihtaja Antti",
    description: "IT-alalta siirtymässä hoitoalalle. Tekninen tausta, inhimillinen motivaatio.",
    cohort: "NUORI",
    answers: [2, 2, 2, 5, 5, 5, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 3, 3, 2, 5, 5, 3, 2, 3, 3, 4, 4, 3],
    expected: {
      category: "auttaja",
      alternativeCategory: "innovoija",
      careerKeywords: ["hoitaja", "fysioterapeutti", "ohjaaja", "terapeutti"],
      analysisKeywords: ["auttaminen", "ihmiset"]
    }
  },

  // Generalist - good at everything
  {
    name: "Generalisti Greta",
    description: "Monitaituri joka on kohtalaisen hyvä monessa asiassa, ei erikoistunut.",
    cohort: "NUORI",
    answers: [3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 3, 3, 3],
    expected: {
      category: "any",
      careerKeywords: [], // Any valid careers
      analysisKeywords: []
    }
  },

  // Extreme specialist (cybersecurity focus only)
  {
    name: "Spesialisti Sami",
    description: "Täysin omistautunut kyberturvallisuuteen. Muu ei kiinnosta.",
    cohort: "NUORI",
    answers: [5, 5, 5, 1, 1, 1, 5, 1, 1, 1, 1, 5, 2, 1, 1, 1, 5, 5, 5, 1, 1, 1, 5, 5, 5, 5, 2, 3, 1],
    expected: {
      category: "innovoija",
      careerKeywords: ["tietoturva", "kyber", "kehittäjä", "analyytikko", "IT"],
      analysisKeywords: ["teknologia", "turvallisuus"]
    }
  },

  // Values-driven (meaning over money)
  {
    name: "Arvojohtaja Anna",
    description: "Haluaa tehdä merkityksellistä työtä. Raha ei ole tärkein.",
    cohort: "NUORI",
    answers: [2, 2, 2, 5, 5, 5, 2, 3, 3, 3, 2, 2, 3, 3, 2, 2, 2, 4, 5, 3, 5, 5, 3, 3, 3, 3, 4, 5, 5],
    expected: {
      category: "auttaja",
      alternativeCategory: "ympariston-puolustaja",
      careerKeywords: ["sosiaali", "ympäristö", "opettaja", "ohjaaja"],
      analysisKeywords: ["arvot", "merkitys", "auttaminen"]
    }
  },

  // Serial entrepreneur mindset
  {
    name: "Sarjayrittäjä Saku",
    description: "Haluaa perustaa yrityksiä, ei välitä alasta - kunhan saa rakentaa jotain omaa.",
    cohort: "NUORI",
    answers: [3, 3, 3, 2, 2, 5, 5, 4, 4, 4, 5, 5, 5, 5, 4, 4, 3, 4, 4, 3, 2, 2, 5, 5, 5, 5, 3, 3, 3],
    expected: {
      category: "johtaja",
      careerKeywords: ["startup", "yrittäjä", "johtaja", "perustaja", "myynti"],
      analysisKeywords: ["yrittäjyys", "johtaminen", "liiketoiminta"]
    }
  },

  // Alternating answers (1,5,1,5 pattern - edge case)
  {
    name: "Ristiriitainen Riikka",
    description: "Vastaa vuorotellen ääriarvoilla - epätavallinen vastausprofiili.",
    cohort: "YLA",
    answers: [1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5],
    expected: {
      category: "any", // Should handle gracefully
      educationPath: "any",
      careerKeywords: [],
      analysisKeywords: []
    }
  },
];

// ========== API HELPER ==========

async function callScoreAPI(cohort, answers, subCohort = null) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      cohort,
      subCohort,
      answers: answers.map((score, index) => ({
        questionIndex: index,
        score
      }))
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/score',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

// ========== TEST RUNNER ==========

async function runTest(persona) {
  const result = {
    name: persona.name,
    description: persona.description,
    cohort: persona.subCohort ? `${persona.cohort}-${persona.subCohort}` : persona.cohort,
    passed: false,
    confidence: 0,
    warnings: [],
    details: {}
  };

  try {
    const response = await callScoreAPI(persona.cohort, persona.answers, persona.subCohort);

    if (!response.success) {
      result.warnings.push(`API error: ${response.error}`);
      return result;
    }

    const { categoryAffinities, topCareers, educationPath, personalizedAnalysis, profileTypes } = response;

    // Find top category
    const sortedCategories = Object.entries(categoryAffinities || {})
      .sort(([, a], [, b]) => b - a);
    const topCategory = sortedCategories[0]?.[0] || 'unknown';
    const topCategoryScore = sortedCategories[0]?.[1] || 0;

    result.details = {
      topCategory,
      topCategoryScore: Math.round(topCategoryScore),
      expectedCategory: persona.expected.category,
      alternativeCategory: persona.expected.alternativeCategory,
      educationPath: educationPath?.primary || 'N/A',
      expectedEducation: persona.expected.educationPath,
      topCareers: (topCareers || []).slice(0, 3).map(c => ({
        title: c.title,
        category: c.category,
        score: Math.round(c.overallScore)
      })),
      analysisLength: personalizedAnalysis?.length || 0
    };

    // Validate category
    const categoryMatch =
      persona.expected.category === 'any' ||
      topCategory === persona.expected.category ||
      topCategory === persona.expected.alternativeCategory;

    // Validate education path
    const educationMatch =
      !persona.expected.educationPath ||
      persona.expected.educationPath === 'any' ||
      !educationPath ||
      educationPath.primary === persona.expected.educationPath;

    // Check career keywords
    let keywordMatches = 0;
    if (persona.expected.careerKeywords && persona.expected.careerKeywords.length > 0) {
      const careerTitles = (topCareers || []).slice(0, 5).map(c => c.title.toLowerCase()).join(' ');
      for (const keyword of persona.expected.careerKeywords) {
        if (careerTitles.includes(keyword.toLowerCase())) {
          keywordMatches++;
        }
      }
      result.details.keywordMatches = `${keywordMatches}/${persona.expected.careerKeywords.length}`;
    }

    // Check analysis themes
    let themeMatches = 0;
    if (persona.expected.analysisKeywords && persona.expected.analysisKeywords.length > 0 && personalizedAnalysis) {
      const analysisLower = personalizedAnalysis.toLowerCase();
      for (const theme of persona.expected.analysisKeywords) {
        if (analysisLower.includes(theme.toLowerCase())) {
          themeMatches++;
        }
      }
      result.details.themeMatches = `${themeMatches}/${persona.expected.analysisKeywords.length}`;
    }

    // Calculate confidence
    let confidence = 100;

    if (!categoryMatch) {
      confidence -= 30;
      result.warnings.push(`Category mismatch: got ${topCategory}, expected ${persona.expected.category}${persona.expected.alternativeCategory ? ` or ${persona.expected.alternativeCategory}` : ''}`);
    }

    if (!educationMatch && educationPath && persona.expected.educationPath !== 'any') {
      confidence -= 20;
      result.warnings.push(`Education mismatch: got ${educationPath.primary}, expected ${persona.expected.educationPath}`);
    }

    if (persona.expected.careerKeywords && persona.expected.careerKeywords.length > 0) {
      if (keywordMatches < Math.ceil(persona.expected.careerKeywords.length / 3)) {
        confidence -= 15;
        result.warnings.push(`Low career keyword match: ${keywordMatches}/${persona.expected.careerKeywords.length}`);
      }
    }

    if (persona.expected.analysisKeywords && persona.expected.analysisKeywords.length > 0) {
      if (themeMatches < Math.ceil(persona.expected.analysisKeywords.length / 2)) {
        confidence -= 10;
        result.warnings.push(`Low analysis theme match: ${themeMatches}/${persona.expected.analysisKeywords.length}`);
      }
    }

    // Validate we got results even for edge cases
    if (!topCareers || topCareers.length === 0) {
      confidence -= 40;
      result.warnings.push('No career recommendations returned');
    }

    if (!personalizedAnalysis || personalizedAnalysis.length < 100) {
      confidence -= 10;
      result.warnings.push('Analysis too short or missing');
    }

    // Edge cases should still produce valid results
    if (persona.expected.category === 'any' && topCareers && topCareers.length > 0) {
      confidence = Math.max(confidence, 70); // Edge cases pass if they produce any valid results
    }

    result.confidence = Math.max(0, confidence);
    result.passed = result.confidence >= 60;

  } catch (error) {
    result.warnings.push(`Error: ${error.message}`);
    result.confidence = 0;
  }

  return result;
}

// ========== MAIN ==========

async function runAllTests() {
  console.log('='.repeat(80));
  console.log('EDGE CASE PERSONALITY TEST SUITE');
  console.log('Testing unusual combinations and boundary cases');
  console.log('='.repeat(80));
  console.log('');

  const results = [];
  let passed = 0;
  let failed = 0;

  for (const persona of EDGE_CASE_PERSONAS) {
    const result = await runTest(persona);
    results.push(result);

    if (result.passed) {
      passed++;
      console.log(`\x1b[32m▶ ${result.name}\x1b[0m`);
      console.log(`  \x1b[2m${result.description}\x1b[0m`);
      console.log(`  \x1b[32m✅ PASSED\x1b[0m | Confidence: ${result.confidence}%`);
    } else {
      failed++;
      console.log(`\x1b[31m▶ ${result.name}\x1b[0m`);
      console.log(`  \x1b[2m${result.description}\x1b[0m`);
      console.log(`  \x1b[31m❌ FAILED\x1b[0m | Confidence: ${result.confidence}%`);
    }

    console.log(`  📊 Category: ${result.details.topCategory} (${result.details.topCategoryScore}%) | Expected: ${result.details.expectedCategory}${result.details.alternativeCategory ? ` or ${result.details.alternativeCategory}` : ''}`);

    if (result.details.educationPath && result.details.educationPath !== 'N/A') {
      const match = result.details.educationPath === result.details.expectedEducation || result.details.expectedEducation === 'any' ? '✓' : '✗';
      console.log(`  🎓 Education: ${result.details.educationPath} ${match} (expected: ${result.details.expectedEducation || 'N/A'})`);
    }

    console.log(`  💼 Top Careers: ${result.details.topCareers?.map(c => c.title).join(', ') || 'None'}`);

    if (result.details.keywordMatches) {
      console.log(`  🔑 Keywords: ${result.details.keywordMatches}`);
    }
    if (result.details.themeMatches) {
      console.log(`  📝 Themes: ${result.details.themeMatches}`);
    }

    if (result.warnings.length > 0) {
      console.log(`  \x1b[33m⚠ Warnings:\x1b[0m`);
      result.warnings.forEach(w => console.log(`    - ${w}`));
    }

    console.log('');
  }

  // Summary
  console.log('='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total Tests: ${results.length}`);
  console.log(`\x1b[32m✅ Passed: ${passed}\x1b[0m`);
  console.log(`\x1b[31m❌ Failed: ${failed}\x1b[0m`);
  console.log(`Pass Rate: ${((passed / results.length) * 100).toFixed(1)}%`);
  console.log('');

  // Edge case specific analysis
  console.log('EDGE CASE ANALYSIS:');
  console.log('-'.repeat(40));

  const edgeCases = results.filter(r =>
    r.name.includes('Nihilisti') ||
    r.name.includes('Innostunut') ||
    r.name.includes('Monilahjakkuus') ||
    r.name.includes('Generalisti') ||
    r.name.includes('Ristiriitainen')
  );

  for (const ec of edgeCases) {
    const status = ec.passed ? '\x1b[32m✅\x1b[0m' : '\x1b[31m❌\x1b[0m';
    console.log(`  ${status} ${ec.name}: ${ec.confidence}%`);
    console.log(`     Top career: ${ec.details.topCareers?.[0]?.title || 'None'}`);
    console.log(`     Category: ${ec.details.topCategory} (${ec.details.topCategoryScore}%)`);
  }

  console.log('');
  console.log('✨ Edge case personality tests completed!');

  return { passed, failed, total: results.length };
}

// Run tests
runAllTests().catch(console.error);
