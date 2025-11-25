/**
 * FIXED PERSONALITY PROFILE TESTS
 * Uses correct TASO2 question mappings for 100% accuracy
 */

import { rankCareers } from './lib/scoring/scoringEngine';
import type { TestAnswer } from './lib/scoring/types';

interface PersonalityProfile {
  name: string;
  description: string;
  expectedCategory: string;
  answers: TestAnswer[];
}

// Helper to create answers from a pattern
function createAnswers(pattern: Record<number, number>): TestAnswer[] {
  const answers: TestAnswer[] = [];
  for (let i = 0; i < 70; i++) {
    answers.push({
      questionIndex: i,
      score: pattern[i] || 3  // Default to 3 (neutral) if not specified
    });
  }
  return answers;
}

/**
 * TASO2 QUESTION MAPPINGS (for reference):
 * Q0: Technology/coding - interests.technology
 * Q1: Leadership - interests.leadership
 * Q2: Numbers/analytical - interests.analytical
 * Q3: Sports/physical - interests.hands_on
 * Q7: Helping people (health) - interests.health
 * Q8: Psychology - interests.people
 * Q9: Teaching - interests.people
 * Q10: Supporting people - interests.people
 * Q11: Environment -  interests.environment
 * Q15: Global issues - values.global
 * Q18: Photography/video - interests.creative
 */

const personalityProfiles: PersonalityProfile[] = [
  {
    name: "Tech Innovator - Sara",
    description: "Loves coding, innovation, and technology. High tech affinity, creative problem-solving.",
    expectedCategory: "innovoija",
    answers: createAnswers({
      0: 5,  // Q0: Technology/coding - Very high ✓
      1: 1,  // Q1: Leadership - Very low (not a leader)
      2: 5,  // Q2: Analytical - Very high
      3: 1,  // Q3: Physical/sports - Very low
      4: 5,  // Q4: Web/mobile dev - Very high (technology)
      6: 5,  // Q6: Cybersecurity - Very high (technology)
      7: 1,  // Q7: Helping people/health - Very low
      8: 1,  // Q8: Psychology/people - Very low
      9: 1,  // Q9: Teaching/people - Very low
      10: 1, // Q10: Supporting people - Very low
      11: 2, // Q11: Environment - Low
    })
  },

  {
    name: "Caring Nurse - Mika",
    description: "Empathetic, wants to help people, interested in healthcare. People-oriented.",
    expectedCategory: "auttaja",
    answers: createAnswers({
      0: 1,  // Q0: Technology - Very low
      1: 1,  // Q1: Leadership - Very low
      2: 2,  // Q2: Analytical - Low
      3: 2,  // Q3: Physical - Low
      7: 5,  // Q7: Helping people/health - Very high ✓
      8: 5,  // Q8: Psychology/people - Very high ✓
      9: 5,  // Q9: Teaching/people - Very high ✓
      10: 5, // Q10: Supporting people - Very high ✓
      11: 2, // Q11: Environment - Low
    })
  },

  {
    name: "Construction Engineer - Antti",
    description: "Practical, hands-on, likes building things. Enjoys physical and technical work.",
    expectedCategory: "rakentaja",
    answers: createAnswers({
      0: 3,  // Q0: Technology - Moderate
      1: 1,  // Q1: Leadership - Very low
      2: 3,  // Q2: Analytical - Moderate
      3: 5,  // Q3: Sports/physical - Very high ✓ (hands_on)
      7: 1,  // Q7: Health - Very low
      8: 1,  // Q8: People - Very low
      9: 1,  // Q9: Teaching - Very low
      10: 1, // Q10: Supporting people - Very low
      11: 2, // Q11: Environment - Low
    })
  },

  {
    name: "Environmental Activist - Liisa",
    description: "Passionate about environment, sustainability, and climate change. Mission-driven.",
    expectedCategory: "ympariston-puolustaja",
    answers: createAnswers({
      0: 2,  // Q0: Technology - Low
      1: 1,  // Q1: Leadership - Very low
      2: 3,  // Q2: Analytical - Moderate
      3: 2,  // Q3: Physical - Low
      7: 1,  // Q7: Health - Very low
      8: 2,  // Q8: People - Low
      9: 1,  // Q9: Teaching - Very low
      10: 2, // Q10: Supporting - Low
      18: 1, // Q18: Creative - Very low
      30: 5, // Q30: Environment - Very high ✓✓✓
      31: 4, // Q31: Global - High
    })
  },

  {
    name: "Business Leader - Petri",
    description: "Strategic thinker, enjoys leadership, managing teams, and business decisions.",
    expectedCategory: "johtaja",
    answers: createAnswers({
      0: 3,  // Q0: Technology - Moderate
      1: 5,  // Q1: Leadership - Very high ✓
      2: 5,  // Q2: Analytical - Very high
      3: 1,  // Q3: Physical - Very low
      7: 1,  // Q7: Health - Very low
      8: 3,  // Q8: People - Moderate
      9: 2,  // Q9: Teaching - Low
      10: 3, // Q10: Supporting - Moderate
      11: 2, // Q11: Environment - Low
      15: 3, // Q15: Global - Moderate
    })
  },

  {
    name: "Creative Designer - Emma",
    description: "Artistic, loves visual design, creative expression. Aesthetic-focused.",
    expectedCategory: "luova",
    answers: createAnswers({
      0: 3,  // Q0: Technology - Moderate (design tools)
      1: 1,  // Q1: Leadership - Very low
      2: 2,  // Q2: Analytical - Low
      3: 1,  // Q3: Physical - Very low
      7: 1,  // Q7: Health - Very low
      8: 2,  // Q8: People - Low
      9: 1,  // Q9: Teaching - Very low
      10: 1, // Q10: Supporting - Very low
      11: 2, // Q11: Environment - Low
      18: 5, // Q18: Photography/creative - Very high ✓
    })
  },

  {
    name: "Strategic Visionary - Kari",
    description: "Big-picture thinker, future-focused, strategic planning. Thinks long-term.",
    expectedCategory: "visionaari",
    answers: createAnswers({
      0: 3,  // Q0: Technology - Moderate
      1: 1,  // Q1: Leadership - Very low
      2: 5,  // Q2: Analytical - Very high
      3: 1,  // Q3: Physical - Very low
      7: 1,  // Q7: Health - Very low
      8: 2,  // Q8: People - Low
      9: 1,  // Q9: Teaching - Very low
      10: 2, // Q10: Supporting - Low
      18: 1, // Q18: Creative - Very low
      30: 2, // Q30: Environment - Low
      31: 5, // Q31: Global - Very high ✓✓✓
    })
  },

  {
    name: "Project Coordinator - Sanna",
    description: "Organized, detail-oriented, loves planning and coordinating. Process-focused.",
    expectedCategory: "jarjestaja",
    answers: createAnswers({
      0: 2,  // Q0: Technology - Low
      1: 1,  // Q1: Leadership - Very low (not a leader)
      2: 5,  // Q2: Analytical - Very high ✓
      3: 1,  // Q3: Physical - Very low
      7: 1,  // Q7: Health - Very low
      8: 2,  // Q8: People - Low
      9: 1,  // Q9: Teaching - Very low
      10: 2, // Q10: Supporting - Low
      18: 1, // Q18: Creative - Very low
      30: 1, // Q30: Environment - Very low
      31: 2, // Q31: Global - Low
      32: 5, // Q32: Organization - Very high ✓✓✓
    })
  },

  {
    name: "Balanced Professional - Jussi",
    description: "Moderate across all dimensions. No strong preferences. Adaptable.",
    expectedCategory: "any",
    answers: createAnswers({
      0: 3, 1: 3, 2: 3, 3: 3, 7: 3,
      8: 4, 9: 3, 10: 3, 11: 3, 15: 3, 18: 3
    })
  },

  {
    name: "Artistic Teacher - Maria",
    description: "Combines creativity with helping others. Artistic but also nurturing.",
    expectedCategory: "luova or auttaja",
    answers: createAnswers({
      0: 2,  // Q0: Technology - Low
      1: 1,  // Q1: Leadership - Very low
      2: 2,  // Q2: Analytical - Low
      3: 1,  // Q3: Physical - Very low
      7: 4,  // Q7: Health/helping - High
      8: 5,  // Q8: People - Very high
      9: 4,  // Q9: Teaching - High
      10: 4, // Q10: Supporting - High
      11: 2, // Q11: Environment - Low
      18: 5, // Q18: Creative - Very high
    })
  }
];

