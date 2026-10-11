'use client';

import React from 'react';
import Image from 'next/image';
import { MarketType } from '@/lib/types';
import { Search, RefreshCw, Play, Sliders } from 'lucide-react';

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
    <header className="flex h-14 w-full items-center justify-between border-b border-white/[0.08] bg-[#0c0c0e]/85 px-4 backdrop-blur-2xl z-20">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-b from-white/10 to-white/5 p-1 border border-white/10 shadow-sm">
          <Image
            src="/logo-no-bg.png"
            alt="Finfluence Logo"
            width={26}
            height={26}
            className="object-contain filter grayscale contrast-125"
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold tracking-tight text-white font-sans">Finfluence</span>
            {isReplay ? (
              <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/90 border border-white/15">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                Historical Replay
              </span>
            ) : (
              <span className="flex items-center gap-1.5 rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/70 border border-white/10">
                <span className="h-1.5 w-1.5 rounded-full bg-white/80 animate-pulse" />
                Live
              </span>
            )}
          </div>
          <p className="text-[10px] text-zinc-400">Autonomous Market Impact Graph</p>
        </div>
      </div>

      {/* Center Controls: Segmented Market Control & Search */}
      <div className="flex items-center gap-3">
        {/* Apple Segmented Control */}
        <div className="flex rounded-lg bg-zinc-900/90 p-0.5 border border-white/10 text-[11px] shadow-inner">
          {(['India', 'Global', 'US', 'All'] as const).map((m) => (
            <button
              key={m}
              onClick={() => onMarketChange(m)}
              className={`rounded-md px-3 py-1 font-medium transition-all ${
                selectedMarket === m
                  ? 'bg-zinc-200 text-black shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Minimal Search Bar */}
        <div className="relative w-52">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search entities, tickers..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-zinc-900/80 py-1 pl-8 pr-3 text-xs text-zinc-200 placeholder-zinc-500 focus:border-white/30 focus:outline-none focus:bg-zinc-900 transition-all"
          />
        </div>

        {/* Inferred Toggle */}
        <button
          onClick={() => onToggleWeakEdges(!showWeakEdges)}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs border transition-all ${
            showWeakEdges
              ? 'border-white/20 bg-zinc-800 text-zinc-100'
              : 'border-white/5 bg-transparent text-zinc-500 hover:text-zinc-300'
          }`}
          title="Toggle low sample / inferred edges"
        >
          <Sliders className="h-3 w-3" />
          <span>Inferred</span>
        </button>
      </div>

      {/* Right Controls: Stats, Scenario Buttons & Refresh */}
      <div className="flex items-center gap-2.5">
        {stats && (
          <div className="hidden xl:flex items-center gap-2.5 text-[11px] font-mono border-r border-white/10 pr-3 text-zinc-400">
            <span className="flex items-center gap-1.5 text-zinc-200">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              {stats.validated} Validated
            </span>
            <span className="flex items-center gap-1.5 text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
              {stats.contradicted} Contradicted
            </span>
            <span className="flex items-center gap-1.5 text-zinc-500">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
              {stats.inferred} Inferred
            </span>
          </div>
        )}

        {/* Replay Scenarios */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onTriggerReplay('oil_spike_2022')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium border transition-all shadow-sm ${
              isReplay && replayScenario === 'oil_spike_2022'
                ? 'bg-white text-black border-white font-semibold'
                : 'bg-zinc-900 text-zinc-300 border-white/10 hover:bg-zinc-800 hover:text-white'
            }`}
            title="Replay Brent Crude $120 Spike (March 2022)"
          >
            {isReplay && replayScenario === 'oil_spike_2022' ? (
              <span className="h-2 w-2 rounded-full bg-black animate-ping" />
            ) : (
              <Play className="h-2.5 w-2.5 text-zinc-400 fill-zinc-400" />
            )}
            Oil Spike
          </button>
          <button
            onClick={() => onTriggerReplay('rate_hike_cycle')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium border transition-all shadow-sm ${
              isReplay && replayScenario === 'rate_hike_cycle'
                ? 'bg-white text-black border-white font-semibold'
                : 'bg-zinc-900 text-zinc-300 border-white/10 hover:bg-zinc-800 hover:text-white'
            }`}
            title="Replay Central Bank Rate Tightening Cycle"
          >
            {isReplay && replayScenario === 'rate_hike_cycle' ? (
              <span className="h-2 w-2 rounded-full bg-black animate-ping" />
            ) : (
              <Play className="h-2.5 w-2.5 text-zinc-400 fill-zinc-400" />
            )}
            Rate Hike
          </button>
        </div>

        <button
          onClick={onRefresh}
          className="rounded-lg border border-white/10 bg-zinc-900 p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all shadow-sm active:rotate-180"
          title="Recalculate in-memory quant backtest"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>
    </header>
  );
}
