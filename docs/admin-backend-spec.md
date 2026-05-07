# J-Bay Community Hub — Admin Backend Product Spec

## Why

Right now there's nowhere to manage project data. Listings are hardcoded, partners aren't tracked, resident verifications have no audit trail, and the identity-worker runs silently. An admin backend is the control panel for the entire system.

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Backend | Supabase (existing) | Already paid for, has auth + REST + real-time, we use it in DQA |
| Admin UX | Streamlit (Python) | Dean said to check it out — fast to build, no frontend work, connects to Supabase natively |
| Or | FastAPI + simple React dashboard | More control, more work. Streamlit first, migrate later if needed |
| Hosting | Render (existing account) | Same account as DQA, Streamlit deploys trivially |

**Recommendation:** Streamlit MVP in 2 days. If it outgrows Streamlit, the Supabase schema doesn't change — just swap the frontend.

## User Types

| Role | Can See | Can Do |
|------|---------|--------|
| **Admin** (Dean) | Everything | CRUD listings/partners, view verifications, see ops metrics |
| **Partner** (Joshua, Wave Point, etc.) | Their own listings only | Update listing details, view their verification stats |
| **Operator** (future agent) | Ops metrics, verification queue | Rerun batches, view logs, no content editing |

MVP ships with just **Admin** role. Partner and Operator roles are Phase 2.

## Screens

### 1. Dashboard (homepage)

A bird's-eye view of the entire system:

```
┌─────────────────────────────────────────────────────┐
│  J-Bay Community Hub — Admin                          │
│                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │ Listings  │  │ Partners  │  │ Verified  │  │ Batch  ││
│  │    12     │  │     5     │  │    28     │  │  Cost  ││
│  │  Active   │  │   Live    │  │ Residents │  │ R12.50 ││
│  └──────────┘  └──────────┘  └──────────┘  └────────┘│
│                                                       │
│  Recent verifications:                                │
│  ┌─────────────────────────────────────────────────┐ │
│  │ #0012  John D.  ✓ Accepted  2 min ago          │ │
│  │ #0011  Sarah K. ✓ Accepted  5 min ago          │ │
│  │ #0010  Bob M.   ✗ Rejected  12 min ago         │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  Queue depth: 3  │  Worker status: ✅ Healthy        │
└─────────────────────────────────────────────────────┘
```

**Data sources:**
- Supabase tables (listings count, partners, verified residents)
- Identity-worker logs (batch outcomes, queue depth)
- Cost model calculation (R1 vs R10 rates)

### 2. Listings Manager

Full CRUD for partner listings. Each listing belongs to a category:

| Category | Examples |
|----------|----------|
| Education | Joshua Project, CSALT |
| Recreation | Wave Point |
| Entertainment | Victory / Frontline |

**Fields per listing:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Name | Text | Yes | Display name |
| Category | Enum | Yes | Education / Recreation / Entertainment |
| Partner Org | FK → partners | Yes | Who runs this |
| Description | Textarea | Yes | What it is |
| Location | Text | No | Physical address or area |
| Contact Phone | Text | No | |
| Contact Email | Text | No | |
| Website | URL | No | |
| Image URL | URL | No | Hero image |
| Status | Enum | Yes | Draft / Published / Archived |
| Created At | Timestamp | Auto | |
| Updated At | Timestamp | Auto | |

**Views:**
- Table view (sortable by any column, filter by category/status)
- Detail view (edit form for a single listing)
- Bulk import (CSV upload for initial seed data)

### 3. Partners Manager

Who's involved in the ecosystem.

| Field | Type | Notes |
|-------|------|-------|
| Name | Text | Organization name |
| Type | Enum | Education / Recreation / Entertainment / Civic |
| Contact Name | Text | Primary contact |
| Contact Email | Text | |
| Contact Phone | Text | |
| Website | URL | |
| Workshop Status | Enum | Not Started / Scheduled / Completed |
| Notes | Textarea | Internal notes |
| Listing Count | Computed | How many listings this partner has |

### 4. Verified Residents

