/**
 * Fix the last few redirects
 */

import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, 'data', 'careers-fi.ts');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('          FIXING LAST REDIRECTS');
console.log('═══════════════════════════════════════════════════════════════════════\n');

// Fix remaining redirects
const fixes: [string, string][] = [
  // Generic tyomarkkinatori.fi/ -> add path
  ['https://tyomarkkinatori.fi/', 'https://tyomarkkinatori.fi/henkiloasiakkaat'],
  // OpenAI docs
  ['https://platform.openai.com/docs', 'https://platform.openai.com/docs/overview'],
];

fixes.forEach(([oldUrl, newUrl]) => {
  const escapedOld = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`"${escapedOld}"`, 'g');
  const matches = content.match(regex);
  if (matches) {
    console.log(`Fixing: ${oldUrl} -> ${newUrl} (${matches.length})`);
    content = content.replace(regex, `"${newUrl}"`);
  }
});

// Remove LinkedIn group links (they always redirect to login)
const linkedinPatterns = [
  'https://www.linkedin.com/groups/8838565/',
  'https://www.linkedin.com/groups/8477088/',
];

linkedinPatterns.forEach(url => {
  const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `\\{\\s*name:\\s*"[^"]*",\\s*url:\\s*"${escapedUrl}"\\s*\\},?\\s*`,
    'g'
  );
  const matches = content.match(pattern);
  if (matches) {
    console.log(`Removing LinkedIn group link (requires login): ${url}`);
    content = content.replace(pattern, '');
  }
});

// Clean up
content = content.replace(/,\s*,/g, ',');
content = content.replace(/\[\s*,/g, '[');
content = content.replace(/,\s*\]/g, '\n    ]');

// Write the updated content
fs.writeFileSync(filePath, content);

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('All redirects fixed!');
