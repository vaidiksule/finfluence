import { NextResponse } from 'next/server';
import oilSpikeReplay from '@/data/replay/oil_spike_2022.json';
import rateHikeReplay from '@/data/replay/rate_hike_cycle.json';
import { processArticlePipeline } from '@/lib/pipeline';
import { IngestedArticle } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const scenario = body.scenario || 'oil_spike_2022';
    const speed = body.speed || 1500; // ms per headline

    const rawArticles = scenario === 'rate_hike_cycle' ? rateHikeReplay : oilSpikeReplay;

    // Process articles sequentially in background with delays to create a live demonstration
    const runReplay = async () => {
      for (const item of rawArticles) {
        const article: IngestedArticle = {
          id: `replay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          source: item.source,
          title: item.title,
          summary: item.summary,
          published_at: item.published_at,
          fetched_at: new Date().toISOString(),
          is_replay: true
        };

        await processArticlePipeline(article);
        await new Promise((resolve) => setTimeout(resolve, speed));
      }
    };

    // Trigger asynchronously so API returns 200 immediately
    runReplay().catch((err) => console.error('Replay execution error:', err));

    return NextResponse.json({
      success: true,
      message: `Started replay scenario: ${scenario}`,
      total_articles: rawArticles.length,
      interval_ms: speed
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to start replay', details: error.message },
      { status: 500 }
    );
  }
}
