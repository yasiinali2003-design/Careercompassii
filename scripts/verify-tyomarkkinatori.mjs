/**
 * Verify Työmarkkinatori links work correctly
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

async function checkLink(career, link) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(link.url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'fi-FI,fi;q=0.9'
      },
      redirect: 'follow'
    });

    clearTimeout(timeout);

    const finalUrl = response.url;

    if (!response.ok) {
      return { ok: false, error: `HTTP ${response.status}`, finalUrl };
    }

    const body = await response.text();

    // Check if we were redirected to main page instead of career-specific page
    if (finalUrl === 'https://tyomarkkinatori.fi/' ||
        finalUrl === 'https://tyomarkkinatori.fi/henkiloasiakkaat/' ||
        finalUrl === 'https://tyomarkkinatori.fi/henkiloasiakkaat/ammattitieto/') {
      return { ok: false, error: 'Redirected to main page', finalUrl };
    }

    // Check for 404 content
    const is404 = body.includes('Sivua ei löydy') ||
                  body.includes('404') ||
                  body.includes('ei löytynyt');

    if (is404) {
      return { ok: false, error: '404 - Page not found', finalUrl };
    }

    // Extract career name from URL for validation
    const urlParts = link.url.split('/');
    const expectedCareer = urlParts[urlParts.length - 1];

    // Check if the page has career-specific content
    const hasCareerContent = body.includes('ammatti') ||
                            body.includes('Työtehtävät') ||
                            body.includes('Koulutus') ||
                            body.includes(career.title_fi);

    if (!hasCareerContent) {
      return { ok: false, error: 'No career content found', finalUrl };
    }

    return { ok: true, finalUrl };

  } catch (err) {
    clearTimeout(timeout);
    return { ok: false, error: err.name === 'AbortError' ? 'Timeout' : err.message };
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log('          VERIFYING TYÖMARKKINATORI LINKS');
  console.log('═══════════════════════════════════════════════════════════════════════\n');

  const careers = data.careers;

  // Get all Työmarkkinatori links
  const tyomarkkinatoriLinks = [];
  for (const career of careers) {
    for (const link of career.useful_links) {
      if (link.url.includes('tyomarkkinatori.fi')) {
        tyomarkkinatoriLinks.push({ career, link });
      }
    }
  }

  console.log(`Total Työmarkkinatori links to verify: ${tyomarkkinatoriLinks.length}\n`);

  for (const { career, link } of tyomarkkinatoriLinks) {
    checked++;
    const result = await checkLink(career, link);

    if (result.ok) {
      working++;
      process.stdout.write('✓');
    } else {
      process.stdout.write('✗');
      issues.push({
        careerId: career.id,
        careerTitle: career.title_fi,
        linkName: link.name,
        url: link.url,
        error: result.error,
        finalUrl: result.finalUrl
      });
    }

    if (checked % 20 === 0) {
      console.log(` [${checked}/${tyomarkkinatoriLinks.length}]`);
    }

    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\n\n═══════════════════════════════════════════════════════════════════════════`);
  console.log('RESULTS');
  console.log('═══════════════════════════════════════════════════════════════════════════');

  console.log(`\nTotal Työmarkkinatori links: ${checked}`);
  console.log(`Working: ${working}`);
  console.log(`Issues: ${issues.length}`);

  if (issues.length > 0) {
    console.log('\n─────────────────────────────────────────────────────────────────────────');
    console.log('ISSUES FOUND:');
    console.log('─────────────────────────────────────────────────────────────────────────');
    for (const issue of issues) {
      console.log(`\n[${issue.careerId}] ${issue.careerTitle}`);
      console.log(`  URL: ${issue.url}`);
      console.log(`  Error: ${issue.error}`);
      if (issue.finalUrl && issue.finalUrl !== issue.url) {
        console.log(`  Redirected to: ${issue.finalUrl}`);
      }
    }
  }

  // Save results
  fs.writeFileSync(
    path.join(__dirname, '..', 'tyomarkkinatori-verification.json'),
    JSON.stringify({
      total: checked,
      working,
      issues: issues.length,
      issuesList: issues
    }, null, 2)
  );

  console.log('\n\nResults saved to tyomarkkinatori-verification.json');
}

main().catch(console.error);
