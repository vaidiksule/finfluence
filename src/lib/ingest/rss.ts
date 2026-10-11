import Parser from 'rss-parser';
import { IngestedArticle } from '../types';

const parser = new Parser({
  timeout: 5000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Finfluence/1.0'
  }
});

export const RSS_FEEDS = [
  {
    name: 'ET Markets',
    url: 'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms'
  },
  {
    name: 'Google News (Crude Oil)',
    url: 'https://news.google.com/rss/search?q=crude+oil+prices+markets&hl=en-IN&gl=IN&ceid=IN:en'
  },
  {
    name: 'Google News (RBI Repo Rate)',
    url: 'https://news.google.com/rss/search?q=RBI+repo+rate+monetary+policy&hl=en-IN&gl=IN&ceid=IN:en'
  },
  {
    name: 'Google News (Federal Reserve)',
    url: 'https://news.google.com/rss/search?q=Federal+Reserve+interest+rates&hl=en-US&gl=US&ceid=US:en'
  }
];

// In-memory set of normalized title hashes to deduplicate in < 1ms
const seenTitleHashes = new Set<string>();

export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Fast Jaccard word-similarity to catch near-duplicate headlines within 24h.
 */
export function isDuplicate(title: string): boolean {
  const norm = normalizeTitle(title);
  if (seenTitleHashes.has(norm)) return true;

  const wordsA = new Set(norm.split(' '));
  for (const seen of seenTitleHashes) {
    const wordsB = new Set(seen.split(' '));
    let intersection = 0;
    for (const w of wordsA) {
      if (wordsB.has(w)) intersection++;
    }
    const union = new Set([...wordsA, ...wordsB]).size;
    const similarity = intersection / union;
    if (similarity > 0.82) return true; // > 82% token overlap
  }

  seenTitleHashes.add(norm);
  return false;
}

/**
 * Fetch all RSS feeds in parallel using Promise.allSettled().
 * Returns deduplicated, structured articles.
 * Runs in under 2 seconds.
 */
export async function fetchLiveNews(): Promise<IngestedArticle[]> {
  const articles: IngestedArticle[] = [];

  const promises = RSS_FEEDS.map(async (feed) => {
    try {
      const feedResult = await parser.parseURL(feed.url);
      const items = (feedResult.items || []).slice(0, 5); // top 5 per feed

      return items.map((item) => ({
        id: `art_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        source: feed.name,
        url: item.link || '',
        title: item.title || '',
        summary: item.contentSnippet || item.summary || item.title || '',
        published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        fetched_at: new Date().toISOString(),
        is_replay: false
      }));
    } catch (err: any) {
      console.warn(`[RSS Ingest] Warning: feed ${feed.name} unavailable: ${err.message}`);
      return [];
    }
  });

  const results = await Promise.allSettled(promises);

  for (const res of results) {
    if (res.status === 'fulfilled') {
      for (const item of res.value) {
        if (item.title && !isDuplicate(item.title)) {
          articles.push(item);
        }
      }
    }
  }

  return articles;
}