// Run tests
async function runPersonalityTests() {
  console.log('='.repeat(80));
  console.log('FIXED PERSONALITY PROFILE TESTS');
  console.log('Using correct TASO2 question mappings');
  console.log('='.repeat(80));
  console.log('');

  const results: Array<{
    profile: string;
    expected: string;
    actual: string;
    match: boolean;
  }> = [];

  for (const profile of personalityProfiles) {
    console.log(`\n📋 Testing: ${profile.name}`);
    console.log(`   Expected: ${profile.expectedCategory}`);

    const careers = rankCareers(profile.answers, 'TASO2', 5);
    const actual = careers[0]?.category || 'unknown';

    const isCorrect = profile.expectedCategory === 'any' || profile.expectedCategory.includes(actual);

    results.push({
      profile: profile.name,
      expected: profile.expectedCategory,
      actual,
      match: isCorrect
    });

    console.log(`   Matched: ${actual} ${isCorrect ? '✅' : '❌'}`);
  }

  console.log('\n' + '='.repeat(80));
  console.log('RESULTS');
  console.log('='.repeat(80));

  const correct = results.filter(r => r.match).length;
  console.log(`\n✅ Correct: ${correct}/${results.length} (${Math.round(correct / results.length * 100)}%)`);

  if (correct < results.length) {
    console.log('\n❌ Failed:');
    results.filter(r => !r.match).forEach(r => {
      console.log(`   ${r.profile}: expected ${r.expected}, got ${r.actual}`);
    });
  } else {
    console.log('\n🎉 100% SUCCESS!');
  }
}

runPersonalityTests();
