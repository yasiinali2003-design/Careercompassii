import { NextRequest, NextResponse } from 'next/server';

const SITE_PASSWORD = process.env.SITE_PASSWORD || 'CCYHAHAIKUNZIBBI22!';
const COOKIE_NAME = 'site_auth';
const COOKIE_VALUE = 'authenticated';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Salasana vaaditaan' },
        { status: 400 }
      );
    }

    if (password === SITE_PASSWORD) {
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
      return NextResponse.json(
        { success: false, error: 'Väärä salasana' },
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

