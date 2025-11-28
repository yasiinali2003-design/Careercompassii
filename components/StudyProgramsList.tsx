'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExternalLink, GraduationCap, Info, Search, SearchX, Star } from 'lucide-react';
import { StudyProgram } from '@/lib/data/studyPrograms';
import { getPointRangeCategory, formatPoints, SubjectInputs } from '@/lib/todistuspiste';
import { ProgramDetailsModal } from '@/components/ProgramDetailsModal';
import { fetchStudyPrograms } from '@/lib/api/studyPrograms';
import { ProbabilityBadge } from '@/components/ProbabilityBadge';
import { getTrendIndicator } from '@/lib/todistuspiste/probability';
import Link from 'next/link';

interface StudyProgramsListProps {
  points: number;
  careerSlugs: string[];
  educationType: 'yliopisto' | 'amk';
  onOpenScenario?: () => void;
  userInputs?: SubjectInputs;
}

const FIELD_OPTIONS = [
  { value: 'all', label: 'Kaikki alat' },
  { value: 'teknologia', label: 'Teknologia' },
  { value: 'terveys', label: 'Terveys' },
  { value: 'kauppa', label: 'Kauppa' },
  { value: 'tekniikka', label: 'Tekniikka' },
  { value: 'kasvatus', label: 'Kasvatus' },
  { value: 'oikeus', label: 'Oikeus' },
  { value: 'psykologia', label: 'Psykologia' },
  { value: 'media', label: 'Media' },
  { value: 'taide', label: 'Taide' },
  { value: 'yhteiskunta', label: 'Yhteiskunta' },
  { value: 'luonnontiede', label: 'Luonnontiede' },
  { value: 'humanistinen', label: 'Humanistinen' },
  { value: 'liikunta', label: 'Liikunta' },
  { value: 'maatalous', label: 'Maatalous' },
  { value: 'metsatalous', label: 'Metsätalous' },
  { value: 'elintarvike', label: 'Elintarvike' },
  { value: 'palvelu', label: 'Palvelu' },
  { value: 'turvallisuus', label: 'Turvallisuus' },
  { value: 'merenkulku', label: 'Merenkulku' },
  { value: 'rakentaminen', label: 'Rakentaminen' }
];

const SORT_OPTIONS = [
  { value: 'match', label: 'Paras yhteensopivuus' },
  { value: 'points-low', label: 'Pisteet: alhaisimmat ensin' },
  { value: 'points-high', label: 'Pisteet: korkeimmat ensin' },
  { value: 'name', label: 'Nimi: A-Ö' }
];

const FAVORITES_KEY = 'todistuspisteFavorites';

