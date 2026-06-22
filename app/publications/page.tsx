'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Header, Footer } from '@/components/layout'
import { ArticleListPage, ArticleDetailPage } from '@/components/features/articles'
import { Article } from '@/types/types'
import * as dataService from '@/lib/services/data-service'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

export default function Publications() {
  const [publications, setPublications] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)

  // Filter state
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [tagFilter, setTagFilter] = useState('all')
  const [yearFilter, setYearFilter] = useState('all')

  useEffect(() => {
    dataService.getPublishedPublications().then((data) => {
      setPublications(data)
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  // Derive unique filter options from data
  const categories = useMemo(() => {
    const cats = publications.map(p => p.category).filter(Boolean)
    return ['all', ...Array.from(new Set(cats)).sort()]
  }, [publications])

  const tags = useMemo(() => {
    const allTags = publications.flatMap(p => p.tags ?? [])
    return ['all', ...Array.from(new Set(allTags)).sort()]
  }, [publications])

  const years = useMemo(() => {
    const allYears = publications
      .map(p => p.publishDate ? new Date(p.publishDate).getFullYear().toString() : null)
      .filter(Boolean) as string[]
    return ['all', ...Array.from(new Set(allYears)).sort((a, b) => Number(b) - Number(a))]
  }, [publications])

  const hasActiveFilters = search !== '' || categoryFilter !== 'all' || tagFilter !== 'all' || yearFilter !== 'all'

  const filteredPublications = useMemo(() => {
    return publications.filter(pub => {
      const matchesSearch =
        search === '' ||
        pub.title.toLowerCase().includes(search.toLowerCase()) ||
        (pub.description ?? '').toLowerCase().includes(search.toLowerCase())

      const matchesCategory = categoryFilter === 'all' || pub.category === categoryFilter
      const matchesTag = tagFilter === 'all' || (pub.tags ?? []).includes(tagFilter)
      const matchesYear =
        yearFilter === 'all' ||
        (pub.publishDate && new Date(pub.publishDate).getFullYear().toString() === yearFilter)

      return matchesSearch && matchesCategory && matchesTag && matchesYear
    })
  }, [publications, search, categoryFilter, tagFilter, yearFilter])

  const handleClearFilters = () => {
    setSearch('')
    setCategoryFilter('all')
    setTagFilter('all')
    setYearFilter('all')
  }

  const handleIncrementDownload = (articleId: number) => {
    setPublications(prev =>
      prev.map(pub =>
        pub.id === articleId ? { ...pub, downloadCount: (pub.downloadCount || 0) + 1 } : pub
      )
    )
  }

  if (selectedArticle) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <ArticleDetailPage
            article={selectedArticle}
            onBack={() => setSelectedArticle(null)}
            sourcePage="publications"
          />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-white py-12 px-4 sm:px-8 lg:px-16">
        <div className="container mx-auto">
          {/* Filter bar */}
          <div className="flex flex-col md:flex-row gap-3 mb-8 items-start md:items-center flex-wrap">
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
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="text-brand-dark-blue text-lg font-semibold">Loading publications...</div>
            </div>
          ) : (
            <>
              {hasActiveFilters && (
                <p className="text-sm text-gray-500 mb-4">
                  Showing {filteredPublications.length} of {publications.length} publications
                </p>
              )}
              <ArticleListPage
                title="Publications"
                items={filteredPublications}
                onViewArticle={setSelectedArticle}
                onIncrementDownload={handleIncrementDownload}
              />
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}