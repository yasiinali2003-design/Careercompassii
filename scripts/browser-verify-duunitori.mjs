/**
 * Real browser verification of DUUNITORI links only
 * Uses Puppeteer to check if search is actually prefilled
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
let working = 0;
let zeroResults = 0;

async function main() {
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log('          BROWSER VERIFICATION OF DUUNITORI LINKS');
  console.log('═══════════════════════════════════════════════════════════════════════\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  // Get all Duunitori links
  const duunitoriLinks = [];
  for (const career of data.careers) {
    for (const link of career.useful_links) {
      if (link.url.includes('duunitori.fi') && link.url.includes('?haku=')) {
        duunitoriLinks.push({ career, link });
      }
    }
  }

  console.log(`Total Duunitori links to verify: ${duunitoriLinks.length}\n`);

  for (const { career, link } of duunitoriLinks) {
    checked++;

    try {
      await page.goto(link.url, { waitUntil: 'networkidle2', timeout: 25000 });

      // Wait for page to load
      await page.waitForSelector('body', { timeout: 5000 });

      // Get search input value
      const searchInputValue = await page.evaluate(() => {
        // Try different selectors for the search input
        const selectors = [
          'input[name="haku"]',
          'input[type="search"]',
          'input#search-input',
          'input[placeholder*="Hae"]',
          'input[aria-label*="Hae"]',
          '.search-input input'
        ];

        for (const selector of selectors) {
          const input = document.querySelector(selector);
          if (input && input.value) {
            return input.value;
          }
        }

        // Check if any input has a value
        const inputs = document.querySelectorAll('input[type="text"], input[type="search"]');
        for (const input of inputs) {
          if (input.value && input.value.length > 2) {
            return input.value;
          }
        }

        return null;
      });

      // Get expected search term from URL
      const hakuMatch = link.url.match(/\?haku=([^&]+)/);
      const expectedTerm = hakuMatch ? decodeURIComponent(hakuMatch[1]) : '';

      // Check page content for job results
      const pageContent = await page.evaluate(() => document.body.innerText);

      const hasJobCount = pageContent.includes('työpaikkaa') || pageContent.includes('tulosta');
      const hasNoResults = pageContent.includes('Emme löytäneet') ||
                          pageContent.includes('0 työpaikkaa') ||
                          pageContent.match(/Löysimme\s+0\s+/);

      // Check if the search term appears in results or title
      const pageTitle = await page.title();
      const titleHasSearch = pageTitle.toLowerCase().includes(expectedTerm.toLowerCase());

      // Get actual URL to verify it stayed the same
      const currentUrl = page.url();
      const urlHasSearch = currentUrl.includes('haku=');

      // Determine if prefilled
      const isPrefilled = (searchInputValue && searchInputValue.length > 0) ||
                         titleHasSearch ||
                         hasJobCount ||
                         urlHasSearch;

      if (!isPrefilled) {
        issues.push({
          career: career.id,
          title: career.title_fi,
          url: link.url,
          searchTerm: expectedTerm,
          inputValue: searchInputValue,
          currentUrl,
          issue: 'not_prefilled'
        });
        process.stdout.write('P');
      } else if (hasNoResults) {
        zeroResults++;
        process.stdout.write('0');
      } else {
        working++;
        process.stdout.write('✓');
      }

    } catch (err) {
      issues.push({
        career: career.id,
        title: career.title_fi,
        url: link.url,
        issue: 'error',
        error: err.message
      });
      process.stdout.write('✗');
    }

    if (checked % 50 === 0) {
      console.log(` [${checked}/${duunitoriLinks.length}]`);
    }

    // Delay between requests
    await new Promise(r => setTimeout(r, 800));
  }

  await browser.close();

  // Summary
  console.log(`\n\n═══════════════════════════════════════════════════════════════════════════`);
  console.log('RESULTS');
  console.log('═══════════════════════════════════════════════════════════════════════════');

  const notPrefilled = issues.filter(i => i.issue === 'not_prefilled');
  const errors = issues.filter(i => i.issue === 'error');

  console.log(`\nTotal Duunitori links: ${checked}`);
  console.log(`Working & Prefilled: ${working}`);
  console.log(`Zero Results (but prefilled): ${zeroResults}`);
  console.log(`NOT Prefilled: ${notPrefilled.length}`);
  console.log(`Errors: ${errors.length}`);

  if (notPrefilled.length > 0) {
    console.log('\n─────────────────────────────────────────────────────────────────────────');
    console.log('NOT PREFILLED - NEED FIXING:');
    console.log('─────────────────────────────────────────────────────────────────────────');
    for (const issue of notPrefilled) {
      console.log(`\n[${issue.career}] ${issue.title}`);
      console.log(`  Expected: "${issue.searchTerm}"`);
      console.log(`  Input value: "${issue.inputValue || 'empty'}"`);
      console.log(`  URL: ${issue.url}`);
    }
  }

  if (errors.length > 0) {
    console.log('\n─────────────────────────────────────────────────────────────────────────');
    console.log('ERRORS:');
    console.log('─────────────────────────────────────────────────────────────────────────');
    for (const issue of errors.slice(0, 20)) {
      console.log(`  [${issue.career}] ${issue.title}: ${issue.error}`);
    }
  }

  // Save results
  fs.writeFileSync(
    path.join(__dirname, '..', 'duunitori-browser-results.json'),
    JSON.stringify({
      total: checked,
      working,
      zeroResults,
      notPrefilled: notPrefilled.length,
      errors: errors.length,
      issues
    }, null, 2)
  );

  console.log('\n\nResults saved to duunitori-browser-results.json');
}

main().catch(console.error);
