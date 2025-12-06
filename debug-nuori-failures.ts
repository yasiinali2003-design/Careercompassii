import { generateUserProfile, rankCareers } from './lib/scoring/scoringEngine';
import { getQuestionMappings } from './lib/scoring/dimensions';
import { TestAnswer } from './lib/scoring/types';

// Generate answers for "The Nurturing Mentor" in NUORI
const mappings = getQuestionMappings('NUORI', 0);
const answers: TestAnswer[] = [];

// The Nurturing Mentor: people=5, growth=5, impact=5, health=3, teamwork=4, leadership=2
const subdimScores: any = {
  people: 5,
  growth: 5,
  impact: 5,
  health: 3,
  teamwork: 4,
  leadership: 2,
  organization: 1,
  creative: 1,
  technology: 1
};

const answerMap = new Map<number, number>();
for (const mapping of mappings) {
  const q = mapping.originalQ !== undefined ? mapping.originalQ : mapping.q;
  const subdim = mapping.subdimension;
  const dimension = mapping.dimension;
  
  let score = 3;
  if (dimension === 'interests') {
    score = subdimScores[subdim] || 3;
  } else if (dimension === 'values') {
    score = subdimScores[subdim] || 3;
  } else if (dimension === 'workstyle') {
    score = subdimScores[subdim] || 3;
  }
  
  const existing = answerMap.get(q);
  if (existing === undefined || score > existing) {
    answerMap.set(q, score);
  }
}

answers.push(...Array.from(answerMap.entries()).map(([q, s]) => ({ questionIndex: q, score: s })));

const profile = generateUserProfile(answers, 'NUORI');
const careers = rankCareers(answers, 'NUORI', 5);

console.log('The Nurturing Mentor (NUORI)');
console.log('People:', profile.detailedScores?.interests.people);
console.log('Health:', profile.detailedScores?.interests.health);
console.log('Impact:', profile.detailedScores?.values.impact);
console.log('Leadership:', profile.detailedScores?.interests.leadership);
console.log('Top career:', careers[0]?.title, careers[0]?.category);
