'use client';

import React from 'react';
import Image from 'next/image';
import { MarketType } from '@/lib/types';
import { Search, Radio, SlidersHorizontal, RefreshCw, Zap } from 'lucide-react';

interface TopBarProps {
  isReplay: boolean;
  replayScenario?: string;
  selectedMarket: MarketType | 'All';
  onMarketChange: (m: MarketType | 'All') => void;
  showWeakEdges: boolean;
  onToggleWeakEdges: (val: boolean) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onTriggerReplay: (scenario: string) => void;
  onRefresh: () => void;
  stats?: {
    total_nodes: number;
    total_edges: number;
    validated: number;
    contradicted: number;
    inferred: number;
  };
}

export default function TopBar({
  isReplay,
  replayScenario = 'oil_spike_2022',
  selectedMarket,
  onMarketChange,
  showWeakEdges,
  onToggleWeakEdges,
  searchQuery,
  onSearchChange,
  onTriggerReplay,
  onRefresh,
  stats
}: TopBarProps) {
  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/90 px-4 backdrop-blur-md">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-700 p-1 shadow-md shadow-cyan-900/30">
          <Image
            src="/logo-no-bg.png"
            alt="Finfluence Logo"
            width={36}
            height={36}
            className="object-contain"
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-white">Finfluence</span>
            {isReplay ? (
              <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-400 border border-amber-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                REPLAY: historical data
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                LIVE
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400">Autonomous Market Impact Graph</p>
        </div>
      </div>

      {/* Middle Controls: Market Selector & Search */}
      <div className="flex items-center gap-3">
        {/* Market Filter */}
        <div className="flex rounded-lg bg-slate-900 p-0.5 border border-slate-800 text-xs">
          {(['India', 'Global', 'US', 'All'] as const).map((m) => (
            <button
              key={m}
              onClick={() => onMarketChange(m)}
              className={`rounded-md px-3 py-1 font-medium transition-colors ${
                selectedMarket === m
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-48">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search entities / tickers..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/90 py-1.5 pl-8 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Toggle Weak Edges */}
        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
          <input
            type="checkbox"
            checked={showWeakEdges}
            onChange={(e) => onToggleWeakEdges(e.target.checked)}
            className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-cyan-600 focus:ring-0"
          />
          <span>Show Inferred</span>
        </label>
      </div>

      {/* Right Controls: Stats, Scenario Buttons & Refresh */}
      <div className="flex items-center gap-3">
        {stats && (
          <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono border-r border-slate-800 pr-3">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {stats.validated} Validated
            </span>
            <span className="flex items-center gap-1 text-rose-400">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
              {stats.contradicted} Contradicted
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
              {stats.inferred} Inferred
            </span>
          </div>
        )}

        {/* Replay Scenario Picker */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onTriggerReplay('oil_spike_2022')}
            className="flex items-center gap-1 rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-all"
            title="Replay Brent Crude $120 Spike (March 2022)"
          >
            <Zap className="h-3 w-3" />
            Oil Spike Replay
          </button>
          <button
            onClick={() => onTriggerReplay('rate_hike_cycle')}
            className="flex items-center gap-1 rounded-md bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-400 border border-purple-500/30 hover:bg-purple-500/20 transition-all"
            title="Replay RBI / Fed Policy Rate Decisions"
          >
            <Zap className="h-3 w-3" />
            Rate Hike Replay
          </button>
        </div>

        <button
          onClick={onRefresh}
          className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-slate-100 transition-colors"
          title="Recalculate in-memory quant backtest"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>
    </header>
  );
}
