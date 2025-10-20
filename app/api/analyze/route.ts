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

function getTopCategories(scores: { [key: string]: number }, limit: number = 3) {
  const sortedCategories = Object.entries(scores)
    .sort(([, a], [, b]) => b - a);
  
  // Only return categories with meaningful scores (at least 15% above average)
  const averageScore = sortedCategories.reduce((sum, [, score]) => sum + score, 0) / sortedCategories.length;
  const threshold = averageScore * 1.15;
  
  return sortedCategories
    .filter(([, score]: [string, number]) => score >= threshold)
    .slice(0, limit)
    .map(([key]: [string, number]) => key);
}

function getCareersByCategory(categoryKey: string): CareerFI[] {
  const category = CAREER_CATEGORIES[categoryKey as keyof typeof CAREER_CATEGORIES];
  if (!category) return [];
  
  return careersData.filter((career: any) => career.category === category);
}

function generateAIAnalysis(group: string, categoryScores: { [key: string]: number }, topCategories: string[], recommendations: CareerFI[]): {
  personalityInsights: string[];
  strengths: string[];
  careerAdvice: string[];
  nextSteps: string[];
  summary: string;
} {
  const groupNames = {
    YLA: "yläasteen oppilas",
    TASO2: "toisen asteen opiskelija", 
    NUORI: "nuori aikuinen"
  };

  const groupName = groupNames[group as keyof typeof groupNames];
  
  // Get the top category for personalized analysis
  const sortedScores = Object.entries(categoryScores).sort(([,a], [,b]) => b - a);
  const topCategory = sortedScores[0] ? sortedScores[0][0] : "CREATIVE";
  
  // Generate personalized analysis based on the top category
  const analysis = generatePersonalizedAnalysis(topCategory, groupName, recommendations.length);
  
  return {
    personalityInsights: analysis.personalityInsights,
    strengths: analysis.strengths,
    careerAdvice: analysis.careerAdvice,
    nextSteps: analysis.nextSteps,
    summary: analysis.summary
  };
}

