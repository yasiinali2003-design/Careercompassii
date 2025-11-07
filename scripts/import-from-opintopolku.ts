/**
 * Import Study Programs from Opintopolku API
 * Fetches study programs from Opintopolku and imports them into Supabase
 * 
 * Usage:
 *   npx tsx scripts/import-from-opintopolku.ts
 * 
 * Options:
 *   --limit=N        Maximum number of programs to fetch (default: 1000)
 *   --offset=N       Starting offset (default: 0)
 *   --dry-run        Test without importing to database
 *   --skip-existing  Skip programs that already exist in database
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { fetchOpintopolkuPrograms, fetchAdmissionPoints, checkOpintopolkuAvailability } from '../lib/opintopolku/api';
import { transformOpintopolkuProgram, loadCareersForMatching } from '../lib/opintopolku/transformer';
import { transformSearchResults } from '../lib/opintopolku/searchTransformer';
import { StudyProgram } from '../lib/data/studyPrograms';
import { OpintopolkuSearchResult } from '../scripts/scrape-opintopolku';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Parse command line arguments
const args = process.argv.slice(2);
const limitArg = args.find(arg => arg.startsWith('--limit='));
const offsetArg = args.find(arg => arg.startsWith('--offset='));
const dryRun = args.includes('--dry-run');
const skipExisting = args.includes('--skip-existing');

const limit = limitArg ? parseInt(limitArg.split('=')[1]) : 1000;
const offset = offsetArg ? parseInt(offsetArg.split('=')[1]) : 0;

// Get Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

interface StudyProgramRow {
  id: string;
  name: string;
  institution: string;
  institution_type: 'yliopisto' | 'amk';
  field: string;
  min_points: number;
  max_points: number | null;
  related_careers: string[];
  opintopolku_url: string | null;
  description: string | null;
  data_year: number;
}

/**
 * Convert StudyProgram to database row format
 */
function convertToRow(program: StudyProgram): StudyProgramRow {
  return {
    id: program.id,
    name: program.name,
    institution: program.institution,
    institution_type: program.institutionType,
    field: program.field,
    min_points: program.minPoints,
    max_points: program.maxPoints ?? null,
    related_careers: program.relatedCareers,
    opintopolku_url: program.opintopolkuUrl ?? null,
    description: program.description ?? null,
    data_year: 2025
  };
}

/**
 * Get existing program IDs from database
 */
async function getExistingProgramIds(): Promise<Set<string>> {
  if (!skipExisting) {
    return new Set();
  }
  
  const { data, error } = await supabase
    .from('study_programs')
    .select('id');
  
  if (error) {
    console.warn('⚠️  Could not fetch existing programs:', error.message);
    return new Set();
  }
  
  return new Set(data?.map(p => p.id) || []);
}

/**
 * Main import function
 */
