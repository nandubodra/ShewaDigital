import { mkdir, writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(req: Request) {
  const formData = await req.formData();
  const files = formData.getAll('files');
  const saved: Array<{ name: string; path: string }> = [];

  const uploadsDir = path.join(process.cwd(), 'uploads');
  await mkdir(uploadsDir, { recursive: true });

  for (const item of files) {
    if (typeof item === 'string' || !('name' in item) || !('arrayBuffer' in item)) continue;
    const buffer = Buffer.from(await item.arrayBuffer());
    const target = path.join(uploadsDir, item.name.replace(/\s+/g, '-'));
    await writeFile(target, buffer);
    saved.push({ name: item.name, path: `/uploads/${path.basename(target)}` });
  }

  return NextResponse.json({ files: saved });
}
