# Ausbildung Preparation Portal (Vorbereitungsportal)

A production-grade, secure, multilingual web platform designed to prepare international candidates (from Bangladesh, South Asia, and worldwide) for vocational training (*Ausbildung*) opportunities in Germany.

The platform provides an end-to-end preparation journey: German language learning (A1–B2), live job searching via official German employment APIs, application pipeline tracking, professional DIN 5008 CV builder, peer speaking practice over WebRTC, and a fraud-resistant virtual coin rewards system.

---

## 🛠️ Technology Stack

| Domain | Technology | Justification |
| :--- | :--- | :--- |
| **Frontend** | [Next.js](https://nextjs.org/) (App Router, TypeScript) | High performance SSR/SSG, SEO metadata, rich DX, responsive layouts. |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Rapid, consistent design system implementation with dark/light mode support. |
| **Backend** | [NestJS](https://nestjs.org/) (TypeScript) | Modular monolith architecture, dependency injection, enterprise structure. |
| **API Architecture** | REST (`/api/v1`) with Swagger/OpenAPI | Strict DTO validation, correlation IDs, prepared for future Flutter/React Native mobile apps. |
| **Database & ORM** | [PostgreSQL](https://www.postgresql.org/) + [Prisma ORM](https://www.prisma.io/) | ACID reliability, relational integrity, transactional ledger accounting. |
| **Realtime WebRTC** | [LiveKit](https://livekit.io/) | Managed SFU media router, cross-platform SDKs (Web, iOS, Android, Flutter). |
| **Object Storage** | S3-Compatible (MinIO local / AWS S3 / R2 prod) | Private, encrypted document storage with pre-signed short-lived URLs. |
| **Testing** | Jest, Supertest, Playwright | Unit tests, API integration tests, E2E browser automation. |

---

## 📁 Repository Structure

```
ausbildung-preparation-portal/
├── apps/
│   ├── web/                     # Next.js 15+ frontend application
│   └── api/                     # NestJS backend modular monolith
├── packages/
│   ├── shared-types/            # Shared TypeScript API models and DTO interfaces
│   └── shared-config/           # Shared ESLint, Prettier, and TSConfig rules
├── docs/                        # Comprehensive architectural specifications
│   ├── PROJECT_OVERVIEW.md      # Functional & non-functional requirements
│   ├── ARCHITECTURE.md          # Modular monolith & layered boundaries
│   ├── DATABASE_DESIGN.md       # Relational design, tables, constraints
│   ├── ERD.md                   # Mermaid ER diagrams for all domains
│   ├── API_DOCUMENTATION.md     # REST conventions, envelopes, endpoints
│   ├── SECURITY.md              # STRIDE threat model & mitigations
│   ├── DEPLOYMENT.md            # Environments, hosting, backups, cost checklist
│   ├── TESTING.md               # Unit, integration, concurrency, E2E strategy
│   └── DEVELOPMENT_ROADMAP.md   # Phased delivery plan & milestones
├── infrastructure/
│   └── docker/                  # Dockerfiles and container configurations
├── scripts/                     # Seeders and migration automation utilities
├── .github/
│   └── workflows/ci.yml         # CI workflow for lint, test, and build
├── .env.example                 # Environment configuration template
├── .gitignore                   # Version control exclusion rules
├── docker-compose.yml           # Local development stack (Postgres, Redis, MinIO)
├── package.json                 # Monorepo workspaces manifest
└── README.md                    # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** `v20.0.0` or higher (verified on Node `v24.15.0`)
- **npm:** `v10.0.0` or higher (verified on npm `11.12.1`)
- **Docker & Docker Compose:** Optional for running local PostgreSQL, Redis, and MinIO.

### 1. Environment Configuration
Copy the configuration template:
```bash
cp .env.example .env
```

### 2. Start Local Infrastructure (Docker)
```bash
docker compose up -d
```
This launches:
- PostgreSQL on port `5432`
- Redis on port `6379`
- MinIO Object Storage on ports `9000` (API) & `9001` (Console)
- MailHog email sandbox on port `8025`

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Servers
```bash
# Run both web and API simultaneously:
npm run dev

# Or run individual applications:
npm run dev:web    # Next.js web application on http://localhost:3000
npm run dev:api    # NestJS API application on http://localhost:4000
```

---

## 📚 Architectural Documentation Index
- 📑 [Project Overview & Requirements](file:///H:/Ausbildung/docs/PROJECT_OVERVIEW.md)
- 🏗️ [System Architecture & Boundaries](file:///H:/Ausbildung/docs/ARCHITECTURE.md)
- 🗄️ [Database Design & Integrity Rules](file:///H:/Ausbildung/docs/DATABASE_DESIGN.md)
- 📊 [Entity-Relationship Diagrams (ERD)](file:///H:/Ausbildung/docs/ERD.md)
- 🔌 [API Conventions & Endpoints](file:///H:/Ausbildung/docs/API_DOCUMENTATION.md)
- 🛡️ [Security Threat Model & Defense](file:///H:/Ausbildung/docs/SECURITY.md)
- 🧪 [Testing & Quality Assurance](file:///H:/Ausbildung/docs/TESTING.md)
- 🚢 [Deployment & Cost Checklist](file:///H:/Ausbildung/docs/DEPLOYMENT.md)
- 🗺️ [Development Roadmap](file:///H:/Ausbildung/docs/DEVELOPMENT_ROADMAP.md)

---

## 📌 Implementation Status
- [x] **Phase 0:** Project Audit, Architecture & Invariants Completed.
- [x] **Phase 1:** Foundation, Design System, and Public Website Completed.
- [x] **Phase 2:** Database, Authentication, and User Security Completed.
- [ ] **Phase 3:** Multilingual German Learning Platform *(Next Phase)*.
- [ ] **Phase 4:** Live Ausbildung Job Search & Application Tracker.
- [ ] **Phase 5:** Free and Paid Courses LMS.
- [ ] **Phase 6:** CV, Cover Letter & Application Toolkit.
- [ ] **Phase 7:** Speaking Partners & Audio/Video WebRTC Calls.
- [ ] **Phase 8:** Coin Wallet, Rewards, Tasks & Referrals.
- [ ] **Phase 9:** Unified Dashboards & Administration.
- [ ] **Phase 10:** Security, Quality & Performance Hardening.
- [ ] **Phase 11:** Deployment, Operations & Future Mobile App Readiness.