function generatePersonalizedAnalysis(topCategory: string, groupName: string, recommendationCount: number): {
  personalityInsights: string[];
  strengths: string[];
  careerAdvice: string[];
  nextSteps: string[];
  summary: string;
} {
  const analyses = {
    CREATIVE: {
      opening: "Sun mieli toimii kuin väripaletti – täynnä ideoita, tarinoita ja visioita, jotka haluavat päästä ulos maailmaan. Sä näet kauneutta ja mahdollisuuksia siellä, missä muut eivät edes katso.",
      strengths: [
        "Luova ajattelu ja kyky nähdä yhteyksiä eri asioiden välillä",
        "Tunteiden ja visuaalisuuden yhdistäminen työssä",
        "Kyky inspiroida muita omalla ilmaisulla"
      ],
      workEnvironment: "Paikat, joissa vapaus ja itseilmaisu kukoistavat — kuten markkinointi, muotoilu, media tai taide. Sä tarvitset ympäristön, jossa ideat virtaavat ja luovuus saa kasvaa.",
      nextSteps: [
        "Kokeile projekteja, joissa voit näyttää omaa tyyliäsi",
        "Etsi mentorin tai yhteisön, joka tukee luovuuttasi",
        "Rakenna portfolio, joka näyttää kuka sä olet"
      ]
    },
    LEADERSHIP: {
      opening: "Sä et vain seuraa suuntaa – sä luot sen. Johtajuus tulee sulle luonnostaan, ja ihmiset tuntevat olonsa turvalliseksi sun ohjauksessa.",
      strengths: [
        "Vahva vastuunotto ja päätöksentekokyky",
        "Kyky motivoida ja ohjata muita",
        "Luontainen karisma ja suunnan näyttäminen"
      ],
      workEnvironment: "Dynaamiset tiimit, joissa voit johtaa projekteja ja kehittää strategioita. Sä loistat paikoissa, joissa pääset vaikuttamaan ja tekemään päätöksiä.",
      nextSteps: [
        "Ota vastuuta tiimiprojekteissa tai vapaaehtoistyössä",
        "Opettele delegointia ja palautteen antoa",
        "Harkitse johtamiskoulutusta tai yrittäjyyttä"
      ]
    },
    INNOVOIJA: {
      opening: "Sä et pelkää kysyä \"entä jos?\" ja just siksi maailma tarvitsee sua. Sä näet ratkaisuja ennen kuin muut näkevät ongelmia.",
      strengths: [
        "Luova ongelmanratkaisu ja uteliaisuus",
        "Teknologinen ja analyyttinen ajattelu",
        "Kyky muuttaa ideat käytännöksi"
      ],
      workEnvironment: "Nopeatempoiset ja teknologiapainotteiset ympäristöt, joissa saa kokeilla ja kehittää uutta. Sä tarvitset tilaa luoda ilman rajoja.",
      nextSteps: [
        "Osallistu hackathoneihin tai startup-yhteisöihin",
        "Rakenna oma projekti tai sovellus",
        "Pysy uteliaana ja seuraa uusinta teknologiaa"
      ]
    },
    RAKENTAJA: {
      opening: "Sulle tekeminen on parasta ajattelua. Sä saat tyytyväisyyttä siitä, kun näet oman kädenjälkesi — jotain konkreettista, joka toimii.",
      strengths: [
        "Käytännönläheisyys ja ongelmanratkaisu",
        "Kärsivällisyys ja huolellisuus",
        "Kyky tehdä asioita tehokkaasti ja laadukkaasti"
      ],
      workEnvironment: "Toiminnalliset ja tavoitteelliset ympäristöt, kuten rakentaminen, insinöörityö, logistiikka tai tekninen suunnittelu.",
      nextSteps: [
        "Hanki kokemusta tekemällä — opi käytännön kautta",
        "Harkitse ammattikoulutusta tai harjoittelupaikkaa",
        "Kehitä taitojasi uusissa teknologioissa"
      ]
    },
    AUTTAJA: {
      opening: "Sun supervoima on empatia. Sä huomaat, kun joku tarvitsee tukea — ja osaat antaa sen aidosti.",
      strengths: [
        "Empaattinen ja kuunteleva luonne",
        "Kyky rakentaa luottamusta ja tukea muita",
        "Vahva vastuuntunto ja halu auttaa"
      ],
      workEnvironment: "Ihmissuhdepainotteiset roolit kuten opetus, hoiva-ala, psykologia tai valmennus. Sä loistat, kun voit tehdä työtä, jolla on merkitys muille.",
      nextSteps: [
        "Kokeile vapaaehtoistyötä tai mentorointia",
        "Opiskele vuorovaikutustaitoja ja ihmismieltä",
        "Pidä huolta myös omista rajoistasi ja jaksamisestasi"
      ]
    },
    YMPARISTO: {
      opening: "Sulla on vahva sisäinen kompassi, joka ohjaa tekemään hyvää. Sä et tyydy pinnalliseen, vaan haluat muuttaa maailmaa kestävämmäksi.",
      strengths: [
        "Arvopohjainen päätöksenteko",
        "Pitkäjänteisyys ja sitoutuminen tärkeisiin asioihin",
        "Luontainen vastuullisuus"
      ],
      workEnvironment: "Paikat, joissa voi vaikuttaa yhteiskuntaan, ympäristöön tai yhteisöihin – kuten järjestöt, vihreä teknologia, tai yhteiskuntatieteet.",
      nextSteps: [
        "Osallistu ympäristö- tai vastuuprojekteihin",
        "Verkostoidu samanhenkisten ihmisten kanssa",
        "Harkitse opintoja kestävän kehityksen aloilla"
      ]
    },
    VISIONAARI: {
      opening: "Sä näet tulevaisuuden ennen kuin muut edes kuulevat siitä. Sun mieli yhdistää luovuuden ja strategian ainutlaatuisella tavalla.",
      strengths: [
        "Strateginen ja kokonaisvaltainen ajattelu",
        "Kyky nähdä iso kuva ja suunnitella pitkälle",
        "Luontainen inspiroija"
      ],
      workEnvironment: "Työt, joissa saa suunnitella, innovoida ja johtaa muutosta – kuten tulevaisuudentutkimus, liiketoiminnan kehitys tai brändistrategia.",
      nextSteps: [
        "Hio taitojasi tulevaisuuden ajattelussa",
        "Harjoittele ideointia ja suunnittelua eri aloilla",
        "Kirjoita ajatuksiasi ylös ja rakenna niistä visio"
      ]
    },
    JARJESTAJA: {
      opening: "Sä saat kaaoksen tuntumaan hallitulta. Järjestys, selkeys ja luotettavuus ovat sulle luonnollisia — ja ne tekee susta korvaamattoman monissa tilanteissa.",
      strengths: [
        "Järjestelmällisyys ja tarkkuus",
        "Hyvä ajanhallinta ja suunnittelu",
        "Luotettavuus ja tasaisuus"
      ],
      workEnvironment: "Roolit, joissa selkeys ja struktuuri on tärkeää — kuten hallinto, projektinhallinta, talous, HR tai logistiikka.",
      nextSteps: [
        "Hio organisaatio- ja viestintätaitojasi",
        "Hae harjoittelupaikkaa koordinoivasta tehtävästä",
        "Kokeile projektijohtamista myös vapaa-ajalla"
      ]
    }
  };

  const analysis = analyses[topCategory as keyof typeof analyses] || analyses.CREATIVE;
  
  // Generate personalized summary based on group and category
  const summary = generatePersonalizedSummary(topCategory, groupName, analysis.opening, recommendationCount);

  return {
    personalityInsights: [analysis.opening],
    strengths: analysis.strengths,
    careerAdvice: [analysis.workEnvironment],
    nextSteps: analysis.nextSteps,
    summary: summary
  };
}

