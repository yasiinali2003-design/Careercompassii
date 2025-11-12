import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { sitePasswordIsConfigured } from '@/lib/siteAuth';

/**
 * Teacher Dashboard Protection Middleware
 * Protects all /teacher/* routes except /teacher/login
 * Uses cookie-based authentication with teacher access code
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin-only protection: hide existence by returning 404 for non-admins
  // Only apply to page routes, not API routes (API routes handle their own auth)
  const disableAdminBasicAuth = process.env.NEXT_PUBLIC_DISABLE_ADMIN_BASIC_AUTH === 'true';

  if (!disableAdminBasicAuth && pathname.startsWith('/admin') && !pathname.startsWith('/api/admin')) {
    // If a password is configured, enforce Basic Auth first
    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || '';
    let basicAuthed = false;
    if (adminPass) {
      const auth = request.headers.get('authorization') || '';
      const expected = 'Basic ' + Buffer.from(`${adminUser}:${adminPass}`).toString('base64');
      if (auth !== expected) {
        return new NextResponse('Authentication required', {
          status: 401,
          headers: { 'WWW-Authenticate': 'Basic realm="Admin", charset="UTF-8"' }
        });
      }
      basicAuthed = true;
    }

    const teacherToken = request.cookies.get('teacher_auth_token');
    const teacherId = request.cookies.get('teacher_id');
    const adminId = process.env.ADMIN_TEACHER_ID || '';
    const isAuthed = teacherToken && teacherToken.value === 'authenticated';
    const isAdmin = teacherId && adminId && teacherId.value === adminId;

    // Allow access if either Basic Auth is valid OR user is the admin teacher
    if (!(basicAuthed || (isAuthed && isAdmin))) {
      return new NextResponse('Not Found', { status: 404 });
    }

    // If authenticated via Basic Auth, mint a short-lived admin session cookie
    const response = NextResponse.next();
    if (basicAuthed) {
      response.cookies.set('admin_auth', 'yes', {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 8, // 8 hours
        path: '/',
      });
    }
    return response;
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
  const localHosts = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1']);
  const isLocalhost = localHosts.has(request.nextUrl.hostname);
  const isProduction = request.nextUrl.hostname.includes('careercompassi.com') || request.nextUrl.hostname.includes('vercel.app');

  if (pathname === '/kouluille') {
    if (isProduction) {
      // In production: hide the page completely (404)
      return new NextResponse('Not Found', { status: 404 });
    }
    // In localhost: allow access without authentication
    // (No Basic Auth requirement for development)
  }

  // Site-wide password protection (via /site-auth page)
  // Only enable on production domain, not on localhost
  const sitePasswordEnabled = !isLocalhost && isProduction && sitePasswordIsConfigured();
  
  if (sitePasswordEnabled) {
    // Always allow access to site auth page and its API
    if (pathname === '/site-auth' || pathname === '/api/site-auth') {
      return NextResponse.next();
    }

    // Exclude routes that have their own auth or are needed for functionality
    const segments = pathname.split('/').filter(Boolean);
    const firstSegment = segments[0];
    const base64UrlTokenRegex = /^[A-Za-z0-9_-]{16,}$/;
    const looksLikeClassTokenRoute =
      Boolean(firstSegment && base64UrlTokenRegex.test(firstSegment)) &&
      (segments.length === 1 ||
        (segments.length === 2 && (segments[1] === 'test' || segments[1].startsWith('reports') || segments[1] === 'results' || segments[1] === 'analytics')) ||
        (segments.length > 2 && segments[1] === 'reports'));

    const isExcluded = 
      pathname.startsWith('/teacher') ||
      pathname.startsWith('/admin') ||
      pathname === '/kouluille' || // Already handled above
      (pathname.startsWith('/api') && pathname !== '/api/site-auth') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/favicon') ||
      looksLikeClassTokenRoute;

    if (!isExcluded) {
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

  // Allow all other routes
  return NextResponse.next();
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

