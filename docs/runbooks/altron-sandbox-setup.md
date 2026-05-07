# Runbook — Altron sandbox setup

Scope: `services/identity-worker` batch verification via Altron → DHA NPR.

## Prerequisites

- Altron developer account (sandbox environment)
- DHA NPR access (via Altron gateway)
- Rate limit confirmation from Altron/ops

## Environment variables

Add to `.env` (never commit):

```env
ALTRON_API_URL=https://api.altron-sandbox.gov.za/v1
ALTRON_API_KEY=<your-sandbox-key>
ALTRON_BATCH_SIZE_LIMIT=100
ALTRON_RATE_LIMIT_PER_HOUR=1000
```

Reference: `.env.example` for template (no secrets).

## Sandbox credentials flow

1. **Register** with Altron developer portal
2. **Request** sandbox API key for DHA NPR batch endpoint
3. **Configure** `ALTRON_API_KEY` in environment
4. **Test** connectivity:

```bash
curl -H "Authorization: Bearer $ALTRON_API_KEY" \
  "${ALTRON_API_URL}/health"
```

## Batch request format

```typescript
interface BatchVerificationRequest {
  items: Array<{
    correlationId: string;
    encryptedPayload: string;  // Base64 ciphertext
    keyVersion: string;
  }>;
  batchId: string;
  submittedAt: string;
}

interface BatchVerificationResponse {
  batchId: string;
  results: Array<{
    correlationId: string;
    status: "accepted" | "rejected" | "retry";
    dhaRef?: string;
  }>;
  processedAt: string;
}
```

## Rate limiting

- Sandbox: 1000 requests/hour (configurable)
- Production: Per contract with Altron/ops
- Implement exponential backoff on 429 responses

## Dry-run mode

When `ALTRON_API_KEY` is not set, the identity-worker uses synthetic outcomes:

- 70% accepted
- 20% retry
- 10% rejected

See `docs/runbooks/identity-batch-windows-dry-run.md`.

## Next step

Wire real Altron credentials → run batch flush in staging → verify outcomes.