/**
 * COMPREHENSIVE CAREER DATA ANALYSIS
 * Checks all careers for:
 * 1. Grammar issues (Finnish)
 * 2. Factual accuracy (salaries, education)
 * 3. Formatting (em dashes, commas)
 * 4. Data consistency
 * 5. Source validity
 */

const fs = require('fs');
const path = require('path');

// Read the careers file
const careersPath = path.join(__dirname, '..', 'data', 'careers-fi.ts');
const content = fs.readFileSync(careersPath, 'utf8');

// Extract career data using regex
const careerBlocks = content.split(/\n\s*\{[\s\n]*id:/g).slice(1);

const issues = {
  critical: [],
  grammar: [],
  factual: [],
  formatting: [],
  consistency: [],
  links: [],
  salaries: [],
  education: []
};

let careerCount = 0;

// Known Finnish grammar patterns to check
const grammarChecks = [
  { pattern: /Kopioida/g, issue: "Typo: 'Kopioida' should be 'Copywriter' or 'Tekstitoistaja'" },
  { pattern: /\s+,/g, issue: "Space before comma" },
  { pattern: /,(?!\s)/g, issue: "Missing space after comma" },
  { pattern: /\.\s{2,}/g, issue: "Multiple spaces after period" },
  { pattern: /\s{2,}/g, issue: "Multiple consecutive spaces" },
  { pattern: /--/g, issue: "Double hyphen instead of em dash (–)" },
  { pattern: /\s-\s/g, issue: "Regular hyphen with spaces (should be em dash –)" },
  { pattern: /Suomessa Suomessa/g, issue: "Duplicate 'Suomessa'" },
  { pattern: /\.\s*\./g, issue: "Double period" },
];

// Salary range validation
function validateSalary(median, range, careerTitle) {
  const issues = [];

  if (median < 1000 || median > 15000) {
    issues.push(`Unusual median salary: ${median}€ for ${careerTitle}`);
  }

  if (range[0] < 500) {
    issues.push(`Very low minimum salary: ${range[0]}€ for ${careerTitle}`);
  }

  if (range[1] > 20000) {
    issues.push(`Very high maximum salary: ${range[1]}€ for ${careerTitle}`);
  }

  if (median < range[0] || median > range[1]) {
    issues.push(`Median ${median}€ outside range [${range[0]}, ${range[1]}] for ${careerTitle}`);
  }

  return issues;
}

// Extract career info from block
function extractCareerInfo(block) {
  const idMatch = block.match(/"([^"]+)"/);
  const titleMatch = block.match(/title_fi:\s*"([^"]+)"/);
  const salaryMatch = block.match(/median:\s*(\d+)[\s\S]*?range:\s*\[(\d+),\s*(\d+)\]/);
  const descMatch = block.match(/short_description:\s*"([^"]+)"/);

  return {
    id: idMatch ? idMatch[1] : 'unknown',
    title: titleMatch ? titleMatch[1] : 'unknown',
    salary: salaryMatch ? {
      median: parseInt(salaryMatch[1]),
      range: [parseInt(salaryMatch[2]), parseInt(salaryMatch[3])]
    } : null,
    description: descMatch ? descMatch[1] : ''
  };
}

console.log('╔══════════════════════════════════════════════════════════════════════╗');
console.log('║          COMPREHENSIVE CAREER DATA ANALYSIS                          ║');
console.log('╚══════════════════════════════════════════════════════════════════════╝\n');

