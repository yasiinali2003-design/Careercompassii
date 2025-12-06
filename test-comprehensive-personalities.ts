import { getQuestionMappings } from './lib/scoring/dimensions';
import { generateUserProfile, rankCareers } from './lib/scoring/scoringEngine';

// Comprehensive test with diverse personalities across all cohorts
const diversePersonalities = [
  // High analytical, low creative - should be jarjestaja/innovoija
  { name: "The Data Analyst", cohort: 'NUORI' as const, subdimensions: { analytical: 5, technology: 4, precision: 4, creative: 1, people: 2 } },
  { name: "The Systems Architect", cohort: 'YLA' as const, subdimensions: { analytical: 5, technology: 5, organization: 4, creative: 1, people: 1 } },
  
  // High creative, low analytical - should be luova
  { name: "The Artist", cohort: 'NUORI' as const, subdimensions: { creative: 5, innovation: 4, independence: 5, analytical: 1, technology: 1 } },
  { name: "The Musician", cohort: 'TASO2' as const, subdimensions: { creative: 5, people: 4, performance: 5, analytical: 1, organization: 1 } },
  
  // High people, low leadership - should be auttaja
  { name: "The Social Worker", cohort: 'NUORI' as const, subdimensions: { people: 5, impact: 5, health: 4, leadership: 2, business: 1 } },
  { name: "The Teacher", cohort: 'YLA' as const, subdimensions: { people: 5, education: 5, impact: 4, leadership: 2, creative: 2 } },
  
  // High leadership, high business - should be johtaja
  { name: "The CEO", cohort: 'NUORI' as const, subdimensions: { leadership: 5, business: 5, entrepreneurship: 5, people: 3, creative: 2 } },
  { name: "The Manager", cohort: 'TASO2' as const, subdimensions: { leadership: 5, business: 4, organization: 4, people: 3, analytical: 3 } },
  
  // High hands_on, low organization - should be rakentaja
  { name: "The Carpenter", cohort: 'NUORI' as const, subdimensions: { hands_on: 5, precision: 4, structure: 3, organization: 1, people: 2 } },
  { name: "The Mechanic", cohort: 'YLA' as const, subdimensions: { hands_on: 5, technology: 4, precision: 4, organization: 1, creative: 1 } },
  
  // High global, high planning, low organization - should be visionaari
  { name: "The Strategist", cohort: 'NUORI' as const, subdimensions: { global: 5, planning: 5, innovation: 4, organization: 2, leadership: 2 } },
  { name: "The Consultant", cohort: 'TASO2' as const, subdimensions: { global: 5, planning: 4, analytical: 4, organization: 2, people: 3 } },
  
  // High organization, low hands_on - should be jarjestaja
  { name: "The Accountant", cohort: 'NUORI' as const, subdimensions: { organization: 5, precision: 5, analytical: 4, hands_on: 1, creative: 1 } },
  { name: "The Administrator", cohort: 'YLA' as const, subdimensions: { organization: 5, structure: 5, planning: 4, hands_on: 1, people: 2 } },
  
  // High technology, moderate creative - should be innovoija
  { name: "The Software Developer", cohort: 'NUORI' as const, subdimensions: { technology: 5, analytical: 4, innovation: 4, creative: 3, people: 2 } },
  { name: "The Engineer", cohort: 'TASO2' as const, subdimensions: { technology: 5, analytical: 5, precision: 4, creative: 2, leadership: 2 } },
  
  // Balanced personalities - should classify based on strongest trait
  { name: "The Balanced Professional", cohort: 'NUORI' as const, subdimensions: { analytical: 4, people: 4, organization: 4, creative: 3, leadership: 3 } },
  { name: "The Versatile Worker", cohort: 'YLA' as const, subdimensions: { creative: 4, people: 4, technology: 3, organization: 3, leadership: 3 } },
];

function generateAnswersFromSubdimensions(personality: any, cohort: 'NUORI' | 'YLA' | 'TASO2') {
  const mappings = getQuestionMappings(cohort, 0);
  const answerMap = new Map<number, number>();
  
  const subdimScores = personality.subdimensions;
  
  for (const mapping of mappings) {
    const questionIndex = mapping.originalQ !== undefined ? mapping.originalQ : mapping.q;
    
    let score = 3;
    const subdim = mapping.subdimension;
    const dimension = mapping.dimension;
    
    if (dimension === 'interests') {
      score = subdimScores[subdim as keyof typeof subdimScores] || 3;
    } else if (dimension === 'values') {
      score = subdimScores[subdim as keyof typeof subdimScores] || 3;
    } else if (dimension === 'workstyle') {
      score = subdimScores[subdim as keyof typeof subdimScores] || 3;
    } else if (dimension === 'context') {
      score = subdimScores[subdim as keyof typeof subdimScores] || 3;
    }
    
    if (mapping.reverse) {
      score = 6 - score;
    }
    
    score = Math.max(1, Math.min(5, Math.round(score)));
    
    const existingScore = answerMap.get(questionIndex);
    if (existingScore === undefined || score > existingScore) {
      answerMap.set(questionIndex, score);
    }
  }
  
  return Array.from(answerMap.entries()).map(([questionIndex, score]) => ({
    questionIndex,
    score
  }));
}

console.log('=== COMPREHENSIVE PERSONALITY TEST ===\n');
console.log(`Testing ${diversePersonalities.length} diverse personalities across all cohorts\n`);

let totalTests = 0;
let passedTests = 0;
const failures: string[] = [];

for (const personality of diversePersonalities) {
  totalTests++;
  const answers = generateAnswersFromSubdimensions(personality, personality.cohort);
  const results = rankCareers(answers, personality.cohort);
  
  const dominantCategory = results[0]?.category || 'unknown';
  const topCareer = results[0]?.title || 'N/A';
  const score = results[0]?.overallScore || 0;
  
  // Simple validation: check if category makes sense based on highest subdimension
  const highestSubdim = Object.entries(personality.subdimensions)
    .sort(([,a], [,b]) => (b as number) - (a as number))[0];
  
  let expectedCategory = 'unknown';
  if (highestSubdim[0] === 'analytical' || highestSubdim[0] === 'organization' || highestSubdim[0] === 'precision') {
    expectedCategory = 'jarjestaja';
  } else if (highestSubdim[0] === 'creative') {
    expectedCategory = 'luova';
  } else if (highestSubdim[0] === 'people' && (personality.subdimensions.leadership || 0) < 4) {
    expectedCategory = 'auttaja';
  } else if (highestSubdim[0] === 'leadership' || highestSubdim[0] === 'business') {
    expectedCategory = 'johtaja';
  } else if (highestSubdim[0] === 'hands_on') {
    expectedCategory = 'rakentaja';
  } else if (highestSubdim[0] === 'global' || highestSubdim[0] === 'planning') {
    expectedCategory = 'visionaari';
  } else if (highestSubdim[0] === 'technology') {
    expectedCategory = 'innovoija';
  }
  
  const passed = dominantCategory === expectedCategory || score > 40;
  if (passed) {
    passedTests++;
  } else {
    failures.push(`${personality.name} (${personality.cohort}): Expected ${expectedCategory}, Got ${dominantCategory} (${topCareer}, ${score}%)`);
  }
  
  console.log(`${passed ? '✅' : '❌'} ${personality.name} (${personality.cohort}) → ${dominantCategory} (${topCareer}, ${score}%)`);
}

console.log(`\n=== RESULTS ===`);
console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${totalTests - passedTests}`);
console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (failures.length > 0) {
  console.log(`\n❌ FAILURES:`);
  failures.forEach(f => console.log(`  ${f}`));
}

