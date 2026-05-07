# J-Bay Admin Dashboard — Build Spec for Codex

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 14+ (App Router) | Vercel-native, API routes built in |
| UI | React + TailwindCSS | Fast, consistent, good DX |
| Backend | Supabase (shared instance) | Already paid for — pkkgnimuocduxsjowtra.supabase.co |
| Charts | Recharts | Lightweight, React-native |
| Deployment | Vercel | Auto-deploys from main branch |
| Auth | Supabase Auth (email/password) | Simple admin login |

## Repository Location

`apps/admin/` within the existing jbay-community-hub monorepo (`projects/jbay_community/apps/admin/`).

Shares types from `packages/shared/` where applicable.

## Build Order (Feed to Codex one at a time)

### Task 1: Supabase Schema + Seed Data
- CREATE TABLE listings, partners, verified_residents, identity_batches, admins (schema in docs/admin-backend-spec.md)
- Seed 8 partner listings (docs/partners/seed-listings.md)
- Create a supabase-mvp-2026-05-07.sql migration file
- Run it against the existing Supabase instance

### Task 2: Next.js Scaffold + Dashboard
- `npx create-next-app@latest apps/admin --typescript --tailwind --app`
- Configure vercel.json
- Set up Supabase client in apps/admin/lib/supabase.ts
- Dashboard page (/app/dashboard/page.tsx):
  - Stats cards (listings, partners, verified, batch cost)
  - Recent verifications feed
  - Worker health status
  - Wire to Supabase queries

### Task 3: Listings CRUD
- /app/listings/page.tsx — Table view (sortable, filterable)
- /app/listings/new/page.tsx — Create form
- /app/listings/[id]/page.tsx — Edit form / detail view
- DELETE / Toggle status
- Bulk CSV import

### Task 4: Partners Manager
- /app/partners/page.tsx — Table view
- /app/partners/[id]/page.tsx — Detail / edit
- Workshop status tracking

### Task 5: Verified Residents
- /app/residents/page.tsx — Searchable table
- /app/residents/[id]/page.tsx — Verification history
- Manual verify / revoke actions

### Task 6: Identity Worker Ops
- Batch history table
- Queue depth gauge
- Cost dashboard (R1 vs R10 chart)
- Trigger manual batch run

### Task 7: Auth + Settings
- Supabase Auth login page
- Admin role guard middleware
- /app/settings — i18n table editor, config form

## Supabase Connection

```
URL:  https://pkkgnimuocduxsjowtra.supabase.co
Anon Key: (from design-qa-engine .env -> SUPABASE_ANON_KEY)
Service Role Key: (from design-qa-engine .env -> SUPABASE_SERVICE_ROLE_KEY)
```

Store in apps/admin/.env.local:
```
NEXT_PUBLIC_SUPABASE_URL=https://pkkgnimuocduxsjowtra.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_secret__...
SUPABASE_SERVICE_ROLE_KEY=sb_secret__...
```

## Design Guidelines

- Clean, calm admin aesthetic. Think Linear or Stripe dashboard style.
- Sidebar navigation: Dashboard | Listings | Partners | Residents | Ops | Settings
- Mobile-responsive sidebar collapses to hamburger
- Dark mode toggle optional but nice
- All mutations show success/error toast notifications
