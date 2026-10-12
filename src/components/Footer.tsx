'use client';

import React, { useState } from 'react';
import { ExternalLink, ShieldCheck, FileText, X } from 'lucide-react';

export default function Footer() {
  const [activeModal, setActiveModal] = useState<'privacy' | 'docs' | null>(null);

  return (
    <>
      <footer className="z-30 w-full border-t border-[#7B61FF]/15 bg-[#0B0C1E]/90 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex flex-col items-center justify-between gap-3 text-xs md:flex-row">
          {/* Tagline */}
          <div className="flex items-center gap-2 text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7B61FF]" />
            <span className="font-medium text-slate-300">
              Hackathon Prototype — Financial Event Intelligence
            </span>
          </div>

          {/* Links: Privacy | Docs | GitHub */}
          <div className="flex items-center gap-6 font-medium text-slate-400">
            <button
              onClick={() => setActiveModal('privacy')}
              className="transition hover:text-[#7B61FF]"
            >
              Privacy
            </button>
            <button
              onClick={() => setActiveModal('docs')}
              className="transition hover:text-[#7B61FF]"
            >
              Docs
            </button>
            <a
              href="https://github.com/vaidiksule/finfluence"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 transition hover:text-[#7B61FF]"
            >
              <span>GitHub</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* Footer Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-2xl border border-[#7B61FF]/50 bg-[#0B0C1E] p-6 text-slate-100 shadow-[0_0_50px_rgba(123,97,255,0.35)]">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition hover:bg-[#7B61FF]/20 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {activeModal === 'privacy' && (
              <div>
                <div className="flex items-center gap-2 text-[#7B61FF]">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Privacy & Telemetry</span>
                </div>
                <h3 className="mt-1 text-lg font-bold text-white">
                  Privacy Policy & Data Security
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-slate-300">
                  Finfluence processes public macroeconomic feeds and market disclosures without collecting proprietary trading book data or end-user portfolio state.
                </p>
                <div className="mt-4 space-y-2 text-xs text-slate-400">
                  <p>• Zero storage of personal credentials or private keys.</p>
                  <p>• In-memory empirical event backtesting runs locally or statelessly.</p>
                  <p>• All cited news articles attribute original publisher sources directly.</p>
                </div>
              </div>
            )}

            {activeModal === 'docs' && (
              <div>
                <div className="flex items-center gap-2 text-[#7B61FF]">
                  <FileText className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Documentation</span>
                </div>
                <h3 className="mt-1 text-lg font-bold text-white">
                  Quantitative Architecture Reference
                </h3>
                <div className="mt-3 space-y-3 text-xs text-slate-300">
                  <div className="rounded-xl border border-slate-800 bg-[#141535] p-3">
                    <span className="font-semibold text-white">1. Event Trigger Detection</span>
                    <p className="mt-1 text-slate-400">Identifies $2\sigma$ volatility spikes across benchmark indicators.</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-[#141535] p-3">
                    <span className="font-semibold text-white">2. CAR Backtesting</span>
                    <p className="mt-1 text-slate-400">Measures abnormal returns $[t+1, t+5, t+10]$ with Student-t significance tests.</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-[#141535] p-3">
                    <span className="font-semibold text-white">3. Radical Honesty</span>
                    <p className="mt-1 text-slate-400">Contradicted hypotheses remain visible in red with statistical refutation.</p>
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
