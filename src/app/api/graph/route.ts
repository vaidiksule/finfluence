import { NextResponse } from 'next/server';
import { getGraphStore } from '@/lib/graph/store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const market = searchParams.get('market');
    const minConfidence = parseFloat(searchParams.get('min_confidence') || '0');
    const includeStates = searchParams.get('include_states')?.split(',') || null;

    const store = getGraphStore();
    await store.hydratePersistedGraph();
    await store.hydratePersistedMarketData();
    let nodes = store.getAllNodes();
    let edges = store.getAllEdges();

    // Market filter (India, US, Global)
    if (market && market !== 'All') {
      const allowedNodeIds = new Set(
        nodes.filter((n) => n.market === market || n.market === 'Global').map((n) => n.id)
      );
      nodes = nodes.filter((n) => allowedNodeIds.has(n.id));
      edges = edges.filter((e) => {
        const src = typeof e.source === 'object' ? (e.source as any).id : e.source;
        const tgt = typeof e.target === 'object' ? (e.target as any).id : e.target;
        return allowedNodeIds.has(src) && allowedNodeIds.has(tgt);
      });
    }

    // Confidence filter
    if (minConfidence > 0) {
      edges = edges.filter((e) => e.confidence >= minConfidence);
    }

    // State filter
    if (includeStates && includeStates.length > 0) {
      const stateSet = new Set(includeStates);
      edges = edges.filter((e) => stateSet.has(e.state));
    }

    return NextResponse.json({
      nodes,
      edges,
      articles: store.getArticles(),
      stats: {
        total_nodes: nodes.length,
        total_edges: edges.length,
        validated: edges.filter((e) => e.state === 'validated').length,
        contradicted: edges.filter((e) => e.state === 'contradicted').length,
        inferred: edges.filter((e) => e.state === 'inferred').length,
        stated: edges.filter((e) => e.state === 'stated').length
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch graph', details: error.message },
      { status: 500 }
    );
  }
}
