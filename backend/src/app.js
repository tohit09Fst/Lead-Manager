import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import leadRoutes from './routes/leadRoutes.js';
import authRoutes from './routes/authRoutes.js';
import User from './models/User.js';
import Lead from './models/Lead.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Connect to Database
await connectDB();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Auto-seed demo user & initial leads if empty
export const autoSeedIfEmpty = async () => {
  try {
    let demoUser = await User.findOne({ email: 'demo@merutechno.com' });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Demo Sales Rep',
        email: 'demo@merutechno.com',
        password: 'password123'
      });
      console.log('[Seed] Default demo user created: demo@merutechno.com / password123');
    }

    const leadCount = await Lead.countDocuments({ user: demoUser._id });
    if (leadCount === 0) {
      await Lead.insertMany([
        {
          user: demoUser._id,
          name: 'Sarah Connor',
          email: 'sarah.connor@cyberdyne.com',
          phone: '+1 555-019-2834',
          company: 'Resistance Systems',
          source: 'Website',
          status: 'New'
        },
        {
          user: demoUser._id,
          name: 'Michael Scott',
          email: 'm.scott@dundermifflin.com',
          phone: '+1 555-014-9988',
          company: 'Dunder Mifflin Paper Co.',
          source: 'Referral',
          status: 'Contacted'
        },
        {
          user: demoUser._id,
          name: 'Elena Rostova',
          email: 'elena@novatech.io',
          phone: '+44 20 7946 0912',
          company: 'NovaTech Solutions',
          source: 'LinkedIn',
          status: 'Qualified'
        },
        {
          user: demoUser._id,
          name: 'David Kim',
          email: 'dkim@apexlogistics.com',
          phone: '+1 555-017-4321',
          company: 'Apex Logistics',
          source: 'Cold Call',
          status: 'Lost'
        },
        {
          user: demoUser._id,
          name: 'Amina Al-Mansoor',
          email: 'amina@solarenergypartners.ae',
          phone: '+971 4 391 1111',
          company: 'Solar Energy Partners',
          source: 'Website',
          status: 'Qualified'
        },
        {
          user: demoUser._id,
          name: 'Marcus Brody',
          email: 'marcus@museumarch.edu',
          phone: '+1 555-018-7711',
          company: 'National Heritage Foundation',
          source: 'Website',
          status: 'New'
        },
        {
          user: demoUser._id,
          name: 'Chloe Decker',
          email: 'cdecker@lapd-consult.gov',
          phone: '+1 555-013-4422',
          company: 'Decker & Partners',
          source: 'Referral',
          status: 'Contacted'
        }
      ]);
      console.log('[Seed] Database initialized with sample leads for demo user.');
    }
  } catch (seedErr) {
    console.warn('[Seed] Note: Could not auto-seed demo data:', seedErr.message);
  }
};

await autoSeedIfEmpty();

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