async function importFromOpintopolku() {
  console.log('🚀 Starting Opintopolku import...\n');
  console.log(`📊 Configuration:`);
  console.log(`   Limit: ${limit}`);
  console.log(`   Offset: ${offset}`);
  console.log(`   Dry run: ${dryRun ? 'YES' : 'NO'}`);
  console.log(`   Skip existing: ${skipExisting ? 'YES' : 'NO'}`);
  console.log('');
  
  // Check API availability
  console.log('🔍 Checking Opintopolku API availability...');
  const isAvailable = await checkOpintopolkuAvailability();
  
  if (!isAvailable) {
    console.warn('⚠️  Opintopolku API may not be available or accessible');
    console.warn('   This could be due to:');
    console.warn('   - API endpoint changes');
    console.warn('   - Network issues');
    console.warn('   - Rate limiting');
    console.warn('   - API authentication requirements');
    console.warn('');
    console.warn('   Continuing anyway - will attempt to fetch...\n');
  } else {
    console.log('✅ Opintopolku API is accessible\n');
  }
  
  // Load careers for matching
  console.log('📚 Loading careers for matching...');
  const careers = await loadCareersForMatching();
  console.log(`✅ Loaded ${careers.length} careers\n`);
  
  // Get existing programs if skipping
  const existingIds = await getExistingProgramIds();
  if (skipExisting && existingIds.size > 0) {
    console.log(`📋 Found ${existingIds.size} existing programs (will skip)\n`);
  }
  
  // Fetch programs from Opintopolku using search endpoint
  console.log('📥 Fetching study programs from Opintopolku search endpoint...');
  let searchResults: OpintopolkuSearchResult[] = [];
  
  try {
    // Import and use the scraper function directly
    const { fetchAllPrograms } = await import('../scripts/scrape-opintopolku');
    
    console.log(`   Fetching ${limit} yliopisto/AMK programs...`);
    searchResults = await fetchAllPrograms(limit, ['yo', 'amk']);
    console.log(`✅ Fetched ${searchResults.length} programs from search endpoint\n`);
  } catch (error: any) {
    console.error('❌ Failed to fetch from Opintopolku search endpoint:', error.message);
    console.error('');
    console.error('💡 Possible solutions:');
    console.error('   1. Check network connectivity');
    console.error('   2. Try again later (rate limiting)');
    console.error('   3. Use CSV import instead');
    console.error('   4. Expand database manually');
    process.exit(1);
  }
  
  if (searchResults.length === 0) {
    console.log('⚠️  No programs fetched. This could mean:');
    console.log('   - Search endpoint structure has changed');
    console.log('   - No programs match the filters');
    console.log('   - Network/rate limiting issues');
    process.exit(0);
  }
  
  // Transform search results to our format
  console.log('🔄 Transforming programs...');
  let transformedPrograms = transformSearchResults(searchResults, careers);
  
  // Filter out duplicates if needed
  let skipped = 0;
  const finalPrograms: StudyProgram[] = [];
  
  for (const program of transformedPrograms) {
    // Skip if already exists
    if (skipExisting && existingIds.has(program.id)) {
      skipped++;
      continue;
    }
    
    finalPrograms.push(program);
  }
  
  console.log(`✅ Transformed ${finalPrograms.length} programs`);
  console.log(`   Skipped: ${skipped} (duplicates or invalid)\n`);
  
  transformedPrograms = finalPrograms;
  
  if (transformedPrograms.length === 0) {
    console.log('⚠️  No programs to import after transformation');
    console.log('   This could mean:');
    console.log('   - No admission points available');
    console.log('   - All programs already exist');
    console.log('   - Transformation failed');
    process.exit(0);
  }
  
  // Convert to database format
  const rows = transformedPrograms.map(convertToRow);
  
  if (dryRun) {
    console.log('🔍 DRY RUN - Would import:');
    console.log(`   Total programs: ${rows.length}`);
    console.log(`   Yliopisto: ${rows.filter(r => r.institution_type === 'yliopisto').length}`);
    console.log(`   AMK: ${rows.filter(r => r.institution_type === 'amk').length}`);
    console.log('');
    console.log('📋 Sample programs:');
    rows.slice(0, 5).forEach(p => {
      console.log(`   - ${p.name} (${p.institution}): ${p.min_points} pts`);
    });
    console.log('');
    console.log('✅ Dry run complete - no data imported');
    return;
  }
  
  // Import to database
  console.log('💾 Importing to database...');
  const batchSize = 100;
  let imported = 0;
  let errors = 0;
  
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(rows.length / batchSize);
    
    console.log(`📦 Importing batch ${batchNum}/${totalBatches} (${batch.length} programs)...`);
    
    try {
      const { error } = await supabase
        .from('study_programs')
        .upsert(batch, {
          onConflict: 'id',
          ignoreDuplicates: false
        });
      
      if (error) {
        console.error(`❌ Error importing batch ${batchNum}:`, error.message);
        errors += batch.length;
      } else {
        imported += batch.length;
        console.log(`✅ Batch ${batchNum} imported successfully`);
      }
    } catch (err: any) {
      console.error(`❌ Exception importing batch ${batchNum}:`, err.message);
      errors += batch.length;
    }
  }
  
  console.log('\n📊 Import Summary:');
  console.log(`   ✅ Successfully imported: ${imported}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`   📈 Total: ${rows.length}`);
  
  if (errors === 0) {
    console.log('\n🎉 All programs imported successfully!');
  } else {
    console.log('\n⚠️  Some programs failed to import. Check errors above.');
  }
}

/**
 * Verify imported data
 */
async function verifyImport() {
  console.log('\n🔍 Verifying imported data...\n');
  
  const { count, error } = await supabase
    .from('study_programs')
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    console.error('❌ Error verifying import:', error.message);
    return;
  }
  
  console.log(`📊 Total programs in database: ${count}`);
  
  // Get breakdown by type
  const { data: breakdown } = await supabase
    .from('study_programs')
    .select('institution_type')
    .limit(10000);
  
  if (breakdown) {
    const yliopisto = breakdown.filter(p => p.institution_type === 'yliopisto').length;
    const amk = breakdown.filter(p => p.institution_type === 'amk').length;
    console.log(`   Yliopisto: ${yliopisto}`);
    console.log(`   AMK: ${amk}`);
  }
  
  // Sample programs
  const { data: samples } = await supabase
    .from('study_programs')
    .select('id, name, institution, min_points')
    .order('created_at', { ascending: false })
    .limit(5);
  
  if (samples && samples.length > 0) {
    console.log('\n📋 Recent programs:');
    samples.forEach(p => {
      console.log(`   - ${p.name} (${p.institution}): ${p.min_points} pts`);
    });
  }
}

// Run import
async function main() {
  try {
    await importFromOpintopolku();
    if (!dryRun) {
      await verifyImport();
    }
  } catch (error: any) {
    console.error('\n❌ Fatal error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();

