import fs from 'fs/promises';
import path from 'path';

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  aadhaar: string;
  address: string;
  state: string;
  district: string;
  password: string;
  role: 'user' | 'government';
};

export type Application = {
  id: string;
  userEmail: string;
  serviceId: string;
  serviceName: string;
  status: 'pending' | 'in_process' | 'approved' | 'rejected';
  priority: string;
  createdAt: string;
  updatedAt: string;
  formData: Record<string, string>;
  documents: Array<{ name: string; path: string }>;
  history: Array<{ status: string; note: string; createdAt: string }>;
};

export type Service = {
  id: string;
  name: string;
  fee: string;
  time: string;
  eligibility: string;
  docs: string[];
};

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_PATH = path.join(DATA_DIR, 'users.json');
const APPLICATIONS_PATH = path.join(DATA_DIR, 'applications.json');

const services: Service[] = [
  { id: 'pan', name: 'PAN Card', fee: '₹107', time: '15-20 days', eligibility: 'Any Indian citizen 18+ or guardian', docs: ['Aadhaar card', 'Passport photo', 'DOB proof', 'Address proof'] },
  { id: 'voter', name: 'Voter ID Card', fee: 'Free', time: '30 days', eligibility: 'Indian citizen aged 18+', docs: ['Aadhaar card', 'Photo', 'Age proof', 'Address proof'] },
  { id: 'income', name: 'Income Certificate', fee: '₹30', time: '7-15 days', eligibility: 'Resident of the stated region', docs: ['Aadhaar card', 'Ration card', 'Income proof', 'Address proof'] },
  { id: 'dl', name: 'Driving License', fee: '₹200-1000', time: '15-30 days', eligibility: '16+ for two-wheelers, 18+ for others', docs: ['Aadhaar card', 'Photo', 'Learner license', 'Address proof'] },
  { id: 'dob', name: 'Date of Birth Certificate', fee: '₹20', time: '7 days', eligibility: 'Birth registered with local municipal office', docs: ['Hospital record', 'Parent Aadhaar', 'Address proof', 'Self declaration'] }
];

export async function ensureDataFiles() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(USERS_PATH);
  } catch {
    const users: User[] = [
      {
        id: 'user-001',
        name: 'Rahul Kumar',
        email: 'user@shewadigital.in',
        phone: '9876543210',
        aadhaar: 'XXXX XXXX 4821',
        address: 'Boring Road, Patna, Bihar',
        state: 'Bihar',
        district: 'Patna',
        password: 'password123',
        role: 'user'
      },
      {
        id: 'govt-001',
        name: 'Government Admin',
        email: 'admin@shewadigital.in',
        phone: '9123456789',
        aadhaar: 'NA',
        address: 'Government Office, Patna',
        state: 'Bihar',
        district: 'Patna',
        password: 'admin123',
        role: 'government'
      }
    ];
    await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2));
  }

  try {
    await fs.access(APPLICATIONS_PATH);
  } catch {
    const apps: Application[] = [
      {
        id: 'APP-1001',
        userEmail: 'user@shewadigital.in',
        serviceId: 'income',
        serviceName: 'Income Certificate',
        status: 'pending',
        priority: 'normal',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        formData: { AnnualIncome: '₹3,50,000', Occupation: 'Private Employee' },
        documents: [{ name: 'aadhaar.pdf', path: '/uploads/sample.pdf' }],
        history: [{ status: 'pending', note: 'Application submitted by citizen', createdAt: new Date().toISOString() }]
      }
    ];
    await fs.writeFile(APPLICATIONS_PATH, JSON.stringify(apps, null, 2));
  }
}

export function readServices() {
  return services;
}

export async function readUsers(): Promise<User[]> {
  await ensureDataFiles();
  const raw = await fs.readFile(USERS_PATH, 'utf8');
  return JSON.parse(raw || '[]');
}

export async function writeUsers(users: User[]) {
  await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2));
}

export async function readApplications(): Promise<Application[]> {
  await ensureDataFiles();
  const raw = await fs.readFile(APPLICATIONS_PATH, 'utf8');
  return JSON.parse(raw || '[]');
}

export async function writeApplications(apps: Application[]) {
  await fs.writeFile(APPLICATIONS_PATH, JSON.stringify(apps, null, 2));
}
