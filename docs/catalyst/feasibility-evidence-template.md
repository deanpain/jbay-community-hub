# Feasibility / Capability Evidence

> Template for Catalyst Fund 15 — Midnight Compact DApps category
> Last updated: 2026-05-07

**Purpose:** Provide reviewers with verifiable evidence that the InkPixel/J-Bay team has the capability to deliver the Midnight Compact DApps proposal. This document supports the **Feasibility / capability** scoring criterion.

## 1. Team Lead — Dean Payne

| Field | Detail |
|-------|--------|
| GitHub Profile | _[Add link: github.com/deanpain]_ |
| Role | Project Lead / CEO — InkPixel AI |
| Prior Catalyst Experience | _[Add: prior funded proposals, milestone reports, or "None"]_ |
| Relevant OSS Work | _[List repos or link to relevant open source contributions]_ |

**Past Deliverables**

| Project | Description | Link |
|---------|-------------|------|
| InkPixel AI | AI agent orchestration platform | _[Add link/description]_ |
| SurfSpot Discovery | Surf spot data product | _[Add link/description]_ |
| Hermes Agent | Open-source agent framework | _[Add link/description]_ |
| Major Diary | Agent memory project | _[Add link/description]_ |
| _[Add more]_ | | |

## 2. Team Composition

| Role | Person | Expertise |
|------|--------|-----------|
| Project Lead / CEO | Dean Payne | Product strategy, agent orchestration, full-stack development |
| CTO (agent) | Codex/OpenCode | Smart contract development (Compact), identity pipeline, mobile |
| Engineering (agent) | Anti (Antigravity) | Backend services, deployment, integration testing |
| _[Add human team members]_ | | |
| _[Add advisors/partners]_ | | |

## 3. Technical Track Record

### Blockchain & Cardano Ecosystem

- **Hermes Agent**: Multi-model agent orchestration framework deployed in production
- **Midnight Compact**: Verified resident contract implementation (`contracts/verified_resident.compact.ts`)
- **Lace Wallet**: Integration spike completed; production path documented in ADR
- **Mesh SDK**: Wallet connect/disconnect integration completed (P-MVP.1)

### Identity & Verification

- **Identus** (Hyperledger Identus): VC issuance and anchoring flow implemented
- **Midnames** (`did:midnight`): Mobile DID module ready for wallet integration
- **Altron/DHA**: Batch verification client architecture completed; sandbox credentials pending

### Mobile & Web

- **React Native / Expo**: Full mobile MLS application with partner taxonomy (8 seed listings)
- **i18n**: English baseline extracted; Afrikaans/Xhosa roadmap documented
- **CI/CD**: GitHub Actions, lint/typecheck/test gates enforced

## 4. Infrastructure & Tooling

| Capability | Evidence |
|------------|----------|
| Public Repo | https://github.com/deanpain/jbay-community-hub |
| License | Apache-2.0 |
| CI Pipeline | GitHub Actions — lint, typecheck, test on main |
| GitNexus Indexed | Code graph analysis configured |
| Infrastructure-as-Code | Terraform (dev/staging/prod), Render config |

## 5. Community & Partnerships

| Partner | Focus Area | Status |
|---------|-----------|--------|
| Joshua Project | Education listings (AET, life skills) | Workshop pending |
| Wave Point | Recreation, surf leadership, community programs | Workshop pending |
| Victory / Frontline | Entertainment, youth safety | Workshop pending |
| CSALT | Graduate pilot cohort | Contacts pending |

## 6. Compliance & Governance

- **POPIA / DPIA**: Identity pipeline compliance update completed
- **Open Source**: Apache-2.0 from day one
- **Security**: `SECURITY.md`, `CONTRIBUTING.md` in repo

---

## Instructions for Dean

1. Replace all `_[Add ...]_` placeholders with actual links and details
2. Add any human team members (co-proposers, partners named on the proposal)
3. Add links to any prior Catalyst proposals and milestone reports if applicable
4. Commit this to `docs/catalyst/` and reference in the proposal body
5. If desired, sanitize for public submission and link from the Catalyst form