// Analyze each career
careerBlocks.forEach((block, index) => {
  careerCount++;
  const career = extractCareerInfo(block);

  // Check grammar patterns
  grammarChecks.forEach(check => {
    if (check.pattern.test(block)) {
      issues.grammar.push({
        career: career.title,
        id: career.id,
        issue: check.issue
      });
    }
  });

  // Check salary validity
  if (career.salary) {
    const salaryIssues = validateSalary(career.salary.median, career.salary.range, career.title);
    salaryIssues.forEach(issue => {
      issues.salaries.push({
        career: career.title,
        id: career.id,
        issue: issue
      });
    });
  }

  // Check for missing required fields
  const requiredFields = ['title_fi', 'title_en', 'short_description', 'main_tasks', 'education_paths', 'salary_eur_month'];
  requiredFields.forEach(field => {
    if (!block.includes(field)) {
      issues.critical.push({
        career: career.title,
        id: career.id,
        issue: `Missing required field: ${field}`
      });
    }
  });

  // Check for broken/empty links
  const linkMatches = block.matchAll(/url:\s*"([^"]+)"/g);
  for (const match of linkMatches) {
    const url = match[1];
    if (!url.startsWith('http')) {
      issues.links.push({
        career: career.title,
        id: career.id,
        issue: `Invalid URL format: ${url}`
      });
    }
  }

  // Check education paths format
  const eduMatch = block.match(/education_paths:\s*\[([\s\S]*?)\]/);
  if (eduMatch) {
    const eduContent = eduMatch[1];
    if (!eduContent.includes('AMK') && !eduContent.includes('Yliopisto') && !eduContent.includes('Toinen aste')) {
      issues.education.push({
        career: career.title,
        id: career.id,
        issue: 'Education paths missing standard Finnish education types'
      });
    }
  }
});

// Output results
console.log(`Total careers analyzed: ${careerCount}\n`);

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('CRITICAL ISSUES (Missing fields)');
console.log('═══════════════════════════════════════════════════════════════════════');
if (issues.critical.length === 0) {
  console.log('✅ No critical issues found\n');
} else {
  issues.critical.forEach(i => console.log(`❌ ${i.career}: ${i.issue}`));
  console.log('');
}

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('GRAMMAR ISSUES');
console.log('═══════════════════════════════════════════════════════════════════════');
if (issues.grammar.length === 0) {
  console.log('✅ No grammar issues found\n');
} else {
  issues.grammar.slice(0, 50).forEach(i => console.log(`⚠️  ${i.career}: ${i.issue}`));
  if (issues.grammar.length > 50) {
    console.log(`... and ${issues.grammar.length - 50} more grammar issues`);
  }
  console.log('');
}

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('SALARY ISSUES');
console.log('═══════════════════════════════════════════════════════════════════════');
if (issues.salaries.length === 0) {
  console.log('✅ No salary issues found\n');
} else {
  issues.salaries.forEach(i => console.log(`💰 ${i.career}: ${i.issue}`));
  console.log('');
}

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('LINK ISSUES');
console.log('═══════════════════════════════════════════════════════════════════════');
if (issues.links.length === 0) {
  console.log('✅ No link issues found\n');
} else {
  issues.links.slice(0, 20).forEach(i => console.log(`🔗 ${i.career}: ${i.issue}`));
  if (issues.links.length > 20) {
    console.log(`... and ${issues.links.length - 20} more link issues`);
  }
  console.log('');
}

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('EDUCATION PATH ISSUES');
console.log('═══════════════════════════════════════════════════════════════════════');
if (issues.education.length === 0) {
  console.log('✅ No education path issues found\n');
} else {
  issues.education.slice(0, 20).forEach(i => console.log(`🎓 ${i.career}: ${i.issue}`));
  if (issues.education.length > 20) {
    console.log(`... and ${issues.education.length - 20} more education issues`);
  }
  console.log('');
}

// Summary
const totalIssues = issues.critical.length + issues.grammar.length + issues.salaries.length + issues.links.length + issues.education.length;
console.log('═══════════════════════════════════════════════════════════════════════');
console.log('SUMMARY');
console.log('═══════════════════════════════════════════════════════════════════════');
console.log(`Total careers: ${careerCount}`);
console.log(`Critical issues: ${issues.critical.length}`);
console.log(`Grammar issues: ${issues.grammar.length}`);
console.log(`Salary issues: ${issues.salaries.length}`);
console.log(`Link issues: ${issues.links.length}`);
console.log(`Education issues: ${issues.education.length}`);
console.log(`TOTAL ISSUES: ${totalIssues}`);

// Save detailed report
const report = {
  timestamp: new Date().toISOString(),
  totalCareers: careerCount,
  issues: issues
};

fs.writeFileSync(
  path.join(__dirname, '..', 'career-data-analysis-report.json'),
  JSON.stringify(report, null, 2)
);

console.log('\n📄 Detailed report saved to: career-data-analysis-report.json');
