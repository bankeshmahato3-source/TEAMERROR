# TEAMERROR
# PayGuard 🛡️
### Intelligent Payment Gateway & Explainable Fraud Defense Sandbox

> **Tagline:** Secure every payment. Detect every threat.  
> **Project Type:** Educational Fintech & Cybersecurity B.Tech CSE Capstone System  
> **Environment:** Strict Defensive Educational Sandbox (No real money processed, zero real credentials collected)

---

## 1. Project Overview

**PayGuard** is an educational cybersecurity and fintech platform designed to demonstrate:
1. How a modern sandbox payment portal works (inspired by platforms like Razorpay).
2. How deceptive and phishing payment portals mislead consumers.
3. How real-time behavioral heuristics and explainable AI risk scoring detect attacks in sub-50 milliseconds.
4. How merchants monitor incoming revenue, create orders, and issue refunds.
5. How consumers can analyze suspicious UPI IDs, payment links, and QR codes.
6. How a Security Operations Center (SOC) investigates and mitigates fraud attacks.

---

## 2. Architecture Diagram

```text
               ┌────────────────────────────────────────────────────────┐
               │              React 18 + Vite Frontend Client          │
               │   • Tailwind CSS  • Recharts  • Lucide  • Glassmorphism│
               └───────────────────────────┬────────────────────────────┘
                                           │
                                  HTTPS / REST JSON
                                           │
                                           ▼
               ┌────────────────────────────────────────────────────────┐
               │                  Express.js REST API                   │
               │      • Helmet Headers  • CORS  • Rate Limiting         │
               └───────────────────────────┬────────────────────────────┘
                                           │
                                           ▼
               ┌────────────────────────────────────────────────────────┐
               │             Authentication & Role Middleware            │
               │   • JWT Tokens  • BCrypt  • 4 System Roles             │
               │   (CUSTOMER, MERCHANT, SECURITY_ANALYST, ADMIN)        │
               └───────────────────────────┬────────────────────────────┘
                                           │
                        ┌──────────────────┴──────────────────┐
                        ▼                                     ▼
      ┌──────────────────────────────────┐  ┌──────────────────────────────────┐
      │       Payment Engine Core        │  │     Fraud Detection Engine       │
      │ • Multi-Rail (UPI, Card, Bank)   │  │ • 7 Heuristic Dynamic Rules      │
      │ • Order State Machine            │  │ • 0–100 Score & Explainable AI   │
      │ • Webhook Event Dispatcher       │  │ • ALLOW, MONITOR, REVIEW, BLOCK  │
      └─────────────────┬────────────────┘  └─────────────────┬────────────────┘
                        │                                     │
                        └──────────────────┬──────────────────┘
                                           │
                                           ▼
               ┌────────────────────────────────────────────────────────┐
               │              Database Persistence Layer                │
               │   • Indexed In-Memory & JSON-Backed Storage Engine     │
               │   • MongoDB / Mongoose Support via MONGODB_URI         │
               └───────────────────────────┬────────────────────────────┘
                                           │
                                           ▼
               ┌────────────────────────────────────────────────────────┐
               │         Security Operations Center (SOC) Alerts         │
               │   • Real-Time Threat Toasts  • Forensic Timeline       │
               │   • Multi-Vector Simulated Attacks Live Engine         │
               └────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

### Frontend
- **Framework:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, Glassmorphism design tokens, CSS gradients
- **Icons & Visuals:** Lucide React, Canvas-Confetti
- **Analytics Charts:** Recharts (Line, Donut, Bar charts)
- **Routing:** React Router v6

### Backend
- **Runtime:** Node.js v24+, Express.js
- **Language:** TypeScript
- **Security:** Helmet, CORS, Express-Rate-Limit
- **Auth:** JSON Web Tokens (JWT), BCrypt password hashing
- **Architecture:** Controller-Service-Repository pattern with audit logging

### Database
- **Database Engine:** Embedded high-performance JSON-persisted In-Memory Datastore with zero setup hurdles, fully compatible with MongoDB/Mongoose models.

---

## 4. Key Features

1. **Sandbox Payment Gateway (`/checkout/:orderId`):**
   - Multi-rail checkout: UPI, Card, Net Banking, Wallet.
   - Autofill test scenarios: `success@payguard`, `fraud@payguard`, `pending@payguard`, `failed@payguard`.
   - Real-time fraud engine analysis and post-payment receipt with explainable reasons.

2. **Real-Time Fraud Detection Engine (`/fraud-detection`):**
   - Pure, explainable rule engine calculating a 0–100 risk score:
     - **High Amount Anomaly (+20 pts):** Flags purchases 3.5× above customer average or ≥ ₹25,000.
     - **Velocity Spike (+25 pts):** Flags ≥ 3 attempts in a 5-minute rolling window.
     - **New Device Fingerprint (+10 pts):** Flags unrecognized client browser signatures.
     - **Suspicious IP Reputation (+20 pts):** Matches simulated Tor exit nodes and proxy subnets.
     - **Impossible Physical Travel (+20 pts):** Flags rapid geographic hops that defy commercial flight limits.
     - **Suspicious Merchant Risk (+30 pts):** Flags merchants with excessive dispute ratios or suspended status.
     - **Phishing URL / Deceptive VPA (+30 pts):** Flags typosquatting and panic parameters.

3. **Risk Tiers & Decision Rules:**
   - `0–29` ➔ **LOW** ➔ `ALLOW`
   - `30–59` ➔ **MEDIUM** ➔ `MONITOR`
   - `60–79` ➔ **HIGH** ➔ `REVIEW`
   - `80–100` ➔ **CRITICAL** ➔ `BLOCK`

4. **Security Operations Center (SOC) (`/security`):**
   - Real-time KPI statistics: Volume, Analyzed Transactions, Fraud Blocked, Under Review, Fraud Rate.
   - Interactive **"Run Fraud Simulation"** button: Triggers 6 simulated attack vectors with live animated attack wave visualization!
   - Forensic Investigation Dossier (`/security/investigation/:paymentId`): Complete transaction timeline from telemetry to gate decision.

5. **Fake UPI & Link Scanner (`/upi-check`):**
   - Inspects URLs and VPAs for brand typosquatting (SBI, Paytm, PhonePe, Google Pay, Razorpay).
   - Identifies disposable TLDs (.xyz, .top, .buzz) and panic triggers (`claim_reward`, `verify_kyc`).
   - Produces itemized diagnostic reports with clear PASS, WARNING, and FAIL badges.

6. **Fake Payment Page Demonstration (`/scam-demo`):**
   - Safe educational simulation illustrating how fraudsters construct phishing checkouts with artificial countdown timers and spoofed bank logos.
   - Interactive red flag inspection pins (Pins #1 to #4).

7. **Scam Awareness Center (`/scam-awareness`):**
   - Detailed defensive guides on 10 prevalent cyber fraud vectors:
     1. Fake UPI QR Codes
     2. Fake Payment Links
     3. Fake Customer Care Numbers
     4. Screen-Sharing App Scams (AnyDesk, TeamViewer lures)
     5. Collect-Request Scams
     6. Refund & Cashback Traps
     7. OTP Forwarding Codes
     8. Fake KYC Expiry Notices
     9. Malicious APK Side-Loading
     10. Fake E-Commerce Stores

8. **Merchant Business Suite (`/merchant`):**
   - Order generation (`order_PF...`), payment ledger surveillance, full & partial refunds.
   - Cryptographic API Key Management (`pf_test_...`).
   - Webhook Event Dispatcher with live test ping triggers.
   - Merchant Security Health Score (87/100).

9. **Platform Admin Console (`/admin`):**
   - User roster, merchant suspension toggles.
   - Live Fraud Rules Management (`/admin/fraud-rules`): Toggle rules ON/OFF, adjust weights, and reconfigure risk thresholds.
   - Immutable Security Audit Logs (`/admin/logs`).

---

## 5. Demo Credentials (1-Click Instant Login)

The application includes an instant **1-Click Role Switcher** dropdown in the top navbar and on the login page:

| Role | Email | Password | Direct URL |
| :--- | :--- | :--- | :--- |
| **👑 Platform Admin** | `admin@payguard.io` | `Admin@123` | `/admin` |
| **🛡️ Security Analyst (SOC)** | `analyst@payguard.io` | `Analyst@123` | `/security` |
| **💼 Merchant** | `merchant@payguard.io` | `Merchant@123` | `/merchant` |
| **🛒 Customer / Shopper** | `customer@payguard.io` | `Customer@123` | `/checkout/order_PF100001` |

---

## 6. Simulated Sandbox Payment Credentials

Use these simulated identities on the checkout screen:

- `success@payguard` ➔ Authorized payment (Score: 5/100, ALLOW)
- `fraud@payguard` ➔ Simulated blacklisted identity (Score: 95/100, BLOCK)
- `pending@payguard` ➔ Ambiguous risk identity (REVIEW)
- `failed@payguard` ➔ Bank decline simulation
- Card Autofill: `4111 2222 3333 4444`, Expiry: `12/28`, CVV: `123`

---

## 7. Running Locally

### Prerequisites
- Node.js (v18+)
- npm

### Quick Start (From Root)
```bash
npm.cmd run dev
```
*(Runs both backend and frontend concurrently)*

### Or Run Separately:

#### 1. Start Backend
```bash
cd backend
npm.cmd install
npm.cmd run dev
```
*Backend runs on `http://localhost:5000` (automatically seeds 56+ transactions, 12 merchants, and 7 rules).*

#### 2. Start Frontend
```bash
cd frontend
npm.cmd install
npm.cmd run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 8. Strict Security & Ethical Limitations

PayGuard is **strictly an educational cybersecurity and fintech capstone simulation**:
- It does **NOT** connect to live commercial banking networks (Visa, Mastercard, NPCI, RBI).
- It does **NOT** process real monetary transactions.
- It does **NOT** solicit, store, or transmit real CVVs, ATM PINs, UPI MPINs, or passwords.
- All phishing link demonstrations and fake portal exhibits use synthetic indicators for defensive training and academic demonstration only.
