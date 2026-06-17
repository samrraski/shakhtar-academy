-- ============================================================
-- Shakhtar Academy Calgary — Initial Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- ── Profiles (extends auth.users) ──────────────────────────
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  full_name    text,
  phone        text,
  role         text not null default 'parent',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Programs ───────────────────────────────────────────────
create table if not exists public.programs (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  age_group        text,
  description      text,
  price            numeric(10,2),
  schedule_summary text,
  is_active        boolean not null default true,
  created_at       timestamptz not null default now()
);

alter table public.programs enable row level security;

-- Anyone (including signed-out visitors) can browse programs
create policy "Programs are publicly readable"
  on public.programs for select
  using (true);

-- No public write policies yet — manage programs from the Supabase
-- SQL editor / table view until an admin role + admin UI exist.

-- ── Players (parents' children) ────────────────────────────
create table if not exists public.players (
  id            uuid primary key default gen_random_uuid(),
  parent_id     uuid not null references public.profiles(id) on delete cascade,
  full_name     text not null,
  date_of_birth date,
  notes         text,
  created_at    timestamptz not null default now()
);

alter table public.players enable row level security;

create policy "Parents manage own players"
  on public.players for all
  using (auth.uid() = parent_id)
  with check (auth.uid() = parent_id);

-- ── Registrations ──────────────────────────────────────────
create table if not exists public.registrations (
  id          uuid primary key default gen_random_uuid(),
  player_id   uuid not null references public.players(id) on delete cascade,
  program_id  uuid not null references public.programs(id) on delete cascade,
  status      text not null default 'pending'
                check (status in ('pending','active','cancelled')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.registrations enable row level security;

create policy "Parents manage registrations for own players"
  on public.registrations for all
  using (
    exists (
      select 1 from public.players p
      where p.id = registrations.player_id and p.parent_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.players p
      where p.id = registrations.player_id and p.parent_id = auth.uid()
    )
  );

-- ── Events (training, games, tournaments) ──────────────────
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  program_id  uuid not null references public.programs(id) on delete cascade,
  title       text not null,
  type        text not null default 'training'
                check (type in ('training','game','tournament')),
  location    text,
  start_time  timestamptz not null,
  end_time    timestamptz,
  created_at  timestamptz not null default now()
);

alter table public.events enable row level security;

-- Anyone can see the schedule (public marketing pages show it too)
create policy "Events are publicly readable"
  on public.events for select
  using (true);

-- No public write policies yet — manage events from the Supabase
-- SQL editor / table view until an admin role + admin UI exist.

-- ── Inquiries (public contact form submissions) ────────────
create table if not exists public.inquiries (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  email            text not null,
  phone            text,
  program_interest text,
  message          text,
  status           text not null default 'new'
                     check (status in ('new','contacted','closed')),
  created_at       timestamptz not null default now()
);

alter table public.inquiries enable row level security;

-- Anyone can submit an inquiry (public contact form)
create policy "Public can submit inquiry"
  on public.inquiries for insert
  with check (true);

-- Only authenticated users (staff) can read submitted inquiries
create policy "Staff can read inquiries"
  on public.inquiries for select
  using (auth.role() = 'authenticated');

-- ── Admin helper function ─────────────────────────────────
create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- ── Admin policies ─────────────────────────────────────────
-- Admins can read ALL profiles (for the admin panel user list)
create policy "Admins can read all profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "Admins can update all profiles"
  on public.profiles for update
  using (public.is_admin());

-- Admins can read all players
create policy "Admins can read all players"
  on public.players for select
  using (public.is_admin());

-- Admins can manage all registrations
create policy "Admins can manage all registrations"
  on public.registrations for all
  using (public.is_admin())
  with check (public.is_admin());

-- Admins can manage programs (add/edit/disable)
create policy "Admins can manage programs"
  on public.programs for all
  using (public.is_admin())
  with check (public.is_admin());

-- Admins can manage events
create policy "Admins can manage events"
  on public.events for all
  using (public.is_admin())
  with check (public.is_admin());

-- Admins can manage inquiries (mark contacted, close)
create policy "Admins can manage inquiries"
  on public.inquiries for all
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- Sample data — the 4 launch programs
-- Safe to re-run: skips rows that already exist by name
-- ============================================================
insert into public.programs (name, age_group, description, price, schedule_summary, is_active)
select * from (values
  ('Mini Strikers',     'U6 – U8',   'An introduction to the game built entirely around fun — first touches, coordination, and a love for the ball.',                  149.00, 'Tue & Thu · 5:00–6:00 PM · Field House',              true),
  ('Development Squad', 'U9 – U12',  'Building the technical and tactical foundation players rely on for the rest of their careers.',                                  189.00, 'Mon, Wed & Fri · 5:30–7:00 PM · Field House',         true),
  ('Elite Pathway',     'U13 – U16', 'Our most competitive program — high-intensity training, advanced tactics, and a full league + tournament schedule.',             239.00, 'Mon–Thu · 6:00–7:30 PM · Field House & Turf 2',       true),
  ('Pre-Academy',       'U17+',      'The final step before senior and post-secondary soccer — elite-level training and exposure to scouts and recruiters.',          259.00, 'Mon, Tue & Thu · 7:00–8:30 PM · Field House & Turf 2', true)
) as v(name, age_group, description, price, schedule_summary, is_active)
where not exists (
  select 1 from public.programs p where p.name = v.name
);
