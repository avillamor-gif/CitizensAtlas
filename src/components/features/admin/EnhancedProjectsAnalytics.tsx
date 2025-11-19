'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { Project, User } from '@/types/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart'
import { hasPermission } from '@/hooks/useRolePermissions'
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer, Tooltip } from 'recharts'
import { getIfiAbbreviation, solutionTypeColors } from '@/lib/constants'
import { TrendingUp, DollarSign, Globe, AlertCircle, Calendar, MapPin, Users, FileText, MoreVertical, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getChartVisibilitySettings, updateChartVisibility } from '@/lib/services/supabase-service'

// Helper functions
const parseDetail = (details: string, key: string): string => {
  const match = details.match(new RegExp(`\\*\\*${key}:\\*\\*(.*)`))
  return match ? match[1].trim() : 'N/A'
}

const parseCurrency = (currencyString: string): number => {
  if (!currencyString) return 0
  const numberString = currencyString.replace(/[$,€]/g, '').replace(/,/g, '')
  return parseFloat(numberString) || 0
}

// Pie Chart Label Helper
const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.05) return null
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor="middle" 
      dominantBaseline="central" 
      fontSize="12px" 
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

// Stat Card Component
const StatCard: React.FC<{ 
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: string
  description?: string
}> = ({ title, value, icon, trend, description }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {trend && (
        <p className="text-xs text-muted-foreground mt-1">
          <TrendingUp className="inline h-3 w-3 mr-1" />
          {trend}
        </p>
      )}
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </CardContent>
  </Card>
)

// Frontend Visibility Chart Card - for charts that can be toggled on frontend
interface FrontendChartCardProps {
  chartId: 'topCountries' | 'falseSolutionTypes' | 'investmentByCountry' | 'projectsTimeline' | 
           'projectsByIFI' | 'investmentByIFI' | 'projectsByRegion' | 'gaiaSupport' | 
           'projectStatus' | 'communityActions' | 'submissionTrend'
  title: string
  description?: string
  children: React.ReactNode
  isVisibleOnFrontend: boolean
  onToggleVisibility: (chartId: string, visible: boolean) => void
  isSuperAdmin: boolean
  className?: string
}

