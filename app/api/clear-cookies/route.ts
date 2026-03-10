import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/teacher/login', request.url));

  // Clear all teacher-related cookies
  response.cookies.delete('teacher_id');
  response.cookies.delete('teacher_auth_token');
  response.cookies.delete('csrf_token');

  return response;
}
