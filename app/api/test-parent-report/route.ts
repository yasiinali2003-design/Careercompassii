/**
 * API Test Endpoint for Parent Report PDF Generation
 * POST /api/test-parent-report
 * LOCALHOST ONLY - Returns 404 in production
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateParentReport, ParentReportData } from '@/lib/pdfGenerator';
import { createLogger } from '@/lib/logger';

const log = createLogger('API/TestParentReport');

export async function POST(request: NextRequest) {
  // Security: Only allow on localhost
  const host = request.headers.get('host') || '';
  if (!host.includes('localhost') && !host.includes('127.0.0.1')) {
    return new NextResponse('Not Found', { status: 404 });
  }

  try {
    const { testCase } = await request.json();
    
    const testCases: Record<string, ParentReportData> = {
      'full': {
        name: 'Matti Virtanen',
        date: '15.1.2025',
        className: '9A',
        topCareers: [
          { title: 'Sairaanhoitaja' },
          { title: 'Opettaja' },
          { title: 'Sosiaalityöntekijä' },
          { title: 'Lääkäri' },
          { title: 'Psykologi' }
        ],
        educationPath: {
          primary: 'lukio'
        },
        profile: 'Oppilas on sosiaalinen ja haluaa auttaa muita. Hänellä on selkeät kiinnostukset terveys- ja sosiaalialoihin.',
        teacherNotes: 'Matti osoittaa kiinnostusta terveysalaan ja haluaa auttaa muita. Suosittelen keskustelua lukiosta ja terveysalan mahdollisuuksista.'
      },
      'ammattikoulu': {
        name: 'Liisa Korhonen',
        date: '15.1.2025',
        className: '9B',
        topCareers: [
          { title: 'Sähköasentaja' },
          { title: 'Putkiasentaja' },
          { title: 'Rakennusmestari' }
        ],
        educationPath: {
          primary: 'ammattikoulu'
        },
        profile: 'Oppilas on käytännönläheinen ja tykkää tekemisestä. Hän haluaa oppia konkreettisen ammatin taidot.'
      },
      'minimal': {
        name: 'Antti Nieminen',
        date: '15.1.2025',
        className: '9C',
        topCareers: [
          { title: 'Ohjelmoija' },
          { title: 'Sivustonkehittäjä' }
        ],
        educationPath: {
          primary: 'lukio'
        }
      },
      'no-education': {
        name: 'Emma Mäkinen',
        date: '15.1.2025',
        className: 'Lukio 1',
        topCareers: [
          { title: 'Markkinoinnin asiantuntija' },
          { title: 'Tapahtumasuunnittelija' }
        ],
        profile: 'Oppilas on luova ja kiinnostunut viestinnästä.'
      },
      'kansanopisto': {
        name: 'Ville Lehtinen',
        date: '15.1.2025',
        className: '9D',
        topCareers: [
          { title: 'Yrittäjä' },
          { title: 'Myyntiedustaja' }
        ],
        educationPath: {
          primary: 'kansanopisto'
        },
        profile: 'Oppilas on vielä epävarma tulevaisuudestaan.'
      }
    };

    const testData = testCases[testCase] || testCases['full'];
    
    const blob = await generateParentReport(testData);
    
    // Convert blob to base64 for response
    const arrayBuffer = await blob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    
    return NextResponse.json({
      success: true,
      testCase,
      blobSize: blob.size,
      blobType: blob.type,
      message: `PDF generated successfully (${blob.size} bytes)`
    });
  } catch (error: any) {
    log.error('Error generating test parent report:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error',
      stack: error.stack
    }, { status: 500 });
  }
}

