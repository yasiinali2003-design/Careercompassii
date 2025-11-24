#!/usr/bin/env node

/**
 * Verify that the package column migration was successful
 */

const fs = require('fs');
const path = require('path');

// Load env vars
function loadEnv() {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
}

loadEnv();

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

async function verifyMigration() {
  console.log('🔍 Verifying package column migration...\n');

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  try {
    const { data, error } = await supabase
      .from('teachers')
      .select('id, name, package')
      .limit(10);

    if (error) {
      if (error.message?.includes('package') || error.code === 'PGRST204') {
        console.log('❌ Migration not complete - package column does not exist\n');
        console.log('📋 Run the migration:');
        console.log('   1. Go to Supabase Dashboard → SQL Editor');
        console.log('   2. Run: node run-migration.js for SQL');
        process.exit(1);
      } else {
        throw error;
      }
    }

    console.log('✅ Package column exists!\n');
    
    if (data && data.length > 0) {
      console.log(`📊 Found ${data.length} teacher(s):\n`);
      data.forEach(teacher => {
        const pkg = teacher.package || 'null';
        const status = pkg === 'premium' ? '⭐' : '✓';
        console.log(`   ${status} ${teacher.name || 'Unnamed'}: ${pkg}`);
      });
      
      const premiumCount = data.filter(t => t.package === 'premium').length;
      const standardCount = data.filter(t => t.package === 'standard').length;
      
      console.log(`\n📈 Summary:`);
      console.log(`   Premium: ${premiumCount}`);
      console.log(`   Standard: ${standardCount}`);
    } else {
      console.log('📭 No teachers found (table is empty)');
    }

    console.log('\n✅ Migration verified! Package gating is active.\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyMigration();





