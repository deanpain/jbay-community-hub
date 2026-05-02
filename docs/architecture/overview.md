# Architecture overview

## Context

The J-Bay Community Hub is a **reusable civic MLS template**: mobile-first surfaces for **Education**, **Recreation**, and **Entertainment**, backed by Midnight **Compact** contracts with selective disclosure, integrated **Lace**, and **batched Altron/DHA** verification feeding **Hyperledger Identus** (formerly Atala PRISM ecosystem lineage) and **Midnames** credentials (`did:midnight`). Collective governance and treasury mechanics are implemented per **Midnight Compact** (category fit); reviewer narratives may cite broader DAO precedents, but this repo does not scope additional voting engines unless explicitly added.

## Containers

| Surface | Responsibility |
|---------|----------------|
| `apps/mobile` | Resident UX, wallet connectivity, proof orchestration client-side. |
| `services/identity-worker` | Encrypted queue + off-peak batch submission to Altron/DHA; VC issuance hand-off. |
| `services/api` | Optional BFF (health checks today; auth/rate limits later). |
| `contracts` | Midnight Compact modules for listings, residency proofs, treasury/governance. |

## Trust boundaries

- **Mobile** must never persist raw ID numbers or DHA payloads in logs/analytics.
- **Identity worker** handles ciphertext only; decryption keys live in HSM/KMS-backed environments (document target architecture per deployment).
- **Chain** exposes only commitments, treasury rules, and auditable tallies — not individual behavioral graphs.

## Threat modeling pointers

Document concrete threats (sybil, bribery, custody loss, batch processor compromise) in forthcoming threat-model workshop notes under `docs/architecture/` when available.

## References

- Identity batching ADR: [`docs/adr/0001-async-identity-batch-altron-dha.md`](../adr/0001-async-identity-batch-altron-dha.md)
- Lace + Expo ADR: [`docs/adr/0003-lace-expo-metro-wallet-integration.md`](../adr/0003-lace-expo-metro-wallet-integration.md)
- Lace spike runbook: [`docs/runbooks/lace-spike.md`](../runbooks/lace-spike.md)
- Catalyst milestones: [`docs/catalyst/milestone-checklist.md`](../catalyst/milestone-checklist.md)
