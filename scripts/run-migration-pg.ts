/**
 * Direct PostgreSQL Migration Script
 * Uses pg library to execute SQL directly in Supabase
 */

import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

// Extract database connection info from Supabase URL
// Supabase URL: https://[project-ref].supabase.co
// We need: postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
function getPostgresConnectionString(): string | null {
  // supabaseUrl is already checked at module level, but TypeScript needs this check
  const url = supabaseUrl;
  if (!url) return null;
  
  // Extract project ref from URL
  const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
  if (!match) return null;
  
  const projectRef = match[1];
  
  // Get database password from environment or prompt
  // For Supabase, the password is usually in Dashboard → Settings → Database
  // Or we can construct connection string if we have the password
  
  // Check if we have a direct connection string
  const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  if (dbUrl) {
    return dbUrl;
  }
  
  // Try to construct from project ref
  // Note: We still need the password, which is in Supabase Dashboard
  console.log('⚠️  Need database password to connect directly.');
  console.log(`   Project ref: ${projectRef || 'unknown'}`);
  console.log('   Get password from: Supabase Dashboard → Settings → Database');
  console.log('');
  console.log('   Or set DATABASE_URL in .env.local:');
  console.log('   DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres');
  
  return null;
}

async function runMigration() {
  console.log('🚀 Running Database Migration via PostgreSQL\n');
  console.log('='.repeat(60));
  console.log('');
  
  // Try to get connection string
  const connectionString = getPostgresConnectionString();
  
  if (!connectionString) {
    console.log('📋 Alternative: Run Migration via Supabase Dashboard');
    console.log('--------------------------------------------------');
    console.log('');
    console.log('Since we need the database password, please run the migration manually:');
    console.log('');
    console.log('1. Go to https://app.supabase.com');
    console.log('2. Select your project');
    console.log('3. Click "SQL Editor" → "New query"');
    console.log('4. Copy the SQL from: migrations/create-study-programs-table.sql');
    console.log('5. Paste and click "Run"');
    console.log('');
    console.log('Or set DATABASE_URL in .env.local and run this script again.');
    console.log('');
    
    // Show the SQL anyway
    const migrationPath = path.resolve(process.cwd(), 'migrations/create-study-programs-table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
    console.log('📄 Migration SQL:');
    console.log('='.repeat(60));
    console.log(migrationSQL);
    console.log('='.repeat(60));
    
    return;
  }
  
  // Read migration SQL
  const migrationPath = path.resolve(process.cwd(), 'migrations/create-study-programs-table.sql');
  const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
  
  // Connect to database
  const client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected\n');
    
    // Execute migration SQL
    console.log('📋 Executing migration SQL...\n');
    await client.query(migrationSQL);
    
    console.log('✅ Migration executed successfully!\n');
    
    // Verify table was created
    const result = await client.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'study_programs'
    `);
    
    if (result.rows[0].count > 0) {
      console.log('✅ Table "study_programs" created successfully!\n');
      
      // Check if table has data
      const countResult = await client.query('SELECT COUNT(*) as count FROM study_programs');
      const count = parseInt(countResult.rows[0].count);
      console.log(`📊 Current programs in database: ${count}\n`);
      
      if (count === 0) {
        console.log('📦 Next step: Import data with:');
        console.log('   npx tsx scripts/import-study-programs.ts\n');
      }
    } else {
      console.log('⚠️  Table may not have been created. Check for errors above.\n');
    }
    
  } catch (error: any) {
    console.error('❌ Error executing migration:', error.message);
    console.error('');
    console.error('If the error says "relation already exists", the table is already created.');
    console.error('You can proceed to import data.');
    console.error('');
  } finally {
    await client.end();
  }
}

runMigration().catch(console.error);

