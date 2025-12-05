-- Make images bucket public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'images';

-- Make documents bucket public  
UPDATE storage.buckets 
SET public = true 
WHERE id = 'documents';

-- Create RLS policy to allow public read access to images
CREATE POLICY "Public Access to Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Create RLS policy to allow public read access to documents
CREATE POLICY "Public Access to Documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Allow authenticated users to upload documents
CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents');

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images');

CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'documents');
