import React, { useMemo } from 'react';
import { Project } from '@/types/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { getIfiAbbreviation, solutionTypeColors } from '@/lib/constants';

// Helper functions (can be moved to a utils file later)
const parseDetail = (details: string, key: string): string => {
    const match = details.match(new RegExp(`\\*\\*${key}:\\*\\*(.*)`));
    return match ? match[1].trim() : 'N/A';
};

const parseCurrency = (currencyString: string): number => {
    if (!currencyString) return 0;
    const numberString = currencyString.replace(/[$,€]/g, '').replace(/,/g, '');
    return parseFloat(numberString) || 0;
};

// Reusable components for the dashboard
const StatCard: React.FC<{ title: string; value: string | number }> = ({ title, value }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h4 className="text-sm font-medium text-gray-500">{title}</h4>
        <p className="text-3xl font-bold text-brand-dark-blue mt-1">{value}</p>
    </div>
);

const ChartCard: React.FC<{ title: string; children: React.ReactNode; className?: string; chartClassName?: string }> = ({ title, children, className = 'col-span-1', chartClassName = 'h-80' }) => (
    <div className={`bg-white p-6 rounded-lg border border-gray-200 shadow-sm ${className}`}>
        <h3 className="text-lg font-semibold text-brand-dark-blue mb-4">{title}</h3>
        <div className={chartClassName}>
            {children}
        </div>
    </div>
);

const COLORS = ['#3B82F6', '#10B981', '#FBBF24', '#A855F7', '#EF4444', '#6366F1', '#F97316'];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-2 border rounded shadow-lg text-sm">
                <p className="font-bold">{label}</p>
                {payload.map((pld: any, index: number) => (
                     <p key={index} style={{ color: pld.color }}>{`${pld.name}: ${pld.value.toLocaleString()}`}</p>
                ))}
            </div>
        );
    }
    return null;
};

