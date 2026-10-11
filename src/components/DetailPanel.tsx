'use client';

import React, { useState } from 'react';
import { GraphEdge, GraphNode, IngestedArticle, RipplePath } from '@/lib/types';
import NodeDetail from './NodeDetail';
import EdgeDetail from './EdgeDetail';
import PathList from './PathList';
import UncertaintyCard from './UncertaintyCard';
import NewsFeed from './NewsFeed';
import { Compass, Route, ShieldAlert, Newspaper, Sparkles } from 'lucide-react';

interface DetailPanelProps {
  selectedNode: GraphNode | null;
  selectedEdge: GraphEdge | null;
  incomingEdges: GraphEdge[];
  outgoingEdges: GraphEdge[];
  paths: RipplePath[];
  selectedPathId: string | null;
  articles: IngestedArticle[];
  nodes: GraphNode[];
  edges: GraphEdge[];
  onSelectNode: (id: string) => void;
  onSelectEdge: (id: string) => void;
  onSelectPath: (path: RipplePath) => void;
  onClearSelection: () => void;
}

export default function DetailPanel({
  selectedNode,
  selectedEdge,
  incomingEdges,
  outgoingEdges,
  paths,
  selectedPathId,
  articles,
  nodes,
  edges,
  onSelectNode,
  onSelectEdge,
  onSelectPath,
  onClearSelection
}: DetailPanelProps) {
  const [activeTab, setActiveTab] = useState<'inspect' | 'paths' | 'uncertainty' | 'news'>('inspect');

  // Auto-switch to inspect tab if a node or edge is selected
  React.useEffect(() => {
    if (selectedNode || selectedEdge) {
      setActiveTab('inspect');
    }
  }, [selectedNode, selectedEdge]);

  return (
    <div className="flex h-full w-full flex-col border-l border-slate-800/80 bg-slate-950/95 backdrop-blur-md">
      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-900/60 p-1 text-xs">
        <button
          onClick={() => setActiveTab('inspect')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 font-medium transition-colors ${
            activeTab === 'inspect'
              ? 'bg-slate-800 text-cyan-400 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="h-3.5 w-3.5" />
          <span>Inspect</span>
        </button>
        <button
          onClick={() => setActiveTab('paths')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 font-medium transition-colors ${
            activeTab === 'paths'
              ? 'bg-slate-800 text-cyan-400 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Route className="h-3.5 w-3.5" />
          <span>Paths ({paths.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('uncertainty')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 font-medium transition-colors ${
            activeTab === 'uncertainty'
              ? 'bg-slate-800 text-cyan-400 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>Audit</span>
        </button>
        <button
          onClick={() => setActiveTab('news')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 font-medium transition-colors ${
            activeTab === 'news'
              ? 'bg-slate-800 text-cyan-400 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Newspaper className="h-3.5 w-3.5" />
          <span>News</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'inspect' && (
          <>
            {selectedNode ? (
              <NodeDetail
                node={selectedNode}
                incomingEdges={incomingEdges}
                outgoingEdges={outgoingEdges}
                onSelectNode={onSelectNode}
                onSelectEdge={onSelectEdge}
                onClose={onClearSelection}
              />
            ) : selectedEdge ? (
              <EdgeDetail edge={selectedEdge} onClose={onClearSelection} />
            ) : (
              <div className="flex h-full flex-col p-5 text-xs text-slate-300">
                <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-4">
                  <div className="flex items-center gap-2 font-bold text-cyan-400 text-sm">
                    <Sparkles className="h-4 w-4" />
                    <span>How to read Finfluence</span>
                  </div>
                  <p className="mt-2 text-slate-300 text-[11px] leading-relaxed">
                    Finfluence is an autonomous market shockwave graph. The LLM extracts entities and proposes transmission hypotheses; historical 2σ market returns judge them.
                  </p>
                  <ul className="mt-3 space-y-1.5 text-[11px] text-slate-400">
                    <li className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <strong className="text-slate-200">Green links:</strong> Empirically validated across 5+ past events.
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                      <strong className="text-slate-200">Red links:</strong> Empirical data disagrees (kept visible!).
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                      <strong className="text-slate-200">Grey links:</strong> Inferred (low sample or unmeasurable).
                    </li>
                  </ul>
                </div>

                <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-center">
                  <Compass className="h-8 w-8 mx-auto text-slate-600 mb-2" />
                  <span className="font-medium text-slate-300 block">Select a Node or Edge in 3D Space</span>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Click any sphere to inspect its connectivity, or click an edge to inspect the event-study backtest.
                  </span>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'paths' && (
          <PathList
            paths={paths}
            selectedPathId={selectedPathId}
            onSelectPath={onSelectPath}
          />
        )}

        {activeTab === 'uncertainty' && (
          <UncertaintyCard
            nodes={nodes}
            edges={edges}
            onSelectNode={onSelectNode}
            onSelectEdge={onSelectEdge}
          />
        )}

        {activeTab === 'news' && (
          <NewsFeed articles={articles} />
        )}
      </div>
    </div>
  );
}
