# Municipality Swap Guide

> Fork the J-Bay Community Hub for your town. Swap config, identity provider, and deploy.

---

## Overview

This repository is designed as a **reusable template** — any municipality worldwide can fork it, swap the local configuration and identity provider, and deploy their own community hub. This guide walks through each configurable boundary.

### What Stays the Same

- Mobile app architecture (Expo/React Native)
- Midnight Compact smart contracts patterns
- Backend API scaffolding (NestJS)
- CI/CD pipeline structure
- Privacy model (ZK proofs via Midnight)

### What You Must Swap

| Component | Where | How |
|-----------|-------|-----|
| Branding | `packages/config/` | App name, colors, logo, tagline |
| Partner listings | `docs/partners/seed-data/` | Replace with local organisations |
| Identity provider | Identity adapter layer | See adapter swap guide |
| i18n locale | `apps/mobile/src/i18n/` | Add your locale files |
| Legal | `docs/compliance/`, `LICENSE` | Verify local data protection law |

---

## Step 1 — Fork the Repository

```bash
gh repo fork deanpain/jbay-community-hub --clone --remote
cd jbay-community-hub
```

Set your upstream to track original for pulling template updates:
```bash
git remote add upstream https://github.com/deanpain/jbay-community-hub.git
```

## Step 2 — Configure Branding

Edit `packages/config/src/app-config.ts`:

| Field | Example (J-Bay) | Swap To |
|-------|-----------------|---------|
| `appName` | "J-Bay Community Hub" | Your town's name |
| `primaryColor` | `#0066CC` | Your municipal colours |
| `tagline` | "Your town, your hub, private by design" | Custom tagline |
| `location` | "Jeffreys Bay, Eastern Cape" | Your municipality |
| `defaultLocale` | `en` | Your primary language |

## Step 3 — Add Locale Files

The i18n system lives at `apps/mobile/src/i18n/`. You need at least:

- `en.ts` — English (fallback)
- `{locale}.ts` — Your primary language

For South African deployments, Afrikaans and Xhosa locale stubs are provided. For international deployments, replace with your languages.

## Step 4 — Swap Identity Provider

See the **Identity Adapter Swap Guide** (`docs/runbooks/identity-adapter-swap.md`) for detailed steps.

In summary:
1. Replace Altron/DHA API integration with your country's identity provider
2. Update the `identity-worker` service to call your provider's API
3. Update ZK credential schemas to match your provider's data format
4. Update compliance documentation for your jurisdiction's data protection laws

## Step 5 — Seed Local Partner Listings

1. Remove J-Bay seed data from `docs/partners/seed-data/`
2. Create JSON files for your local partner organisations
3. Update `docs/partners/listing-taxonomy.md` with your local provider categories
4. Update `docs/comms/briefings/` with local messaging

## Step 6 — Deploy

Follow the deploy guides in `docs/runbooks/`:

| Service | Guide |
|---------|-------|
| Mobile app | `docs/runbooks/apple-developer-setup.md` + EAS Build |
| Backend API | Render deployment (see `docs/runbooks/render-identity-worker-setup.md`) |
| Identity worker | Render + local identity provider setup |

## Step 7 — Legal & Compliance

- [ ] Update `LICENSE` if you're using a different OSS license
- [ ] Update `docs/compliance/` for your country's data protection law
- [ ] Verify contribution guidelines in `CONTRIBUTING.md`
- [ ] Update `SECURITY.md` with your contact

---

## Staying Up-to-Date

Pull template updates from the upstream repo:

```bash
git fetch upstream
git merge upstream/main
# Resolve any config conflicts in packages/config/
```

Major architectural changes (Compact contracts, new privacy features) flow cleanly. Config files may need manual merge.
