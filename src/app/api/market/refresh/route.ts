import { NextResponse } from 'next/server';
import { getGraphStore } from '@/lib/graph/store';
import { fetchYahooPriceSeries } from '@/lib/market/yahoo';
import { saveAuditSnapshot, saveMarketSeries } from '@/lib/persistence/local';

const defaultTickers = ['BZ=F', 'INR=X', '^NSEI', '^NSEBANK', '^CNXREALTY', 'ONGC.NS', 'INDIGO.NS', 'ASIANPAINT.NS', 'HDFCBANK.NS', 'RELIANCE.NS', 'TCS.NS'];

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as { tickers?: unknown };
    const tickers = Array.isArray(body.tickers)
      ? body.tickers.filter((ticker): ticker is string => typeof ticker === 'string' && ticker.length > 0)
      : defaultTickers;

    const results = await Promise.allSettled(
      tickers.map(async (ticker) => {
        const series = await fetchYahooPriceSeries(ticker);
        await saveMarketSeries(ticker, series);
        return { ticker, series };
      })
    );

    const store = getGraphStore();
    const updated = results.flatMap((result) => {
      if (result.status !== 'fulfilled') return [];
      store.setMarketSeries(result.value.ticker, result.value.series);
      return [{ ticker: result.value.ticker, days: result.value.series.prices.length }];
    });
    store.auditAllEdges();
    await saveAuditSnapshot({
      generated_at: new Date().toISOString(),
      source: 'yahoo_finance',
      edges: store.getAllEdges()
    });

    const failures = results.flatMap((result) =>
      result.status === 'rejected'
        ? [{ message: result.reason instanceof Error ? result.reason.message : 'Unknown market-data error' }]
        : []
    );

    return NextResponse.json({ success: true, source: 'Yahoo Finance', updated, failures });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Market-data refresh failed.' },
      { status: 500 }
    );
  }
}
