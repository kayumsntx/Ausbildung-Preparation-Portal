# Ausbildung Preparation Portal — Deployment, Operations & Production Staging Runbook

## 1. Hosting Architecture & Environment Strategy

```
                                      [ Cloudflare Edge / DNS / CDN ]
                                                    |
                           +------------------------+------------------------+
                           |                                                 |
                 [ HTTPS Port 443 ]                                [ HTTPS Port 443 ]
                           |                                                 |
                           v                                                 v
             [ Next.js 16 Web Application ]                    [ NestJS 12 REST API Backend ]
             (Standalone SSR, Edge Cached)                     (Rate-Limited, Helmet, Auth)
                           |                                                 |
                           |                               +-----------------+-----------------+
                           |                               |                 |                 |
                           v                               v                 v                 v
                 [ User Browser / Client ]          [ PostgreSQL 16 ]    [ Redis 7 ]    [ S3 / MinIO Vault ]
```

---

## 2. Production Container Orchestration (`docker-compose.prod.yml`)

The platform is containerized using multi-stage production Dockerfiles located at:
- Backend: [`apps/api/Dockerfile`](../apps/api/Dockerfile)
- Frontend: [`apps/web/Dockerfile`](../apps/web/Dockerfile)
- Production Compose: [`docker-compose.prod.yml`](../docker-compose.prod.yml)

### Deploying to Staging / Production Server
```bash
# 1. Clone repository on target host
git clone https://github.com/organization/Ausbildung-Preparation-Portal.git
cd Ausbildung-Preparation-Portal

# 2. Configure production environment variables
cp .env.example .env.production
nano .env.production # Provide secure random JWT keys, DB password, and domain

# 3. Build images and start all containerized services in detached mode
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build

# 4. Verify running health checks
docker compose -f docker-compose.prod.yml ps

# 5. Execute initial database schema sync & seed on fresh instance
docker compose -f docker-compose.prod.yml exec api npx prisma db push
docker compose -f docker-compose.prod.yml exec api npm run seed
```

---

## 3. Zero-Downtime Rolling Updates

To deploy code updates without disrupting active language learners or speaking sessions:

```bash
# 1. Pull latest verified commit
git pull origin master

# 2. Rebuild backend image in isolation
docker compose -f docker-compose.prod.yml build api

# 3. Perform rolling container replacement
docker compose -f docker-compose.prod.yml up -d --no-deps api

# 4. Repeat for frontend web service
docker compose -f docker-compose.prod.yml build web
docker compose -f docker-compose.prod.yml up -d --no-deps web

# 5. Clean dangling temporary builder cache
docker image prune -f
```

---

## 4. Database Backup & Disaster Recovery Drill

### 4.1 Automated Daily Backup Routine (Cron)
Create a daily cron job on the host (`/etc/cron.daily/ausbildung-db-backup.sh`):
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/ausbildung/postgres"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mkdir -p "$BACKUP_DIR"

# Execute pg_dump within the PostgreSQL container
docker exec ausbildung-prod-postgres pg_dump -U postgres -d ausbildung_portal -F c -b -v -f /tmp/backup.dump
docker cp ausbildung-prod-postgres:/tmp/backup.dump "$BACKUP_DIR/ausbildung_db_$TIMESTAMP.dump"

# Retain last 30 daily snapshots; delete older
find "$BACKUP_DIR" -type f -name "*.dump" -mtime +30 -delete
echo "[$(date)] Backup completed: ausbildung_db_$TIMESTAMP.dump"
```

### 4.2 Disaster Recovery Restoration Drill
If data corruption or hardware failure occurs, restore the database from snapshot:
```bash
# 1. Stop web and api traffic
docker compose -f docker-compose.prod.yml stop api web

# 2. Restore database from latest verified dump
docker cp /var/backups/ausbildung/postgres/ausbildung_db_latest.dump ausbildung-prod-postgres:/tmp/restore.dump
docker exec -i ausbildung-prod-postgres pg_restore -U postgres -d ausbildung_portal --clean --if-exists /tmp/restore.dump

# 3. Restart application services
docker compose -f docker-compose.prod.yml start api web

# 4. Run automated diagnostic probe
curl -f http://localhost:4000/api/v1/dashboard/admin/health
```

---

## 5. Security Secrets & Key Rotation Protocol

| Secret Name | Rotation Interval | Impact & Grace Procedure |
| :--- | :--- | :--- |
| `JWT_ACCESS_SECRET` | 90 Days | Access tokens expire in 15 min; users will smoothly re-authenticate via refresh tokens. |
| `JWT_REFRESH_SECRET` | 180 Days | Users will be prompted to log back in once existing refresh tokens cycle. |
| `STRIPE_WEBHOOK_SECRET`| Upon compromise | Update in Stripe Dashboard -> Webhooks -> Add secret to `.env` -> restart `api`. |
| `DATABASE_URL` password | 180 Days | Update PostgreSQL user password, update `.env`, restart services. |

---

## 6. Operational Monitoring & Alerting Thresholds

The API exports real-time diagnostic health telemetry at:
`GET /api/v1/dashboard/admin/health`

### Recommended Alerting Rules (Prometheus / Grafana / Datadog)
- **Database Latency:** Alert if `dbLatencyMs > 200ms` for > 3 consecutive checks.
- **Node Memory Footprint:** Alert if `heapUsedMb > 512MB` (potential memory leak).
- **HTTP 5xx Rate:** Alert if > 1% of total responses return HTTP 500 in a 5-minute window.
- **Failed Login Rate:** Alert if > 20 failed login attempts from a single IP within 10 minutes (credential stuffing alert).
- **Moderation Queue:** Alert if `openReportsCount > 10` for > 4 hours.
