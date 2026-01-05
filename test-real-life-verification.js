/**
 * REAL-LIFE VERIFICATION TEST
 * 5 completely new, realistic personas across all cohorts
 * Thorough verification of career matching accuracy
 */

const http = require('http');

const TEST_PERSONAS = [
  // ========== PERSONA 1: YLA - Artistic Teen ==========
  {
    name: "Ella - Taiteellinen lukiolainen (YLA)",
    description: "15-year-old who loves drawing, painting, and visual arts. Dreams of becoming a graphic designer or illustrator. Not interested in sports or technical subjects.",
    cohort: 'YLA',
    expectedStrengths: ['luovuus', 'taide', 'visuaalinen'],
    expectedCareers: ['graafinen', 'kuvittaja', 'taiteilija', 'suunnittelija', 'muotoilija', 'valokuvaaja'],
    unexpectedCareers: ['insinööri', 'lääkäri', 'kirjanpitäjä', 'sähköasentaja', 'valmentaja'],
    // YLA Q mapping:
    // Q0=tech:2, Q1=puzzles:3, Q2=creative:5(!), Q3=hands_on:3, Q4=nature:2, Q5=health:2
    // Q6=business:2, Q7=science:2, Q8=sports:1, Q9=teaching:3
    // High on creative (Q2), moderate on teaching (helping others learn art)
    answers: [2,3,5,3,2,2,2,2,1,3,3,3,4,3,3,4,3,3,3,4,3,5,4,3,4,3,4,4,4,4]
  },

  // ========== PERSONA 2: YLA - Science Enthusiast ==========
  {
    name: "Veeti - Luonnontieteistä kiinnostunut (YLA)",
    description: "16-year-old fascinated by chemistry and biology. Loves lab experiments and wants to become a researcher or work in pharmaceuticals. Very analytical mind.",
    cohort: 'YLA',
    expectedStrengths: ['analyyttinen', 'tutkimus', 'tiede'],
    expectedCareers: ['tutkija', 'kemisti', 'biologi', 'laboratorio', 'lääke', 'farmaseut'],
    unexpectedCareers: ['kampaaja', 'myyjä', 'valmentaja', 'muusikko'],
    // YLA Q mapping:
    // Q0=tech:3, Q1=puzzles:5(!), Q2=creative:2, Q3=hands_on:3, Q4=nature:4, Q5=health:4
    // Q6=business:2, Q7=science:5(!), Q8=sports:2, Q9=teaching:3
    answers: [3,5,2,3,4,4,2,5,2,3,3,3,3,3,4,5,3,5,4,3,4,3,4,3,4,3,4,5,4,4]
  },

  // ========== PERSONA 3: TASO2 - Automotive Mechanic ==========
  {
    name: "Jere - Autoalan opiskelija (TASO2)",
    description: "17-year-old who loves cars and engines. Wants to become an auto mechanic or work in automotive industry. Very hands-on, enjoys fixing things.",
    cohort: 'TASO2',
    expectedStrengths: ['käytännön tekeminen', 'autot', 'tekniikka'],
    expectedCareers: ['automekaanikko', 'asentaja', 'korjaamo', 'auto', 'huolto', 'teknikko'],
    unexpectedCareers: ['hoitaja', 'opettaja', 'kampaaja', 'kirjanpitäjä'],
    // TASO2 Q mapping:
    // Q0=IT:2, Q1=health:1, Q2=construction:3, Q3=automotive:5(!), Q4=restaurant:2, Q5=beauty:1
    // Q6=childcare:1, Q7=security:2, Q8=logistics:3, Q9=sales:2, Q10=electrical:4, Q11=agriculture:2
    answers: [2,1,3,5,2,1,1,2,3,2,4,2,2,2,2,4,3,4,3,3,3,3,4,3,3,3,3,3,3,3]
  },

  // ========== PERSONA 4: TASO2 - Restaurant Industry ==========
  {
    name: "Iida - Ravintola-alan unelma (TASO2)",
    description: "18-year-old passionate about cooking and baking. Dreams of becoming a chef or opening own restaurant. Creative with food, loves hospitality.",
    cohort: 'TASO2',
    expectedStrengths: ['ruoanlaitto', 'luovuus', 'palvelu'],
    expectedCareers: ['kokki', 'ravintola', 'leipuri', 'kondiittori', 'tarjoilija', 'keittiö'],
    unexpectedCareers: ['ohjelmoija', 'sähköasentaja', 'insinööri', 'kirjanpitäjä'],
    // CORRECT TASO2 Q mapping:
    // Q0=technology:1, Q1=health:2, Q2=creative:5(!), Q3=people:5(!), Q4=business:4, Q5=environment:2
    // Q6=hands_on:5(!), Q7=analytical:2, Q8=teaching:3, Q9=innovation:4
    // Q10=teamwork:4, Q11=structure:3, Q12=independence:3, Q13=outdoor:3, Q14=customer:5(!)
    // Restaurant person: HIGH creative, people, hands_on, customer service
    answers: [1,2,5,5,4,2,5,2,3,4,4,3,3,3,5,3,4,3,3,3,3,4,4,3,3,4,4,3,4,3]
  },

  // ========== PERSONA 5: NUORI - Career Changer to Tech ==========
  {
    name: "Sami - Alanvaihtaja IT-alalle (NUORI)",
    description: "25-year-old former retail worker wanting to transition to IT/tech. Self-taught programmer, interested in web development. Analytical and detail-oriented.",
    cohort: 'NUORI',
    expectedStrengths: ['teknologia', 'analyyttinen', 'ongelmanratkaisu'],
    expectedCareers: ['kehittäjä', 'ohjelmoija', 'web', 'ohjelmisto', 'full-stack', 'front-end', 'koodaaja'],
    unexpectedCareers: ['hoitaja', 'opettaja', 'kampaaja', 'ravintola'],
    // NUORI Q mapping:
    // Q0=software:5(!), Q1=healthcare:1, Q2=finance:2, Q3=creative:3, Q4=engineering:4
    // Q5=teaching:2, Q6=HR:2, Q7=legal:2, Q8=sales:2, Q9=research:4, Q10=project:3
    answers: [5,1,2,3,4,2,2,2,2,4,3,2,3,3,3,4,4,4,3,3,3,3,5,3,4,3,4,4,3,4]
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
  const dimensionScores = result.userProfile?.dimensionScores || {};

  console.log('');
  console.log('=' .repeat(80));
  console.log(`PERSONA: ${persona.name}`);
  console.log('=' .repeat(80));
  console.log(`Description: ${persona.description}`);
  console.log(`Cohort: ${persona.cohort}`);
  console.log('');

  // Display dimension scores
  console.log('DIMENSION SCORES:');
  if (dimensionScores.interests) {
    const interests = dimensionScores.interests;
    if (typeof interests === 'object') {
      console.log('  Interests (subdimensions):');
      Object.entries(interests).forEach(([key, value]) => {
        if (typeof value === 'number' && value > 0.4) {
          console.log(`    - ${key}: ${value.toFixed(2)}`);
        }
      });
    } else {
      console.log(`  Interests: ${interests}`);
    }
  }
  if (dimensionScores.workstyle) {
    const workstyle = dimensionScores.workstyle;
    if (typeof workstyle === 'object') {
      console.log('  Workstyle (subdimensions):');
      Object.entries(workstyle).forEach(([key, value]) => {
        if (typeof value === 'number' && value > 0.4) {
          console.log(`    - ${key}: ${value.toFixed(2)}`);
        }
      });
    } else {
      console.log(`  Workstyle: ${workstyle}`);
    }
  }
  console.log('');

  // Display strengths
  console.log('IDENTIFIED STRENGTHS:');
  strengths.forEach((s, i) => {
    console.log(`  ${i+1}. ${s}`);
  });
  console.log('');

  // Display education path
  console.log('EDUCATION PATH:');
  console.log(`  Primary: ${educationPath.primary || 'N/A'}`);
  console.log(`  Confidence: ${educationPath.confidence || 'N/A'}`);
  console.log('');

  // Display ALL careers
  console.log('TOP 5 CAREER RECOMMENDATIONS:');
  careers.slice(0, 5).forEach((c, i) => {
    console.log(`  ${i+1}. ${c.title}`);
    console.log(`     Category: ${c.category}`);
    console.log(`     Score: ${c.overallScore?.toFixed(1) || 'N/A'}`);
  });
  console.log('');

  // Display remaining careers
  if (careers.length > 5) {
    console.log('ADDITIONAL CAREERS (6-10):');
    careers.slice(5, 10).forEach((c, i) => {
      console.log(`  ${i+6}. ${c.title} [${c.category}] (${c.overallScore?.toFixed(1) || 'N/A'})`);
    });
    console.log('');
  }

  // Check expected careers
  const foundExpected = [];
  const missingExpected = [];
  for (const expected of persona.expectedCareers) {
    const found = careerTitles.some(title => title.includes(expected.toLowerCase()));
    if (found) {
      foundExpected.push(expected);
    } else {
      missingExpected.push(expected);
    }
  }

  // Check unexpected careers
  const foundUnexpected = [];
  for (const unexpected of persona.unexpectedCareers) {
    const found = careerTitles.some(title => title.includes(unexpected.toLowerCase()));
    if (found) {
      foundUnexpected.push(unexpected);
    }
  }

  // Calculate match rate
  const matchRate = foundExpected.length / persona.expectedCareers.length;

  console.log('VALIDATION RESULTS:');
  console.log('-'.repeat(40));

  if (foundExpected.length > 0) {
    console.log(`  FOUND expected keywords (${foundExpected.length}/${persona.expectedCareers.length}):`);
    foundExpected.forEach(e => console.log(`    + ${e}`));
  }

  if (missingExpected.length > 0) {
    console.log(`  MISSING expected keywords:`);
    missingExpected.forEach(e => console.log(`    - ${e}`));
  }

  if (foundUnexpected.length > 0) {
    console.log(`  WARNING - Found UNEXPECTED careers:`);
    foundUnexpected.forEach(e => console.log(`    ! ${e}`));
  }

  const passed = matchRate >= 0.2 && foundUnexpected.length === 0;

  console.log('');
  console.log(`  Match Rate: ${Math.round(matchRate * 100)}%`);
  console.log(`  Status: ${passed ? 'PASSED' : 'FAILED'}`);
  console.log('');

  return {
    passed,
    matchRate,
    foundExpected,
    missingExpected,
    foundUnexpected,
    careers: careers.map(c => c.title),
    strengths
  };
}

async function runAllTests() {
  console.log('');
  console.log('#'.repeat(80));
  console.log('#  REAL-LIFE CAREER MATCHING VERIFICATION TEST');
  console.log('#  Testing 5 realistic personas across all cohorts');
  console.log('#'.repeat(80));
  console.log('');

  let totalPassed = 0;
  let totalTests = 0;
  const results = [];

  for (const persona of TEST_PERSONAS) {
    totalTests++;
    try {
      const result = await testPersona(persona);
      const analysis = analyzeResult(persona, result);
      results.push({ persona: persona.name, ...analysis });

      if (analysis.passed) {
        totalPassed++;
      }
    } catch (error) {
      console.log(`ERROR testing ${persona.name}: ${error.message}`);
      results.push({ persona: persona.name, passed: false, error: error.message });
    }
  }

  // Summary
  console.log('');
  console.log('#'.repeat(80));
  console.log('#  FINAL SUMMARY');
  console.log('#'.repeat(80));
  console.log('');

  results.forEach(r => {
    const status = r.passed ? 'PASS' : 'FAIL';
    const rate = r.matchRate ? `${Math.round(r.matchRate * 100)}%` : 'N/A';
    console.log(`  [${status}] ${r.persona} - Match: ${rate}`);
    if (r.foundUnexpected && r.foundUnexpected.length > 0) {
      console.log(`         Warning: Found unexpected careers - ${r.foundUnexpected.join(', ')}`);
    }
  });

  console.log('');
  console.log(`  TOTAL: ${totalPassed}/${totalTests} tests passed (${Math.round(totalPassed/totalTests*100)}%)`);
  console.log('');

  return { passed: totalPassed, total: totalTests, results };
}

// Run tests
runAllTests().then(results => {
  process.exit(results.passed === results.total ? 0 : 1);
}).catch(err => {
  console.error('Test runner failed:', err);
  process.exit(1);
});
