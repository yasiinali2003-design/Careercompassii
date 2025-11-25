/**
 * DIRECT PERSONALITY PROFILE TESTS
 * Uses manually-defined subdimensions for 100% accuracy testing
 */

import { generateUserProfile } from './lib/scoring/scoringEngine';

interface DirectProfile {
  name: string;
  description: string;
  expectedCategory: string;
  subdimensions: {
    interests: {
      technology?: number;
      people?: number;
      creative?: number;
      analytical?: number;
      hands_on?: number;
      leadership?: number;
      health?: number;
      environment?: number;
      innovation?: number;
    };
    workstyle: {
      leadership?: number;
      organization?: number;
      planning?: number;
      problem_solving?: number;
      precision?: number;
    };
    values: {
      career_clarity?: number;
      global?: number;
      impact?: number;
      advancement?: number;
      entrepreneurship?: number;
    };
  };
}

const profiles: DirectProfile[] = [
  {
    name: "Tech Innovator - Sara",
    description: "Loves coding, innovation, and technology. High tech affinity, creative problem-solving.",
    expectedCategory: "innovoija",
    subdimensions: {
      interests: {
        technology: 0.95,
        innovation: 0.9,
        creative: 0.6,
        people: 0.2,
        health: 0.1,
        leadership: 0.3,
        analytical: 0.8,
        hands_on: 0.2,
        environment: 0.3
      },
      workstyle: {
        problem_solving: 0.9,
        leadership: 0.3,
        organization: 0.5,
        planning: 0.6,
        precision: 0.7
      },
      values: {
        entrepreneurship: 0.7,
        advancement: 0.6,
        career_clarity: 0.5,
        global: 0.4,
        impact: 0.5
      }
    }
  },

  {
    name: "Caring Nurse - Mika",
    description: "Empathetic, wants to help people, interested in healthcare. People-oriented.",
    expectedCategory: "auttaja",
    subdimensions: {
      interests: {
        people: 0.95,
        health: 0.95,
        technology: 0.2,
        creative: 0.3,
        leadership: 0.2,
        analytical: 0.4,
        hands_on: 0.3,
        environment: 0.2,
        innovation: 0.2
      },
      workstyle: {
        leadership: 0.2,
        organization: 0.6,
        planning: 0.5,
        problem_solving: 0.5,
        precision: 0.7
      },
      values: {
        impact: 0.9,
        career_clarity: 0.6,
        advancement: 0.3,
        entrepreneurship: 0.1,
        global: 0.3
      }
    }
  },

  {
    name: "Construction Engineer - Antti",
    description: "Practical, hands-on, likes building things. Enjoys physical and technical work.",
    expectedCategory: "rakentaja",
    subdimensions: {
      interests: {
        hands_on: 0.95,
        technology: 0.6,
        people: 0.2,
        creative: 0.3,
        leadership: 0.2,
        health: 0.1,
        analytical: 0.6,
        environment: 0.3,
        innovation: 0.3
      },
      workstyle: {
        precision: 0.8,
        leadership: 0.2,
        organization: 0.6,
        planning: 0.5,
        problem_solving: 0.7
      },
      values: {
        career_clarity: 0.5,
        advancement: 0.5,
        impact: 0.4,
        entrepreneurship: 0.3,
        global: 0.2
      }
    }
  },

  {
    name: "Environmental Activist - Liisa",
    description: "Passionate about environment, sustainability, and climate change. Mission-driven.",
    expectedCategory: "ympariston-puolustaja",
    subdimensions: {
      interests: {
        environment: 0.95,
        people: 0.5,
        technology: 0.4,
        creative: 0.5,
        leadership: 0.3,
        health: 0.3,
        analytical: 0.6,
        hands_on: 0.3,
        innovation: 0.6
      },
      workstyle: {
        leadership: 0.3,
        organization: 0.5,
        planning: 0.6,
        problem_solving: 0.7,
        precision: 0.5
      },
      values: {
        impact: 0.95,
        global: 0.8,
        career_clarity: 0.5,
        advancement: 0.4,
        entrepreneurship: 0.4
      }
    }
  },

  {
    name: "Business Leader - Petri",
    description: "Strong leadership skills, strategic thinking, business-oriented. Likes managing teams.",
    expectedCategory: "johtaja",
    subdimensions: {
      interests: {
        leadership: 0.95,
        people: 0.6,
        technology: 0.4,
        creative: 0.3,
        analytical: 0.7,
        hands_on: 0.1,
        health: 0.1,
        environment: 0.2,
        innovation: 0.5
      },
      workstyle: {
        leadership: 0.95,
        planning: 0.8,
        organization: 0.8,
        problem_solving: 0.7,
        precision: 0.6
      },
      values: {
        advancement: 0.9,
        entrepreneurship: 0.8,
        career_clarity: 0.7,
        global: 0.6,
        impact: 0.5
      }
    }
  },

  {
    name: "Creative Designer - Emma",
    description: "Artistic, loves design and visual arts. Creative problem solver.",
    expectedCategory: "luova",
    subdimensions: {
      interests: {
        creative: 0.95,
        technology: 0.5,
        people: 0.4,
        analytical: 0.3,
        leadership: 0.2,
        hands_on: 0.4,
        health: 0.1,
        environment: 0.3,
        innovation: 0.6
      },
      workstyle: {
        leadership: 0.2,
        organization: 0.4,
        planning: 0.5,
        problem_solving: 0.7,
        precision: 0.6
      },
      values: {
        career_clarity: 0.5,
        advancement: 0.5,
        entrepreneurship: 0.6,
        impact: 0.4,
        global: 0.3
      }
    }
  },

  {
    name: "Strategic Visionary - Kari",
    description: "Big-picture thinker, long-term planning, global perspective. Strategic consultant.",
    expectedCategory: "visionaari",
    subdimensions: {
      interests: {
        innovation: 0.8,
        people: 0.4,
        technology: 0.5,
        creative: 0.5,
        analytical: 0.7,
        leadership: 0.4,
        hands_on: 0.1,
        health: 0.1,
        environment: 0.4
      },
      workstyle: {
        planning: 0.95,
        leadership: 0.4,
        organization: 0.6,
        problem_solving: 0.8,
        precision: 0.6
      },
      values: {
        career_clarity: 0.95,
        global: 0.95,
        advancement: 0.7,
        entrepreneurship: 0.7,
        impact: 0.7
      }
    }
  },

  {
    name: "Project Coordinator - Sanna",
    description: "Organized, detail-oriented, loves structure and planning. Administrative excellence.",
    expectedCategory: "jarjestaja",
    subdimensions: {
      interests: {
        analytical: 0.9,
        people: 0.4,
        technology: 0.5,
        creative: 0.2,
        leadership: 0.3,
        hands_on: 0.1,
        health: 0.1,
        environment: 0.2,
        innovation: 0.3
      },
      workstyle: {
        organization: 0.95,
        planning: 0.9,
        precision: 0.9,
        leadership: 0.3,
        problem_solving: 0.6
      },
      values: {
        career_clarity: 0.6,
        advancement: 0.5,
        entrepreneurship: 0.3,
        impact: 0.4,
        global: 0.3
      }
    }
  },

  {
    name: "Balanced Professional - Juhani",
    description: "Well-rounded, adaptable, enjoys variety. Moderate in all areas.",
    expectedCategory: "auttaja",
    subdimensions: {
      interests: {
        people: 0.7,
        technology: 0.5,
        creative: 0.5,
        analytical: 0.5,
        leadership: 0.4,
        hands_on: 0.3,
        health: 0.6,
        environment: 0.4,
        innovation: 0.5
      },
      workstyle: {
        leadership: 0.4,
        organization: 0.6,
        planning: 0.6,
        problem_solving: 0.6,
        precision: 0.5
      },
      values: {
        impact: 0.7,
        career_clarity: 0.5,
        advancement: 0.5,
        entrepreneurship: 0.4,
        global: 0.4
      }
    }
  },

  {
    name: "Artistic Teacher - Maria",
    description: "Creative educator, loves teaching through arts. Combines creativity with helping others.",
    expectedCategory: "auttaja",
    subdimensions: {
      interests: {
        people: 0.9,
        creative: 0.8,
        health: 0.5,
        technology: 0.3,
        analytical: 0.4,
        leadership: 0.3,
        hands_on: 0.4,
        environment: 0.3,
        innovation: 0.4
      },
      workstyle: {
        leadership: 0.3,
        organization: 0.6,
        planning: 0.7,
        problem_solving: 0.6,
        precision: 0.5
      },
      values: {
        impact: 0.9,
        career_clarity: 0.6,
        advancement: 0.4,
        entrepreneurship: 0.3,
        global: 0.3
      }
    }
  }
];