Who has gone through the identity verification process.

| Field | Type | Notes |
|-------|------|-------|
| Wallet Address | Text | Cardano wallet |
| DID | Text | did:midnight:<hash> |
| Status | Enum | Pending / Verified / Revoked |
| Verification Date | Timestamp | |
| Batch ID | FK → batches | Which batch processed them |
| Resident Status | Enum | Standard / Verified / Premium |
| DHA Reference | Text | Government reference number |

**Views:**
- Table with search/filter by status
- Detail showing their verification history
- Option to manually verify or revoke

### 5. Identity Worker Ops

Monitor the batch verification system.

| Metric | Display | Source |
|--------|---------|--------|
| Queue depth | Number | Worker logs |
| Last batch run | Timestamp | Worker logs |
| Batch outcomes | Accepted / Rejected / Retry counts | Worker logs |
| Cost this month | ZAR | Cost model calculation |
| R1 vs R10 savings | ZAR + % | Cost model |
| Worker status | Healthy / Unhealthy | Health check endpoint |
| Off-peak window | Active / Inactive | Worker schedule |

**Controls:**
- Trigger immediate batch run
- Toggle sandbox mode on/off
- View recent logs (last 100 lines)

### 6. Content / Settings

| Section | What |
|---------|------|
| i18n Strings | View and edit EN/AF/XH translations |
| Municipality Config | Town name, region, feature flags |
| Theme | Brand colors, app name |
| API Keys | View which keys are configured (never raw values) |

## Data Model

```sql
-- Listings (core content)
create table listings (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category    text not null check (category in ('education','recreation','entertainment')),
  partner_id  uuid references partners(id),
  description text,
  location    text,
  contact_phone text,
  contact_email text,
  website     text,
  image_url   text,
  status      text not null default 'draft' check (status in ('draft','published','archived')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Partners
create table partners (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  type          text not null check (type in ('education','recreation','entertainment','civic')),
  contact_name  text,
  contact_email text,
  contact_phone text,
  website       text,
  workshop_status text default 'not_started',
  notes         text,
  created_at    timestamptz not null default now()
);

-- Verified residents
create table verified_residents (
  id                uuid primary key default gen_random_uuid(),
  wallet_address    text not null unique,
  did               text,
  status            text not null default 'pending' check (status in ('pending','verified','revoked')),
  resident_status   text default 'standard',
  dha_reference     text,
  verification_date timestamptz,
  batch_id          uuid references identity_batches(id),
  created_at        timestamptz not null default now()
);

-- Identity batches
create table identity_batches (
  id            uuid primary key default gen_random_uuid(),
  started_at    timestamptz not null default now(),
  completed_at  timestamptz,
  item_count    int not null default 0,
  accepted      int not null default 0,
  rejected      int not null default 0,
  retry         int not null default 0,
  total_cost_zar numeric(10,2)
);

-- Admin users
create table admins (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  name          text not null,
  role          text not null default 'admin' check (role in ('admin','operator')),
  created_at    timestamptz not null default now()
);
```

## Build Order

| Phase | What | Time | Depends On |
|-------|------|------|------------|
| P1 | Supabase schema + seed 8 listings | 2 hours | None |
| P2 | Streamlit dashboard + listings CRUD | 4 hours | P1 |
| P3 | Partners manager + verified residents view | 3 hours | P1 |
| P4 | Identity-worker ops dashboard + cost model | 3 hours | Worker deployed |
| P5 | Content/settings screens | 2 hours | P1 |
| P6 | Auth (login for admin/partner roles) | 3 hours | P1 |

**Total: ~17 hours to full admin backend.** MVP (P1+P2) in about 6 hours gives you a working listings manager.

## Open Questions

1. **Streamlit vs FastAPI dashboard?** Streamlit is faster to build but less flexible. If you want a more polished product, I can do FastAPI + a simple React admin panel instead — takes about 2x longer.
2. **Deploy Streamlit on Render** (your existing account) or keep it local for now?
3. **Should the seed data (8 partners) come from Supabase directly or via import?**
