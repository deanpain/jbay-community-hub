# Render Deployment Guide — identity-worker

**Purpose:** Unblocks INK-168 (P-MVP.6) → INK-165 (Deploy identity-worker) → INK-166 (Pilot Ship)

## Architecture

```
[identity-worker service] → Postgres DB (Render Managed)
         ↓
[Altron/DHA batch processing]
         ↓
[Identus VC issuance pipeline]
```

## Step 1: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub (preferred) or email
3. Select **Free Tier** plan (enough for MVP pilot)
4. Verify email

## Step 2: Connect GitHub Repository

1. In Render Dashboard: **New +** → **Web Service**
2. Connect GitHub account
3. Select `deanpain/jbay-community-hub`
4. Configure service:
   - **Name:** `jbch-identity-worker`
   - **Region:** `Frankfurt (EU)` (for POPIA compliance)
   - **Branch:** `main`
   - **Root Directory:** `services/identity-worker`
   - **Runtime:** `Docker`
   - **Plan:** Free

## Step 3: Configure Environment Variables

| Variable | Value | Source |
|----------|-------|--------|
| `DATABASE_URL` | Postgres connection string | Render Managed DB |
| `NODE_ENV` | `production` | — |
| `ALTROON_API_KEY` | Altron sandbox key | Partner credentials |
| `IDENTUS_NODE_URL` | Identus cloud node URL | Identus setup |
| `LOG_LEVEL` | `info` | — |
| `BATCH_WINDOW_MS` | `300000` | 5 min batch window |
| `POPIA_ENABLED` | `true` | Compliance flag |

## Step 4: Set Up Managed PostgreSQL

1. **New +** → **PostgreSQL**
2. **Name:** `jbch-db`
3. **Plan:** Free ($0/mo, 256MB RAM, 1GB disk — sufficient for pilot)
4. **Region:** Frankfurt (same as web service)
5. Copy the **Internal Connection String** to identity-worker's `DATABASE_URL`

## Step 5: Health Check

Render auto-provisions a health check at `/health` on port 10000.

The identity-worker should respond:
```json
{"status":"ok","service":"identity-worker","version":"1.0.0","batchQueue":0}
```

## Step 6: Deploy

Render auto-deploys on push to `main`. Manual deploy via Dashboard or CLI.

## Cost Breakdown (Free Tier)

| Service | Cost | Limits |
|---------|------|--------|
| Web Service (Docker) | $0/mo | 512MB RAM, 100GB bandwidth, sleeps after 15 min idle |
| PostgreSQL | $0/mo | 256MB RAM, 1GB disk |
| **Total** | **$0/mo** | Sufficient for pilot with 8 seed partners |

## What Agent Needs From Dean

- Render account credentials (or access)
- Altron sandbox API key (partner-provided)
- Identus node URL and credentials
- Once provided, agent will configure and deploy

## Alternative: Railway.app

If Render free tier limits (idle sleep) become a bottleneck:
- Railway.app also has a free tier with $5 credit
- No idle sleep
- Docker-based deployment
