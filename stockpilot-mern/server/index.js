require('dotenv').config();
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Mongoose Schemas & Models
const Item = require('./models/Item');
const User = require('./models/User');
const Plan = require('./models/Plan');
const Portfolio = require('./models/Portfolio');
const Notification = require('./models/Notification');

const {
  generate,
  plan,
  calculateAccuracy,
  solveNewsvendor,
  simulateScenario,
  getSuppliers
} = require('./lib/model');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'stockpilot_secret_key_2026';
const PORT = process.env.PORT || 5000;

// Helper: check if MongoDB connection is open and active
const isDbConnected = () => mongoose.connection.readyState === 1;

// Helper: standardize document output so both id and _id exist for frontend compatibility
const formatDoc = (doc) => {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  const strId = (obj._id || obj.id || '').toString();
  return {
    ...obj,
    id: strId || obj.id,
    _id: obj._id || strId
  };
};

// In-Memory Backup Data Store (Works seamlessly when MongoDB is offline)
let inMemoryItems = generate(7);
let inMemorySuppliers = getSuppliers();
let inMemoryPlans = [];
let inMemoryPortfolio = [
  {
    id: 'port-1',
    destination: 'Goa',
    category: 'Hotel Rooms',
    units: 240,
    cost: 3200,
    price: 4400,
    totalCommitted: 768000,
    expectedRevenue: 1056000,
    expectedProfit: 288000,
    status: 'ACTIVE',
    committedAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'port-2',
    destination: 'Dubai',
    category: 'Flight Seats',
    units: 180,
    cost: 14000,
    price: 16800,
    totalCommitted: 2520000,
    expectedRevenue: 3024000,
    expectedProfit: 504000,
    status: 'ACTIVE',
    committedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

let inMemoryNotifications = [
  {
    id: 'notif-1',
    type: 'ALERT',
    title: 'Surge Demand Detected in Goa',
    message: 'Q4 holiday travel spike predicted. +22% YoY expected in beachfront rooms.',
    date: '10m ago',
    read: false
  },
  {
    id: 'notif-2',
    type: 'SUCCESS',
    title: 'Budget Optimization Generated',
    message: '₹10 Cr capital allocated across 8 inventory blocks with 96% expected sell-through.',
    date: '1h ago',
    read: false
  },
  {
    id: 'notif-3',
    type: 'INFO',
    title: 'Newsvendor Critical Ratio Adjusted',
    message: 'Maldives cancellation rate increased to 18%; critical ratio lowered to 0.72.',
    date: '4h ago',
    read: true
  }
];

const OFFICIAL_DEMO_USER = {
  id: 'demo-user-stockpilot',
  name: 'Demo Visitor',
  email: 'demo@stockpilot.ai',
  company: 'SkyRoute Travels OTA (Demo)',
  role: 'Head of Travel Procurement',
  isDemo: true,
  passwordHash: bcrypt.hashSync('demo123', 10)
};

let inMemoryUsers = [
  OFFICIAL_DEMO_USER,
  {
    id: 'user-1',
    name: 'K Sai Goud',
    email: 'sai@stockpilot.ai',
    company: 'SkyRoute Travels OTA',
    role: 'Head of Procurement',
    passwordHash: bcrypt.hashSync('demo123', 10)
  }
];

// Auto-seed database when connected
async function initDatabase() {
  try {
    const itemCount = await Item.countDocuments();
    if (itemCount === 0) {
      console.log('MongoDB Atlas: Initializing empty inventory collection...');
      const seedItems = generate(7);
      await Item.insertMany(seedItems);
      console.log(`MongoDB Atlas: Seeded ${seedItems.length} inventory opportunities.`);
    }

    const demoUser = await User.findOne({ email: 'demo@stockpilot.ai' });
    if (!demoUser) {
      await User.create(OFFICIAL_DEMO_USER);
      console.log('MongoDB Atlas: Created demo account (demo@stockpilot.ai).');
    }

    const portCount = await Portfolio.countDocuments();
    if (portCount === 0) {
      await Portfolio.insertMany(inMemoryPortfolio);
      console.log('MongoDB Atlas: Seeded initial portfolio records.');
    }

    const notifCount = await Notification.countDocuments();
    if (notifCount === 0) {
      await Notification.insertMany(inMemoryNotifications);
      console.log('MongoDB Atlas: Seeded initial notifications.');
    }
  } catch (err) {
    console.warn('MongoDB Atlas auto-init notice:', err.message);
  }
}

// Middleware: Ensure database connection is active (critical for Serverless environments like Vercel)
let isConnecting = false;
async function ensureDbConnected() {
  if (mongoose.connection.readyState === 1) return true;
  if (isConnecting) return false;
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri || mongoUri.includes('<cluster-host>')) return false;
  try {
    isConnecting = true;
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB Atlas:', mongoose.connection.host);
    await initDatabase();
    return true;
  } catch (err) {
    console.warn('MongoDB connection attempt failed:', err.message);
    return false;
  } finally {
    isConnecting = false;
  }
}

app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1 && process.env.MONGO_URI) {
    await ensureDbConnected().catch(() => {});
  }
  next();
});

