import React, { useState, useCallback } from 'react';
import DashboardV2 from '@/components/pages/DashboardV2';
import ProjectGrid from '@/components/features/projects/ProjectGrid';
import { ChevronDownIcon, PlusIcon, MinusIcon, ShareIcon, MagnifyingGlassIcon } from '@/components/ui/icons';
import { Project, Filters, FilterOptions, User } from '@/types/types';
import ProjectForm from '@/components/features/projects/ProjectForm';
import InteractiveMap from '@/components/features/map/InteractiveMap';
import ProjectDetailModal from '@/components/features/projects/ProjectDetailModal';
import FilterPanel from '@/components/pages/FilterPanel';

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
    filters: Filters;
    onFilterChange: (filterName: keyof Filters, value: string) => void;
    filterOptions: FilterOptions;
    currentUser?: User | null;
}

const Hero: React.FC<HeroProps> = ({ activeView, setActiveView, projects, onAddProject, filters, onFilterChange, filterOptions, currentUser }) => {
    const [isDashboardVisible, setIsDashboardVisible] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const openDetailModal = useCallback((project: Project) => {
        setSelectedProject(project);
    }, []);

    const closeDetailModal = () => {
        setSelectedProject(null);
    };

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

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Column: Map or Projects */}
                    <div className="lg:col-span-3">
                        {activeView === 'Map' ? (
                           <div className="relative border rounded-lg shadow-lg overflow-hidden h-[400px] md:h-[600px] bg-gray-200">
                                <InteractiveMap 
                                    projects={projects} 
                                    onMarkerClick={openDetailModal}
                                />
                            </div>
                        ) : (
                            <ProjectGrid projects={projects} onProjectSelect={openDetailModal} />
                        )}
                    </div>

                    {/* Right Column: Filters */}
                    <div className="lg:col-span-1">
                        <div className="mb-4">
                            <MapToggle active={activeView} setActive={setActiveView} />
                        </div>
                        <div className="bg-[#f7f8f9] p-6 border rounded-lg shadow-lg">
                            <FilterPanel 
                                filters={filters}
                                onFilterChange={onFilterChange}
                                filterOptions={filterOptions}
                            />
                        </div>
                        {activeView === 'Map' && (
                            <button 
                                onClick={() => setIsDashboardVisible(!isDashboardVisible)}
                                className="mt-4 w-full bg-brand-dark-blue text-white p-4 rounded-lg shadow-md hover:bg-opacity-90 flex justify-between items-center transition-all duration-300"
                            >
                                <span className="uppercase font-semibold tracking-wide">Show dashboard</span>
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
            <ProjectDetailModal project={selectedProject} onClose={closeDetailModal} />
        </section>
    );
};

export default Hero;