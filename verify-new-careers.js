/**
 * Verify that all new hybrid careers exist in careers-fi.ts
 * and check their data completeness
 */

const fs = require('fs');
const path = require('path');

// New careers added to careerVectors.ts
const newCareers = [
  // Creative + Helper
  'taideterapeutti',
  'musiikkiterapeutti',
  'draamaterapeutti',
  'tanssiterapeutti',
  'kuvataideopettaja',
  'musiikkipedagogi',
  'kasityonopettaja',
  'luovuusvalmentaja',
  // Health + Tech
  'terveysteknologia-asiantuntija',
  'laakintalaiteteknikko',
  'terveysinformatiikan-asiantuntija',
  'digitaalisen-terveyden-kehittaja',
  'biolaaketieteellinen-insinoori',
  'kliininen-informatiikka-asiantuntija',
  // Environment + Education
  'ymparistokasvattaja',
  'luontokoulun-ohjaaja',
  'kestavyyskouluttaja',
  // Education + Creative
  'mediakasvatuksen-asiantuntija',
  'oppimismuotoilija',
  'koulutussuunnittelija',
  // Sports + Helper
  'urheilupsykologi',
  'kuntoutusohjaaja',
  // Health + Creative
  'terveyskommunikaatiosuunnittelija',
  'potilaskokemussuunnittelija'
];

// Read careers-fi.ts
const careersPath = path.join(__dirname, 'data/careers-fi.ts');
const careersContent = fs.readFileSync(careersPath, 'utf-8');

console.log('═'.repeat(100));
console.log('   VERIFYING NEW CAREERS IN URAKIRJASTO (careers-fi.ts)');
console.log('═'.repeat(100));
console.log();

const found = [];
const missing = [];

newCareers.forEach(slug => {
  // Check if slug exists in careers-fi.ts
  const slugPattern = new RegExp(`slug:\\s*["']${slug}["']`, 'i');
  const titlePattern = new RegExp(`title:\\s*["'][^"']*${slug.replace(/-/g, '.')}[^"']*["']`, 'i');

  if (slugPattern.test(careersContent)) {
    found.push(slug);
  } else {
    // Try alternative patterns
    const altSlug = slug.replace(/-/g, '');
    const altPattern = new RegExp(`slug:\\s*["'][^"']*${altSlug}[^"']*["']`, 'i');

    if (altPattern.test(careersContent)) {
      found.push(slug + ' (alt match)');
    } else {
      missing.push(slug);
    }
  }
});

console.log('✅ FOUND IN CAREERS-FI.TS (' + found.length + '/' + newCareers.length + '):');
found.forEach(s => console.log('   - ' + s));

console.log('\n❌ MISSING FROM CAREERS-FI.TS (' + missing.length + '/' + newCareers.length + '):');
if (missing.length === 0) {
  console.log('   None! All careers exist.');
} else {
  missing.forEach(s => console.log('   - ' + s));
}

// For missing careers, let's search for similar titles
if (missing.length > 0) {
  console.log('\n\n🔍 SEARCHING FOR SIMILAR CAREERS:');

  missing.forEach(slug => {
    // Extract key words from slug
    const keywords = slug.split('-').filter(w => w.length > 3);

    console.log('\n   ' + slug + ':');
    keywords.forEach(kw => {
      const regex = new RegExp(`title:\\s*["'][^"']*${kw}[^"']*["']`, 'gi');
      const matches = careersContent.match(regex);
      if (matches && matches.length > 0) {
        console.log('      Found titles with "' + kw + '": ' + matches.slice(0, 3).join(', '));
      }
    });
  });
}

// Check what careers exist with similar themes
console.log('\n\n📊 EXISTING SIMILAR CAREERS IN DATABASE:');

const searchTerms = ['terapeutti', 'opettaja', 'terveys', 'kasvattaja', 'kouluttaja', 'muotoilija', 'psykologi'];

searchTerms.forEach(term => {
  const regex = new RegExp(`title:\\s*["']([^"']*${term}[^"']*)["']`, 'gi');
  const matches = [];
  let match;
  while ((match = regex.exec(careersContent)) !== null) {
    matches.push(match[1]);
  }
  if (matches.length > 0) {
    console.log('\n   Careers with "' + term + '":');
    matches.slice(0, 10).forEach(m => console.log('      - ' + m));
    if (matches.length > 10) {
      console.log('      ... and ' + (matches.length - 10) + ' more');
    }
  }
});
