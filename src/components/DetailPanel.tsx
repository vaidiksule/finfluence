'use client';

import React, { useState } from 'react';
import { GraphEdge, GraphNode, IngestedArticle, RipplePath } from '@/lib/types';
import NodeDetail from './NodeDetail';
import EdgeDetail from './EdgeDetail';
import PathList from './PathList';
import UncertaintyCard from './UncertaintyCard';
import NewsFeed from './NewsFeed';
import MarketBrief from './MarketBrief';
import Watchlist from './Watchlist';
import { BookmarkCheck, Compass, Route, ShieldAlert, Newspaper } from 'lucide-react';

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
  activeScenario?: 'oil_spike_2022' | 'rate_hike_cycle';
  onRefreshMarketData?: () => void;
  isRefreshingMarketData?: boolean;
  onRunAnalysis?: () => void;
  isRunningAnalysis?: boolean;
  analysisStatus?: string | null;
  onSubmitArticle?: (article: { title: string; summary: string; source: string; url: string }) => Promise<void>;
  isSubmittingArticle?: boolean;
  submitArticleStatus?: string | null;
  onSubmitResearch?: (input: string) => Promise<void>;
  isResearching?: boolean;
  researchStatus?: string | null;
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
  onClearSelection,
  activeScenario = 'oil_spike_2022',
  onRefreshMarketData,
  isRefreshingMarketData = false,
  onRunAnalysis,
  isRunningAnalysis = false,
  analysisStatus,
  onSubmitArticle,
  isSubmittingArticle = false,
  submitArticleStatus,
  onSubmitResearch,
  isResearching = false,
  researchStatus
}: DetailPanelProps) {
  const [activeTab, setActiveTab] = useState<'inspect' | 'paths' | 'uncertainty' | 'news' | 'watchlist'>('inspect');

  // Auto-switch to inspect tab if a node or edge is selected
  React.useEffect(() => {
    if (selectedNode || selectedEdge) {
      setActiveTab('inspect');
    }
  }, [selectedNode, selectedEdge]);

  return (
    <div className="flex h-full w-full flex-col border-l border-white/[0.08] bg-[#0c0c0e]/90 backdrop-blur-2xl">
      {/* Apple-style Tab Bar */}
      <div className="flex border-b border-white/[0.08] bg-zinc-950/40 p-1.5 text-xs">
        <button
          onClick={() => setActiveTab('inspect')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 font-medium transition-all ${
            activeTab === 'inspect'
              ? 'bg-zinc-800 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Compass className="h-3.5 w-3.5" />
          <span>Inspect</span>
        </button>
        <button
          onClick={() => setActiveTab('paths')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 font-medium transition-all ${
            activeTab === 'paths'
              ? 'bg-zinc-800 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Route className="h-3.5 w-3.5" />
          <span>Paths ({paths.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('uncertainty')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 font-medium transition-all ${
            activeTab === 'uncertainty'
              ? 'bg-zinc-800 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>Audit</span>
        </button>
        <button
          onClick={() => setActiveTab('news')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 font-medium transition-all ${
            activeTab === 'news'
              ? 'bg-zinc-800 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Newspaper className="h-3.5 w-3.5" />
          <span>News</span>
        </button>
        <button
          onClick={() => setActiveTab('watchlist')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 font-medium transition-all ${activeTab === 'watchlist' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          <BookmarkCheck className="h-3.5 w-3.5" />
          <span>Watch</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'inspect' && (
          <div className="h-full">
            {selectedNode ? (
              <NodeDetail
                node={selectedNode}
                incomingEdges={incomingEdges}
                outgoingEdges={outgoingEdges}
                articles={articles}
                nodes={nodes}
                onSelectNode={onSelectNode}
                onSelectEdge={onSelectEdge}
                onClose={onClearSelection}
              />
            ) : selectedEdge ? (
              <EdgeDetail edge={selectedEdge} nodes={nodes} onClose={onClearSelection} />
            ) : (
              <MarketBrief
                scenario={activeScenario}
                onExplorePaths={() => setActiveTab('paths')}
                onRefreshMarketData={onRefreshMarketData}
                isRefreshingMarketData={isRefreshingMarketData}
                onRunAnalysis={onRunAnalysis}
                isRunningAnalysis={isRunningAnalysis}
                analysisStatus={analysisStatus}
              />
            )}
          </div>
        )}

        {activeTab === 'paths' && (
          <PathList
            paths={paths}
            nodes={nodes}
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
          <NewsFeed
            articles={articles}
            onSubmitArticle={onSubmitArticle}
            isSubmitting={isSubmittingArticle}
            submitStatus={submitArticleStatus}
            onSubmitResearch={onSubmitResearch}
            isResearching={isResearching}
            researchStatus={researchStatus}
            onSelectArticle={(art) => {
              if (art.extracted_entities && art.extracted_entities.length > 0) {
                onSelectNode(art.extracted_entities[0]);
              }
            }}
          />
        )}

        {activeTab === 'watchlist' && (
          <Watchlist nodes={nodes} edges={edges} onSelectNode={onSelectNode} />
        )}
      </div>
    </div>
  );
}
