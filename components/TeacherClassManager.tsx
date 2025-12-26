"use client";

/**
 * Teacher Class Manager Component
 * Professional dashboard for managing student PINs, names, and test results
 * Design: Clean, minimal color palette with consistent styling
 */

import { useState, useEffect, useCallback } from 'react';
import {
  saveMappingToStorage,
  loadMappingFromStorage,
  exportMappingAsFile,
  importMappingFromFile
} from '@/lib/teacherCrypto';
import { generateStudentPDF, generateClassSummaryPDF, downloadPDF } from '@/lib/pdfGenerator';
import { checkClassCompletion, checkAtRiskStudent, triggerNotification } from '@/lib/notificationTriggers';
import { generateConversationStarters } from '@/lib/conversationStarters';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { SuccessMessage } from '@/components/ui/SuccessMessage';
import { Tooltip } from '@/components/ui/Tooltip';
import { useNotification } from '@/components/ui/useNotification';

interface Props {
  classId: string;
  classToken: string;
}

interface PackageInfo {
  hasPremium: boolean;
  package: 'premium' | 'standard';
}

interface ClassAnalytics {
  topCareers: Array<{ name: string; count: number }>;
  categoryDistribution: Record<string, number>;
  dimensionAverages: {
    interests: number;
    values: number;
    workstyle: number;
    context: number;
  };
  educationPathDistribution: {
    lukio: number;
    ammattikoulu: number;
    kansanopisto: number;
  };
  cohortDistribution: Record<string, number>;
}

function calculateAnalytics(results: any[]): ClassAnalytics {
  const careerCounts: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};
  const dimensionSums = { interests: 0, values: 0, workstyle: 0, context: 0 };
  const educationPathCounts = { lukio: 0, ammattikoulu: 0, kansanopisto: 0 };
  const cohortCounts: Record<string, number> = {};
  let dimensionCount = 0;

  results.forEach(result => {
    const payload = result.result_payload || {};
    const cohort = payload.cohort || 'Unknown';
    cohortCounts[cohort] = (cohortCounts[cohort] || 0) + 1;

    const topCareers = payload.top_careers || payload.topCareers || [];
    topCareers.slice(0, 3).forEach((career: any) => {
      careerCounts[career.title] = (careerCounts[career.title] || 0) + 1;
    });

    const dimScores = payload.dimension_scores || payload.dimensionScores;
    if (dimScores) {
      const rawI = dimScores.interests || 0;
      const rawV = dimScores.values || 0;
      const rawW = dimScores.workstyle || 0;
      const rawC = dimScores.context || 0;
      const maxRaw = Math.max(rawI, rawV, rawW, rawC);
      const mult = maxRaw > 0 && maxRaw <= 1 ? 100 : 1;
      dimensionSums.interests += rawI * mult;
      dimensionSums.values += rawV * mult;
      dimensionSums.workstyle += rawW * mult;
      dimensionSums.context += rawC * mult;
      dimensionCount++;
    }

    if (cohort === 'YLA') {
      const edPath = payload.educationPath || payload.education_path;
      if (edPath?.primary) {
        const path = edPath.primary || edPath.education_path_primary;
        if (path in educationPathCounts) {
          educationPathCounts[path as keyof typeof educationPathCounts]++;
        }
      }
    }
  });

  return {
    topCareers: Object.entries(careerCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    categoryDistribution: categoryCounts,
    dimensionAverages: dimensionCount > 0 ? {
      interests: dimensionSums.interests / dimensionCount,
      values: dimensionSums.values / dimensionCount,
      workstyle: dimensionSums.workstyle / dimensionCount,
      context: dimensionSums.context / dimensionCount,
    } : { interests: 0, values: 0, workstyle: 0, context: 0 },
    educationPathDistribution: educationPathCounts,
    cohortDistribution: cohortCounts,
  };
}

