import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import crypto from 'crypto';
import { sitePasswordIsConfigured } from '@/lib/siteAuth';
import { isBotUserAgent, isSuspiciousRequest, shouldChallenge } from '@/lib/antiScraping';
import { trackRequest, analyzeRequestPatterns, getIP } from '@/lib/botDetection';

/**
 * Teacher Dashboard Protection Middleware
 * Protects all /teacher/* routes except /teacher/login
 * Uses cookie-based authentication with teacher access code
 */

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
        // Redirect to challenge page (we'll create this)
        const challengeUrl = new URL('/challenge', request.url);
        challengeUrl.searchParams.set('returnTo', pathname);
        challengeUrl.searchParams.set('token', crypto.randomBytes(16).toString('hex'));
        return NextResponse.redirect(challengeUrl);
      }
    }
  }

  // Block analytics API for GDPR compliance - admin should only generate teacher codes
  if (pathname.startsWith('/api/admin/school-analytics')) {
    return new NextResponse('Not Found', { status: 404 });
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

    // If no token, redirect to login
    if (!teacherToken || teacherToken.value !== 'authenticated') {
      const loginUrl = new URL('/teacher/login', request.url);
      // Add return URL so we can redirect back after login
      loginUrl.searchParams.set('returnTo', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Authenticated - allow access
    return NextResponse.next();
  }

  // Hide /kouluille page from public in production
  // Allow admin access in localhost
  const isProduction = request.nextUrl.hostname.includes('urakompassi.fi') || request.nextUrl.hostname.includes('vercel.app');

  if (pathname === '/kouluille') {
    if (isProduction) {
      // In production: hide the page completely (404)
      return new NextResponse('Not Found', { status: 404 });
    }
    // In localhost: allow access without authentication
    // (No Basic Auth requirement for development)
  }

  // Protected routes password protection (via /site-auth page)
  // Protects ALL routes in production (full auth wall)
  // Localhost is always allowed (development bypass)
  const sitePasswordEnabled = !isLocalhost && sitePasswordIsConfigured();

  if (sitePasswordEnabled) {
    // Always allow access to site auth page and its API
    if (pathname === '/site-auth' || pathname === '/api/site-auth') {
      return NextResponse.next();
    }

    // Protect ALL routes - full site lockdown
    // Only exceptions: /site-auth page itself and API routes
    const isProtectedRoute = !pathname.startsWith('/api/');

    if (isProtectedRoute) {
      // Check for site authentication cookie
      const siteAuth = request.cookies.get('site_auth');

      if (!siteAuth || siteAuth.value !== 'authenticated') {
        // Redirect to site auth page
        const authUrl = new URL('/site-auth', request.url);
        authUrl.searchParams.set('returnTo', pathname);
        return NextResponse.redirect(authUrl);
      }
    }
  }

  // ANTI-SCRAPING PROTECTION LAYER 2: Add Security Headers
  const response = NextResponse.next();
  
  // Security headers to prevent scraping and attacks
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Content Security Policy - relaxed for localhost development
  if (isLocalhost) {
    // More permissive CSP for localhost to allow Next.js dev mode features
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; style-src 'self' 'unsafe-inline' data:; img-src 'self' data: blob: https:; font-src 'self' data: blob:; connect-src 'self' ws: wss: http: https:; frame-ancestors 'none';"
    );
  } else {
    // Strict CSP for production
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';"
    );
  }
  
  // Prevent caching of sensitive pages
  if (pathname.startsWith('/teacher') || pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
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
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

