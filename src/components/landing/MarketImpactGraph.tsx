'use client';

import React, { useState, useMemo } from 'react';
import {
  Network,
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Info,
  ShieldCheck,
  Filter,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Eye,
  Activity,
  Layers,
  X,
} from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  ticker?: string;
  category: 'commodity' | 'macro' | 'currency' | 'sector' | 'equity' | 'index';
  x: number; // percentage in canvas 0-100
  y: number; // percentage in canvas 0-100
  impact: string;
  change: string;
  positive: boolean;
  measurable: boolean;
  proxyNotice?: string;
  description: string;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  type: 'observed' | 'inferred';
  confidence: number;
  verdict: 'VALIDATED' | 'INFERRED' | 'CONTRADICTED';
  rationale: string;
  evidenceSource: string;
  carMetric?: string;
}

const NODES: GraphNode[] = [
  {
    id: 'crude_oil',
    label: 'Crude Oil',
    ticker: 'BRENT / WTI',
    category: 'commodity',
    x: 10,
    y: 50,
    impact: 'Origin Shock',
    change: '+12.4%',
    positive: true,
    measurable: true,
    description: 'Benchmark Brent crude futures surge on supply chokepoints and geopolitical escalation in the Middle East.',
  },
  {
    id: 'energy_costs',
    label: 'Energy Costs',
    ticker: 'FEEDSTOCK_IDX',
    category: 'macro',
    x: 28,
    y: 28,
    impact: 'Industrial Input',
    change: '+9.8%',
    positive: false,
    measurable: false,
    proxyNotice: 'Measured via industrial fuel indices & crack spreads',
    description: 'Refined fuel, jet fuel, and petrochemical raw material input costs escalate directly from crude spot prices.',
  },
  {
    id: 'import_bill',
    label: "India's Import Bill",
    ticker: 'TRADE_DEFICIT',
    category: 'macro',
    x: 28,
    y: 72,
    impact: 'Current Account',
    change: '+15.2%',
    positive: false,
    measurable: false,
    proxyNotice: 'Measured via monthly trade deficit and customs disclosures',
    description: 'High oil import dependency forces sovereign dollar outflows, expanding trade deficit gap.',
  },
  {
    id: 'inflation_expectations',
    label: 'Inflation Expectations',
    ticker: 'CPI_5Y_BE',
    category: 'macro',
    x: 48,
    y: 20,
    impact: 'Macro Indicator',
    change: '+28 bps',
    positive: false,
    measurable: false,
    proxyNotice: 'Measured via 5Y breakeven inflation swaps',
    description: 'Elevated transport and logistics input costs spill into core CPI goods, shifting consumer price expectations upward.',
  },
  {
    id: 'usd_inr',
    label: 'USD / INR',
    ticker: 'USDINR=X',
    category: 'currency',
    x: 48,
    y: 78,
    impact: 'Currency Transmission',
    change: '+0.85%',
    positive: true,
    measurable: true,
    description: 'Import dollar demand exerts depreciating pressure on the domestic rupee relative to the US dollar.',
  },
  {
    id: 'interest_rate_outlook',
    label: 'Interest-Rate Outlook',
    ticker: 'SOVEREIGN_10Y',
    category: 'macro',
    x: 68,
    y: 20,
    impact: 'Yield Curve',
    change: '+35 bps',
    positive: false,
    measurable: true,
    proxyNotice: 'Measured via 10Y Benchmark Sovereign Yield (^TNX proxy)',
    description: 'Monetary policy authorities signal delay in planned rate cuts to combat persistent fuel-driven price pressures.',
  },
  {
    id: 'banking_sector',
    label: 'Banking Sector',
    ticker: 'NIFTY_BANK',
    category: 'sector',
    x: 88,
    y: 12,
    impact: 'Credit Cost & MTM',
    change: '-2.4%',
    positive: false,
    measurable: true,
    description: 'Higher sovereign yields cause bond treasury mark-to-market losses and dampen retail loan originations.',
  },
  {
    id: 'real_estate',
    label: 'Real Estate',
    ticker: 'REIT_IDX',
    category: 'sector',
    x: 88,
    y: 32,
    impact: 'Cap Rate Pressure',
    change: '-3.8%',
    positive: false,
    measurable: true,
    description: 'Mortgage borrowing costs climb as long-term bond yields spike, cooling residential presales velocity.',
  },
  {
    id: 'import_dependent',
    label: 'Import-Dependent Industries',
    ticker: 'INDIGO / ASIANPNT',
    category: 'sector',
    x: 88,
    y: 60,
    impact: 'Aviation & Paints',
    change: '-4.8%',
    positive: false,
    measurable: true,
    description: 'Jet fuel comprises 40% of airline costs; monomers and solvents squeeze paint and specialty chemical operating margins.',
  },
  {
    id: 'it_exporters',
    label: 'Indian IT Exporters',
    ticker: 'TCS / INFY',
    category: 'equity',
    x: 88,
    y: 84,
    impact: 'FX Beneficiary',
    change: '+2.1%',
    positive: true,
    measurable: true,
    description: 'IT consulting heavyweights derive 60%+ of earnings in USD, gaining an immediate rupee-translation operating margin tailwind.',
  },
];

