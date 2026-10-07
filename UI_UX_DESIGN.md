# PayGuard UI/UX Design System & Documentation

This document outlines the user interface (UI) design principles and user experience (UX) workflows implemented in the PayGuard Fintech Sandbox & Fraud Defense Engine.

---

## 1. Design Philosophy

PayGuard's UI is designed to mimic a high-end, modern B2B financial security platform (similar to Stripe, Razorpay, or Cloudflare dashboards). The primary goal is to establish **trust, clarity, and authority**.

### 1.1 Core Principles
* **Dark Mode First**: The application uses a native deep dark mode (`#0B0F19`) to reduce eye strain for security analysts who monitor dashboards for long periods and to project a "cybersecurity" aesthetic.
* **Data Density vs. Scannability**: High data density for complex tables (like threat detections), but heavily utilizing visual badges, colors, and progress bars so users can scan for threats instantly.
* **Micro-interactions**: Hover states, smooth page transitions, and pulsating indicators for active background tasks (e.g., crawler analysis) provide immediate feedback without blocking the user.

---

## 2. Color Palette & Typography

### 2.1 Color System (Tailwind CSS)
The color system relies heavily on cool slates mixed with vibrant indicators to direct the user's attention.
* **Backgrounds**: Deep Slate (`slate-900`/`slate-950`) and Midnight Blue (`#0B0F19`).
* **Panels/Cards**: Elevated Slate (`slate-800`/`slate-800/50`) with subtle `slate-700` borders.
* **Primary Accents**: Gradient Blues (`blue-400` to `indigo-400`) to represent stable, trustworthy actions.
* **Threat Indicators**: 
  * 🔴 **CRITICAL**: Red (`rose-500` / `red-400`) - Used for severe phishing blocks.
  * 🟠 **HIGH**: Orange (`orange-500` / `orange-400`) - Used for highly suspicious domains.
  * 🟡 **MEDIUM**: Yellow (`yellow-500` / `yellow-400`) - Used for monitoring flags.
  * 🟢 **LOW / SAFE**: Green (`emerald-500` / `green-400`) - Used for safe, cleared transactions.

### 2.2 Typography
* **Font Family**: Inter (or system-ui / sans-serif).
* **Hierarchy**: 
  * *Headers*: Bold, gradient-clipped text for page titles to add a premium feel.
  * *Body*: `slate-300` or `slate-400` for high readability against dark backgrounds.
  * *Monospace*: Used for technical data like IP addresses, IDs, and URLs (`font-mono text-xs`).

---

## 3. Key UI Components

### 3.1 Dashboards (Security & Admin)
* **Sidebar Navigation**: Fixed left-hand sidebar for quick switching between features (Logs, Rules Engine, Crawler). Highlights the active route with a glowing background indicator.
* **Metric Cards**: Quick glance cards at the top of dashboards (Total Detections, Pending Reviews). They use large numbers and subtle background icons.

### 3.2 The Threat Discovery Crawler UI
The Crawler interface was built with SOC (Security Operations Center) analysts in mind:
* **Manual Scanner Input**: A wide, clear input field for testing specific URLs.
* **Real-time Threat Report**: Instantly calculates and displays the Lexical Risk Score using dynamic color coding (e.g., scoring `hdfc-secure-login.xyz` as CRITICAL).
* **Investigation Split-View**: When viewing a detection, the screen splits:
  * *Left Panel*: The technical metadata (Risk Score, DOM hashes, IP addresses, related campaigns).
  * *Right Panel*: The visual evidence (Headless browser screenshot of the malicious page) so the analyst doesn't have to manually visit the dangerous link.

### 3.3 Badges and Labels
To process data quickly, text is minimized in favor of Badges. 
* e.g., `[CRITICAL]` in a solid red pill outline.
* e.g., `<span className="animate-pulse">Running</span>` to denote active background crawls.

---

## 4. User Experience (UX) Flows

### 4.1 Security Analyst Workflow
1. **Alert Generation**: An alert pops up on the SOC dashboard regarding a high-risk URL.
2. **Triaging**: Analyst clicks the URL, loading the `CrawlerDetectionDetails` component.
3. **Investigation**: Analyst reviews the Safe Screenshot and extracted phishing entities without exposing their own network.
4. **Resolution**: Analyst clicks action buttons: **Mark Safe**, **Block**, or **Initiate Takedown**, which triggers toast notifications and updates the database instantly without refreshing the page.

### 4.2 Error Handling & Feedback
* **Graceful Degradation**: If an API call fails (e.g., trying to fetch a down server), UI fallbacks catch the error and display an alert instead of crashing the white screen.
* **Loading States**: Skeletons and spinners (`lucide-react` Loader) are used to keep the user informed that data is being processed, especially during heavy tasks like Lexical Analysis.

---

## 5. Responsiveness
* **Mobile-Friendly**: The application uses Tailwind's mobile-first breakpoints (`md:`, `lg:`). 
* **Adapting Tables**: Large data tables (like the Crawler results) use horizontal overflow (`overflow-x-auto`) to prevent breaking the layout on smaller screens. 
* **Stacking Grids**: Dashboard metric cards seamlessly stack from 1 column on mobile to 4 columns on widescreen monitors.
