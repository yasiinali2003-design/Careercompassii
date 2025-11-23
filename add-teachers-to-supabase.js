#!/usr/bin/env node

/**
 * Add Test Teachers to Supabase
 * Uses the admin endpoint to create teacher accounts with unique PIN codes
 */

const API_BASE = process.env.API_BASE || 'http://localhost:3000';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'URASUUNNITELMA';

// Test teachers to create
const testTeachers = [
  {
    name: 'Matti Virtanen',
    email: 'matti.virtanen@example.com',
    schoolName: 'Helsingin yhteislyseo',
    package: 'premium'
  },
  {
    name: 'Liisa Korhonen',
    email: 'liisa.korhonen@example.com',
    schoolName: 'Tampereen lukio',
    package: 'yläaste'
  },
  {
    name: 'Pekka Nieminen',
    email: 'pekka.nieminen@example.com',
    schoolName: 'Oulun ammattiopisto',
    package: 'standard'
  },
  {
    name: 'Anna-Liisa Mäkelä',
    email: 'anna.makela@example.com',
    schoolName: 'Turun nuorisokeskus',
    package: 'premium'
  },
  {
    name: 'Jukka Heikkinen',
    email: 'jukka.heikkinen@example.com',
    schoolName: 'Jyväskylän lukio',
    package: 'yläaste'
  }
];

async function createTeacher(teacher) {
  try {
    // Create Basic Auth header
    const authString = Buffer.from(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}`).toString('base64');

    const response = await fetch(`${API_BASE}/api/teachers/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authString}`
      },
      body: JSON.stringify(teacher)
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error(`❌ Failed to create teacher ${teacher.name}:`, data.error || data.details);
      return null;
    }

    console.log(`✅ Created teacher: ${data.teacher.name}`);
    console.log(`   Access Code: ${data.teacher.access_code}`);
    console.log(`   Email: ${data.teacher.email || 'N/A'}`);
    console.log(`   School: ${data.teacher.school_name || 'N/A'}`);
    console.log(`   Package: ${data.teacher.package || 'N/A'}`);
    console.log(`   Created: ${data.teacher.created_at}`);
    console.log('');

    return data.teacher;
  } catch (error) {
    console.error(`❌ Error creating teacher ${teacher.name}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Adding teachers to Supabase...\n');
  console.log(`API Base: ${API_BASE}`);
  console.log(`Admin User: ${ADMIN_USERNAME}\n`);

  const createdTeachers = [];

  for (const teacher of testTeachers) {
    const created = await createTeacher(teacher);
    if (created) {
      createdTeachers.push(created);
    }
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('📊 Summary:');
  console.log(`   Total attempted: ${testTeachers.length}`);
  console.log(`   Successfully created: ${createdTeachers.length}`);
  console.log(`   Failed: ${testTeachers.length - createdTeachers.length}`);
  console.log('');

  if (createdTeachers.length > 0) {
    console.log('📝 Teacher Access Codes:');
    console.log('─'.repeat(60));
    createdTeachers.forEach(teacher => {
      console.log(`${teacher.name.padEnd(25)} | ${teacher.access_code}`);
    });
    console.log('─'.repeat(60));
  }

  console.log('\n✨ Done!\n');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
