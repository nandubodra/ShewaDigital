import { NextResponse } from 'next/server';
import { ensureDataFiles, readUsers } from '@/lib/data';

export async function POST(req: Request) {
  await ensureDataFiles();
  const { email, password } = await req.json();
  const users = await readUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === String(email).toLowerCase() && u.password === String(password)
  );

  if (!user) {
    return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
  }

  const { password: _password, ...safeUser } = user;
  return NextResponse.json({ user: safeUser });
}
