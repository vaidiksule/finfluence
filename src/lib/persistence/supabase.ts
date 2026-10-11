import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { GraphEdge, GraphNode, IngestedArticle } from '@/lib/types';

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient | null {
  const projectId = process.env.SUPABASE_PROJECT_ID;
  const url = process.env.SUPABASE_URL || (projectId ? `https://${projectId}.supabase.co` : '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

  if (!url || !key || key === projectId) return null;
  client ??= createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}

export function isSupabaseConfigured(): boolean {
  return getClient() !== null;
}

export async function upsertArticle(article: IngestedArticle): Promise<boolean> {
  const supabase = getClient();
  if (!supabase) return false;

  const { error } = await supabase.from('articles').upsert({
    id: article.id,
    source: article.source,
    url: article.url || null,
    title: article.title,
    summary: article.summary || null,
    published_at: article.published_at,
    fetched_at: article.fetched_at,
    is_replay: article.is_replay,
    event: article.event || null,
    extracted_entities: article.extracted_entities || [],
    proposed_edges_count: article.proposed_edges_count || 0
    ,content_hash: article.content_hash || null
    ,retrieved_at: article.retrieved_at || null
    ,extraction_model: article.extraction_model || null
    ,extraction_version: article.extraction_version || null
    ,source_kind: article.source_kind || (article.is_replay ? 'replay' : 'user_submitted')
  });

  if (error) throw new Error(`Supabase article write failed: ${error.message}`);
  return true;
}

export async function upsertGraphSnapshot(nodes: GraphNode[], edges: GraphEdge[]): Promise<boolean> {
  const supabase = getClient();
  if (!supabase) return false;

  const nodeResult = await supabase.from('graph_nodes').upsert(nodes.map((node) => ({
    id: node.id,
    label: node.label,
    type: node.type,
    market: node.market,
    ticker: node.ticker || null,
    measurable: node.measurable,
    proxy_of: node.proxy_of || null,
    description: node.description || null,
    first_seen: node.first_seen || null,
    last_seen: node.last_seen || null,
    unresolved: node.unresolved || false,
    review_status: node.review_status || 'approved'
  })));
  if (nodeResult.error) throw new Error(`Supabase node write failed: ${nodeResult.error.message}`);

  const edgeResult = await supabase.from('graph_edges').upsert(edges.map((edge) => ({
    id: edge.id,
    source_id: edge.source,
    target_id: edge.target,
    relation: edge.relation,
    direction: edge.direction,
    state: edge.state,
    confidence: edge.confidence,
    rationale: edge.rationale,
    mechanism_tag: edge.mechanism_tag || null,
    event_study: edge.event_study || null,
    evidence: edge.evidence || [],
    components_used: edge.components_used,
    created_by: edge.created_by,
    last_validated: edge.last_validated || null,
    state_reason: edge.state_reason || null
    ,review_status: edge.review_status || (edge.state === 'proposed' ? 'proposed' : 'approved')
    ,provenance: edge.provenance || []
    ,audit_version: edge.audit_version || null
  })));
  if (edgeResult.error) throw new Error(`Supabase edge write failed: ${edgeResult.error.message}`);

  return true;
}

export async function loadPersistedGraph(): Promise<{ nodes: GraphNode[]; edges: GraphEdge[]; articles: IngestedArticle[] } | null> {
  const supabase = getClient();
  if (!supabase) return null;

  const [nodesResult, edgesResult, articlesResult] = await Promise.all([
    supabase.from('graph_nodes').select('*'),
    supabase.from('graph_edges').select('*'),
    supabase.from('articles').select('*').order('published_at', { ascending: false }).limit(200)
  ]);
  if (nodesResult.error) throw new Error(`Supabase node read failed: ${nodesResult.error.message}`);
  if (edgesResult.error) throw new Error(`Supabase edge read failed: ${edgesResult.error.message}`);
  if (articlesResult.error) throw new Error(`Supabase article read failed: ${articlesResult.error.message}`);

  return {
    nodes: nodesResult.data.map((node) => ({ ...node, proxy_of: node.proxy_of || null } as GraphNode)),
    edges: edgesResult.data.map((edge) => ({
      ...edge,
      source: edge.source_id,
      target: edge.target_id,
      evidence: edge.evidence || [],
      components_used: edge.components_used || [],
      provenance: edge.provenance || []
    } as GraphEdge)),
    articles: articlesResult.data.map((article) => ({
      ...article,
      extracted_entities: article.extracted_entities || []
    } as IngestedArticle))
  };
}

export async function createAnalysisJob(articleId: string): Promise<string | null> {
  const supabase = getClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from('analysis_jobs').insert({ article_id: articleId }).select('id').single();
  if (error) throw new Error(`Supabase job creation failed: ${error.message}`);
  return data.id as string;
}

export async function updateAnalysisJob(id: string, update: { status: string; error?: string }): Promise<void> {
  const supabase = getClient();
  if (!supabase) return;
  const { error } = await supabase.from('analysis_jobs').update({
    status: update.status,
    error: update.error || null,
    started_at: update.status === 'running' ? new Date().toISOString() : undefined,
    completed_at: ['succeeded', 'failed'].includes(update.status) ? new Date().toISOString() : undefined,
    updated_at: new Date().toISOString()
  }).eq('id', id);
  if (error) throw new Error(`Supabase job update failed: ${error.message}`);
}
