import { NextResponse } from 'next/server';
import { fetchLiveNews } from '@/lib/ingest/rss';
import { processArticlePipeline } from '@/lib/pipeline';
import { IngestedArticle } from '@/lib/types';
import { fetchPublicArticle } from '@/lib/ingest/web';
import { appendArticleRecord } from '@/lib/persistence/local';
import { createAnalysisJob, updateAnalysisJob } from '@/lib/persistence/supabase';

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
    let { title, summary, source, url, published_at } = body;
    if (url && !summary) {
      const fetched = await fetchPublicArticle(url);
      title = fetched.title;
      summary = fetched.summary;
    }
    if (!title || !summary) {
      return NextResponse.json({ error: 'Title and article text are required, or provide a public article URL.' }, { status: 400 });
    }

    const article: IngestedArticle = {
      id: `manual_${Date.now()}`,
      source: source || 'Manual Demo Ingest',
      url: url || undefined,
      title,
      summary: summary || title,
      published_at: published_at || new Date().toISOString(),
      fetched_at: new Date().toISOString(),
      is_replay: false,
      source_kind: url ? 'public_url' : 'user_submitted'
    };

    await appendArticleRecord(article);
    const jobId = await createAnalysisJob(article.id);
    if (jobId) await updateAnalysisJob(jobId, { status: 'running' });

    let result;
    try {
      result = await processArticlePipeline(article, jobId || undefined);
      if (jobId) await updateAnalysisJob(jobId, { status: 'succeeded' });
    } catch (error) {
      if (jobId) await updateAnalysisJob(jobId, { status: 'failed', error: error instanceof Error ? error.message : 'Analysis failed' });
      throw error;
    }

    return NextResponse.json({
      success: true,
      article,
      job_id: jobId,
      pipeline_result: result
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Ingestion failed', details: error.message },
      { status: 500 }
    );
  }
}
