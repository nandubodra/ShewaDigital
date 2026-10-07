import { NextResponse } from 'next/server';

const demoApplications = [
  {
    id: 'APP-1001',
    serviceName: 'Income Certificate',
    status: 'pending'
  },
  {
    id: 'APP-1002',
    serviceName: 'PAN Card',
    status: 'in_process'
  }
];

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.userId || !body.serviceId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const newApp = {
    id: `APP-${Date.now().toString().slice(-6)}`,
    serviceName: body.serviceName || body.serviceId,
    status: 'pending'
  };

  return NextResponse.json(newApp, { status: 201 });
}

export async function GET() {
  return NextResponse.json(demoApplications);
}
