import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createLogger } from '@/lib/logger';
import { validateSessionToken } from '@/lib/security';

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
    const hasAdminCookie = adminCookie?.value === 'yes';

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
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
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
      return NextResponse.json(
        { success: false, error: 'Tietokantaa ei ole määritelty' },
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
      // Try with package first, fallback without if column doesn't exist
      let insertData: any = {
        name,
        email: email || null,
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
      email: email || null,
      school_name: schoolName || null,
      access_code: accessCode,
      is_active: true,
    };

    insertData.package = normalizedPackage;

    const { data, error } = await supabaseAdmin
      .from('teachers')
      .insert(insertData as any)
      .select('id, name, email, school_name, access_code, package, created_at')
      .single();

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

    return NextResponse.json({
      success: true,
      teacher: data,
      message: 'Opettajatili luotu onnistuneesti',
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

