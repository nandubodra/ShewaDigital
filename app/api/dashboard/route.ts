import { NextResponse } from 'next/server';
import { ensureDataFiles, readApplications, readUsers } from '@/lib/data';

export async function GET() {
  await ensureDataFiles();
  const [apps, users] = await Promise.all([readApplications(), readUsers()]);
  const summary = {
    totalUsers: users.filter((u) => u.role === 'user').length,
    totalApplications: apps.length,
    pending: apps.filter((a) => a.status === 'pending').length,
    in_process: apps.filter((a) => a.status === 'in_process').length,
    approved: apps.filter((a) => a.status === 'approved').length,
    rejected: apps.filter((a) => a.status === 'rejected').length
  };
  return NextResponse.json(summary);
}
