"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink, GraduationCap, TrendingUp, Users, MapPin } from 'lucide-react';
import { careersData as careersFI, CareerFI } from '@/data/careers-fi';
import { Career } from '@/lib/types';
import Logo from '@/components/Logo';
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
  // Validate slug exists before looking it up
  if (!careerSlugExists(slug)) {
    return null;
  }
  const careerFI = careersFI.find(c => c && c.id === slug);
  return careerFI ? convertCareerFIToCareer(careerFI) : null;
}

function getRelatedCareers(career: Career, limit: number = 6): Career[] {
  const careerFI = careersFI.find(c => c && c.id === career.slug);
  if (!careerFI) return [];
  
  // First, try to use validated related_careers from data
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
  
  // Fallback to algorithm-based matching if no related_careers defined
  // Same category - highest priority
  const sameCategory = careersFI
    .filter(c => c && c.category === careerFI.category && c.id !== careerFI.id)
    .slice(0, 3);
  
  // Similar education level - second priority
  const similarEducation = careersFI
    .filter(c => 
      c && 
      c.id !== careerFI.id &&
      !sameCategory.find(sc => sc.id === c.id) &&
      c.education_paths?.some(ep => careerFI.education_paths?.includes(ep))
    )
    .slice(0, 2);
  
  // Similar salary range - third priority  
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
  
  // Combine and convert
  return [...sameCategory, ...similarEducation, ...similarSalary]
    .slice(0, limit)
    .map(convertCareerFIToCareer);
}

interface CareerDetailProps {
  params: {
    slug: string;
  };
}

