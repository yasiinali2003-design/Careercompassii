/**
 * Remove Duunitori links that show 0 results
 * These are not helpful to users
 */

import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, '..', 'data', 'careers-fi.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Load the list of URLs with no results
const noResults = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'duunitori-no-results.json'), 'utf-8')
);

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('          REMOVING DUUNITORI LINKS WITH 0 RESULTS');
console.log('═══════════════════════════════════════════════════════════════════════\n');

console.log(`Found ${noResults.length} Duunitori links with 0 results to remove\n`);

let removedCount = 0;

// Remove each link that shows no results
noResults.forEach((item: { url: string; searchTerm: string }) => {
  const escapedUrl = item.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Pattern to match the link object
  const pattern = new RegExp(
    `\\{\\s*name:\\s*"[^"]*",\\s*url:\\s*"${escapedUrl}"\\s*\\},?\\s*`,
    'g'
  );

  const matches = content.match(pattern);
  if (matches) {
    content = content.replace(pattern, '');
    removedCount += matches.length;
  }
});

// Clean up any resulting issues
content = content.replace(/,\s*,/g, ',');
content = content.replace(/\[\s*,/g, '[');
content = content.replace(/,\s*\]/g, '\n    ]');

// Write the updated content
fs.writeFileSync(filePath, content);

console.log(`Removed ${removedCount} Duunitori links with 0 results`);
console.log('\nAll remaining Duunitori links now show actual job listings!');
