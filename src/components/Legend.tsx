'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

export default function Legend() {
  const [collapsed, setCollapsed] = useState(false);
  const sphereLegend = [
    ['Macro Event', '#f59e0b'],
    ['Commodity', '#fb923c'],
    ['Indicator', '#38bdf8'],
    ['Sector', '#34d399'],
    ['Company', '#22d3ee'],
    ['Equity Index', '#a78bfa'],
    ['Currency', '#fbbf24'],
    ['Instrument', '#94a3b8'],
    ['Institution', '#f472b6']
  ] as const;

  return (
    <div style={{ position: 'fixed', right: '16px', left: 'auto', bottom: '16px', zIndex: 40 }} className="w-72 max-w-[calc(100%-2rem)] rounded-2xl border border-white/10 bg-[#0c0c0e]/80 p-3.5 backdrop-blur-2xl shadow-2xl text-xs font-sans">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2 font-medium text-zinc-100">
          <Info className="h-3.5 w-3.5 text-zinc-400" />
          <span>Graph Architecture</span>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-zinc-400 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {!collapsed && (
        <div className="mt-3 space-y-3">
          {/* Edge States */}
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Edge Verification State
            </span>
            <div className="mt-1.5 space-y-1.5 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-4 rounded-full bg-emerald-400 shadow-sm" />
                <span className="text-zinc-200 font-medium">Validated</span>
                <span className="text-zinc-500 text-[10px] ml-auto">n ≥ 5, conf ≥ 60%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-4 rounded-full bg-red-400" />
                <span className="text-zinc-300 font-medium">Contradicted</span>
                <span className="text-zinc-500 text-[10px] ml-auto">Data refutes link</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-4 rounded-full bg-slate-500" />
                <span className="text-zinc-400 font-medium">Inferred</span>
                <span className="text-zinc-500 text-[10px] ml-auto">Proxy / Low sample</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-4 rounded-full bg-slate-400" />
                <span className="text-zinc-400 font-medium">Proposed</span>
                <span className="text-zinc-500 text-[10px] ml-auto">Awaiting audit</span>
              </div>
            </div>
          </div>

          {/* Node Hierarchy */}
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Entity Spheres
            </span>
            <div className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px]">
              {sphereLegend.map(([label, color]) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 7px ${color}66` }} />
                  <span className="truncate text-zinc-300">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-zinc-900/60 p-2 text-[10px] text-zinc-400 border border-white/5 leading-relaxed">
            Particles flow along transmission pathways. Click any node to focus and inspect empirical backtests.
          </div>
        </div>
      )}
    </div>
  );
}
