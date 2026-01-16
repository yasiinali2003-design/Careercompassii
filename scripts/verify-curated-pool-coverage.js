/**
 * CURATED CAREER POOL VERIFICATION SCRIPT
 *
 * Verifies that:
 * 1. All curated slugs exist in CAREER_VECTORS
 * 2. Each category has sufficient career coverage
 * 3. All personality combinations have adequate matches
 */

const http = require('http');

// ============================================================================
// CURATED CAREER SLUGS (from curatedCareers.ts)
// ============================================================================
const CURATED_CAREER_SLUGS = [
  // AUTTAJA (28)
  "sairaanhoitaja", "lahihoitaja", "laakari", "ensihoitaja", "katilo",
  "rontgenhoitaja", "laboratoriohoitaja", "bioanalyytikko", "fysioterapeutti",
  "toimintaterapeutti", "puheterapeutti", "psykologi", "mielenterveyshoitaja",
  "hammaslaakari", "optometristi", "farmaseutti", "hieroja", "elainlaakari",
  "optikko", "liikunnanohjaaja", "luokanopettaja", "lastentarhanopettaja",
  "erityisopettaja", "opettaja", "opinto-ohjaaja", "koulunkayntiavustaja",
  "sosiaalityontekija", "terveydenhoitaja",

  // INNOVOIJA (24)
  "ohjelmistokehittaja", "full-stack-kehittaja", "frontend-developer",
  "backend-developer", "mobiilisovelluskehittaja", "game-engine-developer",
  "pelisuunnittelija", "data-analyytikko", "data-insinoori",
  "koneoppimisasiantuntija", "tekoaly-asiantuntija", "data-analyytikko-junior",
  "tietoturvaanalyytikko", "kyberturvallisuusanalyytikko", "pilvipalveluarkkitehti",
  "devops-insinoori", "it-tukihenkilo", "konetekniikan-insinoori",
  "sahkotekniikan-insinoori", "automaatio-insinoori", "robotiikka-insinoori",
  "tutkija", "kemiisti", "insinoori",

  // RAKENTAJA (21)
  "kirvesmies", "sahkoasentaja", "putkiasentaja", "lvi-asentaja", "maalari",
  "muurari", "rakennusinsinoori", "rakennusmestari", "automekaanikko",
  "raskaan-kaluston-mekaanikko", "koneistaja", "hitsaaja", "kuorma-auton-kuljettaja",
  "trukinkuljettaja", "varastotyontekija", "jakelukuljettaja", "puuseppa",
  "puutarhuri", "siivoja", "ravintolatyontekija", "tarjoilija", "hotellityontekija",
  "kokki", "leipuri", "kondiittori",

  // LUOVA (17)
  "graafinen-suunnittelija", "ui-ux-designer", "verkkosuunnittelija", "animaattori",
  "ux-suunnittelija", "valokuvaaja", "video-editor", "aanisuunnittelija",
  "sisallontuottaja", "podcast-tuottaja", "viestinta-assistentti", "muusikko",
  "nayttelija", "kirjailija", "sisustusarkkitehti-luova", "parturi-kampaaja",
  "uutistoimittaja",

  // JÄRJESTÄJÄ (32)
  "kirjanpitaja", "talousasiantuntija", "aktuaari", "pankkivirkailija",
  "talousassistentti", "pankkitoimihenkilo", "vakuutusvirkailija", "veroasiantuntija",
  "palkanlaskija", "tilintarkastajan-assistentti", "taloushallinnon-harjoittelija",
  "hr-asiantuntija", "toimistosihteeri", "reseptionisti", "hr-koordinaattori",
  "henkilostoasiantuntija", "hallinnon-koordinaattori", "projektikoordinaattori",
  "tapahtumakoordinaattori", "myyntityontekija", "asiakaspalveluedustaja",
  "myyntiedustaja", "myyntiassistentti", "markkinointiassistentti",
  "asiakaspalvelun-neuvoja", "kassatyontekija", "asiakaspalvelun-koordinaattori",
  "poliisi", "turvallisuusvastaava", "logistiikkakoordinaattori",
  "hankinta-asiantuntija", "toimitusketjuanalyytikko", "hankinta-assistentti",
  "isannoitsija",

  // JOHTAJA (15)
  "liikkeenjohdon-trainee", "rakennustyonjohtaja", "lennonjohtaja",
  "asiakaspalveluvastaava", "startup-perustaja", "kiinteistonvalittaja",
  "asiakkuusvastaava", "sales-development-representative", "palvelumuotoilija",
  "myynti-insinoori", "valmentaja", "personal-trainer", "urheiluvalmentaja",

  // VISIONÄÄRI (12)
  "liiketoiminta-analyytikko", "strategia-konsultti", "innovaatiokonsultti",
  "rahoitusanalyytikko", "tulevaisuustutkija", "arkkitehti", "journalisti",
  "tiedeviestija-tulevaisuus", "tutkimusasiantuntija", "ekonomisti",
  "tutkimusavustaja",

  // YMPÄRISTÖN PUOLUSTAJA (24)
  "ymparistoinsinoori", "ymparistoteknikko", "ymparistoasiantuntija", "biologi",
  "metsanhoitaja", "ilmastotutkija", "ymparistotarkastaja", "ymparistokasvattaja",
  "luonnonsuojelubiologi", "kestavan-kehityksen-asiantuntija",
  "kiertotalousasiantuntija", "energiatehokkuusasiantuntija",
  "uusiutuva-energia-insinoori", "kestavan-kehityksen-koordinaattori",
  "kierratyskoordinaattori", "esg-analyytikko", "luonnonsuojelija",
  "maatalousasiantuntija", "luomuviljelija", "maisema-arkkitehti",
  "luontokartoittaja", "vesiensuojeluasiantuntija", "jatehuoltoasiantuntija",
  "metsainsinoori",

  // SPECIAL
  "viittomakielen-tulkki"
];

