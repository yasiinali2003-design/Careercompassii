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
    const { password: rawAccessCode } = body;

    if (!rawAccessCode || typeof rawAccessCode !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Opettajakoodi vaaditaan' },
        { status: 400 }
      );
    }

    const trimmedCode = rawAccessCode.trim();
    if (!trimmedCode) {
      return NextResponse.json(
        { success: false, error: 'Opettajakoodi vaaditaan' },
        { status: 400 }
      );
    }

    const candidateCodes = Array.from(new Set([
      trimmedCode,
      trimmedCode.toUpperCase(),
      trimmedCode.toLowerCase()
    ])).filter(Boolean);

    // Check if Supabase is configured
    if (!supabaseAdmin) {
      console.error('[Teacher Auth] Supabase not configured');
      
      // Fallback to environment variable if database not available
      const teacherAccessCode = process.env.TEACHER_ACCESS_CODE;
      if (teacherAccessCode && candidateCodes.includes(teacherAccessCode)) {
        const cookieStore = await cookies();
        cookieStore.set('teacher_auth_token', 'authenticated', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7,
          path: '/teacher',
        });
        // Duplicate cookie for API route access
        cookieStore.set('teacher_auth_token', 'authenticated', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7,
          path: '/api',
        });
        // Minimal teacher_id for mock mode
        cookieStore.set('teacher_id', 'mock-teacher', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7,
          path: '/teacher',
        });
        cookieStore.set('teacher_id', 'mock-teacher', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7,
          path: '/api',
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

    console.log('[Teacher Auth] Looking up codes:', candidateCodes);

    const { data: teacher, error } = await supabaseAdmin
      .from('teachers')
      .select('id, name, email, school_name, access_code, is_active')
      .in('access_code', candidateCodes)
      .eq('is_active', true)
      .maybeSingle();

    console.log(`[Teacher Auth] Query result:`, { 
      found: !!teacher, 
      error: error?.message,
      codeSearched: candidateCodes
    });

    if (error || !teacher) {
      console.error('[Teacher Auth] Teacher lookup failed:', error?.message || 'No teacher found');
      return NextResponse.json(
        { success: false, error: 'Opettajakoodi ei kelpaa' },
        { status: 401 }
      );
    }

    // Update last login timestamp (non-blocking, errors are ignored)
    supabaseAdmin
      .from('teachers')
      .update({ last_login: new Date().toISOString() })
      .eq('id', teacher.id)
      .then(() => {})
      .catch((err: any) => console.error('[Teacher Auth] Failed to update last_login:', err));

    // Set authentication cookie with teacher ID
    const cookieStore = await cookies();
    cookieStore.set('teacher_auth_token', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/teacher',
    });
    // Duplicate cookie for API route access
    cookieStore.set('teacher_auth_token', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/api',
    });

    // Also store teacher ID in a separate cookie for dashboard use
    cookieStore.set('teacher_id', teacher.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/teacher',
    });
    cookieStore.set('teacher_id', teacher.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/api',
    });

    // Also set site-wide cookies to ensure middleware receives them regardless of path quirks
    cookieStore.set('teacher_auth_token', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    cookieStore.set('teacher_id', teacher.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
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
  } catch (error: any) {
    console.error('[Teacher Auth] Login error:', error);
    console.error('[Teacher Auth] Error stack:', error?.stack);
    console.error('[Teacher Auth] Error details:', {
      message: error?.message,
      name: error?.name,
      cause: error?.cause
    });
    return NextResponse.json(
      { 
        success: false, 
        error: 'Sisäänkirjautuminen epäonnistui',
        debug: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}

