'use client';

import React from 'react';
import { CountryEventData } from '@/lib/earth/earthData';
import {
  X,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Activity,
  Layers,
  Sparkles,
  BarChart3,
} from 'lucide-react';

interface FloatingInfoPanelProps {
  data: CountryEventData;
  countryFlag?: string;
  onClose: () => void;
  onExploreDeepGraph?: () => void;
}

export default function FloatingInfoPanel({
  data,
  countryFlag = '🌐',
  onClose,
  onExploreDeepGraph,
}: FloatingInfoPanelProps) {
  return (
    <div
      role="dialog"
      aria-labelledby="floating-panel-title"
      className="pointer-events-auto absolute right-6 top-24 z-30 w-[380px] max-w-[calc(100vw-2rem)] select-none rounded-2xl border border-[#7B61FF]/60 bg-[#0B0C1E]/95 p-5 text-slate-100 shadow-[0_0_35px_rgba(123,97,255,0.35),0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-xl transition-all animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Top Header: Country Name, Confidence Label, Close Button */}
      <div className="flex items-center justify-between border-b border-[#7B61FF]/20 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{countryFlag}</span>
          <div>
            <h2 id="floating-panel-title" className="text-lg font-bold tracking-tight text-white">
              {data.countryName}
            </h2>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-time Macro Transmission</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Confidence Label */}
          <div className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            <ShieldCheck className="h-3 w-3" />
            <span>Confidence: {data.confidence}</span>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close details"
            className="rounded-lg p-1 text-slate-400 transition hover:bg-[#7B61FF]/20 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Event Title */}
      <div className="mt-3.5">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#7B61FF]">
          Financial Macro Shock
        </div>
        <h3 className="mt-0.5 text-base font-semibold text-white">
          {data.eventTitle}
        </h3>
      </div>

      {/* Mini Chain Graph: Oil Prices ↑ → Fuel Costs ↑ → Airline Stocks ↓ */}
      <div className="mt-4 rounded-xl border border-[#7B61FF]/30 bg-[#121330]/80 p-3 shadow-inner">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
            Causal Impact Chain
          </span>
          <span className="flex items-center gap-1 text-[10px] text-[#7B61FF]">
            <Activity className="h-3 w-3 animate-pulse" />
            Propagation Vector
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {data.chainGraph.map((node, idx) => (
            <React.Fragment key={idx}>
              <div
                className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-sm transition ${
                  node.direction === 'up'
                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-200 shadow-[0_0_8px_rgba(245,158,11,0.15)]'
                    : node.direction === 'down'
                    ? 'border-rose-500/40 bg-rose-500/10 text-rose-200 shadow-[0_0_8px_rgba(244,63,94,0.15)]'
                    : 'border-[#7B61FF]/40 bg-[#7B61FF]/10 text-purple-200'
                }`}
              >
                <span>{node.label}</span>
                {node.direction === 'up' && (
                  <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
                )}
                {node.direction === 'down' && (
                  <TrendingDown className="h-3.5 w-3.5 text-rose-400" />
                )}
              </div>

              {idx < data.chainGraph.length - 1 && (
                <div className="flex items-center text-[#7B61FF]">
                  <ArrowRight className="h-3.5 w-3.5 animate-pulse" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Bullet Points */}
      <div className="mt-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
          Key Impact Insights
        </div>
        <ul className="mt-2 space-y-2">
          {data.bulletPoints.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7B61FF] shadow-[0_0_6px_#7B61FF]" />
              <span className="leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Key Tickers & Sector Realizations */}
      {data.keyTickers && data.keyTickers.length > 0 && (
        <div className="mt-3.5 border-t border-[#7B61FF]/15 pt-3">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
            <span>Primary Market Tickers</span>
            <span className="text-[10px] text-slate-500">Event Window Realized</span>
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {data.keyTickers.map((t, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 rounded-md border border-slate-800 bg-[#141530] px-2 py-1 text-[11px] font-mono"
              >
                <span className="font-semibold text-slate-200">{t.ticker}</span>
                <span
                  className={t.positive ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}
                >
                  {t.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sources & Empirical Metric */}
      <div className="mt-4 flex items-center justify-between border-t border-[#7B61FF]/20 pt-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-slate-400">Sources:</span>
          <div className="flex items-center gap-1">
            {data.sources.map((src, idx) => (
              <span
                key={idx}
                className="rounded border border-[#7B61FF]/30 bg-[#7B61FF]/10 px-1.5 py-0.5 text-[10px] font-medium text-purple-200"
              >
                {src}
              </span>
            ))}
          </div>
        </div>

        <div className="text-[10px] text-slate-400 font-mono">
          {data.quantMetric.split('|')[0].trim()}
        </div>
      </div>

      {/* Action Footer: Explore Deep Knowledge Graph */}
      {onExploreDeepGraph && (
        <div className="mt-3.5 pt-2">
          <button
            onClick={onExploreDeepGraph}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#7B61FF]/70 bg-gradient-to-r from-[#7B61FF]/25 to-[#38BDF8]/20 px-3.5 py-2 text-xs font-semibold text-white shadow-[0_0_15px_rgba(123,97,255,0.25)] transition hover:border-[#7B61FF] hover:bg-[#7B61FF]/35 active:scale-[0.98]"
          >
            <Layers className="h-3.5 w-3.5 text-[#38BDF8]" />
            <span>Trace Full 3D Shockwave Graph</span>
            <ExternalLink className="h-3 w-3 opacity-70" />
          </button>
        </div>
      )}
    </div>
  );
}
