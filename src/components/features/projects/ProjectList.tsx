import React from 'react';
import { Project } from '@/types/types';

const parseDetail = (details: string, key: string): string => {
    // Handle both single-line (same line as key) and multi-line (next line) content
    const match = details.match(new RegExp(`\\*\\*${key}:\\*\\*\\s*([\\s\\S]*?)(?=\\n\\*\\*|\\n---|$)`, 'm'));
    return match ? match[1].trim() : 'N/A';
};

const ProjectListItem: React.FC<{ project: Project; onClick: () => void }> = ({ project, onClick }) => {
    const totalProjectAmount = parseDetail(project.details, 'Total Project Amount');
    const ifi = parseDetail(project.details, 'IFI');
    
    return (
        <div
            className="p-6 border rounded-lg cursor-pointer hover:shadow-md transition-all duration-200 group"
            style={{ backgroundColor: '#0d1b2a', borderColor: '#384860' }}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
            aria-label={`View details for ${project.title}`}
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#a0b0c8' }}>{project.country}</span>
                        <span className="text-xs" style={{ color: '#6b7a8f' }}>•</span>
                        <span className="text-xs" style={{ color: '#a0b0c8' }}>{project.publishDate || 'N/A'}</span>
                    </div>
                    <h3 className="mb-2 group-hover:text-brand-light-blue transition-colors duration-200" style={{ color: '#ffffff' }}>
                        {project.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm" style={{ color: '#a0b0c8' }}>
                        <span><strong className="text-white">False Solution:</strong> {project.corruptionType}</span>
                        <span><strong className="text-white">Amount:</strong> {totalProjectAmount}</span>
                        {ifi !== 'N/A' && <span><strong className="text-white">IFI:</strong> {ifi}</span>}
                    </div>
                </div>
                <div className="flex-shrink-0">
                    <button className="font-medium text-sm hover:opacity-80 transition-opacity" style={{ color: '#ffa51d' }}>
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
                    <h3 className="text-brand-dark-blue">No Projects Found</h3>
                    <p className="text-gray-600 mt-2">Try adjusting your filter criteria.</p>
                </div>
            )}
        </div>
    );
};

export default ProjectList;