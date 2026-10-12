export type ResearchInputKind = 'question' | 'url' | 'headline' | 'article_text';

export interface SearchResult {
  title: string;
  url: string;
  publisher?: string;
  snippet?: string;
  published_at?: string;
  rank: number;
}

export interface ResearchInput {
  input: string;
  kind: ResearchInputKind;
}
