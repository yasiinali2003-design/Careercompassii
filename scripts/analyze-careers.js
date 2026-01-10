const fs = require('fs');
const content = fs.readFileSync('./lib/scoring/careerVectors.ts', 'utf-8');

// Extract all careers with their categories
const careerRegex = /slug:\s*"([^"]+)",\s*\n\s*title:\s*"([^"]+)",\s*\n\s*category:\s*"([^"]+)"/g;
const careers = [];
let match;
while ((match = careerRegex.exec(content)) !== null) {
  careers.push({ slug: match[1], title: match[2], category: match[3] });
}

// Count by category
const counts = {};
careers.forEach(c => {
  counts[c.category] = (counts[c.category] || 0) + 1;
});

console.log('Current career distribution by category:');
console.log('=========================================');
Object.entries(counts).sort((a,b) => b[1] - a[1]).forEach(([cat, count]) => {
  console.log(`${cat}: ${count}`);
});
console.log('=========================================');
console.log('Total:', careers.length);

// List careers by category
console.log('\n\nCareers by category:');
console.log('====================');
const byCategory = {};
careers.forEach(c => {
  if (!byCategory[c.category]) byCategory[c.category] = [];
  byCategory[c.category].push(c.title);
});

Object.keys(byCategory).sort().forEach(cat => {
  console.log(`\n${cat.toUpperCase()} (${byCategory[cat].length}):`);
  byCategory[cat].sort().forEach((title, i) => {
    console.log(`  ${i+1}. ${title}`);
  });
});
