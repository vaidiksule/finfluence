# Finfluence Implementation Roadmap

## Purpose

Finfluence is becoming an explainable macro-shock research cockpit for Indian markets.

The primary user workflow is:

```text
User enters a question, headline, article, or URL
        |
        v
Finfluence finds and compares relevant sources
        |
        v
The system extracts events, entities, and mechanisms
        |
        v
The system resolves entities to canonical Indian-market records
        |
        v
The graph is built progressively in the interface
        |
        v
Historical market data audits the proposed relationships
        |
        v
The user receives a concise answer, evidence, uncertainty, and an explorable graph
```

The graph is the explanation layer. It should support the answer, not replace it.

---

## Current Truth

The current repository is a working prototype, not yet a production research system.

### Real today

- OpenAI extraction runs when a valid server key is available.
- RSS feeds can be fetched from the configured sources.
- Yahoo Finance daily prices can be fetched when market refresh is triggered.
- Supabase persistence, Realtime, jobs, URL fetching, and watchlist foundations exist in code.
- The 3D graph can update through local SSE and selected Supabase Realtime subscriptions.

### Still illustrative or incomplete

- `market_cache.json` is synthetic and contains injected scenario behavior.
- Yahoo Finance is a prototype source, not a confirmed licensed production source.
- RSS snippets are not a complete source discovery or article-retrieval system.
- The LLM may still propose unsupported entities or relationships.
- The graph still starts with curated prior data when durable records are unavailable.
- The job table exists, but a separate retryable worker must still claim and process jobs.
- The current Realtime path needs durable job events and production deployment testing.

No interface should describe synthetic results as empirical validation.

---

# Phase 0 - Foundation and Truthfulness

## Goal

Make the prototype reliable enough that every result has a clear status and every limitation is visible.

## Deliverables

### 0.1 Environment and security

- Rotate any credentials that have been exposed.
- Keep OpenAI and Supabase service-role keys server-only.
- Use browser-safe Supabase publishable variables only in client code.
- Add environment validation at server startup.
- Add rate limits to ingestion and search endpoints.
- Add request IDs for tracing failed analyses.

### 0.2 Database migrations

Run and verify:

- `supabase/migrations/001_initial_schema.sql`
- `supabase/migrations/002_analysis_jobs_and_provenance.sql`

Verify these tables:

- `articles`
- `graph_nodes`
- `graph_edges`
- `analysis_jobs`
- `entity_reviews`
- `watchlists`
- `watchlist_items`

Add later:

- `research_runs`
- `source_documents`
- `article_sources`
- `relationship_evidence`
- `graph_events`
- `audit_runs`

### 0.3 Explicit statuses

Articles should have statuses such as:

```text
received
fetching
extracted
resolved
auditing
published
failed
```

Relationships should have statuses such as:

```text
proposed
supported
validated
contradicted
rejected
```

An LLM-created relationship must begin as `proposed`.

### 0.4 Prototype labels

The UI must label the following accurately:

- Illustrative scenario
- Demo market data
- Proxy measurement
- Proposed relationship
- Low-sample evidence
- Historical association, not causal proof

## Acceptance criteria

- A restart does not silently destroy persisted articles or graph records.
- A proposed relationship cannot appear as validated only because the LLM stated it.
- Every displayed evidence result includes its source and date status.
- Invalid credentials fail clearly without exposing secrets.

## User input needed

- Confirm the Supabase project is the intended production project.
- Confirm whether the first release is internal research, a public demo, or a commercial product.

---

# Phase 1 - Research Composer and Real News Graph

## Goal

Give the user a ChatGPT-style research input that accepts a question, headline, article text, or public URL and progressively builds a source-backed graph.

## User experience

The first screen should contain one primary research composer:

```text
Ask about a market event, paste a headline, or enter an article URL...
```

Examples:

- `Oil jumped after a supply disruption. What Indian companies are exposed?`
- A pasted article headline and summary
- A publicly accessible article URL
- `How could an RBI rate hike affect my watchlist?`

The submission should immediately create a visible research run and stream progress:

```text
Research run created
Reading input
Searching related sources
Comparing source coverage
Extracting event and entities
Resolving entities
Building proposed graph
Preparing evidence brief
```

## 1.1 Input classification

Classify the input into one of four modes:

1. Question: requires search and research planning.
2. URL: fetches a permitted public page.
3. Article text: analyzes supplied content.
4. Headline: searches for source coverage and context.

The classifier should be deterministic where possible. The LLM can help with ambiguous cases but must return a validated schema.

## 1.2 Source discovery

Use a provider adapter interface rather than hard-coding one vendor:

