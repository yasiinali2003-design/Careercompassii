/**
 * Fix ammattinetti.fi links - this domain now redirects to tyomarkkinatori.fi
 * Update links to point directly to the new domain
 */

import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, 'data', 'careers-fi.ts');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('          FIXING AMMATTINETTI.FI LINKS');
console.log('═══════════════════════════════════════════════════════════════════════\n');

// Count before
const beforeCount = (content.match(/ammattinetti\.fi/g) || []).length;
console.log(`Links containing ammattinetti.fi before: ${beforeCount}`);

// Replace ammattinetti.fi with tyomarkkinatori.fi in URLs
// Also update the link names from "Ammattinetti" to "Työmarkkinatori"

// Replace URLs
content = content.replace(/https?:\/\/(?:www\.)?ammattinetti\.fi\/?/g, 'https://tyomarkkinatori.fi/');

// Replace link names
content = content.replace(/name:\s*"Ammattinetti"/g, 'name: "Työmarkkinatori"');
content = content.replace(/name:\s*"TEM Ammattinetti"/g, 'name: "Työmarkkinatori"');

// Count after
const afterCount = (content.match(/ammattinetti\.fi/g) || []).length;
console.log(`Links containing ammattinetti.fi after: ${afterCount}`);

// Write the updated content
fs.writeFileSync(filePath, content);

console.log(`\n${'═'.repeat(75)}`);
console.log(`Updated ${beforeCount - afterCount} ammattinetti.fi references`);
console.log('File updated successfully!');
