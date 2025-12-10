/**
 * Referral System Library
 * Tracks referrals and generates referral codes for word-of-mouth growth
 */

import { safeGetItem, safeSetItem } from './safeStorage';

export interface ReferralData {
  referralCode: string;
  referrerUserId?: string;
  timestamp: string;
}

/**
 * Generate a unique referral code for a user
 * Format: CC-XXXX-XXXX (Urakompassi prefix + 8 random alphanumeric)
 */
export function generateReferralCode(): string {
  const prefix = 'CC';
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude ambiguous chars
  const length = 8;
  
  let code = '';
  for (let i = 0; i < length; i++) {
    if (i === 4) code += '-';
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return `${prefix}-${code}`;
}

/**
 * Validate referral code format
 */
export function isValidReferralCode(code: string): boolean {
  return /^CC-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code);
}

/**
 * Create shareable URL with referral code
 */
export function createReferralUrl(referralCode: string, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://urakompassi.com');
  return `${base}/test?ref=${referralCode}`;
}

/**
 * Extract referral code from URL
 */
export function extractReferralCodeFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref');
  
  if (ref && isValidReferralCode(ref)) {
    return ref;
  }
  
  return null;
}

/**
 * Store referral data in localStorage
 */
export function storeReferralData(data: ReferralData): void {
  if (typeof window === 'undefined') return;
  safeSetItem('careerCompassiReferral', data);
}

/**
 * Get stored referral data
 */
export function getStoredReferralData(): ReferralData | null {
  if (typeof window === 'undefined') return null;
  return safeGetItem<ReferralData>('careerCompassiReferral', null);
}

/**
 * Track referral event (call this when user completes test with referral code)
 */
export async function trackReferral(referralCode: string, userId?: string): Promise<boolean> {
  try {
    // Store locally for now (in the future, send to an API endpoint)
    storeReferralData({
      referralCode,
      referrerUserId: userId,
      timestamp: new Date().toISOString(),
    });

    return true;
  } catch {
    return false;
  }
}

/**
 * Create share text for social media
 */
export function createShareText(topCareers: string[], referralCode?: string): string {
  const careersText = topCareers.slice(0, 3).join(', ');
  const baseText = `Löysin urapolku-testin avulla sopivat ammatit: ${careersText}! 🔍`;
  
  if (referralCode) {
    return `${baseText}\n\nKokeile itse: ${createReferralUrl(referralCode)}`;
  }
  
  return `${baseText}\n\nKokeile itse: https://urakompassi.com/test`;
}

