/**
 * ADVANCED BOT DETECTION
 * Behavioral analysis and fingerprinting
 */

import { supabaseAdmin } from './supabase';
import crypto from 'crypto';
import { generateFingerprint, isSuspiciousRequest, SCRAPING_RATE_LIMITS } from './antiScraping';

interface BotDetectionResult {
  isBot: boolean;
  confidence: number; // 0-100
  reasons: string[];
  action: 'allow' | 'challenge' | 'block';
}

/**
 * Track request for behavioral analysis
 */
export async function trackRequest(
  request: Request,
  ip: string,
  pathname: string
): Promise<void> {
  // Skip tracking for localhost
  if (ip === 'unknown' || ip === '127.0.0.1' || ip === '::1' || ip.includes('localhost')) {
    return;
  }
  
  if (!supabaseAdmin) return;
  
  try {
    const fingerprint = generateFingerprint(request);
    const suspicious = isSuspiciousRequest(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Hash IP for GDPR compliance
    const hashedIP = crypto
      .createHash('sha256')
      .update(ip + (process.env.RATE_LIMIT_SALT || 'default-salt'))
      .digest('hex');
    
    // Store request metadata (only basic fields that exist in rate_limits table)
    await supabaseAdmin.from('rate_limits').insert({
      hashed_ip: hashedIP,
      created_at: new Date().toISOString()
      // Note: Additional fields (fingerprint, user_agent_hash, pathname, suspicious) 
      // can be added to the database schema if needed for enhanced tracking
    });
  } catch (error) {
    console.error('[BotDetection] Error tracking request:', error);
  }
}

/**
 * Analyze request patterns to detect bots
 */
export async function analyzeRequestPatterns(
  request: Request,
  ip: string
): Promise<BotDetectionResult> {
  // Skip analysis for localhost
  if (ip === 'unknown' || ip === '127.0.0.1' || ip === '::1' || ip.includes('localhost')) {
    return {
      isBot: false,
      confidence: 0,
      reasons: [],
      action: 'allow'
    };
  }
  
  const reasons: string[] = [];
  let confidence = 0;
  
  // Basic checks
  const suspicious = isSuspiciousRequest(request);
  if (suspicious.suspicious) {
    reasons.push(...suspicious.reasons);
    confidence += 30;
  }
  
  // Check request frequency (if we have data)
  if (supabaseAdmin) {
    try {
      const fingerprint = generateFingerprint(request);
      const hashedIP = crypto
        .createHash('sha256')
        .update(ip + (process.env.RATE_LIMIT_SALT || 'default-salt'))
        .digest('hex');
      
      const now = new Date();
      const minuteAgo = new Date(now.getTime() - 60 * 1000);
      const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      
      // Check recent requests (using hashed IP only - fingerprint field may not exist)
      const { data } = await supabaseAdmin
        .from('rate_limits')
        .select('*')
        .eq('hashed_ip', hashedIP)
        .gte('created_at', hourAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(1000);
      
      const requestsInMinute = data?.filter(
        (r: { created_at: string }) => new Date(r.created_at) >= minuteAgo
      ).length || 0;
      
      const requestsInHour = data?.length || 0;
      
      // Check for rapid requests
      if (requestsInMinute > SCRAPING_RATE_LIMITS.suspicious.maxRequestsPerMinute) {
        reasons.push('rapid_requests');
        confidence += 40;
      }
      
      // Check for high volume
      if (requestsInHour > SCRAPING_RATE_LIMITS.suspicious.maxRequestsPerHour) {
        reasons.push('high_volume');
        confidence += 30;
      }
      
      // Check for pattern (same path repeatedly)
      const paths = data?.map((r: { pathname: string }) => r.pathname) || [];
      const uniquePaths = new Set(paths);
      if (paths.length > 10 && uniquePaths.size < 3) {
        reasons.push('repetitive_pattern');
        confidence += 25;
      }
    } catch (error) {
      console.error('[BotDetection] Error analyzing patterns:', error);
    }
  }
  
  // Determine action
  let action: 'allow' | 'challenge' | 'block' = 'allow';
  if (confidence >= 80) {
    action = 'block';
  } else if (confidence >= 50) {
    action = 'challenge';
  }
  
  return {
    isBot: confidence >= 50,
    confidence,
    reasons,
    action
  };
}

/**
 * Get IP from request
 */
export function getIP(request: Request): string {
  // Check if request is from localhost by checking hostname
  const url = new URL(request.url);
  const hostname = url.hostname || '';
  const localHosts = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
  if (localHosts.includes(hostname) || hostname.includes('localhost')) {
    return '127.0.0.1';
  }
  
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (cfConnectingIP) {
    return cfConnectingIP.split(',')[0].trim();
  }
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP.trim();
  }
  
  return 'unknown';
}

