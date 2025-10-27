/**
 * POST /api/classes/[classId]/pins
 * Generate student PINs for a class
 * 
 * Request: { count: number } (how many PINs to generate)
 * Response: { pins: string[] }
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateStudentPin } from '@/lib/teacherCrypto';

interface RouteParams {
  params: {
    classId: string;
  };
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const body = await request.json();
    const { count = 10 } = body;
    const { classId } = params;

    // Validate input
    if (!classId) {
      return NextResponse.json(
        { success: false, error: 'Missing classId' },
        { status: 400 }
      );
    }

    if (!count || typeof count !== 'number' || count < 1 || count > 100) {
      return NextResponse.json(
        { success: false, error: 'Invalid count (must be 1-100)' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Verify class exists
    const { data: classData, error: classError } = await supabaseAdmin
      .from('classes')
      .select('id')
      .eq('id', classId)
      .single();

    if (classError || !classData) {
      return NextResponse.json(
        { success: false, error: 'Class not found' },
        { status: 404 }
      );
    }

    // Generate unique PINs
    const generatedPins: string[] = [];
    const existingPins = new Set<string>();

    // Get existing PINs to avoid duplicates
    const { data: existingPinsData } = await supabaseAdmin
      .from('pins')
      .select('pin')
      .eq('class_id', classId);

    if (existingPinsData) {
      existingPinsData.forEach((row: { pin: string }) => existingPins.add(row.pin));
    }

    // Generate until we have enough unique PINs
    while (generatedPins.length < count) {
      let pin = generateStudentPin();
      
      // Ensure uniqueness within this batch and against existing
      let attempts = 0;
      while (generatedPins.includes(pin) || existingPins.has(pin)) {
        if (attempts++ > 1000) {
          throw new Error('Failed to generate unique PINs');
        }
        pin = generateStudentPin();
      }

      generatedPins.push(pin);
    }

    // Insert PINs into database
    const pinsToInsert = generatedPins.map(pin => ({
      class_id: classId,
      pin
    }));

    const { error: insertError } = await supabaseAdmin
      .from('pins')
      .insert(pinsToInsert);

    if (insertError) {
      console.error('[API/Pins] Error creating PINs:', insertError);
      return NextResponse.json(
        { success: false, error: 'Failed to create PINs' },
        { status: 500 }
      );
    }

    console.log(`[API/Pins] Created ${count} PINs for class ${classId}`);

    return NextResponse.json({
      success: true,
      pins: generatedPins,
      count: generatedPins.length
    });

  } catch (error) {
    console.error('[API/Pins] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get PINs for a class
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { classId } = params;

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('pins')
      .select('id, pin, created_at')
      .eq('class_id', classId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[API/Pins] Error fetching PINs:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch PINs' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      pins: data || []
    });

  } catch (error) {
    console.error('[API/Pins] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

