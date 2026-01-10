/**
 * Fix the last broken links
 */

import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, 'data', 'careers-fi.ts');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('          FIXING LAST BROKEN LINKS');
console.log('═══════════════════════════════════════════════════════════════════════\n');

// Fix poliisi.fi 404s -> polamk.fi (Police University College)
const policeReplacements: [string, string, string][] = [
  // Police career -> Polamk application page
  ['https://poliisi.fi/ammattilaiseksi/poliisikoulutus', 'https://polamk.fi/hakeminen', 'Poliisiammattikorkeakoulu'],
  // Rikostutkija -> Polamk
  ['https://poliisi.fi/ammattilaiseksi/rikostutkija', 'https://polamk.fi/hakeminen', 'Poliisiammattikorkeakoulu'],
];

policeReplacements.forEach(([oldUrl, newUrl, newName]) => {
  if (content.includes(oldUrl)) {
    console.log(`Fixing: ${oldUrl} -> ${newUrl}`);
    // Replace the URL
    content = content.replace(oldUrl, newUrl);
    // Also update the name in the same link object
    content = content.replace(
      new RegExp(`name:\\s*"[^"]*",\\s*url:\\s*"${newUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g'),
      `name: "${newName}", url: "${newUrl}"`
    );
  }
});

// Fix remaining redirects
const redirectFixes: [string, string][] = [
  // Fix www additions needed
  ['https://www.tehy.fi/', 'https://www.tehy.fi/fi'],
  ['https://www.artists.fi/', 'https://www.artists.fi/fi'],
  ['https://psykologiliitto.fi/', 'http://www.psyli.fi/'],
  ['https://grow.google', 'https://grow.google/intl/fi/'],
  ['https://www.ek.fi/', 'https://ek.fi/'],
  ['https://www.kauppa.fi/', 'https://kauppa.fi/'],
  ['https://yrittajat.fi/', 'https://www.yrittajat.fi/'],
  ['https://www.setry.fi/', 'https://setry.fi/'],
  ['https://www.fibsry.fi/', 'https://fibsry.fi/'],
  ['https://www.neogames.fi/', 'https://neogames.fi/'],
  ['https://www.akl.fi/', 'https://akl.fi/'],
];

redirectFixes.forEach(([oldUrl, newUrl]) => {
  const escapedOld = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedOld, 'g');
  const matches = content.match(regex);
  if (matches) {
    console.log(`Fixing redirect: ${oldUrl} -> ${newUrl} (${matches.length})`);
    content = content.replace(regex, newUrl);
  }
});

// Write the updated content
fs.writeFileSync(filePath, content);

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('All remaining fixes applied!');
