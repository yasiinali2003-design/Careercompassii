"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, ChevronRight, X, ChevronDown } from 'lucide-react';
import { careersData as careersFI, CareerFI } from '@/data/careers-fi';
import { Career, CareerFilters, WorkMode, Outlook } from '@/lib/types';
import ScrollNav from '@/components/ScrollNav';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import LightRays from '@/components/LightRays';
import { categories } from '@/lib/categories';

// Helper to get Finnish category name from slug
const getCategoryLabel = (slug: string): string => {
  return categories[slug]?.name_fi || slug.charAt(0).toUpperCase() + slug.slice(1);
};

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
  .filter((career): career is CareerFI => {
    // Filter out careers with missing or empty id/title_fi
    if (!career || !career.id || !career.title_fi) return false;
    if (typeof career.id !== 'string' || typeof career.title_fi !== 'string') return false;
    if (career.id.trim().length === 0 || career.title_fi.trim().length === 0) return false;
    return true;
  })
  .map(convertCareerFIToCareer)
  .filter((career): career is Career => {
    // Filter out careers with missing or empty title/slug after conversion
    if (!career || !career.title || !career.slug) return false;
    if (typeof career.title !== 'string' || typeof career.slug !== 'string') return false;
    if (career.title.trim().length === 0 || career.slug.trim().length === 0) return false;
    return true;
  });

// Source data has over 600 Finnish careers
const totalCareerCount = 'yli 600 erilaista suomalaista';

// Simplified education level categories for the dropdown
const EDUCATION_CATEGORIES = [
  { value: 'peruskoulu', label: 'Peruskoulu', keywords: ['peruskoulu', 'perusaste'] },
  { value: 'ammatillinen', label: 'Ammatillinen koulutus', keywords: ['ammattitutkinto', 'ammatillinen', 'ammattikoulutus', 'oppisopimus'] },
  { value: 'lukio', label: 'Lukio', keywords: ['lukio', 'ylioppilastutkinto'] },
  { value: 'amk', label: 'AMK-tutkinto', keywords: ['amk', 'ammattikorkeakoulu'] },
  { value: 'yliopisto', label: 'Yliopisto', keywords: ['yliopisto', 'kandidaatti', 'maisteri', 'tohtori', 'di'] },
  { value: 'erikoistuminen', label: 'Erikoistumiskoulutus', keywords: ['erikoistumis', 'erikoisammatti', 'jatkokoulutus'] },
];

// Function to map detailed education path to simplified category
function getEducationCategory(educationPath: string): string | null {
  const lowerPath = educationPath.toLowerCase();
  for (const cat of EDUCATION_CATEGORIES) {
    if (cat.keywords.some(keyword => lowerPath.includes(keyword))) {
      return cat.value;
    }
  }
  return null;
}

// Function to check if a career matches an education category
function careerMatchesEducationCategory(career: typeof careersData[0], categoryValue: string): boolean {
  const educationPaths = career.educationLevel || [];
  const category = EDUCATION_CATEGORIES.find(c => c.value === categoryValue);
  if (!category) return false;

  return educationPaths.some(path => {
    const lowerPath = path.toLowerCase();
    return category.keywords.some(keyword => lowerPath.includes(keyword));
  });
}

// Define the correct order for category filters (matches homepage)
const CATEGORY_ORDER = [
  'luova',
  'johtaja', 
  'innovoija',
  'rakentaja',
  'auttaja',
  'ympariston-puolustaja',
  'visionaari',
  'jarjestaja'
];

