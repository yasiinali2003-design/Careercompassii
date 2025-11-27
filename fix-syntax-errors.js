/**
 * Fix syntax errors introduced by batch scripts
 * Remove literal \n escape sequences
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'lib', 'scoring', 'dimensions.ts');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('Fixing syntax errors in dimensions.ts');
console.log('====================================\n');

// Count issues before
const beforeCount = (content.match(/\\\\n/g) || []).length;
console.log(`Found ${beforeCount} literal \\n escape sequences`);

// Fix all literal \n escape sequences that should be actual newlines
// The batch scripts added these by using double backslashes in replace strings
content = content.replace(/\\n/g, '\n');

// Count after
const afterCount = (content.match(/\\\\n/g) || []).length;
console.log(`After fix: ${afterCount} remaining\n`);

// Write back
fs.writeFileSync(filePath, content, 'utf-8');
console.log('✅ File updated successfully!');
console.log('Syntax errors should now be resolved.');
