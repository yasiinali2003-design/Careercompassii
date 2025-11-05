import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requirePremium } from '@/lib/teacherPackage';

export async function GET(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key') || request.nextUrl.searchParams.get('api_key');
    const expected = process.env.SCHOOL_API_KEY;
    if (!expected || apiKey !== expected) {
      return NextResponse.json({ success: false, error: 'Ei käyttöoikeutta' }, { status: 401 });
    }

    // API access requires Premium. In future, map API keys to specific teachers/schools and check their package.

    const classId = request.nextUrl.searchParams.get('classId');
    const since = request.nextUrl.searchParams.get('since');
    if (!classId) return NextResponse.json({ success: false, error: 'classId required' }, { status: 400 });

    if (!supabaseAdmin) return NextResponse.json({ success: true, aggregates: {} });

    let q = supabaseAdmin.from('results').select('*').eq('class_id', classId);
    if (since) q = q.gte('created_at', new Date(since).toISOString());
    const { data, error } = await q;
    if (error) return NextResponse.json({ success: false, error: 'Haku epäonnistui' }, { status: 500 });

    const careerCounts: Record<string, number> = {};
    const edu = { lukio: 0, ammattikoulu: 0, kansanopisto: 0 };
    const dims = { interests: 0, values: 0, workstyle: 0, context: 0 };
    let n = 0;
    (data || []).forEach((r: any) => {
      const p = r.result_payload || {};
      (p.top_careers || p.topCareers || []).slice(0,5).forEach((c: any) => { careerCounts[c.title] = (careerCounts[c.title]||0)+1; });
      const ds = p.dimension_scores || p.dimensionScores; if (ds) { dims.interests+=ds.interests||0; dims.values+=ds.values||0; dims.workstyle+=ds.workstyle||0; dims.context+=ds.context||0; n++; }
      if (p.cohort==='YLA') { const ed = p.educationPath || p.education_path; const primary = ed?.primary || ed?.education_path_primary; if (primary && primary in edu) (edu as any)[primary]++; }
    });
    const topCareers = Object.entries(careerCounts).map(([name,count])=>({name,count})).sort((a,b)=>b.count-a.count).slice(0,10);
    const dimAvg = n>0?{ interests:dims.interests/n, values:dims.values/n, workstyle:dims.workstyle/n, context:dims.context/n}:{ interests:0, values:0, workstyle:0, context:0 };

    return NextResponse.json({ success: true, aggregates: { topCareers, educationPaths: edu, dimensionAverages: dimAvg, total: (data||[]).length } });
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Sisäinen palvelinvirhe' }, { status: 500 });
  }
}



