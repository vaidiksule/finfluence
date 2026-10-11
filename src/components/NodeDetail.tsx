'use client';

import React from 'react';
import { GraphEdge, GraphNode, IngestedArticle } from '@/lib/types';
import { ArrowRight, ArrowLeft, ShieldAlert, ExternalLink, Activity, Newspaper, TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface NodeDetailProps {
  node: GraphNode;
  incomingEdges: GraphEdge[];
  outgoingEdges: GraphEdge[];
  articles: IngestedArticle[];
  nodes: GraphNode[];
  onSelectNode: (id: string) => void;
  onSelectEdge: (id: string) => void;
  onClose: () => void;
}

export default function NodeDetail({
  node,
  incomingEdges,
  outgoingEdges,
  articles,
  nodes,
  onSelectNode,
  onSelectEdge,
  onClose
}: NodeDetailProps) {
  const relatedArticles = articles
    .filter((article) => article.extracted_entities?.includes(node.id))
    .slice(0, 4);
  const strongestEdges = [...incomingEdges, ...outgoingEdges]
    .sort((left, right) => right.confidence - left.confidence)
    .slice(0, 5);
  const isExposure = node.type === 'company' || node.type === 'index' || node.type === 'sector' || node.type === 'institution';

  const nodeLabel = (id: string) => nodes.find((candidate) => candidate.id === id)?.label || id;
  const edgeEvidence = strongestEdges.flatMap((edge) =>
    (edge.evidence || []).map((evidence) => ({ edge, evidence }))
  ).slice(0, 4);

  const edgeTarget = (edge: GraphEdge, direction: 'in' | 'out') => {
    const value = direction === 'out' ? edge.target : edge.source;
    return typeof value === 'object' ? (value as { id: string }).id : value;
  };

  const getSignalIcon = (direction: GraphEdge['direction']) => {
    if (direction === 'positive') return <TrendingUp className="h-3.5 w-3.5 text-emerald-300" />;
    if (direction === 'negative') return <TrendingDown className="h-3.5 w-3.5 text-rose-300" />;
    return <Minus className="h-3.5 w-3.5 text-amber-200" />;
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4 text-xs font-sans">
      {/* Header */}
      <div className="border-b border-white/10 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-400/10 px-2.5 py-1 text-[10px] font-semibold text-cyan-200 uppercase tracking-wider border border-cyan-300/15">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
              {node.type}
            </span>
            <h2 className="mt-1.5 text-base font-semibold text-white tracking-tight">{node.label}</h2>
            {node.ticker && (
              <span className="font-mono text-xs text-zinc-400">Ticker: {node.ticker}</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        {node.description && (
          <p className="mt-2 text-zinc-400 leading-relaxed text-[11px]">{node.description}</p>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-3">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-zinc-500"><Activity className="h-3 w-3" /> Connected</div>
          <div className="mt-1 text-lg font-semibold text-white">{incomingEdges.length + outgoingEdges.length}</div>
          <div className="text-[10px] text-zinc-500">mapped pathways</div>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-3">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-zinc-500"><ShieldAlert className="h-3 w-3" /> Evidence</div>
          <div className="mt-1 text-lg font-semibold text-white">{strongestEdges.length ? `${Math.round(strongestEdges[0].confidence * 100)}%` : '—'}</div>
          <div className="text-[10px] text-zinc-500">top link confidence</div>
        </div>
      </div>

      {isExposure && (
        <div className="mt-3 rounded-xl border border-cyan-300/15 bg-cyan-300/[0.06] p-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-cyan-200">Why this may matter</div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-300">
            This {node.type} is a potential exposure in the current scenario. Follow the pathways below to see the mechanism, direction, and strength of the supporting evidence.
          </p>
        </div>
      )}

      {/* Non-measurable concept banner */}
      {!node.measurable && (
        <div className="mt-3.5 rounded-xl bg-zinc-900/80 p-3 border border-white/10 text-zinc-300 text-[11px] flex items-start gap-2.5">
          <ShieldAlert className="h-4 w-4 shrink-0 text-zinc-400 mt-0.5" />
          <div>
            <span className="font-medium text-white">Non-measurable concept:</span> Evaluated using ingested news evidence and upstream mechanisms.
            {node.proxy_of && (
              <div className="mt-1 text-zinc-400 text-[10px]">
                Measured via proxy: <span className="font-semibold text-zinc-200">{node.proxy_of}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Downstream Ripple Impacts */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase text-zinc-500 tracking-wider">
            Downstream Ripple Impacts ({outgoingEdges.length})
          </span>
        </div>
        <div className="mt-2 space-y-1.5">
          {outgoingEdges.length === 0 ? (
            <div className="text-[11px] text-zinc-600 italic">No downstream transmission edges.</div>
          ) : (
            outgoingEdges.map((e) => {
              const targetId = edgeTarget(e, 'out');
              return (
                <div
                  key={e.id}
                  onClick={() => onSelectEdge(e.id)}
                  className="group flex cursor-pointer items-center justify-between rounded-xl bg-zinc-900/60 p-2.5 border border-white/5 hover:border-white/20 hover:bg-zinc-800/80 transition-all"
                >
                  <div>
                    <div className="flex items-center gap-1.5 font-medium text-zinc-200 group-hover:text-white transition-colors">
                      <ArrowRight className="h-3 w-3 text-zinc-400" />
                      <span className="line-clamp-1">{nodeLabel(targetId)}</span>
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-0.5 font-mono">
                      {e.relation} • {(e.confidence * 100).toFixed(0)}% conf
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9.5px] font-medium border ${
                      e.state === 'validated'
                        ? 'bg-white/10 text-white border-white/20'
                        : e.state === 'contradicted'
                        ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                        : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                    }`}
                  >
                    {e.state}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Upstream Drivers */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase text-zinc-500 tracking-wider">
            Upstream Drivers ({incomingEdges.length})
          </span>
        </div>
        <div className="mt-2 space-y-1.5">
          {incomingEdges.length === 0 ? (
            <div className="text-[11px] text-zinc-600 italic">No upstream drivers identified.</div>
          ) : (
            incomingEdges.map((e) => {
              const sourceId = edgeTarget(e, 'in');
              return (
                <div
                  key={e.id}
                  onClick={() => onSelectEdge(e.id)}
                  className="group flex cursor-pointer items-center justify-between rounded-xl bg-zinc-900/60 p-2.5 border border-white/5 hover:border-white/20 hover:bg-zinc-800/80 transition-all"
                >
                  <div>
                    <div className="flex items-center gap-1.5 font-medium text-zinc-200 group-hover:text-white transition-colors">
                      <ArrowLeft className="h-3 w-3 text-zinc-400" />
                      <span>{nodeLabel(sourceId)}</span>
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-0.5 font-mono">
                      {e.relation} • {(e.confidence * 100).toFixed(0)}% conf
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9.5px] font-medium border ${
                      e.state === 'validated'
                        ? 'bg-white/10 text-white border-white/20'
                        : e.state === 'contradicted'
                        ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                        : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                    }`}
                  >
                    {e.state}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Evidence snapshot</span>
          <span className="text-[10px] text-zinc-600">{strongestEdges.length} strongest links</span>
        </div>
        <div className="mt-2 space-y-2">
          {strongestEdges.length === 0 ? (
            <div className="rounded-xl border border-white/5 bg-zinc-900/40 p-3 text-[11px] text-zinc-500">No quantified pathways are available for this node yet.</div>
          ) : strongestEdges.map((edge) => {
            const direction = incomingEdges.includes(edge) ? 'in' : 'out';
            const metric = edge.event_study?.windows?.['5'] ?? edge.event_study?.windows?.['1'];
            return (
              <button key={`evidence-${edge.id}`} onClick={() => onSelectEdge(edge.id)} className="w-full rounded-xl border border-white/5 bg-zinc-900/50 p-3 text-left hover:border-cyan-300/25 hover:bg-zinc-800/70">
                <div className="flex items-center gap-2">
                  {getSignalIcon(edge.direction)}
                  <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-zinc-200">{nodeLabel(edgeTarget(edge, direction))} <span className="text-zinc-600">• {edge.relation}</span></span>
                  <span className="font-mono text-[10px] text-cyan-200">{Math.round(edge.confidence * 100)}%</span>
                </div>
                <p className="mt-1.5 line-clamp-2 text-[10px] leading-relaxed text-zinc-500">{edge.rationale}</p>
                <div className="mt-2 flex items-center gap-3 text-[9px] text-zinc-600">
                  <span className="uppercase">{edge.state}</span>
                  {metric && <span>5D hit rate {Math.round(metric.hit_rate * 100)}%</span>}
                  {edge.last_validated && <span>checked {new Date(edge.last_validated).toLocaleDateString()}</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 pb-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500"><Newspaper className="h-3 w-3" /> Related news</span>
          <span className="text-[10px] text-zinc-600">{relatedArticles.length} matched</span>
        </div>
        <div className="mt-2 space-y-2">
          {relatedArticles.length === 0 && edgeEvidence.length === 0 ? (
            <div className="rounded-xl border border-white/5 bg-zinc-900/40 p-3 text-[11px] text-zinc-500">No sourced news is attached to this node in the current run.</div>
          ) : relatedArticles.map((article) => (
            <a key={article.id} href={article.url || '#'} target={article.url ? '_blank' : undefined} rel="noreferrer" className="block rounded-xl border border-white/5 bg-zinc-900/50 p-3 hover:border-white/20 hover:bg-zinc-800/70">
              <div className="flex items-center justify-between gap-2 text-[9px] uppercase tracking-wider text-zinc-600"><span>{article.source}</span><span>{new Date(article.published_at).toLocaleDateString()}</span></div>
              <div className="mt-1 flex items-start gap-2"><span className="line-clamp-2 flex-1 text-[11px] leading-snug text-zinc-200">{article.title}</span>{article.url && <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 text-zinc-500" />}</div>
              {article.summary && <p className="mt-1.5 line-clamp-2 text-[10px] leading-relaxed text-zinc-500">{article.summary}</p>}
            </a>
          ))}
          {relatedArticles.length === 0 && edgeEvidence.map(({ edge, evidence }) => (
            <a key={`${edge.id}-${evidence.article_id}`} href={evidence.url || '#'} target={evidence.url ? '_blank' : undefined} rel="noreferrer" className="block rounded-xl border border-white/5 bg-zinc-900/50 p-3 hover:border-white/20 hover:bg-zinc-800/70">
              <div className="flex items-center justify-between gap-2 text-[9px] uppercase tracking-wider text-zinc-600"><span>Evidence source</span><span>{evidence.published_at ? new Date(evidence.published_at).toLocaleDateString() : 'Undated'}</span></div>
              <div className="mt-1 flex items-start gap-2"><span className="line-clamp-2 flex-1 text-[11px] leading-snug text-zinc-200">{evidence.title}</span>{evidence.url && <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 text-zinc-500" />}</div>
              {evidence.quote_span && <p className="mt-1.5 line-clamp-3 border-l border-cyan-300/30 pl-2 text-[10px] leading-relaxed text-zinc-500">“{evidence.quote_span}”</p>}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
