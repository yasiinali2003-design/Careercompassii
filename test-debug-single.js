const http = require('http');

// Test Siiri specifically to see her dimension scores
const persona = {
  name: "Siiri - Kauneusalan yrittäjä (TASO2)",
  cohort: 'TASO2',
  answers: [2,2,1,1,3,5,2,1,2,4,1,1,4,2,3,3,4,3,3,3,3,3,4,4,3,4,4,3,4,3]
};

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

async function run() {
  console.log('Testing:', persona.name);
  console.log('Cohort:', persona.cohort);
  console.log('Answers:', persona.answers.join(','));
  console.log('');

  try {
    const result = await testPersona(persona);

    console.log('=== FULL USER PROFILE ===');
    console.log(JSON.stringify(result.userProfile, null, 2));
    console.log('');

    console.log('=== TOP 10 CAREERS ===');
    const careers = result.topCareers || [];
    careers.slice(0, 10).forEach((c, i) => {
      console.log((i+1) + '. ' + c.title + ' [' + c.category + '] (score: ' + c.overallScore + ')');
    });

    // Check if beauty careers appear anywhere
    console.log('');
    console.log('=== BEAUTY CAREER CHECK ===');
    const beautyKeywords = ['kampaaja', 'parturi', 'kosmetologi', 'kauneus', 'meikki', 'kynsi'];
    careers.forEach((c, i) => {
      const titleLower = c.title.toLowerCase();
      if (beautyKeywords.some(k => titleLower.includes(k))) {
        console.log('Found beauty career at position ' + (i+1) + ': ' + c.title);
      }
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

run();
