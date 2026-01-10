/**
 * Career Data Quality Analysis Script
 * Checks for:
 * 1. Duplicate careers (by title_fi and id)
 * 2. English titles that need Finnish translation
 * 3. Link validation
 * 4. Data completeness
 */

import { careersData } from './data/careers-fi';

interface DuplicateResult {
  title: string;
  ids: string[];
  count: number;
}

interface EnglishTitleResult {
  id: string;
  title_fi: string;
  issue: string;
}

interface LinkIssue {
  careerId: string;
  careerTitle: string;
  linkName: string;
  url: string;
  issue: string;
}

// Common English words that shouldn't appear in Finnish titles
const ENGLISH_WORDS = [
  'manager', 'director', 'developer', 'designer', 'engineer', 'specialist',
  'analyst', 'consultant', 'coordinator', 'administrator', 'assistant',
  'officer', 'lead', 'senior', 'junior', 'chief', 'head', 'executive',
  'sales', 'marketing', 'product', 'project', 'business', 'data', 'software',
  'cloud', 'digital', 'IT', 'HR', 'UX', 'UI', 'CEO', 'CFO', 'CTO', 'COO', 'CIO',
  'account', 'customer', 'client', 'support', 'service', 'quality', 'operations',
  'strategy', 'innovation', 'technology', 'research', 'development',
  'content', 'social', 'media', 'brand', 'growth', 'performance',
  'supply', 'chain', 'logistics', 'procurement', 'finance', 'legal',
  'compliance', 'risk', 'security', 'network', 'system', 'infrastructure',
  'frontend', 'backend', 'fullstack', 'full-stack', 'front-end', 'back-end',
  'machine', 'learning', 'artificial', 'intelligence', 'blockchain',
  'devops', 'scrum', 'agile', 'lean'
];

// Allowed English words/acronyms commonly used in Finnish job market
const ALLOWED_ENGLISH = [
  'CEO', 'CFO', 'CTO', 'COO', 'CIO', 'CHRO', 'CMO', 'CSO', 'CISO',
  'IT', 'HR', 'UX', 'UI', 'PR', 'SEO', 'SEM', 'CAD', 'CAM', 'BIM',
  'DJ', 'VJ', 'MC', 'Art', 'PMO', 'Lean', 'Scrum', 'Agile',
  'Director', 'Coach', 'Lead' // Sometimes used in Finnish context
];

console.log('╔════════════════════════════════════════════════════════════════════════════╗');
console.log('║              CAREER DATA QUALITY ANALYSIS                                  ║');
console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

console.log(`Total careers in database: ${careersData.length}\n`);

// ============================================================================
// 1. FIND DUPLICATE CAREERS
// ============================================================================
console.log('════════════════════════════════════════════════════════════════════════════');
console.log('                    1. DUPLICATE ANALYSIS');
console.log('════════════════════════════════════════════════════════════════════════════\n');

// Check for duplicate IDs
const idMap = new Map<string, string[]>();
careersData.forEach(career => {
  if (!idMap.has(career.id)) {
    idMap.set(career.id, []);
  }
  idMap.get(career.id)!.push(career.title_fi);
});

const duplicateIds = Array.from(idMap.entries())
  .filter(([_, titles]) => titles.length > 1)
  .map(([id, titles]) => ({ id, titles, count: titles.length }));

console.log('Duplicate IDs (same slug):');
if (duplicateIds.length === 0) {
  console.log('  ✅ No duplicate IDs found\n');
} else {
  duplicateIds.forEach(dup => {
    console.log(`  ❌ ID: "${dup.id}" appears ${dup.count} times`);
    console.log(`     Titles: ${dup.titles.join(', ')}`);
  });
  console.log();
}

// Check for duplicate titles
const titleMap = new Map<string, string[]>();
careersData.forEach(career => {
  if (!career.title_fi) return; // Skip careers with missing title
  const normalizedTitle = career.title_fi.toLowerCase().trim();
  if (!titleMap.has(normalizedTitle)) {
    titleMap.set(normalizedTitle, []);
  }
  titleMap.get(normalizedTitle)!.push(career.id);
});

const duplicateTitles = Array.from(titleMap.entries())
  .filter(([_, ids]) => ids.length > 1)
  .map(([title, ids]) => ({ title, ids, count: ids.length }));

console.log('Duplicate Titles (same title_fi):');
if (duplicateTitles.length === 0) {
  console.log('  ✅ No duplicate titles found\n');
} else {
  duplicateTitles.forEach(dup => {
    console.log(`  ❌ Title: "${dup.title}" appears ${dup.count} times`);
    console.log(`     IDs: ${dup.ids.join(', ')}`);
  });
  console.log();
}

// Check for similar titles (might be duplicates with slight variations)
console.log('Similar Titles (potential duplicates):');
const similarPairs: { title1: string; title2: string; id1: string; id2: string }[] = [];