const EDGES: GraphEdge[] = [
  // Pathway 1: Crude Oil -> Energy Costs -> Inflation Expectations -> Interest-Rate Outlook -> Banking & Real Estate
  {
    id: 'e1',
    source: 'crude_oil',
    target: 'energy_costs',
    label: 'Direct Feedstock Escalation',
    type: 'observed',
    confidence: 96,
    verdict: 'VALIDATED',
    rationale: 'Spot crude oil directly sets industrial diesel, bitumen, and petrochemical cracking feedstocks.',
    evidenceSource: 'Platts & Bloomberg Commodity Assessments',
    carMetric: 'Corr: +0.92 | p < 0.001',
  },
  {
    id: 'e2',
    source: 'energy_costs',
    target: 'inflation_expectations',
    label: 'Second-Order Goods Spillover',
    type: 'observed',
    confidence: 88,
    verdict: 'VALIDATED',
    rationale: 'Freight freight tariffs and power costs pass into headline consumer price indices within 30-45 days.',
    evidenceSource: 'RBI Bulletin Macroeconomic Studies',
    carMetric: 'CAR (5d): +0.34% | p = 0.012',
  },
  {
    id: 'e3',
    source: 'inflation_expectations',
    target: 'interest_rate_outlook',
    label: 'Central Bank Reaction Function',
    type: 'inferred',
    confidence: 82,
    verdict: 'INFERRED',
    rationale: 'Persistent inflation expectations force monetary policy committees to hold or hike policy repo rates.',
    evidenceSource: 'Monetary Policy Committee Minutes',
    carMetric: 'Regression β: 0.64 | t = 2.45',
  },
  {
    id: 'e4',
    source: 'interest_rate_outlook',
    target: 'banking_sector',
    label: 'Duration Risk & Net Margin',
    type: 'observed',
    confidence: 85,
    verdict: 'VALIDATED',
    rationale: 'Treasury book mark-to-market depreciation on bank G-sec holdings plus slowing credit expansion.',
    evidenceSource: 'NSE Bank Index Historical Returns',
    carMetric: 'CAR (10d): -2.8% | p = 0.004',
  },
  {
    id: 'e5',
    source: 'interest_rate_outlook',
    target: 'real_estate',
    label: 'Mortgage Rate Sensitivity',
    type: 'inferred',
    confidence: 78,
    verdict: 'INFERRED',
    rationale: 'Rising home loan interest rates increase buyer EMI burden and delay institutional asset capitalization rates.',
    evidenceSource: 'Knight Frank Housing Index & PropTech Disclosures',
    carMetric: 'Corr: -0.68 | p = 0.02',
  },

  // Pathway 2: Crude Oil -> India's Import Bill -> USD/INR -> Import-Dependent Industries
  {
    id: 'e6',
    source: 'crude_oil',
    target: 'import_bill',
    label: 'Inelastic Trade Balance Drag',
    type: 'observed',
    confidence: 94,
    verdict: 'VALIDATED',
    rationale: 'India imports ~85% of crude oil consumption; a $10/bbl rise expands the net merchandise import bill by ~$15B annually.',
    evidenceSource: 'Ministry of Commerce & Industry Trade Reports',
    carMetric: 'Sample n = 24 quarters',
  },
  {
    id: 'e7',
    source: 'import_bill',
    target: 'usd_inr',
    label: 'Current Account FX Outflow',
    type: 'observed',
    confidence: 91,
    verdict: 'VALIDATED',
    rationale: 'High dollar demand from state-run oil marketing refiners exerts downward pressure on rupee reserves.',
    evidenceSource: 'Foreign Exchange Reserve & Spot FX Disclosures',
    carMetric: 'CAR (5d): +0.8% INR depreciation',
  },
  {
    id: 'e8',
    source: 'usd_inr',
    target: 'import_dependent',
    label: 'Twin Cost Squeeze (Oil + FX)',
    type: 'observed',
    confidence: 89,
    verdict: 'VALIDATED',
    rationale: 'Aviation and paint companies face a double squeeze: raw dollar dollar-denominated prices rise AND currency depreciates.',
    evidenceSource: 'InterGlobe Aviation & Asian Paints 10-Q SEC/NSE Filings',
    carMetric: 'CAR (5d): -4.8% | p < 0.001',
  },

  // Pathway 3: USD/INR -> IT Exporters
  {
    id: 'e9',
    source: 'usd_inr',
    target: 'it_exporters',
    label: 'USD Revenue Translation Gain',
    type: 'observed',
    confidence: 84,
    verdict: 'VALIDATED',
    rationale: 'Every 1% INR depreciation translates to an estimated 25-35 basis point operating margin tailwind for Indian IT service exporters.',
    evidenceSource: 'NASSCOM Industry Benchmarks & Brokerage Research',
    carMetric: 'CAR (5d): +2.1% | p = 0.008',
  },
];

