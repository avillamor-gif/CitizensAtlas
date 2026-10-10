import React, { useState, useMemo } from 'react';
import { Article } from '@/types/types';
import ArticleListPage from './ArticleListPage';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, X, SlidersHorizontal } from 'lucide-react';

interface PublicationsPageProps {
  items: Article[];
  onViewArticle: (article: Article) => void;
  onIncrementDownload?: (articleId: number) => void;
}

const PublicationsPage: React.FC<PublicationsPageProps> = ({ items, onViewArticle, onIncrementDownload }) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  const categories = useMemo(() => {
    const cats = items.map(p => p.publicationCategory).filter(Boolean) as string[];
    return ['all', ...Array.from(new Set(cats)).sort()];
  }, [items]);

  const tags = useMemo(() => {
    const allTags = items.flatMap(p => p.tags ?? []);
    return ['all', ...Array.from(new Set(allTags)).sort()];
  }, [items]);

  const years = useMemo(() => {
    const allYears = items
      .map(p => p.publishDate ? new Date(p.publishDate).getFullYear().toString() : null)
      .filter(Boolean) as string[];
    return ['all', ...Array.from(new Set(allYears)).sort((a, b) => Number(b) - Number(a))];
  }, [items]);

  const hasActiveFilters =
    search !== '' ||
    categoryFilter !== 'all' ||
    tagFilter !== 'all' ||
    yearFilter !== 'all';

  const filtered = useMemo(() => {
    let results = items.filter(pub => {
      const matchesSearch =
        search === '' ||
        pub.title.toLowerCase().includes(search.toLowerCase()) ||
        (pub.description ?? '').toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === 'all' ||
        (pub.publicationCategory ?? '') === categoryFilter;
      const matchesTag = tagFilter === 'all' || (pub.tags ?? []).includes(tagFilter);
      const matchesYear =
        yearFilter === 'all' ||
        (pub.publishDate && new Date(pub.publishDate).getFullYear().toString() === yearFilter);
      return matchesSearch && matchesCategory && matchesTag && matchesYear;
    });

    results.sort((a, b) => {
      const dateA = a.publishDate ? new Date(a.publishDate).getTime() : 0;
      const dateB = b.publishDate ? new Date(b.publishDate).getTime() : 0;
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return results;
  }, [items, search, categoryFilter, tagFilter, yearFilter, sortOrder]);

  const handleClearFilters = () => {
    setSearch('');
    setCategoryFilter('all');
    setTagFilter('all');
    setYearFilter('all');
    setSortOrder('newest');
  };

  return (
    <div style={{ backgroundColor: 'var(--deep)' }}>
      {/* Header Section */}
      <section className="py-16 px-4 sm:px-8 text-white border-b" style={{ borderColor: '#2a394c' }}>
        <div className="container mx-auto">
          <div className="text-xs uppercase tracking-[0.32em] mb-4" style={{ color: '#aeb9cc' }}>Research & Analysis</div>
          <h1 className="text-5xl font-bold mb-4">
            <span style={{ color: 'white' }}>Publications</span>
          </h1>
          <p className="text-lg max-w-3xl" style={{ color: '#aeb9cc' }}>
            In-depth research, reports, and analysis on false solutions to waste and climate change.
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="px-4 sm:px-8 py-8 text-white border-b" style={{ borderColor: '#2a394c' }}>
        <div className="container mx-auto">
          {/* Category Buttons */}
          <div className="flex flex-wrap gap-2 pb-6 border-b" style={{ borderColor: '#2a394c' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className="px-4 py-2 rounded font-medium transition-all duration-200"
                style={{
                  backgroundColor: categoryFilter === cat ? '#e2982b' : '#112649',
                  color: categoryFilter === cat ? '#020e21' : '#a0b0c8',
                  border: 'none',
                  fontSize: '14px',
                }}
                onMouseEnter={(e) => {
                  if (categoryFilter !== cat) {
                    e.currentTarget.style.backgroundColor = '#0e2141';
                  }
                }}
                onMouseLeave={(e) => {
                  if (categoryFilter !== cat) {
                    e.currentTarget.style.backgroundColor = '#112649';
                  }
                }}
              >
                {cat === 'all' ? 'All publications' : cat}
              </button>
            ))}
          </div>

          {/* Search and Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[minmax(240px,1fr)_180px_140px_170px] gap-4 pt-6">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4" style={{ color: '#6b7a8f' }} />
              <Input
                placeholder="Search publications..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 h-10"
                style={{
                  backgroundColor: '#0d1b2a',
                  borderColor: '#2f4059',
                  color: '#a0b0c8',
                }}
              />
            </div>

            {/* Tag Filter */}
            {tags.length > 1 && (
              <Select value={tagFilter} onValueChange={setTagFilter}>
                <SelectTrigger className="h-10" style={{
                  backgroundColor: '#0d1b2a',
                  borderColor: '#2f4059',
                  color: '#a0b0c8',
                }}>
                  <SelectValue placeholder="All Tags" />
                </SelectTrigger>
                <SelectContent style={{
                  backgroundColor: '#0d1b2a',
                  borderColor: '#2f4059',
                }}>
                  {tags.map(tag => (
                    <SelectItem 
                      key={tag} 
                      value={tag}
                      className="hover:bg-cyan-500/20"
                      style={{
                        color: tagFilter === tag ? '#06b6d4' : '#a0b0c8',
                      }}
                    >
                      {tag === 'all' ? 'All Tags' : tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Year Filter */}
            {years.length > 1 && (
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="h-10" style={{
                  backgroundColor: '#0d1b2a',
                  borderColor: '#2f4059',
                  color: '#a0b0c8',
                }}>
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent style={{
                  backgroundColor: '#0d1b2a',
                  borderColor: '#2f4059',
                }}>
                  {years.map(year => (
                    <SelectItem 
                      key={year} 
                      value={year}
                      className="hover:bg-cyan-500/20"
                      style={{
                        color: yearFilter === year ? '#06b6d4' : '#a0b0c8',
                      }}
                    >
                      {year === 'all' ? 'All Years' : year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Sort Filter */}
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="h-10" style={{
                backgroundColor: '#0d1b2a',
                borderColor: '#2f4059',
                color: '#a0b0c8',
              }}>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent style={{
                backgroundColor: '#0d1b2a',
                borderColor: '#2f4059',
              }}>
                <SelectItem 
                  value="newest"
                  className="hover:bg-cyan-500/20"
                  style={{
                    color: sortOrder === 'newest' ? '#06b6d4' : '#a0b0c8',
                  }}
                >
                  Newest first
                </SelectItem>
                <SelectItem 
                  value="oldest"
                  className="hover:bg-cyan-500/20"
                  style={{
                    color: sortOrder === 'oldest' ? '#06b6d4' : '#a0b0c8',
                  }}
                >
                  Oldest first
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status and Clear Filters */}
          <div className="flex items-center justify-between gap-4 mt-6 min-h-9">
            <p className="flex items-center gap-2 text-sm" style={{ color: '#aeb9cc' }}>
              <SlidersHorizontal className="size-4" />
              {filtered.length} {filtered.length === 1 ? 'publication' : 'publications'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-80"
                style={{ color: 'var(--highlight)' }}
              >
                <X className="size-4" /> Clear filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <ArticleListPage
        title=""
        items={filtered}
        onViewArticle={onViewArticle}
        onIncrementDownload={onIncrementDownload}
        hideTitle={true}
      />
    </div>
  );
};

export default PublicationsPage;
