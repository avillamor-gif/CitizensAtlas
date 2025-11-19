'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { Project, Filters, User } from '@/types/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, Pie, PieChart, Cell, XAxis, YAxis, ResponsiveContainer, LabelList, Line, LineChart, CartesianGrid } from 'recharts'
import { getSolutionTypeColor, getIfiAbbreviation, countryNameToCode } from '@/lib/constants'
import { getChartVisibilitySettings } from '@/lib/services/supabase-service'

// Chart visibility settings type
interface ChartVisibilitySettings {
  topCountries: boolean
  falseSolutionTypes: boolean
  investmentByCountry: boolean
  projectsTimeline: boolean
  projectsByIFI: boolean
  investmentByIFI: boolean
  projectsByRegion: boolean
  gaiaSupport: boolean
  projectStatus: boolean
  communityActions: boolean
  submissionTrend: boolean
}

// Helper functions
const parseDetail = (details: string, key: string): string => {
  const match = details.match(new RegExp(`\\*\\*${key}:\\*\\*(.*)`))
  return match ? match[1].trim() : ''
}

const parseCurrency = (currencyString: string): number => {
  if (!currencyString) return 0
  const numberString = currencyString.replace(/[$,€]/g, '').replace(/,/g, '')
  return parseFloat(numberString) || 0
}

// Horizontal Bar Chart Component
const HorizontalBarChart: React.FC<{
  data: { name: string; [key: string]: any }[]
  dataKey: string
  unit: string
  prefix?: string
  color?: string
}> = ({ data, dataKey, unit, prefix = '', color = '#0D244F' }) => {
  const valueFormatter = (value: any) => {
    if (typeof value !== 'number') return value
    if (dataKey === 'investment') {
      return `${prefix}${parseFloat(value.toFixed(2))}${unit}`
    }
    return `${prefix}${value}${unit}`
  }

  const chartConfig = {
    [dataKey]: {
      label: dataKey === 'investment' ? 'Investment' : 'Projects',
      color: color,
    },
  }

  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 15, left: -15, bottom: 5 }}>
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            axisLine={false} 
            tickLine={false} 
            width={100} 
            tick={{ fill: '#334155', fontWeight: 'bold', fontSize: '9px' }} 
            interval={0} 
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey={dataKey} fill={color} radius={[0, 4, 4, 0]} barSize={16}>
            <LabelList 
              dataKey={dataKey} 
              position="right" 
              offset={3}
              formatter={valueFormatter}
              style={{ fill: color, fontSize: '9px', fontWeight: 'bold' }} 
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

// Pie Chart Component
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