const ProjectsAnalytics: React.FC<{ projects: Project[] }> = ({ projects }) => {
    const analyticsData = useMemo(() => {
        if (!projects) {
            return {
                totalProjects: 0,
                totalInvestment: 0,
                countryCount: 0,
                mostCommonSolution: 'N/A',
                projectsByCountryData: [],
                projectsByStatusData: [],
                projectsByIFIData: [],
                projectsBySolutionData: [],
                projectsOverTimeData: [],
                projectsByRegionData: [],
                communityActionsData: [],
            };
        }
        
        const totalProjects = projects.length;
        const totalInvestment = projects.reduce((sum, p) => sum + parseCurrency(parseDetail(p.details, 'Total Project Amount')), 0);
        const countries = new Set(projects.map(p => p.country));
        
        // Data for charts
        // FIX: Correctly type the initial value for `reduce` to ensure correct type inference.
        const projectsByCountry = projects.reduce((acc, p) => {
            acc[p.country] = (acc[p.country] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        const projectsByCountryData = Object.entries(projectsByCountry).map(([name, value]) => ({ name, projects: value })).sort((a, b) => b.projects - a.projects);

        // FIX: Correctly type the initial value for `reduce` to ensure correct type inference.
        const projectsByStatus = projects.reduce((acc, p) => {
            const status = parseDetail(p.details, 'Project Status') || 'N/A';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        const projectsByStatusData = Object.entries(projectsByStatus).map(([name, value]) => ({ name, value }));

        // FIX: Correctly type the initial value for `reduce` to ensure correct type inference.
        const projectsByIFI = projects.reduce((acc, p) => {
            const ifi = getIfiAbbreviation(parseDetail(p.details, 'IFI') || 'N/A');
            acc[ifi] = (acc[ifi] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        const projectsByIFIData = Object.entries(projectsByIFI).map(([name, value]) => ({ name, projects: value })).sort((a,b) => b.projects - a.projects);

        const solutionTypes = projects.flatMap(p => p.corruptionType.split(',').map(t => t.trim())).filter(Boolean);
        // FIX: Correctly type the initial value for `reduce` to ensure correct type inference.
        const projectsBySolution = solutionTypes.reduce((acc, type) => {
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        const mostCommonSolution = Object.entries(projectsBySolution).sort((a,b) => b[1] - a[1])[0]?.[0] || 'N/A';
        const projectsBySolutionData = Object.entries(projectsBySolution).map(([name, value]) => ({ name, value }));

        // FIX: Correctly type the initial value for `reduce` to ensure correct type inference.
        const projectsOverTime = projects.reduce((acc, p) => {
            const yearMatch = p.date.match(/\d{4}/);
            const year = yearMatch ? parseInt(yearMatch[0], 10) : null;
            if (year) {
                acc[year] = (acc[year] || 0) + 1;
            }
            return acc;
        }, {} as Record<number, number>);
        const projectsOverTimeData = Object.entries(projectsOverTime).map(([name, projects]) => ({ name, projects })).sort((a,b) => Number(a.name) - Number(b.name));

        // FIX: Correctly type the initial value for `reduce` to ensure correct type inference.
        const projectsByRegion = projects.reduce((acc, p) => {
            const region = parseDetail(p.details, 'Region') || 'N/A';
            acc[region] = (acc[region] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        const projectsByRegionData = Object.entries(projectsByRegion).map(([name, value]) => ({ name, value }));

        // FIX: Correctly type the initial value for `reduce` to ensure correct type inference.
        const communityActions = projects
            .flatMap(p => parseDetail(p.details, 'Types of Actions').split(','))
            .map(action => action.trim())
            .filter(Boolean)
            .reduce((acc, action) => {
                acc[action] = (acc[action] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

        const communityActionsData = Object.entries(communityActions)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);


        return {
            totalProjects,
            totalInvestment,
            countryCount: countries.size,
            mostCommonSolution,
            projectsByCountryData,
            projectsByStatusData,
            projectsByIFIData,
            projectsBySolutionData,
            projectsOverTimeData,
            projectsByRegionData,
            communityActionsData,
        };
    }, [projects]);
    
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-brand-dark-blue">Projects Analytics</h2>
                <p className="text-gray-600 mt-1">An overview of all submitted project data.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Projects" value={analyticsData.totalProjects} />
                <StatCard title="Total Investment" value={`$${(analyticsData.totalInvestment / 1_000_000_000).toFixed(2)}B`} />
                <StatCard title="Countries Involved" value={analyticsData.countryCount} />
                <StatCard title="Most Common Issue" value={analyticsData.mostCommonSolution} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartCard title="Projects by Country">
                    <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} debounce={50}>
                        <BarChart data={analyticsData.projectsByCountryData} layout="vertical" margin={{ top: 5, right: 30, left: 120, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={110} tick={{fontSize: 12}} interval={0} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(239, 246, 255, 0.7)' }} />
                            <Bar dataKey="projects" fill="#3B82F6" barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Projects by Status">
                    <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} debounce={50}>
                        <PieChart>
                            <Pie data={analyticsData.projectsByStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {analyticsData.projectsByStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Projects by False Solution Type">
                     <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} debounce={50}>
                        <PieChart>
                            <Pie data={analyticsData.projectsBySolutionData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2}>
                                {analyticsData.projectsBySolutionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={solutionTypeColors[entry.name]?.hex || solutionTypeColors['default'].hex} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend layout="vertical" align="right" verticalAlign="middle" iconSize={10} wrapperStyle={{fontSize: "12px", width: "120px", overflow: "hidden"}}/>
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>
                
                <ChartCard title="Projects by IFI">
                    <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} debounce={50}>
                        <BarChart data={analyticsData.projectsByIFIData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{fontSize: 12}} />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="projects" fill="#10B981" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Project Submissions Over Time">
                    <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} debounce={50}>
                        <LineChart data={analyticsData.projectsOverTimeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line type="monotone" dataKey="projects" stroke="#A855F7" strokeWidth={2} activeDot={{ r: 8 }} name="New Projects"/>
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Projects by Region">
                    <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} debounce={50}>
                        <PieChart>
                            <Pie data={analyticsData.projectsByRegionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {analyticsData.projectsByRegionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard 
                    title="Most Common Community Actions" 
                    className="col-span-1 lg:col-span-2" 
                    chartClassName="h-96"
                >
                    <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} debounce={50}>
                        <BarChart data={analyticsData.communityActionsData} layout="vertical" margin={{ top: 5, right: 30, left: 280, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" allowDecimals={false} />
                            <YAxis dataKey="name" type="category" width={270} tick={{fontSize: 12}} interval={0} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(239, 246, 255, 0.7)' }} />
                            <Legend />
                            <Bar dataKey="value" name="Count" fill="#F97316" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </div>
    );
};

export default ProjectsAnalytics;