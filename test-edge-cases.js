/**
 * EDGE CASE VERIFICATION TEST
 * Tests edge cases and boundary conditions to ensure robustness
 */
const http = require('http');

const EDGE_CASES = [
  // Edge case 1: All neutral answers (3s) - should still get reasonable careers
  {
    name: "Neutral User (YLA)",
    cohort: 'YLA',
    answers: [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    check: (careers) => careers.length >= 5 // Should still get careers
  },

  // Edge case 2: Extreme creative (all 5s on creative questions)
  {
    name: "Extreme Creative (YLA)",
    cohort: 'YLA',
    answers: [1,1,5,1,1,1,1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
    check: (careers) => careers.some(c => c.category === 'luova')
  },

  // Edge case 3: Extreme technical (all 5s on tech questions)
  {
    name: "Extreme Tech (TASO2)",
    cohort: 'TASO2',
    answers: [5,1,1,1,1,1,1,5,1,5,5,1,5,1,1,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
    // Tech careers can be in innovoija, rakentaja, or johtaja (tech leadership)
    check: (careers) => {
      const titles = careers.map(c => c.title.toLowerCase());
      return titles.some(t =>
        t.includes('ohjelmisto') || t.includes('data') || t.includes('kehit') ||
        t.includes('it') || t.includes('järjestelmä') || t.includes('tekn')
      );
    }
  },

  // Edge case 4: Extreme helping/caring (all 5s on health/people)
  {
    name: "Extreme Helper (TASO2)",
    cohort: 'TASO2',
    answers: [1,5,1,1,1,1,5,1,5,1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
    check: (careers) => careers.some(c => c.category === 'auttaja')
  },

  // Edge case 5: Mixed profile (alternating high/low)
  {
    name: "Mixed Profile (NUORI)",
    cohort: 'NUORI',
    answers: [5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1],
    check: (careers) => careers.length >= 5 && careers.some(c => c.overallScore > 100)
  },

  // Edge case 6: Career changer with clear tech focus
  {
    name: "Clear Tech Career Changer (NUORI)",
    cohort: 'NUORI',
    answers: [5,1,1,2,5,1,1,1,1,5,3,3,4,3,3,5,5,5,4,4,4,4,5,4,4,4,5,5,4,4],
    check: (careers) => {
      const titles = careers.map(c => c.title.toLowerCase());
      return titles.some(t => t.includes('kehittäjä') || t.includes('ohjelmisto') || t.includes('data'));
    }
  }
];

async function testCase(testCase) {
  return new Promise((resolve, reject) => {
    const testAnswers = testCase.answers.map((value, index) => ({
      questionIndex: index,
      score: value,
      cohort: testCase.cohort
    }));

    const postData = JSON.stringify({
      answers: testAnswers,
      cohort: testCase.cohort
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
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Failed to parse response'));
        }
      });
    });
    req.on('error', (e) => reject(e));
    req.write(postData);
    req.end();
  });
}

async function run() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║           EDGE CASE VERIFICATION TEST                        ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  let passed = 0;
  let failed = 0;

  for (const test of EDGE_CASES) {
    process.stdout.write('Testing: ' + test.name + '... ');
    try {
      const result = await testCase(test);
      const careers = result.topCareers || [];

      if (test.check(careers)) {
        console.log('✅ PASSED');
        console.log('   Top 3: ' + careers.slice(0,3).map(c => c.title).join(', '));
        passed++;
      } else {
        console.log('❌ FAILED');
        console.log('   Got: ' + careers.slice(0,3).map(c => c.title).join(', '));
        failed++;
      }
    } catch (e) {
      console.log('❌ ERROR: ' + e.message);
      failed++;
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log('EDGE CASE RESULTS: ' + passed + '/' + EDGE_CASES.length + ' passed');
  console.log('═'.repeat(60));

  process.exit(failed > 0 ? 1 : 0);
}

run();
