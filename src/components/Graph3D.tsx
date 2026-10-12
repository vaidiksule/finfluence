'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import { GraphEdge, GraphNode, NodeType, EdgeState } from '@/lib/types';
import GraphLoading from './GraphLoading';

// Dynamically import ForceGraph3D with ssr: false
const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), {
  ssr: false,
  loading: () => <GraphLoading />
});

interface Graph3DProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedNodeId?: string | null;
  selectedEdgeId?: string | null;
  highlightedPathNodes?: string[];
  highlightedPathEdgeIds?: string[];
  onNodeClick?: (node: GraphNode) => void;
  onEdgeClick?: (edge: GraphEdge) => void;
  onBackgroundClick?: () => void;
  showWeakEdges?: boolean;
  onReady?: () => void;
}

// Type colors give the chain a visual grammar without changing the canvas layout.
const NODE_COLORS: Record<NodeType, string> = {
  event: '#f59e0b',
  commodity: '#fb923c',
  indicator: '#38bdf8',
  sector: '#34d399',
  company: '#22d3ee',
  index: '#a78bfa',
  currency: '#fbbf24',
  instrument: '#94a3b8',
  institution: '#f472b6'
};

// Edge Grayscale hierarchy
const STATE_COLORS: Record<EdgeState, string> = {
  proposed: '#64748b',
  validated: '#34d399',
  contradicted: '#f87171',
  inferred: '#64748b',
  stated: '#60a5fa'
};

