/**
 * Teacher Dashboard Real-Life Test
 * Tests the complete flow including at-risk student detection
 */

const CLASS_ID = "9a0f4b34-9541-4cc0-9aee-465ab5e58c24";
const CLASS_TOKEN = "wYLk_-bLmrvak8qW1yq5It";
const PINS = ["H59M", "ZEFL", "ALC5", "X2FE", "LC5C", "KT3N", "YSVM", "9H7S", "LN4G", "BCTU"];

// Student profiles with different characteristics
const studentProfiles = [
  {
    name: "Liisa - High Performer (Tech)",
    pin: PINS[0],
    cohort: "YLA",
    description: "Strong in technology and problem-solving, clear interests",
    // Strong answers (4-5) for tech and analytical questions
    answers: generateAnswers({
      technology: 5, problem_solving: 5, creative: 3, hands_on: 4,
      analytical: 5, business: 4, growth: 5, innovation: 5
    }),
    expectedRisk: false
  },
  {
    name: "Mikko - At Risk (Very Low Scores)",
    pin: PINS[1],
    cohort: "YLA",
    description: "Very low scores across all dimensions - needs support",
    // All low scores (1-2)
    answers: generateAnswers({
      technology: 1, problem_solving: 1, creative: 1, hands_on: 1,
      analytical: 1, business: 1, growth: 1, innovation: 1
    }),
    expectedRisk: true,
    expectedReason: "Keskiarvo alle 50%"
  },
  {
    name: "Anna - At Risk (Low Interests)",
    pin: PINS[2],
    cohort: "YLA",
    description: "Very low interest scores specifically",
    // Low interests but ok values
    answers: generateAnswers({
      technology: 1, problem_solving: 1, creative: 1, hands_on: 1,
      analytical: 3, business: 3, growth: 3, innovation: 1
    }),
    expectedRisk: true,
    expectedReason: "Kiinnostukset erittäin alhaiset"
  },
  {
    name: "Pekka - At Risk (Inconsistent)",
    pin: PINS[3],
    cohort: "YLA",
    description: "Wild swings between 1 and 5 - inconsistent responses",
    // Alternating extreme values - API format
    answers: Array.from({length: 30}, (_, i) => ({
      questionIndex: i,
      score: i % 2 === 0 ? 1 : 5
    })),
    expectedRisk: true,
    expectedReason: "Vastaukset ovat epäjohdonmukaiset"
  },
  {
    name: "Sari - Healthcare Path",
    pin: PINS[4],
    cohort: "NUORI",
    description: "Clear healthcare and people-oriented interests",
    answers: generateAnswers({
      health: 5, people: 5, creative: 3, environment: 4,
      analytical: 3, leadership: 3, growth: 4, innovation: 2
    }),
    expectedRisk: false
  },
  {
    name: "Jari - Builder/Hands-on",
    pin: PINS[5],
    cohort: "TASO2",
    subCohort: "AMIS",
    description: "Strong hands-on and practical orientation",
    answers: generateAnswers({
      hands_on: 5, technology: 4, creative: 2, people: 2,
      business: 2, analytical: 3, growth: 3, innovation: 3
    }),
    expectedRisk: false
  },
  {
    name: "Laura - Business Leader",
    pin: PINS[6],
    cohort: "TASO2",
    subCohort: "LUKIO",
    description: "Strong business and leadership orientation",
    answers: generateAnswers({
      business: 5, leadership: 5, people: 4, analytical: 4,
      creative: 3, technology: 3, growth: 5, innovation: 4
    }),
    expectedRisk: false
  },
  {
    name: "Ville - At Risk (Unclear Values)",
    pin: PINS[7],
    cohort: "YLA",
    description: "Low values dimension - unclear what they want",
    answers: generateAnswers({
      technology: 3, problem_solving: 3, creative: 3, hands_on: 3,
      analytical: 3, business: 1, growth: 1, innovation: 3
    }),
    expectedRisk: true,
    expectedReason: "Arvot eivät ole selkeät"
  },
  {
    name: "Emma - Creative Artist",
    pin: PINS[8],
    cohort: "YLA",
    description: "Strong creative and artistic interests",
    answers: generateAnswers({
      creative: 5, innovation: 4, hands_on: 3, people: 4,
      analytical: 2, business: 2, growth: 4, technology: 2
    }),
    expectedRisk: false
  },
  {
    name: "Olli - Environment Focus",
    pin: PINS[9],
    cohort: "NUORI",
    description: "Strong environmental and nature interests",
    answers: generateAnswers({
      environment: 5, nature: 5, health: 3, people: 3,
      technology: 2, creative: 4, growth: 4, leadership: 2
    }),
    expectedRisk: false
  }
];

