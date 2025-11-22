const fetch = require('node-fetch');

const testData = {
  cohort: 'NUORI',
  answers: Array.from({ length: 30 }, (_, i) => ({ questionIndex: i, score: 4 })),
  currentOccupation: 'lähihoitaja'
};

fetch('http://localhost:3000/api/score', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testData)
})
  .then(res => res.json())
  .then(data => {
    console.log('Top 5 careers:');
    data.topCareers.forEach((c, i) => {
      const marker = c.title.toLowerCase().includes('sairaanhoitaja') ? ' ← PROGRESSION!' : '';
      console.log(`${i+1}. ${c.title} (${c.overallScore}%)${marker}`);
    });
  })
  .catch(err => console.error('Error:', err));
