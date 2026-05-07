-- ============================================================
-- J-Bay Community Hub — MVP Schema + Seed Data
-- Date: 2026-05-07
-- Run in Supabase SQL Editor or via psql
-- ============================================================

-- 0. Extensions
create extension if not exists "pgcrypto";

-- ============================================================
-- 1. Tables
-- ============================================================

-- 1a. Partners
create table if not exists partners (
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

-- 1b. Listings
create table if not exists listings (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  category      text not null check (category in ('education','recreation','entertainment')),
  partner_id    uuid references partners(id),
  description   text,
  location      text,
  contact_phone text,
  contact_email text,
  website       text,
  image_url     text,
  status        text not null default 'draft' check (status in ('draft','published','archived')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- 1c. Identity batches
create table if not exists identity_batches (
  id            uuid primary key default gen_random_uuid(),
  started_at    timestamptz not null default now(),
  completed_at  timestamptz,
  item_count    int not null default 0,
  accepted      int not null default 0,
  rejected      int not null default 0,
  retry         int not null default 0,
  total_cost_zar numeric(10,2)
);

-- 1d. Verified residents
create table if not exists verified_residents (
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

-- 1e. Admin users
create table if not exists admins (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  name          text not null,
  role          text not null default 'admin' check (role in ('admin','operator')),
  created_at    timestamptz not null default now()
);

-- ============================================================
-- 2. Indexes
-- ============================================================

create index if not exists idx_listings_partner_id on listings(partner_id);
create index if not exists idx_listings_category on listings(category);
create index if not exists idx_listings_status on listings(status);
create index if not exists idx_verified_residents_status on verified_residents(status);
create index if not exists idx_verified_residents_batch_id on verified_residents(batch_id);

-- ============================================================
-- 3. Row Level Security
-- ============================================================

alter table listings enable row level security;
alter table partners enable row level security;
alter table verified_residents enable row level security;
alter table identity_batches enable row level security;
alter table admins enable row level security;

-- Admin full access policies
create policy "Admins can read all listings" on listings for select using (
  exists (select 1 from admins where email = current_setting('request.jwt.claims', true)::json->>'email')
);
create policy "Admins can insert listings" on listings for insert with check (
  exists (select 1 from admins where email = current_setting('request.jwt.claims', true)::json->>'email')
);
create policy "Admins can update listings" on listings for update using (
  exists (select 1 from admins where email = current_setting('request.jwt.claims', true)::json->>'email')
);
create policy "Admins can delete listings" on listings for delete using (
  exists (select 1 from admins where email = current_setting('request.jwt.claims', true)::json->>'email')
);

-- Public can only read published listings
create policy "Public read published listings" on listings for select using (status = 'published');

-- ============================================================
-- 4. Seed Data — Partners
-- ============================================================

insert into partners (id, name, type, contact_name, contact_email, website, workshop_status, notes) values
  (gen_random_uuid(), 'Joshua Project',           'education',     'Joshua Project Office',   'info@joshuaproject.org.za',     'https://joshuaproject.org.za',       'completed',  'Anchor education partner. AET, skills training, work readiness.'),
  (gen_random_uuid(), 'Wave Point Foundation',    'recreation',    'Wave Point Office',       'info@wavepoint.org.za',         'https://wavepoint.org.za',           'completed',  'Anchor recreation partner. Surf mentorship, community gardens, youth sports.'),
  (gen_random_uuid(), 'Victory Frontline Youth',  'entertainment', 'Frontline Youth Leader',   'youth@victoryjbay.co.za',       'https://victoryjbay.co.za',          'scheduled',  'Youth cultural events and entertainment.'),
  (gen_random_uuid(), 'Victory Gap Year',         'entertainment', 'Gap Year Coordinator',     'gapyear@victoryjbay.co.za',     'https://victoryjbay.co.za/gapyear',  'scheduled',  'Leadership Lab, entrepreneurship programme for young adults.'),
  (gen_random_uuid(), 'Victory Church',           'entertainment', 'Church Office',            'info@victoryjbay.co.za',        'https://victoryjbay.co.za',          'not_started','Community fellowship events and gatherings.'),
  (gen_random_uuid(), 'CSALT',                    'education',     'CSALT Coordinator',        'info@csalt.org.za',             'https://csalt.org.za',               'scheduled',  'Community leader onboarding and training cohort.')
on conflict do nothing;

-- ============================================================
-- 5. Seed Data — Listings
-- ============================================================
-- Use CTEs to reference partner UUIDs reliably

with partner_ids as (
  select id, name from partners
),
listing_data as (
  select
    p.id as partner_id,
    l.name,
    l.category,
    l.description,
    l.status
  from (values
    ('Joshua Project',          'education',     'AET Literacy Programme',    'Foundational literacy and numeracy for adults. Weekly classes in English and Afrikaans. Open to adults 18+.',                                 'published'),
    ('Joshua Project',          'education',     'Life Skills for Work',      'Work readiness, CV writing, interview prep, and employability skills for young adults.',                                                         'published'),
    ('Joshua Project',          'education',     'Skills Certification',      'Vocational certification pathways including AET certification and skills training credentials.',                                                  'published'),
    ('Wave Point Foundation',   'recreation',    'Surf Leadership Mentorship','Youth leadership development through surfing, mentorship, and ocean safety certification.',                                                      'published'),
    ('Wave Point Foundation',   'recreation',    'Community Garden Volunteer','Volunteering at Wave Point community food gardens — planting, maintenance, harvesting.',                                                           'published'),
    ('Wave Point Foundation',   'recreation',    'Outdoor Youth Recreation',  'Organised sports, outdoor activities, and recreation programmes for local youth.',                                                               'published'),
    ('Victory Frontline Youth', 'entertainment', 'Youth Cultural Events',     'Privacy-preserving event ticketing and attendance for youth cultural activities.',                                                               'published'),
    ('Victory Gap Year',        'entertainment', 'Leadership Lab',            'Entrepreneurship and leadership development programme for young adults.',                                                                        'published'),
    ('Victory Church',          'entertainment', 'Community Gatherings',      'Regular community fellowship events including weekly gatherings and special community programmes.',                                               'published'),
    ('CSALT',                   'education',     'CSALT Pilot Cohort',        'Community leader onboarding and training cohort. Structured programme for new community leaders.',                                                'published')
  ) as l(org, category, name, description, status)
  join partner_ids p on p.name = l.org
)
insert into listings (partner_id, name, category, description, status, created_at, updated_at)
select partner_id, name, category, description, status, now(), now()
from listing_data
on conflict do nothing;

-- ============================================================
-- 6. Seed Data — Admin Users
-- ============================================================

insert into admins (email, name, role) values
  ('dean@inkpixel.agency', 'Dean Payne', 'admin')
on conflict do nothing;

-- ============================================================
-- 7. Verify
-- ============================================================

do $$
declare
  partner_count int;
  listing_count int;
begin
  select count(*) into partner_count from partners;
  select count(*) into listing_count from listings;
  raise notice 'Migration complete: % partners, % listings seeded', partner_count, listing_count;
end $$;
