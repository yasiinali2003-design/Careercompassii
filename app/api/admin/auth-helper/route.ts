import { NextRequest, NextResponse } from 'next/server';

/**
 * Helper endpoint to authenticate admin via password
 * This sets the admin_auth cookie directly
 */
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    const adminPass = process.env.ADMIN_PASSWORD || '';
    const expectedPassword = adminPass || 'CCYHAHAIKUNZIBBI22!';
    
    if (password === expectedPassword) {
      const response = NextResponse.json({ success: true });
      
      // Set admin auth cookie
      response.cookies.set('admin_auth', 'yes', {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 8, // 8 hours
        path: '/',
      });
      
      // Also set teacher auth cookies for compatibility
      const adminTeacherId = process.env.ADMIN_TEACHER_ID || '';
      if (adminTeacherId) {
        response.cookies.set('teacher_auth_token', 'authenticated', {
          httpOnly: true,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 8,
          path: '/',
        });
        response.cookies.set('teacher_id', adminTeacherId, {
          httpOnly: true,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 8,
          path: '/',
        });
      }
      
      return response;
    }
    
    return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}










