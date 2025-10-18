import { NextRequest, NextResponse } from 'next/server';
import { careersData, CareerFI } from '@/data/careers-fi';

// Career categories mapping based on question patterns
const CAREER_CATEGORIES = {
  LUOVA: "luova",
  JOHTAJA: "johtaja", 
  INNOVOIJA: "innovoija",
  RAKENTAJA: "rakentaja",
  AUTTAJA: "auttaja",
  YMPARISTO: "ympariston-puolustaja",
  VISIONAARI: "visionaari",
  JARJESTAJA: "jarjestaja"
};

// Question-to-category mapping (simplified - in real implementation this would be more sophisticated)
const QUESTION_CATEGORY_MAPPING = {
  YLA: {
    // Creative questions (indices 1, 13, 14, 16, 27)
    creative: [1, 13, 14, 16, 27],
    // Leadership questions (indices 3, 6, 9, 19, 23)
    leadership: [3, 6, 9, 19, 23],
    // Technical/Innovation questions (indices 2, 10, 24, 25, 28)
    technical: [2, 10, 24, 25, 28],
    // Practical/Building questions (indices 4, 11, 20, 21, 22)
    practical: [4, 11, 20, 21, 22],
    // Helping questions (indices 5, 8, 26, 6, 18]
    helping: [5, 8, 26, 6, 18],
    // Environment questions (indices 6, 25, 7, 18]
    environment: [6, 25, 7, 18],
    // Future/Vision questions (indices 7, 16, 29, 8, 17]
    vision: [7, 16, 29, 8, 17],
    // Organization questions (indices 11, 12, 19, 21, 22]
    organization: [11, 12, 19, 21, 22]
  },
  TASO2: {
    creative: [2, 9, 10, 14, 22],
    leadership: [3, 6, 13, 26, 27],
    technical: [5, 8, 15, 19, 25],
    practical: [11, 12, 16, 20, 27],
    helping: [7, 12, 15, 28, 29],
    environment: [17, 20, 25, 7, 12],
    vision: [1, 21, 22, 30, 4],
    organization: [9, 20, 21, 29, 4]
  },
  NUORI: {
    creative: [3, 10, 16, 26, 9],
    leadership: [6, 12, 15, 21, 22],
    technical: [5, 8, 27, 4, 15],
    practical: [11, 7, 18, 27, 28],
    helping: [4, 15, 19, 25, 9],
    environment: [9, 20, 4, 7, 12],
    vision: [1, 13, 22, 30, 2],
    organization: [2, 8, 17, 18, 29]
  }
};

function calculateCategoryScores(group: string, answers: number[]) {
  const mapping = QUESTION_CATEGORY_MAPPING[group as keyof typeof QUESTION_CATEGORY_MAPPING];
  if (!mapping) return {};

  const scores: { [key: string]: number } = {};
  
  Object.entries(mapping).forEach(([category, questionIndices]) => {
    const categoryKey = category.toUpperCase();
    scores[categoryKey] = questionIndices.reduce((sum, index) => {
      return sum + (answers[index] || 0);
    }, 0);
  });

  return scores;
}

function validateAnswers(answers: number[]): { isValid: boolean; reason?: string } {
  // Check if all answers are the same (indicates random clicking)
  const uniqueAnswers = new Set(answers.filter(a => a > 0));
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
  const totalAnswered = answers.filter(a => a > 0).length;
  
  // If more than 80% of answers are the same value, it's suspicious
  if (maxCount / totalAnswered > 0.8) {
    return { isValid: false, reason: "Too many identical answers - please vary your responses" };
  }

  return { isValid: true };
}

function getTopCategories(scores: { [key: string]: number }, limit: number = 3) {
  const sortedCategories = Object.entries(scores)
    .sort(([, a], [, b]) => b - a);
  
  // Only return categories with meaningful scores (at least 15% above average)
  const averageScore = sortedCategories.reduce((sum, [, score]) => sum + score, 0) / sortedCategories.length;
  const threshold = averageScore * 1.15;
  
  return sortedCategories
    .filter(([, score]) => score >= threshold)
    .slice(0, limit)
    .map(([key]) => key);
}

