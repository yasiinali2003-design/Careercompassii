import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key') || request.nextUrl.searchParams.get('api_key');
    const expected = process.env.SCHOOL_API_KEY;
    if (!expected || apiKey !== expected) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

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
      return NextResponse.json({ success: false, error: 'Failed to fetch' }, { status: 500 });
    }
    return NextResponse.json({ success: true, results: data || [] });
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}


