-- Allow anyone (including anon users) to upload to images bucket
-- This is needed because the anon key is used for uploads in your app
CREATE POLICY "Allow anon uploads to images"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Allow anon uploads to documents"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'documents');

-- Allow anon to update (for overwriting files)
CREATE POLICY "Allow anon updates to images"
ON storage.objects FOR UPDATE
TO anon
USING (bucket_id = 'images');

CREATE POLICY "Allow anon updates to documents"
ON storage.objects FOR UPDATE
TO anon
USING (bucket_id = 'documents');

-- Allow anon to delete
CREATE POLICY "Allow anon deletes from images"
ON storage.objects FOR DELETE
TO anon
USING (bucket_id = 'images');

CREATE POLICY "Allow anon deletes from documents"
ON storage.objects FOR DELETE
TO anon
USING (bucket_id = 'documents');
