# Catalyst milestone checklist

Maps repository delivery phases to typical **Midnight Compact DApps** expectations (functional Compact, mobile UI, Lace, tests, public OSS).

## Phase 1 — Weeks 1–4 (Core MLS + Lace groundwork)

- [ ] Mobile shell lists three tabs (`Education`, `Recreation`, `Entertainment`) driven by `packages/config`.
- [ ] Listing CRUD UX wired to mocked/stub contract layer (pending Midnight bindings).
- [ ] Lace connect / session bootstrap spike documented in `docs/adr/` once SDK constraints confirmed.
- [ ] CI green for lint + typecheck + placeholder contract tests.

## Phase 2 — Weeks 5–8 (ZK identity + Altron batch)

- [ ] `verified_resident` Compact module replaces stub with proofs aligned to VC schemas.
- [ ] `services/identity-worker` performs production-grade encryption + batch flush metrics.
- [ ] Identus/Midnames integration paths documented with sandbox credentials policy.

## Phase 3 — Weeks 9–11 (Treasury + governance)

- [ ] `treasury_governance` Compact module models communal NIGHT + DUST delegation strategy.
- [ ] External security review scoped + findings tracked privately until disclosure OK.

## Phase 4 — Week 12 (Hardening + template release)

- [ ] Complete QA matrix + regression automation where feasible.
- [ ] Release checklist (`release-checklist.md`) satisfied.
- [ ] README describes template cloning + municipality swap steps.

## Evergreen OSS criteria

- [ ] Repository public with Apache-2.0 (`LICENSE`) + `NOTICE`.
- [ ] SECURITY.md + contributing docs accurate.
- [ ] No leaked secrets in git history (rotate if accidental leak occurs).
