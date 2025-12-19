/**
 * QUESTIONS API ENDPOINT
 * Returns question texts for a given cohort (WITHOUT sensitive scoring data)
 * This protects business logic by keeping weights, subdimensions, and mappings server-side
 */

import { NextRequest, NextResponse } from 'next/server';
import { getQuestionMappings } from '@/lib/scoring/dimensions';
import { Cohort } from '@/lib/scoring/types';

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

    // Get question mappings (server-side only)
    const mappings = getQuestionMappings(cohort, setIndex);

    // Extract ONLY the question text and originalQ (strip out all scoring metadata like weights/subdimensions)
    const questions: Question[] = mappings.map((mapping) => ({
      index: mapping.q,
      text: mapping.text,
      originalQ: mapping.originalQ  // Include originalQ for question pool mapping
    }));

    return NextResponse.json({
      success: true,
      questions,
      cohort,
      totalQuestions: questions.length
    });

  } catch (error) {
    console.error('[Questions API] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Sisäinen palvelinvirhe'
      },
      { status: 500 }
    );
  }
}