function generateStudentProfile(result: any, name: string, classAvg: ClassAnalytics): string {
  const payload = result.result_payload || {};
  const dimScores = payload.dimension_scores || payload.dimensionScores || {};
  const topCareers = (payload.top_careers || payload.topCareers || []).slice(0, 3);
  const cohort = payload.cohort || '';

  const profile: string[] = [];
  const interests = dimScores.interests || 0;
  const values = dimScores.values || 0;
  const workstyle = dimScores.workstyle || 0;
  const context = dimScores.context || 0;

  if (workstyle > 70) {
    profile.push('Haluaa oppia tekemällä');
  } else if (workstyle < 50) {
    profile.push('Haluaa oppia teoriapainotteisesti');
  }

  if (values > 75) {
    profile.push('Arvostaa auttamista ja merkityksellisyyttä');
  } else if (values > 60) {
    profile.push('Yhdistää arvot ja käytännöllisyyden');
  }

  if (topCareers.length > 0) {
    const topTitles = topCareers.map((c: any) => c.title).slice(0, 2);
    profile.push(`Kiinnostunut: ${topTitles.join(', ')}`);
  }

  if (cohort === 'YLA') {
    const edPath = payload.educationPath || payload.education_path;
    if (edPath?.primary) {
      const pathNames: Record<string, string> = {
        'lukio': 'Lukio',
        'ammattikoulu': 'Ammattikoulu',
        'kansanopisto': 'Kansanopisto'
      };
      const path = pathNames[edPath.primary] || edPath.primary;
      profile.push(`Suositus: ${path}`);
    }
  }

  const avgScore = (interests + values + workstyle + context) / 4;
  if (avgScore < 50 || (interests < 50 && values < 50 && workstyle < 50 && context < 50)) {
    profile.push('Hyötyisi ohjauksesta kiinnostuksen kohteiden löytämisessä');
  }

  return profile.join(' • ') || 'Odottaa arviointia';
}

