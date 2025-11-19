import React from 'react';
import ProjectForm from '@/components/features/projects/ProjectForm';
import { Project } from '@/types/types';

interface ProjectFormPageProps {
    onProjectAdded: () => void;
    onBack: () => void;
    projectToEdit?: Project | null;
    onAddProject?: (projectData: Omit<Project, 'id'>) => void;
    onUpdateProject?: (project: Project) => void;
    userRole?: 'contributor' | 'admin' | 'super-admin';
}

const ProjectFormPage: React.FC<ProjectFormPageProps> = ({ onProjectAdded, onBack, projectToEdit, onAddProject, onUpdateProject, userRole }) => {
    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-brand-dark-blue">
                        {projectToEdit ? 'Edit Project' : 'Add Project'}
                    </h2>
                    <p className="text-gray-600 mt-1">
                        {projectToEdit ? 'Update project details.' : 'Submit a new project to the database.'}
                    </p>
                </div>
            </div>
            
            <ProjectForm
                onClose={onBack}
                onProjectAdded={onProjectAdded}
                projectToEdit={projectToEdit}
                isModal={false}
                onAddProject={onAddProject}
                onUpdateProject={onUpdateProject}
                userRole={userRole}
            />
        </div>
    );
};

export default ProjectFormPage;
