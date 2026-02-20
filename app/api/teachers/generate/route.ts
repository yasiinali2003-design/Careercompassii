import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createLogger } from '@/lib/logger';
import { validateSessionToken, isValidEmail } from '@/lib/security';
import { sendWelcomeEmail } from '@/lib/email';

const log = createLogger('API/Teachers');

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
    const hasAdminCookie = adminCookie?.value
      ? adminCookie.value === 'yes' || validateSessionToken(adminCookie.value, 4 * 60 * 60 * 1000)
      : false;

    const teacherToken = request.cookies.get('teacher_auth_token');
    const teacherId = request.cookies.get('teacher_id');
    const adminId = process.env.ADMIN_TEACHER_ID || '';
    const isValidToken = teacherToken && validateSessionToken(teacherToken.value, 24 * 60 * 60 * 1000);
    const isAdmin = teacherId && adminId && teacherId.value === adminId;

    if (!(hasValidBasicAuth || hasAdminCookie || (isValidToken && isAdmin))) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const body = await request.json();
    const { name, email, schoolName, package: packageType } = body;

    // Validate input
    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Nimi vaaditaan' },
        { status: 400 }
      );
    }

    // Email is now REQUIRED for password authentication
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Sähköpostiosoite vaaditaan' },
        { status: 400 }
      );
    }

    // Validate email format
    const normalizedEmail = email.toLowerCase().trim();
    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        { success: false, error: 'Virheellinen sähköpostiosoite' },
        { status: 400 }
      );
    }

    // Check if email already exists
    if (supabaseAdmin) {
      const { data: existingTeacher } = await supabaseAdmin
        .from('teachers')
        .select('id')
        .ilike('email', normalizedEmail)
        .maybeSingle();

      if (existingTeacher) {
        return NextResponse.json(
          { success: false, error: 'Sähköpostiosoite on jo käytössä' },
          { status: 400 }
        );
      }
    }

    // Validate package type
    const validPackages = ['premium', 'yläaste', 'standard'];
    const normalizedPackage = packageType && typeof packageType === 'string' 
      ? packageType.toLowerCase() === 'yläaste' ? 'standard' : packageType.toLowerCase()
      : 'standard';
    
    if (!validPackages.includes(normalizedPackage) && normalizedPackage !== 'standard') {
      return NextResponse.json(
        { success: false, error: 'Virheellinen pakettityyppi. Sallitut: "premium" tai "yläaste"/"standard"' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      // No Supabase configured - use local mock store
      const accessCode = generateAccessCode();
      const teacherId = `mock-teacher-${Date.now()}`;
      const teacher = { id: teacherId, name, email: email || null, school_name: schoolName || null, access_code: accessCode, package: normalizedPackage, is_active: true, created_at: new Date().toISOString() };
      const fs = require('fs'); const path = require('path');
      const mockPath = path.join(process.cwd(), 'mock-db.json');
      let store: any = { classes: [], pins: {}, results: [], teachers: [] };
      try { if (fs.existsSync(mockPath)) store = JSON.parse(fs.readFileSync(mockPath, 'utf8')) || store; } catch {}
      store.teachers = store.teachers || [];
      store.teachers.push(teacher);
      fs.writeFileSync(mockPath, JSON.stringify(store, null, 2));
      return NextResponse.json({ success: true, teacher, message: 'Opettajatili luotu (kehitystila)' });
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
      // If Supabase is unreachable (network error), use local mock store
      const isNetworkError = codeError && (
        String(codeError?.message || codeError).includes('fetch failed') ||
        String(codeError?.message || codeError).includes('ENOTFOUND') ||
        String(codeError?.message || codeError).includes('network')
      );
      if (isNetworkError) {
        log.warn('Supabase unreachable - saving teacher to mock-db.json');
        const accessCode = generateAccessCode();
        const teacherId = `mock-teacher-${Date.now()}`;
        const teacher = { id: teacherId, name, email: email || null, school_name: schoolName || null, access_code: accessCode, package: normalizedPackage, is_active: true, created_at: new Date().toISOString() };
        const fs = require('fs'); const path = require('path');
        const mockPath = path.join(process.cwd(), 'mock-db.json');
        let store: any = { classes: [], pins: {}, results: [], teachers: [] };
        try { if (fs.existsSync(mockPath)) store = JSON.parse(fs.readFileSync(mockPath, 'utf8')) || store; } catch {}
        store.teachers = store.teachers || [];
        store.teachers.push(teacher);
        fs.writeFileSync(mockPath, JSON.stringify(store, null, 2));
        return NextResponse.json({ success: true, teacher, message: 'Opettajatili luotu (kehitystila - tallennettu paikallisesti)' });
      }

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
      // Try with package first, fallback without if column doesn't exist
      let insertData: any = {
        name,
        email: normalizedEmail, // Use normalized email (required)
        school_name: schoolName || null,
        access_code: accessCode,
        is_active: true,
      };

      // Only include package if column exists (check via a test query or just try)
      insertData.package = normalizedPackage;

      const { data, error } = await supabaseAdmin
        .from('teachers')
        .insert(insertData as any)
        .select('id, name, email, school_name, access_code, package, created_at')
        .single();

      if (error) {
        log.error('Error creating teacher:', error);

        // If Supabase is unreachable, fall back to mock-db
        const isNetworkErr = String(error?.message || error).includes('fetch failed') || String(error?.message || error).includes('ENOTFOUND');
        if (isNetworkErr) {
          log.warn('Supabase unreachable during insert - saving to mock-db.json');
          const teacherId2 = `mock-teacher-${Date.now()}`;
          const teacher2 = { id: teacherId2, name, email: email || null, school_name: schoolName || null, access_code: accessCode, package: normalizedPackage, is_active: true, created_at: new Date().toISOString() };
          const fs2 = require('fs'); const path2 = require('path');
          const mockPath2 = path2.join(process.cwd(), 'mock-db.json');
          let store2: any = { classes: [], pins: {}, results: [], teachers: [] };
          try { if (fs2.existsSync(mockPath2)) store2 = JSON.parse(fs2.readFileSync(mockPath2, 'utf8')) || store2; } catch {}
          store2.teachers = store2.teachers || [];
          store2.teachers.push(teacher2);
          fs2.writeFileSync(mockPath2, JSON.stringify(store2, null, 2));
          return NextResponse.json({ success: true, teacher: teacher2, message: 'Opettajatili luotu (kehitystila - tallennettu paikallisesti)' });
        }

        // If package column doesn't exist, try without it
        const isPackageColumnError = error.message?.includes('column "package"')
          || error.message?.includes("'package' column")
          || error.message?.includes('package')
          || error.code === '42703'
          || error.code === 'PGRST204';

        if (isPackageColumnError) {
          log.warn('Package column not found, retrying without package field');
          const { data: fallbackData, error: fallbackError } = await supabaseAdmin
            .from('teachers')
            .insert({
              name,
              email: email || null,
              school_name: schoolName || null,
              access_code: accessCode,
              is_active: true,
            } as any)
            .select('id, name, email, school_name, access_code, created_at')
            .single();

          if (fallbackError) {
            return NextResponse.json(
              { success: false, error: 'Opettajatilin luominen epäonnistui', details: fallbackError.message, hint: 'Run migration: ALTER TABLE teachers ADD COLUMN package TEXT DEFAULT \'standard\';' },
              { status: 500 }
            );
          }

          return NextResponse.json({
            success: true,
            teacher: fallbackData,
            message: 'Opettajatili luotu (paketti-sarake puuttuu - suorita migraatio)',
            warning: 'Package column missing. Run: ALTER TABLE teachers ADD COLUMN package TEXT DEFAULT \'standard\';'
          });
        }

        return NextResponse.json(
          {
            success: false,
            error: 'Opettajatilin luominen epäonnistui',
            details: error.message || JSON.stringify(error),
            code: error.code,
            hint: error.message?.includes('column "package"') || error.message?.includes("'package' column") || error.code === '42703' || error.code === 'PGRST204'
              ? 'Run migration: ALTER TABLE teachers ADD COLUMN package TEXT DEFAULT \'standard\';'
              : undefined
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        teacher: data,
        message: 'Opettajatili luotu onnistuneesti',
      });
    }

    const accessCode = codeData;

    // Insert teacher with generated code
    // Try with package first, fallback without if column doesn't exist
    let insertData: any = {
      name,
      email: normalizedEmail, // Use normalized email (required)
      school_name: schoolName || null,
      access_code: accessCode,
      is_active: true,
    };

    insertData.package = normalizedPackage;

    const { data, error } = await supabaseAdmin
      .from('teachers')
      .insert(insertData as any)
      .select('id, name, email, school_name, access_code, package, created_at')
      .single() as {
        data: {
          id: string;
          name: string;
          email: string;
          school_name: string | null;
          access_code: string;
          package: string;
          created_at: string;
        } | null;
        error: any;
      };

    if (error) {
      log.error('Error creating teacher:', error);

      // If package column doesn't exist, try without it
      const isPackageColumnError2 = error.message?.includes('column "package"')
        || error.message?.includes("'package' column")
        || error.message?.includes('package')
        || error.code === '42703'
        || error.code === 'PGRST204';

      if (isPackageColumnError2) {
        log.warn('Package column not found, retrying without package field');
        const { data: fallbackData, error: fallbackError } = await supabaseAdmin
          .from('teachers')
          .insert({
            name,
            email: email || null,
            school_name: schoolName || null,
            access_code: accessCode,
            is_active: true,
          } as any)
          .select('id, name, email, school_name, access_code, created_at')
          .single();

        if (fallbackError) {
          return NextResponse.json(
            { success: false, error: 'Opettajatilin luominen epäonnistui', details: fallbackError.message, hint: 'Run migration: ALTER TABLE teachers ADD COLUMN package TEXT DEFAULT \'standard\';' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          teacher: fallbackData,
          message: 'Opettajatili luotu (paketti-sarake puuttuu - suorita migraatio)',
          warning: 'Package column missing. Run: ALTER TABLE teachers ADD COLUMN package TEXT DEFAULT \'standard\';'
        });
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Opettajatilin luominen epäonnistui', 
          details: error.message || JSON.stringify(error),
          code: error.code,
          hint: isPackageColumnError2
            ? 'Run migration: ALTER TABLE teachers ADD COLUMN package TEXT DEFAULT \'standard\';'
            : undefined
        },
        { status: 500 }
      );
    }

    // Send welcome email with access code (non-blocking)
    if (data && data.email && data.name && data.access_code) {
      sendWelcomeEmail(data.email, data.name, data.access_code).catch(err => {
        log.error('Failed to send welcome email:', err);
        // Don't fail the request if email fails
      });
    }

    return NextResponse.json({
      success: true,
      teacher: data,
      message: 'Opettajatili luotu onnistuneesti',
      instructions: 'Opettaja aktivoi tilin pääsykoodilla ja asettaa oman salasanan.'
    });
  } catch (error) {
    log.error('Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Sisäinen palvelinvirhe' },
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

