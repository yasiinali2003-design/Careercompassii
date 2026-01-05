/**
 * CSRF Protection for Urakompassi
 *
 * Uses the double-submit cookie pattern:
 * 1. Server sets a CSRF token in a cookie
 * 2. Client sends the same token in a header
 * 3. Server verifies they match
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateSecureToken } from './security';

const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';
const CSRF_TOKEN_LENGTH = 32;

/**
 * Generate a new CSRF token
 */
export function generateCsrfToken(): string {
  return generateSecureToken(CSRF_TOKEN_LENGTH);
}

/**
 * Set CSRF token cookie on a response
 */
export function setCsrfCookie(response: NextResponse, token?: string): string {
  const csrfToken = token || generateCsrfToken();

  response.cookies.set(CSRF_COOKIE_NAME, csrfToken, {
    httpOnly: false, // Must be readable by JavaScript
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });

  return csrfToken;
}

/**
 * Verify CSRF token from request
 * Returns true if valid, false otherwise
 */
export function verifyCsrfToken(request: NextRequest): boolean {
  // Get token from cookie
  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;

  // Get token from header
  const headerToken = request.headers.get(CSRF_HEADER_NAME);

  // Both must be present and match
  if (!cookieToken || !headerToken) {
    return false;
  }

  // Timing-safe comparison
  if (cookieToken.length !== headerToken.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < cookieToken.length; i++) {
    result |= cookieToken.charCodeAt(i) ^ headerToken.charCodeAt(i);
  }

  return result === 0;
}

/**
 * CSRF validation middleware helper
 * Use in API routes that handle state-changing operations
 */
export function requireCsrf(request: NextRequest): { valid: boolean; error?: string } {
  // Skip CSRF check for GET, HEAD, OPTIONS
  const method = request.method.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return { valid: true };
  }

  // Check Origin header
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');

  if (origin) {
    try {
      const originUrl = new URL(origin);
      const expectedHost = host?.split(':')[0];

      if (originUrl.hostname !== expectedHost && originUrl.hostname !== 'localhost') {
        return { valid: false, error: 'Invalid origin' };
      }
    } catch {
      return { valid: false, error: 'Malformed origin header' };
    }
  }

  // Verify CSRF token
  if (!verifyCsrfToken(request)) {
    return { valid: false, error: 'Invalid CSRF token' };
  }

  return { valid: true };
}

/**
 * Create a CSRF error response
 */
export function csrfErrorResponse(): NextResponse {
  return NextResponse.json(
    { success: false, error: 'CSRF token validation failed' },
    { status: 403 }
  );
}

/**
 * Get CSRF token from cookie (client-side helper)
 * To be used in browser code
 */
export function getCsrfTokenFromCookie(): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === CSRF_COOKIE_NAME) {
      return value;
    }
  }

  return null;
}

/**
 * Fetch wrapper that automatically includes CSRF token
 * Use this instead of fetch() for state-changing requests
 */
export async function csrfFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const csrfToken = getCsrfTokenFromCookie();

  const headers = new Headers(options.headers);

  if (csrfToken) {
    headers.set(CSRF_HEADER_NAME, csrfToken);
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: 'same-origin',
  });
}
