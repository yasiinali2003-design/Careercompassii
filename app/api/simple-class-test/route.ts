/**
 * Simple test endpoint to check if Supabase is working
 * No database required - just test connection
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const status = {
    supabaseConfigured: !!supabaseAdmin,
    envVars: {
      url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      serviceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    },
    error: null as any,
    databaseReachable: false
  };

  // Try to ping database
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('classes')
        .select('count')
        .limit(1);

      if (!error) {
        status.databaseReachable = true;
      } else {
        status.error = {
          message: error.message,
          code: error.code,
          details: error.details
        };
      }
    } catch (err) {
      status.error = err instanceof Error ? err.message : String(err);
    }
  }

  return NextResponse.json(status, { status: 200 });
}

