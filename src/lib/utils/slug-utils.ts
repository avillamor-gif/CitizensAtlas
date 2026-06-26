import { slugify } from '@/lib/constants';
import { Article, ProjectBrief } from '@/types/types';

function assignUniqueSlugs<T extends { id: number }>(
  items: T[],
  getTitle: (item: T) => string
): Map<number, string> {
  const byBase = new Map<string, T[]>()

  for (const item of items) {
    const base = slugify(getTitle(item)) || 'post'
    const existing = byBase.get(base)
    if (existing) {
      existing.push(item)
    } else {
      byBase.set(base, [item])
    }
  }

  const result = new Map<number, string>()

  for (const [base, group] of byBase.entries()) {
    const sorted = [...group].sort((a, b) => a.id - b.id)
    sorted.forEach((item, index) => {
      const slug = index === 0 ? base : `${base}-${index + 1}`
      result.set(item.id, slug)
    })
  }

  return result
}

/**
 * Reconstruct article slugs with duplicate-only numbering.
 * Examples: title, title-2, title-3
 */
export function reconstructArticleSlugs(articles: Article[]): Article[] {
  const slugMap = assignUniqueSlugs(articles, article => article.title)

  return articles.map(article => ({
    ...article,
    slug: slugMap.get(article.id) || (slugify(article.title) || 'post')
  }));
}

/**
 * Convert multiple ProjectBriefs to Articles with duplicate-only numbering.
 */
export function projectBriefsToArticles(briefs: ProjectBrief[]): Article[] {
  const slugMap = assignUniqueSlugs(briefs, brief => brief.project_name)

  return briefs.map((brief, index) => ({
    id: brief.id,
    slug: slugMap.get(brief.id) || (slugify(brief.project_name) || 'post'),
    category: brief.project_type || 'Active Fight Site',
    title: brief.project_name,
    description: `${brief.location}${brief.financing_amount ? ` - ${brief.financing_amount}` : ''}`,
    imageUrl: `https://picsum.photos/400/300?random=${index || brief.id}`,
    tagColor: '#FFEB3B',
    publishDate: brief.created_at || brief.submitted_at,
    status: brief.status || 'published',
    country: brief.country ?? '',
  }))
}
