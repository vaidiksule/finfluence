alter table public.articles
  add column if not exists content_hash text,
  add column if not exists retrieved_at timestamptz,
  add column if not exists extraction_model text,
  add column if not exists extraction_version text,
  add column if not exists source_kind text not null default 'user_submitted';

alter table public.graph_nodes
  add column if not exists unresolved boolean not null default false,
  add column if not exists review_status text not null default 'approved';

alter table public.graph_edges
  add column if not exists provenance jsonb not null default '[]',
  add column if not exists review_status text not null default 'proposed',
  add column if not exists audit_version text;

create table if not exists public.analysis_jobs (
  id uuid primary key default gen_random_uuid(),
  article_id text not null references public.articles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'running', 'succeeded', 'failed')),
  attempts integer not null default 0,
  error text,
  requested_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists analysis_jobs_pending_idx on public.analysis_jobs (status, requested_at);

create table if not exists public.entity_reviews (
  id uuid primary key default gen_random_uuid(),
  node_id text not null references public.graph_nodes(id) on delete cascade,
  proposed_name text not null,
  proposed_ticker text,
  proposed_type text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.watchlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'My watchlist',
  created_at timestamptz not null default now()
);

create table if not exists public.watchlist_items (
  watchlist_id uuid not null references public.watchlists(id) on delete cascade,
  node_id text not null references public.graph_nodes(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (watchlist_id, node_id)
);

alter table public.analysis_jobs enable row level security;
alter table public.entity_reviews enable row level security;
alter table public.watchlists enable row level security;
alter table public.watchlist_items enable row level security;

create policy "users can read their analysis jobs" on public.analysis_jobs
  for select using (true);
create policy "users can read entity reviews" on public.entity_reviews
  for select using (true);
create policy "users manage their watchlists" on public.watchlists
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage their watchlist items" on public.watchlist_items
  for all using (exists (select 1 from public.watchlists w where w.id = watchlist_id and w.user_id = auth.uid()))
  with check (exists (select 1 from public.watchlists w where w.id = watchlist_id and w.user_id = auth.uid()));

-- Enables browser clients to receive durable graph changes through Supabase Realtime.
alter publication supabase_realtime add table public.articles;
alter publication supabase_realtime add table public.graph_nodes;
alter publication supabase_realtime add table public.graph_edges;
alter publication supabase_realtime add table public.analysis_jobs;
