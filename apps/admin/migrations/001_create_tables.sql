-- J-Bay Community Hub — Admin Backend Schema
-- Migration 001: Create core tables
-- Phase: P1 (Supabase schema)
-- Date: 2026-05-07

-- 1. Partners (organizations in the ecosystem)
create table if not exists partners (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  type          text not null check (type in ('education','recreation','entertainment','civic')),
  contact_name  text,
  contact_email text,
  contact_phone text,
  website       text,
  workshop_status text default 'not_started' check (workshop_status in ('not_started','scheduled','completed')),
  notes         text,
  created_at    timestamptz not null default now()
);

-- 2. Listings (core content — partner offerings)
create table if not exists listings (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  category      text not null check (category in ('education','recreation','entertainment')),
  partner_id    uuid references partners(id) on delete set null,
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

-- 3. Identity batches (Altron/DHA batch verification runs)
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

-- 4. Verified residents (identity verification records)
create table if not exists verified_residents (
  id                uuid primary key default gen_random_uuid(),
  wallet_address    text not null unique,
  did               text,
  status            text not null default 'pending' check (status in ('pending','verified','revoked')),
  resident_status   text default 'standard' check (resident_status in ('standard','verified','premium')),
  dha_reference     text,
  verification_date timestamptz,
  batch_id          uuid references identity_batches(id) on delete set null,
  created_at        timestamptz not null default now()
);

-- 5. Admin users
create table if not exists admins (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  name          text not null,
  role          text not null default 'admin' check (role in ('admin','operator')),
  created_at    timestamptz not null default now()
);

-- Enable Row Level Security on all tables
alter table partners enable row level security;
alter table listings enable row level security;
alter table identity_batches enable row level security;
alter table verified_residents enable row level security;
alter table admins enable row level security;

-- Index for common queries
create index if not idx_listings_status on listings(status);
create index if not idx_listings_category on listings(category);
create index if not idx_listings_partner on listings(partner_id);
create index if not idx_verified_residents_status on verified_residents(status);
create index if not idx_identity_batches_started on identity_batches(started_at desc);

-- Updated_at trigger for listings
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_listings_updated_at on listings;
create trigger set_listings_updated_at
  before update on listings
  for each row
  execute function update_updated_at_column();
