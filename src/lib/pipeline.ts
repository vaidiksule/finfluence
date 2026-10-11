import { getGraphStore } from './graph/store';
import { extractEventAndEdges } from './llm/openai';
import { GraphEdge, GraphNode, IngestedArticle, SSEMessage } from './types';

// Global Event Broadcaster for Server-Sent Events (SSE)
type SSEListener = (msg: SSEMessage) => void;
const sseListeners = new Set<SSEListener>();

export function subscribeToSSE(listener: SSEListener): () => void {
  sseListeners.add(listener);
  return () => sseListeners.delete(listener);
}

export function broadcastSSE(type: SSEMessage['type'], data: any): void {
  const msg: SSEMessage = {
    type,
    data,
    timestamp: new Date().toISOString()
  };
  for (const listener of sseListeners) {
    try {
      listener(msg);
    } catch (e) {
      console.error('SSE listener error:', e);
    }
  }
}

/**
 * High-Speed Pipeline Orchestrator:
 * Ingests an article -> Extracts Event + Entities + Edges (1.5s)
 * -> Audits edges against in-memory price returns (<10ms)
 * -> Broadcasts live SSE updates to 3D frontend
 */
export async function processArticlePipeline(article: IngestedArticle): Promise<{
  event_detected: boolean;
  nodes_added: number;
  edges_added: number;
}> {
  broadcastSSE('article_ingested', article);

  // 1. Single-Pass LLM Extraction
  const extraction = await extractEventAndEdges(article.title, article.summary || '');
  const store = getGraphStore();

  let nodesAddedCount = 0;
  let edgesAddedCount = 0;

  if (extraction.is_event) {
    const eventNodeId = `event.${Date.now()}`;
    const eventNode: GraphNode = {
      id: eventNodeId,
      label: extraction.summary,
      type: 'event',
      market: 'Global',
      measurable: false,
      description: `${extraction.event_type.replace('_', ' ')}: ${extraction.magnitude_text || ''}`,
      first_seen: new Date().toISOString()
    };

    store.addNode(eventNode);
    nodesAddedCount++;
    broadcastSSE('node_added', eventNode);

    // 2. Add extracted entities
    for (const ent of extraction.entities) {
      if (!store.getNode(ent.canonical_id)) {
        const newNode: GraphNode = {
          id: ent.canonical_id,
          label: ent.name,
          type: (ent.type as any) || 'company',
          market: 'India',
          ticker: ent.ticker || null,
          measurable: !!ent.ticker,
          first_seen: new Date().toISOString()
        };
        store.addNode(newNode);
        nodesAddedCount++;
        broadcastSSE('node_added', newNode);
      }
    }

    // 3. Propose and add candidate edges
    for (const prop of extraction.candidate_edges) {
      // If source or target is the primary event, link it
      const srcId = prop.source_id === 'event' ? eventNodeId : prop.source_id;
      const tgtId = prop.target_id === 'event' ? eventNodeId : prop.target_id;

      // Ensure nodes exist in store
      if (!store.getNode(srcId) || !store.getNode(tgtId)) continue;

      const edgeId = `edge.${srcId}.${tgtId}.${Date.now()}`;
      const newEdge: GraphEdge = {
        id: edgeId,
        source: srcId,
        target: tgtId,
        relation: prop.relation,
        direction: prop.direction,
        state: prop.cited_sentence ? 'stated' : 'inferred',
        confidence: 0.50,
        rationale: prop.rationale,
        mechanism_tag: prop.mechanism_tag,
        lag_best: prop.lag_hint,
        evidence: [
          {
            article_id: article.id,
            title: article.title,
            url: article.url,
            published_at: article.published_at,
            relevance: 0.90,
            supports: true,
            quote_span: prop.cited_sentence
          }
        ],
        components_used: ['llm_proposal'],
        created_by: 'llm',
        cited_sentence: prop.cited_sentence,
        last_validated: new Date().toISOString()
      };

      store.upsertEdge(newEdge);
      edgesAddedCount++;
      broadcastSSE('edge_added', newEdge);
    }

    // 4. In-Memory Quant Audit across all edges (< 20ms)
    store.auditAllEdges();

    // Broadcast updated edges
    for (const edge of store.getAllEdges()) {
      broadcastSSE('edge_updated', edge);
    }

    // 5. Update top paths
    const topPaths = store.getTopPaths(eventNodeId, 4, 8);
    broadcastSSE('paths_updated', { event_id: eventNodeId, paths: topPaths });
  }

  return {
    event_detected: extraction.is_event,
    nodes_added: nodesAddedCount,
    edges_added: edgesAddedCount
  };
}
