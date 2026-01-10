/**
 * Fix all broken links found in deep verification
 * Remove links that show "not found" content
 */

import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, '..', 'data', 'careers-fi.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Load verification results
const results = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'deep-verification-results.json'), 'utf-8')
);

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('          FIXING ALL BROKEN LINKS');
console.log('═══════════════════════════════════════════════════════════════════════\n');

const brokenUrls: string[] = results.broken.map((b: any) => b.url);
console.log(`Found ${brokenUrls.length} broken URLs to remove\n`);

let removedCount = 0;

// Remove each broken link
brokenUrls.forEach(url => {
  const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Pattern to match the link object
  const pattern = new RegExp(
    `\\{\\s*name:\\s*"[^"]*",\\s*url:\\s*"${escapedUrl}"\\s*\\},?\\s*`,
    'g'
  );

  const matches = content.match(pattern);
  if (matches) {
    console.log(`Removing: ${url.substring(0, 70)}...`);
    removedCount += matches.length;
    content = content.replace(pattern, '');
  }
});

// Clean up any resulting issues
content = content.replace(/,\s*,/g, ',');
content = content.replace(/\[\s*,/g, '[');
content = content.replace(/,\s*\]/g, '\n    ]');

// Write the updated content
fs.writeFileSync(filePath, content);

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log(`Removed ${removedCount} broken links`);
console.log('File updated successfully!');
