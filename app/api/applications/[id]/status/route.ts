import { NextResponse } from 'next/server';
import { ensureDataFiles, readApplications, writeApplications } from '@/lib/data';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  await ensureDataFiles();
  const { id } = params;
  const { status, note } = await req.json();
  const apps = await readApplications();
  const app = apps.find((item) => item.id === id);

  if (!app) {
    return NextResponse.json({ message: 'Application not found.' }, { status: 404 });
  }

  app.status = status || app.status;
  app.updatedAt = new Date().toISOString();
  app.history.push({
    status: app.status,
    note: note || 'Status updated by government office',
    createdAt: new Date().toISOString()
  });

  await writeApplications(apps);
  return NextResponse.json(app);
}
