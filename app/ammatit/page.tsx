"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { careersData as careersFI } from '@/data/careers-fi';
import { Career, CareerFI, CareerFilters } from '@/lib/types';

// Convert CareerFI to Career format
function convertCareerFIToCareer(careerFI: any): Career {
  return {
    slug: careerFI.id,
    title: careerFI.title_fi,
    summary: careerFI.short_description,
    longDescription: careerFI.main_tasks?.join(' • ') || careerFI.short_description,
    salaryMin: careerFI.salary_eur_month?.range?.[0] || 2500,
    salaryMax: careerFI.salary_eur_month?.range?.[1] || 4000,
    outlook: careerFI.job_outlook?.status === "kasvaa" ? "Kasvaa" : "Vakaa",
    educationLevel: careerFI.education_paths || [],
    industry: [careerFI.category],
    personalityType: [careerFI.category],
    workMode: careerFI.work_conditions?.remote === "Kyllä" ? "Etä" : 
              careerFI.work_conditions?.remote === "Osittain" ? "Hybrid" : "Paikan päällä",
    skillsHard: careerFI.tools_tech || [],
    skillsSoft: careerFI.core_skills || [],
    dailyTasks: careerFI.main_tasks || [],
    opintopolkuLinks: (careerFI.useful_links || []).map((link: any) => ({
      label: link.name,
      url: link.url
    })),
    relatedSlugs: []
  };
}

// Debug: Check for undefined entries
const validCareers = careersFI.filter(c => c && c.id);
console.log(`CareersFI: Total=${careersFI.length}, Valid=${validCareers.length}, Invalid=${careersFI.length - validCareers.length}`);

const careersData = validCareers.map(convertCareerFIToCareer);

const filterOptions = {
  industry: Array.from(new Set(careersData.flatMap(c => c.industry))),
  educationLevel: Array.from(new Set(careersData.flatMap(c => c.educationLevel))),
  personalityType: Array.from(new Set(careersData.flatMap(c => c.personalityType))),
  workMode: Array.from(new Set(careersData.map(c => c.workMode))),
  outlook: Array.from(new Set(careersData.map(c => c.outlook)))
};
import Logo from '@/components/Logo';

