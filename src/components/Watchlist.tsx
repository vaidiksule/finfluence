'use client';

import React from 'react';
import { BookmarkCheck, Plus, X } from 'lucide-react';
import { GraphEdge, GraphNode } from '@/lib/types';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const storageKey = 'finfluence.watchlist.v1';

interface WatchlistProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onSelectNode: (id: string) => void;
}

function nodeId(value: GraphEdge['source'] | GraphEdge['target']): string {
  return value;
}

const supabase: SupabaseClient | null = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, { auth: { persistSession: true } })
  : null;

export default function Watchlist({ nodes, edges, onSelectNode }: WatchlistProps) {
  const candidates = nodes.filter((node) => node.type === 'company' || node.type === 'index');
  const labelFor = (id: string) => nodes.find((node) => node.id === id)?.label || id;
  const [watchlist, setWatchlist] = React.useState<string[]>([]);
  const [watchlistId, setWatchlistId] = React.useState<string | null>(null);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState('');
  const [authMessage, setAuthMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved: unknown = JSON.parse(window.localStorage.getItem(storageKey) || '[]');
        if (Array.isArray(saved) && saved.every((id) => typeof id === 'string')) {
          setWatchlist(saved);
        }
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (!supabase) return;
    let active = true;
    const loadAccountWatchlist = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (!user || !active) return;
      setUserId(user.id);
      let { data: lists } = await supabase.from('watchlists').select('id').eq('user_id', user.id).limit(1);
      let list = lists?.[0];
      if (!list) {
        const created = await supabase.from('watchlists').insert({ user_id: user.id }).select('id').single();
        list = created.data || undefined;
      }
      if (!list || !active) return;
      setWatchlistId(list.id);
      const { data: items } = await supabase.from('watchlist_items').select('node_id').eq('watchlist_id', list.id);
      setWatchlist((items || []).map((item) => item.node_id));
    };
    void loadAccountWatchlist();
    return () => { active = false; };
  }, []);

  const signIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase || !email.trim()) return;
    const { error } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: window.location.origin } });
    setAuthMessage(error ? error.message : 'Check your email for a secure sign-in link.');
  };

  const toggle = (id: string) => {
    setWatchlist((current) => {
      const next = current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id];
      window.localStorage.setItem(storageKey, JSON.stringify(next));
      if (supabase && watchlistId && userId) {
        void (current.includes(id)
          ? supabase.from('watchlist_items').delete().eq('watchlist_id', watchlistId).eq('node_id', id)
          : supabase.from('watchlist_items').upsert({ watchlist_id: watchlistId, node_id: id }));
      }
      return next;
    });
  };

  const selectedNodes = watchlist
    .map((id) => nodes.find((node) => node.id === id))
    .filter((node): node is GraphNode => node !== undefined);

  return (
    <div className="space-y-4 p-4 text-xs font-sans">
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <BookmarkCheck className="h-4 w-4 text-zinc-300" />
          Your watchlist
        </div>
        <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">
          Saved in this browser. Use it to inspect which mapped research pathways reach companies and indices you follow.
        </p>
      </div>

      {supabase && !userId && (
        <form onSubmit={signIn} className="rounded-2xl border border-white/10 bg-zinc-900/60 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Save across devices</p>
          <div className="mt-2 flex gap-2">
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required placeholder="you@example.com" className="min-w-0 flex-1 rounded-lg border border-white/10 bg-zinc-950/60 px-2.5 py-2 text-[11px] text-white outline-none placeholder:text-zinc-600" />
            <button type="submit" className="rounded-lg bg-zinc-100 px-2.5 py-2 text-[10px] font-semibold text-black">Email link</button>
          </div>
          {authMessage && <p className="mt-2 text-[10px] text-zinc-400">{authMessage}</p>}
        </form>
      )}

      <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Add holdings to investigate</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {candidates.map((node) => {
            const selected = watchlist.includes(node.id);
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => toggle(node.id)}
                className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-[10.5px] transition-colors ${selected ? 'border-white/25 bg-zinc-100 text-black' : 'border-white/10 bg-zinc-950/50 text-zinc-300 hover:border-white/25 hover:text-white'}`}
              >
                {selected ? <X className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                {node.label}
              </button>
            );
          })}
        </div>
      </div>

      {selectedNodes.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Exposure pathways</p>
          {selectedNodes.map((node) => {
            const drivers = edges.filter((edge) => nodeId(edge.target) === node.id).slice(0, 3);
            return (
              <button key={node.id} type="button" onClick={() => onSelectNode(node.id)} className="w-full rounded-xl border border-white/10 bg-zinc-900/60 p-3 text-left transition-colors hover:border-white/25 hover:bg-zinc-800/80">
                <p className="font-medium text-zinc-100">{node.label}</p>
                <p className="mt-1 text-[10.5px] leading-relaxed text-zinc-400">
                  {drivers.length > 0
                    ? `${drivers.length} mapped upstream driver${drivers.length === 1 ? '' : 's'}: ${drivers.map((edge) => labelFor(nodeId(edge.source))).join(', ')}`
                    : 'No mapped upstream driver in the current graph.'}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
