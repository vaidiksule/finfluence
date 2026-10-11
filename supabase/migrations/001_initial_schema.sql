create table if not exists public.articles (
  id text primary key,
  source text not null,
  url text,
  title text not null,
  summary text,
  published_at timestamptz not null,
  fetched_at timestamptz not null default now(),
  is_replay boolean not null default false,
  event jsonb,
  extracted_entities text[] not null default '{}',
  proposed_edges_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.graph_nodes (
  id text primary key,
  label text not null,
  type text not null,
  market text not null,
  ticker text,
  measurable boolean not null default false,
  proxy_of text,
  description text,
  first_seen timestamptz,
  last_seen timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.graph_edges (
  id text primary key,
  source_id text not null references public.graph_nodes(id),
  target_id text not null references public.graph_nodes(id),
  relation text not null,
  direction text not null,
  state text not null,
  confidence numeric not null default 0,
  rationale text not null,
  mechanism_tag text,
  event_study jsonb,
  evidence jsonb not null default '[]',
  components_used text[] not null default '{}',
  created_by text not null,
  last_validated timestamptz,
  state_reason text,
  updated_at timestamptz not null default now()
);

create index if not exists articles_published_at_idx on public.articles (published_at desc);
create index if not exists graph_edges_source_idx on public.graph_edges (source_id);
create index if not exists graph_edges_target_idx on public.graph_edges (target_id);

alter table public.articles enable row level security;
alter table public.graph_nodes enable row level security;
alter table public.graph_edges enable row level security;

create policy "public can read articles" on public.articles for select using (true);
create policy "public can read graph nodes" on public.graph_nodes for select using (true);
create policy "public can read graph edges" on public.graph_edges for select using (true);
