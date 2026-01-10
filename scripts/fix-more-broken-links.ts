/**
 * Fix remaining broken links
 */

import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, 'data', 'careers-fi.ts');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('          FIXING REMAINING BROKEN LINKS');
console.log('═══════════════════════════════════════════════════════════════════════\n');

// Fix domain redirects
const domainFixes: [RegExp, string, string][] = [
  // www.fysioterapeutit.fi -> suomenfysioterapeutit.fi
  [/https:\/\/www\.fysioterapeutit\.fi\/?/g, 'https://www.suomenfysioterapeutit.fi/', 'Fysioterapeutit'],
  // www.pro.fi -> proliitto.fi
  [/https:\/\/www\.pro\.fi\/?/g, 'https://proliitto.fi/', 'Pro-liitto'],
  // taloushallinto.fi (returns 405) -> taloushallintoliitto.fi
  [/https:\/\/www\.taloushallinto\.fi\/?/g, 'https://taloushallintoliitto.fi/', 'Taloushallintoliitto'],
];

domainFixes.forEach(([pattern, replacement, name]) => {
  const matches = content.match(pattern);
  if (matches) {
    console.log(`Fixing ${name}: ${matches.length} occurrences`);
    content = content.replace(pattern, replacement);
  }
});

// Update link names to match new domains
const nameUpdates: [string, string][] = [
  ['Fysioterapeutit', 'Suomen Fysioterapeutit'],
  ['Pro-liitto', 'Ammattiliitto Pro'],
];

nameUpdates.forEach(([oldName, newName]) => {
  const pattern = new RegExp(`name:\\s*"${oldName}"`, 'g');
  const matches = content.match(pattern);
  if (matches) {
    console.log(`Updating name: "${oldName}" -> "${newName}" (${matches.length} occurrences)`);
    content = content.replace(pattern, `name: "${newName}"`);
  }
});

// More www -> non-www fixes for remaining redirects
const moreRedirects: [string, string][] = [
  ['https://www.oaj.fi/', 'https://oaj.fi/'],
  ['https://www.pam.fi/', 'https://pam.fi/'],
  ['https://www.jhl.fi/', 'https://jhl.fi/'],
  ['https://www.tek.fi/', 'https://tek.fi/'],
  ['https://www.akava.fi/', 'https://akava.fi/'],
  ['https://www.artists.fi/', 'https://artists.fi/'],
  ['https://www.tehy.fi/', 'https://tehy.fi/'],
];

moreRedirects.forEach(([oldUrl, newUrl]) => {
  const escapedOld = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedOld, 'g');
  const matches = content.match(regex);
  if (matches) {
    console.log(`Updating redirect: ${oldUrl} -> ${newUrl} (${matches.length})`);
    content = content.replace(regex, newUrl);
  }
});

// Write the updated content
fs.writeFileSync(filePath, content);

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('All additional fixes applied!');
