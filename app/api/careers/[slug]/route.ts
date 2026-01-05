/**
 * INDIVIDUAL CAREER API ENDPOINT
 * Returns detailed information for a specific career by slug
 */

import { NextRequest, NextResponse } from 'next/server';
import { careersData } from '@/data/careers-fi';
import { createLogger } from '@/lib/logger';

const log = createLogger('API/Careers');

export const dynamic = 'force-dynamic';

// ========== GET SINGLE CAREER BY SLUG ==========

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  let slug = 'unknown';
  try {
    const params = await context.params;
    slug = params.slug;
    const career = careersData.find(c => c.id === slug);

    if (!career) {
      return NextResponse.json(
        {
          success: false,
          error: 'Uraa ei löytynyt',
          slug: slug
        },
        { status: 404 }
      );
    }

    return NextResponse.json(career, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800'
      }
    });

  } catch (error) {
    log.error(`Error fetching career ${slug}:`, error);
    return NextResponse.json(
      {
        success: false,
        error: 'Uran tietojen lataaminen epäonnistui',
        details: error instanceof Error ? error.message : 'Tuntematon virhe'
      },
      { status: 500 }
    );
  }
}
