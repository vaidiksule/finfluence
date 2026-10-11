'use client';

import React from 'react';
import { RipplePath } from '@/lib/types';
import { Route, AlertTriangle, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

interface PathListProps {
  paths: RipplePath[];
  selectedPathId?: string | null;
  onSelectPath: (path: RipplePath) => void;
}

export default function PathList({ paths, selectedPathId, onSelectPath }: PathListProps) {
  if (paths.length === 0) {
    return (
      <div className="flex h-40 flex-col items-center justify-center p-4 text-center text-slate-500 text-xs">
        <Route className="h-6 w-6 mb-2 text-slate-600" />
        <span>No transmission paths discovered yet.</span>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-3 text-xs">
      <div className="flex items-center justify-between px-1 mb-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Ranked Macro Shockwave Paths ({paths.length})
        </span>
        <span className="text-[10px] text-slate-500 font-mono">Ranked by ∏ Conf</span>
      </div>

      {paths.map((p, idx) => {
        const isSelected = p.path_id === selectedPathId;
        const hasContradicted = p.warnings.some((w) => w.toLowerCase().includes('contradicted'));
        const hasUnverified = p.warnings.some((w) => w.toLowerCase().includes('unverified'));

        return (
          <div
            key={p.path_id}
            onClick={() => onSelectPath(p)}
            className={`cursor-pointer rounded-xl border p-3 transition-all ${
              isSelected
                ? 'border-cyan-500 bg-cyan-950/30 shadow-md shadow-cyan-950/50'
                : 'border-slate-800/80 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
            }`}
          >
            {/* Header: Rank, Hops, and Total Multiplied Confidence */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-slate-300">
                  {idx + 1}
                </span>
                <span className="text-[11px] font-medium text-slate-300">
                  {p.hop_count} {p.hop_count === 1 ? 'hop' : 'hops'}
                </span>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs font-semibold text-cyan-400">
                <Sparkles className="h-3 w-3 text-cyan-400" />
                <span>{(p.total_confidence * 100).toFixed(1)}%</span>
              </div>
            </div>

            {/* Path Node Sequence */}
            <div className="mt-2 flex flex-wrap items-center gap-1 text-[11px] font-medium text-slate-200">
              {p.nodes.map((nId, nIdx) => (
                <React.Fragment key={nIdx}>
                  <span className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300 font-mono text-[10px]">
                    {nId.replace(/^(commodity|indicator|sector|company|index|institution)\./, '')}
                  </span>
                  {nIdx < p.nodes.length - 1 && (
                    <ArrowRight className="h-2.5 w-2.5 text-slate-500 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Honest Warnings */}
            {p.warnings.length > 0 && (
              <div className="mt-2 space-y-1">
                {hasContradicted && (
                  <span className="flex items-center gap-1 rounded bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-medium text-rose-400 border border-rose-500/20">
                    <ShieldAlert className="h-3 w-3 shrink-0" />
                    Weakened: includes empirically contradicted link
                  </span>
                )}
                {hasUnverified && !hasContradicted && (
                  <span className="flex items-center gap-1 rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-300 border border-amber-500/20">
                    <AlertTriangle className="h-3 w-3 shrink-0" />
                    Partly unverified: includes low-sample link
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
