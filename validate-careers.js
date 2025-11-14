#!/usr/bin/env node

const fs = require('fs');

// Read the file
const content = fs.readFileSync('./data/careers-fi.ts', 'utf8');

// Extract the array content
const match = content.match(/export const careersData: CareerFI\[\] = \[([\s\S]*?)\];\s*\n\s*\/\/ Helper/);
if (!match) {
  console.log('ERROR: Could not extract careersData array');
  process.exit(1);
}

const arrayContent = match[1];

// Try to evaluate as JavaScript to find syntax errors
// First, let's just count the objects properly
const objectCount = (arrayContent.match(/^\s*\{$/gm) || []).length;
console.log(`Estimated ${objectCount} career objects in array`);

// Look for common issues
const issues = [];

// Check for trailing commas before ]
if (arrayContent.match(/,\s*$/)) {
  issues.push('Trailing comma before closing bracket');
}

// Check for double commas
const doubleCommas = arrayContent.match(/,,/g);
if (doubleCommas) {
  issues.push(`Found ${doubleCommas.length} double comma(s)`);
}

// Try to find missing commas between objects
const lines = arrayContent.split('\n');
for (let i = 0; i < lines.length - 1; i++) {
  const line = lines[i].trim();
  const nextLine = lines[i + 1].trim();

  if (line === '}' && nextLine === '{') {
    issues.push(`Line ${i + 47}: Missing comma between objects`);
  }
}

if (issues.length > 0) {
  console.log('\n⚠️  Issues found:');
  issues.forEach(issue => console.log('  ' + issue));
  process.exit(1);
} else {
  console.log('✅ No obvious syntax issues found');
}
