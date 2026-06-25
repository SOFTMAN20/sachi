-- ============================================================================
-- Storage buckets: property images & user avatars
-- Convention: files live under a top-level folder named after the owner's uid
--   property-images/<uid>/<file>.jpg
--   avatars/<uid>/<file>.jpg
-- ============================================================================

insert into storage.buckets (id, name, public)
values
  ('property-images', 'property-images', true),
  ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Public read for both buckets -------------------------------------------------
create policy "Public read property images"
  on storage.objects for select
  using (bucket_id = 'property-images');

create policy "Public read avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Authenticated users may write only inside their own <uid>/ folder ------------
create policy "Users upload their own property images"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'property-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users update their own property images"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'property-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users delete their own property images"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'property-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users upload their own avatar"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users update their own avatar"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users delete their own avatar"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================================
-- Helper RPC: atomically bump a property's view counter (callable by anyone)
-- ============================================================================
create or replace function public.increment_property_views(prop uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.properties set views_count = views_count + 1 where id = prop;
$$;

grant execute on function public.increment_property_views(uuid) to anon, authenticated;