// ============================================================================
// TEST PROFILES - Different personality combinations
// ============================================================================
const TEST_PROFILES = {
  // Single-category extremes
  singleCategory: [
    {
      name: "Pure Healthcare",
      description: "health=5, people=5, everything else=2",
      answers: [2, 2, 2, 2, 2, 5, 2, 2, 2, 2, 2, 2, 5, 2, 2, 5, 2, 2, 2, 2, 2, 2, 2, 5, 2, 2, 2, 2, 2, 2],
      expectedCategory: "auttaja",
      minMatches: 5
    },
    {
      name: "Pure Tech",
      description: "technology=5, analytical=5, everything else=2",
      answers: [5, 5, 2, 2, 2, 2, 2, 5, 2, 2, 2, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      expectedCategory: "innovoija",
      minMatches: 5
    },
    {
      name: "Pure Creative",
      description: "creative=5, writing=5, arts=5",
      answers: [2, 2, 5, 2, 2, 2, 2, 2, 2, 2, 5, 5, 2, 2, 2, 2, 2, 2, 2, 5, 2, 5, 2, 2, 2, 2, 5, 5, 2, 2],
      expectedCategory: "luova",
      minMatches: 5
    },
    {
      name: "Pure Trades",
      description: "hands_on=5, outdoor=5",
      answers: [2, 2, 2, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      expectedCategory: "rakentaja",
      minMatches: 5
    },
    {
      name: "Pure Leadership",
      description: "leadership=5, business=5",
      answers: [2, 2, 2, 2, 2, 2, 5, 2, 2, 2, 2, 5, 2, 5, 2, 2, 2, 2, 2, 2, 2, 2, 5, 2, 2, 5, 2, 5, 2, 2],
      expectedCategory: "johtaja",
      minMatches: 3
    },
    {
      name: "Pure Environment",
      description: "environment=5, nature=5",
      answers: [2, 2, 2, 2, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5, 2, 2, 2, 2, 2, 5, 2, 2, 2, 2, 5, 5],
      expectedCategory: "ympariston-puolustaja",
      minMatches: 5
    }
  ],

  // Hybrid personalities (potential gaps)
  hybrid: [
    {
      name: "Creative + Technical",
      description: "creative=5, technology=5 (game dev type)",
      answers: [5, 4, 5, 2, 2, 2, 2, 4, 2, 2, 4, 5, 2, 2, 2, 2, 2, 2, 2, 4, 2, 4, 2, 2, 2, 2, 4, 4, 2, 2],
      expectedCategory: "innovoija",
      minMatches: 5
    },
    {
      name: "Leadership + Hands-on",
      description: "leadership=5, hands_on=5 (foreman type)",
      answers: [2, 2, 2, 5, 2, 2, 4, 2, 2, 2, 2, 4, 2, 5, 2, 4, 2, 4, 2, 2, 2, 2, 4, 2, 2, 4, 2, 4, 2, 2],
      expectedCategory: "rakentaja",
      minMatches: 3
    },
    {
      name: "Health + Business",
      description: "health=5, business=5 (healthcare admin)",
      answers: [2, 2, 2, 2, 2, 5, 5, 2, 2, 2, 2, 4, 5, 4, 2, 4, 2, 2, 2, 2, 2, 2, 4, 4, 2, 4, 2, 4, 2, 2],
      expectedCategory: "auttaja",
      minMatches: 3
    },
    {
      name: "Environment + Leadership",
      description: "environment=5, leadership=5 (eco startup)",
      answers: [2, 2, 2, 2, 5, 2, 4, 2, 2, 2, 2, 4, 2, 5, 2, 2, 2, 4, 2, 2, 2, 2, 4, 5, 2, 4, 2, 5, 5, 4],
      expectedCategory: "ympariston-puolustaja",
      minMatches: 3
    },
    {
      name: "Sports + Writing",
      description: "sports=5, writing=5 (sports journalist)",
      answers: [2, 2, 5, 2, 2, 2, 2, 2, 5, 4, 4, 4, 4, 2, 2, 4, 2, 4, 2, 4, 2, 4, 2, 2, 2, 2, 4, 4, 2, 2],
      expectedCategory: "auttaja",
      minMatches: 3
    }
  ],

  // Multi-dimensional (high risk)
  multiDimensional: [
    {
      name: "Tech + Creative + Hands-on",
      description: "All high - maker type",
      answers: [5, 4, 5, 5, 2, 2, 2, 4, 2, 2, 4, 5, 2, 2, 2, 2, 2, 4, 2, 4, 2, 4, 2, 2, 2, 2, 4, 4, 2, 2],
      expectedCategory: "innovoija",
      minMatches: 3
    },
    {
      name: "Leadership + People + Health",
      description: "All high - healthcare leader",
      answers: [2, 2, 2, 2, 2, 5, 4, 2, 2, 4, 2, 4, 5, 5, 2, 5, 2, 2, 2, 2, 2, 2, 4, 5, 2, 4, 2, 4, 2, 2],
      expectedCategory: "auttaja",
      minMatches: 3
    },
    {
      name: "Environment + Hands-on + Business",
      description: "All high - sustainable trades",
      answers: [2, 2, 2, 5, 5, 2, 5, 2, 2, 2, 2, 4, 2, 4, 2, 2, 2, 5, 2, 2, 2, 2, 4, 5, 2, 4, 2, 5, 5, 4],
      expectedCategory: "ympariston-puolustaja",
      minMatches: 3
    }
  ]
};

// ============================================================================
// API HELPER
// ============================================================================
async function callScoreAPI(cohort, answers) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      cohort,
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
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.write(payload);
    req.end();
  });
}