// Helper function to generate answers based on dimension preferences
function generateAnswers(preferences) {
  const answers = [];

  // Question indices that map to different dimensions (approximate)
  const dimensionQuestions = {
    technology: [0, 6, 7],
    problem_solving: [9, 10],
    creative: [3, 8, 18],
    hands_on: [5, 15],
    environment: [4, 14],
    health: [2, 12],
    business: [11, 21],
    analytical: [7, 17, 27],
    growth: [19, 29],
    innovation: [16, 26],
    people: [1, 11],
    leadership: [20, 25],
    nature: [4, 24],
    social: [13, 23]
  };

  // Initialize all to neutral (3) - API expects { questionIndex, score: 1-5 }
  for (let i = 0; i < 30; i++) {
    answers.push({ questionIndex: i, score: 3 });
  }

  // Set preference-based values (score is 1-5)
  for (const [dimension, value] of Object.entries(preferences)) {
    const questions = dimensionQuestions[dimension] || [];
    for (const q of questions) {
      if (q < 30) {
        answers[q] = { questionIndex: q, score: Math.min(5, Math.max(1, value)) };
      }
    }
  }

  return answers;
}

async function submitStudentTest(profile) {
  // Step 1: Get scored results from /api/score
  const scorePayload = {
    cohort: profile.cohort,
    answers: profile.answers,
    pin: profile.pin
  };

  if (profile.subCohort) {
    scorePayload.subCohort = profile.subCohort;
  }

  try {
    const scoreResponse = await fetch('http://localhost:3000/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scorePayload)
    });

    const scoreData = await scoreResponse.json();

    if (!scoreData.success) {
      return { success: false, error: scoreData.error || 'Scoring failed' };
    }

    // Step 2: Submit to class via /api/results
    // Transform topCareers to match expected schema (needs 'score' not 'overallScore')
    const topCareers = (scoreData.topCareers || []).map(c => ({
      slug: c.slug,
      title: c.title,
      score: c.overallScore || c.score || 0
    }));

    // Get dimension scores from userProfile
    const dimensionScores = scoreData.userProfile?.dimensionScores || {
      interests: 50,
      values: 50,
      workstyle: 50,
      context: 50
    };

    const resultPayload = {
      pin: profile.pin,
      classToken: CLASS_TOKEN,
      resultPayload: {
        cohort: profile.cohort,
        topCareers: topCareers,
        dimensionScores: dimensionScores,
        personalizedAnalysis: scoreData.userProfile?.personalizedAnalysis || null,
        timeSpentSeconds: Math.floor(Math.random() * 300) + 180, // 3-8 minutes
        educationPath: scoreData.educationPath || null
      }
    };

    const resultsResponse = await fetch('http://localhost:3000/api/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resultPayload)
    });

    const resultsData = await resultsResponse.json();

    if (!resultsData.success) {
      return {
        success: false,
        error: resultsData.error || 'Results submission failed',
        details: resultsData.details,
        scoreData // Include score data for debugging
      };
    }

    // Return combined success with all data
    return {
      success: true,
      ...scoreData,
      resultId: resultsData.resultId
    };
  } catch (error) {
    console.error(`Error submitting for ${profile.name}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function fetchClassResults() {
  // First login to get cookie
  const loginResponse = await fetch('http://localhost:3000/api/teacher-auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'PLAYWRIGHT' })
  });

  // Get cookie from response
  const cookies = loginResponse.headers.get('set-cookie');

  const response = await fetch(`http://localhost:3000/api/classes/${CLASS_ID}/results`, {
    headers: {
      'Cookie': 'teacher_auth_token=authenticated; teacher_id=mock-teacher'
    }
  });

  return response.json();
}

