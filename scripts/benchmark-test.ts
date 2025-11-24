/**
 * BENCHMARK TEST SUITE
 * Tests current scoring system with 100 diverse profiles
 * Run BEFORE category expansion to establish baseline
 */

import { rankCareers } from '../lib/scoring/scoringEngine';
import { careersData } from '../data/careers-fi';
import { Cohort, TestAnswer } from '../lib/scoring/types';

// ========== TEST PROFILE GENERATOR ==========

interface TestProfile {
  id: number;
  name: string;
  cohort: Cohort;
  answers: TestAnswer[];
  expectedCategory?: string; // For validation
  description: string;
}

/**
 * Generate 100 diverse test profiles across all personality types
 * Profiles are designed to represent real user diversity
 */
function generateTestProfiles(): TestProfile[] {
  const profiles: TestProfile[] = [];
  let id = 1;

  // ========== AUTTAJA PROFILES (12 profiles) ==========

  // Profile 1: Classic healthcare worker
  profiles.push({
    id: id++,
    name: 'Healthcare Helper',
    cohort: 'TASO2',
    description: 'High empathy, loves helping people, healthcare interest',
    expectedCategory: 'auttaja',
    answers: generateAnswers({
      interests: { health: 5, people: 5, education: 3, analytical: 2, technology: 2 },
      values: { social_impact: 5, impact: 5, financial: 2, advancement: 2 },
      workstyle: { teamwork: 5, teaching: 4, leadership: 2, independence: 2 },
      context: { structured: 4, flexibility: 3 }
    })
  });

  // Profile 2: Teacher type
  profiles.push({
    id: id++,
    name: 'Natural Teacher',
    cohort: 'TASO2',
    description: 'Loves teaching, patient, people-oriented',
    expectedCategory: 'auttaja',
    answers: generateAnswers({
      interests: { education: 5, people: 5, arts_culture: 3, technology: 2 },
      values: { social_impact: 5, impact: 4, work_life: 4 },
      workstyle: { teaching: 5, teamwork: 4, planning: 4, independence: 2 },
      context: { structured: 5, stability: 4 }
    })
  });

  // Profile 3: Social worker type
  profiles.push({
    id: id++,
    name: 'Social Impact Advocate',
    cohort: 'NUORI',
    description: 'Wants to help vulnerable populations, social justice',
    expectedCategory: 'auttaja',
    answers: generateAnswers({
      interests: { people: 5, health: 3, education: 4, analytical: 3 },
      values: { social_impact: 5, impact: 5, financial: 1, advancement: 2 },
      workstyle: { teamwork: 5, teaching: 3, problem_solving: 4 },
      context: { flexibility: 4, people_interaction: 5 }
    })
  });

  // Profiles 4-12: Additional Auttaja variations (therapist, counselor, nurse, etc.)
  for (let i = 0; i < 9; i++) {
    profiles.push({
      id: id++,
      name: `Auttaja Variant ${i + 1}`,
      cohort: ['YLA', 'TASO2', 'NUORI'][i % 3] as Cohort,
      description: 'Auttaja personality variation',
      expectedCategory: 'auttaja',
      answers: generateAnswers({
        interests: {
          health: 3 + Math.random() * 2,
          people: 4 + Math.random(),
          education: 2 + Math.random() * 2
        },
        values: { social_impact: 4 + Math.random(), impact: 4 + Math.random() },
        workstyle: { teamwork: 4 + Math.random(), teaching: 3 + Math.random() },
        context: { people_interaction: 4 + Math.random() }
      })
    });
  }

  // ========== RAKENTAJA PROFILES (12 profiles) ==========

  // Profile 13: Classic craftsman
  profiles.push({
    id: id++,
    name: 'Hands-On Builder',
    cohort: 'TASO2',
    description: 'Loves physical work, building things, practical',
    expectedCategory: 'rakentaja',
    answers: generateAnswers({
      interests: { hands_on: 5, technology: 3, analytical: 2, people: 2 },
      values: { financial: 4, stability: 5, work_life: 4 },
      workstyle: { precision: 5, performance: 4, independence: 4, leadership: 2 },
      context: { physical: 5, structured: 4 }
    })
  });

  // Profile 14: Electrician type
  profiles.push({
    id: id++,
    name: 'Technical Tradesperson',
    cohort: 'TASO2',
    description: 'Technical skills, electricity, troubleshooting',
    expectedCategory: 'rakentaja',
    answers: generateAnswers({
      interests: { hands_on: 5, technology: 4, analytical: 3, innovation: 2 },
      values: { financial: 4, stability: 5 },
      workstyle: { precision: 5, problem_solving: 4, independence: 4 },
      context: { physical: 4, flexibility: 3 }
    })
  });

  // Profile 15: Factory/production worker
  profiles.push({
    id: id++,
    name: 'Production Worker',
    cohort: 'YLA',
    description: 'Likes repetitive work, machinery, clear instructions',
    expectedCategory: 'rakentaja',
    answers: generateAnswers({
      interests: { hands_on: 5, technology: 3, analytical: 2 },
      values: { stability: 5, financial: 4, work_life: 5 },
      workstyle: { precision: 4, performance: 4, teamwork: 3 },
      context: { structured: 5, physical: 4, stability: 5 }
    })
  });

  // Profiles 16-24: Additional Rakentaja variations
  for (let i = 0; i < 9; i++) {
    profiles.push({
      id: id++,
      name: `Rakentaja Variant ${i + 1}`,
      cohort: ['YLA', 'TASO2', 'NUORI'][i % 3] as Cohort,
      description: 'Rakentaja personality variation',
      expectedCategory: 'rakentaja',
      answers: generateAnswers({
        interests: { hands_on: 4 + Math.random(), technology: 2 + Math.random() * 2 },
        values: { stability: 4 + Math.random(), financial: 3 + Math.random() },
        workstyle: { precision: 4 + Math.random(), performance: 3 + Math.random() },
        context: { physical: 4 + Math.random() }
      })
    });
  }

  // ========== INNOVOIJA PROFILES (12 profiles) ==========

  // Profile 25: Software engineer
  profiles.push({
    id: id++,
    name: 'Tech Innovator',
    cohort: 'NUORI',
    description: 'Loves coding, problem-solving, tech',
    expectedCategory: 'innovoija',
    answers: generateAnswers({
      interests: { technology: 5, innovation: 5, analytical: 5, business: 3 },
      values: { entrepreneurship: 4, financial: 4, advancement: 4 },
      workstyle: { problem_solving: 5, independence: 4, precision: 4 },
      context: { flexibility: 4, remote: 4 }
    })
  });

  // Profile 26: Engineer
  profiles.push({
    id: id++,
    name: 'Engineering Thinker',
    cohort: 'TASO2',
    description: 'Math, physics, design, problem-solving',
    expectedCategory: 'innovoija',
    answers: generateAnswers({
      interests: { technology: 5, analytical: 5, innovation: 4, hands_on: 3 },
      values: { financial: 4, advancement: 3, impact: 3 },
      workstyle: { problem_solving: 5, precision: 5, planning: 4 },
      context: { structured: 4, physical: 2 }
    })
  });

  // Profiles 27-36: Additional Innovoija variations
  for (let i = 0; i < 10; i++) {
    profiles.push({
      id: id++,
      name: `Innovoija Variant ${i + 1}`,
      cohort: ['YLA', 'TASO2', 'NUORI'][i % 3] as Cohort,
      description: 'Innovoija personality variation',
      expectedCategory: 'innovoija',
      answers: generateAnswers({
        interests: {
          technology: 4 + Math.random(),
          innovation: 3 + Math.random() * 2,
          analytical: 4 + Math.random()
        },
        values: { entrepreneurship: 3 + Math.random(), financial: 3 + Math.random() },
        workstyle: { problem_solving: 4 + Math.random(), precision: 3 + Math.random() },
        context: { flexibility: 3 + Math.random() }
      })
    });
  }

  // ========== LUOVA PROFILES (12 profiles) ==========

  // Profile 37: Designer
  profiles.push({
    id: id++,
    name: 'Creative Designer',
    cohort: 'NUORI',
    description: 'Visual design, aesthetics, creative expression',
    expectedCategory: 'luova',
    answers: generateAnswers({
      interests: { creative: 5, arts_culture: 5, technology: 3, writing: 3 },
      values: { entrepreneurship: 4, work_life: 4, impact: 3 },
      workstyle: { independence: 5, problem_solving: 3, precision: 4 },
      context: { flexibility: 5, remote: 4 }
    })
  });

  // Profile 38: Writer/content creator
  profiles.push({
    id: id++,
    name: 'Content Creator',
    cohort: 'NUORI',
    description: 'Writing, storytelling, content creation',
    expectedCategory: 'luova',
    answers: generateAnswers({
      interests: { writing: 5, creative: 5, arts_culture: 4, people: 3 },
      values: { entrepreneurship: 4, work_life: 5, impact: 3 },
      workstyle: { independence: 5, teaching: 2, teamwork: 2 },
      context: { flexibility: 5, remote: 5 }
    })
  });

  // Profiles 39-48: Additional Luova variations
  for (let i = 0; i < 10; i++) {
    profiles.push({
      id: id++,
      name: `Luova Variant ${i + 1}`,
      cohort: ['YLA', 'TASO2', 'NUORI'][i % 3] as Cohort,
      description: 'Luova personality variation',
      expectedCategory: 'luova',
      answers: generateAnswers({
        interests: {
          creative: 4 + Math.random(),
          arts_culture: 3 + Math.random() * 2,
          writing: 2 + Math.random() * 2
        },
        values: { entrepreneurship: 3 + Math.random(), work_life: 4 + Math.random() },
        workstyle: { independence: 4 + Math.random() },
        context: { flexibility: 4 + Math.random() }
      })
    });
  }

  // ========== JOHTAJA PROFILES (12 profiles) ==========

  // Profile 49: Manager
  profiles.push({
    id: id++,
    name: 'Team Leader',
    cohort: 'NUORI',
    description: 'Leadership, managing teams, strategic',
    expectedCategory: 'johtaja',
    answers: generateAnswers({
      interests: { business: 5, people: 4, analytical: 4, technology: 2 },
      values: { advancement: 5, financial: 5, impact: 3 },
      workstyle: { leadership: 5, planning: 5, organization: 5, teamwork: 4 },
      context: { people_interaction: 5, structured: 4 }
    })
  });

  // Profiles 50-60: Additional Johtaja variations
  for (let i = 0; i < 11; i++) {
    profiles.push({
      id: id++,
      name: `Johtaja Variant ${i + 1}`,
      cohort: ['TASO2', 'NUORI'][i % 2] as Cohort,
      description: 'Johtaja personality variation',
      expectedCategory: 'johtaja',
      answers: generateAnswers({
        interests: { business: 4 + Math.random(), people: 3 + Math.random() },
        values: { advancement: 4 + Math.random(), financial: 4 + Math.random() },
        workstyle: {
          leadership: 4 + Math.random(),
          planning: 4 + Math.random(),
          organization: 4 + Math.random()
        },
        context: { people_interaction: 4 + Math.random() }
      })
    });
  }

  // ========== VISIONÄÄRI PROFILES (12 profiles) ==========

  // Profile 61: Entrepreneur
  profiles.push({
    id: id++,
    name: 'Startup Founder',
    cohort: 'NUORI',
    description: 'Big ideas, entrepreneurship, innovation',
    expectedCategory: 'visionaari',
    answers: generateAnswers({
      interests: { innovation: 5, business: 5, technology: 4, analytical: 3 },
      values: { entrepreneurship: 5, financial: 4, advancement: 4, impact: 4 },
      workstyle: { leadership: 4, independence: 5, problem_solving: 4 },
      context: { flexibility: 5, risk: 5 }
    })
  });

  // Profiles 62-72: Additional Visionääri variations
  for (let i = 0; i < 11; i++) {
    profiles.push({
      id: id++,
      name: `Visionääri Variant ${i + 1}`,
      cohort: ['TASO2', 'NUORI'][i % 2] as Cohort,
      description: 'Visionääri personality variation',
      expectedCategory: 'visionaari',
      answers: generateAnswers({
        interests: {
          innovation: 4 + Math.random(),
          business: 4 + Math.random(),
          technology: 3 + Math.random()
        },
        values: {
          entrepreneurship: 4 + Math.random(),
          advancement: 3 + Math.random()
        },
        workstyle: { leadership: 3 + Math.random(), independence: 4 + Math.random() },
        context: { flexibility: 4 + Math.random() }
      })
    });
  }

  // ========== JÄRJESTÄJÄ PROFILES (12 profiles) ==========

  // Profile 73: Administrator
  profiles.push({
    id: id++,
    name: 'Detail-Oriented Admin',
    cohort: 'TASO2',
    description: 'Organization, details, systems, structure',
    expectedCategory: 'jarjestaja',
    answers: generateAnswers({
      interests: { analytical: 4, business: 3, technology: 2, people: 2 },
      values: { stability: 5, work_life: 5, financial: 4 },
      workstyle: { organization: 5, precision: 5, planning: 5, teamwork: 3 },
      context: { structured: 5, stability: 5 }
    })
  });

  // Profiles 74-84: Additional Järjestäjä variations
  for (let i = 0; i < 11; i++) {
    profiles.push({
      id: id++,
      name: `Järjestäjä Variant ${i + 1}`,
      cohort: ['YLA', 'TASO2', 'NUORI'][i % 3] as Cohort,
      description: 'Järjestäjä personality variation',
      expectedCategory: 'jarjestaja',
      answers: generateAnswers({
        interests: { analytical: 3 + Math.random(), business: 2 + Math.random() },
        values: { stability: 4 + Math.random(), work_life: 4 + Math.random() },
        workstyle: {
          organization: 4 + Math.random(),
          precision: 4 + Math.random(),
          planning: 4 + Math.random()
        },
        context: { structured: 4 + Math.random() }
      })
    });
  }

  // ========== YMPÄRISTÖN PUOLUSTAJA PROFILES (12 profiles) ==========

  // Profile 85: Environmental scientist
  profiles.push({
    id: id++,
    name: 'Eco Warrior',
    cohort: 'NUORI',
    description: 'Environmental science, sustainability, nature',
    expectedCategory: 'ympariston-puolustaja',
    answers: generateAnswers({
      interests: {
        analytical: 4,
        innovation: 4,
        nature: 5,  // Assuming nature interest exists
        people: 3
      },
      values: { social_impact: 5, impact: 5, work_life: 4 },
      workstyle: { problem_solving: 4, teamwork: 4, independence: 3 },
      context: { flexibility: 4, outdoor: 5 }
    })
  });

  // Profiles 86-96: Additional Ympäristön puolustaja variations
  for (let i = 0; i < 11; i++) {
    profiles.push({
      id: id++,
      name: `Ympäristön Puolustaja Variant ${i + 1}`,
      cohort: ['TASO2', 'NUORI'][i % 2] as Cohort,
      description: 'Ympäristön puolustaja personality variation',
      expectedCategory: 'ympariston-puolustaja',
      answers: generateAnswers({
        interests: { analytical: 3 + Math.random(), innovation: 3 + Math.random() },
        values: { social_impact: 4 + Math.random(), impact: 4 + Math.random() },
        workstyle: { problem_solving: 3 + Math.random(), teamwork: 3 + Math.random() },
        context: { flexibility: 3 + Math.random() }
      })
    });
  }

  // ========== MIXED/EDGE CASE PROFILES (4 profiles) ==========

  // Profile 97: Balanced personality
  profiles.push({
    id: id++,
    name: 'Balanced Multi-talent',
    cohort: 'NUORI',
    description: 'Balanced across all dimensions',
    answers: generateAnswers({
      interests: { technology: 3, people: 3, creative: 3, analytical: 3 },
      values: { financial: 3, social_impact: 3, work_life: 3 },
      workstyle: { teamwork: 3, independence: 3, leadership: 3 },
      context: { flexibility: 3, structured: 3 }
    })
  });

  // Profile 98: Conflicting signals
  profiles.push({
    id: id++,
    name: 'Conflicting Interests',
    cohort: 'TASO2',
    description: 'High tech + high people (Innovoija vs Auttaja)',
    answers: generateAnswers({
      interests: { technology: 5, people: 5, health: 3, innovation: 4 },
      values: { social_impact: 4, financial: 4 },
      workstyle: { problem_solving: 4, teamwork: 4 },
      context: { flexibility: 3 }
    })
  });

  // Profile 99: Low engagement
  profiles.push({
    id: id++,
    name: 'Low Engagement',
    cohort: 'YLA',
    description: 'Mostly neutral answers (2s and 3s)',
    answers: generateAnswers({
      interests: { technology: 2, people: 3, creative: 2, analytical: 2 },
      values: { financial: 3, social_impact: 2, work_life: 3 },
      workstyle: { teamwork: 2, independence: 3, leadership: 2 },
      context: { flexibility: 3, structured: 3 }
    })
  });

  // Profile 100: High engagement
  profiles.push({
    id: id++,
    name: 'High Engagement',
    cohort: 'NUORI',
    description: 'Mostly strong answers (4s and 5s)',
    answers: generateAnswers({
      interests: { technology: 5, people: 4, creative: 4, analytical: 5 },
      values: { financial: 4, social_impact: 5, work_life: 4 },
      workstyle: { teamwork: 5, independence: 4, leadership: 5 },
      context: { flexibility: 4, structured: 4 }
    })
  });

  return profiles;
}

