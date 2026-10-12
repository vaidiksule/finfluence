'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ExternalLink,
  Layers,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface MinimalImpactGraphProps {
  onExploreFullPlatform: () => void;
}

interface Scenario {
  id: string;
  title: string;
  category: string;
  trigger: {
    name: string;
    change: string;
    desc: string;
  };
  hops: {
    title: string;
    items: { name: string; relation: string; impact: 'up' | 'down' }[];
  }[];
  equities: {
    ticker: string;
    company: string;
    reaction: string;
    positive: boolean;
    reason: string;
  }[];
}

const SCENARIOS: Record<string, Scenario> = {
  oil: {
    id: 'oil',
    title: 'Crude Oil Surge',
    category: 'Commodities',
    trigger: {
      name: 'Brent Crude Spot',
      change: '+12.4%',
      desc: 'Middle East chokepoint supply disruption sparks immediate energy shock.',
    },
    hops: [
      {
        title: 'Tier 1: Macro & Costs',
        items: [
          { name: 'India Import Deficit', relation: 'Expands dollar demand', impact: 'up' },
          { name: 'USD/INR Exchange Rate', relation: 'Rupee weakens +0.8%', impact: 'up' },
          { name: 'Industrial Feedstock', relation: 'Monomer costs surge', impact: 'up' },
        ],
      },
    ],
    equities: [
      {
        ticker: 'INDIGO',
        company: 'InterGlobe Aviation',
        reaction: '-4.8%',
        positive: false,
        reason: 'Aviation turbine fuel accounts for 40% of operating expenses.',
      },
      {
        ticker: 'ONGC',
        company: 'Oil & Natural Gas Corp',
        reaction: '+5.4%',
        positive: true,
        reason: 'Direct revenue expansion on upstream crude realization.',
      },
      {
        ticker: 'ASIANPAINT',
        company: 'Asian Paints',
        reaction: '-3.7%',
        positive: false,
        reason: 'Petrochemical derivatives comprise 50% of raw material costs.',
      },
      {
        ticker: 'TCS',
        company: 'Tata Consultancy Services',
        reaction: '+2.1%',
        positive: true,
        reason: 'Beneficiary of USD/INR foreign exchange translation tailwind.',
      },
    ],
  },
  rate: {
    id: 'rate',
    title: 'Central Bank Rate Shock',
    category: 'Monetary Policy',
    trigger: {
      name: 'Policy Repo Rate',
      change: '+50 bps',
      desc: 'Unexpected central bank tightening cycle to counter inflation pressures.',
    },
    hops: [
      {
        title: 'Tier 1: Yields & Credit',
        items: [
          { name: '10Y Sovereign Yield', relation: 'Bonds reprice upward', impact: 'up' },
          { name: 'Mortgage Borrowing Cost', relation: 'Lending rates tighten', impact: 'up' },
          { name: 'Corporate Cap Rates', relation: 'Valuations compressed', impact: 'down' },
        ],
      },
    ],
    equities: [
      {
        ticker: 'HDFCBANK',
        company: 'HDFC Bank Ltd',
        reaction: '+1.9%',
        positive: true,
        reason: 'Expands net interest margins (NIM) on floating loans.',
      },
      {
        ticker: 'DLF',
        company: 'DLF Real Estate',
        reaction: '-3.4%',
        positive: false,
        reason: 'Rising home loan interest rates dampen residential sales velocity.',
      },
      {
        ticker: 'BAJFINANCE',
        company: 'Bajaj Finance',
        reaction: '-2.8%',
        positive: false,
        reason: 'Elevated cost of wholesale funds compresses consumer margins.',
      },
    ],
  },
  chips: {
    id: 'chips',
    title: 'Semiconductor Fracture',
    category: 'Supply Chain',
    trigger: {
      name: 'Silicon Wafer Lead Times',
      change: '+18 Wks',
      desc: 'Export restrictions and foundry bottlenecks delay precision microchips.',
    },
    hops: [
      {
        title: 'Tier 1: Manufacturing',
        items: [
          { name: 'Automotive Inventories', relation: 'Production lines stalled', impact: 'down' },
          { name: 'Hardware Component ASP', relation: 'Input prices surge', impact: 'up' },
        ],
      },
    ],
    equities: [
      {
        ticker: 'TATAMOTORS',
        company: 'Tata Motors',
        reaction: '-4.2%',
        positive: false,
        reason: 'ECU supply shortages delay EV and passenger vehicle delivery.',
      },
      {
        ticker: 'TCS',
        company: 'TCS Auto Electronics',
        reaction: '+1.5%',
        positive: true,
        reason: 'Surge in demand for semiconductor emulation and redesign.',
      },
    ],
  },
};

export default function MinimalImpactGraph({ onExploreFullPlatform }: MinimalImpactGraphProps) {
  const [selectedScenario, setSelectedScenario] = useState<string>('oil');
  const active = SCENARIOS[selectedScenario];

  return (
    <section id="impact-graph" className="w-full px-4 md:px-8 py-16">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 mb-4 text-[11px] font-medium text-slate-300">
            <Layers className="h-3 w-3 text-[#38BDF8]" />
            <span>Interactive Causal Transmission</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-white mb-3">
            How One Event Moves The Market
          </h2>

          <p className="text-xs sm:text-sm text-slate-400">
            Select an event scenario below to observe how macro shocks ripple across economic indicators into equity valuations.
          </p>

          {/* Scenario Selector Tabs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {Object.values(SCENARIOS).map((sc) => {
              const isCurrent = sc.id === selectedScenario;
              return (
                <button
                  key={sc.id}
                  onClick={() => setSelectedScenario(sc.id)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                    isCurrent
                      ? 'bg-white text-[#080C15] font-semibold shadow-md'
                      : 'border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  {sc.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Minimal Interactive Ripple Grid */}
        <div className="rounded-[28px] border border-white/10 bg-[#0B111F] p-6 md:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Step 1: Origin Shock */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                01 • Trigger Event
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-amber-400 uppercase">
                    {active.category}
                  </span>
                  <span className="rounded-md bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 text-xs font-mono font-bold text-amber-300">
                    {active.trigger.change}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  {active.trigger.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {active.trigger.desc}
                </p>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-2">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Empirical verification: 94% confidence</span>
              </div>
            </div>

            {/* Step 2: Transmission Hops */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                02 • Transmission Channels
              </div>

              <div className="flex flex-col gap-3">
                {active.hops[0].items.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-white">{item.name}</span>
                      <span className="text-[10px] font-mono text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded">
                        Hop {idx + 1}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">{item.relation}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3: Impacted Equities */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                03 • Equity Repercussions
              </div>

              <div className="flex flex-col gap-2.5">
                {active.equities.map((eq) => (
                  <div
                    key={eq.ticker}
                    className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 hover:border-white/20 transition"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">
                          {eq.ticker}
                        </span>
                        <span className="text-[11px] text-slate-400 truncate max-w-[130px]">
                          {eq.company}
                        </span>
                      </div>
                      <span
                        className={`rounded-md px-2 py-0.5 text-xs font-mono font-bold ${
                          eq.positive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {eq.reaction}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                      {eq.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Call to Explore Deep Galaxy */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-400">
              Want to inspect all 50+ nodes and real-time SSE price telemetry?
            </span>
            <button
              onClick={onExploreFullPlatform}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-medium text-white transition active:scale-95"
            >
              <span>Launch 3D Explorer</span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
