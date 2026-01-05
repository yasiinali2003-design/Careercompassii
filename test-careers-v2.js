/**
 * FRESH CAREER MATCHING VERIFICATION TEST v2
 * Completely new personalities to verify career recommendations match profiles
 * Run with: node test-careers-v2.js
 */

const http = require('http');

// ========== FRESH TEST PERSONAS ==========
const TEST_PERSONAS = [
  // ========== YLA COHORT (13-16 years old) ==========
  // YLA Questions: Q0=tech/games, Q1=puzzles, Q2=creative, Q3=hands_on, Q4=nature/animals,
  // Q5=health, Q6=business, Q7=science, Q8=sports, Q9=teaching, Q10=food...

  {
    name: "Aino - Luonnon tutkija (YLA)",
    description: "Loves nature, animals, and science. Wants to work outdoors with environment.",
    cohort: 'YLA',
    expectedStrengths: ['ympäristö', 'luonto', 'tutkimus'],
    expectedCareers: ['biologi', 'ympäristö', 'luonto', 'tutkija', 'eläin'],
    unexpectedCareers: ['ohjelmisto', 'koodaaja', 'mainost', 'markkinoin'],
    // Q0=tech:2, Q1=puzzles:3, Q2=creative:3, Q3=hands_on:3, Q4=nature:5, Q5=health:4, Q6=business:2, Q7=science:5
    // Q8=sports:3, Q9=teaching:3, rest moderate
    answers: [2,3,3,3,5,4,2,5,3,3,3,3,4,3,3,4,3,4,3,4,3,4,3,3,5,3,4,3,3,4]
  },

  {
    name: "Eetu - Pelinkehittäjä-unelma (YLA)",
    description: "Dreams of making video games. Loves technology, puzzles, and creative work.",
    cohort: 'YLA',
    expectedStrengths: ['teknologia', 'luovuus', 'ongelmanratkaisu'],
    expectedCareers: ['peli', 'ohjelmisto', 'kehittäjä', 'koodaaja', 'suunnittelija'],
    unexpectedCareers: ['hoitaja', 'sairaanhoitaja', 'sosiaalityö'],
    // Q0=tech:5, Q1=puzzles:5, Q2=creative:5, Q3=hands_on:2, Q4=nature:2, Q5=health:2, Q6=business:3, Q7=science:4
    answers: [5,5,5,2,2,2,3,4,2,3,3,2,3,2,3,4,3,4,4,3,4,4,5,3,4,3,4,4,3,4]
  },

  {
    name: "Venla - Auttavainen opettaja (YLA)",
    description: "Loves helping others learn, very social, patient with kids.",
    cohort: 'YLA',
    expectedStrengths: ['opetus', 'ihmiskeskeisyys', 'auttaminen'],
    expectedCareers: ['opettaja', 'ohjaaja', 'kasvat', 'valmentaja', 'koulut'],
    unexpectedCareers: ['insinööri', 'ohjelmoija', 'kirjanpitäjä'],
    // Q0=tech:2, Q1=puzzles:3, Q2=creative:4, Q3=hands_on:2, Q4=nature:3, Q5=health:4, Q6=business:2, Q7=science:3
    // Q8=sports:3, Q9=teaching:5 (high!), Q10=food:3
    answers: [2,3,4,2,3,4,2,3,3,5,3,3,4,3,4,4,4,3,3,4,5,5,4,3,4,4,5,4,4,4]
  },

  {
    name: "Onni - Urheilullinen valmentaja (YLA)",
    description: "Very athletic, loves sports and helping teammates improve.",
    cohort: 'YLA',
    expectedStrengths: ['urheilu', 'valmennus', 'fyysinen'],
    expectedCareers: ['valmentaja', 'urheil', 'liikunta', 'personal', 'fysioterap'],
    unexpectedCareers: ['kirjailija', 'ohjelmoija', 'kirjanpitäjä'],
    // Q0=tech:2, Q1=puzzles:3, Q2=creative:3, Q3=hands_on:3, Q4=nature:3, Q5=health:5, Q6=business:2, Q7=science:3
    // Q8=sports:5 (high!), Q9=teaching:4
    answers: [2,3,3,3,3,5,2,3,5,4,3,3,3,4,4,5,4,3,3,4,4,4,4,3,4,4,4,4,4,4]
  },

  // ========== TASO2 COHORT (16-19 vocational) ==========
  // TASO2 Questions: Q0=IT, Q1=healthcare, Q2=construction, Q3=automotive, Q4=restaurant,
  // Q5=beauty, Q6=childcare, Q7=security, Q8=logistics, Q9=sales, Q10=electrical, Q11=agriculture...

  {
    name: "Niko - IT-tukihenkilö (TASO2)",
    description: "Wants to work in IT support, fix computers, help users with tech problems.",
    cohort: 'TASO2',
    expectedStrengths: ['teknologia', 'ongelmanratkaisu', 'IT'],
    expectedCareers: ['IT', 'tuki', 'järjestelmä', 'tieto', 'teknikko', 'asentaja'],
    unexpectedCareers: ['hoitaja', 'kampaaja', 'kokki'],
    // Q0=IT:5, Q1=health:2, Q2=construction:2, Q3=auto:3, Q4=restaurant:2, Q5=beauty:1, Q6=childcare:2
    // Q7=security:3, Q8=logistics:2, Q9=sales:2, Q10=electrical:4, Q11=agriculture:2
    answers: [5,2,2,3,2,1,2,3,2,2,4,2,2,2,2,3,3,4,3,4,3,3,5,3,4,3,4,4,3,4]
  },

  {
    name: "Emilia - Lähihoitaja (TASO2)",
    description: "Caring person who wants to help elderly and sick people.",
    cohort: 'TASO2',
    expectedStrengths: ['hoiva', 'terveys', 'ihmiskeskeisyys'],
    expectedCareers: ['hoitaja', 'lähihoitaja', 'sairaan', 'vanhus', 'koti'],
    unexpectedCareers: ['ohjelmoija', 'sähköasentaja', 'insinööri'],
    // Q0=IT:2, Q1=healthcare:5, Q2=construction:1, Q3=auto:1, Q4=restaurant:2, Q5=beauty:3, Q6=childcare:4
    // Q7=security:2, Q8=logistics:2, Q9=sales:2, Q10=electrical:1, Q11=agriculture:2, Q14=social:5
    answers: [2,5,1,1,2,3,4,2,2,2,1,2,2,2,5,3,4,3,3,4,5,4,4,4,4,4,5,4,5,4]
  },

  {
    name: "Aleksi - Rakennusmies (TASO2)",
    description: "Loves building things with hands, wants to work in construction.",
    cohort: 'TASO2',
    expectedStrengths: ['käytännön tekeminen', 'rakentaminen', 'fyysinen'],
    expectedCareers: ['rakenn', 'kirvesmies', 'asentaja', 'maalari', 'putki', 'mestari'],
    unexpectedCareers: ['hoitaja', 'opettaja', 'ohjelmoija'],
    // Q0=IT:2, Q1=healthcare:2, Q2=construction:5, Q3=auto:4, Q4=restaurant:2, Q5=beauty:1, Q6=childcare:1
    // Q7=security:3, Q8=logistics:3, Q9=sales:2, Q10=electrical:4, Q11=agriculture:3
    answers: [2,2,5,4,2,1,1,3,3,2,4,3,2,2,2,5,3,3,3,4,3,3,4,3,3,3,3,3,3,3]
  },

  {
    name: "Siiri - Kauneusalan yrittäjä (TASO2)",
    description: "Dreams of owning a beauty salon, loves makeup and hair styling.",
    cohort: 'TASO2',
    expectedStrengths: ['luovuus', 'kauneus', 'yrittäjyys'],
    expectedCareers: ['kampaaja', 'kauneus', 'kosmetologi', 'parturi', 'meikki'],
    unexpectedCareers: ['ohjelmoija', 'insinööri', 'kirjanpitäjä'],
    // Q0=IT:2, Q1=healthcare:2, Q2=construction:1, Q3=auto:1, Q4=restaurant:3, Q5=beauty:5, Q6=childcare:2
    // Q7=security:1, Q8=logistics:2, Q9=sales:4, Q10=electrical:1, Q11=agriculture:1, Q12=design:4
    answers: [2,2,1,1,3,5,2,1,2,4,1,1,4,2,3,3,4,3,3,3,3,3,4,4,3,4,4,3,4,3]
  },

  // ========== NUORI COHORT (19-30 career changers/young adults) ==========
  // NUORI Questions: Q0=software/data, Q1=healthcare, Q2=finance, Q3=creative, Q4=engineering,
  // Q5=teaching, Q6=management, Q7=sales, Q8=HR, Q9=consulting...

  {
    name: "Joonas - Ohjelmistokehittäjä (NUORI)",
    description: "Wants to transition into software development, analytical mind.",
    cohort: 'NUORI',
    expectedStrengths: ['teknologia', 'analyyttinen', 'ohjelmointi'],
    expectedCareers: ['ohjelmisto', 'kehittäjä', 'koodaaja', 'full-stack', 'back-end', 'data'],
    unexpectedCareers: ['hoitaja', 'opettaja', 'myyjä'],
    // Q0=software:5, Q1=healthcare:2, Q2=finance:3, Q3=creative:3, Q4=engineering:4, Q5=teaching:2
    // Q6=management:3, Q7=sales:2, Q8=HR:2, Q9=consulting:3
    answers: [5,2,3,3,4,2,3,2,2,3,4,3,3,3,3,3,4,4,3,4,3,3,5,3,4,3,4,4,3,4]
  },

  {
    name: "Henna - HR-asiantuntija (NUORI)",
    description: "People-focused professional, wants to work in human resources.",
    cohort: 'NUORI',
    expectedStrengths: ['ihmiskeskeisyys', 'organisointi', 'viestintä'],
    expectedCareers: ['HR', 'henkilöstö', 'rekrytointi', 'päällikkö', 'asiantuntija'],
    unexpectedCareers: ['ohjelmoija', 'insinööri', 'lääkäri'],
    // Q0=software:2, Q1=healthcare:2, Q2=finance:3, Q3=creative:3, Q4=engineering:2, Q5=teaching:4
    // Q6=management:5, Q7=sales:3, Q8=HR:5, Q9=consulting:4
    answers: [2,2,3,3,2,4,5,3,5,4,3,3,3,4,4,3,4,3,3,5,5,4,4,5,4,4,5,4,5,4]
  },

  {
    name: "Tuomas - Markkinointipäällikkö (NUORI)",
    description: "Creative business mind, wants to lead marketing campaigns.",
    cohort: 'NUORI',
    expectedStrengths: ['markkinointi', 'luovuus', 'johtaminen'],
    expectedCareers: ['markkinoin', 'päällikkö', 'brändi', 'viestintä', 'mainos', 'johtaja'],
    unexpectedCareers: ['hoitaja', 'insinööri', 'lähihoitaja'],
    // Q0=software:3, Q1=healthcare:2, Q2=finance:3, Q3=creative:5, Q4=engineering:2, Q5=teaching:3
    // Q6=management:5, Q7=sales:4, Q8=HR:3, Q9=consulting:4
    answers: [3,2,3,5,2,3,5,4,3,4,3,3,4,4,4,4,4,3,3,5,4,3,5,4,4,4,5,4,5,4]
  },

  {
    name: "Laura - Sairaanhoitaja-esimies (NUORI)",
    description: "Experienced nurse wanting to move into healthcare management.",
    cohort: 'NUORI',
    expectedStrengths: ['terveys', 'johtaminen', 'hoitotyö'],
    expectedCareers: ['osastonhoitaja', 'johtaja', 'päällikkö', 'terveys', 'hoitaja', 'esimies'],
    unexpectedCareers: ['ohjelmoija', 'insinööri', 'mainostaja'],
    // Q0=software:2, Q1=healthcare:5, Q2=finance:2, Q3=creative:2, Q4=engineering:2, Q5=teaching:4
    // Q6=management:5, Q7=sales:2, Q8=HR:3, Q9=consulting:3
    answers: [2,5,2,2,2,4,5,2,3,3,3,3,3,4,5,3,4,4,3,5,4,3,4,5,4,4,5,4,5,4]
  }
];

