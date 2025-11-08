"use client";

/**
 * Enhanced Teacher Class Manager Component
 * Handles: PIN generation, name mapping, comprehensive results viewing with analytics
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
import { generateConversationStarters, generateParentMeetingTalkingPoints } from '@/lib/conversationStarters';

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

  // Category names mapping
  const categoryNames: Record<string, string> = {
    'luova': 'Luova',
    'johtaja': 'Johtaja',
    'innovoija': 'Innovoija',
    'rakentaja': 'Rakentaja',
    'auttaja': 'Auttaja',
    'ympariston-puolustaja': 'Ympäristön Puolustaja',
    'visionaari': 'Visionääri',
    'jarjestaja': 'Järjestäjä'
  };

  results.forEach(result => {
    const payload = result.result_payload || {};
    const cohort = payload.cohort || 'Unknown';
    cohortCounts[cohort] = (cohortCounts[cohort] || 0) + 1;

    // Career counts and category distribution
    const topCareers = payload.top_careers || payload.topCareers || [];
    topCareers.slice(0, 3).forEach((career: any) => {
      careerCounts[career.title] = (careerCounts[career.title] || 0) + 1;
      // Try to get category from career slug or title
      if (career.slug) {
        // Extract category if possible - careers might have category info
        // For now, we'll track by career name and infer category later if needed
      }
    });

    // Dimension scores
    const dimScores = payload.dimension_scores || payload.dimensionScores;
    if (dimScores) {
      dimensionSums.interests += dimScores.interests || 0;
      dimensionSums.values += dimScores.values || 0;
      dimensionSums.workstyle += dimScores.workstyle || 0;
      dimensionSums.context += dimScores.context || 0;
      dimensionCount++;
    }

    // Education path for YLA
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
  
  // Plain language dimension interpretation
  const interests = dimScores.interests || 0;
  const values = dimScores.values || 0;
  const workstyle = dimScores.workstyle || 0;
  const context = dimScores.context || 0;
  
  // Identify strongest dimension
  const dimensions = [
    { name: 'kiinnostukset', value: interests },
    { name: 'arvot', value: values },
    { name: 'työtapa', value: workstyle },
    { name: 'konteksti', value: context }
  ];
  const strongest = dimensions.reduce((a, b) => a.value > b.value ? a : b);
  
  // Interpret workstyle preference
  if (workstyle > 70) {
    profile.push('Haluaa oppia tekemällä');
  } else if (workstyle < 50) {
    profile.push('Haluaa oppia teoriapainotteisesti');
  }
  
  // Interpret values
  if (values > 75) {
    profile.push('Arvostaa auttamista ja merkityksellisyyttä');
  } else if (values > 60) {
    profile.push('Yhdistää arvot ja käytännöllisyyden');
  }
  
  // Top career mention (simplified)
  if (topCareers.length > 0) {
    const topTitles = topCareers.map((c: any) => c.title).slice(0, 2);
    profile.push(`Kiinnostunut: ${topTitles.join(', ')}`);
  }
  
  // Education path for YLA
  if (cohort === 'YLA') {
    const edPath = payload.educationPath || payload.education_path;
    if (edPath?.primary) {
      const pathNames: Record<string, string> = {
        'lukio': 'Lukio',
        'ammattikoulu': 'Ammattikoulu',
        'kansanopisto': 'Kansanopisto'
      };
      const path = pathNames[edPath.primary] || edPath.primary;
      const scores = edPath.scores || edPath.education_path_scores || {};
      const score = scores[edPath.primary] || 0;
      if (score > 70) {
        profile.push(`Vahva suositus: ${path}`);
      } else {
        profile.push(`Suositus: ${path}`);
      }
    }
  }
  
  // Needs attention check
  const avgScore = (interests + values + workstyle + context) / 4;
  if (avgScore < 50 || (interests < 50 && values < 50 && workstyle < 50 && context < 50)) {
    profile.push('Tarvitsee tukea kiinnostuksen kohteiden löytämisessä');
  }
  
  return profile.join(' • ') || 'Odottaa arviointia';
}

export default function TeacherClassManager({ classId, classToken }: Props) {
  const [activeTab, setActiveTab] = useState<'pins' | 'names' | 'results' | 'analytics'>('pins');
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
  const [selectedPinForPdf, setSelectedPinForPdf] = useState<string | null>(null);
  const [pdfGenerationState, setPdfGenerationState] = useState<Record<string, 'idle' | 'loading' | 'success' | 'error'>>({});

  // Calculate analytics
  const analytics = calculateAnalytics(results);

  // Check for notifications
  const completionCheck = checkClassCompletion(pins.length, results.length);
  const atRiskStudents = results.filter(r => checkAtRiskStudent(r).shouldNotify);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://careercompassii.vercel.app';
  const studentTestLink = `${baseUrl}/${classToken}/test`;
  const classResultsLink = `${baseUrl}/${classToken}`;

  const handleCopyLink = useCallback((link: string, successMessage: string) => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      alert('Kopiointi ei ole tuettu tässä selaimessa. Kopioi linkki käsin.');
      return;
    }
    navigator.clipboard.writeText(link)
      .then(() => {
        alert(successMessage);
      })
      .catch(() => {
        alert('Linkin kopiointi epäonnistui. Yritä kopioida linkki käsin.');
      });
  }, []);

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
    if (mapping) {
      setNameMapping(mapping);
    }
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
        const errorMsg = data.error || 'Tulosten lataus epäonnistui';
        const hint = data.hint || '';
        setResultsError(`${errorMsg}${hint ? `\n\n${hint}` : ''}\n\nRatkaisu: Päivitä sivu ja yritä uudelleen. Jos ongelma jatkuu, ota yhteyttä tukeen.`);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
      setResultsError(`Verkkovirhe tuloksia ladattaessa.\n\nRatkaisu:\n1. Tarkista verkkoyhteys\n2. Päivitä sivu (F5)\n3. Odota hetki ja yritä uudelleen\n4. Jos ongelma jatkuu, ota yhteyttä tukeen: support@careercompassi.com`);
    }
    setResultsLoading(false);
  }, [classId]);

  // Load existing PINs
  useEffect(() => {
    fetchPins();
    loadNameMapping();
    fetchResults();
    // Load teacher email from localStorage
    const savedEmail = localStorage.getItem(`teacher_email_${classId}`);
    if (savedEmail) setTeacherEmail(savedEmail);
    // Fetch package info
    (async () => {
      try {
        const res = await fetch('/api/teacher-auth/package-check');
        const data = await res.json();
        if (data.success) {
          setPackageInfo({ hasPremium: data.hasPremium, package: data.package });
        }
      } catch (e) {
        console.error('Failed to check package:', e);
        setPackageInfo({ hasPremium: false, package: 'standard' });
      }
    })();
  }, [classId, fetchPins, fetchResults, loadNameMapping]);

  const validatePinCount = (value: string): boolean => {
    if (value === '') {
      setPinCountError('');
      return false;
    }
    
    const num = parseInt(value, 10);
    
    if (isNaN(num)) {
      setPinCountError('Syötä kelvollinen numero');
      return false;
    }
    
    if (num < 1) {
      setPinCountError('Vähintään 1 PIN-koodi');
      return false;
    }
    
    if (num > 100) {
      setPinCountError('Maksimissaan 100 PIN-koodia');
      return false;
    }
    
    setPinCountError('');
    return true;
  };

  const handlePinCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numeric input
    if (value === '' || /^\d+$/.test(value)) {
      setPinCount(value);
      validatePinCount(value);
    }
  };

  const handleGeneratePins = async () => {
    if (!pinCount || !validatePinCount(pinCount)) {
      return;
    }
    
    const count = parseInt(pinCount, 10);
    await generatePins(count);
    // Clear input after successful generation
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
        const errorMsg = data.error || 'PIN-koodien luominen epäonnistui';
        const recovery = data.hint || 'Tarkista verkkoyhteys ja yritä uudelleen. Jos ongelma jatkuu, tarkista että luokka on olemassa.';
        alert(`${errorMsg}\n\nRatkaisu: ${recovery}\n\nTarvitsetko apua? Avaa FAQ-ikkuna yläpalkin kautta.`);
      }
    } catch (error) {
      console.error('Error generating PINs:', error);
      alert(`Verkkovirhe PIN-koodien luonnissa.\n\nRatkaisu:\n1. Tarkista verkkoyhteys\n2. Päivitä sivu ja yritä uudelleen\n3. Jos ongelma jatkuu, ota yhteyttä tukeen: support@careercompassi.com\n\nTarvitsetko apua? Avaa FAQ-ikkuna yläpalkin kautta.`);
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
        console.error('Export error:', error);
        alert(`Nimilistan vienti epäonnistui.\n\nRatkaisu:\n1. Tarkista että salasana on vähintään 8 merkkiä\n2. Kokeile lyhyempää salasanaa\n3. Jos ongelma jatkuu, kopioi nimilista manuaalisesti\n\nTarvitsetko apua? Avaa FAQ-ikkuna yläpalkin kautta.`);
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
      alert('Nimilista tuotu onnistuneesti!');
    } catch (error) {
      console.error('Import error:', error);
      alert(`Nimilistan tuonti epäonnistui.\n\nMahdolliset syyt:\n• Väärä salasana - käytä samaa salasanaa, jota käytit viennissä\n• Viallinen tiedosto - varmista että tiedosto on oikea JSON-tiedosto\n• Tiedosto on korruptoitunut\n\nRatkaisu:\n1. Tarkista salasana\n2. Lataa tiedosto uudelleen ja yritä uudelleen\n3. Jos tiedosto on menetetty, syötä nimet manuaalisesti\n\nTarvitsetko apua? Avaa FAQ-ikkuna yläpalkin kautta.`);
    }
  };

  // Filter and sort results
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
        const nameA = nameMapping[a.pin] || '';
        const nameB = nameMapping[b.pin] || '';
        return nameA.localeCompare(nameB);
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

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('pins')}
            className={`py-2 px-4 font-medium ${
              activeTab === 'pins'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            PIN-koodit
          </button>
          <button
            onClick={() => setActiveTab('names')}
            className={`py-2 px-4 font-medium ${
              activeTab === 'names'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Nimilista
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`py-2 px-4 font-medium ${
              activeTab === 'results'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Tulokset ({filteredResults.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-2 px-4 font-medium ${
              activeTab === 'analytics'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Analyysi
          </button>
        </div>
      </div>

      {/* PIN Tab */}
      {activeTab === 'pins' && (
        <div className="space-y-4">
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <label htmlFor="pinCount" className="block text-sm font-medium text-gray-700 mb-2">
                PIN-koodien määrä
              </label>
              <input
                id="pinCount"
                type="text"
                inputMode="numeric"
                value={pinCount}
                onChange={handlePinCountChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !loading && pinCount && !pinCountError) {
                    handleGeneratePins();
                  }
                }}
                placeholder="Kirjoita PIN-koodien määrä (1-100)"
                disabled={loading}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                  pinCountError ? 'border-red-500' : 'border-gray-300'
                }`}
                min="1"
                max="100"
              />
              {pinCountError && (
                <p className="mt-1 text-sm text-red-600">{pinCountError}</p>
              )}
            </div>
            <div className="flex items-end">
              <button
                onClick={handleGeneratePins}
                disabled={loading || !pinCount || !!pinCountError}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {loading ? 'Luodaan...' : 'Luo PIN-koodit'}
              </button>
            </div>
          </div>

          {pins.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Luo PIN-koodit ({pins.length} kpl)</h3>
              <div className="grid grid-cols-4 gap-2">
                {pins.map((pin, i) => (
                  <div
                    key={i}
                    data-testid="pin-item"
                    className="bg-white p-2 rounded border text-center font-mono text-sm"
                  >
                    {pin}
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  const csv = pins.join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `pins-${classId.substring(0, 8)}.csv`;
                  a.click();
                }}
                className="mt-4 text-blue-600 hover:underline"
              >
                Lataa CSV-muodossa
              </button>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Vinkki:</strong> Tulosta tai tallenna PIN-koodit turvallisesti. 
              Jaa ne oppilaille, jotta he voivat kirjautua testiin.
            </p>
          </div>
        </div>
      )}

      {/* Names Tab */}
      {activeTab === 'names' && (
        <div className="space-y-4">
          {pins.length === 0 ? (
            <p className="text-gray-600">Luo ensin PIN-koodit</p>
          ) : (
            <>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Turvallisuus:</strong> Nimet tallennetaan VAIN omalle laitteellesi. 
                  Nimet eivät koskaan poistu tältä selaimelta.
                </p>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {pins.map((pin) => (
                  <div key={pin} className="flex gap-4 items-center">
                    <span className="font-mono text-sm bg-gray-100 px-3 py-2 rounded w-24 text-center">
                      {pin}
                    </span>
                    <input
                      type="text"
                      value={nameMapping[pin] || ''}
                      onChange={(e) => updateNameMapping(pin, e.target.value)}
                      placeholder="Oppilaan nimi"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleExport}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Vie salattuna
                </button>
                <label className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 cursor-pointer inline-block">
                  Tuo salattua
                  <input
                    type="file"
                    onChange={handleImport}
                    className="hidden"
                    accept=".json"
                  />
                </label>
              </div>
            </>
          )}
        </div>
      )}

      {/* Results Tab */}
      {activeTab === 'results' && (
        <div className="space-y-4">
          {results.length === 0 ? (
            <p className="text-gray-600">Tuloksia ei vielä saatavilla</p>
          ) : (
            <>
              {/* Filters and View Controls */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex flex-wrap gap-4 items-center">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mr-2">Kohortti:</label>
                    <select
                      value={filterCohort}
                      onChange={(e) => setFilterCohort(e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-lg"
                    >
                      <option value="all">Kaikki</option>
                      <option value="YLA">YLA</option>
                      <option value="TASO2">TASO2</option>
                      <option value="NUORI">NUORI</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mr-2">Suositus:</label>
                    <select
                      value={filterEducationPath}
                      onChange={(e) => setFilterEducationPath(e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-lg"
                    >
                      <option value="all">Kaikki</option>
                      <option value="lukio">Lukio</option>
                      <option value="ammattikoulu">Ammattikoulu</option>
                      <option value="kansanopisto">Kansanopisto</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mr-2">Järjestä:</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-lg"
                    >
                      <option value="date">Päivämäärä</option>
                      <option value="name">Nimi</option>
                      <option value="score">Pistemäärä</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mr-2">Näkymä:</label>
                    <select
                      value={viewMode}
                      onChange={(e) => setViewMode(e.target.value as 'table' | 'detailed')}
                      className="px-3 py-1 border border-gray-300 rounded-lg"
                    >
                      <option value="table">Taulukko</option>
                      <option value="detailed">Yksityiskohtainen</option>
                    </select>
                  </div>
                </div>
                
                {/* Class Averages Display - Education Paths & Top Careers */}
                <div className="bg-white rounded p-3 border border-gray-200 space-y-3">
                  <p className="text-sm font-semibold mb-3">Luokan keskiarvot:</p>
                  
                  {/* Education Path Distribution (YLA) */}
                  {analytics.educationPathDistribution.lukio + analytics.educationPathDistribution.ammattikoulu + analytics.educationPathDistribution.kansanopisto > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-2">Suositeltavat koulutuspolut (YLA):</p>
                      <div className="space-y-1 text-sm">
                        {Object.entries(analytics.educationPathDistribution).map(([path, count]) => {
                          if (count === 0) return null;
                          const totalYLA = Object.values(analytics.educationPathDistribution).reduce((a, b) => a + b, 0);
                          const pathNames: Record<string, string> = {
                            'lukio': 'Lukio',
                            'ammattikoulu': 'Ammattikoulu',
                            'kansanopisto': 'Kansanopisto'
                          };
                          return (
                            <div key={path} className="flex items-center justify-between">
                              <span className="text-gray-700">{pathNames[path] || path}:</span>
                              <span className="font-semibold">{count} oppilasta ({totalYLA > 0 ? Math.round((count / totalYLA) * 100) : 0}%)</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Top Careers */}
                  {analytics.topCareers.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-2">Yleisimmät ammatit:</p>
                      <div className="space-y-1 text-sm">
                        {analytics.topCareers.slice(0, 5).map((career, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="text-gray-700">{idx + 1}. {career.name}</span>
                            <span className="font-semibold">{career.count} oppilasta</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notification Alerts */}
              {(completionCheck.shouldNotify || atRiskStudents.length > 0) && (
                <div className="space-y-3">
                  {completionCheck.shouldNotify && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-green-800 mb-1">
                            {completionCheck.data?.completionRate === 100 
                              ? '✅ Kaikki oppilaat ovat suorittaneet testin!' 
                              : `📊 ${Math.round(completionCheck.data?.completionRate || 0)}% oppilaista on suorittanut testin`}
                          </h3>
                          <p className="text-sm text-green-700">
                            {completionCheck.data?.completedStudents} / {completionCheck.data?.totalStudents} oppilasta
                          </p>
                        </div>
                        {teacherEmail && (
                          <button
                            onClick={async () => {
                              setSendingNotification(true);
                              try {
                                const success = await triggerNotification('class_completion', {
                                  teacherEmail,
                                  className: classId.substring(0, 8),
                                  totalStudents: completionCheck.data?.totalStudents || 0,
                                  completedStudents: completionCheck.data?.completedStudents || 0,
                                  completionRate: completionCheck.data?.completionRate || 0,
                                  classId,
                                });
                                if (success) {
                                  alert('Ilmoitus lähetetty onnistuneesti!');
                                } else {
                                  alert('Ilmoituksen lähetys epäonnistui. Tarkista sähköpostiasetukset.');
                                }
                              } catch (error) {
                                alert('Virhe ilmoituksen lähetyksessä.');
                              } finally {
                                setSendingNotification(false);
                              }
                            }}
                            disabled={sendingNotification}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
                          >
                            {sendingNotification ? 'Lähetetään...' : '📧 Lähetä sähköposti'}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {atRiskStudents.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h3 className="font-semibold text-yellow-800 mb-2">
                        ⚠️ {atRiskStudents.length} oppilasta tarvitsee tukea
                      </h3>
                      <p className="text-sm text-yellow-700 mb-3">
                        Seuraavat oppilaat tarvitsevat erityistä huomiota ja ohjausta:
                      </p>
                      <div className="space-y-2 mb-3">
                        {atRiskStudents.slice(0, 5).map((result) => {
                          const check = checkAtRiskStudent(result);
                          const name = nameMapping[result.pin] || result.pin;
                          return (
                            <div key={result.pin} className="bg-white p-2 rounded text-sm">
                              <strong>{name}</strong> ({result.pin}) - {check.data?.reasons[0] || 'Tarvitsee tukea'}
                            </div>
                          );
                        })}
                      </div>
                      {teacherEmail && (
                        <button
                          onClick={async () => {
                            setSendingNotification(true);
                            try {
                              // Send notification for first at-risk student
                              const firstStudent = atRiskStudents[0];
                              const check = checkAtRiskStudent(firstStudent);
                              const success = await triggerNotification('at_risk_student', {
                                teacherEmail,
                                className: classId.substring(0, 8),
                                studentName: nameMapping[firstStudent.pin] || firstStudent.pin,
                                studentPIN: firstStudent.pin,
                                reasons: check.data?.reasons || [],
                                classId,
                              });
                              if (success) {
                                alert('Ilmoitus lähetetty onnistuneesti!');
                              } else {
                                alert('Ilmoituksen lähetys epäonnistui.');
                              }
                            } catch (error) {
                              alert('Virhe ilmoituksen lähetyksessä.');
                            } finally {
                              setSendingNotification(false);
                            }
                          }}
                          disabled={sendingNotification}
                          className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 disabled:opacity-50 text-sm"
                        >
                          {sendingNotification ? 'Lähetetään...' : '📧 Lähetä ilmoitus'}
                        </button>
                      )}
                    </div>
                  )}
                  
                  {!teacherEmail && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        💡 <strong>Vinkki:</strong> Syötä sähköpostiosoitteesi saadaksesi automaattisia ilmoituksia oppilaiden edistymisestä.
                      </p>
                      <input
                        type="email"
                        placeholder="sähköposti@esimerkki.fi"
                        value={teacherEmail}
                        onChange={(e) => {
                          setTeacherEmail(e.target.value);
                          localStorage.setItem(`teacher_email_${classId}`, e.target.value);
                        }}
                        className="mt-2 px-3 py-2 border border-blue-300 rounded-lg w-full max-w-md"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Status */}
              <div aria-live="polite" className="text-sm">
                {resultsLoading && (
                  <div className="text-gray-600">Ladataan tuloksia...</div>
                )}
                {!resultsLoading && results.length === 0 && !resultsError && (
                  <div className="text-gray-600">Tuloksia ei vielä saatavilla. Oppilaat voivat aloittaa testin PIN-koodilla.</div>
                )}
                {resultsError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                    <p className="text-red-800 font-semibold mb-2">⚠️ Virhe tuloksia ladattaessa</p>
                    <pre className="text-sm text-red-700 whitespace-pre-wrap">{resultsError}</pre>
                    <button
                      onClick={fetchResults}
                      className="mt-3 text-sm bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Yritä uudelleen
                    </button>
                  </div>
                )}
              </div>

              {/* Export Buttons */}
              <div className="flex gap-4 flex-wrap">
                <button
                  type="button"
                  aria-label="Lataa yksityiskohtainen CSV"
                  disabled={exporting || results.length === 0}
                  onClick={() => {
                    setExporting(true);
                    const csv = [
                      ['Nimi', 'PIN', 'Päivämäärä', 'Kohortti', 'Suositus', 'Kiinnostukset', 'Arvot', 'Työtapa', 'Konteksti', 'Top 1', 'Top 2', 'Top 3', 'Top 4', 'Top 5', 'Profiili'].join(','),
                      ...filteredResults.map(result => {
                        const payload = result.result_payload;
                        const cohort = payload?.cohort || '';
                        const topCareers = payload?.top_careers || payload?.topCareers || [];
                        const educationPath = payload?.educationPath || payload?.education_path;
                        const dimScores = payload?.dimension_scores || payload?.dimensionScores || {};
                        const profile = generateStudentProfile(result, nameMapping[result.pin] || '', analytics);
                        
                        let educationPathDisplay = '';
                        if (cohort === 'YLA' && educationPath) {
                          const primary = educationPath.primary || educationPath.education_path_primary;
                          if (primary) {
                            const pathNames: Record<string, string> = {
                              'lukio': 'Lukio',
                              'ammattikoulu': 'Ammattikoulu',
                              'kansanopisto': 'Kansanopisto'
                            };
                            educationPathDisplay = pathNames[primary] || primary;
                          }
                        }
                        
                        return [
                          nameMapping[result.pin] || '',
                          result.pin,
                          new Date(result.created_at).toLocaleDateString('fi-FI'),
                          cohort || '',
                          educationPathDisplay,
                          Math.round(dimScores.interests || 0) + '%',
                          Math.round(dimScores.values || 0) + '%',
                          Math.round(dimScores.workstyle || 0) + '%',
                          Math.round(dimScores.context || 0) + '%',
                          topCareers[0]?.title || '',
                          topCareers[1]?.title || '',
                          topCareers[2]?.title || '',
                          topCareers[3]?.title || '',
                          topCareers[4]?.title || '',
                          profile
                        ].map(cell => `"${cell}"`).join(',');
                      })
                    ].join('\n');
                    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `tulokset-detailed-${classId.substring(0, 8)}.csv`;
                    a.click();
                    setExporting(false);
                  }}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Lataa CSV (yksityiskohtainen)
                </button>
                <button
                  type="button"
                  aria-label="Lataa yksittäiset raportit"
                  disabled={exporting || results.length === 0}
                  onClick={() => {
                    setExporting(true);
                    // Export individual student reports
                    filteredResults.forEach(result => {
                      const name = nameMapping[result.pin] || result.pin;
                      const payload = result.result_payload || {};
                      const profile = generateStudentProfile(result, name, analytics);
                      const topCareers = payload.top_careers || payload.topCareers || [];
                      
                      const report = `