// ----------------- HEALTH CHECK -----------------
app.get('/api/health', async (req, res) => {
  let count = inMemoryItems.length;
  if (isDbConnected()) {
    try {
      count = await Item.countDocuments();
    } catch (e) { }
  }

  res.json({
    ok: true,
    service: 'StockPilot AI API',
    mongo: isDbConnected(),
    database: isDbConnected() ? mongoose.connection.name : 'in-memory-fallback',
    host: isDbConnected() ? mongoose.connection.host : 'offline',
    inventoryCount: count,
    timestamp: new Date().toISOString()
  });
});

// ----------------- AUTH ROUTES -----------------
app.post('/api/auth/demo', async (req, res) => {
  let user = OFFICIAL_DEMO_USER;
  if (isDbConnected()) {
    try {
      let dbUser = await User.findOne({ email: 'demo@stockpilot.ai' });
      if (!dbUser) {
        dbUser = await User.create(OFFICIAL_DEMO_USER);
      }
      user = formatDoc(dbUser);
    } catch (err) {
      console.warn('DB demo lookup failed, using fallback:', err.message);
    }
  }

  const token = jwt.sign(
    { id: user.id || user._id, email: user.email, name: user.name, role: user.role, isDemo: true },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: {
      id: user.id || user._id,
      name: user.name,
      email: user.email,
      company: user.company,
      role: user.role,
      isDemo: true
    }
  });
});

