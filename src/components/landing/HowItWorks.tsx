'use client';

import React, { useState } from 'react';
import {
  Radio,
  Cpu,
  Network,
  GitBranch,
  ArrowRight,
  CheckCircle2,
  Database,
  Code2,
  Terminal,
  Zap,
} from 'lucide-react';

interface Stage {
  step: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  technicalDetails: {
    latency: string;
    method: string;
    payloadPreview: string;
    quantMetric: string;
  };
}

const STAGES: Stage[] = [
  {
    step: 'STAGE 01',
    title: 'Detect the Event',
    tagline: 'Autonomous Ingestion & 2σ Shock Scanner',
    description:
      'AI continuously monitors financial news feeds and unstructured macroeconomic disclosures in parallel. A real-time shock scanner flags statistically significant 2σ volatility triggers.',
    icon: <Radio className="h-5 w-5 text-[#25D9F2]" />,
    technicalDetails: {
      latency: '< 1.8s RSS poll',
      method: 'Parallel Promise.allSettled() + 2σ Volatility Filter',
      payloadPreview: `{\n  "event": "crude_oil_spike",\n  "severity": "2.4_sigma",\n  "source": "Reuters / Bloomberg",\n  "headline": "Brent Crude climbs 12% amid Strait shipping disruptions"\n}`,
      quantMetric: 'Trigger Threshold: |ΔP| > 2.0σ(trailing 60d)',
    },
  },
  {
    step: 'STAGE 02',
    title: 'Extract Entities',
    tagline: 'NER & Canonical Financial Symbol Resolution',
    description:
      'Advanced LLM extractors recognize companies, commodities, currencies, sectors, and macroeconomic indicators, resolving them to canonical symbols while isolating unmeasurable proxies.',
    icon: <Cpu className="h-5 w-5 text-[#20E3C2]" />,
    technicalDetails: {
      latency: '2.1s LLM parse',
      method: 'Single-Pass Structured Extraction (GPT-4o-mini)',
      payloadPreview: `{\n  "entities": [\n    { "id": "commodity.crude_oil", "ticker": "BRENT" },\n    { "id": "equity.indigo", "ticker": "INDIGO.NS" },\n    { "id": "fx.usd_inr", "ticker": "USDINR=X" },\n    { "id": "macro.inflation", "measurable": false, "proxy": "^TNX" }\n  ]\n}`,
      quantMetric: 'Coverage: 5 asset classes + 12 major sectors',
    },
  },
  {
    step: 'STAGE 03',
    title: 'Connect the Graph',
    tagline: 'Causal Synthesis & Empirical Backtesting',
    description:
      'The engine constructs a dynamic knowledge graph linking entities through hypothesized causal relationships, immediately auditing them against historical market data (CAR event studies).',
    icon: <Network className="h-5 w-5 text-[#9B70FF]" />,
    technicalDetails: {
      latency: '< 1ms vector math',
      method: 'Cumulative Abnormal Return (CAR) + Student-t',
      payloadPreview: `{\n  "edge": "crude_oil -> airline_stocks",\n  "hypothesis": "negative_margin_squeeze",\n  "car_window": [1, 5, 10],\n  "hit_rate": 0.86,\n  "verdict": "VALIDATED",\n  "p_value": 0.0084\n}`,
      quantMetric: 'Scoring: 0.50(CAR) + 0.25(Corr) + 0.25(Articles)',
    },
  },
  {
    step: 'STAGE 04',
    title: 'Trace Market Impact',
    tagline: 'Multi-Hop Propagation & Downstream Risk Exposure',
    description:
      'Traces upstream drivers and downstream shock transmission paths across multiple hops, identifying second-order beneficiary and victim equities with complete supporting evidence.',
    icon: <GitBranch className="h-5 w-5 text-[#25D9F2]" />,
    technicalDetails: {
      latency: '< 5ms DFS search',
      method: 'Depth-First Path Traversal with Beta Sensitivity',
      payloadPreview: `{\n  "path": [\n    "crude_oil", "import_bill", "usd_inr", "it_exporters"\n  ],\n  "hops": 3,\n  "net_transmission_score": 0.74,\n  "primary_beneficiary": "TCS.NS (+2.1%)"\n}`,
      quantMetric: 'Max depth: 4 hops | Confidence: 84% validated',
    },
  },
];

