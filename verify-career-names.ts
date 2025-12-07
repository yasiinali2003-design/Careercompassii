/**
 * CAREER NAME & AVAILABILITY VERIFICATION
 * Checks if career names are correct Finnish terminology
 * and if careers actually exist in the Finnish job market
 */

import { careersData } from './data/careers-fi';

interface CareerIssue {
  id: string;
  title_fi: string;
  title_en: string;
  category: string;
  issues: string[];
}

const issues: CareerIssue[] = [];

// Common English-only terms that shouldn't be in Finnish names
const englishOnlyTerms = [
  'Manager', 'Developer', 'Engineer', 'Designer', 'Specialist',
  'Coordinator', 'Consultant', 'Analyst', 'Director', 'Officer',
  'Coach', 'Planner', 'Assistant', 'Administrator', 'Supervisor'
];

// US-specific careers that don't exist in Finland
const usOnlyCareers = [
  'realtor', 'escrow', 'paralegal', '401k', 'CPA',
  'SAT tutor', 'sorority', 'fraternity'
];

// Check each career
console.log('🔍 CAREER NAME & AVAILABILITY VERIFICATION\n');
console.log('Checking all careers...\n');

let checked = 0;
let withIssues = 0;

for (const career of careersData) {
  if (!career || !career.id) continue;

  checked++;
  const careerIssues: string[] = [];

  // Check 1: Finnish title should not contain English-only terms
  const titleFi = career.title_fi || '';
  for (const term of englishOnlyTerms) {
    if (titleFi.includes(term) && !titleFi.includes('-')) {
      // Allow hyphenated like "Customer Success Manager" only if explicitly foreign role
      careerIssues.push(`Finnish title contains English term: "${term}"`);
    }
  }

  // Check 2: Title should not be fully in English when Finnish exists
  const suspiciousEnglishTitles = [
    'Customer Success Manager',
    'Community Manager',
    'Technical Support Specialist',
    'Social Justice Advocate',
    'Youth Empowerment Coordinator',
    'Gender Equality Advisor',
    'Cultural Sensitivity Consultant',
    'Museum Education Specialist',
    'Mental Health Counselor',
    'Wellness Coach',
    'Occupational Health Specialist',
    'Nutrition Specialist',
    'Art Therapy Facilitator',
    'Ethical Brand Strategist',
    'Circular Economy Specialist',
    'Regenerative Agriculture Consultant'
  ];

  if (suspiciousEnglishTitles.some(t => titleFi === t)) {
    careerIssues.push('Title is in English, should have Finnish equivalent');
  }

  // Check 3: US-specific roles
  const allText = `${career.id} ${titleFi} ${career.title_en} ${career.short_description}`.toLowerCase();
  for (const usterm of usOnlyCareers) {
    if (allText.includes(usterm)) {
      careerIssues.push(`May be US-specific role (contains: "${usterm}")`);
    }
  }

  // Check 4: Very rare/emerging roles that may not exist in Finland yet
  const emergingRoles = [
    'kvanttilaskenta', 'quantum computing',
    'blockchain', 'lohkoketju',
    'neurotech', 'neurotekniikka',
    'metaverse', 'metaversumi',
    'web3',
    'nft',
    'cryptocurrency'
  ];

  for (const emerging of emergingRoles) {
    if (allText.includes(emerging)) {
      careerIssues.push(`Emerging role - may have limited availability in Finland`);
      break;
    }
  }

  // Check 5: Missing Finnish translation (title_fi same as title_en)
  if (career.title_fi && career.title_en && career.title_fi === career.title_en &&
      career.title_fi.split(' ').some(word =>
        englishOnlyTerms.some(term => word === term)
      )) {
    careerIssues.push('Finnish and English titles are identical - needs translation');
  }

  if (careerIssues.length > 0) {
    withIssues++;
    issues.push({
      id: career.id,
      title_fi: titleFi,
      title_en: career.title_en || '',
      category: career.category,
      issues: careerIssues
    });
  }
}

// Print results
console.log('=' + '='.repeat(79));
console.log(`✅ Checked: ${checked} careers`);
console.log(`⚠️  Issues Found: ${withIssues} careers`);
console.log(`✅ Clean: ${checked - withIssues} careers`);
console.log('=' + '='.repeat(79));

if (issues.length > 0) {
  console.log('\n⚠️  CAREERS WITH POTENTIAL ISSUES:\n');

  // Group by issue type
  const byIssueType: Record<string, CareerIssue[]> = {};

  issues.forEach(issue => {
    issue.issues.forEach(issueText => {
      if (!byIssueType[issueText]) byIssueType[issueText] = [];
      byIssueType[issueText].push(issue);
    });
  });

  // Print grouped results
  Object.entries(byIssueType).forEach(([issueType, careers]) => {
    console.log(`\n📌 ${issueType} (${careers.length} careers):`);
    careers.slice(0, 10).forEach(c => {
      console.log(`   - ${c.id}: "${c.title_fi}" (${c.category})`);
    });
    if (careers.length > 10) {
      console.log(`   ... and ${careers.length - 10} more`);
    }
  });
}

// Specific checks for Finnish terminology
console.log('\n\n🇫🇮 FINNISH TERMINOLOGY VERIFICATION:\n');

const terminologyIssues = issues.filter(i =>
  i.issues.some(issue =>
    issue.includes('English') || issue.includes('translation')
  )
);

if (terminologyIssues.length > 0) {
  console.log(`⚠️  ${terminologyIssues.length} careers need better Finnish names:\n`);

  terminologyIssues.forEach(c => {
    console.log(`❌ ${c.id}`);
    console.log(`   Current: "${c.title_fi}"`);
    console.log(`   English: "${c.title_en}"`);
    console.log(`   Category: ${c.category}`);
    console.log(`   Issues: ${c.issues.join(', ')}`);
    console.log('');
  });
} else {
  console.log('✅ All careers have proper Finnish terminology!');
}

// Finnish market availability check
console.log('\n📊 FINNISH MARKET AVAILABILITY:\n');

const availabilityIssues = issues.filter(i =>
  i.issues.some(issue =>
    issue.includes('US-specific') || issue.includes('Emerging') || issue.includes('limited availability')
  )
);

if (availabilityIssues.length > 0) {
  console.log(`⚠️  ${availabilityIssues.length} careers may have limited availability in Finland:\n`);

  availabilityIssues.forEach(c => {
    console.log(`⚠️  ${c.id}: "${c.title_fi}"`);
    console.log(`   Reason: ${c.issues.filter(i => i.includes('specific') || i.includes('Emerging')).join(', ')}`);
  });
} else {
  console.log('✅ All careers appear to exist in the Finnish job market!');
}

// Summary by category
console.log('\n\n📈 ISSUES BY CATEGORY:\n');

const issuesByCategory: Record<string, number> = {};
issues.forEach(i => {
  issuesByCategory[i.category] = (issuesByCategory[i.category] || 0) + 1;
});

Object.entries(issuesByCategory).sort(([,a], [,b]) => b - a).forEach(([cat, count]) => {
  const total = careersData.filter(c => c && c.category === cat).length;
  const percentage = Math.round((count / total) * 100);
  console.log(`   ${cat.padEnd(25)} ${count}/${total} (${percentage}%)`);
});

console.log('\n' + '='.repeat(80));
console.log('Verification complete!');
console.log('='.repeat(80));

// Export for further analysis
console.log(`\n📝 To fix issues, review: docs/CAREER_NAME_ISSUES.md`);
