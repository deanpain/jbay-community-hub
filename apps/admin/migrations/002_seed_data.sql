-- J-Bay Community Hub — Seed Data
-- Migration 002: Seed 8 partner listings
-- Phase: P1 (seed data)
-- Date: 2026-05-07

-- Partners (organizations)
insert into partners (id, name, type, contact_name, contact_email, website, workshop_status, notes) values
  ('a0000001-0000-0000-0000-000000000001', 'Joshua Project',       'education',     'Mike Johnson',    'mike@joshuaproject.org',     'https://joshuaproject.org',     'completed',   'After-school tutoring and youth development programs'),
  ('a0000001-0000-0000-0000-000000000002', 'CSALT',                'education',     'Sarah Williams',  'sarah@csalt.co.za',          'https://csalt.co.za',            'scheduled',   'Digital skills training and coding bootcamps'),
  ('a0000001-0000-0000-0000-000000000003', 'Wave Point',           'recreation',    'Tom Ferreira',    'tom@wavepoint.co.za',        'https://wavepoint.co.za',        'completed',   'Surfing lessons and ocean safety programs'),
  ('a0000001-0000-0000-0000-000000000004', 'Victory / Frontline',  'entertainment', 'David Nkosi',     'david@victoryfrontline.org', 'https://victoryfrontline.org',   'scheduled',   'Music, arts, and cultural events venue'),
  ('a0000001-0000-0000-0000-000000000005', 'J-Bay Municipality',   'civic',          'Councillor Peters','admin@jbaymuni.gov.za',      'https://jbaymuni.gov.za',        'not_started', 'Local government community services desk'),
  ('a0000001-0000-0000-0000-000000000006', 'Sunrise Educare',      'education',     'Grace Abrahams',  'grace@sunriseeducare.co.za', NULL,                                'not_started', 'Early childhood development centre'),
  ('a0000001-0000-0000-0000-000000000007', 'Kabelo Sports Academy','recreation',    'Kabelo Molefe',   'kabelo@kabelosports.co.za',  NULL,                                'not_started', 'Youth soccer and athletics coaching'),
  ('a0000001-0000-0000-0000-000000000008', 'J-Bay Makerspace',     'education',     'Liam Botha',      'liam@jbaymakers.org',        'https://jbaymakers.org',         'not_started', 'Community workshop with 3D printers, CNC, and craft tools')
on conflict (id) do nothing;

-- Listings (partner offerings)
insert into listings (name, category, partner_id, description, location, contact_phone, website, status) values
  ('After-School Tutoring',     'education',     'a0000001-0000-0000-0000-000000000001', 'Homework help and tutoring for grades 8-12 in maths, science, and English.', '14 Da Gama Road, Jeffreys Bay', '+27 42 123 4567', 'https://joshuaproject.org/tutoring', 'published'),
  ('Coding Bootcamp',           'education',     'a0000001-0000-0000-0000-000000000002', '12-week intensive coding program covering web development, Python, and databases.', '22 Diaz Street, Jeffreys Bay', '+27 42 234 5678', 'https://csalt.co.za/bootcamp', 'published'),
  ('Surf Lessons',              'recreation',    'a0000001-0000-0000-0000-000000000003', 'Beginner to intermediate surf lessons with certified instructors. Equipment provided.', 'Wave Point, Supertubes Beach', '+27 42 345 6789', 'https://wavepoint.co.za/lessons', 'published'),
  ('Ocean Safety Programme',    'recreation',    'a0000001-0000-0000-0000-000000000003', 'Beach safety, rip current awareness, and basic lifeguard training for youth.', 'Wave Point Surf Club', '+27 42 345 6790', 'https://wavepoint.co.za/safety', 'published'),
  ('Music & Arts Workshop',     'entertainment', 'a0000001-0000-0000-0000-000000000004', 'Weekly music production, DJ, and visual arts workshops for teens and young adults.', '15 Koraal Street, Jeffreys Bay', '+27 42 456 7890', 'https://victoryfrontline.org/arts', 'published'),
  ('Community Events Hall',     'entertainment', 'a0000001-0000-0000-0000-000000000004', 'Affordable venue hire for community events, cultural celebrations, and performances.', '15 Koraal Street, Jeffreys Bay', '+27 42 456 7891', 'https://victoryfrontline.org/venue', 'published'),
  ('Youth Soccer Programme',    'recreation',    'a0000001-0000-0000-0000-000000000007', 'Weekly soccer training and tournaments for ages 8-18. Includes life skills coaching.', 'Kabelo Sports Field, Aston Bay', '+27 42 567 8901', NULL, 'draft'),
  ('Makerspace Workshop',       'education',     'a0000001-0000-0000-0000-000000000008', 'Access to 3D printers, laser cutters, CNC machines. Monthly membership available.', '9 Van der Merwe St, Jeffreys Bay', '+27 42 678 9012', 'https://jbaymakers.org/workshop', 'draft')
on conflict do nothing;
