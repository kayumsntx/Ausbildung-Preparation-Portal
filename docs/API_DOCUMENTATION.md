# Ausbildung Preparation Portal — API Documentation & Conventions

## 1. Core API Conventions

### Base URL & Versioning
All backend endpoints are prefixed with the API version:
`https://api.ausbildungportal.de/api/v1` (Production)
`http://localhost:4000/api/v1` (Local Development)

### Uniform Response Envelopes
To ensure high predictability and simplified client consumption across Web, iOS, and Android, all JSON responses adhere to standardized response envelopes.

#### Success Envelope (`200 OK`, `201 Created`)
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-10-18T16:00:00.000Z",
    "correlationId": "req_c9a18f4a-8742-4f05-b1a8-8e6bfa43e061",
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 142,
      "totalPages": 8,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

#### Error Envelope (`400`, `401`, `403`, `404`, `409`, `422`, `429`, `500`)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "The request payload failed schema validation.",
    "details": [
      {
        "field": "email",
        "issue": "must be a valid email address"
      }
    ],
    "timestamp": "2026-10-18T16:00:00.000Z",
    "correlationId": "req_c9a18f4a-8742-4f05-b1a8-8e6bfa43e061"
  }
}
```

---

## 2. Authentication & Authorization Flow
- **Access Tokens:** Short-lived JWTs (15 minutes expiry) passed in the `Authorization: Bearer <token>` header or Secure HttpOnly cookie.
- **Refresh Tokens:** Long-lived cryptographically signed tokens (7 days expiry) stored in HttpOnly, SameSite=Strict cookies with rotation on every refresh.
- **Role Guards:** Roles (`STUDENT`, `INSTRUCTOR`, `MODERATOR`, `ADMIN`) validated by server-side decorators (`@Roles(Role.ADMIN)`).

---

## 3. High-Priority Endpoints Specification

### 3.1 Authentication & Profile (`/auth`, `/users`)
- `POST /api/v1/auth/register` — Create new account with email, password, target field, and optional referral code.
- `POST /api/v1/auth/login` — Authenticate credentials; returns access token and sets refresh cookie.
- `POST /api/v1/auth/refresh` — Rotate refresh token and issue new access token.
- `POST /api/v1/auth/logout` — Revoke active refresh token session.
- `POST /api/v1/auth/verify-email` — Verify email via 6-digit code or secure token.
- `POST /api/v1/auth/forgot-password` — Issue password reset token with anti-enumeration handling.
- `POST /api/v1/auth/reset-password` — Set new password given valid reset token.
- `GET /api/v1/users/me` — Retrieve active authenticated user profile, roles, and settings.
- `PATCH /api/v1/users/me/profile` — Update personal preferences, language, and target vocation.

### 3.2 German Learning Curriculum (`/learning`)
- `GET /api/v1/learning/levels` — List CEFR levels (A1-B2) with completion percentages.
- `GET /api/v1/learning/modules?levelId=:id` — List modules in a level.
- `GET /api/v1/learning/lessons/:slug` — Retrieve lesson content with localized explanations and vocabulary.
- `POST /api/v1/learning/lessons/:id/quiz-attempt` — Submit quiz answers for server-side evaluation.
- `POST /api/v1/learning/lessons/:id/bookmark` — Save vocabulary word or lesson.

### 3.3 Ausbildung Job Search (`/jobs`)
- `GET /api/v1/jobs/search?q=pflege&city=Berlin&page=1` — Live query against cached & normalized jobs.
- `GET /api/v1/jobs/:id` — Retrieve full job details and original Bundesagentur application link.
- `POST /api/v1/jobs/:id/save` — Bookmark job for user.
- `GET /api/v1/jobs/applications` — Fetch user's job application tracking pipeline.
- `POST /api/v1/jobs/applications` — Create tracked application entry with status.
- `PATCH /api/v1/jobs/applications/:id/status` — Transition application status (`PLANNED` -> `APPLIED` -> `INTERVIEW`, etc.).

### 3.4 Speaking Practice & Live Calls (`/speaking`)
- `GET /api/v1/speaking/partners?cefr=B1` — Discover available partners filtered by compatible preferences.
- `POST /api/v1/speaking/requests` — Send call request to target user.
- `POST /api/v1/speaking/requests/:id/accept` — Accept incoming request and initialize WebRTC room.
- `POST /api/v1/speaking/requests/:id/reject` — Decline incoming call request.
- `POST /api/v1/speaking/sessions/:id/token` — Obtain short-lived LiveKit WebRTC access token.
- `POST /api/v1/speaking/sessions/:id/end` — Conclude call session and trigger server-side billing calculation.

### 3.5 Coin Wallet & Referrals (`/wallet`, `/referrals`)
- `GET /api/v1/wallet` — Get current coin balance, reservations, and ledger history.
- `POST /api/v1/wallet/packages/:id/checkout` — Initiate Stripe checkout session for coin package.
- `GET /api/v1/referrals/my-code` — Retrieve user's unique referral link and metrics.
- `GET /api/v1/referrals/history` — Inspect status of referred friends (pending, qualified, rewarded).
- `POST /api/v1/wallet/tasks/:taskCode/claim` — Verify server activity and claim milestone reward coins.

### 3.6 Administration & Moderation (`/admin`)
- `GET /api/v1/admin/users` — Paginated user directory with role assignment and account controls.
- `GET /api/v1/admin/reports` — Moderation queue for speaking complaints and user blocks.
- `POST /api/v1/admin/reports/:id/action` — Warn, suspend, or clear reported user accounts.
- `GET /api/v1/admin/audit-logs` — Immutable audit log explorer.
- `POST /api/v1/admin/wallet/adjust` — Make reason-coded administrative coin adjustment with audit trail.
