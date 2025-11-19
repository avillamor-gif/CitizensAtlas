-- ============================================
-- Supabase Storage Setup
-- ============================================
-- Run this SQL in your Supabase SQL Editor to create storage buckets and policies

-- ============================================
-- CREATE STORAGE BUCKETS
-- ============================================

-- Images bucket (for news, publications, videos thumbnails)
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Documents bucket (for publications PDFs, attachments)
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- User avatars bucket (for user profile pictures)
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-avatars', 'user-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STORAGE POLICIES FOR IMAGES BUCKET
-- ============================================

-- Allow public read access to images
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update their own images
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

-- ============================================
-- STORAGE POLICIES FOR DOCUMENTS BUCKET
-- ============================================

-- Allow public read access to documents
CREATE POLICY "Public can view documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents');

-- Allow authenticated users to upload documents
CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update documents
CREATE POLICY "Authenticated users can update documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'documents' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete documents
CREATE POLICY "Authenticated users can delete documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'documents' 
  AND auth.role() = 'authenticated'
);

-- ============================================
-- STORAGE POLICIES FOR USER AVATARS BUCKET
-- ============================================

-- Allow public read access to avatars
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'user-avatars');

-- Allow authenticated users to upload their own avatars
CREATE POLICY "Users can upload their own avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'user-avatars' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update their own avatars
CREATE POLICY "Users can update their own avatars"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'user-avatars' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete their own avatars
CREATE POLICY "Users can delete their own avatars"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'user-avatars' 
  AND auth.role() = 'authenticated'
);

-- ============================================
-- VERIFY SETUP
-- ============================================

-- Check buckets
SELECT * FROM storage.buckets;

-- Check policies
SELECT * FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects';
