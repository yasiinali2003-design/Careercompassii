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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/20">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Logo */}
          <div className="mb-8">
            <Link href="/">
              <Logo className="h-12 w-auto" />
            </Link>
          </div>

          {/* Empty State */}
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Vertaile ammatteja
            </h1>
            <p className="text-slate-600 mb-8">
              Valitse ammatteja Urakirjastosta vertaillaksesi niitä rinnakkain
            </p>
            
            {/* Search */}
            <div className="max-w-md mx-auto mb-8">
              <input
                type="text"
                placeholder="Etsi ammattia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
              
              {searchTerm && (
                <div className="mt-4 bg-white border border-slate-200 rounded-xl shadow-lg max-h-96 overflow-y-auto">
                  {filteredCareers.slice(0, 10).map(career => (
                    <div
                      key={career.slug}
                      onClick={() => addCareer(career)}
                      className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                    >
                      <div className="font-medium text-slate-900">{career.title}</div>
                      <div className="text-sm text-slate-600 line-clamp-1">{career.summary}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link href="/ammatit">
              <button className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary transition-colors">
                Siirry Urakirjastoon
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-block mb-4">
            <Logo className="h-12 w-auto" />
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-slate-900">
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
                <div className="h-32 bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center">
                  <span className="font-semibold text-slate-700">Yleiskuvaus</span>
                </div>
                <div className="h-24 bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center">
                  <span className="font-semibold text-slate-700">Palkka</span>
                </div>
                <div className="h-24 bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center">
                  <span className="font-semibold text-slate-700">Työllisyysnäkymä</span>
                </div>
                <div className="h-24 bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center">
                  <span className="font-semibold text-slate-700">Koulutus</span>
                </div>
                <div className="h-32 bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center">
                  <span className="font-semibold text-slate-700">Taidot</span>
                </div>
                <div className="h-32 bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center">
                  <span className="font-semibold text-slate-700">Työskentelytapa</span>
                </div>
              </div>

              {/* Career Columns */}
              {comparisons.map((career, index) => (
                <div key={career.slug} className="space-y-4">
                  <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 relative">
                    <button
                      onClick={() => removeCareer(career.slug)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <h2 className="text-xl font-bold text-slate-900 pr-8">{career.title}</h2>
                    <Link
                      href={`/ammatit/${encodeURIComponent(career.slug)}`}
                      className="text-sm text-primary hover:underline mt-2 inline-block"
                    >
                      Näytä lisää →
                    </Link>
                  </div>

                  {/* Yleiskuvaus */}
                  <div className="h-32 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <p className="text-sm text-slate-600 line-clamp-4">{career.summary}</p>
                  </div>

                  {/* Palkka */}
                  <div className="h-24 bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center">
                    <span className="text-lg font-bold text-slate-900">
                      {career.salaryMin}-{career.salaryMax} €/kk
                    </span>
                  </div>

                  {/* Työllisyysnäkymä */}
                  <div className="h-24 bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      career.outlook === 'Kasvaa' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-primary/10 text-primary'
                    }`}>
                      {career.outlook}
                    </span>
                  </div>

                  {/* Koulutus */}
                  <div className="h-24 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <div className="flex flex-wrap gap-2">
                      {career.educationLevel.slice(0, 2).map((level, i) => (
                        <span key={i} className="px-2 py-1 bg-secondary/20 text-secondary rounded text-xs">
                          {level}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Taidot */}
                  <div className="h-32 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <div className="flex flex-wrap gap-2">
                      {career.skillsHard?.slice(0, 4).map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Työskentelytapa */}
                  <div className="h-32 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {career.workMode}
                    </span>
                  </div>
                </div>
              ))}

              {/* Add More Column */}
              {comparisons.length < 5 && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-slate-50 to-teal-50/20 rounded-xl shadow-sm border-2 border-dashed border-blue-300 p-6 flex items-center justify-center min-h-[200px]">
                    <div className="text-center">
                      <Plus className="h-12 w-12 text-primary mx-auto mb-3" />
                      <p className="text-sm text-slate-600 mb-3">Lisää ammatti</p>
                      <input
                        type="text"
                        placeholder="Etsi..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-2"
                      />
                      {searchTerm && (
                        <div className="bg-white border border-slate-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                          {filteredCareers.slice(0, 5).map(career => (
                            <div
                              key={career.slug}
                              onClick={() => addCareer(career)}
                              className="p-2 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                            >
                              <div className="text-sm font-medium text-slate-900">{career.title}</div>
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

