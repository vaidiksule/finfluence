import { NextResponse } from 'next/server';
import { getGraphStore } from '@/lib/graph/store';

export async function GET() {
  const store = getGraphStore();
  const nodes = store.getAllNodes();
  const edges = store.getAllEdges();

  return NextResponse.json({
    status: 'ok',
    product: 'Finfluence',
    nodes_count: nodes.length,
    edges_count: edges.length,
    audit_engine: 'online',
    timestamp: new Date().toISOString()
  });
}
