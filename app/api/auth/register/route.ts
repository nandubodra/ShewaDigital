import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(req: Request) {
  const body = await req.json();

  const { data, error } = await supabase.auth.signUp({
    email: body.email,
    password: body.password,
    options: {
      data: {
        name: body.name,
        phone: body.phone,
        aadhaar: body.aadhaar,
        address: body.address,
        state: body.state,
        district: body.district
      }
    }
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    user: {
      id: data.user?.id,
      name: data.user?.user_metadata?.name || body.name,
      email: data.user?.email,
      role: 'USER'
    }
  }, { status: 201 });
}
