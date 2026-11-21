require('dotenv').config();
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Item = require('./models/Item');
const User = require('./models/User');
const Portfolio = require('./models/Portfolio');
const Notification = require('./models/Notification');
const { generate, getSuppliers } = require('./lib/model');

(async () => {
  if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('<cluster-host>')) {
    console.log('⚠️ Please provide your MongoDB Atlas cluster hostname in server/.env (replace <cluster-host>).');
    console.log('Example: mongodb+srv://ksaiganesh64_db_user:vDQ2y4wnj40Ectpb@stockpilotcluster.xxxxx.mongodb.net/stockpilot');
    process.exit(0);
  }

  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 });
  console.log('Connected to MongoDB Atlas:', mongoose.connection.host);

  // 1. Seed Inventory Items
  await Item.deleteMany({});
  const items = generate(7);
  await Item.insertMany(items);
  console.log(`Seeded ${items.length} synthetic travel inventory items.`);

  // 2. Ensure Official Demo User
  const demoEmail = 'demo@stockpilot.ai';
  let demoUser = await User.findOne({ email: demoEmail });
  if (!demoUser) {
    demoUser = await User.create({
      name: 'Demo Visitor',
      email: demoEmail,
      company: 'SkyRoute Travels OTA (Demo)',
      role: 'Head of Travel Procurement',
      isDemo: true,
      passwordHash: bcrypt.hashSync('demo123', 10)
    });
    console.log('Created dedicated Demo User account:', demoEmail);
  } else {
    demoUser.isDemo = true;
    await demoUser.save();
    console.log('Verified existing Demo User account:', demoEmail);
  }

  // 3. Seed Initial Portfolio
  await Portfolio.deleteMany({});
  const initialPortfolio = [
    {
      destination: 'Goa',
      category: 'Hotel Rooms',
      units: 240,
      cost: 3200,
      price: 4400,
      totalCommitted: 768000,
      expectedRevenue: 1056000,
      expectedProfit: 288000,
      status: 'ACTIVE',
      committedAt: new Date(Date.now() - 86400000 * 3)
    },
    {
      destination: 'Dubai',
      category: 'Flight Seats',
      units: 180,
      cost: 14000,
      price: 16800,
      totalCommitted: 2520000,
      expectedRevenue: 3024000,
      expectedProfit: 504000,
      status: 'ACTIVE',
      committedAt: new Date(Date.now() - 86400000 * 2)
    }
  ];
  await Portfolio.insertMany(initialPortfolio);
  console.log('Seeded committed portfolio ledger.');

  // 4. Seed Initial Notifications
  await Notification.deleteMany({});
  const initialNotifications = [
    {
      type: 'ALERT',
      title: 'Surge Demand Detected in Goa',
      message: 'Q4 holiday travel spike predicted. +22% YoY expected in beachfront rooms.',
      date: '10m ago',
      read: false
    },
    {
      type: 'SUCCESS',
      title: 'Budget Optimization Generated',
      message: '₹10 Cr capital allocated across 8 inventory blocks with 96% expected sell-through.',
      date: '1h ago',
      read: false
    },
    {
      type: 'INFO',
      title: 'Newsvendor Critical Ratio Adjusted',
      message: 'Maldives cancellation rate increased to 18%; critical ratio lowered to 0.72.',
      date: '4h ago',
      read: true
    }
  ];
  await Notification.insertMany(initialNotifications);
  console.log('Seeded notification alerts feed.');

  console.log('✅ StockPilot AI MongoDB Atlas seeding completed successfully.');
  process.exit(0);
})().catch(e => {
  console.error('❌ Seeding error:', e.message);
  process.exit(1);
});