```ts
interface NewsSearchProvider {
  search(query: string, options: SearchOptions): Promise<SourceResult[]>;
}
```

Possible providers:

- Tavily: easiest LLM-oriented web research integration.
- Exa: strong semantic and source discovery capabilities.
- Bing Web Search: conventional search API.
- SerpAPI: Google-like search result access.
- GDELT: open global event discovery.
- Google News RSS: useful for prototype discovery.
- Licensed news providers: preferred for production redistribution.

Use search results for discovery and metadata. Do not bypass paywalls or copy full copyrighted articles without permission.

## 1.3 Article retrieval

For a user-supplied public URL:

- Allow only `http` and `https`.
- Block localhost, private IP ranges, internal hostnames, and redirects to private networks.
- Enforce timeouts and response-size limits.
- Accept only permitted HTML content types.
- Extract title, publication date, publisher, canonical URL, and readable text.
- Prefer `article` and metadata tags over arbitrary page text.
- Store a content hash and retrieval timestamp.
- Store only text permitted by the provider or user agreement.

If the page cannot be read, keep the URL and explain that the source requires access or could not be retrieved.

## 1.4 Source comparison and deduplication

For every discovered source, store:

- URL
- Publisher
- Headline
- Publication timestamp
- Retrieval timestamp
- Search query that found it
- Search provider
- Snippet or permitted text
- Content hash
- Source reliability metadata

Deduplicate using canonical URL, normalized headline, publisher, and content similarity.

Cluster articles that report the same event. The graph should represent one event with multiple supporting and conflicting sources, not one event node per article.

## 1.5 LLM extraction

The LLM should return structured data:

```json
{
  "event": {},
  "entities": [],
  "mechanisms": [],
  "candidate_relationships": [],
  "search_followups": [],
  "uncertainties": []
}
```

The extraction prompt must instruct the model:

- Never invent a citation.
- Quote only text present in the supplied source.
- Return `unknown` instead of guessing an entity.
- Separate reported facts from economic hypotheses.
- Avoid buy/sell language.
- Never return empirical confidence as if it were market truth.

Use OpenAI, Anthropic, or Gemini behind a provider interface. The rest of the system should not depend on one LLM vendor.

## 1.6 Graph construction animation

Publish durable `graph_events` and mirror them through Supabase Realtime:

```text
research_started
source_found
source_clustered
article_extracted
entity_proposed
entity_resolved
relationship_proposed
relationship_audited
graph_node_published
 graph_edge_published
research_completed
research_failed
```

The UI should animate the graph in this order:

1. Add the event node.
2. Add source and mechanism nodes.
3. Add proposed edges.
4. Resolve entity names and tickers.
5. Attach evidence badges.
6. Update edge states after the audit.

## Acceptance criteria

- A user can submit a question, URL, headline, or article text.
- The UI shows processing progress without appearing frozen.
- At least three related sources can be compared when available.
- Every relationship has at least one source or is visibly marked as a prior hypothesis.
- The graph changes progressively through Realtime events.
- Failed source retrieval does not fail the entire research run.

## User input needed

- Choose the first search provider: recommended starting choice is Tavily or Exa.
- Provide the provider API key if required.
- Decide whether source snippets may be persisted or only displayed temporarily.

---

# Phase 2 - Canonical Market Knowledge and Evidence Engine

## Goal

Turn extracted news into a trustworthy India-market graph with reviewable entities and reproducible evidence.

## 2.1 Canonical entity registry

Create a canonical registry for the initial India-only universe:

- Commodities: Brent crude, gold, natural gas.
- Currency: USD/INR.
- Policy and macro: RBI repo rate, inflation, yields, import bill.
- Sectors: aviation, paints and chemicals, banks, realty, IT exporters.
- Indices: Nifty 50, Nifty Bank, Nifty Realty, sector indices.
- Companies: ONGC, IndiGo, Asian Paints, Reliance, HDFC Bank, TCS, and a carefully selected extension set.

Each entity should have:

```text
canonical_id
preferred_name
aliases
entity_type
market
exchange
ticker
currency
active_dates
source_registry
review_status
```

Entity aliases should include company names, ticker symbols, abbreviations, and common spelling variants.

## 2.2 Entity resolution

Resolution order:

1. Exact canonical ID.
2. Exact ticker and exchange.
3. Alias match.
4. Controlled fuzzy match.
5. LLM suggestion placed into `entity_reviews`.
6. Human approval or rejection.

The LLM must not silently create an approved company node.

## 2.3 Evidence model

Every relationship should link to:

