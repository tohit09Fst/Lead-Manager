import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import leadRoutes from './src/routes/leadRoutes.js';
import { errorHandler, notFound } from './src/middleware/errorHandler.js';

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

// API Routes
app.use('/api/leads', leadRoutes);

// Auto-seed sample leads if collection is empty
import Lead from './src/models/Lead.js';
const autoSeedIfEmpty = async () => {
  try {
    const count = await Lead.countDocuments();
    if (count === 0) {
      await Lead.insertMany([
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
      ]);
      console.log('[Seed] Database initialized with 5 sample leads.');
    }
  } catch (seedErr) {
    console.warn('[Seed] Note: Could not auto-seed initial data:', seedErr.message);
  }
};
await autoSeedIfEmpty();

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`[Server] Lead Manager Backend API running on port ${PORT}`);
});

export default app;
