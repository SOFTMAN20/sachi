---
name: supabase-local
description: Run and manage the Sachi Supabase backend locally — start the stack, apply migrations, seed data, and serve edge functions. Use when working on the database, RLS, auth, or edge functions, or wiring app screens to live data.
---

# Sachi Supabase backend (local)

The backend lives in `supabase/`:
- `migrations/` — schema, RLS, triggers (`20260624000001_init.sql`) and storage (`..._storage.sql`).
- `functions/` — edge functions: `submit-inquiry`, `dashboard-stats` (+ `_shared/cors.ts`).
- `seed.sql` — demo data. `config.toml` — local ports.
- `src/lib/supabase.ts` — the app's client.

## Ports (from `supabase/config.toml`)
| Service | Port |
|---|---|
| API (PostgREST/Auth/Storage gateway) | **54321** |
| Postgres DB | 54322 |
| Studio (dashboard UI) | 54323 |
| Inbucket (email testing) | 54324 |

## Start the stack
Requires **Docker Desktop** running.

```powershell
npx supabase start      # boots the full local stack (first run pulls images)
```

`supabase start` prints the local API URL, anon key, and service-role key.
Open Studio at `http://localhost:54323`.

The `Supabase (local stack)` config in `.claude/launch.json` runs this too.

## Apply schema & seed
```powershell
npx supabase db reset   # re-runs all migrations, then seed.sql — destructive, resets local DB
```

## Edge functions
```powershell
npx supabase functions serve              # serve all functions locally
npx supabase functions serve submit-inquiry   # serve one
```

## Connecting the app
Set the app's Supabase env vars (see `.env.example`) to the **local** API URL
(`http://<LAN-IP>:54321`, not `localhost`, so a physical phone can reach it) and
the anon key printed by `supabase start`. The app screens currently read from
`src/data/mockData.ts` via `AppContext` and are **not yet wired** to Supabase —
wiring `AppContext` to `src/lib/supabase.ts` is the next backend milestone (see
`docs/PRD.md` §7).

## Notes
- RLS is enabled on every table; test queries as an authenticated user, not just service-role.
- A trigger auto-creates a `profiles` row on auth signup (`handle_new_user`).
