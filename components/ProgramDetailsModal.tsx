'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, GraduationCap, MapPin, Calendar, Users } from 'lucide-react';
import { StudyProgram } from '@/lib/data/studyPrograms';
import { formatPoints, getPointRangeCategory } from '@/lib/todistuspiste';
import { careersData } from '@/data/careers-fi';
import Link from 'next/link';

interface ProgramDetailsModalProps {
  program: StudyProgram | null;
  isOpen: boolean;
  onClose: () => void;
  userPoints: number;
  careerSlugs: string[];
}

const CAREER_TITLE_BY_SLUG = careersData.reduce<Record<string, string>>((acc, career) => {
  acc[career.id] = career.title_fi;
  return acc;
}, {});

export function ProgramDetailsModal({ 
  program, 
  isOpen, 
  onClose, 
  userPoints,
  careerSlugs 
}: ProgramDetailsModalProps) {
  if (!program) return null;

  const matchCount = program.relatedCareers.filter(slug => careerSlugs.includes(slug)).length;
  const chanceCategory = getPointRangeCategory(userPoints, program.minPoints, program.maxPoints);
  
  const getChanceText = () => {
    switch (chanceCategory) {
      case 'excellent':
        return 'Erinomainen mahdollisuus pääsyä';
      case 'good':
        return 'Hyvä mahdollisuus pääsyä';
      case 'realistic':
        return 'Realistinen mahdollisuus pääsyä';
      case 'reach':
        return 'Haastava, mutta mahdollinen';
      default:
        return 'Alhainen mahdollisuus';
    }
  };

  const getChanceColor = () => {
    switch (chanceCategory) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-primary';
      case 'realistic':
        return 'text-yellow-600';
      case 'reach':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <GraduationCap className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{program.name}</DialogTitle>
              <DialogDescription className="text-base">
                {program.institution}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Description */}
          {program.description && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Kuvaus</h3>
              <p className="text-gray-700 leading-relaxed">{program.description}</p>
            </div>
          )}

          {/* Key Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-gray-700">Pisterajat</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {formatPoints(program.minPoints)}
                {program.maxPoints && ` - ${formatPoints(program.maxPoints)}`}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Sinun pisteet: {formatPoints(userPoints)}
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-green-600" />
                <span className="text-sm font-semibold text-gray-700">Mahdollisuus</span>
              </div>
              <p className={`text-lg font-bold ${getChanceColor()}`}>
                {getChanceText()}
              </p>
            </div>
          </div>

          {/* Match Information */}
          {matchCount > 0 && (
            <div className="bg-secondary/10 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                Yhteensopivuus ammattisuosituksiesi kanssa
              </h3>
              <p className="text-gray-700">
                Tämä koulutusohjelma sopii {matchCount} {matchCount === 1 ? 'ammattisuosituksellesi' : 'ammattisuosituksellesi'}.
                {matchCount >= 2 && ' Tämä on erittäin hyvä yhteensopivuus!'}
              </p>
            </div>
          )}

          {/* Institution Type */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>
              <strong>Oppilaitostyyppi:</strong> {program.institutionType === 'yliopisto' ? 'Yliopisto' : 'Ammattikorkeakoulu'}
            </span>
          </div>

          {/* Field */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>
              <strong>Ala:</strong> {program.field.charAt(0).toUpperCase() + program.field.slice(1)}
            </span>
          </div>

          {/* Related Careers */}
          {program.relatedCareers.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Liittyvät ammatit</h3>
              <div className="flex flex-wrap gap-2">
                {program.relatedCareers.map((careerSlug, index) => {
                  const isMatched = careerSlugs.includes(careerSlug);
                  const careerTitle = CAREER_TITLE_BY_SLUG[careerSlug] || careerSlug.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ');
                  return (
                    <Link
                      key={index}
                      href={`/ammatit/${encodeURIComponent(careerSlug)}`}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 ${
                        isMatched
                          ? 'bg-green-100 text-green-800 border-2 border-green-300 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {careerTitle}
                      {isMatched && <span className="ml-1">✓</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            {program.opintopolkuUrl && (
              <Link href={program.opintopolkuUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button className="w-full" size="lg">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Katso Opintopolussa
                </Button>
              </Link>
            )}
            <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
              Sulje
            </Button>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-600">
            <p>
              <strong>Huomio:</strong> Pisterajat perustuvat vuoden 2025 todistusvalinnan tietoihin. 
              Tarkat pisterajat voivat vaihdella vuosittain. Tarkista aina viralliset tiedot Opintopolusta ennen hakemista.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

