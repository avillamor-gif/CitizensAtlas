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
    return items.filter(pub => {
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
  }, [items, search, typeFilter, categoryFilter, tagFilter, yearFilter]);

  const handleClearFilters = () => {
    setSearch('');
    setTypeFilter('all');
    setCategoryFilter('all');
    setTagFilter('all');
    setYearFilter('all');
  };

  const filterBar = (
    <div className="flex flex-col md:flex-row gap-3 items-start md:items-center flex-wrap">
      <Input
        placeholder="Search publications..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full md:w-64 h-11"
      />
      <Select value={typeFilter} onValueChange={setTypeFilter}>
        <SelectTrigger className="w-full md:w-48 h-11">
          <SelectValue placeholder="All Publication Types" />
        </SelectTrigger>
        <SelectContent>
          {publicationTypes.map(type => (
            <SelectItem key={type} value={type}>
              {type === 'all' ? 'All Publication Types' : type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectTrigger className="w-full md:w-48 h-11">
          <SelectValue placeholder="All Publication Categories" />
        </SelectTrigger>
        <SelectContent>
          {categories.map(cat => (
            <SelectItem key={cat} value={cat}>
              {cat === 'all' ? 'All Publication Categories' : cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {tags.length > 1 && (
        <Select value={tagFilter} onValueChange={setTagFilter}>
          <SelectTrigger className="w-full md:w-48 h-11">
            <SelectValue placeholder="All Tags" />
          </SelectTrigger>
          <SelectContent>
            {tags.map(tag => (
              <SelectItem key={tag} value={tag}>
                {tag === 'all' ? 'All Tags' : tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {years.length > 1 && (
        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="w-full md:w-36 h-11">
            <SelectValue placeholder="All Years" />
          </SelectTrigger>
          <SelectContent>
            {years.map(year => (
              <SelectItem key={year} value={year}>
                {year === 'all' ? 'All Years' : year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {hasActiveFilters && (
        <button
          onClick={handleClearFilters}
          className="text-sm font-semibold hover:opacity-80 underline whitespace-nowrap transition-colors"
          style={{ color: 'var(--highlight)' }}
        >
          Clear Filters
        </button>
      )}
      {hasActiveFilters && (
        <p className="text-sm text-gray-400 w-full">
          Showing {filtered.length} of {items.length} publications
        </p>
      )}
    </div>
  );

  return (
    <div style={{ backgroundColor: 'var(--deep)' }}>
      {/* Hero banner */}
      <div className="text-white px-4 sm:px-8 text-center py-20 md:py-28 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(ellipse at 20% 10%, rgba(100, 200, 255, 0.2), transparent 60%), radial-gradient(ellipse at 80% 90%, rgba(255, 165, 0, 0.1), transparent 55%)',
          }}
        />
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Publications</h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Explore our research, reports, and resources on false solutions to the climate and circularity crisis.
          </p>
        </div>
      </div>

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