export default function TeacherClassManager({ classId, classToken }: Props) {
  const [activeTab, setActiveTab] = useState<'pins' | 'names' | 'results'>('pins');
  const [pins, setPins] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [nameMapping, setNameMapping] = useState<Record<string, string>>({});
  const [results, setResults] = useState<any[]>([]);
  const [resultsLoading, setResultsLoading] = useState<boolean>(false);
  const [resultsError, setResultsError] = useState<string | null>(null);
  const [exporting, setExporting] = useState<boolean>(false);
  const [filterCohort, setFilterCohort] = useState<string>('all');
  const [filterEducationPath, setFilterEducationPath] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'table' | 'detailed'>('table');
  const [packageInfo, setPackageInfo] = useState<PackageInfo | null>(null);
  const [generatingPDFs, setGeneratingPDFs] = useState(false);
  const [sendingNotification, setSendingNotification] = useState(false);
  const [teacherEmail, setTeacherEmail] = useState<string>('');
  const [pinCount, setPinCount] = useState<string>('');
  const [pinCountError, setPinCountError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { showSuccess, showError, showInfo } = useNotification();

  const analytics = calculateAnalytics(results);
  const completionCheck = checkClassCompletion(pins.length, results.length);
  const atRiskStudents = results.filter(r => checkAtRiskStudent(r).shouldNotify);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://careercompassii.vercel.app';
  const studentTestLink = `${baseUrl}/${classToken}/test`;
  const classResultsLink = `${baseUrl}/${classToken}`;

  const handleCopyLink = useCallback((link: string, successText: string) => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      showError('Kopiointi ei ole tuettu tässä selaimessa.');
      return;
    }
    navigator.clipboard.writeText(link)
      .then(() => showSuccess(successText))
      .catch(() => showError('Linkin kopiointi epäonnistui.'));
  }, [showSuccess, showError]);

  const fetchPins = useCallback(async () => {
    try {
      const response = await fetch(`/api/classes/${classId}/pins`);
      const data = await response.json();
      if (data.success) {
        setPins(data.pins.map((p: any) => p.pin));
      }
    } catch (error) {
      console.error('Error fetching PINs:', error);
    }
  }, [classId]);

  const loadNameMapping = useCallback(() => {
    const mapping = loadMappingFromStorage(classId);
    if (mapping) setNameMapping(mapping);
  }, [classId]);

  const fetchResults = useCallback(async () => {
    setResultsLoading(true);
    setResultsError(null);
    try {
      const response = await fetch(`/api/classes/${classId}/results`);
      const data = await response.json();
      if (data.success) {
        setResults(data.results);
      } else {
        setResultsError('Tulosten lataus epäonnistui.');
      }
    } catch (error) {
      setResultsError('Verkkovirhe tuloksia ladattaessa.');
    }
    setResultsLoading(false);
  }, [classId]);

  useEffect(() => {
    fetchPins();
    loadNameMapping();
    fetchResults();
    const savedEmail = localStorage.getItem(`teacher_email_${classId}`);
    if (savedEmail) setTeacherEmail(savedEmail);
    (async () => {
      try {
        const res = await fetch('/api/teacher-auth/package-check');
        const data = await res.json();
        if (data.success) {
          setPackageInfo({ hasPremium: data.hasPremium, package: data.package });
        }
      } catch (e) {
        setPackageInfo({ hasPremium: false, package: 'standard' });
      }
    })();
  }, [classId, fetchPins, fetchResults, loadNameMapping]);

  const validatePinCount = (value: string): boolean => {
    if (value === '') { setPinCountError(''); return false; }
    const num = parseInt(value, 10);
    if (isNaN(num)) { setPinCountError('Syötä kelvollinen numero'); return false; }
    if (num < 1) { setPinCountError('Vähintään 1 PIN-koodi'); return false; }
    if (num > 100) { setPinCountError('Maksimissaan 100 PIN-koodia'); return false; }
    setPinCountError('');
    return true;
  };

  const handlePinCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setPinCount(value);
      validatePinCount(value);
    }
  };

  const handleGeneratePins = async () => {
    if (!pinCount || !validatePinCount(pinCount)) return;
    const count = parseInt(pinCount, 10);
    await generatePins(count);
    setPinCount('');
    setPinCountError('');
  };

  const generatePins = async (count: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/classes/${classId}/pins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count })
      });
      const data = await response.json();
      if (data.success) {
        setPins(data.pins);
      } else {
        showError('PIN-koodien luominen epäonnistui.');
      }
    } catch (error) {
      showError('Verkkovirhe PIN-koodien luonnissa.');
    } finally {
      setLoading(false);
    }
  };

  const updateNameMapping = (pin: string, name: string) => {
    const updated = { ...nameMapping, [pin]: name };
    setNameMapping(updated);
    saveMappingToStorage(classId, updated);
  };

  const handleExport = () => {
    const passphrase = prompt('Syötä salasana salaukseen:');
    if (passphrase) {
      try {
        exportMappingAsFile(nameMapping, passphrase, classId);
      } catch (error) {
        showError('Nimilistan vienti epäonnistui.');
      }
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const passphrase = prompt('Syötä salasana purkamiseen:');
    if (!passphrase) return;
    try {
      const mapping = await importMappingFromFile(file, passphrase);
      setNameMapping(mapping);
      saveMappingToStorage(classId, mapping);
      showSuccess('Nimilista tuotu onnistuneesti!');
    } catch (error) {
      showError('Nimilistan tuonti epäonnistui.');
    }
  };

  const filteredResults = results.filter(result => {
    const payload = result.result_payload || {};
    const cohort = payload.cohort || '';
    const edPath = payload.educationPath || payload.education_path;
    if (filterCohort !== 'all' && cohort !== filterCohort) return false;
    if (filterEducationPath !== 'all' && cohort === 'YLA') {
      const primary = edPath?.primary || edPath?.education_path_primary;
      if (primary !== filterEducationPath) return false;
    }
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (nameMapping[a.pin] || '').localeCompare(nameMapping[b.pin] || '');
      case 'score':
        const avgA = (() => {
          const scores = (a.result_payload?.dimension_scores || a.result_payload?.dimensionScores || {}) as Record<string, number>;
          return Object.values(scores).reduce((sum, val) => sum + val, 0) / 4;
        })();
        const avgB = (() => {
          const scores = (b.result_payload?.dimension_scores || b.result_payload?.dimensionScores || {}) as Record<string, number>;
          return Object.values(scores).reduce((sum, val) => sum + val, 0) / 4;
        })();
        return avgB - avgA;
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  // Calculate completion percentage correctly
  const completionPercentage = pins.length > 0 ? Math.min(100, Math.round((results.length / pins.length) * 100)) : 0;

  return (
    <div className="space-y-6">
      {/* Progress Overview - Clean minimal design */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-white/60">Edistyminen</span>
          <span className="text-sm font-medium text-white">{results.length} / {pins.length} oppilasta</span>
        </div>
        <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full bg-urak-accent-blue rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <p className="text-xs text-white/40 mt-2">{completionPercentage}% suorittanut testin</p>
      </div>

      {/* Tabs - Minimal underline style */}
      <div className="border-b border-white/[0.06]">
        <div className="flex gap-6">
          {[
            { id: 'pins', label: 'PIN-koodit' },
            { id: 'names', label: 'Nimilista' },
            { id: 'results', label: `Tulokset (${filteredResults.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-sm font-medium transition-all relative ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-urak-accent-blue" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* PIN Tab */}
      {activeTab === 'pins' && (
        <div className="space-y-5">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm text-white/60 mb-2">PIN-koodien määrä</label>
              <input
                type="text"
                inputMode="numeric"
                value={pinCount}
                onChange={handlePinCountChange}
                onKeyDown={(e) => e.key === 'Enter' && !loading && pinCount && !pinCountError && handleGeneratePins()}
                placeholder="1-100"
                disabled={loading}
                className={`w-full px-4 py-2.5 bg-white/[0.03] border rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-urak-accent-blue/50 transition-all ${
                  pinCountError ? 'border-red-500/50' : 'border-white/[0.08]'
                }`}
              />
              {pinCountError && <p className="mt-1.5 text-xs text-red-400">{pinCountError}</p>}
            </div>
            <button
              onClick={handleGeneratePins}
              disabled={loading || !pinCount || !!pinCountError}
              className="px-5 py-2.5 bg-urak-accent-blue text-white text-sm font-medium rounded-lg hover:bg-urak-accent-blue/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Luodaan...' : 'Luo koodit'}
            </button>
          </div>

          {pins.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">{pins.length} PIN-koodia</span>
                <button
                  onClick={() => {
                    const csv = pins.join('\n');
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `pins-${classId.substring(0, 8)}.csv`;
                    a.click();
                    showSuccess('Ladattu CSV-tiedostona');
                  }}
                  className="text-sm text-urak-accent-blue hover:text-urak-accent-blue/80 transition-colors"
                >
                  Lataa CSV
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {pins.map((pin, i) => (
                  <div
                    key={i}
                    data-testid="pin-item"
                    className="bg-white/[0.03] border border-white/[0.06] py-2.5 rounded-lg text-center font-mono text-sm text-white/80"
                  >
                    {pin}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Names Tab */}
      {activeTab === 'names' && (
        <div className="space-y-4">
          {pins.length === 0 ? (
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-8 text-center">
              <p className="text-white/40">Luo ensin PIN-koodit</p>
            </div>
          ) : (
            <>
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-3">
                <p className="text-xs text-white/50">
                  <span className="text-white/70 font-medium">Turvallisuus:</span> Nimet tallennetaan vain tälle laitteelle.
                </p>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto">
                {pins.map((pin) => (
                  <div key={pin} className="flex gap-3 items-center">
                    <span className="font-mono text-sm bg-white/[0.03] border border-white/[0.06] px-3 py-2 rounded-lg w-20 text-center text-white/70">
                      {pin}
                    </span>
                    <input
                      type="text"
                      value={nameMapping[pin] || ''}
                      onChange={(e) => updateNameMapping(pin, e.target.value)}
                      placeholder="Oppilaan nimi"
                      className="flex-1 px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-urak-accent-blue/50 transition-all"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-white/[0.03] border border-white/[0.08] text-white/80 text-sm rounded-lg hover:bg-white/[0.06] transition-colors"
                >
                  Vie salattuna
                </button>
                <label className="px-4 py-2 bg-white/[0.03] border border-white/[0.08] text-white/80 text-sm rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer">
                  Tuo salattua
                  <input type="file" onChange={handleImport} className="hidden" accept=".json" />
                </label>
              </div>
            </>
          )}
        </div>
      )}

      {/* Results Tab */}
      {activeTab === 'results' && (
        <div className="space-y-5">
          {results.length === 0 ? (
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-8 text-center">
              <p className="text-white/40">Ei tuloksia vielä</p>
              <p className="text-xs text-white/30 mt-1">Oppilaat voivat aloittaa testin PIN-koodilla</p>
            </div>
          ) : (
            <>
              {/* Filters - Clean inline design */}
              <div className="flex flex-wrap gap-4 items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-white/50">Kohortti:</span>
                  <select
                    value={filterCohort}
                    onChange={(e) => setFilterCohort(e.target.value)}
                    className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-urak-accent-blue/50"
                  >
                    <option value="all">Kaikki</option>
                    <option value="YLA">YLA</option>
                    <option value="TASO2">TASO2</option>
                    <option value="NUORI">NUORI</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white/50">Suositus:</span>
                  <select
                    value={filterEducationPath}
                    onChange={(e) => setFilterEducationPath(e.target.value)}
                    className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-urak-accent-blue/50"
                  >
                    <option value="all">Kaikki</option>
                    <option value="lukio">Lukio</option>
                    <option value="ammattikoulu">Ammattikoulu</option>
                    <option value="kansanopisto">Kansanopisto</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white/50">Järjestä:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-urak-accent-blue/50"
                  >
                    <option value="date">Päivämäärä</option>
                    <option value="name">Nimi</option>
                    <option value="score">Pistemäärä</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white/50">Näkymä:</span>
                  <select
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value as 'table' | 'detailed')}
                    className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-urak-accent-blue/50"
                  >
                    <option value="table">Taulukko</option>
                    <option value="detailed">Yksityiskohtainen</option>
                  </select>
                </div>
              </div>

              {/* Guidance suggestions - subtle, non-alarming */}
              {atRiskStudents.length > 0 && (
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <p className="text-sm text-white/70 mb-2">
                        {atRiskStudents.length} oppilasta voisi hyötyä lisäohjauksesta
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {atRiskStudents.slice(0, 5).map((result) => (
                          <span key={result.pin} className="text-xs px-2.5 py-1 bg-white/[0.04] rounded-md text-white/60">
                            {nameMapping[result.pin] || result.pin}
                          </span>
                        ))}
                        {atRiskStudents.length > 5 && (
                          <span className="text-xs px-2.5 py-1 bg-white/[0.04] rounded-md text-white/40">
                            +{atRiskStudents.length - 5} muuta
                          </span>
                        )}
                      </div>
                    </div>
                    <Tooltip content="Näiden oppilaiden vastaukset viittaavat siihen, että he voisivat hyötyä henkilökohtaisesta ohjauskeskustelusta." />
                  </div>
                </div>
              )}

              {/* Status */}
              {resultsLoading && (
                <div className="flex items-center gap-2 text-white/50 text-sm">
                  <div className="animate-spin h-4 w-4 border-2 border-urak-accent-blue border-t-transparent rounded-full" />
                  Ladataan...
                </div>
              )}
              {resultsError && (
                <ErrorMessage message={resultsError} onDismiss={() => setResultsError(null)} />
              )}

              {/* Export Buttons - Unified style */}
              <div className="flex gap-3 flex-wrap">
                <button
                  type="button"
                  disabled={exporting || results.length === 0}
                  onClick={() => {
                    setExporting(true);
                    const csv = [
                      ['Nimi', 'PIN', 'Päivämäärä', 'Kohortti', 'Suositus', 'Top 1', 'Top 2', 'Top 3'].join(','),
                      ...filteredResults.map(result => {
                        const payload = result.result_payload;
                        const cohort = payload?.cohort || '';
                        const topCareers = payload?.top_careers || payload?.topCareers || [];
                        const educationPath = payload?.educationPath || payload?.education_path;
                        let educationPathDisplay = '';
                        if (cohort === 'YLA' && educationPath) {
                          const primary = educationPath.primary || educationPath.education_path_primary;
                          if (primary) {
                            const pathNames: Record<string, string> = { 'lukio': 'Lukio', 'ammattikoulu': 'Ammattikoulu', 'kansanopisto': 'Kansanopisto' };
                            educationPathDisplay = pathNames[primary] || primary;
                          }
                        }
                        return [
                          nameMapping[result.pin] || '',
                          result.pin,
                          new Date(result.created_at).toLocaleDateString('fi-FI'),
                          cohort || '',
                          educationPathDisplay,
                          topCareers[0]?.title || '',
                          topCareers[1]?.title || '',
                          topCareers[2]?.title || ''
                        ].map(cell => `"${cell}"`).join(',');
                      })
                    ].join('\n');
                    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `tulokset-${classId.substring(0, 8)}.csv`;
                    a.click();
                    setExporting(false);
                  }}
                  className="px-4 py-2 bg-white/[0.03] border border-white/[0.08] text-white/80 text-sm rounded-lg hover:bg-white/[0.06] disabled:opacity-40 transition-colors"
                >
                  Lataa CSV
                </button>
                <button
                  type="button"
                  disabled={results.length === 0}
                  onClick={() => {
                    filteredResults.forEach(result => {
                      const name = nameMapping[result.pin] || result.pin;
                      const payload = result.result_payload || {};
                      const profile = generateStudentProfile(result, name, analytics);
                      const topCareers = payload.top_careers || payload.topCareers || [];
                      const report = `OPPILAAN RAPORTTI\n=================\nNimi: ${name}\nPIN: ${result.pin}\nPäivämäärä: ${new Date(result.created_at).toLocaleDateString('fi-FI')}\n\nPROFIILI:\n${profile}\n\nTOP 5 URAA:\n${topCareers.slice(0, 5).map((c: any, i: number) => `${i + 1}. ${c.title}`).join('\n')}`;
                      const blob = new Blob([report], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `raportti-${name.replace(/\s+/g, '-')}-${result.pin}.txt`;
                      a.click();
                    });
                    showSuccess(`Ladattu ${filteredResults.length} raporttia`);
                  }}
                  className="px-4 py-2 bg-white/[0.03] border border-white/[0.08] text-white/80 text-sm rounded-lg hover:bg-white/[0.06] disabled:opacity-40 transition-colors"
                >
                  Lataa raportit
                </button>
                <button
                  type="button"
                  disabled={results.length === 0 || generatingPDFs}
                  onClick={async () => {
                    if (filteredResults.length === 0) return;
                    setGeneratingPDFs(true);
                    try {
                      const studentsToProcess = selectedStudents.size > 0
                        ? filteredResults.filter(r => selectedStudents.has(r.pin))
                        : filteredResults;

                      if (studentsToProcess.length === 0) {
                        showInfo('Valitse oppilaat tai poista valinnat ladataksesi kaikki.');
                        return;
                      }

                      for (let i = 0; i < studentsToProcess.length; i++) {
                        const result = studentsToProcess[i];
                        const payload = result.result_payload || {};
                        const name = nameMapping[result.pin] || result.pin;
                        const careers = payload.top_careers || payload.topCareers || [];
                        const dims = payload.dimension_scores || payload.dimensionScores || {};
                        const cohort = payload.cohort || '';
                        const edu = payload.educationPath || payload.education_path;

                        const reportData = {
                          name,
                          pin: result.pin,
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
                          profile: generateStudentProfile(result, name, analytics),
                        };

                        const blob = await generateStudentPDF(reportData);
                        downloadPDF(blob, `raportti-${name.replace(/\s+/g, '-')}-${result.pin}.pdf`);

                        if (i < studentsToProcess.length - 1) {
                          await new Promise(resolve => setTimeout(resolve, 300));
                        }
                      }
                      showSuccess(`Ladattu ${studentsToProcess.length} PDF-raporttia`);
                    } catch (error) {
                      showError('PDF-raporttien luominen epäonnistui.');
                    } finally {
                      setGeneratingPDFs(false);
                    }
                  }}
                  className="px-4 py-2 bg-urak-accent-blue text-white text-sm rounded-lg hover:bg-urak-accent-blue/90 disabled:opacity-40 transition-colors"
                >
                  {generatingPDFs ? 'Luodaan...' : 'Lataa PDF-raportit'}
                </button>
                <button
                  type="button"
                  disabled={results.length === 0 || generatingPDFs}
                  onClick={async () => {
                    setGeneratingPDFs(true);
                    try {
                      const reportData = {
                        className: classId.substring(0, 8),
                        date: new Date().toLocaleDateString('fi-FI'),
                        totalTests: results.length,
                        topCareers: analytics.topCareers,
                        educationPathDistribution: analytics.educationPathDistribution,
                        dimensionAverages: analytics.dimensionAverages,
                        cohortDistribution: analytics.cohortDistribution,
                      };
                      const blob = await generateClassSummaryPDF(reportData);
                      downloadPDF(blob, `yhteenveto-${classId.substring(0, 8)}.pdf`);
                    } catch (error) {
                      showError('PDF:n luominen epäonnistui.');
                    } finally {
                      setGeneratingPDFs(false);
                    }
                  }}
                  className="px-4 py-2 bg-urak-accent-blue text-white text-sm rounded-lg hover:bg-urak-accent-blue/90 disabled:opacity-40 transition-colors"
                >
                  {generatingPDFs ? 'Luodaan...' : 'Lataa yhteenveto PDF'}
                </button>
                {packageInfo?.hasPremium && (
                  <button
                    type="button"
                    disabled={results.length === 0}
                    onClick={() => {
                      const today = new Date();
                      const lastMonth = new Date();
                      lastMonth.setMonth(today.getMonth()-1);
                      window.open(`/teacher/classes/${classId}/reports/compare?from1=1970-01-01&to1=${lastMonth.toISOString().slice(0,10)}&from2=${lastMonth.toISOString().slice(0,10)}&to2=${today.toISOString().slice(0,10)}`, '_blank');
                    }}
                    className="px-4 py-2 bg-white/[0.03] border border-white/[0.08] text-white/80 text-sm rounded-lg hover:bg-white/[0.06] disabled:opacity-40 transition-colors"
                  >
                    Vertailuanalyysi
                  </button>
                )}
              </div>

              {/* Results Display */}
              {viewMode === 'table' ? (
                <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
                  <table role="table" className="w-full">
                    <thead>
                      <tr className="bg-white/[0.02] border-b border-white/[0.06]">
                        <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wide">Nimi</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wide">PIN</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wide">Pvm</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wide">Top ammatit</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wide">Kohortti</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wide">Suositus</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {filteredResults.map((result, i) => {
                        const payload = result.result_payload;
                        const cohort = payload?.cohort || '—';
                        const educationPath = payload?.educationPath || payload?.education_path;
                        const topCareers = payload?.top_careers || payload?.topCareers || [];

                        const getEducationPathDisplay = () => {
                          if (cohort !== 'YLA' || !educationPath) return '—';
                          const primary = educationPath.primary || educationPath.education_path_primary;
                          if (!primary) return '—';
                          const pathNames: Record<string, string> = { 'lukio': 'Lukio', 'ammattikoulu': 'Ammattikoulu', 'kansanopisto': 'Kansanopisto' };
                          return pathNames[primary] || primary;
                        };

                        const dimScores = (payload?.dimension_scores || payload?.dimensionScores) as Record<string, number> || {};
                        const needsGuidance = (() => {
                          if (Object.keys(dimScores).length === 0) return false;
                          const rawVals = Object.values(dimScores);
                          const maxRawVal = Math.max(...rawVals);
                          const normMult = maxRawVal > 0 && maxRawVal <= 1 ? 100 : 1;
                          const normVals = rawVals.map(v => v * normMult);
                          const avg = normVals.reduce((a, b) => a + b, 0) / normVals.length;
                          return avg < 50;
                        })();

                        return (
                          <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-4 py-3 text-sm text-white/90">
                              {nameMapping[result.pin] || <span className="text-white/30">—</span>}
                              {needsGuidance && (
                                <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-white/[0.06] rounded text-white/50">ohjauksesta hyötyisi</span>
                              )}
                            </td>
                            <td className="px-4 py-3 font-mono text-sm text-white/50">{result.pin}</td>
                            <td className="px-4 py-3 text-sm text-white/50">{new Date(result.created_at).toLocaleDateString('fi-FI')}</td>
                            <td className="px-4 py-3 text-sm text-white/70">
                              {topCareers.slice(0, 2).map((c: any) => c.title).join(', ') || '—'}
                            </td>
                            <td className="px-4 py-3 text-sm text-white/50">{cohort}</td>
                            <td className="px-4 py-3 text-sm text-white/70">{getEducationPathDisplay()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredResults.map((result, i) => {
                    const payload = result.result_payload || {};
                    const dimScores = payload.dimension_scores || payload.dimensionScores || {};
                    const topCareers = payload.top_careers || payload.topCareers || [];
                    const cohort = payload.cohort || '';
                    const name = nameMapping[result.pin] || result.pin;
                    const profile = generateStudentProfile(result, name, analytics);

                    const rawI = dimScores.interests || 0;
                    const rawV = dimScores.values || 0;
                    const rawW = dimScores.workstyle || 0;
                    const rawC = dimScores.context || 0;
                    const maxRaw = Math.max(rawI, rawV, rawW, rawC);
                    const mult = maxRaw > 0 && maxRaw <= 1 ? 100 : 1;

                    const dimensionBars = [
                      { label: 'Kiinnostukset', value: rawI * mult },
                      { label: 'Arvot', value: rawV * mult },
                      { label: 'Työtapa', value: rawW * mult },
                      { label: 'Konteksti', value: rawC * mult },
                    ];

                    return (
                      <div key={i} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-white">{name}</h3>
                            <p className="text-sm text-white/40">PIN: {result.pin} • {new Date(result.created_at).toLocaleDateString('fi-FI')} • {cohort}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-white/50 mb-2">Profiili</p>
                          <p className="text-sm text-white/70">{profile}</p>
                        </div>

                        <div>
                          <p className="text-sm text-white/50 mb-3">Dimensiot</p>
                          <div className="space-y-2">
                            {dimensionBars.map((dim, idx) => (
                              <div key={idx} className="flex items-center gap-3">
                                <span className="text-xs w-24 text-white/50">{dim.label}</span>
                                <div className="flex-1 bg-white/[0.04] rounded-full h-1.5">
                                  <div
                                    className="bg-urak-accent-blue h-1.5 rounded-full"
                                    style={{ width: `${Math.min(dim.value, 100)}%` }}
                                  />
                                </div>
                                <span className="text-xs w-8 text-right text-white/40">{Math.round(dim.value)}%</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-white/50 mb-2">Top ammatit</p>
                          <div className="flex flex-wrap gap-2">
                            {topCareers.slice(0, 5).map((career: any, idx: number) => (
                              <span key={idx} className="text-xs px-2.5 py-1 bg-white/[0.04] rounded-md text-white/70">
                                {career.title}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Conversation starters - collapsed by default */}
                        {(() => {
                          const starters = generateConversationStarters({
                            name,
                            topCareers,
                            dimensions: {
                              interests: dimScores.interests || 0,
                              values: dimScores.values || 0,
                              workstyle: dimScores.workstyle || 0,
                              context: dimScores.context || 0,
                            },
                            educationPath: payload.educationPath || payload.education_path,
                            cohort,
                            profile,
                          });

                          return (
                            <details className="border-t border-white/[0.06] pt-4 mt-4">
                              <summary className="text-sm text-white/60 cursor-pointer hover:text-white/80 transition-colors">
                                Keskustelunavaukset
                              </summary>
                              <div className="mt-3 space-y-3 text-xs text-white/50">
                                <div>
                                  <p className="text-white/40 mb-1">Kysymyksiä:</p>
                                  <ul className="list-disc ml-4 space-y-0.5">
                                    {starters.questions.slice(0, 3).map((q, idx) => <li key={idx}>{q}</li>)}
                                  </ul>
                                </div>
                                <div>
                                  <p className="text-white/40 mb-1">Keskustelupisteitä:</p>
                                  <ul className="list-disc ml-4 space-y-0.5">
                                    {starters.talkingPoints.slice(0, 3).map((tp, idx) => <li key={idx}>{tp}</li>)}
                                  </ul>
                                </div>
                              </div>
                            </details>
                          );
                        })()}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Public Links Section */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 space-y-5">
        <div>
          <p className="text-sm text-white/60 mb-2">Oppilaiden testilinkki</p>
          <div className="flex gap-2 items-center">
            <code className="flex-1 text-sm bg-white/[0.03] border border-white/[0.06] px-3 py-2 rounded-lg text-urak-accent-blue/80 truncate">
              {studentTestLink}
            </code>
            <button
              onClick={() => handleCopyLink(studentTestLink, 'Linkki kopioitu!')}
              className="px-3 py-2 text-sm bg-white/[0.03] border border-white/[0.08] rounded-lg text-white/70 hover:bg-white/[0.06] transition-colors"
            >
              Kopioi
            </button>
          </div>
        </div>
        <div>
          <p className="text-sm text-white/60 mb-2">Luokan tulossivu</p>
          <div className="flex gap-2 items-center">
            <code className="flex-1 text-sm bg-white/[0.03] border border-white/[0.06] px-3 py-2 rounded-lg text-urak-accent-blue/80 truncate">
              {classResultsLink}
            </code>
            <button
              onClick={() => handleCopyLink(classResultsLink, 'Linkki kopioitu!')}
              className="px-3 py-2 text-sm bg-white/[0.03] border border-white/[0.08] rounded-lg text-white/70 hover:bg-white/[0.06] transition-colors"
            >
              Kopioi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
