import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Generate Teacher Access Code
 * Admin endpoint to create new teacher accounts with unique codes
 */

export async function POST(request: NextRequest) {
  try {
    // Admin allowlist: accept either Basic Auth (admin user/pass) OR admin teacher cookie
    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || '';
    const authHeader = request.headers.get('authorization') || '';
    const expected = adminPass ? 'Basic ' + Buffer.from(`${adminUser}:${adminPass}`).toString('base64') : '';

    const hasValidBasicAuth = expected && authHeader === expected;
    const adminCookie = request.cookies.get('admin_auth');
    const hasAdminCookie = adminCookie?.value === 'yes';

    const teacherToken = request.cookies.get('teacher_auth_token');
    const teacherId = request.cookies.get('teacher_id');
    const adminId = process.env.ADMIN_TEACHER_ID || '';
    const isAuthed = teacherToken && teacherToken.value === 'authenticated';
    const isAdmin = teacherId && adminId && teacherId.value === adminId;

    if (!(hasValidBasicAuth || hasAdminCookie || (isAuthed && isAdmin))) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const body = await request.json();
    const { name, email, schoolName } = body;

    // Validate input
    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Generate unique access code using Supabase function
    let codeData: string | null = null;
    let codeError: any = null;
    
    try {
      const result = await supabaseAdmin.rpc('generate_teacher_code');
      codeData = result.data;
      codeError = result.error;
    } catch (err) {
      codeError = err;
    }

    if (codeError || !codeData) {
      // Fallback: Generate code in JavaScript if function doesn't exist
      const fallbackCode = generateAccessCode();
      
      // Check if code exists and regenerate if needed
      let accessCode = fallbackCode;
      let attempts = 0;
      while (attempts < 10) {
        const { data: existing } = await supabaseAdmin
          .from('teachers')
          .select('id')
          .eq('access_code', accessCode)
          .single();
        
        if (!existing) break;
        accessCode = generateAccessCode();
        attempts++;
      }

      // Insert teacher with generated code
      const { data, error } = await supabaseAdmin
        .from('teachers')
        .insert({
          name,
          email: email || null,
          school_name: schoolName || null,
          access_code: accessCode,
          is_active: true,
        })
        .select('id, name, email, school_name, access_code, created_at')
        .single();

      if (error) {
        console.error('[API/Teachers] Error creating teacher:', error);
        return NextResponse.json(
          { success: false, error: 'Failed to create teacher account' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        teacher: data,
        message: 'Teacher account created successfully',
      });
    }

    const accessCode = codeData;

    // Insert teacher with generated code
    const { data, error } = await supabaseAdmin
      .from('teachers')
      .insert({
        name,
        email: email || null,
        school_name: schoolName || null,
        access_code: accessCode,
        is_active: true,
      })
      .select('id, name, email, school_name, access_code, created_at')
      .single();

    if (error) {
      console.error('[API/Teachers] Error creating teacher:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create teacher account' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      teacher: data,
      message: 'Teacher account created successfully',
    });
  } catch (error) {
    console.error('[API/Teachers] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Fallback code generator (8 characters, alphanumeric uppercase)
function generateAccessCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars (0, O, I, 1)
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

