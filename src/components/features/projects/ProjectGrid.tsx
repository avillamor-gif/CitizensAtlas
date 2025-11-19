import React, { useState, useMemo, useEffect } from 'react';
import { Project } from '@/types/types';
import ViewToggle from '@/components/pages/ViewToggle';
import ProjectList from './ProjectList';

const parseDetail = (details: string, key: string): string => {
    const match = details.match(new RegExp(`\\*\\*${key}:\\*\\*(.*)`));
    return match ? match[1].trim() : 'N/A';
};

const ProjectCard: React.FC<{ project: Project; onClick: () => void }> = ({ project, onClick }) => {
    const totalProjectAmount = parseDetail(project.details, 'Total Project Amount');
    return (
        <div
            className="bg-white p-6 border border-gray-200 rounded-lg h-full flex flex-col cursor-pointer hover:shadow-lg hover:border-brand-medium-blue transition-all duration-200 group"
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
            aria-label={`View details for ${project.title}`}
        >
            <span className="text-xs font-bold text-gray-500 tracking-widest mb-2">{project.country}</span>
            <h3 className="text-lg font-bold text-brand-dark-blue mb-3 flex-grow group-hover:text-brand-light-blue transition-colors duration-200">{project.title}</h3>
            <div className="mt-auto pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold text-gray-800">False Solution Type:</span> {project.corruptionType}
                </p>
                <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-800">Total Project Amount:</span> {totalProjectAmount}
                </p>
            </div>
        </div>
    );
};


interface ProjectGridProps {
    projects: Project[];
    onProjectSelect: (project: Project) => void;
}

const ProjectGrid: React.FC<ProjectGridProps> = ({ projects, onProjectSelect }) => {
    type SortKey = 'country' | 'title' | 'corruptionType' | 'publishDate';
    const [sortKey, setSortKey] = useState<SortKey>('publishDate');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [visibleCount, setVisibleCount] = useState(6);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        setVisibleCount(6);
    }, [sortKey, sortOrder, projects]);

    const sortedProjects = useMemo(() => {
        const sorted = [...projects].sort((a, b) => {
            let valA: any, valB: any;
            
            // Handle date sorting specially
            if (sortKey === 'publishDate') {
                valA = a.publishDate ? new Date(a.publishDate) : new Date(0);
                valB = b.publishDate ? new Date(b.publishDate) : new Date(0);
            } else {
                valA = a[sortKey]?.toLowerCase() || '';
                valB = b[sortKey]?.toLowerCase() || '';
            }
            
            let comparison = 0;
            if (valA > valB) {
                comparison = 1;
            } else if (valA < valB) {
                comparison = -1;
            }
            
            return sortOrder === 'asc' ? comparison : comparison * -1;
        });
        return sorted;
    }, [projects, sortKey, sortOrder]);

    const projectsToShow = useMemo(() => {
        return sortedProjects.slice(0, visibleCount);
    }, [sortedProjects, visibleCount]);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 6);
    };

    const toggleSortOrder = () => {
        setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    };
    
    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                {/* View Toggle on the left */}
                <ViewToggle activeView={viewMode} setActiveView={setViewMode} />
                
                {/* Sort controls on the right */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <label htmlFor="sort-select" className="text-sm font-medium text-gray-700">Sort by:</label>
                        <select
                            id="sort-select"
                            value={sortKey}
                            onChange={(e) => setSortKey(e.target.value as SortKey)}
                            className="p-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 focus:ring-brand-medium-blue focus:border-brand-medium-blue"
                        >
                            <option value="publishDate">Publish Date</option>
                            <option value="country">Country</option>
                            <option value="title">Title</option>
                            <option value="corruptionType">False Solution Type</option>
                        </select>
                    </div>
                    <button
                        onClick={toggleSortOrder}
                        className="p-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-1 text-sm"
                        aria-label={`Sort in ${sortOrder === 'asc' ? 'descending' : 'ascending'} order`}
                    >
                        {sortOrder === 'asc' ? <span>&uarr; Asc</span> : <span>&darr; Desc</span>}
                    </button>
                </div>
            </div>
            
            {projectsToShow.length > 0 ? (
                <>
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {projectsToShow.map(p => <ProjectCard key={p.id} project={p} onClick={() => onProjectSelect(p)} />)}
                        </div>
                    ) : (
                        <ProjectList projects={projectsToShow} onProjectSelect={onProjectSelect} />
                    )}
                    {visibleCount < sortedProjects.length && (
                        <div className="text-center mt-8">
                            <button
                                onClick={handleLoadMore}
                                className="bg-brand-dark-blue text-white font-bold py-3 px-8 rounded-md hover:bg-opacity-90 transition-colors"
                            >
                                Load More
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                    <h3 className="text-2xl font-semibold text-brand-dark-blue">No Projects Found</h3>
                    <p className="text-gray-600 mt-2">Try adjusting your filter criteria.</p>
                </div>
            )}
        </div>
    );
};

export default ProjectGrid;