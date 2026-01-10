/**
 * Comprehensive link verification script
 * Tests ALL links in careers-fi.ts and reports broken ones
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

const filePath = path.join(__dirname, 'data', 'careers-fi.ts');
const content = fs.readFileSync(filePath, 'utf-8');

interface LinkInfo {
  careerId: string;
  name: string;
  url: string;
}

// Extract all links with their career context
function extractAllLinks(): LinkInfo[] {
  const links: LinkInfo[] = [];
  
  // Match career blocks
  const careerPattern = /\{\s*id:\s*"([^"]+)"[\s\S]*?useful_links:\s*\[([\s\S]*?)\]/g;
  let match;
  
  while ((match = careerPattern.exec(content)) !== null) {
    const careerId = match[1];
    const linksBlock = match[2];
    
    // Extract individual links
    const linkPattern = /\{\s*name:\s*"([^"]+)",\s*url:\s*"([^"]+)"\s*\}/g;
    let linkMatch;
    
    while ((linkMatch = linkPattern.exec(linksBlock)) !== null) {
      links.push({
        careerId,
        name: linkMatch[1],
        url: linkMatch[2]
      });
    }
  }
  
  return links;
}

// Check if a URL is accessible (returns HTTP status code)
async function checkUrl(url: string): Promise<{ status: number; error?: string; redirectUrl?: string }> {
  return new Promise((resolve) => {
    const timeout = 10000; // 10 second timeout
    
    try {
      const parsedUrl = new URL(url);
      const protocol = parsedUrl.protocol === 'https:' ? https : http;
      
      const req = protocol.request(url, {
        method: 'HEAD',
        timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          resolve({ status: res.statusCode, redirectUrl: res.headers.location });
        } else {
          resolve({ status: res.statusCode || 0 });
        }
      });
      
      req.on('error', (err: Error) => {
        resolve({ status: 0, error: err.message });
      });
      
      req.on('timeout', () => {
        req.destroy();
        resolve({ status: 0, error: 'Timeout' });
      });
      
      req.end();
    } catch (err: any) {
      resolve({ status: 0, error: err.message });
    }
  });
}

// Categorize links by domain
function categorizeLinks(links: LinkInfo[]): Map<string, LinkInfo[]> {
  const categories = new Map<string, LinkInfo[]>();
  
  for (const link of links) {
    try {
      const domain = new URL(link.url).hostname.replace('www.', '');
      if (!categories.has(domain)) {
        categories.set(domain, []);
      }
      categories.get(domain)!.push(link);
    } catch {
      if (!categories.has('invalid')) {
        categories.set('invalid', []);
      }
      categories.get('invalid')!.push(link);
    }
  }
  
  return categories;
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log('          COMPREHENSIVE LINK VERIFICATION');
  console.log('═══════════════════════════════════════════════════════════════════════\n');
  
  const allLinks = extractAllLinks();
  console.log(`Total links to verify: ${allLinks.length}\n`);
  
  const categories = categorizeLinks(allLinks);
  console.log('Links by domain:');
  const sortedCategories = Array.from(categories.entries()).sort((a, b) => b[1].length - a[1].length);
  for (const [domain, links] of sortedCategories.slice(0, 15)) {
    console.log(`  ${domain}: ${links.length}`);
  }
  console.log(`  ... and ${sortedCategories.length - 15} more domains\n`);
  
  // Get unique URLs to avoid checking duplicates
  const uniqueUrls = new Map<string, LinkInfo[]>();
  for (const link of allLinks) {
    if (!uniqueUrls.has(link.url)) {
      uniqueUrls.set(link.url, []);
    }
    uniqueUrls.get(link.url)!.push(link);
  }
  
  console.log(`Unique URLs to check: ${uniqueUrls.size}\n`);
  console.log('Starting verification (this will take several minutes)...\n');
  
  const brokenLinks: { url: string; careers: string[]; status: number; error?: string }[] = [];
  const redirectLinks: { url: string; careers: string[]; redirectUrl: string }[] = [];
  
  let checked = 0;
  const total = uniqueUrls.size;
  
  // Process in batches to avoid overwhelming servers
  const batchSize = 20;
  const urls = Array.from(uniqueUrls.entries());
  
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async ([url, links]) => {
        const result = await checkUrl(url);
        return { url, links, result };
      })
    );
    
    for (const { url, links, result } of results) {
      checked++;
      const careers = links.map(l => l.careerId);
      
      if (result.status === 0 || result.status >= 400) {
        brokenLinks.push({ url, careers, status: result.status, error: result.error });
        process.stdout.write(`✗`);
      } else if (result.redirectUrl) {
        redirectLinks.push({ url, careers, redirectUrl: result.redirectUrl });
        process.stdout.write(`→`);
      } else {
        process.stdout.write(`✓`);
      }
      
      if (checked % 50 === 0) {
        console.log(` [${checked}/${total}]`);
      }
    }
    
    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`\n\n${'═'.repeat(75)}`);
  console.log('VERIFICATION RESULTS');
  console.log('═'.repeat(75));
  
  console.log(`\nTotal URLs checked: ${checked}`);
  console.log(`Broken links: ${brokenLinks.length}`);
  console.log(`Redirect links: ${redirectLinks.length}`);
  
  if (brokenLinks.length > 0) {
    console.log('\n─────────────────────────────────────────────────────────────────────────');
    console.log('BROKEN LINKS (need fixing):');
    console.log('─────────────────────────────────────────────────────────────────────────');
    
    // Group by domain
    const brokenByDomain = new Map<string, typeof brokenLinks>();
    for (const link of brokenLinks) {
      try {
        const domain = new URL(link.url).hostname;
        if (!brokenByDomain.has(domain)) {
          brokenByDomain.set(domain, []);
        }
        brokenByDomain.get(domain)!.push(link);
      } catch {
        if (!brokenByDomain.has('invalid-url')) {
          brokenByDomain.set('invalid-url', []);
        }
        brokenByDomain.get('invalid-url')!.push(link);
      }
    }
    
    for (const [domain, links] of brokenByDomain) {
      console.log(`\n[${domain}] - ${links.length} broken:`);
      for (const link of links.slice(0, 10)) {
        console.log(`  Status ${link.status}: ${link.url}`);
        if (link.error) console.log(`    Error: ${link.error}`);
        console.log(`    Used in: ${link.careers.slice(0, 3).join(', ')}${link.careers.length > 3 ? '...' : ''}`);
      }
      if (links.length > 10) {
        console.log(`  ... and ${links.length - 10} more`);
      }
    }
  }
  
  if (redirectLinks.length > 0) {
    console.log('\n─────────────────────────────────────────────────────────────────────────');
    console.log('REDIRECT LINKS (should update to new URL):');
    console.log('─────────────────────────────────────────────────────────────────────────');
    
    for (const link of redirectLinks.slice(0, 20)) {
      console.log(`  ${link.url}`);
      console.log(`    → ${link.redirectUrl}`);
    }
    if (redirectLinks.length > 20) {
      console.log(`  ... and ${redirectLinks.length - 20} more`);
    }
  }
  
  // Save results to file for further processing
  const results = {
    total: checked,
    broken: brokenLinks,
    redirects: redirectLinks
  };
  
  fs.writeFileSync(
    path.join(__dirname, 'link-verification-results.json'),
    JSON.stringify(results, null, 2)
  );
  
  console.log('\n\nResults saved to link-verification-results.json');
}

main().catch(console.error);
