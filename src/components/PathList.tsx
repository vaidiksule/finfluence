'use client';

import React from 'react';
import { RipplePath } from '@/lib/types';
import { Route, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

interface PathListProps {
  paths: RipplePath[];
  selectedPathId?: string | null;
  onSelectPath: (path: RipplePath) => void;
}

export default function PathList({ paths, selectedPathId, onSelectPath }: PathListProps) {
  if (paths.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center p-6 text-center text-zinc-500 text-xs font-sans">
        <Route className="h-6 w-6 mb-2 text-zinc-600 stroke-[1.5]" />
        <span>No transmission paths discovered yet.</span>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-3 text-xs font-sans">
      <div className="flex items-center justify-between px-1 mb-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          Ranked Macro Shockwave Paths ({paths.length})
        </span>
        <span className="text-[10px] text-zinc-500 font-mono">Ranked by ∏ Conf</span>
      </div>

      {paths.map((p, idx) => {
        const isSelected = p.path_id === selectedPathId;
        const hasContradicted = p.warnings.some((w) => w.toLowerCase().includes('contradicted'));
        const hasUnverified = p.warnings.some((w) => w.toLowerCase().includes('unverified'));

        return (
          <div
            key={p.path_id}
            onClick={() => onSelectPath(p)}
            className={`cursor-pointer rounded-2xl border p-3.5 transition-all ${
              isSelected
                ? 'border-white/30 bg-zinc-800/90 shadow-xl'
                : 'border-white/5 bg-zinc-900/50 hover:border-white/15 hover:bg-zinc-800/60'
            }`}
          >
            {/* Header: Rank, Hops, and Total Confidence */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-semibold text-zinc-200 border border-white/10">
                  {idx + 1}
                </span>
                <span className="text-[11px] font-medium text-zinc-300">
                  {p.hop_count} {p.hop_count === 1 ? 'hop' : 'hops'}
                </span>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs font-semibold text-white">
                <Sparkles className="h-3 w-3 text-zinc-400" />
                <span>{(p.total_confidence * 100).toFixed(1)}%</span>
              </div>
            </div>

            {/* Path Steps */}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px]">
              {p.nodes.map((nodeId, nIdx) => (
                <React.Fragment key={nodeId}>
                  <span
                    className={`rounded-md px-2 py-0.5 font-medium border ${
                      nIdx === p.nodes.length - 1
                        ? 'bg-zinc-800 text-white font-semibold border-white/20'
                        : nIdx === 0
                        ? 'bg-zinc-900 text-zinc-200 border-white/10'
                        : 'bg-zinc-900/60 text-zinc-400 border-white/5'
                    }`}
                  >
                    {nodeId}
                  </span>
                  {nIdx < p.nodes.length - 1 && (
                    <ArrowRight className="h-3 w-3 text-zinc-600 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Warnings Pill */}
            {(hasContradicted || hasUnverified) && (
              <div className="mt-2.5 flex flex-wrap gap-1">
                {hasContradicted && (
                  <span className="flex items-center gap-1 rounded-full bg-zinc-800/90 px-2 py-0.5 text-[9.5px] font-medium text-zinc-300 border border-zinc-700">
                    <ShieldAlert className="h-2.5 w-2.5 text-zinc-400" />
                    Contains contradicted link
                  </span>
                )}
                {hasUnverified && (
                  <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[9.5px] text-zinc-500 border border-white/5">
                    Partly inferred
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
