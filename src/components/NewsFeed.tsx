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
}

export default function NewsFeed({ articles, onSelectArticle, onSubmitArticle, isSubmitting = false, submitStatus }: NewsFeedProps) {
  const [title, setTitle] = React.useState('');
  const [summary, setSummary] = React.useState('');
  const [source, setSource] = React.useState('');
  const [url, setUrl] = React.useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!onSubmitArticle || !title.trim() || (!summary.trim() && !url.trim())) return;
    await onSubmitArticle({ title: title.trim(), summary: summary.trim(), source: source.trim() || 'User submitted source', url: url.trim() });
    setTitle('');
    setSummary('');
    setSource('');
    setUrl('');
  };

  return (
    <div className="space-y-4 p-3 text-xs font-sans">
      {onSubmitArticle && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.045] p-3.5">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-cyan-200">
            <Newspaper className="h-3.5 w-3.5" /> Add a real news item
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-400">Paste the headline and article text. Finfluence will extract the event, map entities, and publish proposed pathways as they are processed.</p>
          <div className="mt-3 space-y-2">
            <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Headline" required className="w-full rounded-lg border border-white/10 bg-black/20 px-2.5 py-2 text-[11px] text-white outline-none placeholder:text-zinc-600 focus:border-cyan-300/40" />
            <textarea value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Article text or a reliable summary (optional when a public URL is provided)" rows={4} className="w-full resize-none rounded-lg border border-white/10 bg-black/20 px-2.5 py-2 text-[11px] leading-relaxed text-white outline-none placeholder:text-zinc-600 focus:border-cyan-300/40" />
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <input value={source} onChange={(event) => setSource(event.target.value)} placeholder="Source name" className="rounded-lg border border-white/10 bg-black/20 px-2.5 py-2 text-[11px] text-white outline-none placeholder:text-zinc-600 focus:border-cyan-300/40" />
              <input value={url} onChange={(event) => setUrl(event.target.value)} type="url" placeholder="Source URL (optional)" className="rounded-lg border border-white/10 bg-black/20 px-2.5 py-2 text-[11px] text-white outline-none placeholder:text-zinc-600 focus:border-cyan-300/40" />
            </div>
            <button type="submit" disabled={isSubmitting || !title.trim() || (!summary.trim() && !url.trim())} className="w-full rounded-lg bg-cyan-300 px-3 py-2 text-[11px] font-semibold text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-40">
              {isSubmitting ? 'Building evidence map...' : 'Analyze and build graph'}
            </button>
          </div>
          {submitStatus && <p className="mt-2 text-[10px] leading-relaxed text-zinc-400">{submitStatus}</p>}
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
