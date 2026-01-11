/**
 * CAREER SCORING API ENDPOINT
 * Receives user test answers and returns top career matches
 */

import { NextRequest, NextResponse } from 'next/server';
import { rankCareers, generateUserProfile } from '@/lib/scoring/scoringEngine';
import { Cohort, TestAnswer } from '@/lib/scoring/types';
import { COHORT_COPY } from '@/lib/scoring/cohortConfig';
import { calculateEducationPath } from '@/lib/scoring/educationPath';
import { supabaseAdmin } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rateLimit';
import { unshuffleAnswers } from '@/lib/questionShuffle';
import { createLogger } from '@/lib/logger';

const log = createLogger('API/Score');

// ========== EDUCATION PATH CAREER FILTERING ==========

/**
 * Helper to determine education level from career's education_paths
 */
function getCareerEducationLevel(educationPaths: string[] | undefined): ('yliopisto' | 'amk' | 'both' | 'amis_only' | 'other') {
  if (!educationPaths || educationPaths.length === 0) return 'other';
  
  const paths = educationPaths.map(p => p.toLowerCase());
  
  const hasYliopisto = paths.some(p => 
    p.includes('yliopisto') || 
    p.includes('maisteri') ||
    p.includes('kandidaatti')
  );
  const hasAMK = paths.some(p => 
    p.includes('amk') || 
    p.includes('ammattikorkeakoulu')
  );
  const hasAmis = paths.some(p => 
    p.includes('toinen aste') || 
    p.includes('ammattikoulu') || 
    p.includes('ammattitutkinto') || 
    p.includes('perustutkinto') ||
    p.includes('ammatillinen')
  );
  
  if (hasYliopisto && hasAMK) return 'both';
  if (hasYliopisto) return 'yliopisto';
  if (hasAMK) return 'amk';
  if (hasAmis && !hasYliopisto && !hasAMK) return 'amis_only';
  return 'other';
}

/**
 * Checks if a career requires ONLY ammattikoulu (no AMK/yliopisto path)
 * These careers should NOT be recommended to LUKIO students
 */
function isAmisOnlyCareer(educationPaths: string[] | undefined): boolean {
  return getCareerEducationLevel(educationPaths) === 'amis_only';
}

/**
 * Filter careers based on the student's current education path
 * - LUKIO students should NOT see careers that only require ammattikoulu
 * - AMIS students CAN see all careers (they can do amis-level jobs)
 */
function filterCareersByStudentPath(
  careers: any[],
  subCohort?: string
): any[] {
  // Only filter for LUKIO students
  if (subCohort !== 'LUKIO') {
    return careers;
  }
  
  // Filter out amis-only careers for LUKIO students
  const filtered = careers.filter(career => {
    const level = getCareerEducationLevel(career.educationPaths);
    if (level === 'amis_only') {
      log.debug(`Filtered out amis-only career for LUKIO student: ${career.title}`);
      return false;
    }
    return true;
  });
  
  log.debug(`Filtered careers for LUKIO: ${careers.length} -> ${filtered.length} (removed ${careers.length - filtered.length} amis-only careers)`);
  
  return filtered;
}

/**
 * Ensures career diversity when user has both yliopisto and amk recommended
 * Returns a balanced selection of careers from both education levels
 */
