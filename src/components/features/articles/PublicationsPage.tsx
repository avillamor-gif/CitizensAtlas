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

interface PublicationsPageProps {
  items: Article[];
  onViewArticle: (article: Article) => void;
  onIncrementDownload?: (articleId: number) => void;
}

const PublicationsPage: React.FC<PublicationsPageProps> = ({ items, onViewArticle, onIncrementDownload }) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  const publicationTypes = useMemo(() => {
    const types = items.map(p => p.category).filter(Boolean);
    return ['all', ...Array.from(new Set(types)).sort()];
  }, [items]);

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
    typeFilter !== 'all' ||
    categoryFilter !== 'all' ||
    tagFilter !== 'all' ||
    yearFilter !== 'all';

  const filtered = useMemo(() => {
    let results = items.filter(pub => {
      const matchesSearch =
        search === '' ||
        pub.title.toLowerCase().includes(search.toLowerCase()) ||
        (pub.description ?? '').toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || pub.category === typeFilter;
      const matchesCategory =
        categoryFilter === 'all' ||
        (pub.publicationCategory ?? '') === categoryFilter;
      const matchesTag = tagFilter === 'all' || (pub.tags ?? []).includes(tagFilter);
      const matchesYear =
        yearFilter === 'all' ||
        (pub.publishDate && new Date(pub.publishDate).getFullYear().toString() === yearFilter);
      return matchesSearch && matchesType && matchesCategory && matchesTag && matchesYear;
    });

    // Apply sorting
    results.sort((a, b) => {
      const dateA = a.publishDate ? new Date(a.publishDate).getTime() : 0;
      const dateB = b.publishDate ? new Date(b.publishDate).getTime() : 0;
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return results;
  }, [items, search, typeFilter, categoryFilter, tagFilter, yearFilter, sortOrder]);

  const handleClearFilters = () => {
    setSearch('');
    setTypeFilter('all');
    setCategoryFilter('all');
    setTagFilter('all');
    setYearFilter('all');
  };

  const filterBar = (
    <div className="flex flex-col gap-4">
      {/* Category Filter Buttons with Vertical Separator */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className="px-4 py-2 rounded-full font-medium transition-all duration-200"
              style={{
                backgroundColor: categoryFilter === cat ? 'var(--highlight)' : '#1a2e3a',
                color: categoryFilter === cat ? '#000' : '#a0b0c8',
                border: categoryFilter === cat ? 'none' : '1px solid rgba(255, 165, 0, 0.2)',
              }}
            >
              {cat === 'all' ? 'All publications' : cat}
            </button>
          ))}
        </div>
        {/* Vertical Separator */}
        <div className="w-px h-8" style={{ backgroundColor: '#2f4059' }}></div>
      </div>

      {/* Search and Filter Bar on Same Row */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center flex-wrap">
        <Input
          placeholder="Search publications..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-64 h-11"
          style={{
            borderColor: '#2f4059',
            backgroundColor: '#0d1b2a',
            color: '#a0b0c8',
          }}
        />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full md:w-48 h-11" style={{
            borderColor: '#2f4059',
            backgroundColor: '#0d1b2a',
            color: '#a0b0c8',
          }}>
            <SelectValue placeholder="All Publication Types" />
          </SelectTrigger>
          <SelectContent style={{
            backgroundColor: '#0d1b2a',
            borderColor: '#2f4059',
          }}>
            {publicationTypes.map(type => (
              <SelectItem 
                key={type} 
                value={type}
                className="hover:bg-cyan-500/20"
                style={{
                  color: typeFilter === type ? '#06b6d4' : '#a0b0c8',
                }}
              >
                {type === 'all' ? 'All Publication Types' : type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {tags.length > 1 && (
          <Select value={tagFilter} onValueChange={setTagFilter}>
            <SelectTrigger className="w-full md:w-48 h-11" style={{
              borderColor: '#2f4059',
              backgroundColor: '#0d1b2a',
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
        {years.length > 1 && (
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-full md:w-36 h-11" style={{
              borderColor: '#2f4059',
              backgroundColor: '#0d1b2a',
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
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-full md:w-40 h-11" style={{
            borderColor: '#2f4059',
            backgroundColor: '#0d1b2a',
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
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm font-semibold hover:opacity-80 underline whitespace-nowrap transition-colors"
            style={{ color: 'var(--highlight)' }}
          >
            Clear Filters
          </button>
        )}
      </div>
      {hasActiveFilters && (
        <p className="text-sm text-gray-400">
          Showing {filtered.length} of {items.length} publications
        </p>
      )}
    </div>
  );

  return (
    <div style={{ backgroundColor: 'var(--deep)' }}>
      {/* Header Section */}
      <section className="py-16 px-4 sm:px-8 text-white border-b" style={{ borderColor: 'rgba(255, 165, 0, 0.1)' }}>
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

      <ArticleListPage
        title="Publications"
        items={filtered}
        onViewArticle={onViewArticle}
        onIncrementDownload={onIncrementDownload}
        filterBar={filterBar}
        hideTitle
      />
    </div>
  );
};

export default PublicationsPage;