- Source article IDs
- Quoted passages
- Source URLs
- Retrieval timestamps
- Search provider
- Extraction model/version
- Entity-resolution decision
- Market-data provider
- Audit run/version
- Date range and sample size
- Proxy information

Evidence categories should be displayed separately:

```text
Reported by source
Economic mechanism
Historically associated
Quantitatively audited
Unsupported or disputed
```

## 2.4 Licensed market data

Replace the synthetic cache and prototype Yahoo adapter with a licensed provider.

Provider requirements:

- Indian equity daily prices
- Corporate actions and adjusted prices
- Exchange calendars
- Index history
- Currency data
- Commodity benchmarks
- Historical data retention rights
- Commercial redistribution rights if applicable

Possible vendors to evaluate:

- TrueData
- Global Datafeeds
- NSE/BSE-authorized data vendors
- Another provider with explicit India historical-data rights

The provider should implement:

```ts
interface MarketDataProvider {
  getDailySeries(request: SeriesRequest): Promise<PriceSeries>;
  getCorporateActions(symbol: string): Promise<CorporateAction[]>;
  getTradingCalendar(market: string): Promise<TradingDay[]>;
}
```

Yahoo Finance can remain a development adapter only and must be labeled as such.

## 2.5 Audit engine

For each proposed relationship:

- Map source and target entities to valid market series or explicit proxies.
- Apply trading-calendar alignment.
- Adjust for corporate actions.
- Define event triggers from the source series.
- Estimate expected returns.
- Calculate abnormal returns and CAR windows.
- Calculate lagged correlation.
- Record sample size and missing observations.
- Assign `validated`, `contradicted`, `inferred`, or `proposed`.

No causal claim should be made from correlation or an event study alone.

## 2.6 Research brief

The first output should be concise:

```text
What happened
Most exposed watchlist entities
Main mechanisms
Evidence strength
Conflicting evidence
Data limitations
Sources
```

The graph is opened as the explanation layer beneath the brief.

## Acceptance criteria

- Synthetic cache is no longer used for any production-labelled result.
- Every validated edge can be reproduced from a stored audit run.
- Unknown entities require review.
- Proxies are visible at the point of use.
- Corporate actions and calendar differences are handled.
- A user can inspect the exact source passage behind a relationship.

## User input needed

- Select and fund a licensed market-data provider.
- Provide the provider API credentials.
- Approve the initial India-market entity universe.
- Decide the minimum market-data history, recommended five years.

---

# Phase 3 - Durable Jobs, Realtime, Accounts, and Watchlists

## Goal

Make the system reliable across restarts, users, and multiple deployed instances.

## 3.1 Postgres job worker

Use the existing `analysis_jobs` table as the durable queue.

A worker should:

1. Claim a pending job atomically.
2. Set it to `running` with a lease timestamp.
3. Increment attempts.
4. Execute the current stage.
5. Write stage events.
6. Retry transient failures with backoff.
7. Mark permanent failures with an actionable reason.
8. Release or expire abandoned leases.

No Redis is required initially. Options:

- Supabase scheduled Edge Function polling jobs.
- A small worker deployed on Render, Fly.io, Railway, or a similar service.
- Supabase Postgres queue extensions where available.

The worker must be separate from the browser request lifecycle.

## 3.2 Supabase Realtime

Use Realtime for:

- `graph_events`
- `analysis_jobs`
- `graph_nodes`
- `graph_edges`
- `articles`

The browser subscribes to the current `research_run_id`, not to every graph event in the whole database.

Use the local SSE route only as a development fallback.

## 3.3 Authentication

Use Supabase Auth with:

- Passwordless email login initially.
- Optional Google login later.
- Row-level security for user data.
- Server-side authorization for research runs and watchlists.

Users should own:

- Watchlists
- Saved research runs
- Saved source collections
- Alert preferences

Global canonical entities and public evidence records should remain separate from private user data.

## 3.4 Watchlists

A watchlist item should connect to:

- Canonical entity
- User watchlist
- Current exposure mechanisms
- Latest relevant research runs
- Latest validated or proposed relationship states
- Data freshness timestamp

The watchlist brief should answer:

```text
Which current events touch my holdings?
Through which mechanisms?
How strong is the evidence?
What is uncertain?
```

## Acceptance criteria

- A browser refresh does not lose a research run.
- A server restart does not lose jobs, articles, or graph records.
- Two browser sessions receive the same graph updates.
- Failed jobs retry safely without duplicate edges.
- Authenticated watchlists persist across devices.
- Users cannot read another user's private watchlist.

---

# Phase 4 - Product Quality and Research Trust

## Goal

Turn the system into a repeatable research product rather than a demonstration.

