'use client';

import React from 'react';
import { IngestedArticle } from '@/lib/types';
import { Newspaper } from 'lucide-react';

interface NewsFeedProps {
  articles: IngestedArticle[];
  onSelectArticle?: (article: IngestedArticle) => void;
  onSubmitArticle?: (article: { title: string; summary: string; source: string; url: string }) => Promise<void>;
  isSubmitting?: boolean;
  submitStatus?: string | null;
  onSubmitResearch?: (input: string) => Promise<void>;
  isResearching?: boolean;
  researchStatus?: string | null;
}

export default function NewsFeed({ articles, onSelectArticle, onSubmitResearch, isResearching = false, researchStatus }: NewsFeedProps) {
  const [researchInput, setResearchInput] = React.useState('');

  const handleResearchSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!onSubmitResearch || !researchInput.trim()) return;
    await onSubmitResearch(researchInput.trim());
    setResearchInput('');
  };

  return (
    <div className="space-y-4 p-3 text-xs font-sans">
      {onSubmitResearch && (
        <form onSubmit={handleResearchSubmit} className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.045] p-3.5">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-cyan-200">
            <Newspaper className="h-3.5 w-3.5" /> Add a real news item
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-400">Ask a market question, paste a headline, add article text, or enter a public URL. Finfluence will search, compare, and build a proposed evidence map.</p>
          <div className="mt-3 space-y-2">
            <textarea value={researchInput} onChange={(event) => setResearchInput(event.target.value)} placeholder="What happened in the market, or paste a public article URL..." required rows={5} className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-[11px] leading-relaxed text-white outline-none placeholder:text-zinc-600 focus:border-cyan-300/40" />
            <button type="submit" disabled={isResearching || !researchInput.trim()} className="w-full rounded-xl bg-cyan-300 px-3 py-2.5 text-[11px] font-semibold text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-40">
              {isResearching ? 'Researching and building graph...' : 'Research and build graph'}
            </button>
          </div>
          {researchStatus && <p className="mt-2 text-[10px] leading-relaxed text-zinc-400">{researchStatus}</p>}
        </form>
      )}

      <div className="flex items-center justify-between px-1 mb-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          News Feed Stream ({articles.length})
        </span>
        <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          Active
        </span>
      </div>

      {articles.length === 0 ? (
        <div className="flex h-32 flex-col items-center justify-center p-6 text-center text-zinc-500">
          <Newspaper className="mb-2 h-6 w-6 text-zinc-600 stroke-[1.5]" />
          <span>No submitted or live articles yet.</span>
        </div>
      ) : articles.map((art) => (
        <div
          key={art.id}
          onClick={() => onSelectArticle && onSelectArticle(art)}
          className="rounded-2xl border border-white/5 bg-zinc-900/60 p-3.5 hover:border-white/20 hover:bg-zinc-850 transition-all cursor-pointer shadow-sm"
        >
          <div className="flex items-center justify-between text-[10.5px] text-zinc-500">
            <span className="font-semibold text-zinc-300">{art.source}</span>
            <span>{art.published_at ? new Date(art.published_at).toLocaleTimeString() : 'Recent'}</span>
          </div>

          <h4 className="mt-1.5 font-medium text-white text-xs leading-snug line-clamp-2">
            {art.title}
          </h4>

          {art.event && (
            <div className="mt-2.5 flex items-center gap-2">
              <span className="flex items-center gap-1 rounded-full bg-zinc-800 px-2 py-0.5 text-[9.5px] font-medium text-zinc-300 border border-white/10">
                {art.event.event_type.replace('_', ' ')}
              </span>
              {art.event.magnitude_text && (
                <span className="text-[10px] text-zinc-400 font-mono">
                  {art.event.magnitude_text}
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
