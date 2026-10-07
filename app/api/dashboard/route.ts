import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    totalUsers: 245,
    totalApplications: 914,
    pending: 126,
    in_process: 321,
    approved: 420,
    rejected: 47
  });
}
