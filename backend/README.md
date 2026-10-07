# PayGuard Backend 🛡️
### Intelligent Payment Gateway & Heuristic Fraud Detection Engine — REST API

The **PayGuard Backend** is a modular, high-throughput REST API built with **Node.js**, **Express**, and **TypeScript**. It powers the PayGuard sandbox ecosystem, featuring an explainable 0–100 heuristic risk scoring engine, multi-rail checkout processing, attack simulation tools, and audit logging.

---

## 🚀 Quick Start

### 1. Installation
```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm.cmd install
```

### 2. Development Server (with Auto-Reload)
```bash
npm.cmd run dev
```
The server will start at **`http://localhost:5000`**. On first boot, it automatically seeds 56+ transactions, 12 merchants, 4 roles, and 7 default fraud rules.

### 3. Seed Database Manually
```bash
npm.cmd run seed
```

### 4. Build & Start Production
```bash
npm.cmd run build
npm.cmd start
```

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **Node.js (v18+)** | JavaScript runtime environment |
| **Express.js 4** | Web server & RESTful API framework |
| **TypeScript 5** | Strong typing across models, DTOs, and engines |
| **TSX** | TypeScript execution and rapid development watcher |
| **Helmet & CORS** | HTTP security headers and cross-origin resource sharing |
| **Express-Rate-Limit** | Request throttling against DDoS and credential-stuffing simulations |
| **BCrypt & JWT** | Password hashing and signed authorization bearer tokens |
| **In-Memory Store** | Fast embedded JSON-persisted data store with zero DB install barrier |

---

## 📁 Directory Structure

```text
backend/
├── data/                       # Optional JSON data persistence directory
├── src/
│   ├── controllers/            # Request handlers & HTTP routing logic
│   │   ├── adminController.ts      # Admin stats, rule management, and audit logs
│   │   ├── apiKeysController.ts    # Merchant sandbox API key management
│   │   ├── authController.ts       # Registration, login, and profile verification
│   │   ├── dashboardController.ts  # Merchant revenue, transactions, and risk KPIs
│   │   ├── fraudController.ts      # Evaluation triggers, alerts, rules, and simulation
│   │   ├── ordersController.ts     # Order creation and retrieval
│   │   ├── paymentsController.ts   # Multi-rail payment processing and refunds
│   │   ├── upiController.ts        # UPI VPA/URL scanning & phishing verification
│   │   ├── verifyController.ts     # Public payment verification and receipts
│   │   └── webhooksController.ts   # Webhook dispatch configuration & testing
│   ├── middleware/
│   │   └── auth.ts                 # JWT extraction, verification & RBAC authorization
│   ├── models/
│   │   └── store.ts                # In-memory database collections & JSON persistence
│   ├── routes/                     # Express Router endpoint definitions
│   │   ├── adminRoutes.ts          # /api/admin/*
│   │   ├── apiKeysRoutes.ts        # /api/api-keys/*
│   │   ├── authRoutes.ts           # /api/auth/*
│   │   ├── dashboardRoutes.ts      # /api/dashboard/*
│   │   ├── fraudRoutes.ts          # /api/fraud/*
│   │   ├── ordersRoutes.ts         # /api/orders/*
│   │   ├── paymentsRoutes.ts       # /api/payments/*
│   │   ├── upiRoutes.ts            # /api/upi/*
│   │   ├── verifyRoutes.ts         # /api/verify/*
│   │   └── webhooksRoutes.ts       # /api/webhooks/*
│   ├── seed/
│   │   └── seed.ts                 # Realistic synthetic seed dataset generator
│   ├── services/                   # Core business logic & algorithmic engines
│   │   ├── fraudEngine.ts          # Heuristic 0–100 risk scoring engine
│   │   ├── simulationService.ts    # Multi-vector synthetic fraud attack generator
│   │   └── upiScanner.ts           # Phishing VPA and typosquatted URL analyzer
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces (Payments, Orders, Rules, Users)
│   ├── utils/
│   │   └── auditLogger.ts          # Security log recording with timestamps & IP tracking
│   └── index.ts                    # Application bootstrapping & middleware setup
├── package.json                # Dependencies, scripts, and build configuration
└── tsconfig.json               # TypeScript compiler options
```

---

## 🧠 Heuristic Fraud Engine

Every incoming transaction passes through `fraudEngine.ts`, which calculates an explainable **Risk Score (0–100)**:

| Heuristic Rule | Trigger Condition | Points |
| :--- | :--- | :--- |
| **High Amount Anomaly** | Amount ≥ ₹25,000 or >3.5× customer baseline | `+20` |
| **Velocity Spike** | ≥ 3 payment attempts in a 5-minute rolling window | `+25` |
| **New Device Fingerprint** | Unrecognized browser / client hardware signature | `+10` |
| **Suspicious IP Reputation** | Tor exit nodes, open proxies, or blacklisted CIDR blocks | `+20` |
| **Impossible Physical Travel** | Unrealistic velocity between geo-coordinates within short intervals | `+25` |
| **Suspicious Merchant Risk** | Flagged or high-dispute merchant profile | `+30` |
| **Phishing / Deceptive VPA** | Typosquatting bank handles or disposable domains (.xyz, .top) | `+30` |

### Decision Tiers
- **`0 – 29` (LOW)** ➔ **`ALLOW`** (Payment succeeds)
- **`30 – 59` (MEDIUM)** ➔ **`MONITOR`** (Payment succeeds with security telemetry tag)
- **`60 – 79` (HIGH)** ➔ **`REVIEW`** (Flagged for SOC analyst inspection)
- **`80 – 100` (CRITICAL)** ➔ **`BLOCK`** (Payment immediately halted; threat alert triggered)

---

## 📡 Key REST API Endpoints

### 1. System & Health
- `GET /api/health` — System status, uptime, and database records count.

### 2. Authentication
- `POST /api/auth/register` — Create a simulated account (Customer, Merchant).
- `POST /api/auth/login` — Authenticate and receive a JWT token.
- `GET /api/auth/me` — Retrieve current authenticated user profile.

### 3. Orders & Payments
- `POST /api/orders` — Create a new payment order.
- `GET /api/orders/:orderId` — Fetch order details.
- `POST /api/payments/process` — Process a multi-rail sandbox payment (evaluates fraud engine).
- `POST /api/payments/:paymentId/refund` — Issue a refund on an existing payment.
- `GET /api/verify/:paymentId` — Retrieve verified payment receipt & fraud score.

### 4. Fraud Defense & SOC
- `POST /api/fraud/evaluate` — Test hypothetical transaction parameters against the rule engine.
- `GET /api/fraud/alerts` — Fetch real-time security alerts.
- `GET /api/fraud/rules` — List all active heuristic rules.
- `PATCH /api/fraud/rules/:ruleId` — Update rule thresholds, weights, or toggle enabled state.
- `POST /api/fraud/simulate` — Trigger 6 simulated cyber attack scenarios (Tor flood, card velocity, phishing, etc.).

### 5. Fake UPI / Phishing Scanner
- `POST /api/upi/check` — Inspect a VPA, payment URL, or QR payload for fraud indicators.

---

## 🛡️ Educational Sandbox Notice

PayGuard Backend is strictly a defensive educational prototype. It does not connect to real financial rails (NPCI, Visa, Mastercard) and does not store or process real financial secrets.
