// Quick script to extract and analyze NUORI subdimensions

const validInterests = ['technology', 'health', 'people', 'education', 'creative', 'arts_culture', 'writing', 'leadership', 'innovation', 'analytical', 'hands_on', 'environment', 'nature'];
const validValues = ['impact', 'social_impact', 'career_clarity', 'global', 'advancement', 'entrepreneurship', 'growth', 'stability'];
const validWorkstyle = ['teaching', 'motivation', 'planning', 'leadership', 'problem_solving', 'organization', 'structure', 'precision', 'performance', 'flexibility'];
const validContext = ['outdoor', 'work_environment'];

const fs = require('fs');
const content = fs.readFileSync('lib/scoring/dimensions.ts', 'utf8');

// Extract NUORI section (lines 1838-2118)
const lines = content.split('\n');
const nuoriLines = lines.slice(1837, 2118);  // 0-indexed, so 1837 = line 1838

// Find all subdimension: values
const subdimensions = [];
nuoriLines.forEach((line, idx) => {
  const match = line.match(/subdimension:\s*'([^']+)'/);
  if (match) {
    const lineNum = 1838 + idx;
    const subdim = match[1];
    subdimensions.push({ lineNum, subdim });
  }
});

console.log('=== NUORI SUBDIMENSION ANALYSIS ===\n');

// Check each against valid lists
const invalid = [];
subdimensions.forEach(({ lineNum, subdim }) => {
  const isValid = validInterests.includes(subdim) || 
                  validValues.includes(subdim) || 
                  validWorkstyle.includes(subdim) || 
                  validContext.includes(subdim);
  
  if (!isValid) {
    invalid.push({ lineNum, subdim });
  }
});

if (invalid.length > 0) {
  console.log(`❌ FOUND ${invalid.length} INVALID SUBDIMENSIONS:\n`);
  invalid.forEach(({ lineNum, subdim }) => {
    console.log(`  Line ${lineNum}: '${subdim}'`);
  });
} else {
  console.log('✅ All NUORI subdimensions are valid!');
}

console.log(`\nTotal subdimensions checked: ${subdimensions.length}`);
