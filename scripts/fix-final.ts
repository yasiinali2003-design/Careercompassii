/**
 * Final fixes
 */

import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, 'data', 'careers-fi.ts');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('          FINAL FIXES');
console.log('═══════════════════════════════════════════════════════════════════════\n');

// Remove the broken yrittajat.fi link (the specific page doesn't exist)
const brokenUrls = [
  'https://www.yrittajat.fi/yrittajan-abc/kaupan-ala/',
];

brokenUrls.forEach(url => {
  const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `\\{\\s*name:\\s*"[^"]*",\\s*url:\\s*"${escapedUrl}"\\s*\\},?\\s*`,
    'g'
  );
  const matches = content.match(pattern);
  if (matches) {
    console.log(`Removing broken URL: ${url}`);
    content = content.replace(pattern, '');
  }
});

// Fix remaining redirects
const redirectFixes: [string, string][] = [
  // http -> https
  ['http://www.psyli.fi/', 'https://www.psyli.fi/'],
  ['http://agile.fi/', 'https://agile.fi/'],
  // Domain redirects
  ['https://www.syke.fi/fi-FI', 'https://www.syke.fi/fi/teemme-tiedolla-toivoa'],
  ['https://www.oph.fi/', 'https://www.oph.fi/fi'],
  ['https://teachable.com/', 'https://www.teachable.com/'],
  ['https://www.saleshacker.com/', 'https://gtmnow.com/'],
  ['https://www.change-management-institute.com/', 'https://change-management-institute.com/'],
  ['https://consensys.net/academy/', 'https://consensys.io/academy'],
  ['https://www.agilefinland.com/', 'https://agile.fi/'],
];

redirectFixes.forEach(([oldUrl, newUrl]) => {
  const escapedOld = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedOld, 'g');
  const matches = content.match(regex);
  if (matches) {
    console.log(`Fixing: ${oldUrl} -> ${newUrl} (${matches.length})`);
    content = content.replace(regex, newUrl);
  }
});

// Clean up
content = content.replace(/,\s*,/g, ',');
content = content.replace(/\[\s*,/g, '[');
content = content.replace(/,\s*\]/g, '\n    ]');

// Write the updated content
fs.writeFileSync(filePath, content);

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('All final fixes applied!');
