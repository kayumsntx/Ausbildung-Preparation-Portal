# Ausbildung Preparation Portal — Entity-Relationship Diagrams (ERD)

## 1. Identity, Authentication & Security ERD

```mermaid
erDiagram
    users ||--o{ user_roles : has
    roles ||--o{ user_roles : assigned_to
    users ||--|| user_profiles : possesses
    users ||--o{ refresh_tokens : owns
    users ||--o{ email_verification_tokens : receives
    users ||--o{ password_reset_tokens : requests
    users ||--o{ audit_logs : generates

    users {
        uuid id PK
        string email UK
        string password_hash
        string status "ACTIVE | PENDING | SUSPENDED"
        boolean email_verified
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    roles {
        uuid id PK
        string name UK "STUDENT | INSTRUCTOR | MODERATOR | ADMIN"
        string description
    }

    user_roles {
        uuid user_id FK
        uuid role_id FK
        datetime assigned_at
    }

    user_profiles {
        uuid id PK
        uuid user_id FK, UK
        string first_name
        string last_name
        string preferred_language "bn | en | de"
        string target_ausbildung_field
        string phone_number
        string avatar_url
        datetime updated_at
    }

    refresh_tokens {
        uuid id PK
        uuid user_id FK
        string token_hash UK
        string client_ip
        string user_agent
        datetime expires_at
        boolean is_revoked
        datetime created_at
    }

    audit_logs {
        uuid id PK
        uuid actor_id FK "nullable"
        string action
        string target_entity
        uuid target_id
        jsonb details
        string ip_address
        datetime created_at
    }
```

---

## 2. German Learning Curriculum ERD

```mermaid
erDiagram
    learning_levels ||--o{ learning_modules : contains
    learning_modules ||--o{ lessons : organizes
    lessons ||--o{ lesson_translations : translated_in
    lessons ||--o{ exercises : includes
    lessons ||--o{ quiz_questions : contains
    quiz_questions ||--o{ quiz_options : provides
    lessons ||--o{ lesson_progress : tracks
    users ||--o{ lesson_progress : achieves
    quiz_questions ||--o{ quiz_answers : receives
    quiz_attempts ||--o{ quiz_answers : records
    users ||--o{ quiz_attempts : submits
    lessons ||--o{ vocabulary_items : references
    users ||--o{ user_bookmarks : saves

    learning_levels {
        uuid id PK
        string code UK "A1 | A2 | B1 | B2"
        string title
        int sequence_order
    }

    learning_modules {
        uuid id PK
        uuid level_id FK
        string title
        int sequence_order
    }

    lessons {
        uuid id PK
        uuid module_id FK
        string slug UK
        string title_de
        text grammar_notes
        int estimated_minutes
        int coin_reward
    }

    lesson_translations {
        uuid id PK
        uuid lesson_id FK
        string language_code "bn | en | de"
        string translated_title
        text translated_summary
        jsonb localized_content
    }

    vocabulary_items {
        uuid id PK
        uuid lesson_id FK "nullable"
        string german_word
        string article "der | die | das | none"
        string plural_form
        string ipa_pronunciation
        string audio_url
        jsonb translations "bn, en"
        text example_sentence_de
        text example_sentence_translation
    }

    lesson_progress {
        uuid id PK
        uuid user_id FK
        uuid lesson_id FK
        boolean is_completed
        int score_percentage
        datetime completed_at
    }

    quiz_attempts {
        uuid id PK
        uuid user_id FK
        uuid lesson_id FK
        int total_questions
        int correct_answers
        int score_percentage
        boolean passed
        datetime created_at
    }
```

---

## 3. Job Search & Application Tracker ERD

