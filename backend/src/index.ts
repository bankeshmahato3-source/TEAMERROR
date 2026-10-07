import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { dbStore } from './models/store';
import { seedDatabase } from './seed/seed';

import authRoutes from './routes/authRoutes';
import ordersRoutes from './routes/ordersRoutes';
import paymentsRoutes from './routes/paymentsRoutes';
import fraudRoutes from './routes/fraudRoutes';
import upiRoutes from './routes/upiRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import apiKeysRoutes from './routes/apiKeysRoutes';
import webhooksRoutes from './routes/webhooksRoutes';
import adminRoutes from './routes/adminRoutes';
import verifyRoutes from './routes/verifyRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(
  helmet({
    contentSecurityPolicy: false, // sandbox educational flexibility
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' },
});
app.use('/api', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Automatic Seed if database empty
if (dbStore.users.length === 0 || dbStore.payments.length === 0) {
  console.log('[PayGuard] Initial empty database detected. Seeding sandbox records...');
  seedDatabase();
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'PayGuard Intelligence & Sandbox Core',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    records: {
      payments: dbStore.payments.length,
      merchants: dbStore.merchants.length,
      rules: dbStore.fraudRules.length,
      alerts: dbStore.fraudAlerts.length,
    },
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/fraud', fraudRoutes);
app.use('/api/upi', upiRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/api-keys', apiKeysRoutes);
app.use('/api/webhooks', webhooksRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/verify', verifyRoutes);

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found` });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[PayGuard Server Error]:', err);
  res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🛡️  PAYGUARD FINTECH & FRAUD DEFENSE ENGINE ONLINE`);
  console.log(`🚀  Server running on http://localhost:${PORT}`);
  console.log(`📊  Sandbox payments: ${dbStore.payments.length} loaded`);
  console.log(`⚖️  Active fraud rules: ${dbStore.fraudRules.length} rules`);
  console.log(`====================================================`);
});
