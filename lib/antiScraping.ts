/**
 * COMPREHENSIVE ANTI-SCRAPING PROTECTION
 * Multiple layers of protection against scraping and bot attacks
 */

import crypto from 'crypto';

// Known bot user agents
const BOT_USER_AGENTS = [
  'bot', 'crawler', 'spider', 'scraper', 'scrape', 'curl', 'wget', 'python',
  'requests', 'scrapy', 'beautifulsoup', 'selenium', 'headless', 'phantom',
  'puppeteer', 'playwright', 'mechanize', 'httpx', 'aiohttp', 'urllib',
  'go-http-client', 'java/', 'okhttp', 'apache', 'httpclient', 'node-fetch',
  'axios', 'postman', 'insomnia', 'httpie', 'restclient', 'restsharp',
  'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider', 'yandex',
  'facebookexternalhit', 'twitterbot', 'linkedinbot', 'whatsapp', 'telegram',
  'discordbot', 'slackbot', 'applebot', 'ia_archiver', 'archive.org',
  'semrushbot', 'ahrefsbot', 'mj12bot', 'dotbot', 'blexbot', 'petalbot',
  'megaindex', 'sogou', 'exabot', 'facebot', 'ia_archiver'
];

// Suspicious patterns
const SUSPICIOUS_PATTERNS = {
  // Missing common browser headers
  missingHeaders: ['accept', 'accept-language', 'accept-encoding'],
  // Suspicious referer patterns
  suspiciousReferers: ['localhost', '127.0.0.1', 'test', 'scraper'],
  // Too many requests too fast
  rapidRequests: 10, // requests per minute threshold
};

/**
 * Check if user agent indicates a bot
 */
export function isBotUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return true; // No UA = suspicious
  
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot));
}

/**
 * Check if request has suspicious characteristics
 */
export function isSuspiciousRequest(request: Request): {
  suspicious: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];
  const headers = request.headers;
  
  // Check user agent
  const userAgent = headers.get('user-agent');
  if (isBotUserAgent(userAgent)) {
    reasons.push('bot_user_agent');
  }
  
  // Check for missing browser headers
  const missingHeaders = SUSPICIOUS_PATTERNS.missingHeaders.filter(
    header => !headers.get(header)
  );
  if (missingHeaders.length > 0) {
    reasons.push(`missing_headers:${missingHeaders.join(',')}`);
  }
  
  // Check referer
  const referer = headers.get('referer');
  if (referer) {
    const refLower = referer.toLowerCase();
    if (SUSPICIOUS_PATTERNS.suspiciousReferers.some(pattern => refLower.includes(pattern))) {
      reasons.push('suspicious_referer');
    }
  } else {
    // Missing referer on non-API routes is suspicious
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api') && !url.pathname.startsWith('/_next')) {
      reasons.push('missing_referer');
    }
  }
  
  // Check for automation tools
  const automationHeaders = [
    'x-requested-with',
    'x-automation',
    'x-scraper',
    'x-bot'
  ];
  if (automationHeaders.some(h => headers.get(h))) {
    reasons.push('automation_header');
  }
  
  // Check accept header (browsers usually send specific types)
  const accept = headers.get('accept');
  if (accept && !accept.includes('text/html') && !accept.includes('*/*')) {
    reasons.push('unusual_accept');
  }
  
  return {
    suspicious: reasons.length > 0,
    reasons
  };
}

/**
 * Generate request fingerprint for tracking
 */
export function generateFingerprint(request: Request): string {
  const headers = request.headers;
  const components = [
    headers.get('user-agent') || 'no-ua',
    headers.get('accept-language') || 'no-lang',
    headers.get('accept-encoding') || 'no-enc',
    headers.get('accept') || 'no-accept',
    headers.get('sec-ch-ua') || 'no-sec-ch',
    headers.get('sec-ch-ua-platform') || 'no-platform',
  ];
  
  const fingerprint = components.join('|');
  return crypto
    .createHash('sha256')
    .update(fingerprint)
    .digest('hex')
    .substring(0, 16);
}

/**
 * Check if IP is in suspicious IP ranges (known hosting/VPS providers)
 */
export function isSuspiciousIP(ip: string): boolean {
  // Common hosting/VPS IP patterns (simplified - in production use IP intelligence API)
  const suspiciousPatterns = [
    /^54\./, // AWS
    /^52\./, // AWS
    /^35\./, // Google Cloud
    /^104\./, // Google Cloud
    /^159\./, // DigitalOcean
    /^188\./, // DigitalOcean
    /^178\./, // Hetzner
    /^95\./,  // OVH
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(ip));
}

/**
 * Rate limit configuration for suspicious requests
 */
export const SCRAPING_RATE_LIMITS = {
  suspicious: {
    maxRequestsPerMinute: 5,
    maxRequestsPerHour: 20,
    maxRequestsPerDay: 100,
  },
  normal: {
    maxRequestsPerMinute: 30,
    maxRequestsPerHour: 200,
    maxRequestsPerDay: 1000,
  }
};

/**
 * Check if request should be challenged (CAPTCHA, etc.)
 */
export function shouldChallenge(request: Request, requestCount: number): boolean {
  const suspicious = isSuspiciousRequest(request);
  
  // Challenge if suspicious and high request count
  if (suspicious.suspicious && requestCount > 10) {
    return true;
  }
  
  // Challenge if very high request count
  if (requestCount > 100) {
    return true;
  }
  
  return false;
}

/**
 * Generate honeypot field name (changes periodically)
 */
export function getHoneypotFieldName(): string {
  const date = new Date();
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const fields = ['website', 'url', 'homepage', 'company', 'organization'];
  return fields[dayOfYear % fields.length] + '_' + (dayOfYear % 100);
}

/**
 * Check if honeypot field was filled (indicates bot)
 */
export function isHoneypotFilled(formData: FormData, honeypotField: string): boolean {
  const value = formData.get(honeypotField);
  return value !== null && value !== '';
}


