import React, { useState } from 'react';
import { Project } from '@/types/types';
import { PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon } from '@/components/ui/icons';
import ProjectForm from '@/components/features/projects/ProjectForm';
import Pagination from './Pagination';
import { useTable } from './useTable';
import SortableTableHeader from './SortableTableHeader';
import Checkbox from './Checkbox';

interface ProjectListProps {
    projects: Project[];
    onAddProject: (projectData: Omit<Project, 'id'>) => void;
    onUpdateProject: (project: Project) => void;
    onDeleteProjects: (projectIds: number[]) => void;
    onEditProject?: (project: Project) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onAddProject, onUpdateProject, onDeleteProjects, onEditProject }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

    const {
        paginatedItems,
        requestSort,
        setSearchTerm,
        sortConfig,
        currentPage,
        totalPages,
        handlePageChange,
        selectedItems,
        setSelectedItems,
        handleSelectItem,
        handleSelectAll,
        isAllSelected,
    } = useTable<Project>({
        items: projects,
        initialSortConfig: { key: 'publishDate', direction: 'descending' },
        searchableFields: ['title', 'country', 'submittedBy'],
        itemsPerPage: 20
    });

    const handleOpenAddModal = () => {
        setProjectToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (project: Project) => {
        if (onEditProject) {
            onEditProject(project);
        } else {
            setProjectToEdit(project);
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setProjectToEdit(null);
    };

    const handleDelete = (projectId: number) => {
        if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            onDeleteProjects([projectId]);
            if (paginatedItems.length === 1 && currentPage > 1) {
                handlePageChange(currentPage - 1);
            }
        }
    };

    const handleBulkDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${selectedItems.length} selected projects? This action cannot be undone.`)) {
            onDeleteProjects(selectedItems);
            setSelectedItems([]);
            if (paginatedItems.length === selectedItems.length && currentPage > 1) {
                handlePageChange(currentPage - 1);
            }
        }
    };
    
    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-brand-dark-blue">Manage Projects</h2>
                    <p className="text-gray-600 mt-1">Manage all submitted projects.</p>
                </div>
            </div>
            
             {selectedItems.length > 0 && (
                <div className="flex items-center justify-between p-4 bg-blue-100 border border-blue-200 rounded-lg mb-4">
                    <p className="text-sm font-medium text-blue-800">{selectedItems.length} project(s) selected.</p>
                    <button
                        onClick={handleBulkDelete}
                        className="bg-red-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-600 text-sm flex items-center gap-2"
                    >
                        <TrashIcon className="w-4 h-4" />
                        Delete Selected
                    </button>
                </div>
            )}

            <div className="mb-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by title, country, or contributor..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 pl-9 border border-gray-300 rounded-md focus:ring-brand-medium-blue focus:border-brand-medium-blue"
                        aria-label="Search projects"
                    />
                    <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            <div className="bg-white border rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left text-gray-700">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th scope="col" className="px-6 py-4">
                                     <Checkbox
                                        checked={isAllSelected(paginatedItems)}
                                        onChange={() => handleSelectAll(paginatedItems)}
                                        aria-label="Select all projects on this page"
                                    />
                                </th>
                                <SortableTableHeader label="Project Title" sortKey="title" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableTableHeader label="Country" sortKey="country" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableTableHeader label="Date" sortKey="publishDate" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableTableHeader label="Status" sortKey="status" sortConfig={sortConfig} requestSort={requestSort} />
                                <th scope="col" className="px-6 py-4 font-bold text-brand-dark-blue text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedItems.map(project => {
                                // Status is now a direct field in the optimized query
                                let displayDate = 'N/A';
                                if (project.publishDate) {
                                    displayDate = project.publishDate;
                                } else if (project.submittedAt) {
                                    const date = new Date(project.submittedAt);
                                    if (!isNaN(date.getTime())) {
                                        displayDate = date.toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short', 
                                            day: 'numeric'
                                        });
                                    }
                                }
                                return (
                                    <tr key={project.id} className={`border-b transition-colors ${selectedItems.includes(project.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                                        <td className="px-6 py-4">
                                             <Checkbox
                                                checked={selectedItems.includes(project.id)}
                                                onChange={() => handleSelectItem(project.id)}
                                                aria-label={`Select project ${project.title}`}
                                            />
                                        </td>
                                        <td className="px-6 py-4 font-medium max-w-sm truncate">{project.title}</td>
                                        <td className="px-6 py-4 capitalize">{project.country?.toLowerCase()}</td>
                                        <td className="px-6 py-4">{displayDate}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                project.status === 'draft' 
                                                    ? 'bg-yellow-100 text-yellow-800' 
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                                {project.status === 'draft' ? 'Waiting for approval' : 'Published'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end items-center space-x-3">
                                                <button 
                                                    onClick={() => handleOpenEditModal(project)}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                                    aria-label={`Edit ${project.title}`}
                                                >
                                                    <PencilIcon />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(project.id)}
                                                    className="text-red-600 hover:text-red-800 transition-colors"
                                                    aria-label={`Delete ${project.title}`}
                                                >
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                 <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            {isModalOpen && (
                <ProjectForm
                    onClose={handleCloseModal}
                    onProjectAdded={() => {
                        handleCloseModal();
                    }}
                    projectToEdit={projectToEdit}
                />
            )}
        </div>
    );
};

export default ProjectList;