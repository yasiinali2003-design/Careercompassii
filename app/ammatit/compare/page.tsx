"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, X, Plus, TrendingUp } from 'lucide-react';
import { careersData as careersFI } from '@/data/careers-fi';
import { Career } from '@/lib/types';
import Logo from '@/components/Logo';

// Force dynamic rendering to avoid build-time errors with window/localStorage
export const dynamic = 'force-dynamic';
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

const allCareers = careersFI
  .filter(c => c && c.id && c.title_fi)
  .map(convertCareerFIToCareer);

export default function ComparePage() {
  const [comparisons, setComparisons] = useState<Career[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load from URL params or localStorage
    const params = new URLSearchParams(window.location.search);
    const slugs = params.getAll('careers');
    
    if (slugs.length > 0) {
      const careers = slugs
        .map(slug => {
          // Decode URL-encoded slugs
          const decodedSlug = decodeURIComponent(slug);
          return allCareers.find(c => c.slug === decodedSlug);
        })
        .filter((c): c is Career => c !== undefined);
      setComparisons(careers);
    } else {
      const saved = localStorage.getItem('compareCareers');
      if (saved) {
        try {
          const slugs = JSON.parse(saved);
          const careers = slugs
            .map((slug: string) => allCareers.find(c => c.slug === slug))
            .filter((c: Career | undefined): c is Career => c !== undefined);
          setComparisons(careers);
        } catch (e) {
          console.error('Error loading saved comparisons', e);
        }
      }
    }
  }, []);

  const addCareer = (career: Career) => {
    if (comparisons.length >= 5) {
      alert('Voit vertailla enintään 5 ammattia kerrallaan');
      return;
    }
    if (comparisons.find(c => c.slug === career.slug)) {
      alert('Tämä ammatti on jo vertailussa');
      return;
    }
    setComparisons([...comparisons, career]);
  };

  const removeCareer = (slug: string) => {
    setComparisons(comparisons.filter(c => c.slug !== slug));
  };

  const filteredCareers = allCareers.filter(c =>
    c.title && c.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !comparisons.find(comp => comp.slug === c.slug)
  );

  if (comparisons.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Logo */}
          <div className="mb-8">
            <Link href="/">
              <Logo className="h-12 w-auto" />
            </Link>
          </div>

          {/* Empty State */}
          <div className="bg-[#1a1d23] rounded-2xl shadow-lg border border-white/10 p-12 text-center border border-white/10">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-white mb-3">
                  Vertaile ammatteja
                </h1>
                <p className="text-lg text-neutral-300 mb-6">
                  Vertaile palkkoja, työnäkymiä ja koulutuspolkuja rinnakkain
                </p>
              </div>

              {/* Search */}
              <div className="mb-8">
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Etsi ammattia nimellä..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                {searchTerm && filteredCareers.length > 0 && (
                  <div className="mt-4 bg-[#1a1d23]/80 border border-white/10 rounded-xl shadow-lg max-h-96 overflow-y-auto text-left">
                    {filteredCareers.slice(0, 10).map(career => (
                      <div
                        key={career.slug}
                        onClick={() => addCareer(career)}
                        className="p-4 hover:bg-white/5 cursor-pointer border-b border-white/10 last:border-b-0 transition-colors"
                      >
                        <div className="font-semibold text-white mb-1">{career.title}</div>
                        <div className="text-sm text-neutral-300 line-clamp-2">{career.summary}</div>
                      </div>
                    ))}
                  </div>
                )}

                {searchTerm && filteredCareers.length === 0 && (
                  <div className="mt-4 p-4 bg-[#1a1d23]/50 rounded-xl border border-white/10">
                    <p className="text-neutral-300">Ei hakutuloksia haulle &ldquo;{searchTerm}&rdquo;</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-sm text-neutral-300 mb-4">Tai selaa koko urakirjastoa</p>
                <Link href="/ammatit">
                  <button className="bg-primary text-white px-8 py-3 rounded-xl hover:bg-primary/90 transition-all shadow-sm hover:shadow-md font-medium">
                    Siirry Urakirjastoon
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-block mb-4">
            <Logo className="h-12 w-auto" />
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-white">
              Vertaile ammatteja ({comparisons.length})
            </h1>
            <Link href="/ammatit">
              <button className="flex items-center gap-2 text-primary hover:text-primary">
                <ArrowLeft className="h-5 w-5" />
                Takaisin
              </button>
            </Link>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${comparisons.length + 1}, minmax(300px, 1fr))` }}>
              {/* First Column - Labels */}
              <div className="space-y-4">
                <div className="h-20"></div>
                <div className="h-32 bg-[#1a1d23]/60 rounded-xl shadow-sm border border-white/10 p-4 flex items-center">
                  <span className="font-semibold text-slate-700">Yleiskuvaus</span>
                </div>
                <div className="h-24 bg-[#1a1d23]/60 rounded-xl shadow-sm border border-white/10 p-4 flex items-center">
                  <span className="font-semibold text-slate-700">Palkka</span>
                </div>
                <div className="h-24 bg-[#1a1d23]/60 rounded-xl shadow-sm border border-white/10 p-4 flex items-center">
                  <span className="font-semibold text-slate-700">Työllisyysnäkymä</span>
                </div>
                <div className="h-24 bg-[#1a1d23]/60 rounded-xl shadow-sm border border-white/10 p-4 flex items-center">
                  <span className="font-semibold text-slate-700">Koulutus</span>
                </div>
                <div className="h-32 bg-[#1a1d23]/60 rounded-xl shadow-sm border border-white/10 p-4 flex items-center">
                  <span className="font-semibold text-slate-700">Taidot</span>
                </div>
                <div className="h-32 bg-[#1a1d23]/60 rounded-xl shadow-sm border border-white/10 p-4 flex items-center">
                  <span className="font-semibold text-slate-700">Työskentelytapa</span>
                </div>
              </div>

              {/* Career Columns */}
              {comparisons.map((career, index) => (
                <div key={career.slug} className="space-y-4">
                  <div className="bg-[#1a1d23] rounded-xl shadow-lg border border-white/10 border border-white/10 p-6 relative">
                    <button
                      onClick={() => removeCareer(career.slug)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <h2 className="text-xl font-bold text-white pr-8">{career.title}</h2>
                    <Link
                      href={`/ammatit/${encodeURIComponent(career.slug)}`}
                      className="text-sm text-primary hover:underline mt-2 inline-block"
                    >
                      Näytä lisää →
                    </Link>
                  </div>

                  {/* Yleiskuvaus */}
                  <div className="h-32 bg-[#1a1d23]/60 rounded-xl shadow-sm border border-white/10 p-4">
                    <p className="text-sm text-neutral-300 line-clamp-4">{career.summary}</p>
                  </div>

                  {/* Palkka */}
                  <div className="h-24 bg-[#1a1d23]/60 rounded-xl shadow-sm border border-white/10 p-4 flex items-center">
                    <span className="text-lg font-bold text-white">
                      {career.salaryMin}-{career.salaryMax} €/kk
                    </span>
                  </div>

                  {/* Työllisyysnäkymä */}
                  <div className="h-24 bg-[#1a1d23]/60 rounded-xl shadow-sm border border-white/10 p-4 flex items-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      career.outlook === 'Kasvaa' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-primary/10 text-primary'
                    }`}>
                      {career.outlook}
                    </span>
                  </div>

                  {/* Koulutus */}
                  <div className="h-24 bg-[#1a1d23]/60 rounded-xl shadow-sm border border-white/10 p-4">
                    <div className="flex flex-wrap gap-2">
                      {career.educationLevel.slice(0, 2).map((level, i) => (
                        <span key={i} className="px-2 py-1 bg-secondary/20 text-secondary rounded text-xs">
                          {level}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Taidot */}
                  <div className="h-32 bg-[#1a1d23]/60 rounded-xl shadow-sm border border-white/10 p-4">
                    <div className="flex flex-wrap gap-2">
                      {career.skillsHard?.slice(0, 4).map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Työskentelytapa */}
                  <div className="h-32 bg-[#1a1d23]/60 rounded-xl shadow-sm border border-white/10 p-4">
                    <span className="px-3 py-1 bg-neutral-800/30 text-neutral-200 rounded-full text-sm">
                      {career.workMode}
                    </span>
                  </div>
                </div>
              ))}

              {/* Add More Column */}
              {comparisons.length < 5 && (
                <div className="space-y-4">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-sm border-2 border-dashed border-white/20 p-6 flex items-center justify-center min-h-[200px]">
                    <div className="text-center">
                      <Plus className="h-12 w-12 text-primary mx-auto mb-3" />
                      <p className="text-sm text-neutral-300 mb-3">Lisää ammatti</p>
                      <input
                        type="text"
                        placeholder="Etsi..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-2"
                      />
                      {searchTerm && (
                        <div className="bg-[#1a1d23]/80 border border-white/10 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                          {filteredCareers.slice(0, 5).map(career => (
                            <div
                              key={career.slug}
                              onClick={() => addCareer(career)}
                              className="p-2 hover:bg-white/5 cursor-pointer border-b border-white/10 last:border-b-0"
                            >
                              <div className="text-sm font-medium text-white">{career.title}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

