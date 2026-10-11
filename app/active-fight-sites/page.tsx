'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Header, Footer } from '@/components/layout'
import { ProjectBrief } from '@/types/types'
import * as dataService from '@/lib/services/data-service'
import { projectBriefsToArticles } from '@/lib/utils/slug-utils'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function BriefCard({ brief, href }: { brief: ProjectBrief; href: string }) {
  const imageUrl = brief.photos && brief.photos.length > 0 ? brief.photos[0] : '/fallback-project-image.svg'
  
  const cardContent = (
    <div className="border rounded-lg shadow-md transition-all duration-300 flex flex-col overflow-hidden h-full hover:shadow-xl cursor-pointer group" style={{ borderColor: '#2f4059', backgroundColor: 'rgba(26, 95, 122, 0.1)' }}>
      {/* Image Section */}
      <div className="relative overflow-hidden h-40 bg-gray-700">
        <img
          src={imageUrl}
          alt={brief.project_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/fallback-project-image.svg'
          }}
        />
      </div>
      
      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        <span className="text-xs font-bold px-2 py-1 inline-block mb-3 self-start rounded" style={{ backgroundColor: 'var(--highlight)', color: '#0a1628' }}>
          {brief.project_type || 'Project Brief'}
        </span>
        <h3 className="text-lg font-bold flex-grow text-white">
          {brief.project_name}
        </h3>
        <div className="mt-4 self-start">
          <span className="text-sm font-bold hover:underline transition-colors" style={{ color: '#64b5ff' }}>
            View Details &rarr;
          </span>
        </div>
      </div>
    </div>
  )

  return (
    <Link href={href}>
      {cardContent}
    </Link>
  )
}

export default function ActiveFightSites() {
  const [briefs, setBriefs] = useState<ProjectBrief[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [countryFilter, setCountryFilter] = useState('all')
  const [projectTypeFilter, setProjectTypeFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')

  const briefSlugById = React.useMemo(() => {
    const map = new Map<number, string>()
    for (const article of projectBriefsToArticles(briefs)) {
      map.set(article.id, article.slug)
    }
    return map
  }, [briefs])

  const countries = useMemo(() => {
    const allCountries = briefs.map(b => b.country).filter(Boolean) as string[]
    return ['all', ...Array.from(new Set(allCountries)).sort()]
  }, [briefs])

  const projectTypes = useMemo(() => {
    const allTypes = briefs.map(b => b.project_type).filter(Boolean) as string[]
    return ['all', ...Array.from(new Set(allTypes)).sort()]
  }, [briefs])

  const hasActiveFilters = search !== '' || countryFilter !== 'all' || projectTypeFilter !== 'all'

  const filtered = useMemo(() => {
    let results = briefs.filter(brief => {
      const matchesSearch =
        search === '' ||
        brief.project_name.toLowerCase().includes(search.toLowerCase()) ||
        (brief.location ?? '').toLowerCase().includes(search.toLowerCase())
      const matchesCountry = countryFilter === 'all' || brief.country === countryFilter
      const matchesType = projectTypeFilter === 'all' || brief.project_type === projectTypeFilter
      return matchesSearch && matchesCountry && matchesType
    })

    results.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
    })

    return results
  }, [briefs, search, countryFilter, projectTypeFilter, sortOrder])

  const handleClearFilters = () => {
    setSearch('')
    setCountryFilter('all')
    setProjectTypeFilter('all')
    setSortOrder('newest')
  }

  useEffect(() => {
    dataService.getPublishedProjectBriefs().then(setBriefs).catch(console.error).finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow" style={{ backgroundColor: 'var(--deep)' }}>
        {/* Header Section */}
        <section className="py-16 px-4 sm:px-8 text-white border-b" style={{ borderColor: 'rgba(255, 165, 0, 0.1)' }}>
          <div className="container mx-auto">
            <div className="text-xs uppercase tracking-[0.32em] mb-4" style={{ color: '#aeb9cc' }}>Active Resistance</div>
            <h1 className="text-5xl font-bold mb-4">
              <span style={{ color: 'white' }}>Active Fight Sites</span>
            </h1>
            <p className="text-lg max-w-3xl" style={{ color: '#aeb9cc' }}>
              Communities around the world resisting false solutions — incinerators, chemical recycling plants, and greenwashed projects threatening their environments.
            </p>
          </div>
        </section>

        {/* Filters Section */}
        <section className="px-4 sm:px-8 py-8 text-white" style={{ borderColor: '#2a394c' }}>
          <div className="container mx-auto">
            {/* Country Buttons */}
            <div className="flex flex-wrap gap-2 pb-6 border-b" style={{ borderColor: '#2a394c' }}>
              {countries.map(country => (
                <button
                  key={country}
                  onClick={() => setCountryFilter(country)}
                  className="px-4 py-2 rounded font-medium transition-all duration-200"
                  style={{
                    backgroundColor: countryFilter === country ? '#e2982b' : '#112649',
                    color: countryFilter === country ? '#020e21' : '#c5ced9',
                    border: 'none',
                    fontSize: '14px',
                  }}
                  onMouseEnter={(e) => {
                    if (countryFilter !== country) {
                      e.currentTarget.style.backgroundColor = '#0e2141'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (countryFilter !== country) {
                      e.currentTarget.style.backgroundColor = '#112649'
                    }
                  }}
                >
                  {country === 'all' ? 'All countries' : country}
                </button>
              ))}
            </div>

            {/* Search and Filters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[minmax(240px,1fr)_180px_140px_170px] gap-4 pt-6">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4" style={{ color: '#6b7a8f' }} />
                <Input
                  placeholder="Search sites..."
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

              {/* Project Type Filter */}
              {projectTypes.length > 1 && (
                <Select value={projectTypeFilter} onValueChange={setProjectTypeFilter}>
                  <SelectTrigger className="h-10" style={{
                    backgroundColor: '#0d1b2a',
                    borderColor: '#2f4059',
                    color: '#a0b0c8',
                  }}>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent style={{
                    backgroundColor: '#0d1b2a',
                    borderColor: '#2f4059',
                  }}>
                    {projectTypes.map(type => (
                      <SelectItem 
                        key={type} 
                        value={type}
                        className="hover:bg-cyan-500/20"
                        style={{
                          color: projectTypeFilter === type ? '#06b6d4' : '#a0b0c8',
                        }}
                      >
                        {type === 'all' ? 'All Types' : type}
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
                {filtered.length} {filtered.length === 1 ? 'site' : 'sites'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm rounded border transition-colors"
                  style={{
                    color: '#ff6b6b',
                    borderColor: '#ff6b6b',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 107, 107, 0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <X className="size-4" />
                  Clear
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="py-12 px-4 sm:px-8 lg:px-16">
          <div className="container mx-auto">
            {loading ? (
              <div className="flex justify-center items-center py-24">
                <div className="text-lg font-semibold" style={{ color: '#aeb9cc' }}>Loading active fight sites...</div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24" style={{ color: '#aeb9cc' }}>No active fight sites found.</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filtered.map(brief => (
                    <BriefCard key={brief.id} brief={brief} href={`/active-fight-sites/${briefSlugById.get(brief.id) || ''}`} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
