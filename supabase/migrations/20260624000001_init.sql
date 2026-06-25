-- ============================================================================
-- Sachi — initial schema (profiles, properties, leads, tenants, payments,
-- commissions, saved properties, conversations/messages) + RLS + triggers.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------
create type public.user_role        as enum ('tenant', 'landlord', 'agent', 'property_manager', 'admin');
create type public.property_type    as enum ('apartment', 'house', 'room', 'hostel', 'office', 'commercial');
create type public.furnishing_status as enum ('furnished', 'semi_furnished', 'unfurnished');
create type public.listing_status   as enum ('active', 'rented', 'pending_review');
create type public.lead_status      as enum ('new', 'contacted', 'viewing_scheduled', 'closed', 'lost');
create type public.tenant_status    as enum ('active', 'pending', 'former');
create type public.payment_status   as enum ('paid', 'due', 'overdue');
create type public.commission_status as enum ('paid', 'pending');

-- ----------------------------------------------------------------------------
-- profiles — one row per auth user (created automatically via trigger)
-- ----------------------------------------------------------------------------
create table public.profiles (
  id             uuid primary key references auth.users (id) on delete cascade,
  role           public.user_role,
  full_name      text,
  business_name  text,
  phone          text,
  whatsapp_phone text,
  email          text,
  avatar_url     text,
  rating         numeric(2,1) not null default 5.0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- properties
-- ----------------------------------------------------------------------------
create table public.properties (
  id                  uuid primary key default gen_random_uuid(),
  owner_id            uuid not null references public.profiles (id) on delete cascade,
  listed_as           public.user_role,
  title               text not null,
  description         text not null default '',
  property_type       public.property_type not null,
  furnishing          public.furnishing_status not null default 'unfurnished',
  bedrooms            int not null default 0,
  bathrooms           int not null default 0,
  monthly_rent        bigint not null default 0,
  deposit_amount      bigint not null default 0,
  estimated_utilities bigint not null default 0,
  address             text not null default '',
  neighbourhood       text not null default '',
  city                text not null default 'Dar es Salaam',
  amenities           text[] not null default '{}',
  status              public.listing_status not null default 'pending_review',
  verified_phone      boolean not null default false,
  verified_id         boolean not null default false,
  images              text[] not null default '{}',
  lat                 double precision,
  lng                 double precision,
  is_trending         boolean not null default false,
  views_count         int not null default 0,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index properties_owner_id_idx      on public.properties (owner_id);
create index properties_status_idx        on public.properties (status);
create index properties_neighbourhood_idx on public.properties (neighbourhood);
create index properties_type_idx          on public.properties (property_type);

-- ----------------------------------------------------------------------------
-- leads — inquiries on a property (owner_id denormalised for fast RLS)
-- ----------------------------------------------------------------------------
create table public.leads (
  id          uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties (id) on delete cascade,
  owner_id    uuid not null references public.profiles (id) on delete cascade,
  renter_id   uuid references public.profiles (id) on delete set null,
  name        text not null,
  avatar_url  text,
  message     text not null default '',
  source      text not null default 'Sachi App',
  status      public.lead_status not null default 'new',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index leads_owner_id_idx    on public.leads (owner_id);
create index leads_property_id_idx on public.leads (property_id);
create index leads_status_idx      on public.leads (status);

-- ----------------------------------------------------------------------------
-- tenants
-- ----------------------------------------------------------------------------
create table public.tenants (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid not null references public.profiles (id) on delete cascade,
  property_id  uuid references public.properties (id) on delete set null,
  profile_id   uuid references public.profiles (id) on delete set null,
  name         text not null,
  email        text,
  phone        text,
  rent_amount  bigint not null default 0,
  move_in_date date,
  lease_end    date,
  status       public.tenant_status not null default 'active',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index tenants_owner_id_idx on public.tenants (owner_id);

-- ----------------------------------------------------------------------------
-- payments
-- ----------------------------------------------------------------------------
create table public.payments (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references public.profiles (id) on delete cascade,
  tenant_id   uuid references public.tenants (id) on delete set null,
  property_id uuid references public.properties (id) on delete set null,
  amount      bigint not null default 0,
  due_date    date,
  method      text,
  status      public.payment_status not null default 'due',
  paid_at     timestamptz,
  created_at  timestamptz not null default now()
);

create index payments_owner_id_idx on public.payments (owner_id);
create index payments_status_idx   on public.payments (status);

-- ----------------------------------------------------------------------------
-- commissions — agent earnings
-- ----------------------------------------------------------------------------
create table public.commissions (
  id          uuid primary key default gen_random_uuid(),
  agent_id    uuid not null references public.profiles (id) on delete cascade,
  property_id uuid references public.properties (id) on delete set null,
  client_name text not null,
  amount      bigint not null default 0,
  status      public.commission_status not null default 'pending',
  earned_on   date not null default current_date,
  created_at  timestamptz not null default now()
);

create index commissions_agent_id_idx on public.commissions (agent_id);

-- ----------------------------------------------------------------------------
-- saved_properties — wishlist
-- ----------------------------------------------------------------------------
create table public.saved_properties (
  user_id     uuid not null references public.profiles (id) on delete cascade,
  property_id uuid not null references public.properties (id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, property_id)
);

-- ----------------------------------------------------------------------------
-- conversations + messages
-- ----------------------------------------------------------------------------
create table public.conversations (
  id              uuid primary key default gen_random_uuid(),
  property_id     uuid references public.properties (id) on delete set null,
  participant_a   uuid not null references public.profiles (id) on delete cascade,
  participant_b   uuid not null references public.profiles (id) on delete cascade,
  last_message    text,
  last_message_at timestamptz,
  created_at      timestamptz not null default now(),
  unique (property_id, participant_a, participant_b)
);

create index conversations_a_idx on public.conversations (participant_a);
create index conversations_b_idx on public.conversations (participant_b);

create table public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id       uuid not null references public.profiles (id) on delete cascade,
  body            text not null,
  read            boolean not null default false,
  created_at      timestamptz not null default now()
);

create index messages_conversation_id_idx on public.messages (conversation_id, created_at);

-- ============================================================================
-- Triggers
-- ============================================================================

-- Generic updated_at maintainer ------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at   before update on public.profiles   for each row execute function public.set_updated_at();
create trigger set_properties_updated_at before update on public.properties for each row execute function public.set_updated_at();
create trigger set_leads_updated_at      before update on public.leads      for each row execute function public.set_updated_at();
create trigger set_tenants_updated_at    before update on public.tenants    for each row execute function public.set_updated_at();

-- Create a profile automatically when a new auth user signs up -----------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, phone, full_name, role)
  values (
    new.id,
    new.email,
    new.phone,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    nullif(new.raw_user_meta_data ->> 'role', '')::public.user_role
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep conversation preview in sync with its latest message --------------------
create or replace function public.touch_conversation()
returns trigger
language plpgsql
as $$
begin
  update public.conversations
     set last_message = new.body,
         last_message_at = new.created_at
   where id = new.conversation_id;
  return new;
end;
$$;

create trigger on_message_created
  after insert on public.messages
  for each row execute function public.touch_conversation();

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.profiles         enable row level security;
alter table public.properties       enable row level security;
alter table public.leads            enable row level security;
alter table public.tenants          enable row level security;
alter table public.payments         enable row level security;
alter table public.commissions      enable row level security;
alter table public.saved_properties enable row level security;
alter table public.conversations    enable row level security;
alter table public.messages         enable row level security;

-- profiles: anyone can read (owner cards on listings); user manages own row -----
create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- properties: active listings public; owners manage their own -------------------
create policy "Active listings are public"
  on public.properties for select
  using (status = 'active' or owner_id = auth.uid());

create policy "Owners can insert their own properties"
  on public.properties for insert with check (owner_id = auth.uid());

create policy "Owners can update their own properties"
  on public.properties for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "Owners can delete their own properties"
  on public.properties for delete using (owner_id = auth.uid());

-- leads: property owner reads/manages; authenticated users can create -----------
create policy "Owners can read leads on their properties"
  on public.leads for select using (owner_id = auth.uid() or renter_id = auth.uid());

create policy "Authenticated users can create leads"
  on public.leads for insert to authenticated with check (true);

create policy "Owners can update their leads"
  on public.leads for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "Owners can delete their leads"
  on public.leads for delete using (owner_id = auth.uid());

-- tenants / payments / commissions: owner-scoped --------------------------------
create policy "Owners manage their tenants"
  on public.tenants for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "Owners manage their payments"
  on public.payments for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "Agents manage their commissions"
  on public.commissions for all using (agent_id = auth.uid()) with check (agent_id = auth.uid());

-- saved_properties: each user owns their wishlist rows --------------------------
create policy "Users manage their saved properties"
  on public.saved_properties for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- conversations / messages: participants only -----------------------------------
create policy "Participants can read conversations"
  on public.conversations for select
  using (participant_a = auth.uid() or participant_b = auth.uid());

create policy "Participants can create conversations"
  on public.conversations for insert
  with check (participant_a = auth.uid() or participant_b = auth.uid());

create policy "Participants can update conversations"
  on public.conversations for update
  using (participant_a = auth.uid() or participant_b = auth.uid());

create policy "Participants can read messages"
  on public.messages for select
  using (exists (
    select 1 from public.conversations c
    where c.id = messages.conversation_id
      and (c.participant_a = auth.uid() or c.participant_b = auth.uid())
  ));

create policy "Participants can send messages"
  on public.messages for insert
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and (c.participant_a = auth.uid() or c.participant_b = auth.uid())
    )
  );
