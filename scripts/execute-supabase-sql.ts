/**
 * Execute SQL in Supabase using REST API
 * This script attempts to create the table via Supabase REST API
 */

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

async function executeSQL() {
  console.log('🚀 Executing SQL Migration in Supabase\n');
  
  // Read migration SQL
  const migrationPath = path.resolve(process.cwd(), 'migrations/create-study-programs-table.sql');
  let migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
  
  // Remove comments and clean up
  migrationSQL = migrationSQL
    .split('\n')
    .filter(line => !line.trim().startsWith('--'))
    .join('\n')
    .trim();
  
  // Split into individual statements
  const statements = migrationSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 10); // Filter out very short statements
  
  console.log(`📋 Found ${statements.length} SQL statements\n`);
  
  // Try to execute via Supabase REST API
  // Note: Supabase doesn't expose direct SQL execution via REST API for security
  // We'll need to use the Dashboard or create a stored procedure
  
  // Alternative: Use pg library if available, or guide user
  console.log('⚠️  Supabase REST API does not support direct SQL execution.');
  console.log('   Using alternative method...\n');
  
  // Try using Supabase Management API (if available)
  // Or use a PostgreSQL connection library
  
  // For now, we'll create a helper script that uses psql or guides the user
  console.log('📝 Creating SQL execution script...\n');
  
  // Create a script that can be run with psql
  const psqlScript = `-- Supabase Migration Script
-- Run this with: psql "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres" -f migration.sql

${migrationSQL}
`;
  
  fs.writeFileSync('migration-temp.sql', psqlScript);
  console.log('✅ Created migration-temp.sql');
  console.log('');
  console.log('To execute:');
  console.log('1. Get your Supabase database connection string from Dashboard');
  console.log('2. Run: psql "[connection-string]" -f migration-temp.sql');
  console.log('');
  console.log('Or use Supabase Dashboard SQL Editor (recommended):');
  console.log('1. Go to https://app.supabase.com');
  console.log('2. Select your project → SQL Editor → New query');
  console.log('3. Copy contents of: migrations/create-study-programs-table.sql');
  console.log('4. Paste and click Run');
}

executeSQL().catch(console.error);

