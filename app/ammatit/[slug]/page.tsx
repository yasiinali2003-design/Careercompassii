"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { careersData as careersFI, CareerFI } from '@/data/careers-fi';
import { Career } from '@/lib/types';
import ScrollNav from '@/components/ScrollNav';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { getValidatedRelatedCareers, careerSlugExists } from '@/lib/validateCareerLinks';

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

function getCareerBySlug(slug: string): Career | null {
  if (!careerSlugExists(slug)) {
    return null;
  }
  const careerFI = careersFI.find(c => c && c.id === slug);
  return careerFI ? convertCareerFIToCareer(careerFI) : null;
}

function getRelatedCareers(career: Career, limit: number = 6): Career[] {
  const careerFI = careersFI.find(c => c && c.id === career.slug);
  if (!careerFI) return [];
  
  const validatedRelatedSlugs = getValidatedRelatedCareers(career.slug);
  if (validatedRelatedSlugs.length > 0) {
    const relatedFromData = validatedRelatedSlugs
      .map(slug => {
        const relatedCareerFI = careersFI.find(c => c && c.id === slug);
        return relatedCareerFI ? convertCareerFIToCareer(relatedCareerFI) : null;
      })
      .filter((c): c is Career => c !== null)
      .slice(0, limit);
    
    if (relatedFromData.length > 0) {
      return relatedFromData;
    }
  }
  
  const sameCategory = careersFI
    .filter(c => c && c.category === careerFI.category && c.id !== careerFI.id)
    .slice(0, 3);
  
  const similarEducation = careersFI
    .filter(c => 
      c && 
      c.id !== careerFI.id &&
      !sameCategory.find(sc => sc.id === c.id) &&
      c.education_paths?.some(ep => careerFI.education_paths?.includes(ep))
    )
    .slice(0, 2);
  
  const careerSalary = careerFI.salary_eur_month?.range || [2500, 4000];
  const similarSalary = careersFI
    .filter(c => 
      c &&
      c.id !== careerFI.id &&
      !sameCategory.find(sc => sc.id === c.id) &&
      !similarEducation.find(se => se.id === c.id) &&
      c.salary_eur_month?.range
    )
    .filter(c => {
      const salaryRange = c.salary_eur_month!.range!;
      return (salaryRange[0] >= careerSalary[0] && salaryRange[0] <= careerSalary[1]) ||
             (salaryRange[1] >= careerSalary[0] && salaryRange[1] <= careerSalary[1]);
    })
    .slice(0, 1);
  
  return [...sameCategory, ...similarEducation, ...similarSalary]
    .slice(0, limit)
    .map(convertCareerFIToCareer);
}

function getOutlookColor(outlook: string): string {
  return outlook === 'Kasvaa' ? 'text-urak-accent-green' : 'text-gray-400';
}

function getOutlookBgColor(outlook: string): string {
  return outlook === 'Kasvaa' ? 'bg-urak-accent-green/20' : 'bg-gray-400/20';
}

