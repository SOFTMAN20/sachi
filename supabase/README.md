# Sachi — Supabase backend

Auth, storage and database for the Sachi marketplace.

## Layout

```
supabase/
  config.toml                 local dev config (ports, auth, function jwt settings)
  migrations/
    20260624000001_init.sql   enums, tables, triggers, RLS policies
    20260624000002_storage.sql storage buckets + policies, increment_property_views()
  functions/
    _shared/cors.ts           shared CORS helper
    submit-inquiry/           public: renter creates a lead on a property
    dashboard-stats/          auth: aggregated KPIs for the signed-in owner/agent
  seed.sql                    demo landlord + listings (local only)
```

## Data model

- **profiles** — one row per `auth.users` row, created automatically by the
  `handle_new_user` trigger. Holds role, name, business name, phone, whatsapp, email, avatar, rating.
- **properties** — listings owned by a profile.
- **leads** — inquiries on a property (owner-scoped).
- **tenants / payments** — rental management (landlord / property manager).
- **commissions** — agent earnings.
- **saved_properties** — wishlist.
- **conversations / messages** — in-app chat between two profiles.

Row Level Security is enabled on every table. Active listings and profiles are
publicly readable; everything else is scoped to the authenticated owner/agent or
conversation participant.

## Local development

1. Install the CLI: `npm i -g supabase` (or use `npx supabase`).
2. Start the stack (Docker required):

   ```bash
   npx supabase start
   ```

3. Copy the printed `API URL` and `anon key` into `.env`:

   ```
   EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon key>
   ```

4. Apply migrations + seed (done automatically on `start`; to re-run):

   ```bash
   npx supabase db reset
   ```

5. Serve edge functions locally:

   ```bash
   npx supabase functions serve
   ```

Demo login (local seed): `demo@sachi.app` / `password123`.

## Deploying to a hosted project

```bash
npx supabase link --project-ref <ref>
npx supabase db push                       # apply migrations
npx supabase functions deploy submit-inquiry
npx supabase functions deploy dashboard-stats
```

Set Google OAuth + SMS provider secrets in the dashboard (Auth → Providers), and
point the app's `.env` at the hosted URL / anon key.

## Regenerating types

```bash
npx supabase gen types typescript --local > types/database.ts
```
