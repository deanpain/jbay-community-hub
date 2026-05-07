-- J-Bay Community Hub — Seed Data
-- 8 partner listings for the MVP pilot

-- ─── Partners ──────────────────────────────────────────────────────────────

insert into partners (name, type, contact_name, contact_email, website, workshop_status, notes) values
  ('Joshua Project', 'education', 'Mike Joshua', 'mike@joshuaproject.org', 'https://joshuaproject.org', 'not_started', 'Education & skills training for local youth'),
  ('Wave Point', 'recreation', 'Sarah Wave', 'sarah@wavepoint.co.za', 'https://wavepoint.co.za', 'not_started', 'Surf and ocean recreation programs'),
  ('Victory / Frontline', 'entertainment', 'David Victory', 'david@victory.org.za', null, 'not_started', 'Youth entertainment and community events'),
  ('CSALT', 'education', 'Peter CSALT', 'peter@csalt.co.za', 'https://csalt.co.za', 'not_started', 'Computer skills and digital literacy training'),
  ('J-Bay After School', 'education', 'Nomsa Khumalo', 'nomsa@jbayafterschool.org', null, 'not_started', 'After-school tutoring and mentorship'),
  ('Surfers Not Street Children', 'recreation', 'Tom Hewitt', 'tom@snsc.org', 'https://snsc.org', 'not_started', 'Surf therapy and social work for at-risk youth'),
  ('Kouga Music Academy', 'entertainment', 'Liam Basson', 'liam@kougamusic.org', null, 'not_started', 'Music education and performance events'),
  ('J-Bay Ratepayers Association', 'civic', 'Anne Williams', 'anne@jbayratepayers.co.za', null, 'not_started', 'Community representation and civic engagement')
on conflict do nothing;

-- ─── Listings ──────────────────────────────────────────────────────────────

insert into listings (name, category, partner_id, description, location, contact_phone, contact_email, website, status) values
  ('Joshua Skills Training', 'education',
    (select id from partners where name = 'Joshua Project'),
    'Free skills training program for local youth. Covers basic computer skills, CV writing, and interview preparation.',
    'Jeffreys Bay Community Centre, Da Gama Road', '+27 42 123 4567', 'info@joshuaproject.org', 'https://joshuaproject.org', 'published'),

  ('Wave Point Surf Sessions', 'recreation',
    (select id from partners where name = 'Wave Point'),
    'Weekly surf sessions for all ages. Boards and wetsuits provided. Learn to surf in the legendary J-Bay waves.',
    'Wave Point, Beach Road', '+27 42 234 5678', 'surf@wavepoint.co.za', 'https://wavepoint.co.za', 'published'),

  ('Victory Youth Nights', 'entertainment',
    (select id from partners where name = 'Victory / Frontline'),
    'Friday night youth gatherings with live music, games, and guest speakers. Safe, supervised environment for teens.',
    'Victory Hall, Main Street', '+27 42 345 6789', 'info@victory.org.za', null, 'published'),

  ('CSALT Digital Literacy', 'education',
    (select id from partners where name = 'CSALT'),
    'Weekend coding and digital literacy workshops. Learn Python, web development, and basic IT skills.',
    'CSALT Campus, Cape Road', '+27 42 456 7890', 'learn@csalt.co.za', 'https://csalt.co.za', 'published'),

  ('J-Bay After School Program', 'education',
    (select id from partners where name = 'J-Bay After School'),
    'Daily after-school homework help, tutoring, and mentorship for primary and high school students.',
    'J-Bay Library, St Croix Street', '+27 42 567 8901', 'info@jbayafterschool.org', null, 'published'),

  ('SNSC Surf Therapy', 'recreation',
    (select id from partners where name = 'Surfers Not Street Children'),
    'Structured surf therapy program combining ocean sports with social work support for at-risk youth.',
    'Kabeljauws Beach', '+27 42 678 9012', 'referrals@snsc.org', 'https://snsc.org', 'published'),

  ('Kouga Music Collective', 'entertainment',
    (select id from partners where name = 'Kouga Music Academy'),
    'Weekly music jam sessions, instrument lessons, and performance opportunities for all ages and skill levels.',
    'Kouga Cultural Centre, Ferreira Street', '+27 42 789 0123', 'play@kougamusic.org', null, 'published'),

  ('Community Notice Board', 'civic',
    (select id from partners where name = 'J-Bay Ratepayers Association'),
    'Official community notice board for J-Bay events, municipal updates, and civic announcements.',
    'J-Bay Municipal Office, Dawid Stoorman Street', '+27 42 890 1234', 'admin@jbayratepayers.co.za', null, 'published')
on conflict do nothing;

-- ─── Admin User ────────────────────────────────────────────────────────────

-- Password should be set via Supabase Auth UI after first login
insert into admins (email, name, role) values
  ('dean@inkpixel.co.za', 'Dean Payne', 'admin')
on conflict (email) do nothing;
