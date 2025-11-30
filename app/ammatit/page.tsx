"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, ChevronRight, X, ChevronDown } from 'lucide-react';
import { careersData as careersFI, CareerFI } from '@/data/careers-fi';
import { Career, CareerFilters, WorkMode, Outlook } from '@/lib/types';
import ScrollNav from '@/components/ScrollNav';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import LightRays from '@/components/LightRays';

const convertCareerFIToCareer = (careerFI: CareerFI): Career => ({
  slug: careerFI.id,
  title: careerFI.title_fi,
  summary: careerFI.short_description,
  longDescription: careerFI.main_tasks?.join(' • ') || careerFI.short_description,
  salaryMin: careerFI.salary_eur_month?.range?.[0],
  salaryMax: careerFI.salary_eur_month?.range?.[1],
  outlook: careerFI.job_outlook?.status === 'kasvaa' ? 'Kasvaa' : 'Vakaa',
  educationLevel: careerFI.education_paths || [],
  industry: careerFI.category ? [careerFI.category] : [],
  personalityType: careerFI.category ? [careerFI.category] : [],
  workMode:
    careerFI.work_conditions?.remote === 'Kyllä'
      ? 'Etä'
      : careerFI.work_conditions?.remote === 'Osittain'
      ? 'Hybrid'
      : 'Paikan päällä',
  skillsHard: careerFI.tools_tech || [],
  skillsSoft: careerFI.core_skills || [],
  dailyTasks: careerFI.main_tasks || [],
  opintopolkuLinks: Array.isArray(careerFI.useful_links)
    ? careerFI.useful_links
        .filter((link) => link?.name && link?.url)
        .map((link) => ({
          label: link.name,
          url: link.url
        }))
    : [],
  relatedSlugs: Array.isArray(careerFI.related_careers) ? careerFI.related_careers : []
});

const careersData: Career[] = careersFI
  .filter((career): career is CareerFI => Boolean(career && career.id))
  .map(convertCareerFIToCareer);

const totalCareerCount = careersData.length;

const filterOptions = {
  industry: Array.from(new Set(careersData.flatMap((c) => c.industry || []))).filter(Boolean).sort(),
  educationLevel: Array.from(new Set(careersData.flatMap((c) => c.educationLevel || []))).filter(Boolean).sort(),
  personalityType: Array.from(new Set(careersData.flatMap((c) => c.personalityType || []))).filter(Boolean).sort(),
  workMode: Array.from(
    new Set(
      careersData
        .map((c) => c.workMode)
        .filter((mode): mode is WorkMode => Boolean(mode))
    )
  ).sort(),
  outlook: Array.from(
    new Set(
      careersData
        .map((c) => c.outlook)
        .filter((status): status is Outlook => Boolean(status))
    )
  ).sort()
};

