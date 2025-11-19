import { algoliasearch } from 'algoliasearch';

// Browser-side Algolia client (uses search-only API key)
export const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '',
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || ''
);

// Server-side Algolia client (uses admin API key for indexing)
export const adminClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '',
  process.env.ALGOLIA_ADMIN_KEY || ''
);

// Index names
export const INDICES = {
  PROJECTS: 'projects',
  NEWS: 'news',
  PUBLICATIONS: 'publications',
  VIDEOS: 'videos',
} as const;

// Note: In Algolia v5, you don't need to initialize indices separately
// The client methods take the index name directly
// Example usage: await searchClient.search({ requests: [{ indexName: INDICES.PROJECTS, query: 'test' }] })

// For backward compatibility, we can provide helper functions
export const getProjectsIndexName = () => INDICES.PROJECTS;
export const getNewsIndexName = () => INDICES.NEWS;
export const getPublicationsIndexName = () => INDICES.PUBLICATIONS;
export const getVideosIndexName = () => INDICES.VIDEOS;
