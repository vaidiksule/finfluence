import { GraphEdge, GraphNode, IngestedArticle, RipplePath } from '../types';
import entitiesData from '../../data/entities.json';
import priorGraphData from '../../data/prior_graph.json';
import marketCacheData from '../../data/market_cache.json';
import { computeEventStudyWindow, identifyTriggers, PriceSeries } from '../quant/eventStudy';
import { computeLaggedCorrelation } from '../quant/correlation';
import { assignEdgeState, computeEdgeConfidence } from '../quant/scoring';
import { loadPersistedMarketSeries } from '../persistence/local';
import { loadPersistedGraph } from '../persistence/supabase';

export class GraphStore {
  private nodes: Map<string, GraphNode> = new Map();
  private edges: Map<string, GraphEdge> = new Map();
  private marketCache: Record<string, PriceSeries> = marketCacheData as Record<string, PriceSeries>;
  private hasHydratedPersistedMarketData = false;
  private hasHydratedPersistedGraph = false;
  private persistedArticles: IngestedArticle[] = [];

  constructor() {
    this.initFromPrior();
  }

  public initFromPrior(): void {
    // 1. Load entities as nodes
    for (const ent of (entitiesData as any).entities) {
      this.nodes.set(ent.id, {
        id: ent.id,
        label: ent.label,
        type: ent.type,
        market: ent.market,
        ticker: ent.ticker || null,
        measurable: ent.measurable,
        proxy_of: ent.proxy_of || null,
        description: ent.description || '',
        first_seen: new Date().toISOString(),
        unresolved: false
      });
    }

    // 2. Load prior edges
    for (const edge of (priorGraphData as any).edges) {
      this.edges.set(edge.id, {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        relation: edge.relation,
        direction: edge.direction,
        state: edge.state || 'inferred',
        confidence: edge.confidence || 0.5,
        rationale: edge.rationale,
        mechanism_tag: edge.mechanism_tag,
        lag_best: edge.lag_hint || 0,
        corr_best: 0,
        evidence: [],
        components_used: ['prior'],
        created_by: 'prior',
        last_validated: new Date().toISOString()
      });
    }

    // 3. Auto-audit all edges using in-memory quant backtesting
    this.auditAllEdges();
  }

  public addNode(node: GraphNode): void {
    this.nodes.set(node.id, {
      ...node,
      first_seen: node.first_seen || new Date().toISOString()
    });
  }

  public getNode(id: string): GraphNode | undefined {
    return this.nodes.get(id);
  }

  public getAllNodes(): GraphNode[] {
    return Array.from(this.nodes.values());
  }

  public upsertEdge(edge: GraphEdge): void {
    this.edges.set(edge.id, edge);
  }

  public getEdge(id: string): GraphEdge | undefined {
    return this.edges.get(id);
  }

  public getAllEdges(): GraphEdge[] {
    return Array.from(this.edges.values());
  }

  public getArticles(): IngestedArticle[] {
    return this.persistedArticles;
  }

  public async hydratePersistedGraph(): Promise<void> {
    if (this.hasHydratedPersistedGraph) return;
    const snapshot = await loadPersistedGraph();
    if (snapshot && snapshot.nodes.length > 0) {
      this.nodes = new Map(snapshot.nodes.map((node) => [node.id, node]));
      this.edges = new Map(snapshot.edges.map((edge) => [edge.id, edge]));
      this.persistedArticles = snapshot.articles;
    }
    this.hasHydratedPersistedGraph = true;
  }

  public setMarketSeries(ticker: string, series: PriceSeries): void {
    this.marketCache[ticker] = series;
  }

  /** Load locally persisted provider data once per process, then re-audit the graph. */
  public async hydratePersistedMarketData(): Promise<void> {
    if (this.hasHydratedPersistedMarketData) return;
    const persistedSeries = await loadPersistedMarketSeries();
    for (const [ticker, series] of Object.entries(persistedSeries)) {
      this.setMarketSeries(ticker, series);
    }
    this.hasHydratedPersistedMarketData = true;
    if (Object.keys(persistedSeries).length > 0) this.auditAllEdges();
  }

  public getOutgoingEdges(nodeId: string): GraphEdge[] {
    return Array.from(this.edges.values()).filter((e) => {
      const src = typeof e.source === 'object' ? (e.source as any).id : e.source;
      return src === nodeId;
    });
  }

  public getIncomingEdges(nodeId: string): GraphEdge[] {
    return Array.from(this.edges.values()).filter((e) => {
      const tgt = typeof e.target === 'object' ? (e.target as any).id : e.target;
      return tgt === nodeId;
    });
  }