function getCareersByCategory(categoryKey: string): CareerFI[] {
  const category = CAREER_CATEGORIES[categoryKey as keyof typeof CAREER_CATEGORIES];
  if (!category) return [];
  
  return careersData.filter(career => career.category === category);
}

function generateAIAnalysis(group: string, categoryScores: { [key: string]: number }, topCategories: string[], recommendations: CareerFI[]): {
  personalityInsights: string[];
  strengths: string[];
  careerAdvice: string[];
  nextSteps: string[];
  summary: string;
} {
  const categoryNames = {
    CREATIVE: "luova",
    LEADERSHIP: "johtaja", 
    INNOVOIJA: "innovoija",
    RAKENTAJA: "rakentaja",
    AUTTAJA: "auttaja",
    YMPARISTO: "ympäristön-puolustaja",
    VISIONAARI: "visionääri",
    JARJESTAJA: "järjestäjä"
  };

  const groupNames = {
    YLA: "yläasteen oppilas",
    TASO2: "toisen asteen opiskelija", 
    NUORI: "nuori aikuinen"
  };

  const topCategoryNames = topCategories.map(cat => categoryNames[cat as keyof typeof categoryNames]).join(", ");
  const groupName = groupNames[group as keyof typeof groupNames];

  // Generate personality insights based on top categories
  const personalityInsights = [];
  if (topCategories.includes("CREATIVE")) {
    personalityInsights.push("Sinulla on vahva luova puoli ja kyky nähdä asioita uudella tavalla");
  }
  if (topCategories.includes("LEADERSHIP")) {
    personalityInsights.push("Olet luontaisesti johtava persoona, joka osaa motivoida muita");
  }
  if (topCategories.includes("INNOVOIJA")) {
    personalityInsights.push("Kiinnostut teknologiaan ja uusiin innovaatioihin");
  }
  if (topCategories.includes("RAKENTAJA")) {
    personalityInsights.push("Pidät käytännön tekemisestä ja konkreettisista tuloksista");
  }
  if (topCategories.includes("AUTTAJA")) {
    personalityInsights.push("Haluat auttaa muita ja tehdä merkityksellistä työtä");
  }
  if (topCategories.includes("YMPARISTO")) {
    personalityInsights.push("Olet kiinnostunut ympäristönsuojelusta ja kestävästä kehityksestä");
  }
  if (topCategories.includes("VISIONAARI")) {
    personalityInsights.push("Ajattelet strategisesti ja näet pitkälle tulevaisuuteen");
  }
  if (topCategories.includes("JARJESTAJA")) {
    personalityInsights.push("Olet hyvä organisoimaan ja järjestämään asioita");
  }

  // Generate strengths based on scores
  const strengths = [];
  const sortedScores = Object.entries(categoryScores).sort(([,a], [,b]) => b - a);
  
  if (sortedScores[0] && sortedScores[0][1] > 0) {
    const topStrength = categoryNames[sortedScores[0][0] as keyof typeof categoryNames];
    strengths.push(`Vahvin puolesi on ${topStrength} ala`);
  }
  
  if (sortedScores[1] && sortedScores[1][1] > 0) {
    const secondStrength = categoryNames[sortedScores[1][0] as keyof typeof categoryNames];
    strengths.push(`Toinen vahva puolesi on ${secondStrength} ala`);
  }

  // Generate personalized career advice
  const careerAdvice = [];
  careerAdvice.push(`Suosittelemme sinulle ${topCategoryNames} alan urapolkuja`);
  
  if (group === "YLA") {
    careerAdvice.push("Koska olet vielä nuori, voit tutkia erilaisia aloja ja löytää kiinnostuksesi");
    careerAdvice.push("Kokeile erilaisia harrastuksia ja projekteja löytääksesi vahvuutesi");
  } else if (group === "TASO2") {
    careerAdvice.push("Nyt on hyvä aika alkaa suunnitella jatko-opintoja ja urapolkua");
    careerAdvice.push("Harkitse AMK- tai yliopisto-opintoja suositteiltujen alojen parissa");
  } else {
    careerAdvice.push("Voit aloittaa urapolun suositteiltujen alojen parissa");
    careerAdvice.push("Harkitse koulutusta tai työkokemusta näillä aloilla");
  }

  // Generate next steps
  const nextSteps = [];
  nextSteps.push("Tutustu suositteiltuihin ammatteihin tarkemmin");
  nextSteps.push("Hae lisätietoja koulutuksesta ja työmahdollisuuksista");
  nextSteps.push("Kokeile harrastuksia tai projekteja suositteiltujen alojen parissa");
  nextSteps.push("Ota yhteyttä alan ammattilaisiin ja kysy heidän kokemuksistaan");

  // Generate summary
  const summary = `Olet ${groupName}, jolla on vahva kiinnostus ${topCategoryNames} aloihin. ` +
    `Suosittelemme sinulle ${recommendations.length} ammattia, jotka sopivat hyvin persoonallisuutesi ja kiinnostuksiesi kanssa. ` +
    `Nämä alat tarjoavat sinulle mahdollisuuden hyödyntää vahvuuksiasi ja tehdä merkityksellistä työtä.`;

  return {
    personalityInsights,
    strengths,
    careerAdvice,
    nextSteps,
    summary
  };
}

