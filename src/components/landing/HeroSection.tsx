'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Cpu,
  Layers,
  Database,
  Globe,
  Radio,
} from 'lucide-react';
import MinimalGlobe from './MinimalGlobe';

interface HeroSectionProps {
  onExploreGraph: () => void;
}

const ROTATING_TARGETS = ['Market', 'Industries'];

export default function HeroSection({ onExploreGraph }: HeroSectionProps) {
  const [trackIndex, setTrackIndex] = useState(0);
  const [hasTransition, setHasTransition] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setHasTransition(true);
      setTrackIndex((prev) => prev + 1);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const handleTransitionEnd = () => {
    if (trackIndex >= 2) {
      setHasTransition(false);
      setTrackIndex(0);
    }
  };

  const technologies = [
    { name: 'Python', symbol: 'PY' },
    { name: 'Next.js', symbol: 'NEXT' },
    { name: 'PyTorch', symbol: 'TORCH' },
    { name: 'OpenAI', symbol: 'AI' },
    { name: 'Reuters', symbol: 'RT' },
    { name: 'Bloomberg', symbol: 'BBG' },
    { name: 'SEC Edgar', symbol: 'SEC' },
    { name: 'AWS', symbol: 'AWS' },
    { name: 'Stripe', symbol: 'PAY' },
  ];

  return (
    <section id="home" className="w-full px-4 md:px-8 pt-2 pb-12">
      <div className="mx-auto max-w-7xl">
        {/* Main Minimal Hero Container Card (Matching Reference Shot) */}
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-b from-[#0B111F] via-[#080D1A] to-[#060912] p-8 md:p-12 lg:p-16 shadow-[0_20px_80px_rgba(0,0,0,0.7)]">
          {/* Subtle Ambient Corner Glow */}
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#1E293B]/30 blur-[100px]" />
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#38BDF8]/05 blur-[90px]" />

          {/* Grid Layout: Left Content, Right Wireframe Globe */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center min-h-[480px]">
            {/* Left Content Column */}
            <div className="lg:col-span-6 flex flex-col items-start max-w-xl">
              {/* Main Headline: 3 Lines with Vertical Scrolling Words on 3rd Line */}
              <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-medium tracking-tight text-white leading-[1.18] mb-8">
                <span className="block">See How One Event</span>
                <span className="block">Moves the Whole</span>
                <span className="block relative overflow-hidden h-[1.25em] w-full text-left mt-1">
                  <span
                    onTransitionEnd={handleTransitionEnd}
                    className={`flex flex-col h-[300%] ${
                      hasTransition
                        ? 'transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]'
                        : ''
                    }`}
                    style={{
                      transform: `translateY(-${(trackIndex * 100) / 3}%)`,
                    }}
                  >
                    <span className="h-1/3 flex items-center text-white font-medium">
                      Market
                    </span>
                    <span className="h-1/3 flex items-center text-white font-medium">
                      Industries
                    </span>
                    <span className="h-1/3 flex items-center text-white font-medium">
                      Market
                    </span>
                  </span>
                </span>
              </h1>

              {/* Stats Row (Two Minimal Stat Badges) */}
              <div className="flex items-center gap-8 pt-4 border-t border-white/05 w-full">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-300">
                    <TrendingUp className="h-4 w-4 text-[#38BDF8]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">&lt; 1.8s</div>
                    <div className="text-[11px] text-slate-400">Shock Propagation</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-300">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">94%</div>
                    <div className="text-[11px] text-slate-400">Empirical Confidence</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Wireframe Globe Visual (Enlarged) */}
            <div className="lg:col-span-6 flex items-center justify-center relative w-full">
              <MinimalGlobe />
            </div>
          </div>

          {/* Bottom Strip: "Technologies Powering Finfluence" */}
          <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs font-medium text-slate-400 shrink-0">
              Technologies Powering Finfluence
            </span>

            {/* Brand / Technology Pills Strip */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {technologies.map((tech) => (
                <div
                  key={tech.name}
                  className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.03] px-2.5 py-1 text-[11px] text-slate-300 hover:border-white/15 hover:bg-white/5 transition"
                >
                  <span className="font-mono text-[9px] font-semibold text-slate-400">
                    {tech.symbol}
                  </span>
                  <span className="font-medium text-slate-300">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