OPPILAAN RAPORTTI
=================
Nimi: ${name}
PIN: ${result.pin}
Päivämäärä: ${new Date(result.created_at).toLocaleDateString('fi-FI')}

PROFIILI:
${profile}

TOP 5 URAA:
${topCareers.slice(0, 5).map((c: any, i: number) => `${i + 1}. ${c.title} (${Math.round(c.score * 100)}%)`).join('\n')}

MILLISISÄISET DIMENSIOT:
Kiinnostukset: ${Math.round((payload.dimension_scores || payload.dimensionScores || {}).interests || 0)}%
Arvot: ${Math.round((payload.dimension_scores || payload.dimensionScores || {}).values || 0)}%
Työtapa: ${Math.round((payload.dimension_scores || payload.dimensionScores || {}).workstyle || 0)}%
Konteksti: ${Math.round((payload.dimension_scores || payload.dimensionScores || {}).context || 0)}%
                      `.trim();
                      
                      const blob = new Blob([report], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `raportti-${name.replace(/\s+/g, '-')}-${result.pin}.txt`;
                      a.click();
                    });
                    alert(`Ladattu ${filteredResults.length} raporttia`);
                    setExporting(false);
                  }}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  Lataa yksittäiset raportit
                </button>
                <button
                  type="button"
                  aria-label="Lataa oppilaskohtaiset PDF-raportit"
                  disabled={results.length === 0 || generatingPDFs}
                  onClick={async () => {
                    if (filteredResults.length === 0) return;
                    
                    setGeneratingPDFs(true);
                    try {
                      // Download PDFs for selected students or all students
                      const studentsToProcess = selectedStudents.size > 0 
                        ? filteredResults.filter(r => selectedStudents.has(r.pin))
                        : filteredResults;
                      
                      if (studentsToProcess.length === 0) {
                        alert('Valitse oppilaat tai poista valinnat ladataksesi kaikki.');
                        return;
                      }

                      // Generate PDFs one by one (with a small delay to avoid browser blocking)
                      for (let i = 0; i < studentsToProcess.length; i++) {
                        const result = studentsToProcess[i];
                        const payload = result.result_payload || {};
                        const name = nameMapping[result.pin] || result.pin;
                        const careers = payload.top_careers || payload.topCareers || [];
                        const dims = payload.dimension_scores || payload.dimensionScores || {};
                        const cohort = payload.cohort || '';
                        const edu = payload.educationPath || payload.education_path;
                        
                        const reportData = {
                          name: name,
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
                        const filename = `raportti-${name.replace(/\s+/g, '-')}-${result.pin}.pdf`;
                        downloadPDF(blob, filename);
                        
                        // Small delay between downloads
                        if (i < studentsToProcess.length - 1) {
                          await new Promise(resolve => setTimeout(resolve, 300));
                        }
                      }
                      
                      alert(`Ladattu ${studentsToProcess.length} PDF-raporttia onnistuneesti!`);
                    } catch (error) {
                      console.error('Error generating PDFs:', error);
                      alert('PDF-raporttien luominen epäonnistui. Yritä uudelleen.');
                    } finally {
                      setGeneratingPDFs(false);
                    }
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {generatingPDFs ? 'Luodaan PDF...' : '📥 Lataa PDF-raportit'}
                </button>
                <button
                  type="button"
                  aria-label="Lataa luokan yhteenveto PDF"
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
                      const filename = `luokan-yhteenveto-${classId.substring(0, 8)}-${new Date().toISOString().split('T')[0]}.pdf`;
                      downloadPDF(blob, filename);
                    } catch (error) {
                      console.error('Error generating PDF:', error);
                      alert('PDF:n luominen epäonnistui. Yritä uudelleen.');
                    } finally {
                      setGeneratingPDFs(false);
                    }
                  }}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {generatingPDFs ? 'Luodaan PDF...' : '📥 Lataa luokan yhteenveto PDF'}
                </button>
                {packageInfo?.hasPremium ? (
                  <button
                    type="button"
                    aria-label="Avaa vertailuanalyysi PDF"
                    disabled={results.length === 0}
                    onClick={() => {
                      const today = new Date();
                      const lastMonth = new Date();
                      lastMonth.setMonth(today.getMonth()-1);
                      const to1 = today.toISOString().slice(0,10);
                      const from1 = lastMonth.toISOString().slice(0,10);
                      const from2 = '1970-01-01';
                      const to2 = lastMonth.toISOString().slice(0,10);
                      window.open(`/teacher/classes/${classId}/reports/compare?from1=${from2}&to1=${to2}&from2=${from1}&to2=${to1}`, '_blank');
                    }}
                    className="border px-6 py-2 rounded-lg disabled:opacity-50"
                  >
                    Avaa vertailuanalyysi (A4)
                  </button>
                ) : (
                  <div className="relative">
                    <button
                      type="button"
                      disabled={true}
                      className="border px-6 py-2 rounded-lg opacity-50 cursor-not-allowed"
                      title="Vertailuanalyytiikka vaatii Premium-paketin"
                    >
                      Vertailuanalyysi (Premium)
                    </button>
                    <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded-full">Premium</span>
                  </div>
                )}
              </div>

              {/* Results Display */}
              {viewMode === 'table' ? (
               <div className="overflow-x-auto">
                 <table role="table" aria-label="Oppilastulokset" className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                       <th scope="col" className="border p-2 text-left">Nimi</th>
                       <th scope="col" className="border p-2 text-left">PIN</th>
                       <th scope="col" className="border p-2 text-left">Aikana</th>
                       <th scope="col" className="border p-2 text-left">Yleissuositus</th>
                       <th scope="col" className="border p-2 text-left">Top 1-3</th>
                       <th scope="col" className="border p-2 text-left">Kohortti</th>
                       <th scope="col" className="border p-2 text-left">Suositus</th>
                       <th scope="col" className="border p-2 text-left">Profiili</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredResults.map((result, i) => {
                        const payload = result.result_payload;
                        const cohort = payload?.cohort || '—';
                        const educationPath = payload?.educationPath || payload?.education_path;
                        const topCareers = payload?.top_careers || payload?.topCareers || [];
                        
                        const getEducationPathDisplay = () => {
                          if (cohort !== 'YLA' || !educationPath) return '—';
                          const primary = educationPath.primary || educationPath.education_path_primary;
                          if (!primary) return '—';
                          const pathNames: Record<string, string> = {
                            'lukio': 'Lukio',
                            'ammattikoulu': 'Ammattikoulu',
                            'kansanopisto': 'Kansanopisto'
                          };
                          const pathName = pathNames[primary] || primary;
                          const scores = educationPath.scores || educationPath.education_path_scores || {};
                          const score = scores[primary];
                          return score ? `${pathName} (${Math.round(score)}%)` : pathName;
                        };
                        
                        const profile = generateStudentProfile(result, nameMapping[result.pin] || '', analytics);
                        
                        // Check if student needs attention
                        const dimScores = (payload?.dimension_scores || payload?.dimensionScores) as Record<string, number> || {};
                        const needsAttention = (() => {
                          if (Object.keys(dimScores).length === 0) return false;
                          const avg = Object.values(dimScores).reduce((a, b) => a + b, 0) / Object.values(dimScores).length;
                          return avg < 50 || (dimScores.interests < 50 && dimScores.values < 50 && dimScores.workstyle < 50 && dimScores.context < 50);
                        })();
                        
                        return (
                          <tr key={i} className={`hover:bg-gray-50 ${needsAttention ? 'bg-yellow-50' : ''}`}>
                            <td className="border p-2 font-medium">
                              {nameMapping[result.pin] || '—'}
                              {needsAttention && (
                                <span className="ml-2 text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded">Tarvitsee tukea</span>
                              )}
                            </td>
                            <td className="border p-2 font-mono text-sm">{result.pin}</td>
                            <td className="border p-2 text-sm">
                              {new Date(result.created_at).toLocaleDateString('fi-FI')}
                            </td>
                            <td className="border p-2 text-sm">
                              {(() => {
                                const scores = (payload?.dimension_scores || payload?.dimensionScores) as Record<string, number> || {};
                                const avg = Object.values(scores).length > 0 
                                  ? Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length 
                                  : 0;
                                if (avg === 0) return '—';
                                // Show simple indicator instead of percentage
                                if (avg >= 75) return 'Korkea';
                                if (avg >= 60) return 'Keskitaso';
                                if (avg >= 50) return 'Kohtalainen';
                                return 'Alhainen';
                              })()}
                            </td>
                            <td className="border p-2 text-sm">
                              <div className="flex flex-col gap-1">
                                {topCareers.slice(0, 3).map((career: any, idx: number) => (
                                  <span key={idx} className="text-xs">
                                    {idx + 1}. {career.title}
                                  </span>
                                ))}
                                {topCareers.length === 0 && <span className="text-gray-400">—</span>}
                              </div>
                            </td>
                            <td className="border p-2 text-sm">{cohort || '—'}</td>
                            <td className="border p-2 text-sm font-medium">{getEducationPathDisplay()}</td>
                            <td className="border p-2 text-xs text-gray-600 max-w-xs">{profile}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                // Detailed view with dimension breakdown
                <div className="space-y-4">
                  {filteredResults.map((result, i) => {
                    const payload = result.result_payload || {};
                    const dimScores = payload.dimension_scores || payload.dimensionScores || {};
                    const topCareers = payload.top_careers || payload.topCareers || [];
                    const cohort = payload.cohort || '';
                    const name = nameMapping[result.pin] || result.pin;
                    const profile = generateStudentProfile(result, name, analytics);
                    
                    const dimensionBars = [
                      { label: 'Kiinnostukset', value: dimScores.interests || 0, classAvg: analytics.dimensionAverages.interests },
                      { label: 'Arvot', value: dimScores.values || 0, classAvg: analytics.dimensionAverages.values },
                      { label: 'Työtapa', value: dimScores.workstyle || 0, classAvg: analytics.dimensionAverages.workstyle },
                      { label: 'Konteksti', value: dimScores.context || 0, classAvg: analytics.dimensionAverages.context },
                    ];
                    
                    // Check if student needs attention
                    const needsAttention = (() => {
                      const scores = (dimScores || {}) as Record<string, number>;
                      const values = Object.values(scores) as number[];
                      if (values.length === 0) return false;
                      const avg = values.reduce((a, b) => a + b, 0) / values.length;
                      return avg < 50 || ((scores.interests ?? 0) < 50 && (scores.values ?? 0) < 50 && (scores.workstyle ?? 0) < 50 && (scores.context ?? 0) < 50);
                    })();
                    
                    return (
                      <div key={i} className={`bg-white border ${needsAttention ? 'border-orange-300' : 'border-gray-300'} rounded-lg p-4`}>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-lg">{name}</h3>
                              {needsAttention && (
                                <span className="text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded">Tarvitsee tukea</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">PIN: {result.pin} • {new Date(result.created_at).toLocaleDateString('fi-FI')} • {cohort}</p>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Profiili:</p>
                          <p className="text-sm text-gray-600">{profile}</p>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Oppimisprofiili:</p>
                          <div className="space-y-2">
                            {dimensionBars.map((dim, idx) => {
                              const diff = dim.value - dim.classAvg;
                              const diffLabel = diff > 5 ? 'Yli keskiarvon' : diff < -5 ? 'Alle keskiarvon' : 'Keskiarvo';
                              const diffColor = diff > 5 ? 'text-green-600' : diff < -5 ? 'text-orange-600' : 'text-gray-600';
                              
                              // Plain language interpretation
                              let interpretation = '';
                              if (dim.label === 'Kiinnostukset' && dim.value > 70) interpretation = 'Vahvat kiinnostuksen kohteet';
                              else if (dim.label === 'Arvot' && dim.value > 70) interpretation = 'Arvostaa auttamista';
                              else if (dim.label === 'Työtapa' && dim.value > 70) interpretation = 'Haluaa oppia tekemällä';
                              else if (dim.label === 'Työtapa' && dim.value < 50) interpretation = 'Haluaa oppia teoriapainotteisesti';
                              else if (dim.label === 'Konteksti' && dim.value > 70) interpretation = 'Sosiaalinen oppija';
                              
                              return (
                                <div key={idx} className="flex items-center gap-3">
                                  <span className="text-sm w-24">{dim.label}:</span>
                                  <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                                    <div 
                                      className="bg-blue-500 h-3 rounded-full transition-all"
                                      style={{ width: `${Math.min(dim.value, 100)}%` }}
                                    />
                                  </div>
                                  {interpretation && (
                                    <span className="text-xs text-gray-600 w-32">{interpretation}</span>
                                  )}
                                  <span className={`text-xs ${diffColor} w-20`}>
                                    {diffLabel}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Top 5 uraa:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {topCareers.slice(0, 5).map((career: any, idx: number) => (
                              <div key={idx} className="bg-gray-50 p-2 rounded text-sm">
                                <span className="font-medium">{idx + 1}. {career.title}</span>
                                <span className="text-gray-600 ml-2">({Math.round(career.score * 100)}%)</span>
                              </div>
                            ))}
                            {topCareers.length === 0 && <span className="text-gray-400">Ei tuloksia</span>}
                          </div>
                        </div>
                        
                        {/* Conversation Starters */}
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
                            <div className="mt-4 border-t pt-4">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-gray-800">💬 Keskustelunavaukset</h4>
                                <button
                                  onClick={() => {
                                    const text = `KESKUSTELUNAVAUKSET - ${name}\n\n` +
                                      `KYSYMYKSET:\n${starters.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}\n\n` +
                                      `KESKUSTELUPISTEET:\n${starters.talkingPoints.map((tp, i) => `${i + 1}. ${tp}`).join('\n')}\n\n` +
                                      `TOIMINTAKOHDAT:\n${starters.actionItems.map((ai, i) => `${i + 1}. ${ai}`).join('\n')}`;
                                    navigator.clipboard.writeText(text);
                                    alert('Kopioitu leikepöydälle!');
                                  }}
                                  className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                                >
                                  Kopioi teksti
                                </button>
                              </div>
                              
                              <div className="space-y-3">
                                <div>
                                  <p className="text-xs font-medium text-gray-700 mb-1">Kysymykset oppilaan kanssa:</p>
                                  <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                                    {starters.questions.slice(0, 4).map((q, idx) => (
                                      <li key={idx}>{q}</li>
                                    ))}
                                  </ul>
                                </div>
                                
                                <div>
                                  <p className="text-xs font-medium text-gray-700 mb-1">Keskustelupisteet:</p>
                                  <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                                    {starters.talkingPoints.slice(0, 3).map((tp, idx) => (
                                      <li key={idx}>{tp}</li>
                                    ))}
                                  </ul>
                                </div>
                                
                                <div>
                                  <p className="text-xs font-medium text-gray-700 mb-1">Toimintakohdat:</p>
                                  <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                                    {starters.actionItems.slice(0, 3).map((ai, idx) => (
                                      <li key={idx}>{ai}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
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

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Class Overview */}
          <div className="bg-white border border-gray-300 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Luokan yleiskuva</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{results.length}</div>
                <div className="text-sm text-gray-600">Testiä tehty</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">
                  {Object.keys(analytics.cohortDistribution).length}
                </div>
                <div className="text-sm text-gray-600">Kohorttia</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">
                  {analytics.topCareers.length}
                </div>
                <div className="text-sm text-gray-600">Eri ammattia</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-3xl font-bold text-orange-600">
                  {Math.round((analytics.dimensionAverages.interests + analytics.dimensionAverages.values + analytics.dimensionAverages.workstyle + analytics.dimensionAverages.context) / 4)}%
                </div>
                <div className="text-sm text-gray-600">Keskiarvo</div>
              </div>
            </div>
          </div>

          {/* Top Careers */}
          <div className="bg-white border border-gray-300 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Yleisimmät ammatit</h2>
            <div className="space-y-2">
              {analytics.topCareers.slice(0, 10).map((career, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-gray-400 w-8">#{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{career.name}</span>
                      <span className="text-sm text-gray-600">{career.count} oppilasta</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(career.count / results.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dimension Averages Chart */}
          <div className="bg-white border border-gray-300 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Luokan keskiarvot dimensioissa</h2>
            <div className="space-y-4">
              {Object.entries(analytics.dimensionAverages).map(([dim, avg]) => (
                <div key={dim}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium capitalize">{dim === 'interests' ? 'Kiinnostukset' : dim === 'values' ? 'Arvot' : dim === 'workstyle' ? 'Työtapa' : 'Konteksti'}</span>
                    <span className="text-sm font-semibold">{Math.round(avg)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full"
                      style={{ width: `${avg}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education Path Distribution (YLA only) */}
          {analytics.educationPathDistribution.lukio + analytics.educationPathDistribution.ammattikoulu + analytics.educationPathDistribution.kansanopisto > 0 && (
            <div className="bg-white border border-gray-300 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Koulutuspolkujen jakauma (YLA)</h2>
              <div className="space-y-3">
                {Object.entries(analytics.educationPathDistribution).map(([path, count]) => {
                  if (count === 0) return null;
                  const pathNames: Record<string, string> = {
                    'lukio': 'Lukio',
                    'ammattikoulu': 'Ammattikoulu',
                    'kansanopisto': 'Kansanopisto'
                  };
                  const totalYLA = Object.values(analytics.educationPathDistribution).reduce((a, b) => a + b, 0);
                  return (
                    <div key={path}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{pathNames[path] || path}</span>
                        <span className="text-sm font-semibold">{count} oppilasta ({totalYLA > 0 ? Math.round((count / totalYLA) * 100) : 0}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className="bg-green-500 h-4 rounded-full"
                          style={{ width: `${totalYLA > 0 ? (count / totalYLA) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cohort Distribution */}
          <div className="bg-white border border-gray-300 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Kohorttijakauma</h2>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(analytics.cohortDistribution).map(([cohort, count]) => {
                const cohortNames: Record<string, string> = {
                  'YLA': 'Yläaste',
                  'TASO2': 'Toinen aste',
                  'NUORI': 'Nuori aikuinen'
                };
                return (
                  <div key={cohort} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold">{count}</div>
                    <div className="text-sm text-gray-600">{cohortNames[cohort] || cohort}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Public Links */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <div>
          <p className="font-semibold mb-2">Oppilaiden testilinkki</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
            <p data-testid="student-test-link" className="text-sm text-blue-600 break-all flex-1">{studentTestLink}</p>
            <button
              type="button"
              onClick={() => handleCopyLink(studentTestLink, 'Oppilaiden testilinkki kopioitu leikepöydälle.')}
              data-testid="copy-student-test-link"
              className="mt-2 sm:mt-0 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
            >
              Kopioi linkki
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Oppilaat syöttävät PIN-koodinsa tällä sivulla ja pääsevät testiin.
          </p>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <p className="font-semibold mb-2 text-sm">Luokan tulossivu</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
            <p data-testid="class-results-link" className="text-sm text-blue-600 break-all flex-1">{classResultsLink}</p>
            <button
              type="button"
              onClick={() => handleCopyLink(classResultsLink, 'Luokan tulossivu kopioitu leikepöydälle.')}
              data-testid="copy-class-results-link"
              className="mt-2 sm:mt-0 text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
            >
              Kopioi linkki
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Täältä näet anonyymit tulokset, kun oppilaat ovat tehneet testin.
          </p>
        </div>
      </div>
    </div>
  );
}
