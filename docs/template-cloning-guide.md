# J-Bay Community Hub — Template Cloning Guide

This guide explains how to fork and customize the J-Bay Community Hub for your own municipality.

## Prerequisites

- GitHub account
- Node.js 24+, pnpm
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [OpenTofu](https://opentofu.org/) ≥ 1.6 (or Terraform)
- A [Render](https://render.com) account (for identity-worker hosting)

## Step 1: Fork the Repository

```bash
# Clone your fork
git clone https://github.com/YOUR_ORG/jbay-community-hub.git
cd jbay-community-hub
pnpm install
```

## Step 2: Configure Your Municipality

Edit `packages/config/municipality.json`:

```json
{
  "name": "Your Town",
  "region": "Eastern Cape, South Africa",
  "domain": "yourtown.org",
  "features": {
    "identity_verification": true,
    "lace_wallet": true,
    "treasury": false
  }
}
```

| Field | Description |
|-------|-------------|
| `name` | Municipality display name (appears in app header) |
| `region` | Geographic region for partner discovery |
| `domain` | Production domain (leave blank for dev) |
| `features.identity_verification` | Enable Altron/DHA batch verification |
| `features.lace_wallet` | Enable Cardano/Midnight wallet integration |
| `features.treasury` | Enable NIGHT/DUST community treasury |

## Step 3: Set Identity Provider

Edit `packages/config/identity-adapter.ts`:

```typescript
// South Africa: Altron/DHA batch verification
// Other regions: implement a compatible adapter
export const identityAdapter = process.env.IDENTITY_ADAPTER === "custom"
  ? await import("./adapters/custom")
  : await import("./adapters/altron-dha");
```

For non-SA deployments, implement the `IdentityAdapter` interface:

```typescript
export interface IdentityAdapter {
  name: string;
  verify(citizenId: string): Promise<VerificationResult>;
  batch(citizenIds: string[]): Promise<BatchResult>;
}
```

## Step 4: Deploy

### Mobile App

```bash
# Build for TestFlight
cd apps/mobile
eas build --platform ios --profile development

# Build for Play Store
eas build --platform android --profile development
```

### Identity Worker

```bash
cd infra
tofu workspace new yourtown
tofu workspace select yourtown
tofu apply -var-file="yourtown/terraform.tfvars"
```

## Step 5: Branding

Update the following files for your municipality's look:

| File | Change |
|------|--------|
| `apps/mobile/app.json` | App name, icon, splash screen |
| `apps/mobile/src/i18n/en.ts` | Welcome text, terms, footer |
| `infra/prod/terraform.tfvars` | Domain name, production settings |

## Architecture Overview

```
┌─────────────────────┐     ┌──────────────────┐
│  Mobile App (Expo)  │────▶│  Identity Worker │
│  - Listing browse   │     │  - Altron/DHA    │
│  - Lace wallet      │     │  - Identus VC    │
│  - VC display       │     │  - Batch queue   │
└─────────────────────┘     └──────────────────┘
         │                           │
         ▼                           ▼
┌─────────────────────┐     ┌──────────────────┐
│  Midnight Compact   │     │  Cardano/Midnight│
│  - Verified reside  │     │  - Lace wallet   │
│  - Treasury rules   │     │  - NIGHT/DUST    │
│  - Governance       │     └──────────────────┘
└─────────────────────┘
```

## Removing Unwanted Features

- **No wallet?** Remove `wallet.ts`, `did.ts`, and delete `packages/wallet/`
- **No identity verification?** Skip `services/identity-worker/` and set `features.identity_verification: false`
- **No treasury?** Remove `contracts/compact/treasury_governance.compact.stub` and set `features.treasury: false`

## Getting Help

- GitHub Issues: https://github.com/deanpain/jbay-community-hub/issues
- Paperclip board: INKPIXEL company
