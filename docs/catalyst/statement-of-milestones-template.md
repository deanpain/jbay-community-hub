# Statement of Milestones (SoM) — template for Midnight Compact DApps

**Fund rule (verify at submission):** Midnight category duration is capped at **3 months** with **exactly 3 milestones** (typically **one per month**).

**Budget split (strict for 3-milestone projects):**

| Milestone | Share of **total USDM** request |
|-----------|-----------------------------------|
| **Milestone 1** | **Maximum 20%** |
| **Milestone 2** | **Maximum 30%** |
| **Milestone 3** | **Minimum 50%** |

Fill **USDM amounts** after converting any ADA figure using a **dated** ADA↔USD (→ USDM) reference. Example structure only — replace `T` with your total USDM ask:

- M1 ≤ `0.20 × T` USDM  
- M2 ≤ `0.30 × T` USDM  
- M3 ≥ `0.50 × T` USDM  

Check that **M1 + M2 + M3 = T** (and caps satisfied).

---

## Milestone 1 — Month 1 (≤ 20% of T USDM)

**Objective:** Core MLS experience + Lace groundwork + public OSS baseline matching category deliverables.

**Planned outputs**

- Mobile app with **Education / Recreation / Entertainment** surfaces driven by deployment config.
- **Compact** development path established: listings/relevant modules progressing from stubs toward Bulletin Board–style privacy patterns (`contracts/`).
- **Lace** wallet: connect/session **spike** with constraints documented (ADR).
- **Public GitHub** + **README** + **CI** + **automated test suite** (lint, typecheck, contract placeholder tests, mobile checks).

**Acceptance criteria (examples — tailor in proposal)**

- Reviewers can clone the repo, install dependencies, run documented commands, and execute the test suite successfully.
- A **tagged commit** or **release** marks M1 scope (link in Catalyst form).
- Optional but high value: **short video** (2–5 min) showing app tabs + test run.

**Evidence to attach**

- GitHub **release URL** or **commit hash** + branch name.
- Link to **README** section describing setup.
- CI run screenshot or passing badge (optional).

**Maps to internal work:** Paperclip **INK-44** band (INK-50–INK-57); Phase 1 in [`milestone-checklist.md`](milestone-checklist.md).

---

## Milestone 2 — Month 2 (≤ 30% of T USDM)

**Objective:** Identity layer — selective disclosure, batched Altron/DHA path, Identus/Midnames VC pipeline (staging).

**Planned outputs**

- **Compact**: verified-resident gate replaces stub; proofs aligned with VC schemas.
- **identity-worker**: encryption model, batch windows, off-peak flush, **no PII in logs**; Altron **sandbox** integration path.
- **Identus** (Hyperledger Identus) / **Midnames** (`did:midnight`): documented issuance + anchor flow; mobile challenge path **demoable** in non-prod.
- **Cost controls**: dashboard or exported metrics for **batch vs live** DHA pricing tiers.

**Acceptance criteria**

- Staging demo with **synthetic** payloads only; documented limitations.
- Written **compliance** update (POPIA / subprocessors) in `docs/compliance/`.

**Evidence**

- GitHub tag/release for M2.
- Video or doc walkthrough of verification + VC handoff (sanitized).

**Maps to internal work:** **INK-45** (INK-58–INK-65); Phase 2 checklist.

---

## Milestone 3 — Month 3 (≥ 50% of T USDM)

**Objective:** Treasury & governance in Compact, security review, hardening, **template** release suitable for global reuse.

**Planned outputs**

- **Compact**: treasury + governance mechanics (communal NIGHT, DUST subsidy behavior as designed); auditable outcomes without leaking voter linkage.
- **Security**: audit **scope** delivered; **remediation** for critical findings where applicable before final tag.
- **QA** matrix (devices/networks/wallet builds); accessibility/performance pass as scoped.
- **Release**: satisfy [`release-checklist.md`](release-checklist.md); **municipality swap** + identity adapter documentation for non–South Africa forks.
- **Final demo** video (full pilot narrative + reusability pitch).

**Acceptance criteria**

- Public **release tag**; README explains fork + config swap.
- Evidence pack suitable for Catalyst **close-out** (links, demo, audit PDF if available).

**Evidence**

- Final **GitHub release** link.
- **Video** demo (required for strong reviewer verification).
- Audit letter / RFP / scope document as applicable.

**Maps to internal work:** **INK-46**, **INK-47**, plus parallel **INK-48** / **INK-49** as supporting evidence where relevant.

---

## Checklist before pasting into Catalyst

- [ ] Total **USDM** T computed and **20/30/50** caps verified.
- [ ] Every milestone lists **outputs**, **acceptance criteria**, and **evidence** types.
- [ ] Deliverables paragraph explicitly names: **Compact**, **UI**, **Lace**, **public repo**, **README**, **tests**, **license**.
- [ ] Team links and prior Catalyst reporting status verified.
- [ ] Plain-language **Impact** paragraph (Jeffreys Bay) + **Value for money** (reusable template) included in main proposal body.