export default function CareerCatalog() {
  const searchParams = useSearchParams();
  
  // Parse URL parameters
  const initialFilters: CareerFilters = {
    search: searchParams.get('search') || undefined,
    industry: searchParams.get('industry')?.split(',') || undefined,
    educationLevel: searchParams.get('educationLevel')?.split(',') || undefined,
    personalityType: searchParams.get('personalityType')?.split(',') || undefined,
    workMode: searchParams.get('workMode')?.split(',') || undefined,
    outlook: searchParams.get('outlook')?.split(',') || undefined,
    salaryMin: searchParams.get('salaryMin') ? parseInt(searchParams.get('salaryMin')!) : undefined,
    salaryMax: searchParams.get('salaryMax') ? parseInt(searchParams.get('salaryMax')!) : undefined,
  };
  const [searchTerm, setSearchTerm] = useState(initialFilters.search || '');
  const [filters, setFilters] = useState<CareerFilters>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCareers, setVisibleCareers] = useState(12);

  // Filter careers based on search and filters
  const filteredCareers = useMemo(() => {
    return careersData.filter((career: Career) => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          career.title.toLowerCase().includes(searchLower) ||
          career.summary.toLowerCase().includes(searchLower) ||
          career.industry.some((ind: string) => ind.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Industry filter
      if (filters.industry && filters.industry.length > 0) {
        const hasMatchingIndustry = career.industry.some((ind: string) => 
          filters.industry!.includes(ind)
        );
        if (!hasMatchingIndustry) return false;
      }

      // Education level filter
      if (filters.educationLevel && filters.educationLevel.length > 0) {
        const hasMatchingEducation = career.educationLevel.some((edu: string) => 
          filters.educationLevel!.includes(edu)
        );
        if (!hasMatchingEducation) return false;
      }

      // Personality type filter
      if (filters.personalityType && filters.personalityType.length > 0) {
        const hasMatchingPersonality = career.personalityType.some((personality: string) => 
          filters.personalityType!.includes(personality)
        );
        if (!hasMatchingPersonality) return false;
      }

      // Work mode filter
      if (filters.workMode && filters.workMode.length > 0) {
        if (career.workMode && !filters.workMode.includes(career.workMode)) {
          return false;
        }
      }

      // Outlook filter
      if (filters.outlook && filters.outlook.length > 0) {
        if (career.outlook && !filters.outlook.includes(career.outlook)) {
          return false;
        }
      }

      // Salary filter
      if (filters.salaryMin && career.salaryMax && career.salaryMax < filters.salaryMin) {
        return false;
      }
      if (filters.salaryMax && career.salaryMin && career.salaryMin > filters.salaryMax) {
        return false;
      }

      return true;
    });
  }, [searchTerm, filters]);

  const displayedCareers = filteredCareers.slice(0, visibleCareers);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchTerm) params.set('search', searchTerm);
    if (filters.industry?.length) params.set('industry', filters.industry.join(','));
    if (filters.educationLevel?.length) params.set('educationLevel', filters.educationLevel.join(','));
    if (filters.personalityType?.length) params.set('personalityType', filters.personalityType.join(','));
    if (filters.workMode?.length) params.set('workMode', filters.workMode.join(','));
    if (filters.outlook?.length) params.set('outlook', filters.outlook.join(','));
    if (filters.salaryMin) params.set('salaryMin', filters.salaryMin.toString());
    if (filters.salaryMax) params.set('salaryMax', filters.salaryMax.toString());

    const newUrl = params.toString() ? `/ammatit?${params.toString()}` : '/ammatit';
    window.history.replaceState({}, '', newUrl);
  }, [searchTerm, filters]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({});
    setVisibleCareers(12);
  };

  const hasActiveFilters = searchTerm || Object.values(filters).some((value: any) => 
    Array.isArray(value) ? value.length > 0 : value !== undefined
  );

  const loadMoreCareers = () => {
    setVisibleCareers(prev => Math.min(prev + 12, filteredCareers.length));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FBFF] to-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-slate-600 hover:text-slate-800 transition-colors"
            >
              Takaisin etusivulle
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-[#2563EB] mb-6">
            Urakirjasto
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Selaa 200 erilaista ammattia eri aloilta ja löydä se ura, joka tuntuu aidosti omalta.
            Suodata tuloksia kiinnostuksen, koulutustason tai työskentelytavan mukaan.
          </p>
          
          {/* Search Input */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Hae ammatteja..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 text-lg"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Filter className="h-5 w-5" />
            Suodattimet
            {hasActiveFilters && (
              <span className="bg-[#2563EB] text-white text-xs px-2 py-1 rounded-full">
                {Object.values(filters).filter((v: any) => Array.isArray(v) ? v.length > 0 : v !== undefined).length + (searchTerm ? 1 : 0)}
              </span>
            )}
            {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="max-w-6xl mx-auto mb-12">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Industry Filter */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Toimiala
                  </label>
                  <div className="space-y-2">
                    {filterOptions.industry.map((industry: string) => (
                      <label key={industry} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.industry?.includes(industry) || false}
                          onChange={(e) => {
                            const current = filters.industry || [];
                            if (e.target.checked) {
                              setFilters(prev => ({ ...prev, industry: [...current, industry] }));
                            } else {
                              setFilters(prev => ({ ...prev, industry: current.filter((i: string) => i !== industry) }));
                            }
                          }}
                          className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                        />
                        <span className="ml-2 text-sm text-slate-600">{industry}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Education Level Filter */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Koulutustaso
                  </label>
                  <div className="space-y-2">
                    {filterOptions.educationLevel.map((level: string) => (
                      <label key={level} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.educationLevel?.includes(level) || false}
                          onChange={(e) => {
                            const current = filters.educationLevel || [];
                            if (e.target.checked) {
                              setFilters(prev => ({ ...prev, educationLevel: [...current, level] }));
                            } else {
                              setFilters(prev => ({ ...prev, educationLevel: current.filter((l: string) => l !== level) }));
                            }
                          }}
                          className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                        />
                        <span className="ml-2 text-sm text-slate-600">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Personality Type Filter */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Persoonallisuustyyppi
                  </label>
                  <div className="space-y-2">
                    {filterOptions.personalityType.map((type: string) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.personalityType?.includes(type) || false}
                          onChange={(e) => {
                            const current = filters.personalityType || [];
                            if (e.target.checked) {
                              setFilters(prev => ({ ...prev, personalityType: [...current, type] }));
                            } else {
                              setFilters(prev => ({ ...prev, personalityType: current.filter((t: string) => t !== type) }));
                            }
                          }}
                          className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                        />
                        <span className="ml-2 text-sm text-slate-600">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Tyhjennä suodattimet
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="max-w-6xl mx-auto mb-8">
          <p className="text-slate-600">
            {filteredCareers.length} ammattia löytyi
            {hasActiveFilters && ' valittujen suodattimien mukaan'}
          </p>
        </div>

        {/* Career Grid */}
        <div className="max-w-6xl mx-auto">
          {displayedCareers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {displayedCareers.map((career: Career) => (
                <Link
                  key={career.slug}
                  href={`/ammatit/${career.slug}`}
                  className="group block"
                >
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:scale-[1.02] transition-all duration-300 h-full">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#2563EB] transition-colors">
                      {career.title}
                    </h3>
                    <p className="text-slate-600 mb-4 leading-relaxed">
                      {career.summary}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {career.educationLevel.slice(0, 2).map((level: string) => (
                        <span
                          key={level}
                          className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                        >
                          {level}
                        </span>
                      ))}
                      {career.salaryMin && career.salaryMax && (
                        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                          {career.salaryMin}-{career.salaryMax} €/kk
                        </span>
                      )}
                      {career.outlook && (
                        <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">
                          {career.outlook}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center text-[#2563EB] font-medium group-hover:underline">
                      Lue lisää
                      <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">
                Ei osumia näillä suodattimilla. Poista joitain suodattimia tai kokeile toista hakusanaa.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-3 bg-[#2563EB] text-white rounded-xl hover:bg-[#1D4ED8] transition-colors"
                >
                  Tyhjennä suodattimet
                </button>
              )}
            </div>
          )}

          {/* Load More Button */}
          {displayedCareers.length < filteredCareers.length && (
            <div className="text-center">
              <button
                onClick={loadMoreCareers}
                className="px-8 py-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors font-medium"
              >
                Näytä lisää ({filteredCareers.length - displayedCareers.length} jäljellä)
              </button>
            </div>
          )}
        </div>
      </section>

      {/* SEO Footer */}
      <section className="bg-slate-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-slate-600 leading-relaxed">
              CareerCompassin Urakirjasto auttaa sinua löytämään ammatin, joka sopii omiin vahvuuksiisi ja kiinnostuksiisi.
              Selaa eri alojen uria, vertaile koulutusvaihtoehtoja ja löydä oma suuntasi.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
