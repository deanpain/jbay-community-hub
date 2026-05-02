# ADR 0003 — Lace wallet integration with Expo and Metro

## Status

Proposed — spike required before **Accepted** (2026-05-02)

## Context

Phase 1 milestones require **Lace** as the Cardano/Midnight-facing wallet for the Community Hub. The app ships as **React Native via Expo** (`apps/mobile`) inside a **pnpm** monorepo. **Metro** bundles workspace packages (`@jbay/shared`, `@jbay/config`, `@jbay/ui-tokens`) from source.

Constraints:

- Lace’s integration surface evolves (browser extension, DApp connector, mobile-capable APIs). RN/Expo compatibility differs from a pure web DApp.
- Metro resolves workspace packages like Node but does **not** mirror TypeScript `moduleResolution: NodeNext` `.js` re-exports when importing sibling files; shared modules consumed by the app should avoid fragile cross-file re-exports (see prior CI fixes).
- Catalyst reviewers expect a documented path even before code lands; this ADR records intent and trade-offs until the spike proves a concrete SDK/version pin.

## Decision

1. **Spike first**: Before hardening wallet UX, run a time-boxed spike (**physical device + simulator**) that verifies whichever Lace integration path is officially recommended for **React Native / Expo** at that time (native module vs injected WebView vs deep-link/browser companion — **to be confirmed against Lace + Midnight docs**).
2. **Expo baseline**: Stay on the supported Expo SDK line already pinned in `apps/mobile` unless Lace strictly requires a native module that forces **Expo dev client** / prebuild; document the outcome in this ADR when upgrading.
3. **Metro / monorepo**: Keep wallet-facing code isolated under `apps/mobile` (and thin wrappers in `packages/*`) so Metro entry graphs stay predictable; avoid circular imports between workspace packages.
4. **Secrets & keys**: No mnemonic or staking keys in app state/logs; connect/sign flows follow Lace’s UX — we only orchestrate **sessions** and **transaction payloads** produced by official APIs once wired.
5. **Documentation**: Update this ADR to **Accepted** with exact Lace package versions, Expo prebuild flags (if any), and simulator/device notes once the spike completes.

## Consequences

- Wallet UI in production waits on spike outcomes; mock MLS and Compact stubs can proceed in parallel.
- CI keeps **web export** smoke (`expo export --platform web`) as a bundle sanity check; Lace-specific behaviour still validates on **iOS/Android** targets.

## References

- Repository README — stack decisions table.
- Catalyst milestone checklist — Phase 1 Lace groundwork (`docs/catalyst/milestone-checklist.md`).
