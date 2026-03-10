import { NextRequest, NextResponse } from 'next/server';
import { generateSessionToken } from '@/lib/security';

/**
 * Emergency auth fix endpoint
 * Sets correct teacher_id and auth_token cookies
 * Use this when cookies have wrong teacher ID
 */
export async function GET(request: NextRequest) {
  const correctTeacherId = process.env.ADMIN_TEACHER_ID || '524add1e-65ba-49f0-9a85-4139e153bb91';
  const sessionToken = generateSessionToken();

  const response = NextResponse.redirect(new URL('/teacher/classes/new', request.url));

  // Set correct teacher cookies
  response.cookies.set('teacher_id', correctTeacherId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });

  response.cookies.set('teacher_auth_token', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24,
    path: '/',
  });

  return response;
}