```mermaid
erDiagram
    job_sources ||--o{ job_listings : provides
    job_listings ||--o{ saved_jobs : bookmarked_by
    users ||--o{ saved_jobs : saves
    users ||--o{ saved_searches : configures
    users ||--o{ job_applications : manages
    job_applications ||--o{ application_status_history : tracks

    job_sources {
        uuid id PK
        string provider_key UK "BUNDESAGENTUR_ARBEIT"
        string name
        string base_url
        boolean is_active
    }

    job_listings {
        uuid id PK
        uuid source_id FK
        string external_id
        string title
        string employer_name
        string city
        string postal_code
        string state
        string occupation_category
        text description
        string external_url
        datetime published_at
        datetime expires_at
        boolean is_active
    }

    saved_jobs {
        uuid id PK
        uuid user_id FK
        uuid job_listing_id FK
        datetime saved_at
    }

    job_applications {
        uuid id PK
        uuid user_id FK
        uuid job_listing_id FK "nullable"
        string company_name
        string job_title
        string current_status "PLANNED | APPLIED | INTERVIEW | OFFER | REJECTED | WITHDRAWN"
        datetime applied_date
        datetime interview_date
        text notes
        datetime updated_at
    }

    application_status_history {
        uuid id PK
        uuid application_id FK
        string from_status
        string to_status
        text transition_notes
        datetime changed_at
    }
```

---

## 4. Speaking Practice & WebRTC Session ERD

```mermaid
erDiagram
    users ||--|| speaking_profiles : configures
    speaking_profiles ||--|| speaking_preferences : defines
    users ||--o{ call_requests : initiates_or_receives
    call_requests ||--o| call_sessions : spawns
    call_sessions ||--o{ call_usage_records : accounts_for
    users ||--o{ user_blocks : blocks
    users ||--o{ user_reports : reports

    speaking_profiles {
        uuid id PK
        uuid user_id FK, UK
        string cefr_level "A1 | A2 | B1 | B2 | C1"
        string native_language
        string practice_topics
        boolean audio_enabled
        boolean video_enabled
        boolean is_available
    }

    speaking_preferences {
        uuid id PK
        uuid profile_id FK, UK
        string outgoing_gender_pref "MALE | FEMALE | ANY"
        string incoming_gender_pref "MALE | FEMALE | ANY | NOBODY"
        string user_declared_gender "MALE | FEMALE | PREFER_NOT_TO_SAY"
    }

    call_requests {
        uuid id PK
        uuid caller_id FK
        uuid receiver_id FK
        string status "PENDING | ACCEPTED | REJECTED | EXPIRED | CANCELED"
        datetime expires_at
        datetime created_at
    }

    call_sessions {
        uuid id PK
        uuid call_request_id FK, UK
        string provider_room_id
        uuid caller_id FK
        uuid receiver_id FK
        datetime started_at
        datetime ended_at
        int duration_seconds
        string termination_reason
    }

    call_usage_records {
        uuid id PK
        uuid session_id FK
        uuid billed_user_id FK
        int billable_seconds
        int coins_debited
        datetime billed_at
    }
```

---

## 5. Coin Economy, Ledger & Referrals ERD

```mermaid
erDiagram
    users ||--|| coin_wallets : holds
    coin_wallets ||--o{ coin_transactions : records
    coin_wallets ||--o{ coin_reservations : reserves
    users ||--o{ user_task_completions : completes
    reward_tasks ||--o{ user_task_completions : verifies
    users ||--|| referral_codes : owns
    referral_codes ||--o{ referral_events : attributes

    coin_wallets {
        uuid id PK
        uuid user_id FK, UK
        bigint available_balance
        bigint reserved_balance
        int version "Optimistic Locking"
        datetime updated_at
    }

    coin_transactions {
        uuid id PK
        uuid wallet_id FK
        string transaction_type "CREDIT | DEBIT | RESERVATION | RELEASE | REFUND"
        bigint amount
        bigint balance_after
        string idempotency_key UK
        string reference_type "TASK | REFERRAL | CALL | PURCHASE | ADMIN_ADJUSTMENT"
        uuid reference_id
        text description
        datetime created_at
    }

    reward_tasks {
        uuid id PK
        string code UK "COMPLETE_A1_LEVEL | PASS_10_QUIZZES"
        string title
        bigint reward_coins
        boolean is_repeatable
        int daily_limit
        boolean is_active
    }

    referral_codes {
        uuid id PK
        uuid user_id FK, UK
        string code UK
        int successful_referrals_count
        datetime created_at
    }

    referral_events {
        uuid id PK
        uuid referral_code_id FK
        uuid referred_user_id FK, UK
        string status "PENDING | QUALIFIED | REJECTED"
        string rejection_reason
        datetime qualified_at
        datetime created_at
    }
```
