import { getGraphStore } from './graph/store';
import { extractEventAndEdges } from './llm/openai';
import { GraphEdge, GraphNode, IngestedArticle, SSEMessage } from './types';
import { appendArticleRecord } from './persistence/local';
import { upsertGraphSnapshot } from './persistence/supabase';
import { createHash } from 'node:crypto';

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
export async function processArticlePipeline(article: IngestedArticle, jobId?: string): Promise<{
  event_detected: boolean;
  nodes_added: number;
  edges_added: number;
}> {
  article.retrieved_at ||= new Date().toISOString();
  article.content_hash ||= createHash('sha256').update(`${article.title}\n${article.summary || ''}`).digest('hex');
  article.extraction_model ||= process.env.LLM_MODEL || 'deterministic-fallback';
  article.extraction_version ||= 'extraction-v1';
  broadcastSSE('status', { job_id: jobId, stage: 'received', article_id: article.id });
  await appendArticleRecord(article);
  broadcastSSE('article_ingested', article);
  broadcastSSE('status', { job_id: jobId, stage: 'extracting', article_id: article.id });

  // 1. Single-Pass LLM Extraction
  const extraction = await extractEventAndEdges(article.title, article.summary || '');
  const store = getGraphStore();

  let nodesAddedCount = 0;
  let edgesAddedCount = 0;

  if (extraction.is_event) {
    broadcastSSE('status', { job_id: jobId, stage: 'mapping_entities', article_id: article.id });
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
          first_seen: new Date().toISOString(),
          unresolved: true,
          review_status: 'pending'
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
        state: 'proposed',
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
        review_status: 'proposed',
        provenance: [{
          article_id: article.id,
          url: article.url,
          quote_span: prop.cited_sentence,
          retrieved_at: article.retrieved_at,
          content_hash: article.content_hash,
          extraction_model: article.extraction_model,
          extraction_version: article.extraction_version
        }],
        last_validated: new Date().toISOString()
      };

      store.upsertEdge(newEdge);
      edgesAddedCount++;
      broadcastSSE('edge_added', newEdge);
    }

    article.event = {
      id: eventNodeId,
      is_event: true,
      event_type: extraction.event_type,
      summary: extraction.summary,
      direction: extraction.direction,
      magnitude_text: extraction.magnitude_text,
      magnitude_value: extraction.magnitude_value,
      unit: extraction.unit,
      occurred_at: article.published_at,
      confidence_in_extraction: 0.7
    };
    article.extracted_entities = extraction.entities.map((entity) => entity.canonical_id);
    article.proposed_edges_count = edgesAddedCount;
    await appendArticleRecord(article);

    // Quant audit across all edges; proposed links remain provisional until evidence is sufficient.
    broadcastSSE('status', { job_id: jobId, stage: 'auditing_evidence', article_id: article.id });
    store.auditAllEdges();

    // Broadcast updated edges
    for (const edge of store.getAllEdges()) {
      broadcastSSE('edge_updated', edge);
    }

    await upsertGraphSnapshot(store.getAllNodes(), store.getAllEdges());

    // 5. Update top paths
    const topPaths = store.getTopPaths(eventNodeId, 4, 8);
    broadcastSSE('paths_updated', { event_id: eventNodeId, paths: topPaths });
  }

  broadcastSSE('status', { job_id: jobId, stage: 'completed', article_id: article.id });

  return {
    event_detected: extraction.is_event,
    nodes_added: nodesAddedCount,
    edges_added: edgesAddedCount
  };
}
