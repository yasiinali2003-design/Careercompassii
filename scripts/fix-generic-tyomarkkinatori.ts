/**
 * Remove generic Työmarkkinatori links that just go to /ammattitieto
 * These aren't helpful - they don't link to specific career info
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '..', 'data', 'careers-fi.ts');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('          REMOVING GENERIC TYÖMARKKINATORI LINKS');
console.log('═══════════════════════════════════════════════════════════════════════\n');

// Count before
const countBefore = (content.match(/tyomarkkinatori\.fi\/henkiloasiakkaat\/ammattitieto"/g) || []).length;
console.log(`Found ${countBefore} generic Työmarkkinatori links to remove\n`);

// Pattern to match the generic link object
const pattern = /\{\s*name:\s*"[^"]*Työmarkkinatori[^"]*",\s*url:\s*"https:\/\/tyomarkkinatori\.fi\/henkiloasiakkaat\/ammattitieto"\s*\},?\s*/g;

content = content.replace(pattern, '');

// Clean up any resulting issues
content = content.replace(/,\s*,/g, ',');
content = content.replace(/\[\s*,/g, '[');
content = content.replace(/,\s*\]/g, '\n    ]');

// Write the updated content
fs.writeFileSync(filePath, content);

// Count after
const countAfter = (content.match(/tyomarkkinatori\.fi\/henkiloasiakkaat\/ammattitieto"/g) || []).length;

console.log(`Removed ${countBefore - countAfter} generic Työmarkkinatori links`);
console.log('\nRemaining Työmarkkinatori links should point to specific career pages');
