/**
 * DEEP NUORI COHORT ANALYSIS
 * Investigates why ALL NUORI users are classified as "auttaja"
 */

import { DIMENSION_QUESTIONS } from './lib/scoring/dimensions.ts';

console.log('='.repeat(80));
console.log('NUORI COHORT DEEP ANALYSIS');
console.log('='.repeat(80));

const nuoriQuestions = DIMENSION_QUESTIONS.NUORI;

// Category tracking
const categoryInfluence = {
  innovoija: [],
  auttaja: [],
  luova: [],
  rakentaja: [],
  johtaja: [],
  visionaari: [],
  jarjestaja: [],
  'ympariston-puolustaja': []
};

// Subdimension tracking
const subdimensionUsage = {};
const dimensionUsage = {
  interests: 0,
  workstyle: 0,
  values: 0,
  context: 0
};

console.log('\n📊 ANALYZING 30 NUORI QUESTIONS\n');

nuoriQuestions.forEach((q, idx) => {
  const qNum = idx + 1;

  console.log(`\n--- Q${qNum}: ${q.question.substring(0, 60)}... ---`);

  // Count dimension usage
  dimensionUsage[q.dimension]++;

  // Analyze each option
  q.options.forEach((opt, optIdx) => {
    const score = 5 - optIdx; // Score 5 to 1

    console.log(`  Option ${optIdx + 1} (score ${score}): ${opt.text.substring(0, 50)}...`);

    opt.weights.forEach(weight => {
      const { subdimension, value } = weight;

      // Track subdimension usage
      if (!subdimensionUsage[subdimension]) {
        subdimensionUsage[subdimension] = { count: 0, totalWeight: 0, questions: [] };
      }
      subdimensionUsage[subdimension].count++;
      subdimensionUsage[subdimension].totalWeight += Math.abs(value);
      subdimensionUsage[subdimension].questions.push(qNum);

      // Determine which category this affects
      const categoryMap = {
        // Interests
        'technology': 'innovoija',
        'health': 'auttaja',
        'creative': 'luova',
        'hands_on': 'rakentaja',
        'environment': 'ympariston-puolustaja',

        // Workstyle
        'leadership': 'johtaja',
        'teamwork': 'auttaja',
        'independence': 'innovoija',
        'detail_oriented': 'jarjestaja',
        'big_picture': 'visionaari',

        // Values
        'helping_others': 'auttaja',
        'innovation': 'innovoija',
        'stability': 'jarjestaja',
        'advancement': 'johtaja',
        'creativity': 'luova',

        // Context
        'flexibility': 'luova',
        'structure': 'jarjestaja',
        'entrepreneurship': 'visionaari',
        'motivation': 'johtaja'
      };

      const category = categoryMap[subdimension];
      if (category) {
        categoryInfluence[category].push({
          question: qNum,
          subdimension,
          weight: value,
          maxImpact: value * score
        });

        console.log(`    → ${subdimension} (${value > 0 ? '+' : ''}${value}) → ${category}`);
      } else {
        console.log(`    → ${subdimension} (${value > 0 ? '+' : ''}${value}) → ⚠️ UNKNOWN CATEGORY`);
      }
    });
  });
});

console.log('\n' + '='.repeat(80));
console.log('📈 DIMENSION DISTRIBUTION');
console.log('='.repeat(80));

Object.entries(dimensionUsage).forEach(([dim, count]) => {
  const percent = ((count / 30) * 100).toFixed(1);
  console.log(`${dim.padEnd(15)} ${count} questions (${percent}%)`);
});

console.log('\n' + '='.repeat(80));
console.log('🎯 SUBDIMENSION USAGE FREQUENCY');
console.log('='.repeat(80));

const sortedSubdimensions = Object.entries(subdimensionUsage)
  .sort((a, b) => b[1].count - a[1].count);

