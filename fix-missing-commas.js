/**
 * Fix missing commas after inline comments added by batch scripts
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'lib', 'scoring/dimensions.ts');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('Fixing missing commas after inline comments');
console.log('============================================\n');

// Pattern: subdimension: 'xyz' // COMMENT (missing comma before newline)
// Should be: subdimension: 'xyz', // COMMENT

const pattern = /(subdimension: '[^']+') (\/\/ ALREADY_FIXED_[^\n]+)/g;
const before = (content.match(pattern) || []).length;

console.log(`Found ${before} lines with inline comments missing commas`);

content = content.replace(pattern, '$1, $2');

const after = (content.match(pattern) || []).length;
console.log(`After fix: ${after} remaining\n`);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('✅ File updated successfully!');
console.log('All inline comments now have commas.');