  /**
   * Run in-memory quant audit across all edges where market price series are available.
   * Runs in < 30ms for 50 edges.
   */
  public auditAllEdges(): void {
    for (const edge of this.edges.values()) {
      const srcId = typeof edge.source === 'object' ? (edge.source as any).id : edge.source;
      const tgtId = typeof edge.target === 'object' ? (edge.target as any).id : edge.target;

      const srcNode = this.nodes.get(srcId);
      const tgtNode = this.nodes.get(tgtId);

      // Determine series to use (direct ticker or proxy)
      const srcTicker = srcNode?.ticker || (srcNode?.proxy_of ? this.nodes.get(srcNode.proxy_of)?.ticker : null);
      const tgtTicker = tgtNode?.ticker || (tgtNode?.proxy_of ? this.nodes.get(tgtNode.proxy_of)?.ticker : null);

      if (srcTicker && tgtTicker && this.marketCache[srcTicker] && this.marketCache[tgtTicker]) {
        const srcSeries = this.marketCache[srcTicker];
        const tgtSeries = this.marketCache[tgtTicker];

        // 1. Identify 2-sigma shock triggers on source
        const triggerIndices = identifyTriggers(srcSeries, 'positive', 2.0);

        // 2. Compute Cumulative Abnormal Returns (CAR) for windows [1, 5, 10]
        const w1 = computeEventStudyWindow(tgtSeries, triggerIndices, 1, edge.direction);
        const w5 = computeEventStudyWindow(tgtSeries, triggerIndices, 5, edge.direction);
        const w10 = computeEventStudyWindow(tgtSeries, triggerIndices, 10, edge.direction);

        // 3. Lagged correlation
        const lagCorr = computeLaggedCorrelation(srcSeries, tgtSeries, 90, 5);

        // 4. Compute blended confidence (primary window: 5 days)
        const confRes = computeEdgeConfidence(w5, lagCorr.best_corr, edge.direction, edge.evidence);

        // 5. Assign state with radical honesty
        const verdict = assignEdgeState(w5, confRes.confidence, edge.direction, false);

        edge.event_study = {
          windows: {
            '1': w1,
            '5': w5,
            '10': w10
          },
          trigger_count: triggerIndices.length
        };
        edge.lag_best = lagCorr.best_lag;
        edge.corr_best = lagCorr.best_corr;
        edge.confidence = confRes.confidence;
        edge.components_used = confRes.components_used;
        edge.state = edge.review_status === 'proposed' && triggerIndices.length < 5
          ? 'proposed'
          : verdict.state;
        edge.state_reason = edge.state === 'proposed'
          ? `Awaiting sufficient evidence: ${triggerIndices.length} qualifying triggers (minimum 5)`
          : verdict.reason;
        edge.audit_version = 'audit-v1';
        edge.last_validated = new Date().toISOString();
      } else {
        // Unmeasurable entity on one or both ends
        edge.state = edge.review_status === 'proposed' ? 'proposed' : 'inferred';
        edge.state_reason = !srcNode?.measurable || !tgtNode?.measurable
          ? 'Unmeasurable macro concept (evidence-only validation, no direct price series)'
          : 'Price series not available';
        edge.confidence = edge.confidence || 0.45;
        edge.components_used = ['prior_reasoning'];
      }
    }
  }

  /**
   * Find ranked simple ripple paths originating from eventNodeId up to maxHops (default 4).
   * Path confidence = product of edge confidences.
   */
  public getTopPaths(eventNodeId: string, maxHops: number = 4, topK: number = 8): RipplePath[] {
    const paths: RipplePath[] = [];

    const dfs = (
      currentNodeId: string,
      visitedNodes: Set<string>,
      currentEdges: GraphEdge[],
      currentConfidence: number
    ) => {
      if (currentEdges.length > 0) {
        // Collect warnings
        const warnings: string[] = [];
        const hasContradicted = currentEdges.some((e) => e.state === 'contradicted');
        const hasInferred = currentEdges.some((e) => e.state === 'inferred');

        if (hasContradicted) warnings.push('Weakened: includes empirically contradicted link');
        if (hasInferred) warnings.push('Partly unverified: includes low-sample or unmeasurable link');

        const pathNodes = [
          typeof currentEdges[0].source === 'object'
            ? (currentEdges[0].source as any).id
            : currentEdges[0].source,
          ...currentEdges.map((e) => (typeof e.target === 'object' ? (e.target as any).id : e.target))
        ];

        paths.push({
          path_id: `path_${paths.length + 1}`,
          nodes: pathNodes,
          edges: [...currentEdges],
          total_confidence: parseFloat(currentConfidence.toFixed(3)),
          hop_count: currentEdges.length,
          warnings
        });
      }

      if (currentEdges.length >= maxHops) return;

      const outgoing = this.getOutgoingEdges(currentNodeId);
      for (const edge of outgoing) {
        const nextId = typeof edge.target === 'object' ? (edge.target as any).id : edge.target;
        if (!visitedNodes.has(nextId)) {
          visitedNodes.add(nextId);
          dfs(
            nextId,
            visitedNodes,
            [...currentEdges, edge],
            currentConfidence * Math.max(0.01, edge.confidence)
          );
          visitedNodes.delete(nextId);
        }
      }
    };

    const visited = new Set<string>([eventNodeId]);
    dfs(eventNodeId, visited, [], 1.0);

    // Sort descending by total_confidence, then ascending by hop_count
    paths.sort((a, b) => {
      if (b.total_confidence !== a.total_confidence) {
        return b.total_confidence - a.total_confidence;
      }
      return a.hop_count - b.hop_count;
    });

    return paths.slice(0, topK);
  }
}

// Global in-memory singleton
let globalStore: GraphStore | null = null;

export function getGraphStore(): GraphStore {
  if (!globalStore) {
    globalStore = new GraphStore();
  }
  return globalStore;
}
