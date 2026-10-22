# Ausbildung Preparation Portal — Render Deployment Failure Analysis & Troubleshooting Guide

**Incident Date:** October 22, 2026  
**Target Commit:** `efbab5f` (Fixed in subsequent commit)  
**Author / Engineer:** Senior Deployment Engineer  
**Status:** All Reported Issues Resolved and Verified Locally  

---

## 1. Executive Summary & Root Cause Analysis

On October 22, 2026, Render deployment failed during the backend compilation stage (`nest build`). The frontend Next.js production build had passed, but the NestJS backend service failed to build. Additionally, navigating to the backend service URL in a web browser returned `Cannot GET /`.

Through systematic code inspection, build tracing, and local reproduction, three core root causes were identified:

### Root Cause 1: Missing Prisma Client Generation during Clean Container Builds
- **Symptom on Render:** Missing enum exports from `@prisma/client`: `CefrLevel`, `SpeakingTopicCategory`, `SpeakingSessionStatus`, `SpeakingReportReason`.
- **Underlying Cause:**
  - In `apps/api/prisma/schema.prisma`, all four enums (`CefrLevel` at line 26, `SpeakingSessionStatus` at line 795, `SpeakingTopicCategory` at line 804, `SpeakingReportReason` at line 813) were legitimately defined and correctly modeled in the database schema.
  - However, in `apps/api/package.json`, the `"build"` script was solely `"nest build"`.
  - The root `package.json` had no `postinstall` script to trigger Prisma Client generation.
  - When Render cloned the repository and ran `npm install && npm run build`, `@prisma/client` in `node_modules` remained the default empty placeholder library shipped with the npm package.
  - Because Prisma Client was never generated prior to NestJS TypeScript compilation (`tsc`), TypeScript failed to resolve the four enum exports, causing catastrophic build failure.

### Root Cause 2: Cascade TS7006 Implicit-Any Errors in API Services
- **Symptom on Render:** TS7006 implicit-any errors in `learning.service.ts`, `speaking.service.ts`, `toolkit.service.ts`, and `users.service.ts`.
- **Underlying Cause:**
  - Because `@prisma/client` types were ungenerated, Prisma query results resolved to `any` or loose generic types.
  - Array operations (`.map()`, `.filter()`, `.reduce()`) in these services lacked explicit parameter type annotations:
    - `learning.service.ts`: `userBookmarks.map(b => ...)` and `items.map(item => ...)`
    - `speaking.service.ts`: `allRatings.reduce((sum, r) => ...)`
    - `toolkit.service.ts`: `letter.bodyText.split().filter(p => ...).map(p => ...)`, `docs.reduce((acc, curr) => ...)`, `items.filter(i => ...)`
    - `users.service.ts`: `user.roles.map(r => ...)` and `users.map(u => ...)`
    - `dashboard.service.ts`: `user.quizAttempts.reduce((acc, q) => ...)` and `user.receivedRatings.reduce((acc, r) => ...)`
  - Under TypeScript's `"strict": true` compiler configuration, implicit-any callback parameters caused TS7006 compile errors.

### Root Cause 3: Express 404 `Cannot GET /` on Root Domain URL
- **Symptom on Browser:** Opening the base Render API URL (`https://ausbildung-api.onrender.com/`) yielded Express's default HTML 404 message: `Cannot GET /`.
- **Underlying Cause:**
  - In `apps/api/src/main.ts`, line 46 applied `app.setGlobalPrefix('api/v1')` across the entire application without excluding the root route `'/'`.
  - In `apps/api/src/app.module.ts`, `AppController` and `AppService` were not registered in `controllers: []` and `providers: []`.
  - Consequently, NestJS registered no HTTP route handler for `GET /`. All API routes lived under `/api/v1/*` (e.g., `/api/v1/auth/login`, `/api/v1/dashboard/admin/health`, etc.).
  - Additionally, `SanitizeInterceptor` attempted to reassign `req.query`, which is a getter-only property on modern Express request prototypes, causing an internal 500 error when requests hit non-standard endpoints.

---

## 2. Issues Resolution Status Matrix

