import { NextRequest, NextResponse } from 'next/server';
import { rankCareers, generateUserProfile } from '@/lib/scoring/scoringEngine';
import { generateEnhancedPersonalizedAnalysis } from '@/lib/scoring/deepPersonalization';
import { Cohort } from '@/lib/scoring/types';
import { createLogger } from '@/lib/logger';

const log = createLogger('API/Analyze');

function validateAnswers(answers: number[]): { isValid: boolean; reason?: string } {
  // Check if all answers are the same (indicates random clicking)
  const uniqueAnswers = new Set(answers.filter((a: number) => a > 0));
  if (uniqueAnswers.size <= 1) {
    return { isValid: false, reason: "All answers are identical - please provide thoughtful responses" };
  }

  // Check if answers are too evenly distributed (indicates random clicking)
  const answerCounts = [0, 0, 0, 0, 0]; // Count for answers 1-5
  answers.forEach(answer => {
    if (answer >= 1 && answer <= 5) {
      answerCounts[answer - 1]++;
    }
  });

  const maxCount = Math.max(...answerCounts);
  const totalAnswered = answers.filter((a: number) => a > 0).length;
  
  // If more than 80% of answers are the same value, it's suspicious
  if (maxCount / totalAnswered > 0.8) {
    return { isValid: false, reason: "Too many identical answers - please vary your responses" };
  }

  return { isValid: true };
}

