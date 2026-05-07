# Template cloning guide — fork your own community hub

This guide walks through forking the J-Bay Community Hub template and swapping it for your own municipality. A third party should be able to complete this without a hand-holding call.

## Prerequisites

- GitHub account
- [Node.js](https://nodejs.org/) >= 20
- [pnpm](https://pnpm.io/installation) >= 9
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npx expo`)
- (Optional) [Android Studio](https://developer.android.com/studio) / Xcode for device testing

## 1. Fork the repository

```bash
# Replace YOUR_ORG with your GitHub org/username
gh repo fork deanpain/jbay-community-hub --clone --remote --org YOUR_ORG
cd jbay-community-hub

# Or manually:
# git clone https://github.com/YOUR_ORG/your-repo-name
# cd your-repo-name
# git remote add upstream https://github.com/deanpain/jbay-community-hub
```

## 2. Install dependencies

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm contracts:test
```

Everything should pass green. If not, check your Node.js version and pnpm version.

## 3. Swap municipality configuration

The central config lives in `packages/config/src/index.ts`. The schema defines:

| Field | Description | Example |
|-------|-------------|---------|
| `id` | Unique deployment identifier | `"my-town-pilot"` |
| `displayName` | Public-facing hub name | `"My Town Community Hub"` |
| `region.country` | ISO 3166-1 alpha-2 country code | `"ZA"`, `"KE"`, `"US"` |
| `region.municipality` | Local municipality name | `"Kouga Local Municipality"` |
| `region.notes` | Deployment notes | `"Pilot configuration"` |
| `tabs.*.enabled` | Tab visibility (education, recreation, entertainment) | `true` / `false` |

### Steps

**a) Create your deployment JSON:**
```bash
cp packages/config/deployments/jbay.sample.json packages/config/deployments/my-town.json
```

Edit `my-town.json` with your municipality details:

```json
{
  "id": "my-town-pilot",
  "displayName": "My Town Community Hub",
  "region": {
    "country": "KE",
    "municipality": "My Town Municipality",
    "notes": "Deployment configuration for My Town."
  },
  "tabs": {
    "education": { "enabled": true },
    "recreation": { "enabled": true },
    "entertainment": { "enabled": false }
  }
}
```

**b) Update the seed config in `packages/config/src/index.ts`:**

Find the `jbayPilotSeed` object and replace it with your municipality's values:

```typescript
const myTownPilotSeed = {
  id: "my-town-pilot",
  displayName: "My Town Community Hub",
  region: {
    country: "KE",
    municipality: "My Town Municipality",
    notes: "Deployment configuration — update per deployment.",
  },
  tabs: {
    education: { enabled: true },
    recreation: { enabled: true },
    entertainment: { enabled: false },
  },
} as const;

export const pilotConfig = parseMunicipalityConfig(myTownPilotSeed);
```

> **Note:** The exported name `pilotJeffreysBaySample` can be renamed to something generic like `pilotConfig` — just update any imports across the repo.

### Reference: Config schema

```typescript
const municipalitySchema = z.object({
  id: z.string().min(1),
  displayName: z.string().min(1),
  region: z.object({
    country: z.string().length(2),     // ISO 3166-1 alpha-2
    municipality: z.string().optional(),
    notes: z.string().optional(),
  }),
  tabs: z.object({
    education:  z.object({ enabled: z.boolean() }),
    recreation: z.object({ enabled: z.boolean() }),
    entertainment: z.object({ enabled: z.boolean() }),
  }),
});
```

## 4. Swap UI branding

Edit the token set in `packages/ui-tokens/` to match your municipality's brand:

| File | What to change |
|------|----------------|
| `src/colors.ts` | Primary, secondary, accent colours |
| `src/typography.ts` | Font families and sizes |
| `src/spacing.ts` | Layout spacing values |

## 5. Swap identity adapter (non-ZA deployments)

This is the most significant swap. The identity worker (`services/identity-worker/`) is designed with an **adapter boundary** — the Altron/DHA integration is a pluggable module.

### Adapter architecture

```
services/identity-worker/src/
  altron/           ← ZA-specific: Altron/DHA batch verification
  identus/          ← Reusable: Hyperledger Identus VC issuance (keep for non-ZA)
  kms.ts            ← Reusable: key management interface
  index.ts          ← Core: queue, batch processor, scheduler
  processor.ts      ← Core: batch processing orchestration
```

### For non-ZA deployments

**Option A: Implement a new adapter** (recommended for custom identity providers)

1. Create a new directory `services/identity-worker/src/{provider-name}/`
2. Implement the adapter interface (see `altron/processor.ts` for reference):

```typescript
// services/identity-worker/src/{provider-name}/processor.ts
export interface IdentityProviderConfig {
  apiEndpoint: string;
  apiKey: string;
  // ... provider-specific fields
}

export interface VerificationRequest {
  correlationId: string;
  // ... your required fields
}

export interface VerificationResponse {
  status: "accepted" | "rejected" | "retry";
  reference: string;
}

export function createProviderProcessor(config: IdentityProviderConfig) {
  return {
    async verify(request: VerificationRequest): Promise<VerificationResponse> {
      // Implement provider API call
    },
  };
}
```

3. Wire the new adapter in `services/identity-worker/src/index.ts` replacing the Altron import.

**Option B: Disable identity verification entirely** (for early prototyping / demo)

Set `IDENTITY_VERIFICATION_ENABLED=false` in your `.env` and the identity worker runs in dry-run mode with synthetic acceptance.

### Config mapping

| Env var | Altron (ZA) | Non-ZA placeholder |
|---------|-------------|---------------------|
| `ALTRON_API_KEY` | Altron API key | Omit or set to empty |
| `IDENTUS_API_KEY` | Identus API key | Same (kept for VC issuance) |
| `IDENTITY_ADAPTER` | `altron` | Your adapter name |
| `COUNTRY_CODE` | `ZA` | Your ISO code |

### Keeping VC issuance

The `identus/` client and VC issuance pipeline are **country-agnostic** — they issue Hyperledger Identus verifiable credentials regardless of the upstream identity provider. You only need to swap the verification source, not the credential output.

## 6. Update documentation

After forking, update these files:

| File | What to update |
|------|----------------|
| `README.md` | Repo name, deployment link, municipality references |
| `.env.example` | Environment variables specific to your deployment |
| `docs/comms/` | Partner communication templates |
| `docs/partners/listing-taxonomy.md` | Local partner organisations |

## 7. Deploy

See deployment runbooks:

- Mobile:
  [`docs/runbooks/mobile-eas-deployment.md`](../runbooks/mobile-eas-deployment.md)
- Identity worker:
  [`docs/runbooks/identity-worker-cloud-hosting.md`](../runbooks/identity-worker-cloud-hosting.md)
- Domain/DNS/SSL:
  [`docs/runbooks/domain-dns-ssl.md`](../runbooks/domain-dns-ssl.md)

## Verification checklist

After completing the steps above, verify your fork:

```bash
# Check lint and types
pnpm lint
pnpm typecheck
pnpm contracts:test

# Verify config loading — run the config package tests
pnpm --filter @jbay/config test

# Run identity worker tests (in dry-run mode)
pnpm --filter @jbay/identity-worker test

# Start the mobile app
pnpm --filter @jbay/mobile start
```

### Done when

- [ ] All `pnpm lint`, `typecheck`, `test`, `contracts:test` pass
- [ ] Municipality config updated with your region
- [ ] UI tokens reflect your brand
- [ ] Identity adapter configured (or verification disabled for prototyping)
- [ ] README updated with your repo name and deployment link
- [ ] Third party can fork and follow this guide without hand-holding
