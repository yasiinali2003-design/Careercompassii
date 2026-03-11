/**
 * Simplified Direct Testing for Personalized Analysis
 * Uses generateUserProfile() which includes the personalized analysis
 */

import { generateUserProfile, rankCareers } from '../lib/scoring/scoringEngine';
import { Cohort, TestAnswer } from '../lib/scoring/types';
import * as fs from 'fs';

// ========== PERSONA DEFINITIONS ==========

interface Persona {
  id: number;
  name: string;
  cohort: Cohort;
  description: string;
  answers: number[];
}

const personas: Persona[] = [
  {
    id: 1,
    name: "Emma - Creative Explorer",
    cohort: "YLA",
    description: "Age 14, loves art/design, struggles with math",
    answers: [5,2,5,3,2,2,2,3,4,2,3,2,5,2,3,5,2,5,4,3,2,5,2,3,2,4,2,5,3,2]
  },
  {
    id: 2,
    name: "Mikko - Sports Enthusiast",
    cohort: "YLA",
    description: "Age 15, plays sports, very active",
    answers: [2,3,2,5,2,5,4,3,2,5,5,3,2,5,4,3,4,5,3,4,5,3,2,4,5,3,5,3,4,3]
  },
  {
    id: 3,
    name: "Aino - Undecided Balanced",
    cohort: "YLA",
    description: "Age 14, no strong passion yet",
    answers: [3,4,3,3,4,3,4,3,3,4,3,4,3,4,3,3,4,3,4,3,3,4,3,3,4,3,3,4,3,3]
  },
  {
    id: 4,
    name: "Lauri - Tech-Gaming Kid",
    cohort: "YLA",
    description: "Age 15, loves gaming/programming, weak social skills",
    answers: [5,4,3,5,2,1,3,2,1,1,2,2,5,1,3,5,1,5,4,5,1,4,1,2,1,5,1,5,2,1]
  },
  {
    id: 5,
    name: "Sofia - Caring Helper",
    cohort: "YLA",
    description: "Age 14, volunteers, wants nursing/social work",
    answers: [1,2,3,2,3,5,2,4,5,5,4,3,3,5,5,4,4,3,3,4,4,5,3,5,4,5,4,3,4,4]
  },
  {
    id: 6,
    name: "Ville - Entrepreneur",
    cohort: "TASO2",
    description: "Age 18, runs online business",
    answers: [3,4,2,3,5,2,5,3,2,4,3,5,4,2,4,3,4,3,5,4,4,3,5,5,4,5,4,5,4,3]
  },
  {
    id: 7,
    name: "Emilia - Healthcare Vocational",
    cohort: "TASO2",
    description: "Age 17, in nursing school",
    answers: [2,2,3,2,4,5,3,4,5,5,4,3,3,5,4,3,4,5,3,4,4,5,4,5,5,4,4,3,3,4]
  },
  {
    id: 8,
    name: "Matias - Undecided Academic",
    cohort: "TASO2",
    description: "Age 17, in lukio, unsure",
    answers: [4,4,3,4,3,3,4,4,3,4,3,4,4,3,4,3,4,3,4,4,3,4,4,4,4,4,3,3,4,3]
  },
  {
    id: 9,
    name: "Iida - Artistic Designer",
    cohort: "TASO2",
    description: "Age 18, applying to art school",
    answers: [2,3,5,5,2,2,5,3,2,3,2,5,5,2,4,5,2,5,3,4,2,4,2,3,2,4,2,5,3,2]
  },
  {
    id: 10,
    name: "Oskari - Tradesperson",
    cohort: "TASO2",
    description: "Age 17, vocational construction",
    answers: [2,2,2,5,3,2,3,3,2,2,3,2,2,3,5,2,5,2,4,5,3,5,5,5,3,5,3,2,3,3]
  },
  {
    id: 11,
    name: "Laura - Career Changer",
    cohort: "NUORI",
    description: "Age 26, Admin → UX",
    answers: [4,4,5,3,3,2,4,3,2,4,3,5,5,3,4,5,4,4,4,5,4,4,4,5,3,5,5,3,4,4]
  },
  {
    id: 12,
    name: "Antti - Tech → Leadership",
    cohort: "NUORI",
    description: "Age 29, developer seeking leadership",
    answers: [5,5,2,5,3,1,5,2,1,2,2,5,4,2,4,5,2,4,5,5,2,4,2,4,5,5,5,5,3,2]
  },
  {
    id: 13,
    name: "Maria - Balanced Professional",
    cohort: "NUORI",
    description: "Age 24, no clear direction",
    answers: [3,4,3,4,3,3,4,4,3,4,3,4,4,3,4,3,4,4,4,4,4,4,5,5,5,4,4,3,5,4]
  },
  {
    id: 14,
    name: "Petri - Burned-Out",
    cohort: "NUORI",
    description: "Age 28, consulting, exhausted",
    answers: [4,4,3,3,3,4,4,3,3,4,3,4,4,4,4,3,4,3,3,4,5,5,2,5,4,5,4,3,4,5]
  },
  {
    id: 15,
    name: "Sanna - Creative Entrepreneur",
    cohort: "NUORI",
    description: "Age 25, freelance photographer",
    answers: [2,3,5,5,3,2,5,4,2,3,2,4,5,3,4,5,3,5,4,4,3,4,4,4,3,4,4,5,3,2]
  }
];