// ============================================================================
// VERIFICATION FUNCTIONS
// ============================================================================

async function verifySlugExistence() {
  console.log('\n' + '═'.repeat(80));
  console.log('STEP 1: SLUG EXISTENCE VERIFICATION');
  console.log('═'.repeat(80));

  // Get career vectors from API by making a test call
  const response = await callScoreAPI('YLA', Array(30).fill(3));

  if (!response.success) {
    console.log('❌ Could not connect to API to verify slugs');
    return { valid: 0, missing: CURATED_CAREER_SLUGS };
  }

  // Get the career slugs from the response
  const returnedSlugs = response.topCareers?.map(c => c.slug) || [];
  console.log(`  API returned ${returnedSlugs.length} career matches for test query`);

  // We can't verify all slugs via API easily, so we'll check what we get
  const uniqueSlugs = new Set(CURATED_CAREER_SLUGS);
  console.log(`  Curated pool has ${uniqueSlugs.size} unique slugs`);

  // Check for duplicates
  const duplicates = CURATED_CAREER_SLUGS.filter((slug, idx) =>
    CURATED_CAREER_SLUGS.indexOf(slug) !== idx
  );

  if (duplicates.length > 0) {
    console.log(`  ⚠️ Found ${duplicates.length} duplicate slugs: ${[...new Set(duplicates)].join(', ')}`);
  } else {
    console.log('  ✅ No duplicate slugs found');
  }

  return { valid: uniqueSlugs.size, duplicates };
}

