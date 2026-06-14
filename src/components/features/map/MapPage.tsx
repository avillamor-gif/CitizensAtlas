import React, { useState, useCallback, useEffect } from 'react';
import InteractiveMap from './InteractiveMap';
import FilterPanel from '@/components/pages/FilterPanel';
import { Project, Filters, FilterOptions, ProjectBrief } from '@/types/types';
import ProjectDetailModal from '@/components/features/projects/ProjectDetailModal';
import { countryNameToCode } from '@/lib/constants';
import * as DataService from '@/lib/services/data-service';

interface MapPageProps {
    projects: Project[];
    filters: Filters;
    onFilterChange: (filterName: keyof Filters, value: string) => void;
    filterOptions: FilterOptions;
}

const MapPage: React.FC<MapPageProps> = ({ projects, filters, onFilterChange, filterOptions }) => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isMapLoading, setIsMapLoading] = useState(true);
    const [projectBriefs, setProjectBriefs] = useState<ProjectBrief[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Fetch project briefs when component mounts
    useEffect(() => {
        const loadProjectBriefs = async () => {
            try {
                const briefs = await DataService.getPublishedProjectBriefs();
                console.log('🗺️ [MapPage] Loaded project briefs:', briefs);
                setProjectBriefs(briefs);
            } catch (error) {
                console.error('Failed to load project briefs:', error);
                setProjectBriefs([]);
            }
        };

        loadProjectBriefs();
    }, []);

    const openDetailModal = useCallback((project: Project) => {
        setSelectedProject(project);
    }, []);

    const closeDetailModal = () => {
        setSelectedProject(null);
    };

    const handleEditProject = useCallback((project: Project) => {
        // TODO: Implement edit functionality
        console.log('Edit project:', project);
    }, []);

    const handleMapLoad = () => {
        setIsMapLoading(false);
    };

    const handleClearFilters = () => {
        onFilterChange('country', 'all');
        onFilterChange('solutionType', 'all');
        onFilterChange('ifi', 'all');
        onFilterChange('projectStatus', 'all');
    };

    return (
        <div className="flex w-full h-[calc(100dvh-56px)] md:h-[calc(100vh-80px)] bg-white">
            {/* Map Container - shrinks when details panel is open */}
            <div className={`flex-1 relative overflow-hidden transition-smooth-slide ${
                selectedProject ? 'md:flex-[0_0_65%]' : 'flex-1'
            }`}>
                {isMapLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
                        <div className="text-center">
                            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-medium-blue border-r-transparent"></div>
                            <p className="mt-4 text-gray-600">Loading map...</p>
                        </div>
                    </div>
                )}
                <InteractiveMap projects={projects} onMarkerClick={openDetailModal} onMapLoad={handleMapLoad} />
                
                {/* Currently Viewing Card */}
                <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-blue-50 p-2 md:p-3 rounded-lg shadow-lg z-10 w-[140px] md:w-[200px]">
                    {filters.country !== 'all' && countryNameToCode[filters.country] ? (
                        <div className="relative">
                            <div
                                className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-10"
                                style={{ 
                                    backgroundImage: `url(https://raw.githubusercontent.com/astio/world-map-country-shapes-svg/master/countries/${countryNameToCode[filters.country]}.svg)` 
                                }}
                                aria-hidden="true"
                            />
                            <div className="relative text-center">
                                <h4 className="text-[10px] md:text-xs font-bold text-brand-dark-blue mb-0.5 md:mb-1">Currently Viewing</h4>
                                <p className="text-xs md:text-sm font-extrabold text-brand-dark-blue">
                                    {filters.country.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                                </p>
                                <div className="mt-1 md:mt-2 pt-1 md:pt-2 border-t border-brand-dark-blue/20">
                                    <p className="text-[9px] md:text-xs text-brand-dark-blue/80 mb-0.5">Total Cases</p>
                                    <p className="text-sm md:text-lg font-bold text-brand-dark-blue">
                                        {projects.filter(p => 
                                            p.country?.toUpperCase() === filters.country.toUpperCase() && 
                                            (p.status === 'published' || !p.status)
                                        ).length}
                                    </p>
                                </div>
                                {(() => {
                                    const matchingBriefs = projectBriefs.filter(brief => 
                                        brief.country?.toUpperCase() === filters.country.toUpperCase() &&
                                        (brief.status === 'published' || !brief.status)
                                    )
                                    
                                    return matchingBriefs.length > 0 && (
                                        <button
                                            onClick={() => {
                                                const country = encodeURIComponent(filters.country);
                                                window.location.href = `/country-project-briefs?country=${country}`;
                                            }}
                                            className="mt-1 md:mt-2 w-full bg-brand-dark-blue text-white font-semibold py-1 md:py-1.5 px-2 md:px-3 rounded hover:bg-brand-medium-blue transition-colors text-[9px] md:text-xs"
                                        >
                                            PROJECT BRIEFS
                                        </button>
                                    )
                                })()}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <h4 className="text-xs font-bold text-brand-dark-blue mb-1">Currently Viewing</h4>
                            <p className="text-sm font-extrabold text-brand-dark-blue">
                                {filters.country === 'all' ? 'ALL COUNTRIES' : filters.country.toUpperCase()}
                            </p>
                            <div className="mt-2 pt-2 border-t border-brand-dark-blue/20">
                                <p className="text-xs text-brand-dark-blue/80 mb-0.5">Total Cases</p>
                                <p className="text-lg font-bold text-brand-dark-blue">
                                    {projects.filter(p => p.status === 'published' || !p.status).length}
                                </p>
                            </div>
                            {(() => {
                                const matchingBriefs = projectBriefs.filter(brief => 
                                    filters.country !== 'all' && 
                                    brief.country?.toUpperCase() === filters.country.toUpperCase() &&
                                    (brief.status === 'published' || !brief.status)
                                )
                                
                                return matchingBriefs.length > 0 && (
                                    <button
                                        onClick={() => {
                                            const country = encodeURIComponent(filters.country);
                                            window.location.href = `/country-project-briefs?country=${country}`;
                                        }}
                                        className="mt-2 w-full bg-brand-dark-blue text-white font-semibold py-1.5 px-3 rounded hover:bg-brand-medium-blue transition-colors text-xs"
                                    >
                                        PROJECT BRIEFS
                                    </button>
                                )
                            })()}
                        </div>
                    )}
                </div>

                {/* Filters Button - Mobile Only */}
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="md:hidden absolute top-2 right-2 z-20 bg-brand-dark-blue text-white px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 hover:bg-brand-medium-blue transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span className="font-semibold text-xs">Filters</span>
                </button>

                {/* Filters Panel - Desktop (right side) */}
                <div className="hidden md:block absolute bottom-4 right-4 z-10 max-w-[200px] md:max-w-xs">
                    <div className="bg-[#f7f8f9] p-3 border rounded-lg shadow-lg">
                        <FilterPanel
                            filters={filters}
                            onFilterChange={onFilterChange}
                            filterOptions={filterOptions}
                            isCompact={true}
                            onClearFilters={handleClearFilters}
                        />
                    </div>
                </div>

                {/* Filters Modal - Mobile (slide up from bottom) */}
                {isFilterOpen && (
                    <div className="md:hidden fixed inset-0 z-30 flex items-end">
                        <div 
                            className="absolute inset-0 bg-black bg-opacity-50"
                            onClick={() => setIsFilterOpen(false)}
                        />
                        <div className="relative w-full bg-white rounded-t-2xl shadow-2xl max-h-[80vh] overflow-y-auto animate-slide-up">
                            <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-brand-dark-blue">Filters</h3>
                                <button
                                    onClick={() => setIsFilterOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-4">
                                <FilterPanel
                                    filters={filters}
                                    onFilterChange={(filterName, value) => {
                                        onFilterChange(filterName, value);
                                        // Auto-close on filter change for better UX
                                        setTimeout(() => setIsFilterOpen(false), 300);
                                    }}
                                    filterOptions={filterOptions}
                                    isCompact={false}
                                    onClearFilters={handleClearFilters}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Project Details Panel - Desktop Only - Fixed 35% width */}
            {selectedProject && (
                <ProjectDetailModal project={selectedProject} onClose={closeDetailModal} onEdit={handleEditProject} isSidePanel={true} />
            )}
        </div>
    );
};

export default MapPage;