export function StudyProgramsList({ points, careerSlugs, educationType, onOpenScenario, userInputs }: StudyProgramsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [fieldFilter, setFieldFilter] = useState('all');
  const [sortBy, setSortBy] = useState('match');
  const [selectedProgram, setSelectedProgram] = useState<StudyProgram | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [programs, setPrograms] = useState<StudyProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [includeReach, setIncludeReach] = useState(false);
  const [reachCount, setReachCount] = useState<number | null>(null);
  const [showAllCareers, setShowAllCareers] = useState(() => {
    if (careerSlugs.length === 0) {
      return true;
    }
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('todistuspisteShowAllCareers');
        if (stored === 'true') return true;
        if (stored === 'false') return false;
      } catch (error) {
        console.warn('[StudyProgramsList] Failed to read career filter preference', error);
      }
    }
    return false;
  });
  const onlyReachPrograms = !loading && !error && programs.length > 0 && programs.every(program => program.reach || program.tags?.includes('reach'));
  const isCareerFilterRelaxed = showAllCareers && careerSlugs.length > 0;

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      sessionStorage.setItem('todistuspisteShowAllCareers', showAllCareers ? 'true' : 'false');
    } catch (error) {
      console.warn('[StudyProgramsList] Failed to persist career filter preference', error);
    }
  }, [showAllCareers]);

  useEffect(() => {
    if (careerSlugs.length === 0) {
      if (!showAllCareers) {
        setShowAllCareers(true);
      }
      return;
    }
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const stored = sessionStorage.getItem('todistuspisteShowAllCareers');
      if (stored === 'true' && !showAllCareers) {
        setShowAllCareers(true);
      } else if (stored === 'false' && showAllCareers) {
        setShowAllCareers(false);
      }
    } catch (error) {
      console.warn('[StudyProgramsList] Failed to restore showAllCareers preference', error);
    }
  }, [careerSlugs, showAllCareers]);

  // Fetch programs from API
  useEffect(() => {
    async function loadPrograms() {
      setLoading(true);
      setError(null);

      try {
        const shouldRelaxCareers = showAllCareers || careerSlugs.length === 0;
        const effectiveCareers = shouldRelaxCareers ? [] : careerSlugs;
        const baseQuery = {
          points,
          type: educationType,
          field: fieldFilter !== 'all' ? fieldFilter : undefined,
          careers: effectiveCareers,
          search: searchQuery.trim() || undefined,
          sort: sortBy as 'match' | 'points-low' | 'points-high' | 'name',
          limit: 50,
          offset: 0
        } as const;

        const result = await fetchStudyPrograms(baseQuery);

        let combinedPrograms = [...result.programs];
        let combinedTotal = result.total;
        let reachAdded = result.metadata?.fallbackCount ?? 0;
        const relaxedCareers = shouldRelaxCareers;

        if (includeReach && points !== undefined && points !== null) {
          try {
            const reachResult = await fetchStudyPrograms({
              ...baseQuery,
              points: points + 20,
              sort: 'points-low',
              includeReachPrograms: false,
              careers: relaxedCareers ? [] : baseQuery.careers
            });

            const reachPrograms = reachResult.programs
              .filter(program => program.minPoints > points)
              .filter(program => !combinedPrograms.some(existing => existing.id === program.id))
              .sort((a, b) => a.minPoints - b.minPoints)
              .slice(0, 5)
              .map(program => ({ ...program, reach: true }));

            if (reachPrograms.length > 0) {
              combinedPrograms = [...combinedPrograms, ...reachPrograms];
              reachAdded += reachPrograms.length;
            }
          } catch (reachError) {
            console.warn('[StudyProgramsList] Failed to load reach programs', reachError);
          }
        }

        if (combinedTotal === 0 && reachAdded > 0) {
          combinedTotal = reachAdded;
        }

        setPrograms(combinedPrograms);
        setTotal(combinedTotal);
        setReachCount(reachAdded > 0 ? reachAdded : null);
      } catch (err: any) {
        console.error('[StudyProgramsList] Error fetching programs:', err);
        setError('Koulutusohjelmien lataus epäonnistui. Yritä myöhemmin uudelleen.');
      } finally {
        setLoading(false);
      }
    }

    loadPrograms();
  }, [points, educationType, fieldFilter, searchQuery, sortBy, careerSlugs, includeReach, showAllCareers]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('todistuspisteFavorites');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      }
    } catch (error) {
      console.warn('[StudyProgramsList] Failed to load favorites from localStorage', error);
    }
  }, []);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('todistuspisteIncludeReach');
      if (stored === 'true') {
        setIncludeReach(true);
      }
    } catch (error) {
      console.warn('[StudyProgramsList] Failed to read reach preference', error);
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem('todistuspisteIncludeReach', includeReach ? 'true' : 'false');
    } catch (error) {
      console.warn('[StudyProgramsList] Failed to persist reach preference', error);
    }
  }, [includeReach]);

  const toggleFavorite = (programId: string) => {
    setFavorites(prev => {
      const exists = prev.includes(programId);
      const updated = exists ? prev.filter(id => id !== programId) : [...prev, programId];
      try {
        localStorage.setItem('todistuspisteFavorites', JSON.stringify(updated));
      } catch (error) {
        console.warn('[StudyProgramsList] Failed to persist favorites', error);
      }
      return updated;
    });
  };

  const getMatchBadge = (program: StudyProgram) => {
    const matchCount = program.relatedCareers.filter(slug => careerSlugs.includes(slug)).length;
    if (matchCount >= 2) {
      return { text: 'Erittäin hyvä yhteensopivuus', color: 'bg-green-100 text-green-800' };
    } else if (matchCount === 1) {
      return { text: 'Hyvä yhteensopivuus', color: 'bg-primary/10 text-primary' };
    }
    return null;
  };

  const formatPointValue = (value?: number | null) => {
    if (value === null || value === undefined) return '—';
    return formatPoints(value);
  };

  const getFallbackConfidenceBadge = (program: StudyProgram) => {
    const category = getPointRangeCategory(points, program.minPoints, program.maxPoints);
    switch (category) {
      case 'excellent':
        return { text: 'Erinomainen mahdollisuus', color: 'bg-green-100 text-green-800' };
      case 'good':
        return { text: 'Hyvä mahdollisuus', color: 'bg-primary/10 text-primary' };
      case 'realistic':
        return { text: 'Realistinen mahdollisuus', color: 'bg-yellow-100 text-yellow-800' };
      case 'reach':
        return { text: 'Haastava', color: 'bg-orange-100 text-orange-800' };
      default:
        return null;
    }
  };

  const getHistoryConfidence = (program: StudyProgram) => {
    const latest = program.pointHistory?.[0];
    if (!latest) return null;

    const min = latest.minPoints ?? null;
    const median = latest.medianPoints ?? min;
    if (min === null && median === null) return null;

    const baseline = median ?? min ?? 0;
    const safeThreshold = baseline + 5;
    const solidThreshold = (min ?? baseline) - 5;

    if (points >= safeThreshold) {
      return {
        badge: { text: 'Vahva mahdollisuus (historia)', color: 'bg-green-100 text-green-800' },
        detail: `Viimeisin pisteraja ${latest.year}: min ${formatPointValue(min)}, mediaani ${formatPointValue(latest.medianPoints)}.`,
        history: latest
      };
    }

    if (min !== null && points >= min) {
      return {
        badge: { text: 'Hyvä mahdollisuus (historia)', color: 'bg-primary/10 text-primary' },
        detail: `Viimeisin pisteraja ${latest.year}: min ${formatPointValue(min)}, mediaani ${formatPointValue(latest.medianPoints)}.`,
        history: latest
      };
    }

    if (points >= solidThreshold) {
      return {
        badge: { text: 'Mahdollinen – vaatii lisäpanostusta', color: 'bg-yellow-100 text-yellow-800' },
        detail: `Olet lähellä viime vuoden pisterajaa (${formatPointValue(min)}).`,
        history: latest
      };
    }

    return {
      badge: { text: 'Haastava nykyisillä pisteillä', color: 'bg-orange-100 text-orange-800' },
      detail: `Viime vuonna alimmat pisteet olivat ${formatPointValue(min)} (${latest.year}).`,
      history: latest
    };
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl">Sopivat koulutusohjelmat</CardTitle>
        <CardDescription>
          Koulutusohjelmia, jotka sopivat pisteisiisi ja <strong>testin perusteella saamiisi ammattisuosituksiin</strong>. 
          Olemme suositelleet ohjelmia, jotka tukevat sinun kiinnostuksiasi ja vahvuuksiasi.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search and Filter Controls */}
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-800 mb-2 block">Hae ohjelmia</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Etsi koulutusohjelmaa tai oppilaitosta..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-end">
              <div className="md:w-48">
                <label className="text-sm font-semibold text-gray-800 mb-2 block">Ala</label>
                <Select value={fieldFilter} onValueChange={setFieldFilter}>
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="Valitse ala" />
                  </SelectTrigger>
                  <SelectContent>
                    {FIELD_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:w-56">
                <label className="text-sm font-semibold text-gray-800 mb-2 block">Järjestä</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="Valitse järjestys" />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="md:self-center"
                onClick={() => {
                  setSearchQuery('');
                  setFieldFilter('all');
                  setSortBy('match');
                  setIncludeReach(false);
                }}
              >
                Tyhjennä
              </Button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-neutral-300">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 font-medium text-primary">
              {loading ? 'Ladataan ohjelmia…' : `Näytetään ${programs.length} / ${total} ohjelmaa`}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-neutral-800/30 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-slate-500" />
              {educationType === 'yliopisto' ? 'Yliopistohaku' : 'AMK-haku'}
            </span>
            {careerSlugs.length > 0 && (
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-secondary/100" />
                {showAllCareers ? 'Kaikki alat näkyvissä' : 'Suositusalat (testituloksen mukaan)'}
              </span>
            )}
            {includeReach && (
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-amber-800">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Tavoiteohjelmat näkyvissä{reachCount !== null ? ` (${reachCount})` : ''}
              </span>
            )}
            {fieldFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-neutral-800/30 px-3 py-1">
                <span className="font-semibold">Ala:</span>
                {FIELD_OPTIONS.find(f => f.value === fieldFilter)?.label || 'Kaikki'}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIncludeReach(prev => !prev)}
            >
              {includeReach ? 'Piilota tavoiteohjelmat' : 'Näytä tavoiteohjelmat'}
            </Button>
            {careerSlugs.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllCareers(prev => !prev)}
                className="md:self-center"
              >
                {showAllCareers ? 'Näytä vain suositusalat' : 'Näytä myös muut alat'}
              </Button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse rounded-2xl border border-gray-200 bg-neutral-900/20 p-4">
                <div className="h-4 w-1/3 rounded bg-neutral-700/40" />
                <div className="mt-3 h-3 w-full rounded bg-neutral-700/40" />
                <div className="mt-2 flex gap-2">
                  <div className="h-4 w-24 rounded bg-neutral-700/40" />
                  <div className="h-4 w-28 rounded bg-neutral-700/40" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-8">
            <p className="text-red-600 mb-2">{error}</p>
            <Button
              variant="outline"
              onClick={() => {
                setError(null);
                // Retry by reloading
                window.location.reload();
              }}
            >
              Yritä uudelleen
            </Button>
          </div>
        )}

        {/* Programs List */}
        {!loading && !error && programs.length === 0 && (
          <div className="text-center py-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-500">
              <SearchX className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Ei vielä sopivia tuloksia</h3>
            <p className="mt-2 text-sm text-neutral-300 max-w-lg mx-auto">
              Tällä hetkellä pisteesi jäävät valittujen ohjelmien pisterajojen alle. Kokeile korottaa arvosanaa skenaariotyökalulla tai laajenna hakua – näytämme myös tavoitteellisia ohjelmia, jotka ovat lähellä nykyisiä pisteitäsi.
              {careerSlugs.length > 0 && !showAllCareers
                ? ' Voit halutessasi avata myös muut alat, jotka eivät suoraan kuulu urasuosituksiin.'
                : ''}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onOpenScenario?.();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Avaa skenaariotyökalu
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setFieldFilter('all');
                  setSortBy('match');
                  setIncludeReach(false);
                }}
              >
                Tyhjennä suodattimet
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIncludeReach(true)}
              >
                Näytä tavoiteohjelmat
              </Button>
              {careerSlugs.length > 0 && !showAllCareers && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAllCareers(true)}
                >
                  Näytä myös muut alat
                </Button>
              )}
            </div>
          </div>
        )}

        {!loading && !error && programs.length > 0 && (
          <div className="rounded-lg border border-blue-100 bg-slate-50/60 px-4 py-3 text-xs text-primary mb-4">
            <p className="font-medium">Vinkki</p>
            <p>
              Voit käyttää skenaariotyökalua nähdäksesi, miten arvosanojen korottaminen vaikuttaisi pisteisiisi ja avaisi lisää ohjelmia. Jos etsit vanhoja tuloksia, tarkista että pisteesi on laskettu nykyisillä arvosanoilla.
            </p>
            {onlyReachPrograms && (
              <p className="mt-2 text-amber-700">
                Tällä hetkellä ohjelmat ovat tavoitetasoa. Nosta yhtä tai kahta arvosanaa skenaariotyökalulla – jo muutaman pisteen nousu avaa realistisia vaihtoehtoja.
              </p>
            )}
            {isCareerFilterRelaxed && !onlyReachPrograms && (
              <p className="mt-2 text-primary">
                Näytetään myös muut alat suositusten lisäksi. Voit palata suppeampaan näkymään yllä olevalla painikkeella.
              </p>
            )}
            {reachCount && reachCount > 0 && !onlyReachPrograms && includeReach && (
              <p className="mt-2 text-amber-700">
                Mukana myös tavoiteohjelmia pisteidesi yläpuolelta. Voit piilottaa ne yläpalkin painikkeesta, jos haluat keskittyä varmoihin vaihtoehtoihin.
              </p>
            )}
          </div>
        )}

        {!loading && !error && programs.length > 0 && (
          <div className="space-y-4">
            {programs.map((program) => {
              const matchBadge = getMatchBadge(program);
              const historyConfidence = getHistoryConfidence(program);
              const chanceBadge = historyConfidence?.badge || getFallbackConfidenceBadge(program);
              const isReachProgram = Boolean(program.reach || program.tags?.includes('reach'));
              const reachGap = isReachProgram ? Math.max(0, program.minPoints - points) : 0;
              const isFavorite = favorites.includes(program.id);
              const trend = getTrendIndicator(program.pointHistory || []);
              const medianPoints = program.pointHistory?.[0]?.medianPoints ?? null;

              return (
                <Card
                key={program.id}
                className="transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                onClick={() => {
                  setSelectedProgram(program);
                  setIsModalOpen(true);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <GraduationCap className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {program.name}
                            </h3>
                            <Info className="h-4 w-4 text-gray-400" />
                          </div>
                          <p className="text-sm text-neutral-300 mb-2">
                            {program.institution}
                          </p>
                          {program.description && (
                            <p className="text-sm text-neutral-200 mb-3">
                              {program.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {matchBadge && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${matchBadge.color}`}>
                                {matchBadge.text}
                              </span>
                            )}
                            {chanceBadge && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${chanceBadge.color}`}>
                                {chanceBadge.text}
                              </span>
                            )}
                            {isReachProgram && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                Tavoiteohjelma
                              </span>
                            )}
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-neutral-800/30 text-neutral-200">
                              {program.institutionType === 'yliopisto' ? 'Yliopisto' : 'AMK'}
                            </span>
                          </div>

                          {/* Probability Indicator */}
                          <div className="mb-3" onClick={(e) => e.stopPropagation()}>
                            <ProbabilityBadge
                              userPoints={points}
                              programMinPoints={program.minPoints}
                              programMedianPoints={medianPoints}
                            />
                          </div>

                          {/* Trend Indicator */}
                          {trend && (
                            <div className="text-xs bg-neutral-900/20 rounded px-3 py-2 mb-2">
                              <span className="font-semibold">Trendi:</span>{' '}
                              <span className={trend.color}>
                                {trend.icon} {trend.label}
                              </span>
                              {trend.change > 0 && (
                                <span className={trend.color}> ({trend.change > 0 ? '+' : ''}{trend.change.toFixed(1)} pistettä)</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700 hover:bg-yellow-100"
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleFavorite(program.id);
                        }}
                      >
                        <Star className={`h-4 w-4 ${isFavorite ? 'fill-yellow-500 text-yellow-500' : 'text-yellow-500'}`} />
                        {isFavorite ? 'Tallennettu' : 'Tallenna suosikiksi'}
                      </button>
                      <div className="text-right">
                        <p className="text-sm text-neutral-300">Pisterajat:</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatPoints(program.minPoints)}
                          {program.maxPoints && ` - ${formatPoints(program.maxPoints)}`}
                        </p>
                        <p className="text-xs text-neutral-400 mt-1">
                          Sinun pisteet: {formatPoints(points)}
                        </p>
                        {isReachProgram && reachGap > 0 && (
                          <p className="text-xs text-amber-700 mt-1">
                            Tarvitset noin {reachGap.toFixed(1).replace('.', ',')} pistettä lisää saavuttaaksesi viime vuoden pisterajan.
                          </p>
                        )}
                        {historyConfidence?.detail && (
                          <p className="text-xs text-neutral-400 mt-1">
                            {historyConfidence.detail}
                            {historyConfidence.history?.applicantCount ? ` Hakijoita: ${historyConfidence.history.applicantCount}.` : ''}
                          </p>
                        )}
                        {historyConfidence && (
                          <p className="text-xs text-gray-400 mt-1 italic">
                            Päivitys: {historyConfidence.history?.year}. Lähde: Opetushallituksen todistusvalintatilastot 2025.
                          </p>
                        )}
                      </div>
                      {program.opintopolkuUrl && (
                        <Link href={program.opintopolkuUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="w-full md:w-auto">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Opintopolku
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              );
            })}
            
            {total > programs.length && (
              <div className="mt-4 text-center">
                <p className="text-sm text-neutral-300">
                  Näytetään {programs.length} ensimmäistä {total} koulutusohjelmasta. Löydät lisää koulutusohjelmia{' '}
                  <Link href="https://opintopolku.fi" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Opintopolusta
                  </Link>
                  .
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      {/* Program Details Modal */}
      <ProgramDetailsModal
        program={selectedProgram}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProgram(null);
        }}
        userPoints={points}
        careerSlugs={careerSlugs}
      />
    </Card>
  );
}

