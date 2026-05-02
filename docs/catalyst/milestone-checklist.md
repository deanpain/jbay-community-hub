# Catalyst milestone checklist

Maps repository delivery to **Midnight Compact DApps**-style expectations (Compact, mobile UI, Lace, tests, public OSS). **Detailed execution tasks** with acceptance hints live in Paperclip — see [`paperclip-roadmap.md`](paperclip-roadmap.md) for **INK-xx** links (subtasks **INK-50**–**INK-87**).

## Catalyst proposal vs internal tracking

| Artifact | Purpose |
|----------|---------|
| **Statement of Milestones (SoM)** | **Exactly 3 monthly milestones**, USDM amounts, **20% / 30% / 50%** caps — required for Fund 15 Midnight category formatting. See [`statement-of-milestones-template.md`](statement-of-milestones-template.md). |
| **Fund rules & prerequisites** | USDM funding, reviewer criteria, wallet / Keychain / reporting — see [`catalyst-fund15-requirements.md`](catalyst-fund15-requirements.md). |
| **Human vs dev ops (Paperclip)** | **[INK-88](http://127.0.0.1:3100/INK/issues/INK-88)** umbrella + **[INK-89](http://127.0.0.1:3100/INK/issues/INK-89)–[INK-94](http://127.0.0.1:3100/INK/issues/INK-94)** (human) + **[INK-95](http://127.0.0.1:3100/INK/issues/INK-95)** (post-submit repo evidence). See [`paperclip-roadmap.md`](paperclip-roadmap.md). |
| **INK subtasks** | Day-to-day engineering breakdown; **does not** replace SoM evidence for reviewers. |

Legacy budget discussions in **ADA** must be **converted to USDM** for submission (see fund requirements doc).

## Phase 1 — Weeks 1–4 (Core MLS + Lace groundwork)

**Paperclip:** [INK-44](http://127.0.0.1:3100/INK/issues/INK-44) · Subtasks INK-50–INK-57

- [ ] **P1.1** — Listing browse + detail UI against mock/stub contract layer (`@jbay/shared` types).
- [ ] **P1.2** — Lace connect / network / session spike (device vs simulator documented).
- [ ] **P1.3** — ADR: Lace + Expo + Metro monorepo binding; README links to ADR.
- [ ] **P1.4** — Evolve `listings.compact.stub` toward Bulletin Board pattern; update `contracts/README.md`.
- [ ] **P1.5** — Partner taxonomy reflected in app (read-only seed from `docs/partners/`).
- [ ] **P1.6** — i18n: EN baseline string extraction; note Afrikaans/Xhosa follow-up in README.
- [ ] **P1.7** — CI required checks on `main`: lint, typecheck, tests, `contracts:test`, mobile `tsc`, web export smoke.
- [ ] **P1.8** (optional) — BFF: opaque enqueue stub for future identity queue (`services/api`).

**Exit criteria:** Demo-able MLS flows without chain; Lace path documented or blocker filed; CI green.

---

## Phase 2 — Weeks 5–8 (ZK identity + Altron batch)

**Paperclip:** [INK-45](http://127.0.0.1:3100/INK/issues/INK-45) · Subtasks INK-58–INK-65 · *Blocked by Phase 1 closure in tracker*

- [ ] **P2.1** — `verified_resident` Compact replaces stub; proofs align to VC schemas.
- [ ] **P2.2** — identity-worker: encryption/KMS assumptions documented (`docs/runbooks/` / ADR).
- [ ] **P2.3** — Batch scheduler + off-peak flush + aggregated metrics (queue depth, outcomes).
- [ ] **P2.4** — Altron sandbox: env template (no secrets in repo), batch path validated.
- [ ] **P2.5** — Cost observability: R1 batch vs R10 live; budget alerts for Catalyst runway.
- [ ] **P2.6** — Identus VDR anchor + issuance sequence (happy path + failures).
- [ ] **P2.7** — Midnames / `did:midnight` + VC handoff to mobile challenge flow.
- [ ] **P2.8** — Compliance: POPIA / DPIA updates for identity subprocessors.

**Exit criteria:** Verified-resident path end-to-end in staging with synthetic data; no PII in logs.

---

## Phase 3 — Weeks 9–11 (Treasury + governance)

**Paperclip:** [INK-46](http://127.0.0.1:3100/INK/issues/INK-46) · Subtasks INK-66–INK-71 · *Blocked by Phase 2*

- [ ] **P3.1** — Treasury Compact: communal NIGHT rules + positions spec.
- [ ] **P3.2** — DUST regeneration + subsidy rules (fee-less UX when treasury subsidizes).
- [ ] **P3.3** — Governance: proposals, confidential ballot model, auditable tallies.
- [ ] **P3.4** — Security audit: scope pack + vendor engaged (contract or RFP).
- [ ] **P3.5** — Audit remediation tracked to closure (reserved bucket).
- [ ] **P3.6** — Ops playbook: community onboarding coordinator + partner escalation.

**Exit criteria:** Audit scope agreed; critical findings triaged before any mainnet talk.

---

## Phase 4 — Week 12 (Hardening + template release)

**Paperclip:** [INK-47](http://127.0.0.1:3100/INK/issues/INK-47) · Subtasks INK-72–INK-77 · *Blocked by Phase 3*

- [ ] **P4.1** — QA matrix: devices × networks × Lace builds under test.
- [ ] **P4.2** — Regression automation expanded or gaps documented.
- [ ] **P4.3** — Performance + accessibility pass (bundle budget, a11y smoke).
- [ ] **P4.4** — [`release-checklist.md`](release-checklist.md) completed with evidence.
- [ ] **P4.5** — Template cloning guide: municipality config + identity adapter swap for non-ZA.
- [ ] **P4.6** — Catalyst / grant evidence bundle (screenshots, tag, demo script).

**Exit criteria:** Public template tag; README sufficient for third-party fork; grant pack stored.

---

## Partner enablement (parallel)

**Paperclip:** [INK-48](http://127.0.0.1:3100/INK/issues/INK-48) · Subtasks INK-78–INK-82

- [ ] **PA.1** — Joshua Project workshop + taxonomy updates.
- [ ] **PA.2** — Wave Point workshop + recreation / treasury ideas.
- [ ] **PA.3** — Victory / Frontline workshop + entertainment + youth safety notes.
- [ ] **PA.4** — CSALT graduate pilot cohort contacts + consent path.
- [ ] **PA.5** — Civic/faith briefing deck (plain language per `docs/comms/README.md`).

---

## Tooling (parallel)

**Paperclip:** [INK-49](http://127.0.0.1:3100/INK/issues/INK-49) · Subtasks INK-83–INK-87

- [ ] **T.1** — GitNexus: repo id `jbay-community-hub`; document `npx gitnexus analyze` after major merges.
- [ ] **T.2** — Replace `contracts/scripts/test-placeholder.mjs` with real Midnight Compact tests in CI.
- [ ] **T.3** — Secret scanning + dependency audit policy on `main`.
- [ ] **T.4** — Structured logging guidelines for identity-worker (correlation id only).
- [ ] **T.5** — Backup cadence: repo + Paperclip export ownership documented.

---

## Evergreen OSS criteria

- [ ] Repository public with Apache-2.0 (`LICENSE`) + `NOTICE`.
- [ ] `SECURITY.md` + `CONTRIBUTING.md` accurate for coordinated disclosure and PR flow.
- [ ] No secrets in git history (rotate + purge if leaked).
