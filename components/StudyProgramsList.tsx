'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ExternalLink, GraduationCap, Search, Filter, ArrowUpDown, Info } from 'lucide-react';
import { StudyProgram } from '@/lib/data/studyPrograms';
import { getPointRangeCategory, formatPoints } from '@/lib/todistuspiste';
import { ProgramDetailsModal } from '@/components/ProgramDetailsModal';
import { fetchStudyPrograms } from '@/lib/api/studyPrograms';
import Link from 'next/link';

interface StudyProgramsListProps {
  points: number;
  careerSlugs: string[];
  educationType: 'yliopisto' | 'amk';
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

export function StudyProgramsList({ points, careerSlugs, educationType }: StudyProgramsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [fieldFilter, setFieldFilter] = useState('all');
  const [sortBy, setSortBy] = useState('match');
  const [selectedProgram, setSelectedProgram] = useState<StudyProgram | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [programs, setPrograms] = useState<StudyProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  // Fetch programs from API
  useEffect(() => {
    async function loadPrograms() {
      setLoading(true);
      setError(null);
      
      try {
        const result = await fetchStudyPrograms({
          points,
          type: educationType,
          field: fieldFilter !== 'all' ? fieldFilter : undefined,
          careers: careerSlugs,
          search: searchQuery.trim() || undefined,
          sort: sortBy as 'match' | 'points-low' | 'points-high' | 'name',
          limit: 50,
          offset: 0
        });
        
        setPrograms(result.programs);
        setTotal(result.total);
      } catch (err: any) {
        console.error('[StudyProgramsList] Error fetching programs:', err);
        setError('Koulutusohjelmien lataus epäonnistui. Yritä myöhemmin uudelleen.');
      } finally {
        setLoading(false);
      }
    }

    loadPrograms();
  }, [points, educationType, fieldFilter, searchQuery, sortBy, careerSlugs]);

  const getMatchBadge = (program: StudyProgram) => {
    const matchCount = program.relatedCareers.filter(slug => careerSlugs.includes(slug)).length;
    if (matchCount >= 2) {
      return { text: 'Erittäin hyvä yhteensopivuus', color: 'bg-green-100 text-green-800' };
    } else if (matchCount === 1) {
      return { text: 'Hyvä yhteensopivuus', color: 'bg-blue-100 text-blue-800' };
    }
    return null;
  };

  const getChanceBadge = (program: StudyProgram) => {
    const category = getPointRangeCategory(points, program.minPoints, program.maxPoints);
    switch (category) {
      case 'excellent':
        return { text: 'Erinomainen mahdollisuus', color: 'bg-green-100 text-green-800' };
      case 'good':
        return { text: 'Hyvä mahdollisuus', color: 'bg-blue-100 text-blue-800' };
      case 'realistic':
        return { text: 'Realistinen mahdollisuus', color: 'bg-yellow-100 text-yellow-800' };
      case 'reach':
        return { text: 'Haastava', color: 'bg-orange-100 text-orange-800' };
      default:
        return null;
    }
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
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Etsi koulutusohjelmaa tai oppilaitosta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Field Filter */}
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Ala
              </label>
              <select
                value={fieldFilter}
                onChange={(e) => setFieldFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {FIELD_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Sort Filter */}
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Järjestä
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Results Count */}
          {!loading && programs.length > 0 && (
            <p className="text-sm text-gray-600">
              Löytyi {total} koulutusohjelmaa
              {total > programs.length && ` (näytetään ${programs.length} ensimmäistä)`}
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Ladataan koulutusohjelmia...</p>
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
          <div className="text-center py-8">
            <p className="text-gray-600 mb-2">
              {searchQuery || fieldFilter !== 'all' 
                ? 'Ei koulutusohjelmia löytynyt hakuehtojesi mukaan.'
                : 'Valitettavasti emme löytäneet koulutusohjelmia, jotka sopisivat pisteisiisi.'}
            </p>
            {(searchQuery || fieldFilter !== 'all') && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setFieldFilter('all');
                }}
                className="mt-4"
              >
                Tyhjennä suodattimet
              </Button>
            )}
          </div>
        )}

        {!loading && !error && programs.length > 0 && (
          <div className="space-y-4">
            {programs.map((program) => {
              const matchBadge = getMatchBadge(program);
              const chanceBadge = getChanceBadge(program);
              
              return (
                <Card 
                key={program.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
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
                          <p className="text-sm text-gray-600 mb-2">
                            {program.institution}
                          </p>
                          {program.description && (
                            <p className="text-sm text-gray-700 mb-3">
                              {program.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2 mb-2">
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
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                              {program.institutionType === 'yliopisto' ? 'Yliopisto' : 'AMK'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Pisterajat:</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatPoints(program.minPoints)}
                          {program.maxPoints && ` - ${formatPoints(program.maxPoints)}`}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Sinun pisteet: {formatPoints(points)}
                        </p>
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
                <p className="text-sm text-gray-600">
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

