import { NextRequest, NextResponse } from 'next/server';

import { resolveSitePasswords, getDefaultSitePassword } from '@/lib/siteAuth';

const COOKIE_NAME = 'site_auth';
const COOKIE_VALUE = 'authenticated';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Pääsykoodi vaaditaan' },
        { status: 400 }
      );
    }

    const normalized = typeof password === 'string' ? password.trim() : '';

    if (!normalized) {
      return NextResponse.json(
        { success: false, error: 'Pääsykoodi vaaditaan' },
        { status: 400 }
      );
    }

    const allowedPasswords = resolveSitePasswords();

    if (allowedPasswords.includes(normalized)) {
      // Set authentication cookie
      const response = NextResponse.json({ success: true });
      
      response.cookies.set(COOKIE_NAME, COOKIE_VALUE, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });

      return response;
    } else {
      const defaultPasswordHint =
        process.env.NODE_ENV !== 'production' ? getDefaultSitePassword() : undefined;
      if (defaultPasswordHint && normalized === defaultPasswordHint) {
        console.warn('[Site Auth] Using default development password fallback.');
      }
      return NextResponse.json(
        { success: false, error: 'Väärä pääsykoodi' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Site auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Sisäinen virhe' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';