function similarity(s1: string, s2: string): number {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  if (longer.length === 0) return 1.0;

  const editDistance = (a: string, b: string): number => {
    const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + cost
        );
      }
    }
    return matrix[b.length][a.length];
  };

  return (longer.length - editDistance(longer, shorter)) / longer.length;
}

for (let i = 0; i < careersData.length; i++) {
  for (let j = i + 1; j < careersData.length; j++) {
    if (!careersData[i].title_fi || !careersData[j].title_fi) continue;
    const t1 = careersData[i].title_fi.toLowerCase();
    const t2 = careersData[j].title_fi.toLowerCase();
    if (similarity(t1, t2) > 0.85 && t1 !== t2) {
      similarPairs.push({
        title1: careersData[i].title_fi,
        title2: careersData[j].title_fi,
        id1: careersData[i].id,
        id2: careersData[j].id
      });
    }
  }
}

if (similarPairs.length === 0) {
  console.log('  ✅ No suspiciously similar titles found\n');
} else {
  similarPairs.slice(0, 50).forEach(pair => {
    console.log(`  ⚠️  "${pair.title1}" (${pair.id1})`);
    console.log(`      vs "${pair.title2}" (${pair.id2})`);
  });
  if (similarPairs.length > 50) {
    console.log(`  ... and ${similarPairs.length - 50} more pairs`);
  }
  console.log();
}

// ============================================================================
// 2. FIND ENGLISH TITLES
// ============================================================================
console.log('════════════════════════════════════════════════════════════════════════════');
console.log('                    2. ENGLISH TITLE DETECTION');
console.log('════════════════════════════════════════════════════════════════════════════\n');

const englishTitles: EnglishTitleResult[] = [];

careersData.forEach(career => {
  const words = career.title_fi.split(/[\s\-\/\(\)]+/);
  const englishWords = words.filter(word => {
    const lowerWord = word.toLowerCase();
    // Skip allowed words
    if (ALLOWED_ENGLISH.some(a => a.toLowerCase() === lowerWord)) return false;
    // Check if it's an English word
    return ENGLISH_WORDS.some(e => e.toLowerCase() === lowerWord);
  });

  if (englishWords.length > 0) {
    englishTitles.push({
      id: career.id,
      title_fi: career.title_fi,
      issue: `Contains English words: ${englishWords.join(', ')}`
    });
  }
});

console.log(`Titles with English words (${englishTitles.length} found):`);
if (englishTitles.length === 0) {
  console.log('  ✅ All titles appear to be in Finnish\n');
} else {
  englishTitles.forEach(item => {
    console.log(`  ⚠️  "${item.title_fi}" (${item.id})`);
    console.log(`      ${item.issue}`);
  });
  console.log();
}

// ============================================================================
// 3. LINK VALIDATION
// ============================================================================
console.log('════════════════════════════════════════════════════════════════════════════');
console.log('                    3. LINK ANALYSIS');
console.log('════════════════════════════════════════════════════════════════════════════\n');

const linkIssues: LinkIssue[] = [];
const duunitoriLinks: { careerId: string; title: string; url: string; expectedSearch: string }[] = [];

careersData.forEach(career => {
  if (!career.useful_links || career.useful_links.length === 0) {
    linkIssues.push({
      careerId: career.id,
      careerTitle: career.title_fi,
      linkName: 'N/A',
      url: 'N/A',
      issue: 'No useful_links defined'
    });
    return;
  }

  career.useful_links.forEach(link => {
    // Check for empty or invalid URLs
    if (!link.url || link.url.trim() === '') {
      linkIssues.push({
        careerId: career.id,
        careerTitle: career.title_fi,
        linkName: link.name,
        url: link.url,
        issue: 'Empty URL'
      });
    }

    // Check for malformed URLs
    try {
      new URL(link.url);
    } catch {
      linkIssues.push({
        careerId: career.id,
        careerTitle: career.title_fi,
        linkName: link.name,
        url: link.url,
        issue: 'Malformed URL'
      });
    }

    // Track Duunitori links
    if (link.url.includes('duunitori')) {
      duunitoriLinks.push({
        careerId: career.id,
        title: career.title_fi,
        url: link.url,
        expectedSearch: encodeURIComponent(career.title_fi)
      });
    }
  });
});

// Check for missing Duunitori links
const careersWithoutDuunitori = careersData.filter(career =>
  !career.useful_links?.some(link => link.url.includes('duunitori'))
);

console.log(`Careers without Duunitori link: ${careersWithoutDuunitori.length}`);
if (careersWithoutDuunitori.length > 0 && careersWithoutDuunitori.length <= 20) {
  careersWithoutDuunitori.forEach(career => {
    console.log(`  - ${career.title_fi} (${career.id})`);
  });
}
console.log();

console.log(`Link Issues (${linkIssues.length} found):`);
if (linkIssues.length === 0) {
  console.log('  ✅ All links appear valid\n');
} else {
  linkIssues.slice(0, 30).forEach(issue => {
    console.log(`  ❌ ${issue.careerTitle}: ${issue.issue}`);
    console.log(`     Link: ${issue.linkName} -> ${issue.url}`);
  });
  if (linkIssues.length > 30) {
    console.log(`  ... and ${linkIssues.length - 30} more issues`);
  }
  console.log();
}

