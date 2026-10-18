-- Keep seed data deterministic enough for the pitch/demo.
-- Additional providers and contributions should be added here as the UI is implemented.

INSERT INTO service_providers (
  id,
  name,
  category,
  description,
  address,
  latitude,
  longitude,
  phone,
  operating_hours,
  is_verified
)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Morong Community Health Center',
    'Clinic / Healthcare',
    'Primary healthcare services for the Morong community.',
    'Poblacion, Morong, Rizal',
    14.511000,
    121.239000,
    '(02) 1234 5678',
    '{"monday":"08:00-17:00","tuesday":"08:00-17:00","wednesday":"08:00-17:00","thursday":"08:00-17:00","friday":"08:00-17:00"}',
    TRUE
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Bayanihan Pharmacy',
    'Pharmacy',
    'Community pharmacy serving Morong residents.',
    'Morong, Rizal',
    14.508000,
    121.235000,
    NULL,
    '{"daily":"07:00-20:00"}',
    FALSE
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (provider_id, name, expected_processing_minutes)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'General Consultation', 20),
  ('11111111-1111-1111-1111-111111111111', 'Medical Records Request', 30),
  ('11111111-1111-1111-1111-111111111111', 'Vaccination', 15),
  ('11111111-1111-1111-1111-111111111111', 'Laboratory Services', 20)
ON CONFLICT DO NOTHING;
