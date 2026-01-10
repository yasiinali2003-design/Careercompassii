/**
 * Fix broken Työmarkkinatori links by replacing with search URL
 * The search page always works and shows relevant results
 */

import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, '..', 'data', 'careers-fi.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Load broken IDs
const brokenIds: string[] = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'broken-tyomarkkinatori-ids.json'), 'utf-8')
);

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('          FIXING BROKEN TYÖMARKKINATORI LINKS');
console.log('═══════════════════════════════════════════════════════════════════════\n');
console.log(`Found ${brokenIds.length} broken career IDs to fix\n`);

let fixCount = 0;

// For each broken ID, replace the specific career link with the search page
brokenIds.forEach(brokenId => {
  const escapedId = brokenId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Pattern to match the broken link
  const pattern = new RegExp(
    `\\{\\s*name:\\s*"([^"]*)",\\s*url:\\s*"https://tyomarkkinatori\\.fi/henkiloasiakkaat/ammattitieto/ammatit/${escapedId}"\\s*\\}`,
    'g'
  );

  const matches = content.match(pattern);
  if (matches) {
    // Replace with the main ammattitieto search page
    content = content.replace(pattern, (match, name) => {
      return `{ name: "${name}", url: "https://tyomarkkinatori.fi/henkiloasiakkaat/ammattitieto" }`;
    });
    fixCount += matches.length;
  }
});

// Write the updated content
fs.writeFileSync(filePath, content);

console.log(`Fixed ${fixCount} broken Työmarkkinatori links`);
console.log('All links now point to the main ammattitieto page which always works');
