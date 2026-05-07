# Identity Worker cloud hosting (Render)

This runbook deploys `services/identity-worker` as a **background worker** on Render.

## Prereqs

- Render account + access to the `jbay-community-hub` repo.
- Secrets for Altron/DHA and Identus (do **not** commit).
- Node 20 (Render is configured for this via `render.yaml`).

## Deploy

1. In Render, create a **New Blueprint Instance** and point it at this repo.
2. Render auto-detects `render.yaml` at repo root and provisions an `identity-worker` worker service.
3. Set the required environment variables in Render:
   - `ALTRON_BASE_URL`, `ALTRON_USERNAME`, `ALTRON_PASSWORD`
   - `DHA_BASE_URL`, `DHA_API_KEY`
   - `IDENTUS_BASE_URL`, `IDENTUS_API_KEY`

## Operational notes

- The worker is a Node process started by `pnpm --filter identity-worker start`.
- If the worker needs periodic scheduling, prefer Render Cron Jobs triggering an API endpoint (when `services/api` grows) or add a lightweight tick loop inside the worker.
- Rotate credentials via Render env var updates; avoid long-lived plaintext secrets in CI.

## Local sanity check

```bash
pnpm --filter identity-worker build
pnpm --filter identity-worker test
pnpm --filter identity-worker start
```
