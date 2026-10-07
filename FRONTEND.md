# PayGuard Frontend Overview 🌐

> Full documentation is maintained in [frontend/README.md](file:///c:/Users/ANAND%20RAJ/OneDrive/Desktop/team%20error/frontend/README.md).

The frontend is a **React 18 + TypeScript + Vite** application providing an interactive fintech sandbox portal, security operations dashboard, and educational cybersecurity awareness guides.

---

## 🚀 Running the Frontend

### From Workspace Root:
```bash
npm.cmd run dev:frontend
```

### From the `frontend/` Directory:
```bash
cd frontend
npm.cmd install
npm.cmd run dev
```

The frontend launches on **http://localhost:5173** and proxies API calls to `http://localhost:5000/api`.

---

## 📁 Key Directories & Modules

| Path | Description |
| :--- | :--- |
| [`frontend/src/pages/`](file:///c:/Users/ANAND%20RAJ/OneDrive/Desktop/team%20error/frontend/src/pages) | Core views: Landing, Sandbox Checkout, Scam Demos, UPI Scanners, SOC Dashboard |
| [`frontend/src/pages/merchant/`](file:///c:/Users/ANAND%20RAJ/OneDrive/Desktop/team%20error/frontend/src/pages/merchant) | Merchant portal: Orders, Payments, Refunds, API Keys, Webhooks |
| [`frontend/src/pages/admin/`](file:///c:/Users/ANAND%20RAJ/OneDrive/Desktop/team%20error/frontend/src/pages/admin) | Administrator controls: Dynamic fraud rules tuning, Audit logs |
| [`frontend/src/components/common/`](file:///c:/Users/ANAND%20RAJ/OneDrive/Desktop/team%20error/frontend/src/components/common) | Reusable UI: Navigation, Badges, Modals, Threat visualizers |
| [`frontend/src/context/`](file:///c:/Users/ANAND%20RAJ/OneDrive/Desktop/team%20error/frontend/src/context) | Global states: `AuthContext` (RBAC), `AlertContext` (SOC toasts), `ThemeContext` |
| [`frontend/src/services/api.ts`](file:///c:/Users/ANAND%20RAJ/OneDrive/Desktop/team%20error/frontend/src/services/api.ts) | Axios HTTP client configured with JWT interceptor |

---

## 🛠️ Available Scripts

- `npm run dev`: Launch Vite dev server
- `npm run build`: Type-check and create optimized production bundle (`dist/`)
- `npm run preview`: Preview production build locally
