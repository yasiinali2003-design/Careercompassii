import { Card, CardContent } from "@/components/ui/card";
import { CareerFI } from "@/data/careers-fi";
import { Users, Target, GraduationCap, Home, Shield } from "lucide-react";

interface TopStatsProps {
  careers: CareerFI[];
}

export default function TopStats({ careers }: TopStatsProps) {
  // Calculate purpose-first stats
  const totalCareers = careers.length;
  
  // Get top 6 most common skills
  const allSkills = careers.flatMap(career => career.core_skills);
  const skillCounts = allSkills.reduce((acc, skill) => {
    acc[skill] = (acc[skill] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topSkills = Object.entries(skillCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6)
    .map(([skill]) => skill);

  // Calculate median study length
  const studyLengths = careers
    .filter(career => career.study_length_estimate_months)
    .map(career => career.study_length_estimate_months!);
  const medianStudyLength = studyLengths.length > 0 
    ? Math.round(studyLengths.sort((a, b) => a - b)[Math.floor(studyLengths.length / 2)])
    : 0;

  // Calculate remote work percentage
  const remoteCareers = careers.filter(career => 
    career.work_conditions.remote === "Kyllä" || career.work_conditions.remote === "Osittain"
  ).length;
  const remotePercentage = totalCareers > 0 ? Math.round((remoteCareers / totalCareers) * 100) : 0;

  // Calculate protected profession percentage
  const protectedCareers = careers.filter(career => 
    career.qualification_or_license !== null
  ).length;
  const protectedPercentage = totalCareers > 0 ? Math.round((protectedCareers / totalCareers) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      {/* Uria saatavilla */}
      <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardContent className="p-4 text-center">
          <Target className="h-6 w-6 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold">{totalCareers}</div>
          <div className="text-sm text-muted-foreground">Uria saatavilla</div>
        </CardContent>
      </Card>

      {/* Tyypilliset taidot */}
      <Card className="border-secondary/20 bg-gradient-to-br from-card to-secondary/5">
        <CardContent className="p-4">
          <Users className="h-6 w-6 text-secondary mx-auto mb-2" />
          <div className="text-sm font-semibold mb-2">Tyypilliset taidot</div>
          <div className="flex flex-wrap gap-1">
            {topSkills.slice(0, 3).map((skill, index) => (
              <span key={index} className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full">
                {skill}
              </span>
            ))}
            {topSkills.length > 3 && (
              <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full">
                +{topSkills.length - 3}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Koulutuksen pituus */}
      <Card className="border-accent/20 bg-gradient-to-br from-card to-accent/5">
        <CardContent className="p-4 text-center">
          <GraduationCap className="h-6 w-6 text-accent mx-auto mb-2" />
          <div className="text-2xl font-bold">
            {medianStudyLength > 0 ? `${Math.round(medianStudyLength / 12)}v` : "Ei vaatimusta"}
          </div>
          <div className="text-sm text-muted-foreground">Koulutuksen pituus (mediaani)</div>
        </CardContent>
      </Card>

      {/* Etätyömahdollisuus */}
      <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardContent className="p-4 text-center">
          <Home className="h-6 w-6 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold">{remotePercentage}%</div>
          <div className="text-sm text-muted-foreground">Etätyömahdollisuus</div>
        </CardContent>
      </Card>

      {/* Suojatun ammatin osuus */}
      <Card className="border-secondary/20 bg-gradient-to-br from-card to-secondary/5">
        <CardContent className="p-4 text-center">
          <Shield className="h-6 w-6 text-secondary mx-auto mb-2" />
          <div className="text-2xl font-bold">{protectedPercentage}%</div>
          <div className="text-sm text-muted-foreground">Suojatun ammatin osuus</div>
        </CardContent>
      </Card>
    </div>
  );
}
