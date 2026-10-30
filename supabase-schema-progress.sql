-- ===================================================================
-- Run this AFTER supabase-schema.sql and supabase-schema-enrollments.sql
-- (Dashboard -> SQL Editor -> New query -> Run).
--
-- Saves unit completions and awards XP + streak. XP amounts are fixed
-- here on the server, so a learner can't award themselves points from
-- the browser. Each unit pays out XP once; replaying it still counts
-- toward the daily streak.
-- ===================================================================

-- 1. Remember the last day a learner finished something (for streaks).
alter table public.profiles add column if not exists last_active_on date;

-- 2. One row per unit a learner has finished.
create table if not exists public.unit_completions (
  user_id uuid not null references public.profiles (id) on delete cascade,
  unit_key text not null,                 -- 'unit-1' … 'unit-5'
  completed_at timestamptz not null default now(),
  primary key (user_id, unit_key)
);

alter table public.unit_completions enable row level security;

create policy "Completions are viewable by owner"
  on public.unit_completions for select
  using (auth.uid() = user_id);
-- No insert/update policy on purpose: rows are only written by
-- complete_unit() below, which runs with elevated rights.

-- 3. Called by the practice pages when a unit is finished.
create or replace function public.complete_unit(p_unit_key text)
returns json
language plpgsql
security definer set search_path = public
as $$
declare
  v_user    uuid := auth.uid();
  v_today   date := (now() at time zone 'Asia/Kolkata')::date;
  v_xp      integer;
  v_first   boolean;
  v_profile public.profiles;
begin
  if v_user is null then
    raise exception 'not signed in';
  end if;

  v_xp := case p_unit_key
    when 'unit-1' then 100
    when 'unit-2' then 100
    when 'unit-3' then 120
    when 'unit-4' then 120
    when 'unit-5' then 150
    else null
  end;
  if v_xp is null then
    raise exception 'unknown unit %', p_unit_key;
  end if;

  insert into public.unit_completions (user_id, unit_key)
  values (v_user, p_unit_key)
  on conflict do nothing;
  v_first := found;  -- true only the first time this unit is finished

  update public.profiles set
    xp = xp + case when v_first then v_xp else 0 end,
    streak = case
      when last_active_on = v_today     then streak      -- already counted today
      when last_active_on = v_today - 1 then streak + 1  -- kept the streak going
      else 1                                           -- first day, or streak broken
    end,
    last_active_on = v_today
  where id = v_user
  returning * into v_profile;

  insert into public.enrollments (user_id, unit_key, status)
  values (v_user, p_unit_key, 'complete')
  on conflict (user_id, unit_key) do update set status = 'complete';

  return json_build_object(
    'xp_awarded', case when v_first then v_xp else 0 end,
    'xp_total',   v_profile.xp,
    'streak',     v_profile.streak,
    'first_time', v_first
  );
end;
$$;

revoke all on function public.complete_unit(text) from public;
grant execute on function public.complete_unit(text) to authenticated;

-- 4. Close the loophole in supabase-schema.sql: "Profiles are updatable
-- by owner" let a signed-in user set their own xp/streak to anything.
-- Learners may still edit their name and avatar; xp and streak now only
-- change through complete_unit().
revoke update on public.profiles from authenticated;
grant update (full_name, avatar_url) on public.profiles to authenticated;
