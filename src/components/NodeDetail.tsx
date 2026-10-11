'use client';

import React from 'react';
import { GraphEdge, GraphNode } from '@/lib/types';
import { ArrowRight, ArrowLeft, ShieldAlert } from 'lucide-react';

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
    <div className="flex h-full flex-col overflow-y-auto p-4 text-xs font-sans">
      {/* Header */}
      <div className="border-b border-white/10 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-block rounded-full bg-zinc-800 px-2.5 py-0.5 text-[10px] font-medium text-zinc-300 uppercase tracking-wider border border-white/10">
              {node.type}
            </span>
            <h2 className="mt-1.5 text-base font-semibold text-white tracking-tight">{node.label}</h2>
            {node.ticker && (
              <span className="font-mono text-xs text-zinc-400">Ticker: {node.ticker}</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        {node.description && (
          <p className="mt-2 text-zinc-400 leading-relaxed text-[11px]">{node.description}</p>
        )}
      </div>

      {/* Non-measurable concept banner */}
      {!node.measurable && (
        <div className="mt-3.5 rounded-xl bg-zinc-900/80 p-3 border border-white/10 text-zinc-300 text-[11px] flex items-start gap-2.5">
          <ShieldAlert className="h-4 w-4 shrink-0 text-zinc-400 mt-0.5" />
          <div>
            <span className="font-medium text-white">Non-measurable concept:</span> Evaluated using ingested news evidence and upstream mechanisms.
            {node.proxy_of && (
              <div className="mt-1 text-zinc-400 text-[10px]">
                Measured via proxy: <span className="font-semibold text-zinc-200">{node.proxy_of}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Downstream Ripple Impacts */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase text-zinc-500 tracking-wider">
            Downstream Ripple Impacts ({outgoingEdges.length})
          </span>
        </div>
        <div className="mt-2 space-y-1.5">
          {outgoingEdges.length === 0 ? (
            <div className="text-[11px] text-zinc-600 italic">No downstream transmission edges.</div>
          ) : (
            outgoingEdges.map((e) => {
              const targetId = typeof e.target === 'object' ? (e.target as any).id : e.target;
              return (
                <div
                  key={e.id}
                  onClick={() => onSelectEdge(e.id)}
                  className="group flex cursor-pointer items-center justify-between rounded-xl bg-zinc-900/60 p-2.5 border border-white/5 hover:border-white/20 hover:bg-zinc-800/80 transition-all"
                >
                  <div>
                    <div className="flex items-center gap-1.5 font-medium text-zinc-200 group-hover:text-white transition-colors">
                      <ArrowRight className="h-3 w-3 text-zinc-400" />
                      <span>{targetId}</span>
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-0.5 font-mono">
                      {e.relation} • {(e.confidence * 100).toFixed(0)}% conf
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9.5px] font-medium border ${
                      e.state === 'validated'
                        ? 'bg-white/10 text-white border-white/20'
                        : e.state === 'contradicted'
                        ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                        : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                    }`}
                  >
                    {e.state}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Upstream Drivers */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase text-zinc-500 tracking-wider">
            Upstream Drivers ({incomingEdges.length})
          </span>
        </div>
        <div className="mt-2 space-y-1.5">
          {incomingEdges.length === 0 ? (
            <div className="text-[11px] text-zinc-600 italic">No upstream drivers identified.</div>
          ) : (
            incomingEdges.map((e) => {
              const sourceId = typeof e.source === 'object' ? (e.source as any).id : e.source;
              return (
                <div
                  key={e.id}
                  onClick={() => onSelectEdge(e.id)}
                  className="group flex cursor-pointer items-center justify-between rounded-xl bg-zinc-900/60 p-2.5 border border-white/5 hover:border-white/20 hover:bg-zinc-800/80 transition-all"
                >
                  <div>
                    <div className="flex items-center gap-1.5 font-medium text-zinc-200 group-hover:text-white transition-colors">
                      <ArrowLeft className="h-3 w-3 text-zinc-400" />
                      <span>{sourceId}</span>
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-0.5 font-mono">
                      {e.relation} • {(e.confidence * 100).toFixed(0)}% conf
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9.5px] font-medium border ${
                      e.state === 'validated'
                        ? 'bg-white/10 text-white border-white/20'
                        : e.state === 'contradicted'
                        ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                        : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                    }`}
                  >
                    {e.state}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
