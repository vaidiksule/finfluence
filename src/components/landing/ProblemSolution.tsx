'use client';

import React from 'react';
import {
  Unlink2,
  GitGraph,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Layers,
  Network,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

export default function ProblemSolution() {
  return (
    <section id="problem" className="relative w-full border-b border-white/10 bg-[#05070D] py-24 px-4 md:px-8 overflow-hidden">
      {/* Background Subtle Ambience */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[900px] rounded-full bg-[#25D9F2]/05 blur-[160px]" />

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="rounded-md border border-white/15 bg-white/05 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-300">
              SECTION 03
            </span>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#25D9F2]/30 bg-[#25D9F2]/10 px-3.5 py-1 text-[11px] font-semibold tracking-wider text-[#25D9F2]">
              <span>THE INTELLIGENCE GAP</span>
            </div>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-[#F5F7FA] sm:text-4xl md:text-5xl leading-tight">
            Markets are connected.{' '}
            <span className="text-[#25D9F2]">Financial intelligence should be too.</span>
          </h2>

          <p className="mt-4 text-base text-[#9CA9BB] leading-relaxed">
            A single event can trigger dozens of second-order consequences. Traditional news feeds show isolated headlines, leaving investors and analysts to connect the dots themselves.
          </p>
        </div>

        {/* Before and After Visual Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Traditional Financial News (Before) */}
          <div className="relative flex flex-col rounded-2xl border border-white/10 bg-[#0A101A]/60 p-6 sm:p-8 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            {/* Header Badge */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                  <Unlink2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-200">
                    Traditional Financial Feeds
                  </h3>
                  <span className="text-xs text-[#9CA9BB]">Fragmented & Disconnected</span>
                </div>
              </div>
              <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-red-400 uppercase tracking-wider">
                Isolated Silos
              </span>
            </div>

            {/* Visual: Disconnected Headlines and Floating Dots */}
            <div className="my-6 flex-1 rounded-xl border border-dashed border-white/10 bg-[#05070D]/80 p-5 flex flex-col justify-center">
              <div className="space-y-3">
                {/* Floating Headline 1 */}
                <div className="flex items-start justify-between rounded-lg border border-white/05 bg-white/05 p-3 text-xs opacity-70">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-slate-500" />
                    <span className="font-mono text-slate-300">08:14 GMT</span>
                    <span className="text-slate-200">"Crude oil rallies 12% on geopolitical bottleneck"</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">No Graph Context</span>
                </div>

                {/* Broken Arrow Indicator */}
                <div className="flex items-center justify-center py-0.5">
                  <span className="text-[10px] font-mono text-red-400/80 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
                    × Missing link: Second-order impact invisible
                  </span>
                </div>

                {/* Floating Headline 2 */}
                <div className="flex items-start justify-between rounded-lg border border-white/05 bg-white/05 p-3 text-xs opacity-60">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-slate-500" />
                    <span className="font-mono text-slate-300">11:30 GMT</span>
                    <span className="text-slate-200">"Civil aviation fuel costs surge; Asian Paints margins under pressure"</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Isolated Data</span>
                </div>

                {/* Broken Arrow Indicator */}
                <div className="flex items-center justify-center py-0.5">
                  <span className="text-[10px] font-mono text-red-400/80 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
                    × Manual hypothesis testing required (hours of lag)
                  </span>
                </div>

                {/* Floating Headline 3 */}
                <div className="flex items-start justify-between rounded-lg border border-white/05 bg-white/05 p-3 text-xs opacity-50">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-slate-500" />
                    <span className="font-mono text-slate-300">14:02 GMT</span>
                    <span className="text-slate-200">"USD strengthens against INR; Indian IT exporters gain"</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">No Evidence Backtest</span>
                </div>
              </div>
            </div>

            {/* Pain Points List */}
            <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs text-[#9CA9BB]">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                <span className="font-semibold text-slate-300">Isolated headlines:</span>
                <span>Events presented as independent stories with zero structural causality.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                <span className="font-semibold text-slate-300">Disconnected data sources:</span>
                <span>Macro releases, ticker prices, and supply chains exist in separate tabs.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                <span className="font-semibold text-slate-300">Manual impact analysis:</span>
                <span>Analysts spend hours piecing together multi-hop transmission chains.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                <span className="font-semibold text-slate-300">Limited visibility:</span>
                <span>Second- and third-order market ramifications hit portfolios unnoticed.</span>
              </div>
            </div>
          </div>

          {/* Card 2: With Finfluence (After) */}
          <div className="relative flex flex-col rounded-2xl border border-[#25D9F2]/30 bg-gradient-to-b from-[#0A101A] to-[#070D18] p-6 sm:p-8 backdrop-blur-xl shadow-[0_15px_40px_rgba(37,217,242,0.1)] ring-1 ring-[#25D9F2]/20">
            {/* Header Badge */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#25D9F2]/15 border border-[#25D9F2]/30 text-[#25D9F2] shadow-[0_0_12px_rgba(37,217,242,0.3)]">
                  <GitGraph className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    With Finfluence
                  </h3>
                  <span className="text-xs text-[#20E3C2]">Autonomous Knowledge Graph</span>
                </div>
              </div>
              <span className="rounded-full border border-[#25D9F2]/40 bg-[#25D9F2]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#25D9F2] uppercase tracking-wider shadow-[0_0_10px_rgba(37,217,242,0.2)]">
                Unified Mesh
              </span>
            </div>

            {/* Visual: Connected Knowledge Graph Mini-Network */}
            <div className="my-6 flex-1 rounded-xl border border-[#25D9F2]/30 bg-[#05070D]/90 p-5 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute inset-0 finfluence-grid-bg opacity-40 pointer-events-none" />

              {/* Connected Chain Visualization */}
              <div className="relative z-10 flex flex-col gap-3">
                {/* Step 1: Origin Shock */}
                <div className="flex items-center justify-between rounded-lg border border-[#FF5D65]/40 bg-[#FF5D65]/10 p-3 text-xs shadow-[0_0_15px_rgba(255,93,101,0.15)]">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-[#FF5D65] animate-ping" />
                    <span className="font-bold text-white font-mono">ORIGIN SHOCK:</span>
                    <span className="text-slate-200">Crude Oil Spike (+12.4%)</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#FF5D65] bg-[#FF5D65]/20 px-1.5 py-0.5 rounded">
                    2σ Trigger (p &lt; 0.01)
                  </span>
                </div>

                {/* Animated Transmission Connector */}
                <div className="flex items-center gap-2 px-4 py-0.5">
                  <div className="h-4 w-0.5 bg-gradient-to-b from-[#FF5D65] to-[#9B70FF]" />
                  <span className="text-[10px] font-mono text-[#25D9F2]">
                    ↓ Hop 1: Upstream feedstock transmission (Elasticity 0.84)
                  </span>
                </div>

                {/* Step 2: Macro & Sector Propagation */}
                <div className="flex items-center justify-between rounded-lg border border-[#9B70FF]/40 bg-[#9B70FF]/10 p-3 text-xs shadow-[0_0_15px_rgba(155,112,255,0.15)]">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#9B70FF]" />
                    <span className="font-bold text-white font-mono">MACRO TRANSMISSION:</span>
                    <span className="text-slate-200">Inflation Expectations → Yield Curve Steepening</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#9B70FF] bg-[#9B70FF]/20 px-1.5 py-0.5 rounded">
                    Validated (CAR 5d: +28bps)
                  </span>
                </div>

                {/* Animated Transmission Connector */}
                <div className="flex items-center gap-2 px-4 py-0.5">
                  <div className="h-4 w-0.5 bg-gradient-to-b from-[#9B70FF] to-[#20E3C2]" />
                  <span className="text-[10px] font-mono text-[#20E3C2]">
                    ↓ Hop 2: Downstream Asset Re-rating
                  </span>
                </div>

                {/* Step 3: Equity & Currency Downstream */}
                <div className="flex items-center justify-between rounded-lg border border-[#20E3C2]/40 bg-[#20E3C2]/10 p-3 text-xs shadow-[0_0_15px_rgba(32,227,194,0.15)]">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#20E3C2]" />
                    <span className="font-bold text-white font-mono">DOWNSTREAM IMPACT:</span>
                    <span className="text-slate-200">Airlines (-4.8%) | USD/INR (+0.8%) | IT Exporters (+2.1%)</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#20E3C2] bg-[#20E3C2]/20 px-1.5 py-0.5 rounded">
                    Empirical Proof Cited
                  </span>
                </div>
              </div>
            </div>

            {/* Solution Advantages List */}
            <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs text-[#9CA9BB]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#20E3C2] shrink-0" />
                <span className="font-semibold text-white">Connected financial entities:</span>
                <span>Companies, commodities, currencies, and indicators modeled in one unified graph.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#20E3C2] shrink-0" />
                <span className="font-semibold text-white">AI-assisted event extraction:</span>
                <span>Unstructured news parsed into structured `{'{event, entities, edges}'}` in &lt;2 seconds.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#20E3C2] shrink-0" />
                <span className="font-semibold text-white">Multi-step impact propagation:</span>
                <span>Trace paths up to 4 hops downstream to uncover non-obvious beneficiary &amp; victim equities.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#20E3C2] shrink-0" />
                <span className="font-semibold text-white">Explainable relationships:</span>
                <span>Every link backed by cumulative abnormal returns (CAR) and Student-t statistical tests.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
