-- ================================================================
-- Linh & Catsu — Supabase Setup
-- Run this in Supabase Dashboard → SQL Editor → New query
-- ================================================================

-- ── 1. Cats table ────────────────────────────────────────────────
create table if not exists public.cats (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  age_years   numeric not null,
  color_desc  text,
  room_order  int not null default 0
);

-- Seed the three cats
insert into public.cats (slug, name, age_years, color_desc, room_order) values
  ('rua',   'Rua',   5,   'orange tabby',      2),
  ('ri',    'Ri',    1.5, 'grey',               3),
  ('bigga', 'Bigga', 2.5, 'grey/brown tabby',   4)
on conflict (slug) do nothing;

-- ── 2. Photos table ──────────────────────────────────────────────
create table if not exists public.photos (
  id            uuid primary key default gen_random_uuid(),
  cat_id        uuid not null references public.cats(id) on delete cascade,
  storage_path  text not null,
  caption       text,
  created_at    timestamptz default now()
);

-- ── 3. Room decorations table ────────────────────────────────────
create table if not exists public.room_decorations (
  id          uuid primary key default gen_random_uuid(),
  room_id     text not null,
  item_id     text not null,
  x           numeric not null default 50,
  y           numeric not null default 50,
  rotation    numeric not null default 0,
  scale       numeric not null default 1,
  z_index     int not null default 0,
  extra_data  jsonb
);

create index if not exists room_decorations_room_id_idx on public.room_decorations(room_id);

-- ── 4. Row Level Security ────────────────────────────────────────

-- cats: public read
alter table public.cats enable row level security;
create policy "Public read cats" on public.cats for select using (true);

-- photos: public read, authenticated write
alter table public.photos enable row level security;
create policy "Public read photos"       on public.photos for select using (true);
create policy "Auth insert photos"       on public.photos for insert with check (auth.role() = 'authenticated');
create policy "Auth delete photos"       on public.photos for delete using (auth.role() = 'authenticated');

-- room_decorations: public read, authenticated write
alter table public.room_decorations enable row level security;
create policy "Public read decorations"  on public.room_decorations for select using (true);
create policy "Auth insert decorations"  on public.room_decorations for insert with check (auth.role() = 'authenticated');
create policy "Auth delete decorations"  on public.room_decorations for delete using (auth.role() = 'authenticated');

-- ── 5. Storage bucket ────────────────────────────────────────────
-- Run this separately in Storage → New bucket, OR via SQL:
insert into storage.buckets (id, name, public)
values ('cat-photos', 'cat-photos', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Public read cat photos"
  on storage.objects for select
  using (bucket_id = 'cat-photos');

create policy "Auth upload cat photos"
  on storage.objects for insert
  with check (bucket_id = 'cat-photos' and auth.role() = 'authenticated');

create policy "Auth delete cat photos"
  on storage.objects for delete
  using (bucket_id = 'cat-photos' and auth.role() = 'authenticated');
