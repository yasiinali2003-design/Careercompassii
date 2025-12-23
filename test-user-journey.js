/**
 * Test 10: User Journey Simulation Test
 *
 * Simulates complete user journeys through the application:
 * 1. Landing page load
 * 2. Cohort selection
 * 3. Question fetching
 * 4. Answer submission
 * 5. Results retrieval
 * 6. Multiple sessions (user returns)
 *
 * Tests the full flow as a real user would experience it.
 */

const BASE_URL = 'http://localhost:3000';

// All 4 cohort configurations (YLA, TASO2 Lukio, TASO2 Ammattikoulu, NUORI)
const COHORT_CONFIGS = [
  { cohort: 'YLA', subCohort: null, label: 'YLA (Yläaste)' },
  { cohort: 'TASO2', subCohort: 'LUKIO', label: 'TASO2 Lukio' },
  { cohort: 'TASO2', subCohort: 'AMIS', label: 'TASO2 Ammattikoulu' },
  { cohort: 'NUORI', subCohort: null, label: 'NUORI (Nuori aikuinen)' }
];

// Simulate different user personas
const USER_PERSONAS = {
  quickUser: {
    name: 'Quick User',
    description: 'Completes quickly, minimal engagement',
    thinkTime: 0, // ms per question
    answerPattern: () => Math.random() > 0.5 ? 4 : 3
  },
  thoughtfulUser: {
    name: 'Thoughtful User',
    description: 'Takes time, varied answers',
    thinkTime: 100,
    answerPattern: (i) => {
      // Varies answers based on question position
      const patterns = [5, 4, 3, 4, 5, 2, 3, 4, 5, 3];
      return patterns[i % patterns.length];
    }
  },
  extremeUser: {
    name: 'Extreme User',
    description: 'Strong opinions, mostly 1s and 5s',
    thinkTime: 50,
    answerPattern: () => Math.random() > 0.5 ? 5 : 1
  },
  uncertainUser: {
    name: 'Uncertain User',
    description: 'Mostly neutral, few strong opinions',
    thinkTime: 200,
    answerPattern: () => {
      const r = Math.random();
      if (r < 0.7) return 3;
      if (r < 0.85) return 2;
      return 4;
    }
  },
  returningUser: {
    name: 'Returning User',
    description: 'Takes test multiple times with different answers',
    thinkTime: 100,
    answerPattern: (i, session) => {
      // Different patterns each session
      return (i + session) % 5 + 1;
    }
  }
};

// Journey step results
class JourneyResult {
  constructor(personaKey, cohort) {
    this.persona = personaKey;
    this.cohort = cohort;
    this.steps = [];
    this.success = true;
    this.errors = [];
    this.startTime = Date.now();
    this.endTime = null;
  }

  addStep(name, success, time, details = {}) {
    this.steps.push({
      name,
      success,
      time,
      details,
      timestamp: Date.now()
    });
    if (!success) {
      this.success = false;
      this.errors.push(name);
    }
  }

