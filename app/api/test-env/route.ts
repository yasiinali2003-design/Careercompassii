import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Security: Only allow on localhost
  const host = request.headers.get('host') || '';
  if (!host.includes('localhost') && !host.includes('127.0.0.1')) {
    return new NextResponse('Not Found', { status: 404 });
  }

  return NextResponse.json({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing',
    // Show first 20 chars to verify it's not empty
    urlPreview: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) || 'N/A',
    anonKeyPreview: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 30) || 'N/A'
  });
}