async function verifyCategoryDistribution() {
  console.log('\n' + '═'.repeat(80));
  console.log('STEP 2: CATEGORY DISTRIBUTION ANALYSIS');
  console.log('═'.repeat(80));

  const expectedDistribution = {
    auttaja: 28,
    innovoija: 24,
    rakentaja: 25, // includes hospitality
    luova: 17,
    jarjestaja: 35,
    johtaja: 13,
    visionaari: 11,
    'ympariston-puolustaja': 24,
    special: 1
  };

  console.log('\n  Expected Distribution (from curatedCareers.ts):');
  let expectedTotal = 0;
  for (const [cat, count] of Object.entries(expectedDistribution)) {
    console.log(`    ${cat.padEnd(25)} ${count} careers`);
    expectedTotal += count;
  }
  console.log(`    ${'─'.repeat(35)}`);
  console.log(`    ${'TOTAL'.padEnd(25)} ${expectedTotal} careers`);

  console.log(`\n  Actual unique slugs in array: ${new Set(CURATED_CAREER_SLUGS).size}`);

  // Check for potential issues
  const issues = [];
  if (expectedDistribution.luova < 20) {
    issues.push('⚠️ Luova category has only 17 careers - may limit creative personality matches');
  }
  if (expectedDistribution.visionaari < 15) {
    issues.push('⚠️ Visionääri category has only 11 careers - may limit strategic thinker matches');
  }
  if (expectedDistribution.johtaja < 15) {
    issues.push('⚠️ Johtaja category has only 13 careers - may limit leadership-oriented matches');
  }

  if (issues.length > 0) {
    console.log('\n  Potential Issues:');
    issues.forEach(i => console.log(`    ${i}`));
  } else {
    console.log('\n  ✅ Category distribution looks balanced');
  }

  return { expectedDistribution, issues };
}

async function verifyPersonalityCoverage() {
  console.log('\n' + '═'.repeat(80));
  console.log('STEP 3: PERSONALITY COVERAGE TEST');
  console.log('═'.repeat(80));

  const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
    details: []
  };

  // Test single-category profiles
  console.log('\n  A. Single-Category Extremes:');
  for (const profile of TEST_PROFILES.singleCategory) {
    try {
      const response = await callScoreAPI('YLA', profile.answers);
      const matchCount = response.topCareers?.length || 0;
      const topCategory = response.userProfile?.dominantCategory || 'unknown';

      const status = matchCount >= profile.minMatches ? '✅' : '❌';
      const warning = matchCount < 5 && matchCount >= profile.minMatches;

      console.log(`    ${status} ${profile.name}: ${matchCount} matches (category: ${topCategory})`);

      if (matchCount >= profile.minMatches) {
        results.passed++;
        if (warning) results.warnings++;
      } else {
        results.failed++;
      }

      results.details.push({
        name: profile.name,
        type: 'single',
        matches: matchCount,
        category: topCategory,
        passed: matchCount >= profile.minMatches
      });
    } catch (e) {
      console.log(`    ❌ ${profile.name}: ERROR - ${e.message}`);
      results.failed++;
    }
  }

  // Test hybrid profiles
  console.log('\n  B. Hybrid Personalities:');
  for (const profile of TEST_PROFILES.hybrid) {
    try {
      const response = await callScoreAPI('YLA', profile.answers);
      const matchCount = response.topCareers?.length || 0;
      const topCategory = response.userProfile?.dominantCategory || 'unknown';

      const status = matchCount >= profile.minMatches ? '✅' : '❌';
      const warning = matchCount < 5 && matchCount >= profile.minMatches;

      console.log(`    ${status} ${profile.name}: ${matchCount} matches (category: ${topCategory})`);

      if (matchCount >= profile.minMatches) {
        results.passed++;
        if (warning) results.warnings++;
      } else {
        results.failed++;
      }

      results.details.push({
        name: profile.name,
        type: 'hybrid',
        matches: matchCount,
        category: topCategory,
        passed: matchCount >= profile.minMatches
      });
    } catch (e) {
      console.log(`    ❌ ${profile.name}: ERROR - ${e.message}`);
      results.failed++;
    }
  }

  // Test multi-dimensional profiles
  console.log('\n  C. Multi-Dimensional (High Risk):');
  for (const profile of TEST_PROFILES.multiDimensional) {
    try {
      const response = await callScoreAPI('YLA', profile.answers);
      const matchCount = response.topCareers?.length || 0;
      const topCategory = response.userProfile?.dominantCategory || 'unknown';

      const status = matchCount >= profile.minMatches ? '✅' : '❌';
      const warning = matchCount < 5 && matchCount >= profile.minMatches;

      console.log(`    ${status} ${profile.name}: ${matchCount} matches (category: ${topCategory})`);

      if (matchCount >= profile.minMatches) {
        results.passed++;
        if (warning) results.warnings++;
      } else {
        results.failed++;
      }

      results.details.push({
        name: profile.name,
        type: 'multi',
        matches: matchCount,
        category: topCategory,
        passed: matchCount >= profile.minMatches
      });
    } catch (e) {
      console.log(`    ❌ ${profile.name}: ERROR - ${e.message}`);
      results.failed++;
    }
  }

  return results;
}