function convertToTestAnswers(answers: number[]): TestAnswer[] {
  return answers.map((score, index) => ({
    questionIndex: index,
    score
  }));
}

async function runTests() {
  console.log('================================================================');
  console.log('PERSONALIZED ANALYSIS QUALITY TESTING');
  console.log('================================================================\n');

  let report = `# Production Testing - Personalized Analysis Quality\n\n**Date:** ${new Date().toISOString().split('T')[0]}\n\n`;

  let totalLength = 0;
  let totalParagraphs = 0;
  let passCount = 0;

  for (const persona of personas) {
    console.log(`Test ${persona.id}: ${persona.name} (${persona.cohort})`);

    try {
      const testAnswers = convertToTestAnswers(persona.answers);
      const careers = rankCareers(testAnswers, persona.cohort, 10);
      const profile = generateUserProfile(testAnswers, persona.cohort, careers);

      const analysis = profile.personalizedAnalysis || '';
      const paragraphs = analysis.split('\n').filter(p => p.trim().length > 0);
      const length = analysis.length;
      const paragraphCount = paragraphs.length;

      totalLength += length;
      totalParagraphs += paragraphCount;

      const passed = length >= 1000 && paragraphCount >= 4;
      if (passed) passCount++;

      console.log(`  Length: ${length} chars, Paragraphs: ${paragraphCount} ${passed ? '✅' : '⚠️'}`);

      report += `\n---\n\n## Test ${persona.id}: ${persona.name} ${passed ? '✅' : '⚠️'}\n\n`;
      report += `**Cohort:** ${persona.cohort}  \n`;
      report += `**Profile:** ${persona.description}  \n`;
      report += `**Length:** ${length} characters ${length >= 1500 ? '✅' : length >= 1000 ? '⚠️' : '❌'}  \n`;
      report += `**Paragraphs:** ${paragraphCount} ${paragraphCount >= 6 ? '✅' : paragraphCount >= 4 ? '⚠️' : '❌'}\n\n`;
      report += `### Generated Analysis\n\n\`\`\`\n${analysis}\n\`\`\`\n\n`;

    } catch (error) {
      console.log(`  ❌ ERROR: ${error}`);
      report += `\n## Test ${persona.id}: ${persona.name} ❌\n\n**Error:** ${error}\n\n`;
    }
  }

  const avgLength = Math.round(totalLength / personas.length);
  const avgParagraphs = (totalParagraphs / personas.length).toFixed(1);
  const passRate = ((passCount / personas.length) * 100).toFixed(0);

  console.log('\n================================================================');
  console.log('SUMMARY');
  console.log('================================================================');
  console.log(`Tests Passed: ${passCount}/${personas.length} (${passRate}%)`);
  console.log(`Average Length: ${avgLength} chars (target: 1500-2500)`);
  console.log(`Average Paragraphs: ${avgParagraphs} (target: 6-8)`);

  report = `# Production Testing - Personalized Analysis Quality\n\n**Date:** ${new Date().toISOString().split('T')[0]}\n**Tests:** ${personas.length}\n**Pass Rate:** ${passCount}/${personas.length} (${passRate}%)\n**Avg Length:** ${avgLength} chars\n**Avg Paragraphs:** ${avgParagraphs}\n\n` + report;

  fs.writeFileSync('PRODUCTION_ANALYSIS_QUALITY_REPORT.md', report);
  console.log('\n📄 Report saved: PRODUCTION_ANALYSIS_QUALITY_REPORT.md\n');
}

runTests().catch(console.error);
