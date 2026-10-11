import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { GraphEdge, IngestedArticle } from '@/lib/types';
import { PriceSeries } from '@/lib/quant/eventStudy';
import { upsertArticle } from './supabase';

const runtimeDirectory = path.join(process.cwd(), 'data', 'runtime');

export interface AuditSnapshot {
  generated_at: string;
  source: 'illustrative_cache' | 'yahoo_finance';
  edges: GraphEdge[];
}

interface RuntimeRecords {
  articles: IngestedArticle[];
  market_series: Record<string, PriceSeries>;
  audit?: AuditSnapshot;
}

const emptyRecords = (): RuntimeRecords => ({ articles: [], market_series: {} });
let mutationQueue: Promise<void> = Promise.resolve();

async function runtimePath(): Promise<string> {
  await mkdir(runtimeDirectory, { recursive: true });
  return path.join(runtimeDirectory, 'records.json');
}

async function readRecords(): Promise<RuntimeRecords> {
  const filePath = await runtimePath();
  try {
    return JSON.parse(await readFile(filePath, 'utf8')) as RuntimeRecords;
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') return emptyRecords();
    if (error instanceof SyntaxError) return emptyRecords();
    throw error;
  }
}

async function writeRecords(records: RuntimeRecords): Promise<void> {
  const filePath = await runtimePath();
  const temporaryPath = `${filePath}.tmp`;
  await writeFile(temporaryPath, JSON.stringify(records, null, 2), 'utf8');
  await rename(temporaryPath, filePath);
}

async function mutateRecords(mutator: (records: RuntimeRecords) => RuntimeRecords): Promise<void> {
  const operation = mutationQueue.then(async () => {
    const records = await readRecords();
    await writeRecords(mutator(records));
  });
  mutationQueue = operation.catch(() => undefined);
  await operation;
}

export async function appendArticleRecord(article: IngestedArticle): Promise<void> {
  if (await upsertArticle(article)) return;
  await mutateRecords((records) => ({
    ...records,
    articles: [article, ...records.articles.filter((record) => record.id !== article.id)].slice(0, 200)
  }));
}

export async function saveMarketSeries(ticker: string, series: PriceSeries): Promise<void> {
  await mutateRecords((records) => ({
    ...records,
    market_series: { ...records.market_series, [ticker]: series }
  }));
}

export async function loadPersistedMarketSeries(): Promise<Record<string, PriceSeries>> {
  return (await readRecords()).market_series;
}

export async function saveAuditSnapshot(snapshot: AuditSnapshot): Promise<void> {
  await mutateRecords((records) => ({ ...records, audit: snapshot }));
}
