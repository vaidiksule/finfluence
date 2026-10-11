'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import { GraphEdge, GraphNode, NodeType, EdgeState } from '@/lib/types';

// Dynamically import ForceGraph3D with ssr: false
const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-black text-zinc-500 font-sans">
      <div className="flex flex-col items-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border border-zinc-400 border-t-transparent" />
        <span className="text-xs font-medium tracking-wide text-zinc-400">Loading 3D Market Graph...</span>
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

// Apple-inspired Grayscale / Monochrome Metallic Palette for Nodes
const NODE_COLORS: Record<NodeType, string> = {
  event: '#ffffff',       // Pure white core (epicenter)
  commodity: '#e4e4e7',   // Bright zinc/silver
  indicator: '#d4d4d8',   // Light zinc
  sector: '#a1a1aa',      // Neutral gray
  company: '#f4f4f5',     // Pearl white
  index: '#ffffff',       // White
  currency: '#e4e4e7',    // Silver
  instrument: '#71717a',  // Mid slate gray
  institution: '#a1a1aa'  // Subtle gray
};

// Edge Grayscale hierarchy
const STATE_COLORS: Record<EdgeState, string> = {
  validated: '#ffffff',    // Solid luminous white
  contradicted: '#71717a', // Muted metallic gray with dashed or low-dim
  inferred: '#3f3f46',     // Subtle dark zinc
  stated: '#a1a1aa'        // Clean silver-gray
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

  // Camera flight smoothly when a node is selected
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

  // Helper to create Apple-style clean text billboard sprite
  const createTextSprite = (text: string, color: string, isSelected: boolean) => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 70;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, 300, 70);
      ctx.font = isSelected
        ? '600 24px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
        : '500 21px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 150, 35);
    }
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(32, 7.5, 1);
    sprite.position.set(0, 10, 0);
    return sprite;
  };

  // Node 3D Object rendering (Sphere + Text Billboard)
  const nodeThreeObject = (node: any) => {
    const isSelected = node.id === selectedNodeId;
    const isPathHighlighted = highlightedPathNodes.includes(node.id);
    const baseColor = NODE_COLORS[node.type as NodeType] || '#a1a1aa';

    const group = new THREE.Group();

    // Node Sphere geometry
    const radius = node.type === 'event' ? 7.5 : isSelected || isPathHighlighted ? 6.5 : 4.5;
    const geometry = new THREE.SphereGeometry(radius, 32, 32);

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(isSelected ? '#ffffff' : baseColor),
      emissive: new THREE.Color(isSelected ? '#ffffff' : isPathHighlighted ? '#d4d4d8' : '#18181b'),
      emissiveIntensity: isSelected ? 0.8 : isPathHighlighted ? 0.5 : 0.15,
      roughness: 0.25,
      metalness: 0.85
    });

    const sphere = new THREE.Mesh(geometry, material);
    group.add(sphere);

    // Subtle outer halo for selected node
    if (isSelected) {
      const haloGeo = new THREE.RingGeometry(radius + 2, radius + 3, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      group.add(halo);
    }

    // Text label sprite
    const spriteColor = isSelected ? '#ffffff' : isPathHighlighted ? '#f4f4f5' : '#a1a1aa';
    const labelSprite = createTextSprite(node.label || node.id, spriteColor, isSelected);
    group.add(labelSprite);

    return group;
  };

  if (!mounted) return null;

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        backgroundColor="#050507"
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
          if (link.state === 'contradicted') return '#52525b';
          if (link.state === 'validated') return '#e4e4e7';
          return '#3f3f46';
        }}
        linkWidth={(link: any) => {
          if (highlightedPathEdgeIds.includes(link.id)) return 2.6;
          if (link.id === selectedEdgeId) return 2.5;
          if (link.state === 'validated') return Math.max(1.2, link.confidence * 2.2);
          if (link.state === 'contradicted') return 1.4;
          return 0.7;
        }}
        // Directional Grayscale Particles
        linkDirectionalParticles={(link: any) => {
          if (highlightedPathEdgeIds.includes(link.id)) return 5;
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
          if (link.state === 'validated') return 1.8;
          if (link.state === 'contradicted') return 1.4;
          return 1.0;
        }}
        linkDirectionalParticleColor={(link: any) => {
          if (highlightedPathEdgeIds.includes(link.id)) return '#ffffff';
          if (link.state === 'validated') return '#ffffff';
          if (link.state === 'contradicted') return '#71717a';
          return '#52525b';
        }}
        enableNodeDrag={true}
        showNavInfo={false}
      />
    </div>
  );
}
