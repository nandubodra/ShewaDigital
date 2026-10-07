const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 4000;
const DATA_DIR = path.join(__dirname, 'data');
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const USERS_PATH = path.join(DATA_DIR, 'users.json');
const APPLICATIONS_PATH = path.join(DATA_DIR, 'applications.json');

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const govtProfile = {
  orgName: 'Ministry of citizen services',
  department: 'Digital Governance Division',
  officeName: 'State Service Portal',
  officeLocation: 'Patna, Bihar',
  phone: '+91 9123456789',
  email: 'admin@shewadigital.in',
  website: 'https://shewadigital.gov.in'
};

const services = [
  {
    id: 'pan',
    name: 'PAN Card',
    fee: '₹107',
    time: '15-20 days',
    eligibility: 'Any Indian citizen 18+ or guardian for minors',
    docs: ['Aadhaar card', 'Passport size photo', 'DOB proof', 'Address proof']
  },
  {
    id: 'voter',
    name: 'Voter ID Card',
    fee: 'Free',
    time: '30 days',
    eligibility: 'Indian citizen aged 18 years or above',
    docs: ['Aadhaar card', 'Passport size photo', 'Age proof', 'Address proof']
  },
  {
    id: 'income',
    name: 'Income Certificate',
    fee: '₹30',
    time: '7-15 days',
    eligibility: 'Resident of the state where certificate is applied',
    docs: ['Aadhaar card', 'Ration card', 'Address proof', 'Income proof']
  },
  {
    id: 'dl',
    name: 'Driving License',
    fee: '₹200-1000',
    time: '15-30 days',
    eligibility: '16+ for gearless, 18+ for gear vehicles',
    docs: ['Aadhaar card', 'Passport photo', 'Age proof', 'Address proof', 'Learner license']
  },
  {
    id: 'dob',
    name: 'Date of Birth Certificate',
    fee: '₹20',
    time: '7 days',
    eligibility: 'Birth registered with local municipality',
    docs: ['Hospital birth record', 'Parent Aadhaar', 'Address proof', 'Self declaration']
  }
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, '-');
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

function readJson(filePath, fallback) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    if (!raw.trim()) return fallback;
    return JSON.parse(raw);
  } catch (error) {
    fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2));
    return fallback;
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function seed() {
  const users = readJson(USERS_PATH, []);
  const appList = readJson(APPLICATIONS_PATH, []);

  if (!users.length) {
    users.push({
      id: 'user-001',
      name: 'Rahul Kumar',
      email: 'user@shewadigital.in',
      phone: '9876543210',
      password: 'password123',
      aadhaar: 'XXXX XXXX 4821',
      address: 'Boring Road, Patna, Bihar',
      state: 'Bihar',
      district: 'Patna',
      role: 'user',
      createdAt: new Date().toISOString()
    });

    users.push({
      id: 'govt-001',
      name: 'Government Admin',
      email: 'admin@shewadigital.in',
      phone: '9123456789',
      password: 'admin123',
      aadhaar: 'NA',
      address: 'Government Office, Patna',
      state: 'Bihar',
      district: 'Patna',
      role: 'government',
      createdAt: new Date().toISOString()
    });

    writeJson(USERS_PATH, users);
  }

  if (!appList.length) {
    appList.push({
      id: 'APP-1001',
      userEmail: 'user@shewadigital.in',
      serviceId: 'income',
      serviceName: 'Income Certificate',
      status: 'pending',
      priority: 'normal',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      formData: {
        annualIncome: '₹3,50,000',
        occupation: 'Private Employee'
      },
      documents: [
        { name: 'aadhaar.pdf', path: '/uploads/sample-aadhaar.pdf' },
        { name: 'ration-card.jpg', path: '/uploads/sample-ration.jpg' }
      ],
      history: [{
        status: 'pending',
        note: 'Application submitted by citizen',
        createdAt: new Date().toISOString()
      }]
    });

    appList.push({
      id: 'APP-1002',
      userEmail: 'user@shewadigital.in',
      serviceId: 'pan',
      serviceName: 'PAN Card',
      status: 'in_process',
      priority: 'high',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      formData: {
        applicantType: 'Individual',
        areaCode: 'PATNA'
      },
      documents: [{ name: 'photo.png', path: '/uploads/sample-photo.png' }],
      history: [{
        status: 'in_process',
        note: 'Document verification is in progress',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }]
    });

    writeJson(APPLICATIONS_PATH, appList);
  }
}

