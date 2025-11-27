/**
 * BATCH 3: Add missing critical subdimensions
 * Target: impact, innovation, problem_solving
 * Strategy: Identify semantically related questions and remap them
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'lib', 'scoring', 'dimensions.ts');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('BATCH 3: Adding missing critical subdimensions');
console.log('===============================================\n');

// Count before
const countBefore = {
  impact: (content.match(/subdimension: 'impact'/g) || []).length,
  innovation: (content.match(/subdimension: 'innovation'/g) || []).length,
  problem_solving: (content.match(/subdimension: 'problem_solving'/g) || []).length,
};

console.log('Before fixes:');
console.log(countBefore);
console.log('');

// FIX 1: Add "problem_solving" subdimension
// Questions about "ongelmien ratkaisemisesta" (problem solving) should map to problem_solving
// Currently these are mapped to analytical or technology

// Q31 in YLA: "Pidätkö ongelmien ratkaisemisesta tekniikan avulla?"
content = content.replace(
  /text: "Pidätkö ongelmien ratkaisemisesta tekniikan avulla\?",\n\s+dimension: 'interests',\n\s+subdimension: 'analytical'/g,
  `text: "Pidätkö ongelmien ratkaisemisesta tekniikan avulla?",\n    dimension: 'interests',\n    subdimension: 'problem_solving'`
);

// Q61 in TASO2: "Pidätkö matematiikasta ja ongelmien ratkaisemisesta?"
content = content.replace(
  /text: "Pidätkö matematiikasta ja ongelmien ratkaisemisesta\?",\n\s+dimension: 'interests',\n\s+subdimension: 'analytical'/g,
  `text: "Pidätkö matematiikasta ja ongelmien ratkaisemisesta?",\n    dimension: 'interests',\n    subdimension: 'problem_solving'`
);

// TASO2 specific: "Pidätkö teknisten haasteiden ratkaisemisesta?"
content = content.replace(
  /text: "Pidätkö teknisten haasteiden ratkaisemisesta\?",\n\s+dimension: 'interests',\n\s+subdimension: 'technology'/g,
  `text: "Pidätkö teknisten haasteiden ratkaisemisesta?",\n    dimension: 'interests',\n    subdimension: 'problem_solving'`
);

// NUORI specific: "Pidätkö teknologisten ongelmien ratkaisemisesta?"
content = content.replace(
  /text: "Pidätkö teknologisten ongelmien ratkaisemisesta\?",\n\s+dimension: 'interests',\n\s+subdimension: 'technology'/g,
  `text: "Pidätkö teknologisten ongelmien ratkaisemisesta?",\n    dimension: 'interests',\n    subdimension: 'problem_solving'`
);

// Additional NUORI: "Pidätkö analyyttisestä ajattelusta ja ongelmien ratkaisemisesta?"
content = content.replace(
  /text: "Pidätkö analyyttisestä ajattelusta ja ongelmien ratkaisemisesta\?",\n\s+dimension: 'interests',\n\s+subdimension: 'analytical'/g,
  `text: "Pidätkö analyyttisestä ajattelusta ja ongelmien ratkaisemisesta?",\n    dimension: 'interests',\n    subdimension: 'problem_solving'`
);

console.log('✓ Fixed: problem_solving subdimension added');
console.log('  Questions remapped: ongelmien ratkaisemisesta, teknisten haasteiden');

// FIX 2: Add "innovation" subdimension
// Questions about "kehittää uusia" (develop new things), "luovia ratkaisuja" (creative solutions)

// YLA/TASO2/NUORI: "Haluaisitko työn, jossa voit kehittää uusia ideoita ja olla luova?"
content = content.replace(
  /text: "Haluaisitko työn, jossa voit kehittää uusia ideoita ja olla luova\?",\n\s+dimension: 'interests',\n\s+subdimension: 'creative'/g,
  `text: "Haluaisitko työn, jossa voit kehittää uusia ideoita ja olla luova?",\n    dimension: 'interests',\n    subdimension: 'innovation'`
);

// Another variant: "Haluaisitko työn, jossa voit olla luova ja kehittää uusia ratkaisuja?"
content = content.replace(
  /text: "Haluaisitko työn, jossa voit olla luova ja kehittää uusia ratkaisuja\?",\n\s+dimension: 'interests',\n\s+subdimension: 'creative'/g,
  `text: "Haluaisitko työn, jossa voit olla luova ja kehittää uusia ratkaisuja?",\n    dimension: 'interests',\n    subdimension: 'innovation'`
);

console.log('✓ Fixed: innovation subdimension added');
console.log('  Questions remapped: kehittää uusia ideoita, uusia ratkaisuja');

// FIX 3: Add "impact" subdimension
// Questions about helping society, making a difference
// Currently mapped to 'people' or 'environment'

// Look for "Haluaisitko suojella ympäristöä ja luontoa?" - environment protection has societal impact
content = content.replace(
  /text: "Haluaisitko suojella ympäristöä ja luontoa\?",\n\s+dimension: 'interests',\n\s+subdimension: 'environment'/g,
  `text: "Haluaisitko suojella ympäristöä ja luontoa?",\n    dimension: 'interests',\n    subdimension: 'impact'`
);

// "Kiinnostaako sinua ympäristönsuojelu ja ilmastonmuutos?"
content = content.replace(
  /text: "Kiinnostaako sinua ympäristönsuojelu ja ilmastonmuutos\?",\n\s+dimension: 'interests',\n\s+subdimension: 'environment'/g,
  `text: "Kiinnostaako sinua ympäristönsuojelu ja ilmastonmuutos?",\n    dimension: 'interests',\n    subdimension: 'impact'`
);

// "Haluaisitko työskennellä ympäristönsuojelun parissa?"
content = content.replace(
  /text: "Haluaisitko työskennellä ympäristönsuojelun parissa\?",\n\s+dimension: 'interests',\n\s+subdimension: 'environment'/g,
  `text: "Haluaisitko työskennellä ympäristönsuojelun parissa?",\n    dimension: 'interests',\n    subdimension: 'impact'`
);

console.log('✓ Fixed: impact subdimension added');
console.log('  Questions remapped: ympäristönsuojelu, ilmastonmuutos (societal impact)');

// Count after
const countAfter = {
  impact: (content.match(/subdimension: 'impact'/g) || []).length,
  innovation: (content.match(/subdimension: 'innovation'/g) || []).length,
  problem_solving: (content.match(/subdimension: 'problem_solving'/g) || []).length,
};

console.log('\nAfter fixes:');
console.log('New subdimensions added:');
console.log({
  impact: countAfter.impact,
  innovation: countAfter.innovation,
  problem_solving: countAfter.problem_solving
});

// Write back
fs.writeFileSync(filePath, content, 'utf-8');
console.log('\n✅ File updated successfully!');

const totalAdded = countAfter.impact + countAfter.innovation + countAfter.problem_solving;
console.log(`Total questions remapped: ${totalAdded}`);
console.log('\n📊 Strategy:');
console.log('   - problem_solving: Questions about solving problems/challenges');
console.log('   - innovation: Questions about developing new ideas/solutions');
console.log('   - impact: Questions about environmental/societal impact');
