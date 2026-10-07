import { NextResponse } from 'next/server';
import { ensureDataFiles, readUsers, writeUsers } from '@/lib/data';

export async function POST(req: Request) {
  await ensureDataFiles();
  const payload = await req.json();
  const { name, email, phone, password, aadhaar, address, state, district } = payload;

  if (!name || !email || !password) {
    return NextResponse.json({ message: 'Name, email and password are required.' }, { status: 400 });
  }

  const users = await readUsers();
  const exists = users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());

  if (exists) {
    return NextResponse.json({ message: 'User already exists.' }, { status: 409 });
  }

  const user = {
    id: `user-${Date.now()}`,
    name,
    email,
    phone: phone || '',
    aadhaar: aadhaar || '',
    address: address || '',
    state: state || '',
    district: district || '',
    password,
    role: 'user'
  };

  users.push(user);
  await writeUsers(users);
  const { password: _password, ...safeUser } = user;
  return NextResponse.json({ user: safeUser, message: 'Registration successful.' }, { status: 201 });
}
