"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, GraduationCap, TrendingUp, Users, MapPin } from 'lucide-react';
import { getCareerBySlug, getRelatedCareers } from '@/data/careers-catalog';
import { Career } from '@/lib/types';
import Logo from '@/components/Logo';

interface CareerDetailProps {
  params: {
    slug: string;
  };
}

export default function CareerDetail({ params }: CareerDetailProps) {
  const career = getCareerBySlug(params.slug);
  const relatedCareers = career ? getRelatedCareers(career) : [];

  if (!career) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8FBFF] to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Ammattia ei löytynyt</h1>
          <Link
            href="/ammatit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white rounded-xl hover:bg-[#1D4ED8] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Takaisin Urakirjastoon
          </Link>
        </div>
      </div>
    );
  }

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
              href="/ammatit"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Takaisin Urakirjastoon
            </Link>
            <Link
              href="/"
              className="text-sm text-slate-600 hover:text-slate-800 transition-colors"
            >
              Etusivu
            </Link>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-6">
        <nav className="text-sm text-slate-600">
          <Link href="/" className="hover:text-slate-800">Etusivu</Link>
          <span className="mx-2">›</span>
          <Link href="/ammatit" className="hover:text-slate-800">Urakirjasto</Link>
          {career.personalityType.length > 0 && (
            <>
              <span className="mx-2">›</span>
              <Link 
                href={`/ammatit?personalityType=${career.personalityType[0]}`}
                className="hover:text-slate-800"
              >
                {career.personalityType[0]}
              </Link>
            </>
          )}
          <span className="mx-2">›</span>
          <span className="text-slate-900">{career.title}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">{career.title}</h1>
            <p className="text-xl text-slate-600 mb-6 leading-relaxed">{career.summary}</p>
            
            {/* Badges */}
            <div className="flex flex-wrap gap-3">
              {career.educationLevel.map(level => (
                <span
                  key={level}
                  className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-medium"
                >
                  <GraduationCap className="inline h-4 w-4 mr-2" />
                  {level}
                </span>
              ))}
              {career.salaryMin && career.salaryMax && (
                <span className="px-4 py-2 bg-green-50 text-green-700 rounded-xl font-medium">
                  {career.salaryMin}-{career.salaryMax} €/kk
                </span>
              )}
              {career.outlook && (
                <span className="px-4 py-2 bg-purple-50 text-purple-700 rounded-xl font-medium">
                  <TrendingUp className="inline h-4 w-4 mr-2" />
                  {career.outlook}
                </span>
              )}
              {career.workMode && (
                <span className="px-4 py-2 bg-orange-50 text-orange-700 rounded-xl font-medium">
                  <MapPin className="inline h-4 w-4 mr-2" />
                  {career.workMode}
                </span>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Yhteenveto */}
              {career.longDescription && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Yhteenveto</h2>
                  <p className="text-slate-600 leading-relaxed">{career.longDescription}</p>
                </div>
              )}

              {/* Päivittäiset tehtävät */}
              {career.dailyTasks && career.dailyTasks.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Päivittäiset tehtävät</h2>
                  <ul className="space-y-3">
                    {career.dailyTasks.map((task, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-[#2563EB] mr-3 mt-1 font-bold">•</span>
                        <span className="text-slate-600 leading-relaxed">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Työympäristö ja työskentelytapa */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Työympäristö ja työskentelytapa</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Työskentelytapa</h3>
                    <p className="text-slate-600">
                      {career.workMode === 'Hybrid' && 'Työskentelee sekä etänä että toimistossa, joustava työaikataulu'}
                      {career.workMode === 'Etä' && 'Työskentelee pääasiassa etänä, itsenäinen työskentely'}
                      {career.workMode === 'Paikan päällä' && 'Työskentelee pääasiassa toimistossa tai työpaikalla'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Toimialat</h3>
                    <div className="flex flex-wrap gap-2">
                      {career.industry.map((industry, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                        >
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Taidot */}
              {(career.skillsHard || career.skillsSoft) && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Taidot</h2>
                  
                  {career.skillsHard && career.skillsHard.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-slate-800 mb-3">Kovat taidot</h3>
                      <div className="flex flex-wrap gap-2">
                        {career.skillsHard.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {career.skillsSoft && career.skillsSoft.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-3">Pehmeät taidot</h3>
                      <div className="flex flex-wrap gap-2">
                        {career.skillsSoft.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Koulutuspolut */}
              {career.opintopolkuLinks && career.opintopolkuLinks.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Koulutuspolut</h2>
                  <div className="space-y-3">
                    {career.opintopolkuLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                      >
                        <span className="text-slate-700 font-medium">{link.label}</span>
                        <ExternalLink className="h-4 w-4 text-slate-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Urapolku ja etenemismahdollisuudet */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Urapolku ja etenemismahdollisuudet</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Aloittaminen</h3>
                    <p className="text-slate-600 leading-relaxed">
                      {career.educationLevel.includes('Oppisopimus') && 'Voit aloittaa oppisopimuskoulutuksella ja oppia työn ohessa.'}
                      {career.educationLevel.includes('Lyhytkoulutus') && 'Lyhytkoulutus tarjoaa nopean tien alalle.'}
                      {career.educationLevel.includes('AMK') && 'AMK-koulutus antaa hyvät perusteet alalle.'}
                      {career.educationLevel.includes('Yliopisto') && 'Yliopistokoulutus tarjoaa syvällisen osaamisen.'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Etenemismahdollisuudet</h3>
                    <p className="text-slate-600 leading-relaxed">
                      {career.outlook === 'Kasvaa' && 'Ala kasvaa ja tarjoaa hyvät mahdollisuudet etenemiselle ja erikoistumiselle.'}
                      {career.outlook === 'Vakaa' && 'Ala on vakaa ja tarjoaa turvallisen työpaikan pitkäjänteiselle kehitykselle.'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Erikoistumismahdollisuudet</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Voit erikoistua alan eri osa-alueisiin tai siirtyä liittyviin ammatteihin. 
                      Jatkuva oppiminen ja ammattitaitojen kehittäminen ovat avain menestykseen.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Palkka & Työllisyysnäkymät */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Palkka & Työllisyysnäkymät</h3>
                {career.salaryMin && career.salaryMax && (
                  <div className="mb-4">
                    <p className="text-sm text-slate-600 mb-1">Palkkahaitari</p>
                    <p className="text-xl font-bold text-[#2563EB]">
                      {career.salaryMin}-{career.salaryMax} €/kk
                    </p>
                  </div>
                )}
                {career.outlook && (
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Työllisyysnäkymä</p>
                    <p className="text-lg font-semibold text-slate-900">{career.outlook}</p>
                  </div>
                )}
              </div>

              {/* Liittyvät ammatit */}
              {relatedCareers.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Liittyvät ammatit</h3>
                  <div className="space-y-3">
                    {relatedCareers.map((relatedCareer) => (
                      <Link
                        key={relatedCareer.slug}
                        href={`/ammatit/${relatedCareer.slug}`}
                        className="block p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                      >
                        <h4 className="font-medium text-slate-900 mb-1">{relatedCareer.title}</h4>
                        <p className="text-sm text-slate-600">{relatedCareer.summary}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="bg-[#2563EB] rounded-2xl p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Etsi koulutuksia</h3>
                <p className="text-blue-100 mb-4 text-sm">
                  Löydä sopivia koulutusohjelmia Opintopolusta
                </p>
                <a
                  href="https://opintopolku.fi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#2563EB] rounded-xl hover:bg-blue-50 transition-colors font-medium"
                >
                  Etsi koulutuksia Opintopolussa
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
