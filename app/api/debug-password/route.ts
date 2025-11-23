/**
 * DEBUG ENDPOINT - Check if site password is configured
 * REMOVE THIS FILE AFTER DEBUGGING
 */

import { NextResponse } from 'next/server';
import { sitePasswordIsConfigured } from '@/lib/siteAuth';

export async function GET() {
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
