import { NextResponse } from 'next/server';
import { getGraphStore } from '@/lib/graph/store';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const store = getGraphStore();
    const node = store.getNode(id);

    if (!node) {
      return NextResponse.json({ error: `Node not found: ${id}` }, { status: 404 });
    }

    const incoming = store.getIncomingEdges(id);
    const outgoing = store.getOutgoingEdges(id);

    return NextResponse.json({
      node,
      incoming_edges: incoming,
      outgoing_edges: outgoing,
      degree: incoming.length + outgoing.length
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