export default function CareerCatalog() {
  const searchParams = useSearchParams();
  
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
  const [visibleCareers, setVisibleCareers] = useState(24);

  // Filter careers based on search and filters
  const filteredCareers = useMemo(() => {
    return careersData.filter((career: Career) => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          career.title.toLowerCase().includes(searchLower) ||
          career.summary.toLowerCase().includes(searchLower) ||
          career.industry.some((ind: string) => ind.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      if (filters.industry && filters.industry.length > 0) {
        const hasMatchingIndustry = career.industry.some((ind: string) => 
          filters.industry!.includes(ind)
        );
        if (!hasMatchingIndustry) return false;
      }

      if (filters.educationLevel && filters.educationLevel.length > 0) {
        const hasMatchingEducation = career.educationLevel.some((edu: string) => 
          filters.educationLevel!.includes(edu)
        );
        if (!hasMatchingEducation) return false;
      }

      if (filters.personalityType && filters.personalityType.length > 0) {
        const hasMatchingPersonality = career.personalityType.some((personality: string) => 
          filters.personalityType!.includes(personality)
        );
        if (!hasMatchingPersonality) return false;
      }

      if (filters.workMode && filters.workMode.length > 0) {
        if (career.workMode && !filters.workMode.includes(career.workMode)) {
          return false;
        }
      }

      if (filters.outlook && filters.outlook.length > 0) {
        if (career.outlook && !filters.outlook.includes(career.outlook)) {
          return false;
        }
      }

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
    setVisibleCareers(24);
  };

  const hasActiveFilters = searchTerm || Object.values(filters).some((value: any) => 
    Array.isArray(value) ? value.length > 0 : value !== undefined
  );

  const loadMoreCareers = () => {
    setVisibleCareers(prev => Math.min(prev + 24, filteredCareers.length));
  };

  return (
    <div className="min-h-screen bg-transparent relative">
      <ScrollNav />

      {/* Full-page LightRays Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#22c1c3"
          raysSpeed={0.8}
          lightSpread={0.9}
          rayLength={1.4}
          followMouse={true}
          mouseInfluence={0.15}
          noiseAmount={0.07}
          distortion={0.03}
          saturation={1.0}
          fadeDistance={1.0}
          className="custom-rays"
        />
      </div>
      
      {/* Gradient Overlay - subtle blend with rays */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#020817]/60 via-[#020817]/30 to-[#020817]/70 pointer-events-none z-0" />

      {/* Content Wrapper */}
      <div className="relative z-10">
        {/* Hero Section */}
        <AnimatedSection className="max-w-7xl mx-auto px-6 py-16 md:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            Urakirjasto
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Selaa {totalCareerCount} erilaista ammattia eri aloilta ja löydä se ura, joka tuntuu aidosti omalta.
          </p>
          
          {/* Search Input */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Hae ammatteja..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[#11161f] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-urak-accent-blue/50 text-base text-white placeholder:text-gray-500"
            />
          </div>

          {/* Filter Row */}
          <div className="max-w-6xl mx-auto px-6 mt-6">
            <div className="flex flex-wrap items-center gap-3">
              {/* Ala Dropdown */}
              <div className="relative">
                <select
                  value={filters.industry?.[0] || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFilters(prev => ({ 
                      ...prev, 
                      industry: value ? [value] : undefined 
                    }));
                  }}
                  className="bg-[#11161f] border border-white/10 rounded-full px-4 py-2 pr-8 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-urak-accent-blue appearance-none transition-colors hover:border-white/20 cursor-pointer"
                  aria-label="Valitse toimiala"
                >
                  <option value="">Kaikki alat</option>
                  {filterOptions.industry.map((industry: string) => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-gray-400">
                  <ChevronDown className="h-3 w-3" />
                </span>
              </div>

              {/* Koulutustaso Dropdown */}
              <div className="relative">
                <select
                  value={filters.educationLevel?.[0] || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFilters(prev => ({ 
                      ...prev, 
                      educationLevel: value ? [value] : undefined 
                    }));
                  }}
                  className="bg-[#11161f] border border-white/10 rounded-full px-4 py-2 pr-8 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-urak-accent-blue appearance-none transition-colors hover:border-white/20 cursor-pointer"
                  aria-label="Valitse koulutustaso"
                >
                  <option value="">Kaikki koulutustasot</option>
                  {filterOptions.educationLevel.map((level: string) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-gray-400">
                  <ChevronDown className="h-3 w-3" />
                </span>
              </div>

              {/* Persoonallisuustyypit Dropdown */}
              <div className="relative">
                <select
                  value={filters.personalityType?.[0] || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFilters(prev => ({ 
                      ...prev, 
                      personalityType: value ? [value] : undefined 
                    }));
                  }}
                  className="bg-[#11161f] border border-white/10 rounded-full px-4 py-2 pr-8 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-urak-accent-blue appearance-none transition-colors hover:border-white/20 cursor-pointer"
                  aria-label="Valitse persoonallisuustyyppi"
                >
                  <option value="">Kaikki tyypit</option>
                  {filterOptions.personalityType.map((type: string) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-gray-400">
                  <ChevronDown className="h-3 w-3" />
                </span>
              </div>

              {/* Työllisyysnäkymä Dropdown */}
              <div className="relative">
                <select
                  value={filters.outlook?.[0] || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFilters(prev => ({ 
                      ...prev, 
                      outlook: value ? [value] : undefined 
                    }));
                  }}
                  className="bg-[#11161f] border border-white/10 rounded-full px-4 py-2 pr-8 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-urak-accent-blue appearance-none transition-colors hover:border-white/20 cursor-pointer"
                  aria-label="Valitse työllisyysnäkymä"
                >
                  <option value="">Kaikki näkymät</option>
                  {filterOptions.outlook.map((outlook: string) => (
                    <option key={outlook} value={outlook}>{outlook}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-gray-400">
                  <ChevronDown className="h-3 w-3" />
                </span>
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                  aria-label="Tyhjennä suodattimet"
                >
                  <X className="h-4 w-4" />
                  Tyhjennä
                </button>
              )}
            </div>

            {/* Result Count */}
            <p className="mt-4 text-sm text-gray-400 text-center">
              {filteredCareers.length} ammattia löytyi
              {hasActiveFilters && ' valittujen suodattimien mukaan'}
            </p>
          </div>
        </div>

        {/* Career Grid */}
        <div className="max-w-7xl mx-auto">
          {displayedCareers.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                {displayedCareers.map((career: Career, index: number) => (
                  <AnimatedCard
                    key={career.slug}
                    delay={index * 0.05}
                    className="bg-[#11161f] rounded-xl ring-1 ring-white/5 p-5 hover:bg-white/[0.03]"
                  >
                    <Link href={`/ammatit/${encodeURIComponent(career.slug)}`} className="block group">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-urak-accent-blue transition-colors">
                        {career.title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-4 leading-relaxed line-clamp-2">
                        {career.summary}
                      </p>

                      {/* Tag Pills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {career.industry.slice(0, 1).map((industry: string) => (
                          <span
                            key={industry}
                            className="text-xs bg-white/5 text-urak-text-secondary rounded-full px-2 py-1"
                          >
                            {industry}
                          </span>
                        ))}
                        {career.educationLevel.slice(0, 1).map((level: string) => (
                          <span
                            key={level}
                            className="text-xs bg-white/5 text-urak-text-secondary rounded-full px-2 py-1"
                          >
                            {level}
                          </span>
                        ))}
                        {career.outlook && (
                          <span className="text-xs bg-white/5 text-urak-text-secondary rounded-full px-2 py-1">
                            {career.outlook}
                          </span>
                        )}
                      </div>

                      {/* Link */}
                      <div className="flex items-center text-sm text-urak-accent-blue font-medium group-hover:underline">
                        Katso ammatti
                        <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </AnimatedCard>
                ))}
              </div>

              {/* Load More Button */}
              {displayedCareers.length < filteredCareers.length && (
                <div className="text-center">
                  <button
                    onClick={loadMoreCareers}
                    className="px-6 py-3 bg-[#11161f] border border-white/10 rounded-xl hover:bg-white/[0.03] hover:border-white/20 transition-all text-white font-medium"
                  >
                    Näytä lisää ({filteredCareers.length - displayedCareers.length} jäljellä)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg mb-4">
                Ei osumia näillä suodattimilla.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-[#11161f] border border-white/10 rounded-xl hover:bg-white/[0.03] transition-all text-white font-medium"
                >
                  Tyhjennä suodattimet
                </button>
              )}
            </div>
          )}
        </div>
      </AnimatedSection>
      </div>
    </div>
  );
}
