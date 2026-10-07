# PayGuard — Full-Stack Technical Documentation 🛡️
### Unified Architectural, Engineering & Operations Guide for Frontend & Backend

> **System Name:** PayGuard  
> **Subsystems:** Frontend (`frontend/`) & Backend (`backend/`)  
> **Environment:** Strict Defensive Educational Sandbox (Zero real monetary risk)  
> **Repository:** [TEAMERROR](https://github.com/bankeshmahato3-source/TEAMERROR)

---

## 📑 Table of Contents
1. [Executive Summary & High-Level Architecture](#1-executive-summary--high-level-architecture)
2. [Monorepo Workspace Structure](#2-monorepo-workspace-structure)
3. [Unified Quick Start & Local Execution](#3-unified-quick-start--local-execution)
4. [Frontend Subsystem Deep Dive (`frontend/`)](#4-frontend-subsystem-deep-dive-frontend)
5. [Backend Subsystem Deep Dive (`backend/`)](#5-backend-subsystem-deep-dive-backend)
6. [Full-Stack Data Flow & End-to-End Payment Lifecycle](#6-full-stack-data-flow)
7. [Role-Based Access Control (RBAC) Matrix](#7-role-based-access-control-rbac)
8. [Simulated Test Credentials & Sandboxing Rules](#8-simulated-test-credentials)

---

## 1. Executive Summary & High-Level Architecture

PayGuard is an end-to-end fintech simulation and cybersecurity training platform. It pairs a **React 18 frontend** with an **Express.js backend** executing a sub-50ms explainable heuristic fraud detection engine.

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │                      REACT 18 + VITE FRONTEND                          │
 │  (Tailwind CSS, Glassmorphism, Recharts, Lucide, React Router v6)      │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
                        HTTP / JSON  │  (Port 5173 ➔ Port 5000)
                                     │  Vite Reverse Proxy: /api/*
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │                    EXPRESS.JS TYPESCRIPT BACKEND                       │
 │      (Helmet, CORS, Rate-Limiting, JWT Auth, Role Middleware)          │
 └──────────────────┬─────────────────────────────────┬───────────────────┘
                    │                                 │
                    ▼                                 ▼
   ┌────────────────────────────────┐ ┌────────────────────────────────┐
   │      PAYMENT ENGINE CORE       │ │    FRAUD DETECTION ENGINE      │
   │  • Multi-Rail (UPI, Card, Net) │ │  • 7 Dynamic Heuristic Rules   │
   │  • Order State Machine         │ │  • 0–100 Explainable Scoring   │
   │  • Refund & Webhook Dispatch   │ │  • ALLOW, MONITOR, REVIEW, BLOCK│
   └────────────────┬───────────────┘ └────────────────┬───────────────┘
                    │                                  │
                    └─────────────────┬────────────────┘
                                      ▼
   ┌────────────────────────────────────────────────────────────────────┐
   │             IN-MEMORY JSON PERSISTENCE & DATASTORE                 │
   │   (Transactions, Merchants, Fraud Rules, SOC Alerts, Audit Logs)  │
   └────────────────────────────────────────────────────────────────────┘
```

---

## 2. Monorepo Workspace Structure

```text
team error/
├── package.json              # Unified root workspace runner (concurrently)
├── README.md                 # Primary project overview
├── FRONTEND.md               # Frontend quick reference
├── BACKEND.md                # Backend quick reference
├── FRONTEND_AND_BACKEND.md   # Unified full-stack architecture specification (This File)
├── overview.md               # Educational capstone overview
│
├── frontend/                 # Client Single Page Application (SPA)
│   ├── index.html            # Entry HTML template
│   ├── package.json          # Dependencies (React, Vite, Recharts, Tailwind)
│   ├── tsconfig.json         # TypeScript compiler configuration
│   ├── vite.config.ts        # Vite config with backend /api proxy
│   └── src/                  # Source files (components, contexts, pages, services)
│
└── backend/                  # Server REST API
    ├── package.json          # Dependencies (Express, TSX, JWT, Helmet)
    ├── tsconfig.json         # TypeScript compiler configuration
    └── src/                  # Source files (controllers, services, models, routes)
```

---

## 3. Unified Quick Start & Local Execution

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Launch Both Frontend and Backend Simultaneously
From the workspace root directory:
```bash
npm.cmd run dev
```

This single command boots:
- **Backend API**: `http://localhost:5000` (auto-seeds 56+ transactions and default rules)
- **Frontend Portal**: `http://localhost:5173`

### Run Subsystems Individually

#### Backend:
```bash
cd backend
npm.cmd install
npm.cmd run dev
```

#### Frontend:
```bash
cd frontend
npm.cmd install
npm.cmd run dev
```

---

## 4. Frontend Subsystem Deep Dive (`frontend/`)

### Frontend Technology Stack
- **Framework:** React 18.3 (Function components & Hooks)
- **Build System:** Vite 6.0 with TypeScript compilation (`@vitejs/plugin-react`)
- **Styling:** Tailwind CSS 3.4 with custom dark mode glassmorphism
- **Iconography:** Lucide React
- **Data Visualizations:** Recharts (Area charts, Bar graphs, Donut meters)
- **Routing:** React Router v6.28
- **HTTP Client:** Axios 1.7 with JWT request interceptors

### Frontend Pages & User Interfaces
1. **Public / Educational Portals:**
   - **Checkout Gateway (`/checkout/:orderId`):** Simulates modern payment rails (UPI, Credit/Debit Card, Net Banking, Wallets) with autofill test personas.
   - **Scam Awareness (`/scam-awareness`):** Detailed defensive breakdowns of 10 prevalent real-world cyber fraud vectors (Fake UPI QR, Screen-Sharing traps, SIM swap, etc.).
   - **Deceptive Page Demo (`/scam-demo`):** An isolated sandbox exhibiting fake bank seals, countdown manipulation, and security red flags (Pins #1 to #4).
   - **UPI Phishing Inspector (`/upi-check`):** Analyzes suspect VPAs and URLs for homograph attacks, typosquatting, and malicious TLDs.
2. **Business & Operations Portals:**
   - **Merchant Dashboard (`/merchant`):** Live charts of GMV, dispute ratios, transaction velocity, order creation, and refund tooling.
   - **Security Operations Center (`/security`):** Live threat activity feed, forensic dossier links, and an interactive **"Run Fraud Simulation"** button that fires 6 synthetic attack waves.
   - **Administrator Console (`/admin`):** Dynamically toggles and modifies weights for the backend heuristic scoring rules without restarts.

---

## 5. Backend Subsystem Deep Dive (`backend/`)

### Backend Technology Stack
- **Runtime:** Node.js (v18+)
- **Language:** TypeScript 5.7
- **Web Framework:** Express 4.21
- **Developer Execution:** `tsx` watch mode for live module reloading
- **Security Middleware:** Helmet 8.0, CORS, Express-Rate-Limit 7.5
- **Cryptography & Tokens:** BCryptJS 2.4, JSONWebToken 9.0

### Backend Fraud Engine (`fraudEngine.ts`)
The fraud engine evaluates all incoming transactions in sub-50 milliseconds, returning an explainable 0–100 composite risk score:

| Rule Name | Weight | Trigger Condition |
| :--- | :---: | :--- |
| **High Amount Anomaly** | `+20` | Amount $\ge$ ₹25,000 or $> 3.5\times$ customer historical average |
| **Velocity Spike** | `+25` | $\ge 3$ transaction attempts within a 5-minute rolling window |
| **New Device Fingerprint** | `+10` | Client device signature unseen in customer profile |
| **Suspicious IP Reputation** | `+20` | IP matches Tor exit node list or proxy subnet range |
| **Impossible Physical Travel**| `+25` | Geo-hop velocity $> 800\text{ km/h}$ between successive checkouts |
| **Suspicious Merchant Risk** | `+30` | Merchant dispute ratio $> 15\%$ or status marked SUSPENDED |
| **Phishing / Deceptive VPA** | `+30` | Typo-squatting bank handle or suspicious TLD (.xyz, .top) |

#### Automated Risk Decisions
- **`0 – 29` (LOW)** ➔ `ALLOW` — Instant authorization.
- **`30 – 59` (MEDIUM)** ➔ `MONITOR` — Authorized; flagged with telemetry marker.
- **`60 – 79` (HIGH)** ➔ `REVIEW` — Held for SOC analyst inspection.
- **`80 – 100` (CRITICAL)** ➔ `BLOCK` — Immediately terminated; alert dispatched to SOC.

---

## 6. Full-Stack Data Flow & End-to-End Payment Lifecycle

```text
User / Customer              Frontend Client             Backend Server           Fraud Engine
     │                              │                           │                      │
     │ 1. Submits Payment           │                           │                      │
     ├─────────────────────────────►│                           │                      │
     │    (Card / UPI / NetBanking) │ 2. POST /api/payments     │                      │
     │                              ├──────────────────────────►│                      │
     │                              │                           │ 3. Evaluate Risk     │
     │                              │                           ├─────────────────────►│
     │                              │                           │                      │ 4. Score Heuristics
     │                              │                           │◄─────────────────────┤    (0–100 Score)
     │                              │                           │                      │
     │                              │                           │ 5. Decision Check    │
     │                              │                           │    • ALLOW ➔ SUCCESS │
     │                              │                           │    • BLOCK ➔ BLOCKED │
     │                              │                           │                      │
     │                              │ 6. Response JSON          │                      │
     │                              │◄──────────────────────────┤                      │
     │ 7. Renders Post-Payment      │                           │                      │
     │    Receipt & Risk Explanation│                           │                      │
     │◄─────────────────────────────┤                           │                      │
```

---

## 7. Role-Based Access Control (RBAC) Matrix

| Feature / Page | `CUSTOMER` | `MERCHANT` | `SECURITY_ANALYST` | `ADMIN` |
| :--- | :---: | :---: | :---: | :---: |
| Public Landing & Scam Guides | ✅ | ✅ | ✅ | ✅ |
| Sandbox Payment Checkout | ✅ | ✅ | ✅ | ✅ |
| UPI & Link Phishing Scanner | ✅ | ✅ | ✅ | ✅ |
| Merchant Dashboard & Orders | ❌ | ✅ | ❌ | ✅ |
| Merchant Refunds & Webhooks | ❌ | ✅ | ❌ | ✅ |
| SOC Dashboard & Live Alerts | ❌ | ❌ | ✅ | ✅ |
| Forensic Payment Investigation| ❌ | ❌ | ✅ | ✅ |
| Simulated Attack Wave Launcher| ❌ | ❌ | ✅ | ✅ |
| Edit Fraud Rule Weights | ❌ | ❌ | ❌ | ✅ |
| Access System Audit Logs | ❌ | ❌ | ❌ | ✅ |

---

## 8. Simulated Test Credentials & Sandboxing Rules

Use these credentials during checkout simulations:
- **Authorized (`ALLOW`):** `success@payguard`
- **Flagged (`REVIEW`):** `pending@payguard`
- **Blocked (`BLOCK`):** `fraud@payguard`
- **Card Autofill:** `4111 2222 3333 4444` | Expiry: `12/28` | CVV: `123`

---
*PayGuard is an educational fintech and cybersecurity demonstration platform.*
