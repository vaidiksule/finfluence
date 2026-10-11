'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

export default function Legend() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="absolute bottom-[60%] right-4 left-auto z-10 w-72 max-w-[calc(100%-2rem)] rounded-2xl border border-white/10 bg-[#0c0c0e]/80 p-3.5 backdrop-blur-2xl shadow-2xl text-xs font-sans lg:bottom-4">
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
                <span className="h-2 w-4 rounded-full bg-white shadow-sm" />
                <span className="text-zinc-200 font-medium">Validated</span>
                <span className="text-zinc-500 text-[10px] ml-auto">n ≥ 5, conf ≥ 60%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-4 rounded-full bg-zinc-500" />
                <span className="text-zinc-300 font-medium">Contradicted</span>
                <span className="text-zinc-500 text-[10px] ml-auto">Data refutes link</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-4 rounded-full bg-zinc-700" />
                <span className="text-zinc-400 font-medium">Inferred</span>
                <span className="text-zinc-500 text-[10px] ml-auto">Proxy / Low sample</span>
              </div>
            </div>
          </div>

          {/* Node Hierarchy */}
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Entity Spheres
            </span>
            <div className="mt-1.5 grid grid-cols-2 gap-y-1.5 gap-x-2 text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-white border border-white/20" />
                <span className="text-zinc-300">Macro Event</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                <span className="text-zinc-300">Commodity</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-400" />
                <span className="text-zinc-300">Indicator</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-500" />
                <span className="text-zinc-300">Sector</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
                <span className="text-zinc-300">Asset / Stock</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-400" />
                <span className="text-zinc-300">Equity Index</span>
              </div>
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
