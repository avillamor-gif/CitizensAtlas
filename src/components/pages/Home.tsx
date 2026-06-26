import React from 'react';
import Hero from '@/components/pages/Hero';
import ContentCarousel from '@/components/pages/ContentCarousel';
import Newsletter from '@/components/pages/Newsletter';
import Collaborate from '@/components/pages/Collaborate';
import { slugify } from '@/lib/constants';
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
    onViewArticle: (article: Article) => void;
    currentUser?: User | null;
}

const Home: React.FC<HomeProps> = (props) => {
    // Convert ProjectBrief to Article format for display
    const projectBriefsAsArticles: Article[] = props.projectBriefsData.map((brief, index) => ({
        id: brief.id,
        slug: `${slugify(brief.project_name)}-${brief.id}`,
        category: brief.project_type || 'Project Brief',
        title: brief.project_name,
        description: `${brief.location}${brief.financing_amount ? ` - ${brief.financing_amount}` : ''}`,
        imageUrl: 'https://picsum.photos/400/300?random=' + index,
        tagColor: '#FFEB3B',
        publishDate: brief.created_at || brief.submitted_at,
        status: brief.status || 'published',
        country: brief.country, // Store country for navigation
    }));

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
            <ContentCarousel title="LATEST NEWS" items={props.newsData} onNavigate={props.onNavigate} page="news" onViewArticle={props.onViewArticle} />
            </div>
            <div className="bg-white">
            <ContentCarousel title="ACTIVE FIGHT SITES" items={projectBriefsAsArticles} hasBackground={false} onNavigate={props.onNavigate} page="active-fight-sites" onViewArticle={props.onViewArticle} />
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