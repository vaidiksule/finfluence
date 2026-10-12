'use client';

import React from 'react';
import {
  Radio,
  Cpu,
  Network,
  GitBranch,
  LineChart,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

interface Capability {
  title: string;
  description: string;
  metric: string;
  icon: React.ReactNode;
}

const CAPABILITIES: Capability[] = [
  {
    title: 'Autonomous Event Detection',
    description:
      'Continuously parse global RSS news wires and disclosures, flagging 2σ statistical volatility triggers in sub-second latency.',
    metric: '< 1.8s latency',
    icon: <Radio className="h-5 w-5 text-[#25D9F2]" />,
  },
  {
    title: 'Financial Entity Extraction',
    description:
      'Recognize companies, commodities, sectors, currencies, and macroeconomic indicators, resolving them into canonical exchange symbols.',
    metric: '99.4% precision',
    icon: <Cpu className="h-5 w-5 text-[#20E3C2]" />,
  },
  {
    title: 'Dynamic Knowledge Graphs',
    description:
      'Connect financial entities through directed, explainable relationships that evolve organically as news breaks.',
    metric: 'Multi-Asset Mesh',
    icon: <Network className="h-5 w-5 text-[#9B70FF]" />,
  },
  {
    title: 'Impact Propagation',
    description:
      'Trace multi-step transmission pathways across sectors, asset classes, and down to individual equity balance sheets.',
    metric: 'Up to 4 hops deep',
    icon: <GitBranch className="h-5 w-5 text-[#25D9F2]" />,
  },
  {
    title: 'Time-Series Integration',
    description:
      'Incorporate 260-day historical market returns, Cumulative Abnormal Returns (CAR), and rolling lagged correlations.',
    metric: '100% In-Memory Quant',
    icon: <LineChart className="h-5 w-5 text-[#20E3C2]" />,
  },
  {
    title: 'Explainable AI Reasoning',
    description:
      'Understand the empirical evidence, assumptions, sample sizes, and p-values behind every suggested connection.',
    metric: 'Radical Honesty',
    icon: <ShieldCheck className="h-5 w-5 text-[#9B70FF]" />,
  },
];

export default function PlatformCapabilities() {
  return (
    <section id="capabilities" className="relative w-full border-b border-white/10 bg-[#05070D] py-24 px-4 md:px-8 overflow-hidden">
      {/* Background Glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#25D9F2]/05 blur-[160px]" />

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="rounded-md border border-white/15 bg-white/05 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-300">
              SECTION 07
            </span>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#25D9F2]/30 bg-[#25D9F2]/10 px-3.5 py-1 text-[11px] font-semibold tracking-wider text-[#25D9F2]">
              <span>CORE PLATFORM CAPABILITIES</span>
            </div>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-[#F5F7FA] sm:text-4xl md:text-5xl leading-tight">
            Platform Capabilities
          </h2>

          <p className="mt-4 text-base text-[#9CA9BB] leading-relaxed">
            Engineered like high-frequency financial infrastructure. Every component is built for sub-60-second execution, deterministic vector math, and explainable audit trails.
          </p>
        </div>

        {/* 6 Capabilities Clean Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAPABILITIES.map((cap, idx) => (
            <div
              key={cap.title}
              className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0A101A]/80 p-6 sm:p-7 backdrop-blur-xl transition-all duration-300 hover:border-[#25D9F2]/40 hover:bg-[#0E1624] hover:shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(37,217,242,0.12)] hover:-translate-y-1"
            >
              <div>
                {/* Top: Icon & Metric Tag */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/05 group-hover:border-[#25D9F2]/40 group-hover:bg-[#25D9F2]/10 transition-colors">
                    {cap.icon}
                  </div>

                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#9CA9BB] group-hover:text-[#25D9F2] transition-colors">
                    {cap.metric}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-[#F5F7FA] mb-2 group-hover:text-white">
                  {cap.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-[#9CA9BB] leading-relaxed">
                  {cap.description}
                </p>
              </div>

              {/* Bottom Subtle Cyan Accent Line */}
              <div className="mt-6 pt-4 border-t border-white/05 flex items-center justify-between text-[11px] text-[#9CA9BB]/60 font-mono">
                <span>MODULE 0{idx + 1}</span>
                <span className="text-[#25D9F2] opacity-0 group-hover:opacity-100 transition-opacity">
                  ACTIVE
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
