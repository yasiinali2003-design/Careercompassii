/**
 * Single NUORI test to debug category scoring
 */

const API_URL = 'http://localhost:3001/api/score';

async function testNuoriTech() {
  console.log('Testing NUORI Tech User...\n');

  const answers = [];
  // Generate pattern: HIGH tech (Q0,Q4), LOW health (Q1), HIGH advancement (Q10,Q13), HIGH growth (Q16)
  const pattern = [
    5, 1, 3, 3, 5, 2, 3, 3, 3, 3, // Q0-9: HIGH tech (0,4), LOW health (1)
    5, 3, 3, 5, 3, 3, 5, 3, 3, 3, // Q10-19: HIGH salary (10), HIGH advancement (13), HIGH growth (16)
    3, 3, 3, 3, 3, 4, 3, 3, 3, 3  // Q20-29: Some leadership (26)
  ];

  for (let i = 0; i < 30; i++) {
    answers.push({ questionIndex: i, score: pattern[i] });
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cohort: 'NUORI', answers })
  });

  const result = await response.json();

  console.log('Result:', JSON.stringify(result, null, 2));
}

testNuoriTech().catch(console.error);
