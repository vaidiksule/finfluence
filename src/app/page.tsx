'use client';

import React, { useState, useEffect, useCallback } from 'react';

// Minimal Landing Page Components
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import MinimalImpactGraph from '@/components/landing/MinimalImpactGraph';
import MinimalCapabilities from '@/components/landing/MinimalCapabilities';
import MinimalCta from '@/components/landing/MinimalCta';
import MinimalFooter from '@/components/landing/MinimalFooter';

// Prototype Dashboard Components (Preserved)
import Graph3D from '@/components/Graph3D';
import Legend from '@/components/Legend';
import DetailPanel from '@/components/DetailPanel';
import TopBar from '@/components/TopBar';

import { GraphEdge, GraphNode, IngestedArticle, MarketType, RipplePath } from '@/lib/types';

export default function Home() {
  // Navigation View State: 'landing' (Default Premium Landing Page) | 'graph' (Deep 3D Galaxy)
  const [currentView, setCurrentView] = useState<'landing' | 'graph'>('landing');

  // Deep Graph State (from prototype)
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [paths, setPaths] = useState<RipplePath[]>([]);
  const [articles, setArticles] = useState<IngestedArticle[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<MarketType | 'All'>('India');
  const [showWeakEdges, setShowWeakEdges] = useState(true);
  const [graphSearchQuery, setGraphSearchQuery] = useState('');
  const [isReplay, setIsReplay] = useState(false);
  const [replayScenario, setReplayScenario] = useState('oil_spike_2022');

  // Load Graph Data for Deep Explorer view
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
    if (currentView === 'graph') {
      fetchGraphData();
      fetchPaths('commodity.crude_oil');
    }
  }, [currentView, fetchGraphData, fetchPaths]);

  // Connect to SSE stream when in Deep Graph view
  useEffect(() => {
    if (currentView !== 'graph') return;
    const eventSource = new EventSource('/api/stream');

    eventSource.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'node_added') {
          setNodes((prev) => (prev.some((n) => n.id === msg.data.id) ? prev : [...prev, msg.data]));
        } else if (msg.type === 'edge_added') {
          setEdges((prev) => (prev.some((e) => e.id === msg.data.id) ? prev : [...prev, msg.data]));
        } else if (msg.type === 'edge_updated') {
          setEdges((prev) => prev.map((e) => (e.id === msg.data.id ? { ...e, ...msg.data } : e)));
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
  }, [currentView]);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#080C15] text-[#F8FAFC]">
      {/* 1. TOP NAVBAR (MATCHING REFERENCE DRIBBLE SHOT) */}
      {currentView === 'landing' ? (
        <Navbar
          onExploreGraph={() => setCurrentView('graph')}
          onLaunchPlatform={() => setCurrentView('graph')}
        />
      ) : null}

      {/* VIEW 1: MINIMAL DRIBBLE-STYLE LANDING PAGE */}
      {currentView === 'landing' && (
        <main className="relative flex flex-1 flex-col">
          {/* Hero Section with Wireframe Network Globe */}
          <HeroSection
            onExploreGraph={() => setCurrentView('graph')}
          />

          {/* Clean Interactive Causal Impact Preview */}
          <MinimalImpactGraph
            onExploreFullPlatform={() => setCurrentView('graph')}
          />

          {/* 3 Core Architecture Cards */}
          <MinimalCapabilities />

          {/* Final Clean Call to Action */}
          <MinimalCta
            onExploreGraph={() => setCurrentView('graph')}
          />

          {/* Minimal Single-Line Footer */}
          <MinimalFooter />
        </main>
      )}

      {/* ========================================================= */}
      {/* VIEW 2: 3D DEEP SHOCKWAVE GALAXY EXPLORER (PROTOTYPE)   */}
      {/* ========================================================= */}
      {currentView === 'graph' && (
        <main className="relative flex flex-1 flex-col overflow-hidden h-screen">
          <TopBar
            isReplay={isReplay}
            replayScenario={replayScenario}
            selectedMarket={selectedMarket}
            onMarketChange={setSelectedMarket}
            showWeakEdges={showWeakEdges}
            onToggleWeakEdges={setShowWeakEdges}
            searchQuery={graphSearchQuery}
            onSearchChange={setGraphSearchQuery}
            onTriggerReplay={async (scenario) => {
              setIsReplay(true);
              setReplayScenario(scenario);
              try {
                await fetch('/api/replay', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ scenario, speed: 2000 }),
                });
              } catch (e) {
                console.error(e);
              }
            }}
            onRefresh={fetchGraphData}
            onReturnToLanding={() => setCurrentView('landing')}
            stats={stats}
          />

          <div className="relative flex flex-1 overflow-hidden">
            <div className="relative h-full flex-1">
              <Graph3D
                nodes={nodes}
                edges={edges}
                selectedNodeId={selectedNodeId}
                selectedEdgeId={selectedEdgeId}
                highlightedPathNodes={[]}
                highlightedPathEdgeIds={[]}
                onNodeClick={(node) => {
                  setSelectedNodeId(node.id);
                  setSelectedEdgeId(null);
                  setSelectedPathId(null);
                }}
                onEdgeClick={(edge) => {
                  setSelectedEdgeId(edge.id);
                  setSelectedNodeId(null);
                  setSelectedPathId(null);
                }}
                onBackgroundClick={() => {
                  setSelectedNodeId(null);
                  setSelectedEdgeId(null);
                  setSelectedPathId(null);
                }}
                showWeakEdges={showWeakEdges}
              />
              <Legend />
            </div>

            <aside className="h-full w-96 shrink-0 lg:w-[420px]">
              <DetailPanel
                selectedNode={nodes.find((n) => n.id === selectedNodeId) || null}
                selectedEdge={edges.find((e) => e.id === selectedEdgeId) || null}
                incomingEdges={
                  selectedNodeId
                    ? edges.filter(
                        (e) =>
                          (typeof e.target === 'object' ? (e.target as any).id : e.target) ===
                          selectedNodeId
                      )
                    : []
                }
                outgoingEdges={
                  selectedNodeId
                    ? edges.filter(
                        (e) =>
                          (typeof e.source === 'object' ? (e.source as any).id : e.source) ===
                          selectedNodeId
                      )
                    : []
                }
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
                onSelectPath={(path) => {
                  setSelectedPathId(path.path_id);
                  setSelectedEdgeId(null);
                  if (path.nodes.length > 0) {
                    setSelectedNodeId(path.nodes[path.nodes.length - 1]);
                  }
                }}
                onClearSelection={() => {
                  setSelectedNodeId(null);
                  setSelectedEdgeId(null);
                  setSelectedPathId(null);
                }}
              />
            </aside>
          </div>
        </main>
      )}
    </div>
  );
}
