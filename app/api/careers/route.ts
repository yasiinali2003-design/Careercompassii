/**
 * CAREERS API ENDPOINT
 * Provides access to career library (Urakirjasto)
 */

import { NextRequest, NextResponse } from 'next/server';
import { careersData } from '@/data/careers-fi';

export const dynamic = 'force-dynamic';

// ========== GET ALL CAREERS ==========

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const cohort = searchParams.get('cohort');

    let careers = careersData;

    // Filter by category
    if (category && category !== 'all') {
      careers = careers.filter(c => c.category === category);
    }

    // Filter by search term (title, description, keywords)
    if (search) {
      const searchLower = search.toLowerCase();
      careers = careers.filter(c =>
        c.title_fi.toLowerCase().includes(searchLower) ||
        c.short_description?.toLowerCase().includes(searchLower) ||
        c.keywords?.some(k => k.toLowerCase().includes(searchLower))
      );
    }

    // Filter by cohort (if careers have cohort-specific targeting)
    // Note: This is currently not implemented in CareerFI interface
    // Can be added later if needed
    if (cohort) {
      // Future enhancement: filter careers appropriate for cohort
      console.log(`[API] Cohort filter requested: ${cohort} (not yet implemented)`);
    }

    return NextResponse.json(careers, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
      }
    });

  } catch (error) {
    console.error('[API] /api/careers error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Urakirjaston lataaminen epäonnistui',
        details: error instanceof Error ? error.message : 'Tuntematon virhe'
      },
      { status: 500 }
    );
  }
}
