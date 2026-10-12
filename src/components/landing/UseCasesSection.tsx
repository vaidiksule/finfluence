'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Briefcase,
  ShieldAlert,
  Search,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

interface UseCase {
  id: string;
  role: string;
  tagline: string;
  description: string;
  queryExample: string;
  outputInsight: string;
  icon: React.ReactNode;
}

const USE_CASES: UseCase[] = [
  {
    id: 'analysts',
    role: 'Market Analysts',
    tagline: 'Discover indirect exposure and second-order market effects.',
    description:
      'Identify how macro shifts in input feedstocks, shipping routes, or tariffs ripple into downstream sector margins before quarterly earnings calls confirm the damage.',
    queryExample: '“How will a 15% increase in Baltic Dry freight rates propagate to auto parts margins?”',
    outputInsight: 'Traces 3-hop path through cold-rolled steel tariffs, shipping surcharges, and inventory lead times, flagging vulnerable OEMs.',
    icon: <TrendingUp className="h-5 w-5 text-[#25D9F2]" />,
  },
  {
    id: 'researchers',
    role: 'Portfolio Researchers',
    tagline: 'Investigate how macroeconomic developments affect asset classes.',
    description:
      'Stress-test cross-asset exposures against monetary policy shifts, sovereign yield curve steepening, and commodity shocks with quantitative event studies.',
    queryExample: '“What historical abnormal returns occur in domestic banking when sovereign 10Y yields spike 40bps?”',
    outputInsight: 'CAR backtesting over 14 historical shocks reveals a -2.8% 10-day drawdown on banking index with p = 0.004 significance.',
    icon: <Briefcase className="h-5 w-5 text-[#20E3C2]" />,
  },
  {
    id: 'risk',
    role: 'Risk Teams',
    tagline: 'Explore potential transmission channels across sectors.',
    description:
      'Map latent systemic vulnerabilities and multi-hop contagion pathways across portfolio companies, verifying supply chain dependencies against 10-K disclosures.',
    queryExample: '“Which portfolio equities have hidden dependencies on Straits of Malacca shipping lanes?”',
    outputInsight: 'Identifies non-obvious semiconductor assembly bottlenecks and critical chemical precursor dependencies.',
    icon: <ShieldAlert className="h-5 w-5 text-[#9B70FF]" />,
  },
  {
    id: 'intelligence',
    role: 'Financial Intelligence Teams',
    tagline: 'Transform fragmented financial news into connected analytical context.',
    description:
      'Replace hours of manual headline scanning with an autonomous knowledge graph that clusters global events, maps causal links, and scores confidence in real time.',
    queryExample: '“Synthesize 50 breaking Middle East oil disclosures into a structured impact graph.”',
    outputInsight: 'Processes 50 articles in under 30 seconds into an explainable 4-hop network of verified market relationships.',
    icon: <Search className="h-5 w-5 text-[#25D9F2]" />,
  },
];

export default function UseCasesSection() {
  const [selectedCaseId, setSelectedCaseId] = useState('analysts');
  const activeCase = USE_CASES.find((c) => c.id === selectedCaseId) || USE_CASES[0];

  return (
    <section id="use-cases" className="relative w-full border-b border-white/10 bg-[#0A101A] py-24 px-4 md:px-8 overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[#20E3C2]/06 blur-[150px]" />

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="rounded-md border border-white/15 bg-white/05 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-300">
              SECTION 08
            </span>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#20E3C2]/30 bg-[#20E3C2]/10 px-3.5 py-1 text-[11px] font-semibold tracking-wider text-[#20E3C2]">
              <span>TARGET WORKFLOWS</span>
            </div>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-[#F5F7FA] sm:text-4xl md:text-5xl leading-tight">
            Built for Modern Financial Intelligence
          </h2>

          <p className="mt-4 text-base text-[#9CA9BB] leading-relaxed">
            From buy-side researchers to risk officers, Finfluence bridges the gap between raw news feeds and rigorous quantitative decision-making.
          </p>
        </div>

        {/* 4 Use Cases Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {USE_CASES.map((uc) => {
            const isSelected = uc.id === selectedCaseId;

            return (
              <div
                key={uc.id}
                onClick={() => setSelectedCaseId(uc.id)}
                className={`group cursor-pointer rounded-2xl p-6 sm:p-7 transition-all duration-300 ${
                  isSelected
                    ? 'border border-[#25D9F2] bg-[#05070D] shadow-[0_10px_35px_rgba(37,217,242,0.15)] ring-1 ring-[#25D9F2]/40'
                    : 'border border-white/10 bg-[#05070D]/70 hover:border-white/20 hover:bg-[#05070D]'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/05 group-hover:border-[#25D9F2]/30 group-hover:bg-[#25D9F2]/10 transition-colors">
                      {uc.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-[#25D9F2] transition-colors">
                        {uc.role}
                      </h3>
                      <span className="text-[11px] text-[#20E3C2] font-semibold">
                        {uc.tagline}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#9CA9BB] leading-relaxed mb-5">
                  {uc.description}
                </p>

                {/* Query & Insight Example Snippet */}
                <div className="rounded-xl border border-white/05 bg-[#0A101A] p-3 text-xs space-y-2 font-mono">
                  <div className="text-[#9CA9BB]">
                    <span className="text-[#25D9F2] font-bold">Query: </span>
                    <span className="text-slate-200">{uc.queryExample}</span>
                  </div>
                  <div className="text-[11px] text-[#9CA9BB] pt-1.5 border-t border-white/05">
                    <span className="text-[#20E3C2] font-bold">Signal: </span>
                    <span>{uc.outputInsight}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
