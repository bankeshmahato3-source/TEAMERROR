"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const store_1 = require("../models/store");
const seedDatabase = async () => {
    console.log('[Seed] Initializing PayGuard sandbox database seed...');
    // Reset store
    store_1.dbStore.reset();
    const passwordHash = await bcryptjs_1.default.hash('Admin@123', 10);
    const analystHash = await bcryptjs_1.default.hash('Analyst@123', 10);
    const merchantHash = await bcryptjs_1.default.hash('Merchant@123', 10);
    const customerHash = await bcryptjs_1.default.hash('Customer@123', 10);
    // 1. Seed Users (All 4 roles)
    const users = [
        {
            id: 'usr_admin_01',
            name: 'Dr. Sarah Connor',
            email: 'admin@payguard.io',
            passwordHash,
            role: 'ADMIN',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
            createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
        },
        {
            id: 'usr_analyst_01',
            name: 'Alex Mercer (SOC Lead)',
            email: 'analyst@payguard.io',
            passwordHash: analystHash,
            role: 'SECURITY_ANALYST',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
            createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
        },
        {
            id: 'usr_merch_01',
            name: 'Vikram Mehta (Store Owner)',
            email: 'merchant@payguard.io',
            passwordHash: merchantHash,
            role: 'MERCHANT',
            merchantId: 'merch_01',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
            createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
        },
        {
            id: 'usr_cust_01',
            name: 'Priya Sharma (Shopper)',
            email: 'customer@payguard.io',
            passwordHash: customerHash,
            role: 'CUSTOMER',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
            createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
        },
    ];
    // Additional customers
    const customerNames = [
        'Aarav Patel', 'Neha Gupta', 'Rohan Iyer', 'Kavita Reddy', 'Ananya Nair',
        'Kabir Joshi', 'Tanvi Deshmukh', 'Aditya Verma', 'Meera Bhatt', 'Karan Malhotra',
        'Ishaan Kapoor', 'Pooja Hegde', 'Siddharth Rao', 'Divya Sen', 'Arjun Saxena',
        'Rhea Pillai', 'Varun Dhawan', 'Anushka Sen', 'Gaurav Gill', 'Sneha Roy'
    ];
    customerNames.forEach((name, idx) => {
        const handle = name.toLowerCase().replace(/\s+/g, '.');
        users.push({
            id: `usr_cust_${idx + 2}`,
            name,
            email: `${handle}@example.com`,
            passwordHash: customerHash,
            role: 'CUSTOMER',
            createdAt: new Date(Date.now() - (10 + idx) * 86400000).toISOString(),
        });
    });
    store_1.dbStore.users = users;
    // 2. Seed 10+ Merchants
    const merchants = [
        {
            id: 'merch_01',
            name: 'NovaTech Electronics',
            email: 'sales@novatech.io',
            category: 'Electronics & Gadgets',
            website: 'https://novatech-electronics.demo',
            status: 'ACTIVE',
            riskScore: 14,
            trustScore: 92,
            securityScore: 94,
            webhookUrl: 'https://api.novatech.io/webhooks/payguard',
            createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
        },
        {
            id: 'merch_02',
            name: 'UrbanStyle Apparel',
            email: 'support@urbanstyle.demo',
            category: 'Fashion & Apparel',
            website: 'https://urbanstyle.demo',
            status: 'ACTIVE',
            riskScore: 22,
            trustScore: 84,
            securityScore: 88,
            webhookUrl: 'https://urbanstyle.demo/api/payments/callback',
            createdAt: new Date(Date.now() - 50 * 86400000).toISOString(),
        },
        {
            id: 'merch_03',
            name: 'CloudNode Hosting',
            email: 'billing@cloudnode.demo',
            category: 'Cloud Services & SaaS',
            website: 'https://cloudnode.demo',
            status: 'ACTIVE',
            riskScore: 18,
            trustScore: 89,
            securityScore: 90,
            createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
        },
        {
            id: 'merch_04',
            name: 'AeroPass Travel & Flights',
            email: 'reservations@aeropass.demo',
            category: 'Travel & Airlines',
            website: 'https://aeropass.demo',
            status: 'ACTIVE',
            riskScore: 28,
            trustScore: 78,
            securityScore: 82,
            createdAt: new Date(Date.now() - 40 * 86400000).toISOString(),
        },
        {
            id: 'merch_05',
            name: 'FreshGrocer Mart',
            email: 'contact@freshgrocer.demo',
            category: 'Groceries & FMCG',
            website: 'https://freshgrocer.demo',
            status: 'ACTIVE',
            riskScore: 8,
            trustScore: 96,
            securityScore: 95,
            createdAt: new Date(Date.now() - 35 * 86400000).toISOString(),
        },
        {
            id: 'merch_06',
            name: 'FitPulse Supplements',
            email: 'orders@fitpulse.demo',
            category: 'Health & Wellness',
            website: 'https://fitpulse.demo',
            status: 'ACTIVE',
            riskScore: 24,
            trustScore: 81,
            securityScore: 85,
            createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
        },
        {
            id: 'merch_07',
            name: 'GameVault Digital',
            email: 'keys@gamevault.demo',
            category: 'Digital Gaming & Keys',
            website: 'https://gamevault.demo',
            status: 'ACTIVE',
            riskScore: 38,
            trustScore: 71,
            securityScore: 76,
            createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
        },
        {
            id: 'merch_08',
            name: 'EduLearn Pro Certifications',
            email: 'admissions@edulearn.demo',
            category: 'Online Education',
            website: 'https://edulearn.demo',
            status: 'ACTIVE',
            riskScore: 12,
            trustScore: 94,
            securityScore: 92,
            createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
        },
        {
            id: 'merch_09',
            name: 'Artisan Decor Studio',
            email: 'studio@artisandecor.demo',
            category: 'Home & Living',
            website: 'https://artisandecor.demo',
            status: 'ACTIVE',
            riskScore: 16,
            trustScore: 90,
            securityScore: 89,
            createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
        },
        {
            id: 'merch_10',
            name: 'StreamWave Music',
            email: 'subs@streamwave.demo',
            category: 'Digital Media Streaming',
            website: 'https://streamwave.demo',
            status: 'ACTIVE',
            riskScore: 15,
            trustScore: 91,
            securityScore: 93,
            createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
        },
        {
            id: 'merch_suspicious_01',
            name: 'Apex QuickLoans Direct',
            email: 'support@apexloans-instant.xyz',
            category: 'Microfinance (Flagged)',
            website: 'https://apexloans-instant.xyz',
            status: 'SUSPENDED',
            riskScore: 88,
            trustScore: 24,
            securityScore: 42,
            createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
        },
        {
            id: 'merch_suspicious_02',
            name: 'QuickRefund Support Gateway',
            email: 'help@paytm-refund-verify-kyc.xyz',
            category: 'Deceptive Portal (Phishing)',
            website: 'https://paytm-refund-verify-kyc.xyz',
            status: 'SUSPENDED',
            riskScore: 95,
            trustScore: 12,
            securityScore: 28,
            createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        },
    ];
    store_1.dbStore.merchants = merchants;
    // 3. Seed Fraud Rules (Configurable rules)
    const fraudRules = [
        {
            id: 'fr_01',
            ruleId: 'RULE_HIGH_AMOUNT',
            name: 'High Amount Anomaly',
            category: 'TRANSACTION',
            weight: 20,
            enabled: true,
            thresholdValue: 25000,
            description: 'Flags payments exceeding ₹25,000 or 3.5× higher than customer average ticket size.',
        },
        {
            id: 'fr_02',
            ruleId: 'RULE_VELOCITY',
            name: 'Velocity Spike Detection',
            category: 'BEHAVIOR',
            weight: 25,
            enabled: true,
            thresholdValue: 3,
            description: 'Flags customers or IPs attempting >= 3 checkout operations within a 5-minute rolling window.',
        },
        {
            id: 'fr_03',
            ruleId: 'RULE_NEW_DEVICE',
            name: 'Unrecognized Device Fingerprint',
            category: 'DEVICE',
            weight: 10,
            enabled: true,
            description: 'Adds risk weight when transaction originates from a browser or device never previously seen.',
        },
        {
            id: 'fr_04',
            ruleId: 'RULE_SUSPICIOUS_IP',
            name: 'Threat Intelligence / Proxy IP',
            category: 'NETWORK',
            weight: 20,
            enabled: true,
            description: 'Detects connections originating from commercial VPNs, Tor exit nodes, or flagged IP subnets.',
        },
        {
            id: 'fr_05',
            ruleId: 'RULE_IMPOSSIBLE_TRAVEL',
            name: 'Impossible Physical Travel',
            category: 'BEHAVIOR',
            weight: 20,
            enabled: true,
            description: 'Identifies rapid geographic distance hops that exceed physically plausible velocity.',
        },
        {
            id: 'fr_06',
            ruleId: 'RULE_SUSPICIOUS_MERCHANT',
            name: 'Suspicious / Flagged Merchant',
            category: 'MERCHANT',
            weight: 30,
            enabled: true,
            description: 'Flags payments routed to merchants with prior complaints, low trust score, or suspended status.',
        },
        {
            id: 'fr_07',
            ruleId: 'RULE_SUSPICIOUS_URL',
            name: 'Deceptive URL / Spoofed VPA',
            category: 'NETWORK',
            weight: 30,
            enabled: true,
            description: 'Identifies deceptive payment links, typosquatted brand names, or suspicious UPI handles.',
        },
    ];
    store_1.dbStore.fraudRules = fraudRules;
    // 4. Seed 50+ Transactions & Orders & Fraud Analyses
    const orders = [];
    const payments = [];
    const fraudAnalyses = [];
    const fraudAlerts = [];
    const refunds = [];
    const sampleProducts = [
        { desc: 'Ultra Wireless Noise-Cancelling Headphones', amt: 4999 },
        { desc: 'Mechanical Gaming Keyboard RGB', amt: 3499 },
        { desc: 'Curved UltraWide 34-Inch Monitor', amt: 28999 },
        { desc: 'Organic Cold-Pressed Olive Oil 1L', amt: 849 },
        { desc: 'Urban Tailored Linen Shirt', amt: 1799 },
        { desc: 'Annual Cloud VPS Subscription', amt: 8900 },
        { desc: 'Full-Stack Cybersecurity Bootcamp Pass', amt: 14500 },
        { desc: 'Ergonomic Mesh Task Chair', amt: 12400 },
        { desc: 'Bluetooth Portable Speaker Waterproof', amt: 2299 },
        { desc: 'Smart Fitness Tracker Band 7', amt: 2999 },
        { desc: 'Instant Micro-Loan Processing Fee', amt: 18500 },
        { desc: 'Emergency Bank Account KYC Re-Activation', amt: 25000 },
    ];
    const devicesList = [
        'MacBook Pro 16" (macOS 14)',
        'Windows 11 PC (Chrome 122)',
        'iPhone 15 Pro (Safari Mobile)',
        'Samsung Galaxy S24 Ultra',
        'Pixel 8 Pro (Android 14)',
        'Ubuntu 22.04 LTS (Firefox)',
        'Headless Linux Puppeteer Bot',
    ];
    const cities = ['Mumbai, India', 'Bengaluru, India', 'New Delhi, India', 'Hyderabad, India', 'Pune, India', 'Chennai, India', 'Kolkata, India', 'Jaipur, India', 'London, UK', 'Frankfurt, Germany'];
    for (let i = 1; i <= 56; i++) {
        const isSpecialFraud = i % 7 === 0;
        const isMediumReview = i % 5 === 0 && !isSpecialFraud;
        const isRefunded = i === 11 || i === 23;
        const isFailed = i === 9 || i === 31;
        const prod = sampleProducts[i % sampleProducts.length];
        const customer = users[(i % (users.length - 1)) + 1];
        const merchant = isSpecialFraud && i % 2 === 0
            ? merchants[10] // Suspicious merchant
            : merchants[i % 10];
        const amount = isSpecialFraud ? prod.amt + 24000 : prod.amt;
        const orderId = `order_PF${100000 + i}`;
        const paymentId = `pay_PF${800000 + i}`;
        const dateOffsetDays = Math.floor((56 - i) / 2);
        const createdAt = new Date(Date.now() - dateOffsetDays * 86400000 - (i * 3600000)).toISOString();
        orders.push({
            id: `ord_${1000 + i}`,
            orderId,
            merchantId: merchant.id,
            merchantName: merchant.name,
            amount,
            currency: 'INR',
            customerName: customer.name,
            customerEmail: customer.email,
            customerPhone: `+91 98${Math.floor(10000000 + Math.random() * 89999999)}`,
            description: prod.desc,
            status: isRefunded ? 'refunded' : isFailed ? 'failed' : isSpecialFraud ? 'failed' : 'paid',
            createdAt,
        });
        let riskScore = 12 + (i % 15);
        let riskLevel = 'LOW';
        let recommendation = 'ALLOW';
        let status = 'SUCCESS';
        const reasons = [];
        if (isSpecialFraud) {
            riskScore = 84 + (i % 14);
            riskLevel = 'CRITICAL';
            recommendation = 'BLOCK';
            status = 'BLOCKED';
            reasons.push(`Transaction amount (₹${amount.toLocaleString()}) exceeds safety ceiling`, `High dispute history flagged for destination merchant: ${merchant.name}`, `IP reputation alert: connection originated from anonymized Tor/proxy node`);
        }
        else if (isMediumReview) {
            riskScore = 65 + (i % 10);
            riskLevel = 'HIGH';
            recommendation = 'REVIEW';
            status = 'REVIEW';
            reasons.push(`Unusual velocity: multiple checkout sessions initiated from this IP`, `Unrecognized browser fingerprint never associated with this account`);
        }
        else if (isRefunded) {
            riskScore = 20;
            status = 'REFUNDED';
            reasons.push('Standard consumer profile within baseline limits');
        }
        else if (isFailed) {
            riskScore = 28;
            status = 'FAILED';
            reasons.push('Authentication simulator: simulated bank decline');
        }
        else {
            reasons.push('Clean device telemetry, verified IP geolocation, normal ticket size');
        }
        const method = ['UPI', 'Card', 'Net Banking', 'Wallet'][i % 4];
        const clientIp = isSpecialFraud ? '185.220.101.5' : `157.34.${100 + (i % 50)}.${10 + (i % 80)}`;
        const location = isSpecialFraud ? 'Frankfurt, Germany' : cities[i % cities.length];
        const device = isSpecialFraud ? devicesList[6] : devicesList[i % (devicesList.length - 1)];
        const payment = {
            id: `pay_${1000 + i}`,
            paymentId,
            orderId,
            merchantId: merchant.id,
            merchantName: merchant.name,
            customerName: customer.name,
            customerEmail: customer.email,
            amount,
            currency: 'INR',
            method,
            upiId: method === 'UPI' ? `${customer.email.split('@')[0]}@okhdfcbank` : undefined,
            cardLast4: method === 'Card' ? `${4000 + (i % 9000)}` : undefined,
            bankName: method === 'Net Banking' ? 'State Bank of India' : undefined,
            walletProvider: method === 'Wallet' ? 'PayGuard Cash' : undefined,
            status,
            riskScore,
            riskLevel,
            recommendation,
            reasons,
            clientIp,
            device,
            browser: 'Chrome 122.0',
            location,
            refundedAmount: isRefunded ? amount : undefined,
            createdAt,
        };
        payments.push(payment);
        // Fraud Analysis Record
        fraudAnalyses.push({
            id: `fa_${1000 + i}`,
            paymentId,
            riskScore,
            riskLevel,
            recommendation,
            reasons,
            triggeredRules: isSpecialFraud
                ? [
                    {
                        ruleId: 'RULE_HIGH_AMOUNT',
                        ruleName: 'High Amount Anomaly',
                        pointsAdded: 20,
                        description: `Amount ₹${amount.toLocaleString()} is 4.8× average customer benchmark`,
                    },
                    {
                        ruleId: 'RULE_SUSPICIOUS_MERCHANT',
                        ruleName: 'Suspicious / Flagged Merchant',
                        pointsAdded: 30,
                        description: `Merchant ${merchant.name} flagged for high chargeback rates`,
                    },
                    {
                        ruleId: 'RULE_SUSPICIOUS_IP',
                        ruleName: 'Threat Intelligence / Proxy IP',
                        pointsAdded: 20,
                        description: `IP ${clientIp} matches known Tor exit node`,
                    },
                ]
                : [],
            features: {
                amountDeviation: isSpecialFraud ? 4.8 : 1.1,
                velocityScore: isMediumReview ? 4 : 1,
                isNewDevice: isSpecialFraud || isMediumReview,
                isSuspiciousIp: isSpecialFraud,
                locationAnomaly: isSpecialFraud,
                merchantReputation: merchant.trustScore,
                urlEntropy: 0.15,
            },
            timeline: [
                { stage: 'Order Created', timestamp: createdAt, status: 'COMPLETED', detail: `Order ${orderId} initialized` },
                { stage: 'Checkout Telemetry', timestamp: createdAt, status: 'COMPLETED', detail: `Device: ${device}` },
                { stage: 'Fraud Engine Evaluation', timestamp: createdAt, status: 'COMPLETED', detail: `Score: ${riskScore}/100 [${riskLevel}]` },
                { stage: 'Transaction Gate', timestamp: createdAt, status: status, detail: `Gate Decision: ${status}` },
            ],
            createdAt,
        });
        // Alert if High or Critical
        if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
            fraudAlerts.push({
                id: `alert_${1000 + i}`,
                alertId: `alt_${2000 + i}`,
                paymentId,
                merchantId: merchant.id,
                merchantName: merchant.name,
                amount,
                riskScore,
                severity: riskLevel,
                status: i % 3 === 0 ? 'RESOLVED' : i % 2 === 0 ? 'UNDER_REVIEW' : 'OPEN',
                message: `High risk detected (${riskScore}/100): ${reasons[0]}`,
                createdAt,
            });
        }
        // Refund if marked
        if (isRefunded) {
            refunds.push({
                id: `ref_${1000 + i}`,
                refundId: `ref_PF${900000 + i}`,
                paymentId,
                orderId,
                merchantId: merchant.id,
                amount,
                currency: 'INR',
                reason: 'Customer initiated return within 7-day guarantee',
                type: 'FULL',
                status: 'PROCESSED',
                createdAt: new Date(new Date(createdAt).getTime() + 86400000).toISOString(),
            });
        }
    }
    store_1.dbStore.orders = orders;
    store_1.dbStore.payments = payments;
    store_1.dbStore.fraudAnalyses = fraudAnalyses;
    store_1.dbStore.fraudAlerts = fraudAlerts;
    store_1.dbStore.refunds = refunds;
    // 5. Seed API Keys
    store_1.dbStore.apiKeys = [
        {
            id: 'key_01',
            keyId: 'key_test_01',
            merchantId: 'merch_01',
            name: 'Default Web Store Checkout Key',
            keyPrefix: 'pf_test_live_',
            maskedKey: 'pf_test_live_a89f...3e29',
            secretHash: 'seeded_sha256_dummy_hash_01',
            environment: 'sandbox',
            revoked: false,
            lastUsed: '10 minutes ago',
            createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
        },
        {
            id: 'key_02',
            keyId: 'key_test_02',
            merchantId: 'merch_01',
            name: 'Mobile App Integration Key',
            keyPrefix: 'pf_test_app_',
            maskedKey: 'pf_test_app_c410...9b12',
            secretHash: 'seeded_sha256_dummy_hash_02',
            environment: 'sandbox',
            revoked: false,
            lastUsed: '2 days ago',
            createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
        },
    ];
    // 6. Seed Webhook Events
    store_1.dbStore.webhookEvents = [
        {
            id: 'whe_01',
            eventId: 'evt_982103',
            merchantId: 'merch_01',
            eventType: 'payment.success',
            payload: { paymentId: 'pay_PF800055', amount: 4999, status: 'SUCCESS' },
            deliveryStatus: 'DELIVERED',
            attempts: 1,
            responseCode: 200,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
            id: 'whe_02',
            eventId: 'evt_982104',
            merchantId: 'merch_01',
            eventType: 'fraud.detected',
            payload: { paymentId: 'pay_PF800049', riskScore: 88, severity: 'CRITICAL', status: 'BLOCKED' },
            deliveryStatus: 'DELIVERED',
            attempts: 1,
            responseCode: 200,
            createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
    ];
    // 7. Seed Security Audit Logs
    store_1.dbStore.securityLogs = [
        {
            id: 'log_01',
            action: 'SYSTEM_BOOT',
            actorEmail: 'system@payguard.io',
            actorRole: 'SYSTEM',
            ip: '127.0.0.1',
            details: 'PayGuard Fraud Engine v2.4 initialized with active security rules',
            createdAt: new Date(Date.now() - 120000).toISOString(),
        },
        {
            id: 'log_02',
            action: 'FRAUD_RULE_EVALUATED',
            actorEmail: 'analyst@payguard.io',
            actorRole: 'SECURITY_ANALYST',
            ip: '10.0.4.12',
            details: 'Rule RULE_HIGH_AMOUNT threshold audited and confirmed',
            createdAt: new Date(Date.now() - 60000).toISOString(),
        },
        {
            id: 'log_03',
            action: 'MERCHANT_STATUS_CHANGED',
            actorEmail: 'admin@payguard.io',
            actorRole: 'ADMIN',
            ip: '10.0.1.5',
            details: 'Merchant Apex QuickLoans Direct suspended due to fraud reports',
            createdAt: new Date(Date.now() - 30000).toISOString(),
        },
    ];
    store_1.dbStore.saveToDisk();
    console.log('[Seed] Database successfully seeded with 56 transactions, 12 merchants, 4 roles, and fraud rules!');
};
exports.seedDatabase = seedDatabase;
// If run directly via CLI
if (require.main === module) {
    (0, exports.seedDatabase)().then(() => process.exit(0));
}
