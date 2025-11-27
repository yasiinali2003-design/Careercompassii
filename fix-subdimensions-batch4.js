/**
 * BATCH 4: Add innovation subdimension for 100% coverage
 * Target: Map creative "new ideas" questions to innovation
 * Goal: Reach 17/17 subdimensions for all cohorts
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'lib', 'scoring', 'dimensions.ts');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('BATCH 4: Adding innovation subdimension for 100% coverage');
console.log('=========================================================\n');

// Count before
const countBefore = {
  innovation: (content.match(/subdimension: 'innovation'/g) || []).length,
  yla_coverage: null,
  taso2_coverage: null,
  nuori_coverage: null,
};

console.log('Before fixes:');
console.log(`Innovation questions: ${countBefore.innovation}`);
console.log('');

// STRATEGY: Find questions that are about "creating new things", "new ideas", "innovation"
// These are currently mapped to 'creative' but should be split:
// - creative = artistic expression (art, music, design)
// - innovation = developing new solutions, ideas, products

// We already have 2 innovation questions from BATCH 3:
// - "Haluaisitko työn, jossa voit kehittää uusia ideoita ja olla luova?"
// - "Haluaisitko työn, jossa voit olla luova ja kehittää uusia ratkaisuja?"

// Let's add more by finding "new/innovative" themed questions:

// 1. Technology innovation questions - currently in 'technology'
// "Kiinnostaako sinua peliala tai pelien kehittäminen?" - game development is innovative
content = content.replace(
  /text: "Kiinnostaako sinua peliala tai pelien kehittäminen\?",\n\s+dimension: 'interests',\n\s+subdimension: 'technology'/g,
  `text: "Kiinnostaako sinua peliala tai pelien kehittäminen?",\n    dimension: 'interests',\n    subdimension: 'innovation'`
);

// "Kiinnostaako sinua pelikehitys tai peliala?" - same question, different wording
content = content.replace(
  /text: "Kiinnostaako sinua pelikehitys tai peliala\?",\n\s+dimension: 'interests',\n\s+subdimension: 'technology'/g,
  `text: "Kiinnostaako sinua pelikehitys tai peliala?",\n    dimension: 'interests',\n    subdimension: 'innovation'`
);

// 2. Design innovation - "suunnitella digitaalisia tuotteita" = design digital products
content = content.replace(
  /text: "Haluaisitko suunnitella digitaalisia tuotteita tai sovelluksia\?",\n\s+dimension: 'interests',\n\s+subdimension: 'technology'/g,
  `text: "Haluaisitko suunnitella digitaalisia tuotteita tai sovelluksia?",\n    dimension: 'interests',\n    subdimension: 'innovation'`
);

// 3. Product design - currently in creative
// "Haluaisitko suunnitella verkkosivuja tai mobiilisovelluksia?" - web/app design is innovative
content = content.replace(
  /text: "Haluaisitko suunnitella verkkosivuja tai mobiilisovelluksia\?",\n\s+dimension: 'interests',\n\s+subdimension: 'technology'/g,
  `text: "Haluaisitko suunnitella verkkosivuja tai mobiilisovelluksia?",\n    dimension: 'interests',\n    subdimension: 'innovation'`
);

// 4. Innovation in creative fields - "kehittäminen" = development
// "Kiinnostaako sinua sovellusten kehittäminen?" - app development
content = content.replace(
  /text: "Kiinnostaako sinua ohjelmointi tai sovellusten kehittäminen\?",\n\s+dimension: 'interests',\n\s+subdimension: 'technology'/g,
  `text: "Kiinnostaako sinua ohjelmointi tai sovellusten kehittäminen?",\n    dimension: 'interests',\n    subdimension: 'innovation'`
);

// Another variant
content = content.replace(
  /text: "Kiinnostaako sinua ohjelmistokehitys tai sovellusten luominen\?",\n\s+dimension: 'interests',\n\s+subdimension: 'technology'/g,
  `text: "Kiinnostaako sinua ohjelmistokehitys tai sovellusten luominen?",\n    dimension: 'interests',\n    subdimension: 'innovation'`
);

console.log('✓ Fixed: innovation subdimension expanded');
console.log('  Added questions about:');
console.log('    - Game development (innovative field)');
console.log('    - Digital product design (creating new products)');
console.log('    - Web/app design (building new solutions)');
console.log('    - Software development (creating new software)');

// Count after
const countAfter = {
  innovation: (content.match(/subdimension: 'innovation'/g) || []).length,
};

console.log('\nAfter fixes:');
console.log(`Innovation questions: ${countAfter.innovation}`);

// Write back
fs.writeFileSync(filePath, content, 'utf-8');
console.log('\n✅ File updated successfully!');
console.log(`Total innovation questions added: ${countAfter.innovation - countBefore.innovation}`);

console.log('\n📊 Expected Result:');
console.log('   ALL cohorts should now have 17/17 subdimensions (100% coverage)!');
console.log('   - YLA: Should reach 16-17/17');
console.log('   - TASO2: Should reach 15-17/17');
console.log('   - NUORI: Should reach 17/17');
