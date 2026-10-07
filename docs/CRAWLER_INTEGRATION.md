# CRAWLER_INTEGRATION.md — Step 0 Codebase Analysis

## 1. Data Store (`backend/src/models/store.ts`)

### How Collections Are Defined
- A `MemoryStore` class wraps a `DatabaseData` interface containing typed arrays.
- Each collection is exposed as a getter/setter pair on the class instance.
- **Write pattern**: the setter replaces the entire array and immediately calls `saveToDisk()`.
  - Example: `set payments(p) { this.data.payments = p; this.saveToDisk(); }`
  - This means every mutation requires reassigning the full array to the setter to trigger persistence.
  - **Writes are synchronous** (`fs.writeFileSync`) and NOT atomic (no temp-file rename). A crash during write could corrupt the JSON file.
  - The store is a **singleton** exported as `export const dbStore = new MemoryStore()`.

### ID Formats
- Prefixed string IDs, manually constructed (no UUID library):
  - Users: `usr_admin_01`, `usr_cust_01`, `usr_cust_2`
  - Merchants: `merch_01`, `merch_suspicious_01`
  - Payments: `pay_SIM_<ts>_<rand4>`, or `pay_<rand5>` in seed
  - Fraud alerts: `alert_sim_<rand4>`
  - Security logs: `log_<Date.now()>_<rand3>`
- Pattern: `<prefix>_<identifier>` with no consistent format (some use Date.now(), some use sequential numbers).

### How seed.ts Populates Data
- Calls `dbStore.reset()` first (clears everything).
- Generates users, merchants, orders, payments, analyses, alerts, rules, api keys, webhooks, logs.
- Assigns to `dbStore.<collection> = array` (triggering save via setter).
- The `seedDatabase()` function is `async` (because of bcrypt).

### Crawler Impact
- New collections will need: new properties on `DatabaseData`, new getter/setter pairs.
- Write queue is **essential**: the existing synchronous `writeFileSync` pattern would corrupt data under concurrent writes from a crawler worker. The crawler must funnel all writes through a single queue.

---

## 2. Controllers + Routes Pattern

### Route Registration
- Each domain has a `routes/<domain>Routes.ts` file creating an Express `Router`.
- Routes are registered in `backend/src/index.ts` with `app.use('/api/<domain>', router)`.
- Middleware applied either per-route or via `router.use(...)` at top.

### Response Envelope
All responses follow this shape:
```typescript
// Success:
{ success: true, <data-key>: value, [count?: number], [message?: string] }

// Error:
{ success: false, message: string }
```
- Data keys vary: `alerts`, `payments`, `rules`, `logs`, `users`, `investigation`, `analysis`, etc.
- No standardized pagination envelope exists — `getSecurityLogs` simply does `.slice(0, 100)`.

### Error Format
- HTTP status codes: 400 (validation), 401 (auth), 403 (role), 404 (not found), 500 (internal).
- Body: `{ success: false, message: string }`.

### Pagination Convention
- **None standardized**. Some endpoints accept `?limit=N` via query params, others hardcode `.slice(0, 100)`.
- Crawler API will adopt `?page=1&limit=20` with a `total` count in the response, following existing envelope style.

---

## 3. Auth Middleware (`backend/src/middleware/auth.ts`)

### JWT Payload
```typescript
{ id: string; email: string; role: UserRole; merchantId?: string; name: string }
```
- Secret: `process.env.JWT_SECRET || 'payguard-super-secure-jwt-secret-key-2026'`
- Expiry: 7 days.

### Roles
```typescript
type UserRole = 'CUSTOMER' | 'MERCHANT' | 'SECURITY_ANALYST' | 'ADMIN';
```

### Protection Pattern
- `authenticateJwt`: extracts Bearer token, verifies, looks up user in `dbStore.users`, attaches `req.user`.
- `requireRoles(roles[])`: checks `req.user.role` against allowed list.
- `AuthenticatedRequest` extends Express `Request` with `user?` property.

### Crawler RBAC Plan
- Read-only endpoints (detections list, campaigns): `authenticateJwt` + `requireRoles(['SECURITY_ANALYST', 'ADMIN'])`.
- Write endpoints (confirm/reject, run/stop): `authenticateJwt` + `requireRoles(['ADMIN'])`.
- Submit report (intake): `authenticateJwt` (any authenticated role).

---

## 4. Services

