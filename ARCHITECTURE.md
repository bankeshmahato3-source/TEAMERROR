# PayGuard Sandbox & Threat Discovery - Architecture & Workflow

This document outlines the complete system architecture, data workflow, and technological stack of the PayGuard Fintech Sandbox & Fraud Defense Engine, including the newly added Threat Discovery Crawler.

---

## 1. High-Level Architecture

PayGuard is a monolithic application split into two main directories:
- **Frontend (`/frontend`)**: A React 18 single-page application built with Vite and Tailwind CSS.
- **Backend (`/backend`)**: A Node.js & Express server written in TypeScript, acting as both an API server and a background job processor.

### 1.1 Tech Stack
* **Frontend**: React 18, TypeScript, React Router DOM, Tailwind CSS, Lucide Icons, Axios.
* **Backend**: Node.js, Express, TypeScript, bcryptjs, jsonwebtoken, Playwright (for headless scraping).
* **Database**: Embedded JSON Datastore (`dbStore` and `crawlerStore`). The data is synchronously/asynchronously written to JSON files on the disk to avoid requiring an external database like MongoDB/PostgreSQL, keeping the setup lightweight.

---

## 2. Core Modules & Components

### 2.1 Backend Modules
1. **Auth (`authController.ts`)**: Handles user login, hashing passwords using `bcryptjs`, and issuing JWT tokens with RBAC (Role-Based Access Control).
2. **Transaction Engine (`payments/`, `orders/`)**: Simulates a payment gateway capable of processing sandbox payments, refunds, and generating security logs.
3. **Fraud Engine (`fraudEngine/`)**: Evaluates incoming payments against heuristic rules (e.g., velocity checks, IP mismatch) and assigns a fraud score.
4. **Threat Discovery Crawler (`crawler/`)**: 
   - **Lexical Filter (`lexicalFilter.ts`)**: Evaluates domains for homoglyph attacks (e.g., `0` instead of `o`) and calculates Levenshtein distances against known banking domains.
   - **Fetcher (`fetcher.ts`)**: A secure background HTTP client and Playwright driver that fetches HTML and takes screenshots safely. Uses `ssrfGuard.ts` to block internal IP addresses (DNS Rebinding protection).
   - **Campaign Grouper (`campaignGrouper.ts`)**: Clusters similar malicious domains into "Campaigns" based on fuzzy DOM structure hashing and IP subnet proximity.
   - **Manual Crawler (`manualCrawler.ts`)**: A lightweight real-time BFS crawler endpoint added for the Admin dashboard to manually scan specific URLs.

### 2.2 Frontend Modules
1. **Context Providers (`AuthContext.tsx`, `ThemeContext.tsx`)**: Manages global application state for the logged-in user and dark/light UI modes.
2. **SOC Dashboard (`SecurityDashboard.tsx`)**: The Security Operations Center view showing real-time fraud alerts.
3. **Admin Panel (`AdminDashboard.tsx`)**: Allows super-admins to view global metrics, manage rules, and oversee the Threat Discovery Crawler.
4. **Crawler UI (`CrawlerDetections.tsx`, `ManualCrawler.tsx`)**: The newly integrated dashboard pages that display intercepted threats, risk analysis, and allow manual domain crawling.

---

## 3. Data Workflow & Lifecycle

### 3.1 Payment Processing Workflow
1. User interacts with the Checkout Gateway UI.
2. Frontend sends `POST /api/orders` to initialize the session, then `POST /api/payments` to process the card.
3. Backend intercepts the payload. The **Fraud Engine** analyzes the IP, device fingerprint, and velocity.
4. If the fraud score is too high, the transaction is rejected and an Alert is generated.
5. Logs are persisted to `store.ts` and the frontend UI updates instantly.

### 3.2 Threat Discovery Crawler Workflow
1. **Ingestion**: Malicious URLs are discovered either via external mock sources (Cert logs) or manual inputs via the **Chrome Extension**.
2. **Pre-Crawl Risk Scoring**: The URL is analyzed instantly by the Lexical Filter (`lexicalFilter.ts`). If the score is high (e.g., typosquatting `paytmm.com`), it is queued.
3. **Secure Fetching**: The background worker picks up the job, resolves the DNS, checks `ssrfGuard` to prevent attacking localhost, and uses `Playwright` to capture a screenshot and extract DOM elements.
4. **Analysis & Grouping**: The DOM hash is calculated and passed to the Campaign Grouper. If it matches a known phishing kit, it's clustered together.
5. **Dashboard Presentation**: The SOC Analyst views the detection at `/admin/crawler/detections`, reviews the evidence (screenshots, entities), and marks the final decision (Takedown, Block, or Safe).

---

## 4. Security Measures Implemented
* **SSRF Protection**: Crawler refuses to fetch private/loopback IP blocks (127.0.0.0/8, 10.0.0.0/8).
* **Defensive Scraping**: The headless browser strips out forms and disables scripts to prevent malware execution during analysis.
* **Authentication**: Strict JWT validations with Role checking middleware (`requireRoles(['SECURITY_ANALYST', 'ADMIN'])`).
* **Rate Limiting & Helmet**: Prevents API abuse and secures HTTP headers.

---

## 5. Chrome Extension Integration
The system includes a Manifest V3 Chrome Extension.
- **Workflow**: When the user clicks the extension popup, `popup.js` uses `chrome.tabs.query` to get the current active URL.
- It immediately opens a new tab directed to `http://localhost:5173/admin/crawler?url=<target>`.
- The Frontend catches this parameter, triggers the API to perform a Lexical Risk Analysis, and immediately displays a detailed Pre-Crawl Threat Report.