  complete() {
    this.endTime = Date.now();
    this.totalTime = this.endTime - this.startTime;
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Step 1: Simulate landing page load
async function stepLandingPage(journey) {
  const start = Date.now();
  try {
    const response = await fetch(BASE_URL);
    const time = Date.now() - start;

    if (response.ok) {
      journey.addStep('Landing Page Load', true, time, {
        status: response.status
      });
      return true;
    } else {
      journey.addStep('Landing Page Load', false, time, {
        status: response.status
      });
      return false;
    }
  } catch (error) {
    journey.addStep('Landing Page Load', false, Date.now() - start, {
      error: error.message
    });
    return false;
  }
}

// Step 2: Fetch questions for cohort
async function stepFetchQuestions(journey, cohort, subCohort) {
  const start = Date.now();
  try {
    let url = `${BASE_URL}/api/questions?cohort=${cohort}&setIndex=0`;
    if (subCohort) url += `&subCohort=${subCohort}`;

    const response = await fetch(url);
    const time = Date.now() - start;

    if (!response.ok) {
      journey.addStep('Fetch Questions', false, time, {
        status: response.status,
        cohort,
        subCohort
      });
      return null;
    }

    const data = await response.json();
    const questions = data.questions || data;

    journey.addStep('Fetch Questions', true, time, {
      cohort,
      subCohort,
      questionCount: questions.length
    });

    return questions;
  } catch (error) {
    journey.addStep('Fetch Questions', false, Date.now() - start, {
      error: error.message,
      cohort,
      subCohort
    });
    return null;
  }
}

// Step 3: Answer questions (simulating user think time)
async function stepAnswerQuestions(journey, questions, persona, session = 0) {
  const start = Date.now();
  const answers = [];

  try {
    for (let i = 0; i < questions.length; i++) {
      // Simulate think time
      if (persona.thinkTime > 0) {
        await sleep(persona.thinkTime * 0.5); // Reduced for testing
      }

      const score = persona.answerPattern(i, session);
      answers.push({
        questionIndex: i,
        score
      });
    }

    const time = Date.now() - start;
    journey.addStep('Answer Questions', true, time, {
      questionCount: questions.length,
      avgScore: (answers.reduce((s, a) => s + a.score, 0) / answers.length).toFixed(2)
    });

    return answers;
  } catch (error) {
    journey.addStep('Answer Questions', false, Date.now() - start, {
      error: error.message
    });
    return null;
  }
}

// Step 4: Submit answers and get results
async function stepSubmitTest(journey, cohort, answers, subCohort) {
  const start = Date.now();
  try {
    const body = { cohort, answers };
    if (subCohort) body.subCohort = subCohort;

    const response = await fetch(`${BASE_URL}/api/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const time = Date.now() - start;

    if (!response.ok) {
      const error = await response.text();
      journey.addStep('Submit Test', false, time, {
        status: response.status,
        error
      });
      return null;
    }

    const result = await response.json();

    journey.addStep('Submit Test', true, time, {
      success: result.success,
      careerCount: result.topCareers?.length,
      topCareer: result.topCareers?.[0]?.title,
      hasAnalysis: !!result.userProfile?.personalizedAnalysis
    });

    return result;
  } catch (error) {
    journey.addStep('Submit Test', false, Date.now() - start, {
      error: error.message
    });
    return null;
  }
}

// Step 5: Validate results quality
function stepValidateResults(journey, result) {
  const start = Date.now();
  const validations = [];

  // Check careers exist
  if (!result.topCareers || result.topCareers.length === 0) {
    validations.push({ check: 'Has Careers', passed: false });
  } else {
    validations.push({ check: 'Has Careers', passed: true });

    // Check career structure
    const career = result.topCareers[0];
    validations.push({ check: 'Has Title', passed: !!career.title });
    validations.push({ check: 'Has Category', passed: !!career.category });
    validations.push({ check: 'Has Score', passed: career.overallScore !== undefined });
    validations.push({ check: 'Has Reasons', passed: career.reasons?.length > 0 });
  }

  // Check user profile
  if (result.userProfile) {
    validations.push({ check: 'Has Profile', passed: true });
    validations.push({ check: 'Has Analysis', passed: !!result.userProfile.personalizedAnalysis });
    validations.push({ check: 'Has Strengths', passed: result.userProfile.topStrengths?.length > 0 });
  } else {
    validations.push({ check: 'Has Profile', passed: false });
  }

  const passed = validations.filter(v => v.passed).length;
  const total = validations.length;
  const success = passed === total;

  journey.addStep('Validate Results', success, Date.now() - start, {
    validations,
    passed,
    total
  });

  return success;
}

// Run a complete user journey
async function runUserJourney(personaKey, config, session = 0) {
  const { cohort, subCohort, label } = config;
  const persona = USER_PERSONAS[personaKey];
  const journey = new JourneyResult(personaKey, label);

  console.log(`\n     ${persona.name} (${label})...`);

  // Step 1: Landing page
  const landingOk = await stepLandingPage(journey);
  if (!landingOk) {
    journey.complete();
    return journey;
  }

  // Step 2: Fetch questions
  const questions = await stepFetchQuestions(journey, cohort, subCohort);
  if (!questions) {
    journey.complete();
    return journey;
  }

  // Step 3: Answer questions
  const answers = await stepAnswerQuestions(journey, questions, persona, session);
  if (!answers) {
    journey.complete();
    return journey;
  }

  // Step 4: Submit test
  const result = await stepSubmitTest(journey, cohort, answers, subCohort);
  if (!result) {
    journey.complete();
    return journey;
  }

  // Step 5: Validate results
  stepValidateResults(journey, result);

  journey.complete();
  return journey;
}

// Test returning user (multiple sessions)
async function testReturningUser(config) {
  console.log(`\n  Testing returning user (3 sessions) for ${config.label}...`);

  const journeys = [];
  const persona = USER_PERSONAS.returningUser;

  for (let session = 0; session < 3; session++) {
    console.log(`     Session ${session + 1}...`);
    const journey = await runUserJourney('returningUser', config, session);
    journeys.push(journey);
  }

  // Check if results differ between sessions
  const topCareers = journeys.map(j => {
    const submitStep = j.steps.find(s => s.name === 'Submit Test');
    return submitStep?.details?.topCareer;
  });

  const uniqueCareers = new Set(topCareers).size;

  return {
    sessions: journeys.length,
    success: journeys.every(j => j.success),
    uniqueCareers,
    careers: topCareers
  };
}

async function runTests() {
  console.log('🔍 Checking server connectivity...');

  try {
    const response = await fetch(`${BASE_URL}/api/questions?cohort=YLA&setIndex=0`);
    if (!response.ok) throw new Error('Server not responding');
    console.log('✅ Server is running\n');
  } catch (error) {
    console.log('❌ Server is not running. Please start with: npm run dev\n');
    process.exit(1);
  }

  console.log('🧪 USER JOURNEY SIMULATION TEST');
  console.log('='.repeat(60));
  console.log('Simulating complete user journeys\n');
  console.log('Testing ALL 4 cohorts: YLA, TASO2 Lukio, TASO2 Ammattikoulu, NUORI\n');

  const allJourneys = [];
  const personaKeys = ['quickUser', 'thoughtfulUser', 'extremeUser', 'uncertainUser'];

  for (const config of COHORT_CONFIGS) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📚 Testing Cohort: ${config.label}`);
    console.log('-'.repeat(60));

    console.log('\n  Running persona journeys...');

    for (const personaKey of personaKeys) {
      const journey = await runUserJourney(personaKey, config);
      allJourneys.push(journey);

      const status = journey.success ? '✓' : '✗';
      console.log(`        ${status} ${journey.totalTime}ms`);
    }

    // Test returning user
    const returningResult = await testReturningUser(config);
    console.log(`     Returning user: ${returningResult.success ? '✓' : '✗'} (${returningResult.uniqueCareers} unique careers)`);
  }

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 JOURNEY SUMMARY');
  console.log('='.repeat(60));

  const successfulJourneys = allJourneys.filter(j => j.success);
  const avgTime = Math.round(allJourneys.reduce((s, j) => s + j.totalTime, 0) / allJourneys.length);

  console.log(`\nTotal Journeys: ${allJourneys.length}`);
  console.log(`✅ Successful: ${successfulJourneys.length} (${(successfulJourneys.length / allJourneys.length * 100).toFixed(0)}%)`);
  console.log(`⏱️ Average Journey Time: ${avgTime}ms`);

  // Step analysis
  console.log('\n📋 Step Success Rates:');
  const stepNames = ['Landing Page Load', 'Fetch Questions', 'Answer Questions', 'Submit Test', 'Validate Results'];
  for (const stepName of stepNames) {
    const stepResults = allJourneys.flatMap(j => j.steps.filter(s => s.name === stepName));
    const successRate = stepResults.filter(s => s.success).length / stepResults.length * 100;
    const avgStepTime = Math.round(stepResults.reduce((s, st) => s + st.time, 0) / stepResults.length);
    console.log(`   ${stepName}: ${successRate.toFixed(0)}% success, avg ${avgStepTime}ms`);
  }

  // Persona analysis
  console.log('\n📋 Results by Persona:');
  for (const personaKey of personaKeys) {
    const personaJourneys = allJourneys.filter(j => j.persona === personaKey);
    const successRate = personaJourneys.filter(j => j.success).length / personaJourneys.length * 100;
    console.log(`   ${USER_PERSONAS[personaKey].name}: ${successRate.toFixed(0)}% success`);
  }

  // Cohort analysis
  console.log('\n📋 Results by Cohort:');
  for (const config of COHORT_CONFIGS) {
    const cohortJourneys = allJourneys.filter(j => j.cohort === config.label);
    const successRate = cohortJourneys.filter(j => j.success).length / cohortJourneys.length * 100;
    console.log(`   ${config.label}: ${successRate.toFixed(0)}% success`);
  }

  // Final verdict
  console.log(`\n${'='.repeat(60)}`);
  if (successfulJourneys.length === allJourneys.length) {
    console.log('🎉 All user journeys completed successfully!');
  } else {
    console.log(`⚠️ ${allJourneys.length - successfulJourneys.length} journeys had issues.`);
  }

  // Save results
  const fs = require('fs');
  fs.writeFileSync('test-user-journey-results.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      total: allJourneys.length,
      successful: successfulJourneys.length,
      avgTime
    },
    journeys: allJourneys
  }, null, 2));

  console.log('\n📄 Full results saved to test-user-journey-results.json\n');
}

runTests().catch(console.error);
