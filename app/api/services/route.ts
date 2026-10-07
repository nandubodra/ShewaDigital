import { NextResponse } from 'next/server';
import { ensureDataFiles, readServices } from '@/lib/data';

export async function GET() {
  await ensureDataFiles();
  return NextResponse.json(readServices());
}
