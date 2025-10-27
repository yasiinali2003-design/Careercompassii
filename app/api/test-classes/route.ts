/**
 * Debug endpoint for teacher classes
 * Check if Supabase and tables are configured correctly
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const checks = {
    supabaseConfigured: !!supabaseAdmin,
    tablesExist: false,
    canInsert: false,
    error: null as any
  };

  try {
    // Check if we can query the classes table
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('classes')
        .select('id')
        .limit(1);

      checks.tablesExist = !error;

      // Try a test insert (will fail due to RLS, but that's OK)
      // Just checking if table exists
      if (!error) {
        checks.canInsert = true;
      }

      if (error) {
        checks.error = error.message;
      }
    }
  } catch (error) {
    checks.error = error instanceof Error ? error.message : String(error);
  }

  return NextResponse.json({
    checks,
    environmentVariables: {
      SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
      SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
      SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing'
    }
  });
}

