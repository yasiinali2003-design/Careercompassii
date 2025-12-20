/**
 * Real User Simulation Test
 * Simulates actual users taking the career test end-to-end
 * Tests all cohorts (YLA, TASO2, NUORI) with realistic personas
 */

const http = require('http');

// Real-life personas with detailed backstories
const REAL_LIFE_PERSONAS = [
  // ==================== YLA COHORT (14-16 year olds) ====================
  {
    id: 'yla-emma-tech',
    name: 'Emma (15v)',
    backstory: 'Emma rakastaa tietokoneita ja koodaamista. Hän on oppinut itse Python-ohjelmointia YouTubesta ja tekee pieniä pelejä. Koulussa matikka ja fysiikka ovat lempiaineita.',
    cohort: 'YLA',
    expectedType: 'innovoija',
    // Q0: tech ✓, Q1: problem_solving ✓, Q7: analytical ✓, Q11: innovation ✓
    // Low on: creative arts, helping others, outdoor, business
    answers: [5, 5, 2, 2, 2, 2, 2, 5, 3, 4, 3, 5, 3, 2, 3, 3, 2, 2, 3, 4, 4, 3, 3, 3, 3, 4, 3, 3, 3, 3],
  },
  {
    id: 'yla-sara-nurse',
    name: 'Sara (16v)',
    backstory: 'Sara haluaa auttaa ihmisiä. Hän on vapaaehtoinen SPR:ssä ja haaveilee sairaanhoitajan ammatista. Hän on empaattinen ja hyvä kuuntelemaan.',
    cohort: 'YLA',
    expectedType: 'auttaja',
    // Q5: health ✓, Q8: people ✓, Q12: helping ✓, Q20: teamwork ✓
    // Low on: tech, business, leadership, creative arts
    answers: [2, 3, 2, 2, 2, 5, 2, 2, 5, 3, 2, 2, 5, 2, 3, 3, 2, 3, 3, 3, 5, 3, 3, 4, 3, 3, 3, 2, 3, 3],
  },
  {
    id: 'yla-mikko-art',
    name: 'Mikko (15v)',
    backstory: 'Mikko piirtää jatkuvasti - sarjakuvia, hahmoja, maisemia. Hän haaveilee pelisuunnittelijasta tai kuvittajasta. Vapaa-ajalla hän tekee digitaalista taidetta.',
    cohort: 'YLA',
    expectedType: 'luova',
    // Q2: creative ✓, Q10: creative ✓, Q19: flexibility ✓, Q22: independence ✓
    // Low on: tech, analytical, organization, hands-on
    answers: [2, 2, 5, 2, 2, 2, 2, 2, 2, 3, 5, 2, 3, 2, 2, 2, 2, 2, 5, 3, 3, 3, 5, 4, 2, 4, 3, 3, 4, 2],
  },
  {
    id: 'yla-juhani-builder',
    name: 'Juhani (16v)',
    backstory: 'Juhani korjaa mopoja kavereille ja rakentaa isän kanssa terasseja. Hän tykkää käsillä tekemisestä ja ulkona olemisesta. Teoriapuoli koulussa ei kiinnosta.',
    cohort: 'YLA',
    expectedType: 'rakentaja',
    // Q3: hands_on ✓, Q17: outdoor ✓, Q29: stability ✓
    // Low on: tech, creative, business, organization, analytical
    answers: [2, 2, 2, 5, 2, 2, 1, 2, 3, 2, 2, 2, 2, 2, 1, 1, 5, 5, 3, 3, 4, 2, 2, 2, 3, 2, 3, 2, 2, 5],
  },
  {
    id: 'yla-liisa-leader',
    name: 'Liisa (15v)',
    backstory: 'Liisa on luokan puheenjohtaja ja oppilaskunnan jäsen. Hän järjestää tapahtumia ja tykkää olla vastuussa projekteista. Tulevaisuudessa hän näkee itsensä johtotehtävissä.',
    cohort: 'YLA',
    expectedType: 'johtaja',
    // Q6: business ✓, Q13: leadership ✓, Q21: social ✓, Q25: advancement ✓, Q27: entrepreneurship ✓
    // Low on: tech, creative arts, helping, environment
    answers: [2, 3, 3, 2, 2, 2, 5, 3, 3, 4, 3, 2, 3, 5, 3, 3, 3, 3, 3, 4, 3, 5, 3, 3, 3, 5, 3, 5, 3, 3],
  },
  {
    id: 'yla-anna-organizer',
    name: 'Anna (14v)',
    backstory: 'Anna rakastaa järjestelmällisyyttä - hänen huoneensa on aina siisti ja tehtävät tehty ajoissa. Hän pitää listojen tekemisestä ja asioiden suunnittelusta.',
    cohort: 'YLA',
    expectedType: 'jarjestaja',
    // Q16: organization ✓, Q18: precision ✓, Q26: planning ✓, Q28: routine ✓
    // Low on: creative, outdoor, innovation, entrepreneurship
    answers: [3, 3, 2, 2, 2, 3, 3, 3, 3, 3, 2, 2, 3, 3, 3, 3, 5, 2, 5, 3, 3, 3, 3, 3, 3, 3, 5, 2, 5, 3],
  },
  {
    id: 'yla-veeti-nature',
    name: 'Veeti (16v)',
    backstory: 'Veeti on luontoihminen - hän retkeilee, kalastaa ja on huolissaan ilmastonmuutoksesta. Hän haaveilee työstä, jossa voi suojella luontoa.',
    cohort: 'YLA',
    expectedType: 'ympariston-puolustaja',
    // Q4: environment ✓, Q17: outdoor ✓, Q23: impact ✓
    // Low on: tech, business, leadership, financial
    answers: [2, 2, 3, 2, 5, 2, 2, 3, 2, 3, 2, 3, 3, 2, 3, 3, 3, 5, 3, 4, 3, 3, 4, 5, 2, 3, 4, 3, 4, 3],
  },

  // ==================== TASO2 COHORT (17-20 year olds, vocational) ====================
  // TASO2 Questions:
  // Q0: IT/Software (tech), Q1: Healthcare (health), Q2: Construction (hands_on), Q3: Automotive (hands_on)
  // Q4: Restaurant (creative), Q5: Beauty (creative), Q6: Childcare (people), Q7: Security (leadership)
  // Q8: Transport (organization), Q9: Sales (business), Q10: Electrical (technology), Q11: Agriculture (environment)
  // Q12: Design/Media (creative), Q13: Office (organization), Q14: Teamwork (people), Q15: Outdoor (outdoor)
  // Q16: Flexibility (flexibility), Q17: Social (social), Q18: Precision (precision), Q19: Responsibility (structure)
  // Q20: Performance (performance), Q21: Helping (helping), Q22: Routine (routine), Q23: Stability (stability)
  // Q24: Career growth (growth), Q25: Impact (impact), Q26: Work-life balance (work_life_balance)
  // Q27: Entrepreneurship (entrepreneurship), Q28: International (global), Q29: Global (global)
  {
    id: 'taso2-tomi-it',
    name: 'Tomi (18v)',
    backstory: 'Tomi opiskelee datanomiksi. Hän on kiinnostunut kyberturvallisuudesta ja haluaa työskennellä IT-alalla. Hän on analyyttinen ongelmanratkaisija.',
    cohort: 'TASO2',
    expectedType: 'innovoija',
    // TASO2 INNOVOIJA: Q0 IT/Software (tech), Q10 Electrical (tech) - these are the key signals
    // Low on: Q1 healthcare, Q2 construction, Q3 automotive, Q4 restaurant, Q5 beauty, Q6 childcare, Q12 creative
    answers: [5, 2, 2, 2, 2, 2, 2, 3, 2, 2, 5, 2, 2, 3, 3, 2, 3, 3, 4, 3, 4, 3, 3, 3, 4, 3, 3, 3, 4, 3],
  },
  {
    id: 'taso2-henna-care',
    name: 'Henna (19v)',
    backstory: 'Henna opiskelee lähihoitajaksi ja rakastaa vanhustyötä. Hän on kärsivällinen, empaattinen ja nauttii ihmisten auttamisesta päivittäin.',
    cohort: 'TASO2',
    expectedType: 'auttaja',
    // TASO2 AUTTAJA: Q1 Healthcare (health), Q6 Childcare (people), Q14 Teamwork (people), Q21 Helping (helping)
    // Low on: Q0 IT, Q2 construction, Q3 automotive, Q4 restaurant, Q5 beauty, Q12 creative
    answers: [2, 5, 2, 2, 2, 2, 5, 2, 2, 2, 2, 2, 2, 2, 5, 3, 3, 4, 3, 3, 3, 5, 3, 4, 3, 4, 3, 2, 3, 3],
  },
  {
    id: 'taso2-jesse-media',
    name: 'Jesse (18v)',
    backstory: 'Jesse opiskelee media-alaa ja tekee YouTube-videoita. Hän on luova, tykkää editoida ja keksiä uutta sisältöä. Haaveilee elokuva-alasta.',
    cohort: 'TASO2',
    expectedType: 'luova',
    // Q3: creative ✓, Q12: independence ✓, Q20: flexibility ✓
    answers: [2, 2, 2, 5, 2, 2, 2, 3, 2, 2, 3, 2, 5, 2, 3, 2, 3, 2, 3, 3, 5, 3, 3, 4, 2, 4, 4, 3, 3, 3],
  },
  {
    id: 'taso2-petri-mechanic',
    name: 'Petri (20v)',
    backstory: 'Petri on autonasentajaopiskelija. Hän on aina ollut kiinnostunut moottoreista ja korjaamisesta. Käytännön työ on hänen juttunsa.',
    cohort: 'TASO2',
    expectedType: 'rakentaja',
    // Q3: automotive ✓, Q15: outdoor/physical ✓, Q24: stability ✓
    answers: [2, 2, 2, 5, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 5, 3, 3, 3, 3, 4, 3, 2, 2, 5, 3, 3, 2, 3, 3],
  },
  {
    id: 'taso2-maria-business',
    name: 'Maria (19v)',
    backstory: 'Maria opiskelee merkonomiksi ja on kiinnostunut yrittäjyydestä. Hän on jo perustanut pienen verkkokaupan ja haluaa johtaa omaa yritystä.',
    cohort: 'TASO2',
    expectedType: 'johtaja',
    // Q7: leadership ✓, Q9: business ✓, Q17: social ✓, Q27: entrepreneurship ✓
    answers: [2, 2, 2, 2, 2, 2, 2, 5, 2, 5, 3, 2, 3, 3, 3, 3, 2, 5, 3, 3, 4, 3, 3, 3, 3, 4, 3, 5, 3, 3],
  },
  {
    id: 'taso2-sanna-admin',
    name: 'Sanna (18v)',
    backstory: 'Sanna opiskelee toimistotöitä. Hän on tarkka, järjestelmällinen ja pitää rutiineista. Hän nauttii kun asiat ovat järjestyksessä.',
    cohort: 'TASO2',
    expectedType: 'jarjestaja',
    // Q8: organization ✓, Q13: office ✓, Q18: precision ✓, Q22: routine ✓
    answers: [2, 2, 2, 2, 2, 2, 2, 2, 5, 2, 2, 2, 2, 5, 3, 3, 3, 3, 5, 3, 3, 3, 5, 3, 4, 3, 3, 2, 3, 3],
  },
  {
    id: 'taso2-lauri-farmer',
    name: 'Lauri (20v)',
    backstory: 'Lauri tulee maatilalta ja opiskelee agrologiksi. Hän haluaa jatkaa maatilaa kestävällä tavalla ja on kiinnostunut luomuviljelystä.',
    cohort: 'TASO2',
    expectedType: 'ympariston-puolustaja',
    // Q11: agriculture/environment ✓, Q15: outdoor ✓, Q25: impact ✓
    answers: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5, 2, 2, 2, 5, 3, 3, 3, 3, 3, 3, 3, 3, 2, 5, 3, 3, 3, 3],
  },

  // ==================== NUORI COHORT (21-30 year olds, university/working) ====================
  {
    id: 'nuori-aleksi-dev',
    name: 'Aleksi (24v)',
    backstory: 'Aleksi on ohjelmistokehittäjä, joka rakastaa ongelmanratkaisua ja uusien teknologioiden oppimista. Hän työskentelee startupissa.',
    cohort: 'NUORI',
    expectedType: 'innovoija',
    // Q0: software ✓, Q4: innovation ✓, Q7: analytical ✓, Q9: research ✓
    answers: [5, 2, 3, 2, 4, 2, 2, 5, 3, 5, 3, 2, 4, 3, 3, 2, 3, 4, 3, 4, 4, 3, 4, 3, 3, 5, 4, 4, 3, 3],
  },
  {
    id: 'nuori-emilia-nurse',
    name: 'Emilia (26v)',
    backstory: 'Emilia on sairaanhoitaja, joka nauttii potilastyöstä. Hän on empaattinen ja haluaa tehdä merkityksellistä työtä auttamalla muita.',
    cohort: 'NUORI',
    expectedType: 'auttaja',
    // Q1: health ✓, Q5: education/care ✓, Q6: HR/people ✓, Q14: teamwork ✓, Q23: social_impact ✓
    answers: [2, 5, 2, 2, 2, 5, 5, 2, 2, 2, 2, 3, 3, 3, 5, 3, 3, 3, 3, 3, 4, 3, 3, 5, 3, 4, 3, 3, 3, 3],
  },
  {
    id: 'nuori-roosa-designer',
    name: 'Roosa (25v)',
    backstory: 'Roosa on graafinen suunnittelija, joka tekee myös freelance-töitä. Hän arvostaa luovaa vapautta ja itsenäistä työskentelyä.',
    cohort: 'NUORI',
    expectedType: 'luova',
    // Q3: creative ✓, Q12: independence ✓, Q26: autonomy ✓
    answers: [2, 2, 2, 5, 3, 3, 3, 2, 3, 2, 2, 2, 5, 2, 3, 2, 4, 3, 3, 3, 3, 4, 3, 4, 3, 4, 5, 4, 4, 4],
  },
  {
    id: 'nuori-ville-engineer',
    name: 'Ville (27v)',
    backstory: 'Ville on konetekniikan insinööri teollisuusyrityksessä. Hän nauttii käytännön suunnittelusta ja tuotteiden kehittämisestä.',
    cohort: 'NUORI',
    expectedType: 'rakentaja',
    // Q4: engineering ✓, Q24: stability ✓
    answers: [2, 2, 2, 2, 5, 2, 2, 2, 2, 2, 2, 2, 3, 2, 3, 2, 2, 2, 3, 3, 4, 3, 3, 3, 5, 4, 4, 3, 2, 3],
  },
  {
    id: 'nuori-jenna-pm',
    name: 'Jenna (28v)',
    backstory: 'Jenna on projektipäällikkö IT-yrityksessä. Hän nauttii tiimien johtamisesta ja strategisesta suunnittelusta.',
    cohort: 'NUORI',
    expectedType: 'johtaja',
    // Q2: finance ✓, Q8: sales ✓, Q10: project mgmt ✓, Q13: management ✓, Q22: advancement ✓
    answers: [3, 2, 4, 2, 2, 3, 4, 3, 5, 2, 5, 2, 3, 5, 4, 3, 5, 5, 4, 4, 4, 3, 5, 3, 3, 4, 4, 5, 4, 4],
  },
  {
    id: 'nuori-riikka-analyst',
    name: 'Riikka (25v)',
    backstory: 'Riikka on data-analyytikko pankissa. Hän on tarkka ja järjestelmällinen, ja nauttii tiedon järjestelystä ja raportoinnista.',
    cohort: 'NUORI',
    expectedType: 'jarjestaja',
    // Q2: finance ✓, Q15: structure ✓, Q18: precision ✓, Q24: stability ✓
    answers: [2, 2, 5, 2, 2, 2, 2, 3, 3, 2, 2, 2, 3, 2, 3, 5, 2, 4, 5, 3, 4, 3, 3, 3, 5, 4, 4, 3, 2, 3],
  },
  {
    id: 'nuori-otto-environmental',
    name: 'Otto (26v)',
    backstory: 'Otto on ympäristökonsultti, joka työskentelee kestävän kehityksen parissa. Hän on intohimoinen ilmastoasioista ja haluaa vaikuttaa.',
    cohort: 'NUORI',
    expectedType: 'ympariston-puolustaja',
    // Q11: sustainability ✓, Q23: social_impact ✓, Q25: growth ✓
    answers: [2, 2, 2, 3, 3, 3, 3, 3, 2, 4, 2, 5, 3, 2, 3, 3, 3, 4, 3, 3, 2, 4, 3, 5, 3, 4, 4, 3, 4, 4],
  },
];

