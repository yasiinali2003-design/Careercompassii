/**
 * CAREER SCORING API ENDPOINT
 * Receives user test answers and returns top career matches
 */

import { NextRequest, NextResponse } from 'next/server';
import { rankCareers, generateUserProfile } from '@/lib/scoring/scoringEngine';
import { Cohort, TestAnswer } from '@/lib/scoring/types';
import { COHORT_COPY } from '@/lib/scoring/cohortConfig';

// ========== REQUEST VALIDATION ==========

interface ScoringRequest {
  cohort: Cohort;
  answers: TestAnswer[];
}

function validateRequest(data: any): { valid: boolean; error?: string } {
  // Check cohort
  if (!data.cohort) {
    return { valid: false, error: 'Missing cohort field' };
  }
  
  if (!['YLA', 'TASO2', 'NUORI'].includes(data.cohort)) {
    return { valid: false, error: `Invalid cohort: ${data.cohort}` };
  }
  
  // Check answers
  if (!data.answers || !Array.isArray(data.answers)) {
    return { valid: false, error: 'Missing or invalid answers field' };
  }
  
  if (data.answers.length === 0) {
    return { valid: false, error: 'No answers provided' };
  }
  
  // Validate each answer
  for (let i = 0; i < data.answers.length; i++) {
    const answer = data.answers[i];
    
    if (typeof answer.questionIndex !== 'number') {
      return { valid: false, error: `Answer ${i}: invalid questionIndex` };
    }
    
    if (typeof answer.score !== 'number' || answer.score < 1 || answer.score > 5) {
      return { valid: false, error: `Answer ${i}: score must be 1-5` };
    }
  }
  
  return { valid: true };
}

// ========== API HANDLER ==========

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
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
    
    const { cohort, answers } = body as ScoringRequest;
    
    // Run scoring algorithm
    console.log(`[API] Scoring ${answers.length} answers for cohort ${cohort}`);
    
    const topCareers = rankCareers(answers, cohort, 5);
    const userProfile = generateUserProfile(answers, cohort);
    
    console.log(`[API] Top career: ${topCareers[0]?.title} (${topCareers[0]?.overallScore}%)`);
    
    // Get cohort-specific copy
    const cohortCopy = COHORT_COPY[cohort];
    
    // Return results
    return NextResponse.json({
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
    });
    
  } catch (error) {
    console.error('[API] Error in scoring endpoint:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
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

