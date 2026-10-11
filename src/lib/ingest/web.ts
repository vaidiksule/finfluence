const MAX_ARTICLE_BYTES = 1_500_000;
const FETCH_TIMEOUT_MS = 8_000;

function isBlockedHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return host === 'localhost' || host === '127.0.0.1' || host === '::1' || host.endsWith('.local') || host.startsWith('10.') || host.startsWith('192.168.') || host.startsWith('169.254.') || host.startsWith('172.16.') || host.startsWith('172.17.') || host.startsWith('172.18.') || host.startsWith('172.19.') || host.startsWith('172.2') || host.startsWith('172.30.') || host.startsWith('172.31.');
}

function decodeHtml(value: string): string {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function extractMeta(html: string, name: string): string | undefined {
  const pattern = new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["'][^>]*>`, 'i');
  return html.match(pattern)?.[1]?.trim();
}

export async function fetchPublicArticle(url: string): Promise<{ title?: string; summary: string }> {
  const parsed = new URL(url);
  if (!['http:', 'https:'].includes(parsed.protocol) || isBlockedHost(parsed.hostname)) {
    throw new Error('Only public http(s) article URLs are allowed.');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(parsed, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { Accept: 'text/html,application/xhtml+xml', 'User-Agent': 'FinfluenceResearch/1.0' }
    });
    if (!response.ok) throw new Error(`Article source returned HTTP ${response.status}.`);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) throw new Error('The source URL did not return a public HTML article.');

    const contentLength = Number(response.headers.get('content-length') || 0);
    if (contentLength > MAX_ARTICLE_BYTES) throw new Error('Article is larger than the permitted fetch size.');
    const html = (await response.text()).slice(0, MAX_ARTICLE_BYTES);
    const title = extractMeta(html, 'og:title') || extractMeta(html, 'twitter:title') || html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
    const articleHtml = html.match(/<article[\s\S]*?<\/article>/i)?.[0] || html;
    const summary = decodeHtml(articleHtml).slice(0, 12_000);
    if (summary.length < 80) throw new Error('The public page did not contain enough readable article text.');
    return { title: title ? decodeHtml(title) : undefined, summary };
  } finally {
    clearTimeout(timeout);
  }
}