const filterOptions = {
  industry: CATEGORY_ORDER.filter(cat => 
    careersData.some(c => c.industry?.includes(cat))
  ),
  educationLevel: EDUCATION_CATEGORIES, // Use simplified categories
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
    salaryMin: searchParams.get('salaryMin') ? parseInt(searchParams.get('salaryMin')!, 10) : undefined,
    salaryMax: searchParams.get('salaryMax') ? parseInt(searchParams.get('salaryMax')!, 10) : undefined,
  };
  
  const [searchTerm, setSearchTerm] = useState(initialFilters.search || '');
  const [filters, setFilters] = useState<CareerFilters>(initialFilters);
  const [visibleCareers, setVisibleCareers] = useState(24);
  
  // Debounce search for better performance
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setVisibleCareers(24); // Reset pagination when search changes
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter careers based on search and filters (use debounced search)
  const filteredCareers = useMemo(() => {
    return careersData.filter((career: Career) => {
      // Skip invalid careers
      if (!career || !career.title) return false;
      
      if (debouncedSearchTerm) {
        const searchLower = debouncedSearchTerm.toLowerCase();
        const matchesSearch = 
          (career.title?.toLowerCase() || '').includes(searchLower) ||
          (career.summary?.toLowerCase() || '').includes(searchLower) ||
          (career.industry || []).some((ind: string) => (ind?.toLowerCase() || '').includes(searchLower));
        if (!matchesSearch) return false;
      }

      if (filters.industry && filters.industry.length > 0) {
        const hasMatchingIndustry = (career.industry || []).some((ind: string) => 
          filters.industry!.includes(ind)
        );
        if (!hasMatchingIndustry) return false;
      }

      if (filters.educationLevel && filters.educationLevel.length > 0) {
        // Use keyword-based category matching for simplified dropdown
        const hasMatchingEducation = filters.educationLevel.some((categoryValue: string) =>
          careerMatchesEducationCategory(career, categoryValue)
        );
        if (!hasMatchingEducation) return false;
      }

      if (filters.personalityType && filters.personalityType.length > 0) {
        const hasMatchingPersonality = (career.personalityType || []).some((personality: string) => 
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
  }, [debouncedSearchTerm, filters]);

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
            Selaa {totalCareerCount} ammattia eri aloilta ja löydä se ura, joka tuntuu aidosti omalta.
          </p>
          
          {/* Search Input */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <label htmlFor="career-search" className="sr-only">Hae ammatteja</label>
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" aria-hidden="true" />
            <input
              id="career-search"
              type="text"
              placeholder="Hae ammatteja..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-urak-surface border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-urak-accent-blue/50 text-base text-white placeholder:text-slate-400"
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
                  className="bg-urak-surface border border-white/10 rounded-full px-4 py-2 pr-8 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-urak-accent-blue appearance-none transition-colors hover:border-white/20 cursor-pointer"
                  aria-label="Valitse toimiala"
                >
                  <option value="">Kaikki alat</option>
                  {filterOptions.industry.map((industry: string) => (
                    <option key={industry} value={industry}>{getCategoryLabel(industry)}</option>
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
                  className="bg-urak-surface border border-white/10 rounded-full px-4 py-2 pr-8 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-urak-accent-blue appearance-none transition-colors hover:border-white/20 cursor-pointer"
                  aria-label="Valitse koulutustaso"
                >
                  <option value="">Kaikki koulutustasot</option>
                  {filterOptions.educationLevel.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
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
                  className="bg-urak-surface border border-white/10 rounded-full px-4 py-2 pr-8 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-urak-accent-blue appearance-none transition-colors hover:border-white/20 cursor-pointer"
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
                  className="bg-urak-surface border border-white/10 rounded-full px-4 py-2 pr-8 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-urak-accent-blue appearance-none transition-colors hover:border-white/20 cursor-pointer"
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
              {hasActiveFilters
                ? `Ammatteja löytyi valittujen suodattimien mukaan`
                : `Selaa satoja ammatteja`}
            </p>
          </div>
        </div>

        {/* Career Grid */}
        <div className="max-w-7xl mx-auto">
          {displayedCareers.length > 0 ? (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-12">
                {displayedCareers.map((career: Career, index: number) => {
                  // Collect all tags for display
                  const tags = [
                    ...(career.industry || []).slice(0, 1),
                    ...(career.educationLevel || []).slice(0, 1),
                    ...(career.outlook ? [career.outlook] : [])
                  ].filter(Boolean);

                  return (
                    <div
                      key={career.slug}
                      className="group relative overflow-hidden rounded-2xl md:rounded-3xl border border-white/5 bg-white/5 bg-gradient-to-b from-white/[0.05] to-white/0 backdrop-blur-xl px-3 py-4 md:px-6 md:py-6 shadow-[0_18px_50px_rgba(0,0,0,0.45)] hover:bg-white/[0.08] hover:border-white/10 hover:shadow-[0_26px_60px_rgba(0,0,0,0.7)] transition-all duration-300 ease-out hover:-translate-y-1"
                    >
                      {/* Hover Glow */}
                      <div className="absolute top-0 right-0 h-32 w-32 bg-urak-accent-blue/15 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <Link 
                        href={`/ammatit/${encodeURIComponent(career.slug)}`} 
                        className="block h-full flex flex-col relative z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-urak-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-urak-bg rounded-3xl"
                      >
                        {/* Title */}
                        <h3 className="text-sm md:text-lg font-semibold text-urak-text-primary mb-2 md:mb-3 group-hover:text-white transition-colors">
                          {career.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs md:text-sm text-urak-text-secondary leading-relaxed mb-3 md:mb-4 line-clamp-2 md:line-clamp-3 flex-1">
                          {career.summary}
                        </p>

                        {/* Quick Info Row */}
                        <div className="mb-2 md:mb-4 space-y-1 md:space-y-2">
                          {/* Salary */}
                          {career.salaryMin && career.salaryMax && (
                            <div className="flex items-center gap-1 md:gap-2 text-[10px] md:text-xs text-urak-text-muted">
                              <span className="font-medium text-urak-text-secondary">Palkka:</span>
                              <span>{career.salaryMin}€–{career.salaryMax}€</span>
                            </div>
                          )}

                          {/* Education Level */}
                          {career.educationLevel && career.educationLevel.length > 0 && (
                            <div className="flex items-center gap-1 md:gap-2 text-[10px] md:text-xs text-urak-text-muted">
                              <span className="font-medium text-urak-text-secondary">Koulutus:</span>
                              <span className="truncate">{career.educationLevel[0]}</span>
                            </div>
                          )}

                          {/* Outlook */}
                          {career.outlook && (
                            <div className="flex items-center gap-1 md:gap-2 text-[10px] md:text-xs">
                              <span className="font-medium text-urak-text-secondary">Työllisyys:</span>
                              <span className={`${career.outlook === 'Kasvaa' ? 'text-urak-accent-green' : 'text-urak-text-muted'}`}>
                                {career.outlook}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Tag Pills */}
                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 md:gap-2 mb-2 md:mb-4">
                            {tags.slice(0, 2).map((tag: string, tagIndex: number) => (
                              <span
                                key={`${tag}-${tagIndex}`}
                                className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-medium text-urak-text-secondary truncate max-w-[80px] md:max-w-none"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* CTA Section */}
                        <div className="mt-auto pt-2 md:pt-4 border-t border-white/10 flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 md:gap-1.5 text-xs md:text-sm font-medium text-urak-accent-blue group-hover:text-urak-accent-blue/90 transition-colors">
                            Katso
                            <ChevronRight className="h-3 w-3 md:h-4 md:w-4 inline-block translate-x-0 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Load More Button */}
              {displayedCareers.length < filteredCareers.length && (
                <div className="text-center">
                  <button
                    onClick={loadMoreCareers}
                    className="px-6 py-3 bg-urak-surface border border-white/10 rounded-xl hover:bg-white/[0.03] hover:border-white/20 transition-all text-white font-medium"
                  >
                    Näytä lisää ammatteja
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
                  className="px-6 py-3 bg-urak-surface border border-white/10 rounded-xl hover:bg-white/[0.03] transition-all text-white font-medium"
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
