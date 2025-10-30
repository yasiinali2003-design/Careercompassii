#!/usr/bin/env node
/**
 * Bulk provision teacher access codes from a CSV
 *
 * Usage:
 *   node provision-teachers.js /absolute/path/to/teachers.csv
 *
 * CSV columns (header required): name,email,school
 * - name: required
 * - email: optional (recommended to validate school domain)
 * - school: optional
 *
 * Env requirements (read from .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function readEnvLocal() {
  try {
    const filePath = path.resolve(process.cwd(), '.env.local');
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(/\r?\n/);
    const env = {};
    for (const line of lines) {
      if (!line || line.trim().startsWith('#') || !line.includes('=')) continue;
      const idx = line.indexOf('=');
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      env[key] = value;
    }
    return env;
  } catch (e) {
    return {};
  }
}

function parseCsv(input) {
  const lines = input.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];
  const header = lines.shift().split(',').map((h) => h.trim().toLowerCase());
  const nameIdx = header.indexOf('name');
  const emailIdx = header.indexOf('email');
  const schoolIdx = header.indexOf('school');
  if (nameIdx === -1) {
    throw new Error('CSV must include a "name" column');
  }
  return lines.map((line) => {
    const cols = line.split(',');
    return {
      name: (cols[nameIdx] || '').trim(),
      email: emailIdx !== -1 ? (cols[emailIdx] || '').trim() : '',
      school: schoolIdx !== -1 ? (cols[schoolIdx] || '').trim() : '',
    };
  }).filter((r) => r.name);
}

function generateAccessCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error('Usage: node provision-teachers.js /absolute/path/to/teachers.csv');
    process.exit(1);
  }
  const absCsv = path.resolve(csvPath);
  if (!fs.existsSync(absCsv)) {
    console.error(`CSV not found: ${absCsv}`);
    process.exit(1);
  }

  const env = readEnvLocal();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    console.error('Missing Supabase envs. Ensure .env.local has NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceKey);
  const csvContent = fs.readFileSync(absCsv, 'utf8');
  const rows = parseCsv(csvContent);
  if (rows.length === 0) {
    console.error('No valid rows found in CSV');
    process.exit(1);
  }

  console.log(`Provisioning ${rows.length} teacher(s)...`);
  const results = [];

  for (const row of rows) {
    // Try RPC first
    let accessCode = null;
    try {
      const rpc = await supabase.rpc('generate_teacher_code');
      if (rpc && rpc.data && !rpc.error) accessCode = rpc.data;
    } catch (_) {}
    if (!accessCode) accessCode = generateAccessCode();

    // Ensure uniqueness by retrying a few times if conflict
    let attempts = 0;
    while (attempts < 5) {
      const { data: existing, error: existErr } = await supabase
        .from('teachers')
        .select('id')
        .eq('access_code', accessCode)
        .maybeSingle();
      if (!existErr && !existing) break;
      accessCode = generateAccessCode();
      attempts++;
    }

    const insert = await supabase
      .from('teachers')
      .insert({
        name: row.name,
        email: row.email || null,
        school_name: row.school || null,
        access_code: accessCode,
        is_active: true,
        created_by: 'provision-script',
      })
      .select('id, name, email, school_name, access_code, created_at')
      .maybeSingle();

    if (insert.error) {
      results.push({ ...row, status: 'error', error: insert.error.message });
      console.error(`Failed: ${row.name} (${row.email || '-'}) -> ${insert.error.message}`);
    } else {
      results.push({ ...row, status: 'ok', access_code: insert.data?.access_code });
      console.log(`Created: ${row.name} -> ${insert.data?.access_code}`);
    }
  }

  const outPath = path.resolve(process.cwd(), `provisioned_teachers_${Date.now()}.csv`);
  const header = 'name,email,school,access_code,status,error\n';
  const body = results.map(r => [r.name, r.email || '', r.school || '', r.access_code || '', r.status, r.error || ''].join(',')).join('\n');
  fs.writeFileSync(outPath, header + body, 'utf8');
  console.log(`\nSummary CSV written: ${outPath}`);
}

main().catch((e) => {
  console.error('Fatal:', e.message || e);
  process.exit(1);
});


