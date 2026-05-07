# Runbook — Identity worker encryption + KMS assumptions

Scope: `services/identity-worker` queue payload handling (ADR 0001 alignment).

## Non-negotiables

- Persist **ciphertext only** (`QueuedVerification.ciphertext`); never write plaintext ID attributes to logs.
- Correlation id is the only join key across app, queue, and batch outcomes.
- App/service logs stay aggregate-only: queue depth, batch size, accepted/rejected/retry counts.

## KMS / HSM contract (implementation target)

- Envelope encryption:
  - Per-item data key (DEK) encrypts payload at ingress.
  - DEK is wrapped by KMS-managed key-encryption key (KEK).
- Store in queue record:
  - `ciphertext`
  - `keyVersion` (KEK alias/version)
  - `wrappedDek`
  - `correlationId`, `createdAt`

Never persist plaintext DEKs or long-lived private keys in repo/env files.

## Rotation policy (minimum)

- Rotate KEK alias on a fixed cadence (example: 90 days) and on incident response.
- New records use the new key version immediately.
- Backfill re-wrap old `wrappedDek` values asynchronously; no plaintext reads for re-wrap.

## Failure handling

- If decrypt/unwrap fails for a record:
  - mark batch outcome `retry`
  - include only correlation id + key version in diagnostics
  - open incident ticket with KMS audit event id
- If KMS unavailable:
  - halt new enqueue writes (fail closed)
  - keep queue immutable until dependency recovers

## Operator checklist

1. Validate KMS principal has only `encrypt/decrypt/wrap/unwrap` for current alias.
2. Confirm worker dry-run still emits only aggregates:
   - `pnpm --filter identity-worker run dry-run`
3. Verify no plaintext fields in logs/metrics sinks.
4. Record rotation/incident actions in Paperclip issue comments.

## Implementation (2026-05-07)

**Files implemented:**
- `services/identity-worker/src/kms.ts` — KMS abstraction layer with:
  - `KMSClient` interface (encrypt/decrypt/wrapKey/unwrapKey/getCurrentKeyVersion)
  - `createKMSClient()` factory (stub + AWS KMS placeholder)
  - `createEncryptionService()` for envelope encryption
  - `rotateKey()` for key rotation
  - `KMSUnavailableError`, `DecryptFailureError` for failure handling
- `services/identity-worker/src/index.ts` — Updated schema:
  - `queuedVerificationSchema` now includes `keyVersion` and `wrappedDek`
  - Exports `KMSConfig`, `EncryptionResult`, KMS utilities
- `services/identity-worker/src/altron/processor.ts` — Updated to propagate `keyVersion` to batch requests

**Environment variables:**
```bash
KMS_KEY_ALIAS=alias/identity-worker-dek
KMS_KEY_VERSION=v1
KMS_REGION=af-south-1
KMS_ENDPOINT=http://localhost:4566
```

**To enable AWS KMS:**
```bash
npm install @aws-sdk/client-kms
```
Then update `createAWSKMSClient()` in `src/kms.ts` with real implementation.
