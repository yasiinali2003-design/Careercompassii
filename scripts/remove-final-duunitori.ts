/**
 * Remove the last 3 Duunitori links that show 0 results
 * These careers are too niche for Duunitori job search
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '..', 'data', 'careers-fi.ts');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('          REMOVING FINAL DUUNITORI LINKS WITH 0 RESULTS');
console.log('═══════════════════════════════════════════════════════════════════════\n');

// URLs to remove
const urlsToRemove = [
  'https://duunitori.fi/tyopaikat?haku=kuvaaja',
  'https://duunitori.fi/tyopaikat?haku=kustannusala',
  'https://duunitori.fi/tyopaikat?haku=kasvattaja',
];

let removedCount = 0;

// Remove each link
urlsToRemove.forEach(url => {
  const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Pattern to match the link object
  const pattern = new RegExp(
    `\\{\\s*name:\\s*"[^"]*",\\s*url:\\s*"${escapedUrl}"\\s*\\},?\\s*`,
    'g'
  );

  const matches = content.match(pattern);
  if (matches) {
    content = content.replace(pattern, '');
    removedCount += matches.length;
    console.log(`Removed: ${url}`);
  }
});

// Clean up any resulting issues
content = content.replace(/,\s*,/g, ',');
content = content.replace(/\[\s*,/g, '[');
content = content.replace(/,\s*\]/g, '\n    ]');

// Write the updated content
fs.writeFileSync(filePath, content);

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log(`Removed ${removedCount} Duunitori links with 0 results`);
console.log('All remaining Duunitori links now show actual job listings!');