// API helper
function callAPI(endpoint, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: endpoint,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Convert raw answer array to API format
function formatAnswers(rawAnswers) {
  return rawAnswers.map((score, index) => ({
    questionIndex: index,
    score: score,
  }));
}

// Normalize category for comparison
function normalizeCategory(cat) {
  if (!cat) return null;
  return cat.toLowerCase()
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/-/g, '')
    .replace(/\s+/g, '');
}

// Run a single test
async function runPersonaTest(persona) {
  const result = {
    persona: persona,
    passed: false,
    actualCategory: null,
    confidence: null,
    topCategories: [],
    careers: [],
    analysis: '',
  };

  try {
    // Call the scoring API with properly formatted answers
    const response = await callAPI('/api/score', {
      answers: formatAnswers(persona.answers),
      cohort: persona.cohort,
    });

    if (response.status !== 200) {
      result.analysis = `API Error: ${response.status} - ${JSON.stringify(response.data)}`;
      return result;
    }

    const data = response.data;

    // Extract primary category from top career
    const topCareer = data.topCareers?.[0];
    result.actualCategory = topCareer?.category || null;
    result.confidence = topCareer?.confidence || null;
    result.careers = data.topCareers?.slice(0, 5) || [];

    // Build category breakdown from careers
    const categoryCounts = {};
    for (const career of data.topCareers || []) {
      const cat = career.category;
      if (cat) {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      }
    }
    result.topCategories = Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    // Check if result matches expected
    const expectedNorm = normalizeCategory(persona.expectedType);
    const actualNorm = normalizeCategory(result.actualCategory);
    result.passed = expectedNorm === actualNorm;

    // Build analysis
    if (result.passed) {
      result.analysis = `PASS: Got ${result.actualCategory} as expected`;
    } else {
      result.analysis = `FAIL: Expected ${persona.expectedType}, got ${result.actualCategory}`;
    }

  } catch (error) {
    result.analysis = `Error: ${error.message}`;
  }

  return result;
}

