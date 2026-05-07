# OSS Template Structure — Municipality Swap Guide

> How to fork the J-Bay Community Hub template and adapt it for a different city.

---

## Architecture Overview

```
jbay-community-hub/
├── apps/
│   └── mobile/          # Expo/React Native mobile app
│       ├── app.json     # App config (name, slug, bundle identifier)
│       ├── eas.json     # EAS Build profiles
│       └── src/         # React Native source
├── services/
│   ├── api/             # Backend API service
│   └── identity-worker/ # ZK identity verification worker
├── contracts/           # Midnight Compact smart contracts
├── packages/
│   └── config/          # ** SHARED CONFIG ** — municipality-specific settings
├── infra/               # Terraform / infrastructure as code
└── docs/
    ├── catalyst/        # Grant compliance & evidence
    ├── partners/        # Partner workshop plans & seed data
    ├── deployment/      # Deploy guides (Render, EAS, etc.)
    ├── runbooks/        # Operational runbooks
    └── adr/             # Architecture Decision Records
```

---

## Municipality-Specific Configuration

All municipality-specific settings live in `packages/config/`. To swap to a new city:

### 1. Create a new config file

```typescript
// packages/config/src/municipalities/cape-town.ts
export const capeTownConfig: MunicipalityConfig = {
  slug: 'cape-town',
  name: 'Cape Town',
  locale: 'en-ZA',
  supportedLanguages: ['en', 'af', 'xh'],
  defaultLanguage: 'en',

  // Geolocation bounds for listing search
  bounds: {
    north: -33.9,
    south: -34.0,
    east: 18.5,
    west: 18.3,
  },

  // Feature flags
  features: {
    identityVerification: true,
    tenantScreening: true,
    multilingualListings: false,
    nightTokenTreasury: false, // J-Bay only for pilot
  },

  // Partner orgs specific to this municipality
  partners: {
    anchorOrgs: [],
    listingSources: [],
  },
};
```

### 2. Register in the config index

```typescript
// packages/config/src/index.ts
export { jbayConfig } from './municipalities/j-bay';
export { capeTownConfig } from './municipalities/cape-town';
```

### 3. Set the active municipality via env var

```env
NEXT_PUBLIC_MUNICIPALITY=j-bay
# or
EXPO_PUBLIC_MUNICIPALITY=j-bay
```

---

## Identity Adapter Boundary

The identity-worker service follows a **strategy pattern** for interchangeable identity providers.

### Interface

```typescript
// services/identity-worker/src/adapters/types.ts
export interface IdentityProviderAdapter {
  /** Verify a government ID number */
  verifyId(idNumber: string): Promise<VerificationResult>;

  /** Check identity against a national database */
  checkIdentity(payload: IdentityCheckRequest): Promise<IdentityCheckResponse>;

  /** Health check for the provider */
  health(): Promise<HealthStatus>;
}
```

### Current implementation: Altron/DHA

```
services/identity-worker/src/adapters/
├── altron.adapter.ts     # Altron DHA verification
└── types.ts              # Provider interface + types
```

### To swap for a different provider

1. Create a new adapter implementing `IdentityProviderAdapter`
2. Register it in `services/identity-worker/src/adapters/index.ts`
3. Set the active adapter via env var: `IDENTITY_PROVIDER=altron|mock|your-provider`

### Mock adapter (for development)

```typescript
// services/identity-worker/src/adapters/mock.adapter.ts
// Available when IDENTITY_PROVIDER=mock
// Returns plausible fake data — no real API keys needed
```

---

## Quick Fork Steps

```bash
# 1. Clone
git clone https://github.com/deanpain/jbay-community-hub.git my-city-hub
cd my-city-hub

# 2. Install
corepack enable
pnpm install

# 3. Configure municipality
# Edit packages/config/src/index.ts — set your municipality config
# Edit apps/mobile/app.json — update name, slug, bundleIdentifier

# 4. Set environment
cp .env.example .env
# Set MUNICIPALITY, identity provider, API keys

# 5. Remove J-Bay specific content
rm -rf docs/catalyst/        # Grant evidence — your own grant
rm -rf catalyst-evidence-bundle/

# 6. Verify
pnpm -r run typecheck
pnpm -r run test

# 7. Deploy
# Follow docs/deployment/ guides
```