function ensureEducationPathDiversity(
  careers: any[],
  educationPath: any,
  limit: number = 5
): any[] {
  // Only apply diversity logic for TASO2 with dual paths
  if (!educationPath?.scores) return careers.slice(0, limit);
  
  const scores = educationPath.scores as { yliopisto?: number; amk?: number };
  const yliopistoScore = scores.yliopisto || 0;
  const amkScore = scores.amk || 0;
  
  // Check if both paths are close (within 20 points) or if there's a secondary path
  const hasDualPath = educationPath.secondary || (Math.abs(yliopistoScore - amkScore) <= 20);
  
  if (!hasDualPath) {
    return careers.slice(0, limit);
  }
  
  log.debug(`Dual education path detected: yliopisto=${yliopistoScore}, amk=${amkScore}`);
  
  // Categorize careers by education level
  const yliopistoCareers: any[] = [];
  const amkCareers: any[] = [];
  const bothCareers: any[] = [];
  const otherCareers: any[] = [];
  
  for (const career of careers) {
    const level = getCareerEducationLevel(career.educationPaths);
    switch (level) {
      case 'yliopisto':
        yliopistoCareers.push(career);
        break;
      case 'amk':
        amkCareers.push(career);
        break;
      case 'both':
        bothCareers.push(career);
        break;
      default:
        otherCareers.push(career);
    }
  }
  
  log.debug(`Career distribution: yliopisto=${yliopistoCareers.length}, amk=${amkCareers.length}, both=${bothCareers.length}, other=${otherCareers.length}`);
  
  // Build diverse selection
  const result: any[] = [];
  const usedSlugs = new Set<string>();
  
  // Determine target counts based on score ratio
  const totalScore = yliopistoScore + amkScore;
  const yliopistoRatio = totalScore > 0 ? yliopistoScore / totalScore : 0.5;
  const targetYliopisto = Math.round(limit * yliopistoRatio);
  const targetAmk = limit - targetYliopisto;
  
  // Add careers from yliopisto pool
  let yliopistoAdded = 0;
  for (const career of yliopistoCareers) {
    if (yliopistoAdded >= targetYliopisto) break;
    if (!usedSlugs.has(career.slug)) {
      result.push(career);
      usedSlugs.add(career.slug);
      yliopistoAdded++;
    }
  }
  
  // Add careers from amk pool
  let amkAdded = 0;
  for (const career of amkCareers) {
    if (amkAdded >= targetAmk) break;
    if (!usedSlugs.has(career.slug)) {
      result.push(career);
      usedSlugs.add(career.slug);
      amkAdded++;
    }
  }
  
  // Fill remaining slots with 'both' or 'other' careers (or any remaining)
  const remaining = [...bothCareers, ...otherCareers, ...yliopistoCareers, ...amkCareers];
  for (const career of remaining) {
    if (result.length >= limit) break;
    if (!usedSlugs.has(career.slug)) {
      result.push(career);
      usedSlugs.add(career.slug);
    }
  }
  
  // Sort by overall score to maintain quality
  result.sort((a, b) => b.overallScore - a.overallScore);
  
  log.debug(`Diversified careers: ${result.map(c => `${c.title} (${getCareerEducationLevel(c.educationPaths)})`).join(', ')}`);
  
  return result;
}

// ========== REQUEST VALIDATION ==========

interface ScoringRequest {
  cohort: Cohort;
  answers: TestAnswer[];
}

function validateRequest(data: any): { valid: boolean; error?: string } {
  // Check cohort
  if (!data.cohort) {
    return { valid: false, error: 'Puuttuva kohorttikenttä' };
  }
  
  if (!['YLA', 'TASO2', 'NUORI'].includes(data.cohort)) {
    return { valid: false, error: `Virheellinen kohortti: ${data.cohort}` };
  }
  
  // Check answers
  if (!data.answers || !Array.isArray(data.answers)) {
    return { valid: false, error: 'Puuttuva tai virheellinen vastauskenttä' };
  }
  
  if (data.answers.length === 0) {
    return { valid: false, error: 'Vastauksia ei annettu' };
  }
  
  // Validate each answer
  for (let i = 0; i < data.answers.length; i++) {
    const answer = data.answers[i];
    
    if (typeof answer.questionIndex !== 'number') {
      return { valid: false, error: `Vastaus ${i}: virheellinen kysymysindeksi` };
    }
    
    if (typeof answer.score !== 'number' || answer.score < 1 || answer.score > 5) {
      return { valid: false, error: `Vastaus ${i}: pisteet täytyy olla 1-5` };
    }
  }
  
  return { valid: true };
}

// ========== API HANDLER ==========

