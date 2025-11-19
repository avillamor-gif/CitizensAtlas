



// FIX: Moved Page type here from App.tsx to resolve a circular dependency issue.
export type Page = 'home' | 'about' | 'what-we-do' | 'map' | 'partner-with-us' | 'news' | 'videos' | 'publications' | 'admin';

export type UserRole = 'super-admin' | 'admin' | 'contributor';

export interface User {
    id: string;
    email: string;
    role: UserRole;
    name?: string;
    full_name?: string;
    avatar_url?: string;
}

export interface BankData {
  name: string;
  projects: number;
  investment: number;
  totalProjects: number;
  totalInvestment: number;
}

export interface PieData {
    name: string;
    value: number;
    // Fix: Add index signature for compatibility with recharts library
    [key: string]: any;
}

export interface Article {
    id: number;
    slug: string;
    category: string;
    title: string;
    description: string;
    imageUrl: string;
    tagColor: string;
    tags?: string[]; // Multiple tags
    publishDate?: string;
    documentNames?: string[];
    documentUrls?: string[];
    downloadCount?: number;
    videoUrl?: string;
    status?: 'draft' | 'published';
    submittedBy?: string;
    submittedAt?: string;
}

export interface Project {
    id: number;
    country: string;
    title: string;
    date: string;
    publishDate?: string;
    corruptionType: string;
    details: string;
    latitude: number;
    longitude: number;
    status?: 'draft' | 'published';
    submittedBy?: string;
    submittedAt?: string;
}

export interface Filters {
  country: string;
  solutionType: string;
  ifi: string;
  projectStatus: string;
}

export interface FilterOptions {
    countries: string[];
    solutionTypes: string[];
    ifis: string[];
    projectStatuses: string[];
}