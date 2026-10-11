import { NextResponse } from 'next/server';
import { getGraphStore } from '@/lib/graph/store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('event_id') || 'commodity.crude_oil';
    const maxHops = parseInt(searchParams.get('max_hops') || '4', 10);
    const topK = parseInt(searchParams.get('top') || '8', 10);

    const store = getGraphStore();
    await store.hydratePersistedMarketData();
    const paths = store.getTopPaths(eventId, maxHops, topK);

    return NextResponse.json({
      event_id: eventId,
      total_paths_found: paths.length,
      paths
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to compute paths', details: error.message },
      { status: 500 }
    );
  }
}
