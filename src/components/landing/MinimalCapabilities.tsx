'use client';

import React from 'react';
import {
  Zap,
  Network,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
} from 'lucide-react';

export default function MinimalCapabilities() {
  const capabilities = [
    {
      icon: Zap,
      title: 'Autonomous Ingestion',
      badge: '< 1.8s Latency',
      badgeColor: 'text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/20',
      description:
        'Continuously ingests global news wires, regulatory filings, and macroeconomic indicators, extracting structured shock parameters without manual tagging.',
    },
    {
      icon: Network,
      title: 'Multi-Hop Causal Graph',
      badge: '4-Hop Contagion',
      badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      description:
        'Traces second and third-order market ripples across raw commodities, import bills, sovereign bond yields, and downstream corporate equities.',
    },
    {
      icon: ShieldCheck,
      title: 'Empirical Backtesting',
      badge: '94% Confidence',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      description:
        'Validates hypothesized linkages against historical 2-sigma shock events, calculating cumulative abnormal returns (CAR) and Student-t significance.',
    },
  ];

  return (
    <section id="capabilities" className="w-full px-4 md:px-8 py-16">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 mb-4 text-[11px] font-medium text-slate-300">
            <Cpu className="h-3 w-3 text-slate-400" />
            <span>Platform Architecture</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-white mb-3">
            Engineered For Clarity
          </h2>

          <p className="text-xs sm:text-sm text-slate-400">
            Designed for analysts and institutional researchers who require evidence-backed market intelligence.
          </p>
        </div>

        {/* 3 Minimal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            return (
              <div
                key={cap.title}
                className="rounded-[28px] border border-white/10 bg-[#0B111F] p-7 flex flex-col justify-between hover:border-white/20 transition-all shadow-xl group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white group-hover:border-white/20 transition">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-medium ${cap.badgeColor}`}
                    >
                      {cap.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-white mb-2.5">
                    {cap.title}
                  </h3>

                  <p className="text-xs leading-relaxed text-slate-400">
                    {cap.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
