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

// Comprehensive set of diverse personality profiles
const personalities: PersonalityProfile[] = [
  // === ORGANIZER PROFILES ===
  {
    name: "The Detail-Oriented Planner",
    traits: ["meticulous", "organized", "systematic"],
    expectedCategory: "jarjestaja",
    subdimensions: {
      organization: 5,
      precision: 5,
      structure: 5,
      planning: 5,
      analytical: 4,
      leadership: 1,
      business: 1,
      creative: 1,
      technology: 2,
      hands_on: 2
    }
  },
  {
    name: "The Methodical Analyst",
    traits: ["analytical", "precise", "logical"],
    expectedCategory: "jarjestaja",
    subdimensions: {
      analytical: 5,
      precision: 5,
      organization: 4,
      structure: 4,
      planning: 4,
      leadership: 2,
      business: 2,
      creative: 1,
      technology: 3,
      hands_on: 2
    }
  },
  {
    name: "The Structured Coordinator",
    traits: ["organized", "efficient", "reliable"],
    expectedCategory: "jarjestaja",
    subdimensions: {
      organization: 5,
      structure: 5,
      planning: 4,
      precision: 4,
      analytical: 3,
      leadership: 2,
      business: 2,
      creative: 2,
      technology: 2,
      hands_on: 2
    }
  },

  // === CREATIVE PROFILES ===
  {
    name: "The Artistic Visionary",
    traits: ["creative", "expressive", "imaginative"],
    expectedCategory: "luova",
    subdimensions: {
      creative: 5,
      innovation: 5,
      people: 4,
      independence: 4,
      leadership: 2,
      business: 2,
      health: 1,
      impact: 1,
      organization: 1,
      technology: 2
    }
  },
  {
    name: "The Expressive Performer",
    traits: ["artistic", "charismatic", "entertaining"],
    expectedCategory: "luova",
    subdimensions: {
      creative: 5,
      people: 5,
      innovation: 4,
      independence: 3,
      leadership: 2,
      business: 2,
      health: 1,
      impact: 1,
      organization: 1,
      technology: 1
    }
  },
  {
    name: "The Creative Communicator",
    traits: ["artistic", "expressive", "social"],
    expectedCategory: "luova",
    subdimensions: {
      creative: 5,
      people: 4,
      innovation: 4,
      independence: 3,
      leadership: 2,
      business: 2,
      health: 1,
      impact: 1,
      organization: 1,
      technology: 2
    }
  },

  // === VISIONARY PROFILES ===
  {
    name: "The Global Strategist",
    traits: ["forward-thinking", "world-minded", "strategic"],
    expectedCategory: "visionaari",
    subdimensions: {
      global: 5,
      planning: 5,
      innovation: 4,
      analytical: 3,
      leadership: 2,
      business: 2,
      people: 2,
      organization: 2,
      creative: 2,
      technology: 2
    }
  },
  {
    name: "The Future Planner",
    traits: ["strategic", "visionary", "analytical"],
    expectedCategory: "visionaari",
    subdimensions: {
      global: 5,
      planning: 5,
      analytical: 4,
      innovation: 3,
      leadership: 2,
      business: 2,
      people: 2,
      organization: 2,
      creative: 2,
      technology: 2
    }
  },
  {
    name: "The International Thinker",
    traits: ["global-minded", "strategic", "innovative"],
    expectedCategory: "visionaari",
    subdimensions: {
      global: 5,
      planning: 4,
      innovation: 4,
      analytical: 3,
      leadership: 2,
      business: 2,
      people: 2,
      organization: 2,
      creative: 2,
      technology: 2
    }
  },

  // === HELPER PROFILES ===
  {
    name: "The Caring Supporter",
    traits: ["empathetic", "supportive", "compassionate"],
    expectedCategory: "auttaja",
    subdimensions: {
      people: 5,
      health: 5,
      impact: 4,
      teamwork: 4,
      leadership: 2,
      business: 1,
      creative: 2,
      organization: 2,
      technology: 1,
      global: 2
    }
  },
  {
    name: "The Health Advocate",
    traits: ["caring", "health-focused", "supportive"],
    expectedCategory: "auttaja",
    subdimensions: {
      people: 5,
      health: 5,
      impact: 3,
      teamwork: 4,
      leadership: 2,
      business: 1,
      creative: 1,
      organization: 2,
      technology: 2,
      global: 2
    }
  },
  {
    name: "The Social Worker",
    traits: ["empathetic", "helpful", "people-oriented"],
    expectedCategory: "auttaja",
    subdimensions: {
      people: 5,
      health: 4,
      impact: 4,
      teamwork: 4,
      leadership: 2,
      business: 1,
      creative: 2,
      organization: 2,
      technology: 1,
      global: 2
    }
  },

  // === INNOVATOR PROFILES ===
  {
    name: "The Tech Enthusiast",
    traits: ["tech-savvy", "innovative", "logical"],
    expectedCategory: "innovoija",
    subdimensions: {
      technology: 5,
      innovation: 5,
      analytical: 5,
      problem_solving: 4,
      independence: 4,
      leadership: 2,
      business: 2,
      people: 2,
      creative: 2,
      organization: 2
    }
  },
  {
    name: "The Digital Innovator",
    traits: ["tech-focused", "creative", "problem-solving"],
    expectedCategory: "innovoija",
    subdimensions: {
      technology: 5,
      innovation: 5,
      analytical: 4,
      problem_solving: 4,
      independence: 3,
      leadership: 2,
      business: 2,
      people: 2,
      creative: 3,
      organization: 2
    }
  },
  {
    name: "The Code Creator",
    traits: ["programming", "logical", "innovative"],
    expectedCategory: "innovoija",
    subdimensions: {
      technology: 5,
      innovation: 4,
      analytical: 5,
      problem_solving: 5,
      independence: 4,
      leadership: 1,
      business: 2,
      people: 1,
      creative: 2,
      organization: 2
    }
  },

  // === BUILDER PROFILES ===
  {
    name: "The Skilled Craftsman",
    traits: ["hands-on", "practical", "skilled"],
    expectedCategory: "rakentaja",
    subdimensions: {
      hands_on: 5,
      precision: 4,
      independence: 4,
      problem_solving: 3,
      leadership: 1,
      business: 1,
      people: 2,
      creative: 2,
      organization: 2,
      technology: 2
    }
  },
  {
    name: "The Practical Builder",
    traits: ["hands-on", "mechanical", "practical"],
    expectedCategory: "rakentaja",
    subdimensions: {
      hands_on: 5,
      precision: 4,
      independence: 3,
      problem_solving: 3,
      leadership: 1,
      business: 1,
      people: 2,
      creative: 1,
      organization: 2,
      technology: 3
    }
  },
  {
    name: "The Manual Worker",
    traits: ["hands-on", "physical", "practical"],
    expectedCategory: "rakentaja",
    subdimensions: {
      hands_on: 5,
      precision: 3,
      independence: 4,
      problem_solving: 2,
      leadership: 1,
      business: 1,
      people: 2,
      creative: 1,
      organization: 2,
      technology: 2
    }
  },

  // === LEADER PROFILES ===
  {
    name: "The Ambitious Executive",
    traits: ["ambitious", "decisive", "results-driven"],
    expectedCategory: "johtaja",
    subdimensions: {
      leadership: 5,
      business: 5,
      entrepreneurship: 4,
      advancement: 4,
      organization: 3,
      planning: 3,
      people: 3,
      creative: 2,
      technology: 2,
      hands_on: 1
    }
  },
  {
    name: "The Natural Leader",
    traits: ["leadership", "charismatic", "strategic"],
    expectedCategory: "johtaja",
    subdimensions: {
      leadership: 5,
      business: 4,
      entrepreneurship: 3,
      advancement: 4,
      organization: 3,
      planning: 4,
      people: 4,
      creative: 2,
      technology: 2,
      hands_on: 1
    }
  },
  {
    name: "The Business Strategist",
    traits: ["business-minded", "leadership", "strategic"],
    expectedCategory: "johtaja",
    subdimensions: {
      leadership: 5,
      business: 5,
      entrepreneurship: 3,
      advancement: 4,
      organization: 4,
      planning: 4,
      people: 3,
      creative: 2,
      technology: 2,
      hands_on: 1
    }
  },

  // === EDGE CASES ===
  {
    name: "The Balanced Professional",
    traits: ["balanced", "versatile", "moderate"],
    expectedCategory: "jarjestaja", // Should default to organizer when balanced
    subdimensions: {
      organization: 4,
      planning: 4,
      analytical: 4,
      leadership: 3,
      business: 3,
      people: 3,
      creative: 3,
      technology: 3,
      hands_on: 3,
      precision: 3
    }
  },
  {
    name: "The High Tech Organizer",
    traits: ["tech-savvy", "organized", "analytical"],
    expectedCategory: "jarjestaja", // Organization should win over tech
    subdimensions: {
      organization: 5,
      structure: 5,
      precision: 5,
      technology: 4,
      analytical: 4,
      planning: 4,
      leadership: 2,
      business: 2,
      creative: 1,
      hands_on: 2
    }
  },
  {
    name: "The Creative Organizer",
    traits: ["creative", "organized", "artistic"],
    expectedCategory: "luova", // Creative should win when high
    subdimensions: {
      creative: 5,
      people: 4,
      organization: 4,
      innovation: 4,
      independence: 3,
      leadership: 2,
      business: 2,
      health: 1,
      impact: 1,
      technology: 2
    }
  },
  {
    name: "The Low Tech Visionary",
    traits: ["strategic", "global", "low-tech"],
    expectedCategory: "visionaari", // Should be visionaari despite low tech
    subdimensions: {
      global: 5,
      planning: 5,
      innovation: 3,
      analytical: 3,
      leadership: 2,
      business: 2,
      people: 2,
      organization: 2,
      creative: 2,
      technology: 1 // Very low tech
    }
  },
  {
    name: "The People-Focused Creative",
    traits: ["people-oriented", "creative", "entertaining"],
    expectedCategory: "luova", // Creative+people without helping = luova
    subdimensions: {
      creative: 5,
      people: 5,
      innovation: 3,
      independence: 3,
      leadership: 2,
      business: 2,
      health: 1, // Low helping signals
      impact: 1,
      organization: 1,
      technology: 2
    }
  }
];

