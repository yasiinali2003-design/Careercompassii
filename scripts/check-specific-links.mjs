/**
 * Check specific Duunitori links and take screenshots
 */

import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '..', 'all-career-links.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

async function main() {
  console.log('Checking Duunitori links in real browser...\n');

  const browser = await puppeteer.launch({
    headless: false, // Show browser
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  // Get first 10 Duunitori links to check
  const duunitoriLinks = [];
  for (const career of data.careers) {
    for (const link of career.useful_links) {
      if (link.url.includes('duunitori.fi') && link.url.includes('?haku=')) {
        duunitoriLinks.push({ career, link });
        if (duunitoriLinks.length >= 15) break;
      }
    }
    if (duunitoriLinks.length >= 15) break;
  }

  console.log(`Checking ${duunitoriLinks.length} links:\n`);

  for (let i = 0; i < duunitoriLinks.length; i++) {
    const { career, link } = duunitoriLinks[i];
    const hakuMatch = link.url.match(/\?haku=([^&]+)/);
    const searchTerm = hakuMatch ? decodeURIComponent(hakuMatch[1]) : '';

    console.log(`\n${i + 1}. [${career.id}] ${career.title_fi}`);
    console.log(`   Expected search: "${searchTerm}"`);
    console.log(`   URL: ${link.url}`);

    try {
      await page.goto(link.url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 2000)); // Wait for JS

      // Check the actual URL after navigation
      const currentUrl = page.url();
      console.log(`   Current URL: ${currentUrl}`);

      // Check if search input has value
      const inputValue = await page.evaluate(() => {
        const inputs = document.querySelectorAll('input');
        for (const input of inputs) {
          if (input.value && input.value.length > 2) {
            return { selector: input.name || input.id || input.className, value: input.value };
          }
        }
        return null;
      });

      if (inputValue) {
        console.log(`   Input value: "${inputValue.value}" (${inputValue.selector})`);
      } else {
        console.log(`   Input value: EMPTY or not found`);
      }

      // Check for results text
      const resultsText = await page.evaluate(() => {
        const text = document.body.innerText;
        const match = text.match(/Löysimme\s+(\d[\d\s]*)\s+työpaikkaa/i);
        if (match) return `Found: ${match[1]} jobs`;
        if (text.includes('Emme löytäneet')) return 'No results found';
        return 'Unknown';
      });
      console.log(`   Results: ${resultsText}`);

      // Take screenshot
      await page.screenshot({ path: path.join(__dirname, '..', `screenshot-${i + 1}-${career.id}.png`) });
      console.log(`   Screenshot saved: screenshot-${i + 1}-${career.id}.png`);

    } catch (err) {
      console.log(`   ERROR: ${err.message}`);
    }

    await new Promise(r => setTimeout(r, 1000));
  }

  await browser.close();
  console.log('\n\nDone! Check the screenshots.');
}

main().catch(console.error);
