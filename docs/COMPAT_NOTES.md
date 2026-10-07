# COMPAT_NOTES.md — Compatibility Conflicts & Resolutions

This document notes where the crawler's requirements conflict with existing PayGuard conventions and how these conflicts are resolved (favoring existing conventions as instructed).

## 1. Datastore Concurrency vs. Crawler Worker
**Conflict**: The crawler runs as an asynchronous worker (potentially fetching and processing multiple domains concurrently). The existing `store.ts` uses synchronous file I/O (`fs.writeFileSync`) with a full object replacement on every setter. Concurrent writes from the crawler worker will cause data corruption (lost updates or corrupted JSON file).
**Resolution**: The crawler will use a `Queue` for its writes. All crawler writes to collections (Candidates, Evidence, Campaigns) will be pushed to a single-threaded task queue that processes one store update at a time. The existing `store.ts` is NOT modified, but the crawler guarantees it only mutates the store serially.

## 2. API Response Pagination
**Conflict**: The crawler requires pagination for GET endpoints (`?page=1&limit=20`), but the existing API lacks a standardized pagination envelope. Existing endpoints either return the full array (`/fraud/alerts`) or a hardcoded `.slice(0, 100)` (`/admin/logs`).
**Resolution**: The crawler API will introduce pagination in its own responses while keeping the top-level `success` flag.
Example: `{ success: true, count: 20, total: 150, page: 1, limit: 20, data: [...] }`. This is compatible with the existing envelope style but adds pagination metadata.

## 3. Threat Alerts (SOC Dashboard Integration)
**Conflict**: The existing SOC dashboard (`SecurityDashboard.tsx`) and `AlertContext.tsx` expect alerts to map to a `paymentId` (for the "Investigate" link). Crawler alerts relate to a `CandidateId` or `CampaignId`, not a payment.
**Resolution**: The crawler will generate `IFraudAlert` records using the existing interface. The `paymentId` field will hold the `candidateId`. The frontend SOC dashboard code relies on `/security/investigation/:paymentId` for the "Investigate" link. For crawler alerts, we will need a small conditional in the frontend (or let the existing investigation page gracefully handle it, though a dedicated Threat Intel view is better). The instructions say: "Add the route, nav entry and RBAC guard the way other pages do it. Do not restyle or refactor existing pages." Thus, we won't rewrite `SecurityDashboard.tsx` significantly; instead, crawler alerts will show in the SOC feed, and we add a *new* Threat Intel page for crawler specific details.

## 4. Test Infrastructure
**Conflict**: The crawler requires extensive unit/e2e tests, but the current backend has zero test files or configuration (no Jest/Vitest).
**Resolution**: Added `vitest` as a dev dependency to the backend. Tests are confined to `backend/src/crawler/` to avoid interfering with existing non-tested code.

## 5. Duplicate Types
**Conflict**: Types are manually duplicated between `backend/src/types/index.ts` and `frontend/src/types/index.ts`.
**Resolution**: Following the existing convention, new Crawler types will be added to both type definition files manually.

## 6. Audit Logging "Actor"
**Conflict**: The crawler operates autonomously, but `logSecurityEvent` requires an `actorEmail` and `actorRole`.
**Resolution**: The crawler will use `system-crawler@payguard.io` with role `SYSTEM` (even though `SYSTEM` is not in the formal `UserRole` union, `logSecurityEvent` types it as `string` so it is compatible).