const FrontendChartCard: React.FC<FrontendChartCardProps> = ({ 
  chartId, 
  title,
  description,
  children,
  isVisibleOnFrontend,
  onToggleVisibility,
  isSuperAdmin,
  className = "col-span-2 lg:col-span-1"
}) => (
  <Card className={className}>
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {description && <CardDescription className="mt-1.5">{description}</CardDescription>}
        </div>
        {isSuperAdmin && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 ml-2 flex-shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onToggleVisibility(chartId, !isVisibleOnFrontend)}>
                {isVisibleOnFrontend ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Hide from frontend
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Show on frontend
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      {!isVisibleOnFrontend && isSuperAdmin && (
        <CardDescription className="text-xs text-orange-600 mt-2">
          Hidden from public dashboard
        </CardDescription>
      )}
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
)

const COLORS = ['#3B82F6', '#10B981', '#FBBF24', '#A855F7', '#EF4444', '#6366F1', '#F97316', '#EC4899', '#14B8A6', '#F59E0B']

const EnhancedProjectsAnalytics: React.FC<{ projects: Project[]; currentUser?: User | null }> = ({ projects, currentUser }) => {
  // Check if user has permission to toggle chart visibility (reactive to localStorage changes)
  const [canToggleChartVisibility, setCanToggleChartVisibility] = useState(
    hasPermission(currentUser?.role, 'Chart Visibility Toggle')
  )
  
  // Re-check permissions when localStorage changes or user changes
  useEffect(() => {
    const checkPermission = () => {
      const hasAccess = hasPermission(currentUser?.role, 'Chart Visibility Toggle')
      setCanToggleChartVisibility(hasAccess)
      console.log('[Analytics] Chart Visibility Toggle permission:', hasAccess, 'for role:', currentUser?.role)
    }
    
    checkPermission()
    
    // Listen for localStorage changes (from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'role_permissions') {
        console.log('[Analytics] Permissions updated in localStorage (other tab), rechecking...')
        checkPermission()
      }
    }
    
    // Listen for custom event (from same tab)
    const handlePermissionsUpdated = () => {
      console.log('[Analytics] Permissions updated (same tab), rechecking...')
      checkPermission()
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('role-permissions-updated', handlePermissionsUpdated)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('role-permissions-updated', handlePermissionsUpdated)
    }
  }, [currentUser?.role])
  
  // Frontend visibility state for ALL charts
  const [frontendVisibility, setFrontendVisibility] = useState({
    topCountries: true,
    falseSolutionTypes: true,
    investmentByCountry: true,
    projectsTimeline: true,
    projectsByIFI: true,
    investmentByIFI: true,
    projectsByRegion: true,
    gaiaSupport: true,
    projectStatus: true,
    communityActions: true,
    submissionTrend: true,
  })

  // Load visibility settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await getChartVisibilitySettings()
        const visibilityMap: any = {}
        settings.forEach(setting => {
          visibilityMap[setting.chart_id] = setting.is_visible
        })
        setFrontendVisibility(prev => ({ ...prev, ...visibilityMap }))
      } catch (error) {
        console.error('Failed to load chart visibility settings:', error)
      }
    }
    loadSettings()
  }, [])

  // Toggle visibility handler
  const handleToggleVisibility = async (chartId: string, visible: boolean) => {
    console.log(`[Analytics] Toggling chart ${chartId} to ${visible ? 'VISIBLE' : 'HIDDEN'}`)
    try {
      // Optimistically update UI
      setFrontendVisibility(prev => ({ ...prev, [chartId]: visible }))
      
      // Save to database
      await updateChartVisibility(chartId, visible)
      
      console.log(`[Analytics] ✅ Successfully toggled chart ${chartId}`)
      
      // Show success message
      alert(`✅ Chart visibility updated! ${visible ? 'Chart will now appear' : 'Chart is now hidden'} on the public dashboard.`)
    } catch (error) {
      console.error('[Analytics] ❌ Failed to update chart visibility:', error)
      // Revert on error
      setFrontendVisibility(prev => ({ ...prev, [chartId]: !visible }))
      
      // Show error message
      alert('❌ Failed to update chart visibility. Please check your permissions and try again.')
    }
  }

  const analyticsData = useMemo(() => {
    if (!projects || projects.length === 0) {
      return {
        totalProjects: 0,
        totalInvestment: 0,
        countryCount: 0,
        avgInvestmentPerProject: 0,
        mostCommonSolution: 'N/A',
        mostActiveIFI: 'N/A',
        publishedVsDraft: { published: 0, draft: 0 },
        projectsByCountryData: [],
        projectsByStatusData: [],
        projectsByIFIData: [],
        projectsBySolutionData: [],
        projectsOverTimeData: [],
        projectsByRegionData: [],
        communityActionsData: [],
        investmentByCountryData: [],
        investmentByIFIData: [],
        projectDensityData: [],
        submissionTrendData: [],
        gaiaSupportData: [],
      }
    }

    const totalProjects = projects.length
    const totalInvestment = projects.reduce((sum, p) => sum + parseCurrency(parseDetail(p.details, 'Total Project Amount')), 0)
    const countries = new Set(projects.map(p => p.country))
    const avgInvestmentPerProject = totalInvestment / totalProjects

    // Published vs Draft
    const publishedVsDraft = projects.reduce((acc, p) => {
      if (p.status === 'published') acc.published++
      else acc.draft++
      return acc
    }, { published: 0, draft: 0 })

    // Projects by Country
    const projectsByCountry = projects.reduce((acc, p) => {
      acc[p.country] = (acc[p.country] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const projectsByCountryData = Object.entries(projectsByCountry)
      .map(([name, value]) => ({ name, projects: value }))
      .sort((a, b) => b.projects - a.projects)
      .slice(0, 15)

    // Projects by Status
    const projectsByStatus = projects.reduce((acc, p) => {
      const status = parseDetail(p.details, 'Project Status') || 'N/A'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const projectsByStatusData = Object.entries(projectsByStatus).map(([name, value]) => ({ name, value }))

    // Projects by IFI
    const projectsByIFI = projects.reduce((acc, p) => {
      const ifi = getIfiAbbreviation(parseDetail(p.details, 'IFI') || 'N/A')
      acc[ifi] = (acc[ifi] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const projectsByIFIData = Object.entries(projectsByIFI)
      .map(([name, value]) => ({ name, projects: value }))
      .sort((a, b) => b.projects - a.projects)
      .slice(0, 10)
    const mostActiveIFI = projectsByIFIData[0]?.name || 'N/A'

    // False Solution Types
    const solutionTypes = projects.flatMap(p => p.corruptionType.split(',').map(t => t.trim())).filter(Boolean)
    const projectsBySolution = solutionTypes.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const mostCommonSolution = Object.entries(projectsBySolution).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
    const projectsBySolutionData = Object.entries(projectsBySolution).map(([name, value]) => ({ name, value }))

    // Projects Over Time
    const projectsOverTime = projects.reduce((acc, p) => {
      const yearMatch = p.date.match(/\d{4}/)
      const year = yearMatch ? parseInt(yearMatch[0], 10) : null
      if (year) {
        acc[year] = (acc[year] || 0) + 1
      }
      return acc
    }, {} as Record<number, number>)
    const projectsOverTimeData = Object.entries(projectsOverTime)
      .map(([name, projects]) => ({ year: name, projects }))
      .sort((a, b) => Number(a.year) - Number(b.year))

    // Projects by Region
    const projectsByRegion = projects.reduce((acc, p) => {
      const region = parseDetail(p.details, 'Region') || 'N/A'
      acc[region] = (acc[region] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const projectsByRegionData = Object.entries(projectsByRegion).map(([name, value]) => ({ name, value }))

    // Community Actions
    const communityActions = projects
      .flatMap(p => parseDetail(p.details, 'Types of Actions').split(','))
      .map(action => action.trim())
      .filter(Boolean)
      .reduce((acc, action) => {
        acc[action] = (acc[action] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    const communityActionsData = Object.entries(communityActions)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)

    // Investment by Country
    const investmentByCountry = projects.reduce((acc, p) => {
      const investment = parseCurrency(parseDetail(p.details, 'Total Project Amount'))
      acc[p.country] = (acc[p.country] || 0) + investment
      return acc
    }, {} as Record<string, number>)
    const investmentByCountryData = Object.entries(investmentByCountry)
      .map(([name, value]) => ({ name, investment: value / 1_000_000 })) // Convert to millions
      .sort((a, b) => b.investment - a.investment)
      .slice(0, 10)

    // Investment by IFI
    const investmentByIFI = projects.reduce((acc, p) => {
      const ifi = getIfiAbbreviation(parseDetail(p.details, 'IFI') || 'N/A')
      const investment = parseCurrency(parseDetail(p.details, 'Total Project Amount'))
      acc[ifi] = (acc[ifi] || 0) + investment
      return acc
    }, {} as Record<string, number>)
    const investmentByIFIData = Object.entries(investmentByIFI)
      .map(([name, value]) => ({ name, investment: value / 1_000_000 })) // Convert to millions
      .sort((a, b) => b.investment - a.investment)
      .slice(0, 8)

    // Submission Trend (if submittedAt is available)
    const submissionTrend = projects
      .filter(p => p.submittedAt)
      .reduce((acc, p) => {
        const date = new Date(p.submittedAt!)
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        acc[monthYear] = (acc[monthYear] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    const submissionTrendData = Object.entries(submissionTrend)
      .map(([date, count]) => ({ date, submissions: count }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // GAIA Support Data
    const gaiaSupportCounts: Record<string, number> = { 'Yes': 0, 'No': 0, 'N/A': 0 }
    projects.forEach(p => {
      const support = parseDetail(p.details, 'Active GAIA Support') || 'N/A'
      if (support === 'Yes') {
        gaiaSupportCounts['Yes']++
      } else if (support === 'No') {
        gaiaSupportCounts['No']++
      } else {
        gaiaSupportCounts['N/A']++
      }
    })
    const gaiaSupportData = Object.entries(gaiaSupportCounts)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    return {
      totalProjects,
      totalInvestment,
      countryCount: countries.size,
      avgInvestmentPerProject,
      mostCommonSolution,
      mostActiveIFI,
      publishedVsDraft,
      projectsByCountryData,
      projectsByStatusData,
      projectsByIFIData,
      projectsBySolutionData,
      projectsOverTimeData,
      projectsByRegionData,
      communityActionsData,
      investmentByCountryData,
      investmentByIFIData,
      submissionTrendData,
      gaiaSupportData,
    }
  }, [projects])

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Projects Analytics</h2>
        <p className="text-sm text-gray-600 mt-1">
          Comprehensive analysis of {analyticsData.totalProjects} projects across {analyticsData.countryCount} countries
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Projects"
          value={analyticsData.totalProjects.toLocaleString()}
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
          description={`${analyticsData.publishedVsDraft.published} published, ${analyticsData.publishedVsDraft.draft} draft`}
        />
        <StatCard
          title="Total Investment"
          value={`$${(analyticsData.totalInvestment / 1_000_000_000).toFixed(2)}B`}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          description={`Avg: $${(analyticsData.avgInvestmentPerProject / 1_000_000).toFixed(1)}M per project`}
        />
        <StatCard
          title="Countries"
          value={analyticsData.countryCount}
          icon={<Globe className="h-4 w-4 text-muted-foreground" />}
          description="Global reach across regions"
        />
        <StatCard
          title="Top Issue"
          value={analyticsData.mostCommonSolution}
          icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
          description={`Most identified false solution`}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Projects by Country */}
        <FrontendChartCard 
          chartId="topCountries"
          title="Top Countries by Project Count"
          description="Projects distribution across countries"
          isVisibleOnFrontend={frontendVisibility.topCountries}
          onToggleVisibility={handleToggleVisibility}
          isSuperAdmin={canToggleChartVisibility}
        >
          <ChartContainer config={{}} className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.projectsByCountryData} layout="vertical" margin={{ left: 80, right: 15, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={70} tick={{ fontSize: 9 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="projects" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </FrontendChartCard>

        {/* Projects by Solution Type - Frontend Visible */}
        <FrontendChartCard 
          chartId="falseSolutionTypes"
          title="Projects by False Solution Type"
          description="Distribution of identified issues"
          isVisibleOnFrontend={frontendVisibility.falseSolutionTypes}
          onToggleVisibility={handleToggleVisibility}
          isSuperAdmin={canToggleChartVisibility}
        >
          <div className="flex flex-col items-center w-full h-full">
            <div className="relative w-full h-[180px]">
              {/* Center Total Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-3xl font-extrabold text-brand-dark-blue">{analyticsData.totalProjects}</span>
                <span className="text-xs text-gray-600 font-medium">Total Projects</span>
              </div>
              <ChartContainer 
                config={analyticsData.projectsBySolutionData.reduce((acc, entry, index) => {
                  acc[entry.name] = {
                    label: entry.name,
                    color: solutionTypeColors[entry.name]?.hex || '#8884d8',
                  }
                  return acc
                }, {} as any)} 
                className="h-full w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.projectsBySolutionData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={2}
                      labelLine={false}
                      label={renderCustomizedLabel}
                    >
                      {analyticsData.projectsBySolutionData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={solutionTypeColors[entry.name]?.hex || '#8884d8'} 
                        />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            {/* Legend Below Chart */}
            <div className="w-full mt-2">
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 w-full px-2">
                {analyticsData.projectsBySolutionData.map((entry, index) => (
                  <div key={`item-${index}`} className="flex items-center">
                    <span
                      className="w-2 h-2 rounded-full mr-1.5 flex-shrink-0"
                      style={{ backgroundColor: solutionTypeColors[entry.name]?.hex || '#8884d8' }}
                    />
                    <span className="text-[10px] text-gray-700 truncate" title={entry.name}>
                      {entry.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FrontendChartCard>

        {/* Investment by Country */}
        <FrontendChartCard 
          chartId="investmentByCountry"
          title="Investment by Country"
          description="Total investment in millions (USD)"
          isVisibleOnFrontend={frontendVisibility.investmentByCountry}
          onToggleVisibility={handleToggleVisibility}
          isSuperAdmin={canToggleChartVisibility}
        >
          <ChartContainer config={{}} className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.investmentByCountryData} margin={{ left: 0, right: 5, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 8 } as any} 
                  height={60} 
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 9 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="investment" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </FrontendChartCard>

        {/* Projects Over Time */}
        <FrontendChartCard 
          chartId="projectsTimeline"
          title="Projects Timeline"
          description="Project submissions over years"
          isVisibleOnFrontend={frontendVisibility.projectsTimeline}
          onToggleVisibility={handleToggleVisibility}
          isSuperAdmin={canToggleChartVisibility}
        >
          <ChartContainer config={{}} className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.projectsOverTimeData} margin={{ left: -25, right: 5, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fontSize: 9 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 9 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="projects"
                  stroke="#A855F7"
                  strokeWidth={2}
                  dot={{ fill: '#A855F7', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </FrontendChartCard>

        {/* Projects by IFI - Frontend Visible */}
        <FrontendChartCard 
          chartId="projectsByIFI"
          title="Projects by Financial Institution"
          description="Top IFIs involved in projects"
          isVisibleOnFrontend={frontendVisibility.projectsByIFI}
          onToggleVisibility={handleToggleVisibility}
          isSuperAdmin={canToggleChartVisibility}
        >
          <ChartContainer config={{}} className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.projectsByIFIData} margin={{ left: -25, right: 5, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 8 }} angle={-45} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 9 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="projects" fill="#F97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </FrontendChartCard>

        {/* Investment by IFI - Frontend Visible */}
        <FrontendChartCard 
          chartId="investmentByIFI"
          title="Investment by IFI"
          description="Financial backing in millions (USD)"
          isVisibleOnFrontend={frontendVisibility.investmentByIFI}
          onToggleVisibility={handleToggleVisibility}
          isSuperAdmin={canToggleChartVisibility}
        >
          <ChartContainer config={{}} className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.investmentByIFIData} margin={{ left: -25, right: 5, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 8 }} angle={-45} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 9 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="investment" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </FrontendChartCard>

        {/* Projects by Region */}
        <FrontendChartCard 
          chartId="projectsByRegion"
          title="Projects by Region"
          description="Geographic distribution"
          isVisibleOnFrontend={frontendVisibility.projectsByRegion}
          onToggleVisibility={handleToggleVisibility}
          isSuperAdmin={canToggleChartVisibility}
        >
          <ChartContainer config={{}} className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.projectsByRegionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  label
                >
                  {analyticsData.projectsByRegionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
        </FrontendChartCard>

        {/* GAIA Support - Frontend Visible */}
        <FrontendChartCard 
          chartId="gaiaSupport"
          title="Active GAIA Support"
          description="Projects with active GAIA involvement"
          isVisibleOnFrontend={frontendVisibility.gaiaSupport}
          onToggleVisibility={handleToggleVisibility}
          isSuperAdmin={canToggleChartVisibility}
        >
          <ChartContainer config={{}} className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.gaiaSupportData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  label
                >
                  {analyticsData.gaiaSupportData.map((entry, index) => {
                    const colors: Record<string, string> = {
                      'Yes': '#22c55e',
                      'No': '#ef4444',
                      'N/A': '#94a3b8'
                    }
                    return (
                      <Cell key={`cell-${index}`} fill={colors[entry.name] || COLORS[index % COLORS.length]} />
                    )
                  })}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </FrontendChartCard>

        {/* Project Status - Frontend Visible */}
        <FrontendChartCard 
          chartId="projectStatus"
          title="Project Status Distribution"
          description="Current status of all projects"
          isVisibleOnFrontend={frontendVisibility.projectStatus}
          onToggleVisibility={handleToggleVisibility}
          isSuperAdmin={canToggleChartVisibility}
        >
          <ChartContainer config={{}} className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.projectsByStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  label
                >
                  {analyticsData.projectsByStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </FrontendChartCard>

        {/* Community Actions */}
        <FrontendChartCard 
          chartId="communityActions"
          title="Top Community Actions"
          description="Most common types of community responses"
          isVisibleOnFrontend={frontendVisibility.communityActions}
          onToggleVisibility={handleToggleVisibility}
          isSuperAdmin={canToggleChartVisibility}
        >
          <ChartContainer config={{}} className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.communityActionsData} layout="vertical" margin={{ left: 80, right: 15, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" tick={{ fontSize: 9 }} />
                <YAxis dataKey="name" type="category" width={70} tick={{ fontSize: 8 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="#EC4899" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </FrontendChartCard>

        {/* Submission Trend */}
        <FrontendChartCard 
          chartId="submissionTrend"
          title="Submission Trend"
          description="Monthly project submission activity"
          isVisibleOnFrontend={frontendVisibility.submissionTrend}
          onToggleVisibility={handleToggleVisibility}
          isSuperAdmin={canToggleChartVisibility}
        >
          {analyticsData.submissionTrendData.length > 0 ? (
            <ChartContainer config={{}} className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.submissionTrendData} margin={{ left: -25, right: 5, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 8 }} angle={-45} textAnchor="end" height={55} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 9 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="submissions"
                    stroke="#14B8A6"
                    strokeWidth={2}
                    dot={{ fill: '#14B8A6', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-gray-500">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No submission data available</p>
                <p className="text-xs text-gray-400 mt-1">Projects need submittedAt timestamps</p>
              </div>
            </div>
          )}
        </FrontendChartCard>
      </div>
    </div>
  )
}

export default EnhancedProjectsAnalytics
