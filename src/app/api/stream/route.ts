import { NextRequest } from 'next/server';
import { subscribeToSSE } from '@/lib/pipeline';
import { getGraphStore } from '@/lib/graph/store';

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // 1. Send initial snapshot status
      const store = getGraphStore();
      const initMsg = {
        type: 'status',
        data: {
          status: 'connected',
          total_nodes: store.getAllNodes().length,
          total_edges: store.getAllEdges().length
        },
        timestamp: new Date().toISOString()
      };
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(initMsg)}\n\n`));

      // 2. Subscribe to real-time events
      const unsubscribe = subscribeToSSE((msg) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(msg)}\n\n`));
        } catch (e) {
          // stream might be closed
        }
      });

      // 3. Heartbeat every 15s
      const heartbeat = setInterval(() => {
        try {
          const hbMsg = {
            type: 'status',
            data: { status: 'heartbeat', ping: Date.now() },
            timestamp: new Date().toISOString()
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(hbMsg)}\n\n`));
        } catch (e) {
          clearInterval(heartbeat);
        }
      }, 15000);

      req.signal.addEventListener('abort', () => {
        unsubscribe();
        clearInterval(heartbeat);
        try {
          controller.close();
        } catch (e) {}
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive'
    }
  });
}