| Reported Issue | Severity | Status | Resolution Summary |
| :--- | :--- | :--- | :--- |
| **Missing Prisma enums** (`CefrLevel`, `SpeakingTopicCategory`, `SpeakingSessionStatus`, `SpeakingReportReason`) | Critical (Blocker) | **Fixed and verified** | Added `"postinstall": "npm run prisma:generate --workspace=apps/api"` to root `package.json` and updated `apps/api/package.json` build script to `"prisma generate && nest build"`. |
| **TS7006 implicit-any errors** in `learning.service.ts`, `speaking.service.ts`, `toolkit.service.ts`, `users.service.ts` | High (Blocker) | **Fixed and verified** | Added explicit, strong TypeScript type annotations to callback parameters and query mappings without disabling `strict` or using `any`/`as any`. |
| **Browser displays `Cannot GET /`** on API root URL | Medium (User/Health Impact) | **Fixed and verified** | Registered `AppController` and `AppService` in `AppModule`, excluded `'/'` from `setGlobalPrefix('api/v1')`, and returned a structured informational health/status JSON response. |
| **SanitizeInterceptor getter exception** (`Cannot set property query of IncomingMessage`) | Medium (Edge Case) | **Fixed and verified** | Updated `SanitizeInterceptor` to mutate `req.query` and `req.params` in-place using `Object.assign` rather than reassigning getter properties. |
| **Database Migrations on Production** | High (Operational) | **Requires configuration / credentials** | Documented safe zero-downtime deployment process using `prisma db push` or `prisma migrate deploy` with target database credentials. |

---

## 3. Detailed Files Changed and Technical Rationale

### 1. `apps/api/package.json`
- **Change:**
  ```json
  "build": "prisma generate && nest build",
  "prisma:migrate:deploy": "prisma migrate deploy",
  "start:prod": "node dist/main.js"
  ```
- **Rationale:** Ensures that Prisma Client code generation runs prior to NestJS TypeScript compilation in any environment (local, Docker, or Render). Explicitly adds the `.js` extension to `start:prod` for ESM compatibility.

### 2. Root `package.json`
- **Change:** Added postinstall and workspace convenience scripts:
  ```json
  "postinstall": "npm run prisma:generate --workspace=apps/api",
  "build:types": "npm run build --workspace=@ausbildung/shared-types",
  "build:api": "npm run build --workspace=apps/api",
  "build:web": "npm run build --workspace=apps/web",
  "prisma:generate": "npm run prisma:generate --workspace=apps/api",
  "prisma:migrate:deploy": "npm run prisma:migrate:deploy --workspace=apps/api"
  ```
- **Rationale:** Guarantees `@prisma/client` is generated automatically immediately after `npm install` or `npm ci`. Allows deterministic individual workspace builds on Render.

### 3. `apps/api/src/modules/learning/learning.service.ts`
- **Change:** Lines 564–572:
  ```typescript
  bookmarkedIds = new Set(
    userBookmarks
      .map((b: { vocabularyId: string | null }) => b.vocabularyId)
      .filter((id): id is string => id !== null),
  );
  // ...
  items: items.map((item: (typeof items)[number]) => ({
    ...item,
    isBookmarked: bookmarkedIds.has(item.id),
  })),
  ```
- **Rationale:** Strongly annotates `b` and `item` to eliminate TS7006 implicit any while preserving all relational data and pagination.

### 4. `apps/api/src/modules/speaking/speaking.service.ts`
- **Change:** Line 463:
  ```typescript
  const avg =
    ratingCount > 0
      ? allRatings.reduce((sum: number, r: { stars: number }) => sum + r.stars, 0) / ratingCount
      : 5.0;
  ```
- **Rationale:** Explicitly types the `reduce` accumulator (`sum: number`) and current element (`r: { stars: number }`), ensuring type safety even before Prisma generates.

### 5. `apps/api/src/modules/toolkit/toolkit.service.ts`
- **Change:**
  - Lines 515–516: `.filter((p: string) => p.trim().length > 0).map((p: string) => ...)`
  - Line 692: `docs.reduce((acc: number, curr: { fileSize: number }) => acc + curr.fileSize, 0)`
  - Line 741: `items.filter((i: { isCompleted: boolean }) => i.isCompleted).length`
- **Rationale:** Eliminates implicit-any errors on string manipulation, document file size calculations, and application checklist completions.

### 6. `apps/api/src/modules/users/users.service.ts`
- **Change:**
  - Line 30: `roles: user.roles.map((r: { role: { name: string } }) => r.role.name)`
  - Lines 87 & 93: `users.map((u: (typeof users)[number]) => ({ ..., roles: u.roles.map((r: { role: { name: string } }) => r.role.name) }))`
- **Rationale:** Re-establishes explicit role name mapping types for single user lookup and paginated user lists.

### 7. `apps/api/src/modules/dashboard/dashboard.service.ts`
- **Change:**
  - Line 88: `user.quizAttempts.reduce((acc: number, q: { scorePercentage: number }) => acc + q.scorePercentage, 0)`
  - Line 129: `user.receivedRatings.reduce((acc: number, r: { stars: number }) => acc + r.stars, 0)`
- **Rationale:** Eliminates implicit-any risks during quiz score and rating aggregation.