export async function POST(request: NextRequest) {
  try {
    // Check rate limit (GDPR-compliant hashed IP)
    const rateLimitCheck = await checkRateLimit(request);
    if (rateLimitCheck) {
      return NextResponse.json(
        { 
          success: false, 
          error: rateLimitCheck.message || 'Liian monta pyyntöä',
          code: 'RATE_LIMIT_EXCEEDED'
        },
        { 
          status: 429,
          headers: rateLimitCheck.headers
        }
      );
    }
    
    // Parse request body with error handling for malformed JSON
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Virheellinen JSON-muoto pyynnössä'
        },
        { status: 400 }
      );
    }
    
    // Validate input
    const validation = validateRequest(body);
    if (!validation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          error: validation.error 
        },
        { status: 400 }
      );
    }
    
    const { cohort, answers, originalIndices, shuffleKey, currentOccupation, subCohort } = body as ScoringRequest & { originalIndices?: number[]; shuffleKey?: string; currentOccupation?: string; subCohort?: string };

    // IMPORTANT: Answers are already mapped to originalQ indices by the client
    // The client sends questionIndex as the originalQ (0-29 for YLA/TASO2/NUORI), not shuffled position
    // So we don't need to unshuffle - answers are already in correct order
    // Verify: answers should have questionIndex values that match originalQ (0-29 range)
    let unshuffledAnswers = answers;
    
    // Check if answers appear to be in shuffled format (questionIndex matches array position)
    // vs originalQ format (questionIndex is 0-29 but not sequential)
    const isShuffledFormat = answers.length > 0 && 
      answers.every((a, idx) => a.questionIndex === idx);
    
    if (isShuffledFormat && originalIndices && shuffleKey && originalIndices.length > 0) {
      // Legacy: if client sends shuffled positions, unshuffle them
      log.debug(`Legacy unshuffle detected, unshuffling ${answers.length} answers`);
      unshuffledAnswers = unshuffleAnswers(answers, originalIndices);
    } else {
      // Modern flow: answers already have correct questionIndex (originalQ)
      log.debug(`Using answers directly (already mapped to originalQ): ${answers.length} answers`);
      unshuffledAnswers = answers;
    }

    // Run scoring algorithm with unshuffled answers
    // IMPORTANT: Pass subCohort to use correct question mappings for TASO2 LUKIO/AMIS
    log.debug(`Scoring ${unshuffledAnswers.length} answers for cohort ${cohort}${subCohort ? ` (${subCohort})` : ''}${currentOccupation ? ` (filtering out: ${currentOccupation})` : ''}`);

    // For TASO2, get more careers initially to allow for education path diversity
    const initialLimit = cohort === 'TASO2' ? 10 : 5;
    let topCareers = rankCareers(unshuffledAnswers, cohort, initialLimit, currentOccupation, subCohort);
    const userProfile = generateUserProfile(unshuffledAnswers, cohort, currentOccupation, subCohort);
    
    log.info(`Top career: ${topCareers[0]?.title} (${topCareers[0]?.overallScore}%)`);
    
    // Calculate education path (all cohorts)
    let educationPath;
    if (cohort === 'NUORI') {
      // NUORI: Category-based education recommendations for young adults
      const topCareer = topCareers[0];
      const category = topCareer?.category || 'innovoija';

      const pathMap: Record<string, { primary: string; reasoning: string }> = {
        innovoija: {
          primary: 'bootcamp_tai_amk',
          reasoning: 'Teknologia-alalla pääset alkuun nopeasti bootcamp-koulutuksella tai AMK-tutkinnolla. Molemmat yhdistävät käytännön osaamisen ja teorian tehokkaasti.'
        },
        auttaja: {
          primary: 'amk_tai_yliopisto',
          reasoning: 'Hoiva- ja terveysalalla AMK tai yliopisto antavat tarvittavan pätevyyden. Valinta riippuu siitä, haluatko enemmän käytäntöä (AMK) vai tutkimusta (yliopisto).'
        },
        luova: {
          primary: 'portfolio_ja_verkostot',
          reasoning: 'Luovilla aloilla portfolio ja verkostot ovat usein tärkeämpiä kuin tutkinto. Harkitse lyhytkursseja ja freelance-töitä kokemuksen kartuttamiseksi.'
        },
        johtaja: {
          primary: 'amk_tai_tyokokemus',
          reasoning: 'Liiketoiminta- ja johtamisosaaminen kehittyy parhaiten käytännössä. AMK-tutkinto antaa hyvän pohjan, mutta työkokemus on yhtä arvokasta.'
        },
        visionaari: {
          primary: 'yliopisto_tai_amk',
          reasoning: 'Strateginen ajattelu ja analytiikka hyötyvät korkeakoulututkinnosta. Yliopisto sopii tutkimukselliseen, AMK käytännönläheisempään lähestymistapaan.'
        },
        rakentaja: {
          primary: 'ammattikoulu_tai_tyopaikka',
          reasoning: 'Käytännön ammateissa pääset nopeimmin alkuun suoralla työkokemuksella tai ammattikoulutuksella. Monet työnantajat kouluttavat itse.'
        },
        jarjestaja: {
          primary: 'amk',
          reasoning: 'Organisointi- ja hallintotyöhön AMK-tutkinto antaa hyvän pohjan. Yhdistää käytännön osaamisen ja teorian tasapainoisesti.'
        },
        'ympariston-puolustaja': {
          primary: 'yliopisto_tai_amk',
          reasoning: 'Ympäristöalalla koulutus on arvostettua. Yliopisto antaa syvempää tietoa, AMK keskittyy käytännön ratkaisuihin.'
        }
      };

      const path = pathMap[category] || pathMap.innovoija;
      educationPath = {
        primary: path.primary,
        reasoning: path.reasoning,
        scores: { [path.primary]: 85 },
        confidence: 'medium' as const
      };
      log.debug(`NUORI Education path: ${path.primary} (category-based)`);
    } else if (cohort === 'YLA' || cohort === 'TASO2') {
      // IMPROVEMENT 4: AMIS students (vocational) get appropriate education path options
      // In Finland, ammattikoulu students CAN apply to yliopisto, but also have other options
      const isAMIS = subCohort === 'AMIS';

      if (isAMIS) {
        // AMIS-specific education paths
        const topCareer = topCareers[0];
        const category = topCareer?.category || 'rakentaja';

        // AMIS students have multiple valid paths in Finland:
        // 1. Direct work (työ) - most common for vocational graduates
        // 2. Apprenticeship (oppisopimus) - work + training
        // 3. AMK - apply with vocational degree
        // 4. Yliopisto - possible but requires preparation/open university
        // 5. Erikoisammattitutkinto - advanced vocational qualification

        const amisPathMap: Record<string, {
          primary: string;
          secondary?: string;
          reasoning: string;
          scores: Record<string, number>;
        }> = {
          rakentaja: {
            primary: 'tyoelama_tai_oppisopimus',
            secondary: 'amk',
            reasoning: 'Ammattikoulupohjalla pääset suoraan töihin ja kartuttamaan kokemusta. Oppisopimuskoulutus yhdistää työn ja oppimisen. AMK-opinnot ovat myös mahdollisia myöhemmin.',
            scores: { tyoelama_tai_oppisopimus: 85, amk: 60, yliopisto: 40 }
          },
          innovoija: {
            primary: 'amk_tai_tyoelama',
            secondary: 'yliopisto',
            reasoning: 'IT-alalla AMK-tutkinto tai suora työkokemus ovat molemmat arvostettuja. Yliopisto-opinnot ovat mahdollisia avoimen yliopiston kautta.',
            scores: { amk_tai_tyoelama: 80, yliopisto: 55 }
          },
          auttaja: {
            primary: 'amk',
            secondary: 'tyoelama',
            reasoning: 'Hoitoalalla AMK-tutkinto (esim. sairaanhoitaja) avaa laajemmat mahdollisuudet. Lähihoitajana voit myös työskennellä suoraan.',
            scores: { amk: 75, tyoelama: 70, yliopisto: 45 }
          },
          luova: {
            primary: 'portfolio_ja_tyoelama',
            secondary: 'amk',
            reasoning: 'Luovilla aloilla portfolio ja työkokemus ovat usein tärkeämpiä kuin tutkinto. AMK-opinnot (esim. muotoilu) voivat syventää osaamista.',
            scores: { portfolio_ja_tyoelama: 80, amk: 65 }
          },
          johtaja: {
            primary: 'tyokokemus_ja_amk',
            reasoning: 'Yrittäjyys ja liiketoiminta kehittyvät parhaiten käytännössä. AMK-tradenomitutkinto antaa liiketoimintaosaamista.',
            scores: { tyokokemus_ja_amk: 80, amk: 70, yliopisto: 50 }
          },
          'ympariston-puolustaja': {
            primary: 'amk_tai_tyoelama',
            reasoning: 'Ympäristöalalla AMK-insinööri tai suora työ maatilalla/puutarhassa ovat hyviä vaihtoehtoja.',
            scores: { amk_tai_tyoelama: 75, yliopisto: 55 }
          },
          jarjestaja: {
            primary: 'amk_tai_tyoelama',
            reasoning: 'Hallinto- ja toimistotyössä AMK-tutkinto (tradenomi) tai suora työkokemus ovat molemmat hyviä polkuja.',
            scores: { amk_tai_tyoelama: 75, yliopisto: 50 }
          },
          visionaari: {
            primary: 'amk_tai_avoin_yliopisto',
            reasoning: 'Strateginen ajattelu kehittyy korkeakouluopinnoissa. Avoin yliopisto on hyvä tapa tutustua yliopisto-opintoihin.',
            scores: { amk_tai_avoin_yliopisto: 70, yliopisto: 60 }
          }
        };

        const path = amisPathMap[category] || amisPathMap.rakentaja;
        educationPath = {
          primary: path.primary,
          secondary: path.secondary,
          reasoning: path.reasoning,
          scores: path.scores,
          confidence: 'medium' as const
        };
        log.debug(`TASO2_AMIS Education path: ${path.primary} (vocational-appropriate)`);
      } else {
        // LUKIO or generic TASO2 - use standard calculation
        educationPath = calculateEducationPath(unshuffledAnswers, cohort);
        if (educationPath) {
          const primaryPath = 'primary' in educationPath ? educationPath.primary : undefined;
          if (primaryPath) {
            const scoreKey = cohort === 'YLA'
              ? (educationPath as any).scores[primaryPath as string]
              : (educationPath as any).scores[primaryPath as string];
            log.debug(`Education path: ${primaryPath} (${Math.round(scoreKey)}%)`);
          }
        }
      }
    } else {
      educationPath = null;
    }
    
    // STEP 1: Filter out careers that don't match the student's education path
    // LUKIO students should NOT see careers that only require ammattikoulu
    // (e.g., Lähihoitaja, Maalari, Kirvesmies) because they would need to go back to AMIS
    if (cohort === 'TASO2') {
      topCareers = filterCareersByStudentPath(topCareers, subCohort);
    }
    
    // STEP 2: Apply education path diversity for TASO2 cohort
    // This ensures career recommendations include both yliopisto and AMK level careers
    // when the user qualifies for both education paths
    if (cohort === 'TASO2' && educationPath && topCareers.length > 5) {
      log.debug('Applying education path diversity for TASO2...');
      topCareers = ensureEducationPathDiversity(topCareers, educationPath, 5);
    } else if (topCareers.length > 5) {
      // For other cohorts, just take top 5
      topCareers = topCareers.slice(0, 5);
    }
    
    // Get cohort-specific copy
    const cohortCopy = COHORT_COPY[cohort];
    
    // Save to Supabase (skip if not configured)
    // Store COMPLETE results including all career details, analysis, and education path
    let resultId: string | null = null;
    if (supabaseAdmin) {
      try {
        // Store the FULL results so they can be retrieved exactly as shown
        const fullResults = {
          success: true,
          cohort,
          userProfile: {
            dimensionScores: userProfile.dimensionScores,
            topStrengths: userProfile.topStrengths,
            cohort: userProfile.cohort,
            personalizedAnalysis: userProfile.personalizedAnalysis
          },
          topCareers: topCareers.map(career => ({
            slug: career.slug,
            title: career.title,
            category: career.category,
            overallScore: career.overallScore,
            dimensionScores: career.dimensionScores,
            reasons: career.reasons,
            confidence: career.confidence,
            salaryRange: career.salaryRange,
            outlook: career.outlook
          })),
          educationPath: educationPath || null,
          cohortCopy: COHORT_COPY[cohort]
        };

        const testResult = {
          cohort,
          school_code: body.schoolCode || null,
          education_path_primary: educationPath?.primary || null,
          education_path_scores: educationPath ? educationPath.scores : null,
          top_careers: topCareers.map(c => ({
            slug: c.slug,
            title: c.title,
            score: c.overallScore
          })),
          dimension_scores: userProfile.dimensionScores,
          time_spent_seconds: body.timeSpentSeconds || null,
          completed: true,
          // Store complete results as JSON for exact retrieval
          full_results: fullResults
        };

        // Try to insert with full_results first, fall back to without if column doesn't exist
        let { data, error } = await supabaseAdmin
          .from('test_results')
          .insert(testResult as any)
          .select('id')
          .single() as { data: { id: string } | null; error: any };

        // If the error is about missing full_results column, retry without it
        if (error?.code === 'PGRST204' && error?.message?.includes('full_results')) {
          log.debug('full_results column not found, retrying without it');
          const { full_results, ...testResultWithoutFullResults } = testResult;
          const retryResult = await supabaseAdmin
            .from('test_results')
            .insert(testResultWithoutFullResults as any)
            .select('id')
            .single() as { data: { id: string } | null; error: any };
          data = retryResult.data;
          error = retryResult.error;
        }

        if (error) {
          log.error('Error saving to Supabase:', error);
        } else if (data) {
          resultId = data.id;
          log.info('Saved to Supabase with ID:', resultId);
        }
      } catch (dbError) {
        log.error('Database error:', dbError);
        // Continue anyway - don't fail the request if DB save fails
      }
    } else {
      log.warn('Supabase not configured, skipping database save');
    }
    
    // Build response
    const response: any = {
      success: true,
      cohort,
      resultId, // Include database ID for feedback linking
      userProfile: {
        dimensionScores: userProfile.dimensionScores,
        topStrengths: userProfile.topStrengths,
        cohort: userProfile.cohort,
        personalizedAnalysis: userProfile.personalizedAnalysis,
        // NEW: Enhanced profile data
        categoryAffinities: userProfile.categoryAffinities,
        hybridPaths: userProfile.hybridPaths,
        profileConfidence: userProfile.profileConfidence
      },
      topCareers: topCareers.map(career => ({
        slug: career.slug,
        title: career.title,
        category: career.category,
        overallScore: career.overallScore,
        dimensionScores: career.dimensionScores,
        reasons: career.reasons,
        confidence: career.confidence,
        salaryRange: career.salaryRange,
        outlook: career.outlook
      })),
      cohortCopy: {
        title: cohortCopy.title,
        subtitle: cohortCopy.subtitle,
        ctaText: cohortCopy.ctaText,
        shareText: cohortCopy.shareText
      },
      meta: {
        timestamp: new Date().toISOString(),
        answersCount: answers.length
      }
    };
    
    // Add education path for YLA and TASO2
    if (educationPath) {
      response.educationPath = educationPath;
    }
    
    // Return results
    return NextResponse.json(response);
    
  } catch (error) {
    log.error('Error in scoring endpoint:', error);

    return NextResponse.json(
      { 
        success: false, 
        error: 'Sisäinen palvelinvirhe',
        details: error instanceof Error ? error.message : 'Tuntematon virhe'
      },
      { status: 500 }
    );
  }
}

// ========== HEALTH CHECK ==========

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/score',
    method: 'POST',
    description: 'Career scoring endpoint',
    version: '1.0.0'
  });
}

