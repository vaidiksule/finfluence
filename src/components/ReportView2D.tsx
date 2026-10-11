'use client';

import React from 'react';
import { BarChart3, ShieldCheck } from 'lucide-react';
import { GraphEdge, GraphNode, RipplePath } from '@/lib/types';

interface ReportView2DProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  paths: RipplePath[];
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  onSelectEdge: (id: string) => void;
  onSelectPath: (path: RipplePath) => void;
}

export default function ReportView2D({ nodes, edges, paths, selectedNodeId, onSelectNode, onSelectEdge, onSelectPath }: ReportView2DProps) {
  const labelFor = (id: string) => nodes.find((node) => node.id === id)?.label || id;
  const rankedEdges = [...edges].sort((left, right) => right.confidence - left.confidence).slice(0, 12);

  return (
    <div className="h-full overflow-y-auto bg-[#080d10] p-6 text-zinc-200">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-start justify-between border-b border-white/10 pb-5">
          <div>
            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300"><BarChart3 className="h-3.5 w-3.5" /> Research report</p>
            <h1 className="mt-2 text-2xl font-semibold text-white">Evidence-ranked market pathways</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">A compact view of the strongest mapped relationships. Select an entity or pathway to inspect its mechanism and evidence.</p>
          </div>
          <div className="text-right text-[10px] text-zinc-500"><div>{nodes.length} entities</div><div>{edges.length} relationships</div></div>
        </div>
        <section className="mt-6">
          <h2 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Strongest relationships</h2>
          <div className="mt-2 overflow-hidden rounded-2xl border border-white/10">
            {rankedEdges.map((edge) => {
              const source = edge.source;
              const target = edge.target;
              return <button key={edge.id} type="button" onClick={() => onSelectEdge(edge.id)} className="grid w-full grid-cols-[1fr_auto_1fr_auto] items-center gap-3 border-b border-white/5 bg-white/[0.02] p-3 text-left last:border-0 hover:bg-white/[0.06]"><span onClick={(event) => { event.stopPropagation(); onSelectNode(source); }} className={`truncate text-xs ${selectedNodeId === source ? 'text-cyan-200' : 'text-zinc-200'}`}>{labelFor(source)}</span><span className="text-[10px] text-zinc-600">{edge.relation}</span><span onClick={(event) => { event.stopPropagation(); onSelectNode(target); }} className={`truncate text-xs ${selectedNodeId === target ? 'text-cyan-200' : 'text-zinc-200'}`}>{labelFor(target)}</span><span className="flex items-center gap-1 text-[10px] text-zinc-500"><ShieldCheck className="h-3 w-3" /> {Math.round(edge.confidence * 100)}%</span></button>;
            })}
          </div>
        </section>
        <section className="mt-6">
          <h2 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Ranked pathways</h2>
          <div className="mt-2 grid gap-2 md:grid-cols-2">{paths.slice(0, 8).map((path) => <button key={path.path_id} type="button" onClick={() => onSelectPath(path)} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-left hover:border-cyan-300/25"><div className="flex justify-between text-[10px] text-zinc-500"><span>{path.hop_count} hops</span><span>{Math.round(path.total_confidence * 100)}% path confidence</span></div><p className="mt-2 text-xs leading-relaxed text-zinc-200">{path.nodes.map(labelFor).join(' → ')}</p></button>)}</div>
        </section>
      </div>
    </div>
  );
}
