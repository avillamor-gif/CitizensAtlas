-- Add missing columns to news table
ALTER TABLE news 
ADD COLUMN IF NOT EXISTS "videoUrl" TEXT,
ADD COLUMN IF NOT EXISTS "downloadCount" INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS "documentNames" TEXT[],
ADD COLUMN IF NOT EXISTS "documentUrls" TEXT[],
ADD COLUMN IF NOT EXISTS "submittedBy" TEXT,
ADD COLUMN IF NOT EXISTS "submittedAt" TIMESTAMPTZ;

-- Add missing columns to projects table  
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS "submittedBy" TEXT,
ADD COLUMN IF NOT EXISTS "submittedAt" TIMESTAMPTZ;

-- Add missing columns to publications table
ALTER TABLE publications
ADD COLUMN IF NOT EXISTS "videoUrl" TEXT,
ADD COLUMN IF NOT EXISTS "downloadCount" INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS "documentNames" TEXT[],
ADD COLUMN IF NOT EXISTS "documentUrls" TEXT[],
ADD COLUMN IF NOT EXISTS "submittedBy" TEXT,
ADD COLUMN IF NOT EXISTS "submittedAt" TIMESTAMPTZ;

-- Add missing columns to videos table
ALTER TABLE videos
ADD COLUMN IF NOT EXISTS "downloadCount" INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS "documentNames" TEXT[],
ADD COLUMN IF NOT EXISTS "documentUrls" TEXT[],
ADD COLUMN IF NOT EXISTS "submittedBy" TEXT,
ADD COLUMN IF NOT EXISTS "submittedAt" TIMESTAMPTZ;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_news_status ON news(status);
CREATE INDEX IF NOT EXISTS idx_news_submitted_at ON news("submittedAt");
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_submitted_at ON projects("submittedAt");
CREATE INDEX IF NOT EXISTS idx_publications_status ON publications(status);
CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);
