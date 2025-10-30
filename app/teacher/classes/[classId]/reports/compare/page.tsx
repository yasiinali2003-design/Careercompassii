"use client";

import { useEffect, useMemo, useState } from "react";

type ISODate = string;

export default function CompareReport({ params, searchParams }: { params: { classId: string }, searchParams: { from1?: ISODate; to1?: ISODate; from2?: ISODate; to2?: ISODate } }) {
  const { classId } = params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);

  const ranges = useMemo(() => ({
    from1: searchParams?.from1 ? new Date(searchParams.from1) : null,
    to1: searchParams?.to1 ? new Date(searchParams.to1) : null,
    from2: searchParams?.from2 ? new Date(searchParams.from2) : null,
    to2: searchParams?.to2 ? new Date(searchParams.to2) : null,
  }), [searchParams?.from1, searchParams?.to1, searchParams?.from2, searchParams?.to2]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Check Premium access first
        const checkRes = await fetch('/api/teacher-auth/package-check');
        const checkData = await checkRes.json();
        if (!checkData.hasPremium) {
          setError('Vertailuanalyytiikka vaatii Premium-paketin. Ota yhteyttä tukeen: support@careercompassi.com');
          if (!cancelled) setLoading(false);
          return;
        }

        const res = await fetch(`/api/classes/${classId}/results`);
        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Failed to fetch results");
        if (!cancelled) setResults(data.results || []);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [classId]);

  function inRange(d: Date, from: Date | null, to: Date | null): boolean {
    if (from && d < from) return false;
    if (to && d > to) return false;
    return true;
  }

  const [a, b] = useMemo(() => {
    const groupA = results.filter((r) => inRange(new Date(r.created_at), ranges.from1, ranges.to1));
    const groupB = results.filter((r) => inRange(new Date(r.created_at), ranges.from2, ranges.to2));
    return [groupA, groupB];
  }, [results, ranges]);

  function aggregate(list: any[]) {
    const careerCounts: Record<string, number> = {};
    const edu = { lukio: 0, ammattikoulu: 0, kansanopisto: 0 };
    const dims = { interests: 0, values: 0, workstyle: 0, context: 0 }; let n = 0;
    list.forEach((r) => {
      const p = r.result_payload || {};
      (p.top_careers || p.topCareers || []).slice(0,5).forEach((c: any) => { careerCounts[c.title] = (careerCounts[c.title]||0)+1; });
      const ds = p.dimension_scores || p.dimensionScores; if (ds) { dims.interests+=ds.interests||0; dims.values+=ds.values||0; dims.workstyle+=ds.workstyle||0; dims.context+=ds.context||0; n++; }
      if (p.cohort === 'YLA') { const ed = p.educationPath || p.education_path; const primary = ed?.primary || ed?.education_path_primary; if (primary && primary in edu) (edu as any)[primary]++; }
    });
    const topCareers = Object.entries(careerCounts).map(([name,count])=>({name,count})).sort((a,b)=>b.count-a.count).slice(0,10);
    const dimAvg = n>0 ? { interests: dims.interests/n, values: dims.values/n, workstyle: dims.workstyle/n, context: dims.context/n } : { interests:0, values:0, workstyle:0, context:0 };
    return { topCareers, edu, dimAvg, total: list.length };
  }

  const A = useMemo(()=>aggregate(a), [a]);
  const B = useMemo(()=>aggregate(b), [b]);

  function delta(a: number, b: number) { return Math.round((a - b)); }

  return (
    <div className="min-h-screen bg-white text-black">
      <style>{`@page { size: A4; margin: 20mm 15mm; } @media print { .no-print { display:none } }`}</style>
      <div className="max-w-4xl mx-auto py-6">
        <div className="no-print mb-4 flex justify-between items-center gap-2 flex-wrap">
          <div className="text-sm">Valitse päivämäärät URL-parametreilla: from1, to1, from2, to2 (YYYY-MM-DD)</div>
          <div className="flex gap-2">
            <button onClick={()=>window.print()} className="border px-4 py-2 rounded">Tulosta / Tallenna PDF</button>
          </div>
        </div>
        <header className="mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold">Luokan vertailuanalyysi</h1>
          <p className="text-sm mt-1">Luokka: {classId.substring(0,8)} • A: {ranges.from1 ? ranges.from1.toLocaleDateString('fi-FI') : '—'}–{ranges.to1 ? ranges.to1.toLocaleDateString('fi-FI') : '—'} • B: {ranges.from2 ? ranges.from2.toLocaleDateString('fi-FI') : '—'}–{ranges.to2 ? ranges.to2.toLocaleDateString('fi-FI') : '—'}</p>
        </header>

        {loading && <p>Ladataan...</p>}
        {error && <p className="text-red-600">Virhe: {error}</p>}

        {!loading && !error && (
          <main className="space-y-8">
            <section>
              <h2 className="font-semibold text-lg mb-2">Yleiskuva</h2>
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="font-semibold">Jakso A</p>
                  <p>Testejä: {A.total}</p>
                </div>
                <div>
                  <p className="font-semibold">Jakso B</p>
                  <p>Testejä: {B.total}</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-semibold text-lg mb-2">Top ammatit (A vs B)</h2>
              <div className="grid grid-cols-2 gap-6 text-sm">
                <ol className="list-decimal list-inside space-y-1">
                  {A.topCareers.map((c,i)=>(<li key={i}>{c.name} ({c.count})</li>))}
                  {A.topCareers.length===0 && <li>—</li>}
                </ol>
                <ol className="list-decimal list-inside space-y-1">
                  {B.topCareers.map((c,i)=>(<li key={i}>{c.name} ({c.count})</li>))}
                  {B.topCareers.length===0 && <li>—</li>}
                </ol>
              </div>
            </section>

            <section>
              <h2 className="font-semibold text-lg mb-2">Koulutuspolut (YLA) – muutos</h2>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Lukio: {A.edu.lukio} → {B.edu.lukio} (Δ {delta(B.edu.lukio, A.edu.lukio)})</li>
                <li>Ammattikoulu: {A.edu.ammattikoulu} → {B.edu.ammattikoulu} (Δ {delta(B.edu.ammattikoulu, A.edu.ammattikoulu)})</li>
                <li>Kansanopisto: {A.edu.kansanopisto} → {B.edu.kansanopisto} (Δ {delta(B.edu.kansanopisto, A.edu.kansanopisto)})</li>
              </ul>
            </section>

            <section>
              <h2 className="font-semibold text-lg mb-2">Dimensiot (A vs B)</h2>
              <div className="grid grid-cols-2 gap-6 text-sm">
                {([
                  ['Kiinnostukset', A.dimAvg.interests, B.dimAvg.interests],
                  ['Arvot', A.dimAvg.values, B.dimAvg.values],
                  ['Työtapa', A.dimAvg.workstyle, B.dimAvg.workstyle],
                  ['Konteksti', A.dimAvg.context, B.dimAvg.context]
                ] as [string, number, number][]).map(([label,aVal,bVal]) => (
                  <div key={label}>
                    <p className="font-medium mb-1">{label}</p>
                    <div className="flex justify-between mb-1"><span>A: {Math.round(aVal)}%</span><span>B: {Math.round(bVal)}%</span></div>
                    <div className="w-full h-2 bg-gray-200 rounded mb-1">
                      <div className="h-2 bg-blue-600 rounded" style={{ width: `${Math.min(Math.max(aVal,0),100)}%` }} />
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded">
                      <div className="h-2 bg-green-600 rounded" style={{ width: `${Math.min(Math.max(bVal,0),100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>
        )}
      </div>
    </div>
  );
}


