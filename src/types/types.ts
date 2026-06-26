



// FIX: Moved Page type here from App.tsx to resolve a circular dependency issue.
export type Page = 'home' | 'about' | 'what-we-do' | 'map' | 'partner-with-us' | 'news' | 'videos' | 'publications' | 'resources' | 'admin' | 'active-fight-sites';

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
    publisher?: string;
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
    country?: string; // For project briefs
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

export interface ProjectBrief {
    id: number;
    project_name: string;
    project_type?: string;
    location: string;
    financing_amount?: string;
    financiers?: string;
    financial_instruments?: string;
    other_partners_involved?: string;
    timeline_and_status?: string;
    safeguard_categories?: string;
    negative_impacts?: string;
    reprisals?: string;
    advocacy_timeline?: string;
    other_information?: string;
    country?: string;
    status?: 'draft' | 'published';
    submitted_by?: string;
    submitted_at?: string;
    created_at?: string;
    updated_at?: string;
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