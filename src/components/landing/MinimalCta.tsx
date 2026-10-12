'use client';

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface MinimalCtaProps {
  onExploreGraph: () => void;
}

export default function MinimalCta({ onExploreGraph }: MinimalCtaProps) {
  return (
    <section className="w-full px-4 md:px-8 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-b from-[#0B111F] to-[#060912] p-10 md:p-16 text-center shadow-2xl">
          {/* Subtle Ambient Radial Glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.06),transparent_65%)]" />

          <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 mb-5 text-[11px] font-medium text-slate-300">
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span>Get Started</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-white mb-4 leading-snug">
              Every Event Moves A Market.{' '}
              <span className="text-slate-400 font-normal">Discover How.</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 mb-8 max-w-md">
              Explore the full interactive 3D knowledge galaxy, real-time SSE streaming, and backtested empirical event studies.
            </p>

            <button
              onClick={onExploreGraph}
              className="flex items-center gap-2 rounded-full bg-white px-7 py-3 text-xs font-semibold text-[#080C15] shadow-lg hover:bg-slate-100 transition active:scale-95"
            >
              <span>Launch 3D Explorer</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
