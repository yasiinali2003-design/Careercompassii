/**
 * Verify which Työmarkkinatori career links actually exist
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

const filePath = path.join(__dirname, '..', 'data', 'careers-fi.ts');
const content = fs.readFileSync(filePath, 'utf-8');

// Extract all unique Työmarkkinatori career IDs
const tmtPattern = /tyomarkkinatori\.fi\/henkiloasiakkaat\/ammattitieto\/ammatit\/([^"]+)/g;
const careerIds = new Set<string>();
let match;

while ((match = tmtPattern.exec(content)) !== null) {
  careerIds.add(match[1]);
}

console.log(`Found ${careerIds.size} unique Työmarkkinatori career links\n`);

async function checkUrl(careerId: string): Promise<{ careerId: string; status: number }> {
  const url = `https://tyomarkkinatori.fi/henkiloasiakkaat/ammattitieto/ammatit/${careerId}`;

  return new Promise((resolve) => {
    const req = https.request(url, {
      method: 'HEAD',
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      resolve({ careerId, status: res.statusCode || 0 });
    });

    req.on('error', () => resolve({ careerId, status: 0 }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ careerId, status: 0 });
    });
    req.end();
  });
}

async function main() {
  const ids = Array.from(careerIds);
  const broken: string[] = [];
  const working: string[] = [];

  // Check in batches
  const batchSize = 20;
  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(checkUrl));

    for (const result of results) {
      if (result.status === 200) {
        working.push(result.careerId);
        process.stdout.write('✓');
      } else if (result.status === 301 || result.status === 302) {
        working.push(result.careerId);
        process.stdout.write('→');
      } else {
        broken.push(result.careerId);
        process.stdout.write('✗');
      }
    }

    const checked = i + batchSize;
    if (checked % 100 === 0) {
      const count = checked < ids.length ? checked : ids.length;
      console.log(` [${count}/${ids.length}]`);
    }

    await new Promise(r => setTimeout(r, 100));
  }

  console.log('\n\n═══════════════════════════════════════════════════════════════════════════');
  console.log(`Working: ${working.length}, Broken: ${broken.length}`);

  if (broken.length > 0) {
    console.log('\nBROKEN CAREER IDs (404):');
    broken.forEach(id => console.log(`  - ${id}`));

    // Save to file for fixing
    fs.writeFileSync(
      path.join(__dirname, '..', 'broken-tyomarkkinatori-ids.json'),
      JSON.stringify(broken, null, 2)
    );
    console.log('\nSaved to broken-tyomarkkinatori-ids.json');
  }
}

main().catch(console.error);
