import { Project, Article } from '@/types/types';
import { adminClient, INDICES } from './client';

// Transform Project for Algolia indexing
export const transformProjectForAlgolia = (project: Project) => ({
  objectID: project.id.toString(),
  title: project.title,
  details: project.details,
  country: project.country,
  corruptionType: project.corruptionType,
  status: project.status,
  date: project.date,
  publishDate: project.publishDate,
  submittedBy: project.submittedBy,
  submittedAt: project.submittedAt,
  // For geographic search
  _geoloc: project.latitude && project.longitude ? {
    lat: project.latitude,
    lng: project.longitude,
  } : undefined,
  // Searchable fields
  _tags: [
    project.country,
    project.corruptionType,
    project.status,
  ].filter(Boolean),
});

// Transform Article (News/Publication/Video) for Algolia indexing
export const transformArticleForAlgolia = (article: Article, type: 'news' | 'publication' | 'video') => ({
  objectID: article.id,
  title: article.title,
  description: article.description,
  category: article.category,
  publishDate: article.publishDate,
  imageUrl: article.imageUrl,
  tagColor: article.tagColor,
  videoUrl: article.videoUrl,
  documentNames: article.documentNames,
  type, // Add type for filtering
  _tags: [article.category, type].filter(Boolean),
});

// Index a single project
export async function indexProject(project: Project) {
  const algoliaObject = transformProjectForAlgolia(project);
  await adminClient.saveObject({
    indexName: INDICES.PROJECTS,
    body: algoliaObject,
  });
}

// Index multiple projects
export async function indexProjects(projects: Project[]) {
  const algoliaObjects = projects.map(transformProjectForAlgolia);
  await adminClient.saveObjects({
    indexName: INDICES.PROJECTS,
    objects: algoliaObjects,
  });
}

// Index a single news article
export async function indexNews(news: Article) {
  const algoliaObject = transformArticleForAlgolia(news, 'news');
  await adminClient.saveObject({
    indexName: INDICES.NEWS,
    body: algoliaObject,
  });
}

// Index multiple news articles
export async function indexMultipleNews(newsArticles: Article[]) {
  const algoliaObjects = newsArticles.map(n => transformArticleForAlgolia(n, 'news'));
  await adminClient.saveObjects({
    indexName: INDICES.NEWS,
    objects: algoliaObjects,
  });
}

// Index a single publication
export async function indexPublication(publication: Article) {
  const algoliaObject = transformArticleForAlgolia(publication, 'publication');
  await adminClient.saveObject({
    indexName: INDICES.PUBLICATIONS,
    body: algoliaObject,
  });
}

// Index multiple publications
export async function indexPublications(publications: Article[]) {
  const algoliaObjects = publications.map(p => transformArticleForAlgolia(p, 'publication'));
  await adminClient.saveObjects({
    indexName: INDICES.PUBLICATIONS,
    objects: algoliaObjects,
  });
}

// Index a single video
export async function indexVideo(video: Article) {
  const algoliaObject = transformArticleForAlgolia(video, 'video');
  await adminClient.saveObject({
    indexName: INDICES.VIDEOS,
    body: algoliaObject,
  });
}

// Index multiple videos
export async function indexVideos(videos: Article[]) {
  const algoliaObjects = videos.map(v => transformArticleForAlgolia(v, 'video'));
  await adminClient.saveObjects({
    indexName: INDICES.VIDEOS,
    objects: algoliaObjects,
  });
}

// Delete from index
export async function deleteFromProjectsIndex(projectId: string) {
  await adminClient.deleteObject({
    indexName: INDICES.PROJECTS,
    objectID: projectId,
  });
}

export async function deleteFromNewsIndex(newsId: string) {
  await adminClient.deleteObject({
    indexName: INDICES.NEWS,
    objectID: newsId,
  });
}

export async function deleteFromPublicationsIndex(publicationId: string) {
  await adminClient.deleteObject({
    indexName: INDICES.PUBLICATIONS,
    objectID: publicationId,
  });
}

export async function deleteFromVideosIndex(videoId: string) {
  await adminClient.deleteObject({
    indexName: INDICES.VIDEOS,
    objectID: videoId,
  });
}

// Clear and reindex all data (useful for initial setup or full sync)
export async function reindexAllFromSupabase() {
  const { getProjects, getNews, getPublications, getVideos } = await import('@/lib/services/supabase-service');
  
  try {
    // Get all data from Supabase
    const [projects, news, publications, videos] = await Promise.all([
      getProjects(),
      getNews(),
      getPublications(),
      getVideos(),
    ]);

    // Clear existing indices
    await Promise.all([
      adminClient.clearObjects({ indexName: INDICES.PROJECTS }),
      adminClient.clearObjects({ indexName: INDICES.NEWS }),
      adminClient.clearObjects({ indexName: INDICES.PUBLICATIONS }),
      adminClient.clearObjects({ indexName: INDICES.VIDEOS }),
    ]);

    // Index all data
    await Promise.all([
      indexProjects(projects),
      indexMultipleNews(news),
      indexPublications(publications),
      indexVideos(videos),
    ]);

    console.log('✅ Successfully reindexed all data to Algolia');
    return {
      success: true,
      counts: {
        projects: projects.length,
        news: news.length,
        publications: publications.length,
        videos: videos.length,
      },
    };
  } catch (error) {
    console.error('❌ Error reindexing data:', error);
    throw error;
  }
}
