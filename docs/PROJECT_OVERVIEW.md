# Ausbildung Preparation Portal — Project Overview & Requirements

## 1. Executive Summary
The **Ausbildung Preparation Portal** is a production-oriented, secure, multilingual platform engineered to guide aspiring apprentices—predominantly international candidates from South Asia (such as Bangladesh) and global applicants—through the rigorous path of securing an *Ausbildung* (vocational training contract) in Germany.

Securing an Ausbildung requires passing several key milestones:
1. Achieving proven German language competency (CEFR levels A1 through B2).
2. Discovering live, verified apprenticeship openings across Germany.
3. Preparing professional German-standard application packages (Lebenslauf/CV, Anschreiben/Cover Letter, and certified translations).
4. Practicing live verbal communication with peer learners and native speakers to build speaking confidence.
5. Tracking applications systematically across company portals.
6. Maintaining high motivation through structured milestone achievements and a fraud-resistant virtual coin rewards system.

## 2. Core Modules
| Module | Scope & Responsibility |
| :--- | :--- |
| **01. Identity & Access** | Registration, credential validation, email verification, password reset, session/refresh tokens, RBAC (`STUDENT`, `INSTRUCTOR`, `MODERATOR`, `ADMIN`). |
| **02. Localization** | Trilingual interface & educational localization: Bengali (বাংলা), English, and German (Deutsch). |
| **03. German Learning** | Structured curricula covering A1, A2, B1, and B2. Vocabulary, grammar explanations, reading/listening/writing exercises, quizzes with server-verified scoring. |
| **04. Live Job Search** | Real-time connection to German Federal Employment Agency (*Bundesagentur für Arbeit*) via Jobsuche API. Search, filters, deduplication, alert subscriptions, and application tracker. |
| **05. Course Marketplace** | Free and paid specialist preparation courses, instructor profiles, enrollments, video/PDF resources, and certificates. |
| **06. Application Toolkit** | Multi-version German CV builder (DIN 5008-aligned), cover letter generator, secure private document vault, study planner, and checklists. |
| **07. Speaking & Calls** | Peer speaking matching with granular safety/privacy controls, gender call preferences, managed WebRTC audio/video calls, and usage accounting. |
| **08. Virtual Coins & Referrals** | Double-entry ledger wallet, milestone task rewards, anti-fraud referral engine, and coin package purchases. |
| **09. Dashboards & Administration** | User progress dashboard, moderation queues, course management, audit logs, and fraud signal analytics. |
| **10. Versioned Mobile-Ready API** | REST API under `/api/v1` ready for future Flutter or React Native mobile applications without altering business logic. |

## 3. Functional Requirements (FR)
- **FR-01 (Authentication & RBAC):** Secure sign-up, email verification with time-limited tokens, credential login with rate-limiting, role-based guard enforcement on every endpoint.
- **FR-02 (Localization):** High-quality native i18n support for Bengali, English, and German. Content translations managed dynamically in database with safe fallbacks.
- **FR-03 (German Learning):** Interactive lesson progression where progress and quiz submissions are scored and recorded server-side; streak tracking and bookmarking.
- **FR-04 (Ausbildung Jobs):** Query live vacancies from official German employment APIs, cache safely, normalize schema, alert users upon new matching openings.
- **FR-05 (Application Lifecycle):** Allow users to track applications through states: `PLANNED` -> `APPLIED` -> `INTERVIEW` -> `OFFER` -> `REJECTED` -> `WITHDRAWN`.
- **FR-06 (Application Toolkit):** Interactive CV builder generating PDF outputs adhering to German Bewerbungsunterlagen standards; secure encrypted private storage for documents.
- **FR-07 (Speaking Practice):** User-configured speaking partner discovery, bidirectional consent request protocol, server-side preference validation, managed WebRTC session signaling, audio/video room token issuance.
- **FR-08 (Coin Economy & Ledger):** Immutable transaction ledger with integer units, atomic balance checks, reservation mechanisms for billable speaking time, and fraud-resistant referral triggers.
- **FR-09 (Admin & Moderation):** User blocking, reporting with review queues, rate-limiting spam invitations, and content management.

## 4. Non-Functional Requirements (NFR)
- **NFR-01 (Security & Data Protection):** GDPR compliant. User documents (passports, certificates, CVs) stored in private object storage with short-lived signed URLs. Zero plaintext credentials.
- **NFR-02 (Financial Integrity):** Strict double-entry ledger bookkeeping. Concurrency-safe updates via database transaction locking (`SELECT ... FOR UPDATE` or serializable isolation). Zero floating-point arithmetic.
- **NFR-03 (Performance & Scalability):** P95 API response times under 150ms for cached/indexed endpoints. Sub-second live job searches. Lazy loading and optimized Next.js SSR/SSG.
- **NFR-04 (Availability & Resilience):** Modular monolith designed with clean domain boundaries. External provider failures (e.g., job API, payment gateway, WebRTC) must degrade gracefully with user-friendly diagnostics and circuit-breakers.
- **NFR-05 (Accessibility & Usability):** WCAG 2.1 AA compliance, keyboard navigation, high contrast modes, screen-reader friendly semantic HTML, and mobile-first responsiveness.
- **NFR-06 (Mobile Readiness):** Every core business capability exposed as a decoupled, stateless, versioned REST endpoint (`/api/v1`) consuming and producing JSON.