app.post('/api/demo/reset', async (req, res) => {
  inMemoryItems = generate(7);
  inMemorySuppliers = getSuppliers();
  inMemoryPlans = [];
  inMemoryPortfolio = [
    {
      id: 'port-1',
      destination: 'Goa',
      category: 'Hotel Rooms',
      units: 240,
      cost: 3200,
      price: 4400,
      totalCommitted: 768000,
      expectedRevenue: 1056000,
      expectedProfit: 288000,
      status: 'ACTIVE',
      committedAt: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
      id: 'port-2',
      destination: 'Dubai',
      category: 'Flight Seats',
      units: 180,
      cost: 14000,
      price: 16800,
      totalCommitted: 2520000,
      expectedRevenue: 3024000,
      expectedProfit: 504000,
      status: 'ACTIVE',
      committedAt: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ];
  inMemoryNotifications = [
    {
      id: 'notif-1',
      type: 'ALERT',
      title: 'Surge Demand Detected in Goa',
      message: 'Q4 holiday travel spike predicted. +22% YoY expected in beachfront rooms.',
      date: '10m ago',
      read: false
    },
    {
      id: 'notif-2',
      type: 'SUCCESS',
      title: 'Budget Optimization Generated',
      message: '₹10 Cr capital allocated across 8 inventory blocks with 96% expected sell-through.',
      date: '1h ago',
      read: false
    },
    {
      id: 'notif-3',
      type: 'INFO',
      title: 'Newsvendor Critical Ratio Adjusted',
      message: 'Maldives cancellation rate increased to 18%; critical ratio lowered to 0.72.',
      date: '4h ago',
      read: true
    }
  ];

  if (isDbConnected()) {
    try {
      await Item.deleteMany({});
      await Item.insertMany(inMemoryItems);
      await Portfolio.deleteMany({});
      await Portfolio.insertMany(inMemoryPortfolio);
      await Notification.deleteMany({});
      await Notification.insertMany(inMemoryNotifications);
    } catch (err) {
      console.warn('DB reset error:', err.message);
    }
  }

  res.json({
    success: true,
    message: 'Demo dataset restored to pristine state.',
    inventoryCount: inMemoryItems.length
  });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).json({
      message: 'Email and password are required',
      error: 'Email and password are required'
    });
  }

  const cleanEmail = String(email).trim().toLowerCase();

  // 1. Log: Email received
  console.log(`[AUTH LOGIN] 1. Email received: "${cleanEmail}"`);

  let user = null;
  let userFoundInMongo = false;

  // Ensure DB connected if possible
  if (mongoose.connection.readyState !== 1 && process.env.MONGO_URI) {
    await ensureDbConnected().catch(() => {});
  }

  // 2. Log: Whether a user was found in MongoDB
  if (isDbConnected()) {
    try {
      const dbUser = await User.findOne({ email: cleanEmail });
      if (dbUser) {
        user = formatDoc(dbUser);
        userFoundInMongo = true;
      }
    } catch (err) {
      console.warn('[AUTH LOGIN] DB lookup error:', err.message);
    }
  } else {
    // Only check in-memory store when MongoDB is offline
    const memUser = inMemoryUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (memUser) {
      user = memUser;
    }
  }

  console.log(`[AUTH LOGIN] 2. User found in MongoDB: ${userFoundInMongo} (activeDb: ${isDbConnected()})`);

  // Expected Behavior: If user does not exist in MongoDB:
  // Return HTTP 401 and JSON: {"message":"Account not found. Please sign up first."}
  if (!user) {
    console.log(`[AUTH LOGIN] REJECTED: User "${cleanEmail}" does not exist. Returning HTTP 401.`);
    return res.status(401).json({
      message: 'Account not found. Please sign up first.',
      error: 'Account not found. Please sign up first.'
    });
  }

  // 3. Log: Whether password comparison succeeded
  const passwordMatch = !!(user.passwordHash && bcrypt.compareSync(password, user.passwordHash));
  console.log(`[AUTH LOGIN] 3. Password comparison succeeded: ${passwordMatch}`);

  // Expected Behavior: If password is incorrect:
  // Return HTTP 401 and JSON: {"message":"Invalid email or password."}
  if (!passwordMatch) {
    console.log(`[AUTH LOGIN] REJECTED: Password incorrect for "${cleanEmail}". Returning HTTP 401.`);
    return res.status(401).json({
      message: 'Invalid email or password.',
      error: 'Invalid email or password.'
    });
  }

  // 4. Log: Whether JWT generation was executed
  const isDemo = !!(user.isDemo || user.email === 'demo@stockpilot.ai');
  const token = jwt.sign(
    { id: user.id || user._id, email: user.email, name: user.name, role: user.role, isDemo },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  console.log(`[AUTH LOGIN] 4. JWT generation executed: true (User ID: ${user.id || user._id})`);

  // Return HTTP 200 with valid authentication response
  return res.status(200).json({
    token,
    user: {
      id: user.id || user._id,
      name: user.name,
      email: user.email,
      company: user.company,
      role: user.role,
      isDemo
    }
  });
});

