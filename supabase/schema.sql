-- ============================================
-- Atlas CMS Database Schema
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- or use the Supabase CLI: supabase db reset

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- DROP EXISTING TABLES (IF ANY)
-- ============================================
-- This ensures we start fresh with the correct schema
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS news CASCADE;
DROP TABLE IF EXISTS publications CASCADE;
DROP TABLE IF EXISTS videos CASCADE;
DROP TABLE IF EXISTS news_categories CASCADE;
DROP TABLE IF EXISTS publication_types CASCADE;
DROP TABLE IF EXISTS video_categories CASCADE;

-- ============================================
-- PROJECTS TABLE
-- ============================================
CREATE TABLE projects (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT,
  "publishDate" TEXT,
  country TEXT NOT NULL,
  "corruptionType" TEXT NOT NULL,
  details TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  "submittedBy" TEXT,
  "submittedAt" TIMESTAMPTZ DEFAULT NOW(),
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NEWS TABLE
-- ============================================
CREATE TABLE news (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  "imageUrl" TEXT,
  "tagColor" TEXT,
  tags TEXT[],
  "publishDate" TEXT,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  "submittedBy" TEXT,
  "submittedAt" TIMESTAMPTZ DEFAULT NOW(),
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PUBLICATIONS TABLE
-- ============================================
CREATE TABLE publications (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  "publicationCategory" TEXT,
  publisher TEXT,
  description TEXT,
  "imageUrl" TEXT,
  "tagColor" TEXT,
  tags TEXT[],
  "publishDate" TEXT,
  "documentNames" TEXT[],
  "downloadCount" INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  "submittedBy" TEXT,
  "submittedAt" TIMESTAMPTZ DEFAULT NOW(),
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VIDEOS TABLE
-- ============================================
CREATE TABLE videos (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  "imageUrl" TEXT,
  "tagColor" TEXT,
  tags TEXT[],
  "publishDate" TEXT,
  "videoUrl" TEXT,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  "submittedBy" TEXT,
  "submittedAt" TIMESTAMPTZ DEFAULT NOW(),
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NEWS CATEGORIES TABLE
-- ============================================
CREATE TABLE news_categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PUBLICATION TYPES TABLE
-- ============================================
CREATE TABLE publication_types (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PUBLICATION CATEGORIES TABLE
-- ============================================
CREATE TABLE publication_categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VIDEO CATEGORIES TABLE
-- ============================================
CREATE TABLE video_categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR BETTER PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_country ON projects(country);
CREATE INDEX IF NOT EXISTS idx_news_status ON news(status);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_publications_status ON publications(status);
CREATE INDEX IF NOT EXISTS idx_publications_category ON publications(category);
CREATE INDEX IF NOT EXISTS idx_publications_publication_category ON publications("publicationCategory");
CREATE INDEX IF NOT EXISTS idx_publications_slug ON publications(slug);
CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category);
CREATE INDEX IF NOT EXISTS idx_videos_slug ON videos(slug);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE publication_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE publication_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_categories ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can view published projects" ON projects
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view published news" ON news
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view published publications" ON publications
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view published videos" ON videos
  FOR SELECT USING (status = 'published');

-- Public read access for categories
CREATE POLICY "Public can view news categories" ON news_categories
  FOR SELECT USING (true);

CREATE POLICY "Public can view publication types" ON publication_types
  FOR SELECT USING (true);

CREATE POLICY "Public can view publication categories" ON publication_categories
  FOR SELECT USING (true);

CREATE POLICY "Public can view video categories" ON video_categories
  FOR SELECT USING (true);

-- Authenticated users can view all content (including drafts)
CREATE POLICY "Authenticated users can view all projects" ON projects
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view all news" ON news
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view all publications" ON publications
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view all videos" ON videos
  FOR SELECT USING (auth.role() = 'authenticated');

-- Authenticated users can insert content (will be draft by default for contributors)
CREATE POLICY "Authenticated users can insert projects" ON projects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert news" ON news
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert publications" ON publications
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert videos" ON videos
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can update their own submissions
CREATE POLICY "Users can update their own projects" ON projects
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own news" ON news
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own publications" ON publications
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own videos" ON videos
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Authenticated users can delete content
CREATE POLICY "Authenticated users can delete projects" ON projects
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete news" ON news
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete publications" ON publications
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete videos" ON videos
  FOR DELETE USING (auth.role() = 'authenticated');

-- Authenticated users can manage categories
CREATE POLICY "Authenticated users can manage news categories" ON news_categories
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage publication types" ON publication_types
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage publication categories" ON publication_categories
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage video categories" ON video_categories
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- TRIGGER TO UPDATE updatedAt TIMESTAMP
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_publications_updated_at BEFORE UPDATE ON publications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_categories_updated_at BEFORE UPDATE ON news_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_publication_types_updated_at BEFORE UPDATE ON publication_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_publication_categories_updated_at BEFORE UPDATE ON publication_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_video_categories_updated_at BEFORE UPDATE ON video_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RPC FUNCTIONS
-- ============================================
-- Function to increment download count atomically
CREATE OR REPLACE FUNCTION increment_download_count(publication_id BIGINT)
RETURNS void AS $$
BEGIN
  UPDATE publications
  SET "downloadCount" = COALESCE("downloadCount", 0) + 1
  WHERE id = publication_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
