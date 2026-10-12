'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ChevronRight,
  ShieldCheck,
  Zap,
  Activity,
  ArrowRight,
  Layers,
  Sparkles,
} from 'lucide-react';

interface MinimalImpactGraphProps {
  onExploreFullPlatform: () => void;
}

interface ChannelItem {
  id: string;
  name: string;
  relation: string;
  metric: string;
  impact: 'up' | 'down';
  lag: string;
}

interface EquityItem {
  id: string;
  ticker: string;
  company: string;
  reaction: string;
  positive: boolean;
  reason: string;
  connectedChannelIds: string[];
}

interface Scenario {
  id: string;
  title: string;
  category: string;
  badgeColor: string;
  accentColor: string;
  trigger: {
    name: string;
    change: string;
    desc: string;
    confidence: string;
  };
  channels: ChannelItem[];
  equities: EquityItem[];
}

const SCENARIOS: Record<string, Scenario> = {
  oil: {
    id: 'oil',
    title: 'Crude Oil Surge',
    category: 'COMMODITIES',
    badgeColor: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    accentColor: '#FBBF24',
    trigger: {
      name: 'Brent Crude Spot',
      change: '+12.4%',
      desc: 'Middle East chokepoint supply disruption sparks immediate energy shockwave.',
      confidence: '94% Empirical Confidence (n = 11 shocks)',
    },
    channels: [
      {
        id: 'c1',
        name: 'India Import Deficit',
        relation: 'Crude import bill expands net dollar demand',
        metric: '+$3.2B / Mo',
        impact: 'up',
        lag: 'T+1 Day',
      },
      {
        id: 'c2',
        name: 'USD/INR Exchange Rate',
        relation: 'Twin deficit expansion weakens spot rupee',
        metric: '+0.85% (84.40)',
        impact: 'up',
        lag: 'T+2 Days',
      },
      {
        id: 'c3',
        name: 'Industrial Feedstock Costs',
        relation: 'Jet fuel & petrochemical monomers inflate',
        metric: '+8.6% Costs',
        impact: 'up',
        lag: 'T+3 Days',
      },
    ],
    equities: [
      {
        id: 'e1',
        ticker: 'INDIGO',
        company: 'InterGlobe Aviation',
        reaction: '-4.8%',
        positive: false,
        reason: 'Aviation turbine fuel accounts for ~40% of airline operating costs.',
        connectedChannelIds: ['c3'],
      },
      {
        id: 'e2',
        ticker: 'ONGC',
        company: 'Oil & Natural Gas Corp',
        reaction: '+5.4%',
        positive: true,
        reason: 'Direct EBITDA margin expansion on higher upstream crude realizations.',
        connectedChannelIds: ['c1', 'c3'],
      },
      {
        id: 'e3',
        ticker: 'ASIANPAINT',
        company: 'Asian Paints',
        reaction: '-3.7%',
        positive: false,
        reason: 'Petrochemical derivatives comprise 50% of raw coating inputs.',
        connectedChannelIds: ['c3'],
      },
      {
        id: 'e4',
        ticker: 'TCS',
        company: 'Tata Consultancy Services',
        reaction: '+2.1%',
        positive: true,
        reason: 'Foreign currency translation tailwind from weaker USD/INR.',
        connectedChannelIds: ['c1', 'c2'],
      },
    ],
  },

  rate: {
    id: 'rate',
    title: 'Central Bank Rate Shock',
    category: 'MONETARY POLICY',
    badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    accentColor: '#818CF8',
    trigger: {
      name: 'Policy Repo Rate',
      change: '+50 bps',
      desc: 'Unexpected aggressive central bank tightening to rein in core CPI inflation.',
      confidence: '91% Empirical Confidence (n = 14 shocks)',
    },
    channels: [
      {
        id: 'c1',
        name: '10Y Benchmark Sovereign Yield',
        relation: 'Sovereign bond yield curve reprices higher',
        metric: '+32 bps (7.42%)',
        impact: 'up',
        lag: 'T+0 Day',
      },
      {
        id: 'c2',
        name: 'Mortgage & Housing Borrowing Cost',
        relation: 'Commercial banks reset benchmark prime rates',
        metric: '+45 bps Rate',
        impact: 'up',
        lag: 'T+2 Days',
      },
      {
        id: 'c3',
        name: 'Wholesale NBFC Funding Spread',
        relation: 'Liquidity tightening escalates cost of wholesale debt',
        metric: '+65 bps Spread',
        impact: 'up',
        lag: 'T+3 Days',
      },
    ],
    equities: [
      {
        id: 'e1',
        ticker: 'HDFCBANK',
        company: 'HDFC Bank Ltd',
        reaction: '+1.9%',
        positive: true,
        reason: 'Expands net interest margin (NIM) on floating corporate loan books.',
        connectedChannelIds: ['c1'],
      },
      {
        id: 'e2',
        ticker: 'DLF',
        company: 'DLF Real Estate',
        reaction: '-3.4%',
        positive: false,
        reason: 'Rising mortgage borrowing rates dampen residential home sales velocity.',
        connectedChannelIds: ['c2'],
      },
      {
        id: 'e3',
        ticker: 'BAJFINANCE',
        company: 'Bajaj Finance',
        reaction: '-2.8%',
        positive: false,
        reason: 'Higher wholesale funding costs compress consumer retail lending margins.',
        connectedChannelIds: ['c3'],
      },
      {
        id: 'e4',
        ticker: 'SBIN',
        company: 'State Bank of India',
        reaction: '+1.3%',
        positive: true,
        reason: 'High low-cost CASA deposit share provides floating rate repricing benefit.',
        connectedChannelIds: ['c1', 'c2'],
      },
    ],
  },

  chips: {
    id: 'chips',
    title: 'Semiconductor Fracture',
    category: 'SUPPLY CHAINS',
    badgeColor: 'text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/20',
    accentColor: '#38BDF8',
    trigger: {
      name: 'Silicon Foundry Lead Times',
      change: '+18 Wks',
      desc: 'Critical semiconductor manufacturing delays and export curbs choke global supplies.',
      confidence: '88% Empirical Confidence (n = 8 shocks)',
    },
    channels: [
      {
        id: 'c1',
        name: 'Automotive ECU Inventories',
        relation: 'Component shortages disrupt assembly lines',
        metric: '-28% Inventory',
        impact: 'down',
        lag: 'T+2 Weeks',
      },
      {
        id: 'c2',
        name: 'Electronics Component Spot ASP',
        relation: 'Microcontroller and power IC spot prices surge',
        metric: '+34% Spot ASP',
        impact: 'up',
        lag: 'T+1 Week',
      },
      {
        id: 'c3',
        name: 'Foundry Redesign Demand',
        relation: 'OEMs hire engineering firms for chip re-spins',
        metric: '+18% Inquiries',
        impact: 'up',
        lag: 'T+3 Weeks',
      },
    ],
    equities: [
      {
        id: 'e1',
        ticker: 'TATAMOTORS',
        company: 'Tata Motors',
        reaction: '-4.2%',
        positive: false,
        reason: 'ECU chip shortages trigger manufacturing halts and delayed vehicle deliveries.',
        connectedChannelIds: ['c1'],
      },
      {
        id: 'e2',
        ticker: 'TCS',
        company: 'TCS Semiconductor Eng.',
        reaction: '+1.8%',
        positive: true,
        reason: 'Surge in high-margin engineering demand for chip redesign & emulation.',
        connectedChannelIds: ['c3'],
      },
      {
        id: 'e3',
        ticker: 'DIXON',
        company: 'Dixon Technologies',
        reaction: '-3.5%',
        positive: false,
        reason: 'Higher component input costs squeeze electronic contract manufacturing margins.',
        connectedChannelIds: ['c2'],
      },
      {
        id: 'e4',
        ticker: 'KAYNES',
        company: 'Kaynes Technology',
        reaction: '+2.4%',
        positive: true,
        reason: 'Domestic electronic manufacturing beneficiary of supply chain localization.',
        connectedChannelIds: ['c2', 'c3'],
      },
    ],
  },
};

