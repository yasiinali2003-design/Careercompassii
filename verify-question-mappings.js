const fs = require('fs');
const path = require('path');

const dimensionsPath = path.join(__dirname, 'lib', 'scoring', 'dimensions.ts');
const content = fs.readFileSync(dimensionsPath, 'utf-8');

// Extract YLA mappings
const ylaStart = content.indexOf('const YLA_MAPPINGS: QuestionMapping[] = [');
const ylaEnd = content.indexOf('const TASO2_MAPPINGS: QuestionMapping[] = [');
const ylaSection = content.substring(ylaStart, ylaEnd);

const mappings = {};
const lines = ylaSection.split('\n');
let currentQ = null;

for (const line of lines) {
  const qMatch = line.match(/q:\s*(\d+)/);
  if (qMatch) {
    currentQ = parseInt(qMatch[1]);
  }
  
  const subdimMatch = line.match(/subdimension:\s*['"]([^'"]+)['"]/);
  if (subdimMatch && currentQ !== null) {
    const subdim = subdimMatch[1];
    if (!mappings[subdim]) {
      mappings[subdim] = [];
    }
    mappings[subdim].push(currentQ);
  }
}

console.log('YLA Question Mappings:');
console.log('====================');
console.log('health:', mappings.health || 'NOT FOUND');
console.log('people:', mappings.people || 'NOT FOUND');
console.log('creative:', mappings.creative || 'NOT FOUND');
console.log('technology:', mappings.technology || 'NOT FOUND');
console.log('hands_on:', mappings.hands_on || 'NOT FOUND');
console.log('leadership:', mappings.leadership || 'NOT FOUND');
console.log('organization:', mappings.organization || 'NOT FOUND');