/**
 * Generate TestAnswer array from simplified score object
 * Maps subdimension scores to actual question answers
 */
function generateAnswers(scores: {
  interests: Record<string, number>;
  values: Record<string, number>;
  workstyle: Record<string, number>;
  context: Record<string, number>;
}): TestAnswer[] {
  const answers: TestAnswer[] = [];
  let questionId = 1;

  // Map each subdimension to 2-3 questions
  Object.entries(scores.interests).forEach(([subdim, score]) => {
    answers.push({ questionIndex: questionId++, score: Math.round(score) });
    answers.push({ questionIndex: questionId++, score: Math.max(1, Math.min(5, Math.round(score + (Math.random() - 0.5)))) });
  });

  Object.entries(scores.values).forEach(([subdim, score]) => {
    answers.push({ questionIndex: questionId++, score: Math.round(score) });
  });

  Object.entries(scores.workstyle).forEach(([subdim, score]) => {
    answers.push({ questionIndex: questionId++, score: Math.round(score) });
  });

  Object.entries(scores.context).forEach(([subdim, score]) => {
    answers.push({ questionIndex: questionId++, score: Math.round(score) });
  });

  // Fill remaining questions with neutral scores
  while (answers.length < 30) {
    answers.push({ questionIndex: questionId++, score: 3 });
  }

  return answers.slice(0, 30); // Ensure exactly 30 answers
}