sortedSubdimensions.forEach(([subdim, data]) => {
  const avgWeight = (data.totalWeight / data.count).toFixed(2);
  console.log(`\n${subdim}:`);
  console.log(`  Used in: ${data.count} options`);
  console.log(`  Total weight: ${data.totalWeight.toFixed(2)}`);
  console.log(`  Average weight: ${avgWeight}`);
  console.log(`  Questions: ${data.questions.slice(0, 5).join(', ')}${data.questions.length > 5 ? '...' : ''}`);
});

console.log('\n' + '='.repeat(80));
console.log('🏆 CATEGORY INFLUENCE POWER');
console.log('='.repeat(80));

Object.entries(categoryInfluence).forEach(([category, influences]) => {
  const totalWeight = influences.reduce((sum, inf) => sum + Math.abs(inf.weight), 0);
  const maxPossibleImpact = influences.reduce((sum, inf) => sum + Math.abs(inf.maxImpact), 0);

  console.log(`\n${category.toUpperCase()}:`);
  console.log(`  Questions affecting: ${influences.length}`);
  console.log(`  Total weight: ${totalWeight.toFixed(2)}`);
  console.log(`  Max possible impact: ${maxPossibleImpact.toFixed(2)}`);

  if (influences.length > 0) {
    // Show top 5 strongest influences
    const topInfluences = influences
      .sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight))
      .slice(0, 5);

    console.log(`  Top influences:`);
    topInfluences.forEach(inf => {
      console.log(`    Q${inf.question}: ${inf.subdimension} (${inf.weight > 0 ? '+' : ''}${inf.weight})`);
    });
  }
});

console.log('\n' + '='.repeat(80));
console.log('🚨 POTENTIAL ISSUES DETECTED');
console.log('='.repeat(80));

// Check for category imbalance
const categoryPowers = Object.entries(categoryInfluence).map(([cat, infs]) => ({
  category: cat,
  power: infs.reduce((sum, inf) => sum + Math.abs(inf.weight), 0),
  questionCount: infs.length
})).sort((a, b) => b.power - a.power);

console.log('\nCategory Power Ranking:');
categoryPowers.forEach((cp, idx) => {
  const warningFlag = idx === 0 && cp.power > categoryPowers[1]?.power * 1.5 ? '⚠️ DOMINANT' : '';
  console.log(`${idx + 1}. ${cp.category.padEnd(25)} Power: ${cp.power.toFixed(2).padStart(8)} (${cp.questionCount} questions) ${warningFlag}`);
});

// Check for missing subdimensions
console.log('\n\nSubdimension Coverage:');
const expectedSubdimensions = [
  'technology', 'health', 'creative', 'hands_on', 'environment',
  'leadership', 'teamwork', 'independence', 'detail_oriented', 'big_picture',
  'helping_others', 'innovation', 'stability', 'advancement', 'creativity',
  'flexibility', 'structure', 'entrepreneurship', 'motivation'
];

expectedSubdimensions.forEach(subdim => {
  if (!subdimensionUsage[subdim]) {
    console.log(`⚠️ MISSING: ${subdim}`);
  }
});

console.log('\n' + '='.repeat(80));
console.log('💡 RECOMMENDATIONS');
console.log('='.repeat(80));

if (categoryPowers[0].power > categoryPowers[1].power * 1.5) {
  console.log(`\n1. ⚠️ SEVERE IMBALANCE: "${categoryPowers[0].category}" has ${((categoryPowers[0].power / categoryPowers[1].power) * 100 - 100).toFixed(0)}% more power than second category`);
  console.log(`   → This explains why ALL users get classified as this category`);
  console.log(`   → Recommend: Reduce weights or add more diverse questions`);
}

const missingSubdims = expectedSubdimensions.filter(s => !subdimensionUsage[s]);
if (missingSubdims.length > 0) {
  console.log(`\n2. ⚠️ MISSING SUBDIMENSIONS: ${missingSubdims.length} subdimensions have NO coverage`);
  console.log(`   → Missing: ${missingSubdims.join(', ')}`);
  console.log(`   → This reduces algorithm's ability to differentiate personalities`);
}

console.log('\n' + '='.repeat(80));
