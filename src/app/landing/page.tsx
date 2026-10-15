import Link from 'next/link';
import { ArrowRight, BarChart3, BrainCircuit, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

const signals = [
  'Macro shocks mapped to sectors and equities',
  'Explainable causality with evidence-backed edges',
  'Live graph updates from research and market data',
];

const pillars = [
  {
    icon: BrainCircuit,
    title: 'Signal intelligence',
    description: 'Transform noisy event coverage into a measurable map of how policy, commodities, and sentiment affect the market.',
  },
  {
    icon: BarChart3,
    title: 'Evidence-first scoring',
    description: 'Combine event studies, lagged correlations, and historical validation to show what is strong, weak, or still unproven.',
  },
  {
    icon: ShieldCheck,
    title: 'Trust and transparency',
    description: 'Every relationship is labeled with confidence, sample size, and auditability so decision-makers can understand the reasoning.',
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-y-auto bg-[#050b10] text-white">
      <div className="mx-auto max-w-7xl px-5 pb-20 pt-6 sm:px-8 lg:px-10">
        <header className="apple-glass sticky top-4 z-20 mb-10 flex items-center justify-between rounded-full px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/8 ring-1 ring-white/10">
              <span className="font-amaranth text-lg font-bold text-cyan-200">F</span>
            </div>
            <div>
              <div className="font-amaranth text-2xl font-bold tracking-wide text-white">Finfluence</div>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-zinc-300 md:flex">
            <a href="#solutions" className="hover:text-white">Solutions</a>
            <a href="#how-it-works" className="hover:text-white">How it works</a>
            <a href="#why-finfluence" className="hover:text-white">Why it matters</a>
          </nav>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-100 hover:border-cyan-200/50 hover:bg-cyan-300/20"
          >
            Open dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </header>

        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.14),_transparent_30%),linear-gradient(135deg,#0a1216_0%,#050b10_40%,#0c1117_100%)] px-6 py-12 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:px-10 lg:px-14 lg:py-20">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:28px_28px]" />
          <div className="relative grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
                <Sparkles className="h-3.5 w-3.5" />
                Autonomous financial intelligence
              </span>

              <h1 className="max-w-xl text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">
                See the market shock before it hits the balance sheet.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-zinc-300 sm:text-lg">
                Finfluence connects macro events, sectors, and equities into one explainable graph so you can spot risk, identify causal chains, and act with evidence instead of headlines.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#071014] hover:bg-cyan-100"
                >
                  Explore the live graph
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#solutions"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-zinc-100 hover:border-white/25 hover:bg-white/10"
                >
                  See the platform
                </a>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                {signals.map((signal) => (
                  <span key={signal} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-200">
                    {signal}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
              <div className="relative w-full max-w-md rounded-[28px] border border-white/10 bg-[#0d171c]/80 p-5 shadow-[0_16px_50px_rgba(34,211,238,0.2)] backdrop-blur-sm">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] text-cyan-200">Signal map</span>
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-1 text-[10px] font-medium text-emerald-200">
                    live
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    ['Crude oil spike', 'Commodity shock'],
                    ['Rates hike', 'Policy impact'],
                    ['Auto demand', 'Sector transmission'],
                    ['Nifty Auto', 'Equity response'],
                  ].map(([label, detail], index) => (
                    <div key={label} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-3 py-3">
                      <div>
                        <div className="text-sm font-medium text-white">{label}</div>
                        <div className="text-xs text-zinc-400">{detail}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.9)]" />
                        <span className="text-xs text-cyan-200">{index + 1}.0x</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-white/8 bg-[#0a1014] p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.16em] text-zinc-400">Why</span>
                    <TrendingUp className="h-4 w-4 text-emerald-300" />
                  </div>
                  <div className="text-xl font-semibold text-white">+18.4% demand shock</div>
                  <div className="mt-2 text-sm text-zinc-400">Evidence-backed propagation from input event to downstream sectoral impact.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="solutions" className="mt-20">
          <div className="mb-8 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-cyan-200">Built for strategic teams</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">One platform for understanding financial causality.</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map(({ icon: Icon, title, description }) => (
              <div key={title} className="apple-glass-card rounded-[26px] p-6">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-300/20">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-300">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="mt-20 rounded-[30px] border border-white/10 bg-white/[0.02] p-6 sm:p-8 lg:p-10">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-cyan-200">How it works</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">From headline to mechanism.</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              ['01', 'Ingest events', 'Capture macro news, policy shifts, and market-related signals from trusted sources.'],
              ['02', 'Map the chain', 'Extract entities, directionality, and mechanism scores into a dynamic knowledge graph.'],
              ['03', 'Validate with data', 'Use historical market behavior and event-study logic to measure whether the relationship stands up.'],
            ].map(([step, title, description]) => (
              <div key={step} className="rounded-[24px] border border-white/8 bg-[#0d161b] p-5">
                <div className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">{step}</div>
                <h3 className="text-xl font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-300">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="why-finfluence" className="mt-20 pb-6">
          <div className="rounded-[30px] border border-cyan-300/20 bg-[linear-gradient(135deg,rgba(34,211,238,0.12),rgba(17,24,39,0.08))] p-8 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.22em] text-cyan-200">Why Finfluence</p>
                <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">Turn uncertainty into a visible, testable strategy signal.</h2>
              </div>

              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-200"
              >
                View the working app
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
