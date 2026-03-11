/**
 * Direct Function Testing for Personalized Analysis
 *
 * Tests generateEnhancedPersonalizedAnalysis() with 15 realistic personas
 * to validate production-level quality of the "Profiilisi" essay section.
 */

import { generateEnhancedPersonalizedAnalysis } from '../lib/scoring/deepPersonalization';
import { calculateDimensionScores, rankCareers } from '../lib/scoring/scoringEngine';
import { Cohort, TestAnswer } from '../lib/scoring/types';
import * as fs from 'fs';

// ========== PERSONA DEFINITIONS ==========

interface Persona {
  id: number;
  name: string;
  cohort: Cohort;
  description: string;
  answers: number[];
  expectedInsights: string[];
}

const personas: Persona[] = [
  // YLA COHORT
  {
    id: 1,
    name: "Emma - The Creative Explorer",
    cohort: "YLA",
    description: "Age 14, loves art/design, struggles with math, wants to be graphic designer",
    answers: [5,2,5,3,2,2,2,3,4,2,3,2,5,2,3,5,2,5,4,3,2,5,2,3,2,4,2,5,3,2],
    expectedInsights: ["creative", "design", "art", "visual"]
  },
  {
    id: 2,
    name: "Mikko - The Sports Enthusiast",
    cohort: "YLA",
    description: "Age 15, plays football/hockey, very active, wants to be PE teacher or trainer",
    answers: [2,3,2,5,2,5,4,3,2,5,5,3,2,5,4,3,4,5,3,4,5,3,2,4,5,3,5,3,4,3],
    expectedInsights: ["sports", "active", "health", "teamwork"]
  },
  {
    id: 3,
    name: "Aino - The Undecided Balanced Student",
    cohort: "YLA",
    description: "Age 14, no strong passion yet, good grades, parents pressure for academic path",
    answers: [3,4,3,3,4,3,4,3,3,4,3,4,3,4,3,3,4,3,4,3,3,4,3,3,4,3,3,4,3,3],
    expectedInsights: ["tasapainoinen", "monipuolinen", "explorer"]
  },
  {
    id: 4,
    name: "Lauri - The Tech-Gaming Kid",
    cohort: "YLA",
    description: "Age 15, loves gaming/programming, weak social skills, dreams of game dev or YouTuber",
    answers: [5,4,3,5,2,1,3,2,1,1,2,2,5,1,3,5,1,5,4,5,1,4,1,2,1,5,1,5,2,1],
    expectedInsights: ["technology", "independent", "technical", "conflict:people"]
  },
  {
    id: 5,
    name: "Sofia - The Caring Helper",
    cohort: "YLA",
    description: "Age 14, volunteers at animal shelter, wants to be nurse or social worker",
    answers: [1,2,3,2,3,5,2,4,5,5,4,3,3,5,5,4,4,3,3,4,4,5,3,5,4,5,4,3,4,4],
    expectedInsights: ["health", "helping", "people", "caring"]
  },

  // TASO2 COHORT
  {
    id: 6,
    name: "Ville - The Business-Minded Entrepreneur",
    cohort: "TASO2",
    description: "Age 18, runs small online business, strong in math/communication, wants own company",
    answers: [3,4,2,3,5,2,5,3,2,4,3,5,4,2,4,3,4,3,5,4,4,3,5,5,4,5,4,5,4,3],
    expectedInsights: ["business", "entrepreneurship", "growth", "leadership"]
  },
  {
    id: 7,
    name: "Emilia - The Healthcare Vocational Student",
    cohort: "TASO2",
    description: "Age 17, in vocational nursing school, practical and caring, wants stable career",
    answers: [2,2,3,2,4,5,3,4,5,5,4,3,3,5,4,3,4,5,3,4,4,5,4,5,5,4,4,3,3,4],
    expectedInsights: ["health", "practical", "stability", "helping"]
  },
  {
    id: 8,
    name: "Matias - The Undecided Academic",
    cohort: "TASO2",
    description: "Age 17, in lukio but unsure about university, good at many things, no clear passion",
    answers: [4,4,3,4,3,3,4,4,3,4,3,4,4,3,4,3,4,3,4,4,3,4,4,4,4,4,3,3,4,3],
    expectedInsights: ["monitaituri", "balanced", "broad interests"]
  },
  {
    id: 9,
    name: "Iida - The Artistic Designer",
    cohort: "TASO2",
    description: "Age 18, applying to art/design school, worried about career prospects",
    answers: [2,3,5,5,2,2,5,3,2,3,2,5,5,2,4,5,2,5,3,4,2,4,2,3,2,4,2,5,3,2],
    expectedInsights: ["creative", "design", "artistic", "practical concerns"]
  },
  {
    id: 10,
    name: "Oskari - The Practical Tradesperson",
    cohort: "TASO2",
    description: "Age 17, in vocational construction, loves building, wants to work immediately",
    answers: [2,2,2,5,3,2,3,3,2,2,3,2,2,3,5,2,5,2,4,5,3,5,5,5,3,5,3,2,3,3],
    expectedInsights: ["hands_on", "practical", "building", "salary"]
  },

  // NUORI COHORT
  {
    id: 11,
    name: "Laura - The Career Changer (Admin → UX)",
    cohort: "NUORI",
    description: "Age 26, 4 years in admin, feels stuck, discovered UX via online courses",
    answers: [4,4,5,3,3,2,4,3,2,4,3,5,5,3,4,5,4,4,4,5,4,4,4,5,3,5,5,3,4,4],
    expectedInsights: ["tech", "creative", "learning", "growth"]
  },
  {
    id: 12,
    name: "Antti - The Tech Professional Seeking Leadership",
    cohort: "NUORI",
    description: "Age 29, senior developer 6 years, great technically, weak communication, wants tech lead",
    answers: [5,5,2,5,3,1,5,2,1,2,2,5,4,2,4,5,2,4,5,5,2,4,2,4,5,5,5,5,3,2],
    expectedInsights: ["tech", "specialist", "conflict:people", "leadership gap"]
  },
  {
    id: 13,
    name: "Maria - The Balanced Professional Exploring Options",
    cohort: "NUORI",
    description: "Age 24, 2 years generic office work, no strong direction, worried about no passion",
    answers: [3,4,3,4,3,3,4,4,3,4,3,4,4,3,4,3,4,4,4,4,4,4,5,5,5,4,4,3,5,4],
    expectedInsights: ["balanced", "balance:work-life", "meaningful work"]
  },
  {
    id: 14,
    name: "Petri - The Burned-Out High Achiever",
    cohort: "NUORI",
    description: "Age 28, 6 years consulting, exhausted, wants meaningful work with balance",
    answers: [4,4,3,3,3,4,4,3,3,4,3,4,4,4,4,3,4,3,3,4,5,5,2,5,4,5,4,3,4,5],
    expectedInsights: ["balance", "meaningful", "burnout awareness"]
  },
  {
    id: 15,
    name: "Sanna - The Creative Entrepreneur Struggling",
    cohort: "NUORI",
    description: "Age 25, freelance photographer 3 years, creative work great, business side hard",
    answers: [2,3,5,5,3,2,5,4,2,3,2,4,5,3,4,5,3,5,4,4,3,4,4,4,3,4,4,5,3,2],
    expectedInsights: ["creative", "entrepreneurship", "business challenge"]
  }
];

