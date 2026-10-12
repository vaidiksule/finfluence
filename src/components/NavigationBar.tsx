'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Network,
  X,
  ExternalLink,
  Shield,
  Activity,
  Layers,
  Sparkles,
  Zap,
  Globe2,
  Mail,
  Send,
  CheckCircle2,
} from 'lucide-react';

interface NavigationBarProps {
  currentView: 'earth' | 'graph';
  onToggleView: (view: 'earth' | 'graph') => void;
  onResetHome?: () => void;
}

export default function NavigationBar({
  currentView,
  onToggleView,
  onResetHome,
}: NavigationBarProps) {
  const [activeModal, setActiveModal] = useState<'about' | 'features' | 'contact' | 'signup' | null>(null);
  const [signedUp, setSignedUp] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSignedUp(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-[#7B61FF]/20 bg-[#0B0C1E]/85 px-6 backdrop-blur-xl">
        {/* Left: Connected Nodes Logo */}
        <div
          onClick={onResetHome}
          className="flex cursor-pointer items-center gap-3 transition hover:opacity-90"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#7B61FF]/50 bg-gradient-to-br from-[#7B61FF]/20 via-[#1E1F3B] to-[#0B0C1E] shadow-[0_0_16px_rgba(123,97,255,0.35)] overflow-hidden">
            <Image
              src="/logo-no-bg.png"
              alt="Finfluence Logo"
              width={28}
              height={28}
              className="object-contain"
            />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#38BDF8] opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#38BDF8]" />
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-[#F5F5F5]">
                Finfluence
              </span>
              <span className="rounded-full border border-[#7B61FF]/40 bg-[#7B61FF]/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-[#7B61FF]">
                PROTOTYPE
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Financial Event Intelligence
            </span>
          </div>
        </div>

        {/* Right: Navigation Items & Outlined Violet Sign Up Button */}
        <nav className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <button
              onClick={() => {
                if (onResetHome) onResetHome();
                setActiveModal(null);
              }}
              className="transition hover:text-[#7B61FF]"
            >
              Home
            </button>
            <button
              onClick={() => setActiveModal('about')}
              className="transition hover:text-[#7B61FF]"
            >
              About
            </button>
            <button
              onClick={() => setActiveModal('features')}
              className="transition hover:text-[#7B61FF]"
            >
              Features
            </button>
            <button
              onClick={() => setActiveModal('contact')}
              className="transition hover:text-[#7B61FF]"
            >
              Contact
            </button>
          </div>

          {/* View Switcher: Earth vs Deep Graph */}
          <div className="flex items-center rounded-lg border border-[#7B61FF]/30 bg-[#121330]/70 p-0.5 text-xs">
            <button
              onClick={() => onToggleView('earth')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition ${
                currentView === 'earth'
                  ? 'bg-[#7B61FF] text-white shadow-[0_0_10px_rgba(123,97,255,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">3D Earth</span>
            </button>
            <button
              onClick={() => onToggleView('graph')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition ${
                currentView === 'graph'
                  ? 'bg-[#7B61FF] text-white shadow-[0_0_10px_rgba(123,97,255,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Deep Graph</span>
            </button>
          </div>

          {/* Outlined Violet Sign Up Button */}
          <button
            onClick={() => setActiveModal('signup')}
            className="rounded-xl border border-[#7B61FF] bg-transparent px-4 py-1.5 text-sm font-medium text-[#F5F5F5] shadow-[0_0_14px_rgba(123,97,255,0.25)] transition hover:bg-[#7B61FF]/20 hover:shadow-[0_0_20px_rgba(123,97,255,0.45)] active:scale-95"
          >
            Sign Up
          </button>
        </nav>
      </header>

      {/* Interactive Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-2xl border border-[#7B61FF]/50 bg-[#0B0C1E] p-6 text-slate-100 shadow-[0_0_50px_rgba(123,97,255,0.35)]">
            {/* Close button */}
            <button
              onClick={() => setActiveModal(null)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition hover:bg-[#7B61FF]/20 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Content: ABOUT */}
            {activeModal === 'about' && (
              <div>
                <div className="flex items-center gap-2 text-[#7B61FF]">
                  <Network className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">About Finfluence</span>
                </div>
                <h3 className="mt-1 text-xl font-bold text-white">
                  Autonomous Financial Event Market Impact Graph
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-slate-300">
                  Finfluence operates on a fundamental quant thesis: <span className="text-[#38BDF8] font-medium">The LLM proposes relationships; historical market data judges them.</span>
                </p>
                <div className="mt-4 space-y-2.5 text-xs text-slate-300">
                  <div className="rounded-xl border border-[#7B61FF]/20 bg-[#141535] p-3">
                    <div className="font-semibold text-white">Empirical Event Studies</div>
                    <p className="mt-1 text-slate-400">
                      Calculates Cumulative Abnormal Returns (CAR) across 1, 5, and 10 trading day horizons with $2\sigma$ historical volatility shocks and rolling lagged correlations.
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#7B61FF]/20 bg-[#141535] p-3">
                    <div className="font-semibold text-white">Radical Honesty Architecture</div>
                    <p className="mt-1 text-slate-400">
                      Contradicted hypotheses remain visible in red with statistical refutation. Edges with low sample size are honestly disclosed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Content: FEATURES */}
            {activeModal === 'features' && (
              <div>
                <div className="flex items-center gap-2 text-[#7B61FF]">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Platform Capabilities</span>
                </div>
                <h3 className="mt-1 text-xl font-bold text-white">
                  Built for Instant Institutional Clarity
                </h3>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-[#7B61FF]/30 bg-[#141535] p-3">
                    <div className="font-semibold text-purple-300">3D Global Neon Earth</div>
                    <p className="mt-1 text-slate-400">
                      Interactive Three.js globe visualizing cross-border event transmission with live neon pulses and mouse parallax.
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#7B61FF]/30 bg-[#141535] p-3">
                    <div className="font-semibold text-cyan-300">Sub-60s Live Ingestion</div>
                    <p className="mt-1 text-slate-400">
                      Parallel RSS ingestion and structured LLM extraction streaming dynamic shockwave updates in real time.
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#7B61FF]/30 bg-[#141535] p-3">
                    <div className="font-semibold text-emerald-300">Empirical Backtesting</div>
                    <p className="mt-1 text-slate-400">
                      Student-t significance testing ($p &lt; 0.05$) validating causal edge hypotheses against actual returns.
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#7B61FF]/30 bg-[#141535] p-3">
                    <div className="font-semibold text-amber-300">Topological Ripple Paths</div>
                    <p className="mt-1 text-slate-400">
                      Multi-hop path-tracing ranking highest probability transmission pathways across sectors and equities.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Content: CONTACT */}
            {activeModal === 'contact' && (
              <div>
                <div className="flex items-center gap-2 text-[#7B61FF]">
                  <Mail className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Contact & Inquiries</span>
                </div>
                <h3 className="mt-1 text-xl font-bold text-white">
                  Connect with the Engineering Team
                </h3>
                <p className="mt-2 text-xs text-slate-300">
                  Built for Hackwave 3.0 — Autonomous Financial Event Market Impact Graph.
                </p>
                <div className="mt-4 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#141535] p-3">
                    <div>
                      <div className="font-semibold text-white">GitHub Repository</div>
                      <div className="text-slate-400">github.com/vaidiksule/finfluence</div>
                    </div>
                    <a
                      href="https://github.com/vaidiksule/finfluence"
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-[#7B61FF]/40 bg-[#7B61FF]/20 p-2 text-white hover:bg-[#7B61FF]/40"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#141535] p-3">
                    <div>
                      <div className="font-semibold text-white">Hackathon Track</div>
                      <div className="text-slate-400">Problem Statement 5 — Market Event Impact</div>
                    </div>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Content: SIGN UP */}
            {activeModal === 'signup' && (
              <div>
                <div className="flex items-center gap-2 text-[#7B61FF]">
                  <Zap className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Early Access</span>
                </div>
                <h3 className="mt-1 text-xl font-bold text-white">
                  Join the Finfluence Institutional Beta
                </h3>
                <p className="mt-2 text-xs text-slate-300">
                  Receive real-time macro shockwave notifications, custom entity graphs, and quant backtest feeds.
                </p>

                {signedUp ? (
                  <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
                    <CheckCircle2 className="h-10 w-10 text-emerald-400 animate-bounce" />
                    <div className="mt-2 text-base font-semibold text-white">
                      You are on the Priority Waitlist!
                    </div>
                    <div className="mt-1 text-xs text-slate-300">
                      We have reserved your access to the Finfluence intelligence terminal.
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSignUpSubmit} className="mt-5 space-y-3">
                    <div>
                      <label className="text-[11px] font-medium text-slate-400">
                        Work / Institutional Email
                      </label>
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="analyst@firm.com"
                        className="mt-1 w-full rounded-xl border border-[#7B61FF]/40 bg-[#141535] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#7B61FF] focus:outline-none focus:ring-1 focus:ring-[#7B61FF]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#7B61FF] bg-[#7B61FF] py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(123,97,255,0.4)] transition hover:bg-[#6c50fa] active:scale-95"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Request Terminal Access</span>
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
