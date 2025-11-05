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
import fs from 'fs';
import path from 'path';

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
        { success: false, error: 'Puuttuva luokka-tunniste' },
        { status: 400 }
      );
    }

    if (!count || typeof count !== 'number' || count < 1 || count > 100) {
      return NextResponse.json(
        { success: false, error: 'Virheellinen määrä (täytyy olla 1-100)' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      // Local mock: append pins to mock-db.json under this classId
      const mockPath = path.join(process.cwd(), 'mock-db.json');
      let store: any = { classes: [], pins: {}, results: [] };
      try {
        if (fs.existsSync(mockPath)) {
          store = JSON.parse(fs.readFileSync(mockPath, 'utf8')) || store;
        }
      } catch {}
      const existing: string[] = store.pins?.[classId] || [];
      const generatedPins: string[] = [];
      const seen = new Set(existing);
      while (generatedPins.length < count) {
        const p = generateStudentPin();
        if (!seen.has(p)) { seen.add(p); generatedPins.push(p); }
      }
      store.pins = store.pins || {};
      store.pins[classId] = [...existing, ...generatedPins];
      try { fs.writeFileSync(mockPath, JSON.stringify(store, null, 2)); } catch {}
      return NextResponse.json({ success: true, pins: generatedPins, count: generatedPins.length });
    }

    // Verify class exists
    const { data: classData, error: classError } = await supabaseAdmin
      .from('classes')
      .select('id')
      .eq('id', classId)
      .single();

    if (classError || !classData) {
      return NextResponse.json(
        { success: false, error: 'Luokkaa ei löydy' },
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
        { success: false, error: 'PIN-koodien luominen epäonnistui' },
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
      { success: false, error: 'Sisäinen palvelinvirhe' },
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
      const mockPath = path.join(process.cwd(), 'mock-db.json');
      try {
        if (fs.existsSync(mockPath)) {
          const store = JSON.parse(fs.readFileSync(mockPath, 'utf8'));
          const pins = (store.pins?.[classId] || []).map((pin: string) => ({ id: pin, pin, created_at: '' }));
          return NextResponse.json({ success: true, pins });
        }
      } catch {}
      return NextResponse.json({ success: true, pins: [] });
    }

    const { data, error } = await supabaseAdmin
      .from('pins')
      .select('id, pin, created_at')
      .eq('class_id', classId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[API/Pins] Error fetching PINs:', error);
      return NextResponse.json(
        { success: false, error: 'PIN-koodien haku epäonnistui' },
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
      { success: false, error: 'Sisäinen palvelinvirhe' },
      { status: 500 }
    );
  }
}

