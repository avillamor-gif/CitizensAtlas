import { 
  getProjects, 
  createProject as createProjectService,
  updateProject as updateProjectService,
  deleteProjects as deleteProjectsService,
  getNews,
  getPublications,
  getVideos,
  createNews as createNewsService,
  createPublication as createPublicationService,
  createVideo as createVideoService,
  updateNews as updateNewsService,
  updatePublication as updatePublicationService,
  updateVideo as updateVideoService,
  deleteNews as deleteNewsService,
  deletePublications as deletePublicationsService,
  deleteVideos as deleteVideosService,
  getNewsCategories,
  createNewsCategory as createNewsCategoryService,
  updateNewsCategory as updateNewsCategoryService,
  deleteNewsCategory as deleteNewsCategoryService,
  getPublicationTypes,
  createPublicationType as createPublicationTypeService,
  updatePublicationType as updatePublicationTypeService,
  deletePublicationType as deletePublicationTypeService,
  getVideoCategories,
  createVideoCategory as createVideoCategoryService,
  updateVideoCategory as updateVideoCategoryService,
  deleteVideoCategory as deleteVideoCategoryService
} from '@/lib/services/data-service';

import { Project, Article } from '@/types/types';

export const resolvers = {
  Query: {
    // Projects
    projects: async (_: any, args: { status?: string; limit?: number; offset?: number }) => {
      const allProjects = await getProjects();
      let filtered = allProjects;
      
      if (args.status) {
        filtered = filtered.filter(p => p.status === args.status!.toLowerCase());
      }
      
      if (args.offset) {
        filtered = filtered.slice(args.offset);
      }
      
      if (args.limit) {
        filtered = filtered.slice(0, args.limit);
      }
      
      return filtered;
    },
    
    project: async (_: any, args: { id: string }) => {
      const projects = await getProjects();
      return projects.find(p => p.id === parseInt(args.id));
    },
    
    projectsByCountry: async (_: any, args: { country: string }) => {
      const projects = await getProjects();
      return projects.filter(p => p.country === args.country);
    },
    
    // Articles
    news: async (_: any, args: { category?: string; limit?: number; offset?: number }) => {
      const allNews = await getNews();
      let filtered = allNews;
      
      if (args.category) {
        filtered = filtered.filter(n => n.category === args.category);
      }
      
      if (args.offset) {
        filtered = filtered.slice(args.offset);
      }
      
      if (args.limit) {
        filtered = filtered.slice(0, args.limit);
      }
      
      return filtered;
    },
    
    publications: async (_: any, args: { limit?: number; offset?: number }) => {
      const allPublications = await getPublications();
      let filtered = allPublications;
      
      if (args.offset) {
        filtered = filtered.slice(args.offset);
      }
      
      if (args.limit) {
        filtered = filtered.slice(0, args.limit);
      }
      
      return filtered;
    },
    
    videos: async (_: any, args: { category?: string; limit?: number; offset?: number }) => {
      const allVideos = await getVideos();
      let filtered = allVideos;
      
      if (args.category) {
        filtered = filtered.filter(v => v.category === args.category);
      }
      
      if (args.offset) {
        filtered = filtered.slice(args.offset);
      }
      
      if (args.limit) {
        filtered = filtered.slice(0, args.limit);
      }
      
      return filtered;
    },
    
    article: async (_: any, args: { id: string }) => {
      const [news, publications, videos] = await Promise.all([
        getNews(),
        getPublications(),
        getVideos()
      ]);
      
      const allArticles = [...news, ...publications, ...videos];
      return allArticles.find(a => a.id === parseInt(args.id));
    },
    
    articleBySlug: async (_: any, args: { slug: string }) => {
      const [news, publications, videos] = await Promise.all([
        getNews(),
        getPublications(),
        getVideos()
      ]);
      
      const allArticles = [...news, ...publications, ...videos];
      return allArticles.find(a => a.slug === args.slug);
    },
    
    // Categories
    newsCategories: async () => {
      const categories = await getNewsCategories();
      return categories.map((name, index) => ({ id: String(index + 1), name }));
    },
    
    publicationTypes: async () => {
      const types = await getPublicationTypes();
      return types.map((name, index) => ({ id: String(index + 1), name }));
    },
    
    videoCategories: async () => {
      const categories = await getVideoCategories();
      return categories.map((name, index) => ({ id: String(index + 1), name }));
    },
    
    // Search
    searchProjects: async (_: any, args: { query: string }) => {
      const projects = await getProjects();
      const query = args.query.toLowerCase();
      return projects.filter(p => 
        p.title?.toLowerCase().includes(query) ||
        p.country?.toLowerCase().includes(query) ||
        p.details?.toLowerCase().includes(query)
      );
    },
    
    searchArticles: async (_: any, args: { query: string }) => {
      const query = args.query.toLowerCase();
      const [news, publications, videos] = await Promise.all([
        getNews(),
        getPublications(),
        getVideos()
      ]);
      
      const allArticles = [...news, ...publications, ...videos];
      
      return allArticles.filter(a =>
        a.title?.toLowerCase().includes(query) ||
        a.description?.toLowerCase().includes(query)
      );
    }
  },
  
  Mutation: {
    // Projects
    createProject: async (_: any, args: { input: Omit<Project, 'id'> }) => {
      await createProjectService(args.input);
      const projects = await getProjects();
      return projects[projects.length - 1];
    },
    
    updateProject: async (_: any, args: { input: Project }) => {
      const { id, ...updates } = args.input;
      await updateProjectService(parseInt(String(id)), updates);
      const projects = await getProjects();
      return projects.find(p => p.id === parseInt(String(id)));
    },
    
    deleteProject: async (_: any, args: { id: string }) => {
      await deleteProjectsService([parseInt(args.id)]);
      return true;
    },
    
    deleteProjects: async (_: any, args: { ids: string[] }) => {
      await deleteProjectsService(args.ids.map(id => parseInt(id)));
      return true;
    },
    
    // Articles
    createArticle: async (_: any, args: { input: Omit<Article, 'id' | 'slug'> }) => {
      const input = { ...args.input, slug: '' };
      
      // Determine article type based on category or other fields
      if (input.videoUrl) {
        await createVideoService(input);
      } else if (input.documentNames && input.documentNames.length > 0) {
        await createPublicationService(input);
      } else {
        await createNewsService(input);
      }
      
      const [news, publications, videos] = await Promise.all([
        getNews(),
        getPublications(),
        getVideos()
      ]);
      
      const allArticles = [...news, ...publications, ...videos];
      return allArticles[allArticles.length - 1];
    },
    
    updateArticle: async (_: any, args: { input: Omit<Article, 'slug'> }) => {
      const { id, ...updates } = args.input;
      const articleId = parseInt(String(id));
      
      // Try to update in all types - only one will succeed
      try {
        await updateNewsService(articleId, updates);
      } catch {
        try {
          await updatePublicationService(articleId, updates);
        } catch {
          await updateVideoService(articleId, updates);
        }
      }
      
      const [news, publications, videos] = await Promise.all([
        getNews(),
        getPublications(),
        getVideos()
      ]);
      
      const allArticles = [...news, ...publications, ...videos];
      return allArticles.find(a => a.id === articleId);
    },
    
    deleteArticle: async (_: any, args: { id: string }) => {
      const articleId = parseInt(args.id);
      
      // Try to delete from all types
      try {
        await deleteNewsService([articleId]);
      } catch {
        try {
          await deletePublicationsService([articleId]);
        } catch {
          await deleteVideosService([articleId]);
        }
      }
      
      return true;
    },
    
    deleteArticles: async (_: any, args: { ids: string[] }) => {
      const ids = args.ids.map(id => parseInt(id));
      
      // Try to delete from all types
      await Promise.allSettled([
        deleteNewsService(ids),
        deletePublicationsService(ids),
        deleteVideosService(ids)
      ]);
      
      return true;
    },
    
    // Categories
    createCategory: async (_: any, args: { name: string; type: string }) => {
      if (args.type === 'news') {
        await createNewsCategoryService(args.name);
      } else if (args.type === 'publication') {
        await createPublicationTypeService(args.name);
      } else if (args.type === 'video') {
        await createVideoCategoryService(args.name);
      }
      
      return { id: '1', name: args.name };
    },
    
    updateCategory: async (_: any, args: { oldName: string; newName: string; type: string }) => {
      if (args.type === 'news') {
        await updateNewsCategoryService(args.oldName, args.newName);
      } else if (args.type === 'publication') {
        await updatePublicationTypeService(args.oldName, args.newName);
      } else if (args.type === 'video') {
        await updateVideoCategoryService(args.oldName, args.newName);
      }
      
      return { id: '1', name: args.newName };
    },
    
    deleteCategory: async (_: any, args: { name: string; type: string }) => {
      if (args.type === 'news') {
        await deleteNewsCategoryService(args.name);
      } else if (args.type === 'publication') {
        await deletePublicationTypeService(args.name);
      } else if (args.type === 'video') {
        await deleteVideoCategoryService(args.name);
      }
      
      return true;
    }
  }
};
