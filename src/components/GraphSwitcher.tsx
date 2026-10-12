'use client';

import React, { useState } from 'react';
import { ChevronDown, FolderOpen, Plus } from 'lucide-react';

interface GraphSwitcherProps {
  activeGraph: string;
  onSelectGraph: (graphId: string) => void;
}

const graphOptions = [
  { id: 'oil_spike_2022', label: 'Crude oil shock', detail: 'India market map' },
  { id: 'rate_hike_cycle', label: 'RBI rate cycle', detail: 'Macro policy map' },
  { id: 'new_research', label: 'New research graph', detail: 'Start from a question' }
];

export default function GraphSwitcher({ activeGraph, onSelectGraph }: GraphSwitcherProps) {
  const [open, setOpen] = useState(false);
  const activeOption = graphOptions.find((option) => option.id === activeGraph) || graphOptions[0];

  return (
    <div style={{ position: 'fixed', top: '104px', right: '24px', zIndex: 9999 }} className="pointer-events-auto">
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} className="flex h-10 items-center gap-2 rounded-xl border border-white/[0.14] bg-[#0b1114]/90 px-3 text-left shadow-lg backdrop-blur-xl hover:border-cyan-300/40 hover:bg-[#132027]">
        <FolderOpen className="h-3.5 w-3.5 text-cyan-200" />
        <span className="hidden max-w-[150px] truncate text-[11px] font-medium text-zinc-100 sm:block">{activeOption.label}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-zinc-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-[90] w-64 rounded-2xl border border-white/10 bg-[#10191e] p-1.5 shadow-2xl">
          {graphOptions.map((option) => (
            <button key={option.id} type="button" onClick={() => { onSelectGraph(option.id); setOpen(false); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-white/[0.07]">
              {option.id === 'new_research' ? <Plus className="h-3.5 w-3.5 text-cyan-200" /> : <FolderOpen className="h-3.5 w-3.5 text-zinc-400" />}
              <span className="min-w-0"><span className="block truncate text-[11px] font-medium text-zinc-100">{option.label}</span><span className="block text-[9px] text-zinc-500">{option.detail}</span></span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
