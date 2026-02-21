import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Only available in development' }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin
    .from('teachers')
    .select('email, access_code, password_hash, name')
    .ilike('email', 'yasiin.ali2003@gmail.com')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    email: data.email,
    name: data.name,
    accessCode: data.access_code,
    passwordSet: !!data.password_hash
  });
}
