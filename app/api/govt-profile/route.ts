import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    orgName: 'Ministry of Citizen Services',
    officeName: 'Digital Governance Division',
    officeLocation: 'Patna, Bihar',
    phone: '+91 9123456789',
    email: 'admin@shewadigital.in',
    website: 'https://shewadigital.gov.in'
  });
}
