const BASE_URL = 'http://localhost:3000';

const COHORTS = ['YLA', 'TASO2', 'NUORI'];

const TEST_PROFILES = {
  creative_artist: {
    creative: 5, arts_culture: 5, writing: 5, independence: 5,
    innovation: 4, flexibility: 5, technology: 1, analytical: 1,
    organization: 1, structure: 1, precision: 1, stability: 1
  },
  tech_enthusiast: {
    technology: 5, analytical: 5, problem_solving: 5, innovation: 5,
    precision: 2, organization: 1, structure: 1, creative: 3
  },
  healthcare_helper: {
    health: 5, people: 5, social: 5, impact: 5,
    teamwork: 5, growth: 4, stability: 4
  },
  business_leader: {
    leadership: 5, business: 5, financial: 5, advancement: 5,
    performance: 5, teamwork: 4, organization: 4
  },
  hands_on_builder: {
    hands_on: 5, outdoor: 5, stability: 4, innovation: 5,
    technology: 1, organization: 1
  },
  nature_lover: {
    environment: 5, nature: 5, outdoor: 5, impact: 5,
    independence: 4, flexibility: 4
  }
};

async function runTest(profileType, cohort) {
  try {
    // Get questions
    const qRes = await fetch(BASE_URL + '/api/questions?cohort=' + cohort + '&setIndex=0');
    const qData = await qRes.json();
    const questions = qData.questions || [];
    
    if (questions.length === 0) {
      console.log('  ERROR: No questions returned for ' + cohort);
      return null;
    }
    
    // Generate answers based on profile
    const profile = TEST_PROFILES[profileType];
    const answers = questions.map(q => {
      const subdims = q.subdimensions || [];
      let score = 3;
      subdims.forEach(sub => {
        if (profile[sub] !== undefined) {
          score = Math.max(score, profile[sub]);
        }
      });
      return { questionId: q.id, answer: score };
    });
    
    // Submit
    const sRes = await fetch(BASE_URL + '/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cohort, answers })
    });
    const result = await sRes.json();
    
    if (!result.success) {
      console.log('  ERROR: ' + (result.error || 'Unknown error'));
      return null;
    }
    
    return result.topCareers.slice(0, 5);
  } catch (e) {
    console.log('  ERROR: ' + e.message);
    return null;
  }
}

async function main() {
  console.log('DETAILED CAREER ACCURACY TEST');
  console.log('==============================\n');
  console.log('Testing what careers each personality type gets...\n');
  
  for (const profileType of Object.keys(TEST_PROFILES)) {
    console.log('\n>>> ' + profileType.toUpperCase());
    console.log('-'.repeat(50));
    
    for (const cohort of COHORTS) {
      const careers = await runTest(profileType, cohort);
      if (careers && careers.length > 0) {
        console.log('\n  ' + cohort + ':');
        careers.forEach((c, i) => {
          console.log('    ' + (i+1) + '. ' + c.title + ' [' + c.category + ']');
        });
      }
    }
  }
  
  console.log('\n\n========================================');
  console.log('ANALYSIS: Are these careers sensible?\n');
  
  console.log('CREATIVE_ARTIST should get: designers, artists, writers, musicians');
  console.log('TECH_ENTHUSIAST should get: developers, engineers, data scientists');
  console.log('HEALTHCARE_HELPER should get: nurses, doctors, therapists, caregivers');
  console.log('BUSINESS_LEADER should get: managers, executives, entrepreneurs');
  console.log('HANDS_ON_BUILDER should get: builders, mechanics, electricians');
  console.log('NATURE_LOVER should get: biologists, environmental scientists, farmers');
  
  console.log('\nCheck the results above to verify accuracy!');
}

main();
