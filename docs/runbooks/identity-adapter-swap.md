# Identity Adapter Swap Guide

> Replace the default Altron/DHA identity provider with your country's identity verification service. This guide covers the adapter boundary for `services/identity-worker`.

---

## Overview

The identity-worker service processes identity verification requests through an **adapter pattern**. Each provider (Altron/DHA, DigiD, MyInfo, etc.) has a single file that maps generic verification requests to that provider's specific API.

### Architecture

```
[App] → API (NestJS) → Queue (Redis) → identity-worker → [Identity Adapter] → Provider API
```

The adapter boundary is at `services/identity-worker/src/adapters/`. The worker calls a generic `verify(submission)` interface; the adapter translates this into the provider's API format.

---

## Step 1 — Understand the Adapter Interface

All adapters must export:

```typescript
export interface IdentityAdapter {
  /** Verify a resident's identity using the provider's API.
   *  Returns a verification result or throws on rejection. */
  verify(input: VerificationInput): Promise<VerificationResult>;

  /** Health check — confirms provider credentials / endpoint are alive. */
  health(): Promise<HealthStatus>;
}
```

Key types are defined in `packages/shared/src/identity.ts`:

```typescript
interface VerificationInput {
  idNumber: string;
  fullName: string;
  dateOfBirth: string;       // ISO-8601
  nationality?: string;
  metadata?: Record<string, string>; // Provider-specific extras
}

interface VerificationResult {
  verified: boolean;           // true if identity matches provider records
  confidence: number;          // 0–1 score
  referenceId: string;         // Provider's transaction ID (for audit)
  matchedFields: string[];     // Which fields matched
  failureReason?: string;      // Human-readable if rejected
}
```

---

## Step 2 — Create Your Adapter

Create a new file at `services/identity-worker/src/adapters/<provider-name>.ts`.

**Template:**

```typescript
import { IdentityAdapter, VerificationInput, VerificationResult, HealthStatus } from "./types";

export class YourProviderAdapter implements IdentityAdapter {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.YOUR_PROVIDER_URL!;
    this.apiKey = process.env.YOUR_PROVIDER_API_KEY!;
  }

  async verify(input: VerificationInput): Promise<VerificationResult> {
    const response = await fetch(`${this.baseUrl}/verify`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Map your provider's expected fields
        identityNumber: input.idNumber,
        name: input.fullName,
        dob: input.dateOfBirth,
      }),
    });

    if (!response.ok) {
      throw new Error(`Provider returned ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    return {
      verified: data.match,
      confidence: data.score ?? (data.match ? 0.95 : 0),
      referenceId: data.transactionId,
      matchedFields: data.verifiedFields ?? [],
      failureReason: data.reason,
    };
  }

  async health(): Promise<HealthStatus> {
    try {
      const resp = await fetch(`${this.baseUrl}/health`, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });
      return { ok: resp.ok, latency: 0 }; // Latency measured externally
    } catch {
      return { ok: false, latency: 0 };
    }
  }
}
```

---

## Step 3 — Register the Adapter

Edit `services/identity-worker/src/adapters/index.ts`:

```typescript
import { YourProviderAdapter } from "./your-provider";

export function getActiveAdapter(): IdentityAdapter {
  const provider = process.env.IDENTITY_PROVIDER || "altron";

  switch (provider) {
    case "your-provider":
      return new YourProviderAdapter();
    case "altron":
      return new AltronAdapter();
    // Add new providers here
    default:
      throw new Error(`Unknown identity provider: ${provider}`);
  }
}
```

---

## Step 4 — Environment Variables

Add to your `.env.production`:

```bash
IDENTITY_PROVIDER=your-provider
YOUR_PROVIDER_URL=https://api.provider.example.com
YOUR_PROVIDER_API_KEY=sk_...
```

Update `.env.example` so future deployers know what variables are needed.

---

## Step 5 — Update ZK Credential Schemas

If the new provider returns different data fields, update the ZK proof schemas in `packages/shared/src/schemas/`:

1. Modify the `IdentityCredential` Zod schema to include fields your provider returns
2. Update Midnight Compact contract schemas if the credential format changes
3. Bump the schema version in `packages/shared/src/schemas/version.ts`

---

## Step 6 — Compliance & Documentation

- [ ] Update `docs/compliance/` with the new provider's data protection jurisdiction
- [ ] Update `docs/partners/identity-provider-notes.md` with provider-specific details
- [ ] Update the **Municipality Swap Guide** (`docs/runbooks/municipality-swap.md`) Table of Contents if adding a new provider to the table
- [ ] Record any rate limits, SLA guarantees, or outage procedures

---

## Altron/DHA Adapter Reference

The shipped Altron adapter (`services/identity-worker/src/adapters/altron.ts`) uses:

| Detail | Value |
|--------|-------|
| Provider | Altron DHA Verification |
| Endpoint | Configured via `ALTRON_API_URL` |
| Auth | API key in header |
| Test mode | `ALTRON_SANDBOX=true` uses a local stub |
| Rate limit | 10 req/s per API key |
| Fields verified | idNumber, fullName, dateOfBirth |

---

## Testing Your Adapter

```bash
# Set provider and run the dry-run test suite
IDENTITY_PROVIDER=your-provider \
  YOUR_PROVIDER_URL=https://sandbox.provider.test \
  YOUR_PROVIDER_API_KEY=test-key-123 \
  pnpm --filter identity-worker run dry-run

# Run the adapter-specific unit tests
pnpm --filter identity-worker test -- --grep "YourProviderAdapter"
```

The dry-run suite replays synthetic verification batches and confirms:
- All records produce a valid `VerificationResult`
- No plaintext ID data leaks to logs
- Health check endpoint responds correctly

---

## Provider-Specific Notes

_Use this section to document peculiarities of your identity provider._

- **Rate limits:** Some providers enforce per-IP throttling. Consider a pool of egress IPs.
- **Batch vs real-time:** DHA supports batch verification via CSV upload; most modern providers offer real-time REST. The adapter interface supports both — use `async verify()` for real-time or the separate `batchProcess()` method for CSV-based flows.
- **Retry strategy:** Default: 3 retries with exponential backoff (1s, 4s, 9s). Adjust in `services/identity-worker/src/queue/processor.ts` if your provider has different rate limit windows.
