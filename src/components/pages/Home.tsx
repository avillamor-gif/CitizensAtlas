import React from 'react';
import Hero from '@/components/pages/Hero';
import ContentCarousel from '@/components/pages/ContentCarousel';
import Newsletter from '@/components/pages/Newsletter';
import Collaborate from '@/components/pages/Collaborate';
import { reconstructArticleSlugs, projectBriefsToArticles } from '@/lib/utils/slug-utils';
// FIX: Import Page type from types.ts to fix circular dependency
import { Project, FilterOptions, Article, Page, User, ProjectBrief } from '@/types/types';

interface HomeProps {
    projects: Project[];
    onAddProject: (projectData: Omit<Project, 'id'>) => void;
    filterOptions: FilterOptions;
    activeView: 'Map' | 'Projects';
    // FIX: Removed stray '>' character
    setActiveView: (view: 'Map' | 'Projects') => void;
    newsData: Article[];
    projectBriefsData: ProjectBrief[];
    publicationsData: Article[];
    videosData: Article[];
    onNavigate: (page: Page) => void;
    onViewArticle: (article: Article, sourcePage?: Page) => void;
    currentUser?: User | null;
}

const Home: React.FC<HomeProps> = (props) => {
    // Convert ProjectBriefs to Articles with SEO-friendly slugs
    const projectBriefsAsArticles = projectBriefsToArticles(props.projectBriefsData);

    // Reconstruct slugs for all articles with SEO-friendly format
    const newsWithSlugs = reconstructArticleSlugs(props.newsData);
    const publicationsWithSlugs = reconstructArticleSlugs(props.publicationsData);
    const videosWithSlugs = reconstructArticleSlugs(props.videosData);

    return (
        <>
            <Hero
            projects={props.projects}
            onAddProject={props.onAddProject}
            filterOptions={props.filterOptions}
            activeView={props.activeView}
            setActiveView={props.setActiveView}
            currentUser={props.currentUser}
            />
            <div className="bg-brand-section-blue">
            <ContentCarousel title="LATEST NEWS" items={newsWithSlugs} onNavigate={props.onNavigate} page="news" onViewArticle={props.onViewArticle} />
            </div>
            <div className="bg-white">
            <ContentCarousel title="ACTIVE FIGHT SITES" items={projectBriefsAsArticles} hasBackground={false} onNavigate={props.onNavigate} page="active-fight-sites" onViewArticle={props.onViewArticle} />
            </div>
            <Collaborate />
            <div className="bg-brand-section-blue">
            <ContentCarousel title="VIDEOS" items={videosWithSlugs} onNavigate={props.onNavigate} page="videos" onViewArticle={props.onViewArticle} isVideoCarousel={true} />
            </div>
            <div className="bg-white">
            <ContentCarousel title="PUBLICATIONS" items={publicationsWithSlugs} hasBackground={false} onNavigate={props.onNavigate} page="publications" onViewArticle={props.onViewArticle} />
            </div>
            <Newsletter />
        </>
    );
};

export default Home;