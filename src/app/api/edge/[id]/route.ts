import { NextResponse } from 'next/server';
import { getGraphStore } from '@/lib/graph/store';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const store = getGraphStore();
    const edge = store.getEdge(id);

    if (!edge) {
      return NextResponse.json({ error: `Edge not found: ${id}` }, { status: 404 });
    }

    const srcId = typeof edge.source === 'object' ? (edge.source as any).id : edge.source;
    const tgtId = typeof edge.target === 'object' ? (edge.target as any).id : edge.target;

    const sourceNode = store.getNode(srcId);
    const targetNode = store.getNode(tgtId);

    return NextResponse.json({
      edge,
      source_node: sourceNode,
      target_node: targetNode,
      disclaimer: 'Historically associated, not proven causal.'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
