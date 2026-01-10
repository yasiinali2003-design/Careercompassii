/**
 * Real browser-based verification of ALL career links
 * Uses Puppeteer to actually load pages and check content
 */

import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '..', 'all-career-links.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const issues = [];
let checked = 0;

async function verifyDuunitoriLink(page, career, link) {
  try {
    await page.goto(link.url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for the search results to load
    await page.waitForSelector('body', { timeout: 5000 });

    // Get the search input value
    const searchInputValue = await page.evaluate(() => {
      const input = document.querySelector('input[type="search"], input[name="haku"], input#search-input, input[placeholder*="Hae"]');
      return input ? input.value : null;
    });

    // Get the URL's haku parameter
    const hakuMatch = link.url.match(/\?haku=([^&]+)/);
    const expectedTerm = hakuMatch ? decodeURIComponent(hakuMatch[1]) : '';

    // Check if prefilled
    const isPrefilled = searchInputValue && searchInputValue.length > 0;

    // Check for results
    const pageContent = await page.content();
    const hasResults = pageContent.includes('työpaikkaa') || pageContent.includes('tulosta');
    const noResults = pageContent.includes('Emme löytäneet') || pageContent.includes('0 työpaikkaa');

    // Get result count
    const resultCount = await page.evaluate(() => {
      const resultText = document.body.innerText;
      const match = resultText.match(/Löysimme\s+(\d[\d\s]*)\s+työpaikkaa/i);
      if (match) return parseInt(match[1].replace(/\s/g, ''));
      return null;
    });

    if (!isPrefilled && !hasResults) {
      return {
        ok: false,
        type: 'not_prefilled',
        searchTerm: expectedTerm,
        inputValue: searchInputValue
      };
    }

    if (noResults || resultCount === 0) {
      return {
        ok: true,
        type: 'zero_results',
        searchTerm: expectedTerm,
        resultCount: 0
      };
    }

    return {
      ok: true,
      type: 'working',
      searchTerm: expectedTerm,
      resultCount
    };

  } catch (err) {
    return { ok: false, type: 'error', error: err.message };
  }
}

async function verifyOpintopolkuLink(page, career, link) {
  try {
    await page.goto(link.url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for React app to load
    await page.waitForSelector('body', { timeout: 10000 });
    await new Promise(r => setTimeout(r, 3000)); // Extra wait for SPA

    // Get the search term from URL
    const hakuMatch = link.url.match(/\/haku\/([^?#]+)/);
    const expectedTerm = hakuMatch ? decodeURIComponent(hakuMatch[1]) : '';

    // Check if search input has value
    const searchInputValue = await page.evaluate(() => {
      const input = document.querySelector('input[type="search"], input[type="text"]');
      return input ? input.value : null;
    });

    // Check URL didn't redirect to main page
    const currentUrl = page.url();
    const redirectedToMain = currentUrl === 'https://opintopolku.fi/konfo/fi/' ||
                            !currentUrl.includes('/haku/');

    if (redirectedToMain) {
      return {
        ok: false,
        type: 'redirected',
        searchTerm: expectedTerm,
        redirectedTo: currentUrl
      };
    }

    // Check for search results in the page
    const pageText = await page.evaluate(() => document.body.innerText);
    const hasResults = pageText.includes('hakutulos') ||
                      pageText.includes('koulutus') ||
                      pageText.includes('tulosta');

    const isPrefilled = (searchInputValue && searchInputValue.length > 0) ||
                       currentUrl.includes(encodeURIComponent(expectedTerm)) ||
                       hasResults;

    if (!isPrefilled) {
      return {
        ok: false,
        type: 'not_prefilled',
        searchTerm: expectedTerm,
        inputValue: searchInputValue
      };
    }

    return { ok: true, type: 'working', searchTerm: expectedTerm };

  } catch (err) {
    return { ok: false, type: 'error', error: err.message };
  }
}

async function verifyTyomarkkinatoriLink(page, career, link) {
  try {
    await page.goto(link.url, { waitUntil: 'networkidle2', timeout: 30000 });

    const currentUrl = page.url();

    // Check if redirected to main page
    if (currentUrl === 'https://tyomarkkinatori.fi/' ||
        currentUrl === 'https://tyomarkkinatori.fi/henkiloasiakkaat/') {
      return {
        ok: false,
        type: 'redirected',
        redirectedTo: currentUrl
      };
    }

    // Check for career content
    const pageText = await page.evaluate(() => document.body.innerText);
    const hasContent = pageText.includes('Ammatti') ||
                      pageText.includes('Työtehtävät') ||
                      pageText.includes('Koulutus');

    if (!hasContent) {
      return {
        ok: false,
        type: 'no_content',
        url: currentUrl
      };
    }

    return { ok: true, type: 'working' };

  } catch (err) {
    return { ok: false, type: 'error', error: err.message };
  }
}

async function verifyOtherLink(page, career, link) {
  try {
    const response = await page.goto(link.url, { waitUntil: 'domcontentloaded', timeout: 20000 });

    if (!response || response.status() >= 400) {
      return {
        ok: false,
        type: 'http_error',
        status: response ? response.status() : 'no response'
      };
    }

    return { ok: true, type: 'working' };

  } catch (err) {
    return { ok: false, type: 'error', error: err.message };
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log('          REAL BROWSER VERIFICATION OF ALL LINKS');
  console.log('═══════════════════════════════════════════════════════════════════════\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  const careers = data.careers;
  let totalLinks = 0;
  careers.forEach(c => totalLinks += c.useful_links.length);

  console.log(`Total careers: ${careers.length}`);
  console.log(`Total links to verify: ${totalLinks}\n`);

  const results = {
    duunitori: { total: 0, working: 0, notPrefilled: [], zeroResults: [], errors: [] },
    opintopolku: { total: 0, working: 0, notPrefilled: [], redirected: [], errors: [] },
    tyomarkkinatori: { total: 0, working: 0, issues: [] },
    other: { total: 0, working: 0, issues: [] }
  };

  for (const career of careers) {
    for (const link of career.useful_links) {
      checked++;
      let result;
      let category;

      if (link.url.includes('duunitori.fi')) {
        category = 'duunitori';
        results.duunitori.total++;
        result = await verifyDuunitoriLink(page, career, link);

        if (result.ok) {
          if (result.type === 'zero_results') {
            results.duunitori.zeroResults.push({ career: career.id, title: career.title_fi, searchTerm: result.searchTerm });
            process.stdout.write('0');
          } else {
            results.duunitori.working++;
            process.stdout.write('✓');
          }
        } else {
          if (result.type === 'not_prefilled') {
            results.duunitori.notPrefilled.push({
              career: career.id,
              title: career.title_fi,
              url: link.url,
              searchTerm: result.searchTerm,
              inputValue: result.inputValue
            });
            process.stdout.write('P');
          } else {
            results.duunitori.errors.push({ career: career.id, title: career.title_fi, error: result.error });
            process.stdout.write('✗');
          }
        }

      } else if (link.url.includes('opintopolku.fi')) {
        category = 'opintopolku';
        results.opintopolku.total++;
        result = await verifyOpintopolkuLink(page, career, link);

        if (result.ok) {
          results.opintopolku.working++;
          process.stdout.write('✓');
        } else {
          if (result.type === 'not_prefilled') {
            results.opintopolku.notPrefilled.push({
              career: career.id,
              title: career.title_fi,
              url: link.url,
              searchTerm: result.searchTerm
            });
            process.stdout.write('P');
          } else if (result.type === 'redirected') {
            results.opintopolku.redirected.push({
              career: career.id,
              title: career.title_fi,
              url: link.url,
              redirectedTo: result.redirectedTo
            });
            process.stdout.write('R');
          } else {
            results.opintopolku.errors.push({ career: career.id, title: career.title_fi, error: result.error });
            process.stdout.write('✗');
          }
        }

      } else if (link.url.includes('tyomarkkinatori.fi')) {
        category = 'tyomarkkinatori';
        results.tyomarkkinatori.total++;
        result = await verifyTyomarkkinatoriLink(page, career, link);

        if (result.ok) {
          results.tyomarkkinatori.working++;
          process.stdout.write('✓');
        } else {
          results.tyomarkkinatori.issues.push({ career: career.id, title: career.title_fi, url: link.url, ...result });
          process.stdout.write('✗');
        }

      } else {
        category = 'other';
        results.other.total++;
        result = await verifyOtherLink(page, career, link);

        if (result.ok) {
          results.other.working++;
          process.stdout.write('✓');
        } else {
          results.other.issues.push({ career: career.id, title: career.title_fi, url: link.url, name: link.name, ...result });
          process.stdout.write('✗');
        }
      }

      if (checked % 50 === 0) {
        console.log(` [${checked}/${totalLinks}]`);
      }

      // Small delay between requests
      await new Promise(r => setTimeout(r, 500));
    }
  }

  await browser.close();

  // Print summary
  console.log(`\n\n═══════════════════════════════════════════════════════════════════════════`);
  console.log('VERIFICATION RESULTS');
  console.log('═══════════════════════════════════════════════════════════════════════════\n');

  console.log('DUUNITORI:');
  console.log(`  Total: ${results.duunitori.total}`);
  console.log(`  Working & Prefilled: ${results.duunitori.working}`);
  console.log(`  Zero Results: ${results.duunitori.zeroResults.length}`);
  console.log(`  NOT Prefilled: ${results.duunitori.notPrefilled.length}`);
  console.log(`  Errors: ${results.duunitori.errors.length}`);

  console.log('\nOPINTOPOLKU:');
  console.log(`  Total: ${results.opintopolku.total}`);
  console.log(`  Working: ${results.opintopolku.working}`);
  console.log(`  NOT Prefilled: ${results.opintopolku.notPrefilled.length}`);
  console.log(`  Redirected: ${results.opintopolku.redirected.length}`);
  console.log(`  Errors: ${results.opintopolku.errors.length}`);

  console.log('\nTYÖMARKKINATORI:');
  console.log(`  Total: ${results.tyomarkkinatori.total}`);
  console.log(`  Working: ${results.tyomarkkinatori.working}`);
  console.log(`  Issues: ${results.tyomarkkinatori.issues.length}`);

  console.log('\nOTHER:');
  console.log(`  Total: ${results.other.total}`);
  console.log(`  Working: ${results.other.working}`);
  console.log(`  Issues: ${results.other.issues.length}`);

  // Print issues
  if (results.duunitori.notPrefilled.length > 0) {
    console.log('\n─────────────────────────────────────────────────────────────────────────');
    console.log('DUUNITORI - NOT PREFILLED:');
    console.log('─────────────────────────────────────────────────────────────────────────');
    for (const issue of results.duunitori.notPrefilled) {
      console.log(`  [${issue.career}] ${issue.title}`);
      console.log(`    Expected: "${issue.searchTerm}"`);
      console.log(`    Got: "${issue.inputValue || 'empty'}"`);
      console.log(`    URL: ${issue.url}`);
    }
  }

  if (results.opintopolku.notPrefilled.length > 0) {
    console.log('\n─────────────────────────────────────────────────────────────────────────');
    console.log('OPINTOPOLKU - NOT PREFILLED:');
    console.log('─────────────────────────────────────────────────────────────────────────');
    for (const issue of results.opintopolku.notPrefilled) {
      console.log(`  [${issue.career}] ${issue.title}`);
      console.log(`    Search term: "${issue.searchTerm}"`);
      console.log(`    URL: ${issue.url}`);
    }
  }

  if (results.opintopolku.redirected.length > 0) {
    console.log('\n─────────────────────────────────────────────────────────────────────────');
    console.log('OPINTOPOLKU - REDIRECTED TO MAIN PAGE:');
    console.log('─────────────────────────────────────────────────────────────────────────');
    for (const issue of results.opintopolku.redirected) {
      console.log(`  [${issue.career}] ${issue.title}`);
      console.log(`    URL: ${issue.url}`);
      console.log(`    Redirected to: ${issue.redirectedTo}`);
    }
  }

  if (results.other.issues.length > 0) {
    console.log('\n─────────────────────────────────────────────────────────────────────────');
    console.log('OTHER LINKS - ISSUES:');
    console.log('─────────────────────────────────────────────────────────────────────────');
    for (const issue of results.other.issues) {
      console.log(`  [${issue.career}] ${issue.title}`);
      console.log(`    Link: ${issue.name}`);
      console.log(`    URL: ${issue.url}`);
      console.log(`    Error: ${issue.error || issue.type}`);
    }
  }

  // Save results
  fs.writeFileSync(
    path.join(__dirname, '..', 'browser-verification-results.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('\n\nResults saved to browser-verification-results.json');
}

main().catch(console.error);