function generateCareerRecommendations(topCategories: string[], group: string): CareerFI[] {
  const recommendations: CareerFI[] = [];
  
  // Get careers from top categories
  topCategories.forEach(categoryKey => {
    const careers = getCareersByCategory(categoryKey);
    if (careers.length > 0) {
      // Add 1-2 careers from each top category
      const careersToAdd = careers.slice(0, 2);
      recommendations.push(...careersToAdd);
    }
  });

  // If we don't have enough recommendations, add from other categories
  if (recommendations.length < 3) {
    const allCategories = Object.keys(CAREER_CATEGORIES);
    const remainingCategories = allCategories.filter(cat => !topCategories.includes(cat));
    
    for (const categoryKey of remainingCategories) {
      const careers = getCareersByCategory(categoryKey);
      if (careers.length > 0 && recommendations.length < 5) {
        recommendations.push(careers[0]);
      }
    }
  }

  // Return 3-5 recommendations
  return recommendations.slice(0, 5);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { group, questions, answers } = body;

    if (!group || !questions || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields: group, questions, answers' },
        { status: 400 }
      );
    }

    // Validate answers for quality
    const validation = validateAnswers(answers);
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        error: 'Invalid answers',
        message: validation.reason,
        suggestion: 'Please retake the test and provide thoughtful answers to get meaningful career recommendations.'
      }, { status: 400 });
    }

    // Calculate category scores based on answers
    const categoryScores = calculateCategoryScores(group, answers);
    
    // Get top categories with meaningful scores
    const topCategories = getTopCategories(categoryScores, 3);
    
    // If no categories meet the threshold, return a message
    if (topCategories.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No clear preferences detected',
        message: 'Your answers don\'t show clear preferences for any career category. Please retake the test with more thoughtful answers.',
        suggestion: 'Try to think about what really interests you and answer accordingly.'
      }, { status: 400 });
    }
    
    // Generate career recommendations using real career data
    const recommendations = generateCareerRecommendations(topCategories, group);

    // Generate AI-powered analysis
    const aiAnalysis = generateAIAnalysis(group, categoryScores, topCategories, recommendations);

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
        categoryScores,
        topCategories,
        recommendations: recommendations.map(career => ({
          id: career.id,
          title_fi: career.title_fi,
          title_en: career.title_en,
          category: career.category,
          short_description: career.short_description,
          main_tasks: career.main_tasks.slice(0, 3), // First 3 tasks
          education_paths: career.education_paths.slice(0, 2), // First 2 paths
          salary_eur_month: career.salary_eur_month,
          job_outlook: career.job_outlook,
          keywords: career.keywords.slice(0, 5) // First 5 keywords
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
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
