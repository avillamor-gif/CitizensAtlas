import React, { useState, useCallback } from 'react';
import DashboardV2 from '@/components/pages/DashboardV2';
import ProjectGrid from '@/components/features/projects/ProjectGrid';
import { ChevronDownIcon, PlusIcon, MinusIcon, ShareIcon, MagnifyingGlassIcon } from '@/components/ui/icons';
import { Project, Filters, FilterOptions, User } from '@/types/types';
import ProjectForm from '@/components/features/projects/ProjectForm';
import ProjectDetailModal from '@/components/features/projects/ProjectDetailModal';
import InteractiveMap from '@/components/features/map/InteractiveMap';
import FilterPanel from '@/components/pages/FilterPanel';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Filter } from 'lucide-react';
import * as DataService from '@/lib/services/data-service';

const MapToggle: React.FC<{ active: 'Map' | 'Projects'; setActive: (view: 'Map' | 'Projects') => void; }> = ({ active, setActive }) => {
    return (
      <div className="relative flex items-center bg-gray-100 rounded-full p-1 shadow-inner w-full">
        <button
          className={`relative z-10 w-1/2 py-2 text-center rounded-full transition-colors duration-300 font-medium ${active === 'Map' ? 'text-white' : 'text-brand-dark-blue'}`}
          onClick={() => setActive('Map')}
        >
          Map
        </button>
        <button
          className={`relative z-10 w-1/2 py-2 text-center rounded-full transition-colors duration-300 font-medium ${active === 'Projects' ? 'text-white' : 'text-brand-dark-blue'}`}
          onClick={() => setActive('Projects')}
        >
          Projects
        </button>
        <div
          className={`absolute top-1 bottom-1 bg-brand-dark-blue rounded-full transition-transform duration-300 ease-in-out shadow-md`}
          style={{ transform: active === 'Map' ? 'translateX(2px)' : 'translateX(calc(100% - 2px))', width: 'calc(50% - 4px)'}}
        ></div>
      </div>
    );
  };
  
interface HeroProps {
    activeView: 'Map' | 'Projects';
    setActiveView: (view: 'Map' | 'Projects') => void;
    projects: Project[];
    onAddProject: (project: Omit<Project, 'id'>) => void;
    filterOptions: FilterOptions;
    currentUser?: User | null;
}

