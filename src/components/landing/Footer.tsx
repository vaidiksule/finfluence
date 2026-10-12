'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  ExternalLink,
  ShieldCheck,
  FileText,
  X,
  Network,
  CheckCircle2,
  Lock,
  Code2,
} from 'lucide-react';

export default function Footer() {
  const [activeModal, setActiveModal] = useState<'privacy' | 'docs' | null>(null);

  return (
    <>
      <footer className="relative w-full border-t border-white/10 bg-[#05070D] px-6 py-12 md:px-12">
        <div className="mx-auto max-w-7xl">
          {/* Main Footer Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/10">
            {/* Col 1: Brand & Description */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#25D9F2]/40 bg-[#0A101A] shadow-[0_0_15px_rgba(37,217,242,0.25)]">
                  <Image
                    src="/logo-no-bg.png"
                    alt="Finfluence Logo"
                    width={22}
                    height={22}
                    className="object-contain"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white tracking-tight">Finfluence</span>
                  <span className="rounded-full border border-[#25D9F2]/30 bg-[#25D9F2]/10 px-2 py-0.5 text-[9px] font-semibold text-[#25D9F2]">
                    v1.0
                  </span>
                </div>
              </div>

              <p className="max-w-md text-xs leading-relaxed text-[#9CA9BB]">
                Autonomous Financial Event Market Impact Graph. Finfluence transforms unstructured global news into explainable, multi-hop transmission networks audited against empirical market data.
              </p>

              <div className="flex items-center gap-2 text-[11px] font-mono text-[#9CA9BB]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#20E3C2]" />
                <span>Sub-60s Ingestion Pipeline • In-Memory Quant Engine</span>
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-white">
                Platform
              </span>
              <ul className="space-y-2 text-xs text-[#9CA9BB]">
                <li>
                  <a href="#capabilities" className="hover:text-[#25D9F2] transition">
                    Platform Capabilities
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-[#25D9F2] transition">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#market-graph" className="hover:text-[#25D9F2] transition">
                    Market Impact Graph
                  </a>
                </li>
                <li>
                  <a href="#evidence" className="hover:text-[#25D9F2] transition">
                    Explainable AI &amp; Evidence
                  </a>
                </li>
                <li>
                  <a href="#use-cases" className="hover:text-[#25D9F2] transition">
                    Use Cases
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Resources & Technical Reference */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-white">
                Resources
              </span>
              <ul className="space-y-2 text-xs text-[#9CA9BB]">
                <li>
                  <button
                    onClick={() => setActiveModal('docs')}
                    className="hover:text-[#25D9F2] transition flex items-center gap-1.5"
                  >
                    <span>Quantitative Methodology</span>
                    <FileText className="h-3 w-3" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal('privacy')}
                    className="hover:text-[#25D9F2] transition flex items-center gap-1.5"
                  >
                    <span>Privacy &amp; Data Security</span>
                    <ShieldCheck className="h-3 w-3" />
                  </button>
                </li>
                <li>
                  <a
                    href="https://github.com/vaidiksule/finfluence"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#25D9F2] transition flex items-center gap-1.5"
                  >
                    <span>GitHub Repository</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Mandatory Disclaimer & Copyright */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="max-w-2xl text-[11px] leading-relaxed text-[#9CA9BB]/80">
              Finfluence provides analytical insights and potential market-impact scenarios for informational purposes only. It does not provide guaranteed predictions or personalized investment advice.
            </p>

            <span className="text-[11px] font-mono text-[#9CA9BB]/60 shrink-0">
              © 2026 Finfluence. All rights reserved.
            </span>
          </div>
        </div>
      </footer>

      {/* Technical Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-2xl border border-white/20 bg-[#0A101A] p-6 text-slate-100 shadow-[0_0_50px_rgba(37,217,242,0.25)]">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {activeModal === 'privacy' && (
              <div>
                <div className="flex items-center gap-2 text-[#20E3C2]">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider font-mono">
                    Privacy Policy &amp; Security Architecture
                  </span>
                </div>
                <h3 className="mt-1 text-lg font-bold text-white">
                  Data Telemetry &amp; Privacy Policy
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-[#9CA9BB]">
                  Finfluence processes public macroeconomic feeds and market disclosures without collecting proprietary trading book data or end-user portfolio state.
                </p>
                <div className="mt-4 space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#20E3C2] shrink-0 mt-0.5" />
                    <span>Zero collection or retention of private keys, brokerage accounts, or order books.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#20E3C2] shrink-0 mt-0.5" />
                    <span>In-memory empirical backtests operate entirely stateless on pre-warmed public return series.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#20E3C2] shrink-0 mt-0.5" />
                    <span>All news headline citations attribute original publisher URLs transparently.</span>
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'docs' && (
              <div>
                <div className="flex items-center gap-2 text-[#25D9F2]">
                  <Code2 className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider font-mono">
                    Quantitative Reference (scoring.json)
                  </span>
                </div>
                <h3 className="mt-1 text-lg font-bold text-white">
                  Event Study &amp; Scoring Methodology
                </h3>
                <div className="mt-4 space-y-3 text-xs">
                  <div className="rounded-xl border border-white/10 bg-[#05070D] p-3">
                    <span className="font-semibold text-white block">1. Volatility Trigger Condition</span>
                    <p className="mt-1 text-[#9CA9BB]">
                      Shock dates flagged when source asset 1-day absolute return $|R_t| &gt; 2.0\sigma$ over a 60-day estimation window.
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-[#05070D] p-3">
                    <span className="font-semibold text-white block">2. Cumulative Abnormal Return (CAR)</span>
                    <p className="mt-1 text-[#9CA9BB]">
                      {"CAR [t+1, t+τ] = Σ (R_i,t - β R_m,t) across windows τ ∈ [1, 5, 10]. Validated with Student-t significance tests (p < 0.05)."}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-[#05070D] p-3">
                    <span className="font-semibold text-white block">3. Radical Honesty Cutoff</span>
                    <p className="mt-1 text-[#9CA9BB]">
                      Edges with $n &lt; 5$ events remain tagged as `inferred (low sample)`. If empirical hit rate is $\le 40\%$ or opposite in sign, the edge is marked `CONTRADICTED` in red.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
