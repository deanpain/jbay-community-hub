-- ============================================================
-- J-Bay Community Hub — MVP Schema + Seed Data
-- Migration: supabase-mvp-2026-05-07
--
-- Creates 5 tables for the admin backend:
--   1. partners
--   2. listings
--   3. verified_residents
--   4. identity_batches
--   5. admins
--
-- Then seeds 4 partner orgs and 8 partner listings.
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. PARTNERS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.partners (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug          TEXT UNIQUE NOT NULL,          -- machine key (e.g. 'joshua-project')
  display_name  TEXT NOT NULL,                  -- human-readable name
  partner_type  TEXT NOT NULL CHECK (partner_type IN ('education', 'recreation', 'entertainment', 'civic')),
  contact_name  TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  website       TEXT,
  workshop_status TEXT DEFAULT 'not_started'
                  CHECK (workshop_status IN ('not_started', 'scheduled', 'completed')),
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 2. LISTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.listings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT UNIQUE NOT NULL,          -- machine key (e.g. 'lst-edu-aet-jp')
  title           TEXT NOT NULL,
  summary         TEXT,                          -- short description
  description     TEXT,                          -- full description
  category        TEXT NOT NULL CHECK (category IN ('education', 'recreation', 'entertainment')),
  partner_id      UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  location        TEXT,
  contact_phone   TEXT,
  contact_email   TEXT,
  website         TEXT,
  image_url       TEXT,
  schedule        TEXT,                          -- human-readable schedule
  proof_requirements TEXT,
  status          TEXT NOT NULL DEFAULT 'published'
                    CHECK (status IN ('draft', 'published', 'archived')),
  source          TEXT DEFAULT 'seed'
                    CHECK (source IN ('seed', 'draft', 'import')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast category filtering
CREATE INDEX IF NOT EXISTS idx_listings_category ON public.listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_partner ON public.listings(partner_id);
CREATE INDEX IF NOT EXISTS idx_listings_status  ON public.listings(status);

-- ============================================================
-- 3. VERIFIED RESIDENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.verified_residents (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address      TEXT,
  did                 TEXT,                      -- did:midnight:<hash>
  status              TEXT NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'verified', 'revoked')),
  resident_status     TEXT DEFAULT 'standard'
                        CHECK (resident_status IN ('standard', 'verified', 'premium')),
  verification_date   TIMESTAMPTZ,
  batch_id            UUID REFERENCES public.identity_batches(id),
  dha_reference       TEXT,                      -- government reference number
  display_name        TEXT,
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_residents_status ON public.verified_residents(status);
CREATE INDEX IF NOT EXISTS idx_residents_batch  ON public.verified_residents(batch_id);

-- ============================================================
-- 4. IDENTITY BATCHES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.identity_batches (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_ref       TEXT UNIQUE,                   -- human-readable reference (e.g. 'BATCH-001')
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  total_count     INTEGER DEFAULT 0,
  accepted_count  INTEGER DEFAULT 0,
  rejected_count  INTEGER DEFAULT 0,
  cost_estimate   NUMERIC(10,2),                -- in ZAR
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  error_log       TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 5. ADMINS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.admins (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT UNIQUE NOT NULL,
  display_name  TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'admin'
                  CHECK (role IN ('admin', 'operator', 'partner_admin')),
  partner_id    UUID REFERENCES public.partners(id),  -- for partner_admin role
  is_active     BOOLEAN NOT NULL DEFAULT true,
  last_login    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- SEED DATA: Partners (4 orgs)
-- ============================================================
INSERT INTO public.partners (slug, display_name, partner_type, workshop_status, notes) VALUES
  ('joshua-project',   'Joshua Project',       'education',     'scheduled',
   'NGO focused on AET modules, life skills curricula, and community development in Jeffreys Bay.'),
  ('wave-point',       'Wave Point Foundation', 'recreation',   'scheduled',
   'Runs surf mentorship, community gardens, and youth recreation programmes.'),
  ('victory-frontline', 'Victory Church / Frontline Youth', 'entertainment', 'scheduled',
   'Youth cultural events, entertainment, and Gap Year leadership labs.'),
  ('csalt',            'CSALT',                'education',     'completed',
   'Christian Surfers Association and Leadership Training — graduate pilot cohort.')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SEED DATA: 8 Listings
-- ============================================================

-- Education: Joshua Project listings
INSERT INTO public.listings (slug, title, summary, description, category, partner_id, schedule, proof_requirements, source, status)
SELECT
  'lst-edu-aet-jp',
  'Adult Education & Training (AET) modules',
  'Foundational literacy and numeracy pathways aligned with local employability needs.',
  'Comprehensive AET programme offering foundational literacy, numeracy, and digital skills for adults seeking to improve their employability and life skills.',
  'education',
  id,
  'Cohort intake quarterly — steward coordinates placement.',
  'Verified resident credential or steward referral for onboarding.',
  'seed',
  'published'
FROM public.partners WHERE slug = 'joshua-project';

INSERT INTO public.listings (slug, title, summary, description, category, partner_id, schedule, proof_requirements, source, status)
SELECT
  'lst-edu-life-jp',
  'Life skills & readiness curriculum',
  'Practical readiness tied to Work 4aLiving-style pathways and local mentors.',
  'Practical life skills training including financial literacy, work readiness, communication, and personal development — designed for community members entering the workforce.',
  'education',
  id,
  'Rolling workshops — see steward calendar.',
  'Privacy-preserving skills attestations where programmes require them.',
  'seed',
  'published'
FROM public.partners WHERE slug = 'joshua-project';

INSERT INTO public.listings (slug, title, summary, description, category, partner_id, schedule, proof_requirements, source, status)
SELECT
  'lst-edu-skills-jp',
  'Skills development & vocational training',
  'Vocational training and certification programmes for community employment.',
  'Skills development programmes offering certification in various trades and vocational areas, preparing participants for local employment opportunities.',
  'education',
  id,
  'Programme intake twice yearly — check steward for upcoming cohorts.',
  'Proof of prior learning assessment or referral.',
  'seed',
  'published'
FROM public.partners WHERE slug = 'joshua-project';

-- Education: CSALT listing
INSERT INTO public.listings (slug, title, summary, description, category, partner_id, schedule, proof_requirements, source, status)
SELECT
  'lst-edu-csalt-grad',
  'CSALT Graduate Leadership Programme',
  'Leadership development and community integration for CSALT graduates.',
  'Structured leadership programme for CSALT graduates, focusing on community integration, mentorship, and pathway development for early-career community connectors.',
  'education',
  id,
  'Rolling intake — contact CSALT coordinator.',
  'CSALT graduate credential or steward referral.',
  'seed',
  'published'
FROM public.partners WHERE slug = 'csalt';

-- Recreation: Wave Point listings
INSERT INTO public.listings (slug, title, summary, description, category, partner_id, schedule, proof_requirements, source, status)
SELECT
  'lst-rec-surf-wp',
  'Surf Mentorship Programme',
  'Leadership development through surfing — mentorship sessions with experienced surfers.',
  'Mentorship programme combining surfing instruction with leadership development. Participants build confidence, resilience, and community connections through regular surf sessions.',
  'recreation',
  id,
  'Weekly sessions — surf conditions dependent.',
  'Age verification (13+). Parental consent for minors.',
  'seed',
  'published'
FROM public.partners WHERE slug = 'wave-point';

INSERT INTO public.listings (slug, title, summary, description, category, partner_id, schedule, proof_requirements, source, status)
SELECT
  'lst-rec-gardens-wp',
  'Wave Point Community Gardens',
  'Agricultural volunteering and community gardening at Wave Point Gardens.',
  'Community gardening programme offering volunteering opportunities at Wave Point Gardens. Participants learn sustainable agriculture, food security practices, and contribute to local food production.',
  'recreation',
  id,
  'Weekend sessions — see steward calendar.',
  'Standard volunteer registration.',
  'seed',
  'published'
FROM public.partners WHERE slug = 'wave-point';

INSERT INTO public.listings (slug, title, summary, description, category, partner_id, schedule, proof_requirements, source, status)
SELECT
  'lst-rec-youth-wp',
  'Youth Recreation Programme',
  'Outdoor recreation programmes for youth development.',
  'Structured outdoor recreation activities for youth development, including team sports, adventure activities, and environmental education.',
  'recreation',
  id,
  'After-school and holiday programmes.',
  'Age verification. Parental consent for under-18s.',
  'seed',
  'published'
FROM public.partners WHERE slug = 'wave-point';

-- Entertainment: Victory / Frontline Youth listing
INSERT INTO public.listings (slug, title, summary, description, category, partner_id, schedule, proof_requirements, source, status)
SELECT
  'lst-ent-events-victory',
  'Youth Cultural Events & Gap Year Labs',
  'Ticketed youth events, music, arts, drama, and Gap Year leadership intensives.',
  'Youth cultural events including music performances, arts showcases, drama productions, and Gap Year leadership labs. Age-specific programming for teens and young adults with privacy-preserving attendance proofs.',
  'entertainment',
  id,
  'Event calendar — see Victory Frontline Youth schedule.',
  'Age verification (13+, 18+ as applicable).',
  'seed',
  'published'
FROM public.partners WHERE slug = 'victory-frontline';

-- ============================================================
-- Seed a default admin user (placeholder — Supabase Auth handles real auth)
-- ============================================================
INSERT INTO public.admins (email, display_name, role) VALUES
  ('admin@jbayhub.org', 'Dean Payne', 'admin')
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- Auto-update updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION public.trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  tables_with_updated_at TEXT[] := ARRAY['partners', 'listings', 'verified_residents', 'identity_batches', 'admins'];
  t TEXT;
BEGIN
  FOREACH t IN ARRAY tables_with_updated_at
  LOOP
    EXECUTE format(
      'CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();',
      t
    );
  END LOOP;
END;
$$;

-- ============================================================
-- Verify seed data
-- ============================================================
-- Expected: 4 partners, 8 listings
-- SELECT 'partners', COUNT(*) FROM public.partners
-- UNION ALL
-- SELECT 'listings', COUNT(*) FROM public.listings;
