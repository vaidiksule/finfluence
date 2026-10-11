'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import { GraphEdge, GraphNode, NodeType, EdgeState } from '@/lib/types';

// Dynamically import ForceGraph3D with ssr: false
const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-950 text-slate-400">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
        <span className="text-sm font-medium tracking-wide">Initializing 3D Shockwave Graph...</span>
      </div>
    </div>
  )
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
}

const NODE_COLORS: Record<NodeType, string> = {
  event: '#f59e0b', // Amber sun
  commodity: '#ea580c', // Bright orange
  indicator: '#06b6d4', // Cyan
  sector: '#8b5cf6', // Violet
  company: '#10b981', // Emerald green
  index: '#3b82f6', // Blue
  currency: '#eab308', // Yellow
  instrument: '#64748b', // Slate
  institution: '#ec4899' // Pink
};

const STATE_COLORS: Record<EdgeState, string> = {
  validated: '#10b981', // Glowing Green
  contradicted: '#ef4444', // Glowing Red
  inferred: '#64748b', // Faint Slate
  stated: '#38bdf8' // Sky blue
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
  showWeakEdges = true
}: Graph3DProps) {
  const fgRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter edges if showWeakEdges is toggled off
  const filteredEdges = useMemo(() => {
    if (showWeakEdges) return edges;
    return edges.filter((e) => e.state === 'validated' || e.state === 'stated');
  }, [edges, showWeakEdges]);

  // Format graph data for 3D force graph
  const graphData = useMemo(() => {
    return {
      nodes: nodes.map((n) => ({ ...n })),
      links: filteredEdges.map((e) => ({
        ...e,
        source: typeof e.source === 'object' ? (e.source as any).id : e.source,
        target: typeof e.target === 'object' ? (e.target as any).id : e.target
      }))
    };
  }, [nodes, filteredEdges]);

  // Camera flight when a node is selected
  useEffect(() => {
    if (selectedNodeId && fgRef.current) {
      const nodeObj = graphData.nodes.find((n) => n.id === selectedNodeId);
      if (nodeObj && typeof nodeObj.x === 'number') {
        const distance = 140;
        const distRatio = 1 + distance / Math.hypot(nodeObj.x, nodeObj.y || 0, nodeObj.z || 0);
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

  // Helper to create text billboard sprite
  const createTextSprite = (text: string, color: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, 256, 64);
      ctx.font = 'bold 22px Inter, sans-serif';
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.fillText(text, 128, 40);
    }
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(30, 8, 1);
    sprite.position.set(0, 10, 0);
    return sprite;
  };

  // Node 3D Object rendering (Sphere + Text Billboard)
  const nodeThreeObject = (node: any) => {
    const isSelected = node.id === selectedNodeId;
    const isPathHighlighted = highlightedPathNodes.includes(node.id);
    const baseColor = NODE_COLORS[node.type as NodeType] || '#94a3b8';

    const group = new THREE.Group();

    // Node Sphere geometry
    const radius = node.type === 'event' ? 8 : isSelected || isPathHighlighted ? 7 : 5;
    const geometry = new THREE.SphereGeometry(radius, 24, 24);

    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(baseColor),
      emissive: new THREE.Color(isSelected || isPathHighlighted ? baseColor : '#000000'),
      emissiveIntensity: isSelected ? 0.6 : isPathHighlighted ? 0.4 : 0.1,
      shininess: 80
    });

    const sphere = new THREE.Mesh(geometry, material);
    group.add(sphere);

    // Text label sprite
    const spriteColor = isSelected ? '#38bdf8' : isPathHighlighted ? '#4ade80' : '#e2e8f0';
    const labelSprite = createTextSprite(node.label || node.id, spriteColor);
    group.add(labelSprite);

    return group;
  };

  if (!mounted) return null;

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-950">
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        backgroundColor="#020617"
        nodeThreeObject={nodeThreeObject}
        nodeLabel={(n: any) =>
          `<div class="rounded bg-slate-900/90 px-2.5 py-1 text-xs text-white shadow-lg border border-slate-700">
            <span class="font-semibold text-cyan-400">${n.label || n.id}</span>
            <div class="text-[10px] text-slate-300 capitalize">${n.type} ${n.ticker ? `(${n.ticker})` : ''}</div>
          </div>`
        }
        onNodeClick={(node: any) => onNodeClick && onNodeClick(node as GraphNode)}
        onLinkClick={(link: any) => onEdgeClick && onEdgeClick(link as GraphEdge)}
        onBackgroundClick={() => onBackgroundClick && onBackgroundClick()}
        // Edge styling
        linkColor={(link: any) => {
          if (highlightedPathEdgeIds.includes(link.id)) return '#38bdf8'; // Sky blue for active path
          if (link.id === selectedEdgeId) return '#facc15'; // Yellow for selected edge
          return STATE_COLORS[link.state as EdgeState] || '#64748b';
        }}
        linkWidth={(link: any) => {
          if (highlightedPathEdgeIds.includes(link.id)) return 3.5;
          if (link.id === selectedEdgeId) return 3.0;
          if (link.state === 'validated') return Math.max(1.5, link.confidence * 3);
          if (link.state === 'contradicted') return 2.2;
          return 0.8;
        }}
        // Directional Ripple Particles
        linkDirectionalParticles={(link: any) => {
          if (highlightedPathEdgeIds.includes(link.id)) return 6;
          if (link.state === 'validated') return Math.max(2, Math.round(link.confidence * 4));
          if (link.state === 'contradicted') return 3;
          return 1;
        }}
        linkDirectionalParticleSpeed={(link: any) => {
          if (link.state === 'contradicted') return 0.003;
          return 0.006;
        }}
        linkDirectionalParticleWidth={(link: any) => {
          if (highlightedPathEdgeIds.includes(link.id)) return 3.0;
          if (link.state === 'validated') return 2.2;
          if (link.state === 'contradicted') return 2.0;
          return 1.0;
        }}
        linkDirectionalParticleColor={(link: any) => {
          if (highlightedPathEdgeIds.includes(link.id)) return '#38bdf8';
          if (link.state === 'validated') return '#4ade80';
          if (link.state === 'contradicted') return '#f87171';
          return '#94a3b8';
        }}
        enableNodeDrag={true}
        showNavInfo={false}
      />
    </div>
  );
}
