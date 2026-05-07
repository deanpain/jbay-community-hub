# Catalyst Fund 15 — Statement of Milestones Draft

**Project:** J-Bay Community Hub — Midnight Compact DApps
**Category:** Midnight: Compact DApps
**Duration:** 3 months
**Milestones:** 3 (monthly)

---

## Budget

**Base reference:** 90,000 ADA (legacy estimate)

> Fill T (total USDM) after converting ADA→USDM using a dated, cited rate:
> T = 90,000 ADA × [ADA/USD rate on date] USDM

| Milestone | Cap | Amount |
|-----------|-----|--------|
| M1 | ≤ 20% of T | **[__] USDM** |
| M2 | ≤ 30% of T | **[__] USDM** |
| M3 | ≥ 50% of T | **[__] USDM** |
| **Total** | **100%** | **T = [__] USDM** |

---

## Milestone 1 — Month 1 (≤ 20% of T USDM)

**Objective:** Core MLS experience + Lace groundwork + public OSS baseline.

**Planned outputs:**
- Mobile app with Education / Recreation / Entertainment surfaces driven by deployment config
- Compact development path: listings modules progressing from stubs toward Bulletin Board privacy patterns (`contracts/`)
- Lace wallet: connect/session spike with constraints documented (ADR)
- Public GitHub + README + CI + automated test suite (lint, typecheck, contract placeholder tests, mobile checks)

**Acceptance criteria:**
- Reviewers can clone repo, install dependencies, run documented commands, execute test suite successfully
- Tagged commit or release marks M1 scope

**Evidence:**
- GitHub release URL or commit hash + branch
- Link to README setup section
- CI passing badge / screenshot

---

## Milestone 2 — Month 2 (≤ 30% of T USDM)

**Objective:** Identity layer — selective disclosure, batched Altron/DHA path, Identus/Midnames VC pipeline.

**Planned outputs:**
- Compact: verified-resident gate replaces stub; proofs aligned with VC schemas
- identity-worker: encryption model, batch windows, off-peak flush, no PII in logs
- Altron sandbox integration path
- Identus (Hyperledger Identus) / Midnames (`did:midnight`): documented issuance + anchor flow
- Cost controls: dashboard or exported metrics for batch vs live DHA pricing tiers

**Acceptance criteria:**
- Staging demo with synthetic payloads; documented limitations
- Written compliance update (POPIA/subprocessors) in `docs/compliance/`

**Evidence:**
- GitHub tag/release for M2
- Video or doc walkthrough of verification + VC handoff (sanitized)

---

## Milestone 3 — Month 3 (≥ 50% of T USDM)

**Objective:** Treasury & governance in Compact, security review, hardening, template release.

**Planned outputs:**
- Compact: treasury + governance mechanics (communal NIGHT, DUST subsidy)
- Security: audit scope delivered; remediation for critical findings
- QA matrix (devices/networks/wallet builds); accessibility/performance pass
- Release: satisfy release-checklist.md; municipality swap documentation
- Final demo video (full pilot narrative + reusability pitch)

**Acceptance criteria:**
- Public release tag; README explains fork + config swap
- Evidence pack suitable for Catalyst close-out

**Evidence:**
- Final GitHub release link
- Video demo
- Audit letter / RFP / scope document as applicable

---

## Pre-paste checklist

- [ ] Total USDM T computed using dated ADA↔USD conversion
- [ ] 20/30/50 caps verified
- [ ] Every milestone lists outputs, acceptance criteria, and evidence types
- [ ] Deliverables paragraph explicitly names: Compact, UI, Lace, public repo, README, tests, license
- [ ] Team links and prior Catalyst reporting status verified (see INK-91)
- [ ] Plain-language Impact paragraph (Jeffreys Bay) + Value for money (reusable template) in main proposal body
