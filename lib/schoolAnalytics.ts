/**
 * School-Wide Analytics Library
 * Aggregates data across multiple classes for school-wide insights
 */

export interface SchoolAnalytics {
  totalTests: number;
  totalClasses: number;
  topCareers: Array<{ name: string; count: number; percentage: number }>;
  educationPathDistribution: {
    lukio: number;
    ammattikoulu: number;
    kansanopisto: number;
  };
  dimensionAverages: {
    interests: number;
    values: number;
    workstyle: number;
    context: number;
  };
  cohortDistribution: Record<string, number>;
  trends: {
    byMonth: Array<{
      month: string;
      tests: number;
      topCareers: Array<{ name: string; count: number }>;
    }>;
    byYear: Array<{
      year: string;
      tests: number;
      educationPathDistribution: {
        lukio: number;
        ammattikoulu: number;
        kansanopisto: number;
      };
    }>;
  };
  insights: string[];
}

export interface ClassWithResults {
  classId: string;
  className?: string;
  createdAt: string;
  teacherId: string;
  results: any[];
}

/**
 * Calculate school-wide analytics from multiple classes
 */
export function calculateSchoolAnalytics(
  classesWithResults: ClassWithResults[]
): SchoolAnalytics {
  const allResults: any[] = [];
  let totalTests = 0;
  const classIds = new Set<string>();

  // Flatten all results from all classes
  classesWithResults.forEach((classData) => {
    classIds.add(classData.classId);
    classData.results.forEach((result) => {
      allResults.push(result);
      totalTests++;
    });
  });

  // Aggregate careers
  const careerCounts: Record<string, number> = {};
  allResults.forEach((result) => {
    const payload = result.result_payload || {};
    const topCareers = payload.top_careers || payload.topCareers || [];
    topCareers.slice(0, 3).forEach((career: any) => {
      careerCounts[career.title] = (careerCounts[career.title] || 0) + 1;
    });
  });

  const topCareers = Object.entries(careerCounts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalTests > 0 ? Math.round((count / totalTests) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  // Aggregate education paths
  const educationPathCounts = { lukio: 0, ammattikoulu: 0, kansanopisto: 0 };
  allResults.forEach((result) => {
    const payload = result.result_payload || {};
    if (payload.cohort === 'YLA') {
      const edPath = payload.educationPath || payload.education_path;
      if (edPath?.primary) {
        const path = edPath.primary || edPath.education_path_primary;
        if (path in educationPathCounts) {
          educationPathCounts[path as keyof typeof educationPathCounts]++;
        }
      }
    }
  });

  // Aggregate dimensions
  const dimensionSums = { interests: 0, values: 0, workstyle: 0, context: 0 };
  let dimensionCount = 0;
  allResults.forEach((result) => {
    const payload = result.result_payload || {};
    const dimScores = payload.dimension_scores || payload.dimensionScores;
    if (dimScores) {
      dimensionSums.interests += dimScores.interests || 0;
      dimensionSums.values += dimScores.values || 0;
      dimensionSums.workstyle += dimScores.workstyle || 0;
      dimensionSums.context += dimScores.context || 0;
      dimensionCount++;
    }
  });

  const dimensionAverages = dimensionCount > 0
    ? {
        interests: dimensionSums.interests / dimensionCount,
        values: dimensionSums.values / dimensionCount,
        workstyle: dimensionSums.workstyle / dimensionCount,
        context: dimensionSums.context / dimensionCount,
      }
    : { interests: 0, values: 0, workstyle: 0, context: 0 };

  // Aggregate cohorts
  const cohortCounts: Record<string, number> = {};
  allResults.forEach((result) => {
    const payload = result.result_payload || {};
    const cohort = payload.cohort || 'Unknown';
    cohortCounts[cohort] = (cohortCounts[cohort] || 0) + 1;
  });

  // Calculate trends by month
  const monthlyData: Record<string, any[]> = {};
  allResults.forEach((result) => {
    const date = new Date(result.created_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = [];
    }
    monthlyData[monthKey].push(result);
  });

  const byMonth = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, results]) => {
      const careerCounts: Record<string, number> = {};
      results.forEach((result) => {
        const payload = result.result_payload || {};
        const topCareers = payload.top_careers || payload.topCareers || [];
        topCareers.slice(0, 3).forEach((career: any) => {
          careerCounts[career.title] = (careerCounts[career.title] || 0) + 1;
        });
      });
      const topCareers = Object.entries(careerCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return {
        month,
        tests: results.length,
        topCareers,
      };
    });

  // Calculate trends by year
  const yearlyData: Record<string, any[]> = {};
  allResults.forEach((result) => {
    const date = new Date(result.created_at);
    const yearKey = String(date.getFullYear());
    if (!yearlyData[yearKey]) {
      yearlyData[yearKey] = [];
    }
    yearlyData[yearKey].push(result);
  });

  const byYear = Object.entries(yearlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([year, results]) => {
      const edu = { lukio: 0, ammattikoulu: 0, kansanopisto: 0 };
      results.forEach((result) => {
        const payload = result.result_payload || {};
        if (payload.cohort === 'YLA') {
          const edPath = payload.educationPath || payload.education_path;
          if (edPath?.primary) {
            const path = edPath.primary || edPath.education_path_primary;
            if (path in edu) {
              edu[path as keyof typeof edu]++;
            }
          }
        }
      });

      return {
        year,
        tests: results.length,
        educationPathDistribution: edu,
      };
    });

  // Generate insights
  const insights: string[] = [];
  
  if (totalTests > 0) {
    const lukioTotal = educationPathCounts.lukio + educationPathCounts.ammattikoulu + educationPathCounts.kansanopisto;
    if (lukioTotal > 0) {
      const lukioPercentage = Math.round((educationPathCounts.lukio / lukioTotal) * 100);
      const ammattikouluPercentage = Math.round((educationPathCounts.ammattikoulu / lukioTotal) * 100);
      
      if (ammattikouluPercentage >= 70) {
        insights.push(`${ammattikouluPercentage}% YLA-oppilaista suosittelee ammattikoulua.`);
      } else if (lukioPercentage >= 70) {
        insights.push(`${lukioPercentage}% YLA-oppilaista suosittelee lukiota.`);
      }
    }

    if (topCareers.length > 0) {
      const topCareer = topCareers[0];
      if (topCareer.percentage >= 30) {
        insights.push(`Yleisin ammatti: ${topCareer.name} (${topCareer.percentage}% oppilaista).`);
      }
    }

    if (dimensionAverages.interests > 70) {
      insights.push('Oppilailla on selkeät kiinnostukset.');
    }

    if (totalTests >= 50) {
      insights.push(`Yhteensä ${totalTests} testiä suoritettu ${classIds.size} luokassa.`);
    }
  }

  return {
    totalTests,
    totalClasses: classIds.size,
    topCareers,
    educationPathDistribution: educationPathCounts,
    dimensionAverages,
    cohortDistribution: cohortCounts,
    trends: {
      byMonth,
      byYear,
    },
    insights,
  };
}

