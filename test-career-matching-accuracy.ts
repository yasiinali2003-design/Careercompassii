/**
 * Career Matching Accuracy Test
 *
 * Tests that career recommendations are sensible for specific profiles:
 * 1. Tech-focused student → should get software/tech careers
 * 2. Healthcare-focused student → should get nursing/medical careers
 * 3. Creative student → should get design/art careers
 * 4. Business-focused student → should get management/business careers
 */

import { calculateCategoryAffinities, calculateProfileConfidence } from './lib/scoring/categoryAffinities';
import { CAREER_VECTORS } from './lib/scoring/careerVectors';
import type { DetailedDimensionScores, TestAnswer } from './lib/scoring/types';

// Helper to create detailed scores from a simple profile
function createDetailedScores(profile: Record<string, number>): DetailedDimensionScores {
  return {
    interests: {
      technology: profile.technology || 0.5, people: profile.people || 0.5,
      creative: profile.creative || 0.5, analytical: profile.analytical || 0.5,
      hands_on: profile.hands_on || 0.5, business: profile.business || 0.5,
      environment: profile.environment || 0.5, health: profile.health || 0.5,
      education: profile.education || 0.5, innovation: profile.innovation || 0.5,
      arts_culture: profile.arts_culture || 0.5, sports: profile.sports || 0.5,
      nature: profile.nature || 0.5, writing: profile.writing || 0.5
    },
    values: {
      growth: profile.growth || 0.5, impact: profile.impact || 0.5,
      global: profile.global || 0.5, career_clarity: profile.career_clarity || 0.5,
      financial: profile.financial || 0.5, entrepreneurship: profile.entrepreneurship || 0.5,
      social_impact: profile.social_impact || 0.5, stability: profile.stability || 0.5,
      advancement: profile.advancement || 0.5, work_life_balance: profile.work_life_balance || 0.5,
      company_size: profile.company_size || 0.5
    },
    workstyle: {
      teamwork: profile.teamwork || 0.5, independence: profile.independence || 0.5,
      leadership: profile.leadership || 0.5, organization: profile.organization || 0.5,
      planning: profile.planning || 0.5, problem_solving: profile.problem_solving || 0.5,
      precision: profile.precision || 0.5, performance: profile.performance || 0.5,
      teaching: profile.teaching || 0.5, motivation: profile.motivation || 0.5,
      autonomy: profile.autonomy || 0.5, social: profile.social || 0.5,
      structure: profile.structure || 0.5, flexibility: profile.flexibility || 0.5,
      variety: profile.variety || 0.5
    },
    context: {
      outdoor: profile.outdoor || 0.5, international: profile.international || 0.5,
      work_environment: profile.work_environment || 0.5
    }
  };
}

// Calculate career match score (simplified cosine similarity)
function calculateCareerMatch(profile: DetailedDimensionScores, career: typeof CAREER_VECTORS[0]): number {
  let dotProduct = 0;
  let userMag = 0;
  let careerMag = 0;

  // Compare all dimensions
  const dimensions = [
    ['interests', 'interests'],
    ['values', 'values'],
    ['workstyle', 'workstyle'],
    ['context', 'context']
  ] as const;

  for (const [userKey, careerKey] of dimensions) {
    const userScores = profile[userKey] as Record<string, number>;
    const careerScores = career[careerKey] as Record<string, number>;

    for (const key of Object.keys(userScores)) {
      const u = userScores[key] || 0;
      const c = careerScores[key] || 0;
      dotProduct += u * c;
      userMag += u * u;
      careerMag += c * c;
    }
  }

  if (userMag === 0 || careerMag === 0) return 0;
  return (dotProduct / (Math.sqrt(userMag) * Math.sqrt(careerMag))) * 100;
}

// Get top careers for a profile
function getTopCareers(profile: DetailedDimensionScores, n: number = 5): { title: string; category: string; score: number }[] {
  const scores = CAREER_VECTORS.map(career => ({
    title: career.title,
    category: career.category,
    score: calculateCareerMatch(profile, career)
  }));

  return scores.sort((a, b) => b.score - a.score).slice(0, n);
}

