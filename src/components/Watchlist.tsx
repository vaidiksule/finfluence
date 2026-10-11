'use client';

import React from 'react';
import { BookmarkCheck, Plus, X } from 'lucide-react';
import { GraphEdge, GraphNode } from '@/lib/types';

const storageKey = 'finfluence.watchlist.v1';

interface WatchlistProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onSelectNode: (id: string) => void;
}

function nodeId(value: GraphEdge['source'] | GraphEdge['target']): string {
  return typeof value === 'string' ? value : value.id;
}

export default function Watchlist({ nodes, edges, onSelectNode }: WatchlistProps) {
  const candidates = nodes.filter((node) => node.type === 'company' || node.type === 'index');
  const [watchlist, setWatchlist] = React.useState<string[]>([]);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved: unknown = JSON.parse(window.localStorage.getItem(storageKey) || '[]');
        if (Array.isArray(saved) && saved.every((id) => typeof id === 'string')) {
          setWatchlist(saved);
        }
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const toggle = (id: string) => {
    setWatchlist((current) => {
      const next = current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id];
      window.localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  };

  const selectedNodes = watchlist
    .map((id) => nodes.find((node) => node.id === id))
    .filter((node): node is GraphNode => node !== undefined);

  return (
    <div className="space-y-4 p-4 text-xs font-sans">
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <BookmarkCheck className="h-4 w-4 text-zinc-300" />
          Your watchlist
        </div>
        <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">
          Saved in this browser. Use it to inspect which mapped research pathways reach companies and indices you follow.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Add holdings to investigate</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {candidates.map((node) => {
            const selected = watchlist.includes(node.id);
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => toggle(node.id)}
                className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-[10.5px] transition-colors ${selected ? 'border-white/25 bg-zinc-100 text-black' : 'border-white/10 bg-zinc-950/50 text-zinc-300 hover:border-white/25 hover:text-white'}`}
              >
                {selected ? <X className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                {node.label}
              </button>
            );
          })}
        </div>
      </div>

      {selectedNodes.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Exposure pathways</p>
          {selectedNodes.map((node) => {
            const drivers = edges.filter((edge) => nodeId(edge.target) === node.id).slice(0, 3);
            return (
              <button key={node.id} type="button" onClick={() => onSelectNode(node.id)} className="w-full rounded-xl border border-white/10 bg-zinc-900/60 p-3 text-left transition-colors hover:border-white/25 hover:bg-zinc-800/80">
                <p className="font-medium text-zinc-100">{node.label}</p>
                <p className="mt-1 text-[10.5px] leading-relaxed text-zinc-400">
                  {drivers.length > 0
                    ? `${drivers.length} mapped upstream driver${drivers.length === 1 ? '' : 's'}: ${drivers.map((edge) => nodeId(edge.source)).join(', ')}`
                    : 'No mapped upstream driver in the current graph.'}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
