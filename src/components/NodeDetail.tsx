'use client';

import React from 'react';
import { GraphEdge, GraphNode } from '@/lib/types';
import { ExternalLink, ArrowRight, ArrowLeft, ShieldAlert } from 'lucide-react';

interface NodeDetailProps {
  node: GraphNode;
  incomingEdges: GraphEdge[];
  outgoingEdges: GraphEdge[];
  onSelectNode: (id: string) => void;
  onSelectEdge: (id: string) => void;
  onClose: () => void;
}

export default function NodeDetail({
  node,
  incomingEdges,
  outgoingEdges,
  onSelectNode,
  onSelectEdge,
  onClose
}: NodeDetailProps) {
  return (
    <div className="flex h-full flex-col overflow-y-auto p-4 text-xs">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <span className="rounded bg-cyan-950/80 px-2 py-0.5 text-[10px] font-semibold text-cyan-400 uppercase tracking-wider border border-cyan-800/40">
              {node.type}
            </span>
            <h2 className="mt-1 text-base font-bold text-white tracking-tight">{node.label}</h2>
            {node.ticker && (
              <span className="font-mono text-xs text-slate-400">Ticker: {node.ticker}</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            ✕
          </button>
        </div>
        {node.description && (
          <p className="mt-2 text-slate-300 leading-relaxed text-[11px]">{node.description}</p>
        )}
      </div>

      {/* Measurement Status & Proxy Notice */}
      <div className="mt-3">
        {!node.measurable ? (
          <div className="rounded-lg bg-amber-500/10 p-2.5 border border-amber-500/20 text-amber-300 text-[11px] flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <span className="font-semibold">Non-measurable concept:</span> Evaluated using news evidence and upstream mechanisms.
              {node.proxy_of && (
                <div className="mt-1 text-slate-300 text-[10px]">
                  Measured via proxy: <span className="font-semibold text-amber-200">{node.proxy_of}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-emerald-500/10 p-2 border border-emerald-500/20 text-emerald-400 text-[11px]">
            ✓ Empirically tracked via historical daily market return series.
          </div>
        )}
      </div>

      {/* Caused By (Incoming Edges) */}
      <div className="mt-4">
        <span className="flex items-center gap-1 font-semibold uppercase text-slate-400 text-[10px] tracking-wider">
          <ArrowLeft className="h-3 w-3 text-cyan-400" />
          Caused By ({incomingEdges.length})
        </span>
        <div className="mt-2 space-y-1.5">
          {incomingEdges.length === 0 ? (
            <div className="text-[11px] text-slate-500 italic">No incoming links recorded.</div>
          ) : (
            incomingEdges.map((e) => {
              const src = typeof e.source === 'object' ? (e.source as any).id : e.source;
              return (
                <div
                  key={e.id}
                  onClick={() => onSelectEdge(e.id)}
                  className="flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-900/60 p-2 hover:border-slate-700 hover:bg-slate-900 cursor-pointer transition-all"
                >
                  <div className="truncate mr-2">
                    <span className="font-medium text-slate-200">{src}</span>
                    <span className="text-[10px] text-slate-500 block truncate">{e.relation}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        e.state === 'validated'
                          ? 'bg-emerald-400'
                          : e.state === 'contradicted'
                          ? 'bg-rose-400'
                          : 'bg-slate-400'
                      }`}
                    />
                    <span className="font-mono text-[10px] text-slate-300">
                      {(e.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Affects (Outgoing Edges) */}
      <div className="mt-4">
        <span className="flex items-center gap-1 font-semibold uppercase text-slate-400 text-[10px] tracking-wider">
          <ArrowRight className="h-3 w-3 text-cyan-400" />
          Affects ({outgoingEdges.length})
        </span>
        <div className="mt-2 space-y-1.5">
          {outgoingEdges.length === 0 ? (
            <div className="text-[11px] text-slate-500 italic">No outgoing links recorded.</div>
          ) : (
            outgoingEdges.map((e) => {
              const tgt = typeof e.target === 'object' ? (e.target as any).id : e.target;
              return (
                <div
                  key={e.id}
                  onClick={() => onSelectEdge(e.id)}
                  className="flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-900/60 p-2 hover:border-slate-700 hover:bg-slate-900 cursor-pointer transition-all"
                >
                  <div className="truncate mr-2">
                    <span className="font-medium text-slate-200">{tgt}</span>
                    <span className="text-[10px] text-slate-500 block truncate">{e.relation}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        e.state === 'validated'
                          ? 'bg-emerald-400'
                          : e.state === 'contradicted'
                          ? 'bg-rose-400'
                          : 'bg-slate-400'
                      }`}
                    />
                    <span className="font-mono text-[10px] text-slate-300">
                      {(e.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
