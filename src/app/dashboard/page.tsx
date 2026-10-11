'use client';

import React, { useState, useEffect, useCallback } from 'react';
import TopBar from '@/components/TopBar';
import Graph3D from '@/components/Graph3D';
import Legend from '@/components/Legend';
import DetailPanel from '@/components/DetailPanel';
import RelatedPanel from '@/components/RelatedPanel';
import ReportView2D from '@/components/ReportView2D';
import { GraphEdge, GraphNode, IngestedArticle, MarketType, RipplePath } from '@/lib/types';
import { Globe, BarChart3 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function DashboardPage() {
  return (
    <React.Suspense fallback={<div className="flex h-screen w-screen items-center justify-center bg-[#0B1115] text-[#A6B3BD]">Loading dashboard...</div>}>
      <DashboardContent />
    </React.Suspense>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [displayMode, setDisplayMode] = useState<'3d' | '2d'>('3d');

  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [paths, setPaths] = useState<RipplePath[]>([]);
  const [articles, setArticles] = useState<IngestedArticle[]>([]);

  // Selection states
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);

  // Filters
  const [selectedMarket, setSelectedMarket] = useState<MarketType | 'All'>('India');
  const [showWeakEdges, setShowWeakEdges] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  // Load graph data from API
  const fetchGraphData = useCallback(async () => {
    try {
      const url = new URL('/api/graph', window.location.origin);
      if (selectedMarket !== 'All') {
        url.searchParams.set('market', selectedMarket);
      }
      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
        setStats(data.stats || null);
      }
    } catch (err) {
      console.error('Failed to load graph snapshot:', err);
    }
  }, [selectedMarket]);

  // Load ranked ripple paths from API
  const fetchPaths = useCallback(async (eventId: string = 'commodity.crude_oil') => {
    try {
      const res = await fetch(`/api/paths?event_id=${eventId}&max_hops=4&top=8`);
      if (res.ok) {
        const data = await res.json();
        setPaths(data.paths || []);
      }
    } catch (err) {
      console.error('Failed to load paths:', err);
    }
  }, []);

  useEffect(() => {
    fetchGraphData();
    fetchPaths('commodity.crude_oil');
  }, [fetchGraphData, fetchPaths]);

  // Connect to real-time Server-Sent Events stream (/api/stream)
  useEffect(() => {
    const eventSource = new EventSource('/api/stream');

    eventSource.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'node_added') {
          setNodes((prev) => {
            if (prev.some((n) => n.id === msg.data.id)) return prev;
            return [...prev, msg.data];
          });
        } else if (msg.type === 'edge_added') {
          setEdges((prev) => {
            if (prev.some((e) => e.id === msg.data.id)) return prev;
            return [...prev, msg.data];
          });
        } else if (msg.type === 'edge_updated') {
          setEdges((prev) =>
            prev.map((e) => (e.id === msg.data.id ? { ...e, ...msg.data } : e))
          );
        } else if (msg.type === 'article_ingested') {
          setArticles((prev) => [msg.data, ...prev.slice(0, 30)]);
        } else if (msg.type === 'paths_updated') {
          if (msg.data.paths) setPaths(msg.data.paths);
        }
      } catch (e) {
        console.error('SSE parse error:', e);
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Handle Search Node matching
  const matchingNodeId = React.useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    const found = nodes.find(
      (n) => n.label.toLowerCase().includes(q) || n.id.toLowerCase().includes(q) || (n.ticker && n.ticker.toLowerCase().includes(q))
    );
    return found ? found.id : null;
  }, [nodes, searchQuery]);

  useEffect(() => {
    if (matchingNodeId) {
      setSelectedNodeId(matchingNodeId);
      setSelectedEdgeId(null);
    }
  }, [matchingNodeId]);

  // Node & Edge selection handlers
  const handleNodeClick = (node: GraphNode) => {
    setSelectedNodeId(node.id);
    setSelectedEdgeId(null);
    setSelectedPathId(null);
  };

  const handleEdgeClick = (edge: GraphEdge) => {
    setSelectedEdgeId(edge.id);
    setSelectedNodeId(null);
    setSelectedPathId(null);
  };

  const handleSelectPath = (path: RipplePath) => {
    setSelectedPathId(path.path_id);
    setSelectedEdgeId(null);
    if (path.nodes.length > 0) {
      setSelectedNodeId(path.nodes[path.nodes.length - 1]); // focus on terminal asset
    }
  };

  const handleClearSelection = () => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    setSelectedPathId(null);
  };

  // Derived selected objects
  const selectedNode = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) || null : null;
  const selectedEdge = selectedEdgeId ? edges.find((e) => e.id === selectedEdgeId) || null : null;
  const incomingEdges = selectedNodeId
    ? edges.filter((e) => (typeof e.target === 'object' ? (e.target as any).id : e.target) === selectedNodeId)
    : [];
  const outgoingEdges = selectedNodeId
    ? edges.filter((e) => (typeof e.source === 'object' ? (e.source as any).id : e.source) === selectedNodeId)
    : [];

  // Compute upstream shock path from origin/root down to the selected node
  const { highlightedPathNodes, highlightedPathEdgeIds } = React.useMemo(() => {
    if (selectedPathId) {
      const p = paths.find((item) => item.path_id === selectedPathId);
      if (p) {
        return {
          highlightedPathNodes: p.nodes,
          highlightedPathEdgeIds: p.edges.map((e) => e.id)
        };
      }
    }

    if (selectedNodeId) {
      // 1. Check if there is an explicit RipplePath containing selectedNodeId
      const matchedPath = paths.find((p) => p.nodes.includes(selectedNodeId));
      if (matchedPath) {
        const idx = matchedPath.nodes.indexOf(selectedNodeId);
        const subNodes = matchedPath.nodes.slice(0, idx + 1);
        const subEdgeIds = matchedPath.edges.slice(0, idx).map((e) => e.id);
        return {
          highlightedPathNodes: subNodes,
          highlightedPathEdgeIds: subEdgeIds
        };
      }

      // 2. Traversal backwards along incoming edges to root shock source
      const pathNodes = new Set<string>([selectedNodeId]);
      const pathEdgeIds = new Set<string>();
      const queue = [selectedNodeId];
      const visited = new Set<string>([selectedNodeId]);

      while (queue.length > 0) {
        const curr = queue.shift()!;
        const inc = edges.filter((e) => {
          const tgt = typeof e.target === 'object' ? (e.target as any).id : e.target;
          return tgt === curr;
        });
        for (const e of inc) {
          const src = typeof e.source === 'object' ? (e.source as any).id : e.source;
          pathEdgeIds.add(e.id);
          pathNodes.add(src);
          if (!visited.has(src)) {
            visited.add(src);
            queue.push(src);
          }
        }
      }

      return {
        highlightedPathNodes: Array.from(pathNodes),
        highlightedPathEdgeIds: Array.from(pathEdgeIds)
      };
    }

    return { highlightedPathNodes: [], highlightedPathEdgeIds: [] };
  }, [selectedNodeId, selectedPathId, paths, edges]);

  // Reset graph view trigger
  const [resetTrigger, setResetTrigger] = useState(0);

  const handleResetGraph = useCallback(() => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    setSelectedPathId(null);
    setResetTrigger((prev) => prev + 1);
  }, []);

  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden bg-[#0B1115] text-[#A6B3BD]">
      {/* Floating Navbar */}
      <TopBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onResetGraph={handleResetGraph}
      />

      {/* Main Content Area */}
      <main className="relative flex flex-1 h-full w-full overflow-hidden">

        {/* LEFT PANEL — Related / Connected Nodes (slides in from left) */}
        {selectedNode && (
          <aside className="absolute left-4 top-20 bottom-24 z-30 w-[300px] max-w-[28vw] overflow-hidden rounded-2xl bg-[#0D1A20]/93 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_24px_80px_rgba(0,0,0,0.85)] backdrop-blur-2xl animate-in fade-in slide-in-from-left-2 duration-200">
            <RelatedPanel
              selectedNode={selectedNode}
              allNodes={nodes}
              allEdges={edges}
              onSelectNode={(id) => {
                setSelectedNodeId(id);
                setSelectedEdgeId(null);
              }}
            />
          </aside>
        )}

        {/* RIGHT PANEL — Node / Edge Inspector Detail (slides in from right) */}
        {(selectedNode || selectedEdge) && (
          <aside className="absolute right-4 top-20 bottom-24 z-30 w-[360px] max-w-[32vw] overflow-hidden rounded-2xl bg-[#0D1A20]/93 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_24px_80px_rgba(0,0,0,0.85)] backdrop-blur-2xl animate-in fade-in slide-in-from-right-2 duration-200">
            <DetailPanel
              selectedNode={selectedNode}
              selectedEdge={selectedEdge}
              incomingEdges={incomingEdges}
              outgoingEdges={outgoingEdges}
              paths={paths}
              selectedPathId={selectedPathId}
              articles={articles}
              nodes={nodes}
              edges={edges}
              onSelectNode={(id) => {
                setSelectedNodeId(id);
                setSelectedEdgeId(null);
              }}
              onSelectEdge={(id) => {
                setSelectedEdgeId(id);
                setSelectedNodeId(null);
              }}
              onSelectPath={handleSelectPath}
              onClearSelection={handleClearSelection}
            />
          </aside>
        )}

        {/* FULL-CANVAS: 3D Galaxy Graph or 2D Report */}
        <div className="relative h-full w-full overflow-hidden">
          {displayMode === '3d' ? (
            <>
              <Graph3D
                nodes={nodes}
                edges={edges}
                selectedNodeId={selectedNodeId}
                selectedEdgeId={selectedEdgeId}
                highlightedPathNodes={highlightedPathNodes}
                highlightedPathEdgeIds={highlightedPathEdgeIds}
                onNodeClick={handleNodeClick}
                onEdgeClick={handleEdgeClick}
                onBackgroundClick={handleClearSelection}
                showWeakEdges={showWeakEdges}
                resetTrigger={resetTrigger}
              />
              <Legend />
            </>
          ) : (
            <ReportView2D
              nodes={nodes}
              edges={edges}
              paths={paths}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
              onSelectEdge={setSelectedEdgeId}
              onSelectPath={handleSelectPath}
            />
          )}

          {/* Floating Bottom-Center View Mode Switcher */}
          <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center rounded-2xl bg-[#0D1A20]/90 p-1 border border-white/[0.06] backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.03)_inset]">
              <button
                onClick={() => setDisplayMode('3d')}
                className={`relative flex items-center gap-2 rounded-xl px-5 py-2 text-[11px] font-semibold transition-all duration-200 ${
                  displayMode === '3d'
                    ? 'bg-[#52B7D8]/15 text-[#52B7D8] shadow-sm'
                    : 'text-[#6B7A85] hover:text-[#A6B3BD]'
                }`}
              >
                <Globe className="h-3.5 w-3.5" />
                <span>3D Graph</span>
                {displayMode === '3d' && <span className="absolute inset-0 rounded-xl ring-1 ring-[#52B7D8]/30" />}
              </button>
              <div className="w-px h-4 bg-white/[0.08] mx-0.5" />
              <button
                onClick={() => setDisplayMode('2d')}
                className={`relative flex items-center gap-2 rounded-xl px-5 py-2 text-[11px] font-semibold transition-all duration-200 ${
                  displayMode === '2d'
                    ? 'bg-[#34D399]/15 text-[#34D399] shadow-sm'
                    : 'text-[#6B7A85] hover:text-[#A6B3BD]'
                }`}
              >
                <BarChart3 className="h-3.5 w-3.5" />
                <span>2D Report</span>
                {displayMode === '2d' && <span className="absolute inset-0 rounded-xl ring-1 ring-[#34D399]/30" />}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
