'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search, RotateCcw, X, CircleDot, SlidersHorizontal } from 'lucide-react';

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

  return (
    <header className="relative z-40 flex min-h-[68px] shrink-0 items-center border-b border-white/[0.08] bg-[#0b1114]/95 px-4 py-3 backdrop-blur-2xl sm:h-[72px] sm:px-5 sm:py-0">
      <div className="flex w-full flex-wrap items-center gap-3 sm:flex-nowrap sm:gap-5">
        {/* Brand */}
        <div className="flex min-w-0 flex-1 items-center gap-2.5 pr-0 sm:min-w-[170px] sm:flex-none sm:border-r sm:border-white/[0.08] sm:pr-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-300/10 border border-cyan-200/20 p-1.5">
            <Image
              src="/logo-no-bg.png"
              alt="Finfluence"
              width={22}
              height={22}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[14px] font-bold tracking-tight text-white">Finfluence</span>
            <span className="hidden items-center gap-1.5 text-[9px] font-medium text-zinc-400 sm:flex">
              <CircleDot className="h-2.5 w-2.5 text-amber-300" />
              Illustrative demo
            </span>
          </div>
        </div>

        {/* Search */}
        <div className={`relative order-3 basis-full transition-all duration-300 sm:order-none sm:flex-1 ${focused ? 'sm:max-w-[560px]' : 'sm:max-w-[460px]'}`}>
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A6B3BD]/50 pointer-events-none" />
          <input
            type="text"
            placeholder="Search entities, tickers..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full rounded-xl bg-white/[0.045] border border-white/[0.09] py-2.5 pl-9 pr-8 text-[12px] text-white placeholder-[#A6B3BD]/40 focus:border-cyan-300/40 focus:bg-white/[0.07] focus:outline-none focus:ring-0 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A6B3BD]/50 hover:text-white transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden items-center gap-1.5 text-[10px] text-zinc-500 lg:flex"><SlidersHorizontal className="h-3.5 w-3.5" /> India market map</span>
          <button onClick={onResetGraph} title="Reset view" className="group flex shrink-0 items-center gap-1.5 rounded-xl border border-white/[0.08] px-3 py-2 text-[11px] font-medium text-zinc-400 hover:border-white/20 hover:bg-white/[0.06] hover:text-white active:scale-95">
            <RotateCcw className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-rotate-180" />
            <span className="hidden sm:inline">Reset view</span>
          </button>
        </div>
      </div>
    </header>
  );
}
