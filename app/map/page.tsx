'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Header } from '@/components/layout'
import { MapPage } from '@/components/features/map'
import { Project } from '@/types/types'
import { getIfiAbbreviation } from '@/lib/constants'
import * as dataService from '@/lib/services/data-service'

export default function Map() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Prevent body scrolling on map page
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  // Fetch projects from database
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true)
        const projectsData = await dataService.getPublishedProjectsWithDetails()
        setProjects(projectsData)
      } catch (error) {
        console.error('Failed to load projects:', error)
        setProjects([])
      } finally {
        setIsLoading(false)
      }
    }

    loadProjects()
  }, [])

  const filterOptions = useMemo(() => {
    const parseDetail = (details: string, key: string) => {
      const match = details.match(new RegExp(`\\*\\*${key}:\\*\\*(.*)`))
      return match ? match[1].trim() : ''
    }

    // Only include countries that have published projects and are not empty
    const countries = ['all', ...Array.from(new Set(projects
      .filter(p => p.status === 'published' || p.status === undefined)
      .map(p => p.country)
      .filter(c => c && c.trim() !== '')
    )).sort()]
    const solutionTypes = ['all', ...Array.from(new Set(projects.filter(p => p.status === 'published' || p.status === undefined).flatMap(p => p.corruptionType.split(',').map((s: string) => s.trim()).filter(s => s !== ''))))]
    const ifis = ['all', ...Array.from(new Set(projects.filter(p => p.status === 'published' || p.status === undefined).map(p => getIfiAbbreviation(parseDetail(p.details, 'IFI') || 'N/A')).filter(ifi => ifi && ifi !== 'N/A')))]
    const projectStatuses = ['all', ...Array.from(new Set(projects.filter(p => p.status === 'published' || p.status === undefined).map(p => parseDetail(p.details, 'Project Status')).filter(status => status && status !== '')))]

    return {
      countries,
      solutionTypes,
      ifis,
      projectStatuses
    }
  }, [projects])

  return (
    <div className="flex flex-col h-screen overflow-hidden w-full">
      <Header />
      <main className="flex-grow overflow-hidden w-full">
        <MapPage 
          projects={projects}
          filterOptions={filterOptions}
        />
      </main>
    </div>
  )
}