import React, { useState, useEffect } from 'react';
import { Project, Article, ProjectBrief } from '@/types/types';
import { AdminSidebar, AdminPage } from './AdminSidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { HamburgerMenu } from '@/components/ui/HamburgerMenu';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission } from '@/hooks/useRolePermissions';
import ProjectList from './ProjectList';
import NewsUpdateList from './NewsUpdateList';
import PublicationList from './PublicationList';
import VideoList from './VideoList';
import EnhancedProjectsAnalytics from './EnhancedProjectsAnalytics';
import NewsCategoryList from './NewsCategoryList';
import PublicationTypeList from './PublicationTypeList';
import VideoCategoryList from './VideoCategoryList';
import ProjectFormPage from './ProjectFormPage';
import NewsFormPage from './NewsFormPage';
import PublicationFormPage from './PublicationFormPage';
import VideoFormPage from './VideoFormPage';
import ProjectBriefList from './ProjectBriefList';
import ProjectBriefForm from './ProjectBriefForm';
import DraftsList from './DraftsList';
import BatchUpload from './BatchUpload';
import TeamManagement from './TeamManagement';
import RoleManagement from './RoleManagement';
import AccountProfile from './AccountProfile';

interface AdminDashboardProps {
    projects: Project[];
    onLoadProjects?: () => Promise<void>;
    onAddProject: (projectData: Omit<Project, 'id'>) => void;
    onUpdateProject: (project: Project) => void;
    onDeleteProjects: (projectIds: number[]) => void;
    projectBriefs: ProjectBrief[];
    onLoadProjectBriefs?: () => Promise<void>;
    onAddProjectBrief: (briefData: Omit<ProjectBrief, 'id'>) => void;
    onUpdateProjectBrief: (brief: ProjectBrief) => void;
    onDeleteProjectBriefs: (briefIds: number[]) => void;
    news: Article[];
    onLoadNews?: () => Promise<void>;
    onAddNews: (articleData: Omit<Article, 'id' | 'slug'>) => void;
    onUpdateNews: (article: Omit<Article, 'slug'>) => void;
    onDeleteNews: (articleIds: number[]) => void;
    newsCategories: string[];
    onAddNewsCategory: (category: string) => void;
    onUpdateNewsCategory: (oldName: string, newName: string) => void;
    onDeleteNewsCategory: (categoryName: string) => void;
    publications: Article[];
    onLoadPublications?: () => Promise<void>;
    onAddPublication: (articleData: Omit<Article, 'id' | 'slug'>) => void;
    onUpdatePublication: (article: Omit<Article, 'slug'>) => void;
    onDeletePublications: (articleIds: number[]) => void;
    publicationTypes: string[];
    onAddPublicationType: (type: string) => void;
    onUpdatePublicationType: (oldName: string, newName: string) => void;
    onDeletePublicationType: (typeName: string) => void;
    videos: Article[];
    onLoadVideos?: () => Promise<void>;
    onAddVideo: (articleData: Omit<Article, 'id' | 'slug'>) => void;
    onUpdateVideo: (article: Omit<Article, 'slug'>) => void;
    onDeleteVideos: (articleIds: number[]) => void;
    videoCategories: string[];
    onAddVideoCategory: (category: string) => void;
    onUpdateVideoCategory: (oldName: string, newName: string) => void;
    onDeleteVideoCategory: (categoryName: string) => void;
    onApproveDraft: (item: { id: number; type: 'project' | 'news' | 'publication' | 'video'; submittedBy?: string; title?: string }) => void;
    onRejectDraft: (item: { id: number; type: 'project' | 'news' | 'publication' | 'video'; submittedBy?: string; title?: string }) => void;
    onEditDraft: (item: { id: number; type: 'project' | 'news' | 'publication' | 'video' }) => void;
    currentUser: any;
    onNavigateToPublic?: (path: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
    const { 
        projects, onLoadProjects, onAddProject, onUpdateProject, onDeleteProjects,
        projectBriefs, onLoadProjectBriefs, onAddProjectBrief, onUpdateProjectBrief, onDeleteProjectBriefs,
        news, onLoadNews, onAddNews, onUpdateNews, onDeleteNews,
        newsCategories, onAddNewsCategory, onUpdateNewsCategory, onDeleteNewsCategory,
        publications, onLoadPublications, onAddPublication, onUpdatePublication, onDeletePublications,
        publicationTypes, onAddPublicationType, onUpdatePublicationType, onDeletePublicationType,
        videos, onLoadVideos, onAddVideo, onUpdateVideo, onDeleteVideos,
        videoCategories, onAddVideoCategory, onUpdateVideoCategory, onDeleteVideoCategory,
        onApproveDraft, onRejectDraft, onEditDraft,
        currentUser,
        onNavigateToPublic
    } = props;
    const [activeAdminPage, setActiveAdminPage] = useState<AdminPage>('projects-list');
    const { signOut } = useAuth();
    const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
    const [projectBriefToEdit, setProjectBriefToEdit] = useState<ProjectBrief | null>(null);
    const [newsToEdit, setNewsToEdit] = useState<Article | null>(null);
    const [publicationToEdit, setPublicationToEdit] = useState<Article | null>(null);
    const [videoToEdit, setVideoToEdit] = useState<Article | null>(null);

    // Auto-redirect if user doesn't have permission for current page
    React.useEffect(() => {
        const checkAndRedirect = () => {
            const userRole = currentUser?.role;
            
            // Don't redirect if we don't have user info yet (still loading)
            if (!userRole) {
                return;
            }
            
            const canViewProjects = hasPermission(userRole, 'View/Edit Projects');
            const canViewProjectBriefs = hasPermission(userRole, 'View/Edit Project Briefs');
            const canViewNews = hasPermission(userRole, 'View/Edit News');
            const canViewPublications = hasPermission(userRole, 'View/Edit Publications');
            const canViewVideos = hasPermission(userRole, 'View/Edit Videos');
            const canViewAnalytics = hasPermission(userRole, 'View Analytics');
            const canManageCategories = hasPermission(userRole, 'Manage Categories/Types');
            const canBatchUpload = hasPermission(userRole, 'Batch Upload');
            const canApproveDrafts = hasPermission(userRole, 'Pending Approvals');
            const canManageTeam = hasPermission(userRole, 'Team Management');
            const canManageRoles = hasPermission(userRole, 'Role Management');
            
            // Check if user has permission for current page
            let hasAccess = true;
            
            // Account profile is accessible to everyone
            if (activeAdminPage === 'account-profile') {
                hasAccess = true;
            } else if (activeAdminPage.startsWith('projects') && !canViewProjects) {
                hasAccess = false;
            } else if (activeAdminPage.startsWith('project-briefs') && !canViewProjectBriefs) {
                hasAccess = false;
            } else if (activeAdminPage.startsWith('news') && !canViewNews) {
                hasAccess = false;
            } else if (activeAdminPage.startsWith('publications') && !canViewPublications) {
                hasAccess = false;
            } else if (activeAdminPage.startsWith('videos') && !canViewVideos) {
                hasAccess = false;
            } else if (activeAdminPage === 'projects-analytics' && !canViewAnalytics) {
                hasAccess = false;
            } else if ((activeAdminPage === 'news-categories' || activeAdminPage === 'publications-types' || activeAdminPage === 'videos-categories') && !canManageCategories) {
                hasAccess = false;
            } else if (activeAdminPage === 'batch-upload' && !canBatchUpload) {
                hasAccess = false;
            } else if (activeAdminPage === 'pending-approvals' && !canApproveDrafts) {
                hasAccess = false;
            } else if (activeAdminPage === 'team-management' && !canManageTeam) {
                hasAccess = false;
            } else if (activeAdminPage === 'role-management' && !canManageRoles) {
                hasAccess = false;
            }
            
            // Redirect to first accessible page if no access
            if (!hasAccess) {
                const getFirstAccessiblePage = (): AdminPage => {
                    if (canViewProjects) return 'projects-list';
                    if (canViewProjectBriefs) return 'project-briefs-list';
                    if (canViewNews) return 'news-list';
                    if (canViewPublications) return 'publications-list';
                    if (canViewVideos) return 'videos-list';
                    if (canViewAnalytics) return 'projects-analytics';
                    if (canBatchUpload) return 'batch-upload';
                    if (canApproveDrafts) return 'pending-approvals';
                    if (canManageTeam) return 'team-management';
                    if (canManageRoles) return 'role-management';
                    return 'account-profile';
                };
                console.log('[Dashboard] User lacks permission for', activeAdminPage, ', redirecting...');
                setActiveAdminPage(getFirstAccessiblePage());
            }
        };
        
        checkAndRedirect();
        
        // Listen for permission updates
        const handlePermissionsUpdated = () => {
            console.log('[Dashboard] Permissions updated, rechecking access...');
            checkAndRedirect();
        };
        
        window.addEventListener('role-permissions-updated', handlePermissionsUpdated);
        return () => window.removeEventListener('role-permissions-updated', handlePermissionsUpdated);
    }, [activeAdminPage, currentUser?.role]); // Only depend on role, not entire currentUser object

    // Load data when switching to relevant pages
    useEffect(() => {
        const loadPageData = async () => {
            try {
                if (activeAdminPage === 'projects-list' || activeAdminPage === 'projects-edit' || activeAdminPage === 'projects-analytics') {
                    await onLoadProjects?.()
                } else if (activeAdminPage === 'project-briefs-list' || activeAdminPage === 'project-briefs-edit' || activeAdminPage === 'project-briefs-add') {
                    // Load both project briefs AND projects (for country dropdown)
                    await Promise.all([
                        onLoadProjectBriefs?.(),
                        onLoadProjects?.()
                    ])
                } else if (activeAdminPage === 'news-list' || activeAdminPage === 'news-edit') {
                    await onLoadNews?.()
                } else if (activeAdminPage === 'publications-list' || activeAdminPage === 'publications-edit') {
                    await onLoadPublications?.()
                } else if (activeAdminPage === 'videos-list' || activeAdminPage === 'videos-edit') {
                    await onLoadVideos?.()
                } else if (activeAdminPage === 'pending-approvals') {
                    // Load all data for Pending Approvals page
                    console.log('📥 Loading all data for Pending Approvals...')
                    await Promise.all([
                        onLoadProjects?.(),
                        onLoadNews?.(),
                        onLoadPublications?.(),
                        onLoadVideos?.()
                    ])
                    console.log('✅ All data loaded for Pending Approvals')
                }
            } catch (error) {
                console.error('Error loading page data:', error)
            }
        }
        
        loadPageData()
    }, [activeAdminPage])

    const testLogout = async () => {
        console.log('TEST: Logout button clicked in header');
        try {
            await signOut();
            console.log('TEST: signOut completed');
            window.location.href = '/';
        } catch (error) {
            console.error('TEST: Logout error', error);
        }
    };

    const handleEditProject = (project: Project) => {
        setProjectToEdit(project);
        setActiveAdminPage('projects-edit');
    };

    const handleEditNews = (article: Article) => {
        setNewsToEdit(article);
        setActiveAdminPage('news-edit');
    };

    const handleEditPublication = (article: Article) => {
        setPublicationToEdit(article);
        setActiveAdminPage('publications-edit');
    };

    const handleEditVideo = (article: Article) => {
        setVideoToEdit(article);
        setActiveAdminPage('videos-edit');
    };

    const renderContent = () => {
        const userRole = currentUser?.role;
        
        // Permission checks for each page
        const canViewProjects = hasPermission(userRole, 'View/Edit Projects');
        const canViewProjectBriefs = hasPermission(userRole, 'View/Edit Project Briefs');
        const canViewNews = hasPermission(userRole, 'View/Edit News');
        const canViewPublications = hasPermission(userRole, 'View/Edit Publications');
        const canViewVideos = hasPermission(userRole, 'View/Edit Videos');
        const canViewAnalytics = hasPermission(userRole, 'View Analytics');
        const canManageCategories = hasPermission(userRole, 'Manage Categories/Types');
        const canBatchUpload = hasPermission(userRole, 'Batch Upload');
        const canApproveDrafts = hasPermission(userRole, 'Pending Approvals');
        const canManageTeam = hasPermission(userRole, 'Team Management');
        const canManageRoles = hasPermission(userRole, 'Role Management');
        
        // Find first accessible page for redirect
        const getFirstAccessiblePage = (): AdminPage => {
            if (canViewProjects) return 'projects-list';
            if (canViewProjectBriefs) return 'project-briefs-list';
            if (canViewNews) return 'news-list';
            if (canViewPublications) return 'publications-list';
            if (canViewVideos) return 'videos-list';
            if (canViewAnalytics) return 'projects-analytics';
            if (canBatchUpload) return 'batch-upload';
            if (canApproveDrafts) return 'pending-approvals';
            if (canManageTeam) return 'team-management';
            if (canManageRoles) return 'role-management';
            return 'account-profile'; // Everyone can access their profile
        };
        
        // Access denied component
        const AccessDenied = () => (
            <div className="flex flex-col items-center justify-center h-full p-8">
                <div className="text-center max-w-md">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
                    <p className="text-gray-600 mb-6">
                        You don't have permission to access this page. Please contact your administrator if you believe this is an error.
                    </p>
                    <Button onClick={() => setActiveAdminPage(getFirstAccessiblePage())}>
                        Go to Dashboard
                    </Button>
                </div>
            </div>
        );
        
        switch (activeAdminPage) {
            case 'batch-upload':
                if (!canBatchUpload) return <AccessDenied />;
                return <BatchUpload onSuccess={() => {
                    // Optionally refresh data or show success message
                    alert('Batch upload completed successfully!');
                }} />;
            case 'team-management':
                if (!canManageTeam) return <AccessDenied />;
                return <TeamManagement />;
            case 'role-management':
                if (!canManageRoles) return <AccessDenied />;
                return <RoleManagement />;
            case 'account-profile':
                return <AccountProfile currentUser={currentUser} />;
            case 'pending-approvals':
                if (!canApproveDrafts) return <AccessDenied />;
                return (
                    <DraftsList
                        projects={projects}
                        news={news}
                        publications={publications}
                        videos={videos}
                        onApprove={(item) => {
                            console.log('🔵 AdminDashboard onApprove wrapper called with:', item);
                            onApproveDraft(item);
                            // Redirect to the appropriate list page after approval
                            const targetPage = {
                                'project': 'projects-list',
                                'news': 'news-list',
                                'publication': 'publications-list',
                                'video': 'videos-list'
                            }[item.type] as AdminPage;
                            
                            console.log('🔵 Will redirect to:', targetPage);
                            // Short delay to allow the approval to complete
                            setTimeout(() => {
                                console.log('🔵 Redirecting now to:', targetPage);
                                setActiveAdminPage(targetPage);
                            }, 500);
                        }}
                        onReject={onRejectDraft}
                        onEdit={(item) => {
                            console.log('✏️ AdminDashboard onEdit wrapper called with:', item);
                            
                            // Find the item in the appropriate array and set it as the edit target
                            switch (item.type) {
                                case 'project':
                                    const project = projects.find(p => p.id === item.id);
                                    if (project) {
                                        handleEditProject(project);
                                    }
                                    break;
                                case 'news':
                                    const newsItem = news.find(n => n.id === item.id);
                                    if (newsItem) {
                                        handleEditNews(newsItem);
                                    }
                                    break;
                                case 'publication':
                                    const publication = publications.find(p => p.id === item.id);
                                    if (publication) {
                                        handleEditPublication(publication);
                                    }
                                    break;
                                case 'video':
                                    const video = videos.find(v => v.id === item.id);
                                    if (video) {
                                        handleEditVideo(video);
                                    }
                                    break;
                            }
                            
                            // Call the parent's onEdit handler if it exists
                            onEditDraft(item);
                        }}
                        filterType="all"
                    />
                );
            case 'projects-add':
                if (!canViewProjects) return <AccessDenied />;
                return (
                    <ProjectFormPage
                        onAddProject={onAddProject}
                        onProjectAdded={() => {
                            // Stay on form page after saving
                        }}
                        onBack={() => setActiveAdminPage('projects-list')}
                        userRole={currentUser?.role}
                    />
                );
            case 'projects-edit':
                if (!canViewProjects) return <AccessDenied />;
                return (
                    <ProjectFormPage
                        onUpdateProject={onUpdateProject}
                        onProjectAdded={() => {
                            // Stay on form page after saving
                        }}
                        onBack={() => {
                            setProjectToEdit(null);
                            setActiveAdminPage('projects-list');
                        }}
                        projectToEdit={projectToEdit}
                        userRole={currentUser?.role}
                    />
                );
            case 'projects-list':
                if (!canViewProjects) return <AccessDenied />;
                return (
                    <ProjectList
                        projects={projects}
                        onAddProject={onAddProject}
                        onUpdateProject={onUpdateProject}
                        onDeleteProjects={onDeleteProjects}
                        onEditProject={handleEditProject}
                    />
                );
            case 'projects-analytics':
                if (!canViewAnalytics) return <AccessDenied />;
                return <EnhancedProjectsAnalytics projects={projects} currentUser={currentUser} />;
            
            // Project Briefs
            case 'project-briefs-list':
                if (!canViewProjectBriefs) return <AccessDenied />;
                return (
                    <ProjectBriefList
                        briefs={projectBriefs}
                        onEdit={(brief) => {
                            setProjectBriefToEdit(brief);
                            setActiveAdminPage('project-briefs-edit');
                        }}
                        onDelete={onDeleteProjectBriefs}
                    />
                );
            case 'project-briefs-add':
                if (!canViewProjectBriefs) return <AccessDenied />;
                return (
                    <ProjectBriefForm
                        onSave={(briefData) => {
                            onAddProjectBrief(briefData);
                            setActiveAdminPage('project-briefs-list');
                        }}
                        onCancel={() => setActiveAdminPage('project-briefs-list')}
                        userRole={currentUser?.role}
                        userId={currentUser?.id}
                        countries={Array.from(new Set(projects.map(p => p.country?.trim()).filter(Boolean))).map(c => c.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' '))}
                    />
                );
            case 'project-briefs-edit':
                if (!canViewProjectBriefs) return <AccessDenied />;
                if (!projectBriefToEdit) {
                    setActiveAdminPage('project-briefs-list');
                    return null;
                }
                return (
                    <ProjectBriefForm
                        briefToEdit={projectBriefToEdit}
                        onSave={(briefData) => {
                            onUpdateProjectBrief({ ...briefData, id: projectBriefToEdit.id! });
                            setProjectBriefToEdit(null);
                            setActiveAdminPage('project-briefs-list');
                        }}
                        onCancel={() => {
                            setProjectBriefToEdit(null);
                            setActiveAdminPage('project-briefs-list');
                        }}
                        userRole={currentUser?.role}
                        userId={currentUser?.id}
                        countries={Array.from(new Set(projects.map(p => p.country?.trim()).filter(Boolean))).map(c => c.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' '))}
                    />
                );
            
            case 'news-add':
                if (!canViewNews) return <AccessDenied />;
                return (
                    <NewsFormPage
                        onAddNews={onAddNews}
                        onBack={() => setActiveAdminPage('news-list')}
                        categories={newsCategories}
                        userRole={currentUser?.role}
                    />
                );
            case 'news-edit':
                if (!canViewNews) return <AccessDenied />;
                return (
                    <NewsFormPage
                        onAddNews={onAddNews}
                        onUpdateNews={onUpdateNews}
                        onBack={() => {
                            setNewsToEdit(null);
                            setActiveAdminPage('news-list');
                        }}
                        categories={newsCategories}
                        itemToEdit={newsToEdit}
                        userRole={currentUser?.role}
                    />
                );
            case 'news-list':
                if (!canViewNews) return <AccessDenied />;
                return (
                    <NewsUpdateList
                        news={news}
                        onAddNews={onAddNews}
                        onUpdateNews={onUpdateNews}
                        onDeleteNews={onDeleteNews}
                        categories={newsCategories}
                        onEditNews={handleEditNews}
                    />
                );
            case 'news-categories':
                if (!canManageCategories) return <AccessDenied />;
                return (
                    <NewsCategoryList 
                        news={news} 
                        // FIX: Corrected variable name from 'categories' to 'newsCategories' to resolve reference error.
                        categories={newsCategories}
                        onAddCategory={onAddNewsCategory}
                        onUpdateCategory={onUpdateNewsCategory}
                        onDeleteCategory={onDeleteNewsCategory}
                    />
                );
            case 'publications-add':
                if (!canViewPublications) return <AccessDenied />;
                return (
                    <PublicationFormPage
                        onAddPublication={onAddPublication}
                        onBack={() => setActiveAdminPage('publications-list')}
                        publicationTypes={publicationTypes}
                        onAddPublicationType={onAddPublicationType}
                        userRole={currentUser?.role}
                    />
                );
            case 'publications-edit':
                if (!canViewPublications) return <AccessDenied />;
                return (
                    <PublicationFormPage
                        onAddPublication={onAddPublication}
                        onUpdatePublication={onUpdatePublication}
                        onBack={() => {
                            setPublicationToEdit(null);
                            setActiveAdminPage('publications-list');
                        }}
                        publicationTypes={publicationTypes}
                        onAddPublicationType={onAddPublicationType}
                        itemToEdit={publicationToEdit}
                        userRole={currentUser?.role}
                    />
                );
            case 'publications-list':
                if (!canViewPublications) return <AccessDenied />;
                return (
                    <PublicationList
                        publications={publications}
                        onAddPublication={onAddPublication}
                        onUpdatePublication={onUpdatePublication}
                        onDeletePublications={onDeletePublications}
                        publicationTypes={publicationTypes}
                        onEditPublication={handleEditPublication}
                    />
                );
             case 'publications-types':
                if (!canManageCategories) return <AccessDenied />;
                return (
                    <PublicationTypeList
                        publications={publications}
                        publicationTypes={publicationTypes}
                        onAddType={onAddPublicationType}
                        onUpdateType={onUpdatePublicationType}
                        onDeleteType={onDeletePublicationType}
                    />
                );
            case 'videos-add':
                if (!canViewVideos) return <AccessDenied />;
                return (
                    <VideoFormPage
                        onAddVideo={onAddVideo}
                        onBack={() => setActiveAdminPage('videos-list')}
                        videoCategories={videoCategories}
                        onAddVideoCategory={onAddVideoCategory}
                        userRole={currentUser?.role}
                    />
                );
            case 'videos-edit':
                if (!canViewVideos) return <AccessDenied />;
                return (
                    <VideoFormPage
                        onAddVideo={onAddVideo}
                        onUpdateVideo={onUpdateVideo}
                        onBack={() => {
                            setVideoToEdit(null);
                            setActiveAdminPage('videos-list');
                        }}
                        videoCategories={videoCategories}
                        onAddVideoCategory={onAddVideoCategory}
                        itemToEdit={videoToEdit}
                        userRole={currentUser?.role}
                    />
                );
            case 'videos-list':
                if (!canViewVideos) return <AccessDenied />;
                return (
                    <VideoList
                        videos={videos}
                        onAddVideo={onAddVideo}
                        onUpdateVideo={onUpdateVideo}
                        onDeleteVideos={onDeleteVideos}
                        categories={videoCategories}
                        onEditVideo={handleEditVideo}
                    />
                );
            case 'videos-categories':
                if (!canManageCategories) return <AccessDenied />;
                return (
                    <VideoCategoryList
                        videos={videos}
                        categories={videoCategories}
                        onAddCategory={onAddVideoCategory}
                        onUpdateCategory={onUpdateVideoCategory}
                        onDeleteCategory={onDeleteVideoCategory}
                    />
                );
            default:
                return <div>Select a category</div>;
        }
    };

    return (
        <SidebarProvider>
            <AdminSidebar 
                activePage={activeAdminPage} 
                setActivePage={setActiveAdminPage}
                currentUser={currentUser}
            />
            <SidebarInset className="flex flex-col">
                <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="md:hidden" />
                        <Separator orientation="vertical" className="h-4 md:hidden" />
                    </div>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    {activeAdminPage.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="ml-auto">
                        <HamburgerMenu onNavigate={onNavigateToPublic} />
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    {renderContent()}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default AdminDashboard;