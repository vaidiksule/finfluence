'use client';

import React, { useState, useEffect, useCallback } from 'react';
import TopBar from '@/components/TopBar';
import Graph3D from '@/components/Graph3D';
import Legend from '@/components/Legend';
import DetailPanel from '@/components/DetailPanel';
import { GraphEdge, GraphNode, IngestedArticle, MarketType, RipplePath } from '@/lib/types';

export default function Home() {
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isReplay, setIsReplay] = useState(false);
  const [replayScenario, setReplayScenario] = useState('oil_spike_2022');

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

  // Replay Trigger
  const handleTriggerReplay = async (scenario: string) => {
    setIsReplay(true);
    setReplayScenario(scenario);
    try {
      await fetch('/api/replay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario, speed: 2000 })
      });
    } catch (e) {
      console.error('Replay error:', e);
    }
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

  const activePath = selectedPathId ? paths.find((p) => p.path_id === selectedPathId) : null;
  const highlightedPathNodes = activePath ? activePath.nodes : [];
  const highlightedPathEdgeIds = activePath ? activePath.edges.map((e) => e.id) : [];

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-950 text-slate-100">
      {/* Top Bar */}
      <TopBar
        isReplay={isReplay}
        replayScenario={replayScenario}
        selectedMarket={selectedMarket}
        onMarketChange={setSelectedMarket}
        showWeakEdges={showWeakEdges}
        onToggleWeakEdges={setShowWeakEdges}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onTriggerReplay={handleTriggerReplay}
        onRefresh={fetchGraphData}
        stats={stats}
      />

      {/* Main Content Area: 3D Galaxy (68%) + Detail Panel (32%) */}
      <main className="relative flex flex-1 overflow-hidden">
        {/* 3D Force-Directed WebGL Canvas */}
        <div className="relative h-full flex-1">
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
          />
          {/* Floating Visual Legend */}
          <Legend />
        </div>

        {/* Side Detail Panel */}
        <aside className="h-full w-96 shrink-0 lg:w-[420px]">
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
      </main>
    </div>
  );
}