### 8. `apps/api/src/app.module.ts`, `app.controller.ts`, `app.service.ts`, `main.ts`
- **Change:**
  - Registered `AppController` in `controllers` and `AppService` in `providers`.
  - Updated `main.ts` to exclude root `'/'` from the `/api/v1` global prefix:
    ```typescript
    app.setGlobalPrefix('api/v1', {
      exclude: ['/'],
    });
    ```
  - Configured `AppController` and `AppService` to return an informational status JSON envelope:
    ```json
    {
      "success": true,
      "data": {
        "name": "Ausbildung Preparation Portal API",
        "status": "operational",
        "version": "1.0.0",
        "docs": "/api/v1/docs"
      },
      "meta": { "timestamp": "2026-10-22T..." }
    }
    ```
- **Rationale:** Resolves `Cannot GET /` with a safe, non-sensitive informational response that confirms API availability and links to documentation.

### 9. `apps/api/src/common/interceptors/sanitize.interceptor.ts`
- **Change:** Replaced property reassignment of `req.query` and `req.params` with safe in-place object property sanitization via `Object.assign()`.
- **Rationale:** Prevents `TypeError: Cannot set property query of #<IncomingMessage> which has only a getter` in Node/Express environments.

### 10. `render.yaml`
- **Change:** Added Render Blueprint Infrastructure-as-Code specification defining `ausbildung-api` (backend), `ausbildung-web` (frontend), and `ausbildung-postgres` (database).

---

## 4. Local Validation Commands & Actual Execution Results

All commands were executed in the workspace in dependency order:

```bash
# 1. Prisma Schema Validation
$ npm --workspace=apps/api exec prisma validate
Output: The schema at prisma\schema.prisma is valid 🚀 (Exit code: 0)

# 2. Shared Types Package Build
$ npm run build --workspace=@ausbildung/shared-types
Output: tsc finished with 0 errors (Exit code: 0)

# 3. Prisma Client Generation & NestJS Build
$ npm run build --workspace=apps/api
Output:
✔ Generated Prisma Client (v6.19.3) to .\node_modules\@prisma\client in 1.67s
✔ nest build compiled successfully (Exit code: 0)

# 4. TypeScript Type Checking (Strict Mode)
$ npx tsc --noEmit (in apps/api)
Output: 0 errors (Exit code: 0)

$ npx tsc --noEmit (in apps/web)
Output: 0 errors (Exit code: 0)

# 5. Type-Aware Static Analysis Linting
$ npm run lint --workspace=apps/api
Output: Finished in 2.9s on 90 files with 111 rules. Found 0 warnings and 0 errors. (Exit code: 0)

# 6. Unit & Service Tests
$ npm run test --workspace=apps/api
Output: 11 passed (11 test files), 100 passed (100 tests) in 21.82s (Exit code: 0)

# 7. End-to-End API Integration Tests
$ npm run test:e2e --workspace=apps/api
Output: 1 passed (1 test file), 1 passed (1 test) in 10.71s (Exit code: 0)

# 8. Frontend Production Build
$ npm run build --workspace=apps/web
Output:
▲ Next.js 16.4.2 (Turbopack)
✓ Compiled successfully in 25.6s
✓ Type checking passed in 6.0s
✓ Generating static pages (21/21) (Exit code: 0)
```

---

## 5. Render Production Deployment Configuration

### 5.1 Service Architecture Overview

Render must run **two distinct Web Services** and one **PostgreSQL Database**:

```
[ User Browser ]
       |
       +---> [ https://ausbildung-web.onrender.com ]  (Next.js Web Service)
       |            |
       |            +---> (Calls REST API via NEXT_PUBLIC_API_URL)
       |
       +---> [ https://ausbildung-api.onrender.com ]  (NestJS Web Service)
                    |
                    +---> [ PostgreSQL 16 ] (Render Managed Database)
```

### 5.2 Backend Web Service Settings (`ausbildung-api`)

| Setting | Value |
| :--- | :--- |
| **Environment** | `Node` |
| **Region** | `Frankfurt (EU Central)` (or preferred closest to learners) |
| **Branch** | `master` |
| **Root Directory** | *(leave empty / repository root)* |
| **Build Command** | `npm install && npm run prisma:generate --workspace=apps/api && npm run build --workspace=apps/api` |
| **Start Command** | `npm run start:prod --workspace=apps/api` |
| **Health Check Path**| `/` (returns HTTP 200 `{ "status": "operational" }`) |
| **Auto-Deploy** | `Yes` |

#### Alternative: If Root Directory is set to `apps/api`
- **Build Command:** `npm install && npx prisma generate && npm run build`
- **Start Command:** `npm run start:prod`
- **Health Check Path:** `/`

### 5.3 Backend Required Environment Variables (Names Only)

> [!CAUTION]
> Never commit actual passwords, private keys, or credentials to Git. Configure these in Render Dashboard -> Web Service -> **Environment**.