export default function CareerDetail() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug;

  // Handle case where slug is not available yet or is an array
  if (!slug || Array.isArray(slug)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-urak-accent-blue border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Ladataan...</p>
        </div>
      </div>
    );
  }

  const decodedSlug = decodeURIComponent(slug);
  
  if (!careerSlugExists(decodedSlug)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Ammattia ei löytynyt</h1>
          <Link
            href="/ammatit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-urak-surface border border-white/10 rounded-xl hover:bg-white/[0.03] transition-all text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Takaisin Urakirjastoon
          </Link>
        </div>
      </div>
    );
  }

  const career = getCareerBySlug(decodedSlug);
  const relatedCareers = career ? getRelatedCareers(career) : [];

  if (!career) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Ammattia ei löytynyt</h1>
          <Link
            href="/ammatit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-urak-surface border border-white/10 rounded-xl hover:bg-white/[0.03] transition-all text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Takaisin Urakirjastoon
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <ScrollNav />

      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4" />
          Takaisin
        </button>
      </div>

      {/* Breadcrumb */}
      <AnimatedSection className="max-w-6xl mx-auto px-6 py-6">
        <nav className="text-sm text-gray-400">
          <Link href="/ammatit" className="hover:text-white transition-colors">Urakirjasto</Link>
          {career.industry.length > 0 && (
            <>
              <span className="mx-2">/</span>
              <Link
                href={`/ammatit?industry=${career.industry[0]}`}
                className="hover:text-white transition-colors"
              >
                {career.industry[0]}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-white">{career.title}</span>
        </nav>
      </AnimatedSection>

      {/* Main Content */}
      <AnimatedSection className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-[2fr,1fr] gap-6 md:gap-12">
          {/* Left: Main Content */}
          <div>
            {/* Title & Subtitle */}
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-5xl font-bold text-white mb-2 md:mb-4">
                {career.title}
              </h1>
              <p className="text-sm md:text-xl text-gray-300 leading-relaxed">
                {career.summary}
              </p>
            </div>

            {/* Mitä työssä tehdään? */}
            {career.dailyTasks && career.dailyTasks.length > 0 && (
              <section className="mb-6 md:mb-8">
                <h2 className="text-sm md:text-lg font-semibold text-white mt-4 md:mt-8 mb-2 md:mb-3">
                  Mitä työssä tehdään?
                </h2>
                <ul className="list-disc list-inside space-y-1 text-gray-300 text-xs md:text-base leading-relaxed">
                  {career.dailyTasks.map((task: string, index: number) => (
                    <li key={index}>{task}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Missä töitä tehdään? */}
            <section className="mb-6 md:mb-8">
              <h2 className="text-sm md:text-lg font-semibold text-white mt-4 md:mt-8 mb-2 md:mb-3">
                Missä töitä tehdään?
              </h2>
              <p className="text-xs md:text-base text-gray-300 leading-relaxed">
                {career.workMode === 'Hybrid' && 'Työskentelee sekä etänä että toimistossa, joustava työaikataulu.'}
                {career.workMode === 'Etä' && 'Työskentelee pääasiassa etänä, itsenäinen työskentely.'}
                {career.workMode === 'Paikan päällä' && 'Työskentelee pääasiassa toimistossa tai työpaikalla.'}
                {career.industry.length > 0 && (
                  <> Toimialat: {career.industry.join(', ')}.</>
                )}
              </p>
            </section>

            {/* Millainen koulutus tarvitaan? */}
            {career.educationLevel.length > 0 && (
              <section className="mb-6 md:mb-8">
                <h2 className="text-sm md:text-lg font-semibold text-white mt-4 md:mt-8 mb-2 md:mb-3">
                  Millainen koulutus tarvitaan?
                </h2>
                <ul className="list-disc list-inside space-y-1 text-gray-300 text-xs md:text-base leading-relaxed">
                  {career.educationLevel.map((level: string, index: number) => (
                    <li key={index}>{level}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Kenelle tämä sopii? */}
            {((career.skillsSoft && career.skillsSoft.length > 0) || career.personalityType.length > 0) && (
              <section className="mb-6 md:mb-8">
                <h2 className="text-sm md:text-lg font-semibold text-white mt-4 md:mt-8 mb-2 md:mb-3">
                  Kenelle tämä sopii?
                </h2>
                {career.skillsSoft && career.skillsSoft.length > 0 && (
                  <div className="mb-3 md:mb-4">
                    <p className="text-xs md:text-base text-gray-300 leading-relaxed mb-2">
                      Tärkeimmät taidot:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-300 text-xs md:text-base leading-relaxed">
                      {career.skillsSoft.slice(0, 5).map((skill: string, index: number) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {career.personalityType.length > 0 && (
                  <div>
                    <p className="text-xs md:text-base text-gray-300 leading-relaxed mb-2">
                      Soveltuvat persoonallisuustyypit:
                    </p>
                    <div className="flex flex-wrap gap-1 md:gap-2">
                      {career.personalityType.map((type: string, index: number) => (
                        <span
                          key={index}
                          className="text-[10px] md:text-xs bg-white/5 text-urak-text-secondary rounded-full px-2 py-1"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Läheiset ammatit */}
            {relatedCareers.length > 0 && (
              <section className="mb-6 md:mb-8">
                <h2 className="text-sm md:text-lg font-semibold text-white mt-4 md:mt-8 mb-2 md:mb-3">
                  Läheiset ammatit
                </h2>
                <ul className="space-y-1 md:space-y-2">
                  {relatedCareers
                    .filter((relatedCareer: Career) => careerSlugExists(relatedCareer.slug))
                    .slice(0, 6)
                    .map((relatedCareer: Career) => (
                      <li key={relatedCareer.slug}>
                        <Link
                          href={`/ammatit/${encodeURIComponent(relatedCareer.slug)}`}
                          className="inline-flex items-center gap-1 md:gap-2 text-urak-accent-blue hover:underline text-xs md:text-base"
                        >
                          {relatedCareer.title}
                          <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
                        </Link>
                      </li>
                    ))}
                </ul>
              </section>
            )}
          </div>

          {/* Right: Sticky Sidebar */}
          <div className="sticky top-20 md:top-24 space-y-4 md:space-y-6 h-fit">
            {/* Pikakatsaus Card */}
            <AnimatedCard className="bg-urak-surface rounded-xl ring-1 ring-white/5 p-4 md:p-6">
              <h3 className="text-sm md:text-lg font-semibold text-white mb-3 md:mb-4">
                Pikakatsaus
              </h3>
              
              <div className="space-y-3 md:space-y-4">
                {/* Palkkataso */}
                {career.salaryMin && career.salaryMax && (
                  <div>
                    <p className="text-[10px] md:text-xs text-gray-400 mb-1 md:mb-2 uppercase tracking-wider">Palkkataso</p>
                    <p className="text-xs md:text-sm text-white font-medium">
                      {career.salaryMin}–{career.salaryMax} €/kk
                    </p>
                  </div>
                )}

                {/* Työllisyysnäkymä */}
                {career.outlook && (
                  <div>
                    <p className="text-[10px] md:text-xs text-gray-400 mb-1 md:mb-2 uppercase tracking-wider">Työllisyysnäkymä</p>
                    <span className={`inline-block px-2 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-medium ${getOutlookBgColor(career.outlook)} ${getOutlookColor(career.outlook)}`}>
                      {career.outlook}
                    </span>
                  </div>
                )}

                {/* Koulutustaso */}
                {career.educationLevel.length > 0 && (
                  <div>
                    <p className="text-[10px] md:text-xs text-gray-400 mb-1 md:mb-2 uppercase tracking-wider">Koulutustaso</p>
                    <div className="space-y-0.5 md:space-y-1">
                      {career.educationLevel.slice(0, 2).map((level: string, index: number) => (
                        <p key={index} className="text-xs md:text-sm text-gray-300 truncate">{level}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sopivat profiilit */}
                {career.personalityType.length > 0 && (
                  <div>
                    <p className="text-[10px] md:text-xs text-gray-400 mb-1 md:mb-2 uppercase tracking-wider">Sopivat profiilit</p>
                    <div className="flex flex-wrap gap-1 md:gap-2">
                      {career.personalityType.map((type: string, index: number) => (
                        <span
                          key={index}
                          className="text-[10px] md:text-xs bg-white/5 text-urak-text-secondary rounded-full px-1.5 md:px-2 py-0.5 md:py-1"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AnimatedCard>

            {/* Koulutuspolut Card - Only show education-related links */}
            {career.opintopolkuLinks && career.opintopolkuLinks.filter((link: {label: string; url: string}) => 
              link.url.includes('opintopolku.fi') || 
              link.url.includes('tyomarkkinatori.fi/henkiloasiakkaat/ammattitieto')
            ).length > 0 && (
              <AnimatedCard className="bg-urak-surface rounded-xl ring-1 ring-white/5 p-4 md:p-6">
                <h3 className="text-sm md:text-lg font-semibold text-white mb-3 md:mb-4">
                  Koulutuspolut
                </h3>
                <div className="space-y-1 md:space-y-2">
                  {career.opintopolkuLinks
                    .filter((link: {label: string; url: string}) => 
                      link.url.includes('opintopolku.fi') || 
                      link.url.includes('tyomarkkinatori.fi/henkiloasiakkaat/ammattitieto')
                    )
                    .slice(0, 3)
                    .map((link: {label: string; url: string}, index: number) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between w-full px-3 py-2 md:px-6 md:py-4 bg-white/5 rounded-lg hover:bg-urak-surface/70 transition-all text-xs md:text-sm text-urak-accent-blue hover:text-urak-accent-blue/90"
                    >
                      <span className="truncate mr-2">{link.label}</span>
                      <ExternalLink className="h-3 w-3 md:h-4 md:w-4 opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </AnimatedCard>
            )}

            {/* Työpaikkahaku Card */}
            <AnimatedCard className="bg-urak-surface rounded-xl ring-1 ring-white/5 p-4 md:p-6">
              <h3 className="text-sm md:text-lg font-semibold text-white mb-3 md:mb-4">
                Työpaikkahaku
              </h3>
              <div className="space-y-1 md:space-y-2">
                <a
                  href={`https://duunitori.fi/tyopaikat?haku=${encodeURIComponent(career.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between w-full px-3 py-2 md:px-6 md:py-4 bg-white/5 rounded-lg hover:bg-urak-surface/70 transition-all text-xs md:text-sm text-urak-accent-blue hover:text-urak-accent-blue/90"
                >
                  <span>Duunitori</span>
                  <ExternalLink className="h-3 w-3 md:h-4 md:w-4 opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </a>
                <a
                  href={`https://fi.indeed.com/jobs?q=${encodeURIComponent(career.title)}&l=Suomi`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between w-full px-3 py-2 md:px-6 md:py-4 bg-white/5 rounded-lg hover:bg-urak-surface/70 transition-all text-xs md:text-sm text-urak-accent-blue hover:text-urak-accent-blue/90"
                >
                  <span>Indeed</span>
                  <ExternalLink className="h-3 w-3 md:h-4 md:w-4 opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </a>
                <a
                  href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(career.title)}&location=Finland`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between w-full px-3 py-2 md:px-6 md:py-4 bg-white/5 rounded-lg hover:bg-urak-surface/70 transition-all text-xs md:text-sm text-urak-accent-blue hover:text-urak-accent-blue/90"
                >
                  <span>LinkedIn</span>
                  <ExternalLink className="h-3 w-3 md:h-4 md:w-4 opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </a>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