function generatePersonalizedSummary(topCategory: string, groupName: string, opening: string, recommendationCount: number): string {
  const categoryVariations = {
    CREATIVE: {
      YLA: `Olet ${groupName}, jolla on ainutlaatuinen kyky nähdä maailmaa luovasti. ${opening} Löysimme sinulle ${recommendationCount} ammattia, jotka antavat tilaa ilmaista itseäsi ja hyödyntää luovuuttasi.`,
      TASO2: `Olet ${groupName}, jolla on vahva luova persoonallisuus. ${opening} Suosittelemme sinulle ${recommendationCount} urapolkua, jotka sopivat täydellisesti sun luovaan energiaan ja visioihin.`,
      NUORI: `Olet ${groupName}, jolla on kyky muuttaa ideat todellisuudeksi. ${opening} Löysimme sinulle ${recommendationCount} ammattia, jotka tarjoavat tilaa luovuudelle ja itseilmaisulle.`
    },
    LEADERSHIP: {
      YLA: `Olet ${groupName}, jolla on luontainen johtajuuskyky. ${opening} Löysimme sinulle ${recommendationCount} ammattia, joissa voit hyödyntää sun johtamistaitoja ja motivoida muita.`,
      TASO2: `Olet ${groupName}, jolla on vahva johtajuusprofiili. ${opening} Suosittelemme sinulle ${recommendationCount} urapolkua, jotka antavat tilaa johtaa ja vaikuttaa.`,
      NUORI: `Olet ${groupName}, jolla on kyky johtaa muutosta. ${opening} Löysimme sinulle ${recommendationCount} ammattia, joissa voit hyödyntää sun strategista ajattelua ja johtamistaitoja.`
    },
    INNOVOIJA: {
      YLA: `Olet ${groupName}, jolla on innovatiivinen mieli. ${opening} Löysimme sinulle ${recommendationCount} ammattia, jotka antavat tilaa kehittää uutta ja ratkaista ongelmia luovasti.`,
      TASO2: `Olet ${groupName}, jolla on vahva innovaatiokyky. ${opening} Suosittelemme sinulle ${recommendationCount} urapolkua, joissa voit hyödyntää sun teknistä osaamista ja luovaa ajattelua.`,
      NUORI: `Olet ${groupName}, jolla on kyky muuttaa ideat todellisuudeksi. ${opening} Löysimme sinulle ${recommendationCount} ammattia, jotka tarjoavat tilaa innovoida ja kehittää uutta teknologiaa.`
    },
    RAKENTAJA: {
      YLA: `Olet ${groupName}, jolla on käytännönläheinen persoonallisuus. ${opening} Löysimme sinulle ${recommendationCount} ammattia, joissa voit hyödyntää sun käytännön taitoja ja rakentaa konkreettisia asioita.`,
      TASO2: `Olet ${groupName}, jolla on vahva rakentajaprofiili. ${opening} Suosittelemme sinulle ${recommendationCount} urapolkua, jotka antavat tilaa tehdä konkreettista työtä ja nähdä tuloksia.`,
      NUORI: `Olet ${groupName}, jolla on kyky tehdä asioita käytännössä. ${opening} Löysimme sinulle ${recommendationCount} ammattia, joissa voit hyödyntää sun käytännön osaamista ja rakentaa uutta.`
    },
    AUTTAJA: {
      YLA: `Olet ${groupName}, jolla on empaattinen persoonallisuus. ${opening} Löysimme sinulle ${recommendationCount} ammattia, joissa voit hyödyntää sun auttamistaitoja ja tehdä merkityksellistä työtä.`,
      TASO2: `Olet ${groupName}, jolla on vahva auttajaprofiili. ${opening} Suosittelemme sinulle ${recommendationCount} urapolkua, jotka antavat tilaa auttaa muita ja vaikuttaa positiivisesti yhteiskuntaan.`,
      NUORI: `Olet ${groupName}, jolla on kyky auttaa ja tukea muita. ${opening} Löysimme sinulle ${recommendationCount} ammattia, joissa voit hyödyntää sun ihmistaitoja ja tehdä työtä, jolla on merkitys.`
    },
    YMPARISTO: {
      YLA: `Olet ${groupName}, jolla on vahva vastuuntunto. ${opening} Löysimme sinulle ${recommendationCount} ammattia, joissa voit hyödyntää sun arvoja ja vaikuttaa positiivisesti ympäristöön.`,
      TASO2: `Olet ${groupName}, jolla on vahva ympäristöprofiili. ${opening} Suosittelemme sinulle ${recommendationCount} urapolkua, jotka antavat tilaa vaikuttaa kestävään kehitykseen ja yhteiskuntaan.`,
      NUORI: `Olet ${groupName}, jolla on kyky vaikuttaa yhteiskuntaan. ${opening} Löysimme sinulle ${recommendationCount} ammattia, joissa voit hyödyntää sun arvoja ja tehdä työtä, joka muuttaa maailmaa paremmaksi.`
    },
    VISIONAARI: {
      YLA: `Olet ${groupName}, jolla on visionäärinen persoonallisuus. ${opening} Löysimme sinulle ${recommendationCount} ammattia, joissa voit hyödyntää sun strategista ajattelua ja luoda visioita tulevaisuudesta.`,
      TASO2: `Olet ${groupName}, jolla on vahva visionääriprofiili. ${opening} Suosittelemme sinulle ${recommendationCount} urapolkua, jotka antavat tilaa suunnitella tulevaisuutta ja johtaa muutosta.`,
      NUORI: `Olet ${groupName}, jolla on kyky nähdä tulevaisuutta. ${opening} Löysimme sinulle ${recommendationCount} ammattia, joissa voit hyödyntää sun strategista ajattelua ja luoda visioita, jotka inspiroivat muita.`
    },
    JARJESTAJA: {
      YLA: `Olet ${groupName}, jolla on järjestelmällinen persoonallisuus. ${opening} Löysimme sinulle ${recommendationCount} ammattia, joissa voit hyödyntää sun organisointitaitoja ja luoda selkeyttä kaaokseen.`,
      TASO2: `Olet ${groupName}, jolla on vahva järjestäjäprofiili. ${opening} Suosittelemme sinulle ${recommendationCount} urapolkua, jotka antavat tilaa organisoida ja koordinoida toimintaa tehokkaasti.`,
      NUORI: `Olet ${groupName}, jolla on kyky organisoida ja koordinoida. ${opening} Löysimme sinulle ${recommendationCount} ammattia, joissa voit hyödyntää sun järjestelmällisyyttä ja luoda tehokkaita prosesseja.`
    }
  };

  const categoryVariation = categoryVariations[topCategory as keyof typeof categoryVariations];
  return categoryVariation ? categoryVariation[groupName as keyof typeof categoryVariation] : 
    `Olet ${groupName}, jolla on ainutlaatuinen persoonallisuus. ${opening} Löysimme sinulle ${recommendationCount} ammattia, jotka sopivat hyvin sun vahvuuksien kanssa.`;
}