| Variable Name | Required | Description / Guidance |
| :--- | :--- | :--- |
| `NODE_ENV` | Yes | Set to `production` |
| `PORT` | Yes | Set to `10000` (Render's default port) |
| `DATABASE_URL` | Yes | PostgreSQL connection string (`postgresql://user:pass@host:5432/ausbildung_portal?sslmode=require`) |
| `JWT_ACCESS_SECRET` | Yes | Strong 64-character random string (e.g., `openssl rand -base64 48`) |
| `JWT_ACCESS_EXPIRES_IN` | Yes | `15m` |
| `JWT_REFRESH_SECRET` | Yes | Strong 64-character random string |
| `JWT_REFRESH_EXPIRES_IN` | Yes | `7d` |
| `COOKIE_SECRET` | Yes | Strong random string for signed session cookies |
| `CORS_ALLOWED_ORIGINS`| Yes | Comma-separated domains: `https://<your-frontend-service>.onrender.com` |
| `RATE_LIMIT_TTL` | Optional | `60000` (default: 60s) |
| `RATE_LIMIT_LIMIT` | Optional | `100` (default: 100 requests per minute) |

### 5.4 Frontend Web Service Settings (`ausbildung-web`)

| Setting | Value |
| :--- | :--- |
| **Environment** | `Node` |
| **Region** | Same region as API |
| **Branch** | `master` |
| **Root Directory** | *(leave empty / repository root)* |
| **Build Command** | `npm install && npm run build --workspace=apps/web` |
| **Start Command** | `npm run start --workspace=apps/web` |
| **Health Check Path**| `/` |

#### Frontend Required Environment Variables
| Variable Name | Required | Description / Guidance |
| :--- | :--- | :--- |
| `NODE_ENV` | Yes | `production` |
| `NEXT_PUBLIC_API_URL` | Yes | Full URL of the backend API with prefix: `https://<your-api-service>.onrender.com/api/v1` |

---

## 6. Safe Step-by-Step Redeployment Protocol

### Step 1: Push Code Changes
Push the verified changes to GitHub:
```bash
git add apps/api package.json render.yaml docs/DEPLOYMENT_TROUBLESHOOTING.md
git commit -m "fix(deployment): resolve prisma generation, strict callback types, and api root routing for Render"
git push origin master
```

### Step 2: Database Schema Synchronization
On fresh or upgraded Render PostgreSQL databases:
1. From Render Dashboard -> `ausbildung-api` -> **Shell**, or via local tunnel with `DATABASE_URL`:
   ```bash
   # Synchronize schema without destructive drops
   npx prisma db push --schema=apps/api/prisma/schema.prisma
   ```
2. If initial seed data (roles, CEFR vocab, initial course categories) is needed:
   ```bash
   npm run seed --workspace=apps/api
   ```

### Step 3: Trigger Service Rebuilds on Render
1. In Render Dashboard, open the backend service (`ausbildung-api`) -> Click **Manual Deploy** -> **Clear build cache & deploy**.
2. Verify in the deployment logs that:
   - `✔ Generated Prisma Client (v6.19.3)` outputs before `nest build`.
   - `nest build` completes successfully with code 0.
   - The application starts with `🚀 Ausbildung Preparation API running on: http://localhost:10000/api/v1`.
3. Open the frontend service (`ausbildung-web`) -> Click **Manual Deploy** -> **Deploy latest commit**.

---

## 7. Verification & Health Probes

Once deployed on Render, execute the following smoke tests:

### 1. API Root Availability Probe
```bash
curl -i https://<your-api-service>.onrender.com/
```
**Expected HTTP Response:**
```http
HTTP/2 200
content-type: application/json; charset=utf-8

{
  "success": true,
  "data": {
    "name": "Ausbildung Preparation Portal API",
    "status": "operational",
    "version": "1.0.0",
    "docs": "/api/v1/docs"
  },
  "meta": {
    "timestamp": "2026-10-22T..."
  }
}
```

### 2. Deep Telemetry & Database Health Probe
```bash
curl -i https://<your-api-service>.onrender.com/api/v1/dashboard/admin/health
```
**Expected HTTP Response:**
```http
HTTP/2 200
{
  "success": true,
  "data": {
    "status": "HEALTHY",
    "database": {
      "status": "UP",
      "latencyMs": 14
    },
    "system": {
      "memoryUsageMb": 112
    }
  }
}
```

### 3. Swagger / OpenAPI Documentation
Open in browser:
```
https://<your-api-service>.onrender.com/api/v1/docs
```
**Expected Outcome:** Renders interactive Swagger UI documentation showing all 10 domain modules and endpoints.

### 4. Frontend-to-Backend Connectivity
1. Navigate to `https://<your-web-service>.onrender.com/` in your browser.
2. Navigate to `/courses` or `/german-learning`.
3. Open browser DevTools Network tab and confirm network requests to `https://<your-api-service>.onrender.com/api/v1/...` succeed with `200 OK` and valid JSON payloads.
