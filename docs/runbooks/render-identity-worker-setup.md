# Render Account Setup — Quick Guide

> **Issue:** INK-168 · P-MVP.6  
> **Purpose:** Gate for P-MVP.3 (Deploy identity-worker)  
> **Who:** Dean  
> **Est. time:** 15 min  
> **Cost:** Free tier (no credit card required)

---

## Step 1 — Sign Up for Render

1. Go to [dashboard.render.com/register](https://dashboard.render.com/register)
2. Sign up with GitHub (recommended — links to the monorepo automatically)
3. Verify email
4. **No credit card required** on the free tier

## Step 2 — Connect GitHub Repository

1. In Render dashboard → **New +** → **Web Service**
2. Connect GitHub account if not already linked
3. Select `deanpain/jbay-community-hub` (the monorepo)
4. Render auto-detects the root — we'll override with a **service path** per subproject

## Step 3 — Deploy identity-worker

The identity-worker lives in the monorepo. Configure:

| Field | Value |
|-------|-------|
| **Name** | `jbay-identity-worker` |
| **Runtime** | `Docker` (uses `Dockerfile` in the service root) |
| **Service path** | `services/identity-worker/` (if Dockerfile is there — verify before deploy) |
| **Branch** | `main` (or staging branch) |
| **Plan** | Free (512 MB RAM, sleeps after 15 min idle — fine for batch) |
| **Health Check Path** | `/health` (or whatever the worker exposes) |
| **Auto-Deploy** | Yes (on git push to branch) |

### Environment Variables

| Variable | Value | Source |
|----------|-------|--------|
| `NODE_ENV` | `production` | Static |
| `DATABASE_URL` | Neon Postgres connection string | From Neon dashboard |
| `ALTROM_API_KEY` | *(Altron sandbox)* | **Partner-provided** — see step 4 |
| `ALTROM_SANDBOX_URL` | `https://sandbox.altron.co.za/api/v1` | Partner |
| `WORKER_BATCH_INTERVAL_MS` | `3600000` (1 hour) | Default |

## Step 4 — Obtain Altron Sandbox Credentials

> This requires contact with the Altron/DHA partner. Dean needs to:
> 1. Reach out to the Altron contact (or the person who brokered the data partnership)
> 2. Request **sandbox API credentials** for testing
> 3. Get: `ALTROM_API_KEY`, `ALTROM_SANDBOX_URL`, rate limits, and any IP allowlist requirements

Once received, share with the CEO agent to configure in Render.

---

## Verification

After deploy is complete:
1. Visit `https://jbay-identity-worker.onrender.com/health`
2. Check Render logs for startup success
3. Confirm worker processes batch without errors

**Done when:** identity-worker health endpoint returns 200 and batch processing runs.
