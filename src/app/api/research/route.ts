import { NextResponse } from 'next/server';
import { fetchPublicArticle } from '@/lib/ingest/web';
import { processArticlePipeline, broadcastSSE } from '@/lib/pipeline';
import { IngestedArticle } from '@/lib/types';
import { classifyResearchInput } from '@/lib/research/input';
import { getNewsSearchProvider } from '@/lib/sources/search';
import { SearchResult } from '@/lib/research/types';
import { createAnalysisJob, createResearchRun, saveGraphEvent, saveSourceDocuments, updateAnalysisJob, updateResearchRun } from '@/lib/persistence/supabase';
import { appendArticleRecord } from '@/lib/persistence/local';

export async function POST(request: Request) {
  let runId: string | null = null;
  try {
    const body = (await request.json()) as { input?: unknown };
    const input = typeof body.input === 'string' ? body.input.trim() : '';
    if (!input) return NextResponse.json({ error: 'Enter a question, headline, article text, or public URL.' }, { status: 400 });

    const classification = classifyResearchInput(input);
    const provider = getNewsSearchProvider();
    runId = await createResearchRun(input, classification.kind, provider?.name);
    const emit = async (stage: string, payload: Record<string, unknown> = {}) => {
      broadcastSSE('status', { research_run_id: runId, stage, ...payload });
      await saveGraphEvent(runId, stage, payload);
    };

    await emit('received', { input_kind: classification.kind });
    let title = classification.kind === 'headline' ? input : 'Finfluence research request';
    let summary = classification.kind === 'article_text' ? input : '';
    let source = classification.kind === 'url' ? new URL(input).hostname : 'User research input';
    let url = classification.kind === 'url' ? input : '';
    let sourceResults: SearchResult[] = [];

    if (classification.kind === 'url') {
      await emit('fetching_source', { url });
      const fetched = await fetchPublicArticle(input);
      title = fetched.title || title;
      summary = fetched.summary;
    } else if (provider) {
      await emit('searching_sources', { provider: provider.name });
      sourceResults = await provider.search(input);
      await saveSourceDocuments(runId || '', sourceResults);
      await emit('sources_found', { count: sourceResults.length, provider: provider.name });
      const primary = sourceResults[0];
      if (!summary && primary) {
        title = primary.title;
        summary = primary.snippet || primary.title;
        source = primary.publisher || new URL(primary.url).hostname;
        url = primary.url;
      }
    } else if (classification.kind === 'question') {
      return NextResponse.json({ error: 'No search provider is configured. Add SEARCH_PROVIDER=tavily and TAVILY_API_KEY, or submit an article URL/text.' }, { status: 503 });
    }

    if (!summary) summary = title;
    await emit('extracting', { title });

    const article: IngestedArticle = {
      id: `research_${Date.now()}`,
      source,
      url: url || undefined,
      title,
      summary,
      published_at: new Date().toISOString(),
      fetched_at: new Date().toISOString(),
      is_replay: false,
      source_kind: url ? 'public_url' : 'user_submitted'
    };

    await appendArticleRecord(article);
    const jobId = await createAnalysisJob(article.id);
    if (jobId) await updateAnalysisJob(jobId, { status: 'running' });
    const result = await processArticlePipeline(article, jobId || undefined);
    if (jobId) await updateAnalysisJob(jobId, { status: 'succeeded' });
    await updateResearchRun(runId || '', { status: 'completed' });
    await emit('completed', { nodes_added: result.nodes_added, edges_added: result.edges_added });

    return NextResponse.json({ success: true, research_run_id: runId, job_id: jobId, article, sources: sourceResults, pipeline_result: result });
  } catch (error: unknown) {
    if (runId) await updateResearchRun(runId, { status: 'failed', error: error instanceof Error ? error.message : 'Research failed' });
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Research failed' }, { status: 500 });
  }
}