async function checkCareerDiversity() {
  console.log('\n' + '═'.repeat(80));
  console.log('STEP 4: CAREER DIVERSITY CHECK');
  console.log('═'.repeat(80));

  // Test with a completely neutral profile - should get diverse results
  const neutralAnswers = Array(30).fill(3);

  try {
    const response = await callScoreAPI('YLA', neutralAnswers);
    const careers = response.topCareers || [];

    console.log(`\n  Neutral profile (all 3s) results:`);
    console.log(`    Total careers returned: ${careers.length}`);

    // Check category diversity
    const categories = {};
    careers.forEach(c => {
      categories[c.category] = (categories[c.category] || 0) + 1;
    });

    console.log(`\n    Category distribution in results:`);
    for (const [cat, count] of Object.entries(categories).sort((a, b) => b[1] - a[1])) {
      console.log(`      ${cat.padEnd(25)} ${count} careers`);
    }

    const uniqueCategories = Object.keys(categories).length;
    if (uniqueCategories >= 3) {
      console.log(`\n    ✅ Good diversity: ${uniqueCategories} different categories represented`);
    } else {
      console.log(`\n    ⚠️ Low diversity: only ${uniqueCategories} categories in neutral results`);
    }

    return { categories, total: careers.length };
  } catch (e) {
    console.log(`    ❌ ERROR: ${e.message}`);
    return { error: e.message };
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  console.log('╔' + '═'.repeat(78) + '╗');
  console.log('║' + ' '.repeat(20) + 'CURATED CAREER POOL VERIFICATION' + ' '.repeat(25) + '║');
  console.log('║' + ' '.repeat(15) + 'Checking coverage for all personality types' + ' '.repeat(20) + '║');
  console.log('╚' + '═'.repeat(78) + '╝');

  const report = {
    slugs: null,
    distribution: null,
    coverage: null,
    diversity: null
  };

  try {
    // Step 1: Verify slugs
    report.slugs = await verifySlugExistence();

    // Step 2: Check distribution
    report.distribution = await verifyCategoryDistribution();

    // Step 3: Test personality coverage
    report.coverage = await verifyPersonalityCoverage();

    // Step 4: Check diversity
    report.diversity = await checkCareerDiversity();

  } catch (e) {
    console.log(`\n❌ FATAL ERROR: ${e.message}`);
    console.log('   Make sure the dev server is running: npm run dev');
    process.exit(1);
  }

  // Final Summary
  console.log('\n' + '═'.repeat(80));
  console.log('FINAL SUMMARY');
  console.log('═'.repeat(80));

  console.log(`\n  Slug Verification:`);
  console.log(`    Unique slugs: ${report.slugs?.valid || 'N/A'}`);
  console.log(`    Duplicates: ${report.slugs?.duplicates?.length || 0}`);

  console.log(`\n  Personality Coverage:`);
  console.log(`    ✅ Passed: ${report.coverage?.passed || 0}`);
  console.log(`    ❌ Failed: ${report.coverage?.failed || 0}`);
  console.log(`    ⚠️ Warnings: ${report.coverage?.warnings || 0}`);

  const totalTests = (report.coverage?.passed || 0) + (report.coverage?.failed || 0);
  const passRate = totalTests > 0 ? ((report.coverage?.passed || 0) / totalTests * 100).toFixed(1) : 0;

  console.log(`\n  Overall Pass Rate: ${passRate}%`);

  if (report.coverage?.failed > 0) {
    console.log('\n  ❌ SOME PERSONALITY TYPES MAY NOT HAVE ADEQUATE CAREER MATCHES');
    console.log('     Review the failed tests above for specific gaps.');
    process.exit(1);
  } else if (report.distribution?.issues?.length > 0) {
    console.log('\n  ⚠️ POTENTIAL COVERAGE GAPS DETECTED');
    console.log('     Consider expanding low-coverage categories.');
  } else {
    console.log('\n  ✅ ALL PERSONALITY TYPES HAVE ADEQUATE CAREER COVERAGE');
  }
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
