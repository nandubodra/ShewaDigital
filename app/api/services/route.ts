import { NextResponse } from 'next/server';

const services = [
  {
    id: 'pan-card',
    name: 'PAN Card',
    fee: '₹107',
    time: '15-20 days',
    eligibility: 'Any Indian citizen aged 18+ or guardian for minors.',
    docs: ['Aadhaar card', 'Passport photo', 'DOB proof', 'Address proof']
  },
  {
    id: 'voter-id',
    name: 'Voter ID Card',
    fee: 'Free',
    time: '30 days',
    eligibility: 'Indian citizen aged 18 years or above.',
    docs: ['Aadhaar card', 'Passport photo', 'Age proof', 'Address proof']
  },
  {
    id: 'income-certificate',
    name: 'Income Certificate',
    fee: '₹30',
    time: '7-15 days',
    eligibility: 'Resident of the state where the certificate is applied.',
    docs: ['Aadhaar card', 'Ration card', 'Income proof', 'Address proof']
  }
];

export async function GET() {
  return NextResponse.json(services);
}