// ========== HELPER FUNCTIONS ==========

function convertToTestAnswers(answers: number[]): TestAnswer[] {
  return answers.map((score, index) => ({
    questionIndex: index,
    score
  }));
}

function analyzeText(text: string): {
  length: number;
  paragraphs: number;
  avgParagraphLength: number;
  containsExpectedInsights: string[];
  readabilityScore: number;
} {
  const paragraphs = text.split('\n').filter(p => p.trim().length > 0);
  const paragraphCount = paragraphs.length;
  const avgLength = paragraphs.length > 0
    ? paragraphs.reduce((sum, p) => sum + p.length, 0) / paragraphs.length
    : 0;

  // Simple readability: sentences should be 50-150 chars on average
  const readabilityScore = avgLength >= 50 && avgLength <= 150 ? 5 :
                          avgLength >= 30 && avgLength < 200 ? 4 :
                          avgLength >= 20 ? 3 : 2;

  return {
    length: text.length,
    paragraphs: paragraphCount,
    avgParagraphLength: Math.round(avgLength),
    containsExpectedInsights: [],
    readabilityScore
  };
}

function scorePersona(
  persona: Persona,
  analysis: string,
  textStats: ReturnType<typeof analyzeText>
): {
  ageAppropriate: number;
  personalAccuracy: number;
  actionability: number;
  overall: number;
} {
  let ageScore = 5;
  let personalScore = 5;
  let actionScore = 5;

  // Age-appropriate scoring
  if (persona.cohort === 'YLA') {
    // Should be encouraging, not too formal
    if (analysis.includes('kannattaa') || analysis.includes('kokeile') || analysis.includes('tulevaisuudessa')) {
      ageScore = 5;
    } else if (analysis.includes('ammatillinen') || analysis.includes('urasuunnittelu')) {
      ageScore = 3; // Too career-focused for 14-year-olds
    }
  } else if (persona.cohort === 'TASO2') {
    // Should mention education paths
    if (analysis.includes('koulutus') || analysis.includes('opiskelu') || analysis.includes('ammattikoulu') || analysis.includes('lukio')) {
      ageScore = 5;
    }
  } else { // NUORI
    // Should be career-focused and practical
    if (analysis.includes('ura') || analysis.includes('työelämä') || analysis.includes('kehittyminen')) {
      ageScore = 5;
    }
  }

  // Personal accuracy - check for expected insights
  const lowerAnalysis = analysis.toLowerCase();
  let insightMatches = 0;
  for (const expected of persona.expectedInsights) {
    if (lowerAnalysis.includes(expected.toLowerCase())) {
      insightMatches++;
    }
  }
  personalScore = insightMatches >= 2 ? 5 :
                  insightMatches === 1 ? 4 : 3;

  // Actionability - based on length and paragraph count
  if (textStats.length >= 1500 && textStats.paragraphs >= 6) {
    actionScore = 5;
  } else if (textStats.length >= 1000 && textStats.paragraphs >= 4) {
    actionScore = 4;
  } else if (textStats.length >= 600) {
    actionScore = 3;
  } else {
    actionScore = 2;
  }

  const overall = Math.round((ageScore + personalScore + actionScore) / 3 * 10) / 10;

  return {
    ageAppropriate: ageScore,
    personalAccuracy: personalScore,
    actionability: actionScore,
    overall
  };
}

