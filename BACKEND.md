# PayGuard Backend Overview ⚙️

> Full documentation is maintained in [backend/README.md](file:///c:/Users/ANAND%20RAJ/OneDrive/Desktop/team%20error/backend/README.md).

The backend is a **Node.js + Express + TypeScript** REST API that powers payment sandbox processing, real-time heuristic fraud risk scoring, threat simulation waves, and audit logging.

---

## 🚀 Running the Backend

### From Workspace Root:
```bash
npm.cmd run dev:backend
```

### From the `backend/` Directory:
```bash
cd backend
npm.cmd install
npm.cmd run dev
```

The server launches on **http://localhost:5000** and exposes the health check at **http://localhost:5000/api/health**.

---

## 📁 Key Directories & Modules

| Path | Description |
| :--- | :--- |
| [`backend/src/controllers/`](file:///c:/Users/ANAND%20RAJ/OneDrive/Desktop/team%20error/backend/src/controllers) | REST API handlers: Payments, Orders, Auth, Fraud Engine, UPI, Dashboard |
| [`backend/src/services/`](file:///c:/Users/ANAND%20RAJ/OneDrive/Desktop/team%20error/backend/src/services) | Core logic: `fraudEngine.ts`, `simulationService.ts`, `upiScanner.ts` |
| [`backend/src/middleware/`](file:///c:/Users/ANAND%20RAJ/OneDrive/Desktop/team%20error/backend/src/middleware) | JWT authentication & Role-Based Access Control (`auth.ts`) |
| [`backend/src/models/store.ts`](file:///c:/Users/ANAND%20RAJ/OneDrive/Desktop/team%20error/backend/src/models/store.ts) | High-speed embedded JSON datastore |
| [`backend/src/seed/seed.ts`](file:///c:/Users/ANAND%20RAJ/OneDrive/Desktop/team%20error/backend/src/seed/seed.ts) | Pre-populates 56 transactions, 12 merchants, and 7 fraud rules |
| [`backend/src/utils/auditLogger.ts`](file:///c:/Users/ANAND%20RAJ/OneDrive/Desktop/team%20error/backend/src/utils/auditLogger.ts) | Tamper-evident forensic security event logging |

---

## 🛠️ Available Scripts

- `npm run dev`: Launch server with TSX auto-reloading
- `npm run build`: Compile TypeScript to `dist/`
- `npm run start`: Run compiled production server
- `npm run seed`: Manually re-seed sandbox database
