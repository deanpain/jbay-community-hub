# Catalyst / Grant Evidence Bundle — P4.6

## Purpose
Evidence pack for Catalyst Fund 15 reviewers and close-out (linked in Paperclip as INK-77 output).

## Contents

### 1. Screenshots
- Mobile app: Education, Recreation, Entertainment surfaces
- Identity worker: dry-run output showing batch processing
- Compact contracts: deployment/log output
- CI pipeline: badge or screenshot showing passing lint, typecheck, tests

### 2. Transaction samples (sanitized)
- (To be captured during staging dry-runs — no prod/real funds)
- Format: JSON logs with PII redacted

### 3. Repo tag
- Each milestone gets a GitHub tag (v1.0-m1, v1.0-m2, v1.0-m3 or similar)
- Post-paste tag reference: `git tag -a v1.0-m1 -m "Catalyst Fund 15 — M1 evidence"`

### 4. Demo script
- Step-by-step walkthrough for each milestone
- Format: `docs/catalyst/demo-script-m1.md`, `docs/catalyst/demo-script-m2.md`, etc.

### 5. CI & test evidence
- Current state: `pnpm lint`, `pnpm typecheck`, `pnpm test` all passing
- CI config verified: pnpm version pinned, Node 24, multi-job

### 6. Open-source compliance
- LICENSE: Apache-2.0
- NOTICE: present
- SECURITY.md: present
- CONTRIBUTING.md: present
- README: present with setup instructions

---

## Current state (May 2026)

| Item | Status |
|------|--------|
| Screenshots | Not yet captured (waiting on mobile build deployment) |
| TX samples | Not yet generated (staging identity-worker dry-run) |
| Repo tags | None created yet (no public release milestone reached) |
| Demo script | Not written — template created at `docs/catalyst/demo-script-template.md` |
| CI evidence | Commands pass locally (verified today) |

## Next actions

1. [ ] Capture screenshots once mobile build is deployed
2. [ ] Run `git tag` at each milestone
3. [ ] Write demo script after M1 deliverables are stable
4. [ ] Zip or folder link posted in Paperclip comment when complete