// Format percentage bar
function formatBar(value, max = 100, width = 20) {
  const filled = Math.round((value / max) * width);
  return '█'.repeat(filled) + '░'.repeat(width - filled);
}

// Main test runner
async function runAllTests() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  REAL USER SIMULATION TEST - END-TO-END CAREER MATCHING');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const results = {
    YLA: [],
    TASO2: [],
    NUORI: [],
  };

  // Run all tests
  for (const persona of REAL_LIFE_PERSONAS) {
    process.stdout.write(`Testing ${persona.name.padEnd(20)}... `);
    const result = await runPersonaTest(persona);
    results[persona.cohort].push(result);
    console.log(result.passed ? '✅' : '❌');
  }

  console.log('\n');

  // Detailed results by cohort
  for (const cohort of ['YLA', 'TASO2', 'NUORI']) {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`  ${cohort} COHORT RESULTS`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    for (const result of results[cohort]) {
      const persona = result.persona;

      console.log(`┌─────────────────────────────────────────────────────────────┐`);
      console.log(`│ ${persona.name} - ${persona.backstory.substring(0, 50)}...`);
      console.log(`├─────────────────────────────────────────────────────────────┤`);
      console.log(`│ Expected: ${persona.expectedType.toUpperCase().padEnd(20)} ${result.analysis}`);
      console.log(`│ Got:      ${(result.actualCategory || 'N/A').toUpperCase().padEnd(20)} Confidence: ${result.confidence || 'N/A'}`);

      if (result.topCategories.length > 0) {
        console.log(`├─────────────────────────────────────────────────────────────┤`);
        console.log(`│ Category Breakdown:`);
        for (const cat of result.topCategories) {
          const pct = Math.round(cat.percentage || cat.score || 0);
          console.log(`│   ${cat.category?.padEnd(22) || 'Unknown'} ${formatBar(pct)} ${pct}%`);
        }
      }

      if (result.careers.length > 0) {
        console.log(`├─────────────────────────────────────────────────────────────┤`);
        console.log(`│ Top Career Recommendations:`);
        for (let i = 0; i < Math.min(3, result.careers.length); i++) {
          const career = result.careers[i];
          console.log(`│   ${(i + 1)}. ${career.title || career.slug || 'Unknown'}`);
        }
      }

      console.log(`└─────────────────────────────────────────────────────────────┘\n`);
    }
  }

  // Summary statistics
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════\n');

  let totalPassed = 0;
  let totalTests = 0;

  for (const cohort of ['YLA', 'TASO2', 'NUORI']) {
    const cohortResults = results[cohort];
    const passed = cohortResults.filter(r => r.passed).length;
    const total = cohortResults.length;
    totalPassed += passed;
    totalTests += total;

    const pct = Math.round((passed / total) * 100);
    console.log(`${cohort.padEnd(8)} ${formatBar(pct)} ${passed}/${total} (${pct}%)`);

    // Show failures
    const failures = cohortResults.filter(r => !r.passed);
    if (failures.length > 0) {
      for (const f of failures) {
        console.log(`         ⚠️  ${f.persona.name}: expected ${f.persona.expectedType}, got ${f.actualCategory}`);
      }
    }
  }

  const overallPct = Math.round((totalPassed / totalTests) * 100);
  console.log(`\nOVERALL  ${formatBar(overallPct)} ${totalPassed}/${totalTests} (${overallPct}%)`);

  // Category accuracy breakdown
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  ACCURACY BY PERSONALITY TYPE');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const categoryStats = {};
  for (const cohort of ['YLA', 'TASO2', 'NUORI']) {
    for (const result of results[cohort]) {
      const expected = result.persona.expectedType;
      if (!categoryStats[expected]) {
        categoryStats[expected] = { passed: 0, total: 0, failures: [] };
      }
      categoryStats[expected].total++;
      if (result.passed) {
        categoryStats[expected].passed++;
      } else {
        categoryStats[expected].failures.push({
          name: result.persona.name,
          got: result.actualCategory,
        });
      }
    }
  }

  for (const [cat, stats] of Object.entries(categoryStats).sort((a, b) => b[1].passed/b[1].total - a[1].passed/a[1].total)) {
    const pct = Math.round((stats.passed / stats.total) * 100);
    const status = pct === 100 ? '✅' : pct >= 67 ? '⚠️' : '❌';
    console.log(`${status} ${cat.padEnd(22)} ${formatBar(pct)} ${stats.passed}/${stats.total} (${pct}%)`);
    for (const f of stats.failures) {
      console.log(`   └─ ${f.name} got "${f.got}" instead`);
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  TEST COMPLETE');
  console.log('═══════════════════════════════════════════════════════════════\n');

  return { passed: totalPassed, total: totalTests, percentage: overallPct };
}

// Run
runAllTests()
  .then(summary => {
    process.exit(summary.percentage >= 80 ? 0 : 1);
  })
  .catch(err => {
    console.error('Test failed:', err);
    process.exit(1);
  });
