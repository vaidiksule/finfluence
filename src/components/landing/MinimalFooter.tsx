'use client';

import React from 'react';
import Image from 'next/image';

export default function MinimalFooter() {
  return (
    <footer className="w-full border-t border-white/05 px-4 md:px-8 py-10 mt-12">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 border border-white/10">
            <Image
              src="/logo-no-bg.png"
              alt="Finfluence"
              width={18}
              height={18}
              className="object-contain"
            />
          </div>
          <span className="text-sm font-medium text-white flex items-center gap-1">
            Finfluence
            <span className="text-[10px] text-slate-500 font-normal">™</span>
          </span>
          <span className="text-xs text-slate-500 ml-2 hidden sm:inline">
            Autonomous Market Impact Graph
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
          <a href="#home" className="hover:text-white transition">Home</a>
          <a href="#impact-graph" className="hover:text-white transition">Impact Graph</a>
          <a href="#capabilities" className="hover:text-white transition">Architecture</a>
          <span className="text-slate-600">•</span>
          <span className="text-[11px] text-slate-500 font-mono">
            © 2026 Finfluence. For research and informational purposes only.
          </span>
        </div>
      </div>
    </footer>
  );
}
