'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Header, Footer } from '@/components/layout'
import { MapPage } from '@/components/features/map'
import { Page, Filters, Project } from '@/types/types'
import { projectCardsData, getIfiAbbreviation } from '@/lib/constants'

export default function Map() {
  const router = useRouter()

  const [filters, setFilters] = useState<Filters>({
    country: 'all',
    solutionType: 'all',
    ifi: 'all',
    projectStatus: 'all'
  })

  const handleNavigate = (page: Page) => {
    if (page === 'home') {
      router.push('/')
    } else {
      router.push(`/${page}`)
    }
  }

  const handleFilterChange = (filterName: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }))
  }

  const filterOptions = useMemo(() => {
    const parseDetail = (details: string, key: string) => {
      const match = details.match(new RegExp(`\\*\\*${key}:\\*\\*(.*)`))
      return match ? match[1].trim() : ''
    }

    const countries = ['all', ...Array.from(new Set(projectCardsData.map(p => p.country)))]
    const solutionTypes = ['all', ...Array.from(new Set(projectCardsData.flatMap(p => p.corruptionType.split(',').map((s: string) => s.trim()))))]
    const ifis = ['all', ...Array.from(new Set(projectCardsData.map(p => getIfiAbbreviation(parseDetail(p.details, 'IFI') || 'N/A'))))]
    const projectStatuses = ['all', ...Array.from(new Set(projectCardsData.map(p => parseDetail(p.details, 'Project Status'))))].filter(status => status && status !== 'N/A')

    return {
      countries,
      solutionTypes,
      ifis,
      projectStatuses
    }
  }, [])

  const filteredProjects = useMemo(() => {
    const parseDetail = (details: string, key: string) => {
      const match = details.match(new RegExp(`\\*\\*${key}:\\*\\*(.*)`))
      return match ? match[1].trim() : ''
    }

    return projectCardsData.filter((project: Project) => {
      const publishedMatch = project.status === 'published' || project.status === undefined
      const countryMatch = filters.country === 'all' || project.country === filters.country
      const solutionMatch = filters.solutionType === 'all' || project.corruptionType.includes(filters.solutionType)
      const ifiMatch = filters.ifi === 'all' || getIfiAbbreviation(parseDetail(project.details, 'IFI') || 'N/A') === filters.ifi
      const statusMatch = filters.projectStatus === 'all' || parseDetail(project.details, 'Project Status') === filters.projectStatus

      return publishedMatch && countryMatch && solutionMatch && ifiMatch && statusMatch
    })
  }, [filters])

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        activePage="map"
        onNavigate={handleNavigate}
      />
      <main className="flex-grow">
        <MapPage 
          projects={filteredProjects}
          filters={filters}
          onFilterChange={handleFilterChange}
          filterOptions={filterOptions}
        />
      </main>
      <Footer />
    </div>
  )
}