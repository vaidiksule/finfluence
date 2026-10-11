'use client';

import React from 'react';
import { IngestedArticle } from '@/lib/types';
import { Newspaper } from 'lucide-react';

interface NewsFeedProps {
  articles: IngestedArticle[];
  onSelectArticle?: (article: IngestedArticle) => void;
}

export default function NewsFeed({ articles, onSelectArticle }: NewsFeedProps) {
  if (articles.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center p-6 text-center text-zinc-500 text-xs font-sans">
        <Newspaper className="h-6 w-6 mb-2 text-zinc-600 stroke-[1.5]" />
        <span>No scenario articles ingested yet.</span>
        <span className="text-[10px] text-zinc-600 mt-1">Start an illustrative replay to inspect its source narrative.</span>
      </div>
    );
  }

  return (
    <div className="space-y-2.5 p-3 text-xs font-sans">
      <div className="flex items-center justify-between px-1 mb-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          News Feed Stream ({articles.length})
        </span>
        <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          Active
        </span>
      </div>

      {articles.map((art) => (
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
