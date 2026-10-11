'use client';

import React from 'react';
import { GraphEdge, GraphNode } from '@/lib/types';
import { ShieldAlert, AlertTriangle, EyeOff, Layers } from 'lucide-react';

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
    <div className="space-y-4 p-4 text-xs">
      <div>
        <h3 className="text-sm font-bold text-white tracking-tight">Audit Transparency</h3>
        <p className="mt-0.5 text-[11px] text-slate-400">
          Radical honesty disclosure: low samples, refuted hypotheses, and proxies.
        </p>
      </div>

      {/* Contradicted Hypotheses */}
      <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-3">
        <div className="flex items-center gap-1.5 font-bold text-rose-400 text-xs">
          <ShieldAlert className="h-4 w-4" />
          <span>Contradicted Hypotheses ({contradictedEdges.length})</span>
        </div>
        <p className="mt-1 text-[11px] text-rose-200/80">
          The LLM suggested these links, but historical 2σ backtesting contradicted them.
        </p>
        <div className="mt-2 space-y-1.5">
          {contradictedEdges.length === 0 ? (
            <div className="text-[11px] text-slate-500 italic">None currently flagged.</div>
          ) : (
            contradictedEdges.map((e) => (
              <div
                key={e.id}
                onClick={() => onSelectEdge(e.id)}
                className="cursor-pointer rounded-lg bg-rose-950/40 p-2 border border-rose-800/40 hover:bg-rose-900/40 transition-colors"
              >
                <div className="font-semibold text-rose-200">
                  {typeof e.source === 'object' ? (e.source as any).id : e.source} →{' '}
                  {typeof e.target === 'object' ? (e.target as any).id : e.target}
                </div>
                <div className="text-[10px] text-rose-300/80 mt-0.5">{e.state_reason}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Low Sample Edges */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-3">
        <div className="flex items-center gap-1.5 font-bold text-amber-400 text-xs">
          <AlertTriangle className="h-4 w-4" />
          <span>Low-Sample Edges (n &lt; 5)</span>
        </div>
        <p className="mt-1 text-[11px] text-amber-200/80">
          Fewer than 5 historical shock events observed. Cannot be marked validated or contradicted.
        </p>
        <div className="mt-2 space-y-1.5">
          {lowSampleEdges.length === 0 ? (
            <div className="text-[11px] text-slate-500 italic">No low-sample edges in active graph.</div>
          ) : (
            lowSampleEdges.slice(0, 4).map((e) => (
              <div
                key={e.id}
                onClick={() => onSelectEdge(e.id)}
                className="cursor-pointer rounded-lg bg-amber-950/30 p-2 border border-amber-800/30 hover:bg-amber-900/30 transition-colors"
              >
                <div className="font-semibold text-amber-200">
                  {typeof e.source === 'object' ? (e.source as any).id : e.source} →{' '}
                  {typeof e.target === 'object' ? (e.target as any).id : e.target}
                </div>
                <div className="text-[10px] text-amber-300/80 mt-0.5">
                  Only {e.event_study?.windows['5']?.n || 0} historical shocks observed
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Unmeasurable Concepts */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
        <div className="flex items-center gap-1.5 font-bold text-slate-300 text-xs">
          <EyeOff className="h-4 w-4 text-cyan-400" />
          <span>Unmeasurable Concepts ({unmeasurableNodes.length})</span>
        </div>
        <p className="mt-1 text-[11px] text-slate-400">
          Concepts without standalone price quotes (e.g. inflation expectations, input costs).
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {unmeasurableNodes.map((n) => (
            <span
              key={n.id}
              onClick={() => onSelectNode(n.id)}
              className="cursor-pointer rounded bg-slate-800 px-2 py-1 text-[10px] font-medium text-slate-300 hover:bg-slate-700 transition-colors"
            >
              {n.label}
            </span>
          ))}
        </div>
      </div>

      {/* Proxy Series in Use */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
        <div className="flex items-center gap-1.5 font-bold text-slate-300 text-xs">
          <Layers className="h-4 w-4 text-emerald-400" />
          <span>Proxies in Use ({proxyNodes.length})</span>
        </div>
        <div className="mt-2 space-y-1.5 text-[11px]">
          {proxyNodes.map((n) => (
            <div key={n.id} className="rounded bg-slate-800/60 p-1.5 border border-slate-750">
              <span className="font-semibold text-slate-200">{n.label}:</span>{' '}
              <span className="text-slate-400">measured via proxy {n.proxy_of}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
