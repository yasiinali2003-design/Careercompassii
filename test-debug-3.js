const http = require('http');

// Test the 3 failing personas
const personas = [
  {
    name: "Aino - Luonnon tutkija (YLA)",
    cohort: 'YLA',
    expectedCareers: ['biologi', 'ympäristö', 'luonto', 'tutkija', 'eläin'],
    answers: [2,3,3,3,5,4,2,5,3,3,3,3,4,3,3,4,3,4,3,4,3,4,3,3,5,3,4,3,3,4]
  },
  {
    name: "Niko - IT-tukihenkilö (TASO2)",
    cohort: 'TASO2',
    expectedCareers: ['IT', 'tuki', 'järjestelmä', 'tieto', 'teknikko', 'asentaja'],
    answers: [5,2,2,3,2,1,2,3,2,2,4,2,2,2,2,3,3,4,3,4,3,3,5,3,4,3,4,4,3,4]
  },
  {
    name: "Emilia - Lähihoitaja (TASO2)",
    cohort: 'TASO2',
    expectedCareers: ['hoitaja', 'lähihoitaja', 'sairaan', 'vanhus', 'koti'],
    answers: [2,5,1,1,2,3,4,2,2,2,1,2,2,2,5,3,4,3,3,4,5,4,4,4,4,4,5,4,5,4]
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
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse: ${data}`));
        }
      });
    });
    req.on('error', (e) => reject(e));
    req.write(postData);
    req.end();
  });
}

async function run() {
  for (const persona of personas) {
    console.log('='.repeat(80));
    console.log('Testing:', persona.name);
    console.log('Cohort:', persona.cohort);
    console.log('Expected:', persona.expectedCareers.join(', '));
    console.log('');

    try {
      const result = await testPersona(persona);

      console.log('TOP STRENGTHS:', result.userProfile?.topStrengths?.join(', ') || 'N/A');
      console.log('');

      console.log('CATEGORY AFFINITIES:');
      const affinities = result.userProfile?.categoryAffinities || [];
      affinities.slice(0, 5).forEach((a, i) => {
        console.log(`  ${i+1}. ${a.category}: ${a.score}%`);
      });
      console.log('');

      console.log('TOP 10 CAREERS:');
      const careers = result.topCareers || [];
      careers.slice(0, 10).forEach((c, i) => {
        console.log(`  ${i+1}. ${c.title} [${c.category}] (score: ${c.overallScore})`);
      });

      // Check for expected careers
      console.log('');
      console.log('EXPECTED CAREERS FOUND:');
      const careerTitles = careers.map(c => c.title.toLowerCase());
      for (const expected of persona.expectedCareers) {
        const found = careerTitles.findIndex(t => t.includes(expected.toLowerCase()));
        if (found >= 0) {
          console.log(`  ✅ ${expected}: found at position ${found + 1}`);
        } else {
          console.log(`  ❌ ${expected}: NOT FOUND in top careers`);
        }
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
    console.log('');
  }
}

run();
