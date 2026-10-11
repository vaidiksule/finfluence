'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

export default function Legend() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="absolute bottom-4 left-4 z-10 w-72 rounded-xl border border-slate-800/80 bg-slate-950/85 p-3 backdrop-blur-md shadow-xl text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
        <div className="flex items-center gap-1.5 font-semibold text-slate-200">
          <Info className="h-3.5 w-3.5 text-cyan-400" />
          <span>3D Visual Legend</span>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-slate-200"
        >
          {collapsed ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {!collapsed && (
        <div className="mt-2.5 space-y-3">
          {/* Edge States */}
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Edge Verification State
            </span>
            <div className="mt-1.5 space-y-1.5 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-4 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                <span className="text-slate-200 font-medium">Validated</span>
                <span className="text-slate-500 text-[10px] ml-auto">n ≥ 5, conf ≥ 60%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-4 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
                <span className="text-slate-200 font-medium">Contradicted</span>
                <span className="text-slate-500 text-[10px] ml-auto">Data disagrees</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-4 rounded-full bg-slate-500" />
                <span className="text-slate-300 font-medium">Inferred</span>
                <span className="text-slate-500 text-[10px] ml-auto">Low sample / proxy</span>
              </div>
            </div>
          </div>

          {/* Node Types */}
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              3D Entity Spheres
            </span>
            <div className="mt-1.5 grid grid-cols-2 gap-y-1.5 gap-x-2 text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                <span className="text-slate-300">Macro Event</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-600" />
                <span className="text-slate-300">Commodity</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
                <span className="text-slate-300">Indicator</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />
                <span className="text-slate-300">Sector</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-300">Asset / Stock</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                <span className="text-slate-300">Equity Index</span>
              </div>
            </div>
          </div>

          <div className="rounded bg-slate-900/80 p-1.5 text-[10px] text-slate-400 border border-slate-800">
            💡 Particles flow along edges showing real-time macro transmission. Click any node to orbit and zoom.
          </div>
        </div>
      )}
    </div>
  );
}
