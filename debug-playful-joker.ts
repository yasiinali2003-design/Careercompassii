import { generateUserProfile, rankCareers } from './lib/scoring/scoringEngine';
import { getQuestionMappings } from './lib/scoring/dimensions';
import { TestAnswer } from './lib/scoring/types';

// Generate answers for "The Playful Joker" in NUORI
const mappings = getQuestionMappings('NUORI', 0);
const answers: TestAnswer[] = [];

// The Playful Joker: creative=5, people=4, innovation=3, independence=4
const subdimScores: any = {
  creative: 5,
  people: 4,
  innovation: 3,
  independence: 4,
  organization: 1,
  structure: 1,
  leadership: 1,
  analytical: 1,
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

console.log('The Playful Joker (NUORI)');
console.log('Creative:', profile.detailedScores?.interests.creative);
console.log('People:', profile.detailedScores?.interests.people);
console.log('Top career:', careers[0]?.title, careers[0]?.category);
console.log('Top 3:', careers.slice(0, 3).map(c => `${c.title} (${c.category})`));
