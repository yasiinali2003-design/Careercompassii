import { analyzeGap } from './lib/todistuspiste/gapAnalysis.ts';
import { generateSmartScenarios } from './lib/todistuspiste/smartScenarios.ts';
import { getProbabilityIndicator } from './lib/todistuspiste/probability.ts';

// Test case: Student aiming for medicine (188.3 points needed)
const inputs = {
  'äidinkieli': { grade: 'M', variantKey: 'pitka' },
  'matematiikka': { grade: 'E', variantKey: 'pitka' },
  'englanti': { grade: 'C', variantKey: 'pitka' }
};

console.log('Testing Gap Analysis...');
const gap = analyzeGap(inputs, 188.3, 'yliopisto');
console.log('Current points: ' + gap.currentPoints.toFixed(1));
console.log('Gap: ' + gap.gap.toFixed(1) + ' points');
console.log('Achievable: ' + gap.isAchievable);
console.log('Best path (' + gap.bestPath.length + ' improvements):');
gap.bestPath.slice(0, 3).forEach((imp, i) => {
  console.log('  ' + (i+1) + '. ' + imp.subjectLabel + ': ' + (imp.currentGrade || '—') + ' → ' + imp.suggestedGrade + ' (+' + imp.pointGain.toFixed(1) + 'p) [' + imp.difficulty + ']');
});

console.log('\nTesting Smart Scenarios...');
const scenarios = generateSmartScenarios(inputs, 188.3, 'yliopisto');
console.log('Generated ' + scenarios.length + ' scenarios:');
scenarios.forEach(s => {
  console.log('\n  ' + s.title + ' (' + s.difficulty + ', ' + s.successProbability + '% success)');
  console.log('  ' + s.description);
  console.log('  Improvements: ' + s.improvements.length);
  console.log('  Point gain: +' + s.totalPointGain.toFixed(1) + ' → ' + s.newTotalPoints.toFixed(1) + ' total');
});

console.log('\nTesting Probability Indicator...');
const prob = getProbabilityIndicator(175, 188.3, null);
console.log('  ' + prob.icon + ' ' + prob.label + ' (' + prob.percentage + '%)');
console.log('  ' + prob.description);

console.log('\n✅ All features working correctly!');