async function runTests() {
  console.log('╔══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║ TEACHER DASHBOARD - REAL LIFE TEST                                           ║');
  console.log('╚══════════════════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`Testing Class ID: ${CLASS_ID}`);
  console.log(`Total Students: ${studentProfiles.length}`);
  console.log('');

  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log('STEP 1: SUBMITTING STUDENT TESTS');
  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log('');

  const results = [];

  for (const profile of studentProfiles) {
    console.log(`📝 Submitting: ${profile.name}`);
    console.log(`   Description: ${profile.description}`);
    console.log(`   Cohort: ${profile.cohort}${profile.subCohort ? ` (${profile.subCohort})` : ''}`);
    console.log(`   PIN: ${profile.pin}`);
    console.log(`   Expected At-Risk: ${profile.expectedRisk ? '⚠️ YES' : '✅ NO'}`);

    const result = await submitStudentTest(profile);

    if (result.success) {
      console.log(`   ✅ Submitted successfully`);
      console.log(`   Top Career: ${result.topCareers?.[0]?.title || 'N/A'} (${result.topCareers?.[0]?.score || 0}%)`);
      console.log(`   Education Path: ${result.educationPath?.primary || 'N/A'}`);
      results.push({ profile, result });
    } else {
      console.log(`   ❌ Failed: ${result.error}`);
      results.push({ profile, result, failed: true });
    }
    console.log('');
  }

  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log('STEP 2: FETCHING CLASS RESULTS');
  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log('');

  const classResults = await fetchClassResults();

  if (classResults.success) {
    console.log(`✅ Class results fetched successfully`);
    console.log(`   Total Results: ${classResults.results?.length || 0}`);
    console.log('');

    // Analyze at-risk students
    const atRiskStudents = classResults.results?.filter(r => r.isAtRisk) || [];

    console.log('═══════════════════════════════════════════════════════════════════════════════');
    console.log('STEP 3: AT-RISK STUDENT ANALYSIS');
    console.log('═══════════════════════════════════════════════════════════════════════════════');
    console.log('');

    if (atRiskStudents.length > 0) {
      console.log(`⚠️  Found ${atRiskStudents.length} at-risk students:`);
      console.log('');

      for (const student of atRiskStudents) {
        const profile = studentProfiles.find(p => p.pin === student.pin);
        console.log(`   PIN: ${student.pin} (${profile?.name || 'Unknown'})`);
        console.log(`   Reasons: ${student.atRiskReasons?.join(', ') || 'Unknown'}`);
        console.log(`   Expected: ${profile?.expectedRisk ? 'YES ✅' : 'NO ❌'}`);
        console.log('');
      }
    } else {
      console.log('   No at-risk students detected in API response');
      console.log('   (At-risk detection may be calculated client-side)');
    }

    console.log('');
    console.log('═══════════════════════════════════════════════════════════════════════════════');
    console.log('STEP 4: RESULTS SUMMARY');
    console.log('═══════════════════════════════════════════════════════════════════════════════');
    console.log('');

    // Summarize by cohort
    const byCohort = {};
    for (const r of classResults.results || []) {
      const cohort = r.result_payload?.cohort || r.cohort || 'Unknown';
      byCohort[cohort] = (byCohort[cohort] || 0) + 1;
    }

    console.log('Distribution by Cohort:');
    for (const [cohort, count] of Object.entries(byCohort)) {
      console.log(`   ${cohort}: ${count} students`);
    }
    console.log('');

    // Education paths
    const byEducation = {};
    for (const r of classResults.results || []) {
      const path = r.result_payload?.educationPath?.primary || 'Unknown';
      byEducation[path] = (byEducation[path] || 0) + 1;
    }

    console.log('Distribution by Education Path:');
    for (const [path, count] of Object.entries(byEducation)) {
      console.log(`   ${path}: ${count} students`);
    }

  } else {
    console.log(`❌ Failed to fetch class results: ${classResults.error}`);
  }

  console.log('');
  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log('TEST COMPLETE');
  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log('');
  console.log('To verify UI:');
  console.log(`1. Open http://localhost:3000/teacher/login`);
  console.log(`2. Login with password: PLAYWRIGHT`);
  console.log(`3. Navigate to the "Test Class 9A - Dashboard Testing" class`);
  console.log(`4. Check the "Tulokset" (Results) tab`);
  console.log(`5. Verify at-risk students are flagged with ⚠️`);
  console.log('');
}

runTests().catch(console.error);
