-- ============================================================================
-- Local dev seed. Runs after migrations on `supabase start` / `supabase db reset`.
-- Creates one demo landlord (login: demo@sachi.app / password123) and a few
-- listings. The handle_new_user trigger auto-creates the profile row.
-- ============================================================================

-- Demo landlord auth user ------------------------------------------------------
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
values (
  '00000000-0000-0000-0000-000000000000',
  'a0000000-0000-4000-8000-000000000001',
  'authenticated', 'authenticated',
  'demo@sachi.app',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Ahmed Hassan","role":"landlord"}',
  now(), now()
)
on conflict (id) do nothing;

-- Flesh out the auto-created profile -------------------------------------------
update public.profiles
   set business_name = 'Hassan Properties',
       phone         = '+255 712 345 678',
       whatsapp_phone = '+255 712 345 678',
       avatar_url    = 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200',
       rating        = 4.9
 where id = 'a0000000-0000-4000-8000-000000000001';

-- Listings ---------------------------------------------------------------------
insert into public.properties (
  owner_id, listed_as, title, description, property_type, furnishing,
  bedrooms, bathrooms, monthly_rent, deposit_amount, estimated_utilities,
  address, neighbourhood, city, amenities, status, verified_phone, verified_id,
  images, lat, lng, is_trending
)
values
(
  'a0000000-0000-4000-8000-000000000001', 'landlord',
  'Modern 3BR Apartment in Masaki',
  'Stunning ocean-view apartment in the heart of Masaki diplomatic quarter. Fully furnished with high-end finishes, 24/7 security, backup generator, and rooftop pool.',
  'apartment', 'furnished', 3, 2, 2500000, 5000000, 150000,
  'Toure Drive, Masaki, Dar es Salaam', 'Masaki', 'Dar es Salaam',
  array['Swimming Pool','Gym','Security','Generator','Parking','WiFi','Elevator','CCTV'],
  'active', true, true,
  array[
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  -6.7600, 39.2770, true
),
(
  'a0000000-0000-4000-8000-000000000001', 'landlord',
  'Cozy 2BR in Mikocheni B',
  'Well-maintained apartment in a quiet residential area of Mikocheni. Close to shopping centers, schools, and main roads. Spacious balcony with garden view.',
  'apartment', 'semi_furnished', 2, 1, 750000, 1500000, 80000,
  'Mikocheni B, Kinondoni, Dar es Salaam', 'Mikocheni', 'Dar es Salaam',
  array['Parking','Security','Water Tank','Garden'],
  'active', true, false,
  array[
    'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  -6.7730, 39.2490, true
),
(
  'a0000000-0000-4000-8000-000000000001', 'landlord',
  'Affordable Room in Kariakoo',
  'Clean and well-kept single room in a well-managed property. Shared kitchen and bathroom facilities. Easy access to Kariakoo market and public transport.',
  'room', 'unfurnished', 1, 1, 180000, 360000, 30000,
  'Kariakoo, Ilala, Dar es Salaam', 'Kariakoo', 'Dar es Salaam',
  array['Water Tank','Security'],
  'active', true, false,
  array[
    'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  -6.8200, 39.2700, false
);