// ========== BENCHMARK RUNNER ==========

interface BenchmarkResult {
  profileId: number;
  profileName: string;
  cohort: Cohort;
  expectedCategory?: string;
  topCategory: string;
  topMatchScore: number;
  top5Careers: Array<{
    title: string;
    category: string;
    score: number;
  }>;
  categoryScores: Record<string, number>;
}

interface BenchmarkSummary {
  totalProfiles: number;
  categoryDistribution: Record<string, number>;
  averageTopMatchScore: number;
  uniqueCareersInTop5: Set<string>;
  expectedMatchAccuracy: number; // % of profiles that got expected category as #1
  timestamp: string;
}

async function runBenchmark(): Promise<{ results: BenchmarkResult[]; summary: BenchmarkSummary }> {
  console.log('🚀 Starting benchmark test...\n');
  console.log(`📊 Total careers in database: ${careersData.length}\n`);

  const profiles = generateTestProfiles();
  const results: BenchmarkResult[] = [];
  const categoryCount: Record<string, number> = {};
  const uniqueCareers = new Set<string>();
  let totalTopMatchScore = 0;
  let correctPredictions = 0;

  for (const profile of profiles) {
    // Rank careers using the main scoring engine function
    const matches = rankCareers(
      profile.answers,
      profile.cohort,
      100 // Get top 100 to analyze category distribution
    );

    // Get top 5
    const top5 = matches.slice(0, 5);
    const topCategory = top5[0].category;
    const topScore = top5[0].overallScore;

    // Track stats
    categoryCount[topCategory] = (categoryCount[topCategory] || 0) + 1;
    totalTopMatchScore += topScore;
    top5.forEach(career => uniqueCareers.add(career.slug));

    if (profile.expectedCategory && topCategory === profile.expectedCategory) {
      correctPredictions++;
    }

    // Calculate category-level scores
    const categoryScores: Record<string, number> = {};
    matches.forEach(career => {
      if (!categoryScores[career.category] || career.overallScore > categoryScores[career.category]) {
        categoryScores[career.category] = career.overallScore;
      }
    });

    results.push({
      profileId: profile.id,
      profileName: profile.name,
      cohort: profile.cohort,
      expectedCategory: profile.expectedCategory,
      topCategory,
      topMatchScore: topScore,
      top5Careers: top5.map(c => ({
        title: c.title,
        category: c.category,
        score: c.overallScore
      })),
      categoryScores
    });

    console.log(`✓ Profile ${profile.id}/100: ${profile.name} → ${topCategory} (${topScore}%)`);
  }

  const summary: BenchmarkSummary = {
    totalProfiles: profiles.length,
    categoryDistribution: categoryCount,
    averageTopMatchScore: totalTopMatchScore / profiles.length,
    uniqueCareersInTop5: uniqueCareers,
    expectedMatchAccuracy: (correctPredictions / profiles.filter(p => p.expectedCategory).length) * 100,
    timestamp: new Date().toISOString()
  };

  return { results, summary };
}

