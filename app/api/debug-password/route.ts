/**
 * DEBUG ENDPOINT - Check if site password is configured
 * LOCALHOST ONLY - Returns 404 in production
 */

import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { sitePasswordIsConfigured } from '@/lib/siteAuth';

export async function GET(request: NextRequest) {
  // Security: Only allow on localhost
  const host = request.headers.get('host') || '';
  if (!host.includes('localhost') && !host.includes('127.0.0.1')) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const isConfigured = sitePasswordIsConfigured();

  return NextResponse.json({
    passwordConfigured: isConfigured,
    nodeEnv: process.env.NODE_ENV,
    hasSitePassword: !!process.env.SITE_PASSWORD,
    hasAdminSitePassword: !!process.env.ADMIN_SITE_PASSWORD,
    hasPlaywrightPassword: !!process.env.PLAYWRIGHT_SITE_PASSWORD,
    hasPublicSitePassword: !!process.env.NEXT_PUBLIC_SITE_PASSWORD,
    hasFallbackPassword: !!process.env.SITE_PASSWORD_FALLBACK,
  });
}

export const dynamic = 'force-dynamic';
