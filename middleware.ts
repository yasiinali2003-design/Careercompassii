import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { sitePasswordIsConfigured } from '@/lib/siteAuth';
import { isBotUserAgent, isSuspiciousRequest, shouldChallenge } from '@/lib/antiScraping';
import { trackRequest, analyzeRequestPatterns, getIP } from '@/lib/botDetection';

// Edge-compatible random bytes generator using Web Crypto API
function generateRandomHex(bytes: number): string {
  const randomBytes = new Uint8Array(bytes);
  crypto.getRandomValues(randomBytes);
  return Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Security Middleware for Urakompassi
 * - Teacher Dashboard Protection
 * - Anti-Scraping
 * - Security Headers (HSTS, CSP, etc.)
 * - CSRF Token Generation
 * - Session Validation
 */

// Validate session token format (timestamp.random)
function isValidSessionToken(token: string): boolean {
  if (!token || typeof token !== 'string') {
    return false;
  }

  // Check for the new secure token format (timestamp.random)
  const parts = token.split('.');
  if (parts.length === 2) {
    const [timestampHex, random] = parts;

    // Validate random part length (48 hex chars = 24 bytes)
    if (!random || random.length !== 48) {
      return false;
    }

    // Validate timestamp
    try {
      const timestamp = parseInt(timestampHex, 16);
      if (isNaN(timestamp)) {
        return false;
      }

      const now = Date.now();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      // Check if token is expired
      if (now - timestamp > maxAge) {
        return false;
      }

      // Check if token is from the future (clock skew tolerance: 5 minutes)
      if (timestamp > now + 5 * 60 * 1000) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  return false;
}

// Generate CSRF token
function generateCsrfToken(): string {
  return generateRandomHex(32);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ANTI-SCRAPING PROTECTION LAYER 1: Bot Detection
  // Skip bot detection for localhost (development) and static assets
  const localHosts = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1']);
  const hostname = request.nextUrl.hostname || '';
  const isLocalhost = localHosts.has(hostname) || hostname.includes('localhost') || hostname.includes('127.0.0.1');

  const skipBotCheck =
    isLocalhost || // Skip all bot detection on localhost
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/teacher-auth') ||
    pathname.startsWith('/api/site-auth') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf|eot)$/);

  if (!skipBotCheck) {
    const userAgent = request.headers.get('user-agent');

    // Block known bots immediately (except search engines for SEO)
    if (userAgent && isBotUserAgent(userAgent)) {
      const isSearchEngine = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandex/i.test(userAgent);

      if (!isSearchEngine) {
        // Track and block
        const ip = getIP(request);
        await trackRequest(request, ip, pathname);

        return new NextResponse('Access Denied', {
          status: 403,
          headers: {
            'X-Bot-Detected': 'true',
            'Retry-After': '3600'
          }
        });
      }
    }

    // Check for suspicious request patterns
    const suspicious = isSuspiciousRequest(request);
    if (suspicious.suspicious) {
      const ip = getIP(request);
      await trackRequest(request, ip, pathname);

      // Analyze patterns
      const analysis = await analyzeRequestPatterns(request, ip);

      if (analysis.action === 'block') {
        return new NextResponse('Access Denied - Suspicious Activity Detected', {
          status: 403,
          headers: {
            'X-Bot-Detected': 'true',
            'X-Bot-Confidence': analysis.confidence.toString(),
            'Retry-After': '3600'
          }
        });
      }

      if (analysis.action === 'challenge') {
        // Redirect to challenge page
        const challengeUrl = new URL('/challenge', request.url);
        challengeUrl.searchParams.set('returnTo', pathname);
        challengeUrl.searchParams.set('token', generateRandomHex(16));
        return NextResponse.redirect(challengeUrl);
      }
    }
  }

  // Block debug/test endpoints in production
  if (!isLocalhost) {
    const debugEndpoints = [
      '/api/test-env',
      '/api/debug-password',
      '/api/debug-results',
      '/api/test-classes',
      '/api/test-system-complete',
      '/api/test-education-path',
      '/api/test-parent-report',
      '/api/test-category-focus',
      '/api/test-category-weighting',
      '/api/simple-class-test',
      '/api/admin/school-analytics'
    ];

    if (debugEndpoints.some(endpoint => pathname.startsWith(endpoint))) {
      return new NextResponse('Not Found', { status: 404 });
    }
  }

  // Admin pages: completely hidden in production, accessible only on localhost
  if (pathname.startsWith('/admin') && !pathname.startsWith('/api/admin')) {
    // In production: hide completely (404)
    if (!isLocalhost) {
      return new NextResponse('Not Found', { status: 404 });
    }
    // On localhost: allow access without authentication
    return NextResponse.next();
  }

  // Only protect /teacher/* routes (except /teacher/login and /api/teacher-auth)
  if (pathname.startsWith('/teacher')) {
    // Allow access to login page and auth API
    if (pathname === '/teacher/login' || pathname.startsWith('/api/teacher-auth')) {
      return NextResponse.next();
    }

    // Check for teacher authentication cookie
    const teacherToken = request.cookies.get('teacher_auth_token');

    // Validate the session token
    if (!teacherToken || !isValidSessionToken(teacherToken.value)) {
      const loginUrl = new URL('/teacher/login', request.url);
      // Add return URL so we can redirect back after login
      loginUrl.searchParams.set('returnTo', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Authenticated - allow access
    return NextResponse.next();
  }

  // Hide /kouluille page from public in production
  const isProduction = request.nextUrl.hostname.includes('urakompassi.fi') || request.nextUrl.hostname.includes('vercel.app');

  if (pathname === '/kouluille') {
    if (isProduction) {
      return new NextResponse('Not Found', { status: 404 });
    }
  }

  // Protected routes password protection (via /site-auth page)
  const sitePasswordEnabled = !isLocalhost && sitePasswordIsConfigured();

  if (sitePasswordEnabled) {
    // Always allow access to site auth page and its API
    if (pathname === '/site-auth' || pathname === '/api/site-auth') {
      return NextResponse.next();
    }

    // Protect ALL routes - full site lockdown
    const isProtectedRoute = !pathname.startsWith('/api/');

    if (isProtectedRoute) {
      // Check for site authentication cookie
      const siteAuth = request.cookies.get('site_auth');

      if (!siteAuth || !isValidSessionToken(siteAuth.value)) {
        // Redirect to site auth page
        const authUrl = new URL('/site-auth', request.url);
        authUrl.searchParams.set('returnTo', pathname);
        return NextResponse.redirect(authUrl);
      }
    }
  }

  // Create response with security headers
  const response = NextResponse.next();

  // ============================================================================
  // SECURITY HEADERS
  // ============================================================================

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // XSS Protection (legacy, but still useful)
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=()');

  // HSTS - Strict Transport Security (production only)
  if (!isLocalhost) {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // Cross-Origin policies
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');

  // Content Security Policy
  if (isLocalhost) {
    // More permissive CSP for localhost to allow Next.js dev mode features
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob: https:",
        "font-src 'self' data:",
        "connect-src 'self' ws: wss: http: https:",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'"
      ].join('; ')
    );
  } else {
    // Production CSP - 'unsafe-eval' removed for security
    // Note: 'unsafe-inline' is required for Next.js but XSS is mitigated by:
    // 1. React's automatic escaping of JSX
    // 2. Strict input sanitization in all API routes
    // 3. CSRF protection on all state-changing operations
    // To fully remove 'unsafe-inline', implement CSP nonces in next.config.js
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self' data:",
        "connect-src 'self' https:",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "upgrade-insecure-requests"
      ].join('; ')
    );
  }

  // Prevent caching of sensitive pages
  if (pathname.startsWith('/teacher') || pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  // Set CSRF token cookie if not present
  const csrfToken = request.cookies.get('csrf_token');
  if (!csrfToken) {
    const newToken = generateCsrfToken();
    response.cookies.set('csrf_token', newToken, {
      httpOnly: false, // Must be readable by JavaScript
      secure: !isLocalhost,
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes - handle their own auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon (favicon files - .ico, .png, .svg)
     * - og-image (Open Graph images)
     * - logo (logo files)
     * - apple-touch-icon (Apple touch icons)
     * - Static image files (.png, .jpg, .svg, .ico)
     */
    '/((?!api|_next/static|_next/image|favicon|og-image|logo|apple-touch-icon|.*\\.png$|.*\\.ico$|.*\\.svg$).*)',
  ],
};
