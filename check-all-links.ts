/**
 * Check all links for potential issues
 */

import { careersData } from './data/careers-fi';

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('          COMPREHENSIVE LINK CHECK');
console.log('═══════════════════════════════════════════════════════════════════════\n');

interface LinkIssue {
  careerId: string;
  careerTitle: string;
  linkName: string;
  url: string;
  issue: string;
}

const issues: LinkIssue[] = [];

// Check all links
careersData.forEach(career => {
  if (!career.useful_links || !Array.isArray(career.useful_links)) return;

  career.useful_links.forEach((link: any) => {
    if (!link.url || !link.name) {
      issues.push({
        careerId: career.id,
        careerTitle: career.title_fi,
        linkName: link.name || 'MISSING NAME',
        url: link.url || 'MISSING URL',
        issue: 'Missing name or URL'
      });
      return;
    }

    // Check for common issues
    const url = link.url;

    // 1. Check for placeholder/fake domains
    const fakeDomains = [
      'example.com',
      'placeholder',
      'test.com',
      'localhost',
    ];
    if (fakeDomains.some(d => url.includes(d))) {
      issues.push({
        careerId: career.id,
        careerTitle: career.title_fi,
        linkName: link.name,
        url: url,
        issue: 'Placeholder/fake domain'
      });
    }

    // 2. Check for suspicious Finnish domains that might not exist
    const suspiciousDomains = [
      'sosiaalityontyekijat.fi',
      'perhetyontyekijat.fi',
      'vanhustenhoitajat.fi',
      'kriisityontyekijat.fi',
      'ymparistoinsinoorit.fi',
      'kestavankehityksen.fi',
      'strategia.fi',
      'innovaatio.fi',
      'tulevaisuudensuunnittelu.fi',
      'digitaalinenmuutos.fi',
      'tulevaisuudentutkimus.fi',
      'strateginensuunnittelu.fi',
      'tulevaisuudenvisio.fi',
      'tulevaisuudenteknologia.fi',
      'tulevaisuudenyhteiskunta.fi',
      'tapahtumienjarjestaminen.fi',
      'toimistosihteerit.fi',
      'henkilostohallinto.fi',
      'laadunhallinto.fi',
      'tietohallinto.fi',
      'henkilostojohtaminen.fi',
      'tuotantotalous.fi',
      'tietoturva.fi',
      'laadunhallinta.fi',
      'kehitysjohtaminen.fi',
      'datasciencefinland.fi',
      'peliala.fi',
      'robotiikka.fi',
      'biotekniikka.fi',
      'nanotekniikka.fi',
      'kvanttiteknologia.fi',
      'blockchainfinland.fi',
      'vrfinland.fi',
      'automaatio.fi',
      'kuntoutusohjaajat.fi',
      'asiakaspalvelu.fi',
    ];

    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace('www.', '');

      if (suspiciousDomains.includes(domain)) {
        issues.push({
          careerId: career.id,
          careerTitle: career.title_fi,
          linkName: link.name,
          url: url,
          issue: 'Suspicious/potentially fake domain'
        });
      }
    } catch (e) {
      issues.push({
        careerId: career.id,
        careerTitle: career.title_fi,
        linkName: link.name,
        url: url,
        issue: 'Invalid URL format'
      });
    }

    // 3. Check for typos in common domains
    const typoPatterns = [
      { wrong: 'opintopolku.f/', correct: 'opintopolku.fi' },
      { wrong: 'duunitori.f/', correct: 'duunitori.fi' },
      { wrong: 'ammattinetti.f/', correct: 'ammattinetti.fi' },
    ];

    typoPatterns.forEach(p => {
      if (url.includes(p.wrong)) {
        issues.push({
          careerId: career.id,
          careerTitle: career.title_fi,
          linkName: link.name,
          url: url,
          issue: `Typo in domain: ${p.wrong}`
        });
      }
    });
  });
});

console.log(`Total issues found: ${issues.length}\n`);

// Group by issue type
const byIssue: Record<string, LinkIssue[]> = {};
issues.forEach(i => {
  if (!byIssue[i.issue]) byIssue[i.issue] = [];
  byIssue[i.issue].push(i);
});

Object.entries(byIssue).forEach(([issue, items]) => {
  console.log(`\n${issue}: ${items.length} occurrences`);
  items.slice(0, 10).forEach(item => {
    console.log(`  - ${item.careerTitle}: ${item.url}`);
  });
  if (items.length > 10) {
    console.log(`  ... and ${items.length - 10} more`);
  }
});

// List all unique suspicious domains
console.log('\n═══════════════════════════════════════════════════════════════════════');
console.log('          SUSPICIOUS DOMAINS FOUND');
console.log('═══════════════════════════════════════════════════════════════════════\n');

const suspiciousDomainsFound = new Set<string>();
issues.filter(i => i.issue === 'Suspicious/potentially fake domain').forEach(i => {
  try {
    const domain = new URL(i.url).hostname.replace('www.', '');
    suspiciousDomainsFound.add(domain);
  } catch (e) {}
});

suspiciousDomainsFound.forEach(d => console.log(`  ${d}`));
