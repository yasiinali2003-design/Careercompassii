/**
 * Debug script to see actual category scores for YLA Helper
 */

const API_URL = 'http://localhost:3001/api/score';

async function debugYLAHelper() {
  console.log('Testing YLA Helper with detailed scoring...\n');

  const answers = [];
  // YLA Helper pattern from test file
  const pattern = [
    // Q0-7: Learning - ALL moderate except hands-on (avoid all confusers)
    3, 3, 1, 2, 3, 1, 2, 3,  // Q2=1, Q5=1 (NO hands_on), Q3=2, Q6=2 (low analytical)
    // Q8-14: Future - ALL neutral
    3, 3, 3, 2, 3, 3, 3,  // Q11=2 (low career_clarity)
    // Q15-22: Interests - ONLY health and education HIGH, everything else LOW
    1, 5, 1, 1, 1, 1, 4, 1,  // Q15=1 (tech), Q16=5 (HEALTH!!!), Q17-20=1 (creative/environment/leadership/building ALL LOW), Q21=4 (education), Q22=1 (sales LOW)
    // Q23-29: Values - ONLY social impact HIGH
    3, 3, 3, 3, 3, 5, 3  // Q28=5 (social impact), everything else moderate
  ];

  for (let i = 0; i < 30; i++) {
    answers.push({ questionIndex: i, score: pattern[i] });
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cohort: 'YLA', answers })
  });

  const result = await response.json();

  console.log('Result:', JSON.stringify(result, null, 2));
  console.log('\n\nCategory Scores:');
  if (result.categoryScores) {
    const sorted = Object.entries(result.categoryScores)
      .sort((a, b) => b[1] - a[1]);
    sorted.forEach(([cat, score]) => {
      console.log(`  ${cat}: ${score.toFixed(2)}`);
    });
  }
}

debugYLAHelper().catch(console.error);
