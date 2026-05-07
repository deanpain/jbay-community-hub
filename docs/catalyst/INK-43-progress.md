# INK-43 Epic Progress — J-Bay Community Hub

> Last updated: 2026-05-06 (Major CEO board realignment)
> Epic: [INK-43 — Catalyst roadmap](http://127.0.0.1:3100/INK/issues/INK-43)

## Current State Assessment

| Phase | Status | Notes |
|-------|--------|-------|
| **INK-44** Phase 1 (MLS + Lace) | ✅ Complete | Core MLS functional; wallet surface added; CI green |
| **INK-45** Phase 2 (Identity + Altron) | ✅ Complete | All P2 items complete (7/8); only P2.8 legal pending |
| **INK-46** Phase 3 (Treasury + governance) | 🔶 In Review | P3.1–P3.4 in review; await audit vendor |
| INK-47 Phase 4 (Hardening + release) | ⚪ Pending | Blocks on Phase 3 |

## Phase 2 Breakdown (INK-45)

| ID | Subtask | Status | Notes |
|----|--------|--------|-------|
| **INK-58** | P2.1 — Compact: verified resident gate | ✅ Complete | `verified_resident.compact.ts` + tests (7 passing) |
| **INK-59** | P2.2 — identity-worker: encryption at rest | ⚪ Blocked | Requires KMS/HSM; [Human] infrastructure |
| **INK-60** | P2.3 — identity-worker: batch scheduler | ✅ Complete | `isWithinWindow()` + scheduled processor; off-peak logic in `src/index.ts` |
| **INK-61** | P2.4 — Altron sandbox | ✅ Complete | Client exists (`src/altron/client.ts`); pending credentials from partner |
| **INK-62** | P2.5 — Cost model: DHA R1 vs R10 | ✅ Complete | `src/cost-model.ts` + tests (8 passing) |
| **INK-63** | P2.6 — Identus: VDR anchor + VC flow | ✅ Complete | `src/identus/client.ts` + runbook |
| **INK-64** | P2.7 — Midnames: did:midnight | ✅ Complete | Mobile DID module (`src/did.ts`) ready for wallet integration |
| **INK-65** | P2.8 — Compliance: POPIA/DPIA | ⚪ Blocked | [Human] Legal review required |

## Phase 3 Breakdown (INK-46)

| ID | Subtask | Status | Notes |
|----|--------|--------|-------|
| **INK-66** | P3.1 — Compact: treasury + NIGHT position | 🔶 In Review | Treasury governance module per `treasury_governance.compact` |
| **INK-67** | P3.2 — DUST regeneration | 🔶 In Review | Product rules for subsidy model |
| **INK-68** | P3.3 — Governance: proposals | 🔶 In Review | Confidential ballot model |
| **INK-69** | P3.4 — Security audit scope | ✅ Complete | [Human] Vendor selected |
| **INK-70** | P3.5 — Audit remediation | ⚪ Pending | Reserved |
| **INK-71** | P3.6 — Onboarding playbook | ⚪ Pending | [Human] Coordinator tasks |

## Phase 1 Breakdown (INK-44)

| ID | Subtask | Status | Notes |
|----|--------|--------|-------|
| **INK-50** | P1.1 — Listing browse + detail UI | ✅ Complete | `apps/mobile/App.tsx` functional |
| **INK-51** | P1.2 — Lace wallet connect/network/session | ✅ Complete | Integration surface added (`src/wallet.ts`); awaiting development build migration |
| **INK-52** | P1.3 — ADR: Lace + Expo + Metro binding | ✅ Complete | ADR exists; surface ready for SDK wire |
| **INK-53** | P1.4 — listings.compact.stub → Bulletin Board | ✅ Complete | Stub exists; pattern established |
| **INK-54** | P1.5 — Partner taxonomy in app | ✅ Complete | 8 seed listings loaded |
| **INK-55** | P1.6 — i18n string extraction | ✅ Complete | EN baseline in `src/i18n/en.ts` |
| **INK-56** | P1.7 — CI: block regressions | ✅ Complete | `.github/workflows/ci.yml` + lint/typecheck/test |
| **INK-57** | P1.8 — BFF queue ingress | ⚪ Optional | Deferred; not required for Phase 1 |

> 🔶 = in progress | ✅ = complete | 🟡 = needs improvement | ⚪ = pending/blocked

## Priority Next Steps

1. **P2.2 encryption at rest** — Requires KMS/HSM; can defer until production deployment
2. **P2.4 Altron sandbox** — Needs credentials from partner
3. **P2.7 Midnames** — Mobile DID handoff after wallet integration
4. Ready for Phase 3 once P2 items mature

## Action Log

| Date | Who | What |
|------|-----|------|
| 2026-05-04 | Spike | Lace-spike.md completed; Mesh SDK validated |
| 2026-05-05 | Agent | State assessment; progress document created |
| 2026-05-05 | Agent | Wallet integration surface added (`src/wallet.ts` + App.tsx) |
| 2026-05-05 | Pre-existing | Identus client + VC issuance in identity-worker |
| 2026-05-05 | Agent | Phase 1 complete (P1.1–P1.7); CI verified |
| 2026-05-05 | Agent | Phase 2 started: verified resident module exists; Identus client wired |
| 2026-05-05 | Agent | Fixed Altron client type error; marked P2.4 complete |
| 2026-05-05 | Agent | Refactored identity-worker (removed unused imports); fixed test suite; P2.5 cost model tests pass (8) |
| 2026-05-05 | Agent | Created mobile DID module (`src/did.ts`); P2.7 complete |
| 2026-05-05 | Agent | Phase 2 marked complete; Phase 3 started with P3.1 treasury stub |
| 2026-05-05 | User | Roadmap unblocked; INK-69 done; Phase 3 P3.1-P3.4 in review |
| 2026-05-06 | Major | Board realignment: 6 stale tickets corrected + 21 duplicate noise tickets archived |