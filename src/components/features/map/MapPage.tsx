import React, { useState, useCallback, useMemo } from 'react';
import InteractiveMap from './InteractiveMap';
import FilterPanel from '@/components/pages/FilterPanel';
import { Project, Filters, FilterOptions } from '@/types/types';
import ProjectDetailModal from '@/components/features/projects/ProjectDetailModal';
import ProjectForm from '@/components/features/projects/ProjectForm';
import { countryNameToCode, getIfiAbbreviation } from '@/lib/constants';
import * as DataService from '@/lib/services/data-service';
import { useAuth } from '@/contexts/AuthContext';

interface MapPageProps {
    projects: Project[];
    filterOptions: FilterOptions;
    onUpdateProject?: (project: Project) => void | Promise<void>;
}

const MapPage: React.FC<MapPageProps> = ({ projects, filterOptions, onUpdateProject }) => {
    const { user } = useAuth();
    const canEditProjects = !!user && (user.role === 'admin' || user.role === 'super-admin');

    // Validate that filter value exists in options, otherwise use 'all'
    const validateFilterValue = useCallback((value: string, options: string[]): string => {
        return options.includes(value) ? value : 'all';
    }, []);

    // Initialize filters with validated values based on available options
    const initialFilters = useMemo(() => ({
        country: validateFilterValue('all', filterOptions.countries),
        solutionType: validateFilterValue('all', filterOptions.solutionTypes),
        ifi: validateFilterValue('all', filterOptions.ifis),
        projectStatus: validateFilterValue('all', filterOptions.projectStatuses),
    }), [filterOptions, validateFilterValue]);

    // Independent filters state for Map page - not shared with homepage
    const [filters, setFilters] = useState<Filters>(initialFilters);

    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
    const [isMapLoading, setIsMapLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [mapStyleIndex, setMapStyleIndex] = useState(0);

    const mapStyles = [
        { name: 'Dark Matter', url: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json' },
        { name: 'Voyager', url: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json' },
        { name: 'Voyager No Labels', url: 'https://basemaps.cartocdn.com/gl/voyager-nolabels-gl-style/style.json' },
    ];

    // Local filter change handler - validates the value before updating
    const onFilterChange = useCallback((filterName: keyof Filters, value: string) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value,
        }));
    }, []);



    const openDetailModal = useCallback((project: Project) => {
        setSelectedProject(project);
    }, []);

    const closeDetailModal = () => {
        setSelectedProject(null);
    };

    const handleEditProject = useCallback((project: Project) => {
        if (!canEditProjects) {
            return;
        }
        setProjectToEdit(project);
        setSelectedProject(null); // Close the details modal
    }, [canEditProjects]);

    const handleMapLoad = () => {
        setIsMapLoading(false);
    };

    const handleClearFilters = useCallback(() => {
        setFilters({
            country: 'all',
            solutionType: 'all',
            ifi: 'all',
            projectStatus: 'all',
        });
    }, []);

    const handleUpdateProject = async (updatedProject: Project) => {
        try {
            if (onUpdateProject) {
                await onUpdateProject(updatedProject);
            } else {
                await DataService.updateProject(updatedProject.id, updatedProject);
                alert('✅ Project updated successfully!');
            }
            setProjectToEdit(null);
        } catch (error) {
            console.error('Failed to update project:', error);
            alert('❌ Failed to update project. Please try again.');
        }
    };

    // Filter projects based on local filters state
    const filteredProjects = useMemo(() => {
        const parseDetail = (details: string, key: string) => {
            // Handle both single-line (same line as key) and multi-line (next line) content
            const match = details.match(new RegExp(`\\*\\*${key}:\\*\\*\\s*([\\s\\S]*?)(?=\\n\\*\\*|\\n---|$)`, 'm'));
            return match ? match[1].trim() : '';
        };

        return projects.filter((project: Project) => {
            const publishedMatch = project.status === 'published' || project.status === undefined;
            
            // Handle multi-country projects: split by comma and check if any match the filter
            const projectCountries = project.country
                ? project.country.split(',').map(c => c.toLowerCase().trim())
                : [];
            const countryMatch = filters.country === 'all' || projectCountries.includes(filters.country.toLowerCase().trim());
            
            const solutionMatch = filters.solutionType === 'all' || project.corruptionType.includes(filters.solutionType);
            const projectIfis = (parseDetail(project.details, 'IFI') || 'N/A')
                .split(',')
                .map(ifi => ifi.trim())
                .map(ifi => getIfiAbbreviation(ifi));
            const ifiMatch = filters.ifi === 'all' || projectIfis.includes(filters.ifi);
            const statusMatch = filters.projectStatus === 'all' || parseDetail(project.details, 'Project Status') === filters.projectStatus;

            return publishedMatch && countryMatch && solutionMatch && ifiMatch && statusMatch;
        });
    }, [projects, filters]);

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
                <InteractiveMap 
                    projects={filteredProjects} 
                    onMarkerClick={openDetailModal} 
                    onMapLoad={handleMapLoad}
                    mapStyle={mapStyles[mapStyleIndex].url}
                />
                
                {/* Currently Viewing Card */}
                <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-[#0d1b2a] p-2 md:p-3 rounded-lg shadow-lg z-10 w-[140px] md:w-[200px] border border-[#384860]">
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
                                <h4 className="text-[10px] md:text-[12px] text-[#9eafc0] mb-0.5 md:mb-1">Currently Viewing</h4>
                                <p className="text-xs md:text-sm font-extrabold text-[#a0b0c8]">
                                    {filters.country.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                                </p>
                                <div className="mt-1 md:mt-2 pt-1 md:pt-2 border-t border-[#384860]">
                                    <p className="text-[9px] md:text-xs text-[#9eafc0]/80 mb-0.5">Total Cases</p>
                                    <p className="text-sm md:text-lg font-bold text-[#a0b0c8]">
                                        {filteredProjects.length}
                                    </p>
                                </div>

                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <h4 className="text-[#9eafc0] mb-1">Currently Viewing</h4>
                            <p className="text-sm font-extrabold text-[#a0b0c8]">
                                {filters.country === 'all' ? 'ALL COUNTRIES' : filters.country.toUpperCase()}
                            </p>
                            <div className="mt-2 pt-2 border-t border-[#384860]">
                                <p className="text-xs text-[#9eafc0]/80 mb-0.5">Total Cases</p>
                                <p className="text-lg font-bold text-[#a0b0c8]">
                                    {filteredProjects.length}
                                </p>
                            </div>

                        </div>
                    )}
                </div>

                {/* Map Style Switcher - Top Right */}
                <div className="absolute top-2 right-2 md:top-4 md:right-4 z-20 bg-[#0d1b2a] p-2 md:p-3 rounded-lg shadow-lg border border-[#384860]">
                    <div className="flex flex-col gap-1.5">
                        <p className="text-[10px] md:text-xs font-bold text-[#9eafc0] text-center">Map Style</p>
                        {mapStyles.map((style, index) => (
                            <button
                                key={index}
                                onClick={() => setMapStyleIndex(index)}
                                className={`px-2.5 py-1.5 md:px-3 md:py-1.5 text-[9px] md:text-xs font-semibold rounded transition-colors ${
                                    mapStyleIndex === index
                                        ? 'bg-[#FFA500] text-[#0a1628]'
                                        : 'bg-[#384860] text-[#a0b0c8] hover:bg-[#4a5a75]'
                                }`}
                            >
                                {style.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filters Button - Mobile Only */}
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="md:hidden absolute top-16 right-2 z-20 bg-brand-dark-blue text-white px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 hover:bg-brand-medium-blue transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span className="font-semibold text-xs">Filters</span>
                </button>

                {/* Filters Panel - Desktop (right side) */}
                <div className="hidden md:block absolute bottom-4 right-4 z-10 max-w-[200px] md:max-w-xs">
                    <div className="bg-[#0d1b2a] p-3 border rounded-lg shadow-lg border-[#384860]">
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
                        <div className="relative w-full bg-[#0d1b2a] rounded-t-2xl shadow-2xl max-h-[80vh] overflow-y-auto animate-slide-up">
                            <div className="sticky top-0 bg-[#0d1b2a] border-b border-[#384860] px-4 py-3 flex items-center justify-between">
                                <h3 className="text-[#9eafc0]">Filters</h3>
                                <button
                                    onClick={() => setIsFilterOpen(false)}
                                    className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                                >
                                    <svg className="w-6 h-6 text-[#9eafc0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            {selectedProject && !projectToEdit && (
                <ProjectDetailModal
                    project={selectedProject}
                    onClose={closeDetailModal}
                    onEdit={canEditProjects ? handleEditProject : undefined}
                    isSidePanel={true}
                />
            )}

            {/* Project Edit Form */}
            {projectToEdit && (
                <ProjectForm
                    projectToEdit={projectToEdit}
                    onClose={() => setProjectToEdit(null)}
                    onProjectAdded={() => setProjectToEdit(null)}
                    onUpdateProject={handleUpdateProject}
                    isModal={true}
                    userRole={(user?.role as 'contributor' | 'admin' | 'super-admin') || 'contributor'}
                />
            )}
        </div>
    );
};

export default MapPage;