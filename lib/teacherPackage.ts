/**
 * Helper functions for checking teacher package access
 */

import { supabaseAdmin } from './supabase';

export type PackageType = 'premium' | 'standard';

/**
 * Get teacher package from database
 */
export async function getTeacherPackage(teacherId: string): Promise<PackageType> {
  if (!supabaseAdmin || !teacherId) {
    return 'standard'; // Default to standard if no DB
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('teachers')
      .select('package')
      .eq('id', teacherId)
      .single();

    if (error || !data) {
      return 'standard'; // Default to standard on error
    }

    const pkg = String(data.package || '').toLowerCase();
    return pkg === 'premium' ? 'premium' : 'standard';
  } catch {
    return 'standard';
  }
}

/**
 * Check if teacher has Premium access
 */
export async function isPremiumTeacher(teacherId: string): Promise<boolean> {
  return (await getTeacherPackage(teacherId)) === 'premium';
}

/**
 * Require Premium access - throws error if not Premium
 */
export async function requirePremium(teacherId: string): Promise<void> {
  const isPremium = await isPremiumTeacher(teacherId);
  if (!isPremium) {
    throw new Error('PREMIUM_REQUIRED');
  }
}


