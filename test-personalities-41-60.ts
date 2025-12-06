import { generateUserProfile, rankCareers } from './lib/scoring/scoringEngine';
import { getQuestionMappings } from './lib/scoring/dimensions';
import { TestAnswer } from './lib/scoring/types';

type Cohort = 'YLA' | 'TASO2' | 'NUORI';

interface PersonalityProfile {
  name: string;
  traits: string[];
  expectedCategory: string;
  subdimensions: Record<string, number>;
}

function generateAnswersFromSubdimensions(
  personality: PersonalityProfile,
  cohort: Cohort
): TestAnswer[] {
  const mappings = getQuestionMappings(cohort, 0);
  const answerMap = new Map<number, number>();
  
  const subdimScores = personality.subdimensions;
  
  for (const mapping of mappings) {
    const questionIndex = mapping.originalQ !== undefined ? mapping.originalQ : mapping.q;
    
    let score = 3;
    const subdim = mapping.subdimension;
    const dimension = mapping.dimension;
    
    if (dimension === 'interests') {
      if (subdim === 'leadership') {
        score = subdimScores.leadership || 3;
      } else {
        score = subdimScores[subdim as keyof typeof subdimScores] || 3;
      }
    } else if (dimension === 'values') {
      if (subdim === 'global') {
        score = subdimScores.global || 3;
      } else {
        score = subdimScores[subdim as keyof typeof subdimScores] || 3;
      }
    } else if (dimension === 'workstyle') {
      if (subdim === 'leadership') {
        score = subdimScores.leadershipWorkstyle || 3;
      } else {
        score = subdimScores[subdim as keyof typeof subdimScores] || 3;
      }
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

const personalities: PersonalityProfile[] = [
  {
    name: "The Gentle Optimist",
    traits: ["hopeful", "kind", "resilient"],
    expectedCategory: "auttaja",
    subdimensions: {
      people: 5,
      impact: 4,
      growth: 4,
      health: 3,
      teamwork: 4,
      creative: 2,
      technology: 1,
      leadership: 1,
      organization: 2
    }
  },
  {
    name: "The Tactical Planner",
    traits: ["strategic", "organized", "anticipatory"],
    expectedCategory: "jarjestaja",
    subdimensions: {
      organization: 5,
      planning: 5,
      analytical: 4,
      structure: 5,
      precision: 4,
      people: 2,
      creative: 1,
      leadership: 2,
      technology: 2
    }
  },
  {
    name: "The Reclusive Intellectual",
    traits: ["solitary", "observant", "deep thinker"],
    expectedCategory: "innovoija",
    subdimensions: {
      analytical: 5,
      technology: 4,
      innovation: 4,
      independence: 5,
      people: 1,
      creative: 2,
      leadership: 1,
      organization: 2,
      teamwork: 1
    }
  },
  {
    name: "The Cheerful Carefree One",
    traits: ["upbeat", "playful", "spontaneous"],
    expectedCategory: "luova",
    subdimensions: {
      creative: 5,
      people: 4,
      innovation: 3,
      independence: 4,
      organization: 1,
      structure: 1,
      leadership: 1,
      analytical: 1,
      technology: 1
    }
  },
  {
    name: "The Fiercely Loyal Defender",
    traits: ["protective", "strong-willed", "dependable"],
    expectedCategory: "auttaja",
    subdimensions: {
      people: 5,
      impact: 4,
      teamwork: 4,
      leadership: 3,
      organization: 3,
      structure: 3,
      creative: 1,
      technology: 1,
      independence: 2
    }
  },
  {
    name: "The Patient Visionary",
    traits: ["calm", "future-oriented", "wise"],
    expectedCategory: "visionaari",
    subdimensions: {
      global: 5,
      planning: 5,
      impact: 4,
      innovation: 4,
      people: 3,
      organization: 2,
      creative: 2,
      leadership: 2,
      technology: 2
    }
  },
  {
    name: "The Competitive Perfectionist",
    traits: ["driven", "exacting", "relentless"],
    expectedCategory: "johtaja",
    subdimensions: {
      leadership: 5,
      business: 5,
      advancement: 5,
      precision: 5,
      organization: 4,
      analytical: 3,
      people: 2,
      creative: 1,
      technology: 2
    }
  },
  {
    name: "The Compassionate Listener",
    traits: ["empathetic", "patient", "understanding"],
    expectedCategory: "auttaja",
    subdimensions: {
      people: 5,
      health: 4,
      impact: 5,
      growth: 4,
      teamwork: 4,
      creative: 1,
      technology: 1,
      leadership: 1,
      organization: 2
    }
  },
  {
    name: "The Nonconformist Free Thinker",
    traits: ["unconventional", "logical", "independent"],
    expectedCategory: "luova",
    subdimensions: {
      creative: 5,
      independence: 5,
      innovation: 4,
      analytical: 3,
      entrepreneurship: 3,
      leadership: 1,
      organization: 1,
      structure: 1,
      people: 2
    }
  },
  {
    name: "The Gentle Traditionalist",
    traits: ["respectful", "routine-loving", "careful"],
    expectedCategory: "jarjestaja",
    subdimensions: {
      organization: 5,
      structure: 5,
      precision: 4,
      analytical: 3,
      people: 2,
      creative: 1,
      technology: 1,
      leadership: 1,
      planning: 2
    }
  },
  {
    name: "The Bold Entertainer",
    traits: ["charismatic", "confident", "lively"],
    expectedCategory: "luova",
    subdimensions: {
      creative: 5,
      people: 5,
      innovation: 3,
      independence: 4,
      leadership: 2,
      organization: 1,
      analytical: 1,
      technology: 1
    }
  },
  {
    name: "The Calculated Risk-Taker",
    traits: ["analytical", "daring", "efficient"],
    expectedCategory: "johtaja",
    subdimensions: {
      leadership: 5,
      business: 5,
      entrepreneurship: 4,
      analytical: 4,
      advancement: 5,
      innovation: 3,
      organization: 3,
      people: 2,
      creative: 2
    }
  },
  {
    name: "The Gentle Realist",
    traits: ["practical", "calm", "understanding"],
    expectedCategory: "rakentaja",
    subdimensions: {
      hands_on: 5,
      precision: 4,
      structure: 4,
      analytical: 3,
      organization: 3,
      people: 2,
      creative: 1,
      technology: 2,
      leadership: 1
    }
  },
  {
    name: "The Tactical Debater",
    traits: ["sharp-minded", "articulate", "logical"],
    expectedCategory: "johtaja",
    subdimensions: {
      leadership: 5,
      analytical: 5,
      business: 4,
      advancement: 4,
      organization: 3,
      people: 3,
      creative: 2,
      technology: 2,
      independence: 3
    }
  },
  {
    name: "The Soft-Spoken Organizer",
    traits: ["efficient", "meticulous", "humble"],
    expectedCategory: "jarjestaja",
    subdimensions: {
      organization: 5,
      precision: 5,
      structure: 5,
      analytical: 4,
      planning: 3,
      people: 2,
      creative: 1,
      technology: 2,
      leadership: 1
    }
  },
  {
    name: "The Adventurous Humanitarian",
    traits: ["brave", "compassionate", "selfless"],
    expectedCategory: "auttaja",
    subdimensions: {
      people: 5,
      impact: 5,
      health: 4,
      global: 4,
      independence: 4,
      teamwork: 4,
      leadership: 2,
      creative: 1,
      technology: 1
    }
  },
  {
    name: "The Curious Social Observer",
    traits: ["perceptive", "reflective", "people-watcher"],
    expectedCategory: "luova",
    subdimensions: {
      creative: 5,
      people: 4,
      analytical: 3,
      independence: 4,
      innovation: 3,
      organization: 1,
      leadership: 1,
      technology: 1,
      teamwork: 2
    }
  },
  {
    name: "The Ambitious Innovator",
    traits: ["creative", "forward-thinking", "relentless"],
    expectedCategory: "innovoija",
    subdimensions: {
      technology: 5,
      innovation: 5,
      creative: 4,
      analytical: 4,
      entrepreneurship: 4,
      independence: 4,
      people: 2,
      leadership: 2,
      organization: 2
    }
  },
  {
    name: "The Honest Traditional Leader",
    traits: ["honorable", "responsible", "structured"],
    expectedCategory: "johtaja",
    subdimensions: {
      leadership: 5,
      business: 4,
      organization: 5,
      structure: 4,
      planning: 4,
      people: 3,
      analytical: 3,
      creative: 1,
      technology: 2
    }
  },
  {
    name: "The Mysterious Wanderer",
    traits: ["enigmatic", "insightful", "independent"],
    expectedCategory: "visionaari",
    subdimensions: {
      global: 5,
      independence: 5,
      planning: 4,
      innovation: 3,
      people: 2,
      creative: 2,
      leadership: 1,
      organization: 1,
      technology: 1
    }
  }
];

function runTests() {
  const cohorts: Cohort[] = ['YLA', 'TASO2', 'NUORI'];
  const results: any[] = [];
  
  for (const cohort of cohorts) {
    console.log(`\n${cohort} COHORT - ${personalities.length} Tests`);
    console.log('='.repeat(80));
    
    let passed = 0;
    let failed = 0;
    const failures: any[] = [];
    
    for (const personality of personalities) {
      const answers = generateAnswersFromSubdimensions(personality, cohort);
      const profile = generateUserProfile(answers, cohort);
      const careers = rankCareers(answers, cohort, 5);
      
      const topCareer = careers[0];
      const actualCategory = topCareer?.category || 'unknown';
      const expectedCategory = personality.expectedCategory;
      
      const passedTest = actualCategory === expectedCategory;
      
      if (passedTest) {
        passed++;
      } else {
        failed++;
        failures.push({
          name: personality.name,
          expected: expectedCategory,
          got: actualCategory,
          topCareer: topCareer?.title || 'N/A',
          score: (topCareer as any)?.overallScore || 0
        });
      }
      
      results.push({
        cohort,
        personality: personality.name,
        expected: expectedCategory,
        actual: actualCategory,
        passed: passedTest,
        topCareer: topCareer?.title || 'N/A',
        score: (topCareer as any)?.overallScore || 0
      });
    }
    
    const successRate = (passed / personalities.length) * 100;
    console.log(`Success Rate: ${passed}/${personalities.length} (${successRate.toFixed(1)}%)\n`);
    
    if (failures.length > 0) {
      console.log('❌ FAILURES:');
      console.log('-'.repeat(80));
      for (const failure of failures) {
        console.log(`\n${failure.name}`);
        console.log(`  Expected: ${failure.expected}`);
        console.log(`  Got:      ${failure.got}`);
        console.log(`  Top Career: ${failure.topCareer} (${failure.score.toFixed(1)}%)`);
      }
    } else {
      console.log('✅ ALL TESTS PASSED!');
    }
    
    console.log(`\n✅ SUCCESSES (${passed}):`);
    console.log('-'.repeat(80));
    const successes = results.filter(r => r.cohort === cohort && r.passed);
    for (const success of successes.slice(0, 10)) {
      const score = typeof success.score === 'number' ? success.score : 0;
      console.log(`${success.personality} → ${success.actual} (${score.toFixed(1)}%)`);
    }
    if (successes.length > 10) {
      console.log(`... and ${successes.length - 10} more`);
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('OVERALL SUMMARY');
  console.log('='.repeat(80));
  
  const totalTests = personalities.length * cohorts.length;
  const totalPassed = results.filter(r => r.passed).length;
  const totalFailed = totalTests - totalPassed;
  const overallSuccessRate = (totalPassed / totalTests) * 100;
  
  console.log(`\nTotal Tests: ${totalTests}`);
  console.log(`Passed: ${totalPassed}`);
  console.log(`Failed: ${totalFailed}`);
  console.log(`Success Rate: ${overallSuccessRate.toFixed(1)}%\n`);
  
  if (overallSuccessRate >= 95) {
    console.log('✅ EXCELLENT! Test is working very well.');
  } else if (overallSuccessRate >= 90) {
    console.log('✅ GOOD! Test is working well with minor issues.');
  } else {
    console.log('⚠️  NEEDS IMPROVEMENT. Some personalities are being misclassified.');
  }
}

runTests();

