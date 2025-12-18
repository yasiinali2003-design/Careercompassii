/**
 * Supabase Client Configuration
 *
 * This file exports Supabase clients for different contexts:
 * - Client-side (browser): Uses anon key
 * - Server-side (API routes): Uses service role key
 */

import { createClient } from '@supabase/supabase-js';
import { reportSupabaseIncident } from './monitoring';

// Track whether we have already emitted configuration warnings
let supabaseMissingLogged = false;
let supabaseConfigLogged = false;
let supabaseServiceWarned = false;
let supabaseServiceKeyInvalidWarned = false;

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Get Supabase URL and keys (lazy loaded to avoid build-time errors)
 */
function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Return null if not configured (allows build to succeed)
  if (!supabaseUrl || !supabaseAnonKey) {
    if (!supabaseMissingLogged && !isProduction) {
      supabaseMissingLogged = true;
      console.warn('[Supabase] Environment variables not configured');
    }
    return null;
  }

  // Log what we have (avoid spamming output during production builds)
  if (!supabaseConfigLogged && !isProduction) {
    supabaseConfigLogged = true;
    console.log('[Supabase] Config check:', {
      url: supabaseUrl ? 'Set' : 'Missing',
      anonKey: supabaseAnonKey ? 'Set' : 'Missing',
      serviceKey: supabaseServiceRoleKey ? 'Set' : 'Missing'
    });
  }

  return { supabaseUrl, supabaseAnonKey, supabaseServiceRoleKey };
}

/**
 * Client-side Supabase client (uses anon key)
 * Use this in React components and client-side code
 * Note: May be null if Supabase is not configured - always check before use
 */
export const supabase: ReturnType<typeof createClient> | null = (() => {
  const config = getSupabaseConfig();
  if (!config) {
    // Return null during build or when not configured
    return null;
  }
  return createClient(config.supabaseUrl, config.supabaseAnonKey);
})();

/**
 * Server-side Supabase client (uses service role key)
 * Use this in API routes and server-side code
 * Has full access to database (bypasses Row Level Security)
 * Note: May be null if Supabase is not configured - always check before use
 */
export const supabaseAdmin: ReturnType<typeof createClient> | null = (() => {
  const config = getSupabaseConfig();
  if (!config || !config.supabaseServiceRoleKey) {
    if (!supabaseServiceWarned && !isProduction) {
      supabaseServiceWarned = true;
      console.warn('[Supabase] Service role key not configured');
    }
    // Return null during build or when not configured
    return null;
  }

  // Validate key format - accept both JWT format (~200+ chars) and sb_secret_ format (~40 chars)
  const isJwtFormat = config.supabaseServiceRoleKey.length > 100;
  const isSecretFormat = config.supabaseServiceRoleKey.startsWith('sb_secret_') || config.supabaseServiceRoleKey.startsWith('sbp_');

  if (!isJwtFormat && !isSecretFormat) {
    if (!supabaseServiceKeyInvalidWarned && !isProduction) {
      supabaseServiceKeyInvalidWarned = true;
      console.error('[Supabase] Service role key appears to be invalid (unrecognized format)');
    }
    return null;
  }

  return createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      fetch: async (...args) => {
        const [input, init] = args;
        const requestUrl = typeof input === 'string'
          ? input
          : input instanceof Request
            ? input.url
            : 'unknown';
        const method = init?.method
          ?? (input instanceof Request ? input.method : 'GET');

        try {
          return await fetch(...args);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          reportSupabaseIncident('supabase_fetch_error', errorMessage, {
            url: requestUrl,
            method,
            isProduction
          }).catch(() => {});
          console.error('[Supabase] Fetch error:', err);
          throw err;
        }
      }
    }
  });
})();

/**
 * Type definitions for our database tables
 */
export interface TestResult {
  id?: string;
  created_at?: string;
  cohort: 'YLA' | 'TASO2' | 'NUORI';
  school_code?: string | null;

  // Education path (YLA only)
  education_path_primary?: 'lukio' | 'ammattikoulu' | 'kansanopisto' | null;
  education_path_scores?: {
    lukio: number;
    ammattikoulu: number;
    kansanopisto: number;
  } | null;

  // Top careers
  top_careers: Array<{
    slug: string;
    title: string;
    score: number;
  }>;

  // User profile dimensions
  dimension_scores: {
    interests: number;
    values: number;
    workstyle: number;
    context: number;
  };

  // Feedback (collected later)
  satisfaction_rating?: number | null;
  feedback_text?: string | null;
  feedback_submitted_at?: string | null;

  // Metadata
  time_spent_seconds?: number | null;
  completed?: boolean;
}