async function testPersona(persona) {
  return new Promise((resolve, reject) => {
    const testAnswers = persona.answers.map((value, index) => ({
      questionIndex: index,
      score: value,
      cohort: persona.cohort
    }));

    const postData = JSON.stringify({
      answers: testAnswers,
      cohort: persona.cohort
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/score',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (e) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(postData);
    req.end();
  });
}

function analyzeResult(persona, result) {
  const careers = result.topCareers || [];
  const careerTitles = careers.map(c => c.title.toLowerCase());
  const strengths = result.userProfile?.topStrengths || [];
  const educationPath = result.educationPath || {};

  console.log('');
  console.log(`📋 STRENGTHS: ${strengths.join(', ')}`);
  console.log(`🎓 EDUCATION: ${educationPath.primary || 'N/A'} (${educationPath.confidence || 'N/A'})`);
  console.log('');

  console.log('💼 TOP 5 CAREERS:');
  careers.slice(0, 5).forEach((c, i) => {
    console.log(`   ${i+1}. ${c.title} [${c.category}]`);
  });
  console.log('');

  // Analyze matches
  let issues = [];
  let passes = [];

  // Check expected careers
  const foundExpected = persona.expectedCareers.filter(exp =>
    careerTitles.some(title => title.includes(exp.toLowerCase()))
  );
  const missingExpected = persona.expectedCareers.filter(exp =>
    !careerTitles.some(title => title.includes(exp.toLowerCase()))
  );

  // Check unexpected careers (should NOT appear)
  const foundUnexpected = persona.unexpectedCareers.filter(unexp =>
    careerTitles.some(title => title.includes(unexp.toLowerCase()))
  );

  // Calculate match rate
  const matchRate = foundExpected.length / persona.expectedCareers.length;

  if (foundExpected.length > 0) {
    passes.push(`✅ Found ${foundExpected.length}/${persona.expectedCareers.length} expected: ${foundExpected.join(', ')}`);
  }

  if (missingExpected.length > 0) {
    issues.push(`⚠️ Missing: ${missingExpected.join(', ')}`);
  }

  if (foundUnexpected.length > 0) {
    issues.push(`❌ PROBLEM - Found unexpected: ${foundUnexpected.join(', ')}`);
  }

  // Determine pass/fail
  const passed = matchRate >= 0.2 && foundUnexpected.length === 0;

  return {
    passed,
    matchRate,
    passes,
    issues,
    careers: careers.map(c => c.title),
    strengths,
    educationPath: educationPath.primary
  };
}

async function runAllTests() {
  console.log('═'.repeat(80));
  console.log('     FRESH CAREER MATCHING VERIFICATION TEST v2');
  console.log('     Testing completely new personalities');
  console.log('═'.repeat(80));
  console.log('');

  let totalPassed = 0;
  let totalTests = 0;
  const results = [];

  for (const persona of TEST_PERSONAS) {
    totalTests++;
    console.log('─'.repeat(80));
    console.log(`🧑 ${persona.name}`);
    console.log(`   "${persona.description}"`);
    console.log(`   Cohort: ${persona.cohort}`);

    try {
      const result = await testPersona(persona);
      const analysis = analyzeResult(persona, result);

      results.push({
        name: persona.name,
        cohort: persona.cohort,
        passed: analysis.passed,
        matchRate: analysis.matchRate,
        careers: analysis.careers.slice(0, 5)
      });

      analysis.passes.forEach(p => console.log(`   ${p}`));
      analysis.issues.forEach(i => console.log(`   ${i}`));

      if (analysis.passed) {
        totalPassed++;
        console.log(`   ✅ PASSED (${Math.round(analysis.matchRate * 100)}% match)`);
      } else {
        console.log(`   ❌ FAILED (${Math.round(analysis.matchRate * 100)}% match)`);
      }
    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}`);
      results.push({
        name: persona.name,
        cohort: persona.cohort,
        passed: false,
        error: error.message
      });
    }
  }

  console.log('');
  console.log('═'.repeat(80));
  console.log(`     FINAL RESULTS: ${totalPassed}/${totalTests} tests passed (${Math.round(totalPassed/totalTests*100)}%)`);
  console.log('═'.repeat(80));

  // Summary table
  console.log('');
  console.log('SUMMARY BY COHORT:');
  console.log('─'.repeat(80));

  ['YLA', 'TASO2', 'NUORI'].forEach(cohort => {
    const cohortResults = results.filter(r => r.cohort === cohort);
    const cohortPassed = cohortResults.filter(r => r.passed).length;
    console.log(`${cohort}: ${cohortPassed}/${cohortResults.length} passed`);
    cohortResults.forEach(r => {
      const status = r.passed ? '✅' : '❌';
      console.log(`  ${status} ${r.name.split(' - ')[1] || r.name}`);
      if (r.careers) {
        console.log(`     → ${r.careers.slice(0, 3).join(', ')}`);
      }
    });
  });

  return { passed: totalPassed, total: totalTests };
}

// Run tests
runAllTests().then(results => {
  process.exit(results.passed === results.total ? 0 : 1);
}).catch(err => {
  console.error('Test runner failed:', err);
  process.exit(1);
});