export default function HowItWorks() {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const activeStage = STAGES[activeStageIndex];

  return (
    <section id="how-it-works" className="relative w-full border-b border-white/10 bg-[#0A101A] py-24 px-4 md:px-8 overflow-hidden">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute top-10 right-1/4 h-96 w-96 rounded-full bg-[#9B70FF]/08 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-10 left-1/4 h-96 w-96 rounded-full bg-[#25D9F2]/08 blur-[140px]" />

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="rounded-md border border-white/15 bg-white/05 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-300">
              SECTION 04
            </span>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#20E3C2]/30 bg-[#20E3C2]/10 px-3.5 py-1 text-[11px] font-semibold tracking-wider text-[#20E3C2]">
              <span>AUTONOMOUS PIPELINE</span>
            </div>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-[#F5F7FA] sm:text-4xl md:text-5xl leading-tight">
            From Event to Market Impact
          </h2>

          <p className="mt-4 text-base text-[#9CA9BB] leading-relaxed">
            A four-stage autonomous pipeline transforming raw, unstructured financial headlines into an explainable, empirically validated market impact graph.
          </p>
        </div>

        {/* 4-Stage Horizontal Pipeline Rails */}
        <div className="relative mb-12">
          {/* Connecting gradient line behind stages (Desktop only) */}
          <div className="hidden lg:block absolute top-7 left-12 right-12 h-0.5 bg-gradient-to-r from-[#25D9F2] via-[#20E3C2] to-[#9B70FF] opacity-40 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {STAGES.map((stage, idx) => {
              const isSelected = activeStageIndex === idx;

              return (
                <div
                  key={stage.step}
                  onClick={() => setActiveStageIndex(idx)}
                  className={`group relative flex flex-col rounded-2xl p-6 transition-all cursor-pointer ${
                    isSelected
                      ? 'border border-[#25D9F2] bg-[#05070D] shadow-[0_10px_35px_rgba(37,217,242,0.2)] ring-1 ring-[#25D9F2]/50'
                      : 'border border-white/10 bg-[#05070D]/70 hover:border-white/20 hover:bg-[#05070D]'
                  }`}
                >
                  {/* Step Badge & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 rounded ${
                        isSelected
                          ? 'bg-[#25D9F2]/20 text-[#25D9F2] border border-[#25D9F2]/40'
                          : 'bg-white/05 text-[#9CA9BB] border border-white/10'
                      }`}
                    >
                      {stage.step}
                    </span>

                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                        isSelected
                          ? 'bg-[#25D9F2]/20 border border-[#25D9F2]/50 shadow-[0_0_15px_rgba(37,217,242,0.3)]'
                          : 'bg-white/05 border border-white/10 group-hover:border-white/20'
                      }`}
                    >
                      {stage.icon}
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-lg font-bold text-[#F5F7FA] mb-1 group-hover:text-white">
                    {stage.title}
                  </h3>
                  <span className="text-[11px] font-semibold text-[#20E3C2] mb-3">
                    {stage.tagline}
                  </span>

                  {/* Description */}
                  <p className="text-xs text-[#9CA9BB] leading-relaxed flex-1">
                    {stage.description}
                  </p>

                  {/* Selection Indicator */}
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-[#9CA9BB]">
                      Latency: <strong className="text-white">{stage.technicalDetails.latency}</strong>
                    </span>
                    <span className={`font-semibold ${isSelected ? 'text-[#25D9F2]' : 'text-slate-500'}`}>
                      {isSelected ? 'Inspecting →' : 'Click to inspect'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Deep Stage Technical Telemetry Inspector Panel */}
        <div className="rounded-2xl border border-white/10 bg-[#05070D] p-6 lg:p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#25D9F2]/30 bg-[#25D9F2]/10 text-[#25D9F2]">
                <Terminal className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#25D9F2] uppercase">
                    {activeStage.step} TELEMETRY DOSSIER
                  </span>
                  <span className="rounded bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.2 text-[10px] font-mono text-emerald-400">
                    REAL-TIME VERIFIED
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white">
                  {activeStage.title}: {activeStage.tagline}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-[#9CA9BB]">Computational Speed</span>
                <span className="font-mono font-bold text-[#20E3C2]">
                  {activeStage.technicalDetails.latency}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Left: Code Payload View */}
            <div className="flex flex-col rounded-xl border border-white/10 bg-[#0A101A] p-4">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-[#25D9F2]" />
                  <span className="font-mono text-[11px] font-semibold text-slate-300">
                    Structured Extraction Payload (Strict Schema)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#9CA9BB]">JSON Schema v4</span>
              </div>

              <pre className="font-mono text-[11px] leading-relaxed text-slate-300 overflow-x-auto p-2 bg-[#05070D]/80 rounded-lg border border-white/05">
                <code>{activeStage.technicalDetails.payloadPreview}</code>
              </pre>
            </div>

            {/* Right: Quantitative Specification */}
            <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#0A101A] p-5">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9B70FF]">
                  Quantitative Methodology
                </span>
                <h5 className="text-sm font-bold text-white mt-1">
                  {activeStage.technicalDetails.method}
                </h5>
                <p className="text-xs text-[#9CA9BB] mt-3 leading-relaxed">
                  Finfluence guarantees mathematical rigour at each step. Rather than relying on generative text summaries, hypotheses are converted to vectors and measured against trailing price volatility, cumulative abnormal returns, and Student-t significance distributions.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-[#20E3C2]" />
                  <span className="text-xs font-mono font-bold text-[#20E3C2]">
                    {activeStage.technicalDetails.quantMetric}
                  </span>
                </div>
                <span className="text-[10px] text-[#9CA9BB] font-mono">100% In-Memory</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
