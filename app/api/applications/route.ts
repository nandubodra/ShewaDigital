import { NextResponse } from 'next/server';
import { ensureDataFiles, readApplications, writeApplications } from '@/lib/data';

export async function GET(req: Request) {
  await ensureDataFiles();
  const url = new URL(req.url);
  const email = url.searchParams.get('email');
  const apps = await readApplications();

  if (!email) {
    return NextResponse.json(apps);
  }

  return NextResponse.json(apps.filter((app) => app.userEmail.toLowerCase() === email.toLowerCase()));
}

export async function POST(req: Request) {
  await ensureDataFiles();
  const payload = await req.json();
  const { userEmail, serviceId, serviceName, formData, documents } = payload;

  if (!userEmail || !serviceId) {
    return NextResponse.json({ message: 'User email and service are required.' }, { status: 400 });
  }

  const apps = await readApplications();
  const newApp = {
    id: `APP-${Date.now().toString().slice(-6)}`,
    userEmail,
    serviceId,
    serviceName,
    status: 'pending',
    priority: 'normal',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    formData: formData || {},
    documents: documents || [],
    history: [{
      status: 'pending',
      note: 'Application submitted by citizen',
      createdAt: new Date().toISOString()
    }]
  };

  apps.push(newApp);
  await writeApplications(apps);
  return NextResponse.json(newApp, { status: 201 });
}
