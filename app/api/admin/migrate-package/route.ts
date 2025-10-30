import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Admin API endpoint to run the package column migration
 * POST /api/admin/migrate-package
 * 
 * Requires admin authentication
 */
export async function POST(request: NextRequest) {
  try {
    // Check admin auth
    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || '';
    const authHeader = request.headers.get('authorization') || '';
    const expected = adminPass ? 'Basic ' + Buffer.from(`${adminUser}:${adminPass}`).toString('base64') : '';

    const hasValidBasicAuth = expected && authHeader === expected;
    const adminCookie = request.cookies.get('admin_auth');
    const hasAdminCookie = adminCookie?.value === 'yes';

    if (!hasValidBasicAuth && !hasAdminCookie) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Check if column exists first
    const { error: checkError } = await supabaseAdmin
      .from('teachers')
      .select('package')
      .limit(1);

    if (!checkError) {
      // Column exists
      const { data: teachers } = await supabaseAdmin
        .from('teachers')
        .select('package')
        .limit(5);
      
      return NextResponse.json({
        success: true,
        message: 'Package column already exists',
        samplePackages: teachers?.map(t => t.package) || [],
      });
    }

    // Column doesn't exist - try to add it via SQL execution
    // Note: Supabase JS client doesn't support ALTER TABLE directly
    // We need to use a stored procedure or direct SQL connection
    
    // Try using Supabase's RPC to execute SQL
    // First, check if we can create a migration function
    
    // Alternative: Use the Postgres connection if available via Supabase
    // This requires the full connection string, not just the REST API
    
    // For now, return instructions
    return NextResponse.json({
      success: false,
      message: 'Migration requires SQL execution',
      instructions: {
        step1: 'Go to https://app.supabase.com',
        step2: 'Select your project',
        step3: 'Open SQL Editor',
        step4: 'Run this SQL:',
        sql: `
ALTER TABLE teachers 
ADD COLUMN IF NOT EXISTS package TEXT DEFAULT 'standard' 
CHECK (package IN ('premium', 'standard'));

UPDATE teachers SET package = 'standard' WHERE package IS NULL;
        `.trim(),
      },
    });

  } catch (error: any) {
    console.error('[Migration] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Migration failed' },
      { status: 500 }
    );
  }
}

