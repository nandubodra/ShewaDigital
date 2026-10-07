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

export { ensureDataFiles, readUsers, writeUsers, readApplications, writeApplications, readServices } from './data-store';
