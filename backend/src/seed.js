import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
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
  },
  {
    name: 'Marcus Brody',
    email: 'marcus@museumarch.edu',
    phone: '+1 555-018-7711',
    company: 'National Heritage Foundation',
    source: 'Website',
    status: 'New'
  },
  {
    name: 'Chloe Decker',
    email: 'cdecker@lapd-consult.gov',
    phone: '+1 555-013-4422',
    company: 'Decker & Partners',
    source: 'Referral',
    status: 'Contacted'
  }
];

const seedData = async () => {
  try {
    await connectDB();

    // Create or get demo user
    let user = await User.findOne({ email: 'demo@merutechno.com' });
    if (!user) {
      user = await User.create({
        name: 'Demo Sales Rep',
        email: 'demo@merutechno.com',
        password: 'password123'
      });
      console.log('[Seed] Created demo user: demo@merutechno.com / password123');
    }

    // Clear existing leads for demo user
    await Lead.deleteMany({ user: user._id });
    console.log('[Seed] Cleared existing leads for demo user.');

    // Associate leads with user
    const leadsWithUser = sampleLeads.map((lead) => ({
      ...lead,
      user: user._id
    }));

    const created = await Lead.insertMany(leadsWithUser);
    console.log(`[Seed] Successfully inserted ${created.length} sample leads for demo user!`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
