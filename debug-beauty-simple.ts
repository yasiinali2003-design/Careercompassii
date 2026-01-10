// Simple debug script without triggering test suite
const testModule = require('./test-comprehensive-real-life-verification');
const generateAnswersFromTraits = testModule.generateAnswersFromTraits;
const { computeUserVector } = require('./lib/scoring/scoringEngine');
const { getQuestionMappings } = require('./lib/scoring/dimensions');

const profile = {
  name: 'Beauty Student',
  age: 17,
  cohort: 'TASO2',
  subCohort: 'LUKIO',
  personalityTraits: {
    interests: {
      creative: 5,
      people: 4,
      hands_on: 3,
      arts_culture: 4,
      technology: 1,
      analytical: 1,
      health: 1,
      business: 1,
      leadership: 1
    },
    workstyle: {
      social: 5,
      flexibility: 5,
      variety: 4,
      independence: 3,
      teamwork: 3,
      organization: 2,
      leadership: 1
    },
    values: {
      work_life_balance: 5,
      growth: 3,
      financial: 2,
      impact: 2
    }
  }
};

console.log('='.repeat(80));
console.log('BEAUTY STUDENT DEBUG');
console.log('='.repeat(80));

const answers = generateAnswersFromTraits(profile, 'TASO2');
console.log('\nAnswers:');
answers.forEach((a: any) => console.log(`  Q${a.questionIndex}: ${a.score}`));

const mappings = getQuestionMappings('TASO2', 0, 'LUKIO');
const q2Mappings = mappings.filter((m: any) => m.q === 2);
console.log('\nQ2 mappings:', q2Mappings.map((m: any) => ({ subdim: m.subdimension, weight: m.weight })));

const { detailedScores } = computeUserVector(answers, 'TASO2', 'LUKIO');
console.log('\nNormalized Scores:');
console.log('  Creative:', detailedScores.interests.creative);
console.log('  Arts_culture:', detailedScores.interests.arts_culture);
console.log('  Writing:', detailedScores.interests.writing);
console.log('  People:', detailedScores.interests.people);
console.log('  Social:', detailedScores.workstyle.social);
