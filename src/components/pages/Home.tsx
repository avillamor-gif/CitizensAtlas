import React from 'react';
import Hero from '@/components/pages/Hero';
import ContentCarousel from '@/components/pages/ContentCarousel';
import Newsletter from '@/components/pages/Newsletter';
import Collaborate from '@/components/pages/Collaborate';
// FIX: Import Page type from types.ts to fix circular dependency
import { Project, Filters, FilterOptions, Article, Page, User } from '@/types/types';

interface HomeProps {
    projects: Project[];
    onAddProject: (projectData: Omit<Project, 'id'>) => void;
    filters: Filters;
    onFilterChange: (filterName: keyof Filters, value: string) => void;
    filterOptions: FilterOptions;
    activeView: 'Map' | 'Projects';
    // FIX: Removed stray '>' character
    setActiveView: (view: 'Map' | 'Projects') => void;
    newsData: Article[];
    publicationsData: Article[];
    videosData: Article[];
    onNavigate: (page: Page) => void;
    onViewArticle: (article: Article) => void;
    currentUser?: User | null;
}

const Home: React.FC<HomeProps> = (props) => {
    return (
        <>
            <Hero
            projects={props.projects}
            onAddProject={props.onAddProject}
            filters={props.filters}
            onFilterChange={props.onFilterChange}
            filterOptions={props.filterOptions}
            activeView={props.activeView}
            setActiveView={props.setActiveView}
            currentUser={props.currentUser}
            />
            <div className="bg-brand-section-blue">
            <ContentCarousel title="LATEST NEWS" items={props.newsData} onNavigate={props.onNavigate} page="news" onViewArticle={props.onViewArticle} />
            </div>
            <Collaborate />
            <div className="bg-brand-section-blue">
            <ContentCarousel title="VIDEOS" items={props.videosData} onNavigate={props.onNavigate} page="videos" onViewArticle={props.onViewArticle} isVideoCarousel={true} />
            </div>
            <div className="bg-white">
            <ContentCarousel title="PUBLICATIONS" items={props.publicationsData} hasBackground={false} onNavigate={props.onNavigate} page="publications" onViewArticle={props.onViewArticle} />
            </div>
            <Newsletter />
        </>
    );
};

export default Home;