const PieChartComponent: React.FC<{ 
  data: { name: string; value: number }[]
  totalProjects: number
  colors?: { [key: string]: string }
  isDonut?: boolean 
}> = ({ data, totalProjects, colors, isDonut = true }) => {
  const getColor = (name: string) => {
    if (colors && colors[name]) return colors[name]
    return getSolutionTypeColor(name, 'hex')
  }

  const chartConfig = data.reduce((acc, entry, index) => {
    acc[entry.name] = {
      label: entry.name,
      color: getColor(entry.name),
    }
    return acc
  }, {} as any)

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="relative w-full h-[180px]">
        {isDonut && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-3xl font-extrabold text-brand-dark-blue">{totalProjects}</span>
            <span className="text-xs text-gray-600 font-medium">Total Projects</span>
          </div>
        )}
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                innerRadius={isDonut ? 55 : 0}
                outerRadius={85}
                fill="#8884d8"
                paddingAngle={isDonut ? 2 : 0}
                dataKey="value"
                nameKey="name"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      <div className="w-full mt-2">
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 w-full px-2">
          {data.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center">
              <span
                className="w-2 h-2 rounded-full mr-1.5 flex-shrink-0"
                style={{ backgroundColor: getColor(entry.name) }}
              />
              <span className="text-[10px] text-gray-700 truncate" title={entry.name}>
                {entry.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface DashboardV2Props {
  projects: Project[]
  filters: Filters
  currentUser?: User | null
}

const DashboardV2: React.FC<DashboardV2Props> = ({ projects, filters, currentUser }) => {
  // Chart visibility state - loaded from database
  const [chartVisibility, setChartVisibility] = useState<ChartVisibilitySettings>({
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
  const [isLoadingSettings, setIsLoadingSettings] = useState(true)

  // Load chart visibility settings from database
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await getChartVisibilitySettings()
        const visibilityMap: ChartVisibilitySettings = {
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
        }
        
        settings.forEach(setting => {
          if (setting.chart_id in visibilityMap) {
            visibilityMap[setting.chart_id as keyof ChartVisibilitySettings] = setting.is_visible
          }
        })
        
        setChartVisibility(visibilityMap)
      } catch (error) {
        console.error('Failed to load chart visibility settings:', error)
      } finally {
        setIsLoadingSettings(false)
      }
    }
    
    loadSettings()
  }, [])

  const dashboardData = useMemo(() => {
    if (!projects || projects.length === 0) {
      return { 
        bankData: [], 
        donutData: [], 
        totalProjects: 0, 
        gaiaSupportData: [], 
        projectStatusData: [],
        topCountriesData: [],
        investmentByCountryData: [],
        projectsTimelineData: [],
        projectsByRegionData: [],
        communityActionsData: [],
        submissionTrendData: []
      }
    }

    // IFI data
    const ifiData: { [key: string]: { projects: number; investment: number } } = {}
    
    projects.forEach(p => {
      const rawIfi = parseDetail(p.details, 'IFI') || 'N/A'
      const ifi = getIfiAbbreviation(rawIfi)
      if (!ifiData[ifi]) {
        ifiData[ifi] = { projects: 0, investment: 0 }
      }
      ifiData[ifi].projects += 1
      const amountStr = parseDetail(p.details, 'Total Project Amount')
      ifiData[ifi].investment += parseCurrency(amountStr)
    })

    const bankData = Object.entries(ifiData).map(([name, data]) => ({
      name,
      projects: data.projects,
      investment: data.investment / 1_000_000_000,
    })).sort((a, b) => b.projects - a.projects)

    // Solution type data
    const solutionTypeCounts: { [key: string]: number } = {}
    projects.forEach(p => {
      const types = p.corruptionType.split(',').map(t => t.trim())
      types.forEach(type => {
        if (type) {
          solutionTypeCounts[type] = (solutionTypeCounts[type] || 0) + 1
        }
      })
    })

    const donutData = Object.entries(solutionTypeCounts).map(([name, value]) => ({
      name,
      value,
    })).sort((a, b) => b.value - a.value)

    // GAIA support data
    const gaiaSupportCounts: { [key: string]: number } = { 'Yes': 0, 'No': 0, 'N/A': 0 }
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

    // Project status data
    const projectStatusCounts: { [key: string]: number } = {}
    projects.forEach(p => {
      const status = parseDetail(p.details, 'Project Status')
      if (status && status !== '') {
        projectStatusCounts[status] = (projectStatusCounts[status] || 0) + 1
      }
    })
    
    const projectStatusData = Object.entries(projectStatusCounts)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    // Top Countries (by project count)
    const projectsByCountry = projects.reduce((acc, p) => {
      acc[p.country] = (acc[p.country] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const topCountriesData = Object.entries(projectsByCountry)
      .map(([name, value]) => ({ name, projects: value }))
      .sort((a, b) => b.projects - a.projects)
      .slice(0, 10)

    // Investment by Country
    const investmentByCountry = projects.reduce((acc, p) => {
      const investment = parseCurrency(parseDetail(p.details, 'Total Project Amount'))
      acc[p.country] = (acc[p.country] || 0) + investment
      return acc
    }, {} as Record<string, number>)
    const investmentByCountryData = Object.entries(investmentByCountry)
      .map(([name, value]) => ({ name, investment: value / 1_000_000 }))
      .sort((a, b) => b.investment - a.investment)
      .slice(0, 10)

    // Projects Timeline (by year)
    const projectsOverTime = projects.reduce((acc, p) => {
      const yearMatch = p.date.match(/\d{4}/)
      const year = yearMatch ? parseInt(yearMatch[0], 10) : null
      if (year) {
        acc[year] = (acc[year] || 0) + 1
      }
      return acc
    }, {} as Record<number, number>)
    const projectsTimelineData = Object.entries(projectsOverTime)
      .map(([year, projects]) => ({ year, projects }))
      .sort((a, b) => Number(a.year) - Number(b.year))

    // Projects by Region
    const projectsByRegion = projects.reduce((acc, p) => {
      const region = parseDetail(p.details, 'Region') || 'N/A'
      acc[region] = (acc[region] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const projectsByRegionData = Object.entries(projectsByRegion)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

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

    // Submission Trend
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

    const totalProjects = projects.length

    return { 
      bankData, 
      donutData, 
      totalProjects, 
      gaiaSupportData, 
      projectStatusData,
      topCountriesData,
      investmentByCountryData,
      projectsTimelineData,
      projectsByRegionData,
      communityActionsData,
      submissionTrendData
    }
  }, [projects])

  const gaiaColors = {
    'Yes': '#22c55e',
    'No': '#ef4444',
    'N/A': '#94a3b8'
  }

  const statusColors = {
    'Active': '#22c55e',
    'Proposed': '#3b82f6',
    'Cancelled': '#ef4444',
    'Inactive': '#94a3b8',
    'N/A': '#a1a1aa'
  }

  // Empty state
  if (!projects || projects.length === 0) {
    const selectedCountry = filters.country !== 'all' ? filters.country : null
    const countryCode = selectedCountry ? countryNameToCode[selectedCountry] : null
    const mapUrl = countryCode 
      ? `https://raw.githubusercontent.com/astio/world-map-country-shapes-svg/master/countries/${countryCode}.svg` 
      : null
    const titleCase = (str: string) => str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

    const containerStyle: React.CSSProperties = mapUrl ? {
      backgroundImage: `url(${mapUrl})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'contain',
      opacity: 0.1,
    } : {}

    return (
      <div className="relative col-span-1 md:col-span-2 lg:col-span-3 bg-white p-8 border rounded-lg shadow-lg text-center min-h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0" style={containerStyle}></div>
        <div className="relative z-10">
          {selectedCountry ? (
            <>
              <h3 className="text-2xl font-bold text-brand-dark-blue">No projects found for {titleCase(selectedCountry)}.</h3>
              <p className="text-gray-600 mt-2 text-lg">Try adjusting other filters or select 'All Countries'.</p>
            </>
          ) : (
            <>
              <h3 className="text-2xl font-bold text-brand-dark-blue">No projects match the current filter criteria.</h3>
              <p className="text-gray-600 mt-2 text-lg">Adjust the filters to see dashboard data.</p>
            </>
          )}
        </div>
      </div>
    )
  }

  // Get visible charts
  const visibleCharts = Object.entries(chartVisibility).filter(([, visible]) => visible).map(([key]) => key)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
      {/* Country Filter Card */}
      <Card className="relative flex flex-col items-center justify-center min-h-[300px] overflow-hidden bg-blue-50">
        {filters.country !== 'all' && countryNameToCode[filters.country] ? (
          <>
            <div
              className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-20"
              style={{ 
                backgroundImage: `url(https://raw.githubusercontent.com/astio/world-map-country-shapes-svg/master/countries/${countryNameToCode[filters.country]}.svg)` 
              }}
              aria-hidden="true"
            />
            <div className="relative z-10 text-center p-4">
              <h4 className="font-bold text-brand-dark-blue mb-2">Currently Viewing</h4>
              <p className="text-2xl font-extrabold text-brand-dark-blue">
                {filters.country.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
              </p>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 p-4">
            <h4 className="font-bold text-brand-dark-blue mb-2">Geographic Filter</h4>
            <p>Showing projects for all countries.</p>
          </div>
        )}
      </Card>

      {/* Projects by IFI */}
      {chartVisibility.projectsByIFI && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-brand-dark-blue">Projects by Financial Institution</CardTitle>
            <CardDescription className="text-xs">Top IFIs involved in projects</CardDescription>
          </CardHeader>
          <CardContent className="p-2">
            <ChartContainer config={{}} className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.bankData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 8 }} angle={-45} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="projects" fill="#F97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Investment by IFI */}
      {chartVisibility.investmentByIFI && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-brand-dark-blue">Investment by IFI</CardTitle>
            <CardDescription className="text-xs">Financial backing in millions (USD)</CardDescription>
          </CardHeader>
          <CardContent className="p-2">
            <ChartContainer config={{}} className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.bankData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 8 }} angle={-45} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="investment" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* False Solution Types */}
      {chartVisibility.falseSolutionTypes && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-brand-dark-blue">Projects by False Solution Type</CardTitle>
            <CardDescription className="text-xs">Distribution of identified issues</CardDescription>
          </CardHeader>
          <CardContent className="p-2">
            <PieChartComponent data={dashboardData.donutData} totalProjects={dashboardData.totalProjects} />
          </CardContent>
        </Card>
      )}

      {/* GAIA Support */}
      {chartVisibility.gaiaSupport && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-brand-dark-blue">Active GAIA Support</CardTitle>
            <CardDescription className="text-xs">Projects with active GAIA involvement</CardDescription>
          </CardHeader>
          <CardContent className="p-2">
            <PieChartComponent 
              data={dashboardData.gaiaSupportData} 
              totalProjects={dashboardData.totalProjects} 
              colors={gaiaColors} 
            />
          </CardContent>
        </Card>
      )}

      {/* Project Status */}
      {chartVisibility.projectStatus && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-brand-dark-blue">Project Status Distribution</CardTitle>
            <CardDescription className="text-xs">Current status of all projects</CardDescription>
          </CardHeader>
          <CardContent className="p-2">
            <PieChartComponent 
              data={dashboardData.projectStatusData} 
              totalProjects={dashboardData.totalProjects} 
              colors={statusColors} 
              isDonut={false} 
            />
          </CardContent>
        </Card>
      )}

      {/* Top Countries */}
      {chartVisibility.topCountries && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-brand-dark-blue">Top Countries by Project Count</CardTitle>
            <CardDescription className="text-xs">Projects distribution across countries</CardDescription>
          </CardHeader>
          <CardContent className="p-2">
            <HorizontalBarChart data={dashboardData.topCountriesData} dataKey="projects" unit="" color="#3B82F6" />
          </CardContent>
        </Card>
      )}

      {/* Investment by Country */}
      {chartVisibility.investmentByCountry && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-brand-dark-blue">Investment by Country</CardTitle>
            <CardDescription className="text-xs">Total investment in millions (USD)</CardDescription>
          </CardHeader>
          <CardContent className="p-2">
            <HorizontalBarChart data={dashboardData.investmentByCountryData} dataKey="investment" unit="M" prefix="$" color="#10B981" />
          </CardContent>
        </Card>
      )}

            {/* Projects Timeline */}
      {chartVisibility.projectsTimeline && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-brand-dark-blue">Projects Timeline</CardTitle>
            <CardDescription className="text-xs">Project submissions over years</CardDescription>
          </CardHeader>
          <CardContent className="p-2">
            <ChartContainer config={{
              projects: {
                label: "Projects",
                color: "#A855F7",
              },
            }} className="h-[220px]">
              <LineChart data={dashboardData.projectsTimelineData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 9 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="projects" stroke="#A855F7" strokeWidth={2} dot={{ fill: '#A855F7', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Projects by Region */}
      {chartVisibility.projectsByRegion && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-brand-dark-blue">Projects by Region</CardTitle>
            <CardDescription className="text-xs">Geographic distribution</CardDescription>
          </CardHeader>
          <CardContent className="p-2">
            <PieChartComponent 
              data={dashboardData.projectsByRegionData} 
              totalProjects={dashboardData.totalProjects} 
            />
          </CardContent>
        </Card>
      )}

      {/* Community Actions */}
      {chartVisibility.communityActions && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-brand-dark-blue">Top Community Actions</CardTitle>
            <CardDescription className="text-xs">Most common types of community responses</CardDescription>
          </CardHeader>
          <CardContent className="p-2">
            <HorizontalBarChart data={dashboardData.communityActionsData} dataKey="value" unit="" color="#EC4899" />
          </CardContent>
        </Card>
      )}

      {/* Submission Trend */}
      {chartVisibility.submissionTrend && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-brand-dark-blue">Submission Trend</CardTitle>
            <CardDescription className="text-xs">Monthly project submission activity</CardDescription>
          </CardHeader>
          <CardContent className="p-2">
            <ChartContainer config={{
              submissions: {
                label: "Submissions",
                color: "#14B8A6",
              },
            }} className="h-[220px]">
              <LineChart data={dashboardData.submissionTrendData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 8 }} angle={-45} textAnchor="end" height={55} />
                <YAxis tick={{ fontSize: 9 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="submissions" stroke="#14B8A6" strokeWidth={2} dot={{ fill: '#14B8A6', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default DashboardV2
