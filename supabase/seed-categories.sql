-- ============================================
-- Seed Initial Categories
-- ============================================
-- Run this in your Supabase SQL Editor after running schema.sql

-- Add News Categories
INSERT INTO news_categories (name) VALUES 
  ('Policy Updates'),
  ('Research'),
  ('Events'),
  ('Press Releases')
ON CONFLICT (name) DO NOTHING;

-- Add Publication Types
INSERT INTO publication_types (name) VALUES 
  ('Report'),
  ('Policy Brief'),
  ('Case Study'),
  ('Research Paper')
ON CONFLICT (name) DO NOTHING;

-- Add Video Categories
INSERT INTO video_categories (name) VALUES 
  ('Interviews'),
  ('Webinars'),
  ('Tutorials'),
  ('Documentaries')
ON CONFLICT (name) DO NOTHING;
