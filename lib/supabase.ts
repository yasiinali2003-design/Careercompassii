/**
 * Supabase Client Configuration
 * 
 * This file exports Supabase clients for different contexts:
 * - Client-side (browser): Uses anon key
 * - Server-side (API routes): Uses service role key
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Client-side Supabase client (uses anon key)
 * Use this in React components and client-side code
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Server-side Supabase client (uses service role key)
 * Use this in API routes and server-side code
 * Has full access to database (bypasses Row Level Security)
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

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

