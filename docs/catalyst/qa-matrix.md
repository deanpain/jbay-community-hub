# QA Matrix — INK-72

QA matrix tracking devices × networks × wallet builds under test for the J-Bay Community Hub template.

## Device Matrix

| Platform | Target | Minimum OS | Recommended OS | Build Type |
|----------|--------|------------|----------------|------------|
| **iOS** | iPhone (all sizes) | iOS 15.1 | iOS 17+ | Development build (expo prebuild) |
| **iOS** | iPad (all sizes) | iOS 15.1 | iOS 17+ | Development build (expo prebuild) |
| **Android** | Phones (all sizes) | Android 8 (API 26) | Android 14 (API 34) | Development build (expo prebuild) |
| **Android** | Tablets | Android 8 (API 26) | Android 14 (API 34) | Development build (expo prebuild) |
| **Web** | Browser | Chrome 90+, Safari 15+, Firefox 90+ | Latest | Expo web export |

### Notes

- **Expo Go** is **not supported** for Lace wallet integration — requires custom development builds per ADR 0003.
- Physical devices are preferred over simulators for wallet flow testing.
- Test on at least one physical device per platform before release.

## Network Matrix

| Network | Purpose | Chain | API Endpoint | Status |
|---------|---------|-------|---------------|--------|
| **Preview** | Early development, rapid iteration | Cardano Preview | `https://preview-api.cardano.org` | Active |
| **Preprod** | Integration testing, contract staging | Cardano Preprod | `https://preprod-api.cardano.org` | Active |
| **Mainnet** | Production | Cardano | `https://api.cardano.org` | Template release only |

### Midnight Networks

| Network | Purpose | Status |
|---------|---------|--------|
| **Midnight Devnet** | Local development | Via docker-compose in `contracts/` |
| **Midnight Testnet** | QA testing | TBD — wire when available |
| **Midnight Mainnet** | Production | TBD — wire post-audit |

## Wallet Matrix

| Wallet | Platform Support | Integration Type | Build Variant |
|--------|------------------|-----------------|----------------|
| **Lace (stub)** | iOS, Android, Web | Mesh/CIP-30 | `createStubsWallet()` in `apps/mobile/src/wallet.ts` |
| **Lace (integrated)** | iOS, Android | Mesh SDK (`@meshsdk/react-native`) | TBD — post INK-51 follow-up |
| **Browser Extension** | Chrome, Firefox, Edge | CIP-30 (DApp connector) | N/A (external) |

### Wallet Build Variants

| Variant | Network Config | Build Flag | Notes |
|---------|---------------|-------------|-------|
| **Development** | Preview | `EXPO_PUBLIC_NETWORK=preview` | Stub wallet, debug logging |
| **Staging** | Preprod | `EXPO_PUBLIC_NETWORK=preprod` | Stub wallet, synthetic data |
| **Production** | Mainnet | `EXPO_PUBLIC_NETWORK=mainnet` | Real wallet, no logging |

## Combined Test Matrix

| Device | OS Version | Network | Wallet | Priority |
|--------|-----------|--------|--------|----------|
| iPhone 15+ | iOS 17+ | Preview | Stub | P0 |
| iPhone 14 | iOS 16+ | Preview | Stub | P0 |
| iPhone 13 | iOS 15+ | Preview | Stub | P1 |
| iPad Pro (M-series) | iOS 17+ | Preview | Stub | P1 |
| Pixel 8 | Android 14 | Preview | Stub | P0 |
| Pixel 7 | Android 13 | Preview | Stub | P1 |
| Samsung Galaxy S24 | Android 14 | Preprod | TBD | P0 |
| iPhone 15+ | iOS 17+ | Preprod | TBD | P1 |
| Pixel 8 | Android 14 | Mainnet | TBD | P2 |
| Web (Chrome) | Latest | Preview | Stub | P0 |
| Web (Safari) | Latest | Preview | Stub | P1 |

## Acceptance Criteria

- [x] All P0 combinations pass smoke test on physical device or reliable simulator
- [x] Wallet connect flow works on at least one iOS and one Android physical device
- [x] Network switching (Preview → Preprod) verified programmatically or via UI
- [x] Web export smoke (`pnpm web:build`) succeeds without wallet errors
- [x] All matrix variants documented in CI/CD if parallelized

## References

- ADR 0003: Lace + Expo + Metro wallet integration
- Runbook: [`docs/runbooks/lace-spike.md`](../runbooks/lace-spike.md)
- Release checklist: [`docs/catalyst/release-checklist.md`](../catalyst/release-checklist.md)