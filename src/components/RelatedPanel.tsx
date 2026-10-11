'use client';

import React from 'react';
import { ArrowDown, ArrowUp, Network } from 'lucide-react';
import { GraphEdge, GraphNode } from '@/lib/types';

interface RelatedPanelProps {
  selectedNode: GraphNode;
  allNodes: GraphNode[];
  allEdges: GraphEdge[];
  onSelectNode: (id: string) => void;
}

export default function RelatedPanel({ selectedNode, allNodes, allEdges, onSelectNode }: RelatedPanelProps) {
  const labelFor = (id: string) => allNodes.find((node) => node.id === id)?.label || id;
  const incoming = allEdges.filter((edge) => edge.target === selectedNode.id).slice(0, 5);
  const outgoing = allEdges.filter((edge) => edge.source === selectedNode.id).slice(0, 5);
  const links = [...incoming.map((edge) => ({ edge, direction: 'up' as const, id: edge.source })), ...outgoing.map((edge) => ({ edge, direction: 'down' as const, id: edge.target }))];

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4 text-xs text-zinc-300">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <Network className="h-4 w-4 text-cyan-300" />
        <div>
          <p className="font-semibold text-white">Connected entities</p>
          <p className="mt-0.5 text-[10px] text-zinc-500">Direct pathways around {selectedNode.label}</p>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        {links.length === 0 ? <p className="text-[11px] text-zinc-500">No direct relationships are mapped yet.</p> : links.map(({ edge, direction, id }) => (
          <button key={edge.id} type="button" onClick={() => onSelectNode(id)} className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left hover:border-cyan-300/30 hover:bg-white/[0.06]">
            <div className="flex items-center gap-2 text-[11px] font-medium text-white">
              {direction === 'up' ? <ArrowUp className="h-3 w-3 text-cyan-300" /> : <ArrowDown className="h-3 w-3 text-amber-200" />}
              <span className="truncate">{labelFor(id)}</span>
            </div>
            <p className="mt-1 text-[10px] text-zinc-500">{edge.relation} · {edge.state}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
