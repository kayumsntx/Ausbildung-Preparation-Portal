# Ausbildung Preparation Portal — Deployment & Operations Strategy

## 1. Hosting Architecture & Environments

### Environment Tiers
1. **Local Development:**
   - Next.js Web: `http://localhost:3000`
   - NestJS API: `http://localhost:4000`
   - PostgreSQL & Redis: Local Docker Compose services
   - Storage: Local MinIO or file system
   - Email: Mailhog (`http://localhost:8025`)
2. **Staging Environment:**
   - Isolated staging database with sanitized seed data
   - Production-identical runtime container configuration
   - Stripe in Test Mode, LiveKit Cloud in Development Project
3. **Production Environment:**
   - Frontend: Edge-distributed Next.js hosting (e.g., Vercel or AWS Amplify / Cloudflare Pages)
   - Backend: Containerized NestJS API on managed container platform (e.g., Railway, Render, or AWS ECS/Fargate)
   - Database: High-availability managed PostgreSQL with automated point-in-time recovery (PITR) (e.g., Neon, Supabase, or AWS RDS PostgreSQL)
   - Object Storage: Encrypted AWS S3 or Cloudflare R2 bucket
   - Realtime: LiveKit Cloud managed WebRTC SFU

---

## 2. External Service & Cost Checklist

| Service | Provider Option | Free Tier / Dev Cost | Production Pricing Note | Approval Status |
| :--- | :--- | :--- | :--- | :--- |
| **Relational Database** | Managed PostgreSQL (Neon / Supabase / AWS RDS) | Free tier available (0.5GB - 1GB) | Scales by compute & storage ($10 - $35/mo) | Free tier during dev |
| **Object Storage** | Cloudflare R2 / AWS S3 | R2: 10GB free / month; Zero egress fees | Standard S3 storage rates ($0.015/GB/mo) | Free tier during dev |
| **WebRTC Audio/Video** | LiveKit Cloud | 50 GB free bandwidth / month (~1,000 video mins) | $0.004 per participant minute thereafter | Free tier during dev |
| **Job Data Provider** | Bundesagentur für Arbeit (Jobsuche API) | Free public government developer API | Free subject to acceptable use policy & rate limits | Free (api.bund.dev) |
| **Payment Gateway** | Stripe | Free account & sandbox test mode | 1.4% + €0.25 for European cards, 2.9% + €0.30 international | Test mode during dev |
| **Transactional Email** | Resend / AWS SES / Mailgun | 100 - 3,000 emails/month free | $0.10 per 1,000 emails thereafter | Mailhog / sandbox dev |

> [!IMPORTANT]
> No paid subscriptions, commercial API keys, or billable infrastructure will be purchased without explicit user approval. All development and testing will utilize free tiers, test keys, and mock adapters.

---

## 3. Database Backup & Disaster Recovery
- **Daily Automated Backups:** Managed PostgreSQL automated snapshots retained for 30 days.
- **Point-in-Time Recovery (PITR):** WAL archiving enabling restoration to any millisecond within the past 7 days.
- **Manual Backup Command:**
  ```bash
  pg_dump -h <HOST> -U <USER> -d ausbildung_portal -F c -b -v -f backup_$(date +%Y%m%d_%H%M%S).dump
  ```
- **Restoration Validation:** Backups must be tested quarterly by restoring into an ephemeral staging database and validating foreign key integrity and user balances.

---

## 4. CI/CD Pipeline (`.github/workflows/ci.yml`)
The GitHub Actions workflow automates quality enforcement on every pull request:
1. **Lint & Format:** Runs `eslint` and `prettier --check`.
2. **Type Check:** Runs `tsc --noEmit` across `apps/web` and `apps/api`.
3. **Automated Unit & Integration Tests:** Executes Jest test runner with code coverage reporting.
4. **Production Build Validation:** Verifies that both frontend and backend build without compilation errors.
