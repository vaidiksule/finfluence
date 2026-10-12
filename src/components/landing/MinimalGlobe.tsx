'use client';

import React, { useEffect, useState } from 'react';
import { Radio, TrendingDown, TrendingUp, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';

interface NewsItem {
  id: string;
  source: string;
  timestamp: string;
  category: string;
  headline: string;
  impacts: { ticker: string; change: string; positive: boolean }[];
  summary: string;
}

const NEWS_FEED: NewsItem[] = [
  {
    id: 'oil_shock',
    source: 'REUTERS',
    timestamp: '2m ago',
    category: 'COMMODITIES',
    headline: 'Strait of Hormuz Tanker Transit Halt Triggers +12.4% Brent Crude Spike',
    impacts: [
      { ticker: 'INDIGO', change: '-4.8%', positive: false },
      { ticker: 'ONGC', change: '+5.4%', positive: true },
      { ticker: 'ASIANPAINT', change: '-3.7%', positive: false },
    ],
    summary: 'Aviation fuel and monomer inflation ripple through emerging market transport margins.',
  },
  {
    id: 'rate_hike',
    source: 'BLOOMBERG',
    timestamp: '5m ago',
    category: 'CENTRAL BANKS',
    headline: 'Surprise 50bps Policy Rate Hike Reprices Sovereign Yield Curves',
    impacts: [
      { ticker: 'HDFCBANK', change: '+1.9%', positive: true },
      { ticker: 'DLF', change: '-3.4%', positive: false },
    ],
    summary: 'Commercial net interest margins expand while residential mortgage velocity cools.',
  },
  {
    id: 'supply_choke',
    source: 'FINANCIAL TIMES',
    timestamp: '9m ago',
    category: 'SUPPLY CHAINS',
    headline: 'Major Chokepoint Fracture Stalls Precision Semiconductor Shipments',
    impacts: [
      { ticker: 'TATAMOTORS', change: '-4.2%', positive: false },
      { ticker: 'TCS', change: '+1.5%', positive: true },
    ],
    summary: 'Automotive assembly backlogs trigger ripple effects in electronic component inventories.',
  },
];

export default function MinimalGlobe() {
  const [isHovered, setIsHovered] = useState(false);
  const [activeNewsIndex, setActiveNewsIndex] = useState(0);

  // Cycle news item periodically
  useEffect(() => {
    const newsTimer = setInterval(() => {
      setActiveNewsIndex((prev) => (prev + 1) % NEWS_FEED.length);
    }, 4500);
    return () => clearInterval(newsTimer);
  }, []);

  const currentNews = NEWS_FEED[activeNewsIndex];

  return (
    <div
      className="relative flex items-center justify-center w-full max-w-[560px] sm:max-w-[600px] lg:max-w-[640px] xl:max-w-[680px] aspect-square mx-auto select-none group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Outer subtle cosmic glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#1E293B]/20 via-[#38BDF8]/10 to-transparent blur-3xl pointer-events-none" />

      {/* Main SVG Wireframe Globe */}
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full relative z-10 drop-shadow-[0_0_30px_rgba(56,189,248,0.15)] cursor-pointer"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="globeSphere" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#0F172A" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#080C15" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#030712" stopOpacity="1" />
          </radialGradient>

          <linearGradient id="orbitalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#818CF8" stopOpacity="0.2" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>

          <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Orbital Ring 1 (Tilted Ellipse) */}
        <ellipse
          cx="250"
          cy="250"
          rx="235"
          ry="120"
          transform="rotate(-28 250 250)"
          stroke="url(#orbitalGradient)"
          strokeWidth="1.2"
          strokeDasharray="4 6"
          className="opacity-70"
        />

        {/* Outer Orbital Ring 2 (Counter Tilted) */}
        <ellipse
          cx="250"
          cy="250"
          rx="215"
          ry="85"
          transform="rotate(35 250 250)"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="1"
          strokeDasharray="2 4"
        />

        {/* Globe Base Sphere */}
        <circle
          cx="250"
          cy="250"
          r="165"
          fill="url(#globeSphere)"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="1.5"
        />

        {/* Latitudes (Horizontal wireframe curves) */}
        <ellipse cx="250" cy="140" rx="122" ry="24" stroke="rgba(255, 255, 255, 0.07)" strokeWidth="0.8" />
        <ellipse cx="250" cy="190" rx="155" ry="32" stroke="rgba(255, 255, 255, 0.09)" strokeWidth="0.8" />
        <ellipse cx="250" cy="250" rx="165" ry="38" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
        <ellipse cx="250" cy="310" rx="155" ry="32" stroke="rgba(255, 255, 255, 0.09)" strokeWidth="0.8" />
        <ellipse cx="250" cy="360" rx="122" ry="24" stroke="rgba(255, 255, 255, 0.07)" strokeWidth="0.8" />

        {/* Longitudes (Vertical wireframe meridians) */}
        <ellipse cx="250" cy="250" rx="45" ry="165" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.8" />
        <ellipse cx="250" cy="250" rx="95" ry="165" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.8" />
        <ellipse cx="250" cy="250" rx="140" ry="165" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.8" />
        <line x1="250" y1="85" x2="250" y2="415" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="0.8" />

        {/* Stylized Continent Outlines (Dotted & Line vectors) */}
        <path
          d="M200 150 Q230 145 250 160 T300 170 T330 195 T310 230 T280 240 T270 280 T250 320 T240 300 T230 250 T210 220 T190 190 Z"
          stroke="rgba(255, 255, 255, 0.22)"
          strokeWidth="1.2"
          fill="rgba(56, 189, 248, 0.03)"
          strokeDasharray="2 3"
        />

        <path
          d="M140 180 Q160 190 155 220 T170 260 T160 300 T150 340 T135 310 T130 260 T125 210 Z"
          stroke="rgba(255, 255, 255, 0.18)"
          strokeWidth="1.2"
          fill="rgba(255, 255, 255, 0.02)"
          strokeDasharray="2 3"
        />

        {/* India / Asia South Node Outline */}
        <path
          d="M275 225 L295 240 L285 265 L270 250 Z"
          stroke="rgba(56, 189, 248, 0.4)"
          strokeWidth="1"
          fill="rgba(56, 189, 248, 0.08)"
        />

        {/* Causal Transmission Arcs */}
        <path
          d="M245 220 Q265 200 285 245"
          stroke="#38BDF8"
          strokeWidth="1.4"
          strokeDasharray="3 3"
          className="opacity-80"
        />
        <path
          d="M285 245 Q210 160 155 220"
          stroke="#818CF8"
          strokeWidth="1.2"
          strokeDasharray="4 4"
          className="opacity-70"
        />
        <path
          d="M245 220 Q235 180 225 170"
          stroke="#38BDF8"
          strokeWidth="1.2"
          strokeDasharray="2 3"
          className="opacity-60"
        />

        {/* Primary Hotspot (Origin Event) */}
        <g transform="translate(245, 220)" filter="url(#glowEffect)">
          <circle r="14" fill="#FBBF24" opacity="0.18" className="animate-ping" />
          <circle r="7" fill="#FBBF24" opacity="0.45" />
          <circle r="3.5" fill="#FDE047" stroke="#FFFFFF" strokeWidth="1" />
        </g>

        {/* Node 2: Asia Financial Hub */}
        <g transform="translate(285, 245)" filter="url(#glowEffect)">
          <circle r="10" fill="#38BDF8" opacity="0.2" className="animate-ping" style={{ animationDuration: '3s' }} />
          <circle r="5" fill="#38BDF8" opacity="0.5" />
          <circle r="3" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="0.8" />
        </g>

        {/* Node 3: European Hub */}
        <g transform="translate(225, 170)">
          <circle r="4" fill="rgba(255, 255, 255, 0.4)" />
          <circle r="2" fill="#FFFFFF" />
        </g>

        {/* Node 4: US Federal Reserve / New York */}
        <g transform="translate(155, 220)">
          <circle r="7" fill="#818CF8" opacity="0.3" />
          <circle r="2.5" fill="#C7D2FE" stroke="#818CF8" strokeWidth="0.8" />
        </g>

        {/* Node 5: Tokyo Hub */}
        <g transform="translate(340, 215)">
          <circle r="3" fill="rgba(255, 255, 255, 0.3)" />
          <circle r="1.8" fill="#FFFFFF" />
        </g>

        {/* Node 6: Singapore Straits Trade Hub */}
        <g transform="translate(315, 280)">
          <circle r="5" fill="#38BDF8" opacity="0.3" />
          <circle r="2.2" fill="#38BDF8" />
        </g>

        {/* Trajectory Satellite points */}
        <g transform="translate(390, 160)">
          <circle r="4" fill="#38BDF8" opacity="0.5" />
          <circle r="2" fill="#FFFFFF" />
        </g>
        <g transform="translate(90, 310)">
          <circle r="3.5" fill="#818CF8" opacity="0.4" />
          <circle r="1.8" fill="#FFFFFF" />
        </g>
      </svg>


      {/* Floating Micro-Badge 2: Propagation Link (Bottom Left) */}
      <div
        className={`absolute -bottom-1 left-4 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-[#0B111F]/90 px-3 py-1.5 shadow-xl backdrop-blur-md transition-all duration-300 ${
          isHovered ? 'opacity-30' : 'opacity-100'
        }`}
      >
        <div className="h-1.5 w-1.5 rounded-full bg-[#38BDF8]" />
        <span className="text-[10px] font-mono text-slate-300">
          Transmission: <span className="text-[#38BDF8] font-semibold">4 Hops Active</span>
        </span>
      </div>

      {/* ========================================================================= */}
      {/* HOVER NEWS CARD: APPEARS WHEN HOVERING ON THE GLOBE                       */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* COMPACT HOVER NEWS CARD: SMALL, SLEEK, AND UNOBTRUSIVE                    */}
      {/* ========================================================================= */}
      <div
        className={`absolute -top-3 -right-2 sm:-right-4 z-30 w-[230px] sm:w-[250px] rounded-xl border border-white/15 bg-[#0B111F]/95 p-2.5 sm:p-3 shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(251,191,36,0.12)] backdrop-blur-xl transition-all duration-300 ease-out ${
          isHovered
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
        }`}
      >
        {/* News Card Header */}
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-500" />
            </span>
            <span className="text-[9px] font-mono font-bold tracking-wider text-rose-400">
              LIVE
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[9px] font-mono text-slate-400">{currentNews.source}</span>
          </div>

          <span className="text-[9px] font-mono text-slate-400">{currentNews.timestamp}</span>
        </div>

        {/* Breaking Headline */}
        <h4 className="text-[11px] font-semibold text-white leading-tight mb-2">
          {currentNews.headline}
        </h4>

        {/* Impact Chips Row */}
        <div className="flex items-center justify-between pt-1.5 border-t border-white/05 gap-1">
          <div className="flex items-center gap-1 overflow-x-hidden">
            {currentNews.impacts.slice(0, 2).map((imp) => (
              <span
                key={imp.ticker}
                className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[9px] font-mono font-semibold ${
                  imp.positive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}
              >
                <span>{imp.ticker}</span>
                <span>{imp.change}</span>
              </span>
            ))}
          </div>

          <span className="text-[8px] font-mono text-emerald-400/90 shrink-0 flex items-center gap-0.5">
            <ShieldCheck className="h-2.5 w-2.5" />
            Verified
          </span>
        </div>
      </div>
    </div>
  );
}
