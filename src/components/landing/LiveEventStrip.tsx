'use client';

import React from 'react';
import { Activity, Flame, ArrowUpRight, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';

interface TickerItem {
  id: string;
  tag: string;
  metric: string;
  impact: string;
  color: 'cyan' | 'teal' | 'violet' | 'red';
  direction: 'up' | 'down' | 'neutral';
}

const DEMO_EVENTS: TickerItem[] = [
  {
    id: 'crude_oil',
    tag: 'CRUDE OIL',
    metric: '+12.4%',
    impact: 'Energy markets & aviation cost squeeze',
    color: 'red',
    direction: 'up',
  },
  {
    id: 'central_bank',
    tag: 'CENTRAL BANK',
    metric: 'Rate Outlook Shift',
    impact: 'Yield curve steepening & banking NIM compression',
    color: 'violet',
    direction: 'neutral',
  },
  {
    id: 'usd_inr',
    tag: 'USD / INR',
    metric: '₹87.42 (+0.8%)',
    impact: 'Import bill inflation & IT revenue tailwind',
    color: 'teal',
    direction: 'up',
  },
  {
    id: 'global_trade',
    tag: 'GLOBAL TRADE',
    metric: 'Chokepoint Disruption',
    impact: 'Supply-chain lead times +14 days',
    color: 'cyan',
    direction: 'neutral',
  },
  {
    id: 'chip_foundry',
    tag: 'SEMICONDUCTORS',
    metric: 'Sub-5nm Allocation',
    impact: 'Hardware OEMs & AI hardware backlog',
    color: 'cyan',
    direction: 'up',
  },
  {
    id: 'euro_cpi',
    tag: 'EUROZONE CPI',
    metric: 'Core +3.1% YoY',
    impact: 'Sovereign spread divergence & ECB tightening',
    color: 'violet',
    direction: 'up',
  },
];

export default function LiveEventStrip() {
  return (
    <div id="live-signals" className="relative w-full border-y border-white/10 bg-[#0A101A]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center px-4 py-2.5 text-xs">
        {/* Left Badge: Illustrative Demo Scenarios */}
        <div className="shrink-0 flex items-center gap-2 pr-4 border-r border-white/10 mr-4">
          <span className="rounded bg-white/05 border border-white/15 px-1.5 py-0.5 text-[9px] font-mono text-slate-300">
            02
          </span>
          <span className="flex h-2 w-2 rounded-full bg-[#25D9F2] animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#25D9F2]">
            LIVE SHOCK SIGNALS
          </span>
          <span className="hidden sm:inline-block rounded border border-white/15 bg-white/5 px-1.5 py-0.2 text-[9px] text-[#9CA9BB]">
            SIMULATED
          </span>
        </div>

        {/* Scrolling Ticker strip */}
        <div className="relative flex-1 overflow-x-auto no-scrollbar whitespace-nowrap">
          <div className="inline-flex items-center gap-6 py-0.5">
            {DEMO_EVENTS.map((event, idx) => {
              const colorClasses = {
                cyan: 'text-[#25D9F2] border-[#25D9F2]/30 bg-[#25D9F2]/10',
                teal: 'text-[#20E3C2] border-[#20E3C2]/30 bg-[#20E3C2]/10',
                violet: 'text-[#9B70FF] border-[#9B70FF]/30 bg-[#9B70FF]/10',
                red: 'text-[#FF5D65] border-[#FF5D65]/30 bg-[#FF5D65]/10',
              }[event.color];

              return (
                <div
                  key={`${event.id}-${idx}`}
                  className="inline-flex items-center gap-2 text-xs text-[#9CA9BB] group transition hover:text-white"
                >
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-bold border ${colorClasses}`}>
                    {event.tag}
                  </span>
                  <span className="font-semibold text-[#F5F7FA]">
                    {event.metric}
                  </span>
                  <span className="text-[#9CA9BB]/60 text-[11px]">—</span>
                  <span className="text-[#9CA9BB] text-[11px] group-hover:text-slate-200">
                    {event.impact}
                  </span>
                  <span className="text-white/10 ml-3">•</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Label Note */}
        <div className="shrink-0 hidden lg:flex items-center gap-1.5 pl-4 border-l border-white/10 text-[10px] text-[#9CA9BB]/70">
          <Activity className="h-3 w-3 text-[#25D9F2]" />
          <span>Macro event impact signals</span>
        </div>
      </div>
    </div>
  );
}
