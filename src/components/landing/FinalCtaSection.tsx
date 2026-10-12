'use client';

import React from 'react';
import { ArrowRight, Sparkles, Network, Globe } from 'lucide-react';

interface FinalCtaSectionProps {
  onExploreGraph: () => void;
}

export default function FinalCtaSection({ onExploreGraph }: FinalCtaSectionProps) {
  return (
    <section id="cta" className="relative w-full border-b border-white/10 bg-[#05070D] py-28 px-4 md:px-8 overflow-hidden">
      {/* Background Glowing Network Grid & Radial Light */}
      <div className="pointer-events-none absolute inset-0 finfluence-grid-bg opacity-25" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[750px] rounded-full bg-gradient-to-r from-[#25D9F2]/10 via-[#20E3C2]/10 to-[#9B70FF]/10 blur-[130px]" />

      <div className="relative mx-auto max-w-4xl text-center z-10">
        {/* Subtle Network Badge */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="rounded-md border border-white/15 bg-white/05 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-300">
            SECTION 09
          </span>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#25D9F2]/30 bg-[#25D9F2]/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-[#25D9F2] shadow-[0_0_20px_rgba(37,217,242,0.2)]">
            <Network className="h-3.5 w-3.5" />
            <span>AUTONOMOUS FINANCIAL EVENT MARKET IMPACT GRAPH</span>
          </div>
        </div>

        {/* Main Headline */}
        <h2 className="text-3xl font-extrabold tracking-tight text-[#F5F7FA] sm:text-5xl md:text-6xl leading-[1.15] mb-6">
          Don’t just follow the news.{' '}
          <span className="bg-gradient-to-r from-[#25D9F2] via-[#20E3C2] to-[#9B70FF] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(37,217,242,0.4)] block sm:inline">
            Follow its impact.
          </span>
        </h2>

        {/* Supporting Copy */}
        <p className="mx-auto max-w-xl text-base sm:text-lg text-[#9CA9BB] leading-relaxed mb-10">
          Explore the connections shaping financial markets, one event at a time. Trace upstream drivers, downstream assets, and empirical evidence in real time.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onExploreGraph}
            className="flex items-center gap-2.5 rounded-xl border border-[#25D9F2] bg-[#25D9F2] px-7 py-4 text-sm font-bold text-[#05070D] shadow-[0_0_35px_rgba(37,217,242,0.45)] transition hover:bg-[#20E3C2] hover:border-[#20E3C2] hover:shadow-[0_0_45px_rgba(32,227,194,0.6)] active:scale-95"
          >
            <span>Explore Finfluence</span>
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </button>

          <a
            href="#market-graph"
            className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/05 px-6 py-4 text-sm font-semibold text-[#F5F7FA] backdrop-blur-md transition hover:border-[#25D9F2]/50 hover:bg-white/10 hover:text-white"
          >
            <span>View the Market Graph</span>
          </a>
        </div>

        <p className="mt-8 text-xs text-[#9CA9BB]/60 font-mono">
          Open architecture • Sub-60s ingestion • Radical honesty backtests
        </p>
      </div>
    </section>
  );
}