seed();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(UPLOAD_DIR));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'ShewaDigital API' });
});

app.get('/api/services', (req, res) => {
  res.json(services);
});

app.get('/api/govt-profile', (req, res) => {
  res.json(govtProfile);
});

app.post('/api/upload', upload.array('files', 6), (req, res) => {
  const files = (req.files || []).map(file => ({
    name: file.originalname,
    path: `/uploads/${file.filename}`,
    size: file.size
  }));
  res.json({ files });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, password, aadhaar, address, state, district } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  const users = readJson(USERS_PATH, []);
  const exists = users.find(user => user.email.toLowerCase() === String(email).toLowerCase());
  if (exists) {
    return res.status(409).json({ message: 'User already exists.' });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    phone,
    password,
    aadhaar: aadhaar || 'N/A',
    address: address || 'Not provided',
    state: state || 'Not provided',
    district: district || 'Not provided',
    role: 'user',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeJson(USERS_PATH, users);

  res.status(201).json({ user: { ...newUser }, message: 'Registration successful.' });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const users = readJson(USERS_PATH, []);
  const user = users.find(item => item.email.toLowerCase() === String(email).toLowerCase() && item.password === String(password));

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    aadhaar: user.aadhaar,
    address: user.address,
    state: user.state,
    district: user.district,
    role: user.role
  };

  res.json({ user: safeUser, message: 'Login successful.' });
});

app.get('/api/profile', (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ message: 'Email query is required.' });

  const users = readJson(USERS_PATH, []);
  const user = users.find(item => item.email.toLowerCase() === String(email).toLowerCase());

  if (!user) {
    return res.status(404).json({ message: 'Profile not found.' });
  }

  res.json({ user: { ...user, password: undefined } });
});

app.get('/api/applications', (req, res) => {
  const email = req.query.email;
  const applications = readJson(APPLICATIONS_PATH, []);

  if (email) {
    return res.json(applications.filter(app => app.userEmail.toLowerCase() === String(email).toLowerCase()));
  }

  res.json(applications);
});

app.get('/api/admin/applications', (req, res) => {
  const applications = readJson(APPLICATIONS_PATH, []);
  res.json(applications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.get('/api/applications/:id', (req, res) => {
  const appId = req.params.id;
  const applications = readJson(APPLICATIONS_PATH, []);
  const app = applications.find(item => item.id === appId);
  if (!app) return res.status(404).json({ message: 'Application not found.' });
  res.json(app);
});

app.post('/api/applications', (req, res) => {
  const { userEmail, serviceId, serviceName, formData, documents } = req.body;

  if (!userEmail || !serviceId) {
    return res.status(400).json({ message: 'User email and service are required.' });
  }

  const applications = readJson(APPLICATIONS_PATH, []);
  const appId = `APP-${Date.now().toString().slice(-6)}`;
  const newApplication = {
    id: appId,
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

  applications.push(newApplication);
  writeJson(APPLICATIONS_PATH, applications);
  res.status(201).json(newApplication);
});

app.patch('/api/applications/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body;
  const applications = readJson(APPLICATIONS_PATH, []);
  const application = applications.find(item => item.id === id);

  if (!application) {
    return res.status(404).json({ message: 'Application not found.' });
  }

  application.status = status || application.status;
  application.updatedAt = new Date().toISOString();
  application.history = application.history || [];
  application.history.push({
    status: application.status,
    note: note || 'Status updated by government office',
    createdAt: new Date().toISOString()
  });

  writeJson(APPLICATIONS_PATH, applications);
  res.json(application);
});

app.get('/api/dashboard', (req, res) => {
  const users = readJson(USERS_PATH, []);
  const applications = readJson(APPLICATIONS_PATH, []);

  res.json({
    totalUsers: users.filter(user => user.role === 'user').length,
    totalApplications: applications.length,
    pending: applications.filter(item => item.status === 'pending').length,
    inProcess: applications.filter(item => item.status === 'in_process').length,
    approved: applications.filter(item => item.status === 'approved').length,
    rejected: applications.filter(item => item.status === 'rejected').length
  });
});

app.listen(PORT, () => {
  console.log(`ShewaDigital backend running at http://localhost:${PORT}`);
});