const Hero: React.FC<HeroProps> = ({ activeView, setActiveView, projects, onAddProject, filterOptions, currentUser }) => {
    // Independent filters state for homepage map - not shared with Map page
    const [filters, setFilters] = useState<Filters>({
        country: 'all',
        solutionType: 'all',
        ifi: 'all',
        projectStatus: 'all',
    });

    const [isDashboardVisible, setIsDashboardVisible] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Local filter change handler
    const onFilterChange = useCallback((filterName: keyof Filters, value: string) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value,
        }));
    }, []);

    // Count active filters
    const activeFilterCount = Object.entries(filters).filter(([key, value]) => value !== 'all').length;

    // Auto-show dashboard when filters are applied
    React.useEffect(() => {
        if (activeFilterCount > 0) {
            setIsDashboardVisible(true);
        }
    }, [activeFilterCount]);

    const clearAllFilters = useCallback(() => {
        setFilters({
            country: 'all',
            solutionType: 'all',
            ifi: 'all',
            projectStatus: 'all',
        });
    }, []);

    const openDetailModal = useCallback((project: Project) => {
        setSelectedProject(project);
    }, []);

    const closeDetailModal = () => {
        setSelectedProject(null);
    };

    const handleEditProject = useCallback((project: Project) => {
        setProjectToEdit(project);
        setSelectedProject(null); // Close the details modal
    }, []);

    const handleUpdateProject = async (updatedProject: Project) => {
        try {
            // Update the project in the database
            await DataService.updateProject(updatedProject.id, updatedProject);
            alert('✅ Project updated successfully!');
            setProjectToEdit(null);
        } catch (error) {
            console.error('Failed to update project:', error);
            alert('❌ Failed to update project. Please try again.');
        }
    };

    const handleMarkerClick = useCallback((project: Project) => {
        // Show the detail modal
        openDetailModal(project);
        
        // Auto-reveal the dashboard
        setIsDashboardVisible(true);
        
        // Auto-filter by the project's country if not already filtered
        if (project.country && filters.country === 'all') {
            setFilters(prev => ({
                ...prev,
                country: project.country,
            }));
        }
    }, [filters.country, openDetailModal]);

    return (
        <section className="bg-white py-12 px-4 sm:px-8 lg:px-16">
            <div className="container mx-auto">
                                <div className="text-left max-w-4xl mb-8">
                    <p className="text-gray-700 mb-4">
                        The Citizens' Atlas is a crowdsourced platform mapping false solutions to waste and climate, empowering communities with data, tools, and stories to expose harms and promote real Zero Waste solutions.
                    </p>
                    <p className="text-gray-700 font-medium">
                        Select a <span className="font-bold text-brand-dark-blue">country</span> to dig into their false solution projects.
                    </p>
                </div>

                {/* Sticky Toggle for Mobile */}
                <div className="lg:hidden sticky top-[88px] z-30 bg-white pb-4 mb-4 border-b border-gray-200">
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <MapToggle active={activeView} setActive={setActiveView} />
                        </div>
                        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                            <SheetTrigger asChild>
                                <button className="relative bg-brand-dark-blue text-white px-4 py-2 rounded-full font-medium hover:bg-opacity-90 transition-colors flex items-center gap-2 shadow-md">
                                    <Filter className="w-4 h-4" />
                                    <span>Filters</span>
                                    {activeFilterCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </button>
                            </SheetTrigger>
                            <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
                                <SheetHeader>
                                    <SheetTitle className="text-brand-dark-blue">Filter Projects</SheetTitle>
                                </SheetHeader>
                                <div className="mt-6">
                                    <FilterPanel 
                                        filters={filters}
                                        onFilterChange={onFilterChange}
                                        filterOptions={filterOptions}
                                    />
                                    {activeFilterCount > 0 && (
                                        <button
                                            onClick={clearAllFilters}
                                            className="w-full mt-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                                        >
                                            Clear All Filters
                                        </button>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Column: Map or Projects */}
                    <div className="lg:col-span-3">
                        {activeView === 'Map' ? (
                           <div className="relative border rounded-lg shadow-lg overflow-hidden h-[400px] md:h-[600px] bg-gray-200">
                                <InteractiveMap 
                                    projects={projects} 
                                    onMarkerClick={handleMarkerClick}
                                />
                            </div>
                        ) : (
                            <ProjectGrid projects={projects} onProjectSelect={openDetailModal} />
                        )}
                    </div>

                    {/* Right Column: Filters */}
                    <div className="lg:col-span-1">
                        <div className="mb-4 hidden lg:block">
                            <MapToggle active={activeView} setActive={setActiveView} />
                        </div>
                        <div className="bg-[#f7f8f9] p-6 border rounded-lg shadow-lg hidden lg:block">
                            <FilterPanel 
                                filters={filters}
                                onFilterChange={onFilterChange}
                                filterOptions={filterOptions}
                            />
                            {activeFilterCount > 0 && (
                                <button
                                    onClick={clearAllFilters}
                                    className="w-full mt-4 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                                >
                                    Clear All Filters
                                </button>
                            )}
                        </div>
                        {activeView === 'Map' && (
                            <button 
                                onClick={() => setIsDashboardVisible(!isDashboardVisible)}
                                className="mt-4 w-full bg-brand-dark-blue text-white p-4 rounded-lg shadow-md hover:bg-opacity-90 flex justify-center items-center gap-3 transition-all duration-300"
                            >
                                <span className="uppercase font-semibold tracking-wide">
                                    {isDashboardVisible ? 'Hide dashboard' : 'Show dashboard'}
                                </span>
                                <ChevronDownIcon className={`w-6 h-6 transform transition-transform ${isDashboardVisible ? 'rotate-180' : ''}`} />
                            </button>
                        )}
                    </div>
                </div>

                {activeView === 'Map' && (
                    <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isDashboardVisible ? 'max-h-[1000px] opacity-100 mt-8' : 'max-h-0 opacity-0'}`}>
                       <DashboardV2 projects={projects} filters={filters} currentUser={currentUser} />
                    </div>
                )}
            </div>
            {selectedProject && !projectToEdit && (
                <ProjectDetailModal project={selectedProject} onClose={closeDetailModal} onEdit={handleEditProject} />
            )}
            {projectToEdit && (
                <ProjectForm
                    projectToEdit={projectToEdit}
                    onClose={() => setProjectToEdit(null)}
                    onProjectAdded={() => setProjectToEdit(null)}
                    onUpdateProject={handleUpdateProject}
                    isModal={true}
                    userRole="admin"
                />
            )}
        </section>
    );
};

export default Hero;