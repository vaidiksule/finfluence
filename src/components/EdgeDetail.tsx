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
    <div className="flex h-full flex-col overflow-y-auto p-4 text-xs font-sans">
      {/* Header */}
      <div className="border-b border-white/10 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10.5px] font-medium tracking-wide border ${
                edge.state === 'validated'
                  ? 'bg-white/10 text-white border-white/20'
                  : edge.state === 'contradicted'
                  ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800'
              }`}
            >
              {edge.state === 'validated' && <ShieldCheck className="h-3 w-3 text-white" />}
              {edge.state === 'contradicted' && <ShieldAlert className="h-3 w-3 text-zinc-400" />}
              {edge.state === 'inferred' && <AlertTriangle className="h-3 w-3 text-zinc-500" />}
              <span className="capitalize">{edge.state}</span>
            </span>
            <span className="font-mono text-xs text-zinc-400">
              {(edge.confidence * 100).toFixed(0)}% Conf
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Link Title */}
        <div className="mt-3 text-sm font-semibold text-white tracking-tight">
          <span className="text-zinc-100">{srcId}</span>
          <span className="mx-2 text-zinc-500 font-normal text-xs uppercase tracking-wider">→ {edge.relation} →</span>
          <span className="text-zinc-300">{tgtId}</span>
        </div>

        {edge.mechanism_tag && (
          <span className="mt-1.5 inline-block rounded-md bg-zinc-900 px-2 py-0.5 text-[10px] font-mono text-zinc-400 border border-white/5">
            Mechanism: {edge.mechanism_tag}
          </span>
        )}
      </div>

      {/* Radical Honesty Notice if Contradicted */}
      {edge.state === 'contradicted' && (
        <div className="mt-3.5 rounded-xl border border-white/15 bg-zinc-900/80 p-3 text-zinc-300">
          <div className="flex items-center gap-2 font-medium text-white">
            <ShieldAlert className="h-4 w-4 text-zinc-300" />
            <span>Empirical Data Refutes Hypothesis</span>
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-400">
            {edge.state_reason ||
              'Historical price series show a hit rate below 40% or returns opposite to the LLM proposition during historical shock windows.'}
          </p>
        </div>
      )}

      {/* Rationale */}
      <div className="mt-3.5 rounded-xl bg-zinc-900/60 p-3 border border-white/5">
        <span className="text-[10px] font-semibold uppercase text-zinc-500 tracking-wider">
          Economic Rationale
        </span>
        <p className="mt-1 text-zinc-300 text-[11px] leading-relaxed">{edge.rationale}</p>
        {edge.cited_sentence && (
          <div className="mt-2 text-[10px] text-zinc-400 italic border-l border-zinc-600 pl-2">
            &ldquo;{edge.cited_sentence}&rdquo;
          </div>
        )}
      </div>

      {/* Event Study Backtesting Table */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase text-zinc-500 tracking-wider">
            Event Study Backtest (2σ Shock Windows)
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">
            {es?.trigger_count ? `${es.trigger_count} historical triggers` : ''}
          </span>
        </div>

        {es?.windows ? (
          <div className="mt-2 overflow-x-auto rounded-xl border border-white/10 bg-zinc-950/40">
            <table className="w-full text-left font-mono text-[11px]">
              <thead className="bg-zinc-900/80 text-zinc-400 text-[10px] border-b border-white/5">
                <tr>
                  <th className="py-2 px-2.5 font-medium">Window</th>
                  <th className="py-2 px-2 font-medium">n</th>
                  <th className="py-2 px-2 font-medium">Hit Rate</th>
                  <th className="py-2 px-2 font-medium">Mean CAR</th>
                  <th className="py-2 px-2 font-medium">p-value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {(['1', '5', '10'] as const).map((wKey) => {
                  const w = es.windows[wKey];
                  if (!w) return null;
                  return (
                    <tr key={wKey} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="py-2 px-2.5 text-zinc-200 font-semibold">{wKey} day</td>
                      <td className="py-2 px-2 text-zinc-400">{w.n}</td>
                      <td className="py-2 px-2">
                        <span
                          className={
                            w.hit_rate >= 0.6
                              ? 'text-white font-semibold'
                              : w.hit_rate <= 0.4
                              ? 'text-zinc-500 font-medium'
                              : 'text-zinc-400'
                          }
                        >
                          {(w.hit_rate * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <span className="text-zinc-200">
                          {w.mean_car >= 0 ? '+' : ''}
                          {(w.mean_car * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-2 px-2 text-zinc-400">
                        p={w.p_value.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-2 rounded-xl bg-zinc-900/40 p-3 text-center text-zinc-500 text-[11px] border border-white/5">
            No 2σ historical backtest triggers available for this pair.
          </div>
        )}
      </div>

      {/* Lag & Correlation */}
      {(edge.lag_best !== undefined || edge.corr_best !== undefined) && (
        <div className="mt-3.5 flex gap-2">
          {edge.lag_best !== undefined && (
            <div className="flex-1 rounded-xl bg-zinc-900/60 p-2.5 border border-white/5">
              <span className="text-[10px] text-zinc-500 block uppercase tracking-wider">Optimal Lag</span>
              <span className="text-xs font-mono font-semibold text-zinc-200">
                T + {edge.lag_best} {edge.lag_best === 1 ? 'day' : 'days'}
              </span>
            </div>
          )}
          {edge.corr_best !== undefined && (
            <div className="flex-1 rounded-xl bg-zinc-900/60 p-2.5 border border-white/5">
              <span className="text-[10px] text-zinc-500 block uppercase tracking-wider">Lead-Lag Corr</span>
              <span className="text-xs font-mono font-semibold text-zinc-200">
                {edge.corr_best > 0 ? '+' : ''}
                {edge.corr_best.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Evidence Sources */}
      {edge.evidence && edge.evidence.length > 0 && (
        <div className="mt-4">
          <span className="text-[10px] font-semibold uppercase text-zinc-500 tracking-wider">
            Ingested Evidence ({edge.evidence.length})
          </span>
          <div className="mt-2 space-y-1.5">
            {edge.evidence.map((ev, i) => (
              <div key={i} className="rounded-lg bg-zinc-900/40 p-2 border border-white/5">
                <div className="font-medium text-zinc-200 text-[11px]">{ev.title}</div>
                {ev.quote_span && (
                  <div className="mt-1 text-[10px] text-zinc-400 italic">
                    &ldquo;{ev.quote_span}&rdquo;
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
