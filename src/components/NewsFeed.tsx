'use client';

import React from 'react';
import { IngestedArticle } from '@/lib/types';
import { Newspaper, ExternalLink, Flame } from 'lucide-react';

interface NewsFeedProps {
  articles: IngestedArticle[];
  onSelectArticle?: (article: IngestedArticle) => void;
}

export default function NewsFeed({ articles, onSelectArticle }: NewsFeedProps) {
  if (articles.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center p-4 text-center text-slate-500 text-xs">
        <Newspaper className="h-6 w-6 mb-2 text-slate-600" />
        <span>No articles ingested yet.</span>
        <span className="text-[10px] text-slate-600 mt-1">Start a replay or wait for live RSS polling.</span>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-3 text-xs">
      <div className="flex items-center justify-between px-1 mb-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Financial News Ingestion Stream ({articles.length})
        </span>
        <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Active
        </span>
      </div>

      {articles.map((art) => (
        <div
          key={art.id}
          onClick={() => onSelectArticle && onSelectArticle(art)}
          className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 hover:border-slate-700 hover:bg-slate-900 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span className="font-semibold text-cyan-400">{art.source}</span>
            <span>{art.published_at ? new Date(art.published_at).toLocaleTimeString() : 'Recent'}</span>
          </div>

          <h4 className="mt-1 font-semibold text-white text-xs leading-snug line-clamp-2">
            {art.title}
          </h4>

          {art.event && (
            <div className="mt-2 flex items-center gap-1.5">
              <span className="flex items-center gap-1 rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-500/20">
                <Flame className="h-3 w-3 text-amber-400" />
                {art.event.event_type.replace('_', ' ')}
              </span>
              {art.event.magnitude_text && (
                <span className="text-[10px] text-slate-300 font-mono">
                  {art.event.magnitude_text}
                </span>
              )}
            </div>
          )}

          {art.extracted_entities && art.extracted_entities.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {art.extracted_entities.slice(0, 4).map((ent, idx) => (
                <span
                  key={idx}
                  className="rounded bg-slate-800 px-1.5 py-0.2 text-[9px] font-mono text-slate-300"
                >
                  {ent}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
