/**
 * Automated Database Setup
 * Attempts to create table via Supabase Management API
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

async function executeViaManagementAPI() {
  console.log('🚀 Attempting automated database setup...\n');
  
  // Extract project ref (supabaseUrl is already checked at module level)
  const url = supabaseUrl;
  if (!url) {
    console.error('❌ Invalid Supabase URL');
    return;
  }
  
  const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
  if (!match) {
    console.error('❌ Invalid Supabase URL format');
    return;
  }
  
  const projectRef = match[1];
  const managementApiUrl = `https://api.supabase.com/v1/projects/${projectRef}`;
  
  // Read migration SQL
  const migrationPath = path.resolve(process.cwd(), 'migrations/create-study-programs-table.sql');
  const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
  
  // Clean SQL (remove comments)
  const cleanSQL = migrationSQL
    .split('\n')
    .filter(line => !line.trim().startsWith('--'))
    .join('\n')
    .trim();
  
  console.log('📋 Attempting to execute SQL via Management API...\n');
  
  try {
    // Try to execute SQL via Management API
    // Note: This may require additional permissions
    // supabaseServiceKey is already checked at module level, but TypeScript needs explicit check
    if (!supabaseServiceKey) {
      console.error('❌ Service key not available');
      return false;
    }
    
    const response = await fetch(`${managementApiUrl}/database/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({
        query: cleanSQL
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Migration executed successfully!\n');
      console.log('Response:', data);
      return true;
    } else {
      const error = await response.text();
      console.log('⚠️  Management API not available or requires different method');
      console.log('Error:', error);
      return false;
    }
  } catch (error: any) {
    console.log('⚠️  Cannot execute SQL automatically');
    console.log('Reason:', error.message);
    return false;
  }
}

async function main() {
  const success = await executeViaManagementAPI();
  
  if (!success) {
    console.log('\n' + '='.repeat(60));
    console.log('📋 Manual Setup Required');
    console.log('='.repeat(60));
    console.log('');
    console.log('The Supabase JavaScript client cannot execute DDL statements.');
    console.log('Please run the migration SQL manually in Supabase Dashboard:\n');
    console.log('1. Go to https://app.supabase.com');
    console.log('2. Select your project');
    console.log('3. Click "SQL Editor" → "New query"');
    console.log('4. Copy the SQL from: migrations/create-study-programs-table.sql');
    console.log('5. Paste and click "Run"');
    console.log('');
    console.log('After migration, import data with:');
    console.log('  npx tsx scripts/import-study-programs.ts');
    console.log('');
    
    // Show SQL for easy copying
    const migrationPath = path.resolve(process.cwd(), 'migrations/create-study-programs-table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
    console.log('📄 Migration SQL (copy this):');
    console.log('='.repeat(60));
    console.log(migrationSQL);
    console.log('='.repeat(60));
  } else {
    console.log('\n✅ Database setup complete!');
    console.log('📦 Next: Import data with: npx tsx scripts/import-study-programs.ts');
  }
}

main().catch(console.error);