app.post('/api/auth/register', async (req, res) => {
  const { name, company, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const cleanEmail = String(email).trim().toLowerCase();

  let existing = null;
  if (isDbConnected()) {
    try {
      existing = await User.findOne({ email: cleanEmail });
    } catch (err) {}
  }

  if (!existing) {
    existing = inMemoryUsers.find(u => u.email.toLowerCase() === cleanEmail);
  }

  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists. Please log in.' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  let newUser = null;

  if (isDbConnected()) {
    try {
      const created = await User.create({
        name,
        company: company || 'Travel Partners Ltd',
        email: cleanEmail,
        role: 'Procurement Director',
        isDemo: false,
        passwordHash
      });
      newUser = formatDoc(created);
    } catch (err) {
      console.warn('DB register error, fallback to memory:', err.message);
    }
  }

  if (!newUser) {
    newUser = {
      id: 'user-' + Date.now(),
      name,
      company: company || 'Travel Partners Ltd',
      email: cleanEmail,
      role: 'Procurement Director',
      isDemo: false,
      passwordHash
    };
    inMemoryUsers.push(newUser);
  }

  const token = jwt.sign(
    { id: newUser.id || newUser._id, email: newUser.email, name: newUser.name, role: newUser.role, isDemo: false },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(201).json({
    token,
    user: {
      id: newUser.id || newUser._id,
      name: newUser.name,
      email: newUser.email,
      company: newUser.company,
      role: newUser.role,
      isDemo: false
    }
  });
});

app.get('/api/auth/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header required' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    let user = null;
    if (isDbConnected() && decoded.id) {
      try {
        const dbUser = await User.findById(decoded.id);
        if (dbUser) user = formatDoc(dbUser);
      } catch (e) { }
    }

    if (!user) {
      user = inMemoryUsers.find(u => u.id === decoded.id || u.email === decoded.email);
    }

    if (!user) {
      return res.status(401).json({ error: 'User session expired or not found' });
    }

    res.json({
      user: {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        company: user.company,
        role: user.role,
        isDemo: !!user.isDemo
      }
    });
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired authentication token' });
  }
});

// ----------------- INVENTORY ROUTES -----------------
app.get('/api/inventory', async (req, res) => {
  if (isDbConnected()) {
    try {
      const items = await Item.find({}).sort({ createdAt: -1 });
      if (items && items.length > 0) {
        return res.json(items.map(formatDoc));
      }
    } catch (err) {
      console.warn('DB inventory fetch error:', err.message);
    }
  }
  res.json(inMemoryItems);
});

app.post('/api/inventory', async (req, res) => {
  const { name, type, cost, price, cancel, cap, description, supplier, travelDate } = req.body;
  const itemPayload = {
    name: name || 'New Destination',
    type: type || 'Hotel Rooms',
    destination: name || 'New Destination',
    category: type || 'Hotel Rooms',
    cost: +cost || 3500,
    price: +price || 4900,
    cancel: +cancel || 0.12,
    cap: +cap || 8000,
    availableQty: Math.round((+cap || 8000) * 0.75),
    purchasedQty: Math.round((+cap || 8000) * 0.25),
    travelDate: travelDate || 'Q4 2026 - W12',
    supplier: supplier || 'Global Wholesale Network',
    description: description || 'Procured travel inventory block.',
    obs: (inMemoryItems[0] && inMemoryItems[0].obs) ? inMemoryItems[0].obs.map(v => Math.round(v * 0.9)) : [800, 850, 900],
    soldOut: (inMemoryItems[0] && inMemoryItems[0].soldOut) ? inMemoryItems[0].soldOut.slice() : [false, false, true]
  };

  if (isDbConnected()) {
    try {
      const created = await Item.create(itemPayload);
      const doc = formatDoc(created);
      inMemoryItems.unshift(doc);
      return res.status(201).json(doc);
    } catch (err) {
      console.warn('DB inventory create error:', err.message);
    }
  }

  const newItem = {
    id: 'inv-' + Date.now(),
    ...itemPayload
  };
  inMemoryItems.unshift(newItem);
  res.status(201).json(newItem);
});

app.put('/api/inventory/:id', async (req, res) => {
  const { id } = req.params;

  if (isDbConnected()) {
    try {
      const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id };
      const updated = await Item.findOneAndUpdate(query, req.body, { new: true });
      if (updated) {
        const doc = formatDoc(updated);
        const idx = inMemoryItems.findIndex(i => i.id === id || i._id === id);
        if (idx !== -1) inMemoryItems[idx] = doc;
        return res.json(doc);
      }
    } catch (err) {
      console.warn('DB inventory update error:', err.message);
    }
  }

  const idx = inMemoryItems.findIndex(i => i.id === id || i._id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  inMemoryItems[idx] = { ...inMemoryItems[idx], ...req.body };
  res.json(inMemoryItems[idx]);
});