## Deliverables

### Explainability

- Source comparison panel.
- Conflicting-source display.
- Exact quoted passages.
- Methodology drawer.
- Data freshness and sample-size badges.
- Audit-run version links.

### Review workflow

- Approve/reject unknown entities.
- Approve/reject proposed relationships.
- Record reviewer and timestamp.
- Allow corrections without deleting original evidence.

### Reliability

- Structured logging.
- Error monitoring.
- Job latency metrics.
- Provider quota monitoring.
- LLM cost tracking.
- Source fetch failure tracking.
- Database backup and restore testing.

### User-facing safety

- No buy/sell recommendations.
- No target prices.
- No certainty language unsupported by evidence.
- Clear distinction between mechanism, association, and causality.
- Visible limitations on every research brief.

### Testing

Add tests for:

- URL safety and redirect blocking.
- Article deduplication.
- Source clustering.
- Entity matching.
- Entity review transitions.
- Graph construction.
- Root-to-leaf path selection.
- Event-study calculations.
- Corporate-action adjustments.
- Job retries and leases.
- Realtime event ordering.
- Watchlist authorization.
- UI research-run flow.

---

# Suggested Repository Structure

```text
src/
  app/
    api/
      research/
      sources/
      jobs/
      entities/
      watchlists/
      realtime/
  components/
    ResearchComposer.tsx
    ResearchRunStatus.tsx
    EvidenceBrief.tsx
    SourceCluster.tsx
    EntityReviewQueue.tsx
    Graph3D.tsx
    Watchlist.tsx
  lib/
    research/
      orchestrator.ts
      stages.ts
      schemas.ts
    sources/
      types.ts
      tavily.ts
      exa.ts
      gdelt.ts
      rss.ts
      web.ts
    entities/
      resolver.ts
      registry.ts
    market/
      provider.ts
      licensed-provider.ts
      yahoo-demo.ts
    jobs/
      claim.ts
      worker.ts
      retry.ts
    provenance/
      hash.ts
      records.ts
    realtime/
      events.ts
    persistence/
      supabase.ts
      local.ts
    quant/
      eventStudy.ts
      correlation.ts
      scoring.ts
supabase/
  migrations/
    001_initial_schema.sql
    002_analysis_jobs_and_provenance.sql
    003_research_runs_and_sources.sql
    004_graph_events_and_watchlists.sql
```

---

# Recommended First Implementation Sprint

Do not implement all phases simultaneously. The first sprint should be:

1. Add `research_runs` and `graph_events` tables.
2. Build the ChatGPT-style `ResearchComposer`.
3. Add one search provider adapter, preferably Tavily or Exa.
4. Store source metadata and content hashes.
5. Stream research stages into the UI.
6. Reuse the existing structured extraction pipeline.
7. Show a concise evidence brief before the graph.
8. Keep all new relationships `proposed`.
9. Add source comparison and evidence links.
10. Test the complete question-to-graph flow.

This gives the product its core identity before investing in provider breadth, complex quant models, or advanced account features.

---

# Decisions We Need From the Assistant/User

The implementation can continue without deciding everything, but these choices require explicit approval:

1. **Search provider:** Tavily, Exa, Bing, SerpAPI, or GDELT.
2. **News licensing:** prototype RSS/GDELT discovery versus licensed article provider.
3. **Market-data provider:** TrueData, Global Datafeeds, NSE-authorized provider, or another licensed vendor.
4. **LLM provider:** OpenAI, Anthropic, Gemini, or a provider abstraction using more than one.
5. **Storage policy:** metadata/snippets only versus licensed full-text storage.
6. **Initial universe:** the first 10-20 Indian entities and three shock families.
7. **Deployment:** single Next.js deployment plus Supabase worker, or a separate worker service.
8. **Authentication:** email magic links only for the first release or social login as well.
9. **Research retention:** how long to keep source metadata, graph runs, and audit records.

When a provider credential, license decision, or product policy is required, implementation should stop at the adapter boundary and ask for that decision rather than silently using an unsuitable source.

---

# Definition of Done for the First Credible Release

A release is credible when:

- A user can enter a question, headline, article text, or URL.
- The system discovers and compares permitted sources.
- The system creates one event with linked entities and mechanisms.
- Unknown entities are reviewable.
- The graph builds progressively in realtime.
- New relationships begin as proposed.
- Historical evidence comes from a licensed provider.
- Every claim has source and retrieval provenance.
- The brief clearly separates reported facts, mechanisms, associations, and contradictions.
- A user can save a watchlist and see relevant research runs.
- A restart, retry, or second browser session does not corrupt or lose the analysis.
