import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { status } = await req.json();

  return NextResponse.json({
    id: params.id,
    status,
    message: 'Status updated'
  });
}