app.delete('/api/inventory/:id', async (req, res) => {
  const { id } = req.params;

  if (isDbConnected()) {
    try {
      const count = await Item.countDocuments();
      if (count <= 3) {
        return res.status(400).json({ error: 'Safeguard: At least 3 inventory opportunities must remain active for forecasting.' });
      }
      const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id };
      await Item.findOneAndDelete(query);
    } catch (err) {
      console.warn('DB inventory delete error:', err.message);
    }
  } else {
    if (inMemoryItems.length <= 3) {
      return res.status(400).json({ error: 'Demo safeguard: At least 3 inventory opportunities must remain active for forecasting.' });
    }
  }

  inMemoryItems = inMemoryItems.filter(i => i.id !== id && i._id !== id);
  res.json({ success: true, id });
});

// ----------------- PROCUREMENT & OPTIMIZATION -----------------
app.post('/api/plan', async (req, res) => {
  const budget = Math.min(5e8, Math.max(1e6, +req.body.budget || 1e8));
  const lambda = Math.min(1, Math.max(0, req.body.lambda == null ? 0.4 : +req.body.lambda));

  let itemsToUse = inMemoryItems;
  if (isDbConnected()) {
    try {
      const dbItems = await Item.find({});
      if (dbItems && dbItems.length > 0) itemsToUse = dbItems.map(formatDoc);
    } catch (e) { }
  }

  const result = plan(itemsToUse, budget, lambda);

  if (isDbConnected()) {
    try {
      await Plan.create({
        budget,
        lambda,
        kpis: result.kpis,
        rows: result.rows
      });
    } catch (err) {
      console.warn('DB plan save error:', err.message);
    }
  }

  inMemoryPlans.unshift({
    id: 'plan-' + Date.now(),
    budget,
    lambda,
    kpis: result.kpis,
    rows: result.rows,
    createdAt: new Date().toISOString()
  });
  if (inMemoryPlans.length > 20) inMemoryPlans.pop();

  res.json(result);
});

app.get('/api/plans', async (req, res) => {
  if (isDbConnected()) {
    try {
      const dbPlans = await Plan.find({}).sort({ createdAt: -1 }).limit(20);
      if (dbPlans && dbPlans.length > 0) return res.json(dbPlans.map(formatDoc));
    } catch (err) {
      console.warn('DB plans fetch error:', err.message);
    }
  }
  res.json(inMemoryPlans);
});

app.post('/api/reseed', async (req, res) => {
  const seed = +req.body.seed || Math.floor(Math.random() * 1e6);
  inMemoryItems = generate(seed);

  if (isDbConnected()) {
    try {
      await Item.deleteMany({});
      await Item.insertMany(inMemoryItems);
    } catch (err) {
      console.warn('DB reseed error:', err.message);
    }
  }

  res.json({ seed, count: inMemoryItems.length });
});

// ----------------- SCENARIO SIMULATOR -----------------
app.post('/api/simulate', async (req, res) => {
  const {
    budget = 1e8,
    lambda = 0.4,
    demandDeltaPct = 0,
    costDeltaPct = 0,
    priceDeltaPct = 0,
    cancelDeltaPct = 0
  } = req.body;

  let itemsToUse = inMemoryItems;
  if (isDbConnected()) {
    try {
      const dbItems = await Item.find({});
      if (dbItems && dbItems.length > 0) itemsToUse = dbItems.map(formatDoc);
    } catch (e) { }
  }

  const simulation = simulateScenario({
    baseItems: itemsToUse,
    budget: +budget,
    lambda: +lambda,
    demandDeltaPct: +demandDeltaPct,
    costDeltaPct: +costDeltaPct,
    priceDeltaPct: +priceDeltaPct,
    cancelDeltaPct: +cancelDeltaPct
  });

  res.json(simulation);
});

// ----------------- FORECAST ACCURACY -----------------
app.get('/api/accuracy', async (req, res) => {
  let itemsToUse = inMemoryItems;
  if (isDbConnected()) {
    try {
      const dbItems = await Item.find({});
      if (dbItems && dbItems.length > 0) itemsToUse = dbItems.map(formatDoc);
    } catch (e) { }
  }
  const accuracy = calculateAccuracy(itemsToUse);
  res.json(accuracy);
});

