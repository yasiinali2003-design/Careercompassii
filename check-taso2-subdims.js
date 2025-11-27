const fs = require('fs');
const content = fs.readFileSync('lib/scoring/dimensions.ts', 'utf-8');

// Extract TASO2 section
const taso2Section = content.match(/const TASO2_MAPPINGS[\s\S]*?const NUORI_MAPPINGS/)[0];

// Count subdimensions
const subdimCounts = {};
const matches = taso2Section.matchAll(/subdimension: '(\w+)'/g);

for (const match of matches) {
  const subdim = match[1];
  subdimCounts[subdim] = (subdimCounts[subdim] || 0) + 1;
}

console.log('TASO2 Subdimension Coverage:');
console.log('============================\n');
Object.entries(subdimCounts).sort().forEach(([subdim, count]) => {
  console.log(`${subdim}: ${count} question(s)`);
});

console.log('\n\nExpected 17 subdimensions:');
const expected = [
  'analytical', 'business', 'creative', 'environment', 'growth',
  'hands_on', 'health', 'impact', 'independence', 'innovation',
  'leadership', 'organization', 'outdoor', 'people', 'problem_solving',
  'teamwork', 'technology'
];

const missing = expected.filter(s => !subdimCounts[s]);
const present = expected.filter(s => subdimCounts[s]);

console.log(`\nPresent (${present.length}/17):`);
present.forEach(s => console.log(`  ✓ ${s} (${subdimCounts[s]} q)`));

console.log(`\nMissing (${missing.length}):`);
missing.forEach(s => console.log(`  ✗ ${s}`));
