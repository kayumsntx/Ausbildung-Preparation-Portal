# Ausbildung Preparation Portal — Comprehensive Testing Strategy

## 1. Multi-Tier Testing Pyramid
To guarantee production reliability, the testing strategy spans unit, integration, concurrency, and end-to-end (E2E) suites.

```
       / \
      / E2E \        Playwright (Critical User Journeys: Onboarding, Call, Job Tracker)
     /-------\
    / Integration \  Supertest + In-Memory/Docker PostgreSQL (API, DB, Transactions, Auth)
   /---------------\
  /   Unit Tests    \ Jest (Business logic, Quiz Scoring, Ledger Math, DTO Validators)
 /-------------------\
```

---

## 2. Test Suites & Tools

| Tier | Primary Framework | Target Scope |
| :--- | :--- | :--- |
| **Unit Tests** | `Jest` | Pure domain logic: CEFR scoring formulas, coin balance calculations, DTO class-validator rules, date formatting, streak algorithms. Fast, zero I/O. |
| **Integration Tests** | `Supertest` + `PrismaClient` | NestJS HTTP Controllers, Prisma queries, transaction rollback verification, JWT lifecycle, RBAC guards, and error filters against a real test PostgreSQL instance. |
| **Financial Concurrency Tests** | Custom Jest workers | Simulates 20 concurrent coin-debit requests against a single wallet balance to verify that pessimistic row-locking prevents double-spending. |
| **E2E Browser Tests** | `Playwright` | Complete multi-step workflows: Registration -> Email Verification -> Level A1 Lesson -> Quiz Submission -> Job Search & Bookmark -> Speaking Call Flow. |
| **Static Analysis** | `ESLint`, `TypeScript (tsc)`, `Prettier` | Type correctness (`noImplicitAny`), linting best practices, unused code detection, formatting consistency across monorepo. |

---

## 3. Mocking & Provider Isolation
Production code abstracts external APIs behind clear interfaces. During testing:
1. **Jobsuche API:** Handled by `MockJobsucheAdapter` returning fixture JSON with real Bundesagentur schema payloads without consuming network quotas.
2. **Stripe Payments:** Handled by Stripe test mode or mock webhook generators simulating signature validation and events (`checkout.session.completed`, `payment_intent.payment_failed`).
3. **LiveKit WebRTC:** Handled by `MockWebRTCService` generating valid synthetic tokens without connecting to external cloud infrastructure.
4. **Email Dispatch:** Handled by a local in-memory mailer or Mailhog capturing verification links and tokens.

---

## 4. Verification Checkpoints for Each Development Phase
Before declaring any phase complete:
1. `npm run lint` passes across all packages with zero errors.
2. `npm run test` executes unit tests and passes 100%.
3. `npm run test:e2e` verifies integration and critical user paths.
4. `npm run build` succeeds cleanly for both `apps/web` and `apps/api`.
