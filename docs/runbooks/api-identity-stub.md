# Runbook — API identity stub (`services/api`)

In-process **job ids** for local demos; not durable across restarts. No request bodies are logged.

## Run

```bash
pnpm --filter api run build
pnpm --filter api run start
```

Default port **8787** (`PORT` overrides).

## Smoke

```bash
curl -sS http://127.0.0.1:8787/healthz
JOB=$(curl -sS -X POST http://127.0.0.1:8787/v1/identity/enqueue -H 'content-type: application/json' -d '{}' | node -p "JSON.parse(require('fs').readFileSync(0,'utf8')).jobId")
curl -sS "http://127.0.0.1:8787/v1/identity/jobs/${JOB}"
```

Expect `202` + `jobId` on enqueue, then `200` with `{ "jobId", "status": "queued" }` for that id. Unknown ids return **404** `{ "error": "not_found" }`.

## Limits

- In-memory store caps at **1000** jobs (oldest evicted).
- POST body drained up to **64 KiB**; oversized returns **413**.