export default function MinimalImpactGraph({ onExploreFullPlatform }: MinimalImpactGraphProps) {
  const [selectedScenario, setSelectedScenario] = useState<string>('oil');
  const [hoveredNode, setHoveredNode] = useState<{ type: 'trigger' | 'channel' | 'equity'; id: string } | null>(null);

  const active = SCENARIOS[selectedScenario];

  // Helper to determine if a channel is highlighted based on current hover state
  const isChannelHighlighted = (channelId: string) => {
    if (!hoveredNode) return false;
    if (hoveredNode.type === 'trigger') return true;
    if (hoveredNode.type === 'channel' && hoveredNode.id === channelId) return true;
    if (hoveredNode.type === 'equity') {
      const eq = active.equities.find((e) => e.id === hoveredNode.id);
      return eq ? eq.connectedChannelIds.includes(channelId) : false;
    }
    return false;
  };

  // Helper to determine if an equity is highlighted
  const isEquityHighlighted = (equityId: string) => {
    if (!hoveredNode) return false;
    if (hoveredNode.type === 'trigger') return true;
    if (hoveredNode.type === 'equity' && hoveredNode.id === equityId) return true;
    if (hoveredNode.type === 'channel') {
      const eq = active.equities.find((e) => e.id === equityId);
      return eq ? eq.connectedChannelIds.includes(hoveredNode.id) : false;
    }
    return false;
  };

  // Live explanation generator for the hovered node
  const renderTraceBanner = () => {
    if (!hoveredNode) {
      return (
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Sparkles className="h-3.5 w-3.5 text-[#38BDF8] shrink-0" />
          <span>
            Hover over any origin shock, transmission channel, or equity to trace the verified impulse propagation path.
          </span>
        </div>
      );
    }

    if (hoveredNode.type === 'trigger') {
      return (
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
          <span className="font-semibold text-amber-300 font-mono">[ORIGIN SHOCK]</span>
          <span className="text-white font-medium">{active.trigger.name} ({active.trigger.change})</span>
          <ArrowRight className="h-3 w-3 text-slate-500" />
          <span className="text-[#38BDF8]">Broadcasting through {active.channels.length} macro channels</span>
          <ArrowRight className="h-3 w-3 text-slate-500" />
          <span className="text-emerald-400">
            Impacting {active.equities.length} equities ({active.equities.map((e) => e.ticker).join(', ')})
          </span>
        </div>
      );
    }

    if (hoveredNode.type === 'channel') {
      const ch = active.channels.find((c) => c.id === hoveredNode.id);
      const affected = active.equities.filter((e) => e.connectedChannelIds.includes(ch?.id ?? ''));
      return (
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
          <span className="font-semibold text-[#38BDF8] font-mono">[TRANSMISSION HOP]</span>
          <span className="text-slate-400">{active.trigger.name}</span>
          <ArrowRight className="h-3 w-3 text-slate-500" />
          <span className="text-white font-medium">{ch?.name} ({ch?.metric}, lag {ch?.lag})</span>
          <ArrowRight className="h-3 w-3 text-slate-500" />
          <span className="text-emerald-300">
            Valuation shift feeds: {affected.map((e) => `${e.ticker} ${e.reaction}`).join(' • ')}
          </span>
        </div>
      );
    }

    if (hoveredNode.type === 'equity') {
      const eq = active.equities.find((e) => e.id === hoveredNode.id);
      const chNames = active.channels
        .filter((c) => eq?.connectedChannelIds.includes(c.id))
        .map((c) => c.name)
        .join(' + ');
      return (
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
          <span className={`font-semibold font-mono ${eq?.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
            [EQUITY LINEAGE]
          </span>
          <span className="text-slate-400">{active.trigger.name}</span>
          <ArrowRight className="h-3 w-3 text-slate-500" />
          <span className="text-[#38BDF8] font-mono text-[11px]">{chNames}</span>
          <ArrowRight className="h-3 w-3 text-slate-500" />
          <span className="text-white font-semibold">{eq?.ticker} ({eq?.reaction})</span>
          <span className="text-slate-400 text-[11px]">— {eq?.reason}</span>
        </div>
      );
    }

    return null;
  };

  return (
    <section id="impact-graph" className="w-full px-4 md:px-8 py-16">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 mb-4 text-[11px] font-medium text-slate-300">
            <Activity className="h-3 w-3 text-[#38BDF8]" />
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
                  onClick={() => {
                    setSelectedScenario(sc.id);
                    setHoveredNode(null);
                  }}
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

        {/* Connected Graph Container */}
        <div className="relative rounded-[28px] border border-white/10 bg-[#0B111F] p-6 md:p-8 lg:p-10 shadow-2xl overflow-hidden">
          {/* Subtle Ambient Cosmic Glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.04),transparent_70%)]" />

          {/* Top Status & Interactive Legend Bar */}
          <div className="relative z-10 flex flex-wrap items-center justify-between pb-6 mb-4 border-b border-white/10 gap-4 text-[11px] font-mono">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                <span>ACTIVE SHOCK:</span>
                <span className="text-white font-semibold">{active.trigger.name} ({active.trigger.change})</span>
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-slate-400 hidden sm:inline">{active.trigger.confidence}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-[10px] text-slate-500">HOVER TO TRACE:</span>
              <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-slate-300 text-[10px]">
                Trigger → Channel → Equity
              </span>
            </div>
          </div>

          {/* Live Causal Breadcrumb Banner */}
          <div className="relative z-10 mb-8 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 min-h-[44px] flex items-center transition-all duration-300">
            {renderTraceBanner()}
          </div>

          {/* 3-Stage Connected DAG Graph Flow */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center">
            {/* ========================================================= */}
            {/* STAGE 1: TRIGGER EVENT (ORIGIN SHOCK)                     */}
            {/* ========================================================= */}
            <div className="lg:col-span-3 flex flex-col gap-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase tracking-wider px-1">
                <span>01 • Trigger Event</span>
                <span className="text-amber-400">Origin</span>
              </div>

              <div
                onMouseEnter={() => setHoveredNode({ type: 'trigger', id: 'trigger' })}
                onMouseLeave={() => setHoveredNode(null)}
                className={`relative rounded-2xl border transition-all duration-300 p-5 cursor-pointer ${
                  hoveredNode?.type === 'trigger'
                    ? 'border-amber-400/80 bg-amber-400/[0.08] shadow-[0_0_30px_rgba(251,191,36,0.25)] ring-1 ring-amber-400/50'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`}
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`rounded-md border px-2 py-0.5 text-[10px] font-mono font-bold ${active.badgeColor}`}>
                    {active.category}
                  </span>
                  <span className="rounded-md bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 text-xs font-mono font-bold text-amber-300">
                    {active.trigger.change}
                  </span>
                </div>

                {/* Event Name */}
                <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-1.5">
                  <span>{active.trigger.name}</span>
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {active.trigger.desc}
                </p>

                {/* Verification Pill */}
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400/90 font-mono pt-3 border-t border-white/05">
                  <ShieldCheck className="h-3 w-3 shrink-0" />
                  <span>Statistically Backtested (CAR)</span>
                </div>

                {/* Right Edge Output Port Indicator */}
                <div className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 h-4 w-4 items-center justify-center rounded-full bg-[#0B111F] border border-amber-400/60 shadow-[0_0_8px_rgba(251,191,36,0.6)]">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
                </div>
              </div>
            </div>

            {/* ========================================================= */}
            {/* SVG CONNECTOR GUTTER 1: TRIGGER -> CHANNELS               */}
            {/* ========================================================= */}
            <div className="hidden lg:flex lg:col-span-1 items-center justify-center h-[340px] relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 60 340" fill="none">
                {active.channels.map((ch) => {
                  const chY = ch.id === 'c1' ? 55 : ch.id === 'c2' ? 170 : 285;
                  const highlighted = isChannelHighlighted(ch.id);
                  const strokeColor = highlighted
                    ? active.accentColor
                    : hoveredNode
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(255, 255, 255, 0.16)';
                  const strokeWidth = highlighted ? '2.4' : '1.2';

                  return (
                    <g key={ch.id}>
                      <path
                        d={`M 0 170 C 30 170, 30 ${chY}, 60 ${chY}`}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeDasharray="4 6"
                        className={
                          highlighted
                            ? 'animate-flow-pulse drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]'
                            : ''
                        }
                      />
                      {/* Pulse point at output port */}
                      {highlighted && (
                        <circle
                          cx="60"
                          cy={chY}
                          r="2.5"
                          fill={active.accentColor}
                          className="animate-ping origin-center"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* ========================================================= */}
            {/* STAGE 2: TRANSMISSION CHANNELS (SECOND-ORDER HOPS)        */}
            {/* ========================================================= */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase tracking-wider px-1">
                <span>02 • Transmission Channels</span>
                <span className="text-[#38BDF8]">Multi-Hop</span>
              </div>

              <div className="flex flex-col gap-2.5">
                {active.channels.map((ch, idx) => {
                  const highlighted = isChannelHighlighted(ch.id);
                  return (
                    <div
                      key={ch.id}
                      onMouseEnter={() => setHoveredNode({ type: 'channel', id: ch.id })}
                      onMouseLeave={() => setHoveredNode(null)}
                      className={`relative rounded-xl border p-3.5 transition-all duration-200 cursor-pointer ${
                        highlighted
                          ? 'border-[#38BDF8] bg-[#38BDF8]/10 shadow-[0_0_25px_rgba(56,189,248,0.25)] ring-1 ring-[#38BDF8]/40 scale-[1.01]'
                          : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                      }`}
                    >
                      {/* Left Port */}
                      <div className="hidden lg:flex absolute -left-1.5 top-1/2 -translate-y-1/2 h-3 w-3 items-center justify-center rounded-full bg-[#0B111F] border border-[#38BDF8]/60">
                        <div className={`h-1 w-1 rounded-full ${highlighted ? 'bg-[#38BDF8]' : 'bg-slate-400'}`} />
                      </div>

                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-white flex items-center gap-1.5">
                          <span>{ch.name}</span>
                        </span>

                        <span className="text-[10px] font-mono text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/20 px-2 py-0.5 rounded">
                          {ch.metric}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-normal mb-1.5">
                        {ch.relation}
                      </p>

                      <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 pt-1 border-t border-white/05">
                        <span>Speed: <strong className="text-slate-300">{ch.lag}</strong></span>
                        <span className="text-slate-400">Hop {idx + 1}</span>
                      </div>

                      {/* Right Port */}
                      <div className="hidden lg:flex absolute -right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 items-center justify-center rounded-full bg-[#0B111F] border border-[#38BDF8]/60">
                        <div className={`h-1 w-1 rounded-full ${highlighted ? 'bg-[#38BDF8]' : 'bg-slate-400'}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ========================================================= */}
            {/* SVG CONNECTOR GUTTER 2: CHANNELS -> EQUITIES              */}
            {/* ========================================================= */}
            <div className="hidden lg:flex lg:col-span-1 items-center justify-center h-[340px] relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 60 340" fill="none">
                {active.equities.flatMap((eq) =>
                  eq.connectedChannelIds.map((chId) => {
                    const startY = chId === 'c1' ? 55 : chId === 'c2' ? 170 : 285;
                    const endY =
                      eq.id === 'e1' ? 40 : eq.id === 'e2' ? 120 : eq.id === 'e3' ? 205 : 285;
                    const highlighted = isEquityHighlighted(eq.id) && isChannelHighlighted(chId);
                    const strokeColor = highlighted
                      ? eq.positive
                        ? '#34D399'
                        : '#FB7185'
                      : hoveredNode
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(255, 255, 255, 0.16)';
                    const strokeWidth = highlighted ? '2.4' : '1.2';

                    return (
                      <g key={`${chId}-${eq.id}`}>
                        <path
                          d={`M 0 ${startY} C 30 ${startY}, 30 ${endY}, 60 ${endY}`}
                          stroke={strokeColor}
                          strokeWidth={strokeWidth}
                          strokeDasharray="4 6"
                          className={
                            highlighted
                              ? `animate-flow-pulse drop-shadow-[0_0_8px_${
                                  eq.positive ? 'rgba(52,211,153,0.8)' : 'rgba(251,113,133,0.8)'
                                }]`
                              : ''
                          }
                        />
                        {highlighted && (
                          <circle
                            cx="60"
                            cy={endY}
                            r="2.5"
                            fill={eq.positive ? '#34D399' : '#FB7185'}
                            className="animate-ping origin-center"
                          />
                        )}
                      </g>
                    );
                  })
                )}
              </svg>
            </div>

            {/* ========================================================= */}
            {/* STAGE 3: EQUITY REPERCUSSIONS (DOWNSTREAM TICKERS)        */}
            {/* ========================================================= */}
            <div className="lg:col-span-3 flex flex-col gap-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase tracking-wider px-1">
                <span>03 • Equity Repercussions</span>
                <span className="text-emerald-400">Assets</span>
              </div>

              <div className="flex flex-col gap-2">
                {active.equities.map((eq) => {
                  const highlighted = isEquityHighlighted(eq.id);
                  return (
                    <div
                      key={eq.id}
                      onMouseEnter={() => setHoveredNode({ type: 'equity', id: eq.id })}
                      onMouseLeave={() => setHoveredNode(null)}
                      className={`relative rounded-xl border p-2.5 sm:p-3 transition-all duration-200 cursor-pointer ${
                        highlighted
                          ? eq.positive
                            ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_20px_rgba(52,211,153,0.3)] ring-1 ring-emerald-400/50 scale-[1.02]'
                            : 'border-rose-400 bg-rose-500/10 shadow-[0_0_20px_rgba(251,113,133,0.3)] ring-1 ring-rose-400/50 scale-[1.02]'
                          : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                      }`}
                    >
                      {/* Left Port */}
                      <div className="hidden lg:flex absolute -left-1.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 items-center justify-center rounded-full bg-[#0B111F] border border-white/40">
                        <div
                          className={`h-1 w-1 rounded-full ${
                            highlighted
                              ? eq.positive
                                ? 'bg-emerald-400'
                                : 'bg-rose-400'
                              : 'bg-slate-400'
                          }`}
                        />
                      </div>

                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-mono text-xs font-bold text-white shrink-0">
                            {eq.ticker}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate">
                            {eq.company}
                          </span>
                        </div>

                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-bold shrink-0 ${
                            eq.positive
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {eq.reaction}
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-400 leading-tight">
                        {eq.reason}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Interactive Flow Callout */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-[#38BDF8]" />
              <span>
                Hover over any node to illuminate its exact upstream transmission path &amp; downstream equities.
              </span>
            </div>

            <button
              onClick={onExploreFullPlatform}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-medium text-white transition active:scale-95 shrink-0"
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
