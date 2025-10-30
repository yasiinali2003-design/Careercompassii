import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Teacher Dashboard Protection Middleware
 * Protects all /teacher/* routes except /teacher/login
 * Uses cookie-based authentication with teacher access code
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin-only protection: hide existence by returning 404 for non-admins
  if (pathname.startsWith('/admin')) {
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

