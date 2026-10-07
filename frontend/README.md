# PayGuard Frontend 🛡️
### Intelligent Payment Gateway & Fraud Defense Sandbox — Client Portal

The **PayGuard Frontend** is a modern, responsive web application built with **React 18**, **TypeScript**, and **Vite**, styled using **Tailwind CSS** and custom glassmorphism components. It provides intuitive interfaces for customers, merchants, security analysts, and administrators.

---

## 🚀 Quick Start

### 1. Installation
```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm.cmd install
```

### 2. Development Server
```bash
npm.cmd run dev
```
The application will launch at **`http://localhost:5173`** and proxy `/api` calls to the backend on port `5000`.

### 3. Build for Production
```bash
npm.cmd run build
```

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **React 18** | UI framework with component modularity |
| **TypeScript** | Strict compile-time type safety |
| **Vite** | Blazing-fast development server & production bundler |
| **Tailwind CSS** | Utility-first styling with sleek dark-mode aesthetics |
| **Lucide React** | Cohesive, modern cybersecurity & fintech icons |
| **Recharts** | Interactive fraud telemetry, velocity, and revenue charts |
| **React Router v6** | Declarative client-side routing & protected route guards |
| **Axios** | HTTP client configured with JWT interceptors |
| **Canvas Confetti** | Visual celebration triggers on successful sandbox payments |

---

## 📁 Directory Structure

```text
frontend/
├── public/                     # Static assets and icons
├── src/
│   ├── components/             # Reusable UI components
│   │   └── common/
│   │       ├── ArchitectureDiagram.tsx    # Interactive full-system architecture diagram
│   │       ├── AttackFlowVisualization.tsx# Visual animation of fraud attack vectors
│   │       ├── Footer.tsx                 # Site footer with ethical sandbox notices
│   │       ├── Navbar.tsx                 # Dynamic navigation with role badges & switcher
│   │       ├── RiskBadge.tsx              # Fraud risk score badges (LOW, MEDIUM, HIGH, CRITICAL)
│   │       ├── Sidebar.tsx               # Dashboard navigation sidebar
│   │       ├── StatusBadge.tsx            # Payment status pills (SUCCESS, PENDING, BLOCKED)
│   │       └── ToastContainer.tsx         # Real-time alert notifications & SOC threat toasts
│   ├── context/                # React Context providers for global state
│   │   ├── AlertContext.tsx    # System alerts & threat notification state
│   │   ├── AuthContext.tsx     # Simulated authentication & RBAC state
│   │   └── ThemeContext.tsx    # Theme tokens and UI configuration
│   ├── pages/                  # Top-level view pages & dashboards
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx         # System-wide KPIs & engine configuration
│   │   │   ├── AdminFraudRules.tsx        # Dynamic fraud heuristic rule management
│   │   │   └── AdminLogs.tsx              # Tamper-evident SOC audit logs
│   │   ├── merchant/
│   │   │   ├── MerchantApiKeys.tsx        # Sandbox API key generation & rotation
│   │   │   ├── MerchantDashboard.tsx      # Revenue, dispute rate, and payment analytics
│   │   │   ├── MerchantOrders.tsx         # Sandbox order creator & customer link generator
│   │   │   ├── MerchantPayments.tsx       # Payment transaction list & details
│   │   │   ├── MerchantRefunds.tsx        # Refund issuance & dispute resolution
│   │   │   ├── MerchantSecurity.tsx      # Merchant risk profile & webhook health
│   │   │   └── MerchantWebhooks.tsx       # Webhook endpoint configuration & test events
│   │   ├── About.tsx                      # Project purpose & defensive cybersecurity goals
│   │   ├── Checkout.tsx                   # Multi-rail sandbox checkout gateway
│   │   ├── Developers.tsx                 # Integration guides & API reference
│   │   ├── Documentation.tsx              # Interactive architecture & system documentation
│   │   ├── Features.tsx                   # Feature showcase & capability breakdowns
│   │   ├── FraudDetection.tsx             # Interactive 0-100 risk score calculator & playground
│   │   ├── Home.tsx                       # High-impact landing page with live fraud demos
│   │   ├── InvestigationPage.tsx          # Deep-dive forensic transaction dossier
│   │   ├── Login.tsx                      # Role-selection login screen (Customer, Merchant, Analyst, Admin)
│   │   ├── PaymentVerification.tsx        # Post-payment receipt & risk explanation view
│   │   ├── Register.tsx                   # Merchant & customer onboarding simulation
│   │   ├── ScamAwareness.tsx              # 10 comprehensive guides against modern cyber fraud
│   │   ├── ScamDemo.tsx                   # Deceptive checkout interactive walkthrough with red flags
│   │   ├── SecurityDashboard.tsx          # SOC real-time monitoring & simulated attack launcher
│   │   ├── UpiCheck.tsx                   # VPA, URL, and QR typosquatting / phishing inspector
│   │   └── UpiSecurity.tsx                # UPI safety rules, protocols, and fraud prevention
│   ├── services/
│   │   └── api.ts                         # Axios instance with auth headers & error handling
│   ├── types/
│   │   └── index.ts                       # Shared TypeScript interfaces (Payment, Rule, Alert, User)
│   ├── App.tsx                            # Primary router configuration & page layout routes
│   ├── index.css                          # Custom CSS variables, glassmorphism, and animations
│   └── main.tsx                           # Application entry point
├── index.html                  # HTML template with Google Fonts (Inter, Outfit)
├── package.json                # Project dependencies & scripts
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Tailwind CSS theme customization
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite server & API proxy configuration
```

---

## 🔐 Role-Based Access Control (RBAC)

The frontend simulates 4 distinct personas via the navbar and login screen:

1. **Customer (`CUSTOMER`)**
   - Test checkout flows (`/checkout/:orderId`).
   - Scan suspicious UPI IDs and payment links (`/upi-check`).
   - Learn about cyber scams (`/scam-awareness`).
2. **Merchant (`MERCHANT`)**
   - Manage incoming payments, orders, and refunds (`/merchant/*`).
   - Generate test API credentials & webhook endpoints.
3. **Security Analyst (`SECURITY_ANALYST`)**
   - Monitor live transactions & SOC alerts in real time (`/security`).
   - Trigger multi-vector synthetic cyber attacks to test defense rules.
   - Investigate flagged payments (`/security/investigation/:paymentId`).
4. **Administrator (`ADMIN`)**
   - Fine-tune fraud heuristic rule weights & thresholds (`/admin/fraud-rules`).
   - Review forensic audit logs (`/admin/logs`).

---

## 🌐 API Integration & Proxy

In development, Vite proxies all `/api/*` network requests to `http://localhost:5000` via `vite.config.ts`:

```typescript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    },
  },
}
```

Authentication tokens (`payguard_token`) are automatically stored in `localStorage` and attached via Axios request interceptors in `src/services/api.ts`.
