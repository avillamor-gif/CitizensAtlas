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
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');

  const categories = useMemo(() => {
    const cats = items.map(p => p.category).filter(Boolean);
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

  const hasActiveFilters = search !== '' || categoryFilter !== 'all' || tagFilter !== 'all' || yearFilter !== 'all';

  const filtered = useMemo(() => {
    return items.filter(pub => {
      const matchesSearch =
        search === '' ||
        pub.title.toLowerCase().includes(search.toLowerCase()) ||
        (pub.description ?? '').toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || pub.category === categoryFilter;
      const matchesTag = tagFilter === 'all' || (pub.tags ?? []).includes(tagFilter);
      const matchesYear =
        yearFilter === 'all' ||
        (pub.publishDate && new Date(pub.publishDate).getFullYear().toString() === yearFilter);
      return matchesSearch && matchesCategory && matchesTag && matchesYear;
    });
  }, [items, search, categoryFilter, tagFilter, yearFilter]);

  const handleClearFilters = () => {
    setSearch('');
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
          className="text-sm font-semibold text-brand-dark-blue hover:text-brand-medium-blue underline whitespace-nowrap"
        >
          Clear Filters
        </button>
      )}
      {hasActiveFilters && (
        <p className="text-sm text-gray-500 w-full">
          Showing {filtered.length} of {items.length} publications
        </p>
      )}
    </div>
  );

  return (
    <div>
      {/* Blue banner */}
      <div className="bg-brand-dark-blue text-white px-4 sm:px-8 text-center min-h-[240px] flex flex-col justify-center items-center">
        <div>
          <h1 className="text-5xl font-extrabold mb-4">Publications</h1>
          <p className="text-xl max-w-3xl mx-auto">
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
