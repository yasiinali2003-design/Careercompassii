/**
 * School Management API
 * Handles multi-teacher access for Premium schools
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createLogger } from '@/lib/logger';
import { validateSessionToken } from '@/lib/security';

const log = createLogger('API/Schools');

export const dynamic = 'force-dynamic';

/**
 * GET /api/schools
 * Get all schools for the authenticated teacher
 */
export async function GET(request: NextRequest) {
  try {
    const teacherId = request.cookies.get('teacher_id')?.value;
    const authToken = request.cookies.get('teacher_auth_token')?.value;

    // Validate both teacher ID and auth token exist
    if (!teacherId || !authToken) {
      return NextResponse.json(
        { success: false, error: 'Ei kirjautunut' },
        { status: 401 }
      );
    }

    // Validate the session token is valid and not expired
    const isLegacyToken = authToken === 'authenticated';
    const isValidToken = validateSessionToken(authToken, 24 * 60 * 60 * 1000);
    if (!isLegacyToken && !isValidToken) {
      return NextResponse.json(
        { success: false, error: 'Istunto vanhentunut' },
        { status: 401 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: 'Tietokanta ei ole määritetty' },
        { status: 500 }
      );
    }

    // Get schools using helper function
    const { data, error } = await (supabaseAdmin as any)
      .rpc('get_teacher_schools', { p_teacher_id: teacherId });

    if (error) {
      log.error('Error fetching schools:', error);
      return NextResponse.json(
        { success: false, error: 'Koulujen haku epäonnistui' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      schools: data || []
    });

  } catch (error) {
    log.error('Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Sisäinen palvelinvirhe' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/schools
 * Create a new school
 */
export async function POST(request: NextRequest) {
  try {
    const teacherId = request.cookies.get('teacher_id')?.value;
    const authToken = request.cookies.get('teacher_auth_token')?.value;

    // Validate both teacher ID and auth token exist
    if (!teacherId || !authToken) {
      return NextResponse.json(
        { success: false, error: 'Ei kirjautunut' },
        { status: 401 }
      );
    }

    // Validate the session token is valid and not expired
    const isLegacyToken = authToken === 'authenticated';
    const isValidToken = validateSessionToken(authToken, 24 * 60 * 60 * 1000);
    if (!isLegacyToken && !isValidToken) {
      return NextResponse.json(
        { success: false, error: 'Istunto vanhentunut' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, package: pkg = 'yläaste' } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Koulun nimi on pakollinen' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: 'Tietokanta ei ole määritetty' },
        { status: 500 }
      );
    }

    // Determine max_teachers based on package
    const maxTeachers = pkg === 'premium' ? 5 : 1;

    // Create school
    const { data: school, error: schoolError } = await supabaseAdmin
      .from('schools')
      .insert({
        name,
        package: pkg,
        max_teachers: maxTeachers
      } as any)
      .select('id, name, package, max_teachers, created_at')
      .single();

    if (schoolError || !school) {
      log.error('Error creating school:', schoolError);
      return NextResponse.json(
        { success: false, error: 'Koulun luominen epäonnistui' },
        { status: 500 }
      );
    }

    // Add creator as admin
    const schoolData = school as { id: string; name: string; package: string; max_teachers: number; created_at: string };
    const { error: memberError } = await supabaseAdmin
      .from('school_teachers')
      .insert({
        school_id: schoolData.id,
        teacher_id: teacherId,
        role: 'admin'
      } as any);

    if (memberError) {
      log.error('Error adding admin:', memberError);
      // Rollback: delete school
      await supabaseAdmin.from('schools').delete().eq('id', schoolData.id)
      return NextResponse.json(
        { success: false, error: 'Ylläpitäjän lisääminen kouluun epäonnistui' },
        { status: 500 }
      );
    }

    log.info(`Created school: ${schoolData.id} by teacher ${teacherId}`);

    return NextResponse.json({
      success: true,
      school
    });

  } catch (error) {
    log.error('Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Sisäinen palvelinvirhe' },
      { status: 500 }
    );
  }
}
