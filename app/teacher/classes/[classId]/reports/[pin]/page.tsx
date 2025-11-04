"use client";

import { useEffect, useMemo, useState } from "react";
import { generateStudentPDF, downloadPDF, StudentReportData } from "@/lib/pdfGenerator";

interface ResultPayload {
  cohort?: string;
  top_careers?: { title: string; score?: number }[];
  topCareers?: { title: string; score?: number }[];
  dimension_scores?: Record<string, number>;
  dimensionScores?: Record<string, number>;
  educationPath?: any;
  education_path?: any;
}

export default function StudentReportPage({ params, searchParams }: { params: { classId: string; pin: string }, searchParams: { name?: string } }) {
  const { classId, pin } = params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const decodedName = useMemo(() => {
    try {
      return searchParams?.name ? decodeURIComponent(searchParams.name) : "";
    } catch {
      return "";
    }
  }, [searchParams?.name]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/classes/${classId}/results`);
        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Failed to fetch results");
        const found = (data.results || []).find((r: any) => r.pin === pin);
        if (!cancelled) setResult(found || null);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [classId, pin]);

  const payload: ResultPayload | null = result?.result_payload || null;
  const careers = (payload?.top_careers || payload?.topCareers || []) as { title: string; score?: number }[];
  const dims = (payload?.dimension_scores || payload?.dimensionScores || {}) as Record<string, number>;
  const cohort = payload?.cohort || "";
  const edu = payload?.educationPath || payload?.education_path;

  const handleDownloadPDF = async () => {
    if (!result || !payload) return;
    
    setGeneratingPDF(true);
    try {
      const reportData: StudentReportData = {
        name: decodedName || '',
        pin: pin,
        date: new Date(result.created_at).toLocaleDateString('fi-FI'),
        className: classId.substring(0, 8),
        cohort: cohort || undefined,
        topCareers: careers,
        dimensions: {
          interests: dims.interests || 0,
          values: dims.values || 0,
          workstyle: dims.workstyle || 0,
          context: dims.context || 0,
        },
        educationPath: edu ? {
          primary: edu.primary || edu.education_path_primary,
          score: edu.scores?.[edu.primary] || edu.education_path_scores?.[edu.primary]
        } : undefined,
      };

      const blob = await generateStudentPDF(reportData);
      const filename = `raportti-${decodedName || pin}-${new Date().toISOString().split('T')[0]}.pdf`;
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
        @media print {
          .no-print { display: none; }
        }
      `}</style>

      <div className="max-w-3xl mx-auto py-6">
        <div className="no-print mb-4 flex justify-end gap-2">
          <button 
            onClick={handleDownloadPDF}
            disabled={generatingPDF || !result}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <h1 className="text-2xl font-bold">CareerCompassi - Oppilaan raportti</h1>
          <p className="text-sm mt-1">Luokka: {classId.substring(0, 8)} • PIN: {pin} • Päivä: {result ? new Date(result.created_at).toLocaleDateString('fi-FI') : ''}</p>
          <p className="text-sm">Nimi: {decodedName || '—'} • Kohortti: {cohort || '—'}</p>
        </header>

        {loading && <p>Ladataan...</p>}
        {error && <p className="text-red-600">Virhe: {error}</p>}
        {!loading && !result && !error && <p>Raporttia ei löytynyt.</p>}

        {result && (
          <main className="space-y-6">
            <section>
              <h2 className="font-semibold text-lg mb-2">Yhteenveto</h2>
              <p className="text-sm">Alla on yhteenveto opiskelijan uraprofiilista ja suosituksista testin perusteella.</p>
            </section>

            <section>
              <h2 className="font-semibold text-lg mb-2">Top 5 uraa</h2>
              <ol className="list-decimal list-inside text-sm space-y-1">
                {careers.slice(0, 5).map((c, i) => (
                  <li key={i}>{c.title}{typeof c.score === 'number' ? ` (${Math.round(c.score * 100)}%)` : ''}</li>
                ))}
                {careers.length === 0 && <li>—</li>}
              </ol>
            </section>

            {cohort === 'YLA' && (
              <section>
                <h2 className="font-semibold text-lg mb-2">Koulutuspolkusuositus (YLA)</h2>
                <p className="text-sm">
                  {(() => {
                    if (!edu) return '—';
                    const primary = edu.primary || edu.education_path_primary;
                    if (!primary) return '—';
                    const names: Record<string,string> = { lukio: 'Lukio', ammattikoulu: 'Ammattikoulu', kansanopisto: 'Kansanopisto' };
                    const pathName = names[primary] || primary;
                    const scores = edu.scores || edu.education_path_scores || {};
                    const pct = scores[primary];
                    return pct ? `${pathName} (${Math.round(pct)}%)` : pathName;
                  })()}
                </p>
              </section>
            )}

            <section>
              <h2 className="font-semibold text-lg mb-2">Dimensiot</h2>
              <div className="space-y-2">
                {['interests','values','workstyle','context'].map(key => {
                  const label: Record<string,string> = { interests: 'Kiinnostukset', values: 'Arvot', workstyle: 'Työtapa', context: 'Konteksti' };
                  const val = (dims as any)[key] || 0;
                  return (
                    <div key={key} className="text-sm">
                      <div className="flex justify-between">
                        <span>{label[key]}</span>
                        <span>{Math.round(val)}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded">
                        <div className="h-2 bg-blue-600 rounded" style={{ width: `${Math.min(Math.max(val,0),100)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section>
              <h2 className="font-semibold text-lg mb-2">Huomautus</h2>
              <p className="text-xs text-gray-600">Nimi on opettajan itse lisäämä paikallinen tieto eikä sitä tallenneta CareerCompassin palvelimille.</p>
            </section>
          </main>
        )}
      </div>
    </div>
  );
}