### 4a. fraudEngine.ts
- Static class `FraudDetectionEngine` with a single method `analyze(input): result`.
- Input: `FraudEvaluationInput` (amount, merchantId, customerEmail, optional clientIp/device/location/upiId/paymentUrl).
- Returns: `{ riskScore: 0-100, riskLevel: RiskLevel, recommendation: RiskAction, reasons: string[], triggeredRules[], features{} }`.
- Risk levels/actions from `dbStore.thresholds`: LOW ≤ 29 → ALLOW, MEDIUM ≤ 59 → MONITOR, HIGH ≤ 79 → REVIEW, CRITICAL ≥ 80 → BLOCK.
- **Reuse for crawler**: The crawler's clone score should use the same `RiskLevel` and `RiskAction` types and the same threshold scale. It should NOT call `FraudDetectionEngine.analyze()` directly (different input domain), but must produce compatible output.

### 4b. upiScanner.ts
- Static class `UpiScannerService` with `analyze(input: string): UpiScanResult`.
- Auto-detects URL vs VPA. Returns `{ target, type, riskScore 0-100, riskLevel, recommendation, summary, indicators[], brandImpersonationDetected, scamCategory }`.
- **Reuse for crawler**: The intake step can pipe extracted UPI IDs through `UpiScannerService.analyze()` to get risk scores and brand impersonation flags. This is explicitly called out in requirements.

### 4c. simulationService.ts
- Static class `FraudSimulationService` with `runSimulation(): Promise<{simulatedScenarios[]}>`.
- Creates 6 hardcoded scenarios, runs each through `FraudDetectionEngine.analyze()`, creates `IPayment`, `IFraudAnalysis`, and optionally `IFraudAlert` records.
- Alert creation pattern (HIGH/CRITICAL):
```typescript
const alert: IFraudAlert = {
  id: `alert_sim_${rand}`,
  alertId: `alt_${rand}`,
  paymentId,
  merchantId,
  merchantName,
  amount,
  riskScore,
  severity: riskLevel,
  status: 'OPEN',
  message: `...`,
  createdAt: timestamp,
};
dbStore.fraudAlerts = [alert, ...dbStore.fraudAlerts];
```
- **Reuse for crawler**: The crawler SOC integration must create `IFraudAlert` records in the same shape so the existing SOC dashboard and `AlertContext` consume them seamlessly. The `paymentId` field will be mapped to the crawler detection ID (or left as a reference string).

---

## 5. Audit Logger (`backend/src/utils/auditLogger.ts`)

### Event Format
```typescript
interface ISecurityLog {
  id: string;          // `log_${Date.now()}_${rand3}`
  action: string;      // e.g. 'FRAUD_SIMULATION_RUN', 'ALERT_STATUS_UPDATED'
  actorEmail: string;  // e.g. 'admin@payguard.io', 'system@payguard.io'
  actorRole: string;   // e.g. 'ADMIN', 'SECURITY_ANALYST'
  ip: string;          // default '127.0.0.1'
  details: string;     // human-readable description
  createdAt: string;   // ISO 8601
}
```
- Function: `logSecurityEvent(action, actorEmail, actorRole, details, ip?)`.
- Prepends to `dbStore.securityLogs` (newest first).
- **Tamper-evidence**: None. Logs are simply prepended to an array with no hash chain or signature. The crawler will follow this same pattern (no cryptographic tamper evidence exists to maintain).

### Crawler Usage
- Every crawler action (candidate discovered, fetched, scored, confirmed/rejected, campaign created) will call `logSecurityEvent()`.
- Automated actions use `actorEmail: 'crawler@payguard.io'`, `actorRole: 'SYSTEM'`.

---

## 6. Frontend

