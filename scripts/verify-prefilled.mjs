/**
 * Verify that Duunitori links are actually prefilled with search terms
 * This checks the actual page content to confirm the search box has the term
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
let prefilled = 0;

async function checkDuunitoriPrefilled(career, link) {
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

    if (!response.ok) {
      return { prefilled: false, error: `HTTP ${response.status}` };
    }

    const body = await response.text();

    // Get the search term from URL
    const hakuMatch = link.url.match(/\?haku=([^&]+)/);
    if (!hakuMatch) {
      return { prefilled: false, error: 'No haku parameter' };
    }

    const searchTerm = decodeURIComponent(hakuMatch[1]);

    // Check multiple indicators that the search is prefilled:

    // 1. Check if the search term appears in the page title
    const titleMatch = body.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : '';
    const titleHasSearch = title.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Check for the search input with the value
    const inputValueMatch = body.match(/value=["']([^"']*?)["'][^>]*id=["']search/i) ||
                           body.match(/id=["']search[^>]*value=["']([^"']*?)["']/i);
    const inputHasValue = inputValueMatch && inputValueMatch[1].toLowerCase().includes(searchTerm.toLowerCase());

    // 3. Check for results count (indicates search was executed)
    const resultsMatch = body.match(/Löysimme\s+(?:<b>)?(\d[\d\s]*)(?:<\/b>)?\s+työpaikkaa/i);
    const noResultsMatch = body.match(/Emme löytäneet/i);
    const hasResults = resultsMatch || noResultsMatch;

    // 4. Check if URL contains the search term in the rendered page
    const urlInPage = body.includes(`haku=${hakuMatch[1]}`);

    // 5. Check for search query in JavaScript variables
    const jsSearchMatch = body.match(/searchQuery["']?\s*[:=]\s*["']([^"']+)["']/i) ||
                         body.match(/SEARCH_QUERY["']?\s*[:=]\s*["']([^"']+)["']/i);
    const jsHasSearch = jsSearchMatch && jsSearchMatch[1].toLowerCase().includes(searchTerm.toLowerCase());

    // 6. Check for the search term in breadcrumbs or h1
    const h1Match = body.match(/<h1[^>]*>([^<]+)</i);
    const h1HasSearch = h1Match && h1Match[1].toLowerCase().includes(searchTerm.toLowerCase());

    // Consider it prefilled if ANY of these indicators are true
    const isPrefilled = titleHasSearch || inputHasValue || hasResults || jsHasSearch || h1HasSearch;

    // Get result count for reporting
    let resultCount = 0;
    if (resultsMatch) {
      resultCount = parseInt(resultsMatch[1].replace(/\s/g, ''));
    }

    if (!isPrefilled) {
      return {
        prefilled: false,
        error: 'Search not prefilled',
        searchTerm,
        indicators: {
          titleHasSearch,
          inputHasValue,
          hasResults,
          urlInPage,
          jsHasSearch,
          h1HasSearch
        }
      };
    }

    if (noResultsMatch || resultCount === 0) {
      return {
        prefilled: true,
        zeroResults: true,
        searchTerm,
        resultCount: 0
      };
    }

    return {
      prefilled: true,
      resultCount,
      searchTerm
    };

  } catch (err) {
    clearTimeout(timeout);
    return { prefilled: false, error: err.name === 'AbortError' ? 'Timeout' : err.message };
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log('          VERIFYING DUUNITORI LINKS ARE PREFILLED');
  console.log('═══════════════════════════════════════════════════════════════════════\n');

  const careers = data.careers;

  // Get all Duunitori links
  const duunitoriLinks = [];
  for (const career of careers) {
    for (const link of career.useful_links) {
      if (link.url.includes('duunitori.fi') && link.url.includes('?haku=')) {
        duunitoriLinks.push({ career, link });
      }
    }
  }

  console.log(`Total Duunitori links to verify: ${duunitoriLinks.length}\n`);
  console.log('Checking each link for prefilled search...\n');

  for (const { career, link } of duunitoriLinks) {
    checked++;
    const result = await checkDuunitoriPrefilled(career, link);

    if (result.prefilled) {
      prefilled++;
      if (result.zeroResults) {
        process.stdout.write('0');
        issues.push({
          careerId: career.id,
          careerTitle: career.title_fi,
          linkName: link.name,
          url: link.url,
          issue: 'zero_results',
          searchTerm: result.searchTerm
        });
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
        issue: 'not_prefilled',
        error: result.error,
        searchTerm: result.searchTerm,
        indicators: result.indicators
      });
    }

    if (checked % 50 === 0) {
      console.log(` [${checked}/${duunitoriLinks.length}]`);
    }

    // Delay between requests
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\n\n═══════════════════════════════════════════════════════════════════════════`);
  console.log('RESULTS');
  console.log('═══════════════════════════════════════════════════════════════════════════');

  const notPrefilled = issues.filter(i => i.issue === 'not_prefilled');
  const zeroResults = issues.filter(i => i.issue === 'zero_results');

  console.log(`\nTotal Duunitori links: ${checked}`);
  console.log(`Prefilled correctly: ${prefilled - zeroResults.length}`);
  console.log(`Prefilled but 0 results: ${zeroResults.length}`);
  console.log(`NOT prefilled: ${notPrefilled.length}`);

  if (notPrefilled.length > 0) {
    console.log('\n─────────────────────────────────────────────────────────────────────────');
    console.log('LINKS NOT PREFILLED (need fixing):');
    console.log('─────────────────────────────────────────────────────────────────────────');
    for (const issue of notPrefilled) {
      console.log(`\n[${issue.careerId}] ${issue.careerTitle}`);
      console.log(`  Search term: "${issue.searchTerm}"`);
      console.log(`  URL: ${issue.url}`);
      console.log(`  Error: ${issue.error}`);
    }
  }

  if (zeroResults.length > 0) {
    console.log('\n─────────────────────────────────────────────────────────────────────────');
    console.log('LINKS WITH 0 RESULTS:');
    console.log('─────────────────────────────────────────────────────────────────────────');
    for (const issue of zeroResults) {
      console.log(`  [${issue.careerId}] ${issue.careerTitle} - "${issue.searchTerm}"`);
    }
  }

  // Save results
  fs.writeFileSync(
    path.join(__dirname, '..', 'prefill-verification.json'),
    JSON.stringify({
      total: checked,
      prefilled: prefilled - zeroResults.length,
      zeroResults: zeroResults.length,
      notPrefilled: notPrefilled.length,
      issues
    }, null, 2)
  );

  console.log('\n\nResults saved to prefill-verification.json');
}

main().catch(console.error);
