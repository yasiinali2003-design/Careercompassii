import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

interface TeacherDebugData {
  email: string;
  access_code: string;
  password_hash: string | null;
  name: string;
}

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Only available in development' }, { status: 403 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const { data, error } = await supabaseAdmin
    .from('teachers')
    .select('email, access_code, password_hash, name')
    .ilike('email', 'yasiin.ali2003@gmail.com')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
  }

  const teacher = data as TeacherDebugData;

  return NextResponse.json({
    email: teacher.email,
    name: teacher.name,
    accessCode: teacher.access_code,
    passwordSet: !!teacher.password_hash
  });
}
