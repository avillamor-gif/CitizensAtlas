-- Create project-briefs storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-briefs', 'project-briefs', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to view files
CREATE POLICY "Public can view project-briefs"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'project-briefs');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload project-briefs"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'project-briefs');

-- Allow authenticated users to delete their files
CREATE POLICY "Authenticated users can delete project-briefs"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'project-briefs');