function runTests() {
  const cohorts: Cohort[] = ['YLA', 'TASO2', 'NUORI'];
  const results: any[] = [];
  
  for (const cohort of cohorts) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`${cohort} COHORT - ${personalities.length} Tests`);
    console.log('='.repeat(80));
    
    let passed = 0;
    let failed = 0;
    const failures: string[] = [];
    const successes: string[] = [];
    
    for (const personality of personalities) {
      const answers = generateAnswersFromSubdimensions(personality, cohort);
      const profile = generateUserProfile(answers, cohort);
      const careers = rankCareers(answers, cohort, 5);
      
      const topCareer = careers[0];
      const gotCategory = topCareer?.category || 'unknown';
      const expectedCategory = personality.expectedCategory;
      const matchScore = (topCareer as any)?.overallScore || 0;
      
      if (gotCategory === expectedCategory) {
        passed++;
        successes.push(`${personality.name} → ${gotCategory} (${matchScore.toFixed(1)}%)`);
      } else {
        failed++;
        failures.push(`${personality.name}`);
        console.log(`\n❌ ${personality.name}`);
        console.log(`  Expected: ${expectedCategory}`);
        console.log(`  Got:      ${gotCategory}`);
        console.log(`  Top Career: ${topCareer?.title || 'N/A'} (${matchScore.toFixed(1)}%)`);
        
        // Show top 3 categories
        const categoryScores: Record<string, number> = {};
        careers.forEach((career: any) => {
          const cat = career.category;
          if (!categoryScores[cat]) {
            categoryScores[cat] = 0;
          }
          categoryScores[cat] = Math.max(categoryScores[cat], career.overallScore || 0);
        });
        const topCategories = Object.entries(categoryScores)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3);
        console.log(`  Top Categories: ${topCategories.map(([cat, score]) => `${cat} (${score.toFixed(1)}%)`).join(', ')}`);
      }
    }
    
    const successRate = ((passed / personalities.length) * 100).toFixed(1);
    
    console.log(`\n${'='.repeat(80)}`);
    console.log(`RESULTS FOR ${cohort} COHORT`);
    console.log('='.repeat(80));
    
    if (failures.length > 0) {
      console.log(`\n❌ FAILURES (${failures.length}):`);
      console.log('-'.repeat(80));
      failures.forEach(f => console.log(`  ${f}`));
    }
    
    if (successes.length > 0) {
      console.log(`\n✅ SUCCESSES (${successes.length}):`);
      console.log('-'.repeat(80));
      successes.forEach(s => console.log(`  ${s}`));
    }
    
    console.log(`\n${'='.repeat(80)}`);
    console.log(`COHORT SUMMARY: ${cohort}`);
    console.log('='.repeat(80));
    console.log(`Total Tests: ${personalities.length}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Success Rate: ${successRate}%`);
    
    results.push({
      cohort,
      total: personalities.length,
      passed,
      failed,
      successRate: parseFloat(successRate),
      failures,
      successes
    });
  }
  
  // Overall summary
  const totalTests = results.reduce((sum, r) => sum + r.total, 0);
  const totalPassed = results.reduce((sum, r) => sum + r.passed, 0);
  const totalFailed = results.reduce((sum, r) => sum + r.failed, 0);
  const overallSuccessRate = ((totalPassed / totalTests) * 100).toFixed(1);
  
  console.log(`\n${'='.repeat(80)}`);
  console.log('OVERALL SUMMARY ACROSS ALL COHORTS');
  console.log('='.repeat(80));
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${totalPassed}`);
  console.log(`Failed: ${totalFailed}`);
  console.log(`Overall Success Rate: ${overallSuccessRate}%`);
  
  console.log(`\n${'='.repeat(80)}`);
  console.log('COHORT BREAKDOWN');
  console.log('='.repeat(80));
  results.forEach(r => {
    console.log(`${r.cohort}: ${r.passed}/${r.total} (${r.successRate}%)`);
  });
  
  // Detailed analysis
  console.log(`\n${'='.repeat(80)}`);
  console.log('DETAILED ANALYSIS');
  console.log('='.repeat(80));
  
  // Analyze failures by category
  const failuresByCategory: Record<string, { expected: string; got: string; cohort: string; personality: string }[]> = {};
  results.forEach(result => {
    result.failures.forEach((failure: string) => {
      const personality = personalities.find(p => p.name === failure);
      if (personality) {
        const answers = generateAnswersFromSubdimensions(personality, result.cohort as Cohort);
        const careers = rankCareers(answers, result.cohort as Cohort, 5);
        const gotCategory = careers[0]?.category || 'unknown';
        const key = `${personality.expectedCategory} → ${gotCategory}`;
        if (!failuresByCategory[key]) {
          failuresByCategory[key] = [];
        }
        failuresByCategory[key].push({
          expected: personality.expectedCategory,
          got: gotCategory,
          cohort: result.cohort,
          personality: personality.name
        });
      }
    });
  });
  
  if (Object.keys(failuresByCategory).length > 0) {
    console.log('\nFailure Patterns:');
    Object.entries(failuresByCategory).forEach(([pattern, cases]) => {
      console.log(`\n  ${pattern}: ${cases.length} case(s)`);
      cases.forEach(c => {
        console.log(`    - ${c.personality} (${c.cohort})`);
      });
    });
  }
  
  // Analyze successes by category
  const successesByCategory: Record<string, number> = {};
  results.forEach(result => {
    result.successes.forEach((success: string) => {
      const match = success.match(/→ (\w+) \(/);
      if (match) {
        const category = match[1];
        successesByCategory[category] = (successesByCategory[category] || 0) + 1;
      }
    });
  });
  
  console.log('\nSuccess Distribution:');
  Object.entries(successesByCategory).forEach(([category, count]) => {
    console.log(`  ${category}: ${count} success(es)`);
  });
  
  return results;
}

// Run tests
runTests();






















