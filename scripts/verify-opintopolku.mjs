/**
 * Verify that Opintopolku links are properly prefilled and show search results
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '..', 'all-career-links.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const issues = [];
let checked = 0;
let working = 0;

async function checkOpintopolkuLink(career, link) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(link.url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'fi-FI,fi;q=0.9'
      },
      redirect: 'follow'
    });

    clearTimeout(timeout);

    // Check final URL after redirects
    const finalUrl = response.url;

    if (!response.ok) {
      return { ok: false, error: `HTTP ${response.status}` };
    }

    const body = await response.text();

    // Get the search term from URL
    const hakuMatch = link.url.match(/\/haku\/([^?#]+)/);
    if (!hakuMatch) {
      return { ok: false, error: 'No search term in URL' };
    }

    const searchTerm = decodeURIComponent(hakuMatch[1]);

    // Check if we were redirected to main page (not search page)
    if (finalUrl === 'https://opintopolku.fi/konfo/fi/' ||
        finalUrl === 'https://opintopolku.fi/konfo/fi' ||
        !finalUrl.includes('/haku/')) {
      return {
        ok: false,
        error: 'Redirected to main page',
        searchTerm,
        finalUrl
      };
    }

    // Check for search results in the page
    const hasResults = body.includes('hakutulos') ||
                      body.includes('tulosta') ||
                      body.includes('koulutus') ||
                      body.match(/\d+\s+tulosta/i);

    // Check if search term appears in page content
    const pageHasSearchTerm = body.toLowerCase().includes(searchTerm.toLowerCase());

    // Check page title
    const titleMatch = body.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : '';
    const titleHasSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          title.includes('Haku');

    // Check for "no results" indicators
    const noResults = body.includes('Ei hakutuloksia') ||
                     body.includes('Hakuehdoilla ei löytynyt') ||
                     body.match(/0\s+tulosta/i);

    if (noResults) {
      return {
        ok: true,
        zeroResults: true,
        searchTerm
      };
    }

    // Consider it working if any indicator is positive
    const isWorking = hasResults || pageHasSearchTerm || titleHasSearch;

    if (!isWorking) {
      return {
        ok: false,
        error: 'Search may not be prefilled',
        searchTerm,
        finalUrl
      };
    }

    return { ok: true, searchTerm };

  } catch (err) {
    clearTimeout(timeout);
    return { ok: false, error: err.name === 'AbortError' ? 'Timeout' : err.message };
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log('          VERIFYING OPINTOPOLKU LINKS');
  console.log('═══════════════════════════════════════════════════════════════════════\n');

  const careers = data.careers;

  // Get all Opintopolku links
  const opintopolkuLinks = [];
  for (const career of careers) {
    for (const link of career.useful_links) {
      if (link.url.includes('opintopolku.fi/konfo/fi/haku/')) {
        opintopolkuLinks.push({ career, link });
      }
    }
  }

  console.log(`Total Opintopolku links to verify: ${opintopolkuLinks.length}\n`);
  console.log('Checking each link...\n');

  for (const { career, link } of opintopolkuLinks) {
    checked++;
    const result = await checkOpintopolkuLink(career, link);

    if (result.ok) {
      working++;
      if (result.zeroResults) {
        process.stdout.write('0');
      } else {
        process.stdout.write('✓');
      }
    } else {
      process.stdout.write('✗');
      issues.push({
        careerId: career.id,
        careerTitle: career.title_fi,
        linkName: link.name,
        url: link.url,
        error: result.error,
        searchTerm: result.searchTerm,
        finalUrl: result.finalUrl
      });
    }

    if (checked % 50 === 0) {
      console.log(` [${checked}/${opintopolkuLinks.length}]`);
    }

    // Delay between requests
    await new Promise(r => setTimeout(r, 150));
  }

  console.log(`\n\n═══════════════════════════════════════════════════════════════════════════`);
  console.log('RESULTS');
  console.log('═══════════════════════════════════════════════════════════════════════════');

  console.log(`\nTotal Opintopolku links: ${checked}`);
  console.log(`Working: ${working}`);
  console.log(`Issues: ${issues.length}`);

  if (issues.length > 0) {
    console.log('\n─────────────────────────────────────────────────────────────────────────');
    console.log('ISSUES FOUND:');
    console.log('─────────────────────────────────────────────────────────────────────────');
    for (const issue of issues) {
      console.log(`\n[${issue.careerId}] ${issue.careerTitle}`);
      console.log(`  Search term: "${issue.searchTerm}"`);
      console.log(`  URL: ${issue.url}`);
      console.log(`  Error: ${issue.error}`);
      if (issue.finalUrl) {
        console.log(`  Final URL: ${issue.finalUrl}`);
      }
    }
  }

  // Save results
  fs.writeFileSync(
    path.join(__dirname, '..', 'opintopolku-verification.json'),
    JSON.stringify({
      total: checked,
      working,
      issues: issues.length,
      issuesList: issues
    }, null, 2)
  );

  console.log('\n\nResults saved to opintopolku-verification.json');
}

main().catch(console.error);
