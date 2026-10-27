create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Hero',
  universe text,
  companion text,
  theme text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reflections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 10000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  status text not null default 'visible' check (status in ('visible', 'hidden', 'under_review')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.community_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  post_id uuid not null references public.community_posts(id) on delete cascade,
  reason text not null check (char_length(reason) between 1 and 1000),
  status text not null default 'open' check (status in ('open', 'under_review', 'closed')),
  created_at timestamptz not null default now()
);

create index if not exists reflections_user_id_idx on public.reflections(user_id);
create index if not exists community_posts_created_at_idx on public.community_posts(created_at desc);
create index if not exists community_reports_status_idx on public.community_reports(status);

alter table public.profiles enable row level security;
alter table public.reflections enable row level security;
alter table public.community_posts enable row level security;
alter table public.community_reports enable row level security;

create policy "profiles are readable by owner" on public.profiles for select using (auth.uid() = id);
create policy "profiles are editable by owner" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "reflections are private to owner" on public.reflections for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "visible posts are readable" on public.community_posts for select using (status = 'visible' or auth.uid() = author_id);
create policy "users create their own posts" on public.community_posts for insert with check (auth.uid() = author_id);
create policy "users edit their own posts" on public.community_posts for update using (auth.uid() = author_id) with check (auth.uid() = author_id);
create policy "users delete their own posts" on public.community_posts for delete using (auth.uid() = author_id);
create policy "users create reports" on public.community_reports for insert with check (auth.uid() = reporter_id);
create policy "users read their own reports" on public.community_reports for select using (auth.uid() = reporter_id);
