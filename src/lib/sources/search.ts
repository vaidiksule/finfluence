import { SearchResult } from '@/lib/research/types';

export interface NewsSearchProvider {
  readonly name: string;
  search(query: string): Promise<SearchResult[]>;
}

class TavilySearchProvider implements NewsSearchProvider {
  readonly name = 'tavily';

  async search(query: string): Promise<SearchResult[]> {
    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) return [];

    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey, query, topic: 'news', search_depth: 'basic', max_results: 5, include_answer: false }),
      signal: AbortSignal.timeout(10_000)
    });
    if (!response.ok) throw new Error(`Tavily search returned HTTP ${response.status}.`);

    const payload = (await response.json()) as { results?: Array<{ title?: string; url?: string; content?: string; published_date?: string }> };
    return (payload.results || []).flatMap((result, index) => result.title && result.url ? [{
      title: result.title,
      url: result.url,
      snippet: result.content,
      published_at: result.published_date,
      rank: index + 1
    }] : []);
  }
}

export function getNewsSearchProvider(): NewsSearchProvider | null {
  if (process.env.SEARCH_PROVIDER === 'tavily' && process.env.TAVILY_API_KEY) return new TavilySearchProvider();
  return null;
}