function generateCareerRecommendations(topCategories: string[], group: string, categoryScores: { [key: string]: number }): CareerFI[] {
  const recommendations: CareerFI[] = [];
  
  // Sort categories by score for better recommendations
  const sortedCategories = Object.entries(categoryScores)
    .sort(([,a], [,b]) => b - a)
    .map(([key]: [string, number]) => key);

  // Get careers from top categories with score-based weighting
  sortedCategories.forEach(categoryKey => {
    const careers = getCareersByCategory(categoryKey);
    if (careers.length > 0) {
      // Add more careers from higher-scoring categories
      const score = categoryScores[categoryKey];
      const maxScore = Math.max(...Object.values(categoryScores));
      const weight = score / maxScore;
      
      // Add 1-3 careers based on category strength
      const careersToAdd = careers.slice(0, Math.max(1, Math.round(weight * 3)));
      recommendations.push(...careersToAdd);
    }
  });

  // Ensure we have diverse recommendations by adding from different categories
  if (recommendations.length < 4) {
    const allCategories = Object.keys(CAREER_CATEGORIES);
    const usedCategories = new Set(recommendations.map((c: any) => c.category));
    const remainingCategories = allCategories.filter((cat: string) => !usedCategories.has(CAREER_CATEGORIES[cat as keyof typeof CAREER_CATEGORIES]));
    
    for (const categoryKey of remainingCategories) {
      const careers = getCareersByCategory(categoryKey);
      if (careers.length > 0 && recommendations.length < 5) {
        recommendations.push(careers[0]);
      }
    }
  }

  // Remove duplicates and return 4-5 recommendations
  const uniqueRecommendations = recommendations.filter((career: any, index: number, self: any[]) => 
    index === self.findIndex((c: any) => c.id === career.id)
  );

  return uniqueRecommendations.slice(0, 5);
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
    const recommendations = generateCareerRecommendations(topCategories, group, categoryScores);

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
        recommendations: recommendations.map((career: any) => ({
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