export default function CareerDetail({ params }: CareerDetailProps) {
  const router = useRouter();
  
  // Decode the slug to handle special characters properly
  const decodedSlug = decodeURIComponent(params.slug);
  
  // Validate slug exists before proceeding
  if (!careerSlugExists(decodedSlug)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Ammattia ei löytynyt</h1>
          <Link
            href="/ammatit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors"
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

  // This should never happen due to validation above, but keep as safety check
  if (!career) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Ammattia ei löytynyt</h1>
          <Link
            href="/ammatit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Takaisin Urakirjastoon
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-[#05070B]/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-4 py-2 text-sm font-medium text-neutral-200 transition-colors hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
              Takaisin edelliseen näkymään
            </button>
            <Link
              href="/"
              className="text-sm text-neutral-300 hover:text-white transition-colors"
            >
              Etusivu
            </Link>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-6">
        <nav className="text-sm text-neutral-300">
          <Link href="/" className="hover:text-white">Etusivu</Link>
          <span className="mx-2">›</span>
          <Link href="/ammatit" className="hover:text-white">Urakirjasto</Link>
          {career.personalityType.length > 0 && (
            <>
              <span className="mx-2">›</span>
              <Link
                href={`/ammatit?personalityType=${career.personalityType[0]}`}
                className="hover:text-white"
              >
                {career.personalityType[0]}
              </Link>
            </>
          )}
          <span className="mx-2">›</span>
          <span className="text-white">{career.title}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-8 mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">{career.title}</h1>
            <p className="text-xl text-neutral-300 mb-6 leading-relaxed">{career.summary}</p>
            
            {/* Badges */}
            <div className="flex flex-wrap gap-3">
              {career.educationLevel.map((level: string) => (
                <span
                  key={level}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-neutral-200 rounded-xl font-medium"
                >
                  <GraduationCap className="inline h-4 w-4 mr-2" />
                  {level}
                </span>
              ))}
              {career.salaryMin && career.salaryMax && (
                <span className="px-4 py-2 bg-[#4A7C59]/20 text-[#4A7C59] border border-[#4A7C59]/30 rounded-xl font-medium">
                  {career.salaryMin}-{career.salaryMax} €/kk
                </span>
              )}
              {career.outlook && (
                <span className="px-4 py-2 bg-[#2B5F75]/20 text-[#2B5F75] border border-[#2B5F75]/30 rounded-xl font-medium">
                  <TrendingUp className="inline h-4 w-4 mr-2" />
                  {career.outlook}
                </span>
              )}
              {career.workMode && (
                <span className="px-4 py-2 bg-[#E8994A]/20 text-[#E8994A] border border-[#E8994A]/30 rounded-xl font-medium">
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
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Yhteenveto</h2>
                  <p className="text-neutral-300 leading-relaxed">{career.longDescription}</p>
                </div>
              )}

              {/* Päivittäiset tehtävät */}
              {career.dailyTasks && career.dailyTasks.length > 0 && (
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Päivittäiset tehtävät</h2>
                  <ul className="space-y-3">
                    {career.dailyTasks.map((task: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-[#E8994A] mr-3 mt-1 font-bold">•</span>
                        <span className="text-neutral-300 leading-relaxed">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Työympäristö ja työskentelytapa */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Työympäristö ja työskentelytapa</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-200 mb-2">Työskentelytapa</h3>
                    <p className="text-neutral-300">
                      {career.workMode === 'Hybrid' && 'Työskentelee sekä etänä että toimistossa, joustava työaikataulu'}
                      {career.workMode === 'Etä' && 'Työskentelee pääasiassa etänä, itsenäinen työskentely'}
                      {career.workMode === 'Paikan päällä' && 'Työskentelee pääasiassa toimistossa tai työpaikalla'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-200 mb-2">Toimialat</h3>
                    <div className="flex flex-wrap gap-2">
                      {career.industry.map((industry: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 text-neutral-200 rounded-lg text-sm font-medium"
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
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Taidot</h2>

                  {career.skillsHard && career.skillsHard.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-neutral-200 mb-3">Kovat taidot</h3>
                      <div className="flex flex-wrap gap-2">
                        {career.skillsHard.map((skill: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-neutral-200 rounded-lg text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {career.skillsSoft && career.skillsSoft.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-200 mb-3">Pehmeät taidot</h3>
                      <div className="flex flex-wrap gap-2">
                        {career.skillsSoft.map((skill: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-2 bg-[#4A7C59]/20 text-[#4A7C59] border border-[#4A7C59]/30 rounded-lg text-sm font-medium"
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
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Koulutuspolut</h2>
                  <div className="space-y-3">
                    {career.opintopolkuLinks.map((link: {label: string; url: string}, index: number) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/10 transition-colors"
                      >
                        <span className="text-neutral-200 font-medium">{link.label}</span>
                        <ExternalLink className="h-4 w-4 text-neutral-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Urapolku ja etenemismahdollisuudet */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Urapolku ja etenemismahdollisuudet</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-200 mb-2">Aloittaminen</h3>
                    <p className="text-neutral-300 leading-relaxed">
                      {career.educationLevel.includes('Oppisopimus') && 'Voit aloittaa oppisopimuskoulutuksella ja oppia työn ohessa.'}
                      {career.educationLevel.includes('Lyhytkoulutus') && 'Lyhytkoulutus tarjoaa nopean tien alalle.'}
                      {career.educationLevel.includes('AMK') && 'AMK-koulutus antaa hyvät perusteet alalle.'}
                      {career.educationLevel.includes('Yliopisto') && 'Yliopistokoulutus tarjoaa syvällisen osaamisen.'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-200 mb-2">Etenemismahdollisuudet</h3>
                    <p className="text-neutral-300 leading-relaxed">
                      {career.outlook === 'Kasvaa' && 'Ala kasvaa ja tarjoaa hyvät mahdollisuudet etenemiselle ja erikoistumiselle.'}
                      {career.outlook === 'Vakaa' && 'Ala on vakaa ja tarjoaa turvallisen työpaikan pitkäjänteiselle kehitykselle.'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-200 mb-2">Erikoistumismahdollisuudet</h3>
                    <p className="text-neutral-300 leading-relaxed">
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
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Palkka & Työllisyysnäkymät</h3>
                {career.salaryMin && career.salaryMax && (
                  <div className="mb-4">
                    <p className="text-sm text-neutral-400 mb-1">Palkkahaitari</p>
                    <p className="text-xl font-bold text-[#4A7C59]">
                      {career.salaryMin}-{career.salaryMax} €/kk
                    </p>
                  </div>
                )}
                {career.outlook && (
                  <div>
                    <p className="text-sm text-neutral-400 mb-1">Työllisyysnäkymä</p>
                    <p className="text-lg font-semibold text-white">{career.outlook}</p>
                  </div>
                )}
              </div>

              {/* Liittyvät ammatit */}
              {relatedCareers.length > 0 && (
                <div className="bg-gradient-to-br from-[#2B5F75]/10 to-[#4A7C59]/10 rounded-2xl shadow-sm border border-white/20 p-6">
                  <h3 className="text-lg font-bold text-white mb-4">
                    Tutustu myös näihin ammatteihin
                  </h3>
                  <p className="text-sm text-neutral-300 mb-4">
                    Samankaltaiset ammatit samalta alalta, vastaavilla vaatimuksilla tai palkkaluokalla
                  </p>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-4">
                    <p className="text-xs text-neutral-300">
                      <strong className="text-white">Miksi nämä ammatit:</strong> Valittu saman alan työtehtävien, koulutusvaatimusten ja palkkatason perusteella. Saatat löytää näistä vaihtoehtoisia urapolkuja.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {relatedCareers
                      .filter((relatedCareer: Career) => careerSlugExists(relatedCareer.slug))
                      .map((relatedCareer: Career) => (
                        <Link
                          key={relatedCareer.slug}
                          href={`/ammatit/${encodeURIComponent(relatedCareer.slug)}`}
                          className="block p-4 bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/10 hover:shadow-md transition-all border border-white/20"
                        >
                          <h4 className="font-semibold text-white mb-1">{relatedCareer.title}</h4>
                          <p className="text-sm text-neutral-300 line-clamp-2">{relatedCareer.summary}</p>
                        </Link>
                      ))}
                  </div>
                </div>
              )}

              {/* Demand Forecast Section */}
              <div className="bg-gradient-to-br from-[#4A7C59]/20 to-[#4A7C59]/10 rounded-2xl shadow-sm border-2 border-[#4A7C59]/30 p-8 mb-6">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ennuste tulevaisuuteen
                </h3>
                <div className="space-y-4">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-white">Työllisyysnäkymä 2025-2030</h4>
                      <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                        career.outlook === 'Kasvaa' ? 'bg-[#4A7C59]/30 text-[#4A7C59] border border-[#4A7C59]/40' : 'bg-[#2B5F75]/30 text-[#2B5F75] border border-[#2B5F75]/40'
                      }`}>
                        {career.outlook === 'Kasvaa' ? 'Kasvaa' : 'Vakaa'}
                      </div>
                    </div>
                    <p className="text-neutral-300 leading-relaxed mb-4">
                      {career.outlook === 'Kasvaa'
                        ? 'Ala kasvaa ja työllisyysnäkymät ovat hyvät seuraavien vuosien aikana. Tämä ammatti tarjoaa vakaat mahdollisuudet urakehitykselle ja työllistymiselle. Automaatio ei vaikuta merkittävästi tähän työhön.'
                        : 'Ala on vakaa ja tasainen. Työllisyysnäkymät ovat hyvät, ja alalla on jatkuva kysyntä työntekijöille. Tämä on turvallinen uravalinta pitkällä aikavälillä.'}
                    </p>
                    <div className="bg-[#4A7C59]/20 rounded-lg p-4 border border-[#4A7C59]/30">
                      <p className="text-sm text-neutral-300">
                        Ennuste perustuu työvoimakysynnän kehitykseen ja alan muutoksiin.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compare Button */}
              <div className="bg-gradient-to-r from-[#2B5F75]/30 to-[#E8994A]/30 rounded-2xl p-6 border border-white/20 mb-6">
                <h3 className="text-lg font-bold mb-2 text-white">Vertaa tätä ammattia muihin</h3>
                <p className="text-neutral-300 mb-4 text-sm">
                  Vertaa palkkaa, vaatimuksia ja työllisyysnäkymiä rinnakkain
                </p>
                <Link
                  href={`/ammatit/compare?careers=${encodeURIComponent(career.slug)}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors font-medium"
                >
                  Siirry vertailuun
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-[#2B5F75]/30 to-[#4A7C59]/30 rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-bold mb-2 text-white">Etsi koulutuksia</h3>
                <p className="text-neutral-300 mb-4 text-sm">
                  Löydä sopivia koulutusohjelmia Opintopolusta
                </p>
                <a
                  href="https://opintopolku.fi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors font-medium"
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
