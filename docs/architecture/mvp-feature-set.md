# MVP Feature Set — J-Bay Community Hub

## Status

**Defined:** 2026-05-07 · **Authority:** INK-37

## Core identity

The J-Bay Community Hub is a **reusable open-source civic MLS template** delivering browseable Education/Recreation/Entertainment (E/R/E) listings for municipalities worldwide. The pilot deploys for **Jeffreys Bay, SA** partners (Joshua Project, Wave Point, Victory Frontline, CSALT, faith network).

This is NOT a surf-detection/surf-spot app. The spec's "surf detection" reference is a copy-paste artifact from an earlier, archived project. Deleted in the next edit.

---

## MVP scope (ordered checklist)

### 1. ✅ MOBILE APP — Listing browse + detail (SHIPPED v0.1.0)

**Status: DONE** — already in `apps/mobile/`

- [x] Tab navigation: Education / Recreation / Entertainment
- [x] Listing browse (FlatList with cards)
- [x] Detail view (title, org, summary, schedule, proof requirements)
- [x] Seed data: 8 pilot listings across 4 partners
- [x] Draft CRUD (create, edit, delete) via modal form
- [x] Draft persistence (AsyncStorage)
- [x] i18n baseline: English (`en.ts`), Afrikaans (`af.ts`), Xhosa (`xh.ts`)
- [x] Wallet chip placeholder (Lace connect — spike pending)
- [x] Dark theme UI tokens (`@jbay/ui-tokens`)
- [x] Municipality config support (`@jbay/config`)
- [x] Shared types (`@jbay/shared` with Zod validation)

### 2. 🚧 TESTFLIGHT BETA — App distribution pipeline

**Status: IN PROGRESS** · INK-164 (P-MVP.2)

- [ ] EAS Build configuration (`eas.json`, `app.json` updates)
- [ ] Apple Developer account enrolled and linked
- [ ] TestFlight beta group created
- [ ] Build + upload pipeline proven end-to-end
- [ ] Internal testers added (Dean + 1-2 seed partners)

### 3. 🚧 IDENTITY WORKER — Altron/DHA batch verification (MVP tier)

**Status: IN PROGRESS** · INK-165 (P-MVP.3)

- [ ] Render free-tier deployment (Docker + web service)
- [ ] Altron sandbox valid credentials configured via env vars
- [ ] Dry-run test suite passes against sandbox
- [ ] `/health` endpoint responsive
- [ ] Queue stub: single-file batch from API ingress

### 4. 🚧 APPLE DEVELOPER ACCOUNT

**Status: IN PROGRESS** · INK-167 (P-MVP.5)

- [ ] Apple Developer Program enrollment ($99/year)
- [ ] App ID + Bundle ID registered
- [ ] Distribution certificate + provisioning profile created
- [ ] App Store Connect record created (name, screenshots, description)

### 5. 🚧 RENDER + ALTRON CREDENTIALS

**Status: IN PROGRESS** · INK-168 (P-MVP.6)

- [ ] Render account (free tier confirmed)
- [ ] Render web service pointing at `services/identity-worker`
- [ ] Altron sandbox credentials stored as Render env vars
- [ ] Deployment succeeds with `/health` 200

### 6. 🔜 PILOT LAUNCH — 8 seed partner listings live on TestFlight

**Status: BLOCKED** · INK-166 (P-MVP.4) · Depends on items 2, 3, 4

- [ ] TestFlight build with seed data installed on pilot devices
- [ ] Partner sign-off: Listing data accurate, org names correct
- [ ] Known limitations documented (wallet, proof requirements, on-chain)

### 7. 🔜 CATALYST FUND 15 SUBMISSION

**Status: BLOCKED** · INK-88 (umbrella) · [HUMAN]

- [ ] [Human] Cardano wallet ≥5 ADA (INK-89)
- [ ] [Human] Catalyst Keychain Proposer role (INK-90)
- [ ] [Human] Prior Catalyst milestone reporting complete (INK-91)
- [ ] [Human] USDM budget + Statement of Milestones 20/30/50 (INK-93)
- [ ] [Human] Team credentials & feasibility evidence (INK-94)
- [ ] [Human] Proof of Life — project lead availability (INK-92)
- [ ] Engineering: post-submit proposal + SoM linked in repo (INK-95)

### 8. 🔜 PHASE 2+ (OUT OF MVP)

The following are explicitly **out of scope** for MVP and deferred to Phases 2-4:

- Lace wallet production integration (Phase 1.2 — spike documented only)
- Midnight Compact smart contract deployment (stubs only in MVP)
- Verified resident ZK proofs
- Treasury & governance contracts
- Identity batch scheduler + metrics
- Zero-knowledge proof challenges
- Compliance / POPIA / DPIA documentation beyond MVP notes
- Audio/video call features
- Full municipality template swap guide
- Release hardening (Phase 4)

---

## Verification

```bash
cd ~/projects/jbay-community-hub
pnpm lint              # must pass
pnpm typecheck         # must pass
pnpm test              # must pass (contracts:test placeholder)
pnpm --filter @jbay/mobile start  # Expo dev starts
```

---

## Dependencies & chain

```
INK-162 Pilot TestFlight
  ├── INK-164 P-MVP.2 EAS build       ← requires INK-167 Apple Dev
  │   └── INK-167 P-MVP.5 Apple Account ← [HUMAN] sign-up
  ├── INK-165 P-MVP.3 identity-worker  ← requires INK-168 Render credentials
  │   └── INK-168 P-MVP.6 Render + Altron ← [HUMAN] sign-ups
  └── INK-166 P-MVP.4 Pilot launch     ← blocked on all above

INK-88 Catalyst submission            ← all [HUMAN] prerequisites
  ├── INK-89 Wallet
  ├── INK-90 Keychain
  ├── INK-91 Prior grants compliance
  ├── INK-93 USDM / SoM
  ├── INK-94 Team credentials
  └── INK-92 Proof of Life
```

---

## Seed partners

| Partner | Category | Listings |
|---------|----------|----------|
| Joshua Project | Education | AET modules, Life skills |
| Victory Gap Year | Education | Entrepreneurship lab |
| Wave Point Foundation | Recreation | Surf mentorship, Community gardens |
| Christian Surfers SA | Recreation | CSALT graduate pilot |
| Victory Frontline | Entertainment | Youth cultural events |
| Faith Network J-Bay | Education | Education & comms channel |
