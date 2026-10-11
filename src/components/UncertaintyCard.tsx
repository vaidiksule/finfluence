'use client';

import React from 'react';
import { GraphEdge, GraphNode } from '@/lib/types';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

interface UncertaintyCardProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onSelectNode: (id: string) => void;
  onSelectEdge: (id: string) => void;
}

export default function UncertaintyCard({
  nodes,
  edges,
  onSelectNode,
  onSelectEdge
}: UncertaintyCardProps) {
  const lowSampleEdges = edges.filter(
    (e) => e.state === 'inferred' && e.event_study && (e.event_study.windows['5']?.n || 0) < 5
  );

  const contradictedEdges = edges.filter((e) => e.state === 'contradicted');
  const unmeasurableNodes = nodes.filter((n) => !n.measurable);
  const proxyNodes = nodes.filter((n) => n.proxy_of);

  return (
    <div className="space-y-4 p-4 text-xs font-sans">
      <div>
        <h3 className="text-sm font-semibold text-white tracking-tight">Audit Transparency</h3>
        <p className="mt-0.5 text-[11px] text-zinc-400">
          Radical honesty disclosure: unmeasurable concepts, low samples, and refuted hypotheses.
        </p>
      </div>

      {/* Contradicted Hypotheses */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-3.5">
        <div className="flex items-center gap-1.5 font-semibold text-zinc-200 text-xs">
          <ShieldAlert className="h-4 w-4 text-zinc-400" />
          <span>Contradicted Hypotheses ({contradictedEdges.length})</span>
        </div>
        <p className="mt-1 text-[11px] text-zinc-400 leading-relaxed">
          The LLM suggested these links, but historical 2σ backtesting contradicted them.
        </p>
        <div className="mt-2.5 space-y-1.5">
          {contradictedEdges.length === 0 ? (
            <div className="text-[11px] text-zinc-600 italic">None currently flagged.</div>
          ) : (
            contradictedEdges.map((e) => (
              <div
                key={e.id}
                onClick={() => onSelectEdge(e.id)}
                className="cursor-pointer rounded-xl bg-zinc-950/60 p-2.5 border border-white/5 hover:border-white/20 hover:bg-zinc-800/80 transition-all"
              >
                <div className="font-medium text-zinc-200">
                  {typeof e.source === 'object' ? (e.source as any).id : e.source} →{' '}
                  {typeof e.target === 'object' ? (e.target as any).id : e.target}
                </div>
                <div className="mt-0.5 text-[10px] text-zinc-400">
                  {e.state_reason || 'Hit rate < 40% during past shock windows'}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Non-measurable Concepts */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-3.5">
        <div className="flex items-center gap-1.5 font-semibold text-zinc-200 text-xs">
          <AlertTriangle className="h-4 w-4 text-zinc-400" />
          <span>Non-measurable Concepts ({unmeasurableNodes.length})</span>
        </div>
        <p className="mt-1 text-[11px] text-zinc-400 leading-relaxed">
          Abstract nodes lacking direct price time-series ticker data.
        </p>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {unmeasurableNodes.map((n) => (
            <button
              key={n.id}
              onClick={() => onSelectNode(n.id)}
              className="rounded-lg bg-zinc-800 px-2 py-1 text-[10.5px] font-medium text-zinc-300 border border-white/5 hover:border-white/20 hover:text-white transition-all"
            >
              {n.label}
            </button>
          ))}
        </div>
      </div>

      {/* Proxy Nodes */}
      {proxyNodes.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-3.5">
          <div className="font-semibold text-zinc-200 text-xs">
            Concept Proxies ({proxyNodes.length})
          </div>
          <div className="mt-2 space-y-1 text-[11px]">
            {proxyNodes.map((n) => (
              <div key={n.id} className="text-zinc-400">
                <span className="font-medium text-zinc-200">{n.label}</span> proxied via{' '}
                <span className="font-mono text-zinc-300">{n.proxy_of}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
