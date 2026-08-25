-- ===================================================================
-- Run this in Supabase: Dashboard -> SQL Editor -> New query -> Run
-- ===================================================================

-- 1. Table that holds public profile data for each user.
-- (Supabase already stores auth info in the built-in auth.users table,
-- which you should never query directly from the client. This table
-- mirrors the bits you actually want to show/use in the app.)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  xp integer not null default 0,
  streak integer not null default 0,
  created_at timestamptz not null default now()
);

-- 2. Row Level Security: users can only read/update their own row.
alter table public.profiles enable row level security;

create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profiles are updatable by owner"
  on public.profiles for update
  using (auth.uid() = id);

-- Optional: let everyone read name/xp/streak for the public leaderboard,
-- but nothing else sensitive. Skip this if you don't need it yet.
-- create policy "Profiles are viewable by everyone for leaderboard"
--   on public.profiles for select
--   using (true);

-- 3. Function + trigger: every time someone signs up (email/password
-- OR Google), Supabase inserts a row into auth.users automatically.
-- This trigger copies that into public.profiles so you never have to
-- do it manually from the client (and never need an insert policy).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
