/**
 * COMPREHENSIVE LINK AUDIT
 * Check every career and every link for issues
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the extracted data
const dataPath = path.join(__dirname, '..', 'all-career-links.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

interface CareerLink {
  name: string;
  url: string;
}

interface Career {
  id: string;
  title_fi: string;
  useful_links: CareerLink[];
}

interface Issue {
  careerId: string;
  careerTitle: string;
  issueType: string;
  details: string;
  link?: CareerLink;
}

const issues: Issue[] = [];

// Check each career
console.log('═══════════════════════════════════════════════════════════════════════');
console.log('          COMPREHENSIVE CAREER LINK AUDIT');
console.log('═══════════════════════════════════════════════════════════════════════\n');

for (const career of data.careers as Career[]) {
  // Check for duplicate links
  const urlCounts = new Map<string, number>();
  for (const link of career.useful_links) {
    urlCounts.set(link.url, (urlCounts.get(link.url) || 0) + 1);
  }

  urlCounts.forEach((count, url) => {
    if (count > 1) {
      issues.push({
        careerId: career.id,
        careerTitle: career.title_fi,
        issueType: 'DUPLICATE_LINK',
        details: `URL appears ${count} times: ${url}`,
        link: career.useful_links.find(l => l.url === url)
      });
    }
  });

  // Check Duunitori links
  for (const link of career.useful_links) {
    if (link.url.includes('duunitori.fi')) {
      // Check if ?haku= parameter exists
      if (!link.url.includes('?haku=')) {
        issues.push({
          careerId: career.id,
          careerTitle: career.title_fi,
          issueType: 'DUUNITORI_NO_HAKU',
          details: 'Duunitori link missing ?haku= parameter',
          link
        });
      } else {
        // Extract the search term
        const match = link.url.match(/\?haku=([^&]+)/);
        if (match) {
          const searchTerm = decodeURIComponent(match[1]);

          // Check if search term is empty
          if (!searchTerm || searchTerm.trim() === '') {
            issues.push({
              careerId: career.id,
              careerTitle: career.title_fi,
              issueType: 'DUUNITORI_EMPTY_HAKU',
              details: 'Duunitori link has empty ?haku= parameter',
              link
            });
          }

          // Check if search term seems wrong for the career
          const careerWords = career.title_fi.toLowerCase().split(/\s+/);
          const searchWords = searchTerm.toLowerCase().split(/\s+/);

          // Flag if search term doesn't match career at all
          const hasMatch = careerWords.some(cw =>
            searchWords.some(sw => sw.includes(cw) || cw.includes(sw))
          );

          if (!hasMatch && searchTerm.toLowerCase() !== career.title_fi.toLowerCase()) {
            issues.push({
              careerId: career.id,
              careerTitle: career.title_fi,
              issueType: 'DUUNITORI_MISMATCHED_SEARCH',
              details: `Search term "${searchTerm}" doesn't match career "${career.title_fi}"`,
              link
            });
          }
        }
      }
    }
  }

  // Check for careers with NO Duunitori link
  const hasDuunitori = career.useful_links.some(l => l.url.includes('duunitori.fi'));
  if (!hasDuunitori) {
    issues.push({
      careerId: career.id,
      careerTitle: career.title_fi,
      issueType: 'NO_DUUNITORI_LINK',
      details: 'Career has no Duunitori job search link'
    });
  }

  // Check for careers with NO Opintopolku link
  const hasOpintopolku = career.useful_links.some(l => l.url.includes('opintopolku.fi'));
  if (!hasOpintopolku) {
    issues.push({
      careerId: career.id,
      careerTitle: career.title_fi,
      issueType: 'NO_OPINTOPOLKU_LINK',
      details: 'Career has no Opintopolku education link'
    });
  }

  // Check for empty useful_links array
  if (career.useful_links.length === 0) {
    issues.push({
      careerId: career.id,
      careerTitle: career.title_fi,
      issueType: 'NO_LINKS_AT_ALL',
      details: 'Career has no useful links at all'
    });
  }
}

// Group issues by type
const issuesByType = new Map<string, Issue[]>();
for (const issue of issues) {
  if (!issuesByType.has(issue.issueType)) {
    issuesByType.set(issue.issueType, []);
  }
  issuesByType.get(issue.issueType)!.push(issue);
}

// Output summary
console.log(`Total careers: ${data.careers.length}`);
console.log(`Total issues found: ${issues.length}\n`);

issuesByType.forEach((typeIssues, type) => {
  console.log('─────────────────────────────────────────────────────────────────────────');
  console.log(`${type} (${typeIssues.length} issues)`);
  console.log('─────────────────────────────────────────────────────────────────────────');

  for (const issue of typeIssues.slice(0, 50)) { // Limit output
    console.log(`  [${issue.careerId}] ${issue.careerTitle}`);
    console.log(`    ${issue.details}`);
    if (issue.link) {
      console.log(`    URL: ${issue.link.url}`);
    }
    console.log('');
  }

  if (typeIssues.length > 50) {
    console.log(`  ... and ${typeIssues.length - 50} more\n`);
  }
});

// Save detailed report
const report = {
  totalCareers: data.careers.length,
  totalIssues: issues.length,
  issuesByType: Object.fromEntries(
    Array.from(issuesByType.entries()).map(([type, typeIssues]) => [
      type,
      {
        count: typeIssues.length,
        issues: typeIssues
      }
    ])
  ),
  allIssues: issues
};

fs.writeFileSync(
  path.join(__dirname, '..', 'comprehensive-link-audit.json'),
  JSON.stringify(report, null, 2)
);

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('Detailed report saved to comprehensive-link-audit.json');