// Test cases
const testCases: {
  name: string;
  description: string;
  profile: Record<string, number>;
  expectedCategory: string;
  expectedCareerKeywords: string[];
}[] = [
  {
    name: 'Tech Student (Matti)',
    description: 'Loves coding, problem solving, analytical thinking',
    profile: {
      technology: 0.95, analytical: 0.9, problem_solving: 0.9, innovation: 0.8,
      independence: 0.7, people: 0.3, creative: 0.4, health: 0.2, hands_on: 0.3
    },
    expectedCategory: 'innovoija',
    expectedCareerKeywords: ['ohjelmisto', 'kehittäjä', 'data', 'insinööri', 'it']
  },
  {
    name: 'Healthcare Student (Ella)',
    description: 'Wants to help people, interested in health and medicine',
    profile: {
      health: 0.95, people: 0.9, social_impact: 0.85, teaching: 0.7,
      teamwork: 0.8, technology: 0.2, business: 0.2, hands_on: 0.4
    },
    expectedCategory: 'auttaja',
    expectedCareerKeywords: ['hoitaja', 'terapeutti', 'työntekijä', 'huoltaja', 'psykologi', 'ravitsemus', 'perhe', 'vanhus']
  },
  {
    name: 'Creative Student (Aino)',
    description: 'Artistic, loves design and visual expression',
    profile: {
      creative: 0.95, arts_culture: 0.9, writing: 0.7, independence: 0.8,
      flexibility: 0.8, technology: 0.4, analytical: 0.3, stability: 0.3
    },
    expectedCategory: 'luova',
    expectedCareerKeywords: ['suunnittelija', 'taiteilija', 'muotoilija', 'graafinen', 'valokuvaaja']
  },
  {
    name: 'Business Student (Lauri)',
    description: 'Leadership oriented, interested in business and management',
    profile: {
      leadership: 0.9, business: 0.9, entrepreneurship: 0.8, advancement: 0.85,
      financial: 0.7, people: 0.6, creative: 0.3, hands_on: 0.2
    },
    expectedCategory: 'johtaja',
    expectedCareerKeywords: ['johtaja', 'päällikkö', 'yrittäjä', 'myynti', 'markkinointi']
  },
  {
    name: 'Tradesperson (Mikko)',
    description: 'Loves working with hands, practical skills, outdoor work',
    profile: {
      hands_on: 0.95, outdoor: 0.8, precision: 0.7, stability: 0.7,
      independence: 0.6, technology: 0.2, analytical: 0.2, people: 0.4
    },
    expectedCategory: 'rakentaja',
    expectedCareerKeywords: ['asentaja', 'rakentaja', 'mekaanikko', 'sähkö', 'vesihuolto', 'siivoja', 'pakkaaja', 'metsä']
  }
];

console.log('╔════════════════════════════════════════════════════════════════════════╗');
console.log('║                 CAREER MATCHING ACCURACY TEST                          ║');
console.log('╚════════════════════════════════════════════════════════════════════════╝\n');

let passCount = 0;
let failCount = 0;

for (const test of testCases) {
  const profile = createDetailedScores(test.profile);
  const answers: TestAnswer[] = Array.from({length: 15}, (_, i) => ({ questionIndex: i, score: 3 }));
  const confidence = calculateProfileConfidence(answers);
  const categories = calculateCategoryAffinities(profile, confidence);
  const topCareers = getTopCareers(profile, 5);

  const topCategory = categories[0].category;
  const categoryMatch = topCategory === test.expectedCategory;

  // Check if any top careers match expected keywords
  const careerMatches = topCareers.filter(c =>
    test.expectedCareerKeywords.some(kw =>
      c.title.toLowerCase().includes(kw.toLowerCase())
    )
  );
  const careerMatch = careerMatches.length >= 2; // At least 2 of top 5 should match

  const passed = categoryMatch && careerMatch;
  if (passed) passCount++;
  else failCount++;

  console.log(`${passed ? '✓' : '✗'} ${test.name}`);
  console.log(`   ${test.description}`);
  console.log(`   Category: ${topCategory} (expected: ${test.expectedCategory}) ${categoryMatch ? '✓' : '✗'}`);
  console.log(`   Top careers:`);
  for (const career of topCareers) {
    const isExpected = test.expectedCareerKeywords.some(kw =>
      career.title.toLowerCase().includes(kw.toLowerCase())
    );
    console.log(`     ${isExpected ? '→' : ' '} ${career.title} (${career.category}) - ${career.score.toFixed(0)}%`);
  }
  console.log(`   Career keyword matches: ${careerMatches.length}/5 ${careerMatch ? '✓' : '✗'}`);
  console.log();
}

console.log('════════════════════════════════════════════════════════════════════════');
console.log(`\nResults: ${passCount}/${testCases.length} tests passed\n`);

if (failCount === 0) {
  console.log('✅ ALL CAREER MATCHING TESTS PASSED!\n');
} else {
  console.log(`⚠️  ${failCount} tests failed - review career matching logic\n`);
}
