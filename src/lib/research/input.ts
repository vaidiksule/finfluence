import { ResearchInput, ResearchInputKind } from './types';

export function classifyResearchInput(input: string): ResearchInput {
  const value = input.trim();
  if (/^https?:\/\//i.test(value)) return { input: value, kind: 'url' };
  if (value.length > 500) return { input: value, kind: 'article_text' };
  if (/[.!?]/.test(value) && value.split(/\s+/).length > 12) return { input: value, kind: 'headline' };
  return { input: value, kind: 'question' };
}

export function researchStatusLabel(kind: ResearchInputKind): string {
  return kind === 'url' ? 'Reading public article' : kind === 'article_text' ? 'Reading submitted article' : 'Planning research search';
}
