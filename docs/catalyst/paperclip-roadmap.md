# Paperclip roadmap (INKPIXEL)

Execution tracking lives in **Paperclip** (company **INKPIXEL**, issue prefix **INK**). Local dashboard (when running): `http://127.0.0.1:3100`.

**Catalyst submission:** Use [`statement-of-milestones-template.md`](statement-of-milestones-template.md) for the **3 monthly milestones** and **USDM** budget (20/30/50 split). INK tasks are **internal** and supplement—not replace—the Statement of Milestones.

| Artifact | Link |
|----------|------|
| **Project** | [J-Bay Community Hub](http://127.0.0.1:3100/INK/projects/j-bay-community-hub) |
| **GitHub** | https://github.com/deanpain/jbay-community-hub |
| **Epic (parent)** | [INK-43 — Catalyst roadmap](http://127.0.0.1:3100/INK/issues/INK-43) |

Phase issues use **sequential blockers**: Phase 2 waits on Phase 1, etc. Partner (**INK-48**) and tooling (**INK-49**) workstreams run in parallel unless you add explicit blockers in Paperclip.

---

## Phase 1 — [INK-44](http://127.0.0.1:3100/INK/issues/INK-44) (Weeks 1–4 · MLS + Lace)

| ID | Subtask |
|----|---------|
| [INK-50](http://127.0.0.1:3100/INK/issues/INK-50) | P1.1 — Listing browse + detail UI (mock contract layer) |
| [INK-51](http://127.0.0.1:3100/INK/issues/INK-51) | P1.2 — Lace wallet: connect, network, session spike |
| [INK-52](http://127.0.0.1:3100/INK/issues/INK-52) | P1.3 — ADR: Lace + Expo + Metro monorepo binding |
| [INK-53](http://127.0.0.1:3100/INK/issues/INK-53) | P1.4 — `listings.compact.stub` → first cut toward Bulletin Board pattern |
| [INK-54](http://127.0.0.1:3100/INK/issues/INK-54) | P1.5 — Partner taxonomy in app (read-only seed) |
| [INK-55](http://127.0.0.1:3100/INK/issues/INK-55) | P1.6 — i18n string extraction (EN baseline) |
| [INK-56](http://127.0.0.1:3100/INK/issues/INK-56) | P1.7 — CI: block regressions on `main` |
| [INK-57](http://127.0.0.1:3100/INK/issues/INK-57) | P1.8 — BFF optional: queue ingress for future identity |

---

## Phase 2 — [INK-45](http://127.0.0.1:3100/INK/issues/INK-45) (Weeks 5–8 · Identity + Altron batch)

_Blocking chain: depends on INK-44._

| ID | Subtask |
|----|---------|
| [INK-58](http://127.0.0.1:3100/INK/issues/INK-58) | P2.1 — Compact: verified resident gate (replace stub) |
| [INK-59](http://127.0.0.1:3100/INK/issues/INK-59) | P2.2 — identity-worker: encryption at rest + KMS assumptions |
| [INK-60](http://127.0.0.1:3100/INK/issues/INK-60) | P2.3 — identity-worker: batch scheduler + off-peak flush |
| [INK-61](http://127.0.0.1:3100/INK/issues/INK-61) | P2.4 — Altron sandbox: credentials, env, rate limits |
| [INK-62](http://127.0.0.1:3100/INK/issues/INK-62) | P2.5 — Cost model: DHA R1 batch vs R10 live (dashboards) |
| [INK-63](http://127.0.0.1:3100/INK/issues/INK-63) | P2.6 — Identus: VDR anchor + credential issuance flow |
| [INK-64](http://127.0.0.1:3100/INK/issues/INK-64) | P2.7 — Midnames: `did:midnight` + W3C VC handoff to mobile |
| [INK-65](http://127.0.0.1:3100/INK/issues/INK-65) | P2.8 — Compliance: POPIA / DPIA update for identity pipeline |

---

## Phase 3 — [INK-46](http://127.0.0.1:3100/INK/issues/INK-46) (Weeks 9–11 · Treasury + governance)

_Blocking chain: depends on INK-45._

| ID | Subtask |
|----|---------|
| [INK-66](http://127.0.0.1:3100/INK/issues/INK-66) | P3.1 — Compact: treasury + NIGHT position rules |
| [INK-67](http://127.0.0.1:3100/INK/issues/INK-67) | P3.2 — DUST regeneration + subsidy: product rules |
| [INK-68](http://127.0.0.1:3100/INK/issues/INK-68) | P3.3 — Governance: proposals + confidential ballot model |
| [INK-69](http://127.0.0.1:3100/INK/issues/INK-69) | P3.4 — Security audit: scope pack + vendor selection |
| [INK-70](http://127.0.0.1:3100/INK/issues/INK-70) | P3.5 — Audit remediation sprint (reserved) |
| [INK-71](http://127.0.0.1:3100/INK/issues/INK-71) | P3.6 — Ops: community onboarding coordinator playbook |

---

## Phase 4 — [INK-47](http://127.0.0.1:3100/INK/issues/INK-47) (Week 12 · Hardening + release)

_Blocking chain: depends on INK-46._

| ID | Subtask |
|----|---------|
| [INK-72](http://127.0.0.1:3100/INK/issues/INK-72) | P4.1 — QA matrix: devices × networks × wallets |
| [INK-73](http://127.0.0.1:3100/INK/issues/INK-73) | P4.2 — Regression automation (where feasible) |
| [INK-74](http://127.0.0.1:3100/INK/issues/INK-74) | P4.3 — Performance + accessibility pass |
| [INK-75](http://127.0.0.1:3100/INK/issues/INK-75) | P4.4 — Release: satisfy `release-checklist.md` |
| [INK-76](http://127.0.0.1:3100/INK/issues/INK-76) | P4.5 — Template cloning guide + municipality swap |
| [INK-77](http://127.0.0.1:3100/INK/issues/INK-77) | P4.6 — Catalyst / grant evidence bundle |

---

## Partner workstream — [INK-48](http://127.0.0.1:3100/INK/issues/INK-48)

| ID | Subtask |
|----|---------|
| [INK-78](http://127.0.0.1:3100/INK/issues/INK-78) | PA.1 — Workshop: Joshua Project (Education listings) |
| [INK-79](http://127.0.0.1:3100/INK/issues/INK-79) | PA.2 — Workshop: Wave Point (Recreation + treasury ideas) |
| [INK-80](http://127.0.0.1:3100/INK/issues/INK-80) | PA.3 — Workshop: Victory / Frontline (Entertainment + youth) |
| [INK-81](http://127.0.0.1:3100/INK/issues/INK-81) | PA.4 — CSALT graduate pilot cohort |
| [INK-82](http://127.0.0.1:3100/INK/issues/INK-82) | PA.5 — Civic / faith leader briefing deck (plain language) |

---

## Tooling workstream — [INK-49](http://127.0.0.1:3100/INK/issues/INK-49)

| ID | Subtask |
|----|---------|
| [INK-83](http://127.0.0.1:3100/INK/issues/INK-83) | T.1 — GitNexus: document repo id + when to re-analyze |
| [INK-84](http://127.0.0.1:3100/INK/issues/INK-84) | T.2 — Midnight Compact: CI hook replaces `test-placeholder.mjs` |
| [INK-85](http://127.0.0.1:3100/INK/issues/INK-85) | T.3 — Secret scanning + dependency audit in CI |
| [INK-86](http://127.0.0.1:3100/INK/issues/INK-86) | T.4 — Observability: structured logs for identity-worker |
| [INK-87](http://127.0.0.1:3100/INK/issues/INK-87) | T.5 — Backup / disaster: repo + Paperclip issue export cadence |

---

## Maintainer note

If Paperclip host URL or company prefix differs in production, replace `http://127.0.0.1:3100` and `/INK/` paths accordingly. Issue numbers (**INK-xx**) are authoritative in your Paperclip instance.
