/**
 * QUESTIONS API ENDPOINT
 * Returns question texts for a given cohort (WITHOUT sensitive scoring data)
 * This protects business logic by keeping weights, subdimensions, and mappings server-side
 */

import { NextRequest, NextResponse } from 'next/server';
import { getQuestionMappings } from '@/lib/scoring/dimensions';
import { Cohort } from '@/lib/scoring/types';
import { createLogger } from '@/lib/logger';

const log = createLogger('API/Questions');

// Simple question object with only text and originalQ (no scoring metadata like weights/subdimensions)
interface Question {
  index: number;
  text: string;
  originalQ?: number;  // For question pool mapping
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cohort = searchParams.get('cohort') as Cohort;
    const setIndexParam = searchParams.get('setIndex');
    const setIndex = setIndexParam ? parseInt(setIndexParam, 10) : 0;
    const subCohort = searchParams.get('subCohort'); // For TASO2: LUKIO or AMIS

    // Validate cohort
    if (!cohort || !['YLA', 'TASO2', 'NUORI'].includes(cohort)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Virheellinen tai puuttuva kohortti-parametri'
        },
        { status: 400 }
      );
    }

    // Validate subCohort if provided for TASO2
    if (cohort === 'TASO2' && subCohort && !['LUKIO', 'AMIS'].includes(subCohort)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Virheellinen subCohort-parametri (LUKIO tai AMIS)'
        },
        { status: 400 }
      );
    }

    // Get question mappings (server-side only)
    // Pass subCohort to get TASO2-specific questions (LUKIO or AMIS)
    const mappings = getQuestionMappings(cohort, setIndex, subCohort || undefined);

    // Extract ONLY the question text and originalQ (strip out all scoring metadata like weights/subdimensions)
    // IMPORTANT: Deduplicate by question index - some questions have dual mappings (affect multiple dimensions)
    // but we only want to show each question ONCE to the user
    const seenIndices = new Set<number>();
    const questions: Question[] = [];

    for (const mapping of mappings) {
      if (!seenIndices.has(mapping.q)) {
        seenIndices.add(mapping.q);
        questions.push({
          index: mapping.q,
          text: mapping.text,
          originalQ: mapping.originalQ
        });
      }
    }

    return NextResponse.json({
      success: true,
      questions,
      cohort,
      totalQuestions: questions.length
    });

  } catch (error) {
    log.error('Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Sisäinen palvelinvirhe'
      },
      { status: 500 }
    );
  }
}
