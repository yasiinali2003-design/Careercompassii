import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Teacher Dashboard Protection Middleware
 * Protects all /teacher/* routes except /teacher/login
 * Uses cookie-based authentication with teacher access code
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

  // Allow all other routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes, but we'll manually handle /api/teacher-auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

