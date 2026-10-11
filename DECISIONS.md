# DECISIONS.md — Architecture & Quantitative Assumptions

This document records all architectural choices, quantitative assumptions, scoring parameters, and design decisions made for **RippleGraph** during Hackwave 3.0 (Problem Statement 5: Autonomous Financial Event Market Impact Graph).

---

## 1. Stack & Architecture

- **Unified Next.js 14+ (App Router, TypeScript):**
  - **Decision:** Consolidated into a 100% Next.js application instead of a decoupled Python FastAPI + Next.js architecture.
  - **Rationale:** Eliminates cross-origin CORS issues, dual environment maintenance (pip vs npm), and multi-service deployment synchronization during a 12-hour hackathon. All API endpoints, Server-Sent Events (`/api/stream`), quant math, and 3D WebGL interfaces run in one cohesive process.

- **3D WebGL Force Graph (`react-force-graph-3d` + Three.js):**
  - **Decision:** Built a complete 3D force-directed galaxy with dynamic node spheres, floating 3D text billboards, and directional particle pulses (`linkDirectionalParticles`).
  - **Rationale:** Elevates visual impact for hackathon judging while physically conveying the "ripple" propagation of macro shocks traveling from raw events $\to$ indicators $\to$ sectors $\to$ equities.

---

## 2. High-Speed Real-Time Pipeline (<60s USP)

- **Parallel RSS Polling:**
  - `Promise.allSettled()` executes simultaneous HTTP fetches across financial RSS feeds (Economic Times, Reuters, Google News). Total fetch latency: $< 2$ seconds.
- **Single-Pass Structured LLM Extraction:**
  - Instead of 5 sequential LLM round-trips per article, a unified prompt extracts `{ event, entities, candidate_edges, rationales }` in a single call using OpenAI `gpt-4o-mini` with strict JSON schema validation.
  - Average latency: $1.5$–$2.5$ seconds per article.
- **Concurrent LLM Processing:**
  - Multiple ingested headlines are processed with parallel concurrency limits ($5$ parallel workers), completing an entire 10-article news batch in under $8$ seconds.
- **In-Memory Quant Vector Math:**
  - Historical daily prices and returns for the entire universe (260 trading days) are pre-warmed in memory. Event studies, 2-sigma trigger scans, baseline abnormal returns (CAR), Student-$t$ significance tests, and rolling lagged correlations execute in **$< 1$ millisecond per edge** in pure TypeScript.

---

## 3. Quantitative Parameters (`src/config/scoring.json`)

| Parameter | Value | Definition & Justification |
|---|---|---|
| `min_events_for_verdict` | `5` | Strict honesty cutoff: edges with fewer than 5 historical shock events remain labeled as `inferred` with an explicit "low sample" disclaimer. |
| `trigger_threshold_sigma` | `2.0` | A historical date is classified as a macro shock trigger if the source asset's 1-day absolute return exceeds 2 standard deviations of trailing volatility. |
| `event_study_windows` | `[1, 5, 10]` | Trading-day windows over which cumulative abnormal returns (CAR) are measured. |
| `estimation_window_days` | `60` | Baseline window ending 5 days prior to the event shock used to compute expected normal returns. |
| `validated_min_confidence` | `0.60` | Required minimum blended score (and sign agreement with hypothesis) to mark an edge as `validated`. |
| `contradicted_max_hit_rate`| `0.40` | If $n \ge 5$ and the empirical hit rate is $\le 40\%$, or the empirical sign is opposite to hypothesis with $p < 0.10$, the edge is branded `contradicted`. |
| Confidence weights | `0.50` (event study) + `0.25` (lagged corr) + `0.25` (articles) | Prioritizes historical price empirical backtesting while incorporating rolling momentum and news relevance. Renormalized dynamically if a component is missing. |

---

## 4. Entity Mappings & Proxies

- **India 10Y Benchmark Sovereign Yield:** Mapped to 10Y sovereign yield proxy `^TNX` with explicit UI disclaimer: *"Measured via proxy: 10Y sovereign yield"*.
- **Unmeasurable Macro Entities:** Entities like *Inflation Expectations*, *Policy Rate Expectations*, and *Industrial Input Costs* are tagged `measurable: false`. Edges touching them are evaluated using article evidence and downstream proxies rather than phantom ticker returns.
- **Corporate Entities:**
  - Upstream oil: `ONGC.NS`
  - Fuel-sensitive airlines: `INDIGO.NS` (InterGlobe Aviation)
  - Petrochemical consumer: `ASIANPAINT.NS` (Asian Paints)
  - Banking heavyweight: `HDFCBANK.NS`
  - IT exporter / USD beneficiary: `TCS.NS`
  - Energy refining conglomerate: `RELIANCE.NS`
