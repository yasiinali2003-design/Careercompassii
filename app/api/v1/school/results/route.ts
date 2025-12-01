import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requirePremium } from '@/lib/teacherPackage';

export async function GET(request: NextRequest) {
  try {
    // SECURITY: Only accept API keys via x-api-key header (not query parameters)
    // Query parameters expose secrets in browser history, server logs, and referrer headers
    const apiKey = request.headers.get('x-api-key');
    const expected = process.env.SCHOOL_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'API-avain puuttuu. Lisää x-api-key header pyyntöön.'
      }, { status: 401 });
    }

    if (!expected || apiKey !== expected) {
      return NextResponse.json({ success: false, error: 'Ei käyttöoikeutta' }, { status: 401 });
    }

    // For now, API key implies Premium access. In future, map API keys to specific teachers/schools.
    // If you want stricter control, require teacherId in request and check their package:
    // const teacherId = request.headers.get('x-teacher-id');
    // if (teacherId) await requirePremium(teacherId);
    // else return NextResponse.json({ success: false, error: 'Premium package required for API access' }, { status: 403 });

    const classId = request.nextUrl.searchParams.get('classId');
    const since = request.nextUrl.searchParams.get('since');
    if (!classId) {
      return NextResponse.json({ success: false, error: 'classId required' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ success: true, results: [] });
    }

    let q = supabaseAdmin.from('results').select('*').eq('class_id', classId).order('created_at', { ascending: false });
    if (since) {
      q = q.gte('created_at', new Date(since).toISOString());
    }
    const { data, error } = await q;
    if (error) {
      return NextResponse.json({ success: false, error: 'Haku epäonnistui' }, { status: 500 });
    }
    return NextResponse.json({ success: true, results: data || [] });
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Sisäinen palvelinvirhe' }, { status: 500 });
  }
}



