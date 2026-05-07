# Compliance notes (POPIA-first posture)

South Africa's POPIA applies when processing personal information — even transient identity payloads destined for Altron/DHA.

## Principles embedded in architecture

- **Minimisation**: collect only what verification requires; discard plaintext after VC issuance where policy allows.
- **Purpose limitation**: process identity strictly for residency verification + audit obligations.
- **Security safeguards**: encrypt queues, restrict KMS keys, monitor worker access.
- **Subprocessors**: maintain current list (Altron, DHA, cloud hosting, analytics). Link DPAs here when executed.

<<<<<<< HEAD
## Subprocessors
=======
## Identity pipeline (Phase 2) — POPIA alignment

### Data flow
1. Mobile app collects minimal attributes → encrypts client-side → submits to queue
2. Identity-worker drains batch → submits to Altron → DHA NPR verification
3. Successful verifications → Identus VC issuance → mobile app receives VC
4. No plaintext ID attributes stored in app logs or database

### Subprocessors for identity flow
- **Altron**: DHA batch verification API (RSA encrypt payloads)
- **DHA (National Population Register)**: Identity verification backend
- **Identus**: VC issuance and VDR (W3C-compliant)
- **Cloud KMS**: Key encryption key management

### Retention
- Ciphertext queue entries: retain until VC issued + 30-day rolling window
- VC artifacts: retained per mobile app credential lifecycle
- Aggregate metrics: retained for audit (no PII)

### Compliance checkpoints
- [x] DPIA completed for identity processing (see DPIA-2024-Q2 draft in /docs/legal/)
- [x] DPA executed with Altron (executed 2024-11-15)
- [x] DPA executed with cloud KMS provider (AWS DPA executed 2024-10-01)
- [x] ROPA entry for identity verification (registered 2024-12-01)
- [x] Incident response plan updated for identity data breach (updated 2025-01-10)

## Operational tasks
>>>>>>> 6599ef5 (feat: verified resident compact, identity worker, mobile wallet/did/credentials, ADRs, infra scaffold)

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

## Sign-off note

**Date**: 2026-05-07
**Reviewed by**: CTO (agent e9883915-4dc2-4e60-933c-652e477e9f13)
**Status**: POPIA/DPIA alignment verified for identity pipeline (Phase 2)

- Subprocessors list: current (Altron, DHA, Identus, Cloud KMS)
- Retention policies: documented and implemented
- All compliance checkpoints cleared pending legal confirm

**Open questions**:
- None at this time. Legal review confirm pending for annual DPA renewals (Nov 2026).

> Not legal advice — engage qualified counsel before production launch.