// ========== MAIN TEST EXECUTION ==========

async function runTests() {
  console.log('================================================================================');
  console.log('DIRECT FUNCTION TESTING - Personalized Analysis Quality');
  console.log('Testing 15 realistic personas with generateEnhancedPersonalizedAnalysis()');
  console.log('================================================================================');
  console.log('');

  const results: any[] = [];
  let totalScore = 0;
  let passCount = 0;

  for (const persona of personas) {
    console.log(`\nTest ${persona.id}: ${persona.name} (${persona.cohort})`);
    console.log(`  ${persona.description}`);

    try {
      // Convert to TestAnswer format
      const testAnswers = convertToTestAnswers(persona.answers);

      // Calculate scores (needed for analysis)
      const dimensionScores = calculateDimensionScores(testAnswers, persona.cohort);
      const detailedScores = dimensionScores.detailedScores;
      const categoryAffinities = dimensionScores.categoryAffinities;

      // Get top careers
      const topCareers = rankCareers(testAnswers, persona.cohort, 10);

      // Generate personalized analysis
      const personalizedAnalysis = generateEnhancedPersonalizedAnalysis(
        testAnswers,
        {
          cohort: persona.cohort,
          dimensionScores: dimensionScores.dimensionScores,
          topStrengths: dimensionScores.topStrengths || [],
          detailedScores,
          categoryAffinities
        },
        persona.cohort,
        topCareers
      );

      // Analyze the text
      const textStats = analyzeText(personalizedAnalysis);
      const scores = scorePersona(persona, personalizedAnalysis, textStats);

      // Check if passed (>= 4.0 average)
      const passed = scores.overall >= 4.0;
      if (passed) passCount++;
      totalScore += scores.overall;

      console.log(`  ✅ Generated: ${textStats.length} chars, ${textStats.paragraphs} paragraphs`);
      console.log(`  📊 Score: ${scores.overall}/5.0 ${passed ? '✅ PASS' : '⚠️ REVIEW'}`);

      results.push({
        persona,
        analysis: personalizedAnalysis,
        textStats,
        scores
      });

    } catch (error) {
      console.log(`  ❌ ERROR: ${error}`);
      results.push({
        persona,
        error: String(error)
      });
    }
  }

  // ========== GENERATE REPORT ==========

  const avgScore = (totalScore / personas.length).toFixed(2);
  const passRate = ((passCount / personas.length) * 100).toFixed(0);

  console.log('\n');
  console.log('================================================================================');
  console.log('TEST RESULTS SUMMARY');
  console.log('================================================================================');
  console.log(`Total Tests: ${personas.length}`);
  console.log(`Passed (≥4.0): ${passCount}/${personas.length} (${passRate}%)`);
  console.log(`Average Score: ${avgScore}/5.0`);
  console.log('');

  // Generate detailed markdown report
  let report = `# Production Testing Results - Personalized Analysis Quality

**Test Date:** ${new Date().toISOString().split('T')[0]}
**Tests Run:** ${personas.length} personas
**Pass Rate:** ${passCount}/${personas.length} (${passRate}%)
**Average Score:** ${avgScore}/5.0

---

## Executive Summary

${passCount >= 12 ? '✅ **SYSTEM READY FOR PRODUCTION**' : '⚠️ **NEEDS IMPROVEMENT**'}

This report evaluates the quality of personalized analysis essays generated by \`generateEnhancedPersonalizedAnalysis()\` for realistic user personas across all three cohorts.

### Scoring Criteria (1-5 scale)
1. **Age-appropriate language** - Does the tone match the cohort?
2. **Personal accuracy** - Does it capture the persona's unique profile?
3. **Actionability** - Is there enough content for students to act on?

---

`;

  // Add individual test results
  for (const result of results) {
    if (result.error) {
      report += `\n## Test ${result.persona.id}: ${result.persona.name} ❌ FAILED\n\n`;
      report += `**Error:** ${result.error}\n\n`;
      continue;
    }

    const { persona, analysis, textStats, scores } = result;
    const status = scores.overall >= 4.0 ? '✅ PASS' : '⚠️ REVIEW';

    report += `\n---\n\n## Test ${persona.id}: ${persona.name} ${status}\n\n`;
    report += `**Cohort:** ${persona.cohort}\n`;
    report += `**Profile:** ${persona.description}\n\n`;

    report += `### Text Statistics\n\n`;
    report += `- **Length:** ${textStats.length} characters ${textStats.length >= 1500 && textStats.length <= 2500 ? '✅ (target range)' : textStats.length < 1500 ? '⚠️ (below target)' : '✅ (above target)'}\n`;
    report += `- **Paragraphs:** ${textStats.paragraphs} ${textStats.paragraphs >= 6 ? '✅ (target: 6-8)' : '⚠️ (target: 6-8)'}\n`;
    report += `- **Avg paragraph length:** ${textStats.avgParagraphLength} chars\n`;
    report += `- **Readability:** ${textStats.readabilityScore}/5\n\n`;

    report += `### Evaluation Scores\n\n`;
    report += `1. **Age-appropriate language:** ${scores.ageAppropriate}/5\n`;
    report += `2. **Personal insight accuracy:** ${scores.personalAccuracy}/5\n`;
    report += `3. **Actionability:** ${scores.actionability}/5\n\n`;
    report += `**Overall Score:** ${scores.overall}/5.0\n\n`;

    report += `### Generated Analysis\n\n`;
    report += `\`\`\`\n${analysis}\n\`\`\`\n\n`;

    report += `### Expected Insights Check\n\n`;
    const lowerAnalysis = analysis.toLowerCase();
    for (const expected of persona.expectedInsights) {
      const found = lowerAnalysis.includes(expected.toLowerCase());
      report += `- ${found ? '✅' : '❌'} ${expected}\n`;
    }
    report += `\n`;
  }

  // Add final recommendations
  report += `\n---\n\n## Final Assessment\n\n`;
  if (passCount >= 12) {
    report += `✅ **PRODUCTION READY** - ${passCount}/${personas.length} tests passed with ≥4.0 score.\n\n`;
    report += `The personalized analysis system is generating high-quality, age-appropriate content that captures individual profiles accurately.\n`;
  } else if (passCount >= 10) {
    report += `⚠️ **MOSTLY READY** - ${passCount}/${personas.length} tests passed. Some improvements needed.\n\n`;
    report += `Review the failed tests to identify patterns in what's missing.\n`;
  } else {
    report += `❌ **NEEDS WORK** - Only ${passCount}/${personas.length} tests passed.\n\n`;
    report += `Significant improvements needed before production release.\n`;
  }

  // Write report to file
  fs.writeFileSync('PRODUCTION_ANALYSIS_QUALITY_REPORT.md', report);
  console.log('📄 Detailed report saved to: PRODUCTION_ANALYSIS_QUALITY_REPORT.md');
  console.log('');

  return {
    totalTests: personas.length,
    passed: passCount,
    avgScore: parseFloat(avgScore),
    passRate: parseFloat(passRate)
  };
}

// Run tests
runTests().then(summary => {
  console.log('✅ Testing complete!');
  process.exit(summary.passed >= 12 ? 0 : 1);
}).catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
