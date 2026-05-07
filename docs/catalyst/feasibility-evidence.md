# Feasibility & Capability Evidence — J-Bay Community Hub

> Catalyst Fund 15 · Midnight: Compact DApps category  
> **Prepared:** May 07, 2026 (pre-submission draft)

---

## Project Lead

| Field | Detail |
|-------|--------|
| Name | Dean Payne |
| GitHub | [github.com/deanpain](https://github.com/deanpain) — active since 2024 |
| Key repos | [jbay-community-hub](https://github.com/deanpain/jbay-community-hub) — full-stack monorepo (Expo/React Native, NestJS, Compact smart contracts) |
| Past Catalyst | Prior Catalyst submissions with milestone reporting compliance [verified] |
| Location | Jeffreys Bay, Eastern Cape, South Africa — direct community stake |

> *Lead is available for recorded video verification (Proof of Life) if funded.*

---

## Technical Stack & Delivery Capability

| Component | Technology | Status |
|-----------|-----------|--------|
| Mobile app | Expo SDK 52 · React Native · TypeScript | Listing browse UI complete; Lace wallet integration in progress |
| Backend | NestJS · PostgreSQL (Neon) · Render deploy | API scaffolding live; identity-worker stubbed |
| Smart contracts | Midnight Compact · `contracts/` directory | Listings stub → Bulletin Board · Verified-resident stub |
| Identity | Hyperledger Identus · Midnames (`did:midnight`) | Specs and ADR documented; integration staging |
| CI/CD | GitHub Actions · pnpm workspaces · EAS Build | Lint, typecheck, test, and contract checks gated on `main` |
| Infrastructure | Render (backend + worker) · Vercel (web) · Expo (mobile build) | Free-tier deploy pattern documented |
| i18n | English baseline extracted; Afrikaans/Xhosa path scoped | In-code strings externalized |

---

## Open Source Commitment

- **License:** Apache-2.0 (`LICENSE` + `NOTICE` in repo root)
- **Public since day one** — no private-only development period
- **Template philosophy:** Any municipality can fork, swap config + identity adapter, and deploy
- **Contributing:** `CONTRIBUTING.md` with PR flow; `SECURITY.md` for coordinated disclosure

---

## Prior Delivery Evidence

| What | Link / Reference |
|------|-----------------|
| Public monorepo | [github.com/deanpain/jbay-community-hub](https://github.com/deanpain/jbay-community-hub) |
| ADR decision records | `docs/adr/0001-*` through `docs/adr/0003-*` — architectural decisions with rationale |
| CI passing badge | GitHub Actions — status on README |
| Catalyst readiness | Fund rules compliance documented at `docs/catalyst/catalyst-fund15-requirements.md` |
| Partner engagement | Workshop plans for Joshua Project, Wave Point, Victory/Frontline, CSALT graduate cohort |

---

## Value for Money (Reviewer Framing)

> This is not a one-town solution. Every component — from the Midnight Compact contracts to the identity adapter — is built as an open-source template. Any municipality worldwide can fork the repository, swap their local configuration and identity provider, and deploy their own community hub. Catalyst funding for Jeffreys Bay becomes a **public good that scales globally**.

---
*Paste this document's URL or link its path in the Catalyst proposal Feasibility section.*
