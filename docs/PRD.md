# Sachi — Product Requirements Document

**Status:** Draft · **Last updated:** 2026-06-27 · **Owner:** Sachi team

---

## 1. Overview

**Sachi** is an AI-powered, Zillow-like property marketplace for the East African
rental market (default market: **Dar es Salaam, Tanzania**). Unlike renter-only
listing apps, Sachi is a two-sided platform serving both the **demand side**
(renters searching for homes) and the **supply side** (landlords, agents, and
property managers who list, market, and manage properties and tenants).

The product is **native-first** — the primary experience is the iOS/Android app
delivered through Expo Go (and later standalone builds). The web build is a
secondary/fallback surface.

### Vision
Make finding, listing, and managing rental property in Tanzania trustworthy,
fast, and mobile-first — with verification and messaging built in so renters and
owners can transact with confidence.

---

## 2. Target users & roles

The platform models five first-class roles (see `user_role` enum in the schema):

| Role | Primary jobs-to-be-done |
|---|---|
| **Tenant / renter** | Search and filter listings, save favourites, message owners, submit inquiries, book viewings. |
| **Landlord** | List owned properties, receive and manage leads, track tenants and rent payments. |
| **Agent** | List properties on behalf of owners, manage a lead inbox, track commissions and billing. |
| **Property manager** | Operate a portfolio: properties, leads, tenants, and payment collection at scale. |
| **Admin** | Platform oversight: manage users and properties, feature listings, view reports and analytics. |

---

## 3. Goals & non-goals

### Goals
- A trustworthy marketplace with **verification signals** (verified phone, verified ID, ratings).
- Role-specific dashboards so supply-side users can run their business in-app.
- In-app **messaging** and **lead capture** connecting renters to owners.
- Localised for Tanzania: Swahili-friendly copy ("Karibu"), TZS pricing, local neighbourhoods.

### Non-goals (current phase)
- In-app payments / rent collection rails (payments are **tracked**, not processed).
- Cross-country expansion beyond the Tanzania market.
- Long-term standalone store distribution (currently Expo Go + EAS Updates).

---

## 4. Product surfaces

File-based routing via **Expo Router** (`src/app`). Current surfaces:

### 4.1 Renter app — `src/app/(tabs)`
- **Home** (`index`) — greeting, search, type filters (apartment/house/room/hostel/office), price-range filters, property cards, trending.
- **Explore** — discovery / map-style browsing.
- **Saved** — wishlist of saved properties.
- **Messages** — conversations with owners/agents.
- **Profile** — user profile and settings.
- **Property detail** (`property/[id]`) — full listing with owner card and inquiry CTA.
- **Add listing** (`add-listing`) and **Edit profile** (`edit-profile`).

### 4.2 Agent dashboard — `src/app/agent-dashboard`
`index` · `listings` · `lead-inbox` · `profile` · `billing`

### 4.3 Rental manager — `src/app/rental-manager`
`index` · `properties` · `leads` · `tenants` · `payments`

### 4.4 Admin — `src/app/admin` + `admin-dashboard`
`users` · `properties` · `reports` · `analytics` · `featured`

---

## 5. Core features & requirements

### 5.1 Listings & search
- Properties carry: type, furnishing status, bedrooms/bathrooms, monthly rent,
  deposit, estimated utilities, address/neighbourhood/city, amenities, images,
  geocoordinates (`lat`/`lng`), and a trending flag.
- Renters filter by **type**, **price range**, **location/neighbourhood**, and free-text search.
- Listing lifecycle: `pending_review → active → rented` (`listing_status`).

### 5.2 Trust & verification
- Per-listing `verified_phone` and `verified_id` badges.
- Per-profile `rating` (default 5.0).
- Admin moderation gate via `pending_review` status and the admin surfaces.

### 5.3 Leads & messaging
- **Leads** captured against a property (status: `new → contacted → viewing_scheduled → closed/lost`),
  owner-denormalised for fast access; created via the `submit-inquiry` edge function.
- **Conversations + messages** between two participants, scoped to a property,
  with unread tracking and last-message preview (kept fresh by a DB trigger).

### 5.4 Owner operations
- **Tenants**: lease tracking (move-in, lease-end, rent amount, status).
- **Payments**: rent due/paid/overdue tracking (not processed in-app).
- **Commissions**: agent earnings, pending/paid.
- **Dashboard stats** surfaced via the `dashboard-stats` edge function.

---

## 6. Technical architecture

| Layer | Choice |
|---|---|
| App framework | **Expo SDK 54**, React Native 0.81, React 19.1 |
| Navigation | **Expo Router** (file-based, typed routes), root at `src/app` |
| Language | TypeScript (strict) |
| UI | React Native primitives, `lucide-react-native` icons, custom theming |
| State | React Context (`AppContext`) — currently sourced from `src/data/mockData.ts` |
| Backend | **Supabase** — Postgres + Auth + Storage + Edge Functions |
| Distribution | Expo Go (native-first) + EAS Updates; web build as fallback |

### 6.1 Data model (Supabase)
Tables: `profiles`, `properties`, `leads`, `tenants`, `payments`, `commissions`,
`saved_properties`, `conversations`, `messages`. Full **Row Level Security** is
enabled — public read of active listings/profiles, owner-scoped writes,
participant-scoped messaging. A trigger auto-creates a `profile` on auth signup.

### 6.2 Edge functions
- `submit-inquiry` — creates a lead from a renter inquiry.
- `dashboard-stats` — aggregates owner/agent dashboard metrics.

---

## 7. Current state & gaps

- ✅ All primary screens and role dashboards exist and render.
- ✅ Supabase backend **scaffolded**: schema + RLS + triggers + storage + seed + two edge functions.
- ⚠️ **App screens still run on mock data** (`AppContext` → `mockData.ts`); they are **not yet wired** to Supabase.
- ⚠️ Auth flow (signup/login → role selection) not yet connected to the live backend.
- ⚠️ Image upload to Supabase Storage not yet wired from `add-listing`.

### Next milestones
1. Wire `AppContext` to the Supabase client (`src/lib/supabase.ts`); replace mock reads with live queries.
2. Connect auth + role selection; rely on the `handle_new_user` trigger for profile creation.
3. Wire inquiry submission and messaging to the live backend.
4. Wire image upload (Storage) into the add-listing flow.

---

## 8. Localisation & market notes
- Default city **Dar es Salaam**; prices in **TZS** (e.g. "Under 300K", "Above 2M").
- Swahili-forward copy ("Karibu Sachi" = "Welcome to Sachi").
- Neighbourhood-based discovery tuned to local areas (`src/data/mockData.ts`).

---

## 9. Open questions
- Payments: keep tracking-only, or integrate a mobile-money rail (e.g. M-Pesa/Tigo Pesa)?
- AI surface: where does "AI-powered" concretely show up (search ranking, pricing suggestions, chat assistant)?
- Distribution: when do we move from Expo Go to standalone EAS builds for store release?
