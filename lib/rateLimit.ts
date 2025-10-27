/**
 * RATE LIMITING UTILITY
 * GDPR-compliant rate limiting using hashed IP addresses
 */

import { supabaseAdmin } from './supabase';
import crypto from 'crypto';

// Rate limit configuration
const RATE_LIMIT_CONFIG = {
  maxRequestsPerHour: 10, // Max 10 tests per hour per IP
  maxRequestsPerDay: 50,  // Max 50 tests per day per IP
  windowHours: 1,          // 1 hour window for hourly limit
  windowDays: 24           // 24 hour window for daily limit
};

// Salt for hashing (should be in environment variable in production)
const HASH_SALT = process.env.RATE_LIMIT_SALT || 'careercompassi-default-salt-2025';

/**
 * Hash IP address for GDPR compliance
 */
function hashIP(ip: string): string {
  return crypto
    .createHash('sha256')
    .update(ip + HASH_SALT)
    .digest('hex');
}

/**
 * Get user's IP address from request
 */
function getIP(request: Request): string {
  // Try various headers that might contain the real IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  // Use Cloudflare IP if available (Vercel uses Cloudflare)
  if (cfConnectingIP) {
    // Take first IP if multiple (e.g., "ip1, ip2")
    return cfConnectingIP.split(',')[0].trim();
  }
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP.trim();
  }
  
  // Fallback (shouldn't happen in production)
  return 'unknown';
}

/**
 * Check if request should be rate limited
 * Returns null if OK, error response if rate limited
 */
export async function checkRateLimit(request: Request): Promise<{ limit: boolean; message?: string; headers?: Record<string, string> } | null> {
  try {
    // Get and hash IP
    const ip = getIP(request);
    const hashedIP = hashIP(ip);
    
    console.log(`[RateLimit] Checking for hashed IP: ${hashedIP.substring(0, 8)}...`);
    
    // Check Supabase for existing records
    if (!supabaseAdmin) {
      console.warn('[RateLimit] Supabase not configured, skipping rate limit check');
      return null; // Allow if no DB configured
    }
    
    const now = new Date();
    const hourAgo = new Date(now.getTime() - RATE_LIMIT_CONFIG.windowHours * 60 * 60 * 1000);
    const dayAgo = new Date(now.getTime() - RATE_LIMIT_CONFIG.windowDays * 60 * 60 * 1000);
    
    // Query rate limit table
    const { data, error } = await supabaseAdmin
      .from('rate_limits')
      .select('*')
      .eq('hashed_ip', hashedIP)
      .gte('created_at', dayAgo.toISOString())
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('[RateLimit] Error querying rate limits:', error);
      // Don't block on error - fail open
      return null;
    }
    
    // Count requests in different windows
    const requestsInHour = data?.filter((r: { created_at: string }) => new Date(r.created_at) >= hourAgo)?.length || 0;
    const requestsInDay = data?.length || 0;
    
    // Check hourly limit
    if (requestsInHour >= RATE_LIMIT_CONFIG.maxRequestsPerHour) {
      const oldestInWindow = data?.find((r: { created_at: string }) => new Date(r.created_at) >= hourAgo);
      const retryAfter = oldestInWindow 
        ? Math.ceil((new Date(oldestInWindow.created_at).getTime() + 60 * 60 * 1000 - now.getTime()) / 1000)
        : 3600;
      
      return {
        limit: true,
        message: 'Too many requests. Please try again later.',
        headers: {
          'X-RateLimit-Limit': RATE_LIMIT_CONFIG.maxRequestsPerHour.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(now.getTime() + 60 * 60 * 1000).toISOString(),
          'Retry-After': retryAfter.toString()
        }
      };
    }
    
    // Check daily limit
    if (requestsInDay >= RATE_LIMIT_CONFIG.maxRequestsPerDay) {
      const oldestRequest = data?.[data.length - 1];
      const retryAfter = oldestRequest
        ? Math.ceil((new Date(oldestRequest.created_at).getTime() + 24 * 60 * 60 * 1000 - now.getTime()) / 1000)
        : 86400;
      
      return {
        limit: true,
        message: 'Daily limit exceeded. Please try again tomorrow.',
        headers: {
          'X-RateLimit-Limit': RATE_LIMIT_CONFIG.maxRequestsPerDay.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
          'Retry-After': retryAfter.toString()
        }
      };
    }
    
    // All good! Record this request
    await supabaseAdmin
      .from('rate_limits')
      .insert({
        hashed_ip: hashedIP,
        created_at: now.toISOString()
      });
    
    // Log for debugging
    const remainingHour = RATE_LIMIT_CONFIG.maxRequestsPerHour - requestsInHour - 1;
    const remainingDay = RATE_LIMIT_CONFIG.maxRequestsPerDay - requestsInDay - 1;
    console.log(`[RateLimit] OK - Remaining: ${remainingHour} per hour, ${remainingDay} per day`);
    
    return null; // No rate limit applied
  } catch (error) {
    console.error('[RateLimit] Unexpected error:', error);
    // Fail open - don't block requests on errors
    return null;
  }
}

/**
 * Clean up old rate limit records (should run periodically)
 */
export async function cleanupRateLimits(): Promise<void> {
  if (!supabaseAdmin) return;
  
  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7); // Keep 7 days of history
    
    await supabaseAdmin
      .from('rate_limits')
      .delete()
      .lt('created_at', cutoff.toISOString());
    
    console.log('[RateLimit] Cleaned up old rate limit records');
  } catch (error) {
    console.error('[RateLimit] Error cleaning up rate limits:', error);
  }
}

