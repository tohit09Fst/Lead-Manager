import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Lead from './models/Lead.js';

dotenv.config();

const sampleLeads = [
  {
    name: 'Sarah Connor',
    email: 'sarah.connor@cyberdyne.com',
    phone: '+1 555-019-2834',
    company: 'Resistance Systems',
    source: 'Website',
    status: 'New'
  },
  {
    name: 'Michael Scott',
    email: 'm.scott@dundermifflin.com',
    phone: '+1 555-014-9988',
    company: 'Dunder Mifflin Paper Co.',
    source: 'Referral',
    status: 'Contacted'
  },
  {
    name: 'Elena Rostova',
    email: 'elena@novatech.io',
    phone: '+44 20 7946 0912',
    company: 'NovaTech Solutions',
    source: 'LinkedIn',
    status: 'Qualified'
  },
  {
    name: 'David Kim',
    email: 'dkim@apexlogistics.com',
    phone: '+1 555-017-4321',
    company: 'Apex Logistics',
    source: 'Cold Call',
    status: 'Lost'
  },
  {
    name: 'Amina Al-Mansoor',
    email: 'amina@solarenergypartners.ae',
    phone: '+971 4 391 1111',
    company: 'Solar Energy Partners',
    source: 'Website',
    status: 'Qualified'
  }
];

const seedData = async () => {
  try {
    await connectDB();
    await Lead.deleteMany({});
    console.log('[Seed] Existing leads cleared.');
    const created = await Lead.insertMany(sampleLeads);
    console.log(`[Seed] Successfully inserted ${created.length} sample leads!`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
