"use client";

import { useEffect, useMemo, useState } from 'react';

type Lang = 'en' | 'hi';

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  aadhaar: string;
  address: string;
  state: string;
  district: string;
  role: 'user' | 'government';
};

type Service = {
  id: string;
  name: string;
  fee: string;
  time: string;
  eligibility: string;
  docs: string[];
};

type Application = {
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

const translations = {
  en: {
    brand: 'ShewaDigital',
    description: 'AI-powered citizen service portal for government documents and approvals.',
    login: 'Login',
    register: 'Register',
    home: 'Home',
    dashboard: 'Dashboard',
    service: 'Services',
    profile: 'Profile',
    government: 'Government Portal',
    myApplications: 'My Applications',
    status: 'Status',
    allApplications: 'All Applications',
    uploadDocuments: 'Upload Documents',
    submit: 'Submit Application',
    pending: 'Pending',
    inProcess: 'In Process',
    approved: 'Approved',
    rejected: 'Rejected',
    totalUsers: 'Total users',
    totalApplications: 'Total applications',
    approvalQueue: 'Approval queue',
    welcome: 'Welcome to ShewaDigital',
    noApplication: 'No applications found.',
    govtOffice: 'Government Office',
    contact: 'Contact',
    district: 'District',
    state: 'State',
    track: 'Track application',
    citizenPortal: 'Citizen Portal',
    adminPortal: 'Government Dashboard',
    logout: 'Logout'
  },
  hi: {
    brand: 'शेवा डिजिटल',
    description: 'सरकारी दस्तावेज़ और स्वीकृति के लिए AI-संचालित नागरिक सेवा पोर्टल।',
    login: 'लॉगिन',
    register: 'रजिस्टर',
    home: 'होम',
    dashboard: 'डैशबोर्ड',
    service: 'सेवाएं',
    profile: 'प्रोफाइल',
    government: 'सरकारी पोर्टल',
    myApplications: 'मेरी आवेदन सूची',
    status: 'स्थिति',
    allApplications: 'सभी आवेदन',
    uploadDocuments: 'दस्तावेज़ अपलोड करें',
    submit: 'आवेदन जमा करें',
    pending: 'लंबित',
    inProcess: 'प्रक्रिया में',
    approved: 'स्वीकृत',
    rejected: 'अस्वीकृत',
    totalUsers: 'कुल उपयोगकर्ता',
    totalApplications: 'कुल आवेदन',
    approvalQueue: 'स्वीकृति पंक्ति',
    welcome: 'शेवा डिजिटल में आपका स्वागत है',
    noApplication: 'कोई आवेदन नहीं मिला।',
    govtOffice: 'सरकारी कार्यालय',
    contact: 'संपर्क',
    district: 'जिला',
    state: 'राज्य',
    track: 'आवेदन ट्रैक करें',
    citizenPortal: 'नागरिक पोर्टल',
    adminPortal: 'सरकारी डैशबोर्ड',
    logout: 'लॉगआउट'
  }
} as const;

const defaultUser: User = {
  id: 'demo-user',
  name: 'Rahul Kumar',
  email: 'user@shewadigital.in',
  phone: '9876543210',
  aadhaar: 'XXXX XXXX 4821',
  address: 'Boring Road, Patna, Bihar',
  state: 'Bihar',
  district: 'Patna',
  role: 'user'
};

const defaultGovt = {
  orgName: 'Ministry of Citizen Services',
  officeName: 'Digital Governance Division',
  officeLocation: 'Patna, Bihar',
  phone: '+91 9123456789',
  email: 'admin@shewadigital.in',
  website: 'https://shewadigital.gov.in'
};

export default function HomePage() {
  const [lang, setLang] = useState<Lang>('en');
  const [user, setUser] = useState<User | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [govtProfile, setGovtProfile] = useState(defaultGovt);
  const [dashboard, setDashboard] = useState({ totalUsers: 0, totalApplications: 0, pending: 0, in_process: 0, approved: 0, rejected: 0 });
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [appForm, setAppForm] = useState<Record<string, string>>({});
  const [uploadFiles, setUploadFiles] = useState<Array<{ name: string; path: string }>>([]);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [message, setMessage] = useState('');
  const [loginData, setLoginData] = useState({ email: 'user@shewadigital.in', password: 'password123' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    aadhaar: '',
    address: '',
    state: '',
    district: ''
  });

  const t = translations[lang];

  useEffect(() => {
    const saved = window.localStorage.getItem('shewadigital-user');
    if (saved) {
      setUser(JSON.parse(saved));
    } else {
      setUser(defaultUser);
    }
    loadServices();
    loadGovtProfile();
    loadDashboard();
  }, []);

  useEffect(() => {
    if (user) {
      window.localStorage.setItem('shewadigital-user', JSON.stringify(user));
      loadApplications(user.email);
    }
  }, [user]);

  const visibleApps = useMemo(() => {
    if (!user) return [];
    return applications.filter((app) => app.userEmail === user.email);
  }, [applications, user]);

  async function loadServices() {
    const res = await fetch('/api/services');
    const data = await res.json();
    setServices(data);
    setSelectedService(data[0] ?? null);
  }

  async function loadGovtProfile() {
    const res = await fetch('/api/govt-profile');
    const data = await res.json();
    setGovtProfile(data);
  }

  async function loadDashboard() {
    const res = await fetch('/api/dashboard');
    const data = await res.json();
    setDashboard(data);
  }

  async function loadApplications(email: string) {
    const res = await fetch(`/api/applications?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    setApplications(data || []);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.message || 'Login failed');
      return;
    }
    setUser(data.user);
    setMessage('Logged in successfully');
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData)
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.message || 'Registration failed');
      return;
    }
    setMessage('Registration successful. Please login.');
    setAuthMode('login');
  }

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    setUploadFiles(data.files ?? []);
    setMessage('Documents uploaded successfully.');
  }

  async function submitApplication() {
    if (!user || !selectedService) return;

    const payload = {
      userEmail: user.email,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      formData: appForm,
      documents: uploadFiles
    };

    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message || 'Application failed');
      return;
    }

    setMessage('Application submitted successfully');
    setAppForm({});
    setUploadFiles([]);
    loadApplications(user.email);
    loadDashboard();
  }

  async function adminAction(applicationId: string, status: 'in_process' | 'approved' | 'rejected') {
    const res = await fetch(`/api/applications/${applicationId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note: `Updated by government office: ${status}` })
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.message || 'Status update failed');
      return;
    }
    setMessage(`Application marked as ${status}`);
    loadApplications(user?.email ?? 'user@shewadigital.in');
    loadDashboard();
  }

  const statusLabels = {
    pending: t.pending,
    in_process: t.inProcess,
    approved: t.approved,
    rejected: t.rejected
  } as const;

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
          <div className="text-2xl font-bold text-blue-700">{t.brand}</div>
          <nav className="hidden gap-6 md:flex">
            <button className="text-sm font-medium">{t.home}</button>
            <button className="text-sm font-medium">{t.dashboard}</button>
            <button className="text-sm font-medium">{t.government}</button>
          </nav>
          <div className="flex items-center gap-3">
            <select value={lang} onChange={(e) => setLang(e.target.value as Lang)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
            </select>
            {user ? (
              <>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">{user.name}</span>
                <button
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  onClick={() => {
                    setUser(null);
                    window.localStorage.removeItem('shewadigital-user');
                  }}
                >
                  {t.logout}
                </button>
              </>
            ) : (
              <button className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white">{t.login}</button>
            )}
          </div>
        </div>
      </header>

      {!user ? (
        <section className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <div className="rounded-3xl bg-gradient-to-br from-blue-700 to-sky-500 p-8 text-white shadow-xl">
              <p className="mb-3 text-sm uppercase tracking-[0.2em] text-blue-100">{t.welcome}</p>
              <h1 className="text-4xl font-bold leading-tight">{t.description}</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {['AI form fill', 'Live tracking', 'Government approval'].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 h-10 w-10 rounded-xl bg-blue-100 text-center text-xl leading-10 text-blue-700">✓</div>
                  <h3 className="text-lg font-semibold">{item}</h3>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md">
            <div className="mb-5 flex gap-2 rounded-xl bg-slate-100 p-1">
              <button
                className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium ${authMode === 'login' ? 'bg-white shadow' : ''}`}
                onClick={() => setAuthMode('login')}
              >
                {t.login}
              </button>
              <button
                className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium ${authMode === 'register' ? 'bg-white shadow' : ''}`}
                onClick={() => setAuthMode('register')}
              >
                {t.register}
              </button>
            </div>

            {authMode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <label className="block text-sm font-medium">Email
                  <input value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
                </label>
                <label className="block text-sm font-medium">Password
                  <input type="password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
                </label>
                <button type="submit" className="w-full rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white">{t.login}</button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <label className="block text-sm font-medium">Full name
                  <input value={registerData.name} onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
                </label>
                <label className="block text-sm font-medium">Email
                  <input value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
                </label>
                <label className="block text-sm font-medium">Phone
                  <input value={registerData.phone} onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
                </label>
                <label className="block text-sm font-medium">Password
                  <input type="password" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
                </label>
                <label className="block text-sm font-medium">Aadhaar
                  <input value={registerData.aadhaar} onChange={(e) => setRegisterData({ ...registerData, aadhaar: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
                </label>
                <label className="block text-sm font-medium">Address
                  <input value={registerData.address} onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
                </label>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="block text-sm font-medium">State
                    <input value={registerData.state} onChange={(e) => setRegisterData({ ...registerData, state: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
                  </label>
                  <label className="block text-sm font-medium">District
                    <input value={registerData.district} onChange={(e) => setRegisterData({ ...registerData, district: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
                  </label>
                </div>
                <button type="submit" className="w-full rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white">{t.register}</button>
              </form>
            )}

            {message && <div className="mt-5 rounded-xl bg-blue-50 px-3 py-2 text-sm text-blue-700">{message}</div>}
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-sm text-slate-500">{t.totalUsers}</div>
              <div className="mt-2 text-3xl font-bold text-blue-700">{dashboard.totalUsers}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-sm text-slate-500">{t.totalApplications}</div>
              <div className="mt-2 text-3xl font-bold text-blue-700">{dashboard.totalApplications}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-sm text-slate-500">{t.pending}</div>
              <div className="mt-2 text-3xl font-bold text-amber-600">{dashboard.pending}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-sm text-slate-500">{t.approved}</div>
              <div className="mt-2 text-3xl font-bold text-emerald-600">{dashboard.approved}</div>
            </div>
          </div>

          <div className="grid gap-8 xl:grid-cols-[0.9fr_1.9fr]">
            <aside className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-bold">{user.role === 'government' ? t.adminPortal : t.citizenPortal}</h3>
                <div className="space-y-3 text-sm text-slate-600">
                  <div><span className="font-medium text-slate-900">Name:</span> {user.name}</div>
                  <div><span className="font-medium text-slate-900">Email:</span> {user.email}</div>
                  <div><span className="font-medium text-slate-900">Phone:</span> {user.phone}</div>
                  <div><span className="font-medium text-slate-900">Aadhaar:</span> {user.aadhaar}</div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h4 className="mb-4 text-lg font-bold">{t.government}</h4>
                <div className="space-y-2 text-sm text-slate-600">
                  <div><span className="font-medium text-slate-900">Office:</span> {govtProfile.officeName}</div>
                  <div><span className="font-medium text-slate-900">Department:</span> {govtProfile.orgName}</div>
                  <div><span className="font-medium text-slate-900">Location:</span> {govtProfile.officeLocation}</div>
                  <div><span className="font-medium text-slate-900">Email:</span> {govtProfile.email}</div>
                </div>
              </div>
            </aside>

            <div className="space-y-8">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-5 text-xl font-bold">{t.service}</h3>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className={`rounded-2xl border p-4 text-left ${selectedService?.id === service.id ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-slate-50'}`}
                    >
                      <div className="text-lg font-semibold">{service.name}</div>
                      <div className="mt-2 text-sm text-slate-600">{service.fee} • {service.time}</div>
                    </button>
                  ))}
                </div>

                {selectedService && (
                  <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <h4 className="text-lg font-semibold">{selectedService.name}</h4>
                    <p className="mt-2 text-sm text-slate-600">{selectedService.eligibility}</p>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      {selectedService.docs.map((doc) => (
                        <label key={doc} className="block text-sm font-medium text-slate-700">
                          {doc}
                          <input
                            value={appForm[doc] ?? ''}
                            onChange={(e) => setAppForm({ ...appForm, [doc]: e.target.value })}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
                          />
                        </label>
                      ))}
                    </div>

                    <div className="mt-5">
                      <label className="block text-sm font-medium text-slate-700">
                        Upload documents
                        <input type="file" multiple onChange={handleUpload} className="mt-2 block w-full text-sm text-slate-500" />
                      </label>
                      {uploadFiles.length > 0 && (
                        <ul className="mt-3 space-y-1 text-sm text-slate-600">
                          {uploadFiles.map((file) => <li key={file.path}>• {file.name}</li>)}
                        </ul>
                      )}
                    </div>

                    <button onClick={submitApplication} className="mt-6 rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white">{t.submit}</button>
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-5 text-xl font-bold">{t.myApplications}</h3>
                <div className="space-y-4">
                  {visibleApps.length === 0 ? (
                    <p className="text-sm text-slate-500">{t.noApplication}</p>
                  ) : (
                    visibleApps.map((app) => (
                      <div key={app.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-lg font-semibold">{app.serviceName}</div>
                            <div className="text-xs text-slate-500">{app.id}</div>
                          </div>
                          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">{statusLabels[app.status]}</span>
                        </div>
                        <div className="mt-3 text-sm text-slate-600">
                          {app.history.map((entry, index) => (
                            <div key={`${entry.status}-${index}`} className="border-t border-slate-200 pt-2 mt-2">
                              <div>{entry.status}</div>
                              <div className="text-xs">{entry.note}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {user.role === 'government' && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-5 text-xl font-bold">{t.allApplications}</h3>
                  <div className="space-y-4">
                    {applications.length === 0 ? (
                      <p>{t.noApplication}</p>
                    ) : (
                      applications.map((app) => (
                        <div key={app.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                              <div className="font-semibold">{app.serviceName}</div>
                              <div className="text-xs text-slate-500">{app.userEmail}</div>
                            </div>
                            <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">{statusLabels[app.status]}</span>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <button onClick={() => adminAction(app.id, 'in_process')} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">In process</button>
                            <button onClick={() => adminAction(app.id, 'approved')} className="rounded-lg bg-emerald-600 px-3 py-2 text-sm text-white">Approve</button>
                            <button onClick={() => adminAction(app.id, 'rejected')} className="rounded-lg bg-rose-600 px-3 py-2 text-sm text-white">Reject</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
