# Ausbildung Preparation Portal — Database Design

## 1. Overview and Relational Strategy
The database is built on **PostgreSQL** managed through **Prisma ORM**. PostgreSQL was selected for:
- ACID compliance and reliable multi-table transactions for financial/coin operations.
- Strong support for relational integrity (foreign keys, check constraints, unique composite indexes).
- Native JSONB capabilities for extensible structured fields (e.g., localized text fallback maps, external job metadata).
- Robust concurrency management through row-level locking (`SELECT FOR UPDATE`).

---

## 2. Logical Entity Groupings

### Group A: Identity, Authentication & Security
- `users`: Core identity credentials, status (`ACTIVE`, `PENDING_VERIFICATION`, `SUSPENDED`), email, hashed password.
- `roles`: Role definitions (`STUDENT`, `INSTRUCTOR`, `MODERATOR`, `ADMIN`).
- `user_roles`: Many-to-many relationship mapping users to roles.
- `user_profiles`: User biographical data, target Ausbildung field, preferred language (`bn`, `en`, `de`), avatar URL.
- `refresh_tokens`: Cryptographically hashed refresh tokens with client fingerprint, IP, expiry, and revocation flags.
- `email_verification_tokens`: Single-use tokens with short TTL (24 hours).
- `password_reset_tokens`: Single-use tokens with short TTL (1 hour).
- `audit_logs`: Immutable security log tracking IP, user agent, actor, action, target entity, timestamp, and changes.

### Group B: German Learning Curriculum
- `learning_levels`: CEFR levels (`A1`, `A2`, `B1`, `B2`).
- `learning_modules`: Thematic learning units within a level (e.g., "Alltag & Beruf", "Wohnen", "Gesundheit").
- `lessons`: Ordered instructional units with audio/text assets and estimated completion time.
- `lesson_translations`: Localized lesson texts in Bengali, English, and German.
- `vocabulary_items`: German words, IPA pronunciation, audio URLs, part of speech, grammatical gender (`der`, `die`, `das`), example sentences, and translations.
- `exercises`: Interactive exercises (reading, listening, fill-in-the-blank, sentence ordering).
- `quiz_questions`: Formative and summative assessment questions.
- `quiz_options`: Distractors and correct answers for questions.
- `quiz_attempts`: User quiz session history with server-calculated scores and elapsed time.
- `lesson_progress`: User progression tracking completion percentage, streaks, and completion dates.
- `user_bookmarks`: User-saved vocabulary items and lesson references for quick revision.

### Group C: Job Search & Application Tracker
- `job_sources`: Registry of authorized providers (e.g., Bundesagentur für Arbeit Jobsuche API).
- `job_listings`: Normalized job vacancies with external ID, employer, location, postal code, Ausbildung category, description, and source URL.
- `saved_jobs`: User bookmarks for job postings.
- `saved_searches`: User-defined search criteria with notification toggles.
- `job_search_alerts`: Periodic alert dispatch configurations.
- `job_applications`: User application tracker with stages (`PLANNED`, `APPLIED`, `INTERVIEW`, `OFFER`, `REJECTED`, `WITHDRAWN`), interview dates, contact notes, and salary details.
- `application_status_history`: Historical transition log of application stages for analytics and timelines.
- `job_provider_sync_logs`: Diagnostic log recording sync runs, records fetched, errors, and latency.

### Group D: LMS Courses & Paid Educational Programs
- `instructors`: Verified course instructors, credentials, bio, and social links.
- `courses`: High-level specialized courses (e.g., "B2 Medical German for Nursing Ausbildung").
- `course_modules`: Structured sections within a course.
- `course_lessons`: Lessons containing video links, downloadable resources, and quizzes.
- `course_enrollments`: User enrollment records with completion status and expiry.
- `certificates`: Digitally verifiable completion certificates with unique serial hashes.
- `orders`: Purchase orders for paid courses or coin packages.
- `payments`: Financial payment records linked to Stripe intents with status (`PENDING`, `COMPLETED`, `FAILED`, `REFUNDED`).
- `payment_webhook_events`: Idempotency registry for raw payment provider webhooks.

### Group E: Application Toolkit (CV, Cover Letter & Documents)
- `cv_profiles`: Root applicant profile data for generating standard German Bewerbungen.
- `cv_versions`: Distinct CV versions tailored for specific vocations (e.g., IT vs Pflegefachmann).
- `cover_letters`: Anschreiben templates and personalized letters adhering to DIN 5008 formatting.
- `user_documents`: Secure metadata registry for uploaded certificates, school transcripts, and passport scans (stored in private S3/MinIO).
- `study_plans`: Personal German and Ausbildung preparation study roadmaps with deadlines.

### Group F: Speaking Practice & Realtime Communication
- `speaking_profiles`: User speaking practice setup (CEFR level, topics, audio/video readiness, matching enabled flag).
- `speaking_preferences`: Granular consent matching: incoming and outgoing preferences (male, female, any, none), practice languages.
- `call_requests`: Bidirectional call negotiation (`PENDING`, `ACCEPTED`, `REJECTED`, `EXPIRED`, `CANCELED`).
- `call_sessions`: Active and historical WebRTC room sessions with provider room ID, duration, and participant IDs.
- `call_usage_records`: Usage accounting records with start time, end time, billable seconds, and coin charges.
- `user_blocks`: Bidirectional blocking list preventing discovery, matching, and messaging.
- `user_reports`: User abuse reports with reason categories, details, and moderation queue status.

### Group G: Coin Economy, Ledger & Referrals
- `coin_wallets`: User balance records storing available coins and reserved coins as exact integers.
- `coin_transactions`: Immutable double-entry ledger records (`CREDIT`, `DEBIT`, `RESERVATION`, `RELEASE`, `REFUND`) with idempotency keys and audit trails.
- `coin_packages`: Preconfigured bundles for purchasing coins via supported payment gateways.
- `coin_reservations`: Temporary coin holds during active premium speaking calls.
- `reward_tasks`: Admin-configured tasks (e.g., "Complete A1 Level", "Pass 5 Quizzes", "30-Day Streak") with coin reward amounts and limits.
- `user_task_completions`: Server-verified proof of task completion.
- `referral_codes`: Unique referral handles generated per user.
- `referral_events`: Attribution and verification workflow tracking referral sign-ups through verification and qualifying milestones.

---

## 3. Financial Invariants & Data Integrity Rules
1. **Never Float:** All currency and coin amounts are stored as 64-bit integers (`BIGINT`). For EUR, amounts are in cents (`1000` = €10.00). Coins are discrete whole units.
2. **Immutable Ledger:** Records in `coin_transactions` and `audit_logs` are write-once, append-only. Compensating transactions are created for reversals or adjustments.
3. **Optimistic & Pessimistic Concurrency:** High-concurrency wallet updates use database transactions with `SELECT ... FOR UPDATE` row locks to prevent race conditions or double-spending.
4. **Idempotency Keys:** All financial endpoints and webhook consumers require an `idempotency_key` unique constraint to safely handle network retries without duplicate records.
5. **Cascading Safety:** Critical business entities (orders, payments, audit logs, coin transactions) never have `ON DELETE CASCADE` from user accounts. Soft deletes or anonymization (`is_deleted`, `deleted_at`) preserve financial history and legal compliance.