// ============================================================================
// 4. DUUNITORI LINK FORMAT CHECK
// ============================================================================
console.log('════════════════════════════════════════════════════════════════════════════');
console.log('                    4. DUUNITORI LINK FORMAT CHECK');
console.log('════════════════════════════════════════════════════════════════════════════\n');

// Expected format: https://duunitori.fi/tyopaikat?haku=<job_title>
const correctDuunitoriFormat = 'https://duunitori.fi/tyopaikat?haku=';
const incorrectDuunitoriLinks: { id: string; title: string; url: string; suggestion: string }[] = [];

duunitoriLinks.forEach(link => {
  // Check if the URL follows the correct pattern
  if (!link.url.startsWith(correctDuunitoriFormat)) {
    incorrectDuunitoriLinks.push({
      id: link.careerId,
      title: link.title,
      url: link.url,
      suggestion: `${correctDuunitoriFormat}${encodeURIComponent(link.title)}`
    });
  } else {
    // Check if the search term matches the job title
    const searchTerm = link.url.replace(correctDuunitoriFormat, '');
    const decodedSearch = decodeURIComponent(searchTerm);
    if (decodedSearch.toLowerCase() !== link.title.toLowerCase()) {
      // Not an error, but worth noting
    }
  }
});

console.log(`Total Duunitori links: ${duunitoriLinks.length}`);
console.log(`Incorrect format: ${incorrectDuunitoriLinks.length}`);

if (incorrectDuunitoriLinks.length > 0) {
  console.log('\nDuunitori links with incorrect format:');
  incorrectDuunitoriLinks.slice(0, 30).forEach(link => {
    console.log(`  ❌ ${link.title}`);
    console.log(`     Current: ${link.url}`);
    console.log(`     Suggested: ${link.suggestion}`);
  });
  if (incorrectDuunitoriLinks.length > 30) {
    console.log(`  ... and ${incorrectDuunitoriLinks.length - 30} more`);
  }
}
console.log();

// ============================================================================
// 5. CATEGORY DISTRIBUTION
// ============================================================================
console.log('════════════════════════════════════════════════════════════════════════════');
console.log('                    5. CATEGORY DISTRIBUTION');
console.log('════════════════════════════════════════════════════════════════════════════\n');

const categoryCount = new Map<string, number>();
careersData.forEach(career => {
  categoryCount.set(career.category, (categoryCount.get(career.category) || 0) + 1);
});

const sortedCategories = Array.from(categoryCount.entries()).sort((a, b) => b[1] - a[1]);
sortedCategories.forEach(([category, count]) => {
  const bar = '█'.repeat(Math.round(count / 10));
  console.log(`  ${category.padEnd(25)} ${count.toString().padStart(4)} ${bar}`);
});
console.log();

// ============================================================================
// 6. SUMMARY
// ============================================================================
console.log('════════════════════════════════════════════════════════════════════════════');
console.log('                    SUMMARY');
console.log('════════════════════════════════════════════════════════════════════════════\n');

console.log(`Total Careers: ${careersData.length}`);
console.log(`Duplicate IDs: ${duplicateIds.length}`);
console.log(`Duplicate Titles: ${duplicateTitles.length}`);
console.log(`Similar Titles (potential duplicates): ${similarPairs.length}`);
console.log(`English Titles: ${englishTitles.length}`);
console.log(`Link Issues: ${linkIssues.length}`);
console.log(`Incorrect Duunitori Format: ${incorrectDuunitoriLinks.length}`);
console.log(`Missing Duunitori Links: ${careersWithoutDuunitori.length}`);

// Export for further processing
const report = {
  totalCareers: careersData.length,
  duplicateIds,
  duplicateTitles,
  similarPairs,
  englishTitles,
  linkIssues,
  incorrectDuunitoriLinks,
  careersWithoutDuunitori: careersWithoutDuunitori.map(c => ({ id: c.id, title: c.title_fi }))
};

console.log('\n\nDetailed data exported for review.');

// List all careers that need Duunitori links added
if (careersWithoutDuunitori.length > 0) {
  console.log('\n════════════════════════════════════════════════════════════════════════════');
  console.log('                    CAREERS NEEDING DUUNITORI LINK');
  console.log('════════════════════════════════════════════════════════════════════════════\n');

  careersWithoutDuunitori.slice(0, 100).forEach(career => {
    const duunitoriUrl = `https://duunitori.fi/tyopaikat?haku=${encodeURIComponent(career.title_fi)}`;
    console.log(`${career.id}: { name: "Hae töitä Duunitorista", url: "${duunitoriUrl}" }`);
  });
  if (careersWithoutDuunitori.length > 100) {
    console.log(`... and ${careersWithoutDuunitori.length - 100} more`);
  }
}
