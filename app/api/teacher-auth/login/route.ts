import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Teacher Login API
 * Validates teacher access code against database and sets authentication cookie
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password: accessCode } = body;

    if (!accessCode || typeof accessCode !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Opettajakoodi vaaditaan' },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    if (!supabaseAdmin) {
      console.error('[Teacher Auth] Supabase not configured');
      
      // Fallback to environment variable if database not available
      const teacherAccessCode = process.env.TEACHER_ACCESS_CODE;
      if (teacherAccessCode && accessCode === teacherAccessCode) {
        const cookieStore = await cookies();
        cookieStore.set('teacher_auth_token', 'authenticated', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
          path: '/',
        });
        return NextResponse.json({
          success: true,
          message: 'Kirjautuminen onnistui (fallback mode)',
        });
      }
      
      return NextResponse.json(
        { success: false, error: 'Autentikointi ei ole käytettävissä' },
        { status: 500 }
      );
    }

    // Look up teacher by access code (trim and normalize)
    const normalizedCode = accessCode.trim().toUpperCase();
    console.log(`[Teacher Auth] Looking up code: "${normalizedCode}"`);
    
    const { data: teacher, error } = await supabaseAdmin
      .from('teachers')
      .select('id, name, email, school_name, access_code, is_active')
      .eq('access_code', normalizedCode)
      .eq('is_active', true)
      .single();

    console.log(`[Teacher Auth] Query result:`, { 
      found: !!teacher, 
      error: error?.message,
      codeSearched: normalizedCode 
    });

    if (error || !teacher) {
      console.error('[Teacher Auth] Teacher lookup failed:', error?.message || 'No teacher found');
      return NextResponse.json(
        { success: false, error: 'Sisäänkirjautuminen epäonnistui' },
        { status: 401 }
      );
    }

    // Update last login timestamp
    await supabaseAdmin
      .from('teachers')
      .update({ last_login: new Date().toISOString() })
      .eq('id', teacher.id)
      .catch((err: any) => console.error('[Teacher Auth] Failed to update last_login:', err));

    // Set authentication cookie with teacher ID
    const cookieStore = await cookies();
    cookieStore.set('teacher_auth_token', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Also store teacher ID in a separate cookie for dashboard use
    cookieStore.set('teacher_id', teacher.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return NextResponse.json({
      success: true,
      message: 'Kirjautuminen onnistui',
      teacher: {
        id: teacher.id,
        name: teacher.name,
        school_name: teacher.school_name,
      },
    });
  } catch (error) {
    console.error('[Teacher Auth] Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Sisäänkirjautuminen epäonnistui' },
      { status: 500 }
    );
  }
}

