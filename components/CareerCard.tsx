"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CareerFI } from "@/data/careers-fi";
import { ChevronDown, ChevronUp, ExternalLink, Copy, Check } from "lucide-react";

interface CareerCardProps {
  career: CareerFI;
}

export default function CareerCard({ career }: CareerCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const copyToClipboard = async (url: string, linkName: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(linkName);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const getOutlookColor = (status: string) => {
    switch (status) {
      case "kasvaa": return "bg-accent/10 text-accent border-accent/20";
      case "vakaa": return "bg-primary/10 text-primary border-primary/20";
      case "laskee": return "bg-red-100 text-red-800 border-red-200";
      case "vaihtelee": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getOutlookLabel = (status: string) => {
    switch (status) {
      case "kasvaa": return "Kysyntä kasvaa";
      case "vakaa": return "Vakaa kysyntä";
      case "laskee": return "Kysyntä laskee";
      case "vaihtelee": return "Kysyntä vaihtelee";
      default: return status;
    }
  };

  return (
    <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-300">
      <CardContent className="p-6">
        {/* Header */}
        <div className="mb-6">
          {/* Title and job outlook badge */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="text-2xl font-bold text-slate-900 flex-1 leading-tight">{career.title_fi}</h3>
            <div className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${getOutlookColor(career.job_outlook.status)} shrink-0`}>
              {getOutlookLabel(career.job_outlook.status)}
            </div>
          </div>

          {/* Description */}
          <p className="text-slate-600 mb-4 leading-relaxed">{career.short_description}</p>

          {/* Salary - more prominent */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">Palkka:</span>
            <span className="text-lg font-bold text-slate-900">
              {career.salary_eur_month.median.toLocaleString('fi-FI')} €/kk
            </span>
            <span className="text-sm text-slate-500">
              ({career.salary_eur_month.range[0].toLocaleString('fi-FI')} - {career.salary_eur_month.range[1].toLocaleString('fi-FI')})
            </span>
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mb-4"
          aria-expanded={isExpanded}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4" />
              Piilota tiedot
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4" />
              Näytä tiedot
            </>
          )}
        </Button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-6 border-t pt-6">
            {/* Impact Section - Near the top */}
            {career.impact && career.impact.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Miksi tämä on tärkeää?</h4>
                <ul className="space-y-1">
                  {career.impact.map((impact, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start">
                      <span className="text-primary mr-2">•</span>
                      {impact}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Main Tasks */}
            <div>
              <h4 className="font-semibold mb-2">Päätehtävät</h4>
              <ul className="space-y-1">
                {career.main_tasks.map((task, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start">
                    <span className="text-primary mr-2">•</span>
                    {task}
                  </li>
                ))}
              </ul>
            </div>

            {/* Education Paths */}
            <div>
              <h4 className="font-semibold mb-2">Koulutuspolut</h4>
              <ul className="space-y-1">
                {career.education_paths.map((path, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start">
                    <span className="text-primary mr-2">•</span>
                    {path}
                  </li>
                ))}
              </ul>
            </div>

            {/* Qualification/License */}
            {career.qualification_or_license && (
              <div>
                <h4 className="font-semibold mb-2">Koulutusvaatimus/Lisenssi</h4>
                <p className="text-sm text-muted-foreground">{career.qualification_or_license}</p>
              </div>
            )}

            {/* Core Skills & Tools */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Keskeiset taidot</h4>
                <div className="flex flex-wrap gap-1">
                  {career.core_skills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Työkalut ja teknologia</h4>
                <div className="flex flex-wrap gap-1">
                  {career.tools_tech.map((tool, index) => (
                    <span key={index} className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Languages */}
            <div>
              <h4 className="font-semibold mb-2">Kielivaatimukset</h4>
              <div className="flex gap-4 text-sm">
                <span>Suomi: {career.languages_required.fi}</span>
                <span>Ruotsi: {career.languages_required.sv}</span>
                <span>Englanti: {career.languages_required.en}</span>
              </div>
            </div>

            {/* Salary Details */}
            <div>
              <h4 className="font-semibold mb-2">Palkka</h4>
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Keskiarvo:</span>
                  <span className="font-semibold">{career.salary_eur_month.median.toLocaleString('fi-FI')} €/kk</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Alue:</span>
                  <span className="text-sm">
                    {career.salary_eur_month.range[0].toLocaleString('fi-FI')} - {career.salary_eur_month.range[1].toLocaleString('fi-FI')} €/kk
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Lähde:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {career.salary_eur_month.source.name} ({career.salary_eur_month.source.year})
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(career.salary_eur_month.source.url, 'salary')}
                      className="h-6 w-6 p-0"
                    >
                      {copiedLink === 'salary' ? (
                        <Check className="h-3 w-3 text-accent" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-6 w-6 p-0"
                    >
                      <a href={career.salary_eur_month.source.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Outlook */}
            <div>
              <h4 className="font-semibold mb-2">Työllisyysnäkymät</h4>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">{career.job_outlook.explanation}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Lähde:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {career.job_outlook.source.name} ({career.job_outlook.source.year})
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(career.job_outlook.source.url, 'outlook')}
                      className="h-6 w-6 p-0"
                    >
                      {copiedLink === 'outlook' ? (
                        <Check className="h-3 w-3 text-accent" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-6 w-6 p-0"
                    >
                      <a href={career.job_outlook.source.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Career Progression */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Aloitusroolit</h4>
                <ul className="space-y-1">
                  {career.entry_roles.map((role, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start">
                      <span className="text-primary mr-2">•</span>
                      {role}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Urakehitys</h4>
                <ul className="space-y-1">
                  {career.career_progression.map((progression, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start">
                      <span className="text-primary mr-2">•</span>
                      {progression}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Typical Employers */}
            <div>
              <h4 className="font-semibold mb-2">Tyypilliset työnantajat</h4>
              <ul className="space-y-1">
                {career.typical_employers.map((employer, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start">
                    <span className="text-primary mr-2">•</span>
                    {employer}
                  </li>
                ))}
              </ul>
            </div>

            {/* Work Conditions */}
            <div>
              <h4 className="font-semibold mb-2">Työolot</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Etätyö:</span>
                  <div className="font-medium">{career.work_conditions.remote}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Vuorotyö:</span>
                  <div className="font-medium">{career.work_conditions.shift_work ? "Kyllä" : "Ei"}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Matkustaminen:</span>
                  <div className="font-medium">{career.work_conditions.travel}</div>
                </div>
              </div>
            </div>

            {/* Union/CBA */}
            {career.union_or_CBA && (
              <div>
                <h4 className="font-semibold mb-2">Ammattiliitto/TES</h4>
                <p className="text-sm text-muted-foreground">{career.union_or_CBA}</p>
              </div>
            )}

            {/* Useful Links */}
            {career.useful_links.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Hyödylliset linkit</h4>
                <div className="space-y-2">
                  {career.useful_links.map((link, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        {link.name}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sopiiko sinulle? Section */}
            <div>
              <h4 className="font-semibold mb-2">Sopiiko sinulle?</h4>
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-4 border border-primary/20">
                <ul className="space-y-2">
                  <li className="text-sm text-muted-foreground flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    {career.work_conditions.remote === "Kyllä" ? "Voit työskennellä etänä" : 
                     career.work_conditions.remote === "Osittain" ? "Osittainen etätyömahdollisuus" : 
                     "Työskentely toimistossa"}
                  </li>
                  <li className="text-sm text-muted-foreground flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    {career.work_conditions.shift_work ? "Vuorotyömahdollisuus" : "Tavalliset työajat"}
                  </li>
                  <li className="text-sm text-muted-foreground flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    {career.job_outlook.status === "kasvaa" ? "Kasvava ala" : 
                     career.job_outlook.status === "vakaa" ? "Vakaa kysyntä" : 
                     "Vaihteleva kysyntä"}
                  </li>
                  <li className="text-sm text-muted-foreground flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    {career.qualification_or_license ? "Ammattitutkinto vaaditaan" : "Ei tutkintovaatimusta"}
                  </li>
                  <li className="text-sm text-muted-foreground flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    {career.core_skills.length > 0 ? `${career.core_skills.length} keskeistä taitoa` : "Monipuoliset taidot"}
                  </li>
                </ul>
              </div>
            </div>

            {/* Keywords */}
            {career.keywords && career.keywords.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Avainsanat</h4>
                <div className="flex flex-wrap gap-1">
                  {career.keywords.map((keyword, index) => (
                    <span key={index} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
