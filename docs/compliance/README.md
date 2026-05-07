# Compliance notes (POPIA-first posture)

South Africa's POPIA applies when processing personal information — even transient identity payloads destined for Altron/DHA.

## Principles embedded in architecture

- **Minimisation**: collect only what verification requires; discard plaintext after VC issuance where policy allows.
- **Purpose limitation**: process identity strictly for residency verification + audit obligations.
- **Security safeguards**: encrypt queues, restrict KMS keys, monitor worker access.
- **Subprocessors**: maintain current list (Altron, DHA, cloud hosting, analytics). Link DPAs here when executed.

## Subprocessors

| Party | Purpose | Data shared |
|---|---|---|
| Altron | Batch NPR verification (off-peak) | Ciphertext bundle + correlation ID (no plaintext attributes) |
| DHA NPR | National population register lookup | Per Altron batch protocol; no direct app-to-DHA connection |
| Identus | VC registry anchoring (Midnames/DID) | DID + VC metadata (no PII beyond identifier) |
| Cloud hosting (infra provider) | Compute, storage, KMS | Encrypted payloads only; key material never exposed to infra layer |
| Analytics (if deployed) | Usage metrics | Aggregate counts only; no correlation IDs or PII |

Link executed DPAs below when available.

## Retention windows

| Artifact | Retention | Rationale |
|---|---|---|
| Ciphertext queue records | 90 days | Allows retry within window; rotate KEK every 90 days |
| VC artifacts (DID + VC metadata) | Until revocation or resident request | Verifiable credential lifecycle; governed by Identus policy |
| Batch outcome logs | 12 months | Audit obligation; aggregate metrics only |
| Correlation ID mapping | 30 days post-outcome | Enables failure triage without persisting payload |

## Legal review checklist

- [ ] DPA with Altron executed (data processing agreement)
- [ ] DPA with DHA batch pipeline confirmed under Altron's subprocessor arrangement
- [ ] DPA with Identus reviewed for VC registry anchoring
- [ ] ROPA entry confirmed by legal counsel
- [ ] POPIA privacy notice / processing consent language in mobile app confirmed
- [ ] Incident response plan reviewed for data breach notification obligations (72-hour POPIA deadline)
- [ ] KMS key rotation cadence reviewed and approved
- [ ] Data deletion / revocation procedure for VCs confirmed

## Sign-off

- [ ] Legal counsel review: **pending** — engage counsel before production launch
- [ ] DPIA: **open** — see checklist above; complete before first live resident registration
- [ ] Architecture sign-off: complete (ADR-0001 covers data flow, encryption, and batch processing pattern)

> Not legal advice — engage qualified counsel before production launch.
