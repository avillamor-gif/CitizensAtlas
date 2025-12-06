-- Add indexes to improve query performance
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_news_status ON news(status);
CREATE INDEX IF NOT EXISTS idx_publications_status ON publications(status);
CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);

-- Add composite indexes for ordering
CREATE INDEX IF NOT EXISTS idx_projects_status_id ON projects(status, id DESC);
CREATE INDEX IF NOT EXISTS idx_news_status_id ON news(status, id DESC);
CREATE INDEX IF NOT EXISTS idx_publications_status_id ON publications(status, id DESC);
CREATE INDEX IF NOT EXISTS idx_videos_status_id ON videos(status, id DESC);
