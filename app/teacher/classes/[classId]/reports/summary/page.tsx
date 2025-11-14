"use client";

import { useEffect, useMemo, useState } from "react";
import { generateClassSummaryPDF, downloadPDF, ClassSummaryData } from "@/lib/pdfGenerator";

export default function ClassSummaryReport({ params }: { params: { classId: string } }) {
  const { classId } = params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
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

  const analytics = useMemo(() => {
    const careerCounts: Record<string, number> = {};
    const educationPathCounts = { lukio: 0, ammattikoulu: 0, kansanopisto: 0 };
    const dims = { interests: 0, values: 0, workstyle: 0, context: 0 };
    let dimN = 0;

    results.forEach((r) => {
      const p = r.result_payload || {};
      const careers = p.top_careers || p.topCareers || [];
      careers.slice(0,5).forEach((c: any) => { careerCounts[c.title] = (careerCounts[c.title]||0)+1; });

      const ds = p.dimension_scores || p.dimensionScores;
      if (ds) { dims.interests += ds.interests||0; dims.values += ds.values||0; dims.workstyle += ds.workstyle||0; dims.context += ds.context||0; dimN++; }

      if (p.cohort === 'YLA') {
        const ed = p.educationPath || p.education_path;
        const primary = ed?.primary || ed?.education_path_primary;
        if (primary && primary in educationPathCounts) {
          (educationPathCounts as any)[primary]++;
        }
      }
    });

    const topCareers = Object.entries(careerCounts).map(([name,count]) => ({ name, count })).sort((a,b)=>b.count-a.count).slice(0,10);
    const dimAvg = dimN>0 ? {
      interests: dims.interests/dimN,
      values: dims.values/dimN,
      workstyle: dims.workstyle/dimN,
      context: dims.context/dimN,
    } : { interests:0, values:0, workstyle:0, context:0 };

    return { topCareers, educationPathCounts, dimAvg };
  }, [results]);

  const handleDownloadPDF = async () => {
    if (results.length === 0) return;
    
    setGeneratingPDF(true);
    try {
      const reportData: ClassSummaryData = {
        className: classId.substring(0, 8),
        date: new Date().toLocaleDateString('fi-FI'),
        totalTests: results.length,
        topCareers: analytics.topCareers,
        educationPathDistribution: analytics.educationPathCounts,
        dimensionAverages: analytics.dimAvg,
        cohortDistribution: (() => {
          const cohortCounts: Record<string, number> = {};
          results.forEach((r) => {
            const cohort = r.result_payload?.cohort || 'Unknown';
            cohortCounts[cohort] = (cohortCounts[cohort] || 0) + 1;
          });
          return cohortCounts;
        })(),
      };

      const blob = await generateClassSummaryPDF(reportData);
      const filename = `luokan-yhteenveto-${classId.substring(0, 8)}-${new Date().toISOString().split('T')[0]}.pdf`;
      downloadPDF(blob, filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('PDF:n luominen epäonnistui. Yritä uudelleen.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <style>{`
        @page { size: A4; margin: 20mm 15mm; }
        @media print { .no-print { display: none; } }
      `}</style>
      <div className="max-w-3xl mx-auto py-6">
        <div className="no-print mb-4 flex justify-end gap-2">
          <button 
            onClick={handleDownloadPDF}
            disabled={generatingPDF || results.length === 0}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generatingPDF ? 'Luodaan PDF...' : '📥 Lataa PDF'}
          </button>
          <button 
            onClick={() => window.print()} 
            className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            🖨️ Tulosta
          </button>
        </div>
        <header className="mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold">Urakompassi - Luokan yhteenveto</h1>
          <p className="text-sm mt-1">Luokka: {classId.substring(0,8)} • Päivä: {new Date().toLocaleDateString('fi-FI')}</p>
          <p className="text-sm">Testejä yhteensä: {results.length}</p>
        </header>

        {loading && <p>Ladataan...</p>}
        {error && <p className="text-red-600">Virhe: {error}</p>}

        {!loading && !error && (
          <main className="space-y-6">
            <section>
              <h2 className="font-semibold text-lg mb-2">Yleisimmät ammatit</h2>
              <ol className="list-decimal list-inside text-sm space-y-1">
                {analytics.topCareers.map((c,i)=>(<li key={i}>{c.name} ({c.count})</li>))}
                {analytics.topCareers.length===0 && <li>—</li>}
              </ol>
            </section>

            <section>
              <h2 className="font-semibold text-lg mb-2">Koulutuspolut (YLA)</h2>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Lukio: {analytics.educationPathCounts.lukio}</li>
                <li>Ammattikoulu: {analytics.educationPathCounts.ammattikoulu}</li>
                <li>Kansanopisto: {analytics.educationPathCounts.kansanopisto}</li>
              </ul>
            </section>

            <section>
              <h2 className="font-semibold text-lg mb-2">Dimensiot (keskiarvot)</h2>
              <div className="space-y-2">
                {([
                  ['Kiinnostukset', analytics.dimAvg.interests],
                  ['Arvot', analytics.dimAvg.values],
                  ['Työtapa', analytics.dimAvg.workstyle],
                  ['Konteksti', analytics.dimAvg.context]
                ] as [string, number][]).map(([label,val])=> (
                  <div key={label} className="text-sm">
                    <div className="flex justify-between"><span>{label}</span><span>{Math.round(val)}%</span></div>
                    <div className="w-full h-2 bg-gray-200 rounded">
                      <div className="h-2 bg-primary rounded" style={{ width: `${Math.min(Math.max(val,0),100)}%` }} />
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





