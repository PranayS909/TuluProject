-- ===================================================================
-- Run this in Supabase (Dashboard -> SQL Editor -> Run) to enable the
-- "Suggest a word" form on contribute.html.
--
-- Anyone (logged in or not) can SUBMIT a suggestion, but nobody can
-- read them from the website. Review them in the dashboard under
-- Table Editor -> suggestions.
-- ===================================================================

create table public.suggestions (
  id bigint generated always as identity primary key,
  kind text not null check (kind in ('new_word', 'correction', 'feedback')),
  tulu text check (char_length(tulu) <= 200),
  meaning text check (char_length(meaning) <= 300),
  region text check (char_length(region) <= 60),
  notes text check (char_length(notes) <= 2000),
  display_name text check (char_length(display_name) <= 80),
  user_id uuid references auth.users (id) on delete set null,
  status text not null default 'new' check (status in ('new', 'accepted', 'rejected')),
  created_at timestamptz not null default now(),
  -- a suggestion must say *something*
  constraint suggestion_not_empty check (
    coalesce(nullif(trim(tulu), ''), nullif(trim(meaning), ''), nullif(trim(notes), '')) is not null
  )
);

alter table public.suggestions enable row level security;

-- Insert only. A logged-in user may attach their own id; anonymous
-- visitors must leave it empty. No select/update/delete policies, so
-- submissions are invisible to the public.
create policy "Anyone can submit a suggestion"
  on public.suggestions for insert
  to anon, authenticated
  with check (user_id is null or user_id = auth.uid());
