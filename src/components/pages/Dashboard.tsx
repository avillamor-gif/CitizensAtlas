import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, LabelList } from 'recharts';
import { Project, PieData, Filters } from '@/types/types';
import { getSolutionTypeColor, getIfiAbbreviation, countryNameToCode } from '@/lib/constants';

interface HorizontalBarChartProps {
    data: { name: string, [key: string]: any }[];
    dataKey: string;
    unit: string;
    prefix?: string;
}

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ data, dataKey, unit, prefix = '' }) => {
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const value = payload[0].value;
            const formattedValue = typeof value === 'number' && dataKey === 'investment' ? value.toFixed(3) : value;
            return (
                <div className="bg-white p-2 border rounded shadow-lg text-sm">
                    <p className="font-bold">{label}</p>
                    <p>{`${prefix}${formattedValue}${unit}`}</p>
                </div>
            );
        }
        return null;
    };

    const valueFormatter = (value: any) => {
        if (typeof value !== 'number') {
            return value;
        }
        if (dataKey === 'investment') {
            const formattedValue = parseFloat(value.toFixed(2));
            return `${prefix}${formattedValue}${unit}`;
        }
        return `${prefix}${value}${unit}`;
    };


    return (
        <ResponsiveContainer width="100%" height={300} minWidth={1} minHeight={1} debounce={50}>
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 50, left: 20, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={180} tick={{ fill: '#334155', fontWeight: 'bold', fontSize: '12px' }} interval={0} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(239, 246, 255, 0.5)' }} />
                <Bar dataKey={dataKey} fill="#0D244F" radius={[0, 4, 4, 0]} barSize={20}>
                    <LabelList 
                        dataKey={dataKey} 
                        position="right" 
                        offset={8}
                        formatter={valueFormatter}
                        style={{ fill: '#0D244F', fontSize: '12px', fontWeight: 'bold' }} 
                    />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) { // Don't show labels for very small slices
        return null;
    }
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="12px" fontWeight="bold">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const renderColorfulLegend = (props: any) => {
    const { payload } = props;
    return (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full px-4">
            {payload.map((entry: any, index: number) => (
                <div key={`item-${index}`} className="flex items-center">
                    <span
                        className="w-2.5 h-2.5 rounded-full mr-2 flex-shrink-0"
                        style={{ backgroundColor: entry.color }}
                    ></span>
                    <span className="text-xs text-gray-700 truncate" title={entry.value}>
                        {entry.value}
                    </span>
                </div>
            ))}
        </div>
    );
};


const PieChartComponent: React.FC<{ data: PieData[]; totalProjects: number; colors?: { [key: string]: string }; isDonut?: boolean }> = ({ data, totalProjects, colors, isDonut = true }) => {
    const getColor = (name: string) => {
        if (colors && colors[name]) {
            return colors[name];
        }
        return getSolutionTypeColor(name, 'hex');
    };
    
    const legendPayload = data.map(entry => ({
        value: entry.name,
        color: getColor(entry.name),
    }));

    return (
        <div className="flex flex-col items-center w-full h-full">
            <div className="relative w-full h-[220px]">
                {isDonut && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                        <span className="text-4xl font-extrabold text-brand-dark-blue">{totalProjects}</span>
                        <span className="text-sm text-gray-600 font-medium">Total Projects</span>
                    </div>
                )}
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} debounce={50}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            innerRadius={isDonut ? 70 : 0}
                            outerRadius={110}
                            fill="#8884d8"
                            paddingAngle={isDonut ? 2 : 0}
                            dataKey="value"
                            nameKey="name"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [`${value} projects`, name]} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="w-full mt-4">
                {renderColorfulLegend({ payload: legendPayload })}
            </div>
        </div>
    );
};

interface DashboardProps {
    projects: Project[];
    filters: Filters;
}

