-- Run this in the Supabase SQL editor

create table if not exists public.workspaces (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  daily_minutes integer,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create table if not exists public.projects (
  id text primary key,
  workspace_id text references public.workspaces(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  color text not null,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  reminder_time text,
);

create table if not exists public.tasks (
  id text primary key,
  project_id text references public.projects(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  completed boolean not null default false,
  priority text not null default 'medium',
  date text,
  notes text not null default '',
  estimated_minutes integer,
  steps jsonb not null default '[]',
  created_at timestamptz not null,
  updated_at timestamptz not null
);

alter table public.workspaces enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;

create policy "Users manage own workspaces" on public.workspaces
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own projects" on public.projects
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own tasks" on public.tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
