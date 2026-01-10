const fs = require('fs');

// Read career vectors
const vectorContent = fs.readFileSync('./lib/scoring/careerVectors.ts', 'utf-8');
const slugRegex = /slug:\s*"([^"]+)"/g;
const existingSlugs = new Set();
let match;
while ((match = slugRegex.exec(vectorContent)) !== null) {
  existingSlugs.add(match[1]);
}

// Read curated careers
const curatedContent = fs.readFileSync('./lib/scoring/curatedCareers.ts', 'utf-8');
const curatedRegex = /"([a-z0-9-]+)",?\s*\/\//g;
const curatedSlugs = [];
while ((match = curatedRegex.exec(curatedContent)) !== null) {
  curatedSlugs.push(match[1]);
}

console.log(`Existing career vectors: ${existingSlugs.size}`);
console.log(`Curated slugs: ${curatedSlugs.length}`);
console.log('');

// Find missing slugs
const missing = curatedSlugs.filter(s => !existingSlugs.has(s));
if (missing.length > 0) {
  console.log('MISSING SLUGS (not found in careerVectors.ts):');
  console.log('==============================================');
  missing.forEach(s => console.log(`  - ${s}`));
  console.log('');

  // Try to find similar slugs
  console.log('Possible matches:');
  missing.forEach(slug => {
    const similar = [...existingSlugs].filter(e =>
      e.includes(slug.split('-')[0]) ||
      slug.includes(e.split('-')[0])
    ).slice(0, 5);
    if (similar.length > 0) {
      console.log(`  ${slug} -> ${similar.join(', ')}`);
    }
  });
} else {
  console.log('✅ All curated slugs exist in careerVectors.ts!');
}

// Count by guessed category from comments
console.log('\n\nAll existing slugs (first 50):');
[...existingSlugs].slice(0, 50).forEach(s => console.log(`  "${s}"`));
