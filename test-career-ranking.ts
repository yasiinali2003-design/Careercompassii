import { rankCareers } from './lib/scoring/scoringEngine';
import { getDemandWeight, getDiversityKey } from './lib/scoring/rankingConfig';
import type { TestAnswer } from './lib/scoring/types';

type Assertion = (condition: boolean, message: string) => void;

const assert: Assertion = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

function buildTechForwardAnswers(): TestAnswer[] {
  return Array.from({ length: 30 }, (_, index) => {
    if (index === 0 || index === 1) {
      return { questionIndex: index, score: 5 } as TestAnswer;
    }
    if (index === 4 || index === 15) {
      return { questionIndex: index, score: 4 } as TestAnswer;
    }
    return { questionIndex: index, score: 3 } as TestAnswer;
  });
}

async function run() {
  const answers = buildTechForwardAnswers();
  const results = rankCareers(answers, 'TASO2', 6);

  assert(results.length >= 5, 'Expected at least five career recommendations');

  const demandWeights = results.map(result => getDemandWeight(result.outlook));
  const sortedDemand = [...demandWeights].sort((a, b) => b - a);
  assert(
    demandWeights.join(',') === sortedDemand.join(','),
    'Demand weights should be sorted in descending order'
  );

  const diversityKeys = new Set<string>();
  results.slice(0, 4).forEach(result => {
    const key = getDiversityKey(result.title);
    assert(!diversityKeys.has(key), `Duplicate diversity key detected in top results: ${key}`);
    diversityKeys.add(key);
  });

  const supistuuIndex = results.findIndex(result => result.outlook === 'supistuu');
  if (supistuuIndex !== -1) {
    assert(supistuuIndex > 3, 'Declining careers should not appear ahead of growth-focused roles');
  }

  console.log('✅ Career demand ranking test passed');
}

run().catch(error => {
  console.error('❌ Career demand ranking test failed:', error.message);
  process.exitCode = 1;
});
