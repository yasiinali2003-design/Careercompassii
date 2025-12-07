import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  // Security: Only allow on localhost
  const host = request.headers.get('host') || '';
  if (!host.includes('localhost') && !host.includes('127.0.0.1')) {
    return new NextResponse('Not Found', { status: 404 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  try {
    // Get all results
    const { data: allResults, error: allError } = await supabaseAdmin
      .from('results')
      .select('id, class_id, pin, created_at')
      .limit(10);

    // Get all classes
    const { data: classes, error: classesError } = await supabaseAdmin
      .from('classes')
      .select('id, class_token, teacher_id')
      .limit(5);

    return NextResponse.json({
      resultsCount: allResults?.length || 0,
      results: allResults || [],
      classesCount: classes?.length || 0,
      classes: classes || [],
      errors: {
        results: allError?.message,
        classes: classesError?.message
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to query', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

