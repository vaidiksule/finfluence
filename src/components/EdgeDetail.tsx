'use client';

import React from 'react';
import { GraphEdge } from '@/lib/types';
import { ShieldCheck, ShieldAlert, AlertTriangle, TrendingUp, TrendingDown, Clock, BookOpen } from 'lucide-react';

interface EdgeDetailProps {
  edge: GraphEdge;
  onClose: () => void;
}

export default function EdgeDetail({ edge, onClose }: EdgeDetailProps) {
  const srcId = typeof edge.source === 'object' ? (edge.source as any).id : edge.source;
  const tgtId = typeof edge.target === 'object' ? (edge.target as any).id : edge.target;

  const es = edge.event_study;

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4 text-xs">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                edge.state === 'validated'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : edge.state === 'contradicted'
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  : edge.state === 'stated'
                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                  : 'bg-slate-500/10 text-slate-400 border border-slate-700'
              }`}
            >
              {edge.state === 'validated' && <ShieldCheck className="h-3 w-3" />}
              {edge.state === 'contradicted' && <ShieldAlert className="h-3 w-3" />}
              {edge.state === 'inferred' && <AlertTriangle className="h-3 w-3" />}
              {edge.state}
            </span>
            <span className="font-mono text-xs text-slate-400">
              Conf: {(edge.confidence * 100).toFixed(0)}%
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Link Title */}
        <div className="mt-2 text-sm font-bold text-white">
          <span className="text-cyan-400">{srcId}</span>
          <span className="mx-2 text-slate-500 font-normal">[{edge.relation}]</span>
          <span className="text-emerald-400">{tgtId}</span>
        </div>

        {edge.mechanism_tag && (
          <span className="mt-1 inline-block rounded bg-slate-900 px-2 py-0.5 text-[10px] font-mono text-slate-400 border border-slate-800">
            Mechanism: {edge.mechanism_tag}
          </span>
        )}
      </div>

      {/* Radical Honesty Alert Banner if Contradicted */}
      {edge.state === 'contradicted' && (
        <div className="mt-3 rounded-lg border border-rose-500/30 bg-rose-950/40 p-3 text-rose-300">
          <div className="flex items-center gap-1.5 font-bold text-rose-400">
            <ShieldAlert className="h-4 w-4" />
            <span>Empirical Data Refutes Hypothesis</span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-rose-200/90">
            {edge.state_reason ||
              'Historical price series show a hit rate below 40% or statistically significant returns opposite to the proposed relationship.'}
          </p>
        </div>
      )}

      {/* Rationale */}
      <div className="mt-3 rounded-lg bg-slate-900/60 p-2.5 border border-slate-800/80">
        <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
          Economic Rationale
        </span>
        <p className="mt-1 text-slate-200 text-[11px] leading-relaxed">{edge.rationale}</p>
        {edge.cited_sentence && (
          <div className="mt-2 text-[10px] text-cyan-300 italic border-l-2 border-cyan-500 pl-2">
            &ldquo;{edge.cited_sentence}&rdquo;
          </div>
        )}
      </div>

      {/* Event Study Backtesting Table */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
            Event Study Backtest (2σ Shock Windows)
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            {es?.trigger_count ? `${es.trigger_count} historical triggers` : ''}
          </span>
        </div>

        {es?.windows ? (
          <div className="mt-2 overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-left font-mono text-[11px]">
              <thead className="bg-slate-900 text-slate-400 text-[10px]">
                <tr>
                  <th className="py-1.5 px-2">Window</th>
                  <th className="py-1.5 px-2">n</th>
                  <th className="py-1.5 px-2">Hit Rate</th>
                  <th className="py-1.5 px-2">Mean CAR</th>
                  <th className="py-1.5 px-2">p-value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {(['1', '5', '10'] as const).map((wKey) => {
                  const w = es.windows[wKey];
                  if (!w) return null;
                  return (
                    <tr key={wKey} className="hover:bg-slate-900/40">
                      <td className="py-1.5 px-2 text-cyan-400 font-semibold">{wKey} day</td>
                      <td className="py-1.5 px-2">{w.n}</td>
                      <td className="py-1.5 px-2">
                        <span
                          className={
                            w.hit_rate >= 0.6
                              ? 'text-emerald-400 font-semibold'
                              : w.hit_rate <= 0.4
                              ? 'text-rose-400 font-semibold'
                              : 'text-slate-300'
                          }
                        >
                          {(w.hit_rate * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td className="py-1.5 px-2">
                        <span className={w.mean_car >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                          {w.mean_car >= 0 ? '+' : ''}
                          {(w.mean_car * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-1.5 px-2">
                        <span
                          className={
                            w.significance === 'significant'
                              ? 'text-emerald-400 font-bold'
                              : w.significance === 'suggestive'
                              ? 'text-cyan-400'
                              : 'text-slate-500'
                          }
                        >
                          {w.p_value}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-2 rounded-lg bg-slate-900/40 p-3 text-slate-500 text-[11px] italic border border-slate-800">
            No empirical price series backtest available for this pair (unmeasurable node or proxy).
          </div>
        )}
      </div>

      {/* Lagged Correlation & Components */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
        <div className="rounded-lg bg-slate-900/60 p-2 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Best Lag</span>
          <div className="mt-1 flex items-center gap-1 font-mono text-cyan-400 text-sm">
            <Clock className="h-3.5 w-3.5" />
            <span>{edge.lag_best !== undefined ? `${edge.lag_best} days` : '0 days'}</span>
          </div>
        </div>
        <div className="rounded-lg bg-slate-900/60 p-2 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Correlation (r)</span>
          <div className="mt-1 flex items-center gap-1 font-mono text-sm text-slate-200">
            {edge.corr_best !== undefined && edge.corr_best >= 0 ? (
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-rose-400" />
            )}
            <span>{edge.corr_best !== undefined ? edge.corr_best.toFixed(3) : '0.000'}</span>
          </div>
        </div>
      </div>

      {/* Audit Transparency Disclaimer */}
      <div className="mt-auto pt-4 border-t border-slate-800/80 text-[10px] text-slate-500 text-center">
        🔒 Historically associated, not proven causal. Evaluated via 2σ trigger backtest.
      </div>
    </div>
  );
}
