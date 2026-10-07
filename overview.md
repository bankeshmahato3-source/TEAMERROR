# PayGuard - Sandbox Educational Payment Gateway

## Project Overview

**PayGuard** is a full-stack, educational cybersecurity and fintech project designed to simulate a real-world payment portal ecosystem. It is built strictly as a sandbox for demonstration purposes and is tailored for a college B.Tech CSE cybersecurity project.

**Crucial Note:** This project *does not* connect to real banking systems, process real money, or collect real financial credentials. It is a completely self-contained simulated environment.

### Core Objectives
The primary goal of PayGuard is to educate users on:
1.  **Legitimate Payment Flows:** How a standard payment portal (like Razorpay or Stripe) functions under the hood.
2.  **Fraud Detection & Prevention:** How suspicious transactions are scored using heuristic-based engines and stopped before completion.
3.  **Phishing & Scam Awareness:** Demonstrating how malicious actors create fake UPI/payment portals to deceive users and steal credentials.
4.  **Role-Based Access Control (RBAC):** Providing distinct interfaces for Customers, Merchants, Security Analysts, and Administrators to monitor and manage the payment ecosystem.

## Application Architecture

The application follows a standard modern web architecture with a decoupled frontend and backend:

### Frontend (`frontend/`)
*   **Tech Stack:** React, TypeScript, Vite, Tailwind CSS (implied/standard for such apps).
*   **Routing:** React Router for handling multiple dashboards and public pages.
*   **State Management:** React Context API for global state like Authentication (`AuthContext`).
*   **Key Interfaces:**
    *   **Public/Customer Pages:** Landing page, Checkout Simulator, Scam Awareness Guides, UPI Security checks.
    *   **Merchant Dashboard:** Managing simulated payments, refunds, orders, API keys, and webhooks.
    *   **Security (SOC) Dashboard:** Real-time monitoring of transactions, investigating flagged behavior, and manual reviews.
    *   **Admin Dashboard:** System-wide overview, managing fraud detection rules, and reviewing audit logs.

### Backend (`backend/`)
*   **Tech Stack:** Node.js, Express, TypeScript.
*   **Pattern:** Controller-Service-Repository pattern for clean separation of concerns.
*   **Data Persistence:** In-memory JSON-persisted store (ideal for a portable sandbox demo without needing a complex database setup).
*   **Core Modules:**
    *   **Auth Module:** Handles simulated logins and role assignments.
    *   **Transaction Module:** Processes mock payments and updates states.
    *   **Fraud Engine:** A heuristic scoring system. It evaluates transactions based on predefined dynamic rules (e.g., rapid consecutive transactions, unusual locations, high amounts) and assigns a risk score. Based on thresholds, it will `ALLOW`, `MONITOR`, `REVIEW`, or `BLOCK` the transaction.

## Educational Modules included

To fulfill its purpose as a cybersecurity demo, PayGuard includes specific educational sections:
*   **Scam Demo (`/scam-demo`):** A controlled environment showing how a fake payment page looks and tricks users.
*   **Scam Awareness (`/scam-awareness`):** Detailed guides on common financial frauds (phishing, social engineering).
*   **UPI Security (`/upi-security`):** Information on how the Unified Payments Interface works and how to secure it.
*   **Fraud Detection Explanation (`/fraud-detection`):** A breakdown of how the internal heuristic engine scores and flags transactions.

## Getting Started (Demo)

The application is designed to be easily runnable locally.
*   **Backend:** Runs on Node.js (default port 5000).
*   **Frontend:** Runs via Vite dev server (default port 5173).

You can access the various personas by logging in with different simulated roles provided in the application.

---
*Created for educational purposes.*
