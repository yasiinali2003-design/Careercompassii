"use client";

import { useEffect, useMemo, useState } from "react";
import { generateStudentPDF, generateParentReport, downloadPDF, StudentReportData, ParentReportData } from "@/lib/pdfGenerator";
import { Download, Printer, FileText, TrendingUp, Award, GraduationCap, Target } from "lucide-react";
import Logo from "@/components/Logo";
import Link from "next/link";

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
  const [generatingParentPDF, setGeneratingParentPDF] = useState(false);
  const [teacherNotes, setTeacherNotes] = useState("");

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

  const handleDownloadParentPDF = async () => {
    if (!result || !payload) return;
    
    setGeneratingParentPDF(true);
    try {
      const parentReportData: ParentReportData = {
        name: decodedName || '',
        date: new Date(result.created_at).toLocaleDateString('fi-FI'),
        className: classId.substring(0, 8),
        topCareers: careers.map(c => ({ title: c.title })),
        educationPath: edu ? {
          primary: edu.primary || edu.education_path_primary
        } : undefined,
        profile: result.result_payload?.profile || result.result_payload?.user_profile || undefined,
        teacherNotes: teacherNotes.trim() || undefined,
      };

      const blob = await generateParentReport(parentReportData);
      const filename = `vanhempainraportti-${decodedName || pin}-${new Date().toISOString().split('T')[0]}.pdf`;
      downloadPDF(blob, filename);
    } catch (error) {
      console.error('Error generating parent PDF:', error);
      alert('Vanhempainraportin luominen epäonnistui. Yritä uudelleen.');
    } finally {
      setGeneratingParentPDF(false);
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

      <div className="max-w-4xl mx-auto py-6 px-4">
        {/* Logo & Navigation - No Print */}
        <div className="no-print mb-6">
          <Link href={`/teacher/classes/${classId}`}>
            <Logo className="h-10 w-auto" />
          </Link>
        </div>

        {/* Action Toolbar - No Print */}
        <div className="no-print mb-4 bg-white/5 backdrop-blur-sm border-b border-white/10 -mx-4 px-4 py-3 flex flex-wrap gap-2 justify-between items-center">
          <Link href={`/teacher/classes/${classId}`} className="text-sm text-neutral-300 hover:text-white flex items-center gap-1">
            ← Takaisin luokkaan
          </Link>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadPDF}
              disabled={generatingPDF || !result}
              className="inline-flex items-center gap-1.5 bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-3.5 w-3.5" />
              {generatingPDF ? 'Luodaan...' : 'PDF'}
            </button>
            <button
              onClick={handleDownloadParentPDF}
              disabled={generatingParentPDF || !result}
              className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 text-sm font-medium hover:bg-white/20 disabled:opacity-50"
            >
              <FileText className="h-3.5 w-3.5" />
              {generatingParentPDF ? 'Luodaan...' : 'Vanhemmille'}
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

        {/* Teacher Notes - No Print */}
        <div className="no-print mb-4 bg-amber-50 border border-amber-200 p-4">
          <label className="block text-sm font-medium text-slate-900 mb-2">
            Opettajan huomiot (vanhempainraporttia varten)
          </label>
          <textarea
            value={teacherNotes}
            onChange={(e) => setTeacherNotes(e.target.value)}
            placeholder="Kirjoita huomioita..."
            className="w-full px-3 py-2 border border-slate-300 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            rows={2}
            maxLength={500}
          />
          <p className="text-xs text-slate-600 mt-1">{teacherNotes.length}/500</p>
        </div>

        {/* Main Report Document */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/20 print-bg-white">
          {/* Document Header */}
          <div className="border-b-2 border-primary bg-white/5 backdrop-blur-sm print-bg-white p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">Urakompassi</h1>
                <p className="text-sm text-slate-600">Oppilaan uraraportti</p>
              </div>
              <div className="text-right text-sm">
                <p className="text-slate-600">Luotu: {result ? new Date(result.created_at).toLocaleDateString('fi-FI') : ''}</p>
                <p className="text-slate-600">Tulostus: {new Date().toLocaleDateString('fi-FI')}</p>
              </div>
            </div>

            {/* Student Info Table */}
            <table className="w-full text-sm border-collapse">
              <tbody>
                <tr className="border-t border-slate-200">
                  <td className="py-2 pr-4 font-medium text-slate-700 w-32">Luokka:</td>
                  <td className="py-2 text-slate-900">{classId.substring(0, 8)}</td>
                  <td className="py-2 pr-4 font-medium text-slate-700 w-32">PIN-koodi:</td>
                  <td className="py-2 text-slate-900">{pin}</td>
                </tr>
                <tr className="border-t border-slate-200">
                  <td className="py-2 pr-4 font-medium text-slate-700">Nimi:</td>
                  <td className="py-2 text-slate-900">{decodedName || '—'}</td>
                  <td className="py-2 pr-4 font-medium text-slate-700">Kohortti:</td>
                  <td className="py-2 text-slate-900">{cohort || '—'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Content Area */}
          <div className="p-8">
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                <p className="mt-4 text-slate-600">Ladataan raporttia...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-700 font-medium">Virhe: {error}</p>
              </div>
            )}

            {!loading && !result && !error && (
              <div className="text-center py-12">
                <p className="text-slate-600">Raporttia ei löytynyt.</p>
              </div>
            )}

            {result && (
              <div className="space-y-8">
                {/* Summary */}
                <div className="border-l-4 border-primary pl-4 py-2 bg-white/5 backdrop-blur-sm print-bg-white">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Tämä raportti sisältää opiskelijan henkilökohtaiset urasuositukset 30 kysymyksen testin perusteella.
                    Tulokset perustuvat analyysiin 361 eri ammatin joukosta.
                  </p>
                </div>

                {/* Top Careers - Table Format */}
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b-2 border-slate-200">
                    Urasuositukset
                  </h2>
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-y border-slate-300">
                        <th className="text-left py-2 px-3 font-semibold text-slate-700 w-12">#</th>
                        <th className="text-left py-2 px-3 font-semibold text-slate-700">Ammatti</th>
                        <th className="text-right py-2 px-3 font-semibold text-slate-700 w-24">Sopivuus</th>
                      </tr>
                    </thead>
                    <tbody>
                      {careers.slice(0, 5).map((c, i) => (
                        <tr key={i} className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 px-3 font-bold text-primary">{i + 1}</td>
                          <td className="py-3 px-3 font-medium text-slate-900">{c.title}</td>
                          <td className="py-3 px-3 text-right">
                            {typeof c.score === 'number' ? (
                              <span className="inline-block px-2 py-1 bg-primary/10 text-primary font-semibold rounded">
                                {Math.round(c.score * 100)}%
                              </span>
                            ) : '—'}
                          </td>
                        </tr>
                      ))}
                      {careers.length === 0 && (
                        <tr>
                          <td colSpan={3} className="py-8 px-3 text-center text-slate-500">
                            Ei urasuosituksia saatavilla
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Education Path for YLA */}
                {cohort === 'YLA' && (
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b-2 border-slate-200">
                      Koulutuspolkusuositus <span className="text-sm font-normal text-slate-600">(Yläkoulu)</span>
                    </h2>
                    <div className="bg-amber-50 border border-amber-200 p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">
                          {(() => {
                            if (!edu) return 'Ei suositusta saatavilla';
                            const primary = edu.primary || edu.education_path_primary;
                            if (!primary) return 'Ei suositusta saatavilla';
                            const names: Record<string,string> = {
                              lukio: 'Lukio',
                              ammattikoulu: 'Ammattikoulu',
                              kansanopisto: 'Kansanopisto'
                            };
                            return names[primary] || primary;
                          })()}
                        </span>
                        {(() => {
                          if (!edu) return null;
                          const primary = edu.primary || edu.education_path_primary;
                          if (!primary) return null;
                          const scores = edu.scores || edu.education_path_scores || {};
                          const pct = scores[primary];
                          return pct ? (
                            <span className="text-secondary font-bold">{Math.round(pct)}% sopivuus</span>
                          ) : null;
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                {/* Dimensions - Bar Chart Style */}
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b-2 border-slate-200">
                    Profiilianalyysi
                  </h2>
                  <div className="space-y-4">
                    {[
                      { key: 'interests', label: 'Kiinnostuksen kohteet' },
                      { key: 'values', label: 'Arvot ja motivaatio' },
                      { key: 'workstyle', label: 'Työskentelytapa' },
                      { key: 'context', label: 'Työympäristö' }
                    ].map(({ key, label }) => {
                      const val = (dims as any)[key] || 0;
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

                {/* Footer Notice */}
                <div className="border-t-2 border-slate-200 pt-4 mt-8">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Huomio:</strong> Oppilaan nimi on opettajan itse lisäämä paikallinen tieto eikä sitä tallenneta Urakompassin palvelimille.
                    Kaikki henkilötiedot käsitellään luottamuksellisesti GDPR-säännösten mukaisesti.
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