// ========== REPORT GENERATOR ==========

function generateReport(results: BenchmarkResult[], summary: BenchmarkSummary): string {
  const lines: string[] = [];

  lines.push('═══════════════════════════════════════════════════════');
  lines.push('           URAKOMPASSI BENCHMARK REPORT');
  lines.push('═══════════════════════════════════════════════════════\n');

  lines.push(`📅 Timestamp: ${summary.timestamp}`);
  lines.push(`📊 Total Profiles Tested: ${summary.totalProfiles}\n`);

  lines.push('───────────────────────────────────────────────────────');
  lines.push('CATEGORY DISTRIBUTION (Top Match #1)');
  lines.push('───────────────────────────────────────────────────────\n');

  const sortedCategories = Object.entries(summary.categoryDistribution)
    .sort((a, b) => b[1] - a[1]);

  sortedCategories.forEach(([category, count]) => {
    const percentage = ((count / summary.totalProfiles) * 100).toFixed(1);
    const bar = '█'.repeat(Math.round(count / 2));
    lines.push(`${category.padEnd(25)} ${count.toString().padStart(3)} (${percentage.padStart(5)}%) ${bar}`);
  });

  lines.push('\n───────────────────────────────────────────────────────');
  lines.push('MATCH QUALITY METRICS');
  lines.push('───────────────────────────────────────────────────────\n');

  lines.push(`Average Top Match Score:     ${summary.averageTopMatchScore.toFixed(1)}%`);
  lines.push(`Unique Careers in Top 5s:    ${summary.uniqueCareersInTop5.size} / ${careersData.length}`);
  lines.push(`Expected Match Accuracy:     ${summary.expectedMatchAccuracy.toFixed(1)}%`);

  lines.push('\n───────────────────────────────────────────────────────');
  lines.push('DETAILED RESULTS (First 20 profiles)');
  lines.push('───────────────────────────────────────────────────────\n');

  results.slice(0, 20).forEach(result => {
    const match = result.expectedCategory === result.topCategory ? '✓' : '✗';
    lines.push(`${match} Profile ${result.profileId.toString().padStart(3)}: ${result.profileName.padEnd(30)} → ${result.topCategory} (${result.topMatchScore}%)`);
    lines.push(`   Top 3: ${result.top5Careers.slice(0, 3).map(c => `${c.title} (${c.category}, ${c.score}%)`).join(' | ')}\n`);
  });

  lines.push('───────────────────────────────────────────────────────');
  lines.push('CATEGORY BALANCE ANALYSIS');
  lines.push('───────────────────────────────────────────────────────\n');

  const expectedEvenDistribution = summary.totalProfiles / 8;
  sortedCategories.forEach(([category, count]) => {
    const deviation = ((count - expectedEvenDistribution) / expectedEvenDistribution * 100).toFixed(1);
    const deviationSign = deviation.startsWith('-') ? '' : '+';
    lines.push(`${category.padEnd(25)} ${deviationSign}${deviation}% from even distribution`);
  });

  lines.push('\n═══════════════════════════════════════════════════════\n');

  return lines.join('\n');
}

// ========== MAIN EXECUTION ==========

async function main() {
  try {
    const { results, summary } = await runBenchmark();

    // Generate report
    const report = generateReport(results, summary);
    console.log('\n' + report);

    // Save results to file
    const fs = require('fs');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputFile = `benchmark-results-${timestamp}.json`;

    fs.writeFileSync(
      outputFile,
      JSON.stringify({ results, summary }, null, 2)
    );

    console.log(`\n✅ Results saved to: ${outputFile}`);
    console.log(`\n📋 Run this again after category expansion to compare results!`);

  } catch (error) {
    console.error('❌ Benchmark failed:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { runBenchmark, generateTestProfiles, BenchmarkResult, BenchmarkSummary };