// Run tests
console.log('=' + '='.repeat(79));
console.log('DIRECT PERSONALITY PROFILE TESTS');
console.log('Testing with manually-defined subdimensions for 100% accuracy');
console.log('=' + '='.repeat(79));
console.log('');

let correctMatches = 0;
const categoryDistribution: Record<string, number> = {};

for (const profile of profiles) {
  console.log(`📋 Testing: ${profile.name}`);
  console.log(`   Description: ${profile.description}`);
  console.log(`   Expected Category: ${profile.expectedCategory}`);

  const result = generateUserProfile(
    profile.subdimensions.interests as any,
    profile.subdimensions.workstyle as any,
    profile.subdimensions.values as any,
    {} as any,
    'TASO2'
  );

  const matchedCategory = result.dominantCategory;
  const isCorrect = matchedCategory === profile.expectedCategory;

  categoryDistribution[matchedCategory] = (categoryDistribution[matchedCategory] || 0) + 1;

  if (isCorrect) {
    correctMatches++;
    console.log(`   ✅ Match: CORRECT`);
  } else {
    console.log(`   ❌ Match: INCORRECT (got ${matchedCategory})`);
  }

  console.log('');
}

// Summary
console.log('=' + '='.repeat(79));
console.log('TEST SUMMARY');
console.log('=' + '='.repeat(79));
console.log('');
console.log(`Total Tests: ${profiles.length}`);
console.log(`Correct Category Matches: ${correctMatches}/${profiles.length} (${Math.round(correctMatches / profiles.length * 100)}%)`);
console.log('');
console.log('📊 Overall Category Distribution:');

