/**
 * Supabase Database Setup Script
 * Creates the study_programs table and imports data
 * 
 * Usage:
 *   npx tsx scripts/setup-supabase-database.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { studyPrograms } from '../lib/data/studyPrograms';
import * as fs from 'fs';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  }
});

/**
 * Execute SQL migration
 */
async function runMigration() {
  console.log('📋 Step 1: Running database migration...\n');
  
  // Read migration SQL file
  const migrationPath = path.resolve(process.cwd(), 'migrations/create-study-programs-table.sql');
  const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
  
  // Split SQL into individual statements (remove comments and empty lines)
  const statements = migrationSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))
    .filter(s => !s.startsWith('COMMENT')); // Skip COMMENT statements as they may fail
  
  console.log(`Found ${statements.length} SQL statements to execute\n`);
  
  // Execute each statement
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    if (!statement || statement.length < 10) continue; // Skip very short statements
    
    try {
      // Use RPC to execute SQL (if available) or use direct query
      // Note: Supabase JS client doesn't support DDL directly, so we'll use a workaround
      const { data, error } = await supabase.rpc('exec_sql', { sql: statement });
      
      if (error) {
        // If RPC doesn't exist, try alternative method
        console.log(`⚠️  Statement ${i + 1}: Using alternative method...`);
        // We'll need to use the REST API directly or guide user to run SQL manually
        console.log('❌ Cannot execute DDL via JavaScript client.');
        console.log('   Please run the migration SQL manually in Supabase Dashboard.');
        return false;
      }
      
      console.log(`✅ Statement ${i + 1}/${statements.length} executed`);
    } catch (err: any) {
      console.log(`⚠️  Statement ${i + 1}: ${err.message}`);
      // Continue with next statement
    }
  }
  
  return true;
}

/**
 * Alternative: Use Supabase Management API (requires additional setup)
 * For now, we'll guide the user to run SQL manually
 */
async function setupDatabase() {
  console.log('🚀 Setting up Supabase Database for Todistuspistelaskuri\n');
  console.log('='.repeat(60));
  console.log('');
  
  // Step 1: Guide user to run migration
  console.log('📋 Step 1: Database Migration');
  console.log('-------------------------------');
  console.log('');
  console.log('⚠️  Supabase JavaScript client cannot execute DDL (CREATE TABLE) statements.');
  console.log('   Please run the migration SQL manually:');
  console.log('');
  console.log('   1. Go to https://app.supabase.com');
  console.log('   2. Select your project');
  console.log('   3. Click "SQL Editor" → "New query"');
  console.log('   4. Copy and paste the contents of: migrations/create-study-programs-table.sql');
  console.log('   5. Click "Run"');
  console.log('');
  
  // Read and display migration SQL
  const migrationPath = path.resolve(process.cwd(), 'migrations/create-study-programs-table.sql');
  const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
  
  console.log('📄 Migration SQL:');
  console.log('-'.repeat(60));
  console.log(migrationSQL);
  console.log('-'.repeat(60));
  console.log('');
  
  // Step 2: Check if table exists, then import data
  console.log('📦 Step 2: Import Study Programs');
  console.log('----------------------------------');
  console.log('');
  
  // Check if table exists by trying to query it
  const { data: testData, error: testError } = await supabase
    .from('study_programs')
    .select('id')
    .limit(1);
  
  if (testError) {
    if (testError.message.includes('does not exist') || testError.message.includes('relation') || testError.code === '42P01') {
      console.log('❌ Table "study_programs" does not exist yet.');
      console.log('   Please run the migration SQL first (Step 1).');
      console.log('');
      console.log('   After running the migration, run this script again to import data:');
      console.log('   npx tsx scripts/import-study-programs.ts');
      return;
    } else {
      console.log('⚠️  Error checking table:', testError.message);
      console.log('   Proceeding with import attempt...');
    }
  } else {
    const existingCount = testData?.length || 0;
    if (existingCount > 0) {
      console.log(`✓ Table exists with ${existingCount} programs`);
      console.log('   Running import (will update existing records)...');
    } else {
      console.log('✓ Table exists and is empty');
      console.log('   Importing programs...');
    }
  }
  
  // Import data
  console.log('');
  console.log(`📊 Importing ${studyPrograms.length} study programs...\n`);
  
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
  
  function convertToRow(program: typeof studyPrograms[0]): StudyProgramRow {
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
      description: program.description || null,
      data_year: 2025
    };
  }
  
  const rows = studyPrograms.map(convertToRow);
  const batchSize = 100;
  let imported = 0;
  let errors = 0;
  
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(rows.length / batchSize);
    
    console.log(`📦 Importing batch ${batchNum}/${totalBatches} (${batch.length} programs)...`);
    
    try {
      const { data, error } = await supabase
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
  
  console.log('');
  console.log('📊 Import Summary:');
  console.log(`   ✅ Successfully imported: ${imported}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`   📈 Total: ${rows.length}`);
  
  if (errors === 0) {
    console.log('');
    console.log('🎉 Database setup complete!');
    console.log('');
    console.log('✅ Next steps:');
    console.log('   1. Verify data in Supabase Dashboard (Table Editor → study_programs)');
    console.log('   2. Test API: curl "http://localhost:3000/api/study-programs?limit=5"');
    console.log('   3. Test in browser: Navigate to test results page');
  } else {
    console.log('');
    console.log('⚠️  Some programs failed to import. Check errors above.');
    if (errors === rows.length) {
      console.log('   Make sure you ran the migration SQL first!');
    }
  }
}

// Run setup
setupDatabase().catch(console.error);

