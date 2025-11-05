const fs = require('fs');
const path = require('path');

// Read and parse the careers file
const careersFile = path.join(__dirname, 'data', 'careers-fi.ts');
const content = fs.readFileSync(careersFile, 'utf8');

// Extract careers array (simple parsing - assumes format)
const careersArrayMatch = content.match(/export const careersData: CareerFI\[\] = \[([\s\S]*)\];/);
if (!careersArrayMatch) {
  console.error('Could not find careersData array');
  process.exit(1);
}

// Parse careers using regex (simplified approach)
const careers = [];
const careerBlocks = content.match(/\{[^}]*id:\s*"[^"]+",[\s\S]*?\n\s*\}/g) || [];

// Better approach: count occurrences of id patterns
const idMatches = content.match(/id:\s*"([^"]+)"/g) || [];
const categoryMatches = content.match(/category:\s*"([^"]+)"/g) || [];
const titleMatches = content.match(/title_fi:\s*"([^"]+)"/g) || [];

console.log(`Found ${idMatches.length} careers`);
console.log(`Found ${categoryMatches.length} categories`);
console.log(`Found ${titleMatches.length} titles\n`);

// Extract all careers more carefully
const careerEntries = [];
let inCareer = false;
let careerStart = -1;
let braceCount = 0;
let currentCareer = '';

for (let i = 0; i < content.length; i++) {
  if (content.substring(i, i + 3) === 'id:') {
    // Found start of a career
    careerStart = i;
    inCareer = true;
    braceCount = 0;
    currentCareer = '';
  }
  
  if (inCareer) {
    currentCareer += content[i];
    if (content[i] === '{') braceCount++;
    if (content[i] === '}') {
      braceCount--;
      if (braceCount === 0) {
        // End of career object
        careerEntries.push(currentCareer);
        inCareer = false;
        currentCareer = '';
      }
    }
  }
}

// Extract IDs and categories
const ids = [];
const categories = [];
const titles = [];

for (let i = 0; i < idMatches.length; i++) {
  const idMatch = idMatches[i].match(/id:\s*"([^"]+)"/);
  const categoryMatch = categoryMatches[i]?.match(/category:\s*"([^"]+)"/);
  const titleMatch = titleMatches[i]?.match(/title_fi:\s*"([^"]+)"/);
  
  if (idMatch) ids.push(idMatch[1]);
  if (categoryMatch) categories.push(categoryMatch[1]);
  if (titleMatch) titles.push(titleMatch[1]);
}

// Quality checks
const qualityIssues = {
  placeholderSources: [],
  missingSalary: [],
  missingOutlook: [],
  missingEducationPaths: [],
  genericDescriptions: [],
  duplicates: [],
  missingKeywords: []
};

// Check for placeholder sources
const placeholderSourceMatches = content.match(/source:\s*\{\s*name:\s*"([^"]+)"/g) || [];
placeholderSourceMatches.forEach((match, index) => {
  const nameMatch = match.match(/name:\s*"([^"]+)"/);
  if (nameMatch && (nameMatch[1].includes('Lähde tarkistettava') || nameMatch[1].includes('tarkistettava'))) {
    // Find which career this belongs to
    const beforeMatch = content.substring(0, content.indexOf(match));
    const lastIdMatch = beforeMatch.match(/id:\s*"([^"]+)"/g);
    if (lastIdMatch && lastIdMatch.length > 0) {
      const lastId = lastIdMatch[lastIdMatch.length - 1].match(/id:\s*"([^"]+)"/)[1];
      qualityIssues.placeholderSources.push({
        id: lastId,
        title: titles[ids.indexOf(lastId)] || 'Unknown'
      });
    }
  }
});

// Check for placeholder URLs
const placeholderUrlMatches = content.match(/url:\s*"([^"]+)"/g) || [];
placeholderUrlMatches.forEach((match) => {
  const urlMatch = match.match(/url:\s*"([^"]+)"/);
  if (urlMatch && urlMatch[1] === '#') {
    const beforeMatch = content.substring(0, content.indexOf(match));
    const lastIdMatch = beforeMatch.match(/id:\s*"([^"]+)"/g);
    if (lastIdMatch && lastIdMatch.length > 0) {
      const lastId = lastIdMatch[lastIdMatch.length - 1].match(/id:\s*"([^"]+)"/)[1];
      const idx = ids.indexOf(lastId);
      if (idx !== -1 && !qualityIssues.placeholderSources.find(p => p.id === lastId)) {
        qualityIssues.placeholderSources.push({
          id: lastId,
          title: titles[idx] || 'Unknown'
        });
      }
    }
  }
});

// Category distribution
const categoryCounts = {};
categories.forEach(cat => {
  categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
});

// Check for duplicates (similar titles)
const titleLower = titles.map(t => t.toLowerCase().replace(/[-\s]/g, ''));
const duplicates = [];
const seen = new Set();
titleLower.forEach((title, index) => {
  if (seen.has(title)) {
    duplicates.push({
      id: ids[index],
      title: titles[index]
    });
  }
  seen.add(title);
});

qualityIssues.duplicates = duplicates;

// Output results
console.log('='.repeat(60));
console.log('CAREER DATABASE ANALYSIS');
console.log('='.repeat(60));
console.log(`\nTotal Careers: ${ids.length}`);
console.log(`\nCategory Distribution:`);
Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
  console.log(`  ${cat}: ${count} careers`);
});

console.log(`\nQuality Issues:`);
console.log(`  Careers with placeholder sources: ${qualityIssues.placeholderSources.length}`);
if (qualityIssues.placeholderSources.length > 0) {
  console.log(`    Examples: ${qualityIssues.placeholderSources.slice(0, 5).map(p => p.title).join(', ')}`);
}

console.log(`  Duplicate careers: ${qualityIssues.duplicates.length}`);
if (qualityIssues.duplicates.length > 0) {
  console.log(`    Examples: ${qualityIssues.duplicates.map(d => d.title).join(', ')}`);
}

// Save detailed results
const results = {
  totalCareers: ids.length,
  categoryDistribution: categoryCounts,
  qualityIssues: {
    placeholderSources: qualityIssues.placeholderSources,
    duplicates: qualityIssues.duplicates
  },
  allCareers: ids.map((id, idx) => ({
    id,
    title: titles[idx],
    category: categories[idx]
  }))
};

fs.writeFileSync(
  path.join(__dirname, 'career-analysis-results.json'),
  JSON.stringify(results, null, 2)
);

console.log('\n✅ Analysis complete! Results saved to career-analysis-results.json');