// ----------------- STANDALONE NEWSVENDOR SOLVER -----------------
app.post('/api/newsvendor', (req, res) => {
  const {
    cost = 3200,
    price = 4400,
    cancelRate = 0.12,
    salvageRate = 0.25,
    mean = 900,
    sd = 120
  } = req.body;

  const result = solveNewsvendor({
    cost: +cost,
    price: +price,
    cancelRate: +cancelRate,
    salvageRate: +salvageRate,
    mean: +mean,
    sd: +sd
  });

  res.json(result);
});

// ----------------- SUPPLIERS INTELLIGENCE -----------------
app.get('/api/suppliers', (req, res) => {
  res.json(inMemorySuppliers);
});

// ----------------- PORTFOLIO ROUTES -----------------
app.get('/api/portfolio', async (req, res) => {
  if (isDbConnected()) {
    try {
      const dbPort = await Portfolio.find({}).sort({ committedAt: -1 });
      if (dbPort && dbPort.length > 0) return res.json(dbPort.map(formatDoc));
    } catch (err) {
      console.warn('DB portfolio fetch error:', err.message);
    }
  }
  res.json(inMemoryPortfolio);
});

app.post('/api/portfolio/order', async (req, res) => {
  const { destination, category, units, cost, price, expectedProfit } = req.body;
  const orderPayload = {
    destination,
    category,
    units: +units,
    cost: +cost,
    price: +price,
    totalCommitted: +units * +cost,
    expectedRevenue: +units * +price,
    expectedProfit: +expectedProfit,
    status: 'ACTIVE',
    committedAt: new Date()
  };

  const notifPayload = {
    type: 'SUCCESS',
    title: `Order Executed: ${destination} ${category}`,
    message: `Procured ${units} units for ₹${((units * cost) / 1e5).toFixed(1)} Lakhs.`,
    date: 'Just now',
    read: false
  };

  if (isDbConnected()) {
    try {
      const createdOrder = await Portfolio.create(orderPayload);
      const createdNotif = await Notification.create(notifPayload);
      inMemoryPortfolio.unshift(formatDoc(createdOrder));
      inMemoryNotifications.unshift(formatDoc(createdNotif));
      return res.status(201).json(formatDoc(createdOrder));
    } catch (err) {
      console.warn('DB portfolio order error:', err.message);
    }
  }

  const newOrder = {
    id: 'port-' + Date.now(),
    ...orderPayload,
    committedAt: new Date().toISOString()
  };
  inMemoryPortfolio.unshift(newOrder);

  inMemoryNotifications.unshift({
    id: 'notif-' + Date.now(),
    ...notifPayload
  });

  res.status(201).json(newOrder);
});

// ----------------- NOTIFICATIONS -----------------
app.get('/api/notifications', async (req, res) => {
  if (isDbConnected()) {
    try {
      const dbNotifs = await Notification.find({}).sort({ createdAt: -1 });
      if (dbNotifs && dbNotifs.length > 0) return res.json(dbNotifs.map(formatDoc));
    } catch (err) {
      console.warn('DB notifications fetch error:', err.message);
    }
  }
  res.json(inMemoryNotifications);
});

app.post('/api/notifications/mark-read', async (req, res) => {
  if (isDbConnected()) {
    try {
      await Notification.updateMany({}, { read: true });
    } catch (err) {
      console.warn('DB mark-read error:', err.message);
    }
  }
  inMemoryNotifications.forEach(n => (n.read = true));
  res.json({ success: true });
});

// ----------------- START SERVER & CONNECT DATABASE -----------------
(async () => {
  const mongoUri = process.env.MONGO_URI;
  if (mongoUri && !mongoUri.includes('<cluster-host>')) {
    try {
      console.log('Connecting to MongoDB Atlas...');
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
      console.log('✅ Connected to MongoDB Atlas:', mongoose.connection.host);
      await initDatabase();
    } catch (e) {
      console.warn('⚠️ MongoDB offline or unreachable, running with in-memory fallback:', e.message);
    }
  } else {
    console.log('ℹ️ Running with local in-memory fallback. Add valid MONGO_URI in .env to connect Atlas.');
  }

  if (require.main === module) {
    app.listen(PORT, () => {
      console.log(`🚀 StockPilot AI API running on http://localhost:${PORT}`);
    });
  }
})();

module.exports = app;
