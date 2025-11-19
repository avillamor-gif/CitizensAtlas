import React from 'react';
import { Project } from '@/types/types';

const parseDetail = (details: string, key: string): string => {
    const match = details.match(new RegExp(`\\*\\*${key}:\\*\\*(.*)`));
    return match ? match[1].trim() : 'N/A';
};

const ProjectListItem: React.FC<{ project: Project; onClick: () => void }> = ({ project, onClick }) => {
    const totalProjectAmount = parseDetail(project.details, 'Total Project Amount');
    const ifi = parseDetail(project.details, 'IFI');
    
    return (
        <div
            className="bg-white p-6 border border-gray-200 rounded-lg cursor-pointer hover:shadow-md hover:border-brand-medium-blue transition-all duration-200 group"
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
            aria-label={`View details for ${project.title}`}
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">{project.country}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{project.publishDate || 'N/A'}</span>
                    </div>
                    <h3 className="text-lg font-bold text-brand-dark-blue mb-2 group-hover:text-brand-light-blue transition-colors duration-200">
                        {project.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span><strong className="text-gray-800">False Solution:</strong> {project.corruptionType}</span>
                        <span><strong className="text-gray-800">Amount:</strong> {totalProjectAmount}</span>
                        {ifi !== 'N/A' && <span><strong className="text-gray-800">IFI:</strong> {ifi}</span>}
                    </div>
                </div>
                <div className="flex-shrink-0">
                    <button className="text-brand-medium-blue hover:text-brand-dark-blue font-medium text-sm">
                        View Details →
                    </button>
                </div>
            </div>
        </div>
    );
};

interface ProjectListProps {
    projects: Project[];
    onProjectSelect: (project: Project) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onProjectSelect }) => {
    return (
        <div className="space-y-4">
            {projects.length > 0 ? (
                projects.map(project => (
                    <ProjectListItem 
                        key={project.id} 
                        project={project} 
                        onClick={() => onProjectSelect(project)} 
                    />
                ))
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                    <h3 className="text-2xl font-semibold text-brand-dark-blue">No Projects Found</h3>
                    <p className="text-gray-600 mt-2">Try adjusting your filter criteria.</p>
                </div>
            )}
        </div>
    );
};

export default ProjectList;