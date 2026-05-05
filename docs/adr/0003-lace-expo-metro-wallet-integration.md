# ADR 0003 — Lace wallet integration with Expo and Metro

## Status

Accepted (2026-05-04)

## Context

Phase 1 milestones require **Lace** as the Cardano/Midnight-facing wallet for the Community Hub. The app ships as **React Native via Expo** (`apps/mobile`) inside a **pnpm** monorepo. **Metro** bundles workspace packages (`@jbay/shared`, `@jbay/config`, `@jbay/ui-tokens`) from source.

Constraints:

- Lace’s integration surface evolves (browser extension, DApp connector, mobile-capable APIs). RN/Expo compatibility differs from a pure web DApp.
- Metro resolves workspace packages like Node but does **not** mirror TypeScript `moduleResolution: NodeNext` `.js` re-exports when importing sibling files; shared modules consumed by the app should avoid fragile cross-file re-exports (see prior CI fixes).
- Catalyst reviewers expect a documented path even before code lands; this ADR records intent and trade-offs until the spike proves a concrete SDK/version pin.

## Decision

1. **Spike first**: Spike completed (2026-05-04). We will use Mesh SDK (`@meshsdk/react-native`) and CIP-30 compliant integration methods.
2. **Expo baseline**: The addition of wallet crypto libraries forces a transition from **Expo Go** to **Development builds** (`expo prebuild`).
3. **Metro / monorepo**: Keep wallet-facing code isolated under `apps/mobile` (and thin wrappers in `packages/*`) so Metro entry graphs stay predictable; avoid circular imports between workspace packages.
4. **Secrets & keys**: No mnemonic or staking keys in app state/logs; connect/sign flows follow Lace’s UX — we only orchestrate **sessions** and **transaction payloads** produced by official APIs once wired.
5. **Documentation**: Spike validated that `@meshsdk/react-native` and related cryptographic dependencies are required, moving the mobile app exclusively to Expo dev clients.

## Consequences

- Wallet UI in production waits on spike outcomes; mock MLS and Compact stubs can proceed in parallel.
- CI keeps **web export** smoke (`expo export --platform web`) as a bundle sanity check; Lace-specific behaviour still validates on **iOS/Android** targets.

## References

- Repository README — stack decisions table.
- Catalyst milestone checklist — Phase 1 Lace groundwork (`docs/catalyst/milestone-checklist.md`).
- Spike procedure & checklist: [`docs/runbooks/lace-spike.md`](../runbooks/lace-spike.md).
