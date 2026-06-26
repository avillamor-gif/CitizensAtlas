import { slugify } from '@/lib/constants';
import { Article, ProjectBrief } from '@/types/types';

export function buildSeoSlug(title: string, id: number): string {
  return `${slugify(title)}-${id}`
}

export function parseIdFromSlug(slug: string): number | null {
  const match = slug.match(/-(\d+)$/)
  if (!match) return null

  const parsed = Number(match[1])
  return Number.isFinite(parsed) ? parsed : null
}

/**
 * Reconstruct article slugs with IDs for SEO-friendly URLs
 * Format: ${slugify(title)}-${id}
 */
export function reconstructArticleSlugs(articles: Article[]): Article[] {
  return articles.map(article => ({
    ...article,
    slug: buildSeoSlug(article.title, article.id)
  }));
}

/**
 * Convert ProjectBrief to Article format with SEO-friendly slug
 */
export function projectBriefToArticle(brief: ProjectBrief, index?: number): Article {
  return {
    id: brief.id,
    slug: buildSeoSlug(brief.project_name, brief.id),
    category: brief.project_type || 'Active Fight Site',
    title: brief.project_name,
    description: `${brief.location}${brief.financing_amount ? ` - ${brief.financing_amount}` : ''}`,
    imageUrl: `https://picsum.photos/400/300?random=${index || brief.id}`,
    tagColor: '#FFEB3B',
    publishDate: brief.created_at || brief.submitted_at,
    status: brief.status || 'published',
    country: brief.country,
  };
}

/**
 * Convert multiple ProjectBriefs to Articles with SEO-friendly slugs
 */
export function projectBriefsToArticles(briefs: ProjectBrief[]): Article[] {
  return briefs.map((brief, index) => projectBriefToArticle(brief, index));
}
