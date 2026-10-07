"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const store_1 = require("./models/store");
const seed_1 = require("./seed/seed");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const ordersRoutes_1 = __importDefault(require("./routes/ordersRoutes"));
const paymentsRoutes_1 = __importDefault(require("./routes/paymentsRoutes"));
const fraudRoutes_1 = __importDefault(require("./routes/fraudRoutes"));
const upiRoutes_1 = __importDefault(require("./routes/upiRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const apiKeysRoutes_1 = __importDefault(require("./routes/apiKeysRoutes"));
const webhooksRoutes_1 = __importDefault(require("./routes/webhooksRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const verifyRoutes_1 = __importDefault(require("./routes/verifyRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Security Middlewares
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false, // sandbox educational flexibility
    crossOriginEmbedderPolicy: false,
}));
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
// Rate Limiter
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' },
});
app.use('/api', limiter);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Automatic Seed if database empty
if (store_1.dbStore.users.length === 0 || store_1.dbStore.payments.length === 0) {
    console.log('[PayGuard] Initial empty database detected. Seeding sandbox records...');
    (0, seed_1.seedDatabase)();
}
// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ONLINE',
        service: 'PayGuard Intelligence & Sandbox Core',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        records: {
            payments: store_1.dbStore.payments.length,
            merchants: store_1.dbStore.merchants.length,
            rules: store_1.dbStore.fraudRules.length,
            alerts: store_1.dbStore.fraudAlerts.length,
        },
    });
});
// API Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/orders', ordersRoutes_1.default);
app.use('/api/payments', paymentsRoutes_1.default);
app.use('/api/fraud', fraudRoutes_1.default);
app.use('/api/upi', upiRoutes_1.default);
app.use('/api/dashboard', dashboardRoutes_1.default);
app.use('/api/api-keys', apiKeysRoutes_1.default);
app.use('/api/webhooks', webhooksRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/verify', verifyRoutes_1.default);
// Fallback 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found` });
});
// Global Error Handler
app.use((err, req, res, next) => {
    console.error('[PayGuard Server Error]:', err);
    res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});
app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🛡️  PAYGUARD FINTECH & FRAUD DEFENSE ENGINE ONLINE`);
    console.log(`🚀  Server running on http://localhost:${PORT}`);
    console.log(`📊  Sandbox payments: ${store_1.dbStore.payments.length} loaded`);
    console.log(`⚖️  Active fraud rules: ${store_1.dbStore.fraudRules.length} rules`);
    console.log(`====================================================`);
});
