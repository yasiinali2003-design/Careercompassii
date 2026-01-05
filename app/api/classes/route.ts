/**
 * POST /api/classes
 * Create a new teacher class
 * 
 * Request: { teacherId: string }
 * Response: { classId: string, classToken: string, createdAt: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateClassToken } from '@/lib/teacherCrypto';
import { createLogger } from '@/lib/logger';
import { validateSessionToken } from '@/lib/security';
import fs from 'fs';
import path from 'path';

const log = createLogger('API/Classes');

export async function POST(request: NextRequest) {
  try {
    // Get authenticated teacher ID and token from cookies
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

    // Generate unique class token
    const classToken = generateClassToken();

    // Check if Supabase is configured
    if (!supabaseAdmin) {
      log.warn('Supabase not configured - using local mock store');
      const mockPath = path.join(process.cwd(), 'mock-db.json');
      let store: any = { classes: [], pins: {}, results: [] };
      try {
        if (fs.existsSync(mockPath)) {
          store = JSON.parse(fs.readFileSync(mockPath, 'utf8')) || store;
        }
      } catch {}
      const classId = 'mock-class-' + Date.now();
      const createdAt = new Date().toISOString();
      store.classes.push({ id: classId, class_token: classToken, created_at: createdAt, teacher_id: teacherId });
      try { fs.writeFileSync(mockPath, JSON.stringify(store, null, 2)); } catch {}
      return NextResponse.json({ success: true, classId, classToken, createdAt });
    }

    // Try to insert class into database
    try {
      const { data, error } = await supabaseAdmin
        .from('classes')
        .insert({
          teacher_id: teacherId,
          class_token: classToken
        } as any)
        .select('id, class_token, created_at')
        .single() as { data: { id: string; class_token: string; created_at: string } | null; error: any };

      if (error || !data) {
        log.error('Supabase error:', { code: error?.code, message: error?.message, details: error?.details });

        // Check if it's a table missing error
        if (error?.code === 'PGRST116' || error?.message?.includes('does not exist')) {
          return NextResponse.json(
            {
              success: false,
              error: 'Tietokantatauluja ei ole vielä luotu',
              hint: 'Suorita SQL-tiedosto Supabasessa: supabase-teacher-dashboard-fixed.sql',
              details: error?.message
            },
            { status: 500 }
          );
        }

        return NextResponse.json(
          {
            success: false,
            error: 'Luokan luominen epäonnistui',
            details: error?.message,
            hint: 'Tarkista Vercel-lokit saadaksesi lisätietoja'
          },
          { status: 500 }
        );
      }

      log.info('Created class:', data.id);

      return NextResponse.json({
        success: true,
        classId: data.id,
        classToken: data.class_token,
        createdAt: data.created_at
      });
    } catch (err) {
      log.error('Database connection error:', err);
      return NextResponse.json(
        {
          success: false,
          error: 'Tietokantayhteys epäonnistui',
          details: err instanceof Error ? err.message : String(err)
        },
        { status: 500 }
      );
    }

  } catch (error) {
    log.error('Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Sisäinen palvelinvirhe' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/classes
 * Get all classes for the authenticated teacher
 * 
 * Response: { classes: Array<{ id, class_token, created_at, updated_at }> }
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

    const computeStats = (
      pinCount: number,
      results: Array<{ created_at: string; result_payload: any }>
    ) => {
      const completedResults = results.length;
      const pendingCount = Math.max(pinCount - completedResults, 0);
      const completionRate = pinCount > 0 ? Math.round((completedResults / pinCount) * 100) : 0;
      const lastSubmission = results[0]?.created_at || null;

      let atRiskCount = 0;
      results.forEach((result) => {
        const payload = result.result_payload || {};
        const dimScores = payload.dimension_scores || payload.dimensionScores || {};
        const interests = Number(dimScores.interests) || 0;
        const values = Number(dimScores.values) || 0;
        const workstyle = Number(dimScores.workstyle) || 0;
        const context = Number(dimScores.context) || 0;

        const avgScore = (interests + values + workstyle + context) / 4;
        const scores = [interests, values, workstyle, context].filter((score) => score > 0);
        const maxScore = scores.length ? Math.max(...scores) : 0;
        const minScore = scores.length ? Math.min(...scores) : 0;

        const hasRisk = (
          avgScore < 50 ||
          interests < 40 ||
          values < 40 ||
          (workstyle < 40 && workstyle > 0) ||
          (scores.length > 0 && maxScore - minScore > 60 && minScore > 0)
        );

        if (hasRisk) {
          atRiskCount += 1;
        }
      });

      return {
        totalPins: pinCount,
        completedResults,
        pendingCount,
        completionRate,
        lastSubmission,
        atRiskCount,
      };
    };

    if (!supabaseAdmin) {
      log.warn('Supabase not configured - reading local mock store');
      const mockPath = path.join(process.cwd(), 'mock-db.json');
      try {
        if (fs.existsSync(mockPath)) {
          const store = JSON.parse(fs.readFileSync(mockPath, 'utf8')) || { classes: [], pins: {}, results: [] };
          const classes = (store.classes || []).filter((c: any) => c.teacher_id === teacherId);
          const pinsStore = store.pins || {};
          const resultsStore = store.results || [];

          const classesWithStats = classes.map((cls: any) => {
            const classId = String(cls.id);
            const pins = Array.isArray(pinsStore[classId]) ? pinsStore[classId] : [];
            const classResults = (resultsStore || [])
              .filter((r: any) => String(r.class_id) === classId)
              .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

            return {
              ...cls,
              stats: computeStats(
                pins.length,
                classResults.map((r: any) => ({
                  created_at: r.created_at,
                  result_payload: r.result_payload || r.resultPayload,
                }))
              ),
            };
          });

          return NextResponse.json({ success: true, classes: classesWithStats });
        }
      } catch (err) {
        log.error('Mock store read failed:', err);
      }
      return NextResponse.json({ success: true, classes: [] });
    }

    // Optimize query: only fetch what we need, limit if needed
    const { data, error } = await supabaseAdmin
      .from('classes')
      .select('id, class_token, created_at, updated_at')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false })
      .limit(100); // Reasonable limit for most teachers

    if (error) {
      log.error('Error fetching classes:', error);
      return NextResponse.json(
        { success: false, error: 'Luokkien haku epäonnistui' },
        { status: 500 }
      );
    }

    const classes = data || [];

    if (classes.length === 0) {
      return NextResponse.json({ success: true, classes: [] });
    }

    const classIds = classes.map((cls: { id: string }) => cls.id);

    const { data: pinsData } = await supabaseAdmin
      .from('pins')
      .select('class_id')
      .in('class_id', classIds);

    const pinsByClass = new Map<string, number>();
    (pinsData || []).forEach((row: { class_id: string }) => {
      const key = String(row.class_id);
      pinsByClass.set(key, (pinsByClass.get(key) || 0) + 1);
    });

    const { data: resultsData } = await supabaseAdmin
      .from('results')
      .select('class_id, created_at, result_payload')
      .in('class_id', classIds)
      .order('created_at', { ascending: false });

    const resultsByClass = new Map<string, Array<{ created_at: string; result_payload: any }>>();
    (resultsData || []).forEach((row: { class_id: string; created_at: string; result_payload: any }) => {
      const key = String(row.class_id);
      const existing = resultsByClass.get(key) || [];
      existing.push({ created_at: row.created_at, result_payload: row.result_payload });
      resultsByClass.set(key, existing);
    });

    const classesWithStats = classes.map((cls: { id: string; class_token: string; created_at: string; updated_at: string }) => {
      const id = String(cls.id);
      const pinCount = pinsByClass.get(id) || 0;
      const classResults = resultsByClass.get(id) || [];

      return {
        ...cls,
        stats: computeStats(pinCount, classResults),
      };
    });

    return NextResponse.json({ success: true, classes: classesWithStats });
  } catch (error) {
    log.error('GET unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Sisäinen palvelinvirhe' },
      { status: 500 }
    );
  }
}

