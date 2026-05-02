# Runbook — Lace wallet spike (Expo / React Native)

Time-boxed discovery before locking dependencies or UX. Outcomes feed **ADR 0003** (`docs/adr/0003-lace-expo-metro-wallet-integration.md`).

## Preconditions

- **Repos**: This monorepo cloned; `pnpm install`; `pnpm --filter @jbay/mobile start` runs on developer machine.
- **Targets**: At least one **physical device** (Android + iOS if possible) **and** simulators/emulators — Wallet behaviour often differs from export-only web.
- **Human**: Cardano test wallet / funded addresses only when docs explicitly allow devnets — never commit mnemonics or keys.

## Sources to verify (refresh URLs from official sites)

Check current guidance from:

- **Lace** (browser/mobile/extension capabilities and any RN or mobile SDK notes).
- **Midnight** developer docs (network selector, DApp connector expectations for Compact-backed flows).
- **Expo** docs for **custom native modules** and **development builds** if Lace requires code outside pure JS.

Record exact doc titles + dates in the spike notes section below.

## Spike checklist

### A — Integration surface

- [ ] Identify whether Lace integration for **mobile** is: native SDK, WebView bridge, universal links / browser tab, or hybrid.
- [ ] List npm/package names and minimum versions (if any) alongside peer deps (React Native version, Hermes, etc.).
- [ ] Confirm licence compatibility with **Apache-2.0** this repo uses.

### B — Expo compatibility

- [ ] Confirm spike runs on **Expo Go** or requires **development build** / `expo prebuild`.
- [ ] If native code is required: capture **iOS** and **Android** build steps and CI implications (not expected in Phase 1 CI yet).

### C — Flows to validate (minimal)

- [ ] **Connect / session**: Establish whatever “connected” means for the chosen integration (even mock network).
- [ ] **Sign / prove**: One signing or proof step aligned with future MLS / Compact submission (may use placeholder payload).
- [ ] **Disconnect / errors**: User-visible failure path (no credentials in logs).

### D — Monorepo / Metro

- [ ] Wallet SDK imports resolve under Metro from `apps/mobile` without duplicate React or broken workspace symlinks.
- [ ] No secrets or recovery phrases in Metro logs or Flipper.

## Spike notes (fill during spike)

| Field | Value |
|-------|--------|
| Date | |
| Lace doc URLs / versions | |
| Expo mode (Go vs dev client) | |
| Packages added (`package.json`) | |
| iOS result (device / simulator) | |
| Android result (device / emulator) | |
| Blockers | |

## When done

1. Paste the table + summary into the PR or Paperclip issue for **INK** Lace groundwork.
2. Update **ADR 0003** status to **Accepted** with concrete versions and constraints.
3. Replace the in-app wallet placeholder (`Alert`) with real navigation/state when integration lands.