interface MarketImpactGraphProps {
  onExploreFullPlatform: () => void;
}

export default function MarketImpactGraph({ onExploreFullPlatform }: MarketImpactGraphProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('crude_oil');
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [relationshipTypeFilter, setRelationshipTypeFilter] = useState<'all' | 'observed' | 'inferred'>('all');

  const selectedNode = useMemo(() => {
    return NODES.find((n) => n.id === selectedNodeId) || null;
  }, [selectedNodeId]);

  const selectedEdge = useMemo(() => {
    return EDGES.find((e) => e.id === selectedEdgeId) || null;
  }, [selectedEdgeId]);

  // Filtered edges
  const filteredEdges = useMemo(() => {
    return EDGES.filter((edge) => {
      if (relationshipTypeFilter === 'all') return true;
      return edge.type === relationshipTypeFilter;
    });
  }, [relationshipTypeFilter]);

  // Connected node IDs for the selected node
  const connectedNodeIds = useMemo(() => {
    if (!selectedNodeId) return new Set<string>();
    const set = new Set<string>();
    set.add(selectedNodeId);
    EDGES.forEach((e) => {
      if (e.source === selectedNodeId) set.add(e.target);
      if (e.target === selectedNodeId) set.add(e.source);
    });
    return set;
  }, [selectedNodeId]);

  // Connected edges for selected node
  const connectedEdgeIds = useMemo(() => {
    if (!selectedNodeId) return new Set<string>();
    const set = new Set<string>();
    EDGES.forEach((e) => {
      if (e.source === selectedNodeId || e.target === selectedNodeId) {
        set.add(e.id);
      }
    });
    return set;
  }, [selectedNodeId]);

  // Upstream & Downstream edges for selected node
  const upstreamEdges = useMemo(() => {
    if (!selectedNodeId) return [];
    return EDGES.filter((e) => e.target === selectedNodeId);
  }, [selectedNodeId]);

  const downstreamEdges = useMemo(() => {
    if (!selectedNodeId) return [];
    return EDGES.filter((e) => e.source === selectedNodeId);
  }, [selectedNodeId]);

  const handleResetGraph = () => {
    setSelectedNodeId('crude_oil');
    setSelectedEdgeId(null);
    setActiveCategoryFilter('all');
    setRelationshipTypeFilter('all');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'commodity':
        return '#25D9F2'; // Electric cyan
      case 'macro':
        return '#9B70FF'; // Violet
      case 'currency':
        return '#20E3C2'; // Neon teal
      case 'sector':
        return '#F59E0B'; // Amber
      case 'equity':
        return '#10B981'; // Emerald
      default:
        return '#38BDF8';
    }
  };

  return (
    <section id="market-graph" className="relative w-full border-b border-white/10 bg-[#05070D] py-24 px-4 md:px-8 overflow-hidden">
      {/* Background Subtle Gradient Accents */}
      <div className="pointer-events-none absolute -top-40 right-10 h-[500px] w-[500px] rounded-full bg-[#25D9F2]/06 blur-[150px]" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-[500px] w-[500px] rounded-full bg-[#9B70FF]/06 blur-[150px]" />

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="rounded-md border border-white/15 bg-white/05 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-300">
              SECTION 05
            </span>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#25D9F2]/30 bg-[#25D9F2]/10 px-3.5 py-1 text-[11px] font-semibold tracking-wider text-[#25D9F2]">
              <Sparkles className="h-3 w-3" />
              <span>INTERACTIVE IMPACT GRAPH</span>
            </div>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-[#F5F7FA] sm:text-4xl md:text-5xl leading-tight">
            One event. A chain reaction across markets.
          </h2>

          <p className="mt-4 text-base text-[#9CA9BB] leading-relaxed">
            Follow the signal from its origin to the assets and industries it could affect. Click on any entity or connection to inspect evidence, downstream exposure, and quantitative backtests.
          </p>
        </div>

        {/* Graph Workspace Container */}
        <div className="relative rounded-3xl border border-white/15 bg-[#0A101A] shadow-[0_25px_70px_rgba(0,0,0,0.7)] backdrop-blur-2xl overflow-hidden">
          {/* Top Control Bar: Filters, Toggles, Reset */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-[#070C15]/90 px-6 py-4">
            {/* Event Context Pill */}
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#FF5D65] animate-ping" />
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                Event:
              </span>
              <span className="rounded-lg border border-[#FF5D65]/40 bg-[#FF5D65]/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-[#FF5D65]">
                Crude Oil Prices Rise by +12.4%
              </span>
            </div>

            {/* Middle: Category & Relationship Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Relationship Type Toggle */}
              <div className="flex items-center rounded-xl border border-white/10 bg-[#05070D] p-1 text-xs">
                <button
                  onClick={() => setRelationshipTypeFilter('all')}
                  className={`rounded-lg px-2.5 py-1 font-medium transition ${
                    relationshipTypeFilter === 'all'
                      ? 'bg-[#25D9F2]/20 text-[#25D9F2]'
                      : 'text-[#9CA9BB] hover:text-white'
                  }`}
                >
                  All Links
                </button>
                <button
                  onClick={() => setRelationshipTypeFilter('observed')}
                  className={`rounded-lg px-2.5 py-1 font-medium transition ${
                    relationshipTypeFilter === 'observed'
                      ? 'bg-[#20E3C2]/20 text-[#20E3C2]'
                      : 'text-[#9CA9BB] hover:text-white'
                  }`}
                >
                  Observed Facts
                </button>
                <button
                  onClick={() => setRelationshipTypeFilter('inferred')}
                  className={`rounded-lg px-2.5 py-1 font-medium transition ${
                    relationshipTypeFilter === 'inferred'
                      ? 'bg-[#9B70FF]/20 text-[#9B70FF]'
                      : 'text-[#9CA9BB] hover:text-white'
                  }`}
                >
                  AI-Inferred
                </button>
              </div>

              {/* Reset Control */}
              <button
                onClick={handleResetGraph}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/05 px-3 py-1.5 text-xs font-medium text-[#9CA9BB] hover:bg-white/10 hover:text-white transition"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset Graph</span>
              </button>
            </div>
          </div>

          {/* Main Workspace Body: Canvas + Inspection Sidebar */}
          <div className="flex flex-col lg:flex-row h-[620px] relative">
            {/* Left: SVG Knowledge Graph Canvas */}
            <div className="relative flex-1 h-full bg-[#05070D] overflow-hidden select-none">
              {/* Grid background */}
              <div className="absolute inset-0 finfluence-grid-bg opacity-30 pointer-events-none" />

              {/* Interactive SVG Network */}
              <svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet">
                <defs>
                  {/* Arrowhead marker */}
                  <marker
                    id="arrow-cyan"
                    viewBox="0 0 10 10"
                    refX="22"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#25D9F2" />
                  </marker>
                  <marker
                    id="arrow-violet"
                    viewBox="0 0 10 10"
                    refX="22"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#9B70FF" />
                  </marker>
                  <marker
                    id="arrow-teal"
                    viewBox="0 0 10 10"
                    refX="22"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#20E3C2" />
                  </marker>
                </defs>

                {/* Render Edges */}
                {filteredEdges.map((edge) => {
                  const sourceNode = NODES.find((n) => n.id === edge.source);
                  const targetNode = NODES.find((n) => n.id === edge.target);
                  if (!sourceNode || !targetNode) return null;

                  const x1 = (sourceNode.x / 100) * 1000;
                  const y1 = (sourceNode.y / 100) * 600;
                  const x2 = (targetNode.x / 100) * 1000;
                  const y2 = (targetNode.y / 100) * 600;

                  // Curvature for organic transmission aesthetics
                  const dx = x2 - x1;
                  const dy = y2 - y1;
                  const cx1 = x1 + dx * 0.45;
                  const cy1 = y1 + dy * 0.1;
                  const cx2 = x1 + dx * 0.55;
                  const cy2 = y2 - dy * 0.1;
                  const pathData = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;

                  const isEdgeSelected = selectedEdgeId === edge.id;
                  const isConnectedToSelectedNode = connectedEdgeIds.has(edge.id);
                  const isDimmed =
                    selectedNodeId && !isConnectedToSelectedNode && !isEdgeSelected;

                  const strokeColor =
                    edge.type === 'observed'
                      ? '#25D9F2' // Cyan for observed facts
                      : '#9B70FF'; // Violet for AI-inferred

                  return (
                    <g key={edge.id} className="cursor-pointer">
                      {/* Invisible wider hit path */}
                      <path
                        d={pathData}
                        fill="none"
                        stroke="transparent"
                        strokeWidth="16"
                        onClick={() => {
                          setSelectedEdgeId(edge.id);
                          setSelectedNodeId(null);
                        }}
                      />

                      {/* Visible Edge Line */}
                      <path
                        d={pathData}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth={isEdgeSelected ? 3 : isConnectedToSelectedNode ? 2 : 1.2}
                        strokeDasharray={edge.type === 'inferred' ? '4 4' : 'none'}
                        opacity={isDimmed ? 0.15 : isEdgeSelected ? 1.0 : isConnectedToSelectedNode ? 0.85 : 0.45}
                        className="transition-all duration-300"
                        onClick={() => {
                          setSelectedEdgeId(edge.id);
                          setSelectedNodeId(null);
                        }}
                      />

                      {/* Directional Glow Particle animating along edge */}
                      {(!isDimmed || isConnectedToSelectedNode) && (
                        <circle r="2.5" fill={strokeColor} opacity="0.9">
                          <animateMotion
                            path={pathData}
                            dur={edge.type === 'observed' ? '2.8s' : '3.6s'}
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}
                    </g>
                  );
                })}

                {/* Render Nodes */}
                {NODES.map((node) => {
                  const cx = (node.x / 100) * 1000;
                  const cy = (node.y / 100) * 600;
                  const isSelected = selectedNodeId === node.id;
                  const isConnected = connectedNodeIds.has(node.id);
                  const isDimmed = selectedNodeId && !isSelected && !isConnected;
                  const color = getCategoryColor(node.category);

                  return (
                    <g
                      key={node.id}
                      className="cursor-pointer transition-all duration-300"
                      onClick={() => {
                        setSelectedNodeId(node.id);
                        setSelectedEdgeId(null);
                      }}
                      opacity={isDimmed ? 0.25 : 1.0}
                    >
                      {/* Outer pulse ring for selected node */}
                      {isSelected && (
                        <circle
                          cx={cx}
                          cy={cy}
                          r="28"
                          fill="none"
                          stroke={color}
                          strokeWidth="1.5"
                          opacity="0.6"
                          className="animate-ping"
                        />
                      )}

                      {/* Glow Halo */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isSelected ? 24 : 18}
                        fill={color}
                        opacity={isSelected ? 0.35 : 0.15}
                        className="transition-all"
                      />

                      {/* Node Circle Core */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isSelected ? 16 : 12}
                        fill="#05070D"
                        stroke={color}
                        strokeWidth={isSelected ? 3 : 2}
                        className="shadow-lg transition-all"
                      />

                      {/* Inner Dot */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isSelected ? 5 : 3.5}
                        fill={color}
                      />

                      {/* Node Label Text */}
                      <text
                        x={cx}
                        y={cy + 30}
                        textAnchor="middle"
                        fill="#F5F7FA"
                        fontSize={isSelected ? '12' : '10.5'}
                        fontWeight={isSelected ? 'bold' : '600'}
                        className="pointer-events-none select-none font-sans drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                      >
                        {node.label}
                      </text>

                      {/* Delta Tag below node label */}
                      <text
                        x={cx}
                        y={cy + 42}
                        textAnchor="middle"
                        fill={node.positive ? '#20E3C2' : '#FF5D65'}
                        fontSize="9"
                        fontWeight="bold"
                        className="pointer-events-none select-none font-mono"
                      >
                        {node.change}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Bottom Canvas Legend */}
              <div className="absolute bottom-4 left-4 z-10 flex flex-wrap items-center gap-4 rounded-xl border border-white/10 bg-[#0A101A]/85 px-4 py-2 text-[10px] backdrop-blur-md">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#25D9F2]" />
                  <span className="text-[#9CA9BB]">Commodity</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#9B70FF]" />
                  <span className="text-[#9CA9BB]">Macro Indicator</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#20E3C2]" />
                  <span className="text-[#9CA9BB]">Currency</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
                  <span className="text-[#9CA9BB]">Sector</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#10B981]" />
                  <span className="text-[#9CA9BB]">Equity</span>
                </div>
                <span className="text-white/20">|</span>
                <div className="flex items-center gap-1.5">
                  <span className="h-0.5 w-3 bg-[#25D9F2]" />
                  <span className="text-slate-300">Observed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-0.5 w-3 bg-[#9B70FF] border-t border-dashed" />
                  <span className="text-slate-300">AI-Inferred</span>
                </div>
              </div>
            </div>

            {/* Right: Information-Rich Entity / Edge Inspection Sidebar */}
            <aside className="w-full lg:w-96 shrink-0 border-t lg:border-t-0 lg:border-l border-white/10 bg-[#070D17] p-6 flex flex-col justify-between overflow-y-auto">
              {/* If an edge is selected */}
              {selectedEdge ? (
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9B70FF]">
                        CONNECTION DETAIL
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase ${
                          selectedEdge.type === 'observed'
                            ? 'bg-[#25D9F2]/20 text-[#25D9F2] border border-[#25D9F2]/30'
                            : 'bg-[#9B70FF]/20 text-[#9B70FF] border border-[#9B70FF]/30'
                        }`}
                      >
                        {selectedEdge.type}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedEdgeId(null)}
                      className="text-slate-500 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-base font-bold text-white">
                      {selectedEdge.label}
                    </h4>

                    {/* Edge Nodes */}
                    <div className="mt-3 flex items-center gap-2 text-xs font-mono bg-[#05070D] p-2.5 rounded-xl border border-white/10">
                      <span className="text-[#25D9F2] font-semibold">
                        {NODES.find((n) => n.id === selectedEdge.source)?.label}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                      <span className="text-[#20E3C2] font-semibold">
                        {NODES.find((n) => n.id === selectedEdge.target)?.label}
                      </span>
                    </div>

                    {/* Hypothesis / Rationale */}
                    <div className="mt-4">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#9CA9BB]">
                        Causal Rationale &amp; Transmission Mechanism:
                      </span>
                      <p className="mt-1 text-xs text-slate-300 leading-relaxed bg-[#0A101A] p-3 rounded-xl border border-white/05">
                        {selectedEdge.rationale}
                      </p>
                    </div>

                    {/* Quantitative Metric */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#9CA9BB]">Confidence Score:</span>
                        <span className="font-mono font-bold text-[#20E3C2]">
                          {selectedEdge.confidence}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#9CA9BB]">Statistical Verdict:</span>
                        <span className="rounded bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.2 font-mono text-[10px] font-bold text-emerald-400">
                          {selectedEdge.verdict}
                        </span>
                      </div>
                      {selectedEdge.carMetric && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#9CA9BB]">Event Study:</span>
                          <span className="font-mono text-xs text-slate-200">
                            {selectedEdge.carMetric}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#9CA9BB]">Source Citation:</span>
                        <span className="text-xs text-slate-300 truncate max-w-[180px]">
                          {selectedEdge.evidenceSource}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : selectedNode ? (
                /* If a node is selected */
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#25D9F2]">
                        ENTITY INSPECTION
                      </span>
                      <h4 className="text-lg font-bold text-white mt-0.5">
                        {selectedNode.label}
                      </h4>
                    </div>

                    <span
                      className={`rounded-lg px-2 py-0.5 font-mono text-xs font-bold ${
                        selectedNode.positive
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/15 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {selectedNode.change}
                    </span>
                  </div>

                  {/* Metadata Row */}
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl border border-white/05 bg-[#05070D] p-2.5">
                      <span className="text-[10px] text-[#9CA9BB]">Ticker / Symbol</span>
                      <p className="font-mono font-bold text-white mt-0.5">
                        {selectedNode.ticker || 'N/A'}
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/05 bg-[#05070D] p-2.5">
                      <span className="text-[10px] text-[#9CA9BB]">Category</span>
                      <p className="font-semibold text-[#25D9F2] uppercase text-[11px] mt-0.5">
                        {selectedNode.category}
                      </p>
                    </div>
                  </div>

                  {/* Measurability Disclaimer */}
                  {!selectedNode.measurable && selectedNode.proxyNotice && (
                    <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-[11px] text-amber-300">
                      <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      <span>{selectedNode.proxyNotice}</span>
                    </div>
                  )}

                  {/* Description */}
                  <p className="mt-4 text-xs leading-relaxed text-slate-300">
                    {selectedNode.description}
                  </p>

                  {/* Direct Upstream & Downstream Links */}
                  <div className="mt-5 space-y-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-[#9CA9BB]">
                        Direct Upstream Drivers ({upstreamEdges.length}):
                      </span>
                      <div className="mt-1 space-y-1">
                        {upstreamEdges.length > 0 ? (
                          upstreamEdges.map((e) => (
                            <button
                              key={e.id}
                              onClick={() => setSelectedNodeId(e.source)}
                              className="flex w-full items-center justify-between rounded-lg bg-[#05070D] px-2.5 py-1.5 text-xs text-slate-300 hover:bg-[#25D9F2]/10 hover:text-white transition"
                            >
                              <span>← {NODES.find((n) => n.id === e.source)?.label}</span>
                              <span className="text-[10px] font-mono text-[#25D9F2]">
                                {e.confidence}% conf
                              </span>
                            </button>
                          ))
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">Origin trigger node</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-[#9CA9BB]">
                        Direct Downstream Transmission ({downstreamEdges.length}):
                      </span>
                      <div className="mt-1 space-y-1">
                        {downstreamEdges.length > 0 ? (
                          downstreamEdges.map((e) => (
                            <button
                              key={e.id}
                              onClick={() => setSelectedNodeId(e.target)}
                              className="flex w-full items-center justify-between rounded-lg bg-[#05070D] px-2.5 py-1.5 text-xs text-slate-300 hover:bg-[#20E3C2]/10 hover:text-white transition"
                            >
                              <span>→ {NODES.find((n) => n.id === e.target)?.label}</span>
                              <span className="text-[10px] font-mono text-[#20E3C2]">
                                {e.confidence}% conf
                              </span>
                            </button>
                          ))
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">Terminal downstream asset</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-center text-xs text-slate-500">
                  <span>Select any node or connection on the canvas to inspect its intelligence profile.</span>
                </div>
              )}

              {/* Bottom CTA to launch full 3D prototype dashboard */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <button
                  onClick={onExploreFullPlatform}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#25D9F2] bg-[#25D9F2] py-3 text-xs font-bold text-[#05070D] shadow-[0_0_20px_rgba(37,217,242,0.3)] hover:bg-[#20E3C2] hover:border-[#20E3C2] transition"
                >
                  <span>Explore the Full Intelligence Platform</span>
                  <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                </button>
                <span className="mt-2 block text-center text-[10px] text-[#9CA9BB]/60">
                  Plausible illustrative pathways, not guaranteed causal predictions.
                </span>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