### 6a. API Client (`frontend/src/services/api.ts`)
- Axios instance with `baseURL: '/api'`.
- Request interceptor attaches `Authorization: Bearer <token>` from `localStorage('payguard_token')`.
- Response interceptor: no-op on 401 (doesn't force redirect).

### 6b. AlertContext (`frontend/src/context/AlertContext.tsx`)
- `ToastAlert` interface: `{ id, paymentId?, amount?, riskScore?, severity: RiskLevel | 'INFO', message, action?, timestamp }`.
- `triggerAlert(alertData)` creates a toast, auto-dismisses after 7s, keeps max 5.
- Used by `SecurityDashboard` after simulation to show threat toasts.
- **Crawler integration**: When crawler produces HIGH/CRITICAL detections, the frontend can poll or receive them and call `triggerAlert()` the same way.

### 6c. SOC Dashboard (`frontend/src/pages/SecurityDashboard.tsx`)
- Fetches from `/dashboard/stats`, `/dashboard/analytics`, `/payments?limit=25`, `/fraud/alerts`.
- Displays KPI cards, Recharts line/pie/bar charts, and a transaction surveillance table with RiskBadge, StatusBadge, and "Investigate" link.
- Uses `useAlert()` to trigger toasts after simulation.

### 6d. Existing Components
- `RiskBadge`: `{ level: RiskLevel, score?: number, size }` — color-coded pills for LOW/MEDIUM/HIGH/CRITICAL.
- `StatusBadge`: `{ status: PaymentStatus, size }` — pills for SUCCESS/BLOCKED/REVIEW/etc.
- `AttackFlowVisualization`: animated attack step visualizer.
- `Sidebar`: navigation sidebar used in merchant pages.

### 6e. Styling Conventions
- Dark theme default: `bg-[#0B0F19]`, slate-800/900 cards.
- Glassmorphism: `glass-card` CSS class.
- Font: Tailwind defaults + mono for data.
- Border pattern: `border border-slate-800 light:border-slate-200`.
- Card pattern: `p-4/5 rounded-2xl glass-card border ...`.
- Text sizes: `text-xs`, `text-[10px]`, `text-[11px]` for labels.

### 6f. Routing
- `App.tsx` defines flat `<Routes>` with `<Route path="..." element={...} />`.
- No lazy loading, no route guards (RBAC is server-side; frontend just navigates).
- Pattern: `/security/*` for SOC, `/admin/*` for admin, `/merchant/*` for merchant.
- Crawler page: `/security/threat-intel` (fits SOC area).

### 6g. Frontend Types
- Mirror of backend types in `frontend/src/types/index.ts` (manually maintained copy, not shared).
- New crawler types will be added to this file.

---

## 7. Test Setup, Tooling & Windows Conventions

### Test Setup
- **No test framework exists**. No `vitest.config.ts`, `jest.config.*`, no `*.test.*` or `*.spec.*` files.
- Will add **Vitest** as specified in requirements (lightweight, TypeScript-native, works with tsx).

### Lint Config
- **No ESLint config** in the project root or src. Only `node_modules` contain `.eslintrc`.
- TypeScript `strict: true` is enforced in `tsconfig.json`.

### tsconfig
- Backend: `target: ES2022`, `module: CommonJS`, `moduleResolution: node`, `strict: true`.
- Frontend: `target: ES2020`, `module: ESNext`, `moduleResolution: bundler`, `jsx: react-jsx`, `strict: true`.

### Package Scripts (backend/package.json)
```json
"dev": "tsx watch src/index.ts",
"build": "tsc",
"start": "node dist/index.js",
"seed": "tsx src/seed/seed.ts"
```
- New scripts will be: `"crawler"`, `"crawler:seed"`, `"crawler:test"`.

### Windows Conventions
- Scripts use `npm.cmd` in root `package.json` for cross-platform compatibility.
- No shell-specific syntax (no `&&` chains in npm scripts that would break on cmd.exe — they use `&&` which works in PowerShell and cmd).

---

## ASSUMPTIONS

1. **No shared type package**: Frontend and backend types are manually duplicated. New crawler types will be added to both `backend/src/types/index.ts` (or `backend/src/crawler/types.ts`) and `frontend/src/types/index.ts`.
2. **Store write safety**: The existing store has no write protection. The crawler will introduce a write queue wrapping `dbStore` mutations, but existing code will NOT be modified to use it (would violate "do not rewrite existing modules"). This means the crawler queue only protects crawler writes; existing endpoints still write synchronously. This is acceptable because the crawler runs as a separate process or gated by a flag, reducing collision risk.
3. **No pagination standard**: Crawler API will introduce `?page=&limit=` pattern with `{ success, total, page, limit, data }` without retrofitting existing endpoints.
4. **No test infrastructure**: Vitest will be added as a devDependency. Tests will live in `backend/src/crawler/__tests__/`.
5. **`IFraudAlert.paymentId` reuse**: Crawler alerts will set `paymentId` to the crawler detection ID (prefixed `crl_det_`). The SOC dashboard currently uses this field to link to `/security/investigation/:paymentId` — crawler detections will link to `/security/threat-intel/:id` instead. This is a minor UI concern handled in the frontend.
6. **Playwright is not available in this environment**: All fetcher tests will use mocked/fixture HTML pages. The `CertStreamSource` and `CrtShSource` are implemented but can only be verified with network access. `FixtureSource` is the default and works fully offline.
7. **No Docker in this environment**: The Dockerfile will be provided but not tested. The local Windows fallback (direct Playwright) is the primary dev path.
8. **Store singleton import path**: Crawler code in `backend/src/crawler/` will import from `../models/store`, `../utils/auditLogger`, `../services/upiScanner`, and `../middleware/auth` — staying within the existing module system.
9. **The `any` type appears in existing code** (e.g., `SecurityDashboard.tsx` uses `useState<any>(null)`, `IWebhookEvent.payload: any`). The crawler code will use `no any` as required, but existing code is not modified.
10. **No `.env` file exists currently**. A `.env.example` will be created documenting all crawler-related environment variables.
