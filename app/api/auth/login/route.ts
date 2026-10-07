import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(req: Request) {
  const body = await req.json();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: body.email,
    password: body.password
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: data.user.id,
      name: data.user.user_metadata?.name || 'User',
      email: data.user.email,
      role: 'USER'
    }
  });
}
