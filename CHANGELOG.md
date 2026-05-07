# J-Bay Community Hub Changelog

AI-work changelog for J-Bay Community Hub. Every agent/code session that changes project state should add an entry here.

## Entry Convention

- date
- intent
- files changed
- tests or checks run
- risks, rollback notes, or follow-up work

## 2026-05-07

### Catalyst Fund 15 — partner enablement + documentation sprint

Intent: Create partner workshop enablement materials, runbooks, and Phase 4 release documentation for Catalyst F15 submission.

Files created:
- `docs/catalyst/feasibility-evidence.md` — One-pager on team capability
- `docs/runbooks/apple-developer-setup.md` — Apple Developer account guide
- `docs/runbooks/render-identity-worker-setup.md` — Render + Altron credentials guide
- `docs/partners/workshops/_template.md` — Workshop template
- `docs/partners/workshops/plan-joshua-project.md` — Joshua Project workshop plan
- `docs/partners/workshops/plan-wave-point.md` — Wave Point workshop plan
- `docs/partners/workshops/plan-victory-frontline.md` — Victory/Frontline workshop plan
- `docs/partners/workshops/plan-csalt-pilot.md` — CSALT cohort workshop plan
- `docs/comms/briefings/civic-leader-deck.md` — Civic leader briefing
- `docs/partners/seed-data/_template.json` — Seed data template
- `docs/partners/listing-taxonomy.md` — Structured taxonomy with proof types and ZK compatibility
- `docs/catalyst/release-checklist.md` — Expanded with localization, accessibility, evidence bundle
- `docs/runbooks/municipality-swap.md` — Template cloning guide

Issues closed: INK-140 (Infrastructure workstream) — all 4 children (identity-worker cloud, mobile deployment pipeline, domain/DNS/SSL, IaC manifests) already done.

Blockers: All remaining 19 high/medium issues blocked on human actions (Apple Developer account, Render account, wallet setup, Catalyst Keychain, partner workshops scheduling).

### Infrastructure workstream closed

Intent: Verify and close INK-140 (Infrastructure and Deployment workstream).

Actions: Fetched all 4 child issues of INK-140. All completed. Posted closure comment with evidence.

## 2026-05-05

### Full issue audit + Phase 2 prioritisation

Intent: Analyse all 53 Paperclip issues for J-Bay Community Hub. Identify next actionable work.

Findings:
- Phase 1 (Weeks 1-4): All 8 child issues completed
- Phase 2 (Weeks 5-8): Active — INK-59 (encryption/KMS) done, INK-60 (batch scheduler) in todo
- Phase 3, 4: Backlog
- Catalyst Fund 15 (INK-88): High priority but mostly human-gated
- Overall: 10/53 done (19%)

Decision: Next actionable ticket is INK-60 (P2.3 — identity-worker batch scheduler).

### Catalyst Fund 15 — SoM draft + evidence bundle outline

Intent: Create Catalyst Fund 15 submission drafts.

Files created:
- `docs/catalyst/catalyst-fund15-som-draft.md` — Statement of Milestones (20/30/50 USDM split)
- `docs/catalyst/grant-evidence-bundle.md` — Evidence bundle outline for INK-77

Blockers: Live ADA/USD exchange rate needed. All child issues (INK-89 wallet, INK-90 Keychain, INK-91 prior reporting, etc) marked [Human] and require proposer action.

## 2026-05-07

### AD.1 — Supabase schema + seed data (INK-187)

Intent: Create 5 database tables and seed 8 partner listings for the admin backend.

Files created:
- `apps/admin/migrations/001_create_tables.sql` — 5 tables (partners, listings, identity_batches, verified_residents, admins) with RLS, indexes, and updated_at trigger
- `apps/admin/migrations/002_seed_data.sql` — 8 partner orgs and 8 listings (3 education, 3 recreation, 2 entertainment)

Status: SQL migration files created. Requires Supabase credentials (SUPABASE_URL + SERVICE_ROLE_KEY) to run against the J-Bay Supabase instance.