const sortedCategories = Object.entries(categoryDistribution)
  .sort(([, a], [, b]) => b - a);

for (const [category, count] of sortedCategories) {
  const percentage = Math.round((count / profiles.length) * 100);
  const bars = '█'.repeat(Math.round(percentage / 5));
  console.log(`   ${category.padEnd(25)} ${bars} ${percentage}% (${count}/${profiles.length})`);
}

console.log('');
console.log('🎯 Auttaja Dominance Check:');
const auttajaPercentage = Math.round(((categoryDistribution['auttaja'] || 0) / profiles.length) * 100);
if (auttajaPercentage > 40) {
  console.log(`   ⚠️  WARNING: ${auttajaPercentage}% matched to 'auttaja' - Problem may still exist!`);
} else {
  console.log(`   ✅ GOOD: ${auttajaPercentage}% matched to 'auttaja' - Well distributed!`);
}

console.log('');
console.log('🌈 Category Diversity:');
console.log(`   Categories matched: ${Object.keys(categoryDistribution).length}/8`);
if (Object.keys(categoryDistribution).length < 6) {
  console.log(`   ⚠️  WARNING: Only ${Object.keys(categoryDistribution).length} categories used - Limited diversity`);
} else {
  console.log(`   ✅ GOOD: ${Object.keys(categoryDistribution).length} categories represented`);
}

if (correctMatches < profiles.length) {
  console.log('');
  console.log('❌ Failed Matches:');
  for (const profile of profiles) {
    const scores = calculatePersonalityScores(
      profile.subdimensions.interests as any,
      profile.subdimensions.workstyle as any,
      profile.subdimensions.values as any,
      {} as any,
      'TASO2'
    );
    if (scores.dominantCategory !== profile.expectedCategory) {
      console.log(`   ${profile.name}: Expected ${profile.expectedCategory}, got ${scores.dominantCategory}`);
    }
  }
}

console.log('');
console.log('=' + '='.repeat(79));
if (correctMatches === profiles.length) {
  console.log('🎉 SUCCESS! 100% accuracy achieved!');
} else {
  console.log(`❌ ${profiles.length - correctMatches} tests still failing. Needs further tuning.`);
}
console.log('=' + '='.repeat(79));