function generateAIAnalysis(userProfile: any, recommendations: any[]): {
  personalityInsights: string[];
  strengths: string[];
  careerAdvice: string[];
  nextSteps: string[];
  summary: string;
} {
  // Use the personalized analysis from the user profile
  if (userProfile.personalizedAnalysis) {
    return {
      personalityInsights: [userProfile.personalizedAnalysis.personalityDescription || ""],
      strengths: userProfile.personalizedAnalysis.strengths || [],
      careerAdvice: [userProfile.personalizedAnalysis.workEnvironmentFit || ""],
      nextSteps: userProfile.personalizedAnalysis.nextSteps || [],
      summary: userProfile.personalizedAnalysis.summary || ""
    };
  }

  // Fallback if personalized analysis is not available
  return {
    personalityInsights: ["Vastauksesi perusteella olet monipuolinen henkilö, jolla on useita vahvuuksia."],
    strengths: ["Sopeutumiskyky", "Monipuolisuus", "Avoimuus uusille kokemuksille"],
    careerAdvice: ["Sinulle sopivat työt, joissa voit hyödyntää monipuolisia taitojasi."],
    nextSteps: ["Tutustu suositeltuihin ammatteihin", "Hanki lisätietoa koulutuspoluista", "Keskustele uraohjaajan kanssa"],
    summary: `Löysimme sinulle ${recommendations.length} urasuositusta, jotka sopivat hyvin vahvuuksiisi.`
  };
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { group, questions, answers } = body;

    if (!group || !questions || !answers) {
      return NextResponse.json(
        { error: 'Pakolliset kentät puuttuvat: group, questions, answers' },
        { status: 400 }
      );
    }

    // Validate answers for quality
    const validation = validateAnswers(answers);
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        error: 'Virheelliset vastaukset',
        message: validation.reason,
        suggestion: 'Ole hyvä ja tee testi uudelleen ja anna harkittuja vastauksia saadaksesi merkityksellisiä urasuosituksia.'
      }, { status: 400 });
    }

    // Convert answers to the format expected by the scoring engine
    const formattedAnswers = answers.map((score: number, index: number) => ({
      questionIndex: index,
      score: score || 3 // Use 3 (neutral) for unanswered questions
    }));

    // Use the proper scoring engine to get career recommendations
    const cohort = group as Cohort;
    const topCareers = rankCareers(formattedAnswers, cohort, 5);
    const userProfile = generateUserProfile(formattedAnswers, cohort);

    // CRITICAL FIX: Generate personalized analysis WITH career context to ensure alignment
    const personalizedAnalysis = generateEnhancedPersonalizedAnalysis(
      formattedAnswers,
      userProfile,
      cohort,
      topCareers
    );

    // Add the generated analysis to the user profile
    userProfile.personalizedAnalysis = personalizedAnalysis;

    // PHASE 2B: Alignment monitoring (Solution D1)
    // Check if personal analysis (category), education path, and careers align
    const { calculateEducationPath } = require('@/lib/scoring/educationPath');
    const educationPath = cohort !== 'NUORI' ? calculateEducationPath(formattedAnswers, cohort) : null;

    const alignmentIssues: string[] = [];
    const primaryCategory = userProfile.primaryCategory;
    const topCareerCategories = topCareers.slice(0, 3).map((c: any) => c.category);

    // Check 1: Do topStrengths align with primaryCategory?
    if (primaryCategory && primaryCategory !== 'none') {
      const categoryStrengthMap: Record<string, string[]> = {
        'auttaja': ['terveysala', 'ihmis', 'kasvu', 'opetus', 'empatia', 'sosiaalinen vaikuttaminen'],
        'innovoija': ['teknologia', 'analyyttinen', 'ongelmanratkaisu', 'innovatiivisuus'],
        'luova': ['luovuus', 'kirjoittaminen', 'taide', 'kulttuuri', 'visuaalisuus'],
        'rakentaja': ['käytännön tekeminen', 'ulkotyö', 'urheilu', 'tarkkuus'],
        'johtaja': ['johtaminen', 'liiketoiminta', 'yrittäjyys'],
        'jarjestaja': ['organisointi', 'suunnittelu', 'tarkkuus', 'rakenne'],
        'visionaari': ['kansainvälisyys', 'globaali', 'vaikuttaminen', 'innovatiivisuus'],
        'ympariston-puolustaja': ['ympäristö', 'luonto', 'ulkotyö']
      };

      const expectedKeywords = categoryStrengthMap[primaryCategory] || [];
      const strengthsText = userProfile.topStrengths.join(' ').toLowerCase();
      const matchingStrengths = expectedKeywords.filter(kw =>
        strengthsText.includes(kw.toLowerCase())
      ).length;

      const topCategoryScore = userProfile.categoryAffinities?.[0]?.score ?? 0;
      if (matchingStrengths < 2 && topCategoryScore > 50) {
        alignmentIssues.push(`⚠️ [ALIGNMENT] Category "${primaryCategory}" but topStrengths don't match expected keywords`);
      }
    }

    // Check 2: Do top careers align with primaryCategory?
    if (primaryCategory && primaryCategory !== 'none') {
      const careerCategoryMatches = topCareerCategories.filter((cat: string) => cat === primaryCategory).length;
      if (careerCategoryMatches === 0) {
        alignmentIssues.push(`⚠️ [ALIGNMENT] Category "${primaryCategory}" but top 3 careers are: ${topCareerCategories.join(', ')}`);
      }
    }

    // Check 3: Does education path align with career categories (YLA/TASO2 only)?
    if (educationPath && primaryCategory) {
      const pathCategoryMap: Record<string, string[]> = {
        lukio: ['auttaja', 'innovoija', 'luova', 'visionaari', 'johtaja'],
        ammattikoulu: ['rakentaja', 'jarjestaja'],
        yliopisto: ['innovoija', 'visionaari', 'auttaja'],
        amk: ['rakentaja', 'johtaja', 'jarjestaja', 'auttaja']
      };

      const expectedForPath = pathCategoryMap[educationPath.primary as string] || [];
      if (!expectedForPath.includes(primaryCategory) && educationPath.confidence !== 'low') {
        alignmentIssues.push(`⚠️ [ALIGNMENT] Education path "${educationPath.primary}" (${educationPath.confidence}) doesn't typically align with category "${primaryCategory}"`);
      }
    }

    // Log alignment issues (server-side only)
    if (alignmentIssues.length > 0) {
      log.warn('Alignment issues detected:', alignmentIssues);
      alignmentIssues.forEach(issue => console.warn(issue));
    } else {
      log.info(`[ALIGNMENT] ✅ Good alignment: category="${primaryCategory}", careers=[${topCareerCategories.join(', ')}], path="${educationPath?.primary || 'N/A'}"`);
    }

    // Generate AI-powered analysis from user profile
    const aiAnalysis = generateAIAnalysis(userProfile, topCareers);

    // Calculate completion percentage
    const answeredQuestions = answers.filter((answer: number) => answer > 0).length;
    const completionPercentage = Math.round((answeredQuestions / questions.length) * 100);

    const response = {
      success: true,
      analysis: {
        group,
        completionPercentage,
        totalQuestions: questions.length,
        answeredQuestions,
        recommendations: topCareers.map((career: any) => ({
          id: career.slug,
          title_fi: career.title,
          title_en: career.title,
          category: career.category,
          short_description: career.shortDescription || "",
          main_tasks: career.mainTasks || [],
          education_paths: career.educationPaths || [],
          salary_eur_month: career.salary || { median: 0, range: [0, 0] },
          job_outlook: career.jobOutlook || { explanation: "" },
          keywords: career.keywords || []
        })),
        aiAnalysis: {
          summary: aiAnalysis.summary,
          personalityInsights: aiAnalysis.personalityInsights,
          strengths: aiAnalysis.strengths,
          careerAdvice: aiAnalysis.careerAdvice,
          nextSteps: aiAnalysis.nextSteps
        },
        timestamp: new Date().toISOString()
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    log.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Sisäinen palvelinvirhe' },
      { status: 500 }
    );
  }
}
