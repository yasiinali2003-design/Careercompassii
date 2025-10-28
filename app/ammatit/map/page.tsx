"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, TrendingUp, Users, Briefcase } from 'lucide-react';
import { careersData as careersFI } from '@/data/careers-fi';
import { Career } from '@/lib/types';
import Logo from '@/components/Logo';

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

const allCareers = careersFI.filter(c => c && c.id).map(convertCareerFIToCareer);

function getRelatedCareers(career: Career, limit: number = 8): Career[] {
  const careerFI = careersFI.find(c => c && c.id === career.slug);
  if (!careerFI) return [];
  
  return careersFI
    .filter(c => c && c.category === careerFI.category && c.id !== careerFI.id)
    .slice(0, limit)
    .map(convertCareerFIToCareer);
}

export default function CareerMapPage() {
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const relatedCareers = selectedCareer ? getRelatedCareers(selectedCareer) : [];
  
  const filteredCareers = allCareers.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-block mb-4">
            <Logo className="h-12 w-auto" />
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                📍 Ammattikartta
              </h1>
              <p className="text-slate-600">
                Tutustu ammattien välisiin yhteyksiin ja löydä uusia polkuja
              </p>
            </div>
            <Link href="/ammatit">
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                <ArrowLeft className="h-5 w-5" />
                Takaisin
              </button>
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Etsi ammattia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {!selectedCareer ? (
          /* Career Selection */
          <div className="grid md:grid-cols-3 gap-4">
            {filteredCareers.slice(0, 18).map(career => (
              <button
                key={career.slug}
                onClick={() => setSelectedCareer(career)}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 text-left hover:shadow-md transition-all hover:border-blue-500"
              >
                <h3 className="font-bold text-slate-900 mb-2">{career.title}</h3>
                <p className="text-sm text-slate-600 line-clamp-2">{career.summary}</p>
              </button>
            ))}
          </div>
        ) : (
          /* Map View */
          <div className="space-y-8">
            {/* Selected Career (Center) */}
            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 max-w-2xl text-white">
                <h2 className="text-3xl font-bold mb-4">{selectedCareer.title}</h2>
                <p className="text-blue-100 mb-6">{selectedCareer.summary}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  {selectedCareer.salaryMin && selectedCareer.salaryMax && (
                    <div className="bg-white/20 rounded-lg px-4 py-2">
                      {selectedCareer.salaryMin}-{selectedCareer.salaryMax}€/kk
                    </div>
                  )}
                  <div className={`rounded-lg px-4 py-2 ${
                    selectedCareer.outlook === 'Kasvaa' ? 'bg-green-500/30' : 'bg-blue-500/30'
                  }`}>
                    {selectedCareer.outlook}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCareer(null)}
                  className="mt-6 text-blue-100 hover:text-white underline"
                >
                  Valitse toinen ammatti
                </button>
              </div>
            </div>

            {/* Related Careers (Around it) */}
            {relatedCareers.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                  Liittyvät ammatit
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {relatedCareers.map(related => (
                    <Link
                      key={related.slug}
                      href={`/ammatit/${related.slug}`}
                      className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-lg hover:border-blue-500 transition-all"
                    >
                      <h4 className="font-bold text-slate-900 mb-2">{related.title}</h4>
                      <p className="text-sm text-slate-600 line-clamp-2 mb-3">{related.summary}</p>
                      <div className="text-sm text-blue-600">
                        Näytä lisää →
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

