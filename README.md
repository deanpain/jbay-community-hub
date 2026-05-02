# J-Bay Community Hub

Open-source monorepo for the **J-Bay Community Hub** pilot: a mobile-first, Midnight-based private MLS template (Education, Recreation, Entertainment) with Lace wallet integration, batched Altron/DHA identity verification, and community treasury mechanics.

## Repository decisions (implementation baseline)

| Decision | Choice | Notes |
|----------|--------|--------|
| **Root path** | This repository root | Deployments clone into `jbay_community` or rename as needed. |
| **License** | **Apache-2.0** | See [`LICENSE`](LICENSE). |
| **Mobile stack** | **React Native** via **Expo** + TypeScript (`apps/mobile`) | Aligns with mobile-first delivery; **confirm Lace SDK binding** against current Lace + RN/Expo guidance before wallet integration hardens. |
| **Package manager** | **pnpm** workspaces | `pnpm-workspace.yaml` includes `apps/*`, `packages/*`, `services/*`. |

## Layout

- `apps/mobile` — Expo application (tabs + Lace integration to follow Catalyst milestones).
- `packages/shared` — Shared TypeScript types and schemas.
- `packages/config` — Per-deployment municipality config samples.
- `packages/ui-tokens` — Shared design tokens for consistent UI.
- `contracts` — Midnight **Compact** modules (stubs until toolchain CI is wired).
- `services/identity-worker` — Async batch identity queue processor (Altron/DHA path).
- `services/api` — Optional BFF placeholder.
- `docs/` — Architecture, ADRs, Catalyst checklist, partner taxonomy, comms, compliance, runbooks.

## Commands

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm contracts:test
pnpm --filter @jbay/mobile start
```

## Documentation

- Architecture overview: [`docs/architecture/overview.md`](docs/architecture/overview.md)
- ADR 0003 — Lace + Expo + Metro wallet path (spike pending): [`docs/adr/0003-lace-expo-metro-wallet-integration.md`](docs/adr/0003-lace-expo-metro-wallet-integration.md)
- Catalyst milestones (checkbox + Paperclip IDs): [`docs/catalyst/milestone-checklist.md`](docs/catalyst/milestone-checklist.md)
- **Catalyst Fund 15 / Midnight category:** USDM, prerequisites, reviewer framing — [`docs/catalyst/catalyst-fund15-requirements.md`](docs/catalyst/catalyst-fund15-requirements.md)
- **Statement of Milestones (3 × monthly, 20/30/50 USDM split):** [`docs/catalyst/statement-of-milestones-template.md`](docs/catalyst/statement-of-milestones-template.md)
- Paperclip roadmap (INK subtasks **INK-50**–**INK-87**, local dashboard links): [`docs/catalyst/paperclip-roadmap.md`](docs/catalyst/paperclip-roadmap.md)
- Partner taxonomy: [`docs/partners/listing-taxonomy.md`](docs/partners/listing-taxonomy.md)
- Contributing / security: [`CONTRIBUTING.md`](CONTRIBUTING.md), [`SECURITY.md`](SECURITY.md)

## Disclaimer

This codebase is an early scaffold. Smart contracts, identity integrations, and wallet flows require auditing and alignment with Midnight, Lace, Altron, Identus, and Midnames production documentation before mainnet use.
