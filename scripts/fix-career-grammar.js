/**
 * CAREER DATA GRAMMAR FIXER
 * Automatically fixes:
 * 1. Missing spaces after commas
 * 2. Regular hyphens with spaces -> em dashes
 * 3. Multiple consecutive spaces -> single space
 * 4. Space before comma
 * 5. Multiple periods
 */

const fs = require('fs');
const path = require('path');

const careersPath = path.join(__dirname, '..', 'data', 'careers-fi.ts');
let content = fs.readFileSync(careersPath, 'utf8');

const originalLength = content.length;
let fixCount = 0;

// 1. Fix " - " (space-hyphen-space) -> " – " (em dash)
// But be careful not to change array syntax like [1, 2]
const beforeDash = content.match(/ - /g)?.length || 0;
content = content.replace(/ - (?![0-9])/g, ' – ');
const afterDash = content.match(/ - /g)?.length || 0;
console.log(`Fixed space-hyphen-space to em dash: ${beforeDash - afterDash} instances`);
fixCount += beforeDash - afterDash;

// 2. Fix double hyphens -> em dash
const beforeDoubleDash = content.match(/--/g)?.length || 0;
content = content.replace(/--/g, '–');
console.log(`Fixed double hyphens to em dash: ${beforeDoubleDash} instances`);
fixCount += beforeDoubleDash;

// 3. Fix multiple consecutive spaces -> single space (but not in indentation)
// Only fix spaces within strings (after the first character of the line)
const beforeMultiSpace = content.match(/(?<=[^\n\s]) {2,}(?=[^\s])/g)?.length || 0;
content = content.replace(/(?<=[^\n\s]) {2,}(?=[^\s])/g, ' ');
console.log(`Fixed multiple consecutive spaces: ${beforeMultiSpace} instances`);
fixCount += beforeMultiSpace;

// 4. Fix space before comma -> no space before comma
const beforeSpaceComma = content.match(/ ,/g)?.length || 0;
content = content.replace(/ ,/g, ',');
console.log(`Fixed space before comma: ${beforeSpaceComma} instances`);
fixCount += beforeSpaceComma;

// 5. Fix missing space after comma (but not in numbers like 3,500)
// Pattern: comma followed by a letter (not a digit or space or quote or bracket)
const beforeMissingSpace = content.match(/,(?=[a-zA-ZäöåÄÖÅ])/g)?.length || 0;
content = content.replace(/,(?=[a-zA-ZäöåÄÖÅ])/g, ', ');
console.log(`Fixed missing space after comma: ${beforeMissingSpace} instances`);
fixCount += beforeMissingSpace;

// 6. Fix multiple periods -> single period
const beforeDoublePeriod = content.match(/\.{2,}/g)?.length || 0;
content = content.replace(/\.{2,}/g, '.');
console.log(`Fixed multiple periods: ${beforeDoublePeriod} instances`);
fixCount += beforeDoublePeriod;

// Save the fixed file
fs.writeFileSync(careersPath, content, 'utf8');

console.log('');
console.log('═'.repeat(60));
console.log(`TOTAL FIXES APPLIED: ${fixCount}`);
console.log(`File size: ${originalLength} -> ${content.length} bytes`);
console.log('═'.repeat(60));
