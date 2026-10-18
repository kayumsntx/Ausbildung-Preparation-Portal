# Ausbildung Preparation Portal — Security Threat Model & Defense Strategy

## 1. Security Principles
The platform manages sensitive candidate data (identity credentials, passports, academic transcripts, CVs, job applications) and a virtual coin currency. Security is incorporated at every layer using Defense-in-Depth.

---

## 2. STRIDE Threat Analysis & Concrete Mitigations

| Threat Category | Specific Attack Vector | Architectural & Code Mitigation |
| :--- | :--- | :--- |
| **Spoofing Identity** | Fake accounts, credential stuffing, brute-forcing login endpoints. | Rate limiting via Redis (`express-rate-limit` / `@nestjs/throttler`), Argon2id password hashing, progressive account lockout delay, mandatory email verification before full access. |
| **Tampering with Data** | Manipulating quiz scores, claiming unearned coin rewards, editing another user's CV. | All scoring occurs exclusively on the backend. Ledger balances are immutable and updated only inside database transactions with row-level locks. Strict resource ownership validation (`user_id == req.user.id`). |
| **Repudiation** | Denying initiating a call, purchasing coins, or modifying admin permissions. | Structured, append-only `audit_logs` storing actor ID, action, target entity, timestamp, IP address, and user-agent. Cryptographic verification of payment provider webhooks. |
| **Information Disclosure** | Exposing private CV documents, passports, or email addresses in API listings. | S3 buckets remain 100% private. Files are accessed only via short-lived pre-signed URLs (valid for 5 minutes). REST list endpoints strip PII. Error responses never leak stack traces or raw database queries. |
| **Denial of Service (DoS)** | Exhausting backend resources via repeated job API calls or spam call invitations. | Server-side caching for job queries. Throttling of call invitation dispatches (e.g., maximum 5 outgoing invites in 10 minutes). Global rate-limiting per IP and user ID. |
| **Elevation of Privilege** | Normal user calling `/api/v1/admin/*` or altering their own role in a profile update. | NestJS `RolesGuard` applied across all sensitive endpoints. DTOs enforce strict whitelisting (`whitelist: true, forbidNonWhitelisted: true`) preventing parameter injection. |

---

## 3. High-Risk Vulnerabilities & Architectural Defenses

### 3.1 Financial Race Conditions & Double-Spending
- **Risk:** A user opens multiple concurrent browser tabs and triggers simultaneous coin-spending actions (e.g., calling or purchasing) before the balance decrements.
- **Defense:**
  1. All balance-changing routines execute within a PostgreSQL transaction with pessimistic row-locking (`SELECT ... FOR UPDATE` on the user's `coin_wallets` row).
  2. Balances cannot be negative: `CHECK (available_balance >= 0)`.
  3. Every transaction demands an `idempotency_key` unique constraint.

### 3.2 Insecure Direct Object References (IDOR / BOLA)
- **Risk:** An authenticated student manipulates `/api/v1/toolkit/cvs/:id` or `/api/v1/jobs/applications/:id` with another user's UUID.
- **Defense:**
  1. Every data query explicitly joins the authenticated user's ID:
     `where: { id: resourceId, userId: req.user.id }`.
  2. If the entity exists but belongs to another user, return `404 Not Found` or `403 Forbidden` consistently without revealing existence.

### 3.3 Server-Side Request Forgery (SSRF)
- **Risk:** External job synchronization or resume parsing accepts arbitrary URLs, allowing an attacker to probe internal microservices, AWS metadata (`169.254.169.254`), or localhost.
- **Defense:**
  1. Job synchronization only fetches from strict, hardcoded provider base URLs (e.g., `https://rest.arbeitsagentur.de`).
  2. User-submitted URLs are strictly validated using allowed URL schemes (`https:` only) and forbidden from loopback or internal RFC1918 CIDR blocks.

### 3.4 WebRTC Room Hijacking & Eavesdropping
- **Risk:** An uninvited user guesses a room ID and listens in on a private language practice session.
- **Defense:**
  1. LiveKit room tokens are generated dynamically on the backend with 15-minute expirations.
  2. Token generation grants permission strictly to the verified caller and receiver IDs registered in the `call_sessions` table.
  3. Rooms default to end automatically when participants leave.

---

## 4. Privacy & GDPR Compliance
- **Data Minimization:** WebRTC calls are not recorded by default. Audio/video media streams are routed ephemerally through the SFU without persistent server disk storage.
- **Right to Erasure (Account Deletion):** When an account is deleted, personal profile data, CVs, and private documents are removed. Financial transaction ledger lines retain anonymized records to satisfy statutory tax/bookkeeping requirements.
- **Document Vault Security:** Uploaded files undergo magic-number (MIME) validation, size limits (max 10MB), and virus scanning where supported. Filenames are replaced with randomized UUIDs to prevent directory traversal (`../../etc/passwd`).
