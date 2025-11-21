import React, { useState, useCallback } from 'react';
import InteractiveMap from './InteractiveMap';
import FilterPanel from '@/components/pages/FilterPanel';
import { Project, Filters, FilterOptions } from '@/types/types';
import ProjectDetailModal from '@/components/features/projects/ProjectDetailModal';

interface MapPageProps {
    projects: Project[];
    filters: Filters;
    onFilterChange: (filterName: keyof Filters, value: string) => void;
    filterOptions: FilterOptions;
}

const MapPage: React.FC<MapPageProps> = ({ projects, filters, onFilterChange, filterOptions }) => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isMapLoading, setIsMapLoading] = useState(true);

    const openDetailModal = useCallback((project: Project) => {
        setSelectedProject(project);
    }, []);

    const closeDetailModal = () => {
        setSelectedProject(null);
    };

    const handleMapLoad = () => {
        setIsMapLoading(false);
    };

    return (
        <div className="relative w-full" style={{ height: 'calc(100vh - 101px)' /* Adjust based on header height */ }}>
            {isMapLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
                    <div className="text-center">
                        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-medium-blue border-r-transparent"></div>
                        <p className="mt-4 text-gray-600">Loading map...</p>
                    </div>
                </div>
            )}
            <InteractiveMap projects={projects} onMarkerClick={openDetailModal} onMapLoad={handleMapLoad} />
            <div className="absolute bottom-4 right-4 z-10 w-full max-w-[280px]">
                <div className="bg-[#f7f8f9] p-4 border rounded-lg shadow-lg">
                    <FilterPanel
                        filters={filters}
                        onFilterChange={onFilterChange}
                        filterOptions={filterOptions}
                        isCompact={true}
                    />
                </div>
            </div>
            <ProjectDetailModal project={selectedProject} onClose={closeDetailModal} />
        </div>
    );
};

export default MapPage;