export default function Graph3D({
  nodes,
  edges,
  selectedNodeId,
  selectedEdgeId,
  highlightedPathNodes = [],
  highlightedPathEdgeIds = [],
  onNodeClick,
  onEdgeClick,
  onBackgroundClick,
  showWeakEdges = true,
  onReady
}: Graph3DProps) {
  const fgRef = useRef<any>(null);
  const readyReportedRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const reportReady = () => {
    if (readyReportedRef.current) return;
    readyReportedRef.current = true;
    onReady?.();
  };

  // Filter edges if showWeakEdges is toggled off
  const filteredEdges = useMemo(() => {
    if (showWeakEdges) return edges;
    return edges.filter((e) => e.state === 'validated' || e.state === 'stated');
  }, [edges, showWeakEdges]);

  // Format graph data for 3D force graph safely ensuring every link connects valid nodes
  const graphData = useMemo(() => {
    const nodeIds = new Set(nodes.map((n) => n.id));
    const validLinks = filteredEdges
      .map((e) => {
        const src = typeof e.source === 'object' ? (e.source as any).id : e.source;
        const tgt = typeof e.target === 'object' ? (e.target as any).id : e.target;
        return {
          ...e,
          source: src,
          target: tgt
        };
      })
      .filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target));

    return {
      nodes: nodes.map((n) => ({ ...n })),
      links: validLinks
    };
  }, [nodes, filteredEdges]);

  useEffect(() => {
    const graph = fgRef.current;
    if (!graph || graphData.nodes.length === 0) return;
    graph.d3Force('charge')?.strength(-260);
    graph.d3Force('link')?.distance(150);
    graph.d3Force('center')?.strength(0.18);
    graph.d3ReheatSimulation();
  }, [graphData.nodes.length]);

  // Camera flight keeps the selected node in context instead of filling the viewport.
  useEffect(() => {
    if (selectedNodeId && fgRef.current) {
      const nodeObj = graphData.nodes.find((n) => n.id === selectedNodeId);
      if (nodeObj && typeof nodeObj.x === 'number') {
        const distance = 420;
        const length = Math.hypot(nodeObj.x, nodeObj.y || 0, nodeObj.z || 0) || 1;
        const distRatio = 1 + distance / length;
        fgRef.current.cameraPosition(
          {
            x: nodeObj.x * distRatio,
            y: (nodeObj.y || 0) * distRatio,
            z: (nodeObj.z || 0) * distRatio
          },
          nodeObj,
          1500
        );
      }
    }
  }, [selectedNodeId, graphData]);

  // Helper to create Apple-style clean text billboard sprite
  const createTextSprite = (text: string, color: string, isSelected: boolean) => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 70;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, 300, 70);
      ctx.font = isSelected
        ? '600 22px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
        : '500 18px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const displayText = text.length > 34 ? `${text.slice(0, 31)}...` : text;
      ctx.fillText(displayText, 150, 35);
    }
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(isSelected ? 25 : 19, isSelected ? 5.5 : 4.8, 1);
    sprite.position.set(0, 10, 0);
    return sprite;
  };

  // Node 3D Object rendering (Sphere + Text Billboard)
  const nodeThreeObject = (node: any) => {
    const isSelected = node.id === selectedNodeId;
    const isPathHighlighted = highlightedPathNodes.includes(node.id);
    const hasActivePath = highlightedPathNodes.length > 0;
    const isDimmed = hasActivePath && !isPathHighlighted && !isSelected;
    const baseColor = NODE_COLORS[node.type as NodeType] || '#a1a1aa';

    const group = new THREE.Group();

    // Node Sphere geometry
    const radius = node.type === 'event' ? 10 : isSelected || isPathHighlighted ? 8.5 : 6.2;
    const geometry = new THREE.SphereGeometry(radius, 32, 32);

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(baseColor),
      emissive: new THREE.Color(baseColor),
      emissiveIntensity: isSelected ? 0.12 : isPathHighlighted ? 0.08 : 0.015,
      roughness: 0.88,
      metalness: 0.04,
      transparent: isDimmed,
      opacity: isDimmed ? 0.16 : 1
    });

    const sphere = new THREE.Mesh(geometry, material);
    group.add(sphere);

    if (isSelected) {
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(baseColor),
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const glow = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.45, 24, 24), glowMaterial);
      group.add(glow);

      const outerGlowMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(baseColor),
        transparent: true,
        opacity: 0.07,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const outerGlow = new THREE.Mesh(new THREE.SphereGeometry(radius * 2.1, 24, 24), outerGlowMaterial);
      group.add(outerGlow);

      group.add(new THREE.PointLight(baseColor, 2.2, 110, 2));
    }

    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 1.12, 24, 24),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(baseColor),
        transparent: true,
        opacity: isDimmed ? 0.01 : isSelected ? 0.12 : isPathHighlighted ? 0.08 : 0.025,
        wireframe: true
      })
    );
    group.add(shell);

    // Subtle outer halo for selected node
    if (isSelected) {
      const haloGeo = new THREE.RingGeometry(radius + 2, radius + 3, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: baseColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      group.add(halo);
    }

    // Text label sprite
    const spriteColor = isDimmed ? 'rgba(148,163,184,0.2)' : isSelected ? '#ffffff' : isPathHighlighted ? baseColor : '#94a3b8';
    const labelSprite = createTextSprite(node.label || node.id, spriteColor, isSelected);
    group.add(labelSprite);

    return group;
  };

  if (!mounted) return <GraphLoading />;

  return (
    <div className="graph-canvas-surface relative h-full w-full overflow-hidden">
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        backgroundColor="rgba(0,0,0,0)"
        nodeThreeObject={nodeThreeObject}
        nodeLabel={(n: any) =>
          `<div class="rounded-lg bg-zinc-900/90 px-3 py-1.5 text-xs text-zinc-100 shadow-2xl border border-white/10 backdrop-blur-xl font-sans">
            <span class="font-semibold text-white">${n.label || n.id}</span>
            <div class="text-[10px] text-zinc-400 capitalize">${n.type} ${n.ticker ? `(${n.ticker})` : ''}</div>
          </div>`
        }
        onNodeClick={(node: any) => onNodeClick && onNodeClick(node as GraphNode)}
        onLinkClick={(link: any) => onEdgeClick && onEdgeClick(link as GraphEdge)}
        onBackgroundClick={() => onBackgroundClick && onBackgroundClick()}
        // Edge styling (monochrome & clean)
        linkColor={(link: any) => {
          if (highlightedPathEdgeIds.includes(link.id)) return '#ffffff';
          if (link.id === selectedEdgeId) return '#ffffff';
          if (highlightedPathEdgeIds.length > 0) return '#111827';
          if (link.state === 'contradicted') return '#52525b';
          return STATE_COLORS[link.state as EdgeState] || '#334155';
        }}
        linkWidth={(link: any) => {
          if (highlightedPathEdgeIds.includes(link.id)) return 2.6;
          if (link.id === selectedEdgeId) return 2.5;
          if (highlightedPathEdgeIds.length > 0) return 0.35;
          if (link.state === 'validated') return Math.max(1.2, link.confidence * 2.2);
          if (link.state === 'contradicted') return 1.4;
          return 0.7;
        }}
        // Directional Grayscale Particles
        linkDirectionalParticles={(link: any) => {
          if (highlightedPathEdgeIds.includes(link.id)) return 5;
          if (highlightedPathEdgeIds.length > 0) return 0;
          if (link.state === 'validated') return Math.max(2, Math.round(link.confidence * 3));
          if (link.state === 'contradicted') return 2;
          return 1;
        }}
        linkDirectionalParticleSpeed={(link: any) => {
          if (link.state === 'contradicted') return 0.003;
          return 0.006;
        }}
        linkDirectionalParticleWidth={(link: any) => {
          if (highlightedPathEdgeIds.includes(link.id)) return 2.5;
          if (highlightedPathEdgeIds.length > 0) return 0;
          if (link.state === 'validated') return 1.8;
          if (link.state === 'contradicted') return 1.4;
          return 1.0;
        }}
        linkDirectionalParticleColor={(link: any) => {
          if (highlightedPathEdgeIds.includes(link.id)) return '#ffffff';
          if (highlightedPathEdgeIds.length > 0) return '#111827';
          if (link.state === 'validated') return '#ffffff';
          if (link.state === 'contradicted') return '#71717a';
          return '#52525b';
        }}
        enableNodeDrag={true}
        showNavInfo={false}
        onEngineTick={reportReady}
      />
    </div>
  );
}
