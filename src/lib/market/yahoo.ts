import { PriceSeries } from '@/lib/quant/eventStudy';

interface YahooChartResult {
  timestamp?: number[];
  indicators?: {
    quote?: Array<{
      close?: Array<number | null>;
    }>;
  };
}

interface YahooChartResponse {
  chart?: {
    result?: YahooChartResult[] | null;
    error?: { description?: string } | null;
  };
}

export class MarketDataError extends Error {}

export async function fetchYahooPriceSeries(
  ticker: string,
  range: '1y' | '2y' | '5y' = '2y'
): Promise<PriceSeries> {
  const endpoint = new URL(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}`);
  endpoint.searchParams.set('range', range);
  endpoint.searchParams.set('interval', '1d');
  endpoint.searchParams.set('events', 'history');

  const response = await fetch(endpoint, {
    headers: { Accept: 'application/json' },
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new MarketDataError(`Yahoo Finance returned ${response.status} for ${ticker}.`);
  }

  const payload = (await response.json()) as YahooChartResponse;
  const chart = payload.chart?.result?.[0];
  const closes = chart?.indicators?.quote?.[0]?.close;
  const timestamps = chart?.timestamp;

  if (!chart || !closes || !timestamps || closes.length !== timestamps.length) {
    throw new MarketDataError(payload.chart?.error?.description || `No daily closing prices available for ${ticker}.`);
  }

  const dates: string[] = [];
  const prices: number[] = [];

  closes.forEach((close, index) => {
    const timestamp = timestamps[index];
    if (typeof close === 'number' && Number.isFinite(close) && typeof timestamp === 'number') {
      dates.push(new Date(timestamp * 1000).toISOString().slice(0, 10));
      prices.push(Number(close.toFixed(4)));
    }
  });

  if (prices.length < 30) {
    throw new MarketDataError(`Only ${prices.length} usable daily prices were available for ${ticker}.`);
  }

  const returns = prices.map((price, index) => {
    if (index === 0) return 0;
    return Number(((price / prices[index - 1]) - 1).toFixed(6));
  });

  return { dates, prices, returns };
}
