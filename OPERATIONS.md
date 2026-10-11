# Operating Finfluence

## Data and analysis flow

1. Use **Refresh sourced market data** to fetch daily close data from Yahoo Finance for the core
   India-market universe and rerun the graph audit.
2. Use **Run live-news analysis** to fetch the configured RSS feeds and create evidence records.
3. Records are stored locally in `data/runtime/records.json`; that directory is intentionally
   ignored by Git because it is operational state, not a source artifact.

## Production requirements

The local file store is appropriate for a single-machine prototype only. A production deployment
must replace it with a managed database/object store and run the analysis endpoint from the
platform scheduler. Schedule the equivalent of `POST /api/ingest` with `{ "poll_live": true }`
at a controlled cadence, with authentication and rate limits.

Yahoo Finance is used as a no-key provider adapter for prototype research. Confirm its terms and
replace it with a licensed provider before commercial use.
