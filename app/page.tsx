import { FileText, ShieldCheck, Sparkles, ClipboardList, User, Building2, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

const defaultServices = [
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
  },
  {
    id: 'driving-license',
    name: 'Driving License',
    fee: '₹200-1000',
    time: '15-30 days',
    eligibility: '16+ for gearless vehicles, 18+ for gear vehicles.',
    docs: ['Aadhaar card', 'Passport photo', 'Learner license', 'Address proof']
  }
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  in_process: 'bg-blue-100 text-blue-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700'
};

export default function HomePage() {
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [services, setServices] = useState(defaultServices);
  const [selectedService, setSelectedService] = useState(defaultServices[0]);
  const [message, setMessage] = useState('');
  const [uploads, setUploads] = useState<Array<{ name: string; path: string }>>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const [loginForm, setLoginForm] = useState({
    email: 'user@shewadigital.in',
    password: 'password123'
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    aadhaar: '',
    address: '',
    state: '',
    district: ''
  });

  const t = {
    en: {
      brand: 'ShewaDigital',
      subtitle: 'AI-powered public service portal',
      login: 'Login',
      register: 'Register',
      services: 'Services',
      tracker: 'Application Tracker',
      govt: 'Government Portal',
      welcome: 'Welcome to ShewaDigital',
      support: 'Upload docs, auto-fill fields, and track application status'
    },
    hi: {
      brand: 'शेवा डिजिटल',
      subtitle: 'AI-संचालित सार्वजनिक सेवा पोर्टल',
      login: 'लॉगिन',
      register: 'रजिस्टर',
      services: 'सेवाएं',
      tracker: 'एप्लिकेशन ट्रैकिंग',
      govt: 'सरकारी पोर्टल',
      welcome: 'शेवा डिजिटल में आपका स्वागत है',
      support: 'दस्तावेज अपलोड करें, फॉर्म ऑटो-भरे, और स्थिति देखें'
    }
  }[lang];

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm)
    });

    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || 'Login failed');
      return;
    }

    setUser(data.user);
    setMessage('Login successful');
  }

  async function onRegister(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerForm)
    });

    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || 'Registration failed');
      return;
    }

    setMessage('Registration successful. Please login.');
    setMode('login');
  }

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || 'Upload failed');
      return;
    }

    setUploads(data.files || []);
    setMessage('Documents uploaded successfully');
  }

  async function handleSubmitApplication() {
    if (!user) {
      setMessage('Please login first');
      return;
    }

    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.email,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        formData,
        uploadedFiles: uploads
      })
    });

    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || 'Application submission failed');
      return;
    }

    setMessage('Application submitted successfully');
    setFormData({});
    setUploads([]);
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="text-2xl font-bold text-blue-700">{t.brand}</div>
          <nav className="hidden gap-6 md:flex">
            <button>{t.home}</button>
            <button>{t.services}</button>
            <button>{t.tracker}</button>
            <button>{t.gov}</button>
          </nav>
          <div className="flex items-center gap-3">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as 'en' | 'hi')}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
            </select>
            {user ? (
              <button
                className="rounded-lg border border-slate-200 px-3 py-2"
                onClick={() => setUser(null)}
              >
                Logout
              </button>
            ) : (
              <button className="rounded-lg bg-blue-700 px-4 py-2 text-white">{t.login}</button>
            )}
          </div>
        </div>
      </header>

      {!user ? (
        <section className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="rounded-3xl bg-gradient-to-br from-blue-700 to-cyan-500 p-8 text-white shadow-xl">
              <p className="text-sm uppercase tracking-[0.3em] text-blue-100">AI Document Assistant</p>
              <h1 className="mt-4 text-4xl font-bold leading-tight">{t.subtitle}</h1>
              <p className="mt-5 max-w-lg text-blue-100">{t.support}</p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <Sparkles className="mb-2" />
                  <div className="font-semibold">AI Fill</div>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <FileText className="mb-2" />
                  <div className="font-semibold">OCR</div>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <ShieldCheck className="mb-2" />
                  <div className="font-semibold">Approval</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md">
            <div className="mb-5 flex gap-2 rounded-xl bg-slate-100 p-1">
              <button
                className={`flex-1 rounded-xl px-4 py-2 font-medium ${mode === 'login' ? 'bg-white shadow' : ''}`}
                onClick={() => setMode('login')}
              >
                {t.login}
              </button>
              <button
                className={`flex-1 rounded-xl px-4 py-2 font-medium ${mode === 'register' ? 'bg-white shadow' : ''}`}
                onClick={() => setMode('register')}
              >
                {t.register}
              </button>
            </div>

            {mode === 'login' ? (
              <form onSubmit={onLogin} className="space-y-4">
                <label className="block text-sm font-medium">
                  Email
                  <input
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                  />
                </label>
                <label className="block text-sm font-medium">
                  Password
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                  />
                </label>
                <button className="w-full rounded-xl bg-blue-700 px-4 py-3 text-white font-semibold" type="submit">
                  {t.login}
                </button>
              </form>
            ) : (
              <form onSubmit={onRegister} className="space-y-4">
                <label className="block text-sm font-medium">
                  Full Name
                  <input
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                  />
                </label>
                <label className="block text-sm font-medium">
                  Email
                  <input
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                  />
                </label>
                <label className="block text-sm font-medium">
                  Phone
                  <input
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                  />
                </label>
                <label className="block text-sm font-medium">
                  Password
                  <input
                    type="password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                  />
                </label>
                <button className="w-full rounded-xl bg-blue-700 px-4 py-3 text-white font-semibold" type="submit">
                  {t.register}
                </button>
              </form>
            )}

            {message && <div className="mt-4 rounded-xl bg-blue-50 px-3 py-2 text-sm text-blue-700">{message}</div>}
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 xl:grid-cols-[0.8fr_1.8fr]">
            <aside className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 p-2 text-blue-700"><User size={18} /></div>
                  <h3 className="text-xl font-bold">Profile</h3>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <div><span className="font-medium text-slate-900">Name:</span> {user.name}</div>
                  <div><span className="font-medium text-slate-900">Email:</span> {user.email}</div>
                  <div><span className="font-medium text-slate-900">Role:</span> {user.role}</div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-full bg-indigo-100 p-2 text-indigo-700"><Building2 size={18} /></div>
                  <h3 className="text-xl font-bold">Government Office</h3>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <div><span className="font-medium text-slate-900">Office:</span> State Service Portal</div>
                  <div><span className="font-medium text-slate-900">Department:</span> Digital Governance Division</div>
                  <div><span className="font-medium text-slate-900">Location:</span> Patna, Bihar</div>
                </div>
              </div>
            </aside>

            <div className="space-y-8">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-full bg-cyan-100 p-2 text-cyan-700"><ClipboardList size={18} /></div>
                  <h3 className="text-xl font-bold">{t.services}</h3>
                </div>

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
                    <h4 className="text-xl font-semibold">{selectedService.name}</h4>
                    <p className="mt-2 text-sm text-slate-600">{selectedService.eligibility}</p>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      {selectedService.docs.map((doc) => (
                        <label key={doc} className="block text-sm font-medium text-slate-700">
                          {doc}
                          <input
                            value={formData[doc] || ''}
                            onChange={(e) => setFormData({ ...formData, [doc]: e.target.value })}
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

                      {uploads.length > 0 && (
                        <ul className="mt-3 space-y-1 text-sm text-slate-600">
                          {uploads.map((file) => (
                            <li key={file.path}>• {file.name}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <button
                      onClick={handleSubmitApplication}
                      className="mt-6 rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white"
                    >
                      Submit Application
                    </button>
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-full bg-emerald-100 p-2 text-emerald-700"><CheckCircle2 size={18} /></div>
                  <h3 className="text-xl font-bold">Application Tracker</h3>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">Income Certificate</div>
                        <div className="text-xs text-slate-500">APP-1001</div>
                      </div>
                      <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">Pending</span>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">PAN Card</div>
                        <div className="text-xs text-slate-500">APP-1002</div>
                      </div>
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">In Process</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
