'use client';

import { ArrowRight, BookOpenCheck, DatabaseZap, FlaskConical, Newspaper, ShieldAlert } from 'lucide-react';

type Scenario = 'oil_spike_2022' | 'rate_hike_cycle';

interface MarketBriefProps {
  scenario: Scenario;
  onExplorePaths: () => void;
  onRefreshMarketData?: () => void;
  isRefreshingMarketData?: boolean;
  onRunAnalysis?: () => void;
  isRunningAnalysis?: boolean;
  analysisStatus?: string | null;
}

const briefs: Record<Scenario, {
  eyebrow: string;
  title: string;
  summary: string;
  exposures: Array<{ label: string; detail: string }>;
  caveat: string;
}> = {
  oil_spike_2022: {
    eyebrow: 'Illustrative scenario · Crude-oil shock',
    title: 'Higher crude can pressure India’s fuel-intensive businesses.',
    summary:
      'The model traces potential effects through aviation fuel, petrochemical inputs, the import bill, and inflation expectations. Upstream oil producers can move differently from fuel consumers.',
    exposures: [
      { label: 'Most exposed', detail: 'IndiGo and Asian Paints — fuel and feedstock-cost channels' },
      { label: 'Potential beneficiary', detail: 'ONGC — upstream crude-realisation channel' },
      { label: 'Broader transmission', detail: 'USD/INR, inflation expectations, rates, and Nifty 50' }
    ],
    caveat:
      'This is a research hypothesis, not a price forecast or investment recommendation. The displayed quantitative evidence uses illustrative demo data.'
  },
  rate_hike_cycle: {
    eyebrow: 'Illustrative scenario · Policy-rate shock',
    title: 'Higher policy rates can reprice yields, credit, and rate-sensitive sectors.',
    summary:
      'The model traces potential effects from policy expectations to sovereign yields, banks, property, and currency-sensitive IT exporters. Outcomes can differ by balance sheet and valuation.',
    exposures: [
      { label: 'Most exposed', detail: 'Nifty Realty and Nifty Bank — mortgage, funding, and treasury channels' },
      { label: 'Market transmission', detail: 'Government 10Y yield — yield-curve repricing channel' },
      { label: 'Potential offset', detail: 'TCS and IT exporters — USD/INR translation channel' }
    ],
    caveat:
      'This is a research hypothesis, not a price forecast or investment recommendation. The displayed quantitative evidence uses illustrative demo data.'
  }
};

export default function MarketBrief({ scenario, onExplorePaths, onRefreshMarketData, isRefreshingMarketData = false, onRunAnalysis, isRunningAnalysis = false, analysisStatus }: MarketBriefProps) {
  const brief = briefs[scenario];

  return (
    <section className="flex h-full flex-col overflow-y-auto p-5 text-xs font-sans">
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
        <FlaskConical className="h-3.5 w-3.5" />
        {brief.eyebrow}
      </div>

      <h2 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-white">
        {brief.title}
      </h2>
      <p className="mt-2 text-[12px] leading-relaxed text-zinc-400">{brief.summary}</p>

      <div className="mt-5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">What to investigate</p>
        <div className="mt-2 space-y-2">
          {brief.exposures.map((exposure) => (
            <div key={exposure.label} className="rounded-xl border border-white/10 bg-zinc-900/60 p-3">
              <p className="font-medium text-zinc-100">{exposure.label}</p>
              <p className="mt-1 leading-relaxed text-zinc-400">{exposure.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-amber-300/15 bg-amber-300/[0.06] p-3 text-[11px] leading-relaxed text-zinc-300">
        <div className="flex items-center gap-1.5 font-medium text-amber-100">
          <ShieldAlert className="h-3.5 w-3.5" />
          Evidence limitation
        </div>
        <p className="mt-1.5 text-zinc-400">{brief.caveat}</p>
      </div>

      <button
        type="button"
        onClick={onExplorePaths}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white px-3 py-2.5 text-xs font-semibold text-black transition-colors hover:bg-zinc-200"
      >
        <BookOpenCheck className="h-3.5 w-3.5" />
        Explore evidence pathways
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
      {onRefreshMarketData && (
        <button
          type="button"
          onClick={onRefreshMarketData}
          disabled={isRefreshingMarketData}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-amber-300/25 bg-amber-300/10 px-3 py-2.5 text-xs font-semibold text-amber-100 transition-colors hover:bg-amber-300/15 disabled:cursor-wait disabled:opacity-60"
        >
          <DatabaseZap className={`h-3.5 w-3.5 ${isRefreshingMarketData ? 'animate-pulse' : ''}`} />
          {isRefreshingMarketData ? 'Refreshing sourced market data…' : 'Refresh sourced market data'}
        </button>
      )}
      {onRunAnalysis && (
        <>
          <button
            type="button"
            onClick={onRunAnalysis}
            disabled={isRunningAnalysis}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-zinc-800 px-3 py-2.5 text-xs font-semibold text-zinc-100 transition-colors hover:bg-zinc-700 disabled:cursor-wait disabled:opacity-60"
          >
            <Newspaper className={`h-3.5 w-3.5 ${isRunningAnalysis ? 'animate-pulse' : ''}`} />
            {isRunningAnalysis ? 'Running news analysis…' : 'Run live-news analysis'}
          </button>
          {analysisStatus && <p className="mt-2 text-center text-[10px] text-zinc-500">{analysisStatus}</p>}
        </>
      )}
    </section>
  );
}
