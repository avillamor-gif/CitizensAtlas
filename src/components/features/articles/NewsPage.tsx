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

interface NewsPageProps {
  items: Article[];
  onViewArticle: (article: Article) => void;
}

const NewsPage: React.FC<NewsPageProps> = ({ items, onViewArticle }) => {
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
    return items.filter(article => {
      const matchesSearch =
        search === '' ||
        article.title.toLowerCase().includes(search.toLowerCase()) ||
        (article.description ?? '').toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter;
      const matchesYear =
        yearFilter === 'all' ||
        (article.publishDate && new Date(article.publishDate).getFullYear().toString() === yearFilter);
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
        placeholder="Search news..."
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
          className="text-sm font-semibold underline whitespace-nowrap transition-colors hover:opacity-80"
          style={{ color: 'var(--highlight)' }}
        >
          Clear Filters
        </button>
      )}
      {hasActiveFilters && (
        <p className="text-sm w-full" style={{ color: '#aeb9cc' }}>
          Showing {filtered.length} of {items.length} articles
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
          <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 400, fontSize: '72px', lineHeight: '73px', marginBottom: '1rem' }}>
            <span style={{ color: 'white' }}>Latest </span>
            <span style={{ color: 'var(--highlight)' }}>News</span>
          </h1>
          <p className="text-lg max-w-3xl" style={{ color: '#aeb9cc' }}>
            Waste, development finance and the communities at the heart of it.
          </p>
        </div>
      </section>
      <ArticleListPage
        title="Latest News"
        items={filtered}
        onViewArticle={onViewArticle}
        filterBar={filterBar}
        hideTitle
      />
    </div>
  );
};

export default NewsPage;
