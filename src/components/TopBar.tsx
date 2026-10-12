'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Search, RefreshCw, X, CircleDot, Command, SlidersHorizontal, BarChart3 } from 'lucide-react';

interface TopBarProps {
  isReplay?: boolean;
  replayScenario?: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onTriggerReplay?: (scenario: string) => void;
  onResetGraph?: () => void;
}

export default function TopBar({
  searchQuery,
  onSearchChange,
  onResetGraph
}: TopBarProps) {
  const [focused, setFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  return (
    <header style={{ margin: '16px 24px 0', width: 'calc(100% - 48px)', minHeight: '78px' }} className="relative z-[100] flex shrink-0 items-center overflow-visible rounded-2xl border border-white/[0.12] bg-[#0b1114]/90 px-4 py-3 shadow-[0_16px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:h-[78px] sm:px-6 sm:py-0">
      <div className="flex w-full flex-wrap items-center gap-3 sm:flex-nowrap sm:gap-5">
        <div className="flex min-w-0 flex-1 items-center gap-3 pr-0 sm:min-w-[245px] sm:flex-none sm:border-r sm:border-white/[0.08] sm:pr-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#111b21] p-1.5">
            <Image
              src="/logo-no-bg.png"
              alt="Finfluence"
              width={30}
              height={30}
              className="object-contain brightness-150 grayscale invert"
            />
          </div>
          <div className="flex items-center gap-3 leading-none">
            <span className="font-amaranth text-[22px] font-bold tracking-wide text-white">Finfluence</span>
            <span className="hidden items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-300/[0.08] px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-emerald-200 md:flex">
              <CircleDot className="h-2 w-2 text-emerald-300" /> Research
            </span>
          </div>
        </div>

        {/* Search */}
        <div className={`relative order-3 ml-auto basis-full transition-all duration-300 sm:order-none sm:flex-1 sm:max-w-[620px] ${focused ? 'sm:scale-[1.01]' : ''}`}>
          <input
            type="text"
            placeholder="Search companies, tickers, events..."
            value={searchQuery}
            ref={searchRef}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="h-12 w-full rounded-2xl border border-white/[0.12] bg-[#111b21]/90 px-4 pl-11 pr-20 text-[13px] text-white placeholder-[#A6B3BD]/45 focus:border-cyan-300/45 focus:bg-[#15232a] focus:outline-none focus:ring-0 transition-all"
          />
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          {!searchQuery && <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-1 text-[10px] text-zinc-500 sm:flex"><Command className="h-3 w-3" /> K</span>}
          {searchQuery ? (
            <button
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-[#A6B3BD]/50 hover:bg-white/[0.08] hover:text-white transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          ) : (
            <button type="button" aria-label="Focus search" onClick={() => searchRef.current?.focus()} className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-zinc-400 hover:bg-white/[0.08] hover:text-white">
              <Search className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <span className="hidden items-center gap-2 text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-400 xl:flex"><BarChart3 className="h-4 w-4 text-emerald-300" /> Market intelligence</span>
          <span className="hidden h-8 w-px bg-white/[0.1] xl:block" />
          <button onClick={onResetGraph} title="Refresh graph view" className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.03] text-zinc-300 hover:border-emerald-300/50 hover:bg-emerald-300/[0.08] hover:text-white active:scale-95">
            <RefreshCw className="h-4 w-4 transition-transform duration-500 group-hover:rotate-180" />
          </button>
          <button type="button" title="Display controls" className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.03] text-zinc-300 hover:border-cyan-300/40 hover:bg-cyan-300/[0.08] hover:text-white lg:flex"><SlidersHorizontal className="h-4 w-4" /></button>
          <div className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-cyan-200/80 to-indigo-300/70 text-[11px] font-bold text-[#071014] lg:flex">F</div>
        </div>
      </div>
    </header>
  );
}
