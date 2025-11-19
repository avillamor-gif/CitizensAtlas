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

    const openDetailModal = useCallback((project: Project) => {
        setSelectedProject(project);
    }, []);

    const closeDetailModal = () => {
        setSelectedProject(null);
    };

    return (
        <div className="relative w-full" style={{ height: 'calc(100vh - 101px)' /* Adjust based on header height */ }}>
            <InteractiveMap projects={projects} onMarkerClick={openDetailModal} />
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