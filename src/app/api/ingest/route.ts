import { NextResponse } from 'next/server';
import { fetchLiveNews } from '@/lib/ingest/rss';
import { processArticlePipeline } from '@/lib/pipeline';
import { IngestedArticle } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. If poll_live flag is true, fetch and ingest all RSS feeds in parallel
    if (body.poll_live) {
      const articles = await fetchLiveNews();
      let totalNodesAdded = 0;
      let totalEdgesAdded = 0;

      // Process articles with parallel concurrency
      const promises = articles.map(async (art) => {
        return processArticlePipeline(art);
      });

      const results = await Promise.allSettled(promises);
      for (const res of results) {
        if (res.status === 'fulfilled') {
          totalNodesAdded += res.value.nodes_added;
          totalEdgesAdded += res.value.edges_added;
        }
      }

      return NextResponse.json({
        success: true,
        articles_fetched: articles.length,
        nodes_added: totalNodesAdded,
        edges_added: totalEdgesAdded
      });
    }

    // 2. Manual paste single article
    const { title, summary, source } = body;
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const article: IngestedArticle = {
      id: `manual_${Date.now()}`,
      source: source || 'Manual Demo Ingest',
      title,
      summary: summary || title,
      published_at: new Date().toISOString(),
      fetched_at: new Date().toISOString(),
      is_replay: false
    };

    const result = await processArticlePipeline(article);

    return NextResponse.json({
      success: true,
      article,
      pipeline_result: result
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Ingestion failed', details: error.message },
      { status: 500 }
    );
  }
}
