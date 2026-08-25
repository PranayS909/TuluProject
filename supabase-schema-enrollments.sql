-- ===================================================================
-- Run this AFTER supabase-schema.sql (Dashboard -> SQL Editor -> Run).
-- Adds a table that tracks which course units a user has started.
-- ===================================================================

create table public.enrollments (
  user_id uuid not null references public.profiles (id) on delete cascade,
  unit_key text not null,              -- e.g. 'unit-1', 'unit-2'
  status text not null default 'in_progress', -- 'in_progress' | 'complete'
  started_at timestamptz not null default now(),
  primary key (user_id, unit_key)
);

alter table public.enrollments enable row level security;

create policy "Enrollments are viewable by owner"
  on public.enrollments for select
  using (auth.uid() = user_id);

create policy "Enrollments are insertable by owner"
  on public.enrollments for insert
  with check (auth.uid() = user_id);

create policy "Enrollments are updatable by owner"
  on public.enrollments for update
  using (auth.uid() = user_id);
