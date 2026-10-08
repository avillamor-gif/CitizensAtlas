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

interface VideosPageProps {
  items: Article[];
  onViewArticle: (article: Article) => void;
}

const VideosPage: React.FC<VideosPageProps> = ({ items, onViewArticle }) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');

  const categories = useMemo(() => {
    const cats = items.map(a => a.category).filter(Boolean);
    return ['all', ...Array.from(new Set(cats)).sort()];
  }, [items]);

  const years = useMemo(() => {
    const allYears = items
      .map(a => a.publishDate ? new Date(a.publishDate).getFullYear().toString() : null)
      .filter(Boolean) as string[];
    return ['all', ...Array.from(new Set(allYears)).sort((a, b) => Number(b) - Number(a))];
  }, [items]);

  const hasActiveFilters = search !== '' || categoryFilter !== 'all' || yearFilter !== 'all';

  const filtered = useMemo(() => {
    return items.filter(video => {
      const matchesSearch =
        search === '' ||
        video.title.toLowerCase().includes(search.toLowerCase()) ||
        (video.description ?? '').toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || video.category === categoryFilter;
      const matchesYear =
        yearFilter === 'all' ||
        (video.publishDate && new Date(video.publishDate).getFullYear().toString() === yearFilter);
      return matchesSearch && matchesCategory && matchesYear;
    });
  }, [items, search, categoryFilter, yearFilter]);

  const handleClearFilters = () => {
    setSearch('');
    setCategoryFilter('all');
    setYearFilter('all');
  };

  const filterBar = (
    <div className="flex flex-col md:flex-row gap-3 items-start md:items-center flex-wrap">
      <Input
        placeholder="Search videos..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full md:w-64 h-11"
      />
      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectTrigger className="w-full md:w-48 h-11">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          {categories.map(cat => (
            <SelectItem key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
          className="text-sm font-semibold text-brand-dark-blue hover:text-brand-medium-blue underline whitespace-nowrap"
        >
          Clear Filters
        </button>
      )}
      {hasActiveFilters && (
        <p className="text-sm text-gray-500 w-full">
          Showing {filtered.length} of {items.length} videos
        </p>
      )}
    </div>
  );

  return (
    <div style={{ backgroundColor: 'var(--deep)' }}>
      {/* Header Section */}
      <section className="py-16 px-4 sm:px-8 text-white border-b" style={{ borderColor: 'rgba(255, 165, 0, 0.1)' }}>
        <div className="container mx-auto">
          <div className="text-xs uppercase tracking-[0.32em] mb-4" style={{ color: '#aeb9cc' }}>From the Field</div>
          <h1 className="text-5xl font-bold mb-4">
            <span style={{ color: 'white' }}>Videos</span>
          </h1>
          <p className="text-lg max-w-3xl" style={{ color: '#aeb9cc' }}>
            Watch documentaries, community testimonies, and campaign videos on environmental justice and resistance to false solutions.
          </p>
        </div>
      </section>
      <ArticleListPage
        title="Videos"
        items={filtered}
        onViewArticle={onViewArticle}
        filterBar={filterBar}
        hideTitle
      />
    </div>
  );
};

export default VideosPage;