const Dashboard: React.FC<DashboardProps> = ({ projects, filters }) => {
    const parseDetail = (details: string, key: string): string => {
        const match = details.match(new RegExp(`\\*\\*${key}:\\*\\*(.*)`));
        return match ? match[1].trim() : '';
    };

    const parseCurrency = (currencyString: string): number => {
        if (!currencyString) return 0;
        const numberString = currencyString.replace(/[$,€]/g, '').replace(/,/g, '');
        return parseFloat(numberString) || 0;
    };

    const dashboardData = useMemo(() => {
        if (!projects || projects.length === 0) {
            return { bankData: [], donutData: [], totalProjects: 0, gaiaSupportData: [], projectStatusData: [] };
        }

        const ifiData: { [key: string]: { projects: number; investment: number } } = {};
        
        projects.forEach(p => {
            const rawIfi = parseDetail(p.details, 'IFI') || 'N/A';
            const ifi = getIfiAbbreviation(rawIfi);
            if (!ifiData[ifi]) {
                ifiData[ifi] = { projects: 0, investment: 0 };
            }
            ifiData[ifi].projects += 1;
            const amountStr = parseDetail(p.details, 'Total Project Amount');
            ifiData[ifi].investment += parseCurrency(amountStr);
        });

        const bankData = Object.entries(ifiData).map(([name, data]) => ({
            name,
            projects: data.projects,
            investment: data.investment / 1_000_000_000,
        })).sort((a, b) => b.projects - a.projects);

        const solutionTypeCounts: { [key: string]: number } = {};
        projects.forEach(p => {
            const types = p.corruptionType.split(',').map(t => t.trim());
            types.forEach(type => {
                if(type) {
                    solutionTypeCounts[type] = (solutionTypeCounts[type] || 0) + 1;
                }
            });
        });

        const donutData = Object.entries(solutionTypeCounts).map(([name, value]) => ({
            name,
            value,
        })).sort((a, b) => b.value - a.value);

        const gaiaSupportCounts: { [key: string]: number } = { 'Yes': 0, 'No': 0, 'N/A': 0 };
        projects.forEach(p => {
            const support = parseDetail(p.details, 'Active GAIA Support') || 'N/A';
            if (support === 'Yes') {
                gaiaSupportCounts['Yes']++;
            } else if (support === 'No') {
                gaiaSupportCounts['No']++;
            } else {
                gaiaSupportCounts['N/A']++;
            }
        });

        const gaiaSupportData = Object.entries(gaiaSupportCounts)
            .filter(([, value]) => value > 0)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        const projectStatusCounts: { [key: string]: number } = {};
        projects.forEach(p => {
            const status = parseDetail(p.details, 'Project Status');
            if (status && status !== '') {
                projectStatusCounts[status] = (projectStatusCounts[status] || 0) + 1;
            }
        });
        
        const projectStatusData = Object.entries(projectStatusCounts)
            .filter(([, value]) => value > 0)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        const totalProjects = projects.length;

        return { bankData, donutData, totalProjects, gaiaSupportData, projectStatusData };
    }, [projects]);

    const gaiaColors = {
        'Yes': '#22c55e', // green-500
        'No': '#ef4444', // red-500
        'N/A': '#94a3b8' // slate-400
    };

    const statusColors = {
        'Active': '#22c55e', // green-500
        'Proposed': '#3b82f6', // blue-500
        'Cancelled': '#ef4444', // red-500
        'Inactive': '#94a3b8', // slate-400
        'N/A': '#a1a1aa' // zinc-400
    };

    if (!projects || projects.length === 0) {
        const selectedCountry = filters.country !== 'all' ? filters.country : null;
        const countryCode = selectedCountry ? countryNameToCode[selectedCountry] : null;
        const mapUrl = countryCode ? `https://raw.githubusercontent.com/astio/world-map-country-shapes-svg/master/countries/${countryCode}.svg` : null;
        const titleCase = (str: string) => str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

        const containerStyle: React.CSSProperties = mapUrl ? {
            backgroundImage: `url(${mapUrl})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            opacity: 0.1,
        } : {};

        return (
            <div 
                className="relative col-span-1 md:col-span-2 lg:col-span-3 bg-white p-8 border rounded-lg shadow-lg text-center min-h-[300px] flex items-center justify-center overflow-hidden"
            >
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
        );
    }
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 border rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-50 p-4 relative flex flex-col items-center justify-center min-h-[300px] overflow-hidden">
                {
                    filters.country !== 'all' && countryNameToCode[filters.country] ? (
                        <>
                            <div
                                className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-20"
                                style={{ backgroundImage: `url(https://raw.githubusercontent.com/astio/world-map-country-shapes-svg/master/countries/${countryNameToCode[filters.country]}.svg)` }}
                                aria-hidden="true"
                            ></div>
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
                    )
                }
            </div>
            <div className="bg-white p-4">
                <h4 className="font-bold text-center text-brand-dark-blue mb-4">No. of Projects by IFI</h4>
                <HorizontalBarChart data={dashboardData.bankData} dataKey="projects" unit="" />
            </div>
            <div className="bg-white p-4">
                <h4 className="font-bold text-center text-brand-dark-blue mb-4">Investment by IFI (in Billions)</h4>
                <HorizontalBarChart data={dashboardData.bankData} dataKey="investment" unit="B" prefix="$" />
            </div>
            <div className="bg-white p-4">
                <h4 className="font-bold text-center text-brand-dark-blue mb-4">Projects by False Solution Type</h4>
                <PieChartComponent data={dashboardData.donutData} totalProjects={dashboardData.totalProjects} />
            </div>
             <div className="bg-white p-4">
                <h4 className="font-bold text-center text-brand-dark-blue mb-4">Active GAIA support</h4>
                <PieChartComponent data={dashboardData.gaiaSupportData} totalProjects={dashboardData.totalProjects} colors={gaiaColors} />
            </div>
            <div className="bg-white p-4">
                <h4 className="font-bold text-center text-brand-dark-blue mb-4">Project Status</h4>
                <PieChartComponent data={dashboardData.projectStatusData} totalProjects={dashboardData.totalProjects} colors={statusColors} isDonut={false} />
            </div>
        </div>
    );
};

export default Dashboard;