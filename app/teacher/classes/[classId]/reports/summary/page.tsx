"use client";

import { useEffect, useMemo, useState } from "react";
import { generateClassSummaryPDF, downloadPDF, ClassSummaryData } from "@/lib/pdfGenerator";
import { Download, Printer } from "lucide-react";
import Logo from "@/components/Logo";
import Link from "next/link";

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
    <div className="min-h-screen">
      <style>{`
        @page { size: A4; margin: 20mm 15mm; }
        @media print {
          .no-print { display: none; }
          .print-bg-white { background: white !important; }
        }
      `}</style>

      <div className="max-w-5xl mx-auto py-6 px-4">
        {/* Logo */}
        <div className="no-print mb-6">
          <Link href={`/teacher/classes/${classId}`}>
            <Logo className="h-10 w-auto" />
          </Link>
        </div>

        {/* Action Toolbar */}
        <div className="no-print mb-4 bg-white/5 backdrop-blur-sm border-b border-white/10 -mx-4 px-4 py-3 flex flex-wrap gap-2 justify-between items-center">
          <Link href={`/teacher/classes/${classId}`} className="text-sm text-slate-600 hover:text-primary flex items-center gap-1">
            ← Takaisin luokkaan
          </Link>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadPDF}
              disabled={generatingPDF || results.length === 0}
              className="inline-flex items-center gap-1.5 bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-3.5 w-3.5" />
              {generatingPDF ? 'Luodaan...' : 'PDF'}
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 text-sm font-medium hover:bg-white/20"
            >
              <Printer className="h-3.5 w-3.5" />
              Tulosta
            </button>
          </div>
        </div>

        {/* Main Document */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/20 print-bg-white">
          {/* Header */}
          <div className="border-b-2 border-primary bg-white/5 backdrop-blur-sm print-bg-white p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">Urakompassi</h1>
                <p className="text-sm text-slate-600">Luokan yhteenveto</p>
              </div>
              <div className="text-right text-sm">
                <p className="text-slate-600">Päivämäärä: {new Date().toLocaleDateString('fi-FI')}</p>
              </div>
            </div>

            {/* Class Info */}
            <table className="w-full text-sm border-collapse">
              <tbody>
                <tr className="border-t border-slate-200">
                  <td className="py-2 pr-4 font-medium text-slate-700 w-40">Luokka:</td>
                  <td className="py-2 text-slate-900">{classId.substring(0, 8)}</td>
                  <td className="py-2 pr-4 font-medium text-slate-700 w-40">Testejä yhteensä:</td>
                  <td className="py-2 text-slate-900 font-bold">{results.length}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                <p className="mt-4 text-slate-600">Ladataan...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 p-4 text-center">
                <p className="text-red-700 font-medium">Virhe: {error}</p>
              </div>
            )}

            {!loading && !error && (
              <div className="space-y-8">
                {/* Top Careers Table */}
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b-2 border-slate-200">
                    Yleisimmät ammatit
                  </h2>
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-y border-slate-300">
                        <th className="text-left py-2 px-3 font-semibold text-slate-700 w-12">#</th>
                        <th className="text-left py-2 px-3 font-semibold text-slate-700">Ammatti</th>
                        <th className="text-right py-2 px-3 font-semibold text-slate-700 w-24">Oppilaita</th>
                        <th className="text-right py-2 px-3 font-semibold text-slate-700 w-24">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.topCareers.map((c, i) => {
                        const percentage = results.length > 0 ? ((c.count / results.length) * 100).toFixed(0) : 0;
                        return (
                          <tr key={i} className="border-b border-white/10 hover:bg-white/5">
                            <td className="py-3 px-3 font-bold text-primary">{i + 1}</td>
                            <td className="py-3 px-3 text-slate-900">{c.name}</td>
                            <td className="py-3 px-3 text-right font-semibold">{c.count}</td>
                            <td className="py-3 px-3 text-right text-slate-600">{percentage}%</td>
                          </tr>
                        );
                      })}
                      {analytics.topCareers.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-8 px-3 text-center text-slate-500">
                            Ei dataa saatavilla
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Education Paths */}
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b-2 border-slate-200">
                    Koulutuspolkujakauma <span className="text-sm font-normal text-slate-600">(Yläkoulu)</span>
                  </h2>
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-y border-slate-300">
                        <th className="text-left py-2 px-3 font-semibold text-slate-700">Koulutuspolku</th>
                        <th className="text-right py-2 px-3 font-semibold text-slate-700 w-32">Oppilaita</th>
                        <th className="text-right py-2 px-3 font-semibold text-slate-700 w-32">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { key: 'lukio', label: 'Lukio' },
                        { key: 'ammattikoulu', label: 'Ammattikoulu' },
                        { key: 'kansanopisto', label: 'Kansanopisto' }
                      ].map(({ key, label }) => {
                        const count = (analytics.educationPathCounts as any)[key] || 0;
                        const total = analytics.educationPathCounts.lukio +
                                     analytics.educationPathCounts.ammattikoulu +
                                     analytics.educationPathCounts.kansanopisto;
                        const percentage = total > 0 ? ((count / total) * 100).toFixed(0) : 0;
                        return (
                          <tr key={key} className="border-b border-slate-200 hover:bg-slate-50">
                            <td className="py-3 px-3 font-medium text-slate-900">{label}</td>
                            <td className="py-3 px-3 text-right font-semibold">{count}</td>
                            <td className="py-3 px-3 text-right text-slate-600">{percentage}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Dimension Averages */}
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b-2 border-slate-200">
                    Luokan keskiarvot - Profiilianalyysi
                  </h2>
                  <div className="space-y-4">
                    {[
                      { key: 'interests', label: 'Kiinnostuksen kohteet' },
                      { key: 'values', label: 'Arvot ja motivaatio' },
                      { key: 'workstyle', label: 'Työskentelytapa' },
                      { key: 'context', label: 'Työympäristö' }
                    ].map(({ key, label }) => {
                      const val = (analytics.dimAvg as any)[key] || 0;
                      return (
                        <div key={key}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-medium text-slate-700">{label}</span>
                            <span className="text-sm font-bold text-slate-900">{Math.round(val)}%</span>
                          </div>
                          <div className="w-full bg-slate-200 h-6 relative">
                            <div
                              className="absolute top-0 left-0 h-full bg-primary flex items-center justify-end pr-2"
                              style={{ width: `${Math.min(Math.max(val, 0), 100)}%` }}
                            >
                              {val > 15 && <span className="text-xs font-medium text-white">{Math.round(val)}%</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t-2 border-slate-200 pt-4 mt-8">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Huomio:</strong> Tämä yhteenveto perustuu luokan kaikkien oppilaiden testivastauksiin.
                    Yksittäisten oppilaiden raportit ovat saatavilla erikseen luokan hallintapaneelissa.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
