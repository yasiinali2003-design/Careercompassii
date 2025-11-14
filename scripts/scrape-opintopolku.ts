/**
 * Opintopolku Web Scraper
 * Scrapes study programs from Opintopolku search endpoint
 * 
 * NOTE: This uses the public search API endpoint found in network requests.
 * This is NOT web scraping HTML - it's using the same API the website uses.
 * 
 * Usage:
 *   npx tsx scripts/scrape-opintopolku.ts --limit=100
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

interface OpintopolkuSearchResult {
  oid?: string;
  nimi?: {
    fi?: string;
    sv?: string;
    en?: string;
  };
  koulutustyyppi?: {
    koodiUri?: string;
    nimi?: {
      fi?: string;
    };
  };
  koulutusala?: {
    koodiUri?: string;
    nimi?: {
      fi?: string;
    };
  };
  organisaatio?: {
    nimi?: {
      fi?: string;
    };
    organisaatiotyyppi?: {
      koodiUri?: string;
    };
  };
  metadata?: {
    kuvaus?: {
      fi?: string;
    };
  };
}

/**
 * Fetch study programs from Opintopolku search endpoint
 * Filters for yliopisto and AMK programs only
 */
async function fetchFromSearchEndpoint(
  page: number = 1,
  size: number = 20,
  programTypes?: string[]
): Promise<{ results: OpintopolkuSearchResult[]; total?: number }> {
  // Filter for yliopisto and AMK programs
  // Program types: "yo" (yliopisto), "amk" (AMK)
  const typeFilter = programTypes && programTypes.length > 0 
    ? `&koulutustyyppi=${programTypes.join(',')}`
    : '&koulutustyyppi=yo,amk';
  
  const url = `https://opintopolku.fi/konfo-backend/search/koulutukset?lng=fi&order=desc&page=${page}&size=${size}&sort=score${typeFilter}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; Urakompassi/1.0)',
        'Referer': 'https://opintopolku.fi/'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Handle different response formats
    // The search endpoint returns data.hits as an array directly
    if (data.hits && Array.isArray(data.hits)) {
      // Direct hits array format (found in actual response)
      return {
        results: data.hits,
        total: data.total || data.hits.length
      };
    } else if (data.hits && data.hits.hits && Array.isArray(data.hits.hits)) {
      // Nested hits format (Elasticsearch)
      return {
        results: data.hits.hits.map((hit: any) => hit._source || hit),
        total: data.hits.total?.value || data.hits.total || data.total
      };
    } else if (data.results && Array.isArray(data.results)) {
      return {
        results: data.results,
        total: data.total || data.totalCount
      };
    } else if (Array.isArray(data)) {
      return { results: data };
    } else if (data.content && Array.isArray(data.content)) {
      return {
        results: data.content,
        total: data.totalElements || data.total
      };
    }
    
    // Debug: log structure if no results
    console.warn('Unexpected response format. Keys:', Object.keys(data).slice(0, 10));
    if (data.hits) {
      console.warn('Hits type:', typeof data.hits, Array.isArray(data.hits) ? '(array)' : '(not array)');
    }
    return { results: [] };
  } catch (error: any) {
    console.error(`Error fetching page ${page}:`, error.message);
    throw error;
  }
}

/**
 * Fetch all programs with pagination
 * Filters for yliopisto and AMK programs only
 */
async function fetchAllPrograms(
  limit: number = 1000,
  programTypes?: string[]
): Promise<OpintopolkuSearchResult[]> {
  const allPrograms: OpintopolkuSearchResult[] = [];
  const pageSize = 100; // Max per page
  let page = 1;
  let hasMore = true;
  
  // Default to yliopisto + AMK, but can be overridden
  const types = programTypes || ['yo', 'amk'];
  const typeNames = types.map(t => {
    if (t === 'yo') return 'yliopisto';
    if (t === 'amk') return 'AMK';
    return t;
  });
  console.log(`📥 Fetching ${typeNames.join(' + ')} programs from Opintopolku...\n`);
  
  while (hasMore && allPrograms.length < limit) {
    try {
      console.log(`   Fetching page ${page} (${allPrograms.length} programs so far)...`);
      
      const { results, total } = await fetchFromSearchEndpoint(page, pageSize, types);
      
      if (results.length === 0) {
        hasMore = false;
        break;
      }
      
      allPrograms.push(...results);
      
      // Check if we've reached the total or limit
      if (total && allPrograms.length >= total) {
        hasMore = false;
      } else if (allPrograms.length >= limit) {
        hasMore = false;
      } else if (results.length < pageSize) {
        hasMore = false;
      } else {
        page++;
        // Rate limiting: wait 500ms between requests
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error: any) {
      console.error(`❌ Error on page ${page}:`, error.message);
      // Continue to next page or stop if critical error
      if (error.message.includes('404') || error.message.includes('403')) {
        hasMore = false;
      } else {
        page++;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  
  console.log(`\n✅ Fetched ${allPrograms.length} programs total\n`);
  return allPrograms.slice(0, limit);
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const limitArg = args.find(arg => arg.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1]) : 1000;
  
  console.log('🚀 Opintopolku Scraper\n');
  console.log('='.repeat(60));
  console.log(`📊 Configuration:`);
  console.log(`   Limit: ${limit}`);
  console.log(`   Endpoint: https://opintopolku.fi/konfo-backend/search/koulutukset`);
  console.log('');
  
  try {
    const programs = await fetchAllPrograms(limit);
    
    console.log('📊 Results:');
    console.log(`   Total programs fetched: ${programs.length}`);
    console.log('');
    
    if (programs.length > 0) {
      console.log('📋 Sample programs:');
      programs.slice(0, 5).forEach((p, i) => {
        const name = p.nimi?.fi || p.nimi?.sv || p.nimi?.en || 'Unknown';
        const org = p.toteutustenTarjoajat?.nimi?.fi || 'Unknown';
        const type = p.koulutustyyppi || 'unknown';
        console.log(`   ${i + 1}. ${name} - ${org} (${type})`);
      });
      console.log('');
      
      // Save to JSON file for inspection
      const fs = await import('fs');
      const outputPath = path.resolve(process.cwd(), 'opintopolku-programs-raw.json');
      fs.writeFileSync(outputPath, JSON.stringify(programs, null, 2));
      console.log(`💾 Raw data saved to: ${outputPath}`);
      console.log('');
      console.log('💡 Next steps:');
      console.log('   1. Review the JSON file');
      console.log('   2. Use import script to transform and import to database');
      console.log('   3. Run: npx tsx scripts/import-from-opintopolku.ts --limit=250');
    } else {
      console.log('⚠️  No programs fetched. The endpoint may require authentication or have changed.');
    }
  } catch (error: any) {
    console.error('\n❌ Fatal error:', error.message);
    console.error('');
    console.error('💡 Possible solutions:');
    console.error('   1. Check if endpoint still works');
    console.error('   2. Try manual CSV import instead');
    console.error('   3. Contact Opetushallitus for API access');
    process.exit(1);
  }
}

// Export for use in other scripts
export { fetchAllPrograms, fetchFromSearchEndpoint };

// Run if called directly
if (require.main === module) {
  main();